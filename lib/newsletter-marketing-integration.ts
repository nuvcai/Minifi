/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   📧 NEWSLETTER ↔ MARKETING DATA INTEGRATION                                ║
 * ║   Connects automated newsletters with user data collection                   ║
 * ║   ✨ MiniFi / Legacy Guardians ✨                                           ║
 * ║   Copyright (c) 2025 NUVC.AI / Tick.AI. All Rights Reserved.                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { loops, loopsHelpers, LOOPS_EVENTS } from './loops';
import { MARKETING_EVENTS } from '@/components/data/marketingData';
import type { SignupData, UserSegment, Attribution } from '@/components/data/marketingData';
import { 
  viralMoments, 
  referralRewards,
  getReferralRewardForCount 
} from '@/components/data/marketingMessages';

// =============================================================================
// NEWSLETTER SUBSCRIBER DATA (Extended from SignupData)
// =============================================================================

export interface NewsletterSubscriber {
  // Core identity (from SignupData)
  email: string;
  firstName?: string;
  displayName?: string;
  
  // Age group (important for content customization)
  ageRange: "12-14" | "15-16" | "17-18";
  country: string;
  
  // Marketing consent status
  marketingConsent: boolean;
  consentTimestamp: Date;
  
  // Segmentation data
  userSegment: UserSegmentType;
  
  // Engagement metrics (for personalization)
  totalXp: number;
  playerLevel: number;
  missionsCompleted: number;
  currentStreak: number;
  favoriteCoach?: string;
  preferredAssetClasses: string[];
  
  // Attribution (for campaign tracking)
  source: string;
  medium?: string;
  campaign?: string;
  referralCode?: string;
  referredBy?: string;
  
  // Behavioral flags
  isAppUser: boolean;
  lastActiveAt?: Date;
  daysSinceActive: number;
  
  // Referral stats
  referralCount: number;
  referralTier?: number;
}

export type UserSegmentType = 
  | "new_user"           // 0-7 days
  | "active_learner"     // 7+ days, active last week
  | "power_user"         // 5+ sessions/week
  | "at_risk"            // No activity 7-14 days
  | "churned"            // No activity 30+ days
  | "referral_champion"  // 3+ referrals
  | "achievement_hunter" // High achievement rate
  | "coach_loyalist";    // Same coach for 10+ missions

// =============================================================================
// MARKETING DATA → NEWSLETTER SYNC
// =============================================================================

/**
 * Convert SignupData to Newsletter subscriber format
 */
export function signupToNewsletterSubscriber(
  signup: Partial<SignupData>,
  gameProgress?: {
    totalXp?: number;
    playerLevel?: number;
    missionsCompleted?: number;
    currentStreak?: number;
    favoriteCoach?: string;
    preferredAssetClasses?: string[];
  }
): Partial<NewsletterSubscriber> {
  return {
    email: signup.email,
    displayName: signup.displayName,
    ageRange: signup.ageRange,
    country: signup.country || 'AU',
    marketingConsent: signup.marketingConsent || false,
    consentTimestamp: new Date(),
    source: signup.signupSource || 'direct',
    medium: signup.signupMedium,
    campaign: signup.signupCampaign,
    referralCode: signup.referralCode,
    isAppUser: true,
    totalXp: gameProgress?.totalXp || 0,
    playerLevel: gameProgress?.playerLevel || 1,
    missionsCompleted: gameProgress?.missionsCompleted || 0,
    currentStreak: gameProgress?.currentStreak || 0,
    favoriteCoach: gameProgress?.favoriteCoach,
    preferredAssetClasses: gameProgress?.preferredAssetClasses || [],
    referralCount: 0,
    daysSinceActive: 0,
    userSegment: 'new_user'
  };
}

/**
 * Calculate user segment based on behavior
 */
