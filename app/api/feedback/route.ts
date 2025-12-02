/**
 * Feedback Collection API Endpoint
 * Stores user feedback in Supabase for product improvement
 */

import { NextRequest, NextResponse } from 'next/server';
import { feedbackService, isSupabaseConfigured } from '@/lib/supabase';

// Types
interface FeedbackRequest {
  type: 'love' | 'idea' | 'issue' | 'general';
  message: string;
  rating?: number;
  pageContext?: string;
  timestamp?: string;
  userAgent?: string;
  email?: string;
}

interface FeedbackResponse {
  success: boolean;
  message: string;
  feedbackId?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<FeedbackResponse>> {
  try {
    const body: FeedbackRequest = await request.json();
    const { type, message, rating, pageContext, userAgent, email } = body;

    // Validate required fields
    if (!type || !message?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Type and message are required' },
        { status: 400 }
      );
    }

    // Validate type
    const validTypes = ['love', 'idea', 'issue', 'general'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid feedback type' },
        { status: 400 }
      );
    }

    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { success: false, message: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Store in Supabase
    const result = await feedbackService.submit({
      type,
      message: message.trim(),
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

    // Send Discord notification if configured
    if (process.env.DISCORD_FEEDBACK_WEBHOOK || process.env.DISCORD_WEBHOOK_URL) {
      const webhookUrl = process.env.DISCORD_FEEDBACK_WEBHOOK || process.env.DISCORD_WEBHOOK_URL;
      const typeEmojis: Record<string, string> = {
        love: '💖',
        idea: '💡',
        issue: '🐛',
        general: '💬'
      };
      const typeColors: Record<string, number> = {
        love: 0xff69b4,
        idea: 0xffa500,
        issue: 0xff4444,
        general: 0x00bfff
      };

      try {
        await fetch(webhookUrl!, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            embeds: [{
              title: `${typeEmojis[type]} New ${type.charAt(0).toUpperCase() + type.slice(1)} Feedback`,
              description: message.length > 500 ? message.substring(0, 500) + '...' : message,
              color: typeColors[type],
              fields: [
                { name: 'Rating', value: rating ? '⭐'.repeat(rating) : 'N/A', inline: true },
                { name: 'Page', value: pageContext || 'Unknown', inline: true },
                { name: 'ID', value: result.id || 'N/A', inline: true }
              ],
              timestamp: new Date().toISOString(),
              footer: { text: 'Legacy Guardians Feedback' }
            }]
          }),
        });
      } catch (webhookError) {
        console.warn('Discord webhook failed:', webhookError);
      }
    }

    console.log(`📝 New feedback [${type}]: ${message.substring(0, 50)}... | Supabase: ${isSupabaseConfigured() ? 'yes' : 'no'}`);

    return NextResponse.json({
      success: true,
      message: 'Thank you for your feedback! 🙏',
      feedbackId: result.id
    });

  } catch (error) {
    console.error('Feedback submission error:', error);
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
    console.error('Feedback update error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}
