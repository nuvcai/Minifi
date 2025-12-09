/**
 * Unified Chapters & Learning Data
 * Single source of truth for chapters, eras, and progression
 * © 2025 NUVC.AI. All Rights Reserved.
 */

import { 
  TrendingUp, 
  Shield, 
  Rocket, 
  Building2, 
  Globe, 
  Bitcoin,
  Cpu,
  Users,
  Brain,
  Lightbulb,
  BarChart3,
  Clock,
  TrendingDown,
} from "lucide-react";

// ============================================================================
// CHAPTERS - Game progression structure
// ============================================================================

export interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  emoji: string;
  description: string;
  theme: string;
  themeBg: string;
  themeBgLight: string;
  borderColor: string;
  accentColor: string;
  accentColorBold: string;
  levels: number;
  unlocked: boolean;
  skills: string[];
  reward: string;
  comingSoon?: boolean;
}

export const chapters: Chapter[] = [
  {
    id: 1,
    title: "Market Crashes 101",
    subtitle: "Learn to Survive the Storm",
    emoji: "📉",
    description: "How smart investors survived (and got RICH!) during market chaos",
    theme: "from-[#9898f2] via-[#7878d2] to-[#5858b2]",
    themeBg: "from-[#9898f2]/20 via-[#7878d2]/10 to-[#5858b2]/5",
    themeBgLight: "from-[#9898f2]/10 via-[#7878d2]/5 to-transparent",
    borderColor: "border-[#9898f2]/30 dark:border-[#9898f2]/40",
    accentColor: "text-[#7070c0] dark:text-[#9898f2]",
    accentColorBold: "text-[#5858a0] dark:text-[#b8b8ff]",
    levels: 6,
    unlocked: true,
    skills: ["Crisis Management", "Emotional Control", "Diversification"],
    reward: "🏆 Market Survivor Badge",
  },
  {
    id: 2,
    title: "Bull Run Mastery",
    subtitle: "Ride the Wave Without Wiping Out",
    emoji: "🐂",
    description: "Master the art of timing and know when to take profits",
    theme: "from-emerald-500 via-green-500 to-teal-500",
    themeBg: "from-emerald-500/20 via-green-500/10 to-teal-500/5",
    themeBgLight: "from-emerald-500/10 via-green-500/5 to-transparent",
    borderColor: "border-emerald-500/30 dark:border-emerald-500/40",
    accentColor: "text-emerald-600 dark:text-emerald-400",
    accentColorBold: "text-emerald-700 dark:text-emerald-300",
    levels: 6,
    unlocked: false,
    skills: ["Trend Recognition", "Profit Taking", "Position Sizing"],
    reward: "🐂 Bull Rider Badge",
    comingSoon: true,
  },
  {
    id: 3,
    title: "Portfolio Architect",
    subtitle: "Build Wealth That Lasts Generations",
    emoji: "🏛️",
    description: "Design portfolios like billion-dollar family offices",
    theme: "from-amber-500 via-orange-500 to-rose-500",
    themeBg: "from-amber-500/20 via-orange-500/10 to-rose-500/5",
    themeBgLight: "from-amber-500/10 via-orange-500/5 to-transparent",
    borderColor: "border-amber-500/30 dark:border-amber-500/40",
    accentColor: "text-amber-600 dark:text-amber-400",
    accentColorBold: "text-amber-700 dark:text-amber-300",
    levels: 6,
    unlocked: false,
    skills: ["Asset Allocation", "Rebalancing", "Tax Optimization"],
    reward: "🏛️ Family Office Master Badge",
    comingSoon: true,
  },
];

// ============================================================================
// LEVEL METADATA - Difficulty progression
// ============================================================================

export interface LevelMeta {
  difficulty: string;
  stars: number;
  baseXP: number;
  color: string;
}

