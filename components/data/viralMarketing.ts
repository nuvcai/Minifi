/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   🚀 VIRAL MARKETING ENGINE                                                  ║
 * ║   Referrals, sharing, social proof & growth loops                            ║
 * ║   ✨ MiniFi / Legacy Guardians ✨                                           ║
 * ║   Copyright (c) 2025 NUVC.AI / Tick.AI. All Rights Reserved.                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * EXPANDED AGE RANGE: All ages welcome! (12+ recommended, 18+ can play too)
 * Adults can learn alongside kids, or discover it themselves.
 */

// ============================================================================
// 1. AGE GROUPS (EXPANDED - NO RESTRICTIONS)
// ============================================================================

export type AgeGroup = 
  | "12-14"      // Middle school - foundational concepts
  | "15-17"      // High school - intermediate
  | "18-24"      // Young adults - advanced, real decisions
  | "25-34"      // Adults - wealth building phase
  | "35-44"      // Parents - learning with kids
  | "45+"        // Established - generational wealth focus

export interface AgeGroupConfig {
  id: AgeGroup;
  label: string;
  description: string;
  contentTone: "playful" | "engaging" | "professional" | "sophisticated";
  features: string[];
  marketingAngle: string;
}

export const AGE_GROUP_CONFIGS: AgeGroupConfig[] = [
  {
    id: "12-14",
    label: "Young Explorer",
    description: "Just starting your wealth journey",
    contentTone: "playful",
    features: ["gamified_learning", "basic_concepts", "fun_challenges"],
    marketingAngle: "Start building wealth habits early!"
  },
  {
    id: "15-17",
    label: "Rising Investor",
    description: "Ready for real financial knowledge",
    contentTone: "engaging",
    features: ["intermediate_concepts", "stock_basics", "career_planning"],
    marketingAngle: "Get ahead before you're 18!"
  },
  {
    id: "18-24",
    label: "Young Professional",
    description: "Making your first real money moves",
    contentTone: "professional",
    features: ["advanced_strategies", "real_investing", "tax_basics", "startup_wisdom"],
    marketingAngle: "The wealth education school never gave you"
  },
  {
    id: "25-34",
    label: "Wealth Builder",
    description: "Accelerating your financial future",
    contentTone: "professional",
    features: ["portfolio_building", "property_basics", "family_planning"],
    marketingAngle: "Build generational wealth starting now"
  },
  {
    id: "35-44",
    label: "Family Guardian",
    description: "Securing your family's future",
    contentTone: "sophisticated",
    features: ["family_office_basics", "estate_planning", "teach_kids"],
    marketingAngle: "Learn with your kids, secure your legacy"
  },
  {
    id: "45+",
    label: "Legacy Architect",
    description: "Building generational wealth",
    contentTone: "sophisticated",
    features: ["wealth_transfer", "tax_optimization", "philanthropy"],
    marketingAngle: "Pass on wealth AND wisdom"
  }
];

// ============================================================================
// 2. REFERRAL SYSTEM
// ============================================================================

export interface ReferralCode {
  code: string;                  // e.g., "ALEX2024" or "MINIFI-ABC123"
  userId: string;
  
  // Code type
  type: "personal" | "influencer" | "school" | "corporate" | "promo";
  
  // Rewards
  referrerReward: ReferralReward;
  refereeReward: ReferralReward;
  
  // Limits
  maxUses?: number;
  usedCount: number;
  expiresAt?: Date;
  
  // Tracking
  createdAt: Date;
  conversions: ReferralConversion[];
  
  // For influencers/partners
  partnerName?: string;
  commissionRate?: number;       // percentage for paid partnerships
}

export interface ReferralReward {
  type: "xp" | "badge" | "premium_days" | "real_prize" | "custom";
  value: number | string;
  description: string;
  
  // Unlock conditions
  requiresCompletion?: boolean;  // Referee must complete onboarding
  requiresMissions?: number;     // Referee must complete X missions
}

export interface ReferralConversion {
  refereeUserId: string;
  signedUpAt: Date;
  convertedAt?: Date;           // When they completed required action
  
  // Rewards status
  referrerRewarded: boolean;
  refereeRewarded: boolean;
  rewardedAt?: Date;
}

