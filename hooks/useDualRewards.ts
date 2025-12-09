/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   🏆 USE DUAL REWARDS - Hook for Badge + III Token System                   ║
 * ║   Manages badge earning, III token rewards, and celebration triggers        ║
 * ║   ✨ MiniFi / Legacy Guardians ✨                                           ║
 * ║   Copyright (c) 2025 NUVC.AI / Tick.AI. All Rights Reserved.                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  DualRewardBadge,
  ALL_BADGES,
  calculateBadgeIIIReward,
  getBadgeSummary,
  type RewardCategory,
} from '@/components/gamification/dualRewards';

// =============================================================================
// TYPES
// =============================================================================

export interface PlayerProgress {
  // Investments
  investmentsMade: number;
  highRiskInvestments: number;
  extremeRiskInvestments: number;
  
  // Losses & Resilience
  lossesExperienced: number;
  investmentsAfterLoss: number;
  lastInvestmentWasLoss: boolean;
  profitAfterConsecutiveLosses: number;
  consecutiveLosses: number;
  
  // Crisis & Wisdom
  crisesNavigated: number;
  bubblesSurvived: number;
  drawdownsHeld: number; // 30%+ drawdowns held through
  reflectionsCompleted: number;
  rationalDecisions: number; // Decisions without panic/FOMO
  
  // Exploration
  assetClassesTried: Set<string>;
  riskLevelsTried: Set<string>;
  coachesUsed: Set<string>;
  
  // Mastery
  missionsCompleted: number;
  perfectQuizzes: number;
  thesesWritten: number;
  
  // Streaks
  currentStreak: number;
  longestStreak: number;
  
  // Due Diligence
  riskPreviewsViewed: number;
  coachAdviceViewed: number;
}

interface EarnedBadgeRecord {
  badgeId: string;
  earnedAt: Date;
  iiiAwarded: number;
}

export interface UseDualRewardsReturn {
  // Earned badges
  earnedBadgeIds: string[];
  earnedBadges: DualRewardBadge[];
  
  // Pending celebration (badge just earned)
  pendingCelebration: DualRewardBadge | null;
  clearCelebration: () => void;
  
  // Player progress
  progress: PlayerProgress;
  
  // Stats
  totalIIIFromBadges: number;
  badgeSummary: ReturnType<typeof getBadgeSummary>;
  
  // Actions that may trigger badge earnings
  recordInvestment: (params: {
    riskLevel: string;
    assetClass: string;
    wasLoss: boolean;
    wasProfit?: boolean;
  }) => { newBadges: DualRewardBadge[]; totalIII: number };
  
  recordCrisisAction: (params: {
    type: 'bubble_survived' | 'drawdown_held' | 'crisis_navigated' | 'rational_decision';
  }) => { newBadges: DualRewardBadge[]; totalIII: number };
  
  recordReflection: () => { newBadges: DualRewardBadge[]; totalIII: number };
  
  recordStreakDay: (days: number) => { newBadges: DualRewardBadge[]; totalIII: number };
  
  recordMissionComplete: () => { newBadges: DualRewardBadge[]; totalIII: number };
  
  recordQuizPerfect: () => { newBadges: DualRewardBadge[]; totalIII: number };
  
  recordThesisWritten: () => { newBadges: DualRewardBadge[]; totalIII: number };
  
  recordCoachAdvice: (coachId: string) => { newBadges: DualRewardBadge[]; totalIII: number };
  
  recordRiskPreview: () => { newBadges: DualRewardBadge[]; totalIII: number };
  
  // Get badges by category
  getBadgesByCategory: (category: RewardCategory) => {
    earned: DualRewardBadge[];
    locked: DualRewardBadge[];
  };
  
  // Check specific badge
  hasBadge: (badgeId: string) => boolean;
  
  // Get next badge to earn in category
  getNextBadgeInCategory: (category: RewardCategory) => DualRewardBadge | null;
  
  // Sync to backend
  syncToBackend: (newBadges?: DualRewardBadge[]) => Promise<void>;
}

// =============================================================================
// STORAGE & API
// =============================================================================

const STORAGE_KEY = 'minifi_dual_rewards';
const API_BASE = '/api/rewards';

// Helper to get session ID
function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sessionId = localStorage.getItem('minifi_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('minifi_session_id', sessionId);
  }
  return sessionId;
}

