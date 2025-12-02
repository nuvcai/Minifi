/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   📣 MARKETING MESSAGES - Linking Wealth Wisdom to User Value               ║
 * ║   Messages that connect gamification, education, and marketing              ║
 * ║   ✨ MiniFi / Legacy Guardians ✨                                           ║
 * ║   Copyright (c) 2025 NUVC.AI / Tick.AI. All Rights Reserved.                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { wealthPillars, wealthEras, investorWisdom, hopeMessages, foPrinciples } from "./wealthWisdom";

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
      "Earn XP for trying new asset classes",
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
    teaser: "Daily prediction game with XP rewards",
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