// Pre-defined reward tiers
export const REFERRAL_TIERS = {
  STARTER: {
    name: "Starter",
    referralsNeeded: 0,
    referrerReward: { type: "xp" as const, value: 100, description: "+100 🪙 iii per referral" },
    refereeReward: { type: "xp" as const, value: 50, description: "+50 🪙 iii welcome bonus" }
  },
  BRONZE: {
    name: "Bronze Advocate",
    referralsNeeded: 3,
    referrerReward: { type: "xp" as const, value: 150, description: "+150 🪙 iii per referral" },
    refereeReward: { type: "xp" as const, value: 100, description: "+100 🪙 iii welcome bonus" },
    badge: "bronze_advocate"
  },
  SILVER: {
    name: "Silver Ambassador",
    referralsNeeded: 10,
    referrerReward: { type: "xp" as const, value: 250, description: "+250 🪙 iii per referral" },
    refereeReward: { type: "premium_days" as const, value: 7, description: "7 days premium free" },
    badge: "silver_ambassador"
  },
  GOLD: {
    name: "Gold Champion",
    referralsNeeded: 25,
    referrerReward: { type: "premium_days" as const, value: 30, description: "30 days premium per referral" },
    refereeReward: { type: "premium_days" as const, value: 14, description: "14 days premium free" },
    badge: "gold_champion"
  },
  PLATINUM: {
    name: "Platinum Legend",
    referralsNeeded: 50,
    referrerReward: { type: "real_prize" as const, value: "merch", description: "MiniFi merch pack" },
    refereeReward: { type: "premium_days" as const, value: 30, description: "30 days premium free" },
    badge: "platinum_legend"
  },
  DIAMOND: {
    name: "Diamond Influencer",
    referralsNeeded: 100,
    referrerReward: { type: "real_prize" as const, value: "lifetime", description: "Lifetime premium + revenue share" },
    refereeReward: { type: "premium_days" as const, value: 30, description: "30 days premium free" },
    badge: "diamond_influencer"
  }
};

// ============================================================================
// 3. SHAREABLE CONTENT
// ============================================================================

export interface ShareableContent {
  id: string;
  type: ShareContentType;
  
  // Content
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  
  // Social metadata
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: "summary" | "summary_large_image" | "player";
  
  // Customizable elements
  userCustomizable: boolean;
  customizableFields?: string[];
  
  // Tracking
  shareCount: number;
  clickCount: number;
  conversionCount: number;
}

export type ShareContentType = 
  | "achievement"
  | "level_up"
  | "mission_complete"
  | "quiz_result"
  | "portfolio_result"
  | "leaderboard_rank"
  | "streak"
  | "challenge_complete"
  | "invite"
  | "wisdom_quote";

// Pre-built shareable templates
export const SHARE_TEMPLATES: Record<ShareContentType, ShareTemplate> = {
  achievement: {
    titleTemplate: "I just earned {{badgeName}} on MiniFi! 🏆",
    descriptionTemplate: "Learning to invest like the pros. Join me!",
    ctaText: "Earn this badge too",
    hashtags: ["MiniFi", "FinancialLiteracy", "InvestingForTeens"]
  },
  level_up: {
    titleTemplate: "Level {{level}} Investor! 📈",
    descriptionTemplate: "Just leveled up on MiniFi - building my wealth knowledge one lesson at a time",
    ctaText: "Start your journey",
    hashtags: ["LevelUp", "MiniFi", "WealthBuilding"]
  },
  mission_complete: {
    titleTemplate: "I survived the {{eventName}}! 💪",
    descriptionTemplate: "Made {{return}}% return during {{year}}. Can you beat my score?",
    ctaText: "Try this mission",
    hashtags: ["MiniFi", "StockMarket", "FinancialHistory"]
  },
  quiz_result: {
    titleTemplate: "My investor personality: {{personality}} 🎯",
    descriptionTemplate: "Discover your investment style on MiniFi",
    ctaText: "Take the quiz",
    hashtags: ["InvestorPersonality", "MiniFi", "KnowYourself"]
  },
  portfolio_result: {
    titleTemplate: "My MiniFi Portfolio: {{return}}% 📊",
    descriptionTemplate: "Built a {{riskLevel}} portfolio. Learning to invest before it counts!",
    ctaText: "Build yours",
    hashtags: ["PortfolioBuilder", "MiniFi", "Investing101"]
  },
  leaderboard_rank: {
    titleTemplate: "Ranked #{{rank}} on MiniFi! 🥇",
    descriptionTemplate: "Climbing the leaderboard. Think you can beat me?",
    ctaText: "Join the competition",
    hashtags: ["MiniFi", "Competition", "Leaderboard"]
  },
  streak: {
    titleTemplate: "{{days}} Day Streak! 🔥",
    descriptionTemplate: "Building wealth habits every day with MiniFi",
    ctaText: "Start your streak",
    hashtags: ["DailyHabit", "MiniFi", "Consistency"]
  },
  challenge_complete: {
    titleTemplate: "Challenge Completed: {{challengeName}} ✅",
    descriptionTemplate: "Just crushed the {{challengeName}} challenge on MiniFi!",
    ctaText: "Accept this challenge",
    hashtags: ["Challenge", "MiniFi", "Achieved"]
  },
  invite: {
    titleTemplate: "Join me on MiniFi! 🚀",
    descriptionTemplate: "The financial education app that actually makes learning fun. Use my code: {{referralCode}}",
    ctaText: "Get bonus 🪙",
    hashtags: ["MiniFi", "FinancialEducation", "Invitation"]
  },
  wisdom_quote: {
    titleTemplate: '"{{quote}}" - {{author}}',
    descriptionTemplate: "Daily wisdom from MiniFi - building wealth, one insight at a time",
    ctaText: "Get daily wisdom",
    hashtags: ["InvestingWisdom", "MiniFi", "WealthQuotes"]
  }
};

