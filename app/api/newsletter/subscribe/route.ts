/**
 * Newsletter Subscription API Endpoint
 * Stores leads in Supabase for marketing automation
 * Syncs with Loops.so for automated email sequences
 * Integrates with marketing data collection
 */

import { NextRequest, NextResponse } from 'next/server';
import { leadsService, isSupabaseConfigured } from '@/lib/supabase';
import { subscribeSchema, validate } from '@/lib/validation';
import { serverLogger } from '@/lib/logger';
import { loopsHelpers } from '@/lib/loops';
import { MARKETING_EVENTS } from '@/components/data/marketingData';

// Types
interface SubscribeResponse {
  success: boolean;
  message: string;
  subscriber?: {
    email: string;
    subscribedAt: string;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse<SubscribeResponse>> {
  const log = serverLogger.withRequest(request.headers.get('x-request-id') || undefined);
  
  try {
    const body = await request.json();
    
    // Validate input using centralized schema
    const validation = validate(subscribeSchema, body);
    if (!validation.success) {
      log.warn('Newsletter subscription validation failed', { errors: validation.errors });
      return NextResponse.json(
        { success: false, message: validation.errors[0] || 'Invalid input' },
        { status: 400 }
      );
    }

    const { email: normalizedEmail, firstName, source } = validation.data;

    // Store in Supabase
    const result = await leadsService.subscribe(normalizedEmail, firstName, source || 'website');

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error || 'Subscription failed' },
        { status: 500 }
      );
    }

    // Sync with Loops.so for email automation
    try {
      await loopsHelpers.subscribe(normalizedEmail, {
        firstName,
        source: source || 'website'
      });
      log.info('Synced to Loops.so', { email: normalizedEmail });
    } catch (loopsError) {
      // Don't fail the subscription if Loops sync fails
      log.warn('Loops.so sync failed', { error: loopsError });
    }

    // Track marketing event
    log.info('Marketing event', { 
      event: MARKETING_EVENTS.SIGNUP_COMPLETED,
      email: normalizedEmail,
      source: source || 'website'
    });

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
        log.warn('Discord webhook failed', { error: webhookError });
      }
    }

    log.info('New subscriber', { 
      email: normalizedEmail, 
      source: source || 'website', 
      supabaseConfigured: isSupabaseConfigured() 
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed! Welcome to Legacy Guardians 🎉',
      subscriber: {
        email: normalizedEmail,
        subscribedAt: result.data?.subscribed_at || new Date().toISOString()
      }
    });

  } catch (error) {
    log.error('Newsletter subscription error', error);
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
    // Query leads filtered by the specific email address
    const leads = await leadsService.getAll({ email: email.toLowerCase() });
    const isSubscribed = leads.some(l => l.status === 'subscribed');
    
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
