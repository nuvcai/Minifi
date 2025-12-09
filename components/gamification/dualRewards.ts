/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   🏆 DUAL REWARDS SYSTEM - Badges + III Tokens                              ║
 * ║   Like the KEEP app: Two forms of rewards for every achievement            ║
 * ║   ✨ MiniFi / Legacy Guardians Educational Content ✨                       ║
 * ║   Copyright (c) 2025 NUVC.AI / Tick.AI. All Rights Reserved.                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * PHILOSOPHY: Every achievement gives TWO rewards:
 * 1. III TOKENS - Spendable currency, use for staking, rewards, etc.
 * 2. BADGES - Collectible achievements, show your journey and expertise
 */

// =============================================================================
// REWARD CATEGORIES
// =============================================================================

export type RewardCategory = 
  | 'crisis_wisdom'   // Learning from failures and crises
  | 'effort'          // Trying, exploring, taking action
  | 'streak'          // Consistency and daily engagement
  | 'mastery'         // Completing missions and learning
  | 'exploration'     // Discovering new asset classes, risks, coaches
  | 'resilience'      // Bouncing back from losses
  | 'generational';   // Long-term thinking and FO principles

// =============================================================================
// BADGE TIERS (Visual Rarity)
// =============================================================================

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export const TIER_CONFIG: Record<BadgeTier, {
  iiiMultiplier: number;  // Multiply base III reward
  color: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
}> = {
  bronze: {
    iiiMultiplier: 1.0,
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-300',
    glowColor: 'shadow-amber-200',
  },
  silver: {
    iiiMultiplier: 1.5,
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
    borderColor: 'border-slate-300',
    glowColor: 'shadow-slate-200',
  },
  gold: {
    iiiMultiplier: 2.0,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-400',
    glowColor: 'shadow-yellow-300',
  },
  platinum: {
    iiiMultiplier: 3.0,
    color: 'text-violet-600',
    bgColor: 'bg-violet-100',
    borderColor: 'border-violet-400',
    glowColor: 'shadow-violet-300',
  },
  diamond: {
    iiiMultiplier: 5.0,
    color: 'text-cyan-600',
    bgColor: 'bg-gradient-to-br from-cyan-100 to-blue-100',
    borderColor: 'border-cyan-400',
    glowColor: 'shadow-cyan-300',
  },
};

// =============================================================================
// DUAL REWARD BADGE INTERFACE
// =============================================================================

export interface DualRewardBadge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: RewardCategory;
  tier: BadgeTier;
  
  // III Token Reward
  baseIIIReward: number;
  
  // Unlock condition
  requirement: string;
  requirementValue?: number;
  
  // Optional: Wisdom unlocked
  wisdomUnlocked?: string;
  foWisdom?: string;
  
  // Display
  celebrationMessage?: string;
}

// =============================================================================
// 🔥 CRISIS WISDOM BADGES - Learning from failures
// =============================================================================

