/**
 * ChapterHub - MOBILE-FIRST Game Chapter Selection Screen
 * Touch-optimized cards with 44px+ touch targets
 * Modern mobile game UX patterns (Duolingo, Candy Crush inspired)
 * © 2025 NUVC.AI. All Rights Reserved.
 */

"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { 
  Lock,
  Star,
  Flame,
  Trophy,
  Play,
  Gift,
  Heart,
  CheckCircle2,
  Rocket,
  Brain,
  Clock,
  TrendingDown,
  TrendingUp,
  Minus,
  Sparkles,
  Zap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FinancialEvent } from "@/components/data/events";
import { chapters, levelMeta } from "@/components/data/chapters";
import { III_CONFIG } from "@/hooks/useIII";

interface ChapterHubProps {
  events: FinancialEvent[];
  onLevelClick: (event: FinancialEvent) => void;
  streakDays?: number;
}

// Difficulty configuration
const difficultyConfig: Record<string, { label: string; time: number; dots: number; color: string }> = {
  beginner: { label: "Easy", time: 5, dots: 1, color: "emerald" },
  intermediate: { label: "Medium", time: 8, dots: 2, color: "amber" },
  advanced: { label: "Hard", time: 12, dots: 3, color: "orange" },
  expert: { label: "Expert", time: 15, dots: 4, color: "rose" },
};

