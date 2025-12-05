/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   📣 MARKETING MESSAGES - Linking Wealth Wisdom to User Value               ║
 * ║   Messages that connect gamification, education, and marketing              ║
 * ║   ✨ MiniFi / Legacy Guardians ✨                                           ║
 * ║   Copyright (c) 2025 NUVC.AI / Tick.AI. All Rights Reserved.                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// Wealth wisdom data is available via wealthWisdom.ts
import { MARKETING_EVENTS } from "./marketingData";

// ============================================================================
// MARKETING VALUE PROPOSITIONS
// ============================================================================

export interface ValueProposition {
  id: string;
  headline: string;
  subheadline: string;
  emoji: string;
  bulletPoints: string[];
  wisdomConnection: string; // Links to wealthWisdom content
  ctaText: string;
  targetAudience: "teens" | "parents" | "educators" | "all";
}

export const valuePropositions: ValueProposition[] = [
  {
    id: "teen-empowerment",
    headline: "Your Generation's Moment is NOW",
    subheadline: "Learn to invest like a Family Office before you're 18",
    emoji: "🚀",
    bulletPoints: [
      "Gates, Jobs, and Zuckerberg started at YOUR age",
      "AI is this generation's Industrial Revolution",
      "Time is your ultimate unfair advantage",
      "80% of millionaires built it themselves"
    ],
    wisdomConnection: "Connects to 'AI & Robotics Revolution' era - YOUR industrial revolution moment",
    ctaText: "Start Your Journey",
    targetAudience: "teens"
  },
  {
    id: "effort-rewards",
    headline: "We Reward Courage, Not Just Profits",
    subheadline: "Learn from both wins AND losses - because real investors do both",
    emoji: "💪",
    bulletPoints: [
      "Earn 🪙 iii for trying new asset classes",
      "Get 'Courage Badges' for taking calculated risks",
      "Learn from losses without real money consequences",
      "Build resilience that transfers to real investing"
    ],
    wisdomConnection: "Based on Ray Dalio's principle: 'Pain + Reflection = Progress'",
    ctaText: "See How It Works",
    targetAudience: "all"
  },
  {
    id: "fo-education",
    headline: "Family Office Secrets, Now Accessible",
    subheadline: "The wealthy teach their kids differently. Now you can learn it too.",
    emoji: "🏛️",
    bulletPoints: [
      "6 asset classes wealthy families use",
      "Real historical data from 35+ years",
      "AI coaches with different investment styles",
      "Think in decades, not days"
    ],
    wisdomConnection: "Directly implements FO Principles from wealth wisdom",
    ctaText: "Explore Asset Classes",
    targetAudience: "all"
  },
  {
    id: "parent-peace-of-mind",
    headline: "Give Them Knowledge, Not Just Allowance",
    subheadline: "The most valuable gift: Financial literacy that compounds for life",
    emoji: "👨‍👩‍👧",
    bulletPoints: [
      "Age-appropriate financial education (12-18)",
      "Safe learning environment with fake money",
      "Track progress with parent dashboard",
      "Skills that last a lifetime"
    ],
    wisdomConnection: "From 'Generational Transfer' pillar - wisdom before wealth",
    ctaText: "Learn More for Parents",
    targetAudience: "parents"
  },
  {
    id: "educator-curriculum",
    headline: "Financial Literacy Made Engaging",
    subheadline: "Curriculum-aligned content that students actually want to complete",
    emoji: "🎓",
    bulletPoints: [
      "Gamification drives 3x completion rates",
      "Aligns with Australian curriculum standards",
      "Progress tracking and reporting",
      "Free for schools (sponsored program)"
    ],
    wisdomConnection: "Educational content structured around 4 pillars and 6 eras",
    ctaText: "School Partnership Info",
    targetAudience: "educators"
  }
];

// ============================================================================
// MARKETING TAGLINES (Rotating)
// ============================================================================

export interface MarketingTagline {
  text: string;
  emoji: string;
  source: "wisdom" | "original";
  attribution?: string;
}

