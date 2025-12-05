/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   📚 WISDOM LEARNED - Comprehensive Learning Progress Dashboard              ║
 * ║   Tracks and visualizes all wisdom gained through gameplay                   ║
 * ║   FO Principle: "Knowledge compounds faster than money"                      ║
 * ║   Copyright (c) 2025 NUVC.AI. All Rights Reserved.                          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  BookOpen,
  Lightbulb,
  TrendingUp,
  Shield,
  Users,
  Rocket,
  Crown,
  CheckCircle2,
  Lock,
  Sparkles,
  Target,
  Award,
  ChevronRight,
  BarChart3,
  Clock,
  Zap,
  GraduationCap,
} from "lucide-react";
import {
  wealthPillars,
  assetClasses,
  strategies,
  innovationCycles,
  getPillarMastery,
  getAssetMastery,
  getStrategyMastery,
  calculateOverallProgress,
  type WealthPillar,
  type AssetClass,
  type Strategy,
} from "@/components/data/chapters";

// ============================================================================
// WISDOM INSIGHTS - Specific lessons from each era
// ============================================================================

export interface WisdomInsight {
  year: number;
  eraName: string;
  emoji: string;
  keyLessons: string[];
  foWisdom: string;
  investingPrinciple: string;
  realWorldApplication: string;
}

export const wisdomInsights: WisdomInsight[] = [
  {
    year: 1990,
    eraName: "Japan Bubble Crash",
    emoji: "🗾",
    keyLessons: [
      "Markets can stay irrational longer than you can stay solvent",
      "Never invest money you can't afford to lose",
      "Diversification across countries protects wealth",
    ],
    foWisdom: "The Rothschilds survived 250 years by never concentrating wealth in one country or asset.",
    investingPrinciple: "Geographic diversification",
    realWorldApplication: "Keep investments across multiple countries and economies",
  },
  {
    year: 1997,
    eraName: "Asian Financial Crisis",
    emoji: "🌏",
    keyLessons: [
      "Currency risk can destroy returns",
      "Debt-fueled growth is fragile",
      "Regional contagion spreads fast",
    ],
    foWisdom: "Smart families held gold and USD during the crisis - safe havens matter.",
    investingPrinciple: "Currency hedging & safe havens",
    realWorldApplication: "Hold some assets in stable currencies and commodities",
  },
  {
    year: 2000,
    eraName: "Dot-com Bubble",
    emoji: "💻",
    keyLessons: [
      "Distinguish between hype and real value",
      "Profitable business models matter",
      "Revolutionary tech doesn't mean revolutionary stock",
    ],
    foWisdom: "FOs invested in infrastructure (Cisco) not just startups. Be the shovel seller in a gold rush.",
    investingPrinciple: "Value fundamentals over hype",
    realWorldApplication: "Look for real revenue and profits, not just exciting stories",
  },
  {
    year: 2008,
    eraName: "Global Financial Crisis",
    emoji: "🏦",
    keyLessons: [
      "Be greedy when others are fearful",
      "Cash is king during crashes",
      "Quality companies survive and thrive",
    ],
    foWisdom: "Warren Buffett was buying Goldman Sachs while others panicked. Crisis = Opportunity.",
    investingPrinciple: "Counter-cyclical investing",
    realWorldApplication: "Keep cash reserves to buy great assets when everyone else is selling",
  },
  {
    year: 2020,
    eraName: "COVID Crash & Recovery",
    emoji: "😷",
    keyLessons: [
      "Accelerated trends create winners",
      "Fastest crash = fastest recovery (sometimes)",
      "Digital transformation is permanent",
    ],
    foWisdom: "The crisis accelerated digital adoption by 10 years. FOs pivoted to tech immediately.",
    investingPrinciple: "Identify accelerating trends",
    realWorldApplication: "Ask 'what does this crisis accelerate?' not just 'when will it end?'",
  },
  {
    year: 2025,
    eraName: "AI Revolution",
    emoji: "🤖",
    keyLessons: [
      "AI amplifies human capabilities",
      "Infrastructure plays are safer bets",
      "The real opportunity is in applications",
    ],
    foWisdom: "Smart money is in NVIDIA and cloud providers - the infrastructure of AI.",
    investingPrinciple: "Platform & infrastructure investing",
    realWorldApplication: "Invest in the tools everyone needs, not just the flashy applications",
  },
];

// ============================================================================
// WISDOM STATS INTERFACE
// ============================================================================

