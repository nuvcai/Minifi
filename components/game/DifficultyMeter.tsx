/**
 * DifficultyMeter - Visual difficulty indicator for missions
 * Shows difficulty as filled bars with color coding
 */

import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Flame, Zap, Target, Skull } from "lucide-react";

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
  icon: React.ReactNode;
  description: string;
  xpMultiplier: string;
}> = {
  beginner: {
    level: 1,
    label: "Beginner",
    color: "bg-emerald-500",
    bgColor: "bg-emerald-500/20",
    icon: <Target className="h-3 w-3" />,
    description: "Perfect for learning the basics!",
    xpMultiplier: "1x XP",
  },
  intermediate: {
    level: 2,
    label: "Intermediate",
    color: "bg-amber-500",
    bgColor: "bg-amber-500/20",
    icon: <Zap className="h-3 w-3" />,
    description: "Ready for a challenge?",
    xpMultiplier: "1.5x XP",
  },
  advanced: {
    level: 3,
    label: "Advanced",
    color: "bg-orange-500",
    bgColor: "bg-orange-500/20",
    icon: <Flame className="h-3 w-3" />,
    description: "For experienced investors!",
    xpMultiplier: "2x XP",
  },
  expert: {
    level: 4,
    label: "Expert",
    color: "bg-red-500",
    bgColor: "bg-red-500/20",
    icon: <Skull className="h-3 w-3" />,
    description: "Only the bravest survive! 💀",
    xpMultiplier: "3x XP",
  },
};

export function DifficultyMeter({ difficulty, showLabel = false, size = "md" }: DifficultyMeterProps) {
  const config = difficultyConfig[difficulty];
  const maxBars = 4;
  
  const sizeConfig = {
    sm: { bar: "h-1.5 w-3", gap: "gap-0.5", text: "text-[10px]" },
    md: { bar: "h-2 w-4", gap: "gap-1", text: "text-xs" },
    lg: { bar: "h-2.5 w-5", gap: "gap-1", text: "text-sm" },
  };
  
  const sizes = sizeConfig[size];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5 cursor-help">
            {/* Difficulty Bars */}
            <div className={`flex ${sizes.gap}`}>
              {Array.from({ length: maxBars }).map((_, i) => (
                <div
                  key={i}
                  className={`${sizes.bar} rounded-sm transition-all ${
                    i < config.level
                      ? config.color
                      : "bg-slate-700/50"
                  }`}
                />
              ))}
            </div>
            
            {/* Label */}
            {showLabel && (
              <span className={`${sizes.text} font-medium text-slate-400`}>
                {config.label}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-slate-800 border-slate-700">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className={`p-1 rounded ${config.bgColor}`}>
                {config.icon}
              </div>
              <span className="font-semibold text-slate-100">{config.label}</span>
            </div>
            <p className="text-xs text-slate-400">{config.description}</p>
            <div className={`text-xs font-medium ${config.color.replace('bg-', 'text-')}`}>
              {config.xpMultiplier}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Inline compact version for tight spaces
export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const config = difficultyConfig[difficulty];
  
  return (
    <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${config.bgColor} ${config.color.replace('bg-', 'text-')}`}>
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
}

export default DifficultyMeter;


