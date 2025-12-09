"use client";

import React, { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  AlertTriangle,
  Shield,
  Flame,
  Target,
  Sparkles,
  ChevronRight,
  Eye,
  EyeOff,
  Info,
} from "lucide-react";
import { InvestmentOption } from "@/components/data/missions";
import { getCourageXpForRisk } from "./effortRewards";

interface RiskRewardChartProps {
  options: InvestmentOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  showActualReturns?: boolean;
}

// Chart zone colors
const ZONE_COLORS = {
  ideal: "rgba(34, 197, 94, 0.12)", // Green - low risk, high return
  good: "rgba(59, 130, 246, 0.08)", // Blue - balanced
  risky: "rgba(249, 115, 22, 0.12)", // Orange - high risk/reward
  danger: "rgba(239, 68, 68, 0.15)", // Red - high risk, low return
};

// Risk level styling
const RISK_STYLES: Record<string, { color: string; bgColor: string; icon: typeof Shield }> = {
  none: { color: "text-slate-600", bgColor: "bg-slate-100 border-slate-300", icon: Shield },
  low: { color: "text-green-600", bgColor: "bg-green-100 border-green-400", icon: Shield },
  medium: { color: "text-amber-600", bgColor: "bg-amber-100 border-amber-400", icon: AlertTriangle },
  high: { color: "text-orange-600", bgColor: "bg-orange-100 border-orange-400", icon: Flame },
  extreme: { color: "text-red-600", bgColor: "bg-red-100 border-red-400", icon: Flame },
};

