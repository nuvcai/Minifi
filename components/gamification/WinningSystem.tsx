/**
 * WinningSystem - Unified Gamification Hub
 * Consolidates streaks, XP, badges, levels & achievements into one engaging system
 * Designed for maximum motivation and dopamine hits 🎯
 * © 2025 NUVC.AI. All Rights Reserved.
 */

"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Flame,
  Trophy,
  Star,
  Zap,
  Target,
  Crown,
  Sparkles,
  Award,
  Gift,
  ChevronRight,
  TrendingUp,
  Shield,
  Brain,
  Heart,
  Lock,
} from "lucide-react";

// Storage keys
const STREAK_KEY = "minifi_streak_data";
const USER_EMAIL_KEY = "minifi_user_email";
const SESSION_KEY = "minifi_session_id";

// Streak milestones with rewards
const streakMilestones: Record<number, { bonus: number; badge?: string; title?: string }> = {
  1: { bonus: 10 },
  3: { bonus: 25, badge: "🔥", title: "3-Day Streak" },
  5: { bonus: 40, badge: "⚡", title: "5-Day Warrior" },
  7: { bonus: 75, badge: "🌟", title: "Weekly Champion" },
  14: { bonus: 150, badge: "💪", title: "Two Week Titan" },
  21: { bonus: 250, badge: "🏆", title: "Three Week Master" },
  30: { bonus: 500, badge: "👑", title: "Monthly Legend" },
};

// Level titles
const levelTitles: Record<number, { title: string; icon: string }> = {
  1: { title: "Apprentice", icon: "🌱" },
  2: { title: "Student", icon: "📚" },
  3: { title: "Explorer", icon: "🧭" },
  4: { title: "Strategist", icon: "♟️" },
  5: { title: "Analyst", icon: "📊" },
  6: { title: "Expert", icon: "🎯" },
  7: { title: "Master", icon: "⭐" },
  8: { title: "Grandmaster", icon: "👑" },
  9: { title: "Legend", icon: "🏆" },
  10: { title: "FO Elite", icon: "💎" },
};

// Achievement categories
const achievementCategories = [
  { id: "missions", name: "Missions", icon: Target, color: "violet" },
  { id: "exploration", name: "Exploration", icon: Brain, color: "blue" },
  { id: "courage", name: "Courage", icon: Shield, color: "amber" },
  { id: "mastery", name: "Mastery", icon: Crown, color: "emerald" },
];

interface WinningSystemProps {
  playerLevel: number;
  playerXP: number;
  completedMissions: number;
  totalMissions: number;
  streakDays?: number;
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
  onStreakClaimed?: (bonus: number, days: number) => void;
  onXpEarned?: (amount: number) => void;
  compact?: boolean;
}

interface StreakData {
  currentStreak: number;
  lastClaimDate: string | null;
  longestStreak: number;
  totalDaysPlayed: number;
  todayClaimed: boolean;
}

