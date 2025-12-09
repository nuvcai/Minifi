/**
 * PracticeMode - Competition & Random Scenarios Unified
 * Optimized for both light and dark mode visibility
 * Professional game edu app UX patterns
 * © 2025 NUVC.AI. All Rights Reserved.
 */

"use client";

import React from "react";
import { 
  Trophy,
  Dice6,
  Star,
  Play,
  Sparkles,
  RefreshCw,
  Clock,
  Swords,
  Infinity as InfinityIcon,
  Users,
  Crown,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FinancialEvent } from "@/components/data/events";
import { MissionData } from "@/components/data/missions";
import { III_CONFIG } from "@/hooks/useIII";

interface PracticeModeProps {
  allMissionsCompleted: boolean;
  competitionUnlocked: boolean;
  onStartCompetition: () => void;
  randomScenarios: { event: FinancialEvent; missionData: MissionData }[];
  completedRandomCount: number;
  onGenerateRandomScenario: () => void;
  onPlayScenario: (event: FinancialEvent) => void;
}

export function PracticeMode({
  allMissionsCompleted,
  competitionUnlocked,
  onStartCompetition,
  randomScenarios,
  completedRandomCount,
  onGenerateRandomScenario,
  onPlayScenario,
}: PracticeModeProps) {
  // Don't show if no missions completed and competition not unlocked
  if (!allMissionsCompleted && !competitionUnlocked) {
    return null;
  }
  
  const isUnlocked = competitionUnlocked || allMissionsCompleted;
  
  return (
    <div className="space-y-4 mt-6">
      {/* Competition Card - Light/Dark optimized */}
      <div className={`relative p-5 rounded-2xl border-2 transition-all overflow-hidden ${
        isUnlocked
          ? "bg-gradient-to-br from-amber-100 via-orange-50 to-amber-50 dark:from-amber-500/15 dark:via-orange-500/10 dark:to-amber-500/5 border-amber-400/50 dark:border-amber-500/40 hover:border-amber-500 dark:hover:border-amber-500/60 shadow-lg shadow-amber-200/30 dark:shadow-amber-500/10"
          : "bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-60"
      }`}>
        
        {/* Background decoration - visible in both modes */}
        {isUnlocked && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-400/20 dark:bg-amber-500/15 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-400/20 dark:bg-orange-500/15 rounded-full blur-3xl" />
          </div>
        )}
        
        <div className="relative flex items-start gap-4">
          <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
            isUnlocked
              ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-400/40 dark:shadow-amber-500/30"
              : "bg-slate-200 dark:bg-slate-700"
          }`}>
            <Swords className={`h-7 w-7 ${
              isUnlocked ? "text-white drop-shadow-sm" : "text-slate-400 dark:text-slate-500"
            }`} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`text-lg font-bold ${
                isUnlocked ? "text-amber-900 dark:text-white" : "text-slate-400 dark:text-slate-500"
              }`}>
                Competition Mode 🏆
              </h3>
              {isUnlocked && (
                <Badge className="bg-violet-500/25 dark:bg-violet-500/30 text-violet-700 dark:text-violet-300 border-violet-500/40 text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  COMING SOON
                </Badge>
              )}
            </div>
            
            <p className={`text-sm mb-4 ${
              isUnlocked ? "text-amber-800 dark:text-slate-300" : "text-slate-400 dark:text-slate-500"
            }`}>
              {isUnlocked
                ? "Weekly competitions coming soon! Practice your skills while you wait."
                : "Complete all missions to unlock competitive play"}
            </p>
            
            {/* Competition Stats - Teaser */}
            {isUnlocked && (
              <div className="flex items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1.5 text-violet-700 dark:text-violet-400">
                  <Users className="h-4 w-4" />
                  <span className="font-semibold">Join</span>
                  <span className="text-violet-600/70 dark:text-slate-400">waitlist</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                  <Crown className="h-4 w-4" />
                  <span className="font-semibold">500 {III_CONFIG.symbol}</span>
                  <span className="text-emerald-600/70 dark:text-slate-400">prize pool</span>
                </div>
              </div>
            )}
            
            <Button
              onClick={onStartCompetition}
              disabled={!isUnlocked}
              variant={isUnlocked ? "outline" : "default"}
              className={`font-bold ${
                isUnlocked
                  ? "border-amber-400 dark:border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-500/10"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500"
              }`}
            >
              <Trophy className="h-4 w-4 mr-2" />
              Preview Competition
            </Button>
          </div>
        </div>
      </div>
      
      {/* Random Scenario Generator - Only after all missions completed */}
      {allMissionsCompleted && (
        <div className="p-5 rounded-2xl overflow-hidden shadow-lg
          bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-50 
          dark:from-violet-500/20 dark:via-purple-500/15 dark:to-fuchsia-500/10 
          border border-violet-300/50 dark:border-violet-500/40">
          
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-400/40 dark:shadow-violet-500/30">
              <Dice6 className="h-7 w-7 text-white drop-shadow-sm" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-violet-900 dark:text-white">Practice Mode 🎯</h3>
                <Badge className="bg-violet-500/25 dark:bg-violet-500/30 text-violet-700 dark:text-violet-300 border-violet-500/40 text-xs">
                  <InfinityIcon className="h-3 w-3 mr-1" />
                  Infinite
                </Badge>
              </div>
              
              <p className="text-sm text-violet-800 dark:text-slate-300 mb-4">
                You've mastered all levels! Keep your skills sharp with randomly generated scenarios.
              </p>
              
              {/* Stats */}
              <div className="flex items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1.5 text-violet-700 dark:text-violet-400">
                  <RefreshCw className="h-4 w-4" />
                  <span className="font-semibold">{randomScenarios.length}</span>
                  <span className="text-violet-600/70 dark:text-slate-400">generated</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                  <Trophy className="h-4 w-4" />
                  <span className="font-semibold">{completedRandomCount}</span>
                  <span className="text-emerald-600/70 dark:text-slate-400">completed</span>
                </div>
              </div>
              
              {/* Generate Button */}
              <Button 
                onClick={onGenerateRandomScenario}
                className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 text-white font-bold shadow-lg shadow-violet-400/40 dark:shadow-violet-500/30 group"
              >
                <Dice6 className="h-4 w-4 mr-2 group-hover:animate-spin" style={{ animationDuration: '1s' }} />
                New Random Challenge
                <Sparkles className="h-4 w-4 ml-2 text-yellow-200" />
              </Button>
            </div>
          </div>
          
          {/* Recent Random Scenarios */}
          {randomScenarios.length > 0 && (
            <div className="mt-5 pt-4 border-t border-violet-300/50 dark:border-violet-500/30">
              <h4 className="text-sm font-semibold text-violet-800 dark:text-slate-300 mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent Practice Rounds
              </h4>
              <div className="grid gap-2">
                {randomScenarios.slice(-3).reverse().map((scenario) => (
                  <button
                    key={scenario.event.title}
                    onClick={() => onPlayScenario(scenario.event)}
                    disabled={scenario.event.completed}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      scenario.event.completed
                        ? 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-60'
                        : 'bg-white dark:bg-slate-800/80 border-violet-300 dark:border-violet-500/40 hover:border-violet-500 dark:hover:border-violet-500/60 hover:bg-violet-50 dark:hover:bg-violet-500/10 cursor-pointer shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          scenario.event.completed
                            ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                            : 'bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400'
                        }`}>
                          {scenario.event.completed ? (
                            <Star className="h-4 w-4 fill-current" />
                          ) : (
                            <Dice6 className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className={`font-semibold text-sm ${
                            scenario.event.completed 
                              ? 'text-slate-400 dark:text-slate-500' 
                              : 'text-slate-800 dark:text-white'
                          }`}>
                            {scenario.event.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                            {scenario.event.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${
                          scenario.event.completed 
                            ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-600' 
                            : 'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-500/40'
                        }`}>
                          {scenario.event.reward} {III_CONFIG.symbol}
                        </Badge>
                        {!scenario.event.completed && (
                          <Play className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Completion Celebration Banner - Only show once */}
      {allMissionsCompleted && randomScenarios.length === 0 && (
        <div className="p-5 rounded-2xl text-center shadow-lg
          bg-gradient-to-br from-emerald-100 via-teal-50 to-emerald-50 
          dark:from-emerald-500/20 dark:via-teal-500/15 dark:to-emerald-500/10 
          border border-emerald-300/50 dark:border-emerald-500/40">
          
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 mb-3 shadow-xl shadow-emerald-400/40 dark:shadow-emerald-500/30 animate-bounce">
            <Star className="h-7 w-7 text-white fill-current drop-shadow-sm" />
          </div>
          
          <h3 className="text-lg font-bold text-emerald-900 dark:text-white mb-1">
            🎓 Journey Complete!
          </h3>
          <p className="text-sm text-emerald-800 dark:text-slate-300 mb-3">
            You've mastered all market history lessons. Now keep practicing!
          </p>
          <Button 
            onClick={onGenerateRandomScenario}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold shadow-lg shadow-emerald-400/40 dark:shadow-emerald-500/30"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Start Practicing
          </Button>
        </div>
      )}
    </div>
  );
}

export default PracticeMode;