export const crisisWisdomBadges: DualRewardBadge[] = [
  {
    id: 'first-lesson',
    name: 'Tuition Paid',
    description: 'Experienced your first investment loss - the market is the best teacher!',
    emoji: '📚',
    category: 'crisis_wisdom',
    tier: 'bronze',
    baseIIIReward: 50,
    requirement: 'first_loss',
    wisdomUnlocked: 'Every loss is a lesson. The best investors have the biggest lesson books.',
    celebrationMessage: 'You just paid tuition to the best school: the market! 🎓',
  },
  {
    id: 'bubble-survivor',
    name: 'Bubble Spotter',
    description: 'Recognized and survived a market bubble',
    emoji: '🫧',
    category: 'crisis_wisdom',
    tier: 'silver',
    baseIIIReward: 100,
    requirement: 'survive_bubble',
    wisdomUnlocked: 'When everyone is euphoric and prices seem too good to be true, they usually are.',
    foWisdom: 'Family Offices survived every bubble by NEVER putting all eggs in one basket.',
  },
  {
    id: 'panic-proof',
    name: 'Diamond Hands',
    description: 'Held through a 30%+ drawdown without panic selling',
    emoji: '💎',
    category: 'crisis_wisdom',
    tier: 'gold',
    baseIIIReward: 200,
    requirement: 'hold_through_30_drawdown',
    wisdomUnlocked: 'The stock market transfers money from the impatient to the patient.',
    foWisdom: 'Warren Buffett made billions by buying DURING panics, not running from them.',
    celebrationMessage: 'Diamond hands! You held when others folded! 💎🙌',
  },
  {
    id: 'crisis-navigator',
    name: 'Crisis Navigator',
    description: 'Successfully navigated 3 different market crises',
    emoji: '🧭',
    category: 'crisis_wisdom',
    tier: 'gold',
    baseIIIReward: 250,
    requirement: 'survive_3_crises',
    requirementValue: 3,
    wisdomUnlocked: 'Every crisis in history eventually ended. The question is: were you positioned to benefit?',
    foWisdom: 'Family Offices survived 1929, 1987, 2000, 2008, and 2020. Survival is the first rule.',
  },
  {
    id: 'wisdom-seeker',
    name: 'Wisdom Seeker',
    description: 'Completed reflection after every loss',
    emoji: '🔮',
    category: 'crisis_wisdom',
    tier: 'platinum',
    baseIIIReward: 400,
    requirement: 'reflect_all_losses',
    wisdomUnlocked: 'Pain + Reflection = Progress. This is how generational wealth builders learn.',
    foWisdom: 'The best investors keep detailed mistake journals. Patterns become profitable.',
    celebrationMessage: 'True wisdom: learning from every setback! 🔮✨',
  },
  {
    id: 'generational-thinker',
    name: 'Generational Thinker',
    description: 'Maintained diversified portfolio through multiple market cycles',
    emoji: '🏛️',
    category: 'crisis_wisdom',
    tier: 'diamond',
    baseIIIReward: 500,
    requirement: 'diversified_through_cycles',
    wisdomUnlocked: 'Wealthy families think in decades, not days. They build wealth that lasts generations.',
    foWisdom: 'The families still wealthy after 200+ years all mastered this: diversify and survive.',
    celebrationMessage: 'You think like a Family Office! 🏛️👑',
  },
];

// =============================================================================
// 💪 EFFORT BADGES - Trying, exploring, taking action
// =============================================================================

export const effortBadges: DualRewardBadge[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Made your first investment decision',
    emoji: '🌱',
    category: 'effort',
    tier: 'bronze',
    baseIIIReward: 50,
    requirement: 'first_investment',
    celebrationMessage: 'Every expert was once a beginner! 🌱',
  },
  {
    id: 'bold-move',
    name: 'Bold Move',
    description: 'Made a high-risk investment',
    emoji: '⚡',
    category: 'effort',
    tier: 'bronze',
    baseIIIReward: 30,
    requirement: 'high_risk_investment',
    celebrationMessage: 'Fortune favors the bold! ⚡',
  },
  {
    id: 'fearless-explorer',
    name: 'Fearless Explorer',
    description: 'Made an extreme-risk investment',
    emoji: '🔥',
    category: 'effort',
    tier: 'silver',
    baseIIIReward: 50,
    requirement: 'extreme_risk_investment',
    wisdomUnlocked: 'High risk requires high conviction. Know what you own and why you own it.',
    celebrationMessage: 'No fear! The best lessons come from bold moves! 🔥',
  },
  {
    id: 'due-diligence',
    name: 'Due Diligence',
    description: 'Reviewed risk preview before 10 investments',
    emoji: '🔍',
    category: 'effort',
    tier: 'silver',
    baseIIIReward: 75,
    requirement: 'risk_previews_viewed',
    requirementValue: 10,
    wisdomUnlocked: 'The best investors spend 80% researching, 20% acting.',
  },
  {
    id: 'coach-listener',
    name: 'Good Student',
    description: 'Consulted coach advice before 10 decisions',
    emoji: '👂',
    category: 'effort',
    tier: 'silver',
    baseIIIReward: 75,
    requirement: 'coach_advice_viewed',
    requirementValue: 10,
    wisdomUnlocked: 'Wisdom comes from listening to diverse perspectives.',
  },
];

// =============================================================================
// 🔥 STREAK BADGES - Daily consistency
// =============================================================================

