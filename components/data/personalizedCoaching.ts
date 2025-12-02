/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   🎯 PERSONALIZED COACHING DATABASE SCHEMA                                   ║
 * ║   Data structures for AI-powered personalized financial education           ║
 * ║   ✨ MiniFi / Legacy Guardians ✨                                           ║
 * ║   Copyright (c) 2025 NUVC.AI / Tick.AI. All Rights Reserved.                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * This file defines the data structures needed for personalized coaching.
 * Future implementation will persist this to a database (PostgreSQL/Supabase).
 */

// ============================================================================
// 1. USER PROFILE & DEMOGRAPHICS
// ============================================================================

export interface UserProfile {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Basic Demographics
  age: number;
  ageGroup: "12-14" | "15-16" | "17-18";
  country: string;
  state?: string;
  
  // Education Level
  schoolYear: number; // Year 7-12
  educationTrack?: "academic" | "vocational" | "mixed";
  
  // Financial Background
  hasPartTimeJob: boolean;
  receivesAllowance: boolean;
  hasBankAccount: boolean;
  hasSavingsGoal: boolean;
  
  // Family Context (optional, for tailored advice)
  parentsDiscussFinances?: boolean;
  familyInvestmentExposure?: "none" | "basic" | "moderate" | "extensive";
  
  // Consent & Preferences
  parentalConsent: boolean;
  marketingConsent: boolean;
  dataCollectionConsent: boolean;
}

// ============================================================================
// 2. LEARNING STYLE ASSESSMENT
// ============================================================================

export type LearningStyle = "visual" | "auditory" | "reading" | "kinesthetic";
export type PacePreference = "slow" | "moderate" | "fast";
export type ContentDepth = "surface" | "moderate" | "deep";

export interface LearningProfile {
  userId: string;
  
  // Primary learning style (from assessment)
  primaryLearningStyle: LearningStyle;
  secondaryLearningStyle?: LearningStyle;
  
  // Pace & Depth Preferences
  preferredPace: PacePreference;
  preferredDepth: ContentDepth;
  
  // Attention & Engagement
  averageSessionLength: number; // minutes
  preferredSessionLength: "short" | "medium" | "long"; // 5-10, 15-20, 25+
  bestTimeOfDay?: "morning" | "afternoon" | "evening";
  
  // Content Format Preferences
  likesCharts: boolean;
  likesStories: boolean;
  likesQuizzes: boolean;
  likesSimulations: boolean;
  likesRealExamples: boolean;
  
  // Gamification Response
  motivatedByPoints: boolean;
  motivatedByBadges: boolean;
  motivatedByLeaderboards: boolean;
  motivatedByStreaks: boolean;
  
  // Assessment completion
  assessmentCompletedAt?: Date;
  assessmentVersion: string;
}

// ============================================================================
// 3. FINANCIAL PERSONALITY (Risk Profile)
// ============================================================================

export type RiskPersonality = 
  | "guardian"       // Very conservative, safety first
  | "builder"        // Steady growth, moderate risk
  | "explorer"       // Willing to take calculated risks
  | "pioneer";       // High risk tolerance, growth focused

export type FinancialMindset =
  | "saver"          // Prefers saving over spending/investing
  | "investor"       // Comfortable with investing
  | "spender"        // Needs help with delayed gratification
  | "balanced";      // Good balance

export type DecisionStyle =
  | "analytical"     // Wants data and research
  | "intuitive"      // Goes with gut feeling
  | "social"         // Influenced by peers/trends
  | "cautious";      // Needs time and reassurance

export interface FinancialPersonality {
  userId: string;
  
  // Core Risk Profile
  riskPersonality: RiskPersonality;
  riskScore: number; // 0-100
  
  // Financial Mindset
  financialMindset: FinancialMindset;
  
  // Decision Making Style
  decisionStyle: DecisionStyle;
  
  // Behavioral Traits (0-100 scale)
  lossAversion: number;        // How much they hate losses vs love gains
  patientCapital: number;      // Ability to wait for long-term gains
  fomo: number;                // Fear of missing out tendency
  panicSelling: number;        // Likelihood to sell during crashes
  overconfidence: number;      // Tendency to overestimate abilities
  herdFollowing: number;       // Following crowd vs independent thinking
  
