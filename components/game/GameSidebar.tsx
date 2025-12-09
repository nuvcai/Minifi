/**
 * GameSidebar - Unified game sidebar with WinningSystem
 * Consolidates coach selection and all gamification into clean sections
 * © 2025 NUVC.AI. All Rights Reserved.
 */

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AICoach } from "@/components/data/coaches";
import { 
  MessageCircle, 
  Sparkles, 
  ChevronRight,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WinningSystem } from "@/components/gamification/WinningSystem";

interface GameSidebarProps {
  coaches: AICoach[];
  selectedCoach: AICoach;
  onCoachSelect: (coach: AICoach) => void;
  completedMissions: number;
  totalMissions: number;
  playerLevel: number;
  playerXP: number;
  streakDays: number;
  earnedBadgeIds?: string[];
  stats?: {
    missionsCompleted: number;
    differentRiskLevelsTried: number;
    differentAssetClassesTried: number;
    coachesUsed: number;
    lossesExperienced: number;
    investmentsAfterLoss: number;
    investmentsMade: number;
  };
  onStreakBonus: (bonus: number, days?: number) => void;
  onXpEarned?: (amount: number) => void;
}

export function GameSidebar({
  coaches,
  selectedCoach,
  onCoachSelect,
  completedMissions,
  totalMissions,
  playerLevel,
  playerXP,
  streakDays,
  earnedBadgeIds = [],
  stats,
  onStreakBonus,
  onXpEarned,
}: GameSidebarProps) {
  const [showAllCoaches, setShowAllCoaches] = useState(false);

  return (
    <div className="space-y-4">
      {/* Unified Winning System - All gamification in one */}
      <WinningSystem
        playerLevel={playerLevel}
        playerXP={playerXP}
        completedMissions={completedMissions}
        totalMissions={totalMissions}
        streakDays={streakDays}
        earnedBadgeIds={earnedBadgeIds}
        stats={stats}
        onStreakClaimed={onStreakBonus}
        onXpEarned={onXpEarned}
        compact={true}
      />
      
      {/* Coach Selection Card */}
      <div className="rounded-2xl bg-white shadow-xl shadow-violet-100/30 border border-violet-100 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-violet-50 to-indigo-50 border-b border-violet-100">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-violet-500" />
            <span className="text-sm font-semibold text-gray-700">Your AI Coach</span>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Selected Coach - Always Visible */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src={selectedCoach.avatar}
                  alt={selectedCoach.name}
                  width={56}
                  height={56}
                  className="rounded-full ring-2 ring-violet-400 shadow-lg"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900">{selectedCoach.name}</p>
                <p className="text-sm text-violet-600">{selectedCoach.personality}</p>
                <Badge className="mt-1 bg-violet-100 text-violet-700 border-0 text-[10px]">
                  Active Coach
                </Badge>
              </div>
            </div>
            
            {/* Quick tip */}
            <p className="mt-3 text-xs text-gray-600 italic border-t border-violet-100 pt-3">
              "{selectedCoach.description.slice(0, 80)}..."
            </p>
          </div>

          {/* Toggle Other Coaches */}
          <button
            onClick={() => setShowAllCoaches(!showAllCoaches)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Switch Coach
            </span>
            {showAllCoaches ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {/* Other Coaches - Collapsible */}
          {showAllCoaches && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
              {coaches.filter(c => c.id !== selectedCoach.id).map((coach) => (
                <button
                  key={coach.id}
                  onClick={() => {
                    onCoachSelect(coach);
                    setShowAllCoaches(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-violet-300 hover:bg-violet-50/50 transition-all text-left"
                >
                  <Image
                    src={coach.avatar}
                    alt={coach.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{coach.name}</p>
                    <p className="text-xs text-gray-500 truncate">{coach.personality}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Library Link - Compact */}
      <Link href="/library">
        <div className="p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow group-hover:scale-110 transition-transform">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">Wisdom Library</p>
              <p className="text-[10px] text-gray-500">Learn from legends</p>
            </div>
            <ChevronRight className="h-4 w-4 text-amber-500 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </Link>
    </div>
  );
}

export default GameSidebar;
