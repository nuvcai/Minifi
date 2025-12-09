/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   💎 HIGH CONVICTION MOMENT - Visual Philosophy                              ║
 * ║   "Quick failures teach more than slow indecision"                           ║
 * ║   Copyright (c) 2025 NUVC.AI. All Rights Reserved.                          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
} from "recharts";
import { Sparkles, Zap, Clock, TrendingUp, Diamond, Flame, Target } from "lucide-react";

// Philosophy data: Bold Action compounds learning, Indecision loses time
const generateConvictionData = () => {
  const data = [];
  for (let week = 0; week <= 12; week++) {
    // Bold action: Fast learning from both wins AND failures
    // Learning compounds exponentially when you take action
    const boldLearning = Math.floor(10 * Math.pow(1.35, week));
    
    // Indecision: Analysis paralysis, minimal learning
    // Only grows linearly and slowly
    const indecisionLearning = Math.floor(10 + week * 3);
    
    data.push({
      week: `W${week}`,
      weekNum: week,
      bold: boldLearning,
      indecision: indecisionLearning,
      gap: boldLearning - indecisionLearning,
    });
  }
  return data;
};

interface ConvictionChartProps {
  compact?: boolean;
  animated?: boolean;
  showLegend?: boolean;
  className?: string;
}

export function ConvictionChart({
  compact = false,
  animated = true,
  showLegend = true,
  className = "",
}: ConvictionChartProps) {
  const [progress, setProgress] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(0);
  const data = useMemo(() => generateConvictionData(), []);

  // Animate the chart revealing data points
  useEffect(() => {
    if (!animated) {
      setProgress(100);
      setCurrentWeek(12);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 8;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [animated]);

  // Update current week based on progress
  useEffect(() => {
    setCurrentWeek(Math.min(12, Math.floor((progress / 100) * 12)));
  }, [progress]);

  // Get visible data based on animation progress
  const visibleData = useMemo(() => {
    const visibleCount = Math.max(1, Math.ceil((progress / 100) * data.length));
    return data.slice(0, visibleCount);
  }, [data, progress]);

  // Stats for the current week
  const currentStats = data[currentWeek];
  const learningGap = currentStats?.gap || 0;
  const boldValue = currentStats?.bold || 10;
  const indecisionValue = currentStats?.indecision || 10;

  if (compact) {
    return (
      <div className={`relative ${className}`}>
        {/* Compact mini chart */}
        <div className="h-20 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={visibleData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="boldGradientCompact" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="indecisionGradientCompact" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#64748b" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#64748b" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="bold"
                stroke="#8b5cf6"
                fill="url(#boldGradientCompact)"
                strokeWidth={2}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="indecision"
                stroke="#64748b"
                fill="url(#indecisionGradientCompact)"
                strokeWidth={1}
                strokeDasharray="4 2"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* Compact legend */}
        <div className="flex items-center justify-between mt-1 text-[9px]">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-violet-500" />
            <span className="text-violet-600 font-medium">Bold: +{boldValue}%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-slate-400" />
            <span className="text-slate-500">Wait: +{indecisionValue}%</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header with animated stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30">
            <Diamond className="h-4 w-4 text-white" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900 dark:text-white">
              Conviction Compounds Learning
            </h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">
              12 weeks of bold action vs waiting
            </p>
          </div>
        </div>
        
        {/* Live gap indicator */}
        <div className="text-right">
          <div className="flex items-center gap-1 text-violet-600 dark:text-violet-400">
            <TrendingUp className="h-3 w-3" />
            <span className="text-sm font-bold">+{learningGap}%</span>
          </div>
          <p className="text-[9px] text-gray-500">learning advantage</p>
        </div>
      </div>

      {/* Main Chart */}
      <div className="relative h-32 sm:h-40 w-full bg-gradient-to-b from-violet-50/50 to-white dark:from-violet-950/30 dark:to-gray-900 rounded-xl border border-violet-200/50 dark:border-violet-800/30 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 20px,
              rgba(139, 92, 246, 0.3) 20px,
              rgba(139, 92, 246, 0.3) 21px
            )`
          }} />
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={visibleData} margin={{ top: 15, right: 15, bottom: 5, left: 5 }}>
            <defs>
              <linearGradient id="boldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.7} />
                <stop offset="50%" stopColor="#a78bfa" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#c4b5fd" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="indecisionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#64748b" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#94a3b8" stopOpacity={0.05} />
              </linearGradient>
              {/* Glow effect for bold line */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            <XAxis 
              dataKey="week" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: '#9ca3af' }}
              interval={2}
            />
            <YAxis 
              hide 
              domain={[0, 'dataMax + 50']}
            />
            
            {/* Reference line at decision point */}
            <ReferenceLine 
              x="W0" 
              stroke="#8b5cf6" 
              strokeDasharray="3 3" 
              strokeOpacity={0.5}
              label={{ value: "NOW", position: "top", fontSize: 8, fill: "#8b5cf6" }}
            />
            
            <Tooltip 
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const boldVal = payload[0]?.value as number;
                const indecVal = payload[1]?.value as number;
                return (
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-xl border border-violet-200 dark:border-violet-700">
                    <div className="text-[10px] font-bold text-violet-600">Bold Action: +{boldVal}%</div>
                    <div className="text-[10px] text-gray-500">Indecision: +{indecVal}%</div>
                    <div className="text-[9px] mt-1 pt-1 border-t border-gray-100 dark:border-gray-700 text-emerald-600 font-medium">
                      Gap: +{boldVal - indecVal}% more learning
                    </div>
                  </div>
                );
              }}
            />
            
            {/* Indecision area (behind) */}
            <Area
              type="monotone"
              dataKey="indecision"
              stroke="#94a3b8"
              fill="url(#indecisionGradient)"
              strokeWidth={1.5}
              strokeDasharray="5 3"
              isAnimationActive={animated}
              animationDuration={1500}
            />
            
            {/* Bold action area (front) */}
            <Area
              type="monotone"
              dataKey="bold"
              stroke="#8b5cf6"
              fill="url(#boldGradient)"
              strokeWidth={2.5}
              filter="url(#glow)"
              isAnimationActive={animated}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Floating "NOW" marker */}
        <div className="absolute top-2 left-4 flex items-center gap-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
          </span>
          <span className="text-[8px] font-bold text-violet-600 uppercase tracking-wider">Decision Point</span>
        </div>
      </div>

      {/* Legend with philosophy */}
      {showLegend && (
        <div className="grid grid-cols-2 gap-2">
          {/* Bold Action */}
          <div className="p-2 rounded-lg bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 border border-violet-200/50 dark:border-violet-800/30">
            <div className="flex items-center gap-1.5 mb-1">
              <Zap className="h-3 w-3 text-violet-500" />
              <span className="text-[10px] font-bold text-violet-700 dark:text-violet-300">Bold Action</span>
            </div>
            <p className="text-[9px] text-gray-600 dark:text-gray-400 leading-tight">
              Learn from wins AND failures. Knowledge compounds fast.
            </p>
          </div>
          
          {/* Indecision */}
          <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/30">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="h-3 w-3 text-gray-400" />
              <span className="text-[10px] font-bold text-gray-500">Analysis Paralysis</span>
            </div>
            <p className="text-[9px] text-gray-500 dark:text-gray-500 leading-tight">
              Waiting for "perfect" means never learning from real outcomes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Mini conviction badge for cards
export function ConvictionBadge({ 
  riskLevel 
}: { 
  riskLevel: "low" | "medium" | "high" | "extreme" 
}) {
  const config = {
    low: { color: "bg-blue-100 text-blue-700 border-blue-200", icon: Target, label: "Steady Path" },
    medium: { color: "bg-amber-100 text-amber-700 border-amber-200", icon: Flame, label: "Bold Move" },
    high: { color: "bg-orange-100 text-orange-700 border-orange-200", icon: Zap, label: "High Conviction" },
    extreme: { color: "bg-red-100 text-red-700 border-red-200", icon: Diamond, label: "Maximum Conviction" },
  };

  const { color, icon: Icon, label } = config[riskLevel];

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${color} border`}>
      <Icon className="h-2.5 w-2.5" />
      <span>{label}</span>
    </div>
  );
}

// Philosophy quote rotator
const convictionQuotes = [
  { quote: "Speed beats perfection", author: "Reid Hoffman" },
  { quote: "Move fast and learn things", author: "Modern Investing" },
  { quote: "Inaction is also a decision", author: "Charlie Munger" },
  { quote: "The cost of being wrong is less than the cost of doing nothing", author: "Seth Godin" },
];

export function ConvictionQuote() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % convictionQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const { quote, author } = convictionQuotes[quoteIndex];

  return (
    <div className="text-center py-2">
      <p className="text-xs italic text-gray-600 dark:text-gray-400">"{quote}"</p>
      <p className="text-[10px] text-gray-500 mt-0.5">— {author}</p>
    </div>
  );
}


