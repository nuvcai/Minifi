/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   🎯 INVESTOR JOURNEY - Narrative Badge Progression System                   ║
 * ║   Transforms badges into a story of growth and mastery                       ║
 * ║   FO Principle: "Wealth is built through consistent, intentional growth"     ║
 * ║   Copyright (c) 2025 NUVC.AI. All Rights Reserved.                          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Trophy,
  Star,
  Lock,
  ChevronRight,
  Sparkles,
  Shield,
  Target,
  Award,
  TrendingUp,
  Brain,
  Crown,
  GraduationCap,
} from "lucide-react";

// Investor Journey Stages
export interface JourneyStage {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  requirements: {
    missionsCompleted?: number;
    totalXp?: number;
    badgesEarned?: number;
    assetClassesExplored?: number;
    coachesUsed?: number;
    quizScore?: number;
  };
  rewards: {
    title: string;
    xpBonus: number;
    unlocks: string[];
  };
  narrative: string;
  foWisdom: string;
}

export const journeyStages: JourneyStage[] = [
  {
    id: "curious-beginner",
    title: "Curious Beginner",
    subtitle: "Taking the First Step",
    description: "You've entered the world of investing! Every expert was once a beginner.",
    icon: <Star className="h-6 w-6" />,
    color: "text-slate-400",
    bgGradient: "from-slate-500/20 to-slate-600/20",
    requirements: {
      missionsCompleted: 0,
      totalXp: 0,
    },
    rewards: {
      title: "Welcome Bonus",
      xpBonus: 50,
      unlocks: ["Access to first 3 missions", "Choose your first coach"],
    },
    narrative: "Your journey begins here. Like Warren Buffett who bought his first stock at 11, you're starting young and smart.",
    foWisdom: "Family Offices start somewhere too. The Rothschilds began as one family with a dream. Today marks the start of YOUR legacy.",
  },
  {
    id: "knowledge-seeker",
    title: "Knowledge Seeker",
    subtitle: "Learning from History",
    description: "You're actively learning from past market events and understanding patterns.",
    icon: <Brain className="h-6 w-6" />,
    color: "text-blue-400",
    bgGradient: "from-blue-500/20 to-indigo-500/20",
    requirements: {
      missionsCompleted: 2,
      totalXp: 300,
    },
    rewards: {
      title: "Scholar's Bonus",
      xpBonus: 100,
      unlocks: ["Advanced mission content", "Risk analysis tools", "Quiz challenges"],
    },
    narrative: "You now understand that history doesn't repeat, but it rhymes. Each mission teaches patterns that reappear.",
    foWisdom: "The Yale Endowment's success comes from studying centuries of market history. You're following their path of continuous learning.",
  },
  {
    id: "risk-explorer",
    title: "Risk Explorer",
    subtitle: "Understanding Risk & Reward",
    description: "You've explored different risk levels and understand the risk-return relationship.",
    icon: <Target className="h-6 w-6" />,
    color: "text-amber-400",
    bgGradient: "from-amber-500/20 to-orange-500/20",
    requirements: {
      missionsCompleted: 3,
      totalXp: 600,
      assetClassesExplored: 3,
    },
    rewards: {
      title: "Explorer's Bonus",
      xpBonus: 150,
      unlocks: ["High-risk investments", "What-If analysis", "Portfolio comparison"],
    },
    narrative: "You've learned that risk isn't just about danger—it's about opportunity. The key is understanding and managing it.",
    foWisdom: "Ray Dalio built Bridgewater by deeply understanding risk. He says: 'He who lives by the crystal ball will eat shattered glass.'",
  },
  {
    id: "strategy-builder",
    title: "Strategy Builder",
    subtitle: "Crafting Your Approach",
    description: "You're developing your own investment philosophy by learning from multiple coaches.",
    icon: <Shield className="h-6 w-6" />,
    color: "text-emerald-400",
    bgGradient: "from-emerald-500/20 to-teal-500/20",
    requirements: {
      missionsCompleted: 4,
      totalXp: 1000,
      coachesUsed: 3,
    },
    rewards: {
      title: "Strategist's Bonus",
      xpBonus: 200,
      unlocks: ["Investment thesis feature", "Coach philosophy comparison", "Strategy templates"],
    },
    narrative: "Different situations call for different approaches. You're learning to adapt like the best portfolio managers.",
    foWisdom: "Family Offices don't blindly follow one guru. They synthesize wisdom from many sources into their own unique approach.",
  },
  {
    id: "market-navigator",
    title: "Market Navigator",
    subtitle: "Navigating Market Cycles",
    description: "You've experienced multiple market conditions and understand how to navigate them.",
    icon: <TrendingUp className="h-6 w-6" />,
    color: "text-violet-400",
    bgGradient: "from-violet-500/20 to-purple-500/20",
    requirements: {
      missionsCompleted: 5,
      totalXp: 1500,
      badgesEarned: 8,
    },
    rewards: {
      title: "Navigator's Bonus",
      xpBonus: 300,
      unlocks: ["Competition mode access", "Live trading simulation", "Leaderboard ranking"],
    },
    narrative: "Bulls and bears don't scare you anymore. You've learned to find opportunity in every market condition.",
    foWisdom: "The Vanderbilts, Rockefellers, and Gates all navigated major market shifts. You're developing the same resilience.",
  },
  {
    id: "fo-apprentice",
    title: "Family Office Apprentice",
    subtitle: "Thinking Generationally",
    description: "You've mastered all historical missions and understand generational wealth principles.",
    icon: <Award className="h-6 w-6" />,
    color: "text-amber-300",
    bgGradient: "from-amber-400/20 to-yellow-500/20",
    requirements: {
      missionsCompleted: 6,
      totalXp: 2500,
      badgesEarned: 12,
      assetClassesExplored: 5,
    },
    rewards: {
      title: "Apprentice Graduation Bonus",
      xpBonus: 500,
      unlocks: ["Advanced strategies", "FO case studies", "Mentor mode preview"],
    },
    narrative: "You now think beyond quick gains. You understand wealth building across decades—the true Family Office mindset.",
    foWisdom: "Congratulations! You've learned what most adults never do: that real wealth is built through patience, knowledge, and discipline.",
  },
  {
    id: "wealth-guardian",
    title: "Wealth Guardian",
    subtitle: "Ready to Build Legacies",
    description: "You've achieved mastery. Now you're ready to teach others and build real wealth.",
    icon: <Crown className="h-6 w-6" />,
    color: "text-amber-200",
    bgGradient: "from-amber-300/20 to-orange-400/20",
    requirements: {
      missionsCompleted: 6,
      totalXp: 5000,
      badgesEarned: 15,
      assetClassesExplored: 6,
      coachesUsed: 4,
      quizScore: 80,
    },
    rewards: {
      title: "Guardian's Crown",
      xpBonus: 1000,
      unlocks: ["Mentor mode (teach new players)", "Special badges", "Early access to new features"],
    },
    narrative: "You've completed the journey from curious beginner to Wealth Guardian. The real journey of building actual wealth begins now.",
    foWisdom: "The greatest families don't just build wealth—they become stewards of it. You're ready to start YOUR legacy.",
  },
];