  // Emotional Triggers
  emotionalTriggers: string[]; // ["market_crash", "peer_pressure", "news_headlines"]
  
  // Derived from quiz + behavior
  assessedAt: Date;
  behaviorUpdatedAt?: Date;
}

// ============================================================================
// 4. FINANCIAL GOALS & ASPIRATIONS
// ============================================================================

export type GoalTimeframe = "short" | "medium" | "long" | "very_long";
export type GoalPriority = "must_have" | "nice_to_have" | "dream";

export interface FinancialGoal {
  id: string;
  userId: string;
  
  // Goal Definition
  name: string;
  description: string;
  category: "savings" | "investment" | "education" | "lifestyle" | "career" | "giving";
  
  // Goal Parameters
  targetAmount?: number;
  targetDate?: Date;
  timeframe: GoalTimeframe;
  priority: GoalPriority;
  
  // Progress
  currentProgress: number; // percentage
  startedAt: Date;
  completedAt?: Date;
  
  // Why this matters (for motivation)
  personalWhy: string;
  
  // Linked learning content
  relevantAssetClasses: string[];
  relevantMissions: number[]; // years
}

// ============================================================================
// 5. KNOWLEDGE & SKILL TRACKING
// ============================================================================

export type SkillLevel = "novice" | "beginner" | "intermediate" | "advanced" | "expert";
export type ConceptMastery = "not_started" | "introduced" | "practicing" | "proficient" | "mastered";

export interface KnowledgeProfile {
  userId: string;
  
  // Overall Level
  overallLevel: SkillLevel;
  totalXp: number;
  
  // Asset Class Mastery
  assetClassMastery: Record<string, {
    mastery: ConceptMastery;
    xp: number;
    missionsCompleted: number;
    correctDecisions: number;
    totalDecisions: number;
  }>;
  
  // Concept Understanding
  conceptMastery: Record<string, {
    concept: string;
    mastery: ConceptMastery;
    lastPracticed?: Date;
    correctAnswers: number;
    totalAttempts: number;
  }>;
  
  // Identified Gaps
  knowledgeGaps: string[];
  suggestedNextTopics: string[];
  
  // Strengths
  strengths: string[];
  
  lastUpdated: Date;
}

// Financial Concepts to Track
export const financialConcepts = [
  // Basic Concepts
  "compound_interest",
  "inflation",
  "risk_return_tradeoff",
  "diversification",
  "time_value_of_money",
  
  // Asset Class Understanding
  "stocks_basics",
  "bonds_basics", 
  "commodities_basics",
  "real_estate_basics",
  "crypto_basics",
  "cash_management",
  
  // Investment Strategies
  "buy_and_hold",
  "dollar_cost_averaging",
  "portfolio_rebalancing",
  "asset_allocation",
  "sector_rotation",
  
  // Risk Management
  "position_sizing",
  "stop_losses",
  "hedging",
  "correlation",
  "volatility",
  
  // Market Concepts
  "bull_markets",
  "bear_markets",
  "market_cycles",
  "economic_indicators",
  "interest_rates",
  
  // Behavioral Finance
  "loss_aversion",
  "confirmation_bias",
  "recency_bias",
  "herd_mentality",
  "overconfidence",
  
  // Advanced Concepts
  "sharpe_ratio",
  "beta",
  "dividend_yield",
  "price_earnings_ratio",
  "market_cap",
];

// ============================================================================
// 6. BEHAVIORAL DATA & PATTERNS
// ============================================================================

export interface BehavioralData {
  userId: string;
  
  // Session Patterns
  totalSessions: number;
  averageSessionDuration: number;
  longestStreak: number;
  currentStreak: number;
  lastActiveAt: Date;
  
  // Learning Patterns
  preferredDaysOfWeek: number[]; // 0-6
  preferredHours: number[];      // 0-23
  completionRate: number;        // percentage of started content completed
  
  // Decision Patterns (from missions)
  decisions: {
    missionYear: number;
    optionChosen: string;
    assetClass: string;
    riskLevel: string;
    timeToDecide: number;     // seconds
    changedMind: boolean;      // did they switch selection
    outcome: "profit" | "loss";
    actualReturn: number;
    reviewedCoachAdvice: boolean;
    followedCoachAdvice: boolean;
  }[];
  