export const streakBadges: DualRewardBadge[] = [
  {
    id: 'streak-3',
    name: 'Getting Started',
    description: '3 days in a row!',
    emoji: '🔥',
    category: 'streak',
    tier: 'bronze',
    baseIIIReward: 25,
    requirement: 'streak_days',
    requirementValue: 3,
    celebrationMessage: 'Three days strong! Keep the fire burning! 🔥',
  },
  {
    id: 'streak-7',
    name: 'Weekly Warrior',
    description: '7 days in a row!',
    emoji: '⚔️',
    category: 'streak',
    tier: 'silver',
    baseIIIReward: 75,
    requirement: 'streak_days',
    requirementValue: 7,
    wisdomUnlocked: 'Consistency beats intensity. Small daily actions compound into major results.',
    celebrationMessage: 'A full week! You are building real habits! ⚔️',
  },
  {
    id: 'streak-14',
    name: 'Fortnight Fighter',
    description: '14 days in a row!',
    emoji: '🛡️',
    category: 'streak',
    tier: 'gold',
    baseIIIReward: 150,
    requirement: 'streak_days',
    requirementValue: 14,
    wisdomUnlocked: 'Two weeks of consistent effort shows real commitment.',
    celebrationMessage: 'Two weeks strong! Unstoppable! 🛡️',
  },
  {
    id: 'streak-30',
    name: 'Monthly Legend',
    description: '30 days in a row!',
    emoji: '👑',
    category: 'streak',
    tier: 'platinum',
    baseIIIReward: 500,
    requirement: 'streak_days',
    requirementValue: 30,
    wisdomUnlocked: 'A month of daily practice. This is how experts are made.',
    foWisdom: 'Compound growth applies to knowledge too. 30 days of learning beats 1 day of cramming.',
    celebrationMessage: 'ONE MONTH! You are legendary! 👑🎉',
  },
  {
    id: 'streak-100',
    name: 'Century Champion',
    description: '100 days in a row!',
    emoji: '💯',
    category: 'streak',
    tier: 'diamond',
    baseIIIReward: 1000,
    requirement: 'streak_days',
    requirementValue: 100,
    wisdomUnlocked: '100 days of consistent effort. You are in the top 1% of dedicated learners.',
    foWisdom: 'The wealthiest families built their fortunes through decades of consistent action.',
    celebrationMessage: '100 DAYS! You are in legendary territory! 💯🏆',
  },
];

// =============================================================================
// 🎯 MASTERY BADGES - Learning and completing missions
// =============================================================================

export const masteryBadges: DualRewardBadge[] = [
  {
    id: 'mission-starter',
    name: 'Mission Starter',
    description: 'Completed your first historical mission',
    emoji: '🎯',
    category: 'mastery',
    tier: 'bronze',
    baseIIIReward: 100,
    requirement: 'missions_completed',
    requirementValue: 1,
    celebrationMessage: 'First mission complete! History is your teacher! 🎯',
  },
  {
    id: 'mission-veteran',
    name: 'Mission Veteran',
    description: 'Completed 3 historical missions',
    emoji: '🎖️',
    category: 'mastery',
    tier: 'silver',
    baseIIIReward: 200,
    requirement: 'missions_completed',
    requirementValue: 3,
    wisdomUnlocked: 'You are learning from multiple market crises. Pattern recognition is building.',
  },
  {
    id: 'history-scholar',
    name: 'History Scholar',
    description: 'Completed all 6 historical missions',
    emoji: '🎓',
    category: 'mastery',
    tier: 'gold',
    baseIIIReward: 500,
    requirement: 'missions_completed',
    requirementValue: 6,
    wisdomUnlocked: 'Those who cannot remember the past are condemned to repeat it. You will not.',
    foWisdom: 'Family Offices study every crash in history. Now you have too.',
    celebrationMessage: 'All missions complete! You are a certified History Scholar! 🎓',
  },
  {
    id: 'quiz-master',
    name: 'Quiz Master',
    description: 'Achieved perfect score on 5 quizzes',
    emoji: '🧠',
    category: 'mastery',
    tier: 'gold',
    baseIIIReward: 300,
    requirement: 'perfect_quizzes',
    requirementValue: 5,
    wisdomUnlocked: 'Knowledge that is tested and proven is knowledge that sticks.',
  },
  {
    id: 'thesis-writer',
    name: 'Investment Philosopher',
    description: 'Written 10 investment theses',
    emoji: '📝',
    category: 'mastery',
    tier: 'platinum',
    baseIIIReward: 400,
    requirement: 'theses_written',
    requirementValue: 10,
    wisdomUnlocked: 'If you cannot explain your investment in simple terms, you do not understand it.',
    foWisdom: 'Family Offices document every investment decision. The journal creates wisdom.',
  },
];

