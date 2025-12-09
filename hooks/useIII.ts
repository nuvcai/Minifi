/**
 * useIII - Unified iii Token System
 * 
 * iii tokens are the single currency for Mini.Fi:
 * - Earn iii through gameplay (missions, investments, streaks)
 * - Stake iii to earn passive rewards
 * - Compete in leagues with weekly iii rankings
 * 
 * Philosophy: One token to rule them all. Earn → Stake → Compete.
 */

'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { LEAGUES, type League } from '@/components/gamification/LeagueSystem';

// =============================================================================
// iii TOKEN BRANDING
// =============================================================================

export const III_CONFIG = {
  name: 'iii',
  symbol: 'iii',
  emoji: '✦', // iii token symbol
  color: 'text-violet-500',
  bgGradient: 'from-violet-500 to-purple-600',
  description: 'Mini.Fi learning tokens - stake to earn more!',
} as const;

// =============================================================================
// iii REWARDS - Single source of truth for all token values
// =============================================================================

export const III_REWARDS = {
  // Mission rewards (base values)
  MISSION_COMPLETE: 100,
  MISSION_FIRST_TIME: 50, // Bonus for first completion
  
  // Courage/Action rewards
  FIRST_INVESTMENT: 50,
  HIGH_RISK_INVESTMENT: 20,
  EXTREME_RISK_INVESTMENT: 25,
  LOSS_LESSON: 30, // iii for experiencing a loss (learning!)
  INVEST_AFTER_LOSS: 40, // Resilience bonus
  
  // Exploration rewards
  NEW_ASSET_CLASS: 15,
  NEW_RISK_LEVEL: 15,
  COACH_ADVICE_VIEWED: 10,
  RISK_PREVIEW_VIEWED: 5,
  
  // Engagement rewards
  QUIZ_CORRECT: 10,
  QUIZ_PERFECT: 50, // All questions correct
  THESIS_WRITTEN: 25,
  
  // Streak multipliers
  STREAK_BASE: 10,
  STREAK_3_DAY: 25,
  STREAK_5_DAY: 40,
  STREAK_7_DAY: 75,
  STREAK_14_DAY: 150,
  STREAK_21_DAY: 250,
  STREAK_30_DAY: 500,
  
  // Staking rewards multipliers
  STAKING_DAILY_BASE: 0.001, // 0.1% daily base yield
  STAKING_STREAK_BONUS: 0.5, // 50% bonus with 7+ day streak
} as const;

// =============================================================================
// LEVEL SYSTEM
// =============================================================================

export const LEVEL_CONFIG = {
  III_PER_LEVEL: 1000,
  MAX_LEVEL: 50,
} as const;

export function getLevel(iii: number): number {
  return Math.min(Math.floor(iii / LEVEL_CONFIG.III_PER_LEVEL) + 1, LEVEL_CONFIG.MAX_LEVEL);
}

export function getIIIInCurrentLevel(iii: number): number {
  return iii % LEVEL_CONFIG.III_PER_LEVEL;
}

export function getIIIToNextLevel(iii: number): number {
  return LEVEL_CONFIG.III_PER_LEVEL - getIIIInCurrentLevel(iii);
}

export function getLevelProgress(iii: number): number {
  return (getIIIInCurrentLevel(iii) / LEVEL_CONFIG.III_PER_LEVEL) * 100;
}

// =============================================================================
// LEAGUE HELPERS
// =============================================================================

export function getLeagueByIII(totalIII: number): League {
  for (let i = LEAGUES.length - 1; i >= 0; i--) {
    if (totalIII >= LEAGUES[i].minXpToEnter) {
      return LEAGUES[i];
    }
  }
  return LEAGUES[0];
}

export function getNextLeague(currentLeague: League): League | null {
  const currentIndex = LEAGUES.findIndex(l => l.id === currentLeague.id);
  if (currentIndex < LEAGUES.length - 1) {
    return LEAGUES[currentIndex + 1];
  }
  return null;
}

export function getIIIToNextLeague(totalIII: number): number | null {
  const currentLeague = getLeagueByIII(totalIII);
  const nextLeague = getNextLeague(currentLeague);
  if (nextLeague) {
    return nextLeague.minXpToEnter - totalIII;
  }
  return null;
}

