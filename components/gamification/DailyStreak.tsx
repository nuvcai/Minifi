/**
 * DailyStreak - Daily login streak tracking
 * Light, fun, teen-friendly design
 */

"use client";

import React, { useState, useEffect } from "react";
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
  Gift,
  Sparkles,
  Trophy,
  Star,
  Zap,
} from "lucide-react";
import { InlineFloatingXp } from "./FloatingXp";
import { III_CONFIG } from "@/hooks/useIII";

// Gold coin emoji for iii token display
const III_DISPLAY = `🪙 ${III_CONFIG.symbol}`;

// Streak milestone rewards
const streakMilestones: Record<number, { bonus: number; badge?: string; special?: string }> = {
  1: { bonus: 10 },
  2: { bonus: 15 },
  3: { bonus: 25, badge: "🔥 3-Day Streak" },
  5: { bonus: 40, badge: "⚡ 5-Day Warrior" },
  7: { bonus: 75, badge: "🌟 Weekly Champion", special: "Double iii for today!" },
  14: { bonus: 150, badge: "💪 Two Week Titan" },
  21: { bonus: 250, badge: "🏆 Three Week Master" },
  30: { bonus: 500, badge: "👑 Monthly Legend", special: "Exclusive reward unlocked!" },
};

function getStreakBonus(days: number): number {
  const milestones = Object.keys(streakMilestones)
    .map(Number)
    .sort((a, b) => b - a);
  
  for (const milestone of milestones) {
    if (days >= milestone) {
      return streakMilestones[milestone].bonus;
    }
  }
  return 10;
}

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

// Use consistent storage key across all streak components
const STORAGE_KEY = "minifi_streak_data";
const USER_EMAIL_KEY = "minifi_user_email";
const SESSION_KEY = "minifi_session_id";