export const marketingTaglines: MarketingTagline[] = [
  // From wealth wisdom
  { 
    text: "Financial literacy shouldn't be a privilege of the wealthy", 
    emoji: "🎯", 
    source: "wisdom",
    attribution: "Our Mission"
  },
  { 
    text: "Someone's sitting in the shade today because someone planted a tree a long time ago", 
    emoji: "🌳", 
    source: "wisdom",
    attribution: "Warren Buffett"
  },
  { 
    text: "Know what you own, and know why you own it", 
    emoji: "💡", 
    source: "wisdom",
    attribution: "Peter Lynch"
  },
  { 
    text: "Pain + Reflection = Progress", 
    emoji: "💪", 
    source: "wisdom",
    attribution: "Ray Dalio"
  },
  { 
    text: "Don't look for the needle in the haystack. Just buy the haystack!", 
    emoji: "🎯", 
    source: "wisdom",
    attribution: "Jack Bogle"
  },
  // Original marketing
  { 
    text: "Time-travel through markets. Learn without the losses.", 
    emoji: "⏰", 
    source: "original"
  },
  { 
    text: "Your AI coach. Your pace. Your financial future.", 
    emoji: "🤖", 
    source: "original"
  },
  { 
    text: "Every generation has their moment. This is yours.", 
    emoji: "🚀", 
    source: "original"
  },
  { 
    text: "Gamify your financial education. Level up your future.", 
    emoji: "🎮", 
    source: "original"
  },
  { 
    text: "The best time to plant a tree was 20 years ago. The second best time is NOW.", 
    emoji: "🌱", 
    source: "original"
  }
];

// ============================================================================
// FEATURE BENEFIT MAPPING (Quick Wins → Marketing Messages)
// ============================================================================

export interface FeatureBenefit {
  featureId: string;
  featureName: string;
  marketingBenefit: string;
  wisdomPillar: string;
  userValue: string;
  emoji: string;
}

export const featureBenefits: FeatureBenefit[] = [
  {
    featureId: "floating-xp",
    featureName: "Floating XP Animations",
    marketingBenefit: "Instant feedback makes learning addictive",
    wisdomPillar: "accumulation",
    userValue: "See your knowledge grow in real-time",
    emoji: "✨"
  },
  {
    featureId: "daily-streak",
    featureName: "Daily Streak System",
    marketingBenefit: "Build habits that last a lifetime",
    wisdomPillar: "accumulation",
    userValue: "Consistency beats intensity - just like real investing",
    emoji: "🔥"
  },
  {
    featureId: "level-up-celebration",
    featureName: "Level-Up Celebrations",
    marketingBenefit: "Every milestone deserves recognition",
    wisdomPillar: "growth",
    userValue: "Feel the progress as you master financial concepts",
    emoji: "🎉"
  },
  {
    featureId: "difficulty-meter",
    featureName: "Mission Difficulty Indicator",
    marketingBenefit: "Choose your challenge level",
    wisdomPillar: "preservation",
    userValue: "Progress at your own pace - no pressure",
    emoji: "📊"
  },
  {
    featureId: "coach-quotes",
    featureName: "Coach Quote Randomizer",
    marketingBenefit: "AI coaches with personality",
    wisdomPillar: "transfer",
    userValue: "Learn from 4 distinct investment philosophies",
    emoji: "💬"
  },
  {
    featureId: "mission-confetti",
    featureName: "Mission Complete Confetti",
    marketingBenefit: "Celebrate every learning moment",
    wisdomPillar: "growth",
    userValue: "Make financial education feel like winning",
    emoji: "🎊"
  },
  {
    featureId: "new-badges",
    featureName: "NEW Mission Badges",
    marketingBenefit: "Always something new to discover",
    wisdomPillar: "accumulation",
    userValue: "Stay engaged with fresh content",
    emoji: "🆕"
  },
  {
    featureId: "courage-xp",
    featureName: "Courage XP System",
    marketingBenefit: "Rewards effort, not just results",
    wisdomPillar: "growth",
    userValue: "Learn that trying > staying safe",
    emoji: "⚡"
  },
  {
    featureId: "wealth-wisdom",
    featureName: "Generational Wealth Wisdom",
    marketingBenefit: "Family Office knowledge for everyone",
    wisdomPillar: "transfer",
    userValue: "Access secrets the wealthy teach their kids",
    emoji: "🏛️"
  },
  {
    featureId: "loss-aversion-reframe",
    featureName: "Loss as Learning",
    marketingBenefit: "Turn setbacks into comebacks",
    wisdomPillar: "preservation",
    userValue: "Build resilience before risking real money",
    emoji: "📈"
  }
];

