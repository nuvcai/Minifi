/**
 * Mini.Fi Points System - Flybuys-Style Rewards
 * 
 * Conversion Rates (like real Flybuys):
 * - 100 XP earned = 10 Mini Points
 * - 100 Mini Points = $1 value
 * - So: 1000 XP = $1 in rewards
 * 
 * Earning Points:
 * - Complete missions = 10% of XP as points
 * - Daily streak bonus = bonus points
 * - Savings interest = 15% as points (encourages saving)
 * - Special promotions = 2x, 3x points
 */

// ═══════════════════════════════════════════════════════════════════════════
// Core Conversion Rates
// ═══════════════════════════════════════════════════════════════════════════

export const POINTS_CONFIG = {
  // How many XP = 1 Mini Point
  XP_TO_POINTS_RATE: 10, // 10 XP = 1 point
  
  // How many points = $1 AUD value
  POINTS_PER_DOLLAR: 100, // 100 points = $1
  
  // Earning multipliers by source
  EARNING_RATES: {
    mission_complete: 0.10,    // 10% of XP as points
    daily_streak: 0.15,        // 15% of streak XP as points
    savings_interest: 0.20,    // 20% of savings interest as points (bonus for saving!)
    level_up: 50,              // Flat 50 points per level up
    first_mission: 100,        // Bonus 100 points for first mission
    weekly_bonus: 25,          // 25 points weekly activity bonus
    referral: 200,             // 200 points per referral
  },
  
  // Tier thresholds (lifetime points earned)
  TIERS: {
    starter: 0,
    bronze: 100,      // ~$1 in rewards earned
    silver: 500,      // ~$5 in rewards earned
    gold: 1500,       // ~$15 in rewards earned
    platinum: 5000,   // ~$50 in rewards earned
  },
  
  // Tier multipliers for earning
  TIER_MULTIPLIERS: {
    starter: 1.0,
    bronze: 1.1,      // +10% earning
    silver: 1.25,     // +25% earning
    gold: 1.5,        // +50% earning
    platinum: 2.0,    // +100% earning (double points!)
  },
  
  // Points expiry (in days, 0 = never)
  POINTS_EXPIRY_DAYS: 365, // Points expire after 1 year of inactivity
};

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

export type PointsTier = "starter" | "bronze" | "silver" | "gold" | "platinum";

export interface PointsBalance {
  current: number;
  lifetime: number;
  redeemed: number;
  tier: PointsTier;
  tierProgress: number;
  nextTierAt: number;
  multiplier: number;
  lastActivity: Date;
}

export interface PointsTransaction {
  id: string;
  type: "earn" | "redeem" | "expire" | "bonus" | "stake_reward" | "referral";
  amount: number;
  description: string;
  source?: string; // Optional for backwards compatibility
  timestamp: Date;
  balance?: number; // Optional for backwards compatibility
}

export interface RewardItem {
  id: string;
  name: string;
  description: string;
  partner: string;
  partnerLogo: string;
  pointsCost: number;
  dollarValue: number;
  category: "food" | "entertainment" | "shopping" | "gaming" | "charity" | "experience";
  inStock: boolean;
  featured: boolean;
  minTier?: PointsTier;
  limitPerUser?: number;
  expiresAt?: Date;
}

// ═══════════════════════════════════════════════════════════════════════════
// Tier Data
// ═══════════════════════════════════════════════════════════════════════════

