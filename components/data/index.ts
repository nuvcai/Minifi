/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   📚 DATA MODULE EXPORTS - Family Office Financial Literacy Content          ║
 * ║   ✨ MiniFi / Legacy Guardians Educational Content ✨                       ║
 * ║   Copyright (c) 2025 NUVC.AI / Tick.AI. All Rights Reserved.                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// Asset Classes - Comprehensive FO-aligned asset class definitions
export * from './assetClasses';

// Coaches - AI investment mentors with FO wisdom
export * from './coaches';

// Missions - Historical financial events with educational content
export * from './missions';

// Events - Financial timeline events
export * from './events';

// Chapters - Unified chapter/era/progression data (NEW)
// Note: Selective exports to avoid conflicts with wealthWisdom
export {
  type Chapter,
  type LevelMeta,
  type WealthPillar as ChapterWealthPillar,
  type GenerationalOpportunity,
  type AssetClass as ChapterAssetClass,
  type Strategy,
  type InnovationCycle,
  type MasteryLevel,
  chapters,
  levelMeta,
  wealthPillars as chapterWealthPillars,
  generationalOpportunities,
  assetClasses as chapterAssetClasses,
  strategies,
  innovationCycles,
  masteryLevels,
  getMasteryLevel,
  getNextMasteryLevel,
  getPillarMastery,
  getAssetMastery,
  getStrategyMastery,
  calculateOverallProgress,
} from './chapters';

// Rewards - Gamification reward system
export * from './rewards';

// Wealth Wisdom - Generational wealth building knowledge
export * from './wealthWisdom';

// Personalized Coaching - User profiles, learning styles, risk assessment
export * from './personalizedCoaching';

// Marketing Data - Analytics, consent, attribution, security
export * from './marketingData';

// Marketing Messages - Value propositions, taglines, feature benefits, teasers
export * from './marketingMessages';

// Viral Marketing - Referrals, sharing, leaderboards, challenges
// Note: Some types overlap with marketingMessages, so we selectively export
export {
  // Types
  type AgeGroup,
  type AgeGroupConfig,
  type ReferralCode,
  type ReferralReward,
  type ReferralConversion,
  type ShareableContent,
  type ShareContentType,
  type ShareAction,
  type SocialPlatform,
  type ViralChallenge,
  type Leaderboard,
  type LeaderboardType,
  type LeaderboardMetric,
  type LeaderboardEntry,
  type SocialProofStats,
  type ViralLoop,
  type ViralAction,
  type ViralMetrics,
  // Data
  AGE_GROUP_CONFIGS,
  REFERRAL_TIERS,
  SHARE_TEMPLATES,
  SOCIAL_PLATFORMS,
  VIRAL_CHALLENGES,
  LEADERBOARDS,
  SOCIAL_PROOF_MESSAGES,
  VIRAL_LOOPS,
  VIRAL_TARGETS,
  // Functions
  generateShareUrl,
  generateReferralCode,
  getReferralTier,
  buildShareContent,
  calculateKFactor,
} from './viralMarketing';

