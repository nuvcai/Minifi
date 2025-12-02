/**
 * Supabase Client Configuration
 * Handles database connections for lead capture and user data
 */

import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Public client for client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations (API routes)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && (supabaseAnonKey || supabaseServiceKey));
};

// Types for our database tables
export interface Lead {
  id?: string;
  email: string;
  first_name?: string;
  source: string;
  status: 'subscribed' | 'unsubscribed' | 'bounced';
  subscribed_at: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export interface Feedback {
  id?: string;
  type: 'love' | 'idea' | 'issue' | 'general';
  message: string;
  rating?: number;
  page_context?: string;
  user_agent?: string;
  email?: string;
  status: 'new' | 'reviewed' | 'actioned' | 'archived';
  created_at?: string;
}

export interface UserActivity {
  id?: string;
  session_id: string;
  event_type: string;
  event_data?: Record<string, unknown>;
  page_path?: string;
  user_agent?: string;
  created_at?: string;
}

// Lead management functions
export const leadsService = {
  /**
   * Add a new newsletter subscriber
   */
  async subscribe(email: string, firstName?: string, source: string = 'website'): Promise<{ success: boolean; error?: string; data?: Lead }> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, skipping database write');
      return { success: true, data: { email, source, status: 'subscribed', subscribed_at: new Date().toISOString() } };
    }

    try {
      // Check for existing subscriber
      const { data: existing } = await supabaseAdmin
        .from('leads')
        .select('id, email, status')
        .eq('email', email.toLowerCase())
        .single();

      if (existing) {
        // Resubscribe if previously unsubscribed
        if (existing.status === 'unsubscribed') {
          const { data, error } = await supabaseAdmin
            .from('leads')
            .update({ status: 'subscribed', updated_at: new Date().toISOString() })
            .eq('id', existing.id)
            .select()
            .single();
          
          if (error) throw error;
          return { success: true, data };
        }
        return { success: true, data: existing as Lead };
      }

      // Create new subscriber
      const { data, error } = await supabaseAdmin
        .from('leads')
        .insert({
          email: email.toLowerCase(),
          first_name: firstName?.trim() || null,
          source,
          status: 'subscribed',
          subscribed_at: new Date().toISOString(),
          metadata: {}
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };

    } catch (error) {
      console.error('Lead subscription error:', error);
      return { success: false, error: 'Failed to subscribe' };
    }
  },

  /**
   * Unsubscribe a lead
   */
  async unsubscribe(email: string): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    try {
      const { error } = await supabaseAdmin
        .from('leads')
        .update({ status: 'unsubscribed', updated_at: new Date().toISOString() })
        .eq('email', email.toLowerCase());

      if (error) throw error;
      return { success: true };

    } catch (error) {
      console.error('Lead unsubscribe error:', error);
      return { success: false, error: 'Failed to unsubscribe' };
    }
  },

  /**
   * Get all leads (for admin)
   */
  async getAll(filters?: { status?: string; source?: string; limit?: number }): Promise<Lead[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      let query = supabaseAdmin
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.source) {
        query = query.eq('source', filters.source);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];

    } catch (error) {
      console.error('Get leads error:', error);
      return [];
    }
  },

  /**
   * Get lead stats
   */
  async getStats(): Promise<{ total: number; subscribed: number; bySource: Record<string, number> }> {
    if (!isSupabaseConfigured()) {
      return { total: 0, subscribed: 0, bySource: {} };
    }

    try {
      const { data, error } = await supabaseAdmin
        .from('leads')
        .select('status, source');

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        subscribed: data?.filter(l => l.status === 'subscribed').length || 0,
        bySource: {} as Record<string, number>
      };

      data?.forEach(lead => {
        stats.bySource[lead.source] = (stats.bySource[lead.source] || 0) + 1;
      });

      return stats;

    } catch (error) {
      console.error('Get stats error:', error);
      return { total: 0, subscribed: 0, bySource: {} };
    }
  }
};

// Feedback management functions
export const feedbackService = {
  /**
   * Submit new feedback
   */
  async submit(feedback: Omit<Feedback, 'id' | 'created_at' | 'status'>): Promise<{ success: boolean; error?: string; id?: string }> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, skipping database write');
      return { success: true, id: `local_${Date.now()}` };
    }

    try {
      const { data, error } = await supabaseAdmin
        .from('feedback')
        .insert({
          ...feedback,
          status: 'new',
          created_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (error) throw error;
      return { success: true, id: data?.id };

    } catch (error) {
      console.error('Feedback submission error:', error);
      return { success: false, error: 'Failed to submit feedback' };
    }
  },

  /**
   * Get all feedback (for admin)
   */
  async getAll(filters?: { type?: string; status?: string; limit?: number }): Promise<Feedback[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      let query = supabaseAdmin
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];

    } catch (error) {
      console.error('Get feedback error:', error);
      return [];
    }
  },

  /**
   * Update feedback status
   */
  async updateStatus(id: string, status: Feedback['status']): Promise<{ success: boolean }> {
    if (!isSupabaseConfigured()) return { success: true };

    try {
      const { error } = await supabaseAdmin
        .from('feedback')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      return { success: true };

    } catch (error) {
      console.error('Update feedback error:', error);
      return { success: false };
    }
  },

  /**
   * Get feedback stats
   */
  async getStats(): Promise<{ total: number; byType: Record<string, number>; avgRating: number }> {
    if (!isSupabaseConfigured()) {
      return { total: 0, byType: {}, avgRating: 0 };
    }

    try {
      const { data, error } = await supabaseAdmin
        .from('feedback')
        .select('type, rating');

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        byType: {} as Record<string, number>,
        avgRating: 0
      };

      let ratingSum = 0;
      let ratingCount = 0;

      data?.forEach(fb => {
        stats.byType[fb.type] = (stats.byType[fb.type] || 0) + 1;
        if (fb.rating) {
          ratingSum += fb.rating;
          ratingCount++;
        }
      });

      stats.avgRating = ratingCount > 0 ? ratingSum / ratingCount : 0;

      return stats;

    } catch (error) {
      console.error('Get feedback stats error:', error);
      return { total: 0, byType: {}, avgRating: 0 };
    }
  }
};

// Activity tracking (for analytics)
export const activityService = {
  /**
   * Track user activity/events
   */
  async track(event: Omit<UserActivity, 'id' | 'created_at'>): Promise<void> {
    if (!isSupabaseConfigured()) return;

    try {
      await supabaseAdmin
        .from('user_activity')
        .insert({
          ...event,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Activity tracking error:', error);
    }
  }
};

export default supabase;

