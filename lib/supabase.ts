/**
 * Supabase Client Configuration
 * Handles database connections for lead capture and user data
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

// Environment variables for Supabase connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Check if Supabase is configured (must check BEFORE creating clients)
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && (supabaseAnonKey || supabaseServiceKey));
};

// Create clients only if Supabase is configured, otherwise create dummy placeholder
// This prevents errors during build time when env vars aren't set
const createSupabaseClient = (url: string, key: string): SupabaseClient => {
  if (url && key) {
    return createClient(url, key);
  }
  // Return a placeholder that won't throw during build
  // Actual operations will check isSupabaseConfigured() first
  return createClient('https://placeholder.supabase.co', 'placeholder-key');
};

// Public client for client-side operations
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations (API routes)
export const supabaseAdmin = createSupabaseClient(supabaseUrl, supabaseServiceKey);

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
      logger.debug('Supabase not configured, skipping database write');
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
      logger.error('Lead subscription error', error);
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
      logger.error('Lead unsubscribe error', error);
      return { success: false, error: 'Failed to unsubscribe' };
    }
  },

  /**
   * Get all leads (for admin)
   */
  async getAll(filters?: { status?: string; source?: string; email?: string; limit?: number }): Promise<Lead[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      let query = supabaseAdmin
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.email) {
        query = query.eq('email', filters.email.toLowerCase());
      }
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
      logger.error('Get leads error', error);
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
      logger.error('Get stats error', error);
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
      logger.debug('Supabase not configured, skipping database write');
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
      logger.error('Feedback submission error', error);
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
      logger.error('Get feedback error', error);
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
      logger.error('Update feedback error', error);
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
      logger.error('Get feedback stats error', error);
      return { total: 0, byType: {}, avgRating: 0 };
    }
  }
};

// =============================================================================
// USER PROFILES SERVICE - Onboarding data storage
// =============================================================================

export interface UserProfile {
  id?: string;
  email?: string;
  display_name?: string;
  session_id?: string;
  age_range?: '12-14' | '15-16' | '17-18' | '19-24' | '25+';
  country?: string;
  has_part_time_job?: boolean;
  has_savings_goal?: boolean;
  family_discusses_finances?: boolean;
  risk_personality?: 'guardian' | 'builder' | 'explorer' | 'pioneer';
  risk_score?: number;
  risk_answers?: number[];
  learning_style?: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  preferred_session_length?: 'short' | 'medium' | 'long';
  selected_coach?: string;
  terms_accepted?: boolean;
  terms_accepted_at?: string;
  marketing_consent?: boolean;
  marketing_consent_at?: string;
  total_xp?: number;
  player_level?: number;
  completed_missions?: string[];
  daily_streak?: number;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referral_code?: string;
  onboarding_completed_at?: string;
  last_active_at?: string;
  created_at?: string;
  updated_at?: string;
}

