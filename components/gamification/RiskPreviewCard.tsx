/**
 * RiskPreviewCard - Loss Aversion Gamification Component
 * 
 * This component shows potential risks AND learning opportunities before
 * an investment decision. It rewards courage and effort over outcomes.
 * 
 * Philosophy: "Every investment teaches something valuable, whether it 
 * makes money or not. The only real loss is not trying."
 */

"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  Lightbulb,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Shield,
  Brain,
  Trophy,
  Zap,
  ChevronRight,
  BookOpen,
  Target,
} from "lucide-react";
import { InvestmentOption } from "@/components/data/missions";

// Learning outcomes based on risk level and asset class
const learningOutcomes: Record<string, string[]> = {
  high: [
    "How market bubbles form and burst 🫧",
    "The psychology of FOMO vs. rational investing 🧠",
    "Why high returns often come with hidden risks 📊",
    "How to spot warning signs before a crash 🚨",
  ],
  extreme: [
    "The importance of risk management 🛡️",
    "How crises create both dangers AND opportunities 💡",
    "Why diversification matters during volatility 🎯",
    "Historical patterns that repeat in markets 📈",
  ],
  medium: [
    "How to balance risk and reward ⚖️",
    "The power of steady, consistent growth 🌱",
    "Why patience beats panic in investing 🧘",
    "How different asset classes work together 🔗",
  ],
  low: [
    "The magic of compound interest over time 📈",
    "Why 'boring' investments often win long-term 🏆",
    "How to protect wealth during uncertainty 🛡️",
    "Building a foundation for riskier plays later 🚀",
  ],
  none: [
    "The value of capital preservation 💰",
    "When cash is the smartest investment 🧠",
    "Opportunity cost and waiting for the right moment ⏰",
    "How liquidity gives you options 🔓",
  ],
};

// Courage XP rewards based on risk level
const courageXpRewards: Record<string, { xp: number; label: string }> = {
  extreme: { xp: 25, label: "Fearless Explorer" },
  high: { xp: 20, label: "Bold Investor" },
  medium: { xp: 15, label: "Balanced Thinker" },
  low: { xp: 10, label: "Steady Hand" },
  none: { xp: 5, label: "Cautious Planner" },
};

// Worst-case scenarios (educational, not scary)
const worstCaseScenarios: Record<string, string> = {
  extreme: "Up to 80-95% of your investment could be at risk in worst-case scenarios.",
  high: "You might see your investment drop 40-70% if things go wrong.",
  medium: "There's potential for 20-40% losses in challenging markets.",
  low: "Losses are typically limited to 5-15%, even in tough times.",
  none: "Your principal is protected, though inflation may reduce buying power.",
};

// Encouraging messages based on risk level
const encouragementMessages: Record<string, string> = {
  extreme: "Taking big risks takes real courage! Even if this doesn't work out, you'll learn lessons worth more than money. 💪",
  high: "Bold moves teach bold lessons! The best investors learned from their risky decisions - win or lose. 🌟",
  medium: "Smart balance! You're learning that good investing isn't about extremes. 🎯",
  low: "Protecting your foundation is a real skill! Patient investors often win in the end. 🏆",
  none: "Sometimes the bravest move is doing nothing. Timing is everything! ⏰",
};

interface RiskPreviewCardProps {
  option: InvestmentOption;
  onConfirm: () => void;
  onCancel: () => void;
  onCourageXpEarned?: (xp: number, label: string) => void;
}

