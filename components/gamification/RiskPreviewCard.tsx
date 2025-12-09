/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   💎 HIGH CONVICTION MOMENT - Risk Preview & Courage Card                    ║
 * ║   Beautiful, gamified pre-investment confirmation experience                 ║
 * ║   "Every investment teaches something valuable"                              ║
 * ║   Copyright (c) 2025 NUVC.AI. All Rights Reserved.                          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Diamond,
  Sparkles,
  TrendingDown,
  Shield,
  Brain,
  Trophy,
  Zap,
  ChevronRight,
  BookOpen,
  Target,
  Lightbulb,
  Clock,
  CheckCircle2,
  Flame,
  Star,
  Award,
  GraduationCap,
  Heart,
} from "lucide-react";
import { III_CONFIG } from "@/hooks/useIII";
import Image from "next/image";
import { InvestmentOption } from "@/components/data/missions";
import { AICoach, getCoachResponse, getCoachCatchphrase } from "@/components/data/coaches";
import { getCourageXpForRisk } from "./effortRewards";

// Learning outcomes based on risk level
const learningOutcomes: Record<string, string[]> = {
  high: [
    "How market bubbles form and burst",
    "The psychology of FOMO vs. rational investing",
    "Why high returns often come with hidden risks",
  ],
  extreme: [
    "The importance of risk management",
    "How crises create opportunities",
    "Why diversification matters in volatility",
  ],
  medium: [
    "How to balance risk and reward",
    "The power of steady, consistent growth",
    "Why patience beats panic in investing",
  ],
  low: [
    "The magic of compound interest",
    "Why 'boring' investments often win",
    "Building foundations for riskier plays",
  ],
  none: [
    "The value of capital preservation",
    "When cash is the smartest choice",
    "How liquidity gives you options",
  ],
};

// Worst-case scenarios
const worstCaseScenarios: Record<string, { percent: string; description: string }> = {
  extreme: { percent: "80-95%", description: "Maximum risk, maximum learning" },
  high: { percent: "40-70%", description: "Significant downside possible" },
  medium: { percent: "20-40%", description: "Moderate risk exposure" },
  low: { percent: "5-15%", description: "Limited downside risk" },
  none: { percent: "0%", description: "Principal protected" },
};

// Coach-specific advice - NOW WITH ENHANCED PERSONALITY
const getCoachAdvice = (coach: AICoach | undefined, riskLevel: string): string => {
  if (!coach) return "Trust your instincts and learn from every decision!";
  
  const emoji = coach.speechStyle?.emoji || "🎯";
  const catchphrase = getCoachCatchphrase(coach);
  const isHighRisk = riskLevel === "high" || riskLevel === "extreme";
  const isSafe = riskLevel === "low" || riskLevel === "none";
  
  // Use enhanced personality system
  if (isHighRisk) {
    const response = getCoachResponse(coach, "highRisk");
    return `${emoji} ${response} Remember: "${catchphrase}"`;
  } else if (isSafe) {
    const response = getCoachResponse(coach, "safeChoice");
    return `${emoji} ${response}`;
  }
  
  // Fallback to static advice with personality
  const coachAdvice: Record<string, Record<string, string>> = {
    "steady-sam": {
      extreme: `${emoji} Whoa! This is risky, but if you want to learn the hard way... "${catchphrase}"`,
      high: `${emoji} Pretty risky for my taste, but I respect the courage! Never invest more than you can afford to learn from.`,
      medium: `${emoji} Now we're talking! A balanced approach - exactly what I like! "${catchphrase}"`,
      low: `${emoji} This is my style! Slow and steady wins the race. You're building a solid foundation here.`,
      none: `${emoji} Smart move! Sometimes cash is king. "${catchphrase}"`,
    },
    "growth-guru": {
      extreme: `${emoji} Going all in! I appreciate the ambition - remember diversification is key even when being bold!`,
      high: `${emoji} Now you're thinking like a growth investor! Make sure this fits your portfolio balance.`,
      medium: `${emoji} Perfect balance! Growth with guardrails - exactly how I'd approach it! "${catchphrase}"`,
      low: `${emoji} Playing it safe - not bad! Just don't forget to allocate some for growth too.`,
      none: `${emoji} Cash has its place! Great for rebalancing when markets dip.`,
    },
    "adventure-alex": {
      extreme: `${emoji} YES! THIS is what I'm talking about! Fortune favors the bold! "${catchphrase}"`,
      high: `${emoji} Good energy! You're embracing the growth mindset. Time in market beats timing the market!`,
      medium: `${emoji} A bit conservative for my taste, but balance is... fine, I guess.`,
      low: `${emoji} Playing it safe, huh? Nothing ventured, nothing gained!`,
      none: `${emoji} Cash?! You're killing me! But okay, even I keep some dry powder...`,
    },
    "yield-yoda": {
      extreme: `${emoji} Risky this is! But learn you will, profit or not. "${catchphrase}"`,
      high: `${emoji} Bold choice, young padawan! Income-generating assets exist at every risk level.`,
      medium: `${emoji} Balanced approach, I sense! Many dividend stocks live here. Wise!`,
      low: `${emoji} Income seekers love this zone! Bonds and dividends await. "${catchphrase}"`,
      none: `${emoji} Cash flow important is! Preserve capital now, compound later. Patient investors win!`,
    },
  };
  
  return coachAdvice[coach.id]?.[riskLevel] || `${emoji} ${coach.investmentPhilosophy}`;
};