export const levelMeta: LevelMeta[] = [
  { difficulty: "Beginner", stars: 1, baseXP: 100, color: "from-blue-400 to-cyan-400" },
  { difficulty: "Beginner", stars: 1, baseXP: 150, color: "from-blue-400 to-cyan-400" },
  { difficulty: "Intermediate", stars: 2, baseXP: 150, color: "from-emerald-400 to-teal-400" },
  { difficulty: "Advanced", stars: 3, baseXP: 200, color: "from-amber-400 to-orange-400" },
  { difficulty: "Advanced", stars: 3, baseXP: 250, color: "from-amber-400 to-orange-400" },
  { difficulty: "Expert", stars: 4, baseXP: 300, color: "from-violet-400 to-purple-400" },
];

// ============================================================================
// WEALTH PILLARS - The 3 Rules of Rich Families
// ============================================================================

export interface WealthPillar {
  id: string;
  name: string;
  icon: typeof Rocket;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  description: string;
  strategies: string[];
  simpleExplanation: string;
  learnedIn: number[];
}

export const wealthPillars: WealthPillar[] = [
  {
    id: "create",
    name: "Make Money 💰",
    icon: Rocket,
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    textColor: "text-amber-600 dark:text-amber-400",
    description: "Start businesses, create value, invest in new ideas",
    strategies: ["Start a side hustle", "Invest in what you understand", "Take smart risks"],
    simpleExplanation: "Rich families don't just save - they build things that make money!",
    learnedIn: [2000, 2025],
  },
  {
    id: "preserve",
    name: "Keep Money 🛡️",
    icon: Shield,
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    textColor: "text-emerald-600 dark:text-emerald-400",
    description: "Don't lose what you have - spread your bets, stay calm in crashes",
    strategies: ["Don't put all eggs in one basket", "Stay calm when markets crash", "Keep some cash ready"],
    simpleExplanation: "It's not about getting rich quick - it's about not going broke!",
    learnedIn: [1990, 1997, 2008, 2020],
  },
  {
    id: "transfer",
    name: "Pass It On 🎓",
    icon: Users,
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/30",
    textColor: "text-violet-600 dark:text-violet-400",
    description: "Teach the next generation - money skills AND good values",
    strategies: ["Teach kids about money", "Share your knowledge", "Build lasting habits"],
    simpleExplanation: "The best gift isn't money - it's knowing HOW to make & keep it!",
    learnedIn: [1990, 2020],
  },
];

// ============================================================================
// GENERATIONAL OPPORTUNITIES - Each Era's Big Chances
// ============================================================================

export interface GenerationalOpportunity {
  id: string;
  generation: string;
  era: string;
  icon: typeof Building2;
  color: string;
  opportunities: string[];
  keyLesson: string;
  isCurrentGen?: boolean;
}

export const generationalOpportunities: GenerationalOpportunity[] = [
  {
    id: "boomers",
    generation: "Your Grandparents' Era",
    era: "1960s-1980s",
    icon: Building2,
    color: "from-slate-500 to-slate-600",
    opportunities: ["Bought houses cheap", "Factory jobs paid well", "Stocks were new"],
    keyLesson: "Buy property, hold it forever",
  },
  {
    id: "genx",
    generation: "Your Parents' Era",
    era: "1990s-2000s",
    icon: Globe,
    color: "from-blue-500 to-cyan-500",
    opportunities: ["The Internet changed everything", "Global trade exploded", "Tech stocks boomed"],
    keyLesson: "Get in early on new tech",
  },
  {
    id: "millennials",
    generation: "Older Siblings' Era",
    era: "2000s-2020s",
    icon: Bitcoin,
    color: "from-orange-500 to-red-500",
    opportunities: ["Apps on phones", "YouTube & TikTok stars", "Bitcoin millionaires"],
    keyLesson: "Build audiences, go digital",
  },
  {
    id: "genz",
    generation: "YOUR Era! 🚀",
    era: "2020s-Future",
    icon: Cpu,
    color: "from-[#9898f2] to-purple-600",
    opportunities: ["AI tools for everyone", "Climate solutions needed", "Create & earn online"],
    keyLesson: "Use AI to build something amazing!",
    isCurrentGen: true,
  },
];

