/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   📝 INVESTMENT THESIS - Pre-Decision Reasoning                              ║
 * ║   Forces deliberate thinking before investment decisions                     ║
 * ║   FO Principle: "If you can't explain it simply, you don't understand it"   ║
 * ║   Copyright (c) 2025 NUVC.AI. All Rights Reserved.                          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  PenLine,
  Brain,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  Target,
  MessageSquare,
  Award,
  Zap,
  ChevronDown,
  Shield,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import { InvestmentOption } from "@/components/data/missions";
import { AICoach, getCoachEncouragement, getCoachCatchphrase } from "@/components/data/coaches";

interface InvestmentThesisProps {
  selectedOption: InvestmentOption;
  coach: AICoach;
  eventTitle: string;
  eventYear: number;
  onSubmit: (thesis: string) => void;
  onSkip: () => void;
  onXpEarned?: (amount: number) => void;
}

// Thesis quality indicators
interface ThesisQuality {
  hasReason: boolean;
  mentionsRisk: boolean;
  mentionsTimeframe: boolean;
  mentionsCoach: boolean;
  isThoughtful: boolean;
}

// Evaluate thesis quality
const evaluateThesis = (thesis: string): ThesisQuality => {
  const lower = thesis.toLowerCase();
  return {
    hasReason: thesis.length > 20,
    mentionsRisk: /risk|safe|volatile|conservative|aggressive|danger|protect/.test(lower),
    mentionsTimeframe: /long.?term|short.?term|year|time|hold|wait|future/.test(lower),
    mentionsCoach: /coach|advice|recommend|suggest|sam|guru|alex|yoda/.test(lower),
    isThoughtful: thesis.length > 60 && thesis.split(" ").length > 10,
  };
};

// Thesis prompts based on investment type
const getThesisPrompts = (option: InvestmentOption, eventYear: number): string[] => {
  const prompts: string[] = [];
  
  if (option.risk.toLowerCase() === "extreme" || option.risk.toLowerCase() === "high") {
    prompts.push("Why are you comfortable with this level of risk?");
  }
  if (option.assetClass === "cryptocurrency") {
    prompts.push("How does this fit with traditional Family Office strategies?");
  }
  if (option.assetClass === "fixed_income") {
    prompts.push("What role do bonds play in protecting your portfolio?");
  }
  if (eventYear >= 2020) {
    prompts.push("How might recent market changes affect this investment?");
  }
  
  // Default prompts
  prompts.push("What outcome are you expecting and why?");
  prompts.push("How does your coach's philosophy influence this choice?");
  
  return prompts.slice(0, 3);
};

// Quick Thesis Options - Pre-defined reasoning for reduced friction
interface QuickThesisOption {
  id: string;
  emoji: string;
  reason: string;
  foAlignment: "conservative" | "balanced" | "growth" | "opportunistic";
  xpBonus: number;
}