// =============================================================================
// ACHIEVEMENT BADGES (Cosmetic only - no separate currency)
// =============================================================================

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: 'courage' | 'exploration' | 'mastery' | 'streak' | 'staking' | 'special';
  requirement: string;
  isEarned: (stats: PlayerStats) => boolean;
}

export const BADGES: Badge[] = [
  // Courage badges
  {
    id: 'first-risk',
    name: 'First Steps',
    description: 'Made your first investment',
    emoji: '🌱',
    category: 'courage',
    requirement: 'first_investment',
    isEarned: (stats) => stats.investmentsMade >= 1,
  },
  {
    id: 'bold-move',
    name: 'Bold Move',
    description: 'Made a high-risk investment',
    emoji: '⚡',
    category: 'courage',
    requirement: 'high_risk',
    isEarned: (stats) => stats.highRiskInvestments >= 1,
  },
  {
    id: 'fearless',
    name: 'Fearless Explorer',
    description: 'Made an extreme-risk investment',
    emoji: '🔥',
    category: 'courage',
    requirement: 'extreme_risk',
    isEarned: (stats) => stats.extremeRiskInvestments >= 1,
  },
  {
    id: 'resilient',
    name: 'Resilient Spirit',
    description: 'Invested again after a loss',
    emoji: '💪',
    category: 'courage',
    requirement: 'invest_after_loss',
    isEarned: (stats) => stats.investmentsAfterLoss >= 1,
  },
  {
    id: 'battle-tested',
    name: 'Battle Tested',
    description: 'Experienced 3 losses and kept going',
    emoji: '🛡️',
    category: 'courage',
    requirement: 'losses_experienced',
    isEarned: (stats) => stats.lossesExperienced >= 3,
  },
  
  // Exploration badges
  {
    id: 'diversifier',
    name: 'Diversifier',
    description: 'Explored 3 different asset classes',
    emoji: '🗺️',
    category: 'exploration',
    requirement: 'asset_classes',
    isEarned: (stats) => stats.assetClassesExplored >= 3,
  },
  {
    id: 'asset-master',
    name: 'Asset Master',
    description: 'Explored all 6 asset classes',
    emoji: '👑',
    category: 'exploration',
    requirement: 'all_assets',
    isEarned: (stats) => stats.assetClassesExplored >= 6,
  },
  {
    id: 'risk-spectrum',
    name: 'Full Spectrum',
    description: 'Tried all risk levels',
    emoji: '🌈',
    category: 'exploration',
    requirement: 'all_risks',
    isEarned: (stats) => stats.riskLevelsExplored >= 5,
  },
  {
    id: 'coach-collector',
    name: 'Open Minded',
    description: 'Got advice from all 4 coaches',
    emoji: '🧠',
    category: 'exploration',
    requirement: 'all_coaches',
    isEarned: (stats) => stats.coachesUsed >= 4,
  },
  
  // Mastery badges
  {
    id: 'mission-starter',
    name: 'Mission Starter',
    description: 'Completed your first mission',
    emoji: '🎯',
    category: 'mastery',
    requirement: 'missions_1',
    isEarned: (stats) => stats.missionsCompleted >= 1,
  },
  {
    id: 'mission-veteran',
    name: 'Mission Veteran',
    description: 'Completed 3 missions',
    emoji: '🎖️',
    category: 'mastery',
    requirement: 'missions_3',
    isEarned: (stats) => stats.missionsCompleted >= 3,
  },
  {
    id: 'history-scholar',
    name: 'History Scholar',
    description: 'Completed all 6 historical missions',
    emoji: '🎓',
    category: 'mastery',
    requirement: 'missions_6',
    isEarned: (stats) => stats.missionsCompleted >= 6,
  },
  
  // Streak badges
  {
    id: 'streak-3',
    name: '3-Day Streak',
    description: '3 days in a row!',
    emoji: '🔥',
    category: 'streak',
    requirement: 'streak_3',
    isEarned: (stats) => stats.longestStreak >= 3,
  },
  {
    id: 'streak-7',
    name: 'Weekly Warrior',
    description: '7 days in a row!',
    emoji: '⚔️',
    category: 'streak',
    requirement: 'streak_7',
    isEarned: (stats) => stats.longestStreak >= 7,
  },
  {
    id: 'streak-30',
    name: 'Monthly Legend',
    description: '30 days in a row!',
    emoji: '👑',
    category: 'streak',
    requirement: 'streak_30',
    isEarned: (stats) => stats.longestStreak >= 30,
  },
  
  // Staking badges
  {
    id: 'first-stake',
    name: 'First Stake',
    description: 'Staked iii tokens for the first time',
    emoji: '🔒',
    category: 'staking',
    requirement: 'first_stake',
    isEarned: (stats) => stats.totalStaked > 0,
  },
  {
    id: 'whale',
    name: 'Whale',
    description: 'Staked 10,000+ iii tokens',
    emoji: '🐋',
    category: 'staking',
    requirement: 'whale_stake',
    isEarned: (stats) => stats.totalStaked >= 10000,
  },
  {
    id: 'yield-farmer',
    name: 'Yield Farmer',
    description: 'Earned 1,000+ iii from staking rewards',
    emoji: '🌾',
    category: 'staking',
    requirement: 'yield_earned',
    isEarned: (stats) => stats.stakingRewardsEarned >= 1000,
  },
];