  // Engagement Patterns
  buttonsClicked: Record<string, number>;
  featuresUsed: Record<string, number>;
  helpRequested: number;
  coachInteractions: number;
  
  // Emotional Signals (from UI interactions)
  pausesDuringLosses: boolean;    // do they hesitate on loss screens?
  speedsUpDuringGains: boolean;   // do they rush through wins?
  revisitsCompleted: boolean;      // do they review past missions?
}

// ============================================================================
// 7. COACH RELATIONSHIP & PREFERENCES
// ============================================================================

export interface CoachRelationship {
  userId: string;
  coachId: string;
  
  // Relationship Metrics
  totalInteractions: number;
  satisfactionScore: number; // 0-100
  trustScore: number;        // 0-100 (derived from following advice)
  
  // Communication Style Preferences
  preferredTone: "casual" | "professional" | "motivational" | "educational";
  preferredLength: "brief" | "moderate" | "detailed";
  wantsEmoji: boolean;
  wantsExamples: boolean;
  wantsData: boolean;
  
  // What They Respond To
  respondsToEncouragement: boolean;
  respondsToChallenge: boolean;
  respondsToFacts: boolean;
  respondsToStories: boolean;
  
  // Topics Discussed
  topicsDiscussed: string[];
  questionsAsked: string[];
  
  // Advice Tracking
  adviceGiven: number;
  adviceFollowed: number;
  adviceIgnored: number;
  
  lastInteractionAt: Date;
}

// ============================================================================
// 8. PERSONALIZED CONTENT RECOMMENDATIONS
// ============================================================================

export interface ContentRecommendation {
  userId: string;
  generatedAt: Date;
  
  // Next Best Actions
  suggestedMissions: {
    year: number;
    reason: string;
    expectedLearning: string[];
    difficultyMatch: number; // 0-100
  }[];
  
  // Content to Review
  conceptsToReview: {
    concept: string;
    reason: string;
    suggestedContent: string[];
  }[];
  
  // New Topics to Explore
  newTopics: {
    topic: string;
    relevanceScore: number;
    prerequisitesMet: boolean;
  }[];
  
  // Wisdom Library Recommendations
  wisdomRecommendations: {
    type: "pillar" | "era" | "investor" | "principle";
    id: string;
    reason: string;
  }[];
  
  // Personalized Challenges
  challenges: {
    id: string;
    title: string;
    description: string;
    xpReward: number;
    deadline?: Date;
  }[];
}

// ============================================================================
// 9. CONVERSATION HISTORY (for AI context)
// ============================================================================

export interface ConversationMessage {
  id: string;
  sessionId: string;
  userId: string;
  coachId: string;
  
  role: "user" | "coach" | "system";
  content: string;
  
  // Context
  missionContext?: {
    year: number;
    step: string;
    selectedOption?: string;
  };
  
  // Sentiment & Intent
  sentiment?: "positive" | "neutral" | "negative" | "confused" | "excited";
  intent?: string;
  
  timestamp: Date;
}

export interface ConversationSession {
  id: string;
  userId: string;
  coachId: string;
  
  startedAt: Date;
  endedAt?: Date;
  
  // Session Context
  context: {
    currentMission?: number;
    currentTopic?: string;
    userMood?: string;
  };
  
  // Messages
  messageCount: number;
  
  // Session Quality
  resolved: boolean;
  userSatisfaction?: number; // 1-5
}

// ============================================================================
// 10. MARKET SCENARIOS FOR SIMULATION
// ============================================================================

export interface MarketScenario {
  id: string;
  name: string;
  description: string;
  
  // Scenario Parameters
  type: "historical" | "hypothetical" | "current";
  difficulty: "beginner" | "intermediate" | "advanced";
  
  // Market Conditions
  marketCondition: "bull" | "bear" | "sideways" | "volatile" | "crisis";
  economicEnvironment: string;
  keyEvents: string[];
  
  // Asset Performance
  assetPerformance: Record<string, {
    expectedReturn: number;
    volatility: number;
    correlation: Record<string, number>;
  }>;
  
  // Learning Objectives
  teachingObjectives: string[];
  conceptsCovered: string[];
  
