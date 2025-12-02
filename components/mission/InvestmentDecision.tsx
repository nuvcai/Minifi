import React, { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DollarSign, BarChart3, InfoIcon, Clock, TrendingUp, Sparkles } from "lucide-react";
import { InvestmentOption, AssetClass, TimeHorizon } from "@/components/data/missions";
import { AICoach } from "@/components/data/coaches";
import { RiskPreviewCard } from "@/components/gamification/RiskPreviewCard";
import { CourageXpNotification } from "@/components/gamification/CourageXpNotification";
import { InlineFloatingXp } from "@/components/gamification/FloatingXp";
import { getCourageXpForRisk } from "@/components/gamification/effortRewards";

// Asset class display configuration
const assetClassDisplay: Record<AssetClass, { label: string; emoji: string; color: string }> = {
  equities: { label: "Stocks", emoji: "📈", color: "bg-blue-100 text-blue-800" },
  fixed_income: { label: "Bonds", emoji: "📊", color: "bg-green-100 text-green-800" },
  commodities: { label: "Commodities", emoji: "🥇", color: "bg-yellow-100 text-yellow-800" },
  alternatives: { label: "Alternatives", emoji: "🏢", color: "bg-purple-100 text-purple-800" },
  cash: { label: "Cash", emoji: "💵", color: "bg-slate-100 text-slate-800" },
  cryptocurrency: { label: "Crypto", emoji: "₿", color: "bg-orange-100 text-orange-800" },
};

// Time horizon display configuration
const timeHorizonDisplay: Record<TimeHorizon, { label: string; description: string }> = {
  short: { label: "Short-term", description: "0-1 years" },
  medium: { label: "Medium-term", description: "1-5 years" },
  long: { label: "Long-term", description: "5+ years" },
};

interface InvestmentDecisionProps {
  options: InvestmentOption[];
  selectedInvestment: string | null;
  onInvestmentSelect: (optionId: string) => void;
  onConfirm: () => void;
  onBack: () => void;
  onCourageXpEarned?: (xp: number, label: string) => void;
  selectedCoach?: AICoach;
}

export function InvestmentDecision({
  options,
  selectedInvestment,
  onInvestmentSelect,
  onConfirm,
  onBack,
  onCourageXpEarned,
  selectedCoach,
}: InvestmentDecisionProps) {
  const [showRiskPreview, setShowRiskPreview] = useState(false);
  const [courageNotification, setCourageNotification] = useState<{
    xp: number;
    label: string;
  } | null>(null);
  
  // Track which card is showing floating XP
  const [floatingXpCard, setFloatingXpCard] = useState<string | null>(null);

  const selectedOption = selectedInvestment
    ? options.find((o) => o.id === selectedInvestment)
    : null;
    
  // Handle card selection with floating XP feedback
  const handleCardSelect = useCallback((optionId: string) => {
    onInvestmentSelect(optionId);
    setFloatingXpCard(optionId);
  }, [onInvestmentSelect]);

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "extreme":
        return "destructive" as const;
      case "high":
        return "secondary" as const;
      case "medium":
        return "outline" as const;
      case "low":
        return "default" as const;
      case "none":
        return "default" as const;
      default:
        return "default" as const;
    }
  };


  const handleConfirmClick = () => {
    if (selectedOption) {
      setShowRiskPreview(true);
    }
  };

  const handleRiskPreviewConfirm = () => {
    if (selectedOption) {
      // Award courage XP
      const reward = getCourageXpForRisk(selectedOption.risk);
      setCourageNotification(reward);
      
      if (onCourageXpEarned) {
        onCourageXpEarned(reward.xp, reward.label);
      }
      
      // Delay the actual confirm to show notification
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
        {/* Courage XP Notification */}
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

      {/* Effort-Based Rewards Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-lg p-3">
        <div className="flex items-center gap-2 justify-center">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span className="text-sm font-medium text-amber-300">
            Every choice earns Courage XP! The more you try, the more you learn. 🎯
          </span>
          <Sparkles className="h-4 w-4 text-amber-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => {
          const courageReward = getCourageXpForRisk(option.risk);
          const isSelected = selectedInvestment === option.id;
          const showFloating = floatingXpCard === option.id;
          
          return (
            <Card
              key={option.id}
              className={`cursor-pointer transition-all hover:shadow-md relative ${
                isSelected
                  ? "border-primary bg-primary/5 animate-xp-shake"
                  : ""
              }`}
              onClick={() => handleCardSelect(option.id)}
            >
              {/* Floating XP on selection */}
              <InlineFloatingXp
                show={showFloating}
                amount={courageReward.xp}
                type="courage"
                onComplete={() => setFloatingXpCard(null)}
                className="z-10"
              />
              
              <CardContent>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{option.name}</h4>
                      <Badge variant={getRiskBadgeVariant(option.risk)}>
                        {option.risk} Risk
                      </Badge>
                    </div>
                    
                    {/* Courage XP Preview */}
                    <div className={`flex items-center gap-1 text-xs transition-colors ${
                      isSelected ? "text-amber-400" : "text-amber-600"
                    }`}>
                      <Sparkles className={`h-3 w-3 ${isSelected ? "animate-pulse" : ""}`} />
                      <span>+{courageReward.xp} Courage XP</span>
                    </div>
                    
                    {/* Asset Class & Time Horizon Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {option.assetClass && (
                        <Badge className={`text-xs ${assetClassDisplay[option.assetClass].color}`}>
                          {assetClassDisplay[option.assetClass].emoji} {assetClassDisplay[option.assetClass].label}
                        </Badge>
                      )}
                      {option.timeHorizon && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="outline" className="text-xs cursor-help">
                              <Clock className="h-3 w-3 mr-1" />
                              {timeHorizonDisplay[option.timeHorizon].label}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">
                              <strong>Suggested holding period:</strong> {timeHorizonDisplay[option.timeHorizon].description}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      {option.foAllocationRange && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="outline" className="text-xs cursor-help bg-emerald-50 text-emerald-700 border-emerald-200">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              FO: {option.foAllocationRange}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">
                              <strong>Family Office typical allocation:</strong> {option.foAllocationRange} of portfolio
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    
                    <div className="flex justify-start">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon 
                          className="h-4 w-4 text-muted-foreground hover:text-primary cursor-help transition-all duration-300 hover:animate-none hover:shadow-lg hover:shadow-primary/30 hover:scale-110" 
                          style={{
                            animation: 'pulse 1.5s ease-in-out infinite',
                            animationTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)'
                          }}
                        />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs">{option.investmentInsight}</p>
                          {option.riskReturnProfile && (
                            <p className="text-xs mt-1 pt-1 border-t border-slate-200">
                              <strong>Volatility:</strong> {option.riskReturnProfile.historicalVolatility}
                            </p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <span>Expected Return: {option.expectedReturn}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleConfirmClick}
          disabled={!selectedInvestment}
          className="flex-1 font-medium bg-gradient-to-r from-primary to-secondary"
        >
          <DollarSign className="h-4 w-4 mr-2" />
          Review & Confirm 🎯
        </Button>
        <Button variant="outline" onClick={onBack}>
          Wait, Let Me Think...
        </Button>
      </div>
    </div>
  );
}
