"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, TrendingUp, Shield, Flame } from "lucide-react";

interface RiskRewardMeterProps {
  risk: "None" | "Low" | "Medium" | "High" | "Extreme";
  expectedReturn: string;
  compact?: boolean;
}

const riskLevels = {
  None: { value: 0, color: "bg-gray-400", icon: Shield },
  Low: { value: 1, color: "bg-green-500", icon: Shield },
  Medium: { value: 2, color: "bg-yellow-500", icon: AlertTriangle },
  High: { value: 3, color: "bg-orange-500", icon: Flame },
  Extreme: { value: 4, color: "bg-red-600", icon: Flame },
};

export function RiskRewardMeter({
  risk,
  expectedReturn,
  compact = false,
}: RiskRewardMeterProps) {
  const riskData = riskLevels[risk] || riskLevels.Medium;
  const RiskIcon = riskData.icon;

  // Parse expected return range
  const returnMatch = expectedReturn.match(/(-?\d+)-?(\d+)?%?/);
  const minReturn = returnMatch ? parseInt(returnMatch[1]) : 0;
  const maxReturn = returnMatch ? parseInt(returnMatch[2] || returnMatch[1]) : 0;
  const avgReturn = (minReturn + maxReturn) / 2;

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        {/* Risk Pills */}
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3, 4].map((level) => (
            <motion.div
              key={level}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: level * 0.1 }}
              className={`w-2 h-6 rounded-full ${
                level <= riskData.value
                  ? riskData.color
                  : "bg-muted-foreground/20"
              }`}
            />
          ))}
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {risk} Risk
        </span>
      </div>
    );
  }

  return (
    <div className="relative p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted border">
      {/* Risk Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <RiskIcon
              className={`h-4 w-4 ${
                risk === "Extreme" || risk === "High"
                  ? "text-red-500"
                  : risk === "Medium"
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}
            />
            <span className="text-sm font-medium">Risk Level</span>
          </div>
          <span
            className={`text-sm font-bold ${
              risk === "Extreme"
                ? "text-red-600"
                : risk === "High"
                ? "text-orange-500"
                : risk === "Medium"
                ? "text-yellow-600"
                : "text-green-600"
            }`}
          >
            {risk}
          </span>
        </div>

        {/* Risk Bar */}
        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(riskData.value + 1) * 20}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`absolute inset-y-0 left-0 ${riskData.color} rounded-full`}
          />
          {/* Risk Markers */}
          <div className="absolute inset-0 flex">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex-1 border-r border-background/50 last:border-r-0"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Return Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Expected Return</span>
          </div>
          <span className="text-sm font-bold text-primary">
            {expectedReturn}
          </span>
        </div>

        {/* Return Bar */}
        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(Math.max(avgReturn + 50, 0), 100)}%` }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
          />
        </div>
      </div>

      {/* Risk-Reward Ratio Indicator */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Risk-Reward Ratio</span>
          <RiskRewardRatio risk={riskData.value} reward={avgReturn} />
        </div>
      </div>
    </div>
  );
}

function RiskRewardRatio({ risk, reward }: { risk: number; reward: number }) {
  // Calculate ratio (higher is better)
  const ratio = risk > 0 ? (reward / (risk * 10)).toFixed(1) : "∞";
  const isGood = parseFloat(ratio as string) >= 1.5 || ratio === "∞";

  return (
    <span
      className={`font-bold ${
        isGood ? "text-green-600" : "text-yellow-600"
      }`}
    >
      {ratio === "∞" ? "Low Risk" : `${ratio}:1`}
    </span>
  );
}

// Visual Risk-Reward Chart
interface RiskRewardChartProps {
  options: Array<{
    id: string;
    name: string;
    risk: string;
    expectedReturn: string;
    actualReturn?: number;
  }>;
  selectedId?: string;
  onSelect?: (id: string) => void;
  showActualReturns?: boolean;
}

const CHART_COLORS = {
  ideal: "rgba(34, 197, 94, 0.15)", // Green - low risk, high return
  good: "rgba(59, 130, 246, 0.1)", // Blue - medium risk, medium return
  risky: "rgba(249, 115, 22, 0.15)", // Orange - high risk, medium return
  danger: "rgba(239, 68, 68, 0.2)", // Red - high risk, low return
};

const POINT_COLORS: Record<string, { bg: string; border: string; glow: string }> = {
  None: { bg: "bg-gray-100", border: "border-gray-400", glow: "shadow-gray-400/50" },
  Low: { bg: "bg-green-100", border: "border-green-500", glow: "shadow-green-500/50" },
  Medium: { bg: "bg-yellow-100", border: "border-yellow-500", glow: "shadow-yellow-500/50" },
  High: { bg: "bg-orange-100", border: "border-orange-500", glow: "shadow-orange-500/50" },
  Extreme: { bg: "bg-red-100", border: "border-red-500", glow: "shadow-red-500/50" },
};

export function RiskRewardChart({
  options,
  selectedId,
  onSelect,
  showActualReturns = false,
}: RiskRewardChartProps) {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  const riskToNumber = (risk: string): number => {
    const map: Record<string, number> = {
      None: 0,
      Low: 1,
      Medium: 2,
      High: 3,
      Extreme: 4,
    };
    return map[risk] ?? 2;
  };

  const parseReturn = (returnStr: string): { min: number; max: number; avg: number } => {
    const match = returnStr.match(/(-?\d+)-?(\d+)?%?/);
    const min = match ? parseInt(match[1]) : 0;
    const max = match ? parseInt(match[2] || match[1]) : min;
    return { min, max, avg: (min + max) / 2 };
  };

  const getPointPosition = (option: typeof options[0]) => {
    const riskNum = riskToNumber(option.risk);
    const returnData = parseReturn(option.expectedReturn);
    
    // X: 10% to 90% based on risk (0-4)
    const x = 10 + (riskNum / 4) * 80;
    
    // Y: 10% (high return ~100%) to 90% (low return ~-50%)
    // Normalize: -50% to 100% expected returns
    const normalizedReturn = Math.max(-50, Math.min(100, returnData.avg));
    const y = 90 - ((normalizedReturn + 50) / 150) * 80;
    
    return { x, y, returnData };
  };

  const pointColors = (risk: string) => POINT_COLORS[risk] || POINT_COLORS.Medium;

  return (
    <div className="relative rounded-2xl overflow-hidden border-2 border-border bg-gradient-to-br from-background to-muted/30">
      {/* Chart Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-semibold">Risk vs Return Analysis</h4>
            <p className="text-xs text-muted-foreground">Click points to select investment</p>
          </div>
        </div>
        {showActualReturns && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
            <AlertTriangle className="h-3 w-3" />
            Showing Actual Returns
          </div>
        )}
      </div>

      {/* Chart Area */}
      <div className="relative h-[320px] sm:h-[380px] p-4">
        {/* Background Quadrants */}
        <svg className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)]" preserveAspectRatio="none">
          {/* Ideal Zone (low risk, high return) - top left */}
          <rect x="0%" y="0%" width="40%" height="45%" fill={CHART_COLORS.ideal} rx="8" />
          {/* Good Zone (medium risk, medium return) - center */}
          <rect x="30%" y="35%" width="40%" height="35%" fill={CHART_COLORS.good} rx="8" />
          {/* Risky Zone (high risk, high return) - top right */}
          <rect x="60%" y="0%" width="40%" height="50%" fill={CHART_COLORS.risky} rx="8" />
          {/* Danger Zone (high risk, low return) - bottom right */}
          <rect x="55%" y="50%" width="45%" height="50%" fill={CHART_COLORS.danger} rx="8" />
          
          {/* Grid Lines */}
          {[25, 50, 75].map((pct) => (
            <React.Fragment key={pct}>
              <line
                x1={`${pct}%`}
                y1="0%"
                x2={`${pct}%`}
                y2="100%"
                stroke="currentColor"
                strokeOpacity="0.1"
                strokeDasharray="4 4"
              />
              <line
                x1="0%"
                y1={`${pct}%`}
                x2="100%"
                y2={`${pct}%`}
                stroke="currentColor"
                strokeOpacity="0.1"
                strokeDasharray="4 4"
              />
            </React.Fragment>
          ))}
          
          {/* Diagonal "efficient frontier" guide */}
          <path
            d="M 5% 70% Q 30% 40%, 50% 35% T 95% 15%"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.15"
            strokeWidth="2"
            strokeDasharray="6 4"
          />
        </svg>

        {/* Zone Labels */}
        <div className="absolute top-6 left-6 px-2 py-1 rounded-md bg-green-500/10 text-green-600 text-[10px] font-semibold uppercase tracking-wide">
          Ideal Zone
        </div>
        <div className="absolute top-6 right-6 px-2 py-1 rounded-md bg-orange-500/10 text-orange-600 text-[10px] font-semibold uppercase tracking-wide">
          High Risk / High Reward
        </div>
        <div className="absolute bottom-10 right-6 px-2 py-1 rounded-md bg-red-500/10 text-red-600 text-[10px] font-semibold uppercase tracking-wide">
          Danger Zone
        </div>

        {/* Y-Axis Label */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 origin-center">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
            Expected Return →
          </span>
        </div>

        {/* Y-Axis Scale */}
        <div className="absolute left-6 top-4 bottom-8 flex flex-col justify-between text-[9px] text-muted-foreground font-mono">
          <span>100%</span>
          <span>50%</span>
          <span>0%</span>
          <span>-50%</span>
        </div>

        {/* X-Axis Label */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            Risk Level →
          </span>
        </div>

        {/* X-Axis Scale */}
        <div className="absolute bottom-4 left-8 right-4 flex justify-between text-[9px] text-muted-foreground font-mono">
          <span>None</span>
          <span>Low</span>
          <span>Med</span>
          <span>High</span>
          <span>Extreme</span>
        </div>

        {/* Connecting Lines between points (when hovered/selected) */}
        {(hoveredId || selectedId) && (
          <svg className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] pointer-events-none">
            {options.map((option, i) => {
              if (i === options.length - 1) return null;
              const pos1 = getPointPosition(option);
              const pos2 = getPointPosition(options[i + 1]);
              const isActive = hoveredId === option.id || hoveredId === options[i + 1].id ||
                              selectedId === option.id || selectedId === options[i + 1].id;
              
              return (
                <motion.line
                  key={`line-${i}`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: isActive ? 1 : 0.3, opacity: isActive ? 0.6 : 0.15 }}
                  x1={`${pos1.x}%`}
                  y1={`${pos1.y}%`}
                  x2={`${pos2.x}%`}
                  y2={`${pos2.y}%`}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
              );
            })}
          </svg>
        )}

        {/* Data Points */}
        {options.map((option, index) => {
          const { x, y, returnData } = getPointPosition(option);
          const isSelected = selectedId === option.id;
          const isHovered = hoveredId === option.id;
          const colors = pointColors(option.risk);

          return (
            <React.Fragment key={option.id}>
              {/* Actual Return Indicator (dashed circle) */}
              {showActualReturns && option.actualReturn !== undefined && option.actualReturn !== 0 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.6 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed pointer-events-none"
                  style={{
                    left: `${x}%`,
                    top: `${90 - ((Math.max(-50, Math.min(100, option.actualReturn)) + 50) / 150) * 80}%`,
                    borderColor: option.actualReturn > 0 ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)",
                  }}
                >
                  <span className={`absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold whitespace-nowrap ${
                    option.actualReturn > 0 ? "text-green-600" : "text-red-600"
                  }`}>
                    {option.actualReturn > 0 ? "+" : ""}{option.actualReturn}%
                  </span>
                </motion.div>
              )}

              {/* Main Point */}
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: isSelected ? 1.2 : isHovered ? 1.1 : 1, 
                  opacity: 1 
                }}
                transition={{ 
                  delay: index * 0.12,
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                onClick={() => onSelect?.(option.id)}
                onMouseEnter={() => setHoveredId(option.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`absolute w-12 h-12 sm:w-14 sm:h-14 -translate-x-1/2 -translate-y-1/2 rounded-xl flex flex-col items-center justify-center transition-all duration-200 border-2 ${
                  isSelected
                    ? `${colors.bg} ${colors.border} ring-4 ring-primary/30 shadow-lg ${colors.glow} z-20`
                    : isHovered
                    ? `${colors.bg} ${colors.border} shadow-md ${colors.glow} z-10`
                    : `bg-card border-border hover:${colors.border} shadow-sm`
                }`}
                style={{ 
                  left: `${x}%`, 
                  top: `${y}%`,
                }}
              >
                <span className={`text-sm sm:text-base font-bold ${isSelected ? "text-primary" : ""}`}>
                  {index + 1}
                </span>
                <span className="text-[8px] sm:text-[9px] text-muted-foreground font-medium leading-none">
                  {returnData.avg > 0 ? "+" : ""}{returnData.avg}%
                </span>
              </motion.button>

              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    className="absolute z-30 pointer-events-none"
                    style={{
                      left: `${Math.min(Math.max(x, 20), 80)}%`,
                      top: `${y}%`,
                      transform: `translate(-50%, ${y < 40 ? "60px" : "-120%"})`,
                    }}
                  >
                    <div className="bg-popover border-2 border-border rounded-xl shadow-xl p-3 min-w-[200px]">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h5 className="font-semibold text-sm">{option.name}</h5>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          option.risk === "Extreme" || option.risk === "High" 
                            ? "bg-red-100 text-red-700"
                            : option.risk === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}>
                          {option.risk}
                        </span>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Expected Return</span>
                          <span className="font-medium text-primary">{option.expectedReturn}</span>
                        </div>
                        {showActualReturns && option.actualReturn !== undefined && option.actualReturn !== 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Actual Return</span>
                            <span className={`font-bold ${option.actualReturn > 0 ? "text-green-600" : "text-red-600"}`}>
                              {option.actualReturn > 0 ? "+" : ""}{option.actualReturn}%
                            </span>
                          </div>
                        )}
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
                  </motion.div>
                )}
              </AnimatePresence>
            </React.Fragment>
          );
        })}
      </div>

      {/* Legend */}
      <div className="px-4 py-3 border-t bg-muted/20">
        <div className="flex flex-wrap items-center gap-3">
          {options.map((option, index) => {
            const colors = pointColors(option.risk);
            const isSelected = selectedId === option.id;
            
            return (
              <button
                key={option.id}
                onClick={() => onSelect?.(option.id)}
                onMouseEnter={() => setHoveredId(option.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all ${
                  isSelected 
                    ? `${colors.bg} ${colors.border} border` 
                    : "hover:bg-muted border border-transparent"
                }`}
              >
                <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold border ${
                  isSelected ? `${colors.bg} ${colors.border}` : "bg-muted border-border"
                }`}>
                  {index + 1}
                </span>
                <span className={`text-xs font-medium truncate max-w-[100px] ${isSelected ? "text-primary" : ""}`}>
                  {option.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