// =============================================================================
// TYPES
// =============================================================================

export interface PlayerStats {
  // Investments
  investmentsMade: number;
  highRiskInvestments: number;
  extremeRiskInvestments: number;
  lossesExperienced: number;
  investmentsAfterLoss: number;
  lastInvestmentWasLoss: boolean;
  
  // Exploration
  assetClassesExplored: number;
  assetClasses: Set<string>;
  riskLevelsExplored: number;
  riskLevels: Set<string>;
  coachesUsed: number;
  coaches: Set<string>;
  
  // Progress
  missionsCompleted: number;
  completedMissions: string[];
  quizzesPassed: number;
  thesesWritten: number;
  
  // Streaks
  currentStreak: number;
  longestStreak: number;
  totalDaysPlayed: number;
  lastPlayDate: string | null;
  
  // Staking
  totalStaked: number;
  stakingRewardsEarned: number;
}

export interface IIITransaction {
  id: string;
  amount: number;
  source: string;
  description: string;
  timestamp: Date;
}

export interface UseIIIReturn {
  // Core iii tokens
  totalIII: number;
  level: number;
  iiiInLevel: number;
  iiiToNextLevel: number;
  levelProgress: number;
  
  // Weekly iii (for leagues)
  weeklyIII: number;
  
  // League
  league: League;
  nextLeague: League | null;
  iiiToNextLeague: number | null;
  
  // Stats & Badges
  stats: PlayerStats;
  earnedBadges: Badge[];
  
  // Recent transactions
  recentTransactions: IIITransaction[];
  
  // Actions
  addIII: (amount: number, source: string, description?: string) => void;
  spendIII: (amount: number, source: string, description?: string) => boolean;
  recordInvestment: (riskLevel: string, assetClass: string, wasLoss: boolean) => number;
  recordCoachAdvice: (coachId: string) => number;
  recordRiskPreview: () => number;
  recordMissionComplete: (missionTitle: string, baseReward: number) => number;
  recordQuizComplete: (correct: number, total: number) => number;
  recordThesis: () => number;
  recordStreakClaim: (streakDays: number) => number;
  recordStakingReward: (amount: number) => void;
  updateStakedAmount: (stakedAmount: number) => void;
  
  // Helpers
  getStreakBonus: (days: number) => number;
  formatIII: (amount: number) => string;
  
  // Welcome bonus for new users
  claimWelcomeBonus: (bonus: number) => void;
  
  // Config
  config: typeof III_CONFIG;
}

// =============================================================================
// STORAGE
// =============================================================================

const STORAGE_KEY = 'minifi_iii_data';
const WEEKLY_STORAGE_KEY = 'minifi_weekly_iii';