const initialProgress: PlayerProgress = {
  investmentsMade: 0,
  highRiskInvestments: 0,
  extremeRiskInvestments: 0,
  lossesExperienced: 0,
  investmentsAfterLoss: 0,
  lastInvestmentWasLoss: false,
  profitAfterConsecutiveLosses: 0,
  consecutiveLosses: 0,
  crisesNavigated: 0,
  bubblesSurvived: 0,
  drawdownsHeld: 0,
  reflectionsCompleted: 0,
  rationalDecisions: 0,
  assetClassesTried: new Set(),
  riskLevelsTried: new Set(),
  coachesUsed: new Set(),
  missionsCompleted: 0,
  perfectQuizzes: 0,
  thesesWritten: 0,
  currentStreak: 0,
  longestStreak: 0,
  riskPreviewsViewed: 0,
  coachAdviceViewed: 0,
};

// =============================================================================
// MAIN HOOK
// =============================================================================

export function useDualRewards(): UseDualRewardsReturn {
  const [earnedBadgeRecords, setEarnedBadgeRecords] = useState<EarnedBadgeRecord[]>([]);
  const [progress, setProgress] = useState<PlayerProgress>(initialProgress);
  const [pendingCelebration, setPendingCelebration] = useState<DualRewardBadge | null>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setEarnedBadgeRecords(data.earnedBadgeRecords || []);
        setProgress({
          ...initialProgress,
          ...data.progress,
          assetClassesTried: new Set(data.progress?.assetClassesTried || []),
          riskLevelsTried: new Set(data.progress?.riskLevelsTried || []),
          coachesUsed: new Set(data.progress?.coachesUsed || []),
        });
      }
    } catch (e) {
      console.error('Failed to load dual rewards:', e);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      const data = {
        earnedBadgeRecords,
        progress: {
          ...progress,
          assetClassesTried: Array.from(progress.assetClassesTried),
          riskLevelsTried: Array.from(progress.riskLevelsTried),
          coachesUsed: Array.from(progress.coachesUsed),
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save dual rewards:', e);
    }
  }, [earnedBadgeRecords, progress]);

  // Computed values
  const earnedBadgeIds = useMemo(() => 
    earnedBadgeRecords.map(r => r.badgeId), 
    [earnedBadgeRecords]
  );

  const earnedBadges = useMemo(() =>
    ALL_BADGES.filter(b => earnedBadgeIds.includes(b.id)),
    [earnedBadgeIds]
  );

  const totalIIIFromBadges = useMemo(() =>
    earnedBadgeRecords.reduce((sum, r) => sum + r.iiiAwarded, 0),
    [earnedBadgeRecords]
  );

  const badgeSummary = useMemo(() =>
    getBadgeSummary(earnedBadgeIds),
    [earnedBadgeIds]
  );

  // Check badge eligibility
  const checkBadgeEligibility = useCallback((badge: DualRewardBadge, prog: PlayerProgress): boolean => {
    const req = badge.requirement;
    const val = badge.requirementValue || 1;

    switch (req) {
      // Effort
      case 'first_investment': return prog.investmentsMade >= 1;
      case 'high_risk_investment': return prog.highRiskInvestments >= 1;
      case 'extreme_risk_investment': return prog.extremeRiskInvestments >= 1;
      case 'risk_previews_viewed': return prog.riskPreviewsViewed >= val;
      case 'coach_advice_viewed': return prog.coachAdviceViewed >= val;

      // Crisis Wisdom
      case 'first_loss': return prog.lossesExperienced >= 1;
      case 'survive_bubble': return prog.bubblesSurvived >= 1;
      case 'hold_through_30_drawdown': return prog.drawdownsHeld >= 1;
      case 'survive_3_crises': return prog.crisesNavigated >= val;
      case 'reflect_all_losses': return prog.reflectionsCompleted >= prog.lossesExperienced && prog.lossesExperienced > 0;
      case 'diversified_through_cycles': return prog.crisesNavigated >= 3 && prog.assetClassesTried.size >= 4;

      // Streak
      case 'streak_days': return prog.currentStreak >= val || prog.longestStreak >= val;

      // Mastery
      case 'missions_completed': return prog.missionsCompleted >= val;
      case 'perfect_quizzes': return prog.perfectQuizzes >= val;
      case 'theses_written': return prog.thesesWritten >= val;

      // Exploration
      case 'risk_levels_tried': return prog.riskLevelsTried.size >= val;
      case 'asset_classes_tried': return prog.assetClassesTried.size >= val;
      case 'coaches_used': return prog.coachesUsed.size >= val;

      // Resilience
      case 'invest_after_loss': return prog.investmentsAfterLoss >= 1;
      case 'losses_experienced': return prog.lossesExperienced >= val;
      case 'profit_after_consecutive_losses': return prog.profitAfterConsecutiveLosses >= val;
      case 'rational_decisions': return prog.rationalDecisions >= val;

      default: return false;
    }
  }, []);

  // Award new badges
  const checkAndAwardBadges = useCallback((newProgress: PlayerProgress): { newBadges: DualRewardBadge[]; totalIII: number } => {
    const newBadges: DualRewardBadge[] = [];
    let totalIII = 0;

    ALL_BADGES.forEach(badge => {
      // Skip if already earned
      if (earnedBadgeIds.includes(badge.id)) return;

      // Check if newly eligible
      if (checkBadgeEligibility(badge, newProgress)) {
        const iiiReward = calculateBadgeIIIReward(badge);
        newBadges.push(badge);
        totalIII += iiiReward;

        setEarnedBadgeRecords(prev => [
          ...prev,
          { badgeId: badge.id, earnedAt: new Date(), iiiAwarded: iiiReward }
        ]);
      }
    });

    // Trigger celebration for first new badge
    if (newBadges.length > 0) {
      setPendingCelebration(newBadges[0]);
    }

    return { newBadges, totalIII };
  }, [earnedBadgeIds, checkBadgeEligibility]);

  // Clear celebration
  const clearCelebration = useCallback(() => {
    setPendingCelebration(null);
  }, []);

  // ==========================================================================
  // ACTION HANDLERS
  // ==========================================================================

  const recordInvestment = useCallback((params: {
    riskLevel: string;
    assetClass: string;
    wasLoss: boolean;
    wasProfit?: boolean;
  }) => {
    const { riskLevel, assetClass, wasLoss, wasProfit } = params;
    const normalizedRisk = riskLevel.toLowerCase();
    const normalizedAsset = assetClass.toLowerCase();

    const newProgress = { ...progress };
    
    newProgress.investmentsMade++;
    newProgress.assetClassesTried = new Set([...progress.assetClassesTried, normalizedAsset]);
    newProgress.riskLevelsTried = new Set([...progress.riskLevelsTried, normalizedRisk]);

    if (normalizedRisk === 'high') newProgress.highRiskInvestments++;
    if (normalizedRisk === 'extreme') newProgress.extremeRiskInvestments++;

    if (wasLoss) {
      newProgress.lossesExperienced++;
      newProgress.consecutiveLosses++;
      newProgress.lastInvestmentWasLoss = true;
    } else {
      if (progress.lastInvestmentWasLoss) {
        newProgress.investmentsAfterLoss++;
      }
      if (wasProfit && progress.consecutiveLosses >= 2) {
        newProgress.profitAfterConsecutiveLosses++;
      }
      newProgress.consecutiveLosses = 0;
      newProgress.lastInvestmentWasLoss = false;
    }

    // Count as rational decision if not panic/FOMO (assume rational unless marked)
    newProgress.rationalDecisions++;

    setProgress(newProgress);
    return checkAndAwardBadges(newProgress);
  }, [progress, checkAndAwardBadges]);

  const recordCrisisAction = useCallback((params: {
    type: 'bubble_survived' | 'drawdown_held' | 'crisis_navigated' | 'rational_decision';
  }) => {
    const newProgress = { ...progress };

    switch (params.type) {
      case 'bubble_survived':
        newProgress.bubblesSurvived++;
        newProgress.crisesNavigated++;
        break;
      case 'drawdown_held':
        newProgress.drawdownsHeld++;
        break;
      case 'crisis_navigated':
        newProgress.crisesNavigated++;
        break;
      case 'rational_decision':
        newProgress.rationalDecisions++;
        break;
    }

    setProgress(newProgress);
    return checkAndAwardBadges(newProgress);
  }, [progress, checkAndAwardBadges]);

  const recordReflection = useCallback(() => {
    const newProgress = {
      ...progress,
      reflectionsCompleted: progress.reflectionsCompleted + 1,
    };
    setProgress(newProgress);
    return checkAndAwardBadges(newProgress);
  }, [progress, checkAndAwardBadges]);

  const recordStreakDay = useCallback((days: number) => {
    const newProgress = {
      ...progress,
      currentStreak: days,
      longestStreak: Math.max(progress.longestStreak, days),
    };
    setProgress(newProgress);
    return checkAndAwardBadges(newProgress);
  }, [progress, checkAndAwardBadges]);

  const recordMissionComplete = useCallback(() => {
    const newProgress = {
      ...progress,
      missionsCompleted: progress.missionsCompleted + 1,
    };
    setProgress(newProgress);
    return checkAndAwardBadges(newProgress);
  }, [progress, checkAndAwardBadges]);

  const recordQuizPerfect = useCallback(() => {
    const newProgress = {
      ...progress,
      perfectQuizzes: progress.perfectQuizzes + 1,
    };
    setProgress(newProgress);
    return checkAndAwardBadges(newProgress);
  }, [progress, checkAndAwardBadges]);

  const recordThesisWritten = useCallback(() => {
    const newProgress = {
      ...progress,
      thesesWritten: progress.thesesWritten + 1,
    };
    setProgress(newProgress);
    return checkAndAwardBadges(newProgress);
  }, [progress, checkAndAwardBadges]);

  const recordCoachAdvice = useCallback((coachId: string) => {
    const newProgress = {
      ...progress,
      coachAdviceViewed: progress.coachAdviceViewed + 1,
      coachesUsed: new Set([...progress.coachesUsed, coachId]),
    };
    setProgress(newProgress);
    return checkAndAwardBadges(newProgress);
  }, [progress, checkAndAwardBadges]);

  const recordRiskPreview = useCallback(() => {
    const newProgress = {
      ...progress,
      riskPreviewsViewed: progress.riskPreviewsViewed + 1,
    };
    setProgress(newProgress);
    return checkAndAwardBadges(newProgress);
  }, [progress, checkAndAwardBadges]);

  // ==========================================================================
  // SYNC TO BACKEND
  // ==========================================================================

  const syncToBackend = useCallback(async (newBadges?: DualRewardBadge[]) => {
    const sessionId = getSessionId();
    if (!sessionId) return;

    try {
      // If new badges were earned, award them on backend
      if (newBadges && newBadges.length > 0) {
        for (const badge of newBadges) {
          const iiiReward = calculateBadgeIIIReward(badge);
          await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'award_badge',
              sessionId,
              data: {
                badgeId: badge.id,
                badgeName: badge.name,
                badgeEmoji: badge.emoji,
                badgeCategory: badge.category,
                badgeTier: badge.tier,
                iiiReward,
                wisdomUnlocked: badge.wisdomUnlocked,
                foWisdom: badge.foWisdom,
              },
            }),
          });
        }
      }

      // Sync full progress state
      await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync_rewards',
          sessionId,
          data: {
            totalIII: totalIIIFromBadges,
            weeklyIII: totalIIIFromBadges,
            stakedIII: 0,
            earnedBadgeIds,
            progress: {
              investmentsMade: progress.investmentsMade,
              highRiskInvestments: progress.highRiskInvestments,
              extremeRiskInvestments: progress.extremeRiskInvestments,
              lossesExperienced: progress.lossesExperienced,
              investmentsAfterLoss: progress.investmentsAfterLoss,
              crisesNavigated: progress.crisesNavigated,
              missionsCompleted: progress.missionsCompleted,
              reflectionsCompleted: progress.reflectionsCompleted,
              assetClassesTried: Array.from(progress.assetClassesTried),
              riskLevelsTried: Array.from(progress.riskLevelsTried),
              coachesUsed: Array.from(progress.coachesUsed),
            },
          },
        }),
      });
    } catch (error) {
      console.error('Failed to sync rewards to backend:', error);
    }
  }, [earnedBadgeIds, progress, totalIIIFromBadges]);

  // Auto-sync when badges change
  useEffect(() => {
    if (earnedBadgeRecords.length > 0) {
      // Debounce sync calls
      const timeoutId = setTimeout(() => {
        syncToBackend();
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [earnedBadgeRecords, syncToBackend]);

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  const getBadgesByCategory = useCallback((category: RewardCategory) => {
    const categoryBadges = ALL_BADGES.filter(b => b.category === category);
    return {
      earned: categoryBadges.filter(b => earnedBadgeIds.includes(b.id)),
      locked: categoryBadges.filter(b => !earnedBadgeIds.includes(b.id)),
    };
  }, [earnedBadgeIds]);

  const hasBadge = useCallback((badgeId: string) => {
    return earnedBadgeIds.includes(badgeId);
  }, [earnedBadgeIds]);

  const getNextBadgeInCategory = useCallback((category: RewardCategory) => {
    const { locked } = getBadgesByCategory(category);
    return locked[0] || null;
  }, [getBadgesByCategory]);

  return {
    earnedBadgeIds,
    earnedBadges,
    pendingCelebration,
    clearCelebration,
    progress,
    totalIIIFromBadges,
    badgeSummary,
    recordInvestment,
    recordCrisisAction,
    recordReflection,
    recordStreakDay,
    recordMissionComplete,
    recordQuizPerfect,
    recordThesisWritten,
    recordCoachAdvice,
    recordRiskPreview,
    getBadgesByCategory,
    hasBadge,
    getNextBadgeInCategory,
    syncToBackend,
  };
}

export default useDualRewards;

