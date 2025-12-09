/**
 * TimelineSection - Educational Journey Timeline
 * Expert-designed gamification with clear learning paths
 * Key principles: Visual progression, skill trees, intrinsic motivation
 * 
 * v2.0 - Enhanced Chapter-based progression system for teens
 */

"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Filter,
  Trophy,
  Zap,
  Play,
  MapPin,
  Flag,
  Star,
  TrendingUp,
  Clock,
  Dice6,
  Infinity as InfinityIcon,
  RefreshCw,
  Target,
  Flame,
  GraduationCap,
  BookOpen,
  Brain,
  Award,
  ChevronRight,
  Lightbulb,
  Rocket,
  Shield,
  Gamepad2,
  Lock,
  Gift,
  Heart,
  Crown,
  Swords,
} from "lucide-react";
import { FinancialEvent } from "@/components/data/events";
import { EventCard } from "./EventCard";
import { CompetitionCard } from "./CompetitionCard";
import { SkillsDrawer } from "./SkillsDrawer";
import { ChapterHub } from "./ChapterHub";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TimelineSectionProps {
  events: FinancialEvent[];
  competitionUnlocked: boolean;
  onEventClick: (event: FinancialEvent) => void;
  onStartCompetition: () => void;
  // Random scenario props
  randomScenarios?: { event: FinancialEvent; missionData: unknown }[];
  completedRandomCount?: number;
  onGenerateRandomScenario?: () => void;
  streakDays?: number;
}

// Era groupings for educational context
const eraInfo: Record<string, { name: string; theme: string; icon: React.ReactNode; color: string }> = {
  "1990s": { 
    name: "The Bubble Era", 
    theme: "When markets lost touch with reality",
    icon: <Lightbulb className="h-4 w-4" />,
    color: "from-rose-500 to-pink-500"
  },
  "2000s": { 
    name: "The Digital Crash", 
    theme: "Technology hype meets cold reality",
    icon: <Rocket className="h-4 w-4" />,
    color: "from-blue-500 to-cyan-500"
  },
  "2010s": { 
    name: "Recovery & Growth", 
    theme: "Learning from past mistakes",
    icon: <TrendingUp className="h-4 w-4" />,
    color: "from-[#9898f2] to-[#7070c0]"
  },
  "2020s": { 
    name: "The New Normal", 
    theme: "Navigating unprecedented change",
    icon: <Brain className="h-4 w-4" />,
    color: "from-violet-500 to-purple-500"
  },
};

// Skill mastery levels - aligned with levelTitles from LevelUpCelebration
const masteryLevels = [
  { name: "Rookie Investor", minMissions: 0, icon: "🎯", color: "text-gray-500" },
  { name: "Market Explorer", minMissions: 2, icon: "✨", color: "text-emerald-500" },
  { name: "Rising Trader", minMissions: 4, icon: "⚡", color: "text-blue-500" },
  { name: "Smart Investor", minMissions: 5, icon: "⭐", color: "text-purple-500" },
  { name: "Market Mover", minMissions: 6, icon: "🏆", color: "text-amber-500" },
];

