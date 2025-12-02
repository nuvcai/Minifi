/**
 * useEffortRewards - Hook for managing effort-based reward state
 * 
 * Tracks player actions and calculates effort-based XP rewards.
 * Philosophy: Reward the journey, not just the destination.
 */

import { useState, useCallback, useEffect } from "react";
import {
  courageRewards,
  effortBadges,
  learningMilestones,
  calculateEffortXp,
  getRandomLossEncouragement,
  CourageReward,
  EffortBadge,
  LearningMilestone,
} from "@/components/gamification/effortRewards";
import {
  calculateShareReward,
  claimShareReward,
  SHARE_REWARDS,
} from "@/lib/marketing";

interface EffortStats {
  investmentsMade: number;
  riskPreviewsViewed: number;
  coachAdviceViewed: number;
  differentRiskLevelsTried: Set<string>;
  differentAssetClassesTried: Set<string>;
  lossesExperienced: number;
  investmentsAfterLoss: number;
  lastInvestmentWasLoss: boolean;
  coachesUsed: Set<string>;
  consecutiveLosses: number;
  missionsCompleted: number;
  currentStreak: number;
  // Share tracking
  totalShares: number;
  sharesByPlatform: Record<string, number>;
  shareXpEarned: number;
}

interface EarnedReward {
  type: "courage" | "badge" | "milestone";
  data: CourageReward | EffortBadge | LearningMilestone;
  timestamp: Date;
}

interface UseEffortRewardsReturn {
  stats: EffortStats;
  earnedRewards: EarnedReward[];
  pendingNotifications: EarnedReward[];
  totalEffortXp: number;
  
  // Actions
  recordInvestment: (riskLevel: string, assetClass: string, wasLoss: boolean) => void;
  recordRiskPreviewViewed: () => void;
  recordCoachAdviceViewed: (coachId: string) => void;
  recordMissionCompleted: () => void;
  clearPendingNotification: () => void;
  
  // Share actions
  recordShare: (platform: string) => { xp: number; canClaim: boolean; cooldownRemaining: number };
  getShareRewardInfo: (platform: string) => { xp: number; canClaim: boolean; cooldownRemaining: number };
  
  // Helpers
  getLossEncouragement: () => string;
  getNextMilestone: () => LearningMilestone | null;
  getProgressToNextMilestone: () => { current: number; target: number; percentage: number } | null;
}

const STORAGE_KEY = "legacy_guardians_effort_stats";

// Initial stats state
const initialStats: EffortStats = {
  investmentsMade: 0,
  riskPreviewsViewed: 0,
  coachAdviceViewed: 0,
  differentRiskLevelsTried: new Set(),
  differentAssetClassesTried: new Set(),
  lossesExperienced: 0,
  investmentsAfterLoss: 0,
  lastInvestmentWasLoss: false,
  coachesUsed: new Set(),
  consecutiveLosses: 0,
  missionsCompleted: 0,
  currentStreak: 0,
  // Share tracking
  totalShares: 0,
  sharesByPlatform: {},
  shareXpEarned: 0,
};

