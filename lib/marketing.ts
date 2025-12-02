/**
 * Marketing Integration Module
 * Central export for all marketing functions, hooks, and utilities
 * Connects user acquisition, conversion tracking, and viral growth
 */

// ============================================================================
// RE-EXPORTS FROM DATA MODULES
// ============================================================================

// Viral Marketing Data
export {
  // Types
  type AgeGroup,
  type ReferralCode,
  type ReferralReward,
  type ShareableContent,
  type ShareContentType,
  type SocialPlatform,
  type ViralChallenge,
  type Leaderboard,
  type LeaderboardEntry,
  type SocialProofStats,
  type ViralLoop,
  // Constants
  AGE_GROUP_CONFIGS,
  REFERRAL_TIERS,
  SHARE_TEMPLATES,
  SOCIAL_PLATFORMS,
  VIRAL_CHALLENGES,
  LEADERBOARDS,
  SOCIAL_PROOF_MESSAGES,
  VIRAL_LOOPS,
  VIRAL_TARGETS,
  // Functions
  generateShareUrl as generateSocialShareUrl,
  generateReferralCode,
  getReferralTier,
  buildShareContent,
  calculateKFactor,
} from "@/components/data/viralMarketing";

// Marketing Messages
export {
  // Types
  type ValueProposition,
  type MarketingTagline,
  type FeatureBenefit,
  type FutureFeatureTeaser,
  type SocialProofStat,
  type ViralTrigger,
  type ViralMoment,
  // Data
  valuePropositions,
  marketingTaglines,
  featureBenefits,
  futureFeatureTeasers,
  socialProofStats,
  viralTriggers,
  viralMoments,
  referralRewards,
  shareTemplates,
  // Functions
  getRandomTagline,
  getValuePropositionByAudience,
  getFeatureBenefitsByPillar,
  getFutureFeaturesbyStatus,
  getUpcomingTeasers,
  getViralTriggerForFeature,
  getReferralRewardForCount,
  getNextReferralMilestone,
  getViralMomentByTrigger,
  generateShareUrl,
  estimateViralCoefficient,
} from "@/components/data/marketingMessages";

// Marketing Data & Events
export {
  MARKETING_EVENTS,
  USER_SEGMENTS,
  type UserConsent,
  type UserSegment,
  type Attribution,
  type SignupData,
  type TrackingEvent,
} from "@/components/data/marketingData";

// ============================================================================
// RE-EXPORTS FROM MARKETING STACK
// ============================================================================

export {
  whatsapp,
  whatsappNotify,
  substack,
  medium,
  resend,
  contentDistribution,
} from "./marketing-stack";

// ============================================================================
// CONVERSION TRACKING UTILITIES
// ============================================================================

export interface ConversionEvent {
  type: string;
  source: string;
  medium?: string;
  campaign?: string;
  referralCode?: string;
  value?: number;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

/**
 * Track a conversion event
 */
export async function trackConversion(event: Omit<ConversionEvent, "timestamp">): Promise<void> {
  const fullEvent: ConversionEvent = {
    ...event,
    timestamp: new Date(),
  };

  // Log in development
  if (process.env.NODE_ENV === "development") {
    console.log("[Conversion]", fullEvent);
  }

  // Store in localStorage for client-side tracking
  if (typeof window !== "undefined") {
    const conversions = JSON.parse(localStorage.getItem("minifi_conversions") || "[]");
    conversions.push(fullEvent);
    localStorage.setItem("minifi_conversions", JSON.stringify(conversions.slice(-100))); // Keep last 100
  }

  // Send to analytics API
  try {
    await fetch("/api/analytics/conversion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fullEvent),
    });
  } catch (e) {
    // Silently fail - don't block user experience
    console.warn("Failed to track conversion:", e);
  }
}

/**
 * Get UTM parameters from current URL
 */
export function getUTMParams(): {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  referralCode?: string;
} {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);

  return {
    source: params.get("utm_source") || undefined,
    medium: params.get("utm_medium") || undefined,
    campaign: params.get("utm_campaign") || undefined,
    term: params.get("utm_term") || undefined,
    content: params.get("utm_content") || undefined,
    referralCode: params.get("ref") || undefined,
  };
}

/**
 * Store attribution data for later conversion tracking
 */
export function storeAttribution(): void {
  if (typeof window === "undefined") return;

  const utm = getUTMParams();
  
  // Only store if we have any UTM data or referral
  if (Object.values(utm).some(v => v)) {
    const attribution = {
      ...utm,
      landingPage: window.location.pathname,
      referrer: document.referrer || undefined,
      timestamp: new Date().toISOString(),
    };
    
    localStorage.setItem("minifi_attribution", JSON.stringify(attribution));
  }
}

/**
 * Get stored attribution data
 */