export const userProfilesService = {
  /**
   * Create or update a user profile from onboarding data
   */
  async saveOnboarding(profile: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; error?: string; data?: UserProfile }> {
    if (!isSupabaseConfigured()) {
      logger.debug('Supabase not configured, skipping profile save');
      return { success: true, data: profile as UserProfile };
    }

    try {
      // Convert camelCase to snake_case for database
      const dbProfile: Record<string, unknown> = {
        email: profile.email?.toLowerCase(),
        display_name: profile.display_name,
        session_id: profile.session_id,
        age_range: profile.age_range,
        country: profile.country,
        has_part_time_job: profile.has_part_time_job,
        has_savings_goal: profile.has_savings_goal,
        family_discusses_finances: profile.family_discusses_finances,
        risk_personality: profile.risk_personality,
        risk_score: profile.risk_score,
        risk_answers: profile.risk_answers,
        learning_style: profile.learning_style,
        preferred_session_length: profile.preferred_session_length,
        selected_coach: profile.selected_coach,
        terms_accepted: profile.terms_accepted,
        terms_accepted_at: profile.terms_accepted ? new Date().toISOString() : null,
        marketing_consent: profile.marketing_consent,
        marketing_consent_at: profile.marketing_consent ? new Date().toISOString() : null,
        // Game progress fields
        total_xp: profile.total_xp ?? 0,
        player_level: profile.player_level ?? 1,
        daily_streak: profile.daily_streak ?? 0,
        completed_missions: profile.completed_missions ?? [],
        // Attribution and metadata
        source: profile.source,
        utm_source: profile.utm_source,
        utm_medium: profile.utm_medium,
        utm_campaign: profile.utm_campaign,
        referral_code: profile.referral_code,
        onboarding_completed_at: new Date().toISOString(),
        last_active_at: new Date().toISOString()
      };
      
      // Remove undefined values to avoid database errors
      Object.keys(dbProfile).forEach(key => {
        if (dbProfile[key] === undefined) {
          delete dbProfile[key];
        }
      });

      // If email provided, upsert by email
      if (profile.email) {
        const { data, error } = await supabaseAdmin
          .from('user_profiles')
          .upsert(dbProfile, { onConflict: 'email' })
          .select()
          .single();

        if (error) throw error;
        return { success: true, data };
      }

      // Otherwise insert new profile (anonymous)
      const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .insert(dbProfile)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };

    } catch (error) {
      logger.error('Save onboarding profile error', error);
      return { success: false, error: 'Failed to save profile' };
    }
  },

  /**
   * Get profile by email
   */
  async getByEmail(email: string): Promise<UserProfile | null> {
    if (!isSupabaseConfigured()) return null;

    try {
      const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }
      return data;

    } catch (error) {
      logger.error('Get profile by email error', error);
      return null;
    }
  },

  /**
   * Get profile by session ID (for anonymous users)
   */
  async getBySession(sessionId: string): Promise<UserProfile | null> {
    if (!isSupabaseConfigured()) return null;

    try {
      const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      return data;

    } catch (error) {
      logger.error('Get profile by session error', error);
      return null;
    }
  },

  /**
   * Update game progress
   */
  async updateProgress(identifier: { email?: string; sessionId?: string }, progress: {
    total_xp?: number;
    player_level?: number;
    completed_missions?: string[];
    daily_streak?: number;
  }): Promise<{ success: boolean }> {
    if (!isSupabaseConfigured()) return { success: true };

    try {
      let query = supabaseAdmin.from('user_profiles').update({
        ...progress,
        last_active_at: new Date().toISOString()
      });

      if (identifier.email) {
        query = query.eq('email', identifier.email.toLowerCase());
      } else if (identifier.sessionId) {
        query = query.eq('session_id', identifier.sessionId);
      } else {
        return { success: false };
      }

      const { error } = await query;
      if (error) throw error;
      return { success: true };

    } catch (error) {
      logger.error('Update progress error', error);
      return { success: false };
    }
  },

  /**
   * Get onboarding stats (for admin)
   */
  async getStats(): Promise<{
    total: number;
    byAgeRange: Record<string, number>;
    byRiskPersonality: Record<string, number>;
    byCoach: Record<string, number>;
    marketingConsent: number;
  }> {
    if (!isSupabaseConfigured()) {
      return { total: 0, byAgeRange: {}, byRiskPersonality: {}, byCoach: {}, marketingConsent: 0 };
    }

    try {
      const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .select('age_range, risk_personality, selected_coach, marketing_consent');

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        byAgeRange: {} as Record<string, number>,
        byRiskPersonality: {} as Record<string, number>,
        byCoach: {} as Record<string, number>,
        marketingConsent: 0
      };

      data?.forEach(profile => {
        if (profile.age_range) {
          stats.byAgeRange[profile.age_range] = (stats.byAgeRange[profile.age_range] || 0) + 1;
        }
        if (profile.risk_personality) {
          stats.byRiskPersonality[profile.risk_personality] = (stats.byRiskPersonality[profile.risk_personality] || 0) + 1;
        }
        if (profile.selected_coach) {
          stats.byCoach[profile.selected_coach] = (stats.byCoach[profile.selected_coach] || 0) + 1;
        }
        if (profile.marketing_consent) {
          stats.marketingConsent++;
        }
      });

      return stats;

    } catch (error) {
      logger.error('Get profile stats error', error);
      return { total: 0, byAgeRange: {}, byRiskPersonality: {}, byCoach: {}, marketingConsent: 0 };
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
      logger.error('Activity tracking error', error);
    }
  }
};

// =============================================================================
// REWARDS SERVICE - Dual Rewards (Badges + III Tokens)
// =============================================================================