// ============================================================================
// ASSET CLASSES - Ways to Invest
// ============================================================================

export interface AssetClass {
  id: string;
  name: string;
  icon: typeof TrendingUp;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  riskLevel: string;
  simpleAllocation: string;
  description: string;
  learnedIn: number[];
}

export const assetClasses: AssetClass[] = [
  {
    id: "equities",
    name: "Stocks 📈",
    icon: TrendingUp,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    textColor: "text-blue-600 dark:text-blue-400",
    riskLevel: "Can go up or down",
    simpleAllocation: "Put 25-60% here",
    description: "Own a piece of companies like Apple or Tesla",
    learnedIn: [1990, 2000, 2008, 2020],
  },
  {
    id: "fixed-income",
    name: "Bonds 🔒",
    icon: Shield,
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    textColor: "text-emerald-600 dark:text-emerald-400",
    riskLevel: "Safer, steady",
    simpleAllocation: "Put 15-50% here",
    description: "Lend money to companies/governments, get paid back with interest",
    learnedIn: [1997, 2008],
  },
  {
    id: "commodities",
    name: "Gold & Stuff 🥇",
    icon: Building2,
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    textColor: "text-amber-600 dark:text-amber-400",
    riskLevel: "Hedge against chaos",
    simpleAllocation: "Put 5-15% here",
    description: "Gold, silver, oil - things you can touch",
    learnedIn: [1990, 1997, 2008],
  },
  {
    id: "alternatives",
    name: "Property 🏠",
    icon: Building2,
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/30",
    textColor: "text-violet-600 dark:text-violet-400",
    riskLevel: "Slow & steady",
    simpleAllocation: "Put 10-25% here",
    description: "Houses, buildings, land - real stuff",
    learnedIn: [1990, 2008],
  },
  {
    id: "ventures",
    name: "Startups 🚀",
    icon: Rocket,
    color: "from-rose-500 to-pink-500",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/30",
    textColor: "text-rose-600 dark:text-rose-400",
    riskLevel: "High risk, high reward",
    simpleAllocation: "Put 5-15% here",
    description: "Invest in new businesses that could be the next big thing",
    learnedIn: [2000, 2025],
  },
  {
    id: "crypto",
    name: "Crypto 🪙",
    icon: Bitcoin,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    textColor: "text-orange-600 dark:text-orange-400",
    riskLevel: "Very risky!",
    simpleAllocation: "Only 0-5%!",
    description: "Bitcoin, Ethereum - digital money (be careful!)",
    learnedIn: [2025],
  },
];

// ============================================================================
// SMART STRATEGIES - What Rich Families Do
// ============================================================================

export interface Strategy {
  id: string;
  name: string;
  icon: typeof Rocket;
  description: string;
  learnedIn: number[];
  pillar: "create" | "preserve" | "transfer";
}

export const strategies: Strategy[] = [
  {
    id: "entrepreneurship",
    name: "Start Something",
    icon: Rocket,
    description: "Build a business, create something valuable",
    learnedIn: [2000, 2025],
    pillar: "create",
  },
  {
    id: "innovation-investing",
    name: "Bet on the Future",
    icon: Lightbulb,
    description: "Invest in new tech before everyone else",
    learnedIn: [2000, 2025],
    pillar: "create",
  },
  {
    id: "diversification",
    name: "Don't Put All Eggs in One Basket",
    icon: BarChart3,
    description: "Spread your money across different things",
    learnedIn: [1990, 1997],
    pillar: "preserve",
  },
  {
    id: "risk-management",
    name: "Know What Can Go Wrong",
    icon: Shield,
    description: "Always have a backup plan",
    learnedIn: [2008, 2020],
    pillar: "preserve",
  },
  {
    id: "long-term-thinking",
    name: "Think in Decades, Not Days",
    icon: Clock,
    description: "Patient money wins - don't panic!",
    learnedIn: [1990, 2020, 2025],
    pillar: "transfer",
  },
  {
    id: "crisis-opportunity",
    name: "Buy When Others Panic",
    icon: TrendingDown,
    description: "Market crashes = sales on great investments",
    learnedIn: [2008, 2020],
    pillar: "preserve",
  },
];

