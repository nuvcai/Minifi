/**
 * Effort-Based Rewards System
 * 
 * This module defines the rewards for effort and courage, NOT just outcomes.
 * Philosophy: Learning happens through trying, not just succeeding.
 */

export interface CourageReward {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  trigger: string;
  emoji: string;
}

export interface EffortBadge {
  id: string;
  name: string;
  description: string;
  requirement: string;
  emoji: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
}

export interface LearningMilestone {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  requirement: number;
  type: "missions_attempted" | "assets_explored" | "risks_taken" | "coaches_consulted";
}

// Courage XP rewards for taking action regardless of outcome
export const courageRewards: CourageReward[] = [
  {
    id: "first-risk",
    name: "First Steps",
    description: "You took your first investment risk! Every expert was once a beginner.",
    xpReward: 50,
    trigger: "first_investment",
    emoji: "🌱",
  },
  {
    id: "high-risk-courage",
    name: "Bold Move",
    description: "You invested in a high-risk option! That takes guts.",
    xpReward: 25,
    trigger: "high_risk_investment",
    emoji: "⚡",
  },
  {
    id: "extreme-risk-courage",
    name: "Fearless Explorer",
    description: "You went for an extreme-risk investment! Win or lose, you'll learn a ton.",
    xpReward: 35,
    trigger: "extreme_risk_investment",
    emoji: "🔥",
  },
  {
    id: "try-different",
    name: "Curious Mind",
    description: "You explored a new asset class! Diversification starts with curiosity.",
    xpReward: 15,
    trigger: "new_asset_class",
    emoji: "🔍",
  },
  {
    id: "loss-lesson",
    name: "Tuition Paid",
    description: "You lost money but gained wisdom. The best investors learn from losses!",
    xpReward: 30,
    trigger: "investment_loss",
    emoji: "📚",
  },
  {
    id: "kept-trying",
    name: "Resilient Spirit",
    description: "You kept investing after a loss. That's the mindset of a winner!",
    xpReward: 40,
    trigger: "invest_after_loss",
    emoji: "💪",
  },
  {
    id: "read-the-risks",
    name: "Due Diligence",
    description: "You read the risk preview before investing. Smart move!",
    xpReward: 10,
    trigger: "viewed_risk_preview",
    emoji: "👀",
  },
  {
    id: "coach-listener",
    name: "Good Student",
    description: "You checked your coach's advice before deciding. Wisdom comes from listening!",
    xpReward: 10,
    trigger: "viewed_coach_advice",
    emoji: "👂",
  },
];

// ============================================================================
// CRISIS MASTERY BADGES - Learning Through Adversity
// ============================================================================

export interface CrisisMasteryBadge extends EffortBadge {
  wisdomUnlocked?: string;
}

export const crisisMasteryBadges: CrisisMasteryBadge[] = [
  {
    id: "first-lesson",
    name: "Tuition Paid",
    description: "Experienced your first investment loss. The market is the best teacher!",
    requirement: "experience_1_loss",
    emoji: "📚",
    tier: "bronze",
    wisdomUnlocked: "Every loss is a lesson - the best investors have the biggest lesson books.",
  },
  {
    id: "crisis-navigator",
    name: "Crisis Navigator",
    description: "Survived 3 negative market events. You're building emotional resilience!",
    requirement: "survive_3_crises",
    emoji: "🧭",
    tier: "silver",
    wisdomUnlocked: "Family Offices survived 1929, 1987, 2000, 2008, and 2020. Survival is the first rule.",
  },
  {
    id: "panic-proof",
    name: "Panic Proof",
    description: "Held an investment through a 30%+ drawdown without panic selling.",
    requirement: "hold_through_30_drawdown",
    emoji: "💎",
    tier: "gold",
    wisdomUnlocked: "Warren Buffett made billions by buying during crashes, not running from them.",
  },
  {
    id: "lesson-collector",
    name: "Lesson Collector",
    description: "Experienced all types of market conditions - bubbles, crashes, and recoveries.",
    requirement: "experience_all_conditions",
    emoji: "🗃️",
    tier: "gold",
    wisdomUnlocked: "The investor who has seen everything fears nothing - experience is your shield.",
  },
  {
    id: "wisdom-seeker",
    name: "Wisdom Seeker",
    description: "Completed reflection after every loss. True students of the market!",
    requirement: "reflect_on_all_losses",
    emoji: "🔮",
    tier: "platinum",
    wisdomUnlocked: "Pain + Reflection = Progress. The best investors keep detailed mistake journals.",
  },
  {
    id: "emotional-master",
    name: "Emotional Master",
    description: "Made investment decisions without FOMO or panic for 10 consecutive trades.",
    requirement: "10_rational_decisions",
    emoji: "🧘",
    tier: "platinum",
    wisdomUnlocked: "Your biggest enemy isn't the market - it's your own emotions.",
  },
  {
    id: "generational-thinker",
    name: "Generational Thinker",
    description: "Maintained a diversified portfolio through multiple market cycles.",
    requirement: "diversified_through_cycles",
    emoji: "🏛️",
    tier: "platinum",
    wisdomUnlocked: "Family Offices think in decades, not days. They build wealth that lasts generations.",
  },
];

