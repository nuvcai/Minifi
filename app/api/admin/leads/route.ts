/**
 * Admin API - Lead Management
 * Protected endpoint for viewing and managing leads
 * 
 * Note: In production, add proper authentication (e.g., NextAuth, Clerk)
 */

import { NextRequest, NextResponse } from 'next/server';
import { leadsService, feedbackService, isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase';

// Simple admin key check (replace with proper auth in production)
const ADMIN_KEY = process.env.ADMIN_API_KEY || 'dev-admin-key';

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const apiKey = request.headers.get('x-api-key');
  
  // Check Bearer token or API key
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7) === ADMIN_KEY;
  }
  return apiKey === ADMIN_KEY;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  // Check authorization
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const view = searchParams.get('view') || 'summary';
  const limit = parseInt(searchParams.get('limit') || '100');
  const source = searchParams.get('source');
  const status = searchParams.get('status');

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      success: true,
      message: 'Supabase not configured - showing demo data',
      data: {
        leads: [],
        feedback: [],
        stats: {
          leads: { total: 0, subscribed: 0, bySource: {} },
          feedback: { total: 0, byType: {}, avgRating: 0 }
        }
      }
    });
  }

  try {
    // Summary view
    if (view === 'summary') {
      const [leadStats, feedbackStats] = await Promise.all([
        leadsService.getStats(),
        feedbackService.getStats()
      ]);

      // Get recent activity
      const [recentLeads, recentFeedback] = await Promise.all([
        leadsService.getAll({ limit: 5 }),
        feedbackService.getAll({ limit: 5 })
      ]);

      // Get waitlist stats
      const { data: waitlistData } = await supabaseAdmin
        .from('waitlist')
        .select('feature');
      
      const waitlistStats: Record<string, number> = {};
      waitlistData?.forEach(w => {
        waitlistStats[w.feature] = (waitlistStats[w.feature] || 0) + 1;
      });

      return NextResponse.json({
        success: true,
        stats: {
          leads: leadStats,
          feedback: feedbackStats,
          waitlist: {
            total: waitlistData?.length || 0,
            byFeature: waitlistStats
          }
        },
        recent: {
          leads: recentLeads.map(l => ({
            email: l.email,
            source: l.source,
            date: l.created_at
          })),
          feedback: recentFeedback.map(f => ({
            type: f.type,
            preview: f.message.substring(0, 100),
            rating: f.rating,
            date: f.created_at
          }))
        }
      });
    }

    // Full leads view
    if (view === 'leads') {
      const leads = await leadsService.getAll({ 
        limit, 
        source: source || undefined,
        status: status || undefined
      });

      return NextResponse.json({
        success: true,
        count: leads.length,
        leads
      });
    }

    // Full feedback view
    if (view === 'feedback') {
      const type = searchParams.get('type');
      const feedback = await feedbackService.getAll({
        limit,
        type: type || undefined,
        status: status || undefined
      });

      return NextResponse.json({
        success: true,
        count: feedback.length,
        feedback
      });
    }

    // Waitlist view
    if (view === 'waitlist') {
      const feature = searchParams.get('feature');
      
      let query = supabaseAdmin
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(limit);

      if (feature) {
        query = query.eq('feature', feature);
      }

      const { data, error } = await query;

      if (error) throw error;

      return NextResponse.json({
        success: true,
        count: data?.length || 0,
        waitlist: data
      });
    }

    // Export view (CSV-friendly)
    if (view === 'export') {
      const leads = await leadsService.getAll({ limit: 10000 });
      
      return NextResponse.json({
        success: true,
        format: 'csv-ready',
        headers: ['email', 'first_name', 'source', 'status', 'subscribed_at', 'created_at'],
        data: leads.map(l => [
          l.email,
          l.first_name || '',
          l.source,
          l.status,
          l.subscribed_at,
          l.created_at
        ])
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid view parameter'
    }, { status: 400 });

  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}

// POST - Bulk operations
export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      success: false,
      message: 'Supabase not configured'
    }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { action, data } = body;

    // Bulk import leads
    if (action === 'import-leads') {
      const { leads } = data;
      
      if (!Array.isArray(leads)) {
        return NextResponse.json({
          success: false,
          message: 'leads must be an array'
        }, { status: 400 });
      }

      const results = await Promise.all(
        leads.map(lead => 
          leadsService.subscribe(lead.email, lead.firstName, lead.source || 'import')
        )
      );

      const successful = results.filter(r => r.success).length;
      
      return NextResponse.json({
        success: true,
        message: `Imported ${successful}/${leads.length} leads`
      });
    }

    // Bulk update feedback status
    if (action === 'update-feedback-status') {
      const { ids, status } = data;
      
      if (!Array.isArray(ids) || !status) {
        return NextResponse.json({
          success: false,
          message: 'ids array and status required'
        }, { status: 400 });
      }

      const results = await Promise.all(
        ids.map(id => feedbackService.updateStatus(id, status))
      );

      const successful = results.filter(r => r.success).length;
      
      return NextResponse.json({
        success: true,
        message: `Updated ${successful}/${ids.length} feedback items`
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Unknown action'
    }, { status: 400 });

  } catch (error) {
    console.error('Admin POST error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}