export interface WisdomStats {
  // Overall Progress
  overallProgress: number;
  totalLessonsUnlocked: number;
  totalLessonsAvailable: number;
  
  // Pillar Stats
  pillarsUnlocked: number;
  pillarsTotal: number;
  pillarMasteryDetails: Array<{
    pillar: WealthPillar;
    mastery: ReturnType<typeof getPillarMastery>;
  }>;
  
  // Asset Class Stats
  assetsUnlocked: number;
  assetsTotal: number;
  assetMasteryDetails: Array<{
    asset: AssetClass;
    mastery: ReturnType<typeof getAssetMastery>;
  }>;
  
  // Strategy Stats
  strategiesUnlocked: number;
  strategiesTotal: number;
  strategyMasteryDetails: Array<{
    strategy: Strategy;
    mastery: ReturnType<typeof getStrategyMastery>;
  }>;
  
  // Era/Innovation Stats
  erasCompleted: number;
  erasTotal: number;
  completedEras: typeof innovationCycles;
  
  // Insights Unlocked
  insightsUnlocked: WisdomInsight[];
  
  // Performance Metrics
  wisdomScore: number;
  learningVelocity: string;
  strongestArea: string;
  nextMilestone: string;
}

// ============================================================================
// CALCULATE WISDOM STATS
// ============================================================================

