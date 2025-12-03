/**
 * Gamification Components - Loss Aversion & Effort-Based Rewards
 * 
 * Export all gamification-related components and utilities.
 */

// Loss Aversion Components
export { RiskPreviewCard } from "./RiskPreviewCard";
export { CourageXpNotification, MiniCourageXp } from "./CourageXpNotification";

// Quick Win Components
export { LevelUpCelebration, levelTitles } from "./LevelUpCelebration";
export { XpProgressBar, XpBadge } from "./XpProgressBar";
export { DailyStreak, StreakBadge } from "./DailyStreak";
export { 
  FloatingXp, 
  InlineFloatingXp, 
  FloatingXpContainer, 
  useFloatingXp,
  type FloatingXpItem 
} from "./FloatingXp";

// Badge Display Component
export { BadgeDisplay } from "./BadgeDisplay";

// Milestone Achievement Modal
export { MilestoneAchievement } from "./MilestoneAchievement";

// KEEP-Style League Division System
export { 
  LeagueSystem, 
  LEAGUES,
  type League,
  type LeaguePlayer,
  type LeagueReward,
} from "./LeagueSystem";

// Investor Journey - Narrative Badge Progression
export { InvestorJourney, journeyStages, type JourneyStage } from "./InvestorJourney";

// Staking & Flybuys Components
export { StakingCard } from "./StakingCard";
export { FlybuysRewards } from "./FlybuysRewards";

// Internal Savings System
export { SavingsVault } from "./SavingsVault";

// Staking Types & Data
export * from "./stakingTypes";
export {
  stakingPools,
  membershipTiers,
  partnerRewards,
  boostOffers,
  nftRewards,
  getPoolById,
  getTierByPoints,
  getNextTier,
  calculateDailyYield,
  calculateTotalYield,
  getRewardsByCategory,
  getFeaturedRewards,
  getRewardsForTier,
} from "./stakingData";

// Effort Rewards Data & Utilities
export {
  courageRewards,
  effortBadges,
  learningMilestones,
  lossEncouragementMessages,
  courageMessages,
  riskLevelCourageXp,
  calculateEffortXp,
  getRandomLossEncouragement,
  getRandomCourageMessage,
  getCourageXpForRisk,
  type CourageReward,
  type EffortBadge,
  type LearningMilestone,
} from "./effortRewards";