interface RiskPreviewCardProps {
  option: InvestmentOption;
  onConfirm: () => void;
  onCancel: () => void;
  onCourageXpEarned?: (xp: number, label: string) => void;
  coach?: AICoach;
}

export function RiskPreviewCard({
  option,
  onConfirm,
  onCancel,
  onCourageXpEarned,
  coach,
}: RiskPreviewCardProps) {
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [courageLevel, setCourageLevel] = useState(0);
  const [acknowledged, setAcknowledged] = useState(false);
  const [pulseReward, setPulseReward] = useState(false);

  const riskLevel = option.risk.toLowerCase();
  const courageReward = getCourageXpForRisk(riskLevel);
  const learnings = learningOutcomes[riskLevel] || learningOutcomes.medium;
  const worstCase = worstCaseScenarios[riskLevel] || worstCaseScenarios.medium;
  const coachAdvice = getCoachAdvice(coach, riskLevel);

  // Animate courage meter
  useEffect(() => {
    if (showFullPreview) {
      const timer = setTimeout(() => setCourageLevel(100), 500);
      return () => clearTimeout(timer);
    }
  }, [showFullPreview]);

  // Pulse reward animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseReward(true);
      setTimeout(() => setPulseReward(false), 600);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleConfirmInvestment = () => {
    if (onCourageXpEarned) {
      onCourageXpEarned(courageReward.xp, courageReward.label);
    }
    onConfirm();
  };

  const getRiskGradient = (risk: string) => {
    switch (risk) {
      case "extreme": return "from-red-500 via-rose-500 to-orange-500";
      case "high": return "from-orange-500 via-amber-500 to-yellow-500";
      case "medium": return "from-amber-400 via-yellow-400 to-lime-400";
      case "low": return "from-emerald-400 via-green-400 to-teal-400";
      case "none": return "from-blue-400 via-cyan-400 to-teal-400";
      default: return "from-slate-400 to-slate-500";
    }
  };

  const getRiskBgLight = (risk: string) => {
    switch (risk) {
      case "extreme": return "from-red-50 via-rose-50 to-orange-50";
      case "high": return "from-orange-50 via-amber-50 to-yellow-50";
      case "medium": return "from-amber-50 via-yellow-50 to-lime-50";
      case "low": return "from-emerald-50 via-green-50 to-teal-50";
      case "none": return "from-blue-50 via-cyan-50 to-teal-50";
      default: return "from-slate-50 to-slate-100";
    }
  };

  // ========================================
  // INITIAL STATE - "Before You Invest"
  // ========================================
  if (!showFullPreview) {
    return (
      <Card className="relative overflow-hidden border-0 shadow-2xl
        bg-gradient-to-br from-white via-slate-50 to-violet-50
        dark:from-slate-900 dark:via-slate-800 dark:to-violet-950">
        
        {/* Decorative Elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-2xl" />
        
        <CardContent className="relative p-6 sm:p-8">
          {/* Hero Section */}
          <div className="text-center space-y-5">
            
            {/* Animated Diamond Icon */}
            <div className="relative inline-flex">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur-lg opacity-50 animate-pulse" />
              <div className="relative p-4 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 shadow-xl shadow-violet-500/30">
                <Diamond className="h-8 w-8 text-white" />
              </div>
              {/* Sparkle Effects */}
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-amber-400 animate-bounce" />
              <Star className="absolute -bottom-1 -left-1 h-3 w-3 text-violet-400 animate-pulse" />
            </div>
            
            {/* Title */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
                Before You Invest...
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
                Take a moment to understand what you're getting into.
                <span className="block mt-1 font-semibold text-violet-600 dark:text-violet-400">
                  Every choice is a learning opportunity!
                </span>
              </p>
            </div>
            
            {/* Investment Preview Card */}
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${getRiskBgLight(riskLevel)} dark:from-slate-800 dark:to-slate-800/50 border border-slate-200 dark:border-slate-700`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{courageReward.emoji}</span>
                  <div className="text-left">
                    <h4 className="font-bold text-slate-800 dark:text-white">{option.name}</h4>
                    <Badge className={`bg-gradient-to-r ${getRiskGradient(riskLevel)} text-white border-0 text-[10px]`}>
                      {option.risk} Risk
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Expected</p>
                  <p className="font-bold text-slate-800 dark:text-white">{option.expectedReturn}</p>
                </div>
              </div>
              
              {/* Risk Meter Visual */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">Risk Level</span>
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${getRiskGradient(riskLevel)} transition-all duration-1000`}
                    style={{ width: riskLevel === 'extreme' ? '95%' : riskLevel === 'high' ? '75%' : riskLevel === 'medium' ? '50%' : riskLevel === 'low' ? '25%' : '5%' }}
                  />
                </div>
              </div>
            </div>
            
            {/* Courage Reward Banner */}
            <div className={`relative overflow-hidden rounded-2xl p-4 transition-all duration-300 ${pulseReward ? 'scale-[1.02]' : 'scale-100'}`}>
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/15 to-cyan-500/10 dark:from-emerald-500/20 dark:via-teal-500/25 dark:to-cyan-500/20" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-400/20 via-transparent to-transparent dark:from-emerald-400/30" />
              
              {/* Border Glow Effect */}
              <div className="absolute inset-0 rounded-2xl border-2 border-emerald-400/30 dark:border-emerald-500/40" />
              
              <div className="relative flex items-center justify-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">Courage Reward</p>
                  <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    +{courageReward.xp} {III_CONFIG.symbol}
                  </p>
                </div>
                <Badge className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40 text-xs ml-auto">
                  <Zap className="h-3 w-3 mr-1" />
                  {courageReward.label}
                </Badge>
              </div>
              
              <p className="relative mt-3 text-xs text-emerald-700 dark:text-emerald-300/80 text-center">
                You earn {III_CONFIG.symbol} for having the courage to try — win or lose! 💪
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <Clock className="h-4 w-4 mx-auto text-violet-500 mb-1" />
                <p className="text-xs text-slate-500 dark:text-slate-400">Duration</p>
                <p className="font-bold text-slate-800 dark:text-white text-sm">2-3 min</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <BookOpen className="h-4 w-4 mx-auto text-amber-500 mb-1" />
                <p className="text-xs text-slate-500 dark:text-slate-400">Lessons</p>
                <p className="font-bold text-slate-800 dark:text-white text-sm">{learnings.length}+</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <Trophy className="h-4 w-4 mx-auto text-emerald-500 mb-1" />
                <p className="text-xs text-slate-500 dark:text-slate-400">Total XP</p>
                <p className="font-bold text-slate-800 dark:text-white text-sm">+{courageReward.xp + 15}</p>
              </div>
            </div>
            
            {/* CTA Button */}
            <Button 
              onClick={() => setShowFullPreview(true)}
              size="lg"
              className="w-full min-h-[56px] text-base font-bold bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 hover:from-violet-600 hover:via-purple-600 hover:to-indigo-600 shadow-xl shadow-violet-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Brain className="h-5 w-5 mr-2" />
              Show Me What I Need to Know
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              "The best investors learn from every decision"
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ========================================
  // FULL PREVIEW STATE
  // ========================================
  return (
    <Card className="relative overflow-hidden border-0 shadow-2xl
      bg-white dark:bg-slate-900">
      
      {/* Header with Risk Gradient */}
      <div className={`relative p-5 bg-gradient-to-r ${getRiskGradient(riskLevel)}`}>
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
              <span className="text-3xl">{courageReward.emoji}</span>
            </div>
            <div>
              <h3 className="font-black text-white text-xl mb-1">{option.name}</h3>
              <div className="flex items-center gap-2">
                <Badge className="bg-white/20 text-white border-white/30 text-xs backdrop-blur-sm">
                  {option.risk} Risk
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30 text-xs backdrop-blur-sm">
                  {option.assetClass}
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-xs font-medium">Expected Return</p>
            <p className="text-white font-black text-2xl">{option.expectedReturn}</p>
          </div>
        </div>
      </div>

      <CardContent className="p-5 space-y-5">
        
        {/* Courage Meter */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 border border-amber-200 dark:border-amber-500/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 shadow-md">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-amber-800 dark:text-amber-300">Courage Meter</span>
            </div>
            <Badge className="bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-500/40 shadow-sm">
              +{courageReward.xp} {III_CONFIG.symbol}
            </Badge>
          </div>
          
          {/* Animated Progress Bar */}
          <div className="relative h-4 bg-amber-200 dark:bg-amber-900/50 rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${courageLevel}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
            {courageLevel === 100 && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Flame className="h-3 w-3 text-white animate-pulse" />
              </div>
            )}
          </div>
          
          <p className="text-xs text-amber-700 dark:text-amber-300/80 text-center mt-2">
            You earn {III_CONFIG.symbol} for courage — regardless of outcome!
          </p>
        </div>

        {/* Two Column: Risk & Learning */}
        <div className="grid sm:grid-cols-2 gap-4">
          
          {/* Potential Downside */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-500/10 dark:to-rose-500/10 border border-red-200 dark:border-red-500/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-red-400 to-rose-500">
                <TrendingDown className="h-4 w-4 text-white" />
              </div>
              <h4 className="font-bold text-red-800 dark:text-red-300">Potential Downside</h4>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-red-600 dark:text-red-400">Max Loss</span>
                <span className="font-black text-red-700 dark:text-red-300 text-lg">{worstCase.percent}</span>
              </div>
              <p className="text-xs text-red-600 dark:text-red-400">{worstCase.description}</p>
              
              {option.riskReturnProfile && (
                <div className="pt-2 border-t border-red-200 dark:border-red-500/30">
                  <p className="text-[10px] text-red-500 dark:text-red-400">
                    <strong>Volatility:</strong> {option.riskReturnProfile.historicalVolatility}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* What You'll Learn */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10 border border-emerald-200 dark:border-emerald-500/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500">
                <Lightbulb className="h-4 w-4 text-white" />
              </div>
              <h4 className="font-bold text-emerald-800 dark:text-emerald-300">What You'll Learn</h4>
            </div>
            
            <ul className="space-y-2">
              {learnings.map((learning, index) => (
                <li key={index} className="flex items-start gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>{learning}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Coach Advice */}
        <div className={`p-4 rounded-2xl ${
          coach 
            ? "bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 border border-slate-700" 
            : "bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-500/10 dark:to-purple-500/10 border border-violet-200 dark:border-violet-500/30"
        }`}>
          <div className="flex items-start gap-3">
            {coach ? (
              <>
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-violet-400 shadow-lg shadow-violet-500/30">
                    <Image
                      src={coach.avatar}
                      alt={coach.name}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-800" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <p className="font-bold text-white">{coach.name}</p>
                    <Badge className="bg-violet-500/30 text-violet-300 border-violet-500/50 text-[10px]">
                      {coach.personality}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{coachAdvice}</p>
                </div>
              </>
            ) : (
              <>
                <div className="p-2 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex-shrink-0">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-violet-800 dark:text-violet-300 mb-1">Remember...</p>
                  <p className="text-sm text-violet-700 dark:text-violet-300/80">
                    Every investment teaches something valuable, whether it makes money or not! 💪
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Rewards Summary */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500">
              <Award className="h-4 w-4 text-white" />
            </div>
            <h4 className="font-bold text-slate-800 dark:text-white">Rewards You'll Earn</h4>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { icon: Zap, label: "Courage", value: `+${courageReward.xp}`, color: "text-amber-500" },
              { icon: BookOpen, label: "Learning", value: "+5", color: "text-emerald-500" },
              { icon: Target, label: "Completion", value: "+10", color: "text-violet-500" },
              { icon: GraduationCap, label: "Badge", value: "🏅", color: "text-blue-500" },
            ].map((reward, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                <reward.icon className={`h-4 w-4 ${reward.color}`} />
                <div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{reward.label}</p>
                  <p className="font-bold text-xs text-slate-800 dark:text-white">{reward.value}</p>
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center mt-3 italic">
            Rewards for effort, not just profit! 🎯
          </p>
        </div>

        {/* Acknowledgment */}
        <label className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-violet-300 dark:hover:border-violet-500/50 transition-colors">
          <div className="relative">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
              acknowledged 
                ? 'bg-violet-500 border-violet-500' 
                : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600'
            }`}>
              {acknowledged && <CheckCircle2 className="h-4 w-4 text-white" />}
            </div>
          </div>
          <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            I understand the risks and I'm ready to learn from this experience, whether I make money or not! 📚
          </span>
        </label>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleConfirmInvestment}
            disabled={!acknowledged}
            size="lg"
            className="flex-1 min-h-[52px] font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Shield className="h-5 w-5 mr-2" />
            I'm Ready — Let's Do This! 🚀
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={onCancel}
            className="min-h-[52px] border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Reconsider
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default RiskPreviewCard;