export function RiskRewardChart({
  options,
  selectedId,
  onSelect,
  showActualReturns = false,
}: RiskRewardChartProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showHindsight, setShowHindsight] = useState(showActualReturns);

  // Convert risk to numeric value (0-4)
  const riskToNumber = useCallback((risk: string): number => {
    const map: Record<string, number> = {
      none: 0,
      low: 1,
      medium: 2,
      high: 3,
      extreme: 4,
    };
    return map[risk.toLowerCase()] ?? 2;
  }, []);

  // Parse expected return string to get average
  const parseReturn = useCallback((returnStr: string): { min: number; max: number; avg: number } => {
    const match = returnStr.match(/(-?\d+)-?(\d+)?%?/);
    const min = match ? parseInt(match[1]) : 0;
    const max = match ? parseInt(match[2] || match[1]) : min;
    return { min, max, avg: (min + max) / 2 };
  }, []);

  // Calculate point position on chart (percentage)
  const getPointPosition = useCallback((option: InvestmentOption) => {
    const riskNum = riskToNumber(option.risk);
    const returnData = parseReturn(option.expectedReturn);
    
    // X: 8% to 92% based on risk (0-4)
    const x = 8 + (riskNum / 4) * 84;
    
    // Y: Higher returns = higher on chart (10% to 85%)
    // Normalize for typical returns: -50% to +100%
    const normalizedReturn = Math.max(-50, Math.min(100, returnData.avg));
    const y = 85 - ((normalizedReturn + 50) / 150) * 75;
    
    return { x, y, returnData };
  }, [riskToNumber, parseReturn]);

  // Get style for risk level
  const getRiskStyle = useCallback((risk: string) => {
    return RISK_STYLES[risk.toLowerCase()] || RISK_STYLES.medium;
  }, []);

  return (
    <Card className="overflow-hidden border-2 bg-gradient-to-br from-background via-background to-muted/20">
      {/* Chart Header - Mobile optimized */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-3 border-b bg-muted/30 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
            <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold truncate">Risk vs Return</h4>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Tap a point to select</p>
          </div>
        </div>
        
        {/* Hindsight Toggle - Compact on mobile */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowHindsight(!showHindsight)}
          className={`gap-1.5 h-9 sm:h-8 px-2.5 sm:px-3 text-xs sm:text-sm transition-colors flex-shrink-0 ${showHindsight ? "bg-amber-100 border-amber-300 text-amber-700" : ""}`}
        >
          {showHindsight ? <Eye className="h-4 w-4 sm:h-3.5 sm:w-3.5" /> : <EyeOff className="h-4 w-4 sm:h-3.5 sm:w-3.5" />}
          <span className="hidden xs:inline">{showHindsight ? "Hide" : "Show"}</span>
        </Button>
      </div>

      {/* Main Chart Area - Taller on mobile for better touch targets */}
      <div className="relative h-[320px] sm:h-[400px] p-3 sm:p-4">
        {/* Background SVG with zones and grid */}
        <svg 
          className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)]" 
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Zone backgrounds */}
          {/* Ideal Zone - top left (low risk, high return) */}
          <rect x="0%" y="0%" width="45%" height="40%" fill={ZONE_COLORS.ideal} rx="12" />
          
          {/* Good Zone - center */}
          <rect x="25%" y="30%" width="45%" height="35%" fill={ZONE_COLORS.good} rx="12" />
          
          {/* Risky Zone - top right (high risk, high return) */}
          <rect x="55%" y="0%" width="45%" height="45%" fill={ZONE_COLORS.risky} rx="12" />
          
          {/* Danger Zone - bottom right (high risk, low return) */}
          <rect x="50%" y="55%" width="50%" height="45%" fill={ZONE_COLORS.danger} rx="12" />

          {/* Grid lines */}
          {[20, 40, 60, 80].map((pct) => (
            <React.Fragment key={pct}>
              {/* Vertical */}
              <line
                x1={`${pct}%`}
                y1="0%"
                x2={`${pct}%`}
                y2="100%"
                stroke="currentColor"
                strokeOpacity="0.08"
                strokeDasharray="6 4"
              />
              {/* Horizontal */}
              <line
                x1="0%"
                y1={`${pct}%`}
                x2="100%"
                y2={`${pct}%`}
                stroke="currentColor"
                strokeOpacity="0.08"
                strokeDasharray="6 4"
              />
            </React.Fragment>
          ))}

          {/* Efficient frontier curve (educational guide) */}
          <path
            d="M 5% 75% Q 25% 50%, 45% 40% Q 65% 30%, 95% 20%"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.15"
            strokeWidth="2"
            strokeDasharray="8 4"
          />
        </svg>

        {/* Zone Labels - Smaller on mobile */}
        <div className="absolute top-4 sm:top-5 left-4 sm:left-5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg bg-green-100/90 text-green-700 text-[8px] sm:text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1 backdrop-blur-sm">
          <Shield className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          <span className="hidden xs:inline">Ideal Zone</span>
          <span className="xs:hidden">Ideal</span>
        </div>
        <div className="absolute top-4 sm:top-5 right-4 sm:right-5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg bg-orange-100/90 text-orange-700 text-[8px] sm:text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1 backdrop-blur-sm">
          <Flame className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          <span className="hidden sm:inline">High Risk / High Reward</span>
          <span className="sm:hidden">Risky</span>
        </div>
        <div className="absolute bottom-10 sm:bottom-12 right-4 sm:right-5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg bg-red-100/90 text-red-700 text-[8px] sm:text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1 backdrop-blur-sm">
          <AlertTriangle className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          <span className="hidden xs:inline">Danger Zone</span>
          <span className="xs:hidden">Danger</span>
        </div>

        {/* Y-Axis (Return) */}
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 -rotate-90 origin-center">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest whitespace-nowrap flex items-center gap-1">
            <TrendingUp className="h-3 w-3 rotate-90" />
            Expected Return
          </span>
        </div>
        
        {/* Y-Axis Scale */}
        <div className="absolute left-6 top-5 bottom-10 flex flex-col justify-between text-[9px] text-muted-foreground font-mono">
          <span>+100%</span>
          <span>+50%</span>
          <span>0%</span>
          <span>-50%</span>
        </div>

        {/* X-Axis (Risk) */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-1">
            Risk Level
            <ChevronRight className="h-3 w-3" />
          </span>
        </div>
        
        {/* X-Axis Scale */}
        <div className="absolute bottom-5 left-10 right-5 flex justify-between text-[9px] text-muted-foreground font-mono">
          <span>None</span>
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
          <span>Extreme</span>
        </div>

        {/* Investment Points */}
        {options.map((option, index) => {
          const { x, y, returnData } = getPointPosition(option);
          const isSelected = selectedId === option.id;
          const isHovered = hoveredId === option.id;
          const riskStyle = getRiskStyle(option.risk);
          const courageXp = getCourageXpForRisk(option.risk);

          // Calculate actual return position if showing hindsight
          const actualY = showHindsight && option.actualReturn !== undefined
            ? 85 - ((Math.max(-95, Math.min(100, option.actualReturn)) + 50) / 150) * 75
            : null;

          return (
            <React.Fragment key={option.id}>
              {/* Actual Return Indicator (when hindsight is on) */}
              {showHindsight && actualY !== null && (
                <>
                  {/* Connecting line from expected to actual */}
                  <svg
                    className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] pointer-events-none"
                    style={{ zIndex: 5 }}
                  >
                    <line
                      x1={`${x}%`}
                      y1={`${y}%`}
                      x2={`${x}%`}
                      y2={`${actualY}%`}
                      stroke={option.actualReturn >= 0 ? "#22c55e" : "#ef4444"}
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      opacity="0.6"
                    />
                  </svg>
                  
                  {/* Actual return marker */}
                  <div
                    className="absolute w-7 h-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed flex items-center justify-center text-[9px] font-bold transition-all duration-500 pointer-events-none"
                    style={{
                      left: `calc(1rem + (100% - 2rem) * ${x / 100})`,
                      top: `calc(1rem + (100% - 2rem) * ${actualY / 100})`,
                      borderColor: option.actualReturn >= 0 ? "#22c55e" : "#ef4444",
                      backgroundColor: option.actualReturn >= 0 ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
                      color: option.actualReturn >= 0 ? "#16a34a" : "#dc2626",
                      zIndex: 8,
                    }}
                  >
                    {option.actualReturn > 0 ? "+" : ""}{option.actualReturn}%
                  </div>
                </>
              )}

              {/* Main Point Button - Larger touch targets on mobile */}
              <button
                onClick={() => onSelect(option.id)}
                onMouseEnter={() => setHoveredId(option.id)}
                onMouseLeave={() => setHoveredId(null)}
                onTouchStart={() => setHoveredId(option.id)}
                onTouchEnd={() => setTimeout(() => setHoveredId(null), 1500)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-xl flex flex-col items-center justify-center transition-all duration-200 border-2 cursor-pointer active:scale-95 ${
                  isSelected
                    ? `${riskStyle.bgColor} ring-4 ring-primary/30 scale-105 sm:scale-110 shadow-lg z-20`
                    : isHovered
                    ? `${riskStyle.bgColor} shadow-md scale-105 z-15`
                    : "bg-card border-border hover:scale-105 shadow-sm"
                }`}
                style={{
                  left: `calc(0.75rem + (100% - 1.5rem) * ${x / 100})`,
                  top: `calc(0.75rem + (100% - 1.5rem) * ${y / 100})`,
                  width: isSelected ? "56px" : "48px",
                  height: isSelected ? "56px" : "48px",
                  zIndex: isSelected ? 20 : isHovered ? 15 : 10,
                  animationDelay: `${index * 100}ms`,
                  minWidth: "48px",
                  minHeight: "48px",
                }}
              >
                <span className={`text-sm sm:text-base font-bold ${isSelected ? riskStyle.color : ""}`}>
                  {index + 1}
                </span>
                <span className="text-[8px] sm:text-[9px] text-muted-foreground font-medium">
                  {returnData.avg > 0 ? "+" : ""}{returnData.avg}%
                </span>
              </button>

              {/* Hover Tooltip */}
              {isHovered && (
                <div
                  className="absolute z-30 pointer-events-none animate-in fade-in-0 zoom-in-95 duration-200"
                  style={{
                    left: `calc(1rem + (100% - 2rem) * ${Math.min(Math.max(x, 20), 80) / 100})`,
                    top: `calc(1rem + (100% - 2rem) * ${y / 100})`,
                    transform: `translate(-50%, ${y < 35 ? "70px" : "-110%"})`,
                  }}
                >
                  <div className="bg-popover border-2 border-border rounded-xl shadow-2xl p-3 min-w-[220px]">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h5 className="font-semibold text-sm">{option.name}</h5>
                      <Badge className={`text-[10px] ${riskStyle.bgColor}`}>
                        {option.risk}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {option.description}
                    </p>
                    
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Expected Return</span>
                        <span className="font-semibold text-primary">{option.expectedReturn}</span>
                      </div>
                      
                      {showHindsight && option.actualReturn !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Actual Return</span>
                          <span className={`font-bold ${option.actualReturn >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {option.actualReturn > 0 ? "+" : ""}{option.actualReturn}%
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between pt-1.5 border-t">
                        <span className="text-amber-600 flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          Courage XP
                        </span>
                        <span className="font-semibold text-amber-600">+{courageXp.xp}</span>
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="mt-2 pt-2 border-t">
                        <span className="text-[10px] text-primary font-medium flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          Currently Selected
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Legend - Scrollable on mobile */}
      <div className="px-3 sm:px-4 py-3 border-t bg-muted/20">
        <div className="flex overflow-x-auto gap-2 pb-1 -mx-1 px-1 no-scrollbar">
          {options.map((option, index) => {
            const isSelected = selectedId === option.id;
            const riskStyle = getRiskStyle(option.risk);
            const courageXp = getCourageXpForRisk(option.risk);
            
            return (
              <button
                key={option.id}
                onClick={() => onSelect(option.id)}
                onMouseEnter={() => setHoveredId(option.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`flex items-center gap-2 px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-xl transition-all flex-shrink-0 min-h-[44px] active:scale-95 ${
                  isSelected 
                    ? `${riskStyle.bgColor} border-2` 
                    : "hover:bg-muted border border-transparent"
                }`}
              >
                <span className={`w-7 h-7 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center text-sm sm:text-xs font-bold border ${
                  isSelected ? `${riskStyle.bgColor}` : "bg-muted border-border"
                }`}>
                  {index + 1}
                </span>
                <div className="text-left">
                  <span className={`text-xs sm:text-xs font-medium block truncate max-w-[80px] sm:max-w-[100px] ${isSelected ? "text-primary" : ""}`}>
                    {option.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    +{courageXp.xp} XP
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Hindsight Info */}
        {showHindsight && (
          <div className="mt-3 pt-3 border-t flex items-start sm:items-center gap-2 text-xs text-amber-600">
            <Info className="h-4 w-4 sm:h-3.5 sm:w-3.5 flex-shrink-0 mt-0.5 sm:mt-0" />
            <span className="leading-relaxed">Dashed circles show <strong>actual</strong> returns - learn from history!</span>
          </div>
        )}
      </div>
    </Card>
  );
}

export default RiskRewardChart;