interface ShareTemplate {
  titleTemplate: string;
  descriptionTemplate: string;
  ctaText: string;
  hashtags: string[];
}

// ============================================================================
// 4. SOCIAL SHARING
// ============================================================================

export interface ShareAction {
  platform: SocialPlatform;
  shareUrl: string;
  fallbackUrl?: string;
}

export type SocialPlatform = 
  | "twitter"
  | "facebook" 
  | "linkedin"
  | "whatsapp"
  | "telegram"
  | "instagram"
  | "tiktok"
  | "snapchat"
  | "email"
  | "sms"
  | "copy_link";

// Platform-specific share URLs
export function generateShareUrl(
  platform: SocialPlatform,
  content: {
    url: string;
    title: string;
    description?: string;
    hashtags?: string[];
    via?: string;
  }
): string {
  const { url, title, description, hashtags = [], via } = content;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description || "");
  const hashtagString = hashtags.join(",");

  switch (platform) {
    case "twitter":
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}${via ? `&via=${via}` : ""}${hashtags.length ? `&hashtags=${hashtagString}` : ""}`;
    
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`;
    
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    
    case "whatsapp":
      return `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
    
    case "telegram":
      return `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
    
    case "email":
      return `mailto:?subject=${encodedTitle}&body=${encodedDesc}%0A%0A${encodedUrl}`;
    
    case "sms":
      return `sms:?body=${encodedTitle}%20${encodedUrl}`;
    
    default:
      return url;
  }
}

// Platform config for UI
export const SOCIAL_PLATFORMS: Record<SocialPlatform, {
  name: string;
  icon: string;
  color: string;
  available: boolean;
}> = {
  twitter: { name: "X (Twitter)", icon: "𝕏", color: "#000000", available: true },
  facebook: { name: "Facebook", icon: "f", color: "#1877F2", available: true },
  linkedin: { name: "LinkedIn", icon: "in", color: "#0A66C2", available: true },
  whatsapp: { name: "WhatsApp", icon: "📱", color: "#25D366", available: true },
  telegram: { name: "Telegram", icon: "✈️", color: "#0088CC", available: true },
  instagram: { name: "Instagram", icon: "📷", color: "#E4405F", available: false }, // Story API needed
  tiktok: { name: "TikTok", icon: "🎵", color: "#000000", available: false }, // Deep link needed
  snapchat: { name: "Snapchat", icon: "👻", color: "#FFFC00", available: false },
  email: { name: "Email", icon: "✉️", color: "#666666", available: true },
  sms: { name: "Text Message", icon: "💬", color: "#34C759", available: true },
  copy_link: { name: "Copy Link", icon: "🔗", color: "#666666", available: true }
};

// ============================================================================
// 5. VIRAL CHALLENGES
// ============================================================================

