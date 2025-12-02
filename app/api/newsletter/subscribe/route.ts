/**
 * Newsletter Subscription API Endpoint
 * Stores leads in Supabase for marketing automation
 */

import { NextRequest, NextResponse } from 'next/server';
import { leadsService, isSupabaseConfigured } from '@/lib/supabase';

// Types
interface SubscribeRequest {
  email: string;
  firstName?: string;
  source?: string;
  timestamp?: string;
}

interface SubscribeResponse {
  success: boolean;
  message: string;
  subscriber?: {
    email: string;
    subscribedAt: string;
  };
}

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest): Promise<NextResponse<SubscribeResponse>> {
  try {
    const body: SubscribeRequest = await request.json();
    const { email, firstName, source } = body;

    // Validate email
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Store in Supabase
    const result = await leadsService.subscribe(normalizedEmail, firstName, source || 'website');

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error || 'Subscription failed' },
        { status: 500 }
      );
    }

    // Send Discord notification if configured
    if (process.env.DISCORD_WEBHOOK_URL) {
      try {
        await fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            embeds: [{
              title: '📧 New Newsletter Subscriber!',
              color: 0x00ff88,
              fields: [
                { name: 'Email', value: normalizedEmail, inline: true },
                { name: 'Name', value: firstName || 'Not provided', inline: true },
                { name: 'Source', value: source || 'website', inline: true }
              ],
              timestamp: new Date().toISOString()
            }]
          }),
        });
      } catch (webhookError) {
        console.warn('Discord webhook failed:', webhookError);
      }
    }

    console.log(`✅ New subscriber: ${normalizedEmail} from ${source || 'website'} | Supabase: ${isSupabaseConfigured() ? 'yes' : 'no'}`);

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed! Welcome to Legacy Guardians 🎉',
      subscriber: {
        email: normalizedEmail,
        subscribedAt: result.data?.subscribed_at || new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// GET endpoint to check subscription status or get stats
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const stats = searchParams.get('stats');

  // Return stats if requested (for admin dashboard)
  if (stats === 'true') {
    const leadStats = await leadsService.getStats();
    return NextResponse.json({
      success: true,
      stats: leadStats,
      supabaseConfigured: isSupabaseConfigured()
    });
  }

  // Check specific email subscription status
  if (email) {
    const leads = await leadsService.getAll({ limit: 1 });
    const isSubscribed = leads.some(l => l.email === email.toLowerCase() && l.status === 'subscribed');
    
    return NextResponse.json({
      success: true,
      isSubscribed,
      message: isSubscribed ? 'Email is subscribed' : 'Email is not subscribed'
    });
  }

  // Return general API info
  const stats_data = await leadsService.getStats();
  return NextResponse.json({
    success: true,
    totalSubscribers: stats_data.total,
    activeSubscribers: stats_data.subscribed,
    message: 'Newsletter API is running',
    supabaseConfigured: isSupabaseConfigured()
  });
}

// Unsubscribe endpoint
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    const result = await leadsService.unsubscribe(email);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error || 'Unsubscribe failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed'
    });

  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}
