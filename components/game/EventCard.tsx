/**
 * EventCard — Apple-inspired Design
 * 
 * Clean, minimal, easy to scan
 * Focuses on content, not decoration
 */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  Play,
  Lock,
  Clock,
  Sparkles,
} from "lucide-react";
import { FinancialEvent } from "@/components/data/events";

interface EventCardProps {
  event: FinancialEvent;
  onEventClick: (event: FinancialEvent) => void;
  streakDays?: number;
}

// Difficulty display
const difficultyConfig = {
  beginner: { label: "Easy", time: 5, dots: 1 },
  intermediate: { label: "Medium", time: 8, dots: 2 },
  advanced: { label: "Hard", time: 12, dots: 3 },
  expert: { label: "Expert", time: 15, dots: 4 },
};

export function EventCard({ event, onEventClick, streakDays = 0 }: EventCardProps) {
  const difficulty = difficultyConfig[event.difficulty] || difficultyConfig.beginner;
  const streakMultiplier = streakDays >= 7 ? 2 : streakDays >= 3 ? 1.5 : 1;

  // Impact indicator
  const ImpactIndicator = () => {
    if (event.impact === "negative") {
      return (
        <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
          <TrendingDown className="h-4 w-4" />
          <span className="text-xs font-medium">Bear Market</span>
        </div>
      );
    } else if (event.impact === "mixed") {
      return (
        <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
          <Minus className="h-4 w-4" />
          <span className="text-xs font-medium">Volatile</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 text-[#7070c0] dark:text-[#9898f2]">
        <TrendingUp className="h-4 w-4" />
        <span className="text-xs font-medium">Bull Market</span>
      </div>
    );
  };

  // Difficulty dots
  const DifficultyDots = () => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4].map((dot) => (
        <div
          key={dot}
          className={`w-1.5 h-1.5 rounded-full ${
            dot <= difficulty.dots
              ? "bg-gray-900 dark:bg-white"
              : "bg-gray-200 dark:bg-white/20"
          }`}
        />
      ))}
    </div>
  );

  // Locked state
  if (!event.unlocked) {
    return (
      <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.04]">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gray-100 dark:bg-white/[0.04] flex items-center justify-center">
            <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-gray-400 dark:text-gray-500">{event.year}</span>
            </div>
            <h3 className="font-semibold text-gray-400 dark:text-gray-500 mb-1">{event.title}</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {event.unlockDescription || "Complete previous mission to unlock"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Completed state
  if (event.completed) {
    return (
      <div
        onClick={() => onEventClick(event)}
        className="p-5 rounded-2xl bg-[#9898f2]/10 dark:bg-[#9898f2]/[0.08] border border-[#9898f2]/20 dark:border-[#9898f2]/20 cursor-pointer hover:bg-[#9898f2]/15 dark:hover:bg-[#9898f2]/[0.12] transition-colors"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-[#9898f2] flex items-center justify-center text-white">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#6060a0] dark:text-[#9898f2]">{event.year}</span>
                <span className="badge-success">Completed</span>
              </div>
              <ImpactIndicator />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{event.title}</h3>
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#6060a0] dark:text-[#9898f2] font-medium">
                +{event.reward} iii earned
              </p>
              <span className="text-xs text-gray-500 dark:text-gray-400">Tap to replay</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active/Available state
  return (
    <div
      onClick={() => onEventClick(event)}
      className="group p-5 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-black/[0.04] dark:border-white/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] cursor-pointer hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)] hover:border-violet-200 dark:hover:border-violet-500/30 transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        {/* Year badge */}
        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-violet-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
          {event.year}
        </div>

        <div className="flex-1 min-w-0">
          {/* Meta row */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <DifficultyDots />
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{difficulty.label}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
                <Clock className="h-3 w-3" />
                <span className="text-xs">{difficulty.time} min</span>
              </div>
            </div>
            <ImpactIndicator />
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
            {event.title}
          </h3>

          {/* Bottom row: XP + Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-500/10">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                  +{event.reward} iii
                </span>
              </div>
              {streakMultiplier > 1 && (
                <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                  {streakMultiplier}x streak bonus!
                </span>
              )}
            </div>
            
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEventClick(event);
              }}
              className="bg-violet-500 hover:bg-violet-600 text-white shadow-sm hover:shadow-md transition-all"
            >
              <Play className="h-4 w-4 mr-1.5" />
              Start
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