// Effort-based badges (achievements)
export const effortBadges: EffortBadge[] = [
  // Mission Completion Badges (effort over outcome)
  {
    id: "first-mission",
    name: "Mission Starter",
    description: "Completed your first mission - outcome doesn't matter, you showed up!",
    requirement: "complete_1_mission",
    emoji: "🎯",
    tier: "bronze",
  },
  {
    id: "mission-streak-3",
    name: "Consistent Learner",
    description: "Completed 3 missions in a row. Consistency beats perfection!",
    requirement: "complete_3_missions",
    emoji: "🔥",
    tier: "silver",
  },
  {
    id: "mission-streak-6",
    name: "History Student",
    description: "Completed all 6 historical missions. You've seen it all!",
    requirement: "complete_6_missions",
    emoji: "🎓",
    tier: "gold",
  },

  // Risk-Taking Badges
  {
    id: "risk-sampler",
    name: "Risk Sampler",
    description: "Tried investments at 3 different risk levels. Exploration is key!",
    requirement: "try_3_risk_levels",
    emoji: "🎲",
    tier: "bronze",
  },
  {
    id: "full-spectrum",
    name: "Full Spectrum",
    description: "Invested in all risk levels from none to extreme. Now you know your comfort zone!",
    requirement: "try_all_risk_levels",
    emoji: "🌈",
    tier: "gold",
  },

  // Asset Class Exploration Badges
  {
    id: "asset-explorer",
    name: "Asset Explorer",
    description: "Tried 3 different asset classes. Diversification in action!",
    requirement: "try_3_asset_classes",
    emoji: "🗺️",
    tier: "bronze",
  },
  {
    id: "asset-master",
    name: "Asset Master",
    description: "Invested in all asset classes at least once. You're well-rounded!",
    requirement: "try_all_asset_classes",
    emoji: "👑",
    tier: "platinum",
  },

  // Coach Relationship Badges
  {
    id: "coach-curious",
    name: "Coach Curious",
    description: "Got advice from 2 different coaches. Different perspectives matter!",
    requirement: "try_2_coaches",
    emoji: "🤝",
    tier: "bronze",
  },
  {
    id: "coach-collector",
    name: "Coach Collector",
    description: "Learned from all 4 coaches. You value diverse opinions!",
    requirement: "try_4_coaches",
    emoji: "🧠",
    tier: "gold",
  },

  // Learning From Failure Badges
  {
    id: "bounce-back",
    name: "Bounce Back",
    description: "Made an investment right after experiencing a loss. Resilience unlocked!",
    requirement: "invest_after_loss",
    emoji: "🦘",
    tier: "silver",
  },
  {
    id: "loss-veteran",
    name: "Battle Tested",
    description: "Experienced 3 losing investments and kept going. Losses are lessons!",
    requirement: "experience_3_losses",
    emoji: "🛡️",
    tier: "gold",
  },
  {
    id: "phoenix",
    name: "Phoenix",
    description: "Made a profit after 2 consecutive losses. You rose from the ashes!",
    requirement: "profit_after_2_losses",
    emoji: "🔥",
    tier: "platinum",
  },

  // Effort Streak Badges
  {
    id: "daily-learner",
    name: "Daily Learner",
    description: "Played for 3 days in a row. Consistency is the secret to mastery!",
    requirement: "3_day_streak",
    emoji: "📆",
    tier: "bronze",
  },
  {
    id: "weekly-warrior",
    name: "Weekly Warrior",
    description: "Played for 7 days in a row. You're building real habits!",
    requirement: "7_day_streak",
    emoji: "⚔️",
    tier: "gold",
  },
];

