/**
 * XpProgressBar - Enhanced XP progress bar with visual feedback
 * 
 * Features:
 * - Always visible XP progress
 * - Animated progress updates
 * - Level milestone markers
 * - Bonus XP indicators
 */

"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Zap, Star, TrendingUp } from "lucide-react";
import { levelTitles } from "./LevelUpCelebration";

interface XpProgressBarProps {
  currentXp: number;
  level: number;
  xpPerLevel?: number;
  showLabels?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function XpProgressBar({
  currentXp,
  level,
  xpPerLevel = 1000,
  showLabels = true,
  size = "md",
  className = "",
}: XpProgressBarProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [showSparkle, setShowSparkle] = useState(false);

  // Calculate progress within current level
  const xpInCurrentLevel = currentXp % xpPerLevel;
  const progressPercent = (xpInCurrentLevel / xpPerLevel) * 100;
  const xpToNextLevel = xpPerLevel - xpInCurrentLevel;

  // Get level info
  const currentLevelInfo = levelTitles[level] || levelTitles[1];
  const nextLevelInfo = levelTitles[level + 1];

  // Animate progress bar
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progressPercent);
    }, 100);
    return () => clearTimeout(timer);
  }, [progressPercent]);

  // Show sparkle when XP changes
  useEffect(() => {
    setShowSparkle(true);
    const timer = setTimeout(() => setShowSparkle(false), 1000);
    return () => clearTimeout(timer);
  }, [currentXp]);

  const sizeClasses = {
    sm: { bar: "h-2", text: "text-xs", icon: "h-3 w-3" },
    md: { bar: "h-3", text: "text-sm", icon: "h-4 w-4" },
    lg: { bar: "h-4", text: "text-base", icon: "h-5 w-5" },
  };

  const sizeClass = sizeClasses[size];

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Labels */}
      {showLabels && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`bg-gradient-to-br ${currentLevelInfo.color} rounded-full p-1`}>
              {React.cloneElement(currentLevelInfo.icon as React.ReactElement, {
                className: `${sizeClass.icon} text-white`,
              })}
            </div>
            <div>
              <span className={`font-bold text-slate-100 ${sizeClass.text}`}>
                Level {level}
              </span>
              <span className={`text-slate-400 ml-2 ${sizeClass.text}`}>
                {currentLevelInfo.title}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {showSparkle && (
              <Sparkles className={`${sizeClass.icon} text-amber-400 animate-pulse`} />
            )}
            <span className={`font-semibold text-emerald-400 ${sizeClass.text}`}>
              {currentXp.toLocaleString()} XP
            </span>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="relative">
        {/* Background */}
        <div className={`w-full bg-slate-700/50 rounded-full ${sizeClass.bar} overflow-hidden`}>
          {/* Progress fill */}
          <div
            className={`${sizeClass.bar} bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 rounded-full transition-all duration-700 ease-out relative`}
            style={{ width: `${animatedProgress}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>

        {/* Milestone markers */}
        <div className="absolute inset-0 flex items-center">
          {[25, 50, 75].map((milestone) => (
            <div
              key={milestone}
              className="absolute h-full flex items-center"
              style={{ left: `${milestone}%` }}
            >
              <div
                className={`w-0.5 ${sizeClass.bar} ${
                  animatedProgress >= milestone
                    ? "bg-emerald-300"
                    : "bg-slate-600"
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* XP to next level */}
      {showLabels && (
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-slate-400">
            <Zap className="h-3 w-3" />
            <span>{xpToNextLevel.toLocaleString()} 🪙 to Level {level + 1}</span>
          </div>
          {nextLevelInfo && (
            <div className="flex items-center gap-1 text-slate-500">
              <TrendingUp className="h-3 w-3" />
              <span>Next: {nextLevelInfo.title}</span>
            </div>
          )}
        </div>
      )}

      {/* CSS for shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// Compact inline version for headers
interface XpBadgeProps {
  currentXp: number;
  level: number;
  xpPerLevel?: number;
}

export function XpBadge({ currentXp, level, xpPerLevel = 1000 }: XpBadgeProps) {
  const xpInCurrentLevel = currentXp % xpPerLevel;
  const progressPercent = (xpInCurrentLevel / xpPerLevel) * 100;
  const levelInfo = levelTitles[level] || levelTitles[1];

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg">
      {/* Level indicator */}
      <div className={`bg-gradient-to-br ${levelInfo.color} rounded-full p-1.5`}>
        <span className="text-sm font-bold text-white">{level}</span>
      </div>

      {/* XP and progress */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 text-amber-400" />
          <span className="text-sm font-semibold text-emerald-400">
            {currentXp.toLocaleString()} XP
          </span>
        </div>
        <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default XpProgressBar;


