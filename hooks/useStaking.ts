/**
 * useStaking - Hook for managing staking state and operations
 * Solana-inspired staking with Flybuys-style rewards
 */

import { useState, useCallback, useEffect, useMemo } from "react";
import {
  UserStake,
  StakingStats,
  FlybuysPoints,
  PointsTransaction,
  ActiveBoost,
  StakingPool,
} from "@/components/gamification/stakingTypes";
import {
  stakingPools,
  membershipTiers,
  getPoolById,
  getTierByPoints,
  getNextTier,
  calculateDailyYield,
} from "@/components/gamification/stakingData";

// Storage keys
const STAKING_STORAGE_KEY = "minifi_staking_data";
const POINTS_STORAGE_KEY = "minifi_flybuys_points";
const TRANSACTIONS_KEY = "minifi_points_transactions";

interface StakingState {
  stakes: UserStake[];
  stats: StakingStats;
  points: FlybuysPoints;
  transactions: PointsTransaction[];
  activeBoosts: ActiveBoost[];
}

interface UseStakingReturn {
  // State
  stakes: UserStake[];
  stats: StakingStats;
  points: FlybuysPoints;
  transactions: PointsTransaction[];
  activeBoosts: ActiveBoost[];
  availablePools: StakingPool[];
  
  // Actions
  stake: (poolId: string, amount: number) => { success: boolean; message: string };
  unstake: (stakeId: string, forceEarly?: boolean) => { success: boolean; amount: number; penalty: number };
  claimRewards: (stakeId: string) => { success: boolean; amount: number };
  claimAllRewards: () => { success: boolean; totalAmount: number };
  compoundRewards: (stakeId: string) => { success: boolean; compounded: number };
  
  // Points actions
  earnPoints: (amount: number, source: string, description: string) => void;
  redeemPoints: (amount: number, description: string) => boolean;
  
  // Boost actions
  activateBoost: (boostId: string) => boolean;
  
  // Helpers
  getStakeById: (id: string) => UserStake | undefined;
  calculatePendingRewards: (stake: UserStake) => number;
  getEffectiveAPY: (poolId: string) => number;
  canUnstake: (stakeId: string) => { canUnstake: boolean; penalty: number; daysRemaining: number };
}

const initialStats: StakingStats = {
  totalStaked: 0,
  totalEarned: 0,
  activeStakes: 0,
  currentAPY: 0,
  streakBonus: 0,
};

const initialPoints: FlybuysPoints = {
  balance: 0,
  lifetimeEarned: 0,
  lifetimeRedeemed: 0,
  tier: "starter",
  tierProgress: 0,
};