export interface ViralChallenge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  
  // Challenge mechanics
  type: "individual" | "team" | "global" | "friends";
  duration: number;             // hours
  goal: string;
  goalMetric: string;
  goalTarget: number;
  
  // Timing
  startsAt?: Date;
  endsAt?: Date;
  isRecurring: boolean;
  recurringPattern?: "daily" | "weekly" | "monthly";
  
  // Rewards
  rewards: {
    completion: ReferralReward;
    topPercentile?: { percentile: number; reward: ReferralReward };
    winner?: ReferralReward;
  };
  
  // Social
  minParticipants?: number;
  currentParticipants: number;
  shareBonus: boolean;          // Extra reward for sharing
  
  // Leaderboard
  showLeaderboard: boolean;
  leaderboardSize: number;
}

// Pre-defined viral challenges
export const VIRAL_CHALLENGES: ViralChallenge[] = [
  {
    id: "weekend_warrior",
    name: "Weekend Warrior",
    description: "Complete 3 missions this weekend",
    emoji: "⚔️",
    type: "individual",
    duration: 48,
    goal: "Complete 3 missions",
    goalMetric: "missions_completed",
    goalTarget: 3,
    isRecurring: true,
    recurringPattern: "weekly",
    rewards: {
      completion: { type: "xp", value: 500, description: "+500 🪙 iii" }
    },
    currentParticipants: 0,
    shareBonus: true,
    showLeaderboard: true,
    leaderboardSize: 100
  },
  {
    id: "refer_squad",
    name: "Refer Your Squad",
    description: "Get 3 friends to join this week",
    emoji: "👥",
    type: "individual",
    duration: 168,
    goal: "3 successful referrals",
    goalMetric: "referrals_converted",
    goalTarget: 3,
    isRecurring: true,
    recurringPattern: "weekly",
    rewards: {
      completion: { type: "premium_days", value: 14, description: "2 weeks premium free" },
      topPercentile: { 
        percentile: 10, 
        reward: { type: "xp", value: 1000, description: "Top 10% bonus" }
      }
    },
    currentParticipants: 0,
    shareBonus: true,
    showLeaderboard: true,
    leaderboardSize: 50
  },
  {
    id: "crash_course",
    name: "Crash Course Challenge",
    description: "Profit through all crisis missions in 24 hours",
    emoji: "📉",
    type: "individual",
    duration: 24,
    goal: "Profit in all crisis missions",
    goalMetric: "crisis_missions_profited",
    goalTarget: 4,
    isRecurring: false,
    rewards: {
      completion: { type: "badge", value: "crash_master", description: "Crash Master badge" },
      winner: { type: "real_prize", value: "featured", description: "Featured on leaderboard" }
    },
    currentParticipants: 0,
    shareBonus: true,
    showLeaderboard: true,
    leaderboardSize: 20
  },
  {
    id: "family_challenge",
    name: "Family Learning Week",
    description: "Complete missions with a family member",
    emoji: "👨‍👩‍👧‍👦",
    type: "team",
    duration: 168,
    goal: "10 combined missions",
    goalMetric: "team_missions_completed",
    goalTarget: 10,
    isRecurring: true,
    recurringPattern: "monthly",
    rewards: {
      completion: { type: "xp", value: 1500, description: "+1500 🪙 iii for both" }
    },
    minParticipants: 2,
    currentParticipants: 0,
    shareBonus: true,
    showLeaderboard: true,
    leaderboardSize: 50
  },
  {
    id: "global_million",
    name: "Million Mission March",
    description: "Help the community complete 1 million missions",
    emoji: "🌍",
    type: "global",
    duration: 720, // 30 days
    goal: "1,000,000 total missions",
    goalMetric: "global_missions_completed",
    goalTarget: 1000000,
    isRecurring: false,
    rewards: {
      completion: { type: "badge", value: "million_march", description: "Million March Participant" }
    },
    currentParticipants: 0,
    shareBonus: true,
    showLeaderboard: false,
    leaderboardSize: 0
  }
];

// ============================================================================
// 6. LEADERBOARDS
// ============================================================================

export interface Leaderboard {
  id: string;
  name: string;
  type: LeaderboardType;
  
  // Scope
  scope: "global" | "country" | "school" | "friends" | "age_group";
  scopeValue?: string;          // e.g., country code, school ID
  
  // Time period
  period: "all_time" | "monthly" | "weekly" | "daily";
  
  // Metric
  metric: LeaderboardMetric;
  
