/**
 * TimelineSection - Enhanced game-style challenge grid with visual journey
 * Immersive, visual, engaging - top gamified experience
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
} from "lucide-react";
import { FinancialEvent } from "@/components/data/events";
import { EventCard } from "./EventCard";
import { CompetitionCard } from "./CompetitionCard";
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
}

export function TimelineSection({ 
  events, 
  competitionUnlocked, 
  onEventClick, 
  onStartCompetition,
  randomScenarios = [],
  completedRandomCount = 0,
  onGenerateRandomScenario,
}: TimelineSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [filter, setFilter] = useState<"all" | "available" | "completed">("all");
  
  const completedCount = events.filter(e => e.completed).length;
  const availableCount = events.filter(e => e.unlocked && !e.completed).length;
  const progressPercentage = (completedCount / events.length) * 100;
  
  // Filtered events
  const filteredEvents = events.filter(event => {
    if (filter === "available") return event.unlocked && !event.completed;
    if (filter === "completed") return event.completed;
    return true;
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`transition-all duration-700 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      {/* Journey Progress Hero */}
      <div className="mb-6 p-6 rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 shadow-2xl shadow-indigo-200/50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-violet-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
        </div>
        
        <div className="relative">
          {/* Top stats row */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-sm font-medium">Your Journey</p>
                <h2 className="text-2xl font-black text-white">
                  Through Market History
                </h2>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {completedCount > 0 && (
                <Badge className="bg-emerald-500/90 text-white border-0 px-3 py-1.5 flex items-center gap-1.5">
                  <Trophy className="h-4 w-4" />
                  <span className="font-bold">{completedCount} Conquered</span>
                </Badge>
              )}
              {availableCount > 0 && (
                <Badge className="bg-amber-500/90 text-white border-0 px-3 py-1.5 flex items-center gap-1.5 animate-pulse">
                  <Zap className="h-4 w-4" />
                  <span className="font-bold">{availableCount} Available</span>
                </Badge>
              )}
            </div>
          </div>
          
          {/* Visual Journey Progress Bar */}
          <div className="relative">
            {/* Era markers */}
            <div className="flex justify-between mb-2 px-1">
              {events.slice(0, 6).map((event, i) => (
                <div 
                  key={event.year}
                  className={`flex flex-col items-center transition-all duration-500 ${
                    event.completed ? 'opacity-100' : event.unlocked ? 'opacity-80' : 'opacity-40'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    event.completed 
                      ? 'bg-emerald-400 text-white shadow-lg shadow-emerald-400/50' 
                      : event.unlocked 
                        ? 'bg-white/90 text-indigo-600 shadow-lg important-glow' 
                        : 'bg-white/20 text-white/50'
                  }`}>
                    {event.completed ? (
                      <Star className="h-4 w-4 fill-current" />
                    ) : (
                      <span>{event.year.toString().slice(-2)}</span>
                    )}
                  </div>
                </div>
              ))}
              {/* Final destination */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  completedCount === events.length
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-400/50 animate-heartbeat'
                    : 'bg-white/20 text-white/50'
                }`}>
                  <Flag className="h-4 w-4" />
                </div>
              </div>
            </div>
            
            {/* Progress track */}
            <div className="h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 transition-all duration-1000 ease-out relative"
                style={{ width: `${progressPercentage}%` }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
              </div>
            </div>
            
            {/* Journey stats */}
            <div className="flex justify-between mt-3 text-sm">
              <div className="flex items-center gap-1.5 text-white/70">
                <Clock className="h-4 w-4" />
                <span>1990</span>
              </div>
              <div className="flex items-center gap-1.5 text-white font-bold">
                <TrendingUp className="h-4 w-4" />
                <span>{Math.round(progressPercentage)}% Complete</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/70">
                <span>2025</span>
                <Flag className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white shadow-xl shadow-indigo-100/30 border border-gray-100">
        {/* Compact Header */}
        <div className="mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
                Challenges
                <Sparkles className="h-5 w-5 text-amber-500" />
              </h2>
              <p className="text-sm text-gray-500">
                {completedCount}/{events.length} completed • {events.length - completedCount} remaining
              </p>
            </div>
          </div>
          
          {/* Simple filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl w-fit">
            {[
              { id: "all", label: "All", count: events.length },
              { id: "available", label: "Play", count: availableCount },
              { id: "completed", label: "Done", count: completedCount },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setFilter(option.id as typeof filter)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 touch-feedback flex items-center gap-1.5 ${
                  filter === option.id
                    ? "bg-white text-indigo-600 shadow-md"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {option.label}
                {option.count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    filter === option.id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {option.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Challenge Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 mb-4 shadow-inner">
              <Filter className="h-7 w-7 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium mb-1">No challenges here yet</p>
            <p className="text-gray-400 text-sm mb-4">Try a different filter</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setFilter("all")}
              className="font-semibold"
            >
              Show All Challenges
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
        {availableCount > 0 && (
          <div className="mt-6 flex justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 hover:from-indigo-600 hover:via-violet-600 hover:to-purple-600 text-white shadow-xl shadow-indigo-200/50 font-bold px-8 ripple-effect group relative overflow-hidden"
              onClick={() => {
                const nextEvent = events.find(e => e.unlocked && !e.completed);
                if (nextEvent) onEventClick(nextEvent);
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Play Next Challenge
              <Zap className="h-5 w-5 ml-2 text-amber-300 group-hover:animate-pulse" />
            </Button>
          </div>
        )}
        
        {/* All completed celebration + Random Scenarios */}
        {completedCount === events.length && (
          <div className="mt-6 space-y-4">
            {/* Celebration Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-2 border-amber-200 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 mb-4 shadow-xl shadow-amber-200/50 animate-heartbeat">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">
                🎉 All Challenges Complete!
              </h3>
              <p className="text-gray-600 mb-4">
                You've mastered the entire timeline. Keep practicing or enter competition!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg"
                  onClick={onStartCompetition}
                >
                  <Star className="h-5 w-5 mr-2" />
                  Enter Competition Mode
                </Button>
              </div>
            </div>
            
            {/* Random Scenario Generator */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 border-2 border-violet-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-200/50">
                  <Dice6 className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">Random Scenarios</h3>
                    <Badge className="bg-violet-100 text-violet-700 border-violet-200 text-xs">
                      <InfinityIcon className="h-3 w-3 mr-1" />
                      Infinite
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Generate unique market scenarios to keep practicing! Each scenario is randomly created with different events, options, and outcomes.
                  </p>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1.5 text-violet-600">
                      <RefreshCw className="h-4 w-4" />
                      <span className="font-semibold">{randomScenarios.length}</span>
                      <span className="text-gray-500">generated</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      <Trophy className="h-4 w-4" />
                      <span className="font-semibold">{completedRandomCount}</span>
                      <span className="text-gray-500">completed</span>
                    </div>
                  </div>
                  
                  {/* Generate Button */}
                  {onGenerateRandomScenario && (
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 text-white font-bold shadow-lg shadow-violet-200/50 group w-full sm:w-auto"
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
                <div className="mt-6 pt-4 border-t border-violet-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recent Random Scenarios
                  </h4>
                  <div className="grid gap-3">
                    {randomScenarios.slice(-3).reverse().map((scenario, idx) => (
                      <button
                        key={scenario.event.title}
                        onClick={() => onEventClick(scenario.event)}
                        disabled={scenario.event.completed}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          scenario.event.completed
                            ? 'bg-gray-50 border-gray-200 opacity-60'
                            : 'bg-white border-violet-200 hover:border-violet-400 hover:shadow-md cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              scenario.event.completed
                                ? 'bg-gray-100 text-gray-400'
                                : 'bg-gradient-to-br from-violet-100 to-purple-100 text-violet-600'
                            }`}>
                              {scenario.event.completed ? (
                                <Star className="h-5 w-5 fill-current" />
                              ) : (
                                <Dice6 className="h-5 w-5" />
                              )}
                            </div>
                            <div>
                              <p className={`font-semibold ${scenario.event.completed ? 'text-gray-400' : 'text-gray-900'}`}>
                                {scenario.event.title}
                              </p>
                              <p className="text-xs text-gray-500">{scenario.event.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs ${
                              scenario.event.completed 
                                ? 'bg-gray-100 text-gray-500' 
                                : 'bg-violet-100 text-violet-700'
                            }`}>
                              {scenario.event.reward} XP
                            </Badge>
                            {!scenario.event.completed && (
                              <Play className="h-4 w-4 text-violet-500" />
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
  );
}