// Learning milestones that reward cumulative effort
export const learningMilestones: LearningMilestone[] = [
  {
    id: "missions-5",
    name: "Getting Started",
    description: "Attempted 5 mission investments",
    xpReward: 100,
    requirement: 5,
    type: "missions_attempted",
  },
  {
    id: "missions-15",
    name: "Mission Veteran",
    description: "Attempted 15 mission investments",
    xpReward: 250,
    requirement: 15,
    type: "missions_attempted",
  },
  {
    id: "missions-30",
    name: "Investment Scholar",
    description: "Attempted 30 mission investments",
    xpReward: 500,
    requirement: 30,
    type: "missions_attempted",
  },
  {
    id: "assets-3",
    name: "Diversifier",
    description: "Explored 3 different asset classes",
    xpReward: 75,
    requirement: 3,
    type: "assets_explored",
  },
  {
    id: "assets-6",
    name: "Full Portfolio",
    description: "Explored all 6 asset classes",
    xpReward: 200,
    requirement: 6,
    type: "assets_explored",
  },
  {
    id: "risks-10",
    name: "Risk Taker",
    description: "Took 10 high-risk or extreme-risk investments",
    xpReward: 150,
    requirement: 10,
    type: "risks_taken",
  },
  {
    id: "coaches-4",
    name: "Open Minded",
    description: "Consulted all 4 coaches",
    xpReward: 100,
    requirement: 4,
    type: "coaches_consulted",
  },
];

// ============================================================================
// WISDOM REFLECTION SYSTEM - Tracking Growth Through Failure
// ============================================================================

export interface WisdomReflection {
  id: string;
  missionYear?: number;
  missionTitle?: string;
  crisisType: string;
  investmentChoice: string;
  actualReturn: number;
  reflection: string;
  wisdomGained: string;
  timestamp: Date;
  xpEarned: number;
}

export interface WisdomProgress {
  totalReflections: number;
  lossesReflectedOn: number;
  totalLosses: number;
  wisdomXpEarned: number;
  crisisTypesExperienced: string[];
  emotionalPatternsIdentified: string[];
  foWisdomUnlocked: string[];
}

// Crisis types for categorizing failures
export const crisisTypes = {
  bubble_burst: { name: "Bubble Burst", emoji: "💥", lesson: "Recognize euphoria warning signs" },
  panic_sell: { name: "Panic Selling", emoji: "😱", lesson: "Master emotional control" },
  fomo_trap: { name: "FOMO Trap", emoji: "🎰", lesson: "Research over hype" },
  overleveraged: { name: "Overleveraged", emoji: "⚖️", lesson: "Risk management is key" },
  high_risk_loss: { name: "High Risk Loss", emoji: "🔥", lesson: "Position sizing matters" },
  impatient_exit: { name: "Impatient Exit", emoji: "⏰", lesson: "Think in decades" },
  poor_diversification: { name: "Concentration Risk", emoji: "🎯", lesson: "Diversification protects" },
  market_timing: { name: "Market Timing", emoji: "📅", lesson: "Time in > Timing" },
};

// Encouraging messages shown after losses
export const lossEncouragementMessages = [
  "Every successful investor has stories of losses that taught them invaluable lessons. You just added to yours! 📚",
  "Warren Buffett lost $23 billion in 2008. He kept investing. So should you! 💪",
  "This loss is tuition for your financial education. Way cheaper than business school! 🎓",
  "The market just taught you something no textbook could. That knowledge is yours forever! 🧠",
  "Fun fact: Most professional traders lose money on 40-60% of their trades. It's the overall learning that counts! 📊",
  "You now know something about this market scenario that you didn't before. That's real progress! 🌟",
  "Losses hurt in the moment, but they build the pattern recognition that makes great investors. Keep going! 🚀",
  "You showed up, you tried, you learned. That's more than most people ever do! 🏆",
  "Ray Dalio nearly went bankrupt in his 30s. Instead of giving up, he studied WHY. Now he's a billionaire! 💡",
  "The families that stayed wealthy for 200+ years all have one thing in common: they learned from EVERY mistake. 🏛️",
];

// Messages shown when users are hesitating on risky investments
export const courageMessages = [
  "Remember: You can't learn to swim without getting in the water! 🏊",
  "The best time to learn about risk is with virtual money. No real stakes, all the lessons! 🎮",
  "Every 'no' is also a decision. But 'yes' teaches you more! 💡",
  "Fortune favors the bold... and so does iii! 🌟",
  "Scared money don't make money... but in this game, trying IS the reward! 🎯",
  "Win or lose, you'll have a story to tell. And +iii to show for it! ✨",
];