  // Display
  maxEntries: number;
  showUserRank: boolean;        // Always show user's rank even if not in top
  anonymizeNames: boolean;      // For privacy
  
  // Rewards
  rewards?: {
    rank: number;
    reward: ReferralReward;
  }[];
}

export type LeaderboardType = "xp" | "missions" | "streak" | "referrals" | "returns" | "badges";

export type LeaderboardMetric = 
  | "total_xp"
  | "missions_completed"
  | "current_streak"
  | "longest_streak"
  | "referrals_converted"
  | "average_return"
  | "badges_earned"
  | "wisdom_read";

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  score: number;
  
  // Optional extras
  level?: number;
  country?: string;
  school?: string;
  ageGroup?: AgeGroup;
  
  // Change indicators
  rankChange?: number;          // +2 means moved up 2 spots
  isCurrentUser?: boolean;
}

// Pre-defined leaderboards
export const LEADERBOARDS: Leaderboard[] = [
  {
    id: "global_xp",
    name: "Global XP Leaders",
    type: "xp",
    scope: "global",
    period: "all_time",
    metric: "total_xp",
    maxEntries: 100,
    showUserRank: true,
    anonymizeNames: false,
    rewards: [
      { rank: 1, reward: { type: "badge", value: "global_champion", description: "#1 Global" } },
      { rank: 2, reward: { type: "badge", value: "global_silver", description: "#2 Global" } },
      { rank: 3, reward: { type: "badge", value: "global_bronze", description: "#3 Global" } }
    ]
  },
  {
    id: "weekly_missions",
    name: "This Week's Mission Masters",
    type: "missions",
    scope: "global",
    period: "weekly",
    metric: "missions_completed",
    maxEntries: 50,
    showUserRank: true,
    anonymizeNames: false,
    rewards: [
      { rank: 1, reward: { type: "xp", value: 1000, description: "+1000 🪙 iii" } },
      { rank: 2, reward: { type: "xp", value: 500, description: "+500 🪙 iii" } },
      { rank: 3, reward: { type: "xp", value: 250, description: "+250 🪙 iii" } }
    ]
  },
  {
    id: "streak_kings",
    name: "Streak Kings & Queens",
    type: "streak",
    scope: "global",
    period: "all_time",
    metric: "longest_streak",
    maxEntries: 100,
    showUserRank: true,
    anonymizeNames: false
  },
  {
    id: "referral_champions",
    name: "Referral Champions",
    type: "referrals",
    scope: "global",
    period: "monthly",
    metric: "referrals_converted",
    maxEntries: 25,
    showUserRank: true,
    anonymizeNames: false,
    rewards: [
      { rank: 1, reward: { type: "premium_days", value: 90, description: "3 months premium" } }
    ]
  },
  {
    id: "school_leaderboard",
    name: "School Champions",
    type: "xp",
    scope: "school",
    period: "monthly",
    metric: "total_xp",
    maxEntries: 50,
    showUserRank: true,
    anonymizeNames: false
  }
];

// ============================================================================
// 7. SOCIAL PROOF
// ============================================================================

export interface SocialProofStats {
  totalUsers: number;
  totalMissionsCompleted: number;
  totalXpEarned: number;
  countriesRepresented: number;
  schoolsParticipating: number;
  
  // Recent activity (for FOMO)
  recentSignups: {
    displayName: string;
    country: string;
    timeAgo: string;
  }[];
  
  recentAchievements: {
    displayName: string;
    achievement: string;
    timeAgo: string;
  }[];
  
  // Testimonials
  testimonials: {
    quote: string;
    author: string;
    role: string;
    avatar?: string;
  }[];
}

// Social proof messages
export const SOCIAL_PROOF_MESSAGES = [
  "Join {{count}}+ investors learning on MiniFi",
  "{{count}} missions completed today",
  "Users in {{countries}}+ countries",
  "{{schoolCount}} schools already joined",
  "{{userName}} from {{country}} just signed up",
  "{{userName}} just completed the {{mission}} mission",
  "{{userName}} earned the {{badge}} badge",
  "{{count}} new investors joined this week",
];

// ============================================================================
// 8. VIRAL LOOPS
// ============================================================================

export interface ViralLoop {
  id: string;
  name: string;
  description: string;
  
  // Loop triggers
  triggerEvent: string;
  triggerConditions?: Record<string, unknown>;
  