export function WinningSystem({
  playerLevel,
  playerXP,
  completedMissions,
  totalMissions,
  earnedBadgeIds = [],
  stats,
  onStreakClaimed,
  onXpEarned,
  compact = false,
}: WinningSystemProps) {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    lastClaimDate: null,
    longestStreak: 0,
    totalDaysPlayed: 0,
    todayClaimed: false,
  });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showClaimAnimation, setShowClaimAnimation] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "achievements" | "stats">("overview");

  // Calculate derived values
  const xpToNextLevel = 1000;
  const currentLevelXP = playerXP % xpToNextLevel;
  const levelProgress = (currentLevelXP / xpToNextLevel) * 100;
  const levelInfo = levelTitles[Math.min(playerLevel, 10)] || levelTitles[10];
  
  const getStreakBonus = (days: number): number => {
    const milestones = Object.keys(streakMilestones).map(Number).sort((a, b) => b - a);
    for (const milestone of milestones) {
      if (days >= milestone) return streakMilestones[milestone].bonus;
    }
    return 10;
  };

  const getNextStreakMilestone = () => {
    const milestones = Object.keys(streakMilestones).map(Number).sort((a, b) => a - b);
    for (const m of milestones) {
      if (m > streakData.currentStreak) return { day: m, ...streakMilestones[m] };
    }
    return null;
  };

  // Load streak data
  useEffect(() => {
    const loadStreak = async () => {
      const today = new Date().toDateString();
      
      try {
        const saved = localStorage.getItem(STREAK_KEY);
        let data: StreakData = saved ? JSON.parse(saved) : {
          currentStreak: 0,
          lastClaimDate: null,
          longestStreak: 0,
          totalDaysPlayed: 0,
          todayClaimed: false,
        };

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

          localStorage.setItem(STREAK_KEY, JSON.stringify(data));
        }

        setStreakData(data);
      } catch (e) {
        console.error("Failed to load streak:", e);
      }
    };

    loadStreak();
  }, []);

  // Claim streak bonus
  const claimStreakBonus = () => {
    if (streakData.todayClaimed) return;

    const bonus = getStreakBonus(streakData.currentStreak);
    
    setShowClaimAnimation(true);
    
    const newData = { ...streakData, todayClaimed: true };
    setStreakData(newData);
    localStorage.setItem(STREAK_KEY, JSON.stringify(newData));

    setTimeout(() => {
      setShowClaimAnimation(false);
      onStreakClaimed?.(bonus, streakData.currentStreak);
      onXpEarned?.(bonus);
    }, 1000);
  };

  const nextMilestone = getNextStreakMilestone();
  const todayBonus = getStreakBonus(streakData.currentStreak);

  // Compact sidebar version
  if (compact) {
    return (
      <>
        <div className="p-4 rounded-2xl bg-white border border-violet-100 shadow-xl shadow-violet-100/30">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-200/50">
                <Trophy className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Your Progress</h3>
                <p className="text-[10px] text-gray-500">Level {playerLevel} {levelInfo.title}</p>
              </div>
            </div>
            <Badge className="bg-violet-100 text-violet-700 border-violet-200">
              {levelInfo.icon}
            </Badge>
          </div>

          {/* XP Progress Ring */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <svg className="w-16 h-16 -rotate-90">
                <circle
                  cx="32" cy="32" r="28"
                  className="fill-none stroke-violet-100 stroke-[4]"
                />
                <circle
                  cx="32" cy="32" r="28"
                  className="fill-none stroke-violet-500 stroke-[4]"
                  strokeDasharray={`${levelProgress * 1.76} 176`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-black text-violet-600">{playerLevel}</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">XP Progress</span>
                <span className="font-bold text-violet-600">{currentLevelXP}/{xpToNextLevel}</span>
              </div>
              <Progress value={levelProgress} className="h-2" />
              <p className="text-[10px] text-gray-400 mt-1">
                {xpToNextLevel - currentLevelXP} 🪙 to Level {playerLevel + 1}
              </p>
            </div>
          </div>

          {/* Streak Section */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 ${streakData.currentStreak >= 3 ? 'animate-pulse' : ''}`}>
                  <Flame className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {streakData.currentStreak} Day{streakData.currentStreak !== 1 ? "s" : ""} 🔥
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {nextMilestone 
                      ? `${nextMilestone.day - streakData.currentStreak} to ${nextMilestone.title}`
                      : "Max streak! 👑"
                    }
                  </p>
                </div>
              </div>
              {!streakData.todayClaimed && streakData.currentStreak > 0 ? (
                <Button
                  size="sm"
                  onClick={claimStreakBonus}
                  disabled={showClaimAnimation}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs px-2 py-1 h-auto"
                >
                  {showClaimAnimation ? (
                    <Sparkles className="h-3 w-3 animate-spin" />
                  ) : (
                    <>+{todayBonus}</>
                  )}
                </Button>
              ) : (
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px]">
                  ✓
                </Badge>
              )}
            </div>
            {/* Streak dots */}
            <div className="flex gap-1 mt-2">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-1.5 rounded-full ${
                    i + 1 <= streakData.currentStreak
                      ? "bg-gradient-to-r from-orange-400 to-amber-500"
                      : "bg-orange-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center p-2 bg-violet-50 rounded-lg">
              <p className="text-lg font-black text-violet-600">{completedMissions}</p>
              <p className="text-[9px] text-gray-500">Missions</p>
            </div>
            <div className="text-center p-2 bg-amber-50 rounded-lg">
              <p className="text-lg font-black text-amber-600">{playerXP.toLocaleString()}</p>
              <p className="text-[9px] text-gray-500">Total 🪙 iii</p>
            </div>
            <div className="text-center p-2 bg-emerald-50 rounded-lg">
              <p className="text-lg font-black text-emerald-600">{earnedBadgeIds.length}</p>
              <p className="text-[9px] text-gray-500">Badges</p>
            </div>
          </div>

          {/* View Details Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetailsModal(true)}
            className="w-full text-violet-600 hover:text-violet-700 hover:bg-violet-50"
          >
            View All Achievements
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Details Modal */}
        <WinningSystemModal
          open={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          playerLevel={playerLevel}
          playerXP={playerXP}
          levelProgress={levelProgress}
          levelInfo={levelInfo}
          streakData={streakData}
          completedMissions={completedMissions}
          totalMissions={totalMissions}
          earnedBadgeIds={earnedBadgeIds}
          stats={stats}
          nextMilestone={nextMilestone}
        />
      </>
    );
  }

  // Full version (not commonly used, modal covers it)
  return (
    <div className="p-6 rounded-2xl bg-white border border-violet-100 shadow-xl">
      {/* Full implementation would go here */}
      <Button onClick={() => setShowDetailsModal(true)}>View Progress</Button>
      
      <WinningSystemModal
        open={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        playerLevel={playerLevel}
        playerXP={playerXP}
        levelProgress={levelProgress}
        levelInfo={levelInfo}
        streakData={streakData}
        completedMissions={completedMissions}
        totalMissions={totalMissions}
        earnedBadgeIds={earnedBadgeIds}
        stats={stats}
        nextMilestone={nextMilestone}
      />
    </div>
  );
}

// Detailed Modal
function WinningSystemModal({
  open,
  onClose,
  playerLevel,
  playerXP,
  levelProgress,
  levelInfo,
  streakData,
  completedMissions,
  totalMissions,
  earnedBadgeIds,
  stats,
  nextMilestone,
}: {
  open: boolean;
  onClose: () => void;
  playerLevel: number;
  playerXP: number;
  levelProgress: number;
  levelInfo: { title: string; icon: string };
  streakData: StreakData;
  completedMissions: number;
  totalMissions: number;
  earnedBadgeIds: string[];
  stats?: WinningSystemProps["stats"];
  nextMilestone: { day: number; bonus: number; badge?: string; title?: string } | null;
}) {
  const [activeTab, setActiveTab] = useState<"overview" | "achievements" | "stats">("overview");
  const xpToNextLevel = 1000;
  const currentLevelXP = playerXP % xpToNextLevel;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-gradient-to-br from-white via-violet-50/30 to-purple-50/30 border-violet-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-200/50">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-black text-gray-900">Tee's Winning Journey</span>
              <p className="text-sm font-normal text-gray-500">Track your FO mastery progress</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-violet-100 rounded-xl mb-4">
          {[
            { id: "overview", label: "Overview", icon: Star },
            { id: "achievements", label: "Achievements", icon: Award },
            { id: "stats", label: "Stats", icon: TrendingUp },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-white text-violet-700 shadow-md"
                  : "text-violet-600 hover:bg-white/50"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Level Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="relative flex items-center gap-4">
                <div className="relative">
                  <svg className="w-20 h-20 -rotate-90">
                    <circle cx="40" cy="40" r="36" className="fill-none stroke-white/20 stroke-[6]" />
                    <circle
                      cx="40" cy="40" r="36"
                      className="fill-none stroke-white stroke-[6]"
                      strokeDasharray={`${levelProgress * 2.26} 226`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black">{playerLevel}</span>
                    <span className="text-[10px] opacity-80">LEVEL</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{levelInfo.icon}</span>
                    <span className="text-lg font-bold">{levelInfo.title}</span>
                  </div>
                  <p className="text-sm opacity-80 mb-2">{currentLevelXP.toLocaleString()} / {xpToNextLevel.toLocaleString()} 🪙</p>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-500"
                      style={{ width: `${levelProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Streak Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 shadow-lg shadow-orange-200/50 ${streakData.currentStreak >= 7 ? 'animate-pulse' : ''}`}>
                    <Flame className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xl font-black text-gray-900">
                      {streakData.currentStreak} Day Streak 🔥
                    </p>
                    <p className="text-sm text-gray-500">
                      {nextMilestone 
                        ? `${nextMilestone.day - streakData.currentStreak} days to ${nextMilestone.title}`
                        : "You've reached legend status! 👑"
                      }
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Streak milestones */}
              <div className="flex justify-between">
                {[3, 5, 7, 14, 21, 30].map((day) => {
                  const milestone = streakMilestones[day];
                  const achieved = streakData.currentStreak >= day;
                  return (
                    <div key={day} className="text-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        achieved 
                          ? "bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-lg"
                          : "bg-orange-100 text-orange-400"
                      }`}>
                        {achieved ? milestone?.badge || "✓" : day}
                      </div>
                      <p className="text-[9px] text-gray-500 mt-1">{day}d</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-violet-50 border border-violet-100">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-violet-500" />
                  <span className="text-sm font-semibold text-gray-700">Missions</span>
                </div>
                <p className="text-2xl font-black text-violet-600">{completedMissions}/{totalMissions}</p>
                <Progress value={(completedMissions / totalMissions) * 100} className="h-1.5 mt-2" />
              </div>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-semibold text-gray-700">Total 🪙 iii</span>
                </div>
                <p className="text-2xl font-black text-amber-600">{playerXP.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Wisdom earned</p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-semibold text-gray-700">Badges</span>
                </div>
                <p className="text-2xl font-black text-emerald-600">{earnedBadgeIds.length}</p>
                <p className="text-xs text-gray-500 mt-1">Achievements</p>
              </div>
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-100">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-4 w-4 text-rose-500" />
                  <span className="text-sm font-semibold text-gray-700">Best Streak</span>
                </div>
                <p className="text-2xl font-black text-rose-600">{streakData.longestStreak}</p>
                <p className="text-xs text-gray-500 mt-1">Days record</p>
              </div>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === "achievements" && (
          <div className="space-y-4">
            {achievementCategories.map((category) => (
              <div key={category.id} className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-2 rounded-lg bg-${category.color}-100`}>
                    <category.icon className={`h-4 w-4 text-${category.color}-600`} />
                  </div>
                  <span className="font-semibold text-gray-900">{category.name}</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {/* Sample badges - in real implementation, filter by category */}
                  {[1, 2, 3].map((i) => {
                    const isEarned = earnedBadgeIds.length >= i;
                    return (
                      <div
                        key={i}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                          isEarned
                            ? `bg-${category.color}-100 border-2 border-${category.color}-300`
                            : "bg-gray-100 border-2 border-gray-200 opacity-40"
                        }`}
                      >
                        {isEarned ? ["🎯", "🧭", "⭐"][i - 1] : <Lock className="h-4 w-4 text-gray-400" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Motivation */}
            <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-100 text-center">
              <p className="text-sm text-violet-700">
                💪 Badges celebrate <strong>effort</strong>, not just outcomes.
                <br />Keep exploring, keep learning, keep winning!
              </p>
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === "stats" && (
          <div className="space-y-3">
            {[
              { label: "Total Play Time", value: `${streakData.totalDaysPlayed} days`, icon: "📅" },
              { label: "Missions Completed", value: `${completedMissions}/${totalMissions}`, icon: "🎯" },
              { label: "Total XP Earned", value: playerXP.toLocaleString(), icon: "⚡" },
              { label: "Current Streak", value: `${streakData.currentStreak} days`, icon: "🔥" },
              { label: "Longest Streak", value: `${streakData.longestStreak} days`, icon: "🏆" },
              { label: "Badges Earned", value: earnedBadgeIds.length.toString(), icon: "🎖️" },
              { label: "Current Level", value: `${playerLevel} (${levelInfo.title})`, icon: levelInfo.icon },
              { label: "Risk Levels Tried", value: stats?.differentRiskLevelsTried?.toString() || "0", icon: "⚖️" },
              { label: "Asset Classes Explored", value: stats?.differentAssetClassesTried?.toString() || "0", icon: "📊" },
              { label: "Coaches Consulted", value: stats?.coachesUsed?.toString() || "0", icon: "🧠" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{stat.icon}</span>
                  <span className="text-sm text-gray-600">{stat.label}</span>
                </div>
                <span className="font-bold text-gray-900">{stat.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Footer motivation */}
        <div className="mt-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 text-center">
          <p className="text-xs text-amber-700 italic">
            "Compound interest is the eighth wonder of the world. Start early, stay consistent!"
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default WinningSystem;

