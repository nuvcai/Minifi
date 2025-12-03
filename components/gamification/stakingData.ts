/**
 * Mini.Fi Staking Pools & Partner Rewards Data
 * Solana-inspired staking with Flybuys-style rewards catalog
 */

import {
  StakingPool,
  TierBenefits,
  PartnerReward,
  BoostOffer,
  NFTReward,
} from "./stakingTypes";

// ═══════════════════════════════════════════════════════════════════════════
// Staking Pools (Solana-inspired)
// ═══════════════════════════════════════════════════════════════════════════

export const stakingPools: StakingPool[] = [
  {
    id: "flex",
    name: "Flex Pool",
    description: "No lock period - withdraw anytime! Perfect for beginners.",
    emoji: "🌊",
    tier: "bronze",
    lockPeriod: 0,
    apyPercent: 5,
    dailyYieldPercent: 0.0137, // 5% / 365
    minStake: 50,
    maxStake: 1000,
    streakMultiplier: 1.0,
    earlyUnstakePenalty: 0,
    color: "text-blue-500",
    bgGradient: "from-blue-400 to-cyan-500",
  },
  {
    id: "starter",
    name: "Starter Stake",
    description: "7-day lock for better returns. Great for building habits!",
    emoji: "🚀",
    tier: "silver",
    lockPeriod: 7,
    apyPercent: 12,
    dailyYieldPercent: 0.0329, // 12% / 365
    minStake: 100,
    maxStake: 2500,
    streakMultiplier: 1.1,
    earlyUnstakePenalty: 10,
    color: "text-emerald-500",
    bgGradient: "from-emerald-400 to-teal-500",
  },
  {
    id: "hodl",
    name: "HODL Pool",
    description: "14-day diamond hands for serious rewards! 💎🙌",
    emoji: "💎",
    tier: "gold",
    lockPeriod: 14,
    apyPercent: 25,
    dailyYieldPercent: 0.0685, // 25% / 365
    minStake: 250,
    maxStake: 5000,
    streakMultiplier: 1.25,
    earlyUnstakePenalty: 15,
    color: "text-amber-500",
    bgGradient: "from-amber-400 to-orange-500",
  },
  {
    id: "whale",
    name: "Whale Pool",
    description: "30-day lock for maximum gains. Only for the committed! 🐋",
    emoji: "🐋",
    tier: "platinum",
    lockPeriod: 30,
    apyPercent: 50,
    dailyYieldPercent: 0.137, // 50% / 365
    minStake: 500,
    maxStake: 10000,
    streakMultiplier: 1.5,
    earlyUnstakePenalty: 20,
    color: "text-violet-500",
    bgGradient: "from-violet-400 to-purple-500",
  },
  {
    id: "legend",
    name: "Legend Vault",
    description: "60-day legendary staking. Become a Mini.Fi legend! 👑",
    emoji: "👑",
    tier: "diamond",
    lockPeriod: 60,
    apyPercent: 100,
    dailyYieldPercent: 0.274, // 100% / 365
    minStake: 1000,
    maxStake: 25000,
    streakMultiplier: 2.0,
    earlyUnstakePenalty: 25,
    color: "text-pink-500",
    bgGradient: "from-pink-400 to-rose-500",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Membership Tiers (Flybuys-style)
// ═══════════════════════════════════════════════════════════════════════════

export const membershipTiers: TierBenefits[] = [
  {
    tier: "starter",
    name: "Starter",
    minPoints: 0,
    pointsMultiplier: 1.0,
    exclusiveRewards: false,
    prioritySupport: false,
    bonusStakingAPY: 0,
    emoji: "🌱",
    color: "from-gray-400 to-slate-500",
  },
  {
    tier: "bronze",
    name: "Bronze Member",
    minPoints: 500,
    pointsMultiplier: 1.1,
    exclusiveRewards: false,
    prioritySupport: false,
    bonusStakingAPY: 2,
    emoji: "🥉",
    color: "from-amber-600 to-orange-700",
  },
  {
    tier: "silver",
    name: "Silver Member",
    minPoints: 2000,
    pointsMultiplier: 1.25,
    exclusiveRewards: true,
    prioritySupport: false,
    bonusStakingAPY: 5,
    emoji: "🥈",
    color: "from-slate-400 to-gray-500",
  },
  {
    tier: "gold",
    name: "Gold Member",
    minPoints: 5000,
    pointsMultiplier: 1.5,
    exclusiveRewards: true,
    prioritySupport: true,
    bonusStakingAPY: 10,
    emoji: "🥇",
    color: "from-yellow-400 to-amber-500",
  },
  {
    tier: "vip",
    name: "VIP Legend",
    minPoints: 15000,
    pointsMultiplier: 2.0,
    exclusiveRewards: true,
    prioritySupport: true,
    bonusStakingAPY: 20,
    emoji: "💎",
    color: "from-violet-400 to-purple-600",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Partner Rewards Catalog (Flybuys-style)
// ═══════════════════════════════════════════════════════════════════════════

export const partnerRewards: PartnerReward[] = [
  // Food & Drink
  {
    id: "gyg-burrito",
    partnerId: "gyg",
    partnerName: "Guzman y Gomez",
    partnerLogo: "🌯",
    name: "Free Burrito",
    description: "Any burrito or bowl on the house!",
    pointsCost: 150,
    dollarValue: 15,
    inStock: true,
    category: "food_drink",
    tags: ["popular", "instant"],
    emoji: "🌯",
    featured: true,
  },
  {
    id: "boost-smoothie",
    partnerId: "boost",
    partnerName: "Boost Juice",
    partnerLogo: "🥤",
    name: "Free Smoothie",
    description: "Any regular smoothie - healthy and delicious!",
    pointsCost: 80,
    dollarValue: 8,
    inStock: true,
    category: "food_drink",
    tags: ["healthy", "instant"],
    emoji: "🥤",
    featured: false,
  },
  {
    id: "maccas-meal",
    partnerId: "mcdonalds",
    partnerName: "McDonald's",
    partnerLogo: "🍔",
    name: "Medium Meal",
    description: "Any medium meal combo",
    pointsCost: 120,
    dollarValue: 12,
    inStock: true,
    category: "food_drink",
    tags: ["popular"],
    emoji: "🍔",
    featured: true,
  },
  {
    id: "starbucks-drink",
    partnerId: "starbucks",
    partnerName: "Starbucks",
    partnerLogo: "☕",
    name: "Any Drink",
    description: "Any handcrafted beverage",
    pointsCost: 70,
    dollarValue: 7,
    inStock: true,
    category: "food_drink",
    tags: ["instant"],
    emoji: "☕",
    featured: false,
  },
  
  // Entertainment
  {
    id: "spotify-month",
    partnerId: "spotify",
    partnerName: "Spotify",
    partnerLogo: "🎵",
    name: "1 Month Premium",
    description: "Ad-free music streaming for a month",
    pointsCost: 130,
    dollarValue: 13,
    inStock: true,
    category: "entertainment",
    tags: ["digital", "popular"],
    emoji: "🎵",
    featured: true,
  },
  {
    id: "netflix-month",
    partnerId: "netflix",
    partnerName: "Netflix",
    partnerLogo: "🎬",
    name: "1 Month Standard",
    description: "Binge your favorite shows",
    pointsCost: 170,
    dollarValue: 17,
    inStock: true,
    category: "entertainment",
    tags: ["digital", "popular"],
    emoji: "🎬",
    featured: true,
  },
  {
    id: "event-ticket",
    partnerId: "event",
    partnerName: "Event Cinemas",
    partnerLogo: "🎥",
    name: "Movie Ticket",
    description: "Standard movie ticket - any session",
    pointsCost: 200,
    dollarValue: 20,
    inStock: true,
    category: "entertainment",
    tags: ["experience"],
    emoji: "🎥",
    featured: false,
  },
  
  // Gaming
  {
    id: "steam-10",
    partnerId: "steam",
    partnerName: "Steam",
    partnerLogo: "🎮",
    name: "$10 Gift Card",
    description: "For games, DLC, and more",
    pointsCost: 100,
    dollarValue: 10,
    inStock: true,
    category: "gaming",
    tags: ["digital", "gaming"],
    emoji: "🎮",
    featured: true,
  },
  {
    id: "playstation-20",
    partnerId: "playstation",
    partnerName: "PlayStation",
    partnerLogo: "🕹️",
    name: "$20 PSN Credit",
    description: "PlayStation Store credit",
    pointsCost: 200,
    dollarValue: 20,
    inStock: true,
    category: "gaming",
    tags: ["digital", "gaming"],
    emoji: "🕹️",
    featured: false,
  },
  {
    id: "xbox-20",
    partnerId: "xbox",
    partnerName: "Xbox",
    partnerLogo: "🎯",
    name: "$20 Xbox Credit",
    description: "Xbox Store credit",
    pointsCost: 200,
    dollarValue: 20,
    inStock: true,
    category: "gaming",
    tags: ["digital", "gaming"],
    emoji: "🎯",
    featured: false,
  },
  
  // Shopping
  {
    id: "jbhifi-25",
    partnerId: "jbhifi",
    partnerName: "JB Hi-Fi",
    partnerLogo: "📱",
    name: "$25 Gift Card",
    description: "Tech, games, music and more",
    pointsCost: 250,
    dollarValue: 25,
    inStock: true,
    category: "shopping",
    tags: ["popular"],
    emoji: "📱",
    featured: true,
  },
  {
    id: "cottonon-20",
    partnerId: "cottonon",
    partnerName: "Cotton On",
    partnerLogo: "👕",
    name: "$20 Voucher",
    description: "Fresh fits and accessories",
    pointsCost: 200,
    dollarValue: 20,
    inStock: true,
    category: "shopping",
    tags: ["fashion"],
    emoji: "👕",
    featured: false,
  },
  {
    id: "rebel-30",
    partnerId: "rebel",
    partnerName: "Rebel Sport",
    partnerLogo: "⚽",
    name: "$30 Voucher",
    description: "Sports gear and activewear",
    pointsCost: 300,
    dollarValue: 30,
    inStock: true,
    category: "shopping",
    tags: ["sports"],
    emoji: "⚽",
    featured: false,
  },
  
  // Charity
  {
    id: "charity-tree",
    partnerId: "onetreeplanted",
    partnerName: "One Tree Planted",
    partnerLogo: "🌳",
    name: "Plant a Tree",
    description: "Plant a tree and help the planet!",
    pointsCost: 50,
    dollarValue: 1,
    inStock: true,
    category: "charity",
    tags: ["eco", "feel-good"],
    emoji: "🌳",
    featured: true,
  },
  {
    id: "charity-meal",
    partnerId: "foodbank",
    partnerName: "Foodbank",
    partnerLogo: "🍎",
    name: "Donate 5 Meals",
    description: "Feed families in need",
    pointsCost: 75,
    dollarValue: 5,
    inStock: true,
    category: "charity",
    tags: ["charity", "feel-good"],
    emoji: "🍎",
    featured: false,
  },
  
  // Crypto / NFT (Coming Soon - Solana)
  {
    id: "nft-rookie-badge",
    partnerId: "minifi",
    partnerName: "Mini.Fi",
    partnerLogo: "🏅",
    name: "Rookie Investor NFT",
    description: "Your first Mini.Fi NFT badge on Solana!",
    pointsCost: 500,
    dollarValue: 0,
    inStock: true,
    limitedTime: true,
    category: "crypto",
    tags: ["nft", "exclusive", "solana"],
    minTier: "bronze",
    emoji: "🏅",
    featured: true,
  },
  {
    id: "nft-diamond-hands",
    partnerId: "minifi",
    partnerName: "Mini.Fi",
    partnerLogo: "💎",
    name: "Diamond Hands NFT",
    description: "Rare NFT for HODL pool stakers",
    pointsCost: 2000,
    dollarValue: 0,
    inStock: true,
    limitedTime: true,
    category: "crypto",
    tags: ["nft", "rare", "solana"],
    minTier: "gold",
    emoji: "💎",
    featured: true,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Boost Offers
// ═══════════════════════════════════════════════════════════════════════════

export const boostOffers: BoostOffer[] = [
  {
    id: "quick-boost",
    name: "Quick Boost",
    description: "1.5x points for 1 hour",
    multiplier: 1.5,
    durationHours: 1,
    pointsCost: 25,
    emoji: "⚡",
  },
  {
    id: "power-hour",
    name: "Power Hour",
    description: "2x points for 1 hour",
    multiplier: 2.0,
    durationHours: 1,
    pointsCost: 50,
    emoji: "🔥",
  },
  {
    id: "super-session",
    name: "Super Session",
    description: "1.5x points for 24 hours",
    multiplier: 1.5,
    durationHours: 24,
    pointsCost: 100,
    emoji: "🚀",
  },
  {
    id: "mega-boost",
    name: "Mega Boost",
    description: "2x points for 24 hours",
    multiplier: 2.0,
    durationHours: 24,
    pointsCost: 175,
    emoji: "💫",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// NFT Rewards (Solana-ready)
// ═══════════════════════════════════════════════════════════════════════════

export const nftRewards: NFTReward[] = [
  {
    id: "nft-rookie",
    name: "Rookie Investor",
    description: "Your journey begins! First Mini.Fi NFT.",
    image: "/images/nft-rookie.png",
    pointsCost: 500,
    rarity: "common",
    totalSupply: 10000,
    currentSupply: 0,
  },
  {
    id: "nft-explorer",
    name: "Market Explorer",
    description: "You've explored multiple asset classes!",
    image: "/images/nft-explorer.png",
    achievementRequired: "asset-explorer",
    rarity: "uncommon",
    totalSupply: 5000,
    currentSupply: 0,
  },
  {
    id: "nft-diamond",
    name: "Diamond Hands",
    description: "HODL legend! 30-day staker.",
    image: "/images/nft-diamond.png",
    achievementRequired: "whale-pool-complete",
    rarity: "rare",
    totalSupply: 1000,
    currentSupply: 0,
  },
  {
    id: "nft-phoenix",
    name: "Phoenix Rising",
    description: "Rose from losses to profit!",
    image: "/images/nft-phoenix.png",
    achievementRequired: "phoenix",
    rarity: "epic",
    totalSupply: 500,
    currentSupply: 0,
  },
  {
    id: "nft-legend",
    name: "Mini.Fi Legend",
    description: "The ultimate achievement. True legend status.",
    image: "/images/nft-legend.png",
    achievementRequired: "legend-vault-complete",
    rarity: "legendary",
    totalSupply: 100,
    currentSupply: 0,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════════════

export function getPoolById(id: string): StakingPool | undefined {
  return stakingPools.find(p => p.id === id);
}

export function getTierByPoints(points: number): TierBenefits {
  const sorted = [...membershipTiers].sort((a, b) => b.minPoints - a.minPoints);
  return sorted.find(t => points >= t.minPoints) || membershipTiers[0];
}

export function getNextTier(currentPoints: number): TierBenefits | null {
  const sorted = [...membershipTiers].sort((a, b) => a.minPoints - b.minPoints);
  return sorted.find(t => t.minPoints > currentPoints) || null;
}

export function calculateDailyYield(amount: number, pool: StakingPool, streakDays: number = 0): number {
  const baseYield = amount * (pool.dailyYieldPercent / 100);
  const streakBonus = streakDays >= 7 ? pool.streakMultiplier : 1.0;
  return Math.floor(baseYield * streakBonus);
}

export function calculateTotalYield(
  amount: number, 
  pool: StakingPool, 
  days: number, 
  streakDays: number = 0
): number {
  const dailyYield = calculateDailyYield(amount, pool, streakDays);
  return dailyYield * days;
}

export function getRewardsByCategory(category: string): PartnerReward[] {
  return partnerRewards.filter(r => r.category === category);
}

export function getFeaturedRewards(): PartnerReward[] {
  return partnerRewards.filter(r => r.featured);
}

export function getRewardsForTier(tier: string): PartnerReward[] {
  const tierOrder = ["starter", "bronze", "silver", "gold", "vip"];
  const tierIndex = tierOrder.indexOf(tier);
  return partnerRewards.filter(r => {
    if (!r.minTier) return true;
    return tierOrder.indexOf(r.minTier) <= tierIndex;
  });
}