  // Action
  action: ViralAction;
  
  // Reward for completing action
  reward?: ReferralReward;
  
  // A/B test variant
  variant?: string;
  
  // Performance
  triggerCount: number;
  completionCount: number;
  conversionRate: number;
}

export type ViralAction = 
  | { type: "share_prompt"; platforms: SocialPlatform[]; template: ShareContentType }
  | { type: "referral_prompt"; message: string }
  | { type: "challenge_invite"; challengeId: string }
  | { type: "rate_app"; store: "ios" | "android" | "web" }
  | { type: "notification_prompt"; message: string };

// Pre-defined viral loops
export const VIRAL_LOOPS: ViralLoop[] = [
  {
    id: "first_mission_share",
    name: "First Mission Share",
    description: "Prompt to share after completing first mission",
    triggerEvent: "mission_completed",
    triggerConditions: { missionCount: 1 },
    action: {
      type: "share_prompt",
      platforms: ["twitter", "whatsapp", "copy_link"],
      template: "mission_complete"
    },
    reward: { type: "xp", value: 50, description: "+50 🪙 for sharing" },
    triggerCount: 0,
    completionCount: 0,
    conversionRate: 0
  },
  {
    id: "level_up_share",
    name: "Level Up Share",
    description: "Prompt to share when leveling up",
    triggerEvent: "level_up",
    action: {
      type: "share_prompt",
      platforms: ["twitter", "instagram", "whatsapp"],
      template: "level_up"
    },
    reward: { type: "xp", value: 25, description: "+25 🪙 for sharing" },
    triggerCount: 0,
    completionCount: 0,
    conversionRate: 0
  },
  {
    id: "quiz_result_share",
    name: "Quiz Result Share",
    description: "Share personality quiz result",
    triggerEvent: "quiz_completed",
    triggerConditions: { quizType: "risk_personality" },
    action: {
      type: "share_prompt",
      platforms: ["twitter", "facebook", "linkedin"],
      template: "quiz_result"
    },
    reward: { type: "xp", value: 100, description: "+100 🪙 for sharing" },
    triggerCount: 0,
    completionCount: 0,
    conversionRate: 0
  },
  {
    id: "streak_milestone",
    name: "Streak Milestone Share",
    description: "Share when hitting streak milestones (7, 14, 30 days)",
    triggerEvent: "streak_updated",
    triggerConditions: { streakDays: [7, 14, 30, 60, 100] },
    action: {
      type: "share_prompt",
      platforms: ["twitter", "instagram"],
      template: "streak"
    },
    reward: { type: "xp", value: 75, description: "+75 🪙 for sharing" },
    triggerCount: 0,
    completionCount: 0,
    conversionRate: 0
  },
  {
    id: "referral_after_3_missions",
    name: "Referral Prompt After 3 Missions",
    description: "Ask for referral after proving value",
    triggerEvent: "mission_completed",
    triggerConditions: { missionCount: 3 },
    action: {
      type: "referral_prompt",
      message: "Enjoying MiniFi? Invite a friend and both get bonus 🪙 iii!"
    },
    triggerCount: 0,
    completionCount: 0,
    conversionRate: 0
  },
  {
    id: "challenge_friend",
    name: "Challenge a Friend",
    description: "Invite friend to beat your score",
    triggerEvent: "high_score_achieved",
    action: {
      type: "challenge_invite",
      challengeId: "beat_my_score"
    },
    reward: { type: "xp", value: 50, description: "+50 🪙 if they accept" },
    triggerCount: 0,
    completionCount: 0,
    conversionRate: 0
  }
];

// ============================================================================
// 9. GROWTH METRICS
// ============================================================================

export interface ViralMetrics {
  period: string;
  
  // Core viral metrics
  kFactor: number;              // Viral coefficient (users × invites × conversion)
  viralCycleTime: number;       // Days from signup to first referral conversion
  
  // Referral funnel
  referralLinksSent: number;
  referralClicks: number;
  referralSignups: number;
  referralConversions: number;
  
  // Conversion rates
  clickToSignup: number;
  signupToConversion: number;
  overallConversion: number;
  
  // Sharing
  shareActions: number;
  sharesByPlatform: Record<SocialPlatform, number>;
  sharesPerUser: number;
  
  // Challenges
  challengeParticipation: number;
  challengeCompletionRate: number;
  