// =============================================================================
// 🗺️ EXPLORATION BADGES - Discovering different investments
// =============================================================================

export const explorationBadges: DualRewardBadge[] = [
  {
    id: 'risk-sampler',
    name: 'Risk Sampler',
    description: 'Tried 3 different risk levels',
    emoji: '🎲',
    category: 'exploration',
    tier: 'bronze',
    baseIIIReward: 50,
    requirement: 'risk_levels_tried',
    requirementValue: 3,
    wisdomUnlocked: 'Understanding your risk tolerance is the first step to smart investing.',
  },
  {
    id: 'full-spectrum',
    name: 'Full Spectrum',
    description: 'Experienced all risk levels from safe to extreme',
    emoji: '🌈',
    category: 'exploration',
    tier: 'gold',
    baseIIIReward: 200,
    requirement: 'risk_levels_tried',
    requirementValue: 5,
    wisdomUnlocked: 'You now understand the full range of risk. This knowledge is priceless.',
    foWisdom: 'Family Offices allocate across all risk levels. Now you know why.',
  },
  {
    id: 'asset-explorer',
    name: 'Asset Explorer',
    description: 'Tried 3 different asset classes',
    emoji: '🗺️',
    category: 'exploration',
    tier: 'bronze',
    baseIIIReward: 50,
    requirement: 'asset_classes_tried',
    requirementValue: 3,
    wisdomUnlocked: 'Diversification begins with exploration. Well done!',
  },
  {
    id: 'asset-master',
    name: 'Asset Master',
    description: 'Invested in all 6 asset classes',
    emoji: '👑',
    category: 'exploration',
    tier: 'platinum',
    baseIIIReward: 400,
    requirement: 'asset_classes_tried',
    requirementValue: 6,
    wisdomUnlocked: 'You understand all major asset classes. This is Family Office level knowledge.',
    foWisdom: 'The wealthiest families spread across stocks, bonds, real estate, commodities, and cash.',
    celebrationMessage: 'All asset classes mastered! You think like a Family Office! 👑',
  },
  {
    id: 'coach-collector',
    name: 'Open Minded',
    description: 'Got advice from all 4 coaches',
    emoji: '🧠',
    category: 'exploration',
    tier: 'gold',
    baseIIIReward: 150,
    requirement: 'coaches_used',
    requirementValue: 4,
    wisdomUnlocked: 'Wise investors seek diverse perspectives before making decisions.',
  },
];

// =============================================================================
// 💪 RESILIENCE BADGES - Bouncing back from losses
// =============================================================================

export const resilienceBadges: DualRewardBadge[] = [
  {
    id: 'bounce-back',
    name: 'Bounce Back',
    description: 'Made an investment right after a loss',
    emoji: '🦘',
    category: 'resilience',
    tier: 'silver',
    baseIIIReward: 100,
    requirement: 'invest_after_loss',
    wisdomUnlocked: 'The ability to try again after failure separates winners from quitters.',
    celebrationMessage: 'You bounced back! That is the mindset of a winner! 🦘',
  },
  {
    id: 'battle-tested',
    name: 'Battle Tested',
    description: 'Experienced 3 losses and kept going',
    emoji: '🛡️',
    category: 'resilience',
    tier: 'gold',
    baseIIIReward: 250,
    requirement: 'losses_experienced',
    requirementValue: 3,
    wisdomUnlocked: 'Three falls, still standing. This is how champions are forged.',
    foWisdom: 'The Rockefellers faced multiple bankruptcies before building their empire.',
  },
  {
    id: 'phoenix',
    name: 'Phoenix Rising',
    description: 'Made a profit after 2 consecutive losses',
    emoji: '🔥',
    category: 'resilience',
    tier: 'platinum',
    baseIIIReward: 400,
    requirement: 'profit_after_consecutive_losses',
    requirementValue: 2,
    wisdomUnlocked: 'From the ashes rises the phoenix. Your resilience is remarkable.',
    foWisdom: 'Ray Dalio nearly went bankrupt in his 30s. Instead of giving up, he studied why. Now he is a billionaire.',
    celebrationMessage: 'PHOENIX RISING! You turned losses into victory! 🔥🦅',
  },
  {
    id: 'emotional-master',
    name: 'Emotional Master',
    description: 'Made 10 consecutive decisions without panic or FOMO',
    emoji: '🧘',
    category: 'resilience',
    tier: 'diamond',
    baseIIIReward: 500,
    requirement: 'rational_decisions',
    requirementValue: 10,
    wisdomUnlocked: 'Your biggest enemy is not the market - it is your own emotions. You have conquered this.',
    foWisdom: 'Family Offices succeed because they remove emotion from investment decisions.',
    celebrationMessage: 'EMOTIONAL MASTERY ACHIEVED! You control your mind! 🧘✨',
  },
];

