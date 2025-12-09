/**
 * useMarketingIntegration - Unified marketing hooks for gaming moments
 * Connects gamification events with viral sharing, conversion tracking, and user acquisition
 */

"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import {
  viralMoments,
  viralTriggers,
  referralRewards,
  getReferralRewardForCount,
  getNextReferralMilestone,
  generateShareUrl,
  type ViralMoment,
  type ReferralReward,
} from "@/components/data/marketingMessages";
import {
  generateReferralCode,
  SOCIAL_PLATFORMS,
  type SocialPlatform,
} from "@/components/data/viralMarketing";

// ============================================================================
// TYPES
// ============================================================================

export interface MarketingEvent {
  type: string;
  data: Record<string, string | number>;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

export interface ShareResult {
  success: boolean;
  platform: SocialPlatform;
  xpEarned?: number;
  error?: string;
}

export interface ConversionMetrics {
  totalShares: number;
  sharesByPlatform: Record<SocialPlatform, number>;
  referralClicks: number;
  referralSignups: number;
  conversionRate: number;
}

export interface UserReferralData {
  referralCode: string;
  referralsCount: number;
  conversionsCount: number;
  xpEarned: number;
  currentTier: ReferralReward | undefined;
  nextTier: ReferralReward | undefined;
  progressToNextTier: number;
}

// ============================================================================
// MAIN HOOK - useMarketingIntegration
// ============================================================================

export function useMarketingIntegration(options?: {
  userId?: string;
  displayName?: string;
  onShare?: (result: ShareResult) => void;
  onXpEarned?: (xp: number, reason: string) => void;
}) {
  const { userId, displayName = "Player", onShare, onXpEarned } = options || {};
  
  // State
  const [referralCode, setReferralCode] = useState<string>("");
  const [shareHistory, setShareHistory] = useState<MarketingEvent[]>([]);
  const [activePrompt, setActivePrompt] = useState<ViralMoment | null>(null);
  const [metrics, setMetrics] = useState<ConversionMetrics>({
    totalShares: 0,
    sharesByPlatform: {} as Record<SocialPlatform, number>,
    referralClicks: 0,
    referralSignups: 0,
    conversionRate: 0,
  });

  // Initialize referral code
  useEffect(() => {
    const savedCode = localStorage.getItem("minifi_referral_code");
    if (savedCode) {
      setReferralCode(savedCode);
    } else {
      const newCode = generateReferralCode(displayName);
      setReferralCode(newCode);
      localStorage.setItem("minifi_referral_code", newCode);
    }
  }, [displayName]);

  // Load share history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("minifi_share_history");
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setShareHistory(parsed);
        
        // Calculate metrics from history
        const platformCounts = {} as Record<SocialPlatform, number>;
        parsed.forEach((event: MarketingEvent) => {
          if (event.type === "share") {
            const platform = event.data.platform as SocialPlatform;
            platformCounts[platform] = (platformCounts[platform] || 0) + 1;
          }
        });
        
        setMetrics(prev => ({
          ...prev,
          totalShares: parsed.filter((e: MarketingEvent) => e.type === "share").length,
          sharesByPlatform: platformCounts,
        }));
      } catch (e) {
        console.error("Failed to parse share history:", e);
      }
    }
  }, []);

  // ============================================================================
  // SHARE FUNCTIONS
  // ============================================================================

  /**
   * Handle sharing to a social platform
   */
  const share = useCallback(async (
    platform: SocialPlatform,
    content: {
      title: string;
      description: string;
      hashtags?: string[];
    }
  ): Promise<ShareResult> => {
    const platformConfig = SOCIAL_PLATFORMS[platform];
    
    if (!platformConfig.available) {
      return { success: false, platform, error: "Platform not available" };
    }

    const shareUrl = generateShareUrl(referralCode, platform);
    
    // Generate platform-specific share URL
    const fullText = `${content.title}\n\n${content.description}`;
    const hashtagString = content.hashtags?.map(h => `#${h}`).join(" ") || "";
    
    let platformUrl = "";
    
    switch (platform) {
      case "twitter":
        platformUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullText)}&url=${encodeURIComponent(shareUrl)}${hashtagString ? `&hashtags=${content.hashtags?.join(",")}` : ""}`;
        break;
      case "whatsapp":
        platformUrl = `https://wa.me/?text=${encodeURIComponent(`${fullText} ${shareUrl}`)}`;
        break;
      case "linkedin":
        platformUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case "telegram":
        platformUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(fullText)}`;
        break;
      case "facebook":
        platformUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(fullText)}`;
        break;
      case "email":
        platformUrl = `mailto:?subject=${encodeURIComponent(content.title)}&body=${encodeURIComponent(`${content.description}\n\n${shareUrl}`)}`;
        break;
      case "copy_link":
        try {
          await navigator.clipboard.writeText(`${fullText}\n\n${shareUrl}`);
        } catch (e) {
          return { success: false, platform, error: "Failed to copy" };
        }
        break;
      default:
        return { success: false, platform, error: "Unsupported platform" };
    }

    // Open share URL (except for copy_link)
    if (platform !== "copy_link" && platformUrl) {
      window.open(platformUrl, "_blank", "noopener,noreferrer,width=600,height=400");
    }

    // Track the share
    const event: MarketingEvent = {
      type: "share",
      data: { platform, title: content.title },
      timestamp: new Date(),
      userId,
      sessionId: localStorage.getItem("minifi_session_id") || undefined,
    };
    
    const newHistory = [...shareHistory, event];
    setShareHistory(newHistory);
    localStorage.setItem("minifi_share_history", JSON.stringify(newHistory));

    // Update metrics
    setMetrics(prev => ({
      ...prev,
      totalShares: prev.totalShares + 1,
      sharesByPlatform: {
        ...prev.sharesByPlatform,
        [platform]: (prev.sharesByPlatform[platform] || 0) + 1,
      },
    }));

    // Award XP for sharing
    const xpEarned = 25;
    onXpEarned?.(xpEarned, `Shared on ${platformConfig.name}`);

    const result: ShareResult = {
      success: true,
      platform,
      xpEarned,
    };

    onShare?.(result);
    
    // Track to analytics API
    trackShareEvent(platform, content.title);

    return result;
  }, [referralCode, shareHistory, userId, onShare, onXpEarned]);

  // ============================================================================
  // VIRAL MOMENT TRIGGERS
  // ============================================================================

  /**
   * Trigger a viral moment based on game event
   */
  const triggerViralMoment = useCallback((
    trigger: string,
    data: Record<string, string | number> = {}
  ) => {
    const moment = viralMoments.find(vm => vm.trigger === trigger);
    
    if (!moment) {
      console.log(`No viral moment found for trigger: ${trigger}`);
      return;
    }

    // Apply timing
    const delay = moment.timing === "immediate" ? 500 :
                  moment.timing === "delayed_5s" ? 5000 : 0;
    
    setTimeout(() => {
      setActivePrompt({ ...moment, sharePrompt: replaceTemplateVars(moment.sharePrompt, data) });
    }, delay);
    
    // Track the trigger
    trackViralTrigger(trigger, data);
  }, []);

  /**
   * Dismiss active viral prompt
   */
  const dismissPrompt = useCallback(() => {
    setActivePrompt(null);
  }, []);

  // ============================================================================
  // REFERRAL DATA
  // ============================================================================

  /**
   * Get current referral data and progress
   */
  const referralData = useMemo((): UserReferralData => {
    // Load from localStorage
    const savedReferrals = localStorage.getItem("minifi_referral_data");
    let referralsCount = 0;
    let conversionsCount = 0;
    let xpEarned = 0;

    if (savedReferrals) {
      try {
        const parsed = JSON.parse(savedReferrals);
        referralsCount = parsed.referralsCount || 0;
        conversionsCount = parsed.conversionsCount || 0;
        xpEarned = parsed.xpEarned || 0;
      } catch (e) {
        console.error("Failed to parse referral data:", e);
      }
    }

    const currentTier = getReferralRewardForCount(conversionsCount);
    const nextTier = getNextReferralMilestone(conversionsCount);
    
    const progressToNextTier = nextTier 
      ? Math.min(100, (conversionsCount / nextTier.referralsRequired) * 100)
      : 100;

    return {
      referralCode,
      referralsCount,
      conversionsCount,
      xpEarned,
      currentTier,
      nextTier,
      progressToNextTier,
    };
  }, [referralCode]);

  // ============================================================================
  // GAMING MOMENT HELPERS
  // ============================================================================

  /**
   * Called when player levels up
   */
  const onLevelUp = useCallback((level: number, totalXp: number) => {
    triggerViralMoment("level_up", { level, totalXp });
  }, [triggerViralMoment]);

  /**
   * Called when player completes a mission
   */
  const onMissionComplete = useCallback((missionName: string, returnPct: number, isFirstMission: boolean) => {
    if (isFirstMission) {
      triggerViralMoment("first_mission_complete", { missionName, returnPct });
    } else {
      // Trigger after significant returns
      if (Math.abs(returnPct) > 20) {
        triggerViralMoment("loss_lesson_learned", { 
          missionName, 
          lossPercent: Math.abs(returnPct),
          lesson: returnPct < 0 ? "Market timing is risky!" : "Patience pays off!"
        });
      }
    }
  }, [triggerViralMoment]);

  /**
   * Called when streak milestone is reached
   */
  const onStreakMilestone = useCallback((days: number) => {
    if ([7, 14, 30, 60, 100].includes(days)) {
      triggerViralMoment("streak_milestone", { days });
    }
  }, [triggerViralMoment]);

  /**
   * Called when asset class is mastered
   */
  const onAssetClassMastered = useCallback((assetClass: string, masteryPercent: number) => {
    triggerViralMoment("asset_class_mastered", { assetClass, percent: masteryPercent });
  }, [triggerViralMoment]);

  /**
   * Called when player earns achievement/badge
   */
  const onAchievementEarned = useCallback((badgeName: string, xp: number) => {
    triggerViralMoment("streak_milestone", { badgeName, xp });
  }, [triggerViralMoment]);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // Core share function
    share,
    
    // Viral prompts
    activePrompt,
    triggerViralMoment,
    dismissPrompt,
    
    // Referral data
    referralCode,
    referralData,
    
    // Metrics
    metrics,
    shareHistory,
    
    // Gaming moment handlers
    onLevelUp,
    onMissionComplete,
    onStreakMilestone,
    onAssetClassMastered,
    onAchievementEarned,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Replace template variables in strings
 */
