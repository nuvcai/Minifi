/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   📊 WHAT IF ANALYSIS - Post-Mission Alternative Outcomes                    ║
 * ║   Shows how all investment options actually performed                        ║
 * ║   Family Office Principle: Learn from every possible outcome                 ║
 * ║   Copyright (c) 2025 NUVC.AI. All Rights Reserved.                          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Lightbulb,
  ChevronRight,
  BarChart3,
  Shield,
  Sparkles,
  Star,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { InvestmentOption } from "@/components/data/missions";

interface WhatIfAnalysisProps {
  options: InvestmentOption[];
  selectedOptionId: string;
  initialInvestment: number;
  onContinue: () => void;
  onXpEarned?: (amount: number) => void;
}

// Calculate final amount based on actual return
const calculateFinalAmount = (initial: number, returnPercent: number): number => {
  return initial * (1 + returnPercent / 100);
};

// Get risk level color
const getRiskColor = (risk: string): string => {
  switch (risk.toLowerCase()) {
    case "extreme": return "text-red-500 bg-red-500/10 border-red-500/30";
    case "high": return "text-orange-500 bg-orange-500/10 border-orange-500/30";
    case "medium": return "text-amber-500 bg-amber-500/10 border-amber-500/30";
    case "low": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/30";
    default: return "text-slate-500 bg-slate-500/10 border-slate-500/30";
  }
};

// Get return color
const getReturnColor = (returnValue: number): string => {
  if (returnValue >= 20) return "text-emerald-400";
  if (returnValue > 0) return "text-green-400";
  if (returnValue > -20) return "text-orange-400";
  return "text-red-400";
};

// Family Office Insights based on outcomes
const getFOInsight = (options: InvestmentOption[], selectedId: string): string => {
  const selected = options.find(o => o.id === selectedId);
  const bestOption = [...options].sort((a, b) => b.actualReturn - a.actualReturn)[0];
  const worstOption = [...options].sort((a, b) => a.actualReturn - b.actualReturn)[0];
  
  if (!selected) return "";
  
  const selectedRank = [...options]
    .sort((a, b) => b.actualReturn - a.actualReturn)
    .findIndex(o => o.id === selectedId) + 1;
  
  if (selectedRank === 1) {
    return "🏆 Outstanding! You made the optimal choice for this market event. Family Offices succeed by thoroughly analyzing opportunities before acting.";
  } else if (selectedRank === 2) {
    return `💎 Solid choice! While ${bestOption.name} performed best, your selection showed good judgement. FO Principle: Near-optimal decisions compound into great wealth.`;
  } else if (selected.actualReturn > 0) {
    return "✅ You achieved positive returns! Remember: preservation of capital is the first rule. Making money, even if not the maximum, is always a win.";
  } else if (selected.actualReturn > worstOption.actualReturn) {
    return `📚 Learning moment: While you experienced losses, ${worstOption.name} did worse. Risk management protected you from the worst outcome.`;
  } else {
    return `💪 This was a tough market! Even experienced investors struggle here. The key lesson: diversification across ${bestOption.assetClass} would have helped.`;
  }
};

