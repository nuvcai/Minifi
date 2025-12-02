/**
 * DailyStreak - Daily login streak tracking and display
 * 
 * Features:
 * - Tracks consecutive days of play
 * - Escalating XP bonuses
 * - Visual streak counter
 * - Streak milestone rewards
 */

"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Flame,
  Calendar,
  Gift,
  Sparkles,
  Trophy,
  Star,
  Zap,
} from "lucide-react";
import { InlineFloatingXp } from "./FloatingXp";

// Streak milestone rewards
const streakMilestones: Record<number, { bonus: number; badge?: string; special?: string }> = {
  1: { bonus: 10 },
  2: { bonus: 15 },
  3: { bonus: 25, badge: "🔥 3-Day Streak" },
  5: { bonus: 40, badge: "⚡ 5-Day Warrior" },
  7: { bonus: 75, badge: "🌟 Weekly Champion", special: "Double XP for today!" },
  14: { bonus: 150, badge: "💪 Two Week Titan" },
  21: { bonus: 250, badge: "🏆 Three Week Master" },
  30: { bonus: 500, badge: "👑 Monthly Legend", special: "Exclusive reward unlocked!" },
};

// Get streak bonus for a given day
function getStreakBonus(days: number): number {
  // Find the highest milestone that's <= current days
  const milestones = Object.keys(streakMilestones)
    .map(Number)
    .sort((a, b) => b - a);
  
  for (const milestone of milestones) {
    if (days >= milestone) {
      return streakMilestones[milestone].bonus;
    }
  }
  return 10; // Base bonus
}

// Get next milestone
function getNextMilestone(days: number): { day: number; bonus: number } | null {
  const milestones = Object.keys(streakMilestones)
    .map(Number)
    .sort((a, b) => a - b);
  
  for (const milestone of milestones) {
    if (milestone > days) {
      return { day: milestone, bonus: streakMilestones[milestone].bonus };
    }
  }
  return null;
}

const STORAGE_KEY = "legacy_guardians_streak";

interface StreakData {
  currentStreak: number;
  lastPlayDate: string | null;
  longestStreak: number;
  totalDaysPlayed: number;
  claimedToday: boolean;
}

interface DailyStreakProps {
  onBonusClaimed?: (bonus: number) => void;
}

