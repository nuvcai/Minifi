import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Gift, Star, Zap } from "lucide-react";
import { StreakBadge } from "@/components/gamification/DailyStreak";
import { levelTitles } from "@/components/gamification/LevelUpCelebration";

interface GameHeaderProps {
  playerLevel: number;
  playerXP: number;
  totalScore: number;
  onRewardsClick?: () => void;
}

export function GameHeader({
  playerLevel,
  playerXP,
  totalScore,
  onRewardsClick,
}: GameHeaderProps) {
  const xpToNextLevel = 1000;
  const xpInLevel = playerXP % xpToNextLevel;
  const xpProgress = (xpInLevel / xpToNextLevel) * 100;
  const xpNeeded = xpToNextLevel - xpInLevel;
  
  // Get level info
  const levelInfo = levelTitles[playerLevel] || levelTitles[1];
  const nextLevelInfo = levelTitles[playerLevel + 1];

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur shadow-lg">
      <div className="container mx-auto sm:px-4 py-4">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent flex items-center justify-center sm:justify-start gap-2">
              <Image
                src="/favicon.png"
                alt="NUVC Icon"
                width={48}
                height={48}
                className="object-contain w-8 h-8 sm:w-12 sm:h-12"
              />
              Legacy Guardians
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Travel through time, master the markets! 🚀
            </p>
          </div>
          
          <div className="flex justify-center items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
            {/* Daily Streak Badge */}
            <StreakBadge />
            
            {/* Rewards Button */}
            {onRewardsClick && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRewardsClick}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-amber-500/20 border-amber-500/30 hover:from-amber-500/20 hover:to-amber-500/30 text-amber-400"
              >
                <Gift className="h-4 w-4" />
                <span className="font-medium hidden sm:inline">
                  Rewards
                </span>
              </Button>
            )}
            
            {/* Enhanced Level & XP Display */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg cursor-help">
                    {/* Level Badge */}
                    <div className={`bg-gradient-to-br ${levelInfo.color} rounded-full p-1.5 sm:p-2`}>
                      <span className="text-sm sm:text-base font-bold text-white">{playerLevel}</span>
                    </div>
                    
                    {/* XP Info */}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-400" />
                        <span className="text-sm sm:text-base font-semibold text-emerald-400">
                          {playerXP.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-500 hidden sm:inline">XP</span>
                      </div>
                      {/* Mini progress bar */}
                      <div className="w-16 sm:w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                          style={{ width: `${xpProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-800 border-slate-700 p-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {levelInfo.icon}
                      <span className="font-semibold text-slate-100">
                        Level {playerLevel}: {levelInfo.title}
                      </span>
                    </div>
                    <div className="text-sm text-slate-300">
                      {xpInLevel.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP
                    </div>
                    <div className="w-40 bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all"
                        style={{ width: `${xpProgress}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Zap className="h-3 w-3" />
                      <span>{xpNeeded.toLocaleString()} XP to Level {playerLevel + 1}</span>
                    </div>
                    {nextLevelInfo && (
                      <div className="text-xs text-slate-500">
                        Next: {nextLevelInfo.title}
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Total Score */}
            <div className="text-center px-3 py-2 sm:px-4 sm:py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg">
              <p className="text-xs text-slate-400">Score</p>
              <p className="text-base sm:text-lg font-bold text-teal-400">
                {totalScore.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