const initialStats: PlayerStats = {
  investmentsMade: 0,
  highRiskInvestments: 0,
  extremeRiskInvestments: 0,
  lossesExperienced: 0,
  investmentsAfterLoss: 0,
  lastInvestmentWasLoss: false,
  assetClassesExplored: 0,
  assetClasses: new Set(),
  riskLevelsExplored: 0,
  riskLevels: new Set(),
  coachesUsed: 0,
  coaches: new Set(),
  missionsCompleted: 0,
  completedMissions: [],
  quizzesPassed: 0,
  thesesWritten: 0,
  currentStreak: 0,
  longestStreak: 0,
  totalDaysPlayed: 0,
  lastPlayDate: null,
  totalStaked: 0,
  stakingRewardsEarned: 0,
};

// =============================================================================
// MAIN HOOK
// =============================================================================

export function useIII(): UseIIIReturn {
  const [totalIII, setTotalIII] = useState(0);
  const [weeklyIII, setWeeklyIII] = useState(0);
  const [stats, setStats] = useState<PlayerStats>(initialStats);
  const [transactions, setTransactions] = useState<IIITransaction[]>([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setTotalIII(data.totalIII || 0);
        setStats({
          ...initialStats,
          ...data.stats,
          assetClasses: new Set(data.stats?.assetClasses || []),
          riskLevels: new Set(data.stats?.riskLevels || []),
          coaches: new Set(data.stats?.coaches || []),
        });
        setTransactions(data.transactions?.slice(0, 50) || []);
      }
      
      // Load weekly iii separately (resets each week)
      const weeklyData = localStorage.getItem(WEEKLY_STORAGE_KEY);
      if (weeklyData) {
        const { iii, weekStart } = JSON.parse(weeklyData);
        const currentWeekStart = getWeekStart();
        if (weekStart === currentWeekStart) {
          setWeeklyIII(iii);
        } else {
          localStorage.setItem(WEEKLY_STORAGE_KEY, JSON.stringify({ iii: 0, weekStart: currentWeekStart }));
        }
      }
    } catch (e) {
      console.error('Failed to load iii data:', e);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      const data = {
        totalIII,
        stats: {
          ...stats,
          assetClasses: Array.from(stats.assetClasses),
          riskLevels: Array.from(stats.riskLevels),
          coaches: Array.from(stats.coaches),
        },
        transactions: transactions.slice(0, 50),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(WEEKLY_STORAGE_KEY, JSON.stringify({ iii: weeklyIII, weekStart: getWeekStart() }));
    } catch (e) {
      console.error('Failed to save iii data:', e);
    }
  }, [totalIII, weeklyIII, stats, transactions]);

  // Computed values
  const level = useMemo(() => getLevel(totalIII), [totalIII]);
  const iiiInLevel = useMemo(() => getIIIInCurrentLevel(totalIII), [totalIII]);
  const iiiToNextLevel = useMemo(() => getIIIToNextLevel(totalIII), [totalIII]);
  const levelProgress = useMemo(() => getLevelProgress(totalIII), [totalIII]);
  const league = useMemo(() => getLeagueByIII(totalIII), [totalIII]);
  const nextLeague = useMemo(() => getNextLeague(league), [league]);
  const iiiToNextLeagueValue = useMemo(() => getIIIToNextLeague(totalIII), [totalIII]);
  
  // Earned badges
  const earnedBadges = useMemo(() => {
    return BADGES.filter(badge => badge.isEarned(stats));
  }, [stats]);

  // Format iii for display
  const formatIII = useCallback((amount: number): string => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M ${III_CONFIG.symbol}`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}k ${III_CONFIG.symbol}`;
    }
    return `${amount.toLocaleString()} ${III_CONFIG.symbol}`;
  }, []);

  // Add iii (core function)
  const addIII = useCallback((amount: number, source: string, description?: string) => {
    const transaction: IIITransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      amount,
      source,
      description: description || source,
      timestamp: new Date(),
    };
    
    setTotalIII(prev => prev + amount);
    setWeeklyIII(prev => prev + amount);
    setTransactions(prev => [transaction, ...prev].slice(0, 50));
  }, []);

  // Spend iii (for staking)
  const spendIII = useCallback((amount: number, source: string, description?: string): boolean => {
    if (totalIII < amount) return false;
    
    const transaction: IIITransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      amount: -amount,
      source,
      description: description || source,
      timestamp: new Date(),
    };
    
    setTotalIII(prev => prev - amount);
    setTransactions(prev => [transaction, ...prev].slice(0, 50));
    return true;
  }, [totalIII]);

  // Record investment
  const recordInvestment = useCallback((riskLevel: string, assetClass: string, wasLoss: boolean): number => {
    let iiiEarned = 0;
    const normalizedRisk = riskLevel.toLowerCase();
    const normalizedAsset = assetClass.toLowerCase();
    
    setStats(prev => {
      const isFirstInvestment = prev.investmentsMade === 0;
      const isNewAssetClass = !prev.assetClasses.has(normalizedAsset);
      const isNewRiskLevel = !prev.riskLevels.has(normalizedRisk);
      const isHighRisk = normalizedRisk === 'high';
      const isExtremeRisk = normalizedRisk === 'extreme';
      const investedAfterLoss = prev.lastInvestmentWasLoss && !wasLoss;
      
      // Calculate iii
      if (isFirstInvestment) iiiEarned += III_REWARDS.FIRST_INVESTMENT;
      if (isNewAssetClass) iiiEarned += III_REWARDS.NEW_ASSET_CLASS;
      if (isNewRiskLevel) iiiEarned += III_REWARDS.NEW_RISK_LEVEL;
      if (isHighRisk) iiiEarned += III_REWARDS.HIGH_RISK_INVESTMENT;
      if (isExtremeRisk) iiiEarned += III_REWARDS.EXTREME_RISK_INVESTMENT;
      if (wasLoss) iiiEarned += III_REWARDS.LOSS_LESSON;
      if (investedAfterLoss) iiiEarned += III_REWARDS.INVEST_AFTER_LOSS;
      
      const newAssetClasses = new Set(prev.assetClasses);
      newAssetClasses.add(normalizedAsset);
      
      const newRiskLevels = new Set(prev.riskLevels);
      newRiskLevels.add(normalizedRisk);
      
      return {
        ...prev,
        investmentsMade: prev.investmentsMade + 1,
        highRiskInvestments: isHighRisk ? prev.highRiskInvestments + 1 : prev.highRiskInvestments,
        extremeRiskInvestments: isExtremeRisk ? prev.extremeRiskInvestments + 1 : prev.extremeRiskInvestments,
        lossesExperienced: wasLoss ? prev.lossesExperienced + 1 : prev.lossesExperienced,
        investmentsAfterLoss: investedAfterLoss ? prev.investmentsAfterLoss + 1 : prev.investmentsAfterLoss,
        lastInvestmentWasLoss: wasLoss,
        assetClasses: newAssetClasses,
        assetClassesExplored: newAssetClasses.size,
        riskLevels: newRiskLevels,
        riskLevelsExplored: newRiskLevels.size,
      };
    });
    
    if (iiiEarned > 0) {
      addIII(iiiEarned, 'investment', `Investment rewards`);
    }
    
    return iiiEarned;
  }, [addIII]);

  // Record coach advice
  const recordCoachAdvice = useCallback((coachId: string): number => {
    let iiiEarned = 0;
    
    setStats(prev => {
      const isNewCoach = !prev.coaches.has(coachId);
      if (isNewCoach) {
        iiiEarned = III_REWARDS.COACH_ADVICE_VIEWED;
      }
      
      const newCoaches = new Set(prev.coaches);
      newCoaches.add(coachId);
      
      return {
        ...prev,
        coaches: newCoaches,
        coachesUsed: newCoaches.size,
      };
    });
    
    if (iiiEarned > 0) {
      addIII(iiiEarned, 'coach', 'Coach advice viewed');
    }
    
    return iiiEarned;
  }, [addIII]);

  // Record risk preview
  const recordRiskPreview = useCallback((): number => {
    addIII(III_REWARDS.RISK_PREVIEW_VIEWED, 'preview', 'Risk preview viewed');
    return III_REWARDS.RISK_PREVIEW_VIEWED;
  }, [addIII]);

  // Record mission complete
  const recordMissionComplete = useCallback((missionTitle: string, baseReward: number): number => {
    let iiiEarned = baseReward;
    
    setStats(prev => {
      const isFirstTime = !prev.completedMissions.includes(missionTitle);
      if (isFirstTime) {
        iiiEarned += III_REWARDS.MISSION_FIRST_TIME;
      }
      
      return {
        ...prev,
        missionsCompleted: prev.missionsCompleted + 1,
        completedMissions: isFirstTime 
          ? [...prev.completedMissions, missionTitle]
          : prev.completedMissions,
      };
    });
    
    addIII(iiiEarned, 'mission', `Mission: ${missionTitle}`);
    return iiiEarned;
  }, [addIII]);

  // Record quiz complete
  const recordQuizComplete = useCallback((correct: number, total: number): number => {
    let iiiEarned = correct * III_REWARDS.QUIZ_CORRECT;
    
    if (correct === total && total > 0) {
      iiiEarned += III_REWARDS.QUIZ_PERFECT;
      setStats(prev => ({
        ...prev,
        quizzesPassed: prev.quizzesPassed + 1,
      }));
    }
    
    addIII(iiiEarned, 'quiz', `Quiz: ${correct}/${total} correct`);
    return iiiEarned;
  }, [addIII]);

  // Record thesis
  const recordThesis = useCallback((): number => {
    setStats(prev => ({
      ...prev,
      thesesWritten: prev.thesesWritten + 1,
    }));
    
    addIII(III_REWARDS.THESIS_WRITTEN, 'thesis', 'Investment thesis written');
    return III_REWARDS.THESIS_WRITTEN;
  }, [addIII]);

  // Get streak bonus
  const getStreakBonus = useCallback((days: number): number => {
    if (days >= 30) return III_REWARDS.STREAK_30_DAY;
    if (days >= 21) return III_REWARDS.STREAK_21_DAY;
    if (days >= 14) return III_REWARDS.STREAK_14_DAY;
    if (days >= 7) return III_REWARDS.STREAK_7_DAY;
    if (days >= 5) return III_REWARDS.STREAK_5_DAY;
    if (days >= 3) return III_REWARDS.STREAK_3_DAY;
    return III_REWARDS.STREAK_BASE;
  }, []);

  // Record streak claim
  const recordStreakClaim = useCallback((streakDays: number): number => {
    const bonus = getStreakBonus(streakDays);
    
    setStats(prev => ({
      ...prev,
      currentStreak: streakDays,
      longestStreak: Math.max(prev.longestStreak, streakDays),
      totalDaysPlayed: prev.totalDaysPlayed + 1,
      lastPlayDate: new Date().toDateString(),
    }));
    
    addIII(bonus, 'streak', `${streakDays}-day streak bonus`);
    return bonus;
  }, [addIII, getStreakBonus]);

  // Record staking reward
  const recordStakingReward = useCallback((amount: number) => {
    setStats(prev => ({
      ...prev,
      stakingRewardsEarned: prev.stakingRewardsEarned + amount,
    }));
    addIII(amount, 'staking', 'Staking rewards');
  }, [addIII]);

  // Update staked amount (for badge tracking)
  const updateStakedAmount = useCallback((stakedAmount: number) => {
    setStats(prev => ({
      ...prev,
      totalStaked: stakedAmount,
    }));
  }, []);

  // Claim welcome bonus for new users
  const claimWelcomeBonus = useCallback((bonus: number) => {
    addIII(bonus, 'welcome', '🎉 Welcome bonus for completing onboarding!');
  }, [addIII]);

  return {
    // Core iii
    totalIII,
    level,
    iiiInLevel,
    iiiToNextLevel,
    levelProgress,
    
    // Weekly
    weeklyIII,
    
    // League
    league,
    nextLeague,
    iiiToNextLeague: iiiToNextLeagueValue,
    
    // Stats & Badges
    stats,
    earnedBadges,
    
    // Transactions
    recentTransactions: transactions,
    
    // Actions
    addIII,
    spendIII,
    recordInvestment,
    recordCoachAdvice,
    recordRiskPreview,
    recordMissionComplete,
    recordQuizComplete,
    recordThesis,
    recordStreakClaim,
    recordStakingReward,
    updateStakedAmount,
    
    // Helpers
    getStreakBonus,
    formatIII,
    
    // Welcome bonus
    claimWelcomeBonus,
    
    // Config
    config: III_CONFIG,
  };
}

// =============================================================================
// HELPERS
// =============================================================================

function getWeekStart(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split('T')[0];
}

export default useIII;

