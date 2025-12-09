/**
 * ProgressCard - Enhanced progress display with animations
 * Stunning visual feedback for player achievements
 */

"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricsGrid, MetricItem } from "@/components/shared/MetricsGrid";
import { 
  Trophy, 
  Users, 
  Star, 
  Zap, 
  Flame,
  Target,
  Sparkles,
  ChevronUp,
  Award,
} from "lucide-react";
import { DailyStreak } from "@/components/gamification/DailyStreak";
import { levelTitles } from "@/components/gamification/LevelUpCelebration";

interface ProgressCardProps {
  playerXP: number;
  completedCount: number;
  availableCount: number;
  playerLevel?: number;
  maxXP?: number;
  onStreakBonusClaimed?: (bonus: number) => void;
}

export function ProgressCard({ 
  playerXP, 
  completedCount, 
  availableCount,
  playerLevel = 1,
  maxXP = 1000,
  onStreakBonusClaimed,
}: ProgressCardProps) {
  const xpInLevel = playerXP % maxXP;
  const xpProgress = (xpInLevel / maxXP) * 100;
  const xpNeeded = maxXP - xpInLevel;
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const levelInfo = levelTitles[playerLevel] || levelTitles[1];
  const nextLevelInfo = levelTitles[playerLevel + 1];

  // Animate progress bar on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(xpProgress);
    }, 300);
    return () => clearTimeout(timer);
  }, [xpProgress]);

  const progressMetrics: MetricItem[] = [
    {
      id: "completed",
      icon: <Trophy className="h-6 w-6 text-emerald-400" />,
      title: "Missions Crushed 💪",
      value: completedCount,
    },
    {
      id: "available",
      icon: <Target className="h-6 w-6 text-teal-400" />,
      title: "Ready to Play 🎮",
      value: availableCount,
    },
  ];

  return (
    <div className="space-y-4 mt-6">
      {/* Daily Streak Card */}
      <DailyStreak onBonusClaimed={onStreakBonusClaimed} />
      
      {/* Progress Card */}
      <Card 
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700/50 backdrop-blur overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5" />
        
        <CardHeader className="pb-3 relative">
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20">
              <Trophy className="h-5 w-5 text-amber-400" />
            </div>
            Your Progress
            <Sparkles className={`h-4 w-4 text-amber-400 ${isHovered ? 'animate-spin' : ''}`} style={{ animationDuration: '2s' }} />
          </CardTitle>
        </CardHeader>
        
        <CardContent className="relative">
          <div className="space-y-5">
            {/* Enhanced Level Display */}
            <div className={`relative p-4 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 transition-all duration-300 ${
              isHovered ? 'scale-[1.02] shadow-xl shadow-indigo-500/10' : ''
            }`}>
              {/* Level glow effect */}
              <div className={`absolute -inset-px rounded-2xl bg-gradient-to-r ${levelInfo.color} opacity-20 blur-sm`} />
              
              <div className="relative flex items-center gap-4">
                {/* Level Icon with animation */}
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${levelInfo.color} rounded-2xl blur-lg opacity-50`} />
                  <div className={`relative bg-gradient-to-br ${levelInfo.color} rounded-2xl p-3 shadow-lg`}>
                    <div className="text-white">{levelInfo.icon}</div>
                  </div>
                  {/* Level number badge */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center border-2 border-slate-700">
                    <span className="text-xs font-black text-white">{playerLevel}</span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-lg text-slate-100">
                      {levelInfo.title}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Award className="h-4 w-4" />
                      <span className="text-sm font-semibold">Level {playerLevel}</span>
                    </div>
                  </div>
                  {nextLevelInfo && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <ChevronUp className="h-3 w-3" />
                      <span>Next: <span className="text-slate-300 font-medium">{nextLevelInfo.title}</span></span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Enhanced XP Progress */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-amber-500/20">
                    <Star className="h-4 w-4 text-amber-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-300">Experience Points</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-emerald-400">
                    {xpInLevel.toLocaleString()}
                  </span>
                  <span className="text-slate-500">/</span>
                  <span className="text-sm font-medium text-slate-400">
                    {maxXP.toLocaleString()}
                  </span>
                </div>
              </div>
              
              {/* Animated Progress Bar */}
              <div className="relative">
                {/* Background */}
                <div className="h-4 rounded-full bg-slate-700/50 overflow-hidden border border-slate-600/30">
                  {/* Animated fill */}
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 relative transition-all duration-1000 ease-out"
                    style={{ width: `${animatedProgress}%` }}
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    
                    {/* Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 blur-sm opacity-50" />
                  </div>
                </div>
                
                {/* Progress percentage indicator */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 ease-out"
                  style={{ left: `calc(${Math.max(animatedProgress, 8)}% - 16px)` }}
                >
                  <div className="px-2 py-0.5 rounded-full bg-white text-[10px] font-bold text-slate-900 shadow-lg">
                    {Math.round(animatedProgress)}%
                  </div>
                </div>
              </div>
              
              {/* XP needed indicator */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Zap className="h-3 w-3 text-violet-400" />
                  <span>{xpNeeded.toLocaleString()} 🪙 to Level {playerLevel + 1}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <Flame className="h-3 w-3 text-orange-400" />
                  <span className="text-orange-400 font-medium">Keep going!</span>
                </div>
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="pt-2">
              <MetricsGrid metrics={progressMetrics} columns={2} />
            </div>
            
            {/* Total XP Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                <Star className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-bold text-amber-400">
                  Total: {playerXP.toLocaleString()} XP
                </span>
                <Sparkles className="h-4 w-4 text-amber-400" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