export function TimelineSection({ 
  events, 
  competitionUnlocked, 
  onEventClick, 
  onStartCompetition,
  randomScenarios = [],
  completedRandomCount = 0,
  onGenerateRandomScenario,
  streakDays = 0,
}: TimelineSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [filter, setFilter] = useState<"all" | "available" | "completed">("all");
  const [showLearningPath, setShowLearningPath] = useState(true);
  // Default to timeline view for better onboarding experience
  const [viewMode, setViewMode] = useState<"chapter" | "classic">("classic");
  
  const completedCount = events.filter(e => e.completed).length;
  const availableCount = events.filter(e => e.unlocked && !e.completed).length;
  const progressPercentage = (completedCount / events.length) * 100;
  const streakMultiplier = streakDays >= 7 ? 2 : streakDays >= 3 ? 1.5 : 1;
  
  // Calculate mastery level
  const currentMastery = masteryLevels.reduce((best, level) => 
    completedCount >= level.minMissions ? level : best, 
    masteryLevels[0]
  );
  const nextMastery = masteryLevels.find(l => l.minMissions > completedCount);
  
  // Filtered events
  const filteredEvents = events.filter(event => {
    if (filter === "available") return event.unlocked && !event.completed;
    if (filter === "completed") return event.completed;
    return true;
  });

  // Get recommended next mission
  const recommendedMission = events.find(e => e.unlocked && !e.completed);
  
  // All missions completed check
  const allMissionsCompleted = completedCount === events.length;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Get era for a year
  const getEra = (year: number): string => {
    if (year < 2000) return "1990s";
    if (year < 2010) return "2000s";
    if (year < 2020) return "2010s";
    return "2020s";
  };

  return (
    <div className={`transition-all duration-700 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      {/* View Mode Toggle - Compact pill design */}
      <div className="flex items-center justify-end mb-4">
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
          <button
            onClick={() => setViewMode("classic")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === "classic"
                ? "bg-gradient-to-r from-[#9898f2] to-[#7070c0] text-white shadow-lg"
                : "text-slate-500 dark:text-white/60 hover:text-slate-700 dark:hover:text-white"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Timeline</span>
          </button>
          <button
            onClick={() => setViewMode("chapter")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === "chapter"
                ? "bg-gradient-to-r from-[#9898f2] to-[#7070c0] text-white shadow-lg"
                : "text-slate-500 dark:text-white/60 hover:text-slate-700 dark:hover:text-white"
            }`}
          >
            <Swords className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Chapters</span>
          </button>
        </div>
      </div>
      
      {/* Chapter View Mode - NEW DESIGN */}
      {viewMode === "chapter" && (
        <>
          <ChapterHub 
            events={events} 
            onLevelClick={onEventClick}
            streakDays={streakDays}
          />
          
          {/* Family Office Wisdom Section - Skills & Knowledge */}
          <div className="mt-6">
            <SkillsDrawer events={events} />
          </div>
        </>
      )}
      
      {/* Classic Timeline View */}
      {viewMode === "classic" && (
        <>
          {/* Chapter 1 Quick Info Banner */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#9898f2]/10 via-violet-500/5 to-purple-500/5 dark:from-[#9898f2]/20 dark:via-violet-500/10 dark:to-purple-500/5 border border-[#9898f2]/30">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9898f2] to-[#7070c0] flex items-center justify-center text-xl shadow-lg">
                  📉
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <Badge className="bg-[#9898f2]/20 text-[#7070c0] dark:text-[#9898f2] border-[#9898f2]/30 text-[10px]">
                      CHAPTER 1
                    </Badge>
                    <span className="text-xs text-slate-500 dark:text-white/50">
                      {completedCount}/{events.length} completed
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Learn from Market Crashes</h3>
                </div>
              </div>
              <button
                onClick={() => setViewMode("chapter")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#9898f2]/10 hover:bg-[#9898f2]/20 dark:bg-white/10 dark:hover:bg-white/20 text-[#7070c0] dark:text-[#9898f2] text-sm font-semibold transition-all"
              >
                <Swords className="h-4 w-4" />
                <span className="hidden sm:inline">View Chapters</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        
      {/* Educational Journey Hero */}
      <div className="mb-6 p-6 rounded-3xl bg-gradient-to-br from-[#9898f2] via-[#7070c0] to-[#5050a0] dark:from-[#9898f2]/90 dark:via-[#7070c0]/80 dark:to-[#5050a0]/70 border border-[#9898f2]/50 relative overflow-hidden shadow-xl shadow-[#9898f2]/20">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative">
          {/* Top stats row */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur border border-white/30">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium">Your Learning Journey</p>
                <h2 className="text-2xl font-black text-white">
                  Master Market History
                </h2>
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              {/* Mastery Level Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur border border-white/20">
                <span className="text-lg">{currentMastery.icon}</span>
                <span className="text-white font-bold text-sm">{currentMastery.name}</span>
              </div>
              
              {/* Streak Multiplier */}
              {streakMultiplier > 1 && (
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 px-3 py-1.5 animate-pulse">
                  <Flame className="h-4 w-4 mr-1" />
                  <span className="font-bold">{streakMultiplier}x 🪙</span>
                </Badge>
              )}
              
              {availableCount > 0 && (
                <Badge className="bg-amber-500/90 text-white border-0 px-3 py-1.5 flex items-center gap-1.5">
                  <Zap className="h-4 w-4" />
                  <span className="font-bold">{availableCount} Available</span>
                </Badge>
              )}
            </div>
          </div>
          
          {/* Visual Journey Progress with Learning Path */}
          <div className="relative">
            {/* Era markers with connections */}
            <div className="flex justify-between mb-2 px-1">
              {events.slice(0, 6).map((event, i) => {
                const isActive = event.unlocked && !event.completed;
                const era = getEra(event.year);
                const eraData = eraInfo[era];
                
                return (
                  <div 
                    key={event.year}
                    className={`flex flex-col items-center transition-all duration-500 group ${
                      event.completed ? 'opacity-100' : event.unlocked ? 'opacity-90' : 'opacity-40'
                    }`}
                  >
                    {/* Year node */}
                    <div className="relative">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        event.completed 
                          ? 'bg-[#9898f2] text-white shadow-lg shadow-[#9898f2]/50' 
                          : isActive 
                            ? 'bg-white text-[#7070c0] shadow-lg ring-2 ring-white/50 ring-offset-2 ring-offset-[#9898f2]' 
                            : 'bg-white/20 text-white/70'
                      }`}>
                        {event.completed ? (
                          <Star className="h-4 w-4 fill-current" />
                        ) : (
                          <span>{event.year.toString().slice(-2)}</span>
                        )}
                      </div>
                      
                      {/* Connection to next */}
                      {i < 5 && (
                        <div className={`absolute top-1/2 left-full w-[calc(100%-0.5rem)] h-0.5 transform -translate-y-1/2 ${
                          event.completed ? 'bg-[#9898f2]/60' : 'bg-white/20'
                        }`} style={{ width: 'calc(100vw / 8)' }} />
                      )}
                    </div>
                    
                    {/* Era tooltip on hover */}
                    <div className={`absolute top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 hidden sm:block`}>
                      <div className="px-2 py-1 bg-white/95 rounded-lg shadow-lg text-[10px] whitespace-nowrap text-gray-700 font-medium">
                        {event.title}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Final destination */}
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                  completedCount === events.length
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-400/50 animate-heartbeat'
                    : 'bg-white/20 text-white/50'
                }`}>
                  <Flag className="h-4 w-4" />
                </div>
              </div>
            </div>
            
            {/* Progress track */}
            <div className="h-3 bg-white/30 rounded-full overflow-hidden backdrop-blur">
              <div 
                className="h-full rounded-full bg-white transition-all duration-1000 ease-out relative"
                style={{ width: `${progressPercentage}%` }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#9898f2]/30 to-transparent animate-shimmer" />
              </div>
            </div>
            
            {/* Journey stats */}
            <div className="flex justify-between mt-3 text-sm">
              <div className="flex items-center gap-1.5 text-white/70">
                <BookOpen className="h-4 w-4" />
                <span>Beginner</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-white font-bold">
                  <Target className="h-4 w-4" />
                  <span>{completedCount}/{events.length} Mastered</span>
                </div>
                {nextMastery && (
                  <span className="text-white/60 text-xs">
                    • {nextMastery.minMissions - completedCount} to {nextMastery.name}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-white/70">
                <Award className="h-4 w-4" />
                <span>Expert</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Skills & Knowledge Dashboard */}
      {/* 🎯 PRIMARY CTA - Front and Center */}
      {recommendedMission && (
        <div className="mb-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#9898f2] via-[#7070c0] to-[#5050a0] shadow-2xl shadow-[#9898f2]/30 relative overflow-hidden group hover:shadow-3xl hover:shadow-[#9898f2]/40 transition-all duration-300">
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-radial from-white/5 to-transparent rounded-full" />
          
          <div className="relative text-center sm:text-left">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-white/40 rounded-2xl blur-lg animate-pulse" />
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl border-2 border-white/30">
                  <Play className="h-10 w-10 sm:h-12 sm:w-12 text-white drop-shadow-lg" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                  <Badge className="bg-white/20 text-white border-white/30 text-xs font-bold backdrop-blur-sm">
                    🚀 Start Here
                  </Badge>
                  <Badge className="bg-amber-400/90 text-amber-900 border-0 text-xs font-bold">
                    +{recommendedMission.reward} iii
                  </Badge>
                  {streakMultiplier > 1 && (
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 text-xs font-bold animate-pulse">
                      <Flame className="h-3 w-3 mr-1" />{streakMultiplier}x Bonus
                    </Badge>
                  )}
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 drop-shadow-lg">
                  Ready to Learn? 🎮
                </h2>
                <p className="text-white/80 text-sm sm:text-base max-w-md">
                  Start with <span className="font-bold text-white">{recommendedMission.title}</span> — 
                  {completedCount === 0 
                    ? " your first step to becoming a smart investor!" 
                    : " continue your journey to market mastery!"}
                </p>
              </div>
            </div>
            
            {/* CTA Button - BIG and Prominent */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button
                onClick={() => onEventClick(recommendedMission)}
                className="w-full sm:w-auto bg-white hover:bg-gray-50 text-[#7070c0] font-black text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all px-8 py-6 rounded-xl group/btn"
                size="lg"
              >
                <Play className="h-6 w-6 mr-2 group-hover/btn:scale-110 transition-transform fill-current" />
                Start Mission Now
                <ChevronRight className="h-5 w-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
              <div className="flex items-center gap-4 text-white/70 text-sm">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  ~5 min
                </span>
                <span className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  {recommendedMission.difficulty}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Skills & Knowledge - Collapsible */}
      <div className="mb-6">
        <SkillsDrawer events={events} />
      </div>
      
      {/* Main Content Card - Premium Design */}
      <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 overflow-hidden shadow-lg dark:shadow-none">
        {/* Premium Header Bar */}
        <div className="p-5 sm:p-6 bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 shadow-lg">
                <Flame className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-[#9898f2]/20 text-[#7878d2] dark:text-[#9898f2] border border-[#9898f2]/30 text-[10px]">
                    Chapter 1
                  </Badge>
                  <span className="text-[10px] text-slate-400 dark:text-white/40">More chapters coming soon!</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  Learn from Market Crashes 📉
                </h2>
                <p className="text-sm text-slate-500 dark:text-white/50">
                  See how smart investors survived (and even made money!) • {completedCount}/{events.length} done
                </p>
              </div>
            </div>
            
            {/* Learning Path Toggle */}
            <button
              onClick={() => setShowLearningPath(!showLearningPath)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                showLearningPath 
                  ? "bg-gradient-to-r from-[#9898f2] to-[#7070c0] text-white shadow-lg shadow-[#9898f2]/20" 
                  : "bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white/70 border border-slate-200 dark:border-white/20 hover:bg-slate-200 dark:hover:bg-white/15"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5 inline mr-1.5" />
              Learning Path
            </button>
          </div>
          
          {/* Era Overview - Learning Path Context */}
          {showLearningPath && (
            <div className="mb-4 p-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <h4 className="text-xs font-semibold text-slate-500 dark:text-white/50 mb-3 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                YOUR LEARNING PATH
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(eraInfo).map(([era, info]) => {
                  const eraEvents = events.filter(e => getEra(e.year) === era);
                  const completedInEra = eraEvents.filter(e => e.completed).length;
                  const isComplete = completedInEra === eraEvents.length && eraEvents.length > 0;
                  
                  return (
                    <div 
                      key={era}
                      className={`p-2.5 rounded-lg border transition-all ${
                        isComplete 
                          ? "bg-[#9898f2]/10 border-[#9898f2]/30" 
                          : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${info.color} flex items-center justify-center text-white`}>
                          {isComplete ? <Star className="h-3 w-3 fill-current" /> : info.icon}
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 dark:text-white/80">{era}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-white/50 line-clamp-1">{info.name}</p>
                      <div className="mt-1.5 flex items-center gap-1">
                        <div className="flex-1 h-1 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${info.color}`}
                            style={{ width: `${(completedInEra / Math.max(eraEvents.length, 1)) * 100}%` }}
                          />
                        </div>
                        <span className="text-[9px] font-medium text-slate-400 dark:text-white/40">
                          {completedInEra}/{eraEvents.length}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Simple filter tabs */}
          <div className="flex items-center gap-1 p-1.5 bg-slate-100 dark:bg-white/5 rounded-xl w-fit border border-slate-200 dark:border-white/10">
            {[
              { id: "all", label: "All", count: events.length, icon: <Target className="h-3.5 w-3.5" /> },
              { id: "available", label: "Ready", count: availableCount, icon: <Play className="h-3.5 w-3.5" /> },
              { id: "completed", label: "Mastered", count: completedCount, icon: <Trophy className="h-3.5 w-3.5" /> },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setFilter(option.id as typeof filter)}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 touch-feedback flex items-center gap-1.5 ${
                  filter === option.id
                    ? "bg-[#9898f2]/20 text-[#7070c0] dark:text-[#9898f2] border border-[#9898f2]/30"
                    : "text-slate-500 dark:text-white/50 hover:text-slate-700 dark:hover:text-white/70"
                }`}
              >
                {option.icon}
                {option.label}
                {option.count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    filter === option.id ? 'bg-[#9898f2]/20 text-[#7070c0] dark:text-[#9898f2]' : 'bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-white/50'
                  }`}>
                    {option.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Challenge Grid Content Area */}
        <div className="p-5 sm:p-6 bg-white dark:bg-transparent">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/10 mb-4">
              <Filter className="h-7 w-7 text-slate-400 dark:text-white/40" />
            </div>
            <p className="text-slate-800 dark:text-white font-medium mb-1">No missions here yet</p>
            <p className="text-slate-500 dark:text-white/50 text-sm mb-4">Try a different filter</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setFilter("all")}
              className="font-semibold border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10"
            >
              Show All Missions
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children">
            {filteredEvents.map((event, index) => (
              <div
                key={event.year}
                className="animate-slide-up-bounce touch-card"
                style={{ 
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <EventCard
                  event={event}
                  onEventClick={onEventClick}
                  streakDays={streakDays}
                />
              </div>
            ))}

            {/* Competition Card in grid */}
            {filter === "all" && (
              <div 
                className="animate-slide-up-bounce md:col-span-2"
                style={{ animationDelay: `${filteredEvents.length * 50}ms` }}
              >
                <CompetitionCard
                  unlocked={competitionUnlocked}
                  onStartCompetition={onStartCompetition}
                />
              </div>
            )}
          </div>
        )}
        
        {/* Quick action for next challenge */}
        {availableCount > 0 && filter !== "completed" && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-[#9898f2] via-[#8888e2] to-[#7070c0] hover:from-[#8888e2] hover:via-[#7878d2] hover:to-[#6060b0] text-white shadow-xl shadow-[#9898f2]/30 font-bold px-8 ripple-effect group relative overflow-hidden"
              onClick={() => {
                const nextEvent = events.find(e => e.unlocked && !e.completed);
                if (nextEvent) onEventClick(nextEvent);
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Continue Learning
              <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            {/* Skills preview */}
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-white/50">
              <Shield className="h-4 w-4 text-[#9898f2]" />
              <span>Earn badges & unlock skills</span>
            </div>
          </div>
        )}
        
        {/* All completed celebration + Random Scenarios */}
        {completedCount === events.length && (
          <div className="mt-6 space-y-4">
            {/* Celebration Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent border border-amber-500/30 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 mb-4 shadow-xl shadow-amber-500/30 animate-heartbeat">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                🎓 Journey Complete!
              </h3>
              <p className="text-slate-700 dark:text-white/70 mb-2">
                You've mastered all market history lessons. You're now a {currentMastery.icon} <span className="font-bold text-slate-900 dark:text-white">{currentMastery.name}</span>!
              </p>
              <p className="text-sm text-slate-500 dark:text-white/50 mb-4">
                Keep practicing with random scenarios or test your skills in competition!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg shadow-amber-500/30"
                  onClick={onStartCompetition}
                >
                  <Star className="h-5 w-5 mr-2" />
                  Enter Competition Mode
                </Button>
              </div>
            </div>
            
            {/* Random Scenario Generator */}
            <div className="p-6 rounded-2xl bg-violet-500/10 border border-violet-500/30">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <Dice6 className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Practice Mode</h3>
                    <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30 text-xs">
                      <InfinityIcon className="h-3 w-3 mr-1" />
                      Infinite
                    </Badge>
                  </div>
                  <p className="text-slate-600 dark:text-white/60 text-sm mb-4">
                    Generate unique market scenarios to sharpen your skills! Each scenario reinforces different learning objectives.
                  </p>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400">
                      <RefreshCw className="h-4 w-4" />
                      <span className="font-semibold">{randomScenarios.length}</span>
                      <span className="text-slate-500 dark:text-white/50">generated</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#7070c0] dark:text-[#9898f2]">
                      <Trophy className="h-4 w-4" />
                      <span className="font-semibold">{completedRandomCount}</span>
                      <span className="text-slate-500 dark:text-white/50">completed</span>
                    </div>
                  </div>
                  
                  {/* Generate Button */}
                  {onGenerateRandomScenario && (
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 text-white font-bold shadow-lg shadow-violet-500/30 group w-full sm:w-auto"
                      onClick={onGenerateRandomScenario}
                    >
                      <Dice6 className="h-5 w-5 mr-2 group-hover:animate-spin" style={{ animationDuration: '1s' }} />
                      Generate New Scenario
                      <Sparkles className="h-5 w-5 ml-2 text-yellow-300" />
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Recent Random Scenarios */}
              {randomScenarios.length > 0 && (
                <div className="mt-6 pt-4 border-t border-violet-500/30">
                  <h4 className="text-sm font-semibold text-slate-600 dark:text-white/70 mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recent Practice Scenarios
                  </h4>
                  <div className="grid gap-3">
                    {randomScenarios.slice(-3).reverse().map((scenario, idx) => (
                      <button
                        key={scenario.event.title}
                        onClick={() => onEventClick(scenario.event)}
                        disabled={scenario.event.completed}
                        className={`w-full p-4 rounded-xl border text-left transition-all ${
                          scenario.event.completed
                            ? 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 opacity-60'
                            : 'bg-white dark:bg-white/5 border-violet-200 dark:border-violet-500/30 hover:border-violet-400 dark:hover:border-violet-500/50 hover:bg-violet-50 dark:hover:bg-white/10 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              scenario.event.completed
                                ? 'bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-white/40'
                                : 'bg-violet-500/20 text-violet-600 dark:text-violet-400'
                            }`}>
                              {scenario.event.completed ? (
                                <Star className="h-5 w-5 fill-current" />
                              ) : (
                                <Dice6 className="h-5 w-5" />
                              )}
                            </div>
                            <div>
                              <p className={`font-semibold ${scenario.event.completed ? 'text-slate-400 dark:text-white/40' : 'text-slate-900 dark:text-white'}`}>
                                {scenario.event.title}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-white/50">{scenario.event.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs ${
                              scenario.event.completed 
                                ? 'bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-white/40' 
                                : 'bg-violet-500/20 text-violet-600 dark:text-violet-400'
                            }`}>
                              {scenario.event.reward} XP
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
          </div>
        )}
        </div>
      </div>
      
      {/* Skills & Knowledge - Family Office Wisdom */}
      <div className="mt-6">
        <SkillsDrawer events={events} />
      </div>
        </>
      )}
      
      {/* Competition & Practice Section - Always Visible */}
      {viewMode === "chapter" && (
        <div className="mt-6 space-y-4">
          {/* Competition Card */}
          <CompetitionCard
            unlocked={competitionUnlocked || allMissionsCompleted}
            onStartCompetition={onStartCompetition}
          />
          
          {/* Random Scenario Generator - Only after completion */}
          {allMissionsCompleted && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-500/20 via-purple-500/10 to-fuchsia-500/5 border border-violet-500/30">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <Dice6 className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Practice Mode 🎯</h3>
                    <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30 text-xs">
                      <InfinityIcon className="h-3 w-3 mr-1" />
                      Infinite
                    </Badge>
                  </div>
                  <p className="text-slate-600 dark:text-white/60 text-sm mb-4">
                    You've mastered all levels! Keep your skills sharp with randomly generated scenarios.
                  </p>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400">
                      <RefreshCw className="h-4 w-4" />
                      <span className="font-semibold">{randomScenarios.length}</span>
                      <span className="text-slate-500 dark:text-white/50">generated</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <Trophy className="h-4 w-4" />
                      <span className="font-semibold">{completedRandomCount}</span>
                      <span className="text-slate-500 dark:text-white/50">completed</span>
                    </div>
                  </div>
                  
                  {/* Generate Button */}
                  {onGenerateRandomScenario && (
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 text-white font-bold shadow-lg shadow-violet-500/30 group w-full sm:w-auto"
                      onClick={onGenerateRandomScenario}
                    >
                      <Dice6 className="h-5 w-5 mr-2 group-hover:animate-spin" style={{ animationDuration: '1s' }} />
                      New Random Challenge
                      <Sparkles className="h-5 w-5 ml-2 text-yellow-300" />
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Recent Random Scenarios */}
              {randomScenarios.length > 0 && (
                <div className="mt-6 pt-4 border-t border-violet-500/30">
                  <h4 className="text-sm font-semibold text-slate-600 dark:text-white/70 mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recent Practice Rounds
                  </h4>
                  <div className="grid gap-3">
                    {randomScenarios.slice(-3).reverse().map((scenario) => (
                      <button
                        key={scenario.event.title}
                        onClick={() => onEventClick(scenario.event)}
                        disabled={scenario.event.completed}
                        className={`w-full p-4 rounded-xl border text-left transition-all ${
                          scenario.event.completed
                            ? 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 opacity-60'
                            : 'bg-white dark:bg-white/5 border-violet-200 dark:border-violet-500/30 hover:border-violet-400 dark:hover:border-violet-500/50 hover:bg-violet-50 dark:hover:bg-white/10 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              scenario.event.completed
                                ? 'bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-white/40'
                                : 'bg-violet-500/20 text-violet-600 dark:text-violet-400'
                            }`}>
                              {scenario.event.completed ? (
                                <Star className="h-5 w-5 fill-current" />
                              ) : (
                                <Dice6 className="h-5 w-5" />
                              )}
                            </div>
                            <div>
                              <p className={`font-semibold ${scenario.event.completed ? 'text-slate-400 dark:text-white/40' : 'text-slate-900 dark:text-white'}`}>
                                {scenario.event.title}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-white/50">{scenario.event.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs ${
                              scenario.event.completed 
                                ? 'bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-white/40' 
                                : 'bg-violet-500/20 text-violet-600 dark:text-violet-400'
                            }`}>
                              {scenario.event.reward} iii
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
        </div>
      )}
    </div>
  );
}
