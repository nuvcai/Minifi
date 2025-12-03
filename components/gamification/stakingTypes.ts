/**
 * Mini.Fi Staking System Types
 * Solana-inspired staking with Flybuys-style rewards
 * 
 * Users can "stake" their XP to earn bonus rewards over time,
 * similar to crypto staking but gamified for teens.
 */

// ═══════════════════════════════════════════════════════════════════════════
// Staking Pool Types (Solana-inspired)
// ═══════════════════════════════════════════════════════════════════════════

export type StakingTier = "bronze" | "silver" | "gold" | "platinum" | "diamond";

export interface StakingPool {
  id: string;
  name: string;
  description: string;
  emoji: string;
  tier: StakingTier;
  
  // Lock period in days
  lockPeriod: number;
  
  // Annual Percentage Yield (displayed as daily for engagement)
  apyPercent: number;
  dailyYieldPercent: number;
  
  // Minimum stake amount
  minStake: number;
  maxStake: number;
  
  // Bonus multipliers
  streakMultiplier: number; // Extra yield for streak holders
  earlyUnstakePenalty: number; // % penalty for early withdrawal
  
  // Visual
  color: string;
  bgGradient: string;
}

export interface UserStake {
  id: string;
  poolId: string;
  amount: number; // XP staked
  
  // Timestamps
  stakedAt: Date;
  unlocksAt: Date;
  lastClaimAt: Date;
  
  // Rewards tracking
  totalEarned: number;
  pendingRewards: number;
  
  // Status
  isLocked: boolean;
  autoCompound: boolean;
}

export interface StakingStats {
  totalStaked: number;
  totalEarned: number;
  activeStakes: number;
  currentAPY: number;
  streakBonus: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// Flybuys-Style Rewards Points
// ═══════════════════════════════════════════════════════════════════════════

export interface FlybuysPoints {
  balance: number;
  lifetimeEarned: number;
  lifetimeRedeemed: number;
  tier: MembershipTier;
  tierProgress: number; // Progress to next tier (0-100)
}

export type MembershipTier = "starter" | "bronze" | "silver" | "gold" | "vip";

export interface TierBenefits {
  tier: MembershipTier;
  name: string;
  minPoints: number;
  pointsMultiplier: number;
  exclusiveRewards: boolean;
  prioritySupport: boolean;
  bonusStakingAPY: number;
  emoji: string;
  color: string;
}

export interface PointsTransaction {
  id: string;
  type: "earn" | "redeem" | "stake_reward" | "bonus" | "referral";
  amount: number;
  description: string;
  timestamp: Date;
  source?: string; // e.g., "mission_complete", "daily_streak", "staking"
}

// ═══════════════════════════════════════════════════════════════════════════
// Partner Rewards (Flybuys-style)
// ═══════════════════════════════════════════════════════════════════════════

export interface PartnerReward {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerLogo: string;
  
  name: string;
  description: string;
  
  // Cost in points
  pointsCost: number;
  dollarValue: number;
  
  // Availability
  inStock: boolean;
  limitedTime?: boolean;
  expiresAt?: Date;
  
  // Categories
  category: RewardCategory;
  tags: string[];
  
  // Tier requirements
  minTier?: MembershipTier;
  
  // Visual
  emoji: string;
  featured: boolean;
}

export type RewardCategory = 
  | "food_drink"
  | "entertainment"
  | "shopping"
  | "gaming"
  | "experiences"
  | "charity"
  | "crypto"; // Future Solana NFT rewards

// ═══════════════════════════════════════════════════════════════════════════
// Solana Integration Types (Future-ready)
// ═══════════════════════════════════════════════════════════════════════════

export interface SolanaWallet {
  address: string;
  connected: boolean;
  balance: number; // SOL balance
  nfts: string[]; // NFT mint addresses
}

export interface NFTReward {
  id: string;
  name: string;
  description: string;
  image: string;
  mintAddress?: string;
  
  // Earning requirements
  pointsCost?: number;
  achievementRequired?: string;
  
  // Rarity
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  totalSupply: number;
  currentSupply: number;
}

export interface TokenReward {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  mintAddress?: string;
  pointsCost: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// Staking Events & Actions
// ═══════════════════════════════════════════════════════════════════════════

export interface StakingAction {
  type: "stake" | "unstake" | "claim" | "compound" | "boost";
  poolId: string;
  amount: number;
  timestamp: Date;
}

export interface StakingReward {
  type: "daily_yield" | "streak_bonus" | "tier_bonus" | "referral_bonus";
  amount: number;
  source: string;
  timestamp: Date;
}

// ═══════════════════════════════════════════════════════════════════════════
// Boost & Multiplier Types
// ═══════════════════════════════════════════════════════════════════════════

export interface ActiveBoost {
  id: string;
  name: string;
  multiplier: number;
  expiresAt: Date;
  source: string; // e.g., "7_day_streak", "level_up", "special_event"
}

export interface BoostOffer {
  id: string;
  name: string;
  description: string;
  multiplier: number;
  durationHours: number;
  pointsCost: number;
  emoji: string;
}