export const TIER_INFO: Record<PointsTier, {
  name: string;
  emoji: string;
  color: string;
  bgGradient: string;
  perks: string[];
}> = {
  starter: {
    name: "Starter",
    emoji: "🌱",
    color: "text-gray-600",
    bgGradient: "from-gray-400 to-slate-500",
    perks: ["Earn points on all activities"],
  },
  bronze: {
    name: "Bronze",
    emoji: "🥉",
    color: "text-amber-700",
    bgGradient: "from-amber-600 to-orange-700",
    perks: ["10% bonus points", "Early access to deals"],
  },
  silver: {
    name: "Silver",
    emoji: "🥈",
    color: "text-slate-500",
    bgGradient: "from-slate-400 to-gray-500",
    perks: ["25% bonus points", "Exclusive rewards", "Birthday bonus"],
  },
  gold: {
    name: "Gold",
    emoji: "🥇",
    color: "text-yellow-600",
    bgGradient: "from-yellow-400 to-amber-500",
    perks: ["50% bonus points", "Priority support", "Double points days"],
  },
  platinum: {
    name: "Platinum",
    emoji: "💎",
    color: "text-violet-600",
    bgGradient: "from-violet-400 to-purple-600",
    perks: ["2x points always", "VIP rewards", "Exclusive experiences"],
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// Rewards Catalog (Flybuys-style pricing)
// ═══════════════════════════════════════════════════════════════════════════

export const REWARDS_CATALOG: RewardItem[] = [
  // Food & Drink - Low tier, accessible
  {
    id: "boost-smoothie",
    name: "Boost Juice Smoothie",
    description: "Any regular smoothie",
    partner: "Boost Juice",
    partnerLogo: "🥤",
    pointsCost: 800,  // $8 value
    dollarValue: 8,
    category: "food",
    inStock: true,
    featured: false,
  },
  {
    id: "maccas-small-meal",
    name: "McDonald's Small Meal",
    description: "Any small meal combo",
    partner: "McDonald's",
    partnerLogo: "🍔",
    pointsCost: 1000, // $10 value
    dollarValue: 10,
    category: "food",
    inStock: true,
    featured: true,
  },
  {
    id: "starbucks-tall",
    name: "Starbucks Tall Drink",
    description: "Any tall handcrafted beverage",
    partner: "Starbucks",
    partnerLogo: "☕",
    pointsCost: 600,  // $6 value
    dollarValue: 6,
    category: "food",
    inStock: true,
    featured: false,
  },
  {
    id: "gyg-burrito",
    name: "GYG Burrito or Bowl",
    description: "Any regular burrito or bowl",
    partner: "Guzman y Gomez",
    partnerLogo: "🌯",
    pointsCost: 1500, // $15 value
    dollarValue: 15,
    category: "food",
    inStock: true,
    featured: true,
  },
  {
    id: "krispy-dozen",
    name: "Krispy Kreme Dozen",
    description: "Original Glazed dozen",
    partner: "Krispy Kreme",
    partnerLogo: "🍩",
    pointsCost: 2000, // $20 value
    dollarValue: 20,
    category: "food",
    inStock: true,
    featured: false,
  },
  
  // Entertainment - Mid tier
  {
    id: "spotify-month",
    name: "Spotify Premium 1 Month",
    description: "Ad-free music streaming",
    partner: "Spotify",
    partnerLogo: "🎵",
    pointsCost: 1300, // $13 value
    dollarValue: 13,
    category: "entertainment",
    inStock: true,
    featured: true,
  },
  {
    id: "netflix-month",
    name: "Netflix Standard 1 Month",
    description: "Stream movies and shows",
    partner: "Netflix",
    partnerLogo: "🎬",
    pointsCost: 1700, // $17 value
    dollarValue: 17,
    category: "entertainment",
    inStock: true,
    featured: true,
  },
  {
    id: "event-movie",
    name: "Movie Ticket",
    description: "Standard session at Event Cinemas",
    partner: "Event Cinemas",
    partnerLogo: "🎥",
    pointsCost: 2200, // $22 value
    dollarValue: 22,
    category: "entertainment",
    inStock: true,
    featured: false,
  },
  {
    id: "youtube-premium",
    name: "YouTube Premium 1 Month",
    description: "Ad-free videos & music",
    partner: "YouTube",
    partnerLogo: "📺",
    pointsCost: 1500, // $15 value
    dollarValue: 15,
    category: "entertainment",
    inStock: true,
    featured: false,
  },
  
  // Gaming - Popular with teens
  {
    id: "steam-10",
    name: "Steam $10 Gift Card",
    description: "For games and DLC",
    partner: "Steam",
    partnerLogo: "🎮",
    pointsCost: 1000,
    dollarValue: 10,
    category: "gaming",
    inStock: true,
    featured: true,
  },
  {
    id: "steam-20",
    name: "Steam $20 Gift Card",
    description: "For games and DLC",
    partner: "Steam",
    partnerLogo: "🎮",
    pointsCost: 2000,
    dollarValue: 20,
    category: "gaming",
    inStock: true,
    featured: false,
  },
  {
    id: "playstation-25",
    name: "PlayStation $25 Credit",
    description: "PSN Store credit",
    partner: "PlayStation",
    partnerLogo: "🕹️",
    pointsCost: 2500,
    dollarValue: 25,
    category: "gaming",
    inStock: true,
    featured: false,
  },
  {
    id: "xbox-25",
    name: "Xbox $25 Credit",
    description: "Xbox Store credit",
    partner: "Xbox",
    partnerLogo: "🎯",
    pointsCost: 2500,
    dollarValue: 25,
    category: "gaming",
    inStock: true,
    featured: false,
  },
  {
    id: "nintendo-20",
    name: "Nintendo eShop $20",
    description: "For Switch games",
    partner: "Nintendo",
    partnerLogo: "🍄",
    pointsCost: 2000,
    dollarValue: 20,
    category: "gaming",
    inStock: true,
    featured: false,
  },
  
  // Shopping - Higher tier
  {
    id: "jbhifi-20",
    name: "JB Hi-Fi $20 Gift Card",
    description: "Tech, games, music & more",
    partner: "JB Hi-Fi",
    partnerLogo: "📱",
    pointsCost: 2000,
    dollarValue: 20,
    category: "shopping",
    inStock: true,
    featured: true,
    minTier: "bronze",
  },
  {
    id: "jbhifi-50",
    name: "JB Hi-Fi $50 Gift Card",
    description: "Tech, games, music & more",
    partner: "JB Hi-Fi",
    partnerLogo: "📱",
    pointsCost: 5000,
    dollarValue: 50,
    category: "shopping",
    inStock: true,
    featured: false,
    minTier: "silver",
  },
  {
    id: "cottonon-20",
    name: "Cotton On $20 Voucher",
    description: "Fashion & accessories",
    partner: "Cotton On",
    partnerLogo: "👕",
    pointsCost: 2000,
    dollarValue: 20,
    category: "shopping",
    inStock: true,
    featured: false,
  },
  {
    id: "rebel-25",
    name: "Rebel Sport $25 Voucher",
    description: "Sports gear & activewear",
    partner: "Rebel Sport",
    partnerLogo: "⚽",
    pointsCost: 2500,
    dollarValue: 25,
    category: "shopping",
    inStock: true,
    featured: false,
  },
  {
    id: "amazon-25",
    name: "Amazon $25 Gift Card",
    description: "Shop millions of items",
    partner: "Amazon",
    partnerLogo: "📦",
    pointsCost: 2500,
    dollarValue: 25,
    category: "shopping",
    inStock: true,
    featured: true,
    minTier: "bronze",
  },
  
  // Charity - Feel good options
  {
    id: "tree-plant",
    name: "Plant a Tree",
    description: "Plant a tree with One Tree Planted",
    partner: "One Tree Planted",
    partnerLogo: "🌳",
    pointsCost: 100,  // Low cost to encourage
    dollarValue: 1,
    category: "charity",
    inStock: true,
    featured: true,
  },
  {
    id: "meal-donate",
    name: "Donate 5 Meals",
    description: "Feed families via Foodbank",
    partner: "Foodbank Australia",
    partnerLogo: "🍎",
    pointsCost: 500,
    dollarValue: 5,
    category: "charity",
    inStock: true,
    featured: false,
  },
  {
    id: "ocean-cleanup",
    name: "Remove 1kg Ocean Plastic",
    description: "Support ocean cleanup",
    partner: "Ocean Conservancy",
    partnerLogo: "🌊",
    pointsCost: 300,
    dollarValue: 3,
    category: "charity",
    inStock: true,
    featured: false,
  },
  
  // Experiences - Premium tier
  {
    id: "escape-room",
    name: "Escape Room for 2",
    description: "60-minute escape experience",
    partner: "Strike Bowling",
    partnerLogo: "🔐",
    pointsCost: 8000,
    dollarValue: 80,
    category: "experience",
    inStock: true,
    featured: false,
    minTier: "gold",
  },
  {
    id: "bowling-game",
    name: "Bowling Game for 2",
    description: "1 game each at Strike",
    partner: "Strike Bowling",
    partnerLogo: "🎳",
    pointsCost: 3000,
    dollarValue: 30,
    category: "experience",
    inStock: true,
    featured: false,
    minTier: "silver",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Convert XP to Mini Points
 */
export function xpToPoints(xp: number, source: keyof typeof POINTS_CONFIG.EARNING_RATES): number {
  const rate = POINTS_CONFIG.EARNING_RATES[source];
  if (typeof rate === "number" && rate < 1) {
    // Percentage rate
    return Math.floor((xp / POINTS_CONFIG.XP_TO_POINTS_RATE) * rate * 10);
  }
  // Flat rate
  return rate;
}

/**
 * Calculate points with tier multiplier
 */
export function calculatePointsWithTier(basePoints: number, tier: PointsTier): number {
  const multiplier = POINTS_CONFIG.TIER_MULTIPLIERS[tier];
  return Math.floor(basePoints * multiplier);
}

/**
 * Get tier from lifetime points
 */
export function getTierFromPoints(lifetimePoints: number): PointsTier {
  const tiers = Object.entries(POINTS_CONFIG.TIERS)
    .sort(([, a], [, b]) => b - a) as [PointsTier, number][];
  
  for (const [tier, threshold] of tiers) {
    if (lifetimePoints >= threshold) {
      return tier;
    }
  }
  return "starter";
}

/**
 * Get next tier threshold
 */
export function getNextTierThreshold(currentTier: PointsTier): number | null {
  const tierOrder: PointsTier[] = ["starter", "bronze", "silver", "gold", "platinum"];
  const currentIndex = tierOrder.indexOf(currentTier);
  
  if (currentIndex === tierOrder.length - 1) return null;
  
  const nextTier = tierOrder[currentIndex + 1];
  return POINTS_CONFIG.TIERS[nextTier];
}

/**
 * Calculate progress to next tier (0-100)
 */
export function getTierProgress(lifetimePoints: number, currentTier: PointsTier): number {
  const nextThreshold = getNextTierThreshold(currentTier);
  if (!nextThreshold) return 100;
  
  const currentThreshold = POINTS_CONFIG.TIERS[currentTier];
  const progress = ((lifetimePoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  return Math.min(Math.max(progress, 0), 100);
}

/**
 * Convert points to dollar value
 */
export function pointsToDollars(points: number): number {
  return points / POINTS_CONFIG.POINTS_PER_DOLLAR;
}

/**
 * Check if user can afford reward
 */
export function canAffordReward(balance: number, reward: RewardItem): boolean {
  return balance >= reward.pointsCost;
}

/**
 * Check if user meets tier requirement
 */
export function meetsTierRequirement(userTier: PointsTier, requiredTier?: PointsTier): boolean {
  if (!requiredTier) return true;
  
  const tierOrder: PointsTier[] = ["starter", "bronze", "silver", "gold", "platinum"];
  return tierOrder.indexOf(userTier) >= tierOrder.indexOf(requiredTier);
}

/**
 * Get rewards filtered by category and tier
 */
export function getAvailableRewards(
  category?: string, 
  userTier: PointsTier = "starter"
): RewardItem[] {
  return REWARDS_CATALOG.filter(reward => {
    if (category && reward.category !== category) return false;
    if (!meetsTierRequirement(userTier, reward.minTier)) return false;
    return reward.inStock;
  });
}

/**
 * Get featured rewards
 */
export function getFeaturedRewards(userTier: PointsTier = "starter"): RewardItem[] {
  return REWARDS_CATALOG.filter(reward => 
    reward.featured && 
    reward.inStock && 
    meetsTierRequirement(userTier, reward.minTier)
  );
}

/**
 * Format points display
 */
export function formatPoints(points: number): string {
  if (points >= 1000) {
    return `${(points / 1000).toFixed(1)}k`;
  }
  return points.toLocaleString();
}

/**
 * Get earn rate description
 */
export function getEarnRateDescription(tier: PointsTier): string {
  const multiplier = POINTS_CONFIG.TIER_MULTIPLIERS[tier];
  if (multiplier === 1) return "1 point per 10 🪙 iii";
  return `${multiplier}x points (${multiplier} points per 10 🪙)`;
}