// ============================================================================
// FUTURE FEATURE TEASERS (Connected to Roadmap)
// ============================================================================

export interface FutureFeatureTeaser {
  id: string;
  title: string;
  teaser: string;
  fullDescription: string;
  icon: string;
  status: "research" | "design" | "development" | "beta" | "coming_soon";
  eta: string;
  wisdomConnection: string;
  marketingHook: string;
  benefitForTeens: string;
}

export const futureFeatureTeasers: FutureFeatureTeaser[] = [
  {
    id: "risk-personality-quiz",
    title: "Investor DNA Quiz",
    teaser: "Discover your true investor personality",
    fullDescription: "A 10-question assessment that reveals your risk tolerance, decision style, and matches you with the perfect AI coach. Based on behavioral finance research.",
    icon: "🧬",
    status: "development",
    eta: "Dec 2025",
    wisdomConnection: "Maps to the 4 Financial Personalities: Guardian, Builder, Explorer, Pioneer",
    marketingHook: "Know yourself before you invest",
    benefitForTeens: "Finally understand WHY you make the decisions you do - and how to improve"
  },
  {
    id: "portfolio-builder",
    title: "Dream Portfolio Builder",
    teaser: "Design your future wealth, visually",
    fullDescription: "Drag-and-drop interface to build portfolios across 6 asset classes. Real-time risk analysis, FO allocation comparisons, and AI suggestions.",
    icon: "🎨",
    status: "design",
    eta: "Jan 2026",
    wisdomConnection: "Implements FO Principle #2: Diversification is the only free lunch",
    marketingHook: "Build portfolios like a $100M Family Office",
    benefitForTeens: "See how different allocations affect risk/reward before using real money"
  },
  {
    id: "risk-roulette",
    title: "Risk Roulette",
    teaser: "Daily prediction game with 🪙 iii rewards",
    fullDescription: "Predict which asset class wins tomorrow! Learn market dynamics through daily micro-games. Build streaks for bonus rewards.",
    icon: "🎰",
    status: "development",
    eta: "Dec 2025",
    wisdomConnection: "Teaches 'Be greedy when others are fearful' through gamification",
    marketingHook: "2 minutes a day to understand markets",
    benefitForTeens: "Quick daily engagement that actually teaches market intuition"
  },
  {
    id: "fo-certification",
    title: "FO Fellow Certification",
    teaser: "Earn credentials you can share",
    fullDescription: "Complete all missions, pass the capstone exam, earn your 'Family Office Fellow' digital badge. Share on LinkedIn, include in college apps.",
    icon: "🏆",
    status: "research",
    eta: "Feb 2026",
    wisdomConnection: "Culmination of all 4 Wealth Pillars + 6 FO Principles",
    marketingHook: "A credential that actually means something",
    benefitForTeens: "Stand out in college applications and job interviews"
  },
  {
    id: "parent-dashboard",
    title: "Parent Insights Dashboard",
    teaser: "Track your teen's financial education journey",
    fullDescription: "See progress, celebrate milestones, understand their learning style. Optional guided discussions to continue learning at home.",
    icon: "👨‍👩‍👧",
    status: "design",
    eta: "Mar 2026",
    wisdomConnection: "Enables 'Generational Transfer' - the 4th wealth pillar",
    marketingHook: "Finally, screen time that builds wealth",
    benefitForTeens: "Share achievements with parents who actually understand what you learned"
  },
  {
    id: "real-trading-bridge",
    title: "Real Money Ready",
    teaser: "When you're ready, we'll connect you",
    fullDescription: "Seamless transition from learning to real investing. Partner broker connections, first-trade bonuses, continued AI coaching.",
    icon: "🌉",
    status: "research",
    eta: "Q2 2026",
    wisdomConnection: "Transforms education into action - 'Start now' principle",
    marketingHook: "From simulation to real wealth building",
    benefitForTeens: "Graduate to real investing with confidence and support"
  },
  {
    id: "ai-coach-chat",
    title: "24/7 AI Coach Chat",
    teaser: "Ask anything about investing, anytime",
    fullDescription: "Natural language AI assistant trained on Family Office principles. Context-aware responses based on your learning history and personality.",
    icon: "💬",
    status: "development",
    eta: "Jan 2026",
    wisdomConnection: "Personalized coaching like wealthy families provide",
    marketingHook: "Your personal investing mentor, always available",
    benefitForTeens: "Get answers to YOUR questions, not generic advice"
  },
  {
    id: "social-learning",
    title: "Squad Investing",
    teaser: "Learn with friends, compete together",
    fullDescription: "Create squads, compete on leaderboards, share portfolios, teach each other. Social features that make learning collaborative.",
    icon: "👥",
    status: "research",
    eta: "Q2 2026",
    wisdomConnection: "Teaching reinforces learning - from Generational Transfer pillar",
    marketingHook: "The best learning happens together",
    benefitForTeens: "Turn your friend group into an investing club"
  }
];

