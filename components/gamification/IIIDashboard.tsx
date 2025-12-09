/**
 * IIIDashboard — Enhanced Light/Dark Mode Design
 * 
 * Clean, accessible stats display with excellent visibility
 * Optimized for both light and dark themes
 * Copyright (c) 2025 NUVC.AI. All Rights Reserved.
 */

"use client";

import React from "react";
import Link from "next/link";
import {
  Flame,
  TrendingUp,
  Gift,
  Sparkles,
  Award,
  ChevronRight,
  Zap,
} from "lucide-react";
import { levelTitles } from "./LevelUpCelebration";
import { type League } from "./LeagueSystem";

interface IIIDashboardProps {
  totalIII: number;
  level: number;
  levelProgress: number;
  iiiToNextLevel: number;
  weeklyIII: number;
  league: League | null;
  leagueRank: number;
  leagueZone: 'promotion' | 'safe' | 'danger';
  streakDays: number;
  streakBonusAvailable: boolean;
  streakBonus: number;
  onClaimStreak: () => void;
  stakedIII?: number;
  stakingAPY?: number;
  pendingRewards?: number;
  onStake?: () => void;
  onClaimRewards?: () => void;
  badgeCount: number;
  onViewLeague?: () => void;
  onViewBadges?: () => void;
}

export function IIIDashboard({
  totalIII,
  level,
  levelProgress,
  iiiToNextLevel,
  weeklyIII,
  league,
  leagueRank,
  leagueZone,
  streakDays,
  streakBonusAvailable,
  streakBonus,
  onClaimStreak,
  badgeCount,
}: IIIDashboardProps) {
  const levelInfo = levelTitles[level] || levelTitles[1];

  const zoneStyles = {
    promotion: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10",
    safe: "text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-500/10",
    danger: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10",
  };

  const zoneLabels = {
    promotion: "↑ Promotion",
    safe: "Safe",
    danger: "↓ Danger Zone",
  };

  return (
    <div className="rounded-2xl overflow-hidden
      bg-white dark:bg-slate-900/80
      border border-slate-200 dark:border-slate-700/50
      shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50">
      
      {/* Main Stats Section - Compact on mobile */}
      <div className="p-3 sm:p-5 bg-gradient-to-br from-violet-50 via-purple-50/50 to-white dark:from-violet-500/10 dark:via-purple-500/5 dark:to-transparent">
        
        {/* Level & League Row - Inline compact layout */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-violet-500 rounded-lg sm:rounded-xl blur-md opacity-30" />
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-base sm:text-lg font-black shadow-lg shadow-violet-500/30">
                {level}
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">Level {level}</p>
              <p className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">{levelInfo.title}</p>
            </div>
          </div>
          
          {league && (
            <Link 
              href="/leaderboard"
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl 
                bg-slate-100 dark:bg-slate-800 
                border border-slate-200 dark:border-slate-700
                hover:bg-slate-200 dark:hover:bg-slate-700 
                hover:border-slate-300 dark:hover:border-slate-600
                transition-all group flex-shrink-0"
            >
              <span className="text-sm sm:text-base">{league.emoji}</span>
              <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">
                #{leagueRank}
              </span>
            </Link>
          )}
        </div>
        
        {/* iii Balance - More compact */}
        <div className="mb-3 p-2.5 sm:p-3 rounded-xl bg-white/60 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="p-1 rounded-md bg-amber-100 dark:bg-amber-500/20">
                <Sparkles className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-amber-500" />
              </div>
              <span className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 font-semibold">Total Balance</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {totalIII.toLocaleString()}
              </span>
              <span className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400">iii</span>
            </div>
          </div>
        </div>
        
        {/* Progress Bar - Compact */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] sm:text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Next Level</span>
            <span className="text-violet-600 dark:text-violet-400 font-bold">
              {iiiToNextLevel.toLocaleString()} iii left
            </span>
          </div>
          <div className="relative h-2 sm:h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-500"
              style={{ width: `${levelProgress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Ultra compact on mobile */}
      <div className="grid grid-cols-3 border-t border-slate-200 dark:border-slate-700/50">
        
        {/* Streak */}
        <button 
          onClick={streakBonusAvailable ? onClaimStreak : undefined}
          className={`p-2 sm:p-4 text-center border-r border-slate-200 dark:border-slate-700/50 transition-all ${
            streakBonusAvailable 
              ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 cursor-pointer hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-500/15 dark:hover:to-orange-500/15' 
              : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          <div className="flex items-center justify-center gap-0.5 sm:gap-1">
            <Flame className={`h-3 sm:h-4 w-3 sm:w-4 ${
              streakDays >= 7 ? 'text-orange-500' : 
              streakDays >= 3 ? 'text-amber-500' : 'text-slate-400 dark:text-slate-500'
            }`} />
            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">{streakDays}</span>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">Streak</p>
          {streakBonusAvailable && (
            <span className="inline-flex items-center gap-0.5 mt-0.5 text-[10px] sm:text-xs font-bold text-amber-600 dark:text-amber-400">
              <Zap className="h-2.5 sm:h-3 w-2.5 sm:w-3" />
              +{streakBonus}
            </span>
          )}
        </button>
        
        {/* Weekly */}
        <Link 
          href="/leaderboard"
          className="p-2 sm:p-4 text-center border-r border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
        >
          <div className="flex items-center justify-center gap-0.5 sm:gap-1">
            <TrendingUp className="h-3 sm:h-4 w-3 sm:w-4 text-emerald-500" />
            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">{weeklyIII}</span>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">This Week</p>
          {league && (
            <span className={`inline-block mt-0.5 text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full ${zoneStyles[leagueZone]}`}>
              {zoneLabels[leagueZone]}
            </span>
          )}
        </Link>
        
        {/* Badges */}
        <Link 
          href="/profile"
          className="p-2 sm:p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
        >
          <div className="flex items-center justify-center gap-0.5 sm:gap-1">
            <Award className="h-3 sm:h-4 w-3 sm:w-4 text-amber-500" />
            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">{badgeCount}</span>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">Badges</p>
        </Link>
      </div>

      {/* Claim Streak Button - Compact on mobile */}
      {streakBonusAvailable && (
        <div className="p-2 sm:p-4 border-t border-slate-200 dark:border-slate-700/50 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-500/5 dark:to-orange-500/5">
          <button
            onClick={onClaimStreak}
            className="w-full flex items-center justify-between p-2 sm:p-3 rounded-lg sm:rounded-xl 
              bg-gradient-to-r from-amber-500 to-orange-500 
              hover:from-amber-600 hover:to-orange-600 
              text-white shadow-lg shadow-amber-500/30
              transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Gift className="h-4 sm:h-5 w-4 sm:w-5" />
              <span className="font-bold text-sm sm:text-base">Claim Bonus</span>
            </div>
            <div className="flex items-center gap-1 bg-white/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg">
              <span className="font-black text-sm sm:text-base">+{streakBonus}</span>
              <ChevronRight className="h-3 sm:h-4 w-3 sm:w-4" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

export default IIIDashboard;