export function calculateUserSegment(subscriber: Partial<NewsletterSubscriber>): UserSegmentType {
  const { daysSinceActive, missionsCompleted, currentStreak, referralCount } = subscriber;
  
  // Check for churn risk first
  if (daysSinceActive && daysSinceActive >= 30) return 'churned';
  if (daysSinceActive && daysSinceActive >= 7) return 'at_risk';
  
  // Check for positive segments
  if (referralCount && referralCount >= 3) return 'referral_champion';
  if (currentStreak && currentStreak >= 7) return 'power_user';
  if (missionsCompleted && missionsCompleted >= 10) return 'achievement_hunter';
  
  // Default based on recency
  if (daysSinceActive && daysSinceActive <= 7) return 'active_learner';
  
  return 'new_user';
}

// =============================================================================
// LOOPS.SO CONTACT SYNC
// =============================================================================

/**
 * Sync a user to Loops.so with full marketing data
 */
export async function syncUserToNewsletter(
  subscriber: NewsletterSubscriber
): Promise<{ success: boolean; error?: string }> {
  // Only sync if marketing consent given
  if (!subscriber.marketingConsent) {
    return { success: false, error: 'No marketing consent' };
  }

  try {
    const result = await loops.createContact({
      email: subscriber.email,
      firstName: subscriber.firstName || subscriber.displayName,
      userGroup: subscriber.userSegment,
      subscribed: true,
      
      // Custom properties for segmentation
      ageRange: subscriber.ageRange,
      country: subscriber.country,
      appUser: subscriber.isAppUser,
      
      // Game progress
      totalXp: subscriber.totalXp,
      playerLevel: subscriber.playerLevel,
      missionsCompleted: subscriber.missionsCompleted,
      currentStreak: subscriber.currentStreak,
      favoriteCoach: subscriber.favoriteCoach || 'none',
      
      // Attribution
      source: subscriber.source,
      medium: subscriber.medium || '',
      campaign: subscriber.campaign || '',
      referralCode: subscriber.referralCode || '',
      referredBy: subscriber.referredBy || '',
      
      // Engagement
      daysSinceActive: subscriber.daysSinceActive,
      lastActiveAt: subscriber.lastActiveAt?.toISOString() || '',
      
      // Referral stats
      referralCount: subscriber.referralCount,
      referralTier: subscriber.referralTier || 0,
    });

    return { success: result.success, error: result.error };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// =============================================================================
// EVENT-TRIGGERED NEWSLETTERS
// =============================================================================

/**
 * Marketing Event → Newsletter Event Mapping
 */
export const MARKETING_TO_NEWSLETTER_EVENTS: Record<string, string> = {
  [MARKETING_EVENTS.SIGNUP_COMPLETED]: LOOPS_EVENTS.APP_SIGNUP,
  [MARKETING_EVENTS.ONBOARDING_COMPLETED]: LOOPS_EVENTS.APP_SIGNUP,
  [MARKETING_EVENTS.MISSION_COMPLETED]: LOOPS_EVENTS.MISSION_COMPLETED,
  [MARKETING_EVENTS.ACHIEVEMENT_EARNED]: LOOPS_EVENTS.ACHIEVEMENT_EARNED,
  [MARKETING_EVENTS.LEVEL_UP]: LOOPS_EVENTS.LEVEL_UP,
  [MARKETING_EVENTS.REFERRAL_LINK_SHARED]: LOOPS_EVENTS.REFERRAL_SENT,
  [MARKETING_EVENTS.REFERRAL_CONVERTED]: LOOPS_EVENTS.REFERRAL_CONVERTED,
  [MARKETING_EVENTS.PREMIUM_VIEWED]: LOOPS_EVENTS.PREMIUM_VIEWED,
};

/**
 * Trigger newsletter event based on marketing event
 */
export async function triggerNewsletterFromMarketingEvent(
  email: string,
  marketingEvent: string,
  properties?: Record<string, string | number>
): Promise<{ success: boolean }> {
  const loopsEvent = MARKETING_TO_NEWSLETTER_EVENTS[marketingEvent];
  
  if (!loopsEvent) {
    console.log(`No newsletter mapping for event: ${marketingEvent}`);
    return { success: false };
  }

  return loops.sendEvent({
    email,
    eventName: loopsEvent,
    eventProperties: properties
  });
}

// =============================================================================
// SEGMENTED NEWSLETTER HELPERS
// =============================================================================

export interface NewsletterContent {
  subject: string;
  preheader: string;
  
  // Personalization tokens
  firstName?: string;
  level?: number;
  xp?: number;
  streak?: number;
  coach?: string;
  
  // Content sections
  mainContent: string;
  wisdomSection?: {
    pillar: string;
    emoji: string;
    title: string;
    content: string;
  };
  investorQuote?: {
    investor: string;
    quote: string;
    lesson: string;
  };
  tip?: string;
  
  // CTAs
  primaryCta: {
    text: string;
    url: string;
  };
  secondaryCta?: {
    text: string;
    url: string;
  };
}

/**
 * Generate personalized newsletter content based on user segment
 */
export function generatePersonalizedContent(
  subscriber: NewsletterSubscriber,
  baseContent: Partial<NewsletterContent>
): NewsletterContent {
  const segment = subscriber.userSegment;
  
  // Personalization by segment
  const segmentContent: Record<UserSegmentType, { subject: string; cta: string; ctaUrl: string }> = {
    new_user: {
      subject: `🌟 ${subscriber.firstName || 'Hey'}, your investing journey begins!`,
      cta: "Start Your First Mission",
      ctaUrl: "https://minifi.app/timeline"
    },
    active_learner: {
      subject: `📈 Keep the momentum, ${subscriber.firstName}! New mission awaits`,
      cta: "Continue Learning",
      ctaUrl: "https://minifi.app/timeline"
    },
    power_user: {
      subject: `🔥 ${subscriber.currentStreak}-day streak! You're on fire, ${subscriber.firstName}`,
      cta: "Maintain Your Streak",
      ctaUrl: "https://minifi.app/timeline"
    },
    at_risk: {
      subject: `👋 We miss you, ${subscriber.firstName}! Your portfolio awaits`,
      cta: "Come Back & Play",
      ctaUrl: "https://minifi.app/timeline"
    },
    churned: {
      subject: `🎁 ${subscriber.firstName}, here's a bonus 🪙 iii offer just for you`,
      cta: "Claim Your Bonus",
      ctaUrl: "https://minifi.app/timeline?bonus=comeback"
    },
    referral_champion: {
      subject: `🏆 ${subscriber.firstName}, you're a wealth-sharing legend!`,
      cta: "Check Your Referral Rewards",
      ctaUrl: "https://minifi.app/profile?tab=referrals"
    },
    achievement_hunter: {
      subject: `🎯 New achievement unlocked, ${subscriber.firstName}!`,
      cta: "See Your Achievements",
      ctaUrl: "https://minifi.app/profile?tab=achievements"
    },
    coach_loyalist: {
      subject: `💬 ${subscriber.favoriteCoach} has new wisdom for you!`,
      cta: "Get Coach Advice",
      ctaUrl: "https://minifi.app/timeline"
    }
  };

  const segmentSpecific = segmentContent[segment];

  return {
    subject: baseContent.subject || segmentSpecific.subject,
    preheader: baseContent.preheader || `Level ${subscriber.playerLevel} • ${subscriber.totalXp} XP`,
    firstName: subscriber.firstName,
    level: subscriber.playerLevel,
    xp: subscriber.totalXp,
    streak: subscriber.currentStreak,
    coach: subscriber.favoriteCoach,
    mainContent: baseContent.mainContent || '',
    wisdomSection: baseContent.wisdomSection,
    investorQuote: baseContent.investorQuote,
    tip: baseContent.tip,
    primaryCta: {
      text: segmentSpecific.cta,
      url: segmentSpecific.ctaUrl
    },
    secondaryCta: baseContent.secondaryCta
  };
}

// =============================================================================
// REFERRAL MILESTONE EMAILS
// =============================================================================

/**
 * Send referral milestone email when user reaches new tier
 */
export async function sendReferralMilestoneEmail(
  email: string,
  referralCount: number
): Promise<{ success: boolean }> {
  const reward = getReferralRewardForCount(referralCount);
  
  if (!reward) return { success: false };

  // Check if this is a new tier (exactly matches threshold)
  const isNewTier = referralRewards.some(r => r.referralsRequired === referralCount);
  
  if (!isNewTier) return { success: false };

  return loops.sendEvent({
    email,
    eventName: LOOPS_EVENTS.REFERRAL_CONVERTED,
    eventProperties: {
      referralCount,
      tier: reward.tier,
      rewardName: reward.reward,
      xpBonus: reward.xpBonus,
      badge: reward.badge
    }
  });
}

// =============================================================================
// VIRAL MOMENT → EMAIL TRIGGERS
// =============================================================================

/**
 * Map viral moments to email triggers
 */
export async function triggerEmailFromViralMoment(
  email: string,
  viralTrigger: string,
  data: Record<string, string | number>
): Promise<{ success: boolean }> {
  const moment = viralMoments.find(vm => vm.trigger === viralTrigger);
  
  if (!moment) return { success: false };

  // Map viral triggers to Loops events
  const viralToLoops: Record<string, string> = {
    'first_mission_complete': LOOPS_EVENTS.MISSION_COMPLETED,
    'level_up': LOOPS_EVENTS.LEVEL_UP,
    'streak_milestone': LOOPS_EVENTS.ACHIEVEMENT_EARNED,
    'asset_class_mastered': LOOPS_EVENTS.ACHIEVEMENT_EARNED,
    'fo_certification_earned': LOOPS_EVENTS.ACHIEVEMENT_EARNED,
    'loss_lesson_learned': LOOPS_EVENTS.MISSION_COMPLETED,
  };

  const loopsEvent = viralToLoops[viralTrigger];
  
  if (!loopsEvent) return { success: false };

  return loops.sendEvent({
    email,
    eventName: loopsEvent,
    eventProperties: {
      viralTrigger,
      ...data
    }
  });
}

// =============================================================================
// RE-ENGAGEMENT AUTOMATION
// =============================================================================

/**
 * Check and trigger re-engagement emails for inactive users
 */
export async function processReEngagement(
  subscribers: NewsletterSubscriber[]
): Promise<{ processed: number; triggered: number }> {
  let processed = 0;
  let triggered = 0;

  for (const subscriber of subscribers) {
    processed++;
    
    // Only process users who consented
    if (!subscriber.marketingConsent) continue;
    
    // Determine re-engagement tier
    if (subscriber.daysSinceActive >= 7 && subscriber.daysSinceActive < 14) {
      // 7-day inactive: "We miss you!"
      await loopsHelpers.onInactive(subscriber.email, subscriber.daysSinceActive);
      triggered++;
    } else if (subscriber.daysSinceActive >= 14 && subscriber.daysSinceActive < 30) {
      // 14-day inactive: "New features you've missed"
      await loops.sendEvent({
        email: subscriber.email,
        eventName: LOOPS_EVENTS.CHURN_RISK,
        eventProperties: { daysSinceActive: subscriber.daysSinceActive }
      });
      triggered++;
    } else if (subscriber.daysSinceActive >= 30) {
      // 30+ day inactive: Final win-back
      await loops.sendEvent({
        email: subscriber.email,
        eventName: LOOPS_EVENTS.USER_INACTIVE,
        eventProperties: { 
          daysSinceActive: subscriber.daysSinceActive,
          finalAttempt: 1
        }
      });
      triggered++;
    }
  }

  return { processed, triggered };
}

// =============================================================================
// EXPORT ALL
// =============================================================================

export {
  loops,
  loopsHelpers,
  LOOPS_EVENTS
};