export function useEffortRewards(): UseEffortRewardsReturn {
  const [stats, setStats] = useState<EffortStats>(initialStats);
  const [earnedRewards, setEarnedRewards] = useState<EarnedReward[]>([]);
  const [pendingNotifications, setPendingNotifications] = useState<EarnedReward[]>([]);

  // Load stats from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setStats({
          ...parsed,
          differentRiskLevelsTried: new Set(parsed.differentRiskLevelsTried || []),
          differentAssetClassesTried: new Set(parsed.differentAssetClassesTried || []),
          coachesUsed: new Set(parsed.coachesUsed || []),
        });
      }
    } catch (e) {
      console.error("Failed to load effort stats:", e);
    }
  }, []);

  // Save stats to localStorage when they change
  useEffect(() => {
    try {
      const toSave = {
        ...stats,
        differentRiskLevelsTried: Array.from(stats.differentRiskLevelsTried),
        differentAssetClassesTried: Array.from(stats.differentAssetClassesTried),
        coachesUsed: Array.from(stats.coachesUsed),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.error("Failed to save effort stats:", e);
    }
  }, [stats]);

  // Check for newly earned rewards
  const checkForNewRewards = useCallback((newStats: EffortStats, prevStats: EffortStats) => {
    const newRewards: EarnedReward[] = [];

    // Check courage rewards
    courageRewards.forEach((reward) => {
      const alreadyEarned = earnedRewards.some(
        (e) => e.type === "courage" && (e.data as CourageReward).id === reward.id
      );
      if (alreadyEarned) return;

      let triggered = false;
      switch (reward.trigger) {
        case "first_investment":
          triggered = newStats.investmentsMade === 1 && prevStats.investmentsMade === 0;
          break;
        case "high_risk_investment":
          triggered = newStats.differentRiskLevelsTried.has("high") && 
                     !prevStats.differentRiskLevelsTried.has("high");
          break;
        case "extreme_risk_investment":
          triggered = newStats.differentRiskLevelsTried.has("extreme") && 
                     !prevStats.differentRiskLevelsTried.has("extreme");
          break;
        case "investment_loss":
          triggered = newStats.lossesExperienced > prevStats.lossesExperienced;
          break;
        case "invest_after_loss":
          triggered = newStats.investmentsAfterLoss > prevStats.investmentsAfterLoss;
          break;
        case "viewed_risk_preview":
          triggered = newStats.riskPreviewsViewed === 1 && prevStats.riskPreviewsViewed === 0;
          break;
        case "viewed_coach_advice":
          triggered = newStats.coachAdviceViewed === 1 && prevStats.coachAdviceViewed === 0;
          break;
      }

      if (triggered) {
        newRewards.push({
          type: "courage",
          data: reward,
          timestamp: new Date(),
        });
      }
    });

    // Check effort badges
    effortBadges.forEach((badge) => {
      const alreadyEarned = earnedRewards.some(
        (e) => e.type === "badge" && (e.data as EffortBadge).id === badge.id
      );
      if (alreadyEarned) return;

      let triggered = false;
      switch (badge.requirement) {
        case "complete_1_mission":
          triggered = newStats.missionsCompleted >= 1;
          break;
        case "complete_3_missions":
          triggered = newStats.missionsCompleted >= 3;
          break;
        case "complete_6_missions":
          triggered = newStats.missionsCompleted >= 6;
          break;
        case "try_3_risk_levels":
          triggered = newStats.differentRiskLevelsTried.size >= 3;
          break;
        case "try_all_risk_levels":
          triggered = newStats.differentRiskLevelsTried.size >= 5;
          break;
        case "try_3_asset_classes":
          triggered = newStats.differentAssetClassesTried.size >= 3;
          break;
        case "try_all_asset_classes":
          triggered = newStats.differentAssetClassesTried.size >= 6;
          break;
        case "try_2_coaches":
          triggered = newStats.coachesUsed.size >= 2;
          break;
        case "try_4_coaches":
          triggered = newStats.coachesUsed.size >= 4;
          break;
        case "invest_after_loss":
          triggered = newStats.investmentsAfterLoss >= 1;
          break;
        case "experience_3_losses":
          triggered = newStats.lossesExperienced >= 3;
          break;
      }

      if (triggered) {
        newRewards.push({
          type: "badge",
          data: badge,
          timestamp: new Date(),
        });
      }
    });

    // Check learning milestones
    learningMilestones.forEach((milestone) => {
      const alreadyEarned = earnedRewards.some(
        (e) => e.type === "milestone" && (e.data as LearningMilestone).id === milestone.id
      );
      if (alreadyEarned) return;

      let value = 0;
      switch (milestone.type) {
        case "missions_attempted":
          value = newStats.investmentsMade;
          break;
        case "assets_explored":
          value = newStats.differentAssetClassesTried.size;
          break;
        case "risks_taken":
          value = Array.from(newStats.differentRiskLevelsTried)
            .filter((r) => r === "high" || r === "extreme").length;
          break;
        case "coaches_consulted":
          value = newStats.coachesUsed.size;
          break;
      }

      if (value >= milestone.requirement) {
        newRewards.push({
          type: "milestone",
          data: milestone,
          timestamp: new Date(),
        });
      }
    });

    if (newRewards.length > 0) {
      setEarnedRewards((prev) => [...prev, ...newRewards]);
      setPendingNotifications((prev) => [...prev, ...newRewards]);
    }
  }, [earnedRewards]);

  // Record an investment made
  const recordInvestment = useCallback((riskLevel: string, assetClass: string, wasLoss: boolean) => {
    setStats((prev) => {
      const newStats: EffortStats = {
        ...prev,
        investmentsMade: prev.investmentsMade + 1,
        differentRiskLevelsTried: new Set([...prev.differentRiskLevelsTried, riskLevel.toLowerCase()]),
        differentAssetClassesTried: new Set([...prev.differentAssetClassesTried, assetClass]),
        lossesExperienced: wasLoss ? prev.lossesExperienced + 1 : prev.lossesExperienced,
        investmentsAfterLoss: prev.lastInvestmentWasLoss ? prev.investmentsAfterLoss + 1 : prev.investmentsAfterLoss,
        lastInvestmentWasLoss: wasLoss,
        consecutiveLosses: wasLoss ? prev.consecutiveLosses + 1 : 0,
      };

      // Check for new rewards after state update
      setTimeout(() => checkForNewRewards(newStats, prev), 0);

      return newStats;
    });
  }, [checkForNewRewards]);

  // Record risk preview viewed
  const recordRiskPreviewViewed = useCallback(() => {
    setStats((prev) => {
      const newStats = {
        ...prev,
        riskPreviewsViewed: prev.riskPreviewsViewed + 1,
      };
      setTimeout(() => checkForNewRewards(newStats, prev), 0);
      return newStats;
    });
  }, [checkForNewRewards]);

  // Record coach advice viewed
  const recordCoachAdviceViewed = useCallback((coachId: string) => {
    setStats((prev) => {
      const newStats: EffortStats = {
        ...prev,
        coachAdviceViewed: prev.coachAdviceViewed + 1,
        coachesUsed: new Set([...prev.coachesUsed, coachId]),
      };
      setTimeout(() => checkForNewRewards(newStats, prev), 0);
      return newStats;
    });
  }, [checkForNewRewards]);

  // Record mission completed
  const recordMissionCompleted = useCallback(() => {
    setStats((prev) => {
      const newStats = {
        ...prev,
        missionsCompleted: prev.missionsCompleted + 1,
        currentStreak: prev.currentStreak + 1,
      };
      setTimeout(() => checkForNewRewards(newStats, prev), 0);
      return newStats;
    });
  }, [checkForNewRewards]);

  // Clear the oldest pending notification
  const clearPendingNotification = useCallback(() => {
    setPendingNotifications((prev) => prev.slice(1));
  }, []);

  // Get share reward info without claiming
  const getShareRewardInfo = useCallback((platform: string) => {
    const streakMultiplier = stats.currentStreak > 0 ? 1 + (stats.currentStreak * 0.05) : 1;
    return calculateShareReward(platform, Math.min(streakMultiplier, 2)); // Cap at 2x
  }, [stats.currentStreak]);

  // Record a share and claim reward
  const recordShare = useCallback((platform: string) => {
    const rewardInfo = getShareRewardInfo(platform);
    
    if (!rewardInfo.canClaim) {
      return rewardInfo;
    }

    // Claim the reward
    const xpEarned = claimShareReward(platform);
    
    // Update stats
    setStats((prev) => ({
      ...prev,
      totalShares: prev.totalShares + 1,
      sharesByPlatform: {
        ...prev.sharesByPlatform,
        [platform]: (prev.sharesByPlatform[platform] || 0) + 1,
      },
      shareXpEarned: prev.shareXpEarned + xpEarned,
    }));

    return { ...rewardInfo, xp: xpEarned };
  }, [getShareRewardInfo]);

  // Get random loss encouragement message
  const getLossEncouragement = useCallback(() => {
    return getRandomLossEncouragement();
  }, []);

  // Get next milestone to achieve
  const getNextMilestone = useCallback((): LearningMilestone | null => {
    const unearned = learningMilestones.filter(
      (m) => !earnedRewards.some((e) => e.type === "milestone" && (e.data as LearningMilestone).id === m.id)
    );
    return unearned.length > 0 ? unearned[0] : null;
  }, [earnedRewards]);

  // Get progress to next milestone
  const getProgressToNextMilestone = useCallback(() => {
    const next = getNextMilestone();
    if (!next) return null;

    let current = 0;
    switch (next.type) {
      case "missions_attempted":
        current = stats.investmentsMade;
        break;
      case "assets_explored":
        current = stats.differentAssetClassesTried.size;
        break;
      case "risks_taken":
        current = Array.from(stats.differentRiskLevelsTried)
          .filter((r) => r === "high" || r === "extreme").length;
        break;
      case "coaches_consulted":
        current = stats.coachesUsed.size;
        break;
    }

    return {
      current,
      target: next.requirement,
      percentage: Math.min((current / next.requirement) * 100, 100),
    };
  }, [stats, getNextMilestone]);

  // Calculate total effort XP
  const totalEffortXp = calculateEffortXp({
    investmentsMade: stats.investmentsMade,
    riskPreviewsViewed: stats.riskPreviewsViewed,
    coachAdviceViewed: stats.coachAdviceViewed,
    differentRiskLevelsTried: stats.differentRiskLevelsTried.size,
    differentAssetClassesTried: stats.differentAssetClassesTried.size,
    lossesExperienced: stats.lossesExperienced,
    investmentsAfterLoss: stats.investmentsAfterLoss,
  }).totalXp;

  return {
    stats,
    earnedRewards,
    pendingNotifications,
    totalEffortXp,
    recordInvestment,
    recordRiskPreviewViewed,
    recordCoachAdviceViewed,
    recordMissionCompleted,
    clearPendingNotification,
    // Share methods
    recordShare,
    getShareRewardInfo,
    // Helpers
    getLossEncouragement,
    getNextMilestone,
    getProgressToNextMilestone,
  };
}

export default useEffortRewards;




