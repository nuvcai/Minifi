/**
 * Gamification Components - Simplified XP + League System
 * 
 * PHILOSOPHY: One currency (XP) + One competition (League)
 * Badges are cosmetic achievements only - no separate currencies!
 */

// =============================================================================
// XP SYSTEM (Primary)
// =============================================================================

// iii Dashboard (Consolidated token view)
export { IIIDashboard } from "./IIIDashboard";

// XP Display Components
export { LevelUpCelebration, levelTitles } from "./LevelUpCelebration";
export { XpProgressBar, XpBadge } from "./XpProgressBar";
export { 
  FloatingXp, 
  InlineFloatingXp, 
  FloatingXpContainer, 
  useFloatingXp,
  type FloatingXpItem 
} from "./FloatingXp";

// =============================================================================
// LEAGUE SYSTEM (Competition)
// =============================================================================

export { 
  LeagueSystem, 
  LEAGUES,
  type League,
  type LeaguePlayer,
  type LeagueReward,
} from "./LeagueSystem";

export { LeagueBadge, MiniLeagueBadge } from "./LeagueBadge";
export { SeasonEndCelebration, type SeasonEndResult } from "./SeasonEndCelebration";

// =============================================================================
// ENGAGEMENT MECHANICS
// =============================================================================

// Daily Streak (grants XP directly)
export { DailyStreak, StreakBadge } from "./DailyStreak";

// Courage/Risk notifications (cosmetic celebration)
export { CourageXpNotification, MiniCourageXp } from "./CourageXpNotification";
export { RiskPreviewCard } from "./RiskPreviewCard";

// Milestone Achievement (cosmetic celebration)
export { MilestoneAchievement } from "./MilestoneAchievement";

// =============================================================================
// BADGES (Cosmetic Only - No Separate Currency)
// =============================================================================

export { BadgeDisplay } from "./BadgeDisplay";

// Badge definitions from effortRewards (cosmetic achievements)
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
  // Crisis mastery badges and wisdom system
  crisisMasteryBadges,
  crisisTypes,
  calculateWisdomXp,
  getCrisisEncouragement,
  getAllLearningBadges,
  type CourageReward,
  type EffortBadge,
  type LearningMilestone,
  type CrisisMasteryBadge,
  type WisdomReflection,
  type WisdomProgress,
  type WisdomXpBreakdown,
} from "./effortRewards";

// =============================================================================
// CRISIS LEARNING (Learning from Failure)
// =============================================================================

export { CrisisReflection, type CrisisReflectionProps } from "./CrisisReflection";

// =============================================================================
// DUAL REWARDS SYSTEM (Badges + III Tokens - like KEEP app)
// =============================================================================

export {
  DualRewardCelebration,
  MiniDualReward,
  BadgeCollection,
} from "./DualRewardCelebration";

export { RewardsDashboard } from "./RewardsDashboard";

export {
  // Badge categories
  crisisWisdomBadges,
  effortBadges as dualEffortBadges,
  streakBadges,
  masteryBadges,
  explorationBadges,
  resilienceBadges,
  ALL_BADGES,
  
  // Tier config
  TIER_CONFIG,
  CATEGORY_INFO,
  
  // Helper functions
  getBadgesByCategory,
  calculateBadgeIIIReward,
  getTierDisplayInfo,
  getBadgeSummary,
  
  // Types
  type DualRewardBadge,
  type RewardCategory,
  type BadgeTier,
} from "./dualRewards";

// =============================================================================
// NARRATIVE / JOURNEY (Cosmetic Progression)
// =============================================================================

export { InvestorJourney, journeyStages, type JourneyStage } from "./InvestorJourney";

// =============================================================================
// SAVINGS VAULT (Educational Feature)
// =============================================================================

export { SavingsVault } from "./SavingsVault";

// =============================================================================
// STAKING (Educational Simulation)
// =============================================================================

export { StakingCard } from "./StakingCard";
export { FlybuysRewards } from "./FlybuysRewards";

export {
  type StakingPool,
  type UserStake,
  type StakingStats,
  type MembershipTier,
  type PartnerReward,
  type BoostOffer,
  type NFTReward,
  type StakingTier,
  type TierBenefits,
  type FlybuysPoints,
  // RewardCategory already exported from dualRewards
  type ActiveBoost,
} from "./stakingTypes";

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

// =============================================================================
// DEPRECATED - Points System (Remove in next major version)
// =============================================================================

/**
 * @deprecated Use XP system instead. Points are being consolidated into XP.
 * RewardsStore and pointsSystem will be removed in v2.0
 */
export { RewardsStore } from "./RewardsStore";
export * from "./pointsSystem";