export function DailyStreak({ onBonusClaimed }: DailyStreakProps) {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    lastPlayDate: null,
    longestStreak: 0,
    totalDaysPlayed: 0,
    claimedToday: false,
  });
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [todayBonus, setTodayBonus] = useState(0);
  const [isNewStreak, setIsNewStreak] = useState(false);
  const [showFloatingXp, setShowFloatingXp] = useState(false);
  const [claimedBonus, setClaimedBonus] = useState(0);

  // Load streak data and check if we need to update
  useEffect(() => {
    const loadAndUpdateStreak = () => {
      const today = new Date().toDateString();
      
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        let data: StreakData = saved ? JSON.parse(saved) : {
          currentStreak: 0,
          lastPlayDate: null,
          longestStreak: 0,
          totalDaysPlayed: 0,
          claimedToday: false,
        };

        let shouldShowModal = false;
        let newStreakStarted = false;

        // Check if it's a new day
        if (data.lastPlayDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const wasYesterday = data.lastPlayDate === yesterday.toDateString();

          if (wasYesterday) {
            // Continue streak
            data.currentStreak += 1;
            newStreakStarted = false;
          } else if (data.lastPlayDate) {
            // Streak broken - reset
            data.currentStreak = 1;
            newStreakStarted = true;
          } else {
            // First time playing
            data.currentStreak = 1;
            newStreakStarted = true;
          }

          // Update stats
          data.lastPlayDate = today;
          data.totalDaysPlayed += 1;
          data.longestStreak = Math.max(data.longestStreak, data.currentStreak);
          data.claimedToday = false;

          // Save updated data
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

          // Show claim modal for all new day logins
          shouldShowModal = true;
          setIsNewStreak(newStreakStarted);
        }

        setStreakData(data);
        setTodayBonus(getStreakBonus(data.currentStreak));
        
        // Show modal after a delay to not interrupt initial page load
        if (shouldShowModal) {
          setTimeout(() => setShowClaimModal(true), 1500);
        }
      } catch (e) {
        console.error("Failed to load streak data:", e);
      }
    };

    loadAndUpdateStreak();
  }, []);

  const claimBonus = () => {
    if (streakData.claimedToday) return;

    const bonus = getStreakBonus(streakData.currentStreak);
    
    // Update streak data
    const newData = {
      ...streakData,
      claimedToday: true,
    };
    setStreakData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));

    // Show floating XP animation
    setClaimedBonus(bonus);
    setShowFloatingXp(true);

    // Notify parent after a brief delay for the animation
    setTimeout(() => {
      if (onBonusClaimed) {
        onBonusClaimed(bonus);
      }
      setShowClaimModal(false);
    }, 800);
  };

  const nextMilestone = getNextMilestone(streakData.currentStreak);
  const currentMilestone = streakMilestones[streakData.currentStreak];

  return (
    <>
      {/* Streak Display Card */}
      <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Flame icon with streak count */}
              <div className="relative">
                <div className={`
                  p-2 rounded-full 
                  ${streakData.currentStreak >= 7 
                    ? "bg-gradient-to-br from-orange-400 to-red-500" 
                    : streakData.currentStreak >= 3 
                      ? "bg-gradient-to-br from-orange-400 to-amber-500"
                      : "bg-gradient-to-br from-amber-400 to-orange-400"
                  }
                `}>
                  <Flame className={`h-5 w-5 text-white ${streakData.currentStreak >= 3 ? "animate-pulse" : ""}`} />
                </div>
                {streakData.currentStreak > 0 && (
                  <Badge className="absolute -top-1 -right-1 px-1.5 py-0 text-xs bg-white text-orange-600 border-orange-300">
                    {streakData.currentStreak}
                  </Badge>
                )}
              </div>

              <div>
                <p className="font-semibold text-slate-100">
                  {streakData.currentStreak} Day{streakData.currentStreak !== 1 ? "s" : ""} Streak
                </p>
                <p className="text-xs text-slate-400">
                  {streakData.currentStreak === 0
                    ? "Start your streak today!"
                    : nextMilestone
                      ? `${nextMilestone.day - streakData.currentStreak} days to ${nextMilestone.bonus} XP bonus!`
                      : "You're a legend! 👑"}
                </p>
              </div>
            </div>

            {/* Bonus indicator */}
            {!streakData.claimedToday && streakData.currentStreak > 0 && (
              <Button
                size="sm"
                onClick={() => setShowClaimModal(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              >
                <Gift className="h-4 w-4 mr-1" />
                +{todayBonus} XP
              </Button>
            )}
            {streakData.claimedToday && (
              <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                ✓ Claimed
              </Badge>
            )}
          </div>

          {/* Streak visualization */}
          <div className="mt-3 flex gap-1">
            {[...Array(7)].map((_, i) => {
              const dayNum = i + 1;
              const isAchieved = dayNum <= streakData.currentStreak;
              const isMilestone = [3, 5, 7].includes(dayNum);
              return (
                <div
                  key={i}
                  className={`
                    flex-1 h-2 rounded-full transition-all
                    ${isAchieved
                      ? isMilestone
                        ? "bg-gradient-to-r from-amber-400 to-orange-500"
                        : "bg-gradient-to-r from-orange-400 to-red-400"
                      : "bg-slate-700"
                    }
                  `}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Claim Modal */}
      <Dialog open={showClaimModal} onOpenChange={setShowClaimModal}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-amber-500/50">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Flame className="h-6 w-6 text-orange-500 animate-pulse" />
                <span className="text-2xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  Daily Streak Bonus!
                </span>
                <Flame className="h-6 w-6 text-orange-500 animate-pulse" />
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Streak count */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-red-500 mb-2">
                <span className="text-3xl font-black text-white">
                  {streakData.currentStreak}
                </span>
              </div>
              <p className="text-slate-300">
                Day{streakData.currentStreak !== 1 ? "s" : ""} in a row!
              </p>
            </div>

            {/* Bonus display */}
            <div className="bg-slate-800/50 rounded-lg p-4 border border-amber-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300">Today's Bonus:</span>
                <div className="flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span className="text-xl font-bold text-amber-400">
                    +{todayBonus} XP
                  </span>
                </div>
              </div>

              {/* Milestone badge */}
              {currentMilestone?.badge && (
                <Badge className="w-full justify-center py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30">
                  {currentMilestone.badge}
                </Badge>
              )}

              {/* Special reward */}
              {currentMilestone?.special && (
                <div className="mt-2 flex items-center gap-2 text-sm text-emerald-400">
                  <Star className="h-4 w-4" />
                  {currentMilestone.special}
                </div>
              )}
            </div>

            {/* Next milestone preview */}
            {nextMilestone && (
              <div className="text-center text-sm text-slate-400">
                <Zap className="h-4 w-4 inline mr-1" />
                {nextMilestone.day - streakData.currentStreak} more day{nextMilestone.day - streakData.currentStreak !== 1 ? "s" : ""} for {nextMilestone.bonus} XP bonus!
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 text-center text-sm">
              <div className="bg-slate-800/30 rounded p-2">
                <p className="text-slate-400">Longest Streak</p>
                <p className="font-bold text-teal-400">{streakData.longestStreak} days</p>
              </div>
              <div className="bg-slate-800/30 rounded p-2">
                <p className="text-slate-400">Total Days</p>
                <p className="font-bold text-emerald-400">{streakData.totalDaysPlayed} days</p>
              </div>
            </div>

            {/* Claim button */}
            <div className="relative">
              <InlineFloatingXp
                show={showFloatingXp}
                amount={claimedBonus}
                type="streak"
                onComplete={() => setShowFloatingXp(false)}
              />
              <Button
                onClick={claimBonus}
                disabled={streakData.claimedToday || showFloatingXp}
                className={`w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 ${
                  showFloatingXp ? "animate-pulse-glow" : ""
                }`}
              >
                {streakData.claimedToday ? (
                  <>
                    <Trophy className="h-4 w-4 mr-2" />
                    Already Claimed Today!
                  </>
                ) : showFloatingXp ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    XP Claimed!
                  </>
                ) : (
                  <>
                    <Gift className="h-4 w-4 mr-2" />
                    Claim +{todayBonus} XP
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Compact streak indicator for headers
export function StreakBadge() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setStreak(data.currentStreak || 0);
      }
    } catch (e) {
      console.error("Failed to load streak:", e);
    }
  }, []);

  if (streak === 0) return null;

  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full">
      <Flame className={`h-3 w-3 text-orange-400 ${streak >= 3 ? "animate-pulse" : ""}`} />
      <span className="text-xs font-bold text-orange-400">{streak}</span>
    </div>
  );
}

export default DailyStreak;