// Impact indicator component
const ImpactBadge = ({ impact }: { impact: string }) => {
  if (impact === "negative") {
    return (
      <div className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400">
        <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
        <span className="text-[9px] sm:text-[10px] font-bold">CRASH</span>
      </div>
    );
  } else if (impact === "mixed") {
    return (
      <div className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
        <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
        <span className="text-[9px] sm:text-[10px] font-bold">VOLATILE</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
      <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
      <span className="text-[9px] sm:text-[10px] font-bold">BULL</span>
    </div>
  );
};

// Difficulty dots component
const DifficultyDots = ({ level, color }: { level: number; color: string }) => {
  const colorClasses: Record<string, string> = {
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    orange: "bg-orange-500",
    rose: "bg-rose-500",
  };
  
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4].map((dot) => (
        <div
          key={dot}
          className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-colors ${
            dot <= level
              ? colorClasses[color] || "bg-slate-500"
              : "bg-slate-200 dark:bg-slate-600"
          }`}
        />
      ))}
    </div>
  );
};

export function ChapterHub({ events, onLevelClick, streakDays = 0 }: ChapterHubProps) {
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [animatingLevel, setAnimatingLevel] = useState<number | null>(null);
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(true);
  const chapterScrollRef = useRef<HTMLDivElement>(null);
  
  const completedLevels = events.filter(e => e.completed).length;
  const currentChapter = chapters[selectedChapter];
  const progressPercentage = (completedLevels / events.length) * 100;
  
  // Streak bonus calculation
  const streakMultiplier = streakDays >= 7 ? 2 : streakDays >= 3 ? 1.5 : 1;
  
  // Find next available level
  const nextLevel = events.find(e => e.unlocked && !e.completed);
  
  // Auto-scroll to selected chapter on mobile
  useEffect(() => {
    if (chapterScrollRef.current) {
      const selectedElement = chapterScrollRef.current.children[selectedChapter] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedChapter]);
  
  const handleLevelClick = (event: FinancialEvent, index: number) => {
    if (!event.unlocked) return;
    setAnimatingLevel(index);
    // Haptic feedback for mobile
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
    setTimeout(() => {
      setAnimatingLevel(null);
      onLevelClick(event);
    }, 200);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Chapter Selection Pills - Mobile Optimized with Snap Scroll */}
      <div 
        ref={chapterScrollRef}
        className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:-mx-0 sm:px-0 snap-x snap-mandatory"
      >
        {chapters.map((chapter, idx) => (
          <button
            key={chapter.id}
            onClick={() => chapter.unlocked && setSelectedChapter(idx)}
            disabled={!chapter.unlocked}
            className={`flex-shrink-0 min-h-[44px] sm:min-h-[48px] px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl font-bold text-sm transition-all duration-300 border snap-center touch-manipulation active:scale-95 ${
              selectedChapter === idx
                ? `bg-gradient-to-r ${chapter.theme} text-white shadow-lg shadow-[#9898f2]/30 scale-[1.02] border-transparent`
                : chapter.unlocked
                  ? "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 cursor-not-allowed border-slate-200 dark:border-slate-700/50"
            }`}
          >
            <span className="mr-1.5 text-base">{chapter.emoji}</span>
            {chapter.unlocked ? (
              <span className="whitespace-nowrap">Ch. {chapter.id}</span>
            ) : (
              <span className="flex items-center gap-1 whitespace-nowrap">
                <Lock className="h-3.5 w-3.5" />
              </span>
            )}
          </button>
        ))}
      </div>
      
      {/* Main Chapter Card - Mobile First */}
      <div className="relative rounded-2xl overflow-hidden shadow-xl
        bg-white dark:bg-slate-900/80
        bg-gradient-to-br from-[#9898f2]/10 via-[#9898f2]/5 to-transparent
        dark:from-[#9898f2]/20 dark:via-[#9898f2]/10 dark:to-transparent
        border-2 border-[#9898f2]/30 dark:border-[#9898f2]/40">
        
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-20 -right-20 w-40 sm:w-60 h-40 sm:h-60 bg-gradient-to-br ${currentChapter.theme} opacity-15 dark:opacity-20 rounded-full blur-3xl`} />
          <div className={`absolute -bottom-20 -left-20 w-60 sm:w-80 h-60 sm:h-80 bg-gradient-to-br ${currentChapter.theme} opacity-10 dark:opacity-15 rounded-full blur-3xl`} />
        </div>
        
        <div className="relative">
          {/* Chapter Header - Tappable on mobile */}
          <button
            onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
            className="w-full text-left p-4 sm:p-6 sm:cursor-default touch-manipulation active:bg-slate-50/50 dark:active:bg-white/5 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${currentChapter.theme} flex items-center justify-center text-xl sm:text-3xl shadow-xl shadow-[#9898f2]/30 flex-shrink-0`}>
                  {currentChapter.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge className={`bg-gradient-to-r ${currentChapter.theme} text-white border-0 text-[10px] sm:text-xs font-bold px-2 shadow-sm`}>
                      CHAPTER {currentChapter.id}
                    </Badge>
                    {completedLevels === events.length && (
                      <Badge className="bg-amber-100 dark:bg-amber-500/25 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-500/40 text-[10px]">
                        <Star className="h-2.5 w-2.5 mr-0.5 fill-current" />
                        COMPLETE
                      </Badge>
                    )}
                  </div>
                  <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white mb-0.5 leading-tight">
                    {currentChapter.title}
                  </h2>
                  <p className="text-[#5858a0] dark:text-[#b8b8ff] font-medium text-xs sm:text-sm line-clamp-1">
                    {currentChapter.subtitle}
                  </p>
                </div>
              </div>
              
              {/* Stats + Collapse indicator */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <div className="sm:hidden text-slate-400">
                  {isHeaderExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
                {streakMultiplier > 1 && (
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg animate-pulse text-[10px] px-2">
                    <Flame className="h-3 w-3 mr-0.5" />
                    {streakMultiplier}x
                  </Badge>
                )}
                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 text-xs">
                  <Trophy className="h-3.5 w-3.5 text-amber-500" />
                  <span className="font-bold">{completedLevels}/{events.length}</span>
                </div>
              </div>
            </div>
          </button>
          
          {/* Collapsible Progress Section */}
          <div className={`transition-all duration-300 overflow-hidden ${
            isHeaderExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 sm:max-h-[500px] sm:opacity-100'
          }`}>
            <div className="px-4 sm:px-6 pb-4 sm:pb-0">
              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 mb-1.5">
                  <span className="font-medium">Chapter Progress</span>
                  <span className="font-bold text-slate-900 dark:text-white">{Math.round(progressPercentage)}%</span>
                </div>
                <div className="relative h-2.5 bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${currentChapter.theme} transition-all duration-1000 ease-out relative overflow-hidden`}
                    style={{ width: `${progressPercentage}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>
                </div>
                
                {/* Milestones */}
                <div className="flex justify-between mt-1.5 px-1">
                  {[
                    { at: 25, icon: "⭐" },
                    { at: 50, icon: "🎯" },
                    { at: 75, icon: "💎" },
                    { at: 100, icon: "🏆" },
                  ].map((reward) => (
                    <div 
                      key={reward.at}
                      className={`text-xs transition-all ${
                        progressPercentage >= reward.at ? 'opacity-100 scale-110' : 'opacity-40'
                      }`}
                    >
                      {reward.icon}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Skills - Horizontal scroll on mobile */}
              <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                {currentChapter.skills.map((skill) => (
                  <Badge 
                    key={skill}
                    variant="outline" 
                    className="border-[#9898f2]/40 text-[#5858a0] dark:text-[#b8b8ff] bg-[#9898f2]/10 text-[10px] whitespace-nowrap flex-shrink-0"
                  >
                    <Brain className="h-2.5 w-2.5 mr-0.5" />
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          {/* ============================================= */}
          {/* MOBILE-FIRST MISSION CARDS */}
          {/* ============================================= */}
          <div className="p-4 sm:p-6 pt-2 sm:pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {events.map((event, index) => {
              const meta = levelMeta[index] || levelMeta[0];
              const difficulty = difficultyConfig[event.difficulty] || difficultyConfig.beginner;
              const isLocked = !event.unlocked;
              const isCompleted = event.completed;
              const isNext = nextLevel?.year === event.year;
              const isAnimating = animatingLevel === index;
              
              // LOCKED CARD - Compact
              if (isLocked) {
                return (
                  <div
                    key={event.year}
                    className="relative p-3 rounded-xl bg-slate-100 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/50 opacity-60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                        <Lock className="h-5 w-5 text-slate-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-bold text-slate-400">{event.year}</span>
                        <h4 className="font-bold text-sm text-slate-400 leading-tight truncate">{event.title}</h4>
                      </div>
                    </div>
                  </div>
                );
              }
              
              // COMPLETED CARD
              if (isCompleted) {
                return (
                  <div
                    key={event.year}
                    onClick={() => handleLevelClick(event, index)}
                    className={`group relative p-3 rounded-xl overflow-hidden cursor-pointer transition-all duration-200
                      bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/15 dark:to-teal-500/10
                      border-2 border-emerald-300 dark:border-emerald-500/40
                      active:scale-[0.98] touch-manipulation
                      ${isAnimating ? 'scale-95' : ''}`}
                  >
                    <div className="absolute -top-10 -right-10 w-20 h-20 bg-emerald-400/20 rounded-full blur-2xl" />
                    
                    <div className="relative">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md flex-shrink-0">
                          <CheckCircle2 className="h-5 w-5 text-white" />
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">{event.year}</span>
                            <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-0 text-[8px] font-bold px-1">✓</Badge>
                            <ImpactBadge impact={event.impact} />
                          </div>
                          <h4 className="font-bold text-sm text-slate-800 dark:text-white leading-tight truncate">{event.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">+{event.reward} {III_CONFIG.symbol} earned</span>
                          </div>
                        </div>
                        
                      </div>
                      
                      {/* Replay Button - Full width on mobile */}
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLevelClick(event, index);
                        }}
                        variant="outline"
                        className="w-full mt-2 min-h-[40px] sm:min-h-[32px] text-xs font-semibold border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 touch-manipulation active:scale-[0.97]"
                      >
                        <Play className="h-3.5 w-3.5 mr-1.5" />
                        Play Again
                      </Button>
                    </div>
                    
                    {/* Stars - Top right corner */}
                    <div className="absolute top-2 right-2 flex gap-0.5">
                      {[...Array(meta.stars)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                );
              }
              
              // AVAILABLE / NEXT CARD
              return (
                <div
                  key={event.year}
                  onClick={() => handleLevelClick(event, index)}
                  className={`group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200
                    active:scale-[0.98] touch-manipulation
                    ${isNext 
                      ? 'bg-gradient-to-br from-[#9898f2]/10 via-violet-50 to-purple-50 dark:from-[#9898f2]/20 dark:via-violet-500/10 dark:to-purple-500/10 border-2 border-[#9898f2]/50 dark:border-[#9898f2]/60 shadow-lg shadow-[#9898f2]/20 ring-2 ring-[#9898f2]/20'
                      : 'bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700'
                    }
                    ${isAnimating ? 'scale-95' : ''}`}
                >
                  {isNext && (
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#9898f2]/20 rounded-full blur-3xl animate-pulse" />
                  )}
                  
                  {/* Image - Smaller on mobile */}
                  {event.image && (
                    <div className="relative h-16 sm:h-24 overflow-hidden">
                      <Image
                        src={event.image}
                        alt={event.imageAlt || event.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-800 via-white/60 dark:via-slate-800/60 to-transparent" />
                      
                      <div className="absolute top-2 left-2">
                        <div className={`px-2 py-0.5 rounded-lg font-black text-sm shadow-md ${
                          isNext 
                            ? 'bg-gradient-to-r from-[#9898f2] to-violet-500 text-white' 
                            : 'bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-white'
                        }`}>
                          {event.year}
                        </div>
                      </div>
                      
                      <div className="absolute top-2 right-2">
                        <ImpactBadge impact={event.impact} />
                      </div>
                      
                      {isNext && (
                        <div className="absolute bottom-2 right-2">
                          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-[9px] font-bold animate-pulse shadow-lg px-2">
                            <Zap className="h-2.5 w-2.5 mr-0.5" />
                            NEXT
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-3">
                    <h4 className={`font-bold text-sm mb-0.5 leading-tight ${
                      isNext ? 'text-[#5858a0] dark:text-[#b8b8ff]' : 'text-slate-800 dark:text-white'
                    }`}>
                      {event.title}
                    </h4>
                    
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-2 line-clamp-1">
                      {event.description}
                    </p>
                    
                    {/* Meta - Difficulty & Time */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-1">
                        <DifficultyDots level={difficulty.dots} color={difficulty.color} />
                        <span className={`text-[10px] font-semibold text-${difficulty.color}-600`}>
                          {difficulty.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5 text-slate-500">
                        <Clock className="h-3 w-3" />
                        <span className="text-[10px]">{difficulty.time}m</span>
                      </div>
                      {/* Stars - Hidden on mobile, shown above button */}
                      <div className="hidden sm:flex items-center gap-0.5">
                        {[...Array(meta.stars)].map((_, i) => (
                          <Star key={i} className="h-2.5 w-2.5 text-slate-300 dark:text-slate-600" />
                        ))}
                      </div>
                    </div>
                    
                    {/* Bottom row - Mobile optimized with full-width button */}
                    <div className="space-y-2">
                      {/* Reward badge */}
                      <div className="flex items-center justify-between">
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                          isNext ? 'bg-amber-100 dark:bg-amber-500/20' : 'bg-slate-100 dark:bg-slate-700'
                        }`}>
                          <Sparkles className={`h-3 w-3 ${isNext ? 'text-amber-500' : 'text-slate-500'}`} />
                          <span className={`text-xs font-bold ${
                            isNext ? 'text-amber-700 dark:text-amber-300' : 'text-slate-700 dark:text-slate-300'
                          }`}>
                            +{Math.round(event.reward * streakMultiplier)} {III_CONFIG.symbol}
                          </span>
                          {streakMultiplier > 1 && (
                            <Flame className="h-2.5 w-2.5 text-orange-500" />
                          )}
                        </div>
                        {/* Stars on mobile */}
                        <div className="flex items-center gap-0.5 sm:hidden">
                          {[...Array(meta.stars)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 text-slate-300 dark:text-slate-600" />
                          ))}
                        </div>
                      </div>
                      
                      {/* Play Button - Full width on mobile, compact on desktop */}
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLevelClick(event, index);
                        }}
                        className={`w-full sm:w-auto min-h-[44px] sm:min-h-[36px] px-4 sm:px-3 text-sm sm:text-xs font-bold touch-manipulation active:scale-[0.97] transition-all ${
                          isNext 
                            ? 'bg-gradient-to-r from-[#9898f2] to-violet-500 hover:from-[#8888e2] hover:to-violet-600 text-white shadow-lg shadow-[#9898f2]/30' 
                            : 'bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white'
                        }`}
                      >
                        <Play className="h-4 w-4 sm:h-3.5 sm:w-3.5 mr-1.5 sm:mr-1" />
                        {isNext ? 'Start Mission' : 'Play Again'}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Chapter Reward - Compact */}
          <div className="mx-4 sm:mx-6 mb-4 sm:mb-6 p-3 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-500/15 dark:to-orange-500/10 border border-amber-200 dark:border-amber-500/30">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg flex-shrink-0">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold">CHAPTER REWARD</p>
                  <p className="text-slate-800 dark:text-white font-bold text-sm truncate">{currentChapter.reward}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-amber-600 dark:text-amber-400 font-bold text-lg">{completedLevels}/{currentChapter.levels}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Coming Soon Chapters - Compact */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-semibold">
          <Rocket className="h-4 w-4" />
          COMING SOON
        </div>
        
        <div className="grid gap-2 sm:gap-3">
          {chapters.filter(c => c.comingSoon).map((chapter) => (
            <div
              key={chapter.id}
              className="relative p-3 sm:p-4 rounded-xl overflow-hidden cursor-not-allowed
                bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 opacity-70"
            >
              <div className="absolute inset-0 bg-slate-200/80 dark:bg-slate-900/60 backdrop-blur-[1px] flex items-center justify-center">
                <Badge className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 shadow-md text-xs">
                  <Lock className="h-3 w-3 mr-1" />
                  Complete Ch. {chapter.id - 1}
                </Badge>
              </div>
              
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${chapter.theme} flex items-center justify-center text-lg sm:text-xl opacity-50`}>
                  {chapter.emoji}
                </div>
                <div>
                  <Badge className="text-[10px] mb-0.5 opacity-50">CHAPTER {chapter.id}</Badge>
                  <h3 className="text-sm sm:text-base font-bold text-slate-600 dark:text-slate-400">{chapter.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Sponsor CTA */}
        <div className="p-3 sm:p-4 rounded-xl bg-[#9898f2]/10 dark:bg-[#9898f2]/15 border border-[#9898f2]/30">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#9898f2] to-violet-500 flex items-center justify-center flex-shrink-0 shadow-lg">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-slate-900 dark:text-white font-bold text-sm mb-1">Help Us Build More! ❤️</p>
              <p className="text-slate-600 dark:text-slate-300 text-xs mb-2">
                Sponsor our mission to bring financial literacy to every teen!
              </p>
              <Button 
                className="w-full sm:w-auto min-h-[44px] sm:min-h-[36px] bg-gradient-to-r from-[#9898f2] to-violet-500 text-white font-bold text-xs sm:text-sm touch-manipulation active:scale-[0.97]"
              >
                <Gift className="h-4 w-4 sm:h-3.5 sm:w-3.5 mr-1.5" />
                Become a Sponsor
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