export function WhatIfAnalysis({
  options,
  selectedOptionId,
  initialInvestment,
  onContinue,
  onXpEarned,
}: WhatIfAnalysisProps) {
  const [viewedInsights, setViewedInsights] = useState<Set<string>>(new Set());
  const [showDetailedView, setShowDetailedView] = useState(false);

  // Sort options by actual return (best to worst)
  const sortedOptions = useMemo(() => 
    [...options].sort((a, b) => b.actualReturn - a.actualReturn),
    [options]
  );

  const selectedOption = options.find(o => o.id === selectedOptionId);
  const bestOption = sortedOptions[0];
  const worstOption = sortedOptions[sortedOptions.length - 1];
  
  // Calculate rank of selected option
  const selectedRank = sortedOptions.findIndex(o => o.id === selectedOptionId) + 1;
  
  // Calculate spread between best and worst
  const returnSpread = bestOption.actualReturn - worstOption.actualReturn;

  // Handle insight view for XP
  const handleViewInsight = (optionId: string) => {
    if (!viewedInsights.has(optionId)) {
      setViewedInsights(prev => new Set([...prev, optionId]));
      if (onXpEarned) {
        onXpEarned(3); // Small XP for exploring
      }
    }
  };

  // FO Insight
  const foInsight = getFOInsight(options, selectedOptionId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-violet-100 border border-indigo-300 mb-4">
          <BarChart3 className="h-4 w-4 text-indigo-600" />
          <span className="text-sm font-medium text-indigo-700">Parallel Universes Analysis</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          What If You'd Chosen Differently? 🔮
        </h3>
        <p className="text-sm text-gray-500 max-w-lg mx-auto">
          Family Offices always analyze every possible outcome. Here's how each option actually performed.
        </p>
      </div>

      {/* Your Choice Summary */}
      <Card className="bg-gradient-to-r from-indigo-50 to-violet-50 border-indigo-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                selectedOption && selectedOption.actualReturn >= 0 
                  ? "bg-emerald-100 border border-emerald-300" 
                  : "bg-orange-100 border border-orange-300"
              }`}>
                <span className="text-2xl">
                  {selectedRank === 1 ? "🏆" : selectedRank === 2 ? "🥈" : selectedRank === 3 ? "🥉" : "📊"}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Your Choice</p>
                <p className="font-semibold text-gray-900">{selectedOption?.name}</p>
                <p className="text-xs text-gray-500">
                  Ranked #{selectedRank} of {options.length} options
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${getReturnColor(selectedOption?.actualReturn || 0)}`}>
                {selectedOption && selectedOption.actualReturn >= 0 ? "+" : ""}
                {selectedOption?.actualReturn}%
              </p>
              <p className="text-sm text-gray-500">
                ${calculateFinalAmount(initialInvestment, selectedOption?.actualReturn || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All Options Comparison */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-600 flex items-center gap-2">
          <Target className="h-4 w-4 text-indigo-600" />
          All Possible Outcomes
        </h4>
        
        {sortedOptions.map((option, index) => {
          const isSelected = option.id === selectedOptionId;
          const finalAmount = calculateFinalAmount(initialInvestment, option.actualReturn);
          const isViewed = viewedInsights.has(option.id);
          const isBest = index === 0;
          const isWorst = index === sortedOptions.length - 1;
          
          // Calculate bar width based on return range
          const normalizedReturn = ((option.actualReturn - worstOption.actualReturn) / returnSpread) * 100;
          
          return (
            <Card 
              key={option.id}
              className={`transition-all duration-300 cursor-pointer hover:scale-[1.01] ${
                isSelected 
                  ? "bg-gradient-to-r from-indigo-50 to-violet-50 border-indigo-300 ring-2 ring-indigo-200" 
                  : "bg-white border-gray-200 hover:border-gray-300 shadow-sm"
              }`}
              onClick={() => handleViewInsight(option.id)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Option Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${
                        isBest ? "bg-emerald-100" : isWorst ? "bg-red-100" : "bg-gray-100"
                      }`}>
                        {isBest ? "🏆" : isWorst ? "💀" : `#${index + 1}`}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{option.name}</span>
                          {isSelected && (
                            <Badge className="text-xs bg-indigo-100 text-indigo-700 border-indigo-300">
                              Your Choice
                            </Badge>
                          )}
                          {isBest && !isSelected && (
                            <Badge className="text-xs bg-emerald-100 text-emerald-700 border-emerald-300">
                              Best Performer
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-xs ${getRiskColor(option.risk)}`}>
                            {option.risk} Risk
                          </Badge>
                          {option.assetClass && (
                            <span className="text-xs text-gray-500">
                              {option.assetClass === "equities" ? "📈 Stocks" :
                               option.assetClass === "fixed_income" ? "📊 Bonds" :
                               option.assetClass === "commodities" ? "🥇 Commodities" :
                               option.assetClass === "cash" ? "💵 Cash" : "🏢 Alternatives"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${getReturnColor(option.actualReturn)}`}>
                        {option.actualReturn >= 0 ? "+" : ""}{option.actualReturn}%
                      </p>
                      <p className="text-xs text-gray-500">
                        ${finalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Performance Bar */}
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
                        option.actualReturn >= 0 
                          ? "bg-gradient-to-r from-emerald-500 to-teal-400" 
                          : "bg-gradient-to-r from-red-500 to-orange-400"
                      }`}
                      style={{ width: `${Math.max(5, normalizedReturn)}%` }}
                    />
                  </div>
                  
                  {/* Investment Insight (revealed on click) */}
                  {isViewed && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {option.investmentInsight}
                        </p>
                      </div>
                      {!isViewed && (
                        <div className="flex items-center gap-1 mt-2">
                          <Sparkles className="h-3 w-3 text-amber-500" />
                          <span className="text-xs text-amber-600">+3 XP for exploring!</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Click to reveal hint */}
                  {!isViewed && (
                    <p className="text-xs text-gray-400 text-center">
                      Click to reveal insight (+3 XP)
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Family Office Wisdom */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Award className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-semibold text-amber-700 text-sm mb-1">
                Family Office Insight
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {foInsight}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Learning Card */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" />
            Key Takeaways for Your Investment Journey
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-700">Best Performer</span>
              </div>
              <p className="text-sm text-gray-900 font-medium">{bestOption.name}</p>
              <p className="text-xs text-gray-500">{bestOption.actualReturn >= 0 ? "+" : ""}{bestOption.actualReturn}% return</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="h-4 w-4 text-gray-500" />
                <span className="text-xs font-medium text-gray-600">Return Spread</span>
              </div>
              <p className="text-sm text-gray-900 font-medium">{returnSpread.toFixed(0)}% difference</p>
              <p className="text-xs text-gray-500">Between best & worst</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-xs font-medium text-red-700">Highest Risk</span>
              </div>
              <p className="text-sm text-gray-900 font-medium">{worstOption.name}</p>
              <p className="text-xs text-gray-500">{worstOption.actualReturn >= 0 ? "+" : ""}{worstOption.actualReturn}% return</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress indicator for exploration XP */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <Sparkles className="h-3 w-3 text-amber-500" />
        <span>Insights explored: {viewedInsights.size}/{options.length}</span>
        <Progress value={(viewedInsights.size / options.length) * 100} className="w-20 h-1.5" />
      </div>

      {/* Continue Button */}
      <Button 
        onClick={onContinue}
        className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600"
      >
        Continue to Mission Summary
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
}

export default WhatIfAnalysis;

