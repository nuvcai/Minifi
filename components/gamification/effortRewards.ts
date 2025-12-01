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
];

// Messages shown when users are hesitating on risky investments
export const courageMessages = [
  "Remember: You can't learn to swim without getting in the water! 🏊",
  "The best time to learn about risk is with virtual money. No real stakes, all the lessons! 🎮",
  "Every 'no' is also a decision. But 'yes' teaches you more! 💡",
  "Fortune favors the bold... and so does XP! 🌟",
  "Scared money don't make money... but in this game, trying IS the reward! 🎯",
  "Win or lose, you'll have a story to tell. And +XP to show for it! ✨",
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