  // Social proof impact
  signupsFromSocialProof: number;
}

// Target K-factor for viral growth
export const VIRAL_TARGETS = {
  kFactor: 1.5,                 // Each user brings 1.5 new users
  viralCycleTime: 7,            // 7 days to first conversion
  referralConversionRate: 0.15, // 15% of clicks convert
  sharesPerUser: 3,             // Each user shares 3 times
  challengeParticipation: 0.3,  // 30% of users join challenges
};

// ============================================================================
// 10. EDUCATIONAL VIRAL HOOKS - "Learn + Share" Moments
// ============================================================================

/**
 * 🎓 "AHA! MOMENTS" - Shareable insights that demonstrate learning
 * These are designed to make users feel smart AND want to share
 */
export interface AhaShareMoment {
  id: string;
  trigger: "quiz_perfect" | "concept_mastered" | "prediction_correct" | "streak_milestone" | "lesson_completed";
  
  // The "I just learned this!" content
  conceptLearned: string;
  simpleExplanation: string;          // Feynman-style: explain like you're teaching a friend
  
  // Shareable formats
  tweetVersion: string;               // 280 char max, punchy
  storyVersion: string;               // Instagram/TikTok hook
  linkedInVersion: string;            // Professional framing
  
  // Viral elements
  visualHook?: string;                // Emoji combo or visual cue
  controversialAngle?: string;        // "Most people think X, but actually..."
  generationalRelevance: string;      // Why this matters to Gen Z/Alpha
}

export const AHA_SHARE_MOMENTS: AhaShareMoment[] = [
  {
    id: "bubble_recognition",
    trigger: "lesson_completed",
    conceptLearned: "How to spot a market bubble",
    simpleExplanation: "When your Uber driver is giving stock tips and everyone's quitting their jobs to day-trade... that's a bubble. Prices disconnected from reality.",
    tweetVersion: "🫧 Just learned on @MiniFiApp: When everyone's euphoric about stocks & prices seem 'too good' = bubble warning. Japan 1990, Dotcom 2000, same pattern. History doesn't repeat but it rhymes! 📈→💥",
    storyVersion: "POV: You just learned something your parents' financial advisor doesn't teach 👀",
    linkedInVersion: "Completed a fascinating case study on the 1990 Japanese asset bubble. Key insight: market euphoria + disconnect from fundamentals = systematic risk. #FinancialLiteracy #Investing",
    visualHook: "🫧📈💥",
    controversialAngle: "Most adults don't understand bubbles. I'm 16 and just learned to spot them.",
    generationalRelevance: "This is literally what happened with NFTs in 2021. Same pattern, different asset."
  },
  {
    id: "diversification_power",
    trigger: "concept_mastered",
    conceptLearned: "Why diversification actually works",
    simpleExplanation: "It's like having backup plans for your backup plans. When stocks tank, bonds often rise. When one country struggles, another thrives.",
    tweetVersion: "💡 Mind = blown. While Japan lost 60% in 1990, US bonds GAINED 45%. Same year! That's why family offices never put all eggs in one basket. Learning this at @MiniFiApp 🧠",
    storyVersion: "The investing hack that billionaires use but never talk about...",
    linkedInVersion: "Case study insight: During Japan's 1990 crash, a diversified portfolio (40% stocks, 40% bonds, 20% gold) dropped only 15% vs 60% for all-stock portfolios. Diversification isn't just advice—it's math.",
    visualHook: "🥚🧺→📊🛡️",
    controversialAngle: "Your parents probably lost money because they didn't know this.",
    generationalRelevance: "This is why you shouldn't YOLO your savings into one crypto."
  },
  {
    id: "crisis_opportunity",
    trigger: "prediction_correct",
    conceptLearned: "Crises create the best buying opportunities",
    simpleExplanation: "When everyone's panic-selling, great companies go on sale. Amazon at $6 in 2008 crash? Now $180. Fear creates opportunity for the patient.",
    tweetVersion: "🔥 Just survived the 2008 Financial Crisis on @MiniFiApp! Key lesson: When others panic-sell, quality goes on SALE. Amazon dropped to $6... now $180. Be greedy when others are fearful! 💰",
    storyVersion: "What if I told you the best investors PRAY for market crashes? Here's why...",
    linkedInVersion: "Completed the 2008 Financial Crisis simulation. Warren Buffett's 'be greedy when others are fearful' isn't just a quote—it's quantifiable: buying the S&P at its 2009 low yielded 450% returns by 2019.",
    visualHook: "😱→🛒→🚀",
    controversialAngle: "The news tells you to sell during crashes. The rich do the opposite.",
    generationalRelevance: "This is exactly what happened in March 2020. COVID crash = massive opportunity."
  },
  {
    id: "tech_acceleration",
    trigger: "lesson_completed",
    conceptLearned: "Crises accelerate existing trends",
    simpleExplanation: "COVID didn't create remote work—it fast-forwarded it 10 years. Smart investors ask: 'What was growing that this crisis will supercharge?'",
    tweetVersion: "🧠 @MiniFiApp just taught me the most powerful investing question: 'What trends will THIS crisis accelerate?' COVID → remote work/tech. What about AI + recession? 🤔",
    storyVersion: "The question that made people millionaires during COVID (and how to use it for AI)...",
    linkedInVersion: "COVID crisis insight: Zoom went from $70 to $560 because the pandemic accelerated existing trends. The key question: 'What transformation was already happening that this crisis will supercharge?'",
    visualHook: "⏰→⚡→🚀",
    controversialAngle: "The pandemic made more millionaires than it destroyed. They asked this one question.",
    generationalRelevance: "AI is doing this RIGHT NOW. Which companies are being accelerated?"
  }
];