export function getStoredAttribution(): ReturnType<typeof getUTMParams> & {
  landingPage?: string;
  referrer?: string;
  timestamp?: string;
} {
  if (typeof window === "undefined") return {};

  const stored = localStorage.getItem("minifi_attribution");
  if (!stored) return {};

  try {
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

// ============================================================================
// SHARE REWARD SYSTEM
// ============================================================================

export interface ShareReward {
  platform: string;
  xpAmount: number;
  bonusMultiplier: number;
  cooldownMinutes: number;
}

export const SHARE_REWARDS: Record<string, ShareReward> = {
  twitter: { platform: "Twitter", xpAmount: 25, bonusMultiplier: 1.0, cooldownMinutes: 60 },
  whatsapp: { platform: "WhatsApp", xpAmount: 30, bonusMultiplier: 1.2, cooldownMinutes: 60 },
  linkedin: { platform: "LinkedIn", xpAmount: 35, bonusMultiplier: 1.4, cooldownMinutes: 120 },
  telegram: { platform: "Telegram", xpAmount: 25, bonusMultiplier: 1.0, cooldownMinutes: 60 },
  facebook: { platform: "Facebook", xpAmount: 25, bonusMultiplier: 1.0, cooldownMinutes: 60 },
  email: { platform: "Email", xpAmount: 40, bonusMultiplier: 1.5, cooldownMinutes: 240 },
  copy_link: { platform: "Copy Link", xpAmount: 10, bonusMultiplier: 0.5, cooldownMinutes: 30 },
};

/**
 * Calculate share reward with cooldown check
 */
export function calculateShareReward(
  platform: string,
  streakMultiplier: number = 1.0
): { xp: number; canClaim: boolean; cooldownRemaining: number } {
  const reward = SHARE_REWARDS[platform] || SHARE_REWARDS.copy_link;
  
  // Check cooldown
  if (typeof window !== "undefined") {
    const lastShare = localStorage.getItem(`minifi_share_${platform}`);
    if (lastShare) {
      const lastShareTime = parseInt(lastShare, 10);
      const cooldownMs = reward.cooldownMinutes * 60 * 1000;
      const elapsed = Date.now() - lastShareTime;
      
      if (elapsed < cooldownMs) {
        return {
          xp: 0,
          canClaim: false,
          cooldownRemaining: Math.ceil((cooldownMs - elapsed) / 60000),
        };
      }
    }
  }

  const xp = Math.round(reward.xpAmount * reward.bonusMultiplier * streakMultiplier);
  
  return {
    xp,
    canClaim: true,
    cooldownRemaining: 0,
  };
}

/**
 * Claim share reward and set cooldown
 */
export function claimShareReward(platform: string): number {
  const { xp, canClaim } = calculateShareReward(platform);
  
  if (!canClaim) return 0;

  // Set cooldown
  if (typeof window !== "undefined") {
    localStorage.setItem(`minifi_share_${platform}`, Date.now().toString());
  }

  // Track the share reward
  trackConversion({
    type: "share_reward",
    source: platform,
    value: xp,
  });

  return xp;
}

// ============================================================================
// REFERRAL TRACKING
// ============================================================================

/**
 * Track referral click
 */
export async function trackReferralClick(referralCode: string): Promise<void> {
  await trackConversion({
    type: "referral_click",
    source: "referral",
    referralCode,
  });

  // Store referrer for later signup attribution
  if (typeof window !== "undefined") {
    localStorage.setItem("minifi_referrer", referralCode);
  }
}

/**
 * Track referral signup
 */
export async function trackReferralSignup(
  referralCode: string,
  newUserEmail: string
): Promise<void> {
  await trackConversion({
    type: "referral_signup",
    source: "referral",
    referralCode,
    metadata: { newUserEmail },
  });
}

/**
 * Get referrer code if user came from a referral
 */
export function getReferrerCode(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("minifi_referrer");
}

// ============================================================================
// A/B TESTING UTILITIES
// ============================================================================

export interface ABTest {
  id: string;
  variants: string[];
  weights?: number[];
}

/**
 * Get or assign A/B test variant
 */
export function getABVariant(test: ABTest): string {
  if (typeof window === "undefined") return test.variants[0];

  const storageKey = `minifi_ab_${test.id}`;
  const stored = localStorage.getItem(storageKey);
  
  if (stored && test.variants.includes(stored)) {
    return stored;
  }

  // Assign variant based on weights or equal distribution
  const weights = test.weights || test.variants.map(() => 1 / test.variants.length);
  const random = Math.random();
  let cumulative = 0;
  
  for (let i = 0; i < test.variants.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) {
      localStorage.setItem(storageKey, test.variants[i]);
      return test.variants[i];
    }
  }

  localStorage.setItem(storageKey, test.variants[0]);
  return test.variants[0];
}

/**
 * Track A/B test conversion
 */
export function trackABConversion(testId: string, variant: string): void {
  trackConversion({
    type: "ab_conversion",
    source: testId,
    metadata: { variant },
  });
}

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

export default {
  // Conversion tracking
  trackConversion,
  getUTMParams,
  storeAttribution,
  getStoredAttribution,
  
  // Share rewards
  SHARE_REWARDS,
  calculateShareReward,
  claimShareReward,
  
  // Referral tracking
  trackReferralClick,
  trackReferralSignup,
  getReferrerCode,
  
  // A/B testing
  getABVariant,
  trackABConversion,
};