// ============================================================================
// INNOVATION CYCLES - Tech Disruption Waves
// ============================================================================

export interface InnovationCycle {
  id: string;
  year: number;
  name: string;
  type: string;
  icon: typeof Globe;
  lesson: string;
  opportunity: string;
}

export const innovationCycles: InnovationCycle[] = [
  {
    id: "japan-bubble",
    year: 1990,
    name: "Japan Tech Bubble",
    type: "Bubble Burst",
    icon: TrendingDown,
    lesson: "Technology hype can exceed reality",
    opportunity: "Buy quality tech after crash",
  },
  {
    id: "dotcom",
    year: 2000,
    name: "Dot-com Revolution",
    type: "Tech Wave",
    icon: Globe,
    lesson: "Internet changes everything",
    opportunity: "Platform businesses win",
  },
  {
    id: "mobile",
    year: 2008,
    name: "Mobile & Social",
    type: "Tech Wave",
    icon: Brain,
    lesson: "Mobile-first disrupts incumbents",
    opportunity: "App economy creates billionaires",
  },
  {
    id: "ai",
    year: 2025,
    name: "AI Revolution",
    type: "Current Wave",
    icon: Cpu,
    lesson: "AI amplifies human capability",
    opportunity: "Build AI-native businesses",
  },
];

// ============================================================================
// MASTERY LEVELS - Player progression titles
// ============================================================================

export interface MasteryLevel {
  name: string;
  minMissions: number;
  icon: string;
  color: string;
}

export const masteryLevels: MasteryLevel[] = [
  { name: "Rookie Investor", minMissions: 0, icon: "🎯", color: "text-gray-500" },
  { name: "Market Explorer", minMissions: 2, icon: "✨", color: "text-emerald-500" },
  { name: "Rising Trader", minMissions: 4, icon: "⚡", color: "text-blue-500" },
  { name: "Smart Investor", minMissions: 5, icon: "⭐", color: "text-purple-500" },
  { name: "Market Mover", minMissions: 6, icon: "🏆", color: "text-amber-500" },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getMasteryLevel(completedCount: number): MasteryLevel {
  return masteryLevels.reduce((best, level) => 
    completedCount >= level.minMissions ? level : best, 
    masteryLevels[0]
  );
}

export function getNextMasteryLevel(completedCount: number): MasteryLevel | undefined {
  return masteryLevels.find(l => l.minMissions > completedCount);
}

export function getPillarMastery(pillar: WealthPillar, completedMissions: number[]) {
  const learnedCount = pillar.learnedIn.filter(year => 
    completedMissions.includes(year)
  ).length;
  return {
    learned: learnedCount,
    total: pillar.learnedIn.length,
    percentage: Math.round((learnedCount / pillar.learnedIn.length) * 100),
    isUnlocked: learnedCount > 0,
  };
}

export function getAssetMastery(asset: AssetClass, completedMissions: number[]) {
  const learnedCount = asset.learnedIn.filter(year => 
    completedMissions.includes(year)
  ).length;
  return {
    learned: learnedCount,
    total: asset.learnedIn.length,
    percentage: Math.round((learnedCount / asset.learnedIn.length) * 100),
    isUnlocked: learnedCount > 0,
  };
}

export function getStrategyMastery(strategy: Strategy, completedMissions: number[]) {
  const learnedCount = strategy.learnedIn.filter(year => 
    completedMissions.includes(year)
  ).length;
  return {
    learned: learnedCount,
    total: strategy.learnedIn.length,
    isUnlocked: learnedCount > 0,
  };
}

export function calculateOverallProgress(completedMissions: number[]): number {
  const totalProgress = wealthPillars.reduce(
    (sum, p) => sum + getPillarMastery(p, completedMissions).percentage, 
    0
  );
  return Math.round(totalProgress / wealthPillars.length);
}