/**
 * 🏆 SOCIAL PROOF LEARNING - "I'm not alone" moments
 * Show users they're part of a learning community
 */
export interface LearningMilestone {
  description: string;
  userCount: number;
  celebrationType: "badge" | "leaderboard" | "story" | "challenge";
  sharePrompt: string;
}

export const COMMUNITY_LEARNING_STATS = {
  conceptsMastered: [
    { concept: "Bubble Recognition", learnersCount: 12847, avgAge: 17.2 },
    { concept: "Diversification", learnersCount: 23456, avgAge: 16.8 },
    { concept: "Risk-Adjusted Returns", learnersCount: 8932, avgAge: 18.1 },
    { concept: "Crisis Investing", learnersCount: 15678, avgAge: 17.5 },
  ],
  realTimeActivity: [
    "{{name}} from {{country}} just learned about the 1990 Japan Bubble",
    "{{name}} survived the 2008 crash with +25% return!",
    "{{name}} earned the 'Bubble Spotter' badge",
    "{{count}} people completed the COVID mission in the last hour",
  ],
  competitiveHooks: [
    "You're in the top {{percentile}}% of your age group!",
    "{{friendCount}} of your friends haven't learned this yet",
    "Only {{percent}}% of adults understand this concept",
    "You now know more about {{topic}} than most finance majors",
  ],
};

// ============================================================================
// 11. HELPER FUNCTIONS
// ============================================================================

/**
 * Generate a unique referral code for a user
 */
export function generateReferralCode(displayName: string): string {
  const cleanName = displayName
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${cleanName}-${random}`;
}

/**
 * Calculate referral tier based on conversions
 */
export function getReferralTier(conversions: number): keyof typeof REFERRAL_TIERS {
  if (conversions >= 100) return "DIAMOND";
  if (conversions >= 50) return "PLATINUM";
  if (conversions >= 25) return "GOLD";
  if (conversions >= 10) return "SILVER";
  if (conversions >= 3) return "BRONZE";
  return "STARTER";
}

/**
 * Build share content from template
 */
export function buildShareContent(
  template: ShareContentType,
  data: Record<string, string | number>,
  referralCode?: string
): { title: string; description: string; hashtags: string[] } {
  const tmpl = SHARE_TEMPLATES[template];
  
  let title = tmpl.titleTemplate;
  let description = tmpl.descriptionTemplate;
  
  // Replace placeholders
  Object.entries(data).forEach(([key, value]) => {
    title = title.replace(`{{${key}}}`, String(value));
    description = description.replace(`{{${key}}}`, String(value));
  });
  
  if (referralCode) {
    description = description.replace("{{referralCode}}", referralCode);
  }
  
  return {
    title,
    description,
    hashtags: tmpl.hashtags
  };
}

/**
 * Calculate K-factor (viral coefficient)
 */
export function calculateKFactor(
  invitesSentPerUser: number,
  inviteConversionRate: number
): number {
  return invitesSentPerUser * inviteConversionRate;
}




