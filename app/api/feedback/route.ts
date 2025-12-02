/**
 * Feedback Collection API Endpoint
 * Stores user feedback in Supabase for product improvement
 */

import { NextRequest, NextResponse } from 'next/server';
import { feedbackService, isSupabaseConfigured } from '@/lib/supabase';
import { feedbackSchema, validate, sanitizeText } from '@/lib/validation';
import { serverLogger } from '@/lib/logger';

// Types
interface FeedbackResponse {
  success: boolean;
  message: string;
  feedbackId?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<FeedbackResponse>> {
  const log = serverLogger.withRequest(request.headers.get('x-request-id') || undefined);
  
  try {
    const body = await request.json();
    
    // Validate input using centralized schema
    const validation = validate(feedbackSchema, body);
    if (!validation.success) {
      log.warn('Feedback validation failed', { errors: validation.errors });
      return NextResponse.json(
        { success: false, message: validation.errors[0] || 'Invalid input' },
        { status: 400 }
      );
    }

    const { type, message, rating, pageContext, email } = validation.data;
    const userAgent = body.userAgent ? sanitizeText(body.userAgent, 500) : undefined;

    // Store in Supabase
    const result = await feedbackService.submit({
      type,
      message: message, // Already sanitized by schema
      rating,
      page_context: pageContext || 'unknown',
      user_agent: userAgent,
      email
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error || 'Submission failed' },
        { status: 500 }
      );
    }

    // Send WhatsApp notification to admin
    try {
      const { whatsappNotify } = await import('@/lib/marketing-stack');
      await whatsappNotify.send(
        whatsappNotify.templates.newFeedback(type, message, rating)
      );
    } catch (notifyError) {
      log.warn('WhatsApp notification failed', { error: notifyError });
    }

    log.info('New feedback received', { 
      type, 
      messagePreview: message.substring(0, 50), 
      supabaseConfigured: isSupabaseConfigured() 
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for your feedback! 🙏',
      feedbackId: result.id
    });

  } catch (error) {
    log.error('Feedback submission error', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve feedback stats (for admin)
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const limit = parseInt(searchParams.get('limit') || '10');
  const stats = searchParams.get('stats');

  // Return stats if requested
  if (stats === 'true') {
    const feedbackStats = await feedbackService.getStats();
    return NextResponse.json({
      success: true,
      stats: feedbackStats,
      supabaseConfigured: isSupabaseConfigured()
    });
  }

  // Get recent feedback
  const feedback = await feedbackService.getAll({
    type: type || undefined,
    limit
  });

  const feedbackStats = await feedbackService.getStats();

  return NextResponse.json({
    success: true,
    stats: feedbackStats,
    recent: feedback,
    supabaseConfigured: isSupabaseConfigured()
  });
}

// PATCH endpoint to update feedback status (admin)
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: 'ID and status are required' },
        { status: 400 }
      );
    }

    const validStatuses = ['new', 'reviewed', 'actioned', 'archived'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status' },
        { status: 400 }
      );
    }

    const result = await feedbackService.updateStatus(id, status);

    return NextResponse.json({
      success: result.success,
      message: result.success ? 'Status updated' : 'Update failed'
    });

  } catch (error) {
    serverLogger.error('Feedback update error', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}