export function calculateWisdomStats(completedMissions: number[]): WisdomStats {
  // Pillar calculations
  const pillarMasteryDetails = wealthPillars.map(pillar => ({
    pillar,
    mastery: getPillarMastery(pillar, completedMissions),
  }));
  const pillarsUnlocked = pillarMasteryDetails.filter(p => p.mastery.isUnlocked).length;
  
  // Asset calculations
  const assetMasteryDetails = assetClasses.map(asset => ({
    asset,
    mastery: getAssetMastery(asset, completedMissions),
  }));
  const assetsUnlocked = assetMasteryDetails.filter(a => a.mastery.isUnlocked).length;
  
  // Strategy calculations
  const strategyMasteryDetails = strategies.map(strategy => ({
    strategy,
    mastery: getStrategyMastery(strategy, completedMissions),
  }));
  const strategiesUnlocked = strategyMasteryDetails.filter(s => s.mastery.isUnlocked).length;
  
  // Era calculations
  const completedEras = innovationCycles.filter(c => completedMissions.includes(c.year));
  
  // Insights unlocked
  const insightsUnlocked = wisdomInsights.filter(i => completedMissions.includes(i.year));
  
  // Total lessons calculation
  const totalLessonsAvailable = 
    wealthPillars.reduce((sum, p) => sum + p.learnedIn.length, 0) +
    assetClasses.reduce((sum, a) => sum + a.learnedIn.length, 0) +
    strategies.reduce((sum, s) => sum + s.learnedIn.length, 0);
  
  const totalLessonsUnlocked = 
    pillarMasteryDetails.reduce((sum, p) => sum + p.mastery.learned, 0) +
    assetMasteryDetails.reduce((sum, a) => sum + a.mastery.learned, 0) +
    strategyMasteryDetails.reduce((sum, s) => sum + s.mastery.learned, 0);
  
  // Overall progress
  const overallProgress = calculateOverallProgress(completedMissions);
  
  // Wisdom Score (0-1000)
  const wisdomScore = Math.round(
    (overallProgress * 3) + // Base progress (0-300)
    (completedMissions.length * 100) + // Missions (0-600)
    (strategiesUnlocked * 15) + // Strategies bonus
    (assetsUnlocked * 10) // Assets bonus
  );
  
  // Learning velocity based on missions
  const learningVelocity = 
    completedMissions.length >= 5 ? "🚀 Exceptional" :
    completedMissions.length >= 3 ? "⚡ Accelerated" :
    completedMissions.length >= 1 ? "📈 Growing" : "🌱 Starting";
  
  // Strongest area
  const pillarAvg = pillarMasteryDetails.reduce((sum, p) => sum + p.mastery.percentage, 0) / wealthPillars.length;
  const assetAvg = assetMasteryDetails.reduce((sum, a) => sum + a.mastery.percentage, 0) / assetClasses.length;
  const strategyAvg = strategyMasteryDetails.reduce((sum, s) => sum + (s.mastery.isUnlocked ? 100 : 0), 0) / strategies.length;
  
  const strongestArea = 
    pillarAvg >= assetAvg && pillarAvg >= strategyAvg ? "Wealth Pillars" :
    assetAvg >= strategyAvg ? "Asset Classes" : "Investment Strategies";
  
  // Next milestone
  const nextMilestone = 
    completedMissions.length === 0 ? "Complete your first mission!" :
    pillarsUnlocked < 3 ? `Unlock all 3 Wealth Pillars (${pillarsUnlocked}/3)` :
    strategiesUnlocked < 6 ? `Master all strategies (${strategiesUnlocked}/6)` :
    assetsUnlocked < 6 ? `Explore all asset classes (${assetsUnlocked}/6)` :
    "🏆 You're a Wealth Guardian!";
  
  return {
    overallProgress,
    totalLessonsUnlocked,
    totalLessonsAvailable,
    pillarsUnlocked,
    pillarsTotal: wealthPillars.length,
    pillarMasteryDetails,
    assetsUnlocked,
    assetsTotal: assetClasses.length,
    assetMasteryDetails,
    strategiesUnlocked,
    strategiesTotal: strategies.length,
    strategyMasteryDetails,
    erasCompleted: completedEras.length,
    erasTotal: innovationCycles.length,
    completedEras,
    insightsUnlocked,
    wisdomScore,
    learningVelocity,
    strongestArea,
    nextMilestone,
  };
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface WisdomLearnedProps {
  completedMissions: number[];
  compact?: boolean;
  showInsights?: boolean;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function WisdomLearned({ 
  completedMissions, 
  compact = false,
  showInsights = true,
}: WisdomLearnedProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "pillars" | "assets" | "strategies" | "insights">("overview");
  
  const stats = useMemo(() => calculateWisdomStats(completedMissions), [completedMissions]);
  
  // Compact version for sidebar/cards
  if (compact) {
    return (
      <Card className="bg-gradient-to-br from-[#9898f2]/10 via-purple-500/5 to-transparent border border-[#9898f2]/30 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#9898f2] to-purple-600">
              <Brain className="h-4 w-4 text-white" />
            </div>
            Wisdom Learned
            <Sparkles className="h-4 w-4 text-[#9898f2]" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Wisdom Score */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-amber-200/80">Wisdom Score</span>
              <Badge className="bg-amber-500/30 text-amber-200 border-0">
                {stats.learningVelocity}
              </Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-300">{stats.wisdomScore}</span>
              <span className="text-amber-400/60 text-sm">/ 1000</span>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2">
            <StatMini 
              icon={<Crown className="h-3.5 w-3.5" />}
              label="Pillars"
              value={`${stats.pillarsUnlocked}/${stats.pillarsTotal}`}
              color="text-amber-400"
            />
            <StatMini 
              icon={<BarChart3 className="h-3.5 w-3.5" />}
              label="Assets"
              value={`${stats.assetsUnlocked}/${stats.assetsTotal}`}
              color="text-emerald-400"
            />
            <StatMini 
              icon={<Target className="h-3.5 w-3.5" />}
              label="Strategies"
              value={`${stats.strategiesUnlocked}/${stats.strategiesTotal}`}
              color="text-violet-400"
            />
          </div>
          
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white/60">Overall Progress</span>
              <span className="text-[#9898f2] font-bold">{stats.overallProgress}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#9898f2] to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${stats.overallProgress}%` }}
              />
            </div>
          </div>
          
          {/* Next Milestone */}
          <div className="flex items-center gap-2 text-xs text-white/50">
            <Zap className="h-3 w-3 text-amber-400" />
            <span>Next: {stats.nextMilestone}</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Full version
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#9898f2]/20 via-purple-500/10 to-transparent border border-[#9898f2]/30">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Wisdom Score Display */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#9898f2] to-purple-600 rounded-2xl blur-lg opacity-50" />
            <div className="relative w-28 h-28 rounded-2xl bg-gradient-to-br from-[#9898f2] to-purple-600 flex flex-col items-center justify-center shadow-2xl">
              <span className="text-3xl font-black text-white">{stats.wisdomScore}</span>
              <span className="text-xs text-white/70">Wisdom Score</span>
            </div>
            <div className="absolute -bottom-2 -right-2 px-2 py-1 rounded-lg bg-amber-500 text-xs font-bold text-white shadow-lg">
              {stats.learningVelocity}
            </div>
          </div>
          
          {/* Stats Summary */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 flex items-center gap-2 justify-center sm:justify-start">
              <Brain className="h-7 w-7 text-[#9898f2]" />
              Wisdom Learned
            </h1>
            <p className="text-white/60 text-sm mb-4">
              Your journey through financial history has unlocked valuable insights
            </p>
            
            {/* Progress Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard 
                icon={<Crown className="h-5 w-5 text-amber-400" />}
                label="Pillars"
                value={stats.pillarsUnlocked}
                total={stats.pillarsTotal}
                color="amber"
              />
              <StatCard 
                icon={<BarChart3 className="h-5 w-5 text-emerald-400" />}
                label="Assets"
                value={stats.assetsUnlocked}
                total={stats.assetsTotal}
                color="emerald"
              />
              <StatCard 
                icon={<Target className="h-5 w-5 text-violet-400" />}
                label="Strategies"
                value={stats.strategiesUnlocked}
                total={stats.strategiesTotal}
                color="violet"
              />
              <StatCard 
                icon={<Clock className="h-5 w-5 text-blue-400" />}
                label="Eras"
                value={stats.erasCompleted}
                total={stats.erasTotal}
                color="blue"
              />
            </div>
          </div>
        </div>
        
        {/* Overall Progress */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/70">Total Lessons Learned</span>
            <span className="text-[#9898f2] font-bold">{stats.totalLessonsUnlocked} / {stats.totalLessonsAvailable}</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#9898f2] via-purple-500 to-violet-500 rounded-full transition-all duration-700 relative"
              style={{ width: `${(stats.totalLessonsUnlocked / stats.totalLessonsAvailable) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-shimmer" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex gap-1 p-1.5 rounded-xl bg-white/5 border border-white/10 overflow-x-auto">
        {[
          { id: "overview" as const, label: "Overview", icon: <BookOpen className="h-4 w-4" /> },
          { id: "pillars" as const, label: "Pillars", icon: <Crown className="h-4 w-4" /> },
          { id: "assets" as const, label: "Assets", icon: <BarChart3 className="h-4 w-4" /> },
          { id: "strategies" as const, label: "Strategies", icon: <Target className="h-4 w-4" /> },
          ...(showInsights ? [{ id: "insights" as const, label: "Insights", icon: <Lightbulb className="h-4 w-4" /> }] : []),
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-fit px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === tab.id
                ? "bg-[#9898f2]/20 text-[#b8b8ff] border border-[#9898f2]/40"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === "overview" && (
          <OverviewTab stats={stats} />
        )}
        {activeTab === "pillars" && (
          <PillarsTab details={stats.pillarMasteryDetails} />
        )}
        {activeTab === "assets" && (
          <AssetsTab details={stats.assetMasteryDetails} />
        )}
        {activeTab === "strategies" && (
          <StrategiesTab details={stats.strategyMasteryDetails} />
        )}
        {activeTab === "insights" && showInsights && (
          <InsightsTab insights={stats.insightsUnlocked} allInsights={wisdomInsights} />
        )}
      </div>
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function StatMini({ icon, label, value, color }: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
  color: string;
}) {
  return (
    <div className="p-2 rounded-lg bg-white/5 text-center">
      <div className={`${color} mb-1 flex justify-center`}>{icon}</div>
      <div className="text-white font-bold text-sm">{value}</div>
      <div className="text-white/40 text-[10px]">{label}</div>
    </div>
  );
}

function StatCard({ icon, label, value, total, color }: {
  icon: React.ReactNode;
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const percentage = Math.round((value / total) * 100);
  return (
    <div className={`p-3 rounded-xl bg-${color}-500/10 border border-${color}-500/30`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-white/70 text-xs">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-black text-${color}-400`}>{value}</span>
        <span className="text-white/40 text-sm">/ {total}</span>
      </div>
      <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-${color}-400 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function OverviewTab({ stats }: { stats: WisdomStats }) {
  return (
    <div className="space-y-4">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white/[0.03] border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Award className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-white/50 text-xs">Strongest Area</p>
                <p className="text-white font-bold">{stats.strongestArea}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/[0.03] border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-white/50 text-xs">Learning Velocity</p>
                <p className="text-white font-bold">{stats.learningVelocity}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/[0.03] border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-500/20">
                <GraduationCap className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <p className="text-white/50 text-xs">Lessons Unlocked</p>
                <p className="text-white font-bold">{stats.totalLessonsUnlocked} / {stats.totalLessonsAvailable}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Next Milestone */}
      <Card className="bg-gradient-to-r from-[#9898f2]/10 to-purple-500/5 border-[#9898f2]/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#9898f2]/20">
              <Zap className="h-6 w-6 text-[#9898f2]" />
            </div>
            <div className="flex-1">
              <p className="text-white/50 text-xs">Next Milestone</p>
              <p className="text-white font-bold">{stats.nextMilestone}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-white/30" />
          </div>
        </CardContent>
      </Card>
      
      {/* Completed Eras */}
      <Card className="bg-white/[0.03] border-white/10">
        <CardContent className="p-4">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-400" />
            Historical Eras Experienced
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {innovationCycles.map((cycle) => {
              const isCompleted = stats.completedEras.some(c => c.id === cycle.id);
              return (
                <div 
                  key={cycle.id}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isCompleted
                      ? "bg-emerald-500/10 border-emerald-500/40"
                      : "bg-white/5 border-white/10 opacity-50"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
                  ) : (
                    <Lock className="h-4 w-4 text-white/30 mx-auto mb-1" />
                  )}
                  <p className={`text-xs font-bold ${isCompleted ? "text-emerald-300" : "text-white/40"}`}>
                    {cycle.year}
                  </p>
                  <p className="text-[10px] text-white/40 truncate">{cycle.name}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PillarsTab({ details }: { details: WisdomStats["pillarMasteryDetails"] }) {
  const pillarIcons: Record<string, React.ReactNode> = {
    create: <Rocket className="h-5 w-5" />,
    preserve: <Shield className="h-5 w-5" />,
    transfer: <Users className="h-5 w-5" />,
  };
  
  return (
    <div className="space-y-4">
      {details.map(({ pillar, mastery }) => (
        <Card 
          key={pillar.id}
          className={`overflow-hidden ${
            mastery.isUnlocked 
              ? `bg-gradient-to-br ${pillar.bgColor} border-${pillar.borderColor.replace('border-', '')}` 
              : "bg-white/[0.03] border-white/10 opacity-60"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${pillar.color} shadow-lg`}>
                {pillarIcons[pillar.id]}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-bold ${mastery.isUnlocked ? pillar.textColor : "text-white/50"}`}>
                    {pillar.name}
                  </h3>
                  {mastery.isUnlocked && (
                    <Badge className={`${pillar.bgColor} ${pillar.textColor} border-0`}>
                      {mastery.percentage}%
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-white/60 mb-3">{pillar.description}</p>
                
                {/* Progress */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/50">Mastery Progress</span>
                    <span className={pillar.textColor}>{mastery.learned}/{mastery.total} lessons</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${pillar.color} rounded-full`}
                      style={{ width: `${mastery.percentage}%` }}
                    />
                  </div>
                </div>
                
                {/* Strategies */}
                <div className="flex flex-wrap gap-1.5">
                  {pillar.strategies.map((strategy) => (
                    <span 
                      key={strategy}
                      className="text-[10px] px-2 py-1 rounded-full bg-white/10 text-white/70 border border-white/10"
                    >
                      {strategy}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AssetsTab({ details }: { details: WisdomStats["assetMasteryDetails"] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {details.map(({ asset, mastery }) => (
        <Card 
          key={asset.id}
          className={`overflow-hidden ${
            mastery.isUnlocked 
              ? `${asset.bgColor} ${asset.borderColor}` 
              : "bg-white/[0.03] border-white/10 opacity-60"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${asset.color} shadow-lg`}>
                <asset.icon className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`font-bold ${mastery.isUnlocked ? asset.textColor : "text-white/50"}`}>
                    {asset.name}
                  </h4>
                  {mastery.isUnlocked && mastery.percentage === 100 && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  )}
                </div>
                <p className="text-xs text-white/50 mb-2">{asset.description}</p>
                
                {mastery.isUnlocked ? (
                  <>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                      <div 
                        className={`h-full bg-gradient-to-r ${asset.color} rounded-full`}
                        style={{ width: `${mastery.percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-white/40">{asset.simpleAllocation}</span>
                      <Badge className={`${asset.bgColor} ${asset.textColor} border-0 text-[9px] px-1.5 py-0`}>
                        {asset.riskLevel}
                      </Badge>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-1.5 text-[10px] text-white/40">
                    <Lock className="h-3 w-3" />
                    <span>Complete missions to unlock</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StrategiesTab({ details }: { details: WisdomStats["strategyMasteryDetails"] }) {
  // Group by pillar
  const groupedStrategies = {
    create: details.filter(d => d.strategy.pillar === "create"),
    preserve: details.filter(d => d.strategy.pillar === "preserve"),
    transfer: details.filter(d => d.strategy.pillar === "transfer"),
  };
  
  const pillarInfo = {
    create: { name: "Make Money 💰", color: "from-amber-500 to-orange-500", textColor: "text-amber-400" },
    preserve: { name: "Keep Money 🛡️", color: "from-emerald-500 to-teal-500", textColor: "text-emerald-400" },
    transfer: { name: "Pass It On 🎓", color: "from-violet-500 to-purple-500", textColor: "text-violet-400" },
  };
  
  return (
    <div className="space-y-6">
      {(Object.keys(groupedStrategies) as Array<keyof typeof groupedStrategies>).map((pillarId) => {
        const strategyGroup = groupedStrategies[pillarId];
        const info = pillarInfo[pillarId];
        
        return (
          <div key={pillarId}>
            <h3 className={`text-sm font-bold mb-3 flex items-center gap-2 ${info.textColor}`}>
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${info.color}`} />
              {info.name}
            </h3>
            <div className="space-y-2">
              {strategyGroup.map(({ strategy, mastery }) => (
                <Card 
                  key={strategy.id}
                  className={`overflow-hidden ${
                    mastery.isUnlocked 
                      ? "bg-white/[0.05] border-white/20" 
                      : "bg-white/[0.02] border-white/10 opacity-50"
                  }`}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        mastery.isUnlocked 
                          ? `bg-gradient-to-br ${info.color}` 
                          : "bg-white/10"
                      }`}>
                        <strategy.icon className={`h-4 w-4 ${mastery.isUnlocked ? "text-white" : "text-white/40"}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold text-sm ${mastery.isUnlocked ? "text-white" : "text-white/50"}`}>
                          {strategy.name}
                        </h4>
                        <p className="text-xs text-white/40">{strategy.description}</p>
                      </div>
                      {mastery.isUnlocked ? (
                        <div className="flex items-center gap-1 px-2 py-1 rounded bg-white/10 border border-white/20">
                          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                          <span className="text-[10px] font-medium text-white/70">
                            {mastery.learned}/{mastery.total}
                          </span>
                        </div>
                      ) : (
                        <Lock className="h-4 w-4 text-white/30" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function InsightsTab({ insights, allInsights }: { insights: WisdomInsight[]; allInsights: WisdomInsight[] }) {
  return (
    <div className="space-y-4">
      {allInsights.map((insight) => {
        const isUnlocked = insights.some(i => i.year === insight.year);
        
        return (
          <Card 
            key={insight.year}
            className={`overflow-hidden ${
              isUnlocked 
                ? "bg-gradient-to-br from-[#9898f2]/10 to-purple-500/5 border-[#9898f2]/30" 
                : "bg-white/[0.02] border-white/10 opacity-40"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${
                  isUnlocked 
                    ? "bg-[#9898f2]/20" 
                    : "bg-white/10"
                }`}>
                  <span className="text-2xl">{insight.emoji}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className={`font-bold ${isUnlocked ? "text-white" : "text-white/50"}`}>
                        {insight.year} - {insight.eraName}
                      </h3>
                      {isUnlocked && (
                        <Badge className="bg-[#9898f2]/20 text-[#9898f2] border-0 mt-1">
                          {insight.investingPrinciple}
                        </Badge>
                      )}
                    </div>
                    {!isUnlocked && (
                      <Lock className="h-5 w-5 text-white/30" />
                    )}
                  </div>
                  
                  {isUnlocked ? (
                    <>
                      {/* Key Lessons */}
                      <div className="space-y-1 mb-3">
                        {insight.keyLessons.map((lesson, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-white/70">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span>{lesson}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* FO Wisdom */}
                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <p className="text-xs text-amber-300/70 uppercase tracking-wider mb-1">Family Office Wisdom</p>
                        <p className="text-sm text-amber-200/80">{insight.foWisdom}</p>
                      </div>
                      
                      {/* Real World Application */}
                      <div className="mt-3 flex items-center gap-2 text-xs text-white/50">
                        <Lightbulb className="h-3 w-3 text-[#9898f2]" />
                        <span><strong className="text-white/70">Apply it:</strong> {insight.realWorldApplication}</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-white/40">Complete this era&apos;s mission to unlock insights</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default WisdomLearned;