export function useStaking(currentXP: number = 0, streakDays: number = 0): UseStakingReturn {
  const [stakes, setStakes] = useState<UserStake[]>([]);
  const [stats, setStats] = useState<StakingStats>(initialStats);
  const [points, setPoints] = useState<FlybuysPoints>(initialPoints);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [activeBoosts, setActiveBoosts] = useState<ActiveBoost[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedStaking = localStorage.getItem(STAKING_STORAGE_KEY);
      const savedPoints = localStorage.getItem(POINTS_STORAGE_KEY);
      const savedTransactions = localStorage.getItem(TRANSACTIONS_KEY);

      if (savedStaking) {
        const data = JSON.parse(savedStaking);
        setStakes(data.stakes?.map((s: UserStake) => ({
          ...s,
          stakedAt: new Date(s.stakedAt),
          unlocksAt: new Date(s.unlocksAt),
          lastClaimAt: new Date(s.lastClaimAt),
        })) || []);
        setActiveBoosts(data.activeBoosts?.map((b: ActiveBoost) => ({
          ...b,
          expiresAt: new Date(b.expiresAt),
        })) || []);
      }

      if (savedPoints) {
        setPoints(JSON.parse(savedPoints));
      }

      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions).map((t: PointsTransaction) => ({
          ...t,
          timestamp: new Date(t.timestamp),
        })));
      }
    } catch (e) {
      console.error("Failed to load staking data:", e);
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(STAKING_STORAGE_KEY, JSON.stringify({ stakes, activeBoosts }));
      localStorage.setItem(POINTS_STORAGE_KEY, JSON.stringify(points));
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions.slice(-100))); // Keep last 100
    } catch (e) {
      console.error("Failed to save staking data:", e);
    }
  }, [stakes, points, transactions, activeBoosts]);

  // Update stats when stakes change
  useEffect(() => {
    const totalStaked = stakes.reduce((sum, s) => sum + s.amount, 0);
    const totalEarned = stakes.reduce((sum, s) => sum + s.totalEarned, 0);
    const activeStakes = stakes.length;
    
    // Calculate weighted average APY
    let weightedAPY = 0;
    if (totalStaked > 0) {
      stakes.forEach(stake => {
        const pool = getPoolById(stake.poolId);
        if (pool) {
          weightedAPY += (stake.amount / totalStaked) * pool.apyPercent;
        }
      });
    }

    // Streak bonus calculation
    const streakBonus = streakDays >= 7 ? 1.5 : streakDays >= 3 ? 1.25 : 1.0;

    setStats({
      totalStaked,
      totalEarned,
      activeStakes,
      currentAPY: weightedAPY,
      streakBonus,
    });
  }, [stakes, streakDays]);

  // Update tier when points change
  useEffect(() => {
    const currentTier = getTierByPoints(points.lifetimeEarned);
    const nextTier = getNextTier(points.lifetimeEarned);
    
    let tierProgress = 100;
    if (nextTier) {
      const currentMin = currentTier.minPoints;
      const nextMin = nextTier.minPoints;
      tierProgress = ((points.lifetimeEarned - currentMin) / (nextMin - currentMin)) * 100;
    }

    setPoints(prev => ({
      ...prev,
      tier: currentTier.tier,
      tierProgress: Math.min(tierProgress, 100),
    }));
  }, [points.lifetimeEarned]);

  // Clean up expired boosts
  useEffect(() => {
    const now = new Date();
    setActiveBoosts(prev => prev.filter(b => new Date(b.expiresAt) > now));
  }, []);

  // Available pools based on current XP
  const availablePools = useMemo(() => {
    return stakingPools.filter(pool => currentXP >= pool.minStake);
  }, [currentXP]);

  // Calculate pending rewards for a stake
  const calculatePendingRewards = useCallback((stake: UserStake): number => {
    const pool = getPoolById(stake.poolId);
    if (!pool) return 0;

    const now = new Date();
    const lastClaim = new Date(stake.lastClaimAt);
    const daysSinceClaim = Math.floor((now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceClaim < 1) return stake.pendingRewards;

    const dailyYield = calculateDailyYield(stake.amount, pool, streakDays);
    const newRewards = dailyYield * daysSinceClaim;
    
    return stake.pendingRewards + newRewards;
  }, [streakDays]);

  // Get effective APY with boosts and tier bonuses
  const getEffectiveAPY = useCallback((poolId: string): number => {
    const pool = getPoolById(poolId);
    if (!pool) return 0;

    const tier = getTierByPoints(points.lifetimeEarned);
    let apy = pool.apyPercent + tier.bonusStakingAPY;

    // Apply active boosts
    activeBoosts.forEach(boost => {
      apy *= boost.multiplier;
    });

    // Streak bonus
    if (streakDays >= 7) {
      apy *= pool.streakMultiplier;
    }

    return Math.round(apy * 100) / 100;
  }, [points.lifetimeEarned, activeBoosts, streakDays]);

  // Stake XP
  const stake = useCallback((poolId: string, amount: number): { success: boolean; message: string } => {
    const pool = getPoolById(poolId);
    if (!pool) {
      return { success: false, message: "Invalid pool" };
    }

    if (amount < pool.minStake) {
      return { success: false, message: `Minimum stake is ${pool.minStake} XP` };
    }

    if (amount > pool.maxStake) {
      return { success: false, message: `Maximum stake is ${pool.maxStake} XP` };
    }

    if (amount > currentXP) {
      return { success: false, message: "Insufficient XP balance" };
    }

    const now = new Date();
    const unlocksAt = new Date(now.getTime() + pool.lockPeriod * 24 * 60 * 60 * 1000);

    const newStake: UserStake = {
      id: `stake_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      poolId,
      amount,
      stakedAt: now,
      unlocksAt,
      lastClaimAt: now,
      totalEarned: 0,
      pendingRewards: 0,
      isLocked: pool.lockPeriod > 0,
      autoCompound: false,
    };

    setStakes(prev => [...prev, newStake]);

    // Record transaction
    const transaction: PointsTransaction = {
      id: `tx_${Date.now()}`,
      type: "earn",
      amount: 0, // Points earned on rewards, not on stake
      description: `Staked ${amount} XP in ${pool.name}`,
      timestamp: now,
      source: "staking",
    };
    setTransactions(prev => [transaction, ...prev]);

    return { success: true, message: `Successfully staked ${amount} XP in ${pool.name}` };
  }, [currentXP]);

  // Check if can unstake
  const canUnstake = useCallback((stakeId: string): { canUnstake: boolean; penalty: number; daysRemaining: number } => {
    const stake = stakes.find(s => s.id === stakeId);
    if (!stake) {
      return { canUnstake: false, penalty: 0, daysRemaining: 0 };
    }

    const pool = getPoolById(stake.poolId);
    if (!pool) {
      return { canUnstake: false, penalty: 0, daysRemaining: 0 };
    }

    const now = new Date();
    const unlocksAt = new Date(stake.unlocksAt);
    const isUnlocked = now >= unlocksAt;
    const daysRemaining = Math.max(0, Math.ceil((unlocksAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    return {
      canUnstake: true, // Can always unstake, but may have penalty
      penalty: isUnlocked ? 0 : pool.earlyUnstakePenalty,
      daysRemaining,
    };
  }, [stakes]);

  // Unstake
  const unstake = useCallback((stakeId: string, forceEarly: boolean = false): { success: boolean; amount: number; penalty: number } => {
    const stake = stakes.find(s => s.id === stakeId);
    if (!stake) {
      return { success: false, amount: 0, penalty: 0 };
    }

    const { penalty, daysRemaining } = canUnstake(stakeId);
    
    if (daysRemaining > 0 && !forceEarly) {
      return { success: false, amount: 0, penalty };
    }

    const penaltyAmount = forceEarly ? Math.floor(stake.amount * (penalty / 100)) : 0;
    const returnAmount = stake.amount - penaltyAmount + stake.pendingRewards;

    setStakes(prev => prev.filter(s => s.id !== stakeId));

    // Record transaction
    const transaction: PointsTransaction = {
      id: `tx_${Date.now()}`,
      type: "earn",
      amount: Math.floor(stake.pendingRewards * 0.1), // 10% of rewards as points
      description: `Unstaked ${stake.amount} XP${penaltyAmount > 0 ? ` (${penalty}% penalty)` : ""}`,
      timestamp: new Date(),
      source: "staking",
    };
    setTransactions(prev => [transaction, ...prev]);

    // Add points from rewards
    if (stake.pendingRewards > 0) {
      earnPoints(Math.floor(stake.pendingRewards * 0.1), "staking", "Staking rewards bonus");
    }

    return { success: true, amount: returnAmount, penalty: penaltyAmount };
  }, [stakes, canUnstake]);

  // Claim rewards
  const claimRewards = useCallback((stakeId: string): { success: boolean; amount: number } => {
    const stakeIndex = stakes.findIndex(s => s.id === stakeId);
    if (stakeIndex === -1) {
      return { success: false, amount: 0 };
    }

    const stake = stakes[stakeIndex];
    const pending = calculatePendingRewards(stake);
    
    if (pending <= 0) {
      return { success: false, amount: 0 };
    }

    // Update stake
    const updatedStake: UserStake = {
      ...stake,
      pendingRewards: 0,
      totalEarned: stake.totalEarned + pending,
      lastClaimAt: new Date(),
    };

    setStakes(prev => {
      const newStakes = [...prev];
      newStakes[stakeIndex] = updatedStake;
      return newStakes;
    });

    // Earn points (10% of XP rewards as Flybuys points)
    const pointsEarned = Math.floor(pending * 0.1);
    earnPoints(pointsEarned, "stake_reward", `Claimed ${pending} XP staking rewards`);

    return { success: true, amount: pending };
  }, [stakes, calculatePendingRewards]);

  // Claim all rewards
  const claimAllRewards = useCallback((): { success: boolean; totalAmount: number } => {
    let totalAmount = 0;

    stakes.forEach(stake => {
      const { success, amount } = claimRewards(stake.id);
      if (success) {
        totalAmount += amount;
      }
    });

    return { success: totalAmount > 0, totalAmount };
  }, [stakes, claimRewards]);

  // Compound rewards
  const compoundRewards = useCallback((stakeId: string): { success: boolean; compounded: number } => {
    const stakeIndex = stakes.findIndex(s => s.id === stakeId);
    if (stakeIndex === -1) {
      return { success: false, compounded: 0 };
    }

    const stake = stakes[stakeIndex];
    const pending = calculatePendingRewards(stake);
    
    if (pending <= 0) {
      return { success: false, compounded: 0 };
    }

    const pool = getPoolById(stake.poolId);
    if (!pool || stake.amount + pending > pool.maxStake) {
      return { success: false, compounded: 0 };
    }

    // Update stake with compounded amount
    const updatedStake: UserStake = {
      ...stake,
      amount: stake.amount + pending,
      pendingRewards: 0,
      totalEarned: stake.totalEarned + pending,
      lastClaimAt: new Date(),
    };

    setStakes(prev => {
      const newStakes = [...prev];
      newStakes[stakeIndex] = updatedStake;
      return newStakes;
    });

    return { success: true, compounded: pending };
  }, [stakes, calculatePendingRewards]);

  // Earn points
  const earnPoints = useCallback((amount: number, source: string, description: string) => {
    // Apply tier multiplier
    const tier = getTierByPoints(points.lifetimeEarned);
    const multipliedAmount = Math.floor(amount * tier.pointsMultiplier);

    // Apply active boosts
    let finalAmount = multipliedAmount;
    activeBoosts.forEach(boost => {
      finalAmount = Math.floor(finalAmount * boost.multiplier);
    });

    setPoints(prev => ({
      ...prev,
      balance: prev.balance + finalAmount,
      lifetimeEarned: prev.lifetimeEarned + finalAmount,
    }));

    const transaction: PointsTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type: "earn",
      amount: finalAmount,
      description,
      timestamp: new Date(),
      source,
    };
    setTransactions(prev => [transaction, ...prev]);
  }, [points.lifetimeEarned, activeBoosts]);

  // Redeem points
  const redeemPoints = useCallback((amount: number, description: string): boolean => {
    if (points.balance < amount) {
      return false;
    }

    setPoints(prev => ({
      ...prev,
      balance: prev.balance - amount,
      lifetimeRedeemed: prev.lifetimeRedeemed + amount,
    }));

    const transaction: PointsTransaction = {
      id: `tx_${Date.now()}`,
      type: "redeem",
      amount: -amount,
      description,
      timestamp: new Date(),
    };
    setTransactions(prev => [transaction, ...prev]);

    return true;
  }, [points.balance]);

  // Activate boost
  const activateBoost = useCallback((boostId: string): boolean => {
    // Implementation would check if user has enough points and apply boost
    // For now, return false as boosts need to be purchased
    return false;
  }, []);

  // Get stake by ID
  const getStakeById = useCallback((id: string): UserStake | undefined => {
    return stakes.find(s => s.id === id);
  }, [stakes]);

  return {
    stakes,
    stats,
    points,
    transactions,
    activeBoosts,
    availablePools,
    stake,
    unstake,
    claimRewards,
    claimAllRewards,
    compoundRewards,
    earnPoints,
    redeemPoints,
    activateBoost,
    getStakeById,
    calculatePendingRewards,
    getEffectiveAPY,
    canUnstake,
  };
}

export default useStaking;