  // Best/Worst Strategies
  optimalStrategy: string;
  commonMistakes: string[];
}

// Historical Scenarios Database
export const marketScenarios: MarketScenario[] = [
  {
    id: "japan_bubble_1990",
    name: "Japanese Asset Bubble",
    description: "The spectacular rise and fall of Japanese stocks and real estate",
    type: "historical",
    difficulty: "intermediate",
    marketCondition: "crisis",
    economicEnvironment: "Post-bubble collapse with deflationary pressures",
    keyEvents: [
      "Nikkei reaches all-time high of 38,916",
      "Bank of Japan raises interest rates",
      "Real estate prices begin collapse",
      "Beginning of 'Lost Decade'"
    ],
    assetPerformance: {
      "japanese_stocks": { expectedReturn: -60, volatility: 35, correlation: { "japanese_real_estate": 0.85 } },
      "japanese_real_estate": { expectedReturn: -70, volatility: 25, correlation: { "japanese_stocks": 0.85 } },
      "us_bonds": { expectedReturn: 45, volatility: 10, correlation: { "japanese_stocks": -0.3 } },
      "gold": { expectedReturn: 20, volatility: 15, correlation: { "japanese_stocks": -0.2 } }
    },
    teachingObjectives: [
      "Recognize bubble conditions",
      "Understand the value of diversification",
      "Learn about currency and international exposure"
    ],
    conceptsCovered: ["market_cycles", "diversification", "risk_return_tradeoff"],
    optimalStrategy: "Diversify internationally, hold defensive assets",
    commonMistakes: ["FOMO into hot market", "Ignoring valuation signals", "Home country bias"]
  },
  // More scenarios would be added here...
];

// ============================================================================
// 11. ACHIEVEMENT & BADGE SYSTEM
// ============================================================================

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  
  // Requirements
  category: "learning" | "exploration" | "consistency" | "mastery" | "social";
  requirements: {
    type: string;
    target: number;
    current?: number;
  }[];
  
  // Rewards
  xpReward: number;
  unlocks?: string[]; // What this achievement unlocks
  
  // Rarity
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  percentEarned?: number; // % of users who have this
}

export const achievements: Achievement[] = [
  {
    id: "first_investment",
    name: "First Steps",
    description: "Make your first investment decision",
    icon: "🎯",
    category: "learning",
    requirements: [{ type: "missions_completed", target: 1 }],
    xpReward: 50,
    rarity: "common"
  },
  {
    id: "diversification_pro",
    name: "Diversification Pro",
    description: "Invest in all 6 asset classes",
    icon: "🌈",
    category: "exploration",
    requirements: [{ type: "asset_classes_explored", target: 6 }],
    xpReward: 200,
    unlocks: ["fo_certification_level_1"],
    rarity: "uncommon"
  },
  {
    id: "crash_survivor",
    name: "Crash Survivor",
    description: "Profit during a market crisis mission",
    icon: "🛡️",
    category: "mastery",
    requirements: [{ type: "crisis_missions_profited", target: 1 }],
    xpReward: 150,
    rarity: "rare"
  },
  {
    id: "buffett_disciple",
    name: "Buffett's Disciple",
    description: "Hold an investment through a 30%+ drawdown to profit",
    icon: "🦉",
    category: "mastery",
    requirements: [{ type: "held_through_drawdown", target: 30 }],
    xpReward: 300,
    rarity: "epic"
  },
  {
    id: "time_traveler",
    name: "Time Traveler",
    description: "Complete all historical missions",
    icon: "⏰",
    category: "learning",
    requirements: [{ type: "all_missions_completed", target: 1 }],
    xpReward: 500,
    unlocks: ["investment_competition"],
    rarity: "rare"
  },
  // More achievements...
];

// ============================================================================
// 12. PARENTAL/GUARDIAN DASHBOARD DATA
// ============================================================================

export interface ParentDashboard {
  parentId: string;
  linkedChildren: string[]; // user IDs
  
