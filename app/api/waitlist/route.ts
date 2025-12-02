/**
 * Feature Waitlist API Endpoint
 * Allows users to join waitlists for upcoming premium features
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

// Types
interface WaitlistRequest {
  email: string;
  feature: string;
}

interface WaitlistResponse {
  success: boolean;
  message: string;
  position?: number;
}

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Valid features for waitlist
const validFeatures = [
  'risk-quiz',
  'portfolio-builder',
  'risk-roulette',
  'fo-certification',
  'ai-mentor',
  'premium-missions',
  'discord-community',
  'mobile-app'
];

export async function POST(request: NextRequest): Promise<NextResponse<WaitlistResponse>> {
  try {
    const body: WaitlistRequest = await request.json();
    const { email, feature } = body;

    // Validate email
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate feature
    if (!feature || !validFeatures.includes(feature)) {
      return NextResponse.json(
        { success: false, message: `Invalid feature. Valid options: ${validFeatures.join(', ')}` },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!isSupabaseConfigured()) {
      // Return success for demo purposes
      return NextResponse.json({
        success: true,
        message: `You've joined the waitlist for ${feature}!`,
        position: Math.floor(Math.random() * 100) + 1
      });
    }

    // Check if already on waitlist
    const { data: existing } = await supabaseAdmin
      .from('waitlist')
      .select('id')
      .eq('email', normalizedEmail)
      .eq('feature', feature)
      .single();

    if (existing) {
      // Get their position
      const { count } = await supabaseAdmin
        .from('waitlist')
        .select('*', { count: 'exact', head: true })
        .eq('feature', feature)
        .lt('created_at', new Date().toISOString());

      return NextResponse.json({
        success: true,
        message: `You're already on the waitlist for ${feature}!`,
        position: count || 1
      });
    }

    // Add to waitlist
    const { error } = await supabaseAdmin
      .from('waitlist')
      .insert({
        email: normalizedEmail,
        feature,
        priority: 0,
        notified: false
      });

    if (error) {
      console.error('Waitlist insert error:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to join waitlist' },
        { status: 500 }
      );
    }

    // Get position
    const { count } = await supabaseAdmin
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .eq('feature', feature);

    // Also add to leads if not exists
    await supabaseAdmin
      .from('leads')
      .upsert({
        email: normalizedEmail,
        source: `waitlist-${feature}`,
        status: 'subscribed',
        subscribed_at: new Date().toISOString()
      }, { onConflict: 'email' });

    // Discord notification
    if (process.env.DISCORD_WEBHOOK_URL) {
      try {
        await fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            embeds: [{
              title: '🎯 New Waitlist Signup!',
              color: 0x9b59b6,
              fields: [
                { name: 'Email', value: normalizedEmail, inline: true },
                { name: 'Feature', value: feature, inline: true },
                { name: 'Position', value: `#${count || 1}`, inline: true }
              ],
              timestamp: new Date().toISOString()
            }]
          }),
        });
      } catch (webhookError) {
        console.warn('Discord webhook failed:', webhookError);
      }
    }

    console.log(`🎯 New waitlist signup: ${normalizedEmail} for ${feature}`);

    return NextResponse.json({
      success: true,
      message: `You're #${count || 1} on the waitlist for ${feature}! We'll notify you when it's ready.`,
      position: count || 1
    });

  } catch (error) {
    console.error('Waitlist error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// GET endpoint to check waitlist status
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const feature = searchParams.get('feature');
  const email = searchParams.get('email');

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      success: true,
      features: validFeatures,
      message: 'Waitlist API is running (Supabase not configured)'
    });
  }

  // Get waitlist stats for all features
  if (!feature && !email) {
    const stats: Record<string, number> = {};
    
    for (const f of validFeatures) {
      const { count } = await supabaseAdmin
        .from('waitlist')
        .select('*', { count: 'exact', head: true })
        .eq('feature', f);
      stats[f] = count || 0;
    }

    return NextResponse.json({
      success: true,
      features: validFeatures,
      stats
    });
  }

  // Check specific email/feature combination
  if (email && feature) {
    const { data } = await supabaseAdmin
      .from('waitlist')
      .select('id, created_at')
      .eq('email', email.toLowerCase())
      .eq('feature', feature)
      .single();

    if (data) {
      const { count } = await supabaseAdmin
        .from('waitlist')
        .select('*', { count: 'exact', head: true })
        .eq('feature', feature)
        .lte('created_at', data.created_at);

      return NextResponse.json({
        success: true,
        onWaitlist: true,
        position: count || 1,
        feature
      });
    }

    return NextResponse.json({
      success: true,
      onWaitlist: false,
      feature
    });
  }

  // Get waitlist for specific feature
  if (feature) {
    const { count } = await supabaseAdmin
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .eq('feature', feature);

    return NextResponse.json({
      success: true,
      feature,
      count: count || 0
    });
  }

  return NextResponse.json({
    success: true,
    features: validFeatures
  });
}