// Calculate total effort XP for a player session
export function calculateEffortXp(actions: {
  investmentsMade: number;
  riskPreviewsViewed: number;
  coachAdviceViewed: number;
  differentRiskLevelsTried: number;
  differentAssetClassesTried: number;
  lossesExperienced: number;
  investmentsAfterLoss: number;
}): { totalXp: number; breakdown: { label: string; xp: number }[] } {
  const breakdown: { label: string; xp: number }[] = [];
  
  // Base XP for attempting investments
  const attemptXp = actions.investmentsMade * 10;
  if (attemptXp > 0) breakdown.push({ label: "Investment Attempts", xp: attemptXp });
  
  // XP for due diligence
  const diligenceXp = actions.riskPreviewsViewed * 5;
  if (diligenceXp > 0) breakdown.push({ label: "Risk Reviews", xp: diligenceXp });
  
  // XP for seeking advice
  const adviceXp = actions.coachAdviceViewed * 5;
  if (adviceXp > 0) breakdown.push({ label: "Coach Consultations", xp: adviceXp });
  
  // XP for exploration
  const explorationXp = actions.differentRiskLevelsTried * 15 + actions.differentAssetClassesTried * 15;
  if (explorationXp > 0) breakdown.push({ label: "Exploration Bonus", xp: explorationXp });
  
  // XP for learning from losses (losses are lessons!)
  const learningXp = actions.lossesExperienced * 20;
  if (learningXp > 0) breakdown.push({ label: "Lessons Learned", xp: learningXp });
  
  // XP for resilience (investing after loss)
  const resilienceXp = actions.investmentsAfterLoss * 25;
  if (resilienceXp > 0) breakdown.push({ label: "Resilience Bonus", xp: resilienceXp });
  
  const totalXp = breakdown.reduce((sum, item) => sum + item.xp, 0);
  
  return { totalXp, breakdown };
}

// Get a random encouragement message after a loss
export function getRandomLossEncouragement(): string {
  return lossEncouragementMessages[Math.floor(Math.random() * lossEncouragementMessages.length)];
}

// Get a random courage message for hesitating users
export function getRandomCourageMessage(): string {
  return courageMessages[Math.floor(Math.random() * courageMessages.length)];
}

// Centralized courage XP by risk level - single source of truth
export const riskLevelCourageXp: Record<string, { xp: number; label: string; emoji: string }> = {
  extreme: { xp: 25, label: "Fearless Explorer", emoji: "🔥" },
  high: { xp: 20, label: "Bold Investor", emoji: "⚡" },
  medium: { xp: 15, label: "Balanced Thinker", emoji: "⚖️" },
  low: { xp: 10, label: "Steady Hand", emoji: "🛡️" },
  none: { xp: 5, label: "Cautious Planner", emoji: "💎" },
};

// Get courage XP for a risk level (centralized function)
export function getCourageXpForRisk(risk: string): { xp: number; label: string; emoji: string } {
  const normalizedRisk = risk.toLowerCase();
  return riskLevelCourageXp[normalizedRisk] || { xp: 10, label: "Curious Learner", emoji: "🔍" };
}

// ============================================================================
// WISDOM XP CALCULATION - Rewarding Learning From Failure
// ============================================================================

export interface WisdomXpBreakdown {
  baseXp: number;           // XP for experiencing the loss
  reflectionBonus: number;  // Bonus for reflecting on the loss
  firstTimeBonus: number;   // Bonus for experiencing a new crisis type
  streakBonus: number;      // Bonus for consistent reflection
  totalXp: number;
}

// Calculate XP earned from a learning experience (loss + reflection)
export function calculateWisdomXp(params: {
  wasLoss: boolean;
  didReflect: boolean;
  reflectionQuality?: "quick" | "detailed"; // quick = selected preset, detailed = wrote custom
  crisisType: string;
  previousCrisisTypes: string[];
  consecutiveReflections: number;
}): WisdomXpBreakdown {
  const { wasLoss, didReflect, reflectionQuality, crisisType, previousCrisisTypes, consecutiveReflections } = params;
  
  // Base XP for experiencing any outcome (20 for loss, 10 for win - losses teach more!)
  const baseXp = wasLoss ? 30 : 15;
  
  // Reflection bonus (higher for detailed reflections)
  let reflectionBonus = 0;
  if (didReflect) {
    reflectionBonus = reflectionQuality === "detailed" ? 35 : 20;
  }
  
  // First-time crisis type bonus (learning something new!)
  const isNewCrisisType = !previousCrisisTypes.includes(crisisType);
  const firstTimeBonus = isNewCrisisType ? 25 : 0;
  
  // Streak bonus for consistent reflection (max 5x multiplier)
  const streakMultiplier = Math.min(consecutiveReflections, 5) * 5;
  const streakBonus = didReflect ? streakMultiplier : 0;
  
  const totalXp = baseXp + reflectionBonus + firstTimeBonus + streakBonus;
  
  return {
    baseXp,
    reflectionBonus,
    firstTimeBonus,
    streakBonus,
    totalXp,
  };
}