interface InvestorJourneyProps {
  stats: {
    missionsCompleted: number;
    totalXp: number;
    badgesEarned: number;
    assetClassesExplored: number;
    coachesUsed: number;
    quizScore?: number;
  };
  claimedStages?: string[];
  onStageRewardClaim?: (stage: JourneyStage) => void;
  onClaimStage?: (stageId: string) => void;
  compact?: boolean;
}

// Check if a stage is completed
const isStageCompleted = (stage: JourneyStage, stats: InvestorJourneyProps['stats']): boolean => {
  const req = stage.requirements;
  return (
    (!req.missionsCompleted || stats.missionsCompleted >= req.missionsCompleted) &&
    (!req.totalXp || stats.totalXp >= req.totalXp) &&
    (!req.badgesEarned || stats.badgesEarned >= req.badgesEarned) &&
    (!req.assetClassesExplored || stats.assetClassesExplored >= req.assetClassesExplored) &&
    (!req.coachesUsed || stats.coachesUsed >= req.coachesUsed) &&
    (!req.quizScore || (stats.quizScore !== undefined && stats.quizScore >= req.quizScore))
  );
};

// Calculate progress towards a stage
const getStageProgress = (stage: JourneyStage, stats: InvestorJourneyProps['stats']): number => {
  const req = stage.requirements;
  let totalReqs = 0;
  let completedReqs = 0;
  
  if (req.missionsCompleted) {
    totalReqs++;
    completedReqs += Math.min(stats.missionsCompleted / req.missionsCompleted, 1);
  }
  if (req.totalXp) {
    totalReqs++;
    completedReqs += Math.min(stats.totalXp / req.totalXp, 1);
  }
  if (req.badgesEarned) {
    totalReqs++;
    completedReqs += Math.min(stats.badgesEarned / req.badgesEarned, 1);
  }
  if (req.assetClassesExplored) {
    totalReqs++;
    completedReqs += Math.min(stats.assetClassesExplored / req.assetClassesExplored, 1);
  }
  if (req.coachesUsed) {
    totalReqs++;
    completedReqs += Math.min(stats.coachesUsed / req.coachesUsed, 1);
  }
  if (req.quizScore && stats.quizScore) {
    totalReqs++;
    completedReqs += Math.min(stats.quizScore / req.quizScore, 1);
  }
  
  return totalReqs > 0 ? (completedReqs / totalReqs) * 100 : 100;
};