const getQuickThesisOptions = (option: InvestmentOption, eventYear: number): QuickThesisOption[] => {
  const baseOptions: QuickThesisOption[] = [];
  const riskLevel = option.risk.toLowerCase();
  
  // Risk-based reasoning
  if (riskLevel === "low" || riskLevel === "none") {
    baseOptions.push({
      id: "preservation",
      emoji: "🛡️",
      reason: "Protecting capital is the first rule of wealth building. I'm prioritizing safety in uncertain times.",
      foAlignment: "conservative",
      xpBonus: 20,
    });
  }
  
  if (riskLevel === "medium") {
    baseOptions.push({
      id: "balance",
      emoji: "⚖️",
      reason: "Balancing risk and reward is how Family Offices grow wealth steadily over generations.",
      foAlignment: "balanced",
      xpBonus: 25,
    });
  }
  
  if (riskLevel === "high" || riskLevel === "extreme") {
    baseOptions.push({
      id: "conviction",
      emoji: "💎",
      reason: "Bold moves with conviction create generational wealth. The math says risk now, patience later.",
      foAlignment: "growth",
      xpBonus: 30,
    });
  }
  
  // Asset class-based reasoning
  if (option.assetClass === "fixed_income") {
    baseOptions.push({
      id: "stability",
      emoji: "📊",
      reason: "Bonds provide stability when markets are volatile. FOs always have fixed income as a foundation.",
      foAlignment: "conservative",
      xpBonus: 20,
    });
  }
  
  if (option.assetClass === "equities") {
    baseOptions.push({
      id: "growth",
      emoji: "📈",
      reason: "Stocks have outperformed every other asset class over the long term. Time in the market beats timing.",
      foAlignment: "growth",
      xpBonus: 25,
    });
  }
  
  if (option.assetClass === "commodities") {
    baseOptions.push({
      id: "hedge",
      emoji: "🥇",
      reason: "Commodities hedge against inflation and currency risk. Real assets preserve purchasing power.",
      foAlignment: "balanced",
      xpBonus: 25,
    });
  }
  
  // Historical context reasoning
  if (eventYear >= 2008) {
    baseOptions.push({
      id: "crisis",
      emoji: "🦅",
      reason: "Crisis creates opportunity. When others panic, disciplined investors find asymmetric returns.",
      foAlignment: "opportunistic",
      xpBonus: 30,
    });
  }
  
  // Coach alignment reasoning (universal)
  baseOptions.push({
    id: "coach",
    emoji: "🧠",
    reason: "Following my coach's philosophy builds discipline. Consistency compounds over time.",
    foAlignment: "balanced",
    xpBonus: 20,
  });
  
  // Diversification reasoning (universal)
  baseOptions.push({
    id: "diversify",
    emoji: "🎯",
    reason: "This fits my portfolio diversification strategy. Not all eggs in one basket.",
    foAlignment: "balanced",
    xpBonus: 25,
  });
  
  // Return top 4 most relevant options
  return baseOptions.slice(0, 4);
};

// Coach reactions based on thesis - NOW WITH ENHANCED PERSONALITY
const getCoachReaction = (
  coach: AICoach, 
  _option: InvestmentOption, 
  quality: ThesisQuality
): string => {
  void _option; // Available for future use
  const emoji = coach.speechStyle?.emoji || "🎯";
  const catchphrase = getCoachCatchphrase(coach);
  
  if (quality.isThoughtful && quality.mentionsRisk) {
    // Use coach-specific encouragement
    const encouragement = getCoachEncouragement(coach);
    switch (coach.riskTolerance) {
      case "conservative":
        return `${emoji} ${coach.name} nods approvingly: "${encouragement} This is exactly how Family Offices preserve wealth. Remember: '${catchphrase}'"`;
      case "moderate":
        return `${emoji} ${coach.name} smiles: "Great balanced thinking! ${encouragement} That's the hallmark of a mature investor."`;
      case "aggressive":
      case "very_aggressive":
        return `${emoji} ${coach.name} grins: "${encouragement} Taking calculated risks with clear thinking is how fortunes are made!"`;
      default:
        return `${emoji} ${coach.name} says: "Excellent reasoning! ${encouragement}"`;
    }
  }
  
  if (quality.hasReason) {
    return `${emoji} ${coach.name} considers your thesis: "Good start! The best investors always know WHY they're making a decision. '${catchphrase}'"`;
  }
  
  return `${emoji} ${coach.name} encourages you: "Every thesis is a learning opportunity. Let's see how your thinking plays out!"`;
};