export interface PlayerRewards {
  id?: string;
  user_id?: string;
  email?: string;
  session_id?: string;
  adventure_name?: string;
  total_iii: number;
  weekly_iii: number;
  staked_iii: number;
  lifetime_iii: number;
  total_badges_earned: number;
  investments_made: number;
  high_risk_investments: number;
  extreme_risk_investments: number;
  losses_experienced: number;
  investments_after_loss: number;
  consecutive_losses: number;
  profit_after_consecutive_losses: number;
  crises_navigated: number;
  bubbles_survived: number;
  drawdowns_held: number;
  reflections_completed: number;
  rational_decisions: number;
  missions_completed: number;
  perfect_quizzes: number;
  theses_written: number;
  risk_previews_viewed: number;
  coach_advice_viewed: number;
  asset_classes_tried: string[];
  risk_levels_tried: string[];
  coaches_used: string[];
  week_start_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EarnedBadge {
  id?: string;
  user_id?: string;
  email?: string;
  session_id?: string;
  badge_id: string;
  badge_name: string;
  badge_emoji?: string;
  badge_category: string;
  badge_tier: string;
  iii_awarded: number;
  wisdom_unlocked?: string;
  fo_wisdom?: string;
  earned_at?: string;
}

export interface IIITransaction {
  id?: string;
  user_id?: string;
  email?: string;
  session_id?: string;
  transaction_type: string;
  amount: number;
  balance_after: number;
  reference_type?: string;
  reference_id?: string;
  description?: string;
  created_at?: string;
}

export const rewardsService = {
  /**
   * Get or create player rewards record
   */
  async getOrCreateRewards(sessionId: string, email?: string): Promise<PlayerRewards | null> {
    if (!isSupabaseConfigured()) {
      return {
        total_iii: 0,
        weekly_iii: 0,
        staked_iii: 0,
        lifetime_iii: 0,
        total_badges_earned: 0,
        investments_made: 0,
        high_risk_investments: 0,
        extreme_risk_investments: 0,
        losses_experienced: 0,
        investments_after_loss: 0,
        consecutive_losses: 0,
        profit_after_consecutive_losses: 0,
        crises_navigated: 0,
        bubbles_survived: 0,
        drawdowns_held: 0,
        reflections_completed: 0,
        rational_decisions: 0,
        missions_completed: 0,
        perfect_quizzes: 0,
        theses_written: 0,
        risk_previews_viewed: 0,
        coach_advice_viewed: 0,
        asset_classes_tried: [],
        risk_levels_tried: [],
        coaches_used: [],
      };
    }

    try {
      // Try to find existing
      const { data: existing, error: findError } = await supabaseAdmin
        .from('player_rewards')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (existing) return existing;

      // Create new
      const { data: newRecord, error: createError } = await supabaseAdmin
        .from('player_rewards')
        .insert({
          session_id: sessionId,
          email: email || null,
          total_iii: 0,
          weekly_iii: 0,
          staked_iii: 0,
          lifetime_iii: 0,
          total_badges_earned: 0,
        })
        .select()
        .single();

      if (createError) throw createError;
      return newRecord;

    } catch (error) {
      logger.error('Get or create rewards error', error);
      return null;
    }
  },

  /**
   * Award a badge and III tokens
   */
  async awardBadge(badge: {
    sessionId: string;
    email?: string;
    badgeId: string;
    badgeName: string;
    badgeEmoji?: string;
    badgeCategory: string;
    badgeTier: string;
    iiiReward: number;
    wisdomUnlocked?: string;
    foWisdom?: string;
  }): Promise<{ success: boolean; alreadyEarned?: boolean; newBalance?: number }> {
    if (!isSupabaseConfigured()) {
      return { success: true, newBalance: 0 };
    }

    try {
      // Check if already earned
      const { data: existing } = await supabaseAdmin
        .from('earned_badges')
        .select('id')
        .eq('session_id', badge.sessionId)
        .eq('badge_id', badge.badgeId)
        .single();

      if (existing) {
        return { success: false, alreadyEarned: true };
      }

      // Award badge
      await supabaseAdmin.from('earned_badges').insert({
        session_id: badge.sessionId,
        email: badge.email,
        badge_id: badge.badgeId,
        badge_name: badge.badgeName,
        badge_emoji: badge.badgeEmoji,
        badge_category: badge.badgeCategory,
        badge_tier: badge.badgeTier,
        iii_awarded: badge.iiiReward,
        wisdom_unlocked: badge.wisdomUnlocked,
        fo_wisdom: badge.foWisdom,
      });

      // Update III balance
      const rewards = await this.getOrCreateRewards(badge.sessionId, badge.email);
      if (!rewards) return { success: false };

      const newTotal = (rewards.total_iii || 0) + badge.iiiReward;

      await supabaseAdmin
        .from('player_rewards')
        .update({
          total_iii: newTotal,
          weekly_iii: (rewards.weekly_iii || 0) + badge.iiiReward,
          lifetime_iii: (rewards.lifetime_iii || 0) + badge.iiiReward,
          total_badges_earned: (rewards.total_badges_earned || 0) + 1,
        })
        .eq('session_id', badge.sessionId);

      // Log transaction
      await supabaseAdmin.from('iii_transactions').insert({
        session_id: badge.sessionId,
        email: badge.email,
        transaction_type: 'badge_earned',
        amount: badge.iiiReward,
        balance_after: newTotal,
        reference_type: 'badge',
        reference_id: badge.badgeId,
        description: `Earned "${badge.badgeName}" badge`,
      });

      return { success: true, newBalance: newTotal };

    } catch (error) {
      logger.error('Award badge error', error);
      return { success: false };
    }
  },

  /**
   * Add III tokens
   */
  async addIII(params: {
    sessionId: string;
    email?: string;
    amount: number;
    transactionType: string;
    description?: string;
    referenceType?: string;
    referenceId?: string;
  }): Promise<{ success: boolean; newBalance?: number }> {
    if (!isSupabaseConfigured()) {
      return { success: true, newBalance: params.amount };
    }

    try {
      const rewards = await this.getOrCreateRewards(params.sessionId, params.email);
      if (!rewards) return { success: false };

      const newTotal = Math.max(0, (rewards.total_iii || 0) + params.amount);

      await supabaseAdmin
        .from('player_rewards')
        .update({
          total_iii: newTotal,
          weekly_iii: params.amount > 0 
            ? (rewards.weekly_iii || 0) + params.amount 
            : rewards.weekly_iii,
          lifetime_iii: params.amount > 0 
            ? (rewards.lifetime_iii || 0) + params.amount 
            : rewards.lifetime_iii,
        })
        .eq('session_id', params.sessionId);

      await supabaseAdmin.from('iii_transactions').insert({
        session_id: params.sessionId,
        email: params.email,
        transaction_type: params.transactionType,
        amount: params.amount,
        balance_after: newTotal,
        reference_type: params.referenceType,
        reference_id: params.referenceId,
        description: params.description,
      });

      return { success: true, newBalance: newTotal };

    } catch (error) {
      logger.error('Add III error', error);
      return { success: false };
    }
  },

  /**
   * Get earned badges for a player
   */
  async getEarnedBadges(sessionId: string): Promise<EarnedBadge[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabaseAdmin
        .from('earned_badges')
        .select('*')
        .eq('session_id', sessionId)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      return data || [];

    } catch (error) {
      logger.error('Get earned badges error', error);
      return [];
    }
  },

