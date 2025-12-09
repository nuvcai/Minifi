/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   💎 HIGH CONVICTION MOMENT - User Chooses, AI Executes                      ║
 * ║   User picks their conviction choice, AI coach handles position sizing       ║
 * ║   Chapter 1: User chooses investment, coach allocates smartly                ║
 * ║   Higher Levels: Unlock manual allocation controls                           ║
 * ║   Copyright (c) 2025 NUVC.AI. All Rights Reserved.                          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  BarChart3, 
  Sparkles, 
  Diamond, 
  Flame, 
  Brain,
  Lock,
  CheckCircle2,
  ArrowRight,
  PieChart,
} from "lucide-react";
import { InvestmentOption, AssetClass } from "@/components/data/missions";
import { AICoach, getCoachResponse, getCoachEncouragement, getCoachWarning } from "@/components/data/coaches";
import { RiskPreviewCard } from "@/components/gamification/RiskPreviewCard";
import { CourageXpNotification } from "@/components/gamification/CourageXpNotification";
import { getCourageXpForRisk } from "@/components/gamification/effortRewards";
import { III_CONFIG } from "@/hooks/useIII";
import Image from "next/image";

// Asset class display configuration
const assetClassDisplay: Record<AssetClass, { label: string; emoji: string; color: string }> = {
  equities: { label: "Stocks", emoji: "📈", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  fixed_income: { label: "Bonds", emoji: "📊", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  commodities: { label: "Commodities", emoji: "🥇", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" },
  alternatives: { label: "Alternatives", emoji: "🏢", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
  cash: { label: "Cash", emoji: "💵", color: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300" },
  cryptocurrency: { label: "Crypto", emoji: "₿", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
};

// Generate coach's allocation based on user's conviction choice
function generateCoachAllocation(
  coach: AICoach | undefined,
  options: InvestmentOption[],
  userConvictionId: string
): { optionId: string; allocation: number; rationale: string }[] {
  const userChoice = options.find(o => o.id === userConvictionId);
  if (!userChoice) return [];
  
  const allocations: { optionId: string; allocation: number; rationale: string }[] = [];
  const otherOptions = options.filter(o => o.id !== userConvictionId);
  
  // Determine primary allocation based on coach philosophy and user's choice risk
  const userRisk = userChoice.risk.toLowerCase();
  let primaryAllocation = 50; // Default: 50% to user's choice
  
  if (!coach) {
    // Default balanced approach
    primaryAllocation = 50;
  } else {
    switch (coach.riskTolerance) {
      case "conservative":
        // Conservative coach reduces risky bets, increases safe ones
        if (userRisk === "extreme" || userRisk === "high") {
          primaryAllocation = 25; // "I respect your conviction, but let's be careful"
        } else if (userRisk === "low" || userRisk === "none") {
          primaryAllocation = 60; // "Great safe choice! Let's lean in"
        } else {
          primaryAllocation = 40;
        }
        break;
        
      case "moderate":
        // Balanced approach
        if (userRisk === "extreme") {
          primaryAllocation = 35;
        } else if (userRisk === "high") {
          primaryAllocation = 45;
        } else {
          primaryAllocation = 50;
        }
        break;
        
      case "aggressive":
      case "very_aggressive":
        // Aggressive coach leans into user's conviction
        if (userRisk === "extreme" || userRisk === "high") {
          primaryAllocation = 65; // "Bold choice! I love it!"
        } else if (userRisk === "low" || userRisk === "none") {
          primaryAllocation = 40; // "Safe, but let's add some spice"
        } else {
          primaryAllocation = 55;
        }
        break;
    }
  }
  
  // Add user's conviction choice
  allocations.push({
    optionId: userConvictionId,
    allocation: primaryAllocation,
    rationale: "Your conviction choice"
  });
  
  // Distribute remaining allocation to other options based on coach philosophy
  const remainingAllocation = 100 - primaryAllocation;
  
  // Sort other options by safety (for conservative) or return potential (for aggressive)
  const sortedOthers = [...otherOptions].sort((a, b) => {
    const riskOrder: Record<string, number> = { "none": 0, "low": 1, "medium": 2, "high": 3, "extreme": 4 };
    const aRisk = riskOrder[a.risk.toLowerCase()] || 2;
    const bRisk = riskOrder[b.risk.toLowerCase()] || 2;
    
    if (coach?.riskTolerance === "conservative") {
      return aRisk - bRisk; // Prefer safer options
    } else if (coach?.riskTolerance === "aggressive" || coach?.riskTolerance === "very_aggressive") {
      return bRisk - aRisk; // Prefer riskier options
    }
    return 0; // Balanced
  });
  
  // Allocate remaining to other options
  let remaining = remainingAllocation;
  sortedOthers.forEach((opt, idx) => {
    if (remaining <= 0) return;
    
    let alloc = 0;
    if (idx === 0) {
      alloc = Math.min(remaining, Math.round(remainingAllocation * 0.5)); // First gets 50% of remaining
    } else if (idx === 1) {
      alloc = Math.min(remaining, Math.round(remainingAllocation * 0.35)); // Second gets 35%
    } else {
      alloc = remaining; // Rest gets what's left
    }
    
    if (alloc > 0) {
      allocations.push({
        optionId: opt.id,
        allocation: alloc,
        rationale: idx === 0 ? "Diversification hedge" : "Additional protection"
      });
      remaining -= alloc;
    }
  });
  
  // Ensure we hit exactly 100%
  const total = allocations.reduce((sum, a) => sum + a.allocation, 0);
  if (total !== 100 && allocations.length > 0) {
    allocations[0].allocation += (100 - total);
  }
  
  return allocations.filter(a => a.allocation > 0);
}

// Get coach's reaction to user's choice - NOW WITH ENHANCED PERSONALITY
function getCoachReaction(coach: AICoach | undefined, option: InvestmentOption): string {
  if (!coach) return "Interesting choice! Let me build a smart portfolio around it.";
  
  const risk = option.risk.toLowerCase();
  const isHighRisk = risk === "extreme" || risk === "high";
  const isSafe = risk === "low" || risk === "none";
  const emoji = coach.speechStyle?.emoji || "🎯";
  
  // Use new personality system
  if (isHighRisk) {
    if (coach.riskTolerance === "conservative") {
      // Sam warns but supports
      const warning = getCoachWarning(coach);
      return `${emoji} ${coach.name}: "${warning} But I respect your conviction—I'll balance it with protective assets."`;
    } else if (coach.riskTolerance === "very_aggressive" || coach.riskTolerance === "aggressive") {
      // Alex gets excited
      const encouragement = getCoachEncouragement(coach);
      return `${emoji} ${coach.name}: "${encouragement} Let's ride this wave together!"`;
    } else {
      // Guru/Yoda balanced response
      return `${emoji} ${coach.name}: "Bold choice! I'll architect a portfolio that balances your conviction with smart diversification."`;
    }
  } else if (isSafe) {
    if (coach.riskTolerance === "conservative") {
      // Sam loves it
      const response = getCoachResponse(coach, "safeChoice");
      return `${emoji} ${coach.name}: "${response}"`;
    } else if (coach.riskTolerance === "very_aggressive" || coach.riskTolerance === "aggressive") {
      // Alex wants more action
      return `${emoji} ${coach.name}: "${coach.emotionalResponses?.onSafeChoice?.[0] || "Safe choice... but I'll add some growth potential to spice it up!"}"`;
    } else {
      return `${emoji} ${coach.name}: "Solid foundation! I'll build a balanced portfolio around this choice."`;
    }
  } else {
    // Medium risk - everyone is okay
    return `${emoji} ${coach.name}: "Good thinking! ${coach.speechStyle?.catchphrases?.[0] || "Let's build something great."}"`;
  }
}

// Main Component Props
interface InvestmentDecisionProps {
  options: InvestmentOption[];
  selectedInvestment: string | null;
  onInvestmentSelect: (optionId: string) => void;
  onConfirm: () => void;
  onBack: () => void;
  onCourageXpEarned?: (xp: number, label: string) => void;
  selectedCoach?: AICoach;
  playerLevel?: number;
}

export function InvestmentDecision({
  options,
  selectedInvestment,
  onInvestmentSelect,
  onConfirm,
  onBack,
  onCourageXpEarned,
  selectedCoach,
  playerLevel = 1,
}: InvestmentDecisionProps) {
  const [showRiskPreview, setShowRiskPreview] = useState(false);
  const [courageNotification, setCourageNotification] = useState<{
    xp: number;
    label: string;
  } | null>(null);
  
  const selectedOption = selectedInvestment
    ? options.find((o) => o.id === selectedInvestment)
    : null;
  
  // Generate coach's allocation based on user's conviction
  const coachAllocations = useMemo(() => 
    selectedInvestment ? generateCoachAllocation(selectedCoach, options, selectedInvestment) : [],
    [selectedCoach, options, selectedInvestment]
  );
  
  // Calculate total XP for the allocation
  const totalXp = useMemo(() => {
    return coachAllocations.reduce((total, alloc) => {
      const option = options.find(o => o.id === alloc.optionId);
      if (!option) return total;
      const reward = getCourageXpForRisk(option.risk);
      return total + Math.round((reward.xp * alloc.allocation) / 100);
    }, 0);
  }, [coachAllocations, options]);
  
  // Coach's reaction to user's choice
  const coachReaction = selectedOption 
    ? getCoachReaction(selectedCoach, selectedOption)
    : null;

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "extreme": return "from-red-500 to-orange-500";
      case "high": return "from-orange-500 to-amber-500";
      case "medium": return "from-amber-500 to-yellow-500";
      case "low": return "from-emerald-500 to-green-500";
      case "none": return "from-blue-500 to-cyan-500";
      default: return "from-gray-500 to-slate-500";
    }
  };

  const handleConfirmClick = () => {
    if (selectedOption) {
      setShowRiskPreview(true);
    }
  };

  const handleRiskPreviewConfirm = () => {
    if (selectedOption) {
      setCourageNotification({ xp: totalXp, label: "Conviction Courage" });
      
      if (onCourageXpEarned) {
        onCourageXpEarned(totalXp, "Conviction Courage");
      }
      
      setTimeout(() => {
        setShowRiskPreview(false);
        onConfirm();
      }, 800);
    }
  };

  const handleRiskPreviewCancel = () => {
    setShowRiskPreview(false);
  };

  // Show risk preview when user confirms
  if (showRiskPreview && selectedOption) {
    return (
      <div className="space-y-4">
        {courageNotification && (
          <CourageXpNotification
            xp={courageNotification.xp}
            label={courageNotification.label}
            onComplete={() => setCourageNotification(null)}
          />
        )}
        
        <RiskPreviewCard
          option={selectedOption}
          onConfirm={handleRiskPreviewConfirm}
          onCancel={handleRiskPreviewCancel}
          onCourageXpEarned={onCourageXpEarned}
          coach={selectedCoach}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Courage XP Notification */}
      {courageNotification && (
        <CourageXpNotification
          xp={courageNotification.xp}
          label={courageNotification.label}
          onComplete={() => setCourageNotification(null)}
        />
      )}

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5
        bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50
        dark:from-violet-500/15 dark:via-purple-500/10 dark:to-indigo-500/15
        border-2 border-violet-300/50 dark:border-violet-500/40">
        
        {/* Decorative Elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-indigo-400/20 to-violet-400/20 rounded-full blur-xl" />
        
        <div className="relative flex items-start gap-4">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur-md opacity-50" />
            <div className="relative p-3 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 shadow-xl shadow-violet-500/30">
              <Diamond className="h-6 w-6 text-white" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 h-3.5 w-3.5 text-amber-400 animate-pulse" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-black bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-1">
              What's Your Conviction? 💎
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Pick the investment <span className="font-bold text-violet-600 dark:text-violet-400">you believe in most</span>. 
              <span className="block sm:inline"> {selectedCoach?.name || "Your coach"} will build a smart portfolio around your choice.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Investment Options - Stacked for Mobile */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">
            Choose Your Conviction
          </h4>
          <Badge variant="outline" className="text-[10px]">
            Tap to select
          </Badge>
        </div>
        
        {options.map((option) => {
          const isSelected = selectedInvestment === option.id;
          const courageReward = getCourageXpForRisk(option.risk);
          const isHighRisk = option.risk.toLowerCase() === "high" || option.risk.toLowerCase() === "extreme";
          
          return (
            <Card
              key={option.id}
              onClick={() => onInvestmentSelect(option.id)}
              className={`cursor-pointer transition-all duration-300 touch-manipulation active:scale-[0.98] relative overflow-hidden ${
                isSelected
                  ? "border-2 border-violet-500 bg-gradient-to-br from-violet-50 via-purple-50/50 to-white dark:from-violet-950/50 dark:via-purple-950/30 dark:to-slate-900 shadow-xl shadow-violet-500/20 ring-2 ring-violet-500/30"
                  : "border border-gray-200 dark:border-slate-700 hover:border-violet-300 hover:shadow-md"
              }`}
            >
              {/* Risk indicator bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getRiskColor(option.risk)}`} />
              
              {/* Bold Move Badge */}
              {isHighRisk && (
                <div className="absolute top-2 right-2 z-10">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[9px] shadow-lg">
                    <Flame className="h-3 w-3 mr-1" />
                    Bold
                  </Badge>
                </div>
              )}
              
              <CardContent className="p-4 pt-5">
                <div className="flex items-start gap-3">
                  {/* Selection Indicator */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                    isSelected 
                      ? "bg-violet-500 text-white shadow-lg shadow-violet-500/30" 
                      : "bg-gray-100 dark:bg-slate-800 text-gray-400"
                  }`}>
                    {isSelected ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <span className="text-lg">{assetClassDisplay[option.assetClass]?.emoji || "📊"}</span>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5 className="font-bold text-sm text-gray-900 dark:text-white">{option.name}</h5>
                        <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                          {option.description}
                        </p>
                      </div>
                      <Badge 
                        variant={option.risk.toLowerCase() === "low" || option.risk.toLowerCase() === "none" ? "default" : "secondary"}
                        className="flex-shrink-0 text-[10px]"
                      >
                        {option.risk}
                      </Badge>
                    </div>
                    
                    {/* Stats Row */}
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <div className="flex items-center gap-1 text-[11px]">
                        <BarChart3 className="h-3 w-3 text-indigo-500" />
                        <span className="text-gray-600 dark:text-slate-400">Expected:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{option.expectedReturn}</span>
                      </div>
                      <div className={`flex items-center gap-1 text-[11px] ${isSelected ? "text-violet-600" : "text-amber-600"}`}>
                        <Sparkles className="h-3 w-3" />
                        <span className="font-semibold">+{courageReward.xp} {III_CONFIG.symbol}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Coach's Portfolio Plan - Shows after selection */}
      {selectedOption && coachAllocations.length > 0 && (
        <div className="space-y-3 animate-in slide-in-from-bottom-4 duration-500">
          {/* Coach Reaction */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30">
            <div className="flex items-start gap-3">
              {selectedCoach && (
                <div className="relative w-10 h-10 flex-shrink-0">
                  <Image
                    src={selectedCoach.avatar}
                    alt={selectedCoach.name}
                    fill
                    className="rounded-full object-cover border-2 border-white shadow-md"
                  />
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm text-gray-800 dark:text-slate-200 font-medium leading-relaxed">
                  {coachReaction}
                </p>
              </div>
            </div>
          </div>
          
          {/* Portfolio Allocation Card */}
          <Card className="border-2 border-violet-500/30 bg-gradient-to-br from-violet-50/50 to-white dark:from-violet-950/20 dark:to-slate-900">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-violet-500/20">
                    <PieChart className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      {selectedCoach?.name || "Coach"}'s Portfolio Plan
                    </h4>
                    <p className="text-[10px] text-gray-500 dark:text-slate-400">
                      AI-optimized allocation based on your conviction
                    </p>
                  </div>
                </div>
                <Badge className="bg-violet-500/20 text-violet-700 dark:text-violet-300 border-violet-500/40">
                  <Brain className="h-3 w-3 mr-1" />
                  AI Managed
                </Badge>
              </div>
              
              {/* Visual Allocation Bar */}
              <div className="h-4 rounded-full overflow-hidden flex bg-gray-100 dark:bg-slate-800 mb-3">
                {coachAllocations.map((alloc, idx) => {
                  const colors = [
                    "bg-violet-500",
                    "bg-emerald-500", 
                    "bg-amber-500",
                    "bg-blue-500",
                  ];
                  return (
                    <div
                      key={alloc.optionId}
                      className={`${colors[idx % colors.length]} transition-all duration-500 flex items-center justify-center`}
                      style={{ width: `${alloc.allocation}%` }}
                    >
                      {alloc.allocation >= 20 && (
                        <span className="text-[10px] font-bold text-white">{alloc.allocation}%</span>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Allocation Details */}
              <div className="grid grid-cols-2 gap-2">
                {coachAllocations.map((alloc, idx) => {
                  const option = options.find(o => o.id === alloc.optionId);
                  if (!option) return null;
                  const isUserChoice = alloc.optionId === selectedInvestment;
                  return (
                    <div 
                      key={alloc.optionId} 
                      className={`flex items-center gap-2 p-2 rounded-lg ${
                        isUserChoice 
                          ? "bg-violet-500/10 border border-violet-500/30" 
                          : "bg-gray-50 dark:bg-slate-800/50"
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full ${
                        idx === 0 ? "bg-violet-500" :
                        idx === 1 ? "bg-emerald-500" :
                        idx === 2 ? "bg-amber-500" : "bg-blue-500"
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-gray-800 dark:text-white truncate">
                          {option.name}
                          {isUserChoice && <span className="ml-1 text-violet-500">★</span>}
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-slate-400">{alloc.rationale}</p>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{alloc.allocation}%</span>
                    </div>
                  );
                })}
              </div>
              
              {/* Total Investment & XP */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-bold text-gray-900 dark:text-white">$100,000</span>
                  <span className="text-xs text-gray-500 dark:text-slate-400">total investment</span>
                </div>
                <div className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  <span className="text-sm font-bold">+{totalXp} {III_CONFIG.symbol}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Unlock Teaser */}
          {playerLevel < 3 && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <Lock className="h-4 w-4 text-slate-500" />
              <div className="flex-1">
                <p className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                  Custom allocation unlocks at Level 3
                </p>
              </div>
              <Badge variant="outline" className="text-[10px]">Level 3</Badge>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 pt-2">
        <Button
          onClick={handleConfirmClick}
          disabled={!selectedInvestment}
          className="w-full min-h-[56px] font-bold text-base bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 hover:from-violet-600 hover:via-purple-600 hover:to-indigo-600 shadow-lg shadow-violet-500/25 touch-manipulation active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Diamond className="h-5 w-5 mr-2" />
          {selectedOption ? `Invest with ${selectedCoach?.name || "Coach"}'s Plan` : "Select Your Conviction"}
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
        <Button 
          variant="outline" 
          onClick={onBack}
          className="w-full min-h-[48px] touch-manipulation active:scale-[0.98]"
        >
          Back to Mission Brief
        </Button>
      </div>
      
      {/* Philosophy Footer */}
      <div className="text-center">
        <p className="text-[10px] text-gray-500 dark:text-gray-400 italic">
          "You choose the conviction. Your FO expert builds the portfolio."
        </p>
      </div>
    </div>
  );
}

export default InvestmentDecision;