// Get encouraging message based on crisis type experienced
export function getCrisisEncouragement(crisisType: keyof typeof crisisTypes): {
  title: string;
  message: string;
  foWisdom: string;
  nextStep: string;
} {
  const crisis = crisisTypes[crisisType];
  
  const encouragements: Record<keyof typeof crisisTypes, {
    title: string;
    message: string;
    foWisdom: string;
    nextStep: string;
  }> = {
    bubble_burst: {
      title: "You Just Learned About Bubbles! 💥",
      message: "Congratulations! You experienced what millions of investors in 1990 Japan, 2000 dot-com, and 2021 crypto learned the hard way.",
      foWisdom: "Family Offices survived every bubble by NEVER putting all eggs in one basket. Diversification isn't boring - it's survival.",
      nextStep: "Next time, watch for signs of euphoria: When everyone says 'it can only go up,' it usually goes down.",
    },
    panic_sell: {
      title: "Emotional Intelligence Lesson! 😱",
      message: "You learned what happens when fear takes control. The good news? Awareness is the first step to mastery.",
      foWisdom: "Family Offices keep 10-15% in cash specifically to BUY during panics. They profit from others' fear.",
      nextStep: "Create a rule: Before selling in fear, wait 24 hours. Most panics look silly a day later.",
    },
    fomo_trap: {
      title: "FOMO Awareness Unlocked! 🎰",
      message: "You discovered why 'fear of missing out' is the most expensive emotion in investing. Knowledge is power!",
      foWisdom: "By the time your friend brags about gains, Family Offices are already selling to them.",
      nextStep: "If you can't explain WHY an investment makes sense without mentioning others' profits, don't buy it.",
    },
    overleveraged: {
      title: "Leverage Lesson Learned! ⚖️",
      message: "You experienced why leverage is called a 'double-edged sword.' It cuts both ways - hard.",
      foWisdom: "The families still wealthy after 200+ years NEVER risked what they had for what they didn't need.",
      nextStep: "Rule of thumb: If you're using leverage, you're gambling, not investing.",
    },
    high_risk_loss: {
      title: "Risk Management 101! 🔥",
      message: "High risk doesn't always mean high reward. Sometimes it just means high losses. Now you know!",
      foWisdom: "Family Offices limit any single position to 5% max. They win by not losing big.",
      nextStep: "Before any investment, ask: 'What's my maximum loss, and can I sleep with it?'",
    },
    impatient_exit: {
      title: "Patience Lesson! ⏰",
      message: "You learned why Warren Buffett's favorite holding period is 'forever.' Time is the investor's best friend.",
      foWisdom: "The Walton family held Walmart for 60+ years. They're now worth $250 billion. Patience pays.",
      nextStep: "Before selling any investment, ask: 'Would I buy this at current prices?' If yes, hold.",
    },
    poor_diversification: {
      title: "Diversification Wisdom! 🎯",
      message: "You experienced why 'don't put all your eggs in one basket' is the oldest investment advice - it works!",
      foWisdom: "Family Offices spread across stocks, bonds, real estate, commodities, and cash. No single failure can hurt them.",
      nextStep: "Aim for at least 3-4 different asset classes. Boring? Yes. Effective? Absolutely.",
    },
    market_timing: {
      title: "Time In vs Timing! 📅",
      message: "You learned why trying to time the market is a fool's game. Even professionals fail at it.",
      foWisdom: "Family Offices use 'time in the market' strategy. They invest consistently regardless of short-term noise.",
      nextStep: "Dollar-cost averaging: Invest the same amount regularly, regardless of price. Simple, yet powerful.",
    },
  };
  
  return encouragements[crisisType] || {
    title: "Learning Experience! 📚",
    message: "Every loss contains a lesson. You're building the pattern recognition that makes great investors.",
    foWisdom: "The best investors keep detailed 'mistake journals.' The patterns you see will make you wealthy.",
    nextStep: "Reflect on what happened and what you'd do differently. That's how wisdom is built.",
  };
}

// Get all crisis mastery badges (combines with effort badges)
export function getAllLearningBadges(): (EffortBadge | CrisisMasteryBadge)[] {
  return [...effortBadges, ...crisisMasteryBadges];
}