export function RiskPreviewCard({
  option,
  onConfirm,
  onCancel,
  onCourageXpEarned,
}: RiskPreviewCardProps) {
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [courageLevel, setCourageLevel] = useState(0);
  const [acknowledged, setAcknowledged] = useState(false);

  const riskLevel = option.risk.toLowerCase();
  const riskInfo = option.riskReturnProfile;
  const courageReward = courageXpRewards[riskLevel] || courageXpRewards.medium;
  const learnings = learningOutcomes[riskLevel] || learningOutcomes.medium;
  const worstCase = worstCaseScenarios[riskLevel] || worstCaseScenarios.medium;
  const encouragement = encouragementMessages[riskLevel] || encouragementMessages.medium;

  // Animate courage meter when preview is shown
  useEffect(() => {
    if (showFullPreview) {
      const timer = setTimeout(() => {
        setCourageLevel(100);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showFullPreview]);

  const handleConfirmInvestment = () => {
    // Award courage XP before confirming
    if (onCourageXpEarned) {
      onCourageXpEarned(courageReward.xp, courageReward.label);
    }
    onConfirm();
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "extreme":
        return "from-red-500 to-orange-500";
      case "high":
        return "from-orange-500 to-amber-500";
      case "medium":
        return "from-amber-500 to-yellow-500";
      case "low":
        return "from-green-500 to-emerald-500";
      case "none":
        return "from-blue-500 to-cyan-500";
      default:
        return "from-slate-500 to-slate-400";
    }
  };

  const getRiskEmoji = (risk: string) => {
    switch (risk) {
      case "extreme": return "🔥";
      case "high": return "⚡";
      case "medium": return "⚖️";
      case "low": return "🛡️";
      case "none": return "💎";
      default: return "📊";
    }
  };

  if (!showFullPreview) {
    return (
      <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h3 className="font-semibold text-lg">Before You Invest...</h3>
            </div>
            
            <p className="text-muted-foreground">
              Take a moment to understand what you're getting into. 
              <span className="font-medium text-primary"> Every choice is a learning opportunity!</span>
            </p>

            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-lg p-4 border border-emerald-500/20">
              <div className="flex items-center gap-2 justify-center">
                <Sparkles className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-700">
                  +{courageReward.xp} Courage XP for trying this investment!
                </span>
              </div>
            </div>

            <Button 
              onClick={() => setShowFullPreview(true)}
              className="w-full bg-gradient-to-r from-primary to-secondary"
            >
              <Brain className="h-4 w-4 mr-2" />
              Show Me What I Need to Know
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/30 overflow-hidden">
      {/* Header with risk gradient */}
      <div className={`bg-gradient-to-r ${getRiskColor(riskLevel)} p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getRiskEmoji(riskLevel)}</span>
            <div>
              <h3 className="font-bold text-white text-lg">{option.name}</h3>
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                {option.risk} Risk Investment
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-xs">Expected Return</p>
            <p className="text-white font-bold">{option.expectedReturn}</p>
          </div>
        </div>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Courage Meter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">Courage Meter</span>
            </div>
            <Badge className="bg-amber-100 text-amber-700 border-amber-200">
              +{courageReward.xp} XP • {courageReward.label}
            </Badge>
          </div>
          <Progress value={courageLevel} className="h-2 bg-amber-100" />
          <p className="text-xs text-muted-foreground text-center">
            You earn XP for having the courage to try - regardless of outcome!
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Left: What Could Go Wrong */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <h4 className="font-semibold text-red-700">Potential Downside</h4>
            </div>
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <p className="text-sm text-red-700">{worstCase}</p>
                {riskInfo && (
                  <div className="mt-3 pt-3 border-t border-red-200">
                    <p className="text-xs text-red-600">
                      <strong>Historical Volatility:</strong> {riskInfo.historicalVolatility}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: What You'll Learn */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-emerald-500" />
              <h4 className="font-semibold text-emerald-700">What You'll Learn</h4>
            </div>
            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="p-4">
                <ul className="space-y-2">
                  {learnings.slice(0, 3).map((learning, index) => (
                    <li key={index} className="text-sm text-emerald-700 flex items-start gap-2">
                      <BookOpen className="h-3 w-3 mt-1 flex-shrink-0" />
                      {learning}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Encouragement Message */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="bg-blue-500 rounded-full p-2">
              <Trophy className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-blue-800 mb-1">Remember...</p>
              <p className="text-sm text-blue-700">{encouragement}</p>
            </div>
          </div>
        </div>

        {/* Effort Rewards Section */}
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4 text-amber-600" />
              <span className="text-amber-800">Effort-Based Rewards</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-white">+{courageReward.xp}</Badge>
                <span className="text-amber-700">Courage XP</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-white">+5</Badge>
                <span className="text-amber-700">Learning XP</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-white">+10</Badge>
                <span className="text-amber-700">Completion XP</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-white">🏅</Badge>
                <span className="text-amber-700">New Badge Possible!</span>
              </div>
            </div>
            <p className="text-xs text-amber-600 mt-3 text-center italic">
              You get rewarded for trying, not just for making money!
            </p>
          </CardContent>
        </Card>

        {/* Acknowledgment Checkbox */}
        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
          <input
            type="checkbox"
            id="acknowledge"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
          />
          <label htmlFor="acknowledge" className="text-sm text-slate-600">
            I understand the risks and I'm ready to learn from this experience, 
            whether I make money or not! 📚
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleConfirmInvestment}
            disabled={!acknowledged}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
          >
            <Shield className="h-4 w-4 mr-2" />
            I'm Ready - Let's Do This! 🚀
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Let Me Reconsider
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default RiskPreviewCard;