// Generate or get session ID for anonymous users
const getOrCreateSessionId = () => {
  if (typeof window === 'undefined') return null;
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

// Aligned with app/page.tsx structure for consistency
interface StreakData {
  currentStreak: number;
  lastClaimDate: string | null; // Renamed from lastClaimDate for consistency
  longestStreak: number;
  totalDaysPlayed: number;
  todayClaimed: boolean; // Renamed from todayClaimed for consistency
  totalXP?: number; // Added for consistency with homepage
}

interface DailyStreakProps {
  onBonusClaimed?: (bonus: number) => void;
}

export function DailyStreak({ onBonusClaimed }: DailyStreakProps) {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    lastClaimDate: null,
    longestStreak: 0,
    totalDaysPlayed: 0,
    todayClaimed: false,
    totalXP: 0,
  });
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [todayBonus, setTodayBonus] = useState(0);
  const [showFloatingXp, setShowFloatingXp] = useState(false);
  const [claimedBonus, setClaimedBonus] = useState(0);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const loadAndUpdateStreak = async () => {
      const today = new Date().toDateString();
      const savedEmail = localStorage.getItem(USER_EMAIL_KEY);
      const sessionId = getOrCreateSessionId(); // Generate session ID if needed
      
      if (savedEmail) {
        setUserEmail(savedEmail);
      }
      
      try {
        // Try to load from database first
        if (savedEmail || sessionId) {
          try {
            const params = new URLSearchParams();
            if (savedEmail) params.append('email', savedEmail);
            else if (sessionId) params.append('sessionId', sessionId);
            
            const response = await fetch(`/api/streak?${params.toString()}`);
            const result = await response.json();
            
            if (result.success && result.data && (result.data.currentStreak > 0 || result.data.totalXP > 0)) {
              const dbStreak = result.data.currentStreak || 0;
              const data: StreakData = {
                currentStreak: dbStreak,
                lastClaimDate: result.data.lastClaimDate ? new Date(result.data.lastClaimDate).toDateString() : null,
                longestStreak: Math.max(dbStreak, 0),
                totalDaysPlayed: dbStreak,
                todayClaimed: result.data.todayClaimed || false,
              };
              
              setStreakData(data);
              setTodayBonus(getStreakBonus(data.currentStreak));
              localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
              
              // Show modal if not claimed today
              if (!data.todayClaimed && data.currentStreak > 0) {
                setTimeout(() => setShowClaimModal(true), 1500);
              }
              return;
            }
          } catch (e) {
            console.log("Falling back to localStorage for streak");
          }
        }
        
        // Fallback to localStorage
        const saved = localStorage.getItem(STORAGE_KEY);
        let data: StreakData = saved ? JSON.parse(saved) : {
          currentStreak: 0,
          lastClaimDate: null,
          longestStreak: 0,
          totalDaysPlayed: 0,
          todayClaimed: false,
        };

        let shouldShowModal = false;

        if (data.lastClaimDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const wasYesterday = data.lastClaimDate === yesterday.toDateString();

          if (wasYesterday) {
            data.currentStreak += 1;
          } else if (data.lastClaimDate) {
            data.currentStreak = 1;
          } else {
            data.currentStreak = 1;
          }

          data.lastClaimDate = today;
          data.totalDaysPlayed += 1;
          data.longestStreak = Math.max(data.longestStreak, data.currentStreak);
          data.todayClaimed = false;

          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          shouldShowModal = true;
        }

        setStreakData(data);
        setTodayBonus(getStreakBonus(data.currentStreak));
        
        if (shouldShowModal) {
          setTimeout(() => setShowClaimModal(true), 1500);
        }
      } catch (e) {
        console.error("Failed to load streak data:", e);
      }
    };

    loadAndUpdateStreak();
  }, []);

  const claimBonus = async () => {
    if (streakData.todayClaimed) return;

    const bonus = getStreakBonus(streakData.currentStreak);
    const savedEmail = localStorage.getItem(USER_EMAIL_KEY);
    const sessionId = getOrCreateSessionId(); // Always have a session ID
    
    // Always sync with database (will create profile if needed)
    if (savedEmail || sessionId) {
      try {
        await fetch('/api/streak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'claim',
            email: savedEmail,
            sessionId,
          }),
        });
      } catch (e) {
        console.log("Failed to sync claim to database, saving locally");
      }
    }
    
    const newData = {
      ...streakData,
      todayClaimed: true,
    };
    setStreakData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));

    setClaimedBonus(bonus);
    setShowFloatingXp(true);

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
      {/* Streak Display Card - Light theme */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 shadow-lg shadow-orange-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Flame icon */}
            <div className="relative">
              <div className={`
                p-2.5 rounded-xl 
                ${streakData.currentStreak >= 7 
                  ? "bg-gradient-to-br from-orange-400 to-red-500" 
                  : streakData.currentStreak >= 3 
                    ? "bg-gradient-to-br from-orange-400 to-amber-500"
                    : "bg-gradient-to-br from-amber-400 to-orange-400"
                }
                shadow-lg
              `}>
                <Flame className={`h-5 w-5 text-white ${streakData.currentStreak >= 3 ? "animate-pulse" : ""}`} />
              </div>
              {streakData.currentStreak > 0 && (
                <Badge className="absolute -top-1 -right-1 px-1.5 py-0 text-xs bg-white text-orange-600 border-orange-300 shadow">
                  {streakData.currentStreak}
                </Badge>
              )}
            </div>

            <div>
              <p className="font-bold text-gray-900">
                {streakData.currentStreak} Day{streakData.currentStreak !== 1 ? "s" : ""} Streak 🔥
              </p>
              <p className="text-xs text-gray-500">
                {streakData.currentStreak === 0
                  ? "Start your streak today!"
                  : nextMilestone
                    ? `${nextMilestone.day - streakData.currentStreak} days to +${nextMilestone.bonus} ${III_DISPLAY}!`
                    : "You're a legend! 👑"}
              </p>
            </div>
          </div>

          {/* Bonus button */}
          {!streakData.todayClaimed && streakData.currentStreak > 0 && (
            <Button
              size="sm"
              onClick={() => setShowClaimModal(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-200"
            >
              <Gift className="h-4 w-4 mr-1" />
              +{todayBonus} 🪙
            </Button>
          )}
          {streakData.todayClaimed && (
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
              ✓ Claimed
            </Badge>
          )}
        </div>

        {/* Streak visualization */}
        <div className="mt-3 flex gap-1.5">
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
                      : "bg-gradient-to-r from-orange-400 to-amber-400"
                    : "bg-gray-200"
                  }
                `}
              />
            );
          })}
        </div>
      </div>

      {/* Claim Modal - Light theme */}
      <Dialog open={showClaimModal} onOpenChange={setShowClaimModal}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-orange-50 via-white to-amber-50 border-2 border-amber-300">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Flame className="h-6 w-6 text-orange-500 animate-pulse" />
                <span className="text-2xl font-black bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                  Daily Streak Bonus!
                </span>
                <Flame className="h-6 w-6 text-orange-500 animate-pulse" />
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Streak count */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 mb-2 shadow-xl shadow-orange-200">
                <span className="text-3xl font-black text-white">
                  {streakData.currentStreak}
                </span>
              </div>
              <p className="text-gray-600 font-medium">
                Day{streakData.currentStreak !== 1 ? "s" : ""} in a row! 🎉
              </p>
            </div>

            {/* Bonus display */}
            <div className="bg-white rounded-xl p-4 border border-amber-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Today's Bonus:</span>
                <div className="flex items-center gap-1">
                  <span className="text-xl">🪙</span>
                  <span className="text-xl font-bold text-amber-600">
                    +{todayBonus} {III_CONFIG.symbol}
                  </span>
                </div>
              </div>

              {currentMilestone?.badge && (
                <Badge className="w-full justify-center py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border-amber-300">
                  {currentMilestone.badge}
                </Badge>
              )}

              {currentMilestone?.special && (
                <div className="mt-2 flex items-center gap-2 text-sm text-emerald-600">
                  <Star className="h-4 w-4" />
                  {currentMilestone.special}
                </div>
              )}
            </div>

            {/* Next milestone */}
            {nextMilestone && (
              <div className="text-center text-sm text-gray-500">
                <Zap className="h-4 w-4 inline mr-1 text-amber-500" />
                {nextMilestone.day - streakData.currentStreak} more day{nextMilestone.day - streakData.currentStreak !== 1 ? "s" : ""} for +{nextMilestone.bonus} 🪙 {III_CONFIG.symbol} bonus!
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 text-center text-sm">
              <div className="bg-white rounded-xl p-3 border border-gray-200">
                <p className="text-gray-500">Longest Streak</p>
                <p className="font-bold text-indigo-600">{streakData.longestStreak} days</p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-gray-200">
                <p className="text-gray-500">Total Days</p>
                <p className="font-bold text-violet-600">{streakData.totalDaysPlayed} days</p>
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
                disabled={streakData.todayClaimed || showFloatingXp}
                className={`w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 shadow-lg shadow-amber-200 ${
                  showFloatingXp ? "animate-pulse" : ""
                }`}
              >
                {streakData.todayClaimed ? (
                  <>
                    <Trophy className="h-4 w-4 mr-2" />
                    Already Claimed Today!
                  </>
                ) : showFloatingXp ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    🪙 Claimed!
                  </>
                ) : (
                  <>
                    <Gift className="h-4 w-4 mr-2" />
                    Claim +{todayBonus} 🪙 {III_CONFIG.symbol}
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

// Compact streak badge for headers
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
    <div className="flex items-center gap-1 px-2.5 py-1.5 bg-orange-100 border border-orange-200 rounded-full shadow-sm">
      <Flame className={`h-3.5 w-3.5 text-orange-500 ${streak >= 3 ? "animate-pulse" : ""}`} />
      <span className="text-xs font-bold text-orange-600">{streak}</span>
    </div>
  );
}

export default DailyStreak;
