/**
 * TimelineSection - Enhanced timeline display
 * Animated timeline with visual effects
 */

"use client";

import React, { useState, useEffect } from "react";
import { 
  Clock, 
  Sparkles, 
  History, 
  MapPin, 
  ChevronDown,
  Filter,
  Trophy,
  Zap,
} from "lucide-react";
import { FinancialEvent } from "@/components/data/events";
import { EventCard } from "./EventCard";
import { CompetitionCard } from "./CompetitionCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TimelineSectionProps {
  events: FinancialEvent[];
  competitionUnlocked: boolean;
  onEventClick: (event: FinancialEvent) => void;
  onStartCompetition: () => void;
}

export function TimelineSection({ 
  events, 
  competitionUnlocked, 
  onEventClick, 
  onStartCompetition 
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
    <div className={`p-6 rounded-3xl bg-white shadow-2xl shadow-indigo-100/50 border border-indigo-100 transition-all duration-700 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl blur-lg opacity-30" />
              <div className="relative p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg">
                <History className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Chapter 1</p>
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                Learn from the Crisis
                <Sparkles className="h-5 w-5 text-amber-500" />
              </h2>
              <p className="text-sm text-gray-500">
                Master history's greatest financial moments
              </p>
            </div>
          </div>
          
          {/* Stats badges */}
          <div className="hidden sm:flex items-center gap-2">
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1">
              <Trophy className="h-3 w-3 mr-1.5" />
              {completedCount} Completed
            </Badge>
            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 px-3 py-1">
              <Zap className="h-3 w-3 mr-1.5" />
              {availableCount} Available
            </Badge>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Chapter Progress</span>
            <span className="text-sm font-bold text-indigo-600">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 transition-all duration-1000 ease-out relative"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl w-fit">
          {[
            { id: "all", label: "All Missions", count: events.length },
            { id: "available", label: "Available", count: availableCount },
            { id: "completed", label: "Completed", count: completedCount },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setFilter(option.id as typeof filter)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === option.id
                  ? "bg-white text-indigo-600 shadow-md"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span>{option.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                filter === option.id
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-gray-200 text-gray-500"
              }`}>
                {option.count}
              </span>
            </button>
          ))}
        </div>
        
        <p className="text-gray-500 mt-4">
          Click on events to start your investment missions! 🚀
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Animated Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-1.5">
          {/* Background */}
          <div className="absolute inset-0 bg-gray-200 rounded-full" />
          
          {/* Progress fill */}
          <div 
            className="absolute top-0 left-0 right-0 bg-gradient-to-b from-indigo-500 via-violet-500 to-purple-500 rounded-full transition-all duration-1000"
            style={{ height: `${progressPercentage}%` }}
          >
            {/* Animated glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-violet-400 rounded-full blur-md animate-pulse" />
          </div>
          
          {/* Era markers */}
          {[0, 25, 50, 75, 100].map((pos) => (
            <div 
              key={pos}
              className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white border-2 border-gray-300 shadow-sm"
              style={{ top: `${pos}%` }}
            />
          ))}
        </div>

        {/* Timeline Events */}
        <div className="space-y-6">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Filter className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No missions match this filter</p>
              <Button 
                variant="ghost" 
                className="mt-2"
                onClick={() => setFilter("all")}
              >
                Show all missions
              </Button>
            </div>
          ) : (
            filteredEvents.map((event, index) => (
              <div
                key={event.year}
                className="transform transition-all duration-500"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateX(0)' : 'translateX(-20px)'
                }}
              >
                <EventCard
                  event={event}
                  onEventClick={onEventClick}
                />
              </div>
            ))
          )}

          {/* Competition Card */}
          {filter === "all" && (
            <div 
              className="transform transition-all duration-500"
              style={{ 
                animationDelay: `${events.length * 100}ms`,
                opacity: isVisible ? 1 : 0
              }}
            >
              <CompetitionCard
                unlocked={competitionUnlocked}
                onStartCompetition={onStartCompetition}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom CTA for not completed */}
      {availableCount > 0 && (
        <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-violet-50 to-purple-50 border border-indigo-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white shadow">
                <MapPin className="h-5 w-5 text-indigo-500" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Continue your journey!</p>
                <p className="text-sm text-gray-500">{availableCount} mission{availableCount > 1 ? 's' : ''} waiting for you</p>
              </div>
            </div>
            <Button 
              className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white shadow-lg"
              onClick={() => {
                const nextEvent = events.find(e => e.unlocked && !e.completed);
                if (nextEvent) onEventClick(nextEvent);
              }}
            >
              <Zap className="h-4 w-4 mr-2" />
              Next Mission
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