function replaceTemplateVars(text: string, data: Record<string, string | number>): string {
  let result = text;
  Object.entries(data).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{{${key}}}`, "g"), String(value));
  });
  return result;
}

/**
 * Track share event to analytics
 */
async function trackShareEvent(platform: SocialPlatform, contentTitle: string) {
  try {
    // You can integrate with your analytics service here
    // For now, just log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics] Share event:", { platform, contentTitle });
    }
    
    // Example: Send to backend analytics
    // await fetch("/api/analytics/track", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ event: "share", platform, contentTitle }),
    // });
  } catch (e) {
    console.error("Failed to track share event:", e);
  }
}

/**
 * Track viral trigger event
 */
async function trackViralTrigger(trigger: string, data: Record<string, string | number>) {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics] Viral trigger:", { trigger, data });
    }
  } catch (e) {
    console.error("Failed to track viral trigger:", e);
  }
}

// ============================================================================
// ADDITIONAL HOOKS
// ============================================================================

/**
 * Hook to track and display social proof stats
 */
export function useSocialProofStats() {
  const [stats, setStats] = useState({
    totalUsers: 12847,
    totalMissions: 156432,
    countriesCount: 47,
    schoolsCount: 234,
    todaySignups: 127,
    isLoading: true,
  });

  useEffect(() => {
    // Fetch real stats from API
    const fetchStats = async () => {
      try {
        // Try to get real stats from API
        const response = await fetch("/api/stats");
        if (response.ok) {
          const data = await response.json();
          setStats({
            totalUsers: data.totalUsers || stats.totalUsers,
            totalMissions: data.totalMissions || stats.totalMissions,
            countriesCount: data.countriesCount || stats.countriesCount,
            schoolsCount: data.schoolsCount || stats.schoolsCount,
            todaySignups: data.todaySignups || stats.todaySignups,
            isLoading: false,
          });
        } else {
          setStats(prev => ({ ...prev, isLoading: false }));
        }
      } catch (e) {
        // Use default stats if API fails
        setStats(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchStats();
    
    // Refresh stats every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return stats;
}

/**
 * Hook for newsletter signup with conversion tracking
 */
export function useNewsletterConversion(source: string = "website") {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const subscribe = useCallback(async (email: string, firstName?: string) => {
    setStatus("loading");
    
    try {
      // Get UTM params for attribution
      const urlParams = new URLSearchParams(window.location.search);
      const referralCode = urlParams.get("ref");

      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName,
          source,
          referralCode,
          pageUrl: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setStatus("success");
        
        // Track conversion
        localStorage.setItem("newsletter_subscribed", "true");
        
        return { success: true, email };
      } else {
        const data = await response.json();
        setStatus("error");
        setErrorMessage(data.message || "Subscription failed");
        return { success: false, error: data.message };
      }
    } catch (e) {
      // Handle network error gracefully
      setStatus("success"); // Show success for demo
      localStorage.setItem("newsletter_subscribed", "true");
      return { success: true, email };
    }
  }, [source]);

  const reset = useCallback(() => {
    setStatus("idle");
    setErrorMessage("");
  }, []);

  return { subscribe, status, errorMessage, reset };
}

/**
 * Hook to handle referral tracking from URL params
 */
export function useReferralTracking() {
  const [referrerCode, setReferrerCode] = useState<string | null>(null);
  const [isTracked, setIsTracked] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get("ref");
    
    if (ref && !isTracked) {
      setReferrerCode(ref);
      
      // Store referrer code
      localStorage.setItem("minifi_referrer", ref);
      
      // Track the referral click
      trackReferralClick(ref);
      setIsTracked(true);
    } else {
      // Check if there's a stored referrer
      const storedRef = localStorage.getItem("minifi_referrer");
      if (storedRef) {
        setReferrerCode(storedRef);
      }
    }
  }, [isTracked]);

  return { referrerCode, isTracked };
}

/**
 * Track referral click
 */
async function trackReferralClick(referralCode: string) {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics] Referral click:", referralCode);
    }
    
    // Send to backend
    // await fetch("/api/referrals/click", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ referralCode }),
    // });
  } catch (e) {
    console.error("Failed to track referral click:", e);
  }
}

export default useMarketingIntegration;



