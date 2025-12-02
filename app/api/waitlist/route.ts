/**
 * Feature Waitlist API Endpoint
 * Allows users to join waitlists for upcoming premium features
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { waitlistSchema, validate, VALID_FEATURES } from '@/lib/validation';
import { serverLogger } from '@/lib/logger';

// Types
interface WaitlistResponse {
  success: boolean;
  message: string;
  position?: number;
}

export async function POST(request: NextRequest): Promise<NextResponse<WaitlistResponse>> {
  const log = serverLogger.withRequest(request.headers.get('x-request-id') || undefined);
  
  try {
    const body = await request.json();

    // Validate input using centralized schema
    const validation = validate(waitlistSchema, body);
    if (!validation.success) {
      log.warn('Waitlist validation failed', { errors: validation.errors });
      return NextResponse.json(
        { success: false, message: validation.errors[0] || 'Invalid input' },
        { status: 400 }
      );
    }

    const { email: normalizedEmail, feature } = validation.data;

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
      log.error('Waitlist insert error', error);
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

    // WhatsApp notification to admin
    try {
      const { whatsappNotify } = await import('@/lib/marketing-stack');
      await whatsappNotify.send(
        whatsappNotify.templates.newWaitlist(normalizedEmail, feature)
      );
    } catch (notifyError) {
      log.warn('WhatsApp notification failed', { error: notifyError });
    }

    log.info('New waitlist signup', { email: normalizedEmail, feature });

    return NextResponse.json({
      success: true,
      message: `You're #${count || 1} on the waitlist for ${feature}! We'll notify you when it's ready.`,
      position: count || 1
    });

  } catch (error) {
    log.error('Waitlist error', error);
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
      features: VALID_FEATURES,
      message: 'Waitlist API is running (Supabase not configured)'
    });
  }

  // Get waitlist stats for all features
  if (!feature && !email) {
    const stats: Record<string, number> = {};
    
    for (const f of VALID_FEATURES) {
      const { count } = await supabaseAdmin
        .from('waitlist')
        .select('*', { count: 'exact', head: true })
        .eq('feature', f);
      stats[f] = count || 0;
    }

    return NextResponse.json({
      success: true,
      features: VALID_FEATURES,
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
    features: VALID_FEATURES
  });
}