export function InvestorJourney({
  stats,
  claimedStages: externalClaimedStages,
  onStageRewardClaim,
  onClaimStage,
  compact = false,
}: InvestorJourneyProps) {
  const [selectedStage, setSelectedStage] = useState<JourneyStage | null>(null);
  
  // Internal state for when external state is not provided
  const [internalClaimedStages, setInternalClaimedStages] = useState<Set<string>>(new Set());
  
  // Use external claimed stages if provided, otherwise use internal state
  const claimedStagesSet = useMemo(() => {
    if (externalClaimedStages !== undefined) {
      return new Set(externalClaimedStages);
    }
    return internalClaimedStages;
  }, [externalClaimedStages, internalClaimedStages]);
  
  // Find current stage
  const currentStageIndex = useMemo(() => {
    for (let i = journeyStages.length - 1; i >= 0; i--) {
      if (isStageCompleted(journeyStages[i], stats)) {
        return i;
      }
    }
    return 0;
  }, [stats]);
  
  const currentStage = journeyStages[currentStageIndex];
  const nextStage = journeyStages[currentStageIndex + 1];
  
  const handleClaimReward = (stage: JourneyStage) => {
    // If external state management is provided, use it
    if (onClaimStage) {
      onClaimStage(stage.id);
    } else {
      // Otherwise, manage internally
      setInternalClaimedStages(prev => new Set([...prev, stage.id]));
    }
    
    // Always call reward claim handler for XP
    if (onStageRewardClaim) {
      onStageRewardClaim(stage);
    }
  };
  
  // Compact version for sidebar
  if (compact) {
    const nextProgress = nextStage ? getStageProgress(nextStage, stats) : 100;
    
    return (
      <Card className="bg-white shadow-xl shadow-indigo-100 border border-indigo-100">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-indigo-500" />
              Investor Journey
            </h3>
            <Badge className="bg-indigo-100 text-indigo-700 border-0">
              Stage {currentStageIndex + 1}/{journeyStages.length}
            </Badge>
          </div>
          
          {/* Current Stage */}
          <div className={`p-3 rounded-xl bg-gradient-to-r ${currentStage.bgGradient} border border-indigo-200 mb-3`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center ${currentStage.color}`}>
                {currentStage.icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">{currentStage.title}</p>
                <p className="text-xs text-gray-600">{currentStage.subtitle}</p>
              </div>
            </div>
          </div>
          
          {/* Progress to Next */}
          {nextStage && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Next: {nextStage.title}</span>
                <span className="text-indigo-600 font-medium">{Math.round(nextProgress)}%</span>
              </div>
              <Progress value={nextProgress} className="h-1.5" />
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedStage(currentStage)}
            className="w-full mt-3 text-indigo-600 hover:text-indigo-700"
          >
            View Journey
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardContent>
        
        {/* Stage Detail Modal */}
        <StageDetailModal
          stage={selectedStage}
          isCompleted={selectedStage ? isStageCompleted(selectedStage, stats) : false}
          isClaimed={selectedStage ? claimedStagesSet.has(selectedStage.id) : false}
          progress={selectedStage ? getStageProgress(selectedStage, stats) : 0}
          stats={stats}
          onClose={() => setSelectedStage(null)}
          onClaimReward={handleClaimReward}
        />
      </Card>
    );
  }
  
  // Full version
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <GraduationCap className="h-7 w-7 text-indigo-400" />
          Your Investor Journey
        </h2>
        <p className="text-slate-400">From curious beginner to Family Office apprentice</p>
      </div>
      
      {/* Journey Timeline */}
      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-violet-500 to-slate-700" />
        
        {journeyStages.map((stage, index) => {
          const completed = isStageCompleted(stage, stats);
          const isCurrent = index === currentStageIndex;
          const isLocked = index > currentStageIndex + 1;
          const progress = getStageProgress(stage, stats);
          const claimed = claimedStagesSet.has(stage.id);
          
          return (
            <div 
              key={stage.id}
              className={`relative pl-14 pb-8 transition-opacity ${isLocked ? "opacity-40" : ""}`}
            >
              {/* Stage Icon */}
              <div className={`absolute left-0 w-12 h-12 rounded-xl flex items-center justify-center z-10 transition-all ${
                completed 
                  ? `bg-gradient-to-br ${stage.bgGradient} border-2 border-white/20 shadow-lg`
                  : isCurrent
                  ? "bg-slate-800 border-2 border-indigo-500 animate-pulse"
                  : "bg-slate-800 border-2 border-slate-700"
              } ${stage.color}`}>
                {isLocked ? <Lock className="h-5 w-5 text-slate-500" /> : stage.icon}
              </div>
              
              {/* Stage Card */}
              <Card 
                className={`cursor-pointer transition-all hover:scale-[1.01] ${
                  completed 
                    ? `bg-gradient-to-r ${stage.bgGradient} border-white/20`
                    : isCurrent
                    ? "bg-slate-800/80 border-indigo-500/50"
                    : "bg-slate-800/50 border-slate-700"
                }`}
                onClick={() => !isLocked && setSelectedStage(stage)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-bold ${completed ? "text-white" : "text-slate-300"}`}>
                          {stage.title}
                        </h3>
                        {completed && !claimed && (
                          <Badge className="bg-amber-500/30 text-amber-300 border-amber-500/50 animate-pulse">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Claim Reward!
                          </Badge>
                        )}
                        {claimed && (
                          <Badge className="bg-emerald-500/30 text-emerald-300 border-emerald-500/50">
                            ✓ Claimed
                          </Badge>
                        )}
                      </div>
                      <p className={`text-sm ${completed ? "text-white/80" : "text-slate-400"}`}>
                        {stage.subtitle}
                      </p>
                    </div>
                    {!isLocked && (
                      <ChevronRight className={`h-5 w-5 ${completed ? "text-white/60" : "text-slate-500"}`} />
                    )}
                  </div>
                  
                  {/* Progress bar for current stage */}
                  {isCurrent && !completed && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-indigo-400">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-1.5" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
      
      {/* Stage Detail Modal */}
      <StageDetailModal
        stage={selectedStage}
        isCompleted={selectedStage ? isStageCompleted(selectedStage, stats) : false}
        isClaimed={selectedStage ? claimedStagesSet.has(selectedStage.id) : false}
        progress={selectedStage ? getStageProgress(selectedStage, stats) : 0}
        stats={stats}
        onClose={() => setSelectedStage(null)}
        onClaimReward={handleClaimReward}
      />
    </div>
  );
}

// Stage Detail Modal
function StageDetailModal({
  stage,
  isCompleted,
  isClaimed,
  progress,
  stats,
  onClose,
  onClaimReward,
}: {
  stage: JourneyStage | null;
  isCompleted: boolean;
  isClaimed: boolean;
  progress: number;
  stats: InvestorJourneyProps['stats'];
  onClose: () => void;
  onClaimReward: (stage: JourneyStage) => void;
}) {
  if (!stage) return null;
  
  const req = stage.requirements;
  
  return (
    <Dialog open={!!stage} onOpenChange={onClose}>
      <DialogContent className={`max-w-md bg-gradient-to-br ${stage.bgGradient} bg-slate-900 border-slate-700`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center ${stage.color}`}>
              {stage.icon}
            </div>
            <div>
              <span className="text-white block">{stage.title}</span>
              <span className="text-sm text-slate-400 font-normal">{stage.subtitle}</span>
            </div>
          </DialogTitle>
          <DialogDescription className="text-slate-300 mt-2">
            {stage.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Narrative */}
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <p className="text-sm text-slate-300 italic leading-relaxed">
              "{stage.narrative}"
            </p>
          </div>
          
          {/* Requirements */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <Target className="h-4 w-4 text-indigo-400" />
              Requirements
            </h4>
            <div className="space-y-2">
              {req.missionsCompleted && (
                <RequirementRow
                  label="Missions Completed"
                  current={stats.missionsCompleted}
                  required={req.missionsCompleted}
                />
              )}
              {req.totalXp && (
                <RequirementRow
                  label="Total 🪙 iii"
                  current={stats.totalXp}
                  required={req.totalXp}
                />
              )}
              {req.badgesEarned && (
                <RequirementRow
                  label="Badges Earned"
                  current={stats.badgesEarned}
                  required={req.badgesEarned}
                />
              )}
              {req.assetClassesExplored && (
                <RequirementRow
                  label="Asset Classes Explored"
                  current={stats.assetClassesExplored}
                  required={req.assetClassesExplored}
                />
              )}
              {req.coachesUsed && (
                <RequirementRow
                  label="Coaches Used"
                  current={stats.coachesUsed}
                  required={req.coachesUsed}
                />
              )}
            </div>
          </div>
          
          {/* Rewards */}
          <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/30">
            <h4 className="text-sm font-semibold text-amber-300 mb-2 flex items-center gap-2">
              <Award className="h-4 w-4" />
              {stage.rewards.title}
            </h4>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="text-amber-200 font-bold">+{stage.rewards.xpBonus} 🪙</span>
            </div>
            <ul className="space-y-1">
              {stage.rewards.unlocks.map((unlock, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                  <span className="text-amber-400">✓</span>
                  {unlock}
                </li>
              ))}
            </ul>
          </div>
          
          {/* FO Wisdom */}
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Family Office Wisdom</p>
            <p className="text-sm text-slate-300 leading-relaxed">{stage.foWisdom}</p>
          </div>
          
          {/* Claim Button */}
          {isCompleted && !isClaimed && (
            <Button
              onClick={() => onClaimReward(stage)}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              <Trophy className="h-4 w-4 mr-2" />
              Claim {stage.rewards.title} (+{stage.rewards.xpBonus} 🪙)
            </Button>
          )}
          
          {isClaimed && (
            <div className="text-center py-2">
              <Badge className="bg-emerald-500/30 text-emerald-300 border-emerald-500/50">
                ✓ Reward Claimed
              </Badge>
            </div>
          )}
          
          {!isCompleted && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Progress to Unlock</span>
                <span className="text-indigo-400">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Requirement Row Component
function RequirementRow({
  label,
  current,
  required,
}: {
  label: string;
  current: number;
  required: number;
}) {
  const completed = current >= required;
  const progress = Math.min((current / required) * 100, 100);
  
  return (
    <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
      <div className="flex items-center gap-2">
        {completed ? (
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <span className="text-xs text-emerald-400">✓</span>
          </div>
        ) : (
          <div className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center">
            <span className="text-xs text-slate-500">{Math.round(progress)}%</span>
          </div>
        )}
        <span className={`text-sm ${completed ? "text-emerald-300" : "text-slate-400"}`}>
          {label}
        </span>
      </div>
      <span className={`text-sm font-medium ${completed ? "text-emerald-400" : "text-slate-300"}`}>
        {current}/{required}
      </span>
    </div>
  );
}

export default InvestorJourney;

