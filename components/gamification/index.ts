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

// Effort Rewards Data & Utilities
export {
  courageRewards,
  effortBadges,
  learningMilestones,
  lossEncouragementMessages,
  courageMessages,
  calculateEffortXp,
  getRandomLossEncouragement,
  getRandomCourageMessage,
  type CourageReward,
  type EffortBadge,
  type LearningMilestone,
} from "./effortRewards";