// ============================================================================
// SOCIAL PROOF STATS (For Marketing)
// ============================================================================

export interface SocialProofStat {
  value: string;
  label: string;
  source: string;
  emoji: string;
}

export const socialProofStats: SocialProofStat[] = [
  { value: "70%", label: "of Aussie teens have no financial education", source: "ASX Survey 2023", emoji: "📉" },
  { value: "80%", label: "of millionaires are first-generation wealthy", source: "Thomas Stanley Research", emoji: "💎" },
  { value: "35+", label: "years of historical market data to learn from", source: "Legacy Guardians", emoji: "📊" },
  { value: "6", label: "asset classes taught (like Family Offices)", source: "Legacy Guardians", emoji: "🏛️" },
  { value: "4", label: "AI coaches with unique investment styles", source: "Legacy Guardians", emoji: "🤖" },
  { value: "$0", label: "cost to start learning (free forever tier)", source: "Legacy Guardians", emoji: "🆓" },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getRandomTagline = (): MarketingTagline => {
  return marketingTaglines[Math.floor(Math.random() * marketingTaglines.length)];
};

export const getValuePropositionByAudience = (audience: "teens" | "parents" | "educators" | "all"): ValueProposition[] => {
  return valuePropositions.filter(vp => vp.targetAudience === audience || vp.targetAudience === "all");
};

export const getFeatureBenefitsByPillar = (pillar: string): FeatureBenefit[] => {
  return featureBenefits.filter(fb => fb.wisdomPillar === pillar);
};

export const getFutureFeaturesbyStatus = (status: FutureFeatureTeaser["status"]): FutureFeatureTeaser[] => {
  return futureFeatureTeasers.filter(ft => ft.status === status);
};

// Get features that are coming soon (for teaser sections)
export const getUpcomingTeasers = (limit: number = 4): FutureFeatureTeaser[] => {
  const priorityOrder = ["development", "coming_soon", "design", "research", "beta"];
  return [...futureFeatureTeasers]
    .sort((a, b) => priorityOrder.indexOf(a.status) - priorityOrder.indexOf(b.status))
    .slice(0, limit);
};

// Connect a feature to its wisdom context
export const getWisdomContextForFeature = (featureId: string): string => {
  const feature = futureFeatureTeasers.find(f => f.id === featureId);
  return feature?.wisdomConnection || "";
};

// ============================================================================
// 🚀 VIRAL MARKETING INTEGRATION
// Links Quick Wins to Viral Triggers, Sharing Moments, and Referral System
// ============================================================================

export interface ViralTrigger {
  featureId: string;
  featureName: string;
  triggerMoment: string;
  trackingEvent: string;
  shareableContent: ShareableContent;
  referralHook: string;
  viralCoefficient: "high" | "medium" | "low";
  socialProof: string;
}

export interface ShareableContent {
  headline: string;
  body: string;
  hashtags: string[];
  imagePrompt: string;
  platforms: ("twitter" | "tiktok" | "instagram" | "linkedin" | "whatsapp")[];
}

/**
 * Maps each Quick Win to its viral marketing trigger
 * Connects to MARKETING_EVENTS from marketingData.ts
 */
export const viralTriggers: ViralTrigger[] = [
  {
    featureId: "level-up-celebration",
    featureName: "Level-Up Celebrations",
    triggerMoment: "When player levels up with confetti animation",
    trackingEvent: MARKETING_EVENTS.LEVEL_UP,
    shareableContent: {
      headline: "🎉 I just leveled up to Level {{level}} in Legacy Guardians!",
      body: "Learning to invest like a Family Office - one mission at a time. {{totalXp}} XP earned so far!",
      hashtags: ["#LegacyGuardians", "#FinancialLiteracy", "#GenZ", "#Investing"],
      imagePrompt: "Level badge with confetti, showing level number",
      platforms: ["twitter", "instagram", "tiktok"]
    },
    referralHook: "Invite a friend to level up together - both get bonus 🪙! 🎁",
    viralCoefficient: "high",
    socialProof: "Join {{userCount}}+ teens building wealth knowledge"
  },
  {
    featureId: "daily-streak",
    featureName: "Daily Streak Milestones",
    triggerMoment: "At 7, 14, 30, 100 day streak milestones",
    trackingEvent: MARKETING_EVENTS.ACHIEVEMENT_EARNED,
    shareableContent: {
      headline: "🔥 {{streakDays}}-day streak! Consistency is my superpower",
      body: "Warren Buffett says compound interest is the 8th wonder of the world. I'm compounding my knowledge daily! 📈",
      hashtags: ["#StreakGoals", "#DailyHabits", "#FinancialEducation", "#LegacyGuardians"],
      imagePrompt: "Flame streak badge with day count",
      platforms: ["twitter", "instagram", "tiktok"]
    },
    referralHook: "Challenge a friend to a streak competition! 🏆",
    viralCoefficient: "high",
    socialProof: "{{streakLeaders}} players have 30+ day streaks"
  },
  {
    featureId: "mission-confetti",
    featureName: "Mission Complete Celebrations",
    triggerMoment: "After completing any historical mission with celebration screen",
    trackingEvent: MARKETING_EVENTS.MISSION_COMPLETED,
    shareableContent: {
      headline: "📚 Just survived the {{missionName}}!",
      body: "Learned what happened when {{historicalContext}} - now I know how to handle it! {{lessonLearned}}",
      hashtags: ["#FinancialHistory", "#LearnFromThePast", "#LegacyGuardians", "#Investing101"],
      imagePrompt: "Historical mission card with completion badge",
      platforms: ["twitter", "linkedin", "instagram"]
    },
    referralHook: "Think your friends could've done better? Challenge them! 💪",
    viralCoefficient: "medium",
    socialProof: "This mission completed by {{completionCount}} players"
  },
  {
    featureId: "courage-xp",
    featureName: "Courage XP Awards",
    triggerMoment: "When player earns XP for taking calculated risks",
    trackingEvent: MARKETING_EVENTS.ACHIEVEMENT_EARNED,
    shareableContent: {
      headline: "⚡ Earned '{{badgeName}}' badge for taking smart risks!",
      body: "Legacy Guardians rewards TRYING, not just winning. Real investors learn from bold moves! 🎯",
      hashtags: ["#CourageNotFear", "#RiskTaking", "#FinancialLiteracy", "#LegacyGuardians"],
      imagePrompt: "Courage badge with lightning bolt and XP amount",
      platforms: ["twitter", "tiktok", "instagram"]
    },
    referralHook: "Show your friends you're braver than them! 😈",
    viralCoefficient: "medium",
    socialProof: "{{courageXpTotal}} Courage XP earned by players this week"
  },
  {
    featureId: "wealth-wisdom",
    featureName: "Wealth Wisdom Discoveries",
    triggerMoment: "When player reads a powerful investor quote or FO principle",
    trackingEvent: MARKETING_EVENTS.WISDOM_READ,
    shareableContent: {
      headline: "💡 \"{{quote}}\" - {{investor}}",
      body: "Wisdom from Legacy Guardians. The wealthy teach their kids differently. Now I know their secrets! 🏛️",
      hashtags: ["#InvestorWisdom", "#WealthBuilding", "#FinancialEducation", "#FOSecrets"],
      imagePrompt: "Quote card with investor portrait and Legacy Guardians branding",
      platforms: ["twitter", "linkedin", "instagram", "whatsapp"]
    },
    referralHook: "Share wisdom with a friend who needs to hear this 📖",
    viralCoefficient: "high",
    socialProof: "This wisdom shared {{shareCount}} times"
  },
  {
    featureId: "coach-quotes",
    featureName: "AI Coach Moments",
    triggerMoment: "When AI coach delivers memorable advice",
    trackingEvent: MARKETING_EVENTS.COACH_CHAT_OPENED,
    shareableContent: {
      headline: "🤖 My AI coach {{coachName}} just said: \"{{coachQuote}}\"",
      body: "Getting personalized investment coaching for FREE. {{coachPersonality}} energy! #AICoaching",
      hashtags: ["#AICoach", "#FinancialAdvice", "#LegacyGuardians", "#PersonalizedLearning"],
      imagePrompt: "Coach avatar with speech bubble containing quote",
      platforms: ["twitter", "tiktok", "instagram"]
    },
    referralHook: "Find out which AI coach matches YOUR personality! 🎯",
    viralCoefficient: "medium",
    socialProof: "{{coachName}} has helped {{helpedCount}} players"
  },
  {
    featureId: "asset-class-mastery",
    featureName: "Asset Class Badge Unlocks",
    triggerMoment: "When player completes all missions in an asset class",
    trackingEvent: MARKETING_EVENTS.ACHIEVEMENT_EARNED,
    shareableContent: {
      headline: "🏆 Mastered {{assetClass}}! Badge unlocked!",
      body: "One of 6 asset classes Family Offices use. Building my diversified knowledge portfolio! 📊",
      hashtags: ["#AssetMastery", "#Diversification", "#FOEducation", "#LegacyGuardians"],
      imagePrompt: "Asset class badge with mastery glow effect",
      platforms: ["twitter", "linkedin", "instagram"]
    },
    referralHook: "Can your friends master all 6 asset classes? 🎓",
    viralCoefficient: "high",
    socialProof: "Only {{masteryPercent}}% of players have mastered this class"
  },
  {
    featureId: "loss-aversion-reframe",
    featureName: "Learning from Losses",
    triggerMoment: "When player loses but receives encouraging lesson",
    trackingEvent: MARKETING_EVENTS.MISSION_COMPLETED,
    shareableContent: {
      headline: "📉 Lost {{lossPercent}}% but learned THIS: {{lesson}}",
      body: "Ray Dalio says 'Pain + Reflection = Progress'. Legacy Guardians lets me fail safely! 💪",
      hashtags: ["#LearnFromLosses", "#GrowthMindset", "#InvestingLessons", "#LegacyGuardians"],
      imagePrompt: "Resilience badge with upward arrow emerging from dip",
      platforms: ["twitter", "tiktok", "linkedin"]
    },
    referralHook: "Learn from losses without losing real money! 🛡️",
    viralCoefficient: "medium",
    socialProof: "{{lessonsLearned}} lessons learned from losses this month"
  }
];

// ============================================================================
// REFERRAL REWARD TIERS (Viral Loop)
// ============================================================================

export interface ReferralReward {
  tier: number;
  referralsRequired: number;
  reward: string;
  xpBonus: number;
  badge: string;
  description: string;
}

export const referralRewards: ReferralReward[] = [
  {
    tier: 1,
    referralsRequired: 1,
    reward: "Early Investor Badge",
    xpBonus: 100,
    badge: "🌱",
    description: "You planted your first seed of knowledge sharing!"
  },
  {
    tier: 2,
    referralsRequired: 3,
    reward: "Squad Builder Badge",
    xpBonus: 300,
    badge: "👥",
    description: "You're building a squad of future investors!"
  },
  {
    tier: 3,
    referralsRequired: 5,
    reward: "Wealth Spreader Badge + Exclusive Coach Skin",
    xpBonus: 500,
    badge: "🌟",
    description: "Financial literacy champion - spreading wealth wisdom!"
  },
  {
    tier: 4,
    referralsRequired: 10,
    reward: "Legacy Builder Badge + Premium Week Trial",
    xpBonus: 1000,
    badge: "🏛️",
    description: "Building a legacy of financial education!"
  },
  {
    tier: 5,
    referralsRequired: 25,
    reward: "FO Ambassador Badge + Lifetime Premium",
    xpBonus: 2500,
    badge: "👑",
    description: "You ARE the next generation of wealth educators!"
  }
];

// ============================================================================
// SHARE TEMPLATES (Pre-formatted for each platform)
// ============================================================================

export interface ShareTemplate {
  platform: "twitter" | "tiktok" | "instagram" | "linkedin" | "whatsapp" | "email";
  template: string;
  maxLength?: number;
  includeImage: boolean;
  cta: string;
}

export const shareTemplates: Record<string, ShareTemplate[]> = {
  levelUp: [
    {
      platform: "twitter",
      template: "🎉 Level {{level}} unlocked in @LegacyGuardians! Learning to invest like a Family Office. Who wants to join me? {{referralLink}} #FinancialLiteracy #GenZ",
      maxLength: 280,
      includeImage: true,
      cta: "Play Free"
    },
    {
      platform: "tiktok",
      template: "POV: You just leveled up in Legacy Guardians and now you understand the stock market better than most adults 😎📈 #FinTok #MoneyTips #LegacyGuardians",
      includeImage: true,
      cta: "Link in bio"
    },
    {
      platform: "whatsapp",
      template: "Hey! I've been playing this game called Legacy Guardians that teaches investing through historical missions. Just hit Level {{level}}! You should try it: {{referralLink}}",
      includeImage: false,
      cta: "Try it!"
    }
  ],
  streak: [
    {
      platform: "twitter",
      template: "🔥 {{days}}-day streak! Building investing habits one day at a time. @LegacyGuardians makes financial literacy addictive 📚 {{referralLink}}",
      maxLength: 280,
      includeImage: true,
      cta: "Start your streak"
    },
    {
      platform: "instagram",
      template: "Day {{days}} of learning to invest like a Family Office 🔥\n\nStreak status: UNBROKEN 💪\n\n#LegacyGuardians #FinancialEducation #StreakGoals #Investing",
      includeImage: true,
      cta: "Join the challenge"
    }
  ],
  achievement: [
    {
      platform: "twitter",
      template: "🏆 Just earned the '{{badge}}' badge in @LegacyGuardians! {{achievementDesc}} Free game that actually teaches investing: {{referralLink}}",
      maxLength: 280,
      includeImage: true,
      cta: "Earn yours"
    },
    {
      platform: "linkedin",
      template: "Investing in my financial education! 📊\n\nJust earned the '{{badge}}' achievement in Legacy Guardians - a game that teaches Family Office investment strategies.\n\n{{achievementDesc}}\n\nIt's never too early to learn wealth building. Check it out: {{referralLink}}\n\n#FinancialLiteracy #Education #Investing #GenZ",
      includeImage: true,
      cta: "Learn more"
    }
  ],
  wisdom: [
    {
      platform: "twitter",
      template: "💡 \"{{quote}}\" - {{investor}}\n\nLearned this in @LegacyGuardians. This game teaches what schools don't 📚 {{referralLink}}",
      maxLength: 280,
      includeImage: true,
      cta: "Get smart"
    },
    {
      platform: "whatsapp",
      template: "Check out this investing wisdom:\n\n\"{{quote}}\"\n- {{investor}}\n\nLearned it from Legacy Guardians. You should try it! {{referralLink}}",
      includeImage: false,
      cta: "Try it"
    }
  ]
};

// ============================================================================
// VIRAL MOMENTS - When to prompt sharing
// ============================================================================

export interface ViralMoment {
  trigger: string;
  timing: "immediate" | "delayed_5s" | "end_of_session";
  sharePrompt: string;
  referralPrompt: string;
  trackingEvent: string;
  conversionGoal: string;
}

export const viralMoments: ViralMoment[] = [
  {
    trigger: "first_mission_complete",
    timing: "immediate",
    sharePrompt: "🎉 You survived your first market crisis! Share your victory?",
    referralPrompt: "Know someone who should learn this? Invite them and both get 50 bonus 🪙!",
    trackingEvent: MARKETING_EVENTS.MISSION_COMPLETED,
    conversionGoal: "referral_link_created"
  },
  {
    trigger: "level_up",
    timing: "delayed_5s",
    sharePrompt: "Level {{level}} unlocked! Show off your progress?",
    referralPrompt: "Level up faster with friends! Each referral = 100 🪙 iii",
    trackingEvent: MARKETING_EVENTS.LEVEL_UP,
    conversionGoal: "share_clicked"
  },
  {
    trigger: "streak_milestone",
    timing: "immediate",
    sharePrompt: "🔥 {{days}}-day streak! That's dedication!",
    referralPrompt: "Challenge a friend to beat your streak!",
    trackingEvent: MARKETING_EVENTS.ACHIEVEMENT_EARNED,
    conversionGoal: "referral_link_shared"
  },
  {
    trigger: "asset_class_mastered",
    timing: "immediate",
    sharePrompt: "🏆 {{assetClass}} MASTERED! You're officially an expert!",
    referralPrompt: "Only {{percent}}% of players reach this. Help a friend start their journey!",
    trackingEvent: MARKETING_EVENTS.ACHIEVEMENT_EARNED,
    conversionGoal: "referral_converted"
  },
  {
    trigger: "fo_certification_earned",
    timing: "immediate",
    sharePrompt: "👑 FO FELLOW CERTIFIED! Share your credential!",
    referralPrompt: "You've mastered everything. Now teach others - 500 🪙 per referral!",
    trackingEvent: MARKETING_EVENTS.ACHIEVEMENT_EARNED,
    conversionGoal: "premium_viewed"
  },
  {
    trigger: "loss_lesson_learned",
    timing: "delayed_5s",
    sharePrompt: "📈 Lost money but gained wisdom! Share what you learned?",
    referralPrompt: "Help friends learn from losses without real consequences!",
    trackingEvent: MARKETING_EVENTS.MISSION_COMPLETED,
    conversionGoal: "referral_link_shared"
  },
  {
    trigger: "wisdom_bookmarked",
    timing: "end_of_session",
    sharePrompt: "💡 Great wisdom saved! Share it with someone who needs to hear it?",
    referralPrompt: "Spread financial wisdom - knowledge shared is knowledge multiplied!",
    trackingEvent: MARKETING_EVENTS.WISDOM_READ,
    conversionGoal: "share_clicked"
  }
];

// ============================================================================
// VIRAL HELPER FUNCTIONS
// ============================================================================

export const getViralTriggerForFeature = (featureId: string): ViralTrigger | undefined => {
  return viralTriggers.find(vt => vt.featureId === featureId);
};

export const getShareTemplatesForPlatform = (platform: string): ShareTemplate[] => {
  const templates: ShareTemplate[] = [];
  Object.values(shareTemplates).forEach(platformTemplates => {
    templates.push(...platformTemplates.filter(t => t.platform === platform));
  });
  return templates;
};

export const getReferralRewardForCount = (referralCount: number): ReferralReward | undefined => {
  return [...referralRewards]
    .reverse()
    .find(r => referralCount >= r.referralsRequired);
};

export const getNextReferralMilestone = (referralCount: number): ReferralReward | undefined => {
  return referralRewards.find(r => r.referralsRequired > referralCount);
};

export const getViralMomentByTrigger = (trigger: string): ViralMoment | undefined => {
  return viralMoments.find(vm => vm.trigger === trigger);
};

// Generate shareable URL with referral code
export const generateShareUrl = (referralCode: string, platform: string): string => {
  const baseUrl = "https://minifi.app";
  return `${baseUrl}?ref=${referralCode}&utm_source=${platform}&utm_medium=referral&utm_campaign=viral_share`;
};

// Calculate viral coefficient estimate
export const estimateViralCoefficient = (
  totalUsers: number,
  referralSignups: number,
  shareRate: number
): number => {
  if (totalUsers === 0) return 0;
  const inviteRate = referralSignups / totalUsers;
  const conversionRate = shareRate; // Assuming share → signup conversion
  return inviteRate * conversionRate;
};