  // Per Child Reports
  childReports: Record<string, {
    // Progress Summary
    totalXp: number;
    level: number;
    missionsCompleted: number;
    streakDays: number;
    
    // Learning Progress
    topicsLearned: string[];
    currentFocus: string;
    nextMilestone: string;
    
    // Behavioral Insights
    averageSessionTime: number;
    lastActiveAt: Date;
    engagementTrend: "improving" | "stable" | "declining";
    
    // Risk Profile Summary
    riskPersonality: RiskPersonality;
    strengths: string[];
    areasForImprovement: string[];
    
    // Recommended Parent Actions
    conversationStarters: string[];
    recommendedActivities: string[];
  }>;
  
  // Family Goals
  familyGoals?: {
    name: string;
    targetAmount: number;
    contributingMembers: string[];
    progress: number;
  }[];
}

// ============================================================================
// 13. EXPORT HELPER TYPES
// ============================================================================

export type UserDataExport = {
  profile: UserProfile;
  learning: LearningProfile;
  personality: FinancialPersonality;
  knowledge: KnowledgeProfile;
  behavior: BehavioralData;
  goals: FinancialGoal[];
  achievements: string[]; // achievement IDs earned
  conversationCount: number;
};

// ============================================================================
// 14. AI COACHING CONTEXT BUILDER
// ============================================================================

/**
 * Builds the context object to send to AI coach for personalized responses
 */
export function buildCoachingContext(
  userId: string,
  userData: Partial<UserDataExport>,
  currentMission?: number,
  currentQuestion?: string
): object {
  return {
    // User Identity (anonymized)
    userProfile: {
      ageGroup: userData.profile?.ageGroup,
      experienceLevel: userData.knowledge?.overallLevel,
      totalXp: userData.knowledge?.totalXp,
    },
    
    // Personality & Style
    personality: {
      riskProfile: userData.personality?.riskPersonality,
      decisionStyle: userData.personality?.decisionStyle,
      lossAversion: userData.personality?.lossAversion,
    },
    
    // Learning Context
    learning: {
      style: userData.learning?.primaryLearningStyle,
      pace: userData.learning?.preferredPace,
      depth: userData.learning?.preferredDepth,
      strengths: userData.knowledge?.strengths,
      gaps: userData.knowledge?.knowledgeGaps,
    },
    
    // Behavioral Insights
    behavior: {
      followsAdvice: (userData.behavior?.decisions || [])
        .filter(d => d.followedCoachAdvice).length,
      totalDecisions: userData.behavior?.decisions?.length || 0,
      preferredAssetClasses: getMostUsedAssetClasses(userData.behavior?.decisions || []),
    },
    
    // Current Context
    context: {
      currentMission,
      currentQuestion,
      recentDecisions: userData.behavior?.decisions?.slice(-5),
    },
    
    // Goals
    goals: userData.goals?.map(g => ({
      name: g.name,
      timeframe: g.timeframe,
      progress: g.currentProgress,
    })),
  };
}

function getMostUsedAssetClasses(decisions: BehavioralData["decisions"]): string[] {
  const counts: Record<string, number> = {};
  decisions.forEach(d => {
    counts[d.assetClass] = (counts[d.assetClass] || 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([assetClass]) => assetClass);
}

// ============================================================================
// DATABASE SCHEMA SUMMARY (for PostgreSQL/Supabase)
// ============================================================================

/**
 * Tables to create:
 * 
 * 1. users                 - Core user profile
 * 2. learning_profiles     - Learning style assessment results
 * 3. financial_personalities - Risk profile and behavioral traits
 * 4. knowledge_profiles    - Skill tracking and mastery levels
 * 5. financial_goals       - User-defined financial goals
 * 6. behavioral_data       - Session patterns and decision history
 * 7. coach_relationships   - User-coach interaction tracking
 * 8. conversations         - Chat history with coaches
 * 9. conversation_sessions - Session-level conversation data
 * 10. user_achievements    - Earned achievements
 * 11. content_recommendations - AI-generated recommendations
 * 12. parent_links         - Parent-child relationships
 * 13. market_scenarios     - Simulation scenarios (static)
 * 14. concept_progress     - Per-concept mastery tracking
 * 
 * Relationships:
 * - users 1:1 learning_profiles
 * - users 1:1 financial_personalities
 * - users 1:1 knowledge_profiles
 * - users 1:1 behavioral_data
 * - users 1:N financial_goals
 * - users 1:N coach_relationships
 * - users 1:N conversations
 * - users 1:N user_achievements
 * - parent_links N:N users (parent to children)
 */

