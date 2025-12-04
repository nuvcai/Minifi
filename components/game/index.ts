// Game Components Index
// Re-export all game-related components for easy imports

// Core Game Components
export { GameHeader } from "./GameHeader";
export { CoachSidebar } from "./CoachSidebar";
export { ProgressCard } from "./ProgressCard";
export { TimelineSection } from "./TimelineSection";
export { EventCard } from "./EventCard";
export { CompetitionCard } from "./CompetitionCard";

// New UX Components
export { FloatingCoach } from "./FloatingCoach";
export { MobileNav } from "./MobileNav";
export { TradeConfirmation } from "./TradeConfirmation";
export { RiskRewardMeter, RiskRewardChart } from "./RiskRewardMeter";
export { KnowledgeLibrary, defaultConcepts } from "./KnowledgeLibrary";
export type { FinancialConcept } from "./KnowledgeLibrary";

// Animations & Celebrations
export { XPAnimation, LevelUpCelebration, StreakCounter } from "./XPAnimation";

// Achievement System
export {
  AchievementBadge,
  AchievementUnlockPopup,
  AchievementsGrid,
  defaultAchievements,
} from "./Achievements";
export type { Achievement } from "./Achievements";

