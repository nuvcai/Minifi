/**
 * EventCard - Premium game-style mission cards
 * Immersive, visual, engaging - pure game feel with micro-interactions
 */

"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Zap as Lightning,
  Trophy,
  Play,
  RotateCcw,
  Sparkles,
  Lock,
  Star,
  ChevronRight,
  Crown,
} from "lucide-react";
import { FinancialEvent } from "@/components/data/events";

interface EventCardProps {
  event: FinancialEvent;
  onEventClick: (event: FinancialEvent) => void;
}

export function EventCard({ event, onEventClick }: EventCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Touch handlers for mobile
  const handleTouchStart = () => setIsPressed(true);
  const handleTouchEnd = () => setIsPressed(false);

  const getImpactGradient = () => {
    switch (event.impact) {
      case "negative":
        return "from-red-500 to-rose-600";
      case "mixed":
        return "from-amber-500 to-orange-500";
      default:
        return "from-emerald-500 to-teal-500";
    }
  };
  
  const getImpactGlow = () => {
    switch (event.impact) {
      case "negative":
        return "shadow-red-200/50";
      case "mixed":
        return "shadow-amber-200/50";
      default:
        return "shadow-emerald-200/50";
    }
  };

  const getDifficultyStars = () => {
    const levels = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
    const level = levels[event.difficulty] || 1;
    return Array(4).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-3 w-3 transition-all duration-200 ${
          i < level 
            ? 'text-amber-400 fill-amber-400' 
            : 'text-gray-200'
        } ${isHovered && i < level ? 'scale-110' : ''}`} 
        style={{ transitionDelay: `${i * 30}ms` }}
      />
    ));
  };
  
  const getDifficultyLabel = () => {
    const labels = { beginner: "Easy", intermediate: "Medium", advanced: "Hard", expert: "Expert" };
    return labels[event.difficulty] || "Easy";
  };

  const isNewEvent = event.unlocked && !event.completed;
  const isExpert = event.difficulty === "expert";

  return (
    <div 
      ref={cardRef}
      className={`relative group ${!event.unlocked ? "opacity-60" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* Expert card special glow */}
      {isExpert && event.unlocked && (
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-3xl opacity-20 blur-lg group-hover:opacity-40 transition-opacity" />
      )}
      
      <div
        className={`relative overflow-hidden rounded-2xl transition-all duration-200 bg-white border-2 touch-card
          ${event.completed 
            ? "border-emerald-200 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30" 
            : event.unlocked
              ? `border-indigo-200 hover:border-indigo-400 hover:shadow-2xl hover:${getImpactGlow()} sm:hover:-translate-y-2 cursor-pointer active:scale-[0.98]`
              : "border-gray-200 bg-gray-50/50"
          }
          ${isNewEvent ? "ring-2 ring-indigo-400 ring-offset-2 important-glow" : ""}
          ${isPressed ? "scale-[0.98] shadow-lg" : ""}
        `}
        onClick={() => event.unlocked && onEventClick(event)}
        role="button"
        tabIndex={event.unlocked ? 0 : -1}
        aria-disabled={!event.unlocked}
      >
        {/* Gradient accent bar with animated shimmer */}
        <div className={`h-1.5 w-full bg-gradient-to-r relative overflow-hidden ${
          event.completed 
            ? "from-emerald-400 to-green-500" 
            : event.unlocked 
              ? getImpactGradient()
              : "from-gray-300 to-gray-400"
        }`}>
          {isNewEvent && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
          )}
        </div>
        
        {/* Background glow effect for new events */}
        {isNewEvent && (
          <div className={`absolute inset-0 bg-gradient-to-br ${getImpactGradient()} opacity-[0.04] pointer-events-none`} />
        )}
        
        {/* Completed card special shine */}
        {event.completed && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-200/30 via-transparent to-transparent rounded-bl-full" />
        )}
        
        <div className="p-4 sm:p-5">
          {/* Top row: Year + Status */}
          <div className="flex items-center justify-between mb-3 gap-2">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Year badge with hover animation */}
              <div className={`relative px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-black text-base sm:text-lg transition-all duration-300 ${
                event.completed 
                  ? "bg-gradient-to-br from-emerald-100 to-green-100 text-emerald-700"
                  : event.unlocked 
                    ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-200/50"
                    : "bg-gray-200 text-gray-500"
              } ${isHovered && event.unlocked ? "scale-105" : ""}`}>
                {event.year}
                {isExpert && event.unlocked && !event.completed && (
                  <Crown className="absolute -top-1.5 -right-1.5 h-4 w-4 text-amber-500 fill-amber-400" />
                )}
              </div>
              
              {/* Difficulty with label - always visible on mobile */}
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1 sm:gap-0.5">
                  {getDifficultyStars()}
                </div>
                <span className={`text-[10px] sm:text-[10px] font-medium text-gray-400 transition-opacity ${isHovered || window.innerWidth < 640 ? 'opacity-100' : 'sm:opacity-0'}`}>
                  {getDifficultyLabel()}
                </span>
              </div>
            </div>
            
            {/* Status indicator */}
            {event.completed ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 shadow-sm">
                <Trophy className="h-4 w-4" />
                <span className="text-xs font-bold">Conquered</span>
              </div>
            ) : isNewEvent ? (
              <Badge className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white border-0 shadow-lg shadow-indigo-200/50 px-3 py-1.5">
                <Lightning className="h-3.5 w-3.5 mr-1 animate-pulse" />
                <span className="font-bold">Play Now</span>
              </Badge>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-400">
                <Lock className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Locked</span>
              </div>
            )}
          </div>

          {/* Title with subtle animation - larger on mobile for readability */}
          <h3 className={`text-base sm:text-lg font-bold mb-3 leading-snug sm:leading-tight transition-colors duration-200 ${
            event.unlocked 
              ? isHovered || isPressed ? "text-indigo-700" : "text-gray-900" 
              : "text-gray-500"
          }`}>
            {event.title}
          </h3>

          {/* Market indicator + XP in one row - stacked on very small screens */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Market impact pill - enhanced */}
            <div className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-200 ${
              event.impact === "negative" 
                ? "bg-gradient-to-r from-red-50 to-rose-50 text-red-600 border border-red-100" 
                : event.impact === "mixed"
                  ? "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-600 border border-amber-100"
                  : "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-600 border border-emerald-100"
            } ${(isHovered || isPressed) && event.unlocked ? "scale-105" : ""}`}>
              {event.impact === "negative" ? (
                <TrendingDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              ) : event.impact === "mixed" ? (
                <Lightning className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              ) : (
                <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              )}
              <span className="hidden xs:inline">{event.impact === "negative" ? "Market Crash" : event.impact === "mixed" ? "Volatile" : "Bull Run"}</span>
              <span className="xs:hidden">{event.impact === "negative" ? "Crash" : event.impact === "mixed" ? "Mixed" : "Bull"}</span>
            </div>
            
            {/* XP reward - enhanced, prominent on mobile */}
            <div className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl transition-all duration-300 ${
              (isHovered || isPressed) && event.unlocked
                ? "bg-gradient-to-r from-amber-100 to-yellow-100 scale-105 sm:scale-110 shadow-lg shadow-amber-100/50"
                : "bg-gradient-to-r from-amber-50 to-yellow-50"
            }`}>
              <Sparkles className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500 transition-transform ${(isHovered || isPressed) && event.unlocked ? "animate-pulse scale-110" : ""}`} />
              <span className="text-sm font-black text-amber-600">+{event.reward}</span>
              <span className="text-[10px] sm:text-xs text-amber-500/70 font-medium">XP</span>
            </div>
          </div>

          {/* Action button - larger touch target on mobile */}
          <div className="mt-4">
            {event.completed ? (
              <Button
                variant="outline"
                className="w-full h-11 sm:h-10 font-semibold text-sm sm:text-sm border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 active:scale-[0.98] transition-all group"
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick(event);
                }}
              >
                <RotateCcw className="h-4 w-4 mr-2 group-hover:rotate-[-360deg] group-active:rotate-[-180deg] transition-transform duration-500" />
                Replay Mission
              </Button>
            ) : event.unlocked ? (
              <Button
                className="w-full h-12 sm:h-10 font-bold text-sm sm:text-sm bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 hover:from-indigo-600 hover:via-violet-600 hover:to-purple-600 text-white shadow-lg shadow-indigo-200/50 hover:shadow-xl active:scale-[0.97] transition-all duration-200 group relative overflow-hidden"
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick(event);
                }}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <Play className="h-4 w-4 mr-2 group-hover:scale-110 group-active:scale-125 transition-transform" />
                Start Mission
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : (
              <Button
                variant="outline"
                disabled
                className="w-full h-11 sm:h-10 font-medium text-xs sm:text-sm border-gray-200 text-gray-400 cursor-not-allowed"
              >
                <Lock className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{event.unlockDescription || "Complete previous mission"}</span>
              </Button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
