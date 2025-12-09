/**
 * DifficultyMeter - Enhanced visual difficulty indicator
 * Animated bars with glow effects and tooltips
 */

"use client";

import React, { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Flame, Zap, Target, Skull, Star, TrendingUp } from "lucide-react";

type Difficulty = "beginner" | "intermediate" | "advanced" | "expert";

interface DifficultyMeterProps {
  difficulty: Difficulty;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

const difficultyConfig: Record<Difficulty, {
  level: number;
  label: string;
  color: string;
  bgColor: string;
  glowColor: string;
  gradientFrom: string;
  gradientTo: string;
  icon: React.ReactNode;
  description: string;
  xpMultiplier: string;
  emoji: string;
}> = {
  beginner: {
    level: 1,
    label: "Beginner",
    color: "bg-emerald-500",
    bgColor: "bg-emerald-500/20",
    glowColor: "shadow-emerald-500/50",
    gradientFrom: "from-emerald-400",
    gradientTo: "to-teal-500",
    icon: <Target className="h-3.5 w-3.5" />,
    description: "Perfect for learning the basics!",
    xpMultiplier: "1x 🪙",
    emoji: "🌱",
  },
  intermediate: {
    level: 2,
    label: "Intermediate",
    color: "bg-amber-500",
    bgColor: "bg-amber-500/20",
    glowColor: "shadow-amber-500/50",
    gradientFrom: "from-amber-400",
    gradientTo: "to-orange-500",
    icon: <Zap className="h-3.5 w-3.5" />,
    description: "Ready for a challenge?",
    xpMultiplier: "1.5x 🪙",
    emoji: "⚡",
  },
  advanced: {
    level: 3,
    label: "Advanced",
    color: "bg-orange-500",
    bgColor: "bg-orange-500/20",
    glowColor: "shadow-orange-500/50",
    gradientFrom: "from-orange-400",
    gradientTo: "to-red-500",
    icon: <Flame className="h-3.5 w-3.5" />,
    description: "For experienced investors!",
    xpMultiplier: "2x 🪙",
    emoji: "🔥",
  },
  expert: {
    level: 4,
    label: "Expert",
    color: "bg-red-500",
    bgColor: "bg-red-500/20",
    glowColor: "shadow-red-500/50",
    gradientFrom: "from-red-500",
    gradientTo: "to-rose-600",
    icon: <Skull className="h-3.5 w-3.5" />,
    description: "Only the bravest survive! 💀",
    xpMultiplier: "3x 🪙",
    emoji: "☠️",
  },
};

export function DifficultyMeter({ difficulty, showLabel = false, size = "md" }: DifficultyMeterProps) {
  const config = difficultyConfig[difficulty];
  const maxBars = 4;
  const [isHovered, setIsHovered] = useState(false);
  
  const sizeConfig = {
    sm: { bar: "h-1.5 w-3", gap: "gap-0.5", text: "text-[10px]", container: "p-1" },
    md: { bar: "h-2.5 w-4", gap: "gap-1", text: "text-xs", container: "p-1.5" },
    lg: { bar: "h-3 w-5", gap: "gap-1.5", text: "text-sm", container: "p-2" },
  };
  
  const sizes = sizeConfig[size];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={`flex items-center gap-2 ${sizes.container} rounded-lg bg-slate-800/50 border border-slate-700/50 cursor-help transition-all duration-300 ${
              isHovered ? 'bg-slate-700/50 scale-105' : ''
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Difficulty Bars with Animation */}
            <div className={`flex ${sizes.gap}`}>
              {Array.from({ length: maxBars }).map((_, i) => (
                <div
                  key={i}
                  className={`${sizes.bar} rounded-sm transition-all duration-300 ${
                    i < config.level
                      ? `bg-gradient-to-t ${config.gradientFrom} ${config.gradientTo} ${isHovered ? `shadow-lg ${config.glowColor}` : ''}`
                      : "bg-slate-700/50"
                  }`}
                  style={{
                    animationDelay: `${i * 100}ms`,
                    transform: isHovered && i < config.level ? 'scaleY(1.2)' : 'scaleY(1)',
                  }}
                />
              ))}
            </div>
            
            {/* Label */}
            {showLabel && (
              <div className="flex items-center gap-1">
                <span className={`${sizes.text} font-semibold ${config.color.replace('bg-', 'text-')}`}>
                  {config.label}
                </span>
                <span className="text-xs">{config.emoji}</span>
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent 
          className="bg-slate-900 border-slate-700 p-0 overflow-hidden"
          sideOffset={8}
        >
          <div className="p-3 space-y-2">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo}`}>
                <div className="text-white">{config.icon}</div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-100">{config.label}</span>
                  <span>{config.emoji}</span>
                </div>
                <p className="text-xs text-slate-400">{config.description}</p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-4 pt-2 border-t border-slate-700">
              <div className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-amber-400" />
                <span className={`text-xs font-bold ${config.color.replace('bg-', 'text-')}`}>
                  {config.xpMultiplier}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-xs text-slate-400">
                  Level {config.level}/4
                </span>
              </div>
            </div>
            
            {/* Difficulty bars preview */}
            <div className="flex gap-1 pt-1">
              {Array.from({ length: maxBars }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-6 rounded-sm ${
                    i < config.level
                      ? `bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo}`
                      : "bg-slate-700"
                  }`}
                />
              ))}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Inline compact badge version
export function DifficultyBadge({ difficulty, animated = false }: { difficulty: Difficulty; animated?: boolean }) {
  const config = difficultyConfig[difficulty];
  
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bgColor} border border-slate-700/50 transition-all duration-300 ${
      animated ? 'hover:scale-105' : ''
    }`}>
      <div className={`${config.color.replace('bg-', 'text-')}`}>
        {config.icon}
      </div>
      <span className={`text-[11px] font-semibold ${config.color.replace('bg-', 'text-')}`}>
        {config.label}
      </span>
      <span className="text-xs">{config.emoji}</span>
    </div>
  );
}

// Circular difficulty indicator
export function DifficultyRing({ difficulty, size = 40 }: { difficulty: Difficulty; size?: number }) {
  const config = difficultyConfig[difficulty];
  const progress = (config.level / 4) * 100;
  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background ring */}
      <svg className="absolute" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-700"
        />
      </svg>
      
      {/* Progress ring */}
      <svg className="absolute -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" className={config.gradientFrom.replace('from-', 'stop-')} stopColor={
              difficulty === 'beginner' ? '#34d399' :
              difficulty === 'intermediate' ? '#fbbf24' :
              difficulty === 'advanced' ? '#f97316' : '#ef4444'
            } />
            <stop offset="100%" className={config.gradientTo.replace('to-', 'stop-')} stopColor={
              difficulty === 'beginner' ? '#14b8a6' :
              difficulty === 'intermediate' ? '#f97316' :
              difficulty === 'advanced' ? '#ef4444' : '#f43f5e'
            } />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center icon */}
      <div className={`relative ${config.color.replace('bg-', 'text-')}`}>
        {config.icon}
      </div>
    </div>
  );
}

export default DifficultyMeter;
