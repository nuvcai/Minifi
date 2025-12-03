/**
 * usePoints - Hook for managing Flybuys-style points
 * Handles earning, spending, and tier progression
 */

import { useState, useCallback, useEffect, useMemo } from "react";
import {
  POINTS_CONFIG,
  TIER_INFO,
  PointsBalance,
  PointsTransaction,
  PointsTier,
  RewardItem,
  xpToPoints,
  calculatePointsWithTier,
  getTierFromPoints,
  getNextTierThreshold,
  getTierProgress,
  canAffordReward,
  meetsTierRequirement,
} from "@/components/gamification/pointsSystem";

const STORAGE_KEY = "minifi_points";
const TRANSACTIONS_KEY = "minifi_points_history";

interface UsePointsReturn {
  // Balance and tier info
  balance: PointsBalance;
  tierInfo: typeof TIER_INFO[PointsTier];
  
  // Transaction history
  transactions: PointsTransaction[];
  
  // Actions
  earnPoints: (amount: number, source: string, description: string) => number;
  earnFromXP: (xp: number, source: keyof typeof POINTS_CONFIG.EARNING_RATES) => number;
  redeemReward: (reward: RewardItem) => { success: boolean; message: string };
  
  // Helpers
  canAfford: (reward: RewardItem) => boolean;
  meetsTier: (requiredTier?: PointsTier) => boolean;
  getPointsValue: () => string;
}

const initialBalance: PointsBalance = {
  current: 0,
  lifetime: 0,
  redeemed: 0,
  tier: "starter",
  tierProgress: 0,
  nextTierAt: POINTS_CONFIG.TIERS.bronze,
  multiplier: 1.0,
  lastActivity: new Date(),
};

export function usePoints(): UsePointsReturn {
  const [balance, setBalance] = useState<PointsBalance>(initialBalance);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const savedBalance = localStorage.getItem(STORAGE_KEY);
      const savedTransactions = localStorage.getItem(TRANSACTIONS_KEY);
      
      if (savedBalance) {
        const parsed = JSON.parse(savedBalance);
        setBalance({
          ...parsed,
          lastActivity: new Date(parsed.lastActivity),
        });
      }
      
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions).map((t: PointsTransaction) => ({
          ...t,
          timestamp: new Date(t.timestamp),
        })));
      }
    } catch (e) {
      console.error("Failed to load points:", e);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(balance));
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions.slice(0, 100)));
    } catch (e) {
      console.error("Failed to save points:", e);
    }
  }, [balance, transactions]);

  // Update tier when lifetime points change
  useEffect(() => {
    const newTier = getTierFromPoints(balance.lifetime);
    const newProgress = getTierProgress(balance.lifetime, newTier);
    const nextAt = getNextTierThreshold(newTier);
    const multiplier = POINTS_CONFIG.TIER_MULTIPLIERS[newTier];
    
    if (newTier !== balance.tier || newProgress !== balance.tierProgress) {
      setBalance(prev => ({
        ...prev,
        tier: newTier,
        tierProgress: newProgress,
        nextTierAt: nextAt || prev.nextTierAt,
        multiplier,
      }));
    }
  }, [balance.lifetime, balance.tier, balance.tierProgress]);

  // Get tier info
  const tierInfo = useMemo(() => TIER_INFO[balance.tier], [balance.tier]);

  // Earn points directly
  const earnPoints = useCallback((amount: number, source: string, description: string): number => {
    const pointsWithMultiplier = calculatePointsWithTier(amount, balance.tier);
    
    const transaction: PointsTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type: "earn",
      amount: pointsWithMultiplier,
      description,
      source,
      timestamp: new Date(),
      balance: balance.current + pointsWithMultiplier,
    };
    
    setTransactions(prev => [transaction, ...prev]);
    setBalance(prev => ({
      ...prev,
      current: prev.current + pointsWithMultiplier,
      lifetime: prev.lifetime + pointsWithMultiplier,
      lastActivity: new Date(),
    }));
    
    return pointsWithMultiplier;
  }, [balance.tier, balance.current]);

  // Earn points from XP (using conversion rates)
  const earnFromXP = useCallback((xp: number, source: keyof typeof POINTS_CONFIG.EARNING_RATES): number => {
    const basePoints = xpToPoints(xp, source);
    if (basePoints <= 0) return 0;
    
    const sourceNames: Record<string, string> = {
      mission_complete: "Mission completed",
      daily_streak: "Daily streak bonus",
      savings_interest: "Savings interest bonus",
      level_up: "Level up reward",
      first_mission: "First mission bonus",
      weekly_bonus: "Weekly activity bonus",
      referral: "Referral bonus",
    };
    
    return earnPoints(basePoints, source, sourceNames[source] || source);
  }, [earnPoints]);

  // Redeem a reward
  const redeemReward = useCallback((reward: RewardItem): { success: boolean; message: string } => {
    if (!canAffordReward(balance.current, reward)) {
      return { 
        success: false, 
        message: `Not enough points. Need ${reward.pointsCost - balance.current} more.` 
      };
    }
    
    if (!meetsTierRequirement(balance.tier, reward.minTier)) {
      return { 
        success: false, 
        message: `Requires ${TIER_INFO[reward.minTier!].name} tier or higher.` 
      };
    }
    
    const transaction: PointsTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type: "redeem",
      amount: -reward.pointsCost,
      description: `Redeemed: ${reward.name}`,
      source: "redemption",
      timestamp: new Date(),
      balance: balance.current - reward.pointsCost,
    };
    
    setTransactions(prev => [transaction, ...prev]);
    setBalance(prev => ({
      ...prev,
      current: prev.current - reward.pointsCost,
      redeemed: prev.redeemed + reward.pointsCost,
      lastActivity: new Date(),
    }));
    
    return { success: true, message: `Successfully redeemed ${reward.name}!` };
  }, [balance.current, balance.tier]);

  // Check if can afford
  const canAfford = useCallback((reward: RewardItem): boolean => {
    return canAffordReward(balance.current, reward);
  }, [balance.current]);

  // Check tier requirement
  const meetsTier = useCallback((requiredTier?: PointsTier): boolean => {
    return meetsTierRequirement(balance.tier, requiredTier);
  }, [balance.tier]);

  // Get value in dollars
  const getPointsValue = useCallback((): string => {
    const dollars = balance.current / POINTS_CONFIG.POINTS_PER_DOLLAR;
    return `$${dollars.toFixed(2)}`;
  }, [balance.current]);

  return {
    balance,
    tierInfo,
    transactions,
    earnPoints,
    earnFromXP,
    redeemReward,
    canAfford,
    meetsTier,
    getPointsValue,
  };
}

export default usePoints;