// =============================================================================
// ALL BADGES COMBINED
// =============================================================================

export const ALL_BADGES: DualRewardBadge[] = [
  ...crisisWisdomBadges,
  ...effortBadges,
  ...streakBadges,
  ...masteryBadges,
  ...explorationBadges,
  ...resilienceBadges,
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get badges by category
 */
export function getBadgesByCategory(category: RewardCategory): DualRewardBadge[] {
  return ALL_BADGES.filter(b => b.category === category);
}

/**
 * Calculate total III reward for a badge (tier multiplier applied)
 */
export function calculateBadgeIIIReward(badge: DualRewardBadge): number {
  const tierConfig = TIER_CONFIG[badge.tier];
  return Math.round(badge.baseIIIReward * tierConfig.iiiMultiplier);
}

/**
 * Get the display info for a badge tier
 */
export function getTierDisplayInfo(tier: BadgeTier) {
  return TIER_CONFIG[tier];
}

/**
 * Get category display info
 */
export const CATEGORY_INFO: Record<RewardCategory, {
  name: string;
  emoji: string;
  description: string;
  color: string;
}> = {
  crisis_wisdom: {
    name: 'Crisis Wisdom',
    emoji: '🔥',
    description: 'Learning from failures and market crises',
    color: 'text-red-600',
  },
  effort: {
    name: 'Effort',
    emoji: '💪',
    description: 'Taking action and trying new things',
    color: 'text-blue-600',
  },
  streak: {
    name: 'Streak',
    emoji: '🔥',
    description: 'Daily consistency and engagement',
    color: 'text-orange-600',
  },
  mastery: {
    name: 'Mastery',
    emoji: '🎯',
    description: 'Completing missions and learning',
    color: 'text-purple-600',
  },
  exploration: {
    name: 'Exploration',
    emoji: '🗺️',
    description: 'Discovering different investments',
    color: 'text-emerald-600',
  },
  resilience: {
    name: 'Resilience',
    emoji: '💎',
    description: 'Bouncing back from setbacks',
    color: 'text-cyan-600',
  },
  generational: {
    name: 'Generational',
    emoji: '🏛️',
    description: 'Family Office level thinking',
    color: 'text-amber-600',
  },
};

/**
 * Summary stats for badges
 */
export function getBadgeSummary(earnedBadgeIds: string[]): {
  totalBadges: number;
  earnedBadges: number;
  totalIIIFromBadges: number;
  byCategory: Record<RewardCategory, { earned: number; total: number }>;
  byTier: Record<BadgeTier, { earned: number; total: number }>;
} {
  const categories = Object.keys(CATEGORY_INFO) as RewardCategory[];
  const tiers = Object.keys(TIER_CONFIG) as BadgeTier[];
  
  const byCategory = {} as Record<RewardCategory, { earned: number; total: number }>;
  const byTier = {} as Record<BadgeTier, { earned: number; total: number }>;
  
  // Initialize
  categories.forEach(cat => {
    byCategory[cat] = { earned: 0, total: 0 };
  });
  tiers.forEach(tier => {
    byTier[tier] = { earned: 0, total: 0 };
  });
  
  // Count
  let totalIII = 0;
  ALL_BADGES.forEach(badge => {
    const isEarned = earnedBadgeIds.includes(badge.id);
    byCategory[badge.category].total++;
    byTier[badge.tier].total++;
    if (isEarned) {
      byCategory[badge.category].earned++;
      byTier[badge.tier].earned++;
      totalIII += calculateBadgeIIIReward(badge);
    }
  });
  
  return {
    totalBadges: ALL_BADGES.length,
    earnedBadges: earnedBadgeIds.length,
    totalIIIFromBadges: totalIII,
    byCategory,
    byTier,
  };
}


