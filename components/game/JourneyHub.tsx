/**
 * JourneyHub - MOBILE-FIRST Learning Journey Container
 * Touch-optimized with beautiful responsive design
 * Professional game edu app UX patterns
 * © 2025 NUVC.AI. All Rights Reserved.
 */

"use client";

import React, { useState, useEffect } from "react";
import { 
  Flame,
  Trophy,
  Target,
  Star,
  Sparkles,
  GraduationCap,
  ChevronRight,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FinancialEvent } from "@/components/data/events";
import { MissionData } from "@/components/data/missions";
import { ChapterHub } from "./ChapterHub";
import { SkillsDrawer } from "./SkillsDrawer";
import { PracticeMode } from "./PracticeMode";
import { getMasteryLevel, getNextMasteryLevel } from "@/components/data/chapters";

interface JourneyHubProps {
  events: FinancialEvent[];
  competitionUnlocked: boolean;
  onEventClick: (event: FinancialEvent) => void;
  onStartCompetition: () => void;
  randomScenarios?: { event: FinancialEvent; missionData: MissionData }[];
  completedRandomCount?: number;
  onGenerateRandomScenario?: () => void;
  streakDays?: number;
  onAskCoach?: () => void;
}

export function JourneyHub({ 
  events, 
  competitionUnlocked, 
  onEventClick, 
  onStartCompetition,
  randomScenarios = [],
  completedRandomCount = 0,
  onGenerateRandomScenario,
  streakDays = 0,
  onAskCoach,
}: JourneyHubProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  const completedCount = events.filter(e => e.completed).length;
  const progressPercentage = (completedCount / events.length) * 100;
  const streakMultiplier = streakDays >= 7 ? 2 : streakDays >= 3 ? 1.5 : 1;
  
  // Mastery level
  const currentMastery = getMasteryLevel(completedCount);
  const nextMastery = getNextMasteryLevel(completedCount);
  
  // All missions completed check
  const allMissionsCompleted = completedCount === events.length;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`space-y-4 sm:space-y-6 transition-all duration-700 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      {/* Hero Progress Banner - Mobile First Design */}
      <div className="relative p-4 sm:p-6 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl
        bg-gradient-to-br from-[#7070c0] via-[#5858a0] to-[#4848a0]
        dark:from-[#9898f2] dark:via-[#7070c0] dark:to-[#5050a0]
        border border-[#9898f2]/30 dark:border-[#9898f2]/50">
        
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -right-10 w-32 sm:w-40 h-32 sm:h-40 bg-white/15 dark:bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-48 sm:w-60 h-48 sm:h-60 bg-white/10 dark:bg-white/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative">
          {/* Top row - Compact on mobile */}
          <div className="flex items-start justify-between gap-2 mb-4 sm:mb-5">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/25 dark:bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg flex-shrink-0">
                <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-white drop-shadow-sm" />
              </div>
              <div>
                <p className="text-white/90 dark:text-white/80 text-[10px] sm:text-xs font-medium tracking-wide">Your Learning Journey</p>
                <h2 className="text-base sm:text-xl font-black text-white drop-shadow-sm leading-tight">
                  Master Market History
                </h2>
              </div>
            </div>
            
            {/* Badges - Stack on mobile */}
            <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-2">
              <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/25 dark:bg-white/20 backdrop-blur-sm border border-white/30 shadow-md">
                <span className="text-sm sm:text-base drop-shadow-sm">{currentMastery.icon}</span>
                <span className="text-white font-bold text-[10px] sm:text-xs whitespace-nowrap">{currentMastery.name}</span>
              </div>
              
              {streakMultiplier > 1 && (
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 px-2 py-1 shadow-lg shadow-orange-500/30 animate-pulse text-[10px] sm:text-xs">
                  <Flame className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1 drop-shadow-sm" />
                  <span className="font-bold">{streakMultiplier}x</span>
                </Badge>
              )}
            </div>
          </div>
          
          {/* Progress Bar Section */}
          <div className="relative">
            <div className="h-3 sm:h-4 bg-white/30 dark:bg-white/25 rounded-full overflow-hidden backdrop-blur-sm border border-white/20 shadow-inner">
              <div 
                className="h-full rounded-full bg-white transition-all duration-1000 ease-out relative shadow-lg"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#9898f2]/40 to-transparent animate-shimmer" />
              </div>
            </div>
            
            {/* Progress Stats - Compact on mobile */}
            <div className="flex justify-between items-center mt-2 sm:mt-3 text-xs sm:text-sm">
              <div className="flex items-center gap-1 text-white/90 dark:text-white/80">
                <Target className="h-3 w-3 sm:h-4 sm:w-4 drop-shadow-sm" />
                <span className="font-semibold">{completedCount}/{events.length}</span>
                <span className="text-white/70 dark:text-white/60 text-[10px] sm:text-xs hidden sm:inline">Completed</span>
              </div>
              
              {nextMastery && !allMissionsCompleted && (
                <div className="flex items-center gap-1 text-white/80 dark:text-white/70 text-[10px] sm:text-xs">
                  <Zap className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  <span className="hidden sm:inline">{nextMastery.minMissions - completedCount} more to</span>
                  <span className="sm:hidden">{nextMastery.minMissions - completedCount}→</span>
                  <span className="font-semibold text-white">{nextMastery.name}</span>
                  <ChevronRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </div>
              )}
              
              {allMissionsCompleted && (
                <div className="flex items-center gap-1 text-amber-200 dark:text-amber-300">
                  <Trophy className="h-3 w-3 sm:h-4 sm:w-4 drop-shadow-sm" />
                  <span className="font-bold text-[10px] sm:text-sm">Complete!</span>
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 animate-pulse" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Completion Celebration - Compact on mobile */}
      {allMissionsCompleted && (
        <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl text-center
          bg-gradient-to-br from-amber-100 via-orange-50 to-amber-50
          dark:from-amber-500/20 dark:via-orange-500/10 dark:to-transparent
          border-2 border-amber-300/50 dark:border-amber-500/30
          shadow-lg shadow-amber-200/50 dark:shadow-amber-500/10">
          
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl 
            bg-gradient-to-br from-amber-400 to-orange-500 
            mb-2 sm:mb-3 shadow-xl shadow-amber-400/40 dark:shadow-amber-500/30 animate-heartbeat">
            <Star className="h-6 w-6 sm:h-7 sm:w-7 text-white fill-current drop-shadow-sm" />
          </div>
          
          <h3 className="text-base sm:text-lg font-black text-amber-900 dark:text-white mb-0.5 sm:mb-1">
            🎓 You're a {currentMastery.name}!
          </h3>
          <p className="text-xs sm:text-sm text-amber-700 dark:text-white/70">
            You've mastered all market history lessons!
          </p>
        </div>
      )}
      
      {/* Chapter Selection - THE MAIN CONTENT */}
      <ChapterHub 
        events={events} 
        onLevelClick={onEventClick}
        streakDays={streakDays}
      />
      
      {/* Skills & Knowledge - SINGLE INSTANCE, COLLAPSIBLE */}
      <SkillsDrawer 
        events={events} 
        onAskCoach={onAskCoach}
        defaultExpanded={false}
      />
      
      {/* Practice Mode - Competition + Random Scenarios */}
      <PracticeMode
        allMissionsCompleted={allMissionsCompleted}
        competitionUnlocked={competitionUnlocked}
        onStartCompetition={onStartCompetition}
        randomScenarios={randomScenarios}
        completedRandomCount={completedRandomCount}
        onGenerateRandomScenario={onGenerateRandomScenario || (() => {})}
        onPlayScenario={onEventClick}
      />
    </div>
  );
}

export default JourneyHub;