  /**
   * Get recent III transactions
   */
  async getTransactions(sessionId: string, limit: number = 20): Promise<IIITransaction[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabaseAdmin
        .from('iii_transactions')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];

    } catch (error) {
      logger.error('Get transactions error', error);
      return [];
    }
  },

  /**
   * Sync rewards from localStorage to database
   */
  async syncFromLocalStorage(sessionId: string, data: {
    email?: string;
    adventureName?: string;
    totalIII: number;
    weeklyIII: number;
    stakedIII: number;
    earnedBadgeIds: string[];
    progress: Partial<PlayerRewards>;
  }): Promise<{ success: boolean }> {
    if (!isSupabaseConfigured()) return { success: true };

    try {
      const rewards = await this.getOrCreateRewards(sessionId, data.email);
      if (!rewards) return { success: false };

      const updateData: Partial<PlayerRewards> = {
        total_iii: data.totalIII,
        weekly_iii: data.weeklyIII,
        staked_iii: data.stakedIII,
        lifetime_iii: Math.max(rewards.lifetime_iii || 0, data.totalIII),
        total_badges_earned: data.earnedBadgeIds.length,
        ...data.progress,
      };

      if (data.email) updateData.email = data.email;
      if (data.adventureName) updateData.adventure_name = data.adventureName;

      await supabaseAdmin
        .from('player_rewards')
        .update(updateData)
        .eq('session_id', sessionId);

      return { success: true };

    } catch (error) {
      logger.error('Sync rewards error', error);
      return { success: false };
    }
  },

  /**
   * Get leaderboard by III tokens
   */
  async getLeaderboard(limit: number = 50): Promise<Array<{
    adventure_name: string;
    total_iii: number;
    weekly_iii: number;
    total_badges_earned: number;
    rank: number;
  }>> {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabaseAdmin
        .from('player_rewards')
        .select('adventure_name, total_iii, weekly_iii, total_badges_earned')
        .not('adventure_name', 'is', null)
        .order('total_iii', { ascending: false })
        .limit(limit);

      if (error) throw error;
      
      return (data || []).map((row, index) => ({
        ...row,
        rank: index + 1,
      }));

    } catch (error) {
      logger.error('Get leaderboard error', error);
      return [];
    }
  }
};

export default supabase;