export function InvestmentThesis({
  selectedOption,
  coach,
  eventTitle,
  eventYear,
  onSubmit,
  onSkip,
  onXpEarned,
}: InvestmentThesisProps) {
  // Mode: "quick" for pre-defined options, "full" for free text
  const [mode, setMode] = useState<"quick" | "full">("quick");
  const [thesis, setThesis] = useState("");
  const [selectedQuickThesis, setSelectedQuickThesis] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showCoachReaction, setShowCoachReaction] = useState(false);
  
  const quality = evaluateThesis(thesis);
  const qualityScore = Object.values(quality).filter(Boolean).length;
  const prompts = getThesisPrompts(selectedOption, eventYear);
  const quickOptions = getQuickThesisOptions(selectedOption, eventYear);
  
  // Calculate XP bonus based on thesis quality (full mode)
  const xpBonusFull = useMemo(() => {
    let bonus = 10; // Base XP for writing thesis
    if (quality.hasReason) bonus += 5;
    if (quality.mentionsRisk) bonus += 10;
    if (quality.mentionsTimeframe) bonus += 5;
    if (quality.isThoughtful) bonus += 15;
    return bonus;
  }, [quality]);
  
  // Get XP for quick thesis
  const xpBonusQuick = useMemo(() => {
    if (!selectedQuickThesis) return 0;
    const option = quickOptions.find(o => o.id === selectedQuickThesis);
    return option?.xpBonus || 20;
  }, [selectedQuickThesis, quickOptions]);
  
  const xpBonus = mode === "quick" ? xpBonusQuick : xpBonusFull;
  
  // Handle quick thesis selection
  const handleQuickSelect = useCallback((optionId: string) => {
    setSelectedQuickThesis(optionId);
    const option = quickOptions.find(o => o.id === optionId);
    if (option) {
      setThesis(option.reason);
    }
  }, [quickOptions]);
  
  const handleSubmit = useCallback(() => {
    setIsSubmitted(true);
    setShowCoachReaction(true);
    
    if (onXpEarned && xpBonus > 0) {
      onXpEarned(xpBonus);
    }
    
    // Delay to show reaction before continuing
    setTimeout(() => {
      onSubmit(thesis);
    }, 2500);
  }, [thesis, xpBonus, onXpEarned, onSubmit]);
  
  // Generate appropriate coach reaction
  const quickOption = selectedQuickThesis 
    ? quickOptions.find(o => o.id === selectedQuickThesis)
    : null;
    
  const coachReaction = mode === "quick" && quickOption
    ? getQuickCoachReaction(coach, quickOption)
    : getCoachReaction(coach, selectedOption, quality);
    
  function getQuickCoachReaction(coach: AICoach, option: QuickThesisOption): string {
    const emoji = coach.speechStyle?.emoji || "🎯";
    const catchphrase = getCoachCatchphrase(coach);
    const encouragement = getCoachEncouragement(coach);
    
    const reactions: Record<string, string> = {
      conservative: `${emoji} ${coach.name} nods approvingly: "${encouragement} Protecting capital is the foundation of all wealth building. '${catchphrase}'"`,
      balanced: `${emoji} ${coach.name} smiles: "Well-reasoned! ${encouragement} You're thinking like a true Family Office investor."`,
      growth: `${emoji} ${coach.name} grins: "${encouragement} This is how fortunes are made - calculated conviction!"`,
      opportunistic: `${emoji} ${coach.name} looks impressed: "Crisis investing! ${encouragement} When others panic, the disciplined find opportunity."`,
    };
    
    return reactions[option.foAlignment] || `${emoji} ${coach.name}: "${encouragement}"`;
  }

  return (
    <div className="space-y-5">
      {/* Header - Teen-friendly educational framing */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#9898f2]/20 to-purple-500/20 dark:from-[#9898f2]/30 dark:to-purple-500/30 border border-[#9898f2]/30 mb-3">
          <Brain className="h-4 w-4 text-[#7070c0] dark:text-[#9898f2]" />
          <span className="text-sm font-medium text-[#7070c0] dark:text-[#9898f2]">Investment Thesis</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          🎯 Why This Choice?
        </h3>
        <p className="text-sm text-gray-600 dark:text-slate-400">
          Family Offices document their reasoning before every major decision
        </p>
      </div>

      {/* Selected Investment Summary */}
      <Card className="bg-white dark:bg-slate-800/50 border-[#9898f2]/20 dark:border-slate-700 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#9898f2]/20 dark:bg-indigo-500/20 flex items-center justify-center">
                <Target className="h-5 w-5 text-[#7070c0] dark:text-indigo-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{selectedOption.name}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs border-[#9898f2]/30 text-[#7070c0] dark:text-slate-300">
                    {selectedOption.risk} Risk
                  </Badge>
                  <span className="text-xs text-gray-500 dark:text-slate-400">
                    Expected: {selectedOption.expectedReturn}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-slate-400">Year</p>
              <p className="text-sm font-medium text-[#7070c0] dark:text-indigo-300">{eventYear}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mode Toggle */}
      {!isSubmitted && (
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <button
              onClick={() => setMode("quick")}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                mode === "quick"
                  ? "bg-white dark:bg-slate-700 text-[#7070c0] dark:text-[#9898f2] shadow-sm"
                  : "text-gray-500 dark:text-slate-400 hover:text-gray-700"
              }`}
            >
              <Zap className="h-3 w-3 inline mr-1" />
              Quick Pick
            </button>
            <button
              onClick={() => setMode("full")}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                mode === "full"
                  ? "bg-white dark:bg-slate-700 text-[#7070c0] dark:text-[#9898f2] shadow-sm"
                  : "text-gray-500 dark:text-slate-400 hover:text-gray-700"
              }`}
            >
              <PenLine className="h-3 w-3 inline mr-1" />
              Write Full
            </button>
          </div>
        </div>
      )}

      {/* Thesis Input */}
      {!isSubmitted ? (
        <div className="space-y-4">
          {/* QUICK MODE - Pre-defined options */}
          {mode === "quick" && (
            <div className="space-y-3">
              <p className="text-xs text-gray-500 dark:text-slate-400 text-center">
                Select the reasoning that best matches your thinking:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleQuickSelect(option.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedQuickThesis === option.id
                        ? "border-[#9898f2] bg-[#9898f2]/10 dark:bg-[#9898f2]/20 ring-2 ring-[#9898f2]/30"
                        : "border-gray-200 dark:border-slate-700 hover:border-[#9898f2]/50 hover:bg-gray-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">{option.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 dark:text-white leading-relaxed">
                          {option.reason}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={`text-[10px] ${
                            option.foAlignment === "conservative" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" :
                            option.foAlignment === "balanced" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" :
                            option.foAlignment === "growth" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300" :
                            "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                          }`}>
                            {option.foAlignment === "conservative" && <Shield className="h-2.5 w-2.5 mr-1" />}
                            {option.foAlignment === "balanced" && <BookOpen className="h-2.5 w-2.5 mr-1" />}
                            {option.foAlignment === "growth" && <TrendingUp className="h-2.5 w-2.5 mr-1" />}
                            {option.foAlignment === "opportunistic" && <Target className="h-2.5 w-2.5 mr-1" />}
                            {option.foAlignment.charAt(0).toUpperCase() + option.foAlignment.slice(1)}
                          </Badge>
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                            +{option.xpBonus} XP
                          </span>
                          {selectedQuickThesis === option.id && (
                            <CheckCircle2 className="h-4 w-4 text-[#9898f2] ml-auto" />
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* FO Tip */}
              <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg border border-emerald-200 dark:border-emerald-500/30">
                <p className="text-xs text-emerald-700 dark:text-emerald-300 flex items-start gap-2">
                  <Lightbulb className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                  <span><strong>FO Principle:</strong> "If you can't explain your investment thesis simply, you don't understand it deeply enough."</span>
                </p>
              </div>
            </div>
          )}
          
          {/* FULL MODE - Free text writing */}
          {mode === "full" && (
            <>
              {/* Writing Area */}
              <div className="relative">
                <Textarea
                  placeholder="Example: 'I'm choosing bonds because they're safer during a crisis. Even if stocks crash, bonds usually hold their value. My coach says protecting what you have is the first rule of wealth building...'"
                  value={thesis}
                  onChange={(e) => setThesis(e.target.value)}
                  className="min-h-[120px] bg-white dark:bg-slate-800 border-[#9898f2]/30 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 resize-none focus:border-[#9898f2] focus:ring-2 focus:ring-[#9898f2]/20"
                  maxLength={500}
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-slate-500">
                  {thesis.length}/500
                </div>
              </div>

              {/* Prompts to help - Teen friendly */}
              <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-lg border border-amber-200 dark:border-amber-500/30">
                <p className="text-xs font-medium text-amber-700 dark:text-amber-300 mb-2 flex items-center gap-1">
                  <Lightbulb className="h-3 w-3" />
                  💡 Need help? Try answering these:
                </p>
                <ul className="space-y-1">
                  {prompts.map((prompt, i) => (
                    <li key={i} className="text-xs text-gray-700 dark:text-slate-300 flex items-start gap-2">
                      <span className="text-amber-500 dark:text-amber-400">•</span>
                      {prompt}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quality Indicators - Gamified for teens */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-slate-400">🎮 Unlock XP by including:</span>
                  <span className="text-[#7070c0] dark:text-[#9898f2] font-bold">+{xpBonusFull} XP potential</span>
                </div>
                <Progress value={(qualityScore / 5) * 100} className="h-2" />
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { key: "hasReason", label: "Your Why", icon: "✏️" },
                    { key: "mentionsRisk", label: "Risk Check", icon: "⚖️" },
                    { key: "mentionsTimeframe", label: "Time Plan", icon: "⏱️" },
                    { key: "mentionsCoach", label: "Coach Tip", icon: "🧠" },
                    { key: "isThoughtful", label: "Deep Think", icon: "💎" },
                  ].map(({ key, label, icon }) => (
                    <div 
                      key={key}
                      className={`p-2 rounded-lg text-center text-xs transition-all ${
                        quality[key as keyof ThesisQuality]
                          ? "bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
                          : "bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-400 dark:text-slate-500"
                      }`}
                    >
                      <span className="block text-lg mb-0.5">{icon}</span>
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Actions - Always stacked full width for mobile-first cards */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleSubmit}
              disabled={mode === "quick" ? !selectedQuickThesis : thesis.length < 10}
              className="w-full min-h-[48px] bg-gradient-to-r from-[#9898f2] to-[#7070c0] hover:from-[#8585e0] hover:to-[#6060b0] text-white shadow-lg shadow-[#9898f2]/20"
            >
              {mode === "quick" ? (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Confirm Thesis +{xpBonus} XP
                </>
              ) : (
                <>
                  <PenLine className="h-4 w-4 mr-2" />
                  Submit & Earn +{xpBonusFull} XP 🚀
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={onSkip}
              className="w-full min-h-[48px] text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
            >
              Skip
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-slate-500 text-center">
            {mode === "quick" 
              ? "💡 Quick pick captures your core reasoning in seconds!"
              : "🌟 Real investors write down their reasoning — it's how you learn from wins AND mistakes!"
            }
          </p>
        </div>
      ) : (
        /* Coach Reaction */
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* XP Earned Banner */}
          <div className="p-4 bg-gradient-to-r from-[#9898f2]/20 to-purple-500/20 dark:from-amber-500/20 dark:to-orange-500/20 rounded-xl border border-[#9898f2]/40 dark:border-amber-500/40 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-[#7070c0] dark:text-amber-400 animate-pulse" />
              <span className="text-xl font-bold text-[#7070c0] dark:text-amber-300">+{xpBonus} XP Earned! 🎉</span>
              <Sparkles className="h-5 w-5 text-[#7070c0] dark:text-amber-400 animate-pulse" />
            </div>
            <p className="text-xs text-[#7070c0]/70 dark:text-amber-200/70">Nice work! Writing down your reasoning = how pros think</p>
          </div>

          {/* Your Thesis */}
          <Card className="bg-white dark:bg-slate-800/50 border-[#9898f2]/20 dark:border-slate-700 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#9898f2]/20 dark:bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-4 w-4 text-[#7070c0] dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Your Investment Thesis</p>
                  <p className="text-sm text-gray-900 dark:text-white leading-relaxed italic">&ldquo;{thesis}&rdquo;</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coach Reaction */}
          {showCoachReaction && (
            <Card className="bg-gradient-to-r from-[#9898f2]/15 to-purple-500/15 dark:from-indigo-500/15 dark:to-violet-500/15 border-[#9898f2]/40 dark:border-indigo-500/40 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-500">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#9898f2] to-[#7070c0] dark:from-indigo-500 dark:to-violet-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🧠</span>
                  </div>
                  <div>
                    <p className="text-xs text-[#7070c0] dark:text-indigo-300 mb-1 font-medium">{coach.name} says:</p>
                    <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
                      {coachReaction}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quality Badges Earned */}
          <div className="flex flex-wrap justify-center gap-2">
            {quality.isThoughtful && (
              <Badge className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40">
                <Award className="h-3 w-3 mr-1" /> Deep Thinker 🧠
              </Badge>
            )}
            {quality.mentionsRisk && (
              <Badge className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-500/40">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Risk-Aware ⚖️
              </Badge>
            )}
          </div>

          <p className="text-xs text-gray-500 dark:text-slate-500 text-center animate-pulse">
            ✨ Let&apos;s see how your decision plays out...
          </p>
        </div>
      )}
    </div>
  );
}

export default InvestmentThesis;

