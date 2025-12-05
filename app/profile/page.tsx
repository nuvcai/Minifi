/**
 * Profile Page - Player Stats & Journey
 * Shows detailed progress, badges, and achievements
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Coins,
  Trophy,
  Flame,
  Target,
  Award,
  TrendingUp,
  Calendar,
  Zap,
  Crown,
  Shield,
  Star,
  Lock,
  ChevronRight,
  Share2,
  BookOpen,
  Brain,
} from "lucide-react";
import { useIII, BADGES } from "@/hooks/useIII";
import { useLeague } from "@/hooks/useLeague";
import { levelTitles } from "@/components/gamification/LevelUpCelebration";
import { Button } from "@/components/ui/button";
import { WisdomLearned, calculateWisdomStats } from "@/components/gamification/WisdomLearned";

const III_CONFIG = {
  symbol: 'iii',
  emoji: '✦',
};

export default function ProfilePage() {
  const {
    totalIII,
    level,
    levelProgress,
    iiiToNextLevel,
    weeklyIII,
    stats,
    earnedBadges,
    recentTransactions,
  } = useIII();

  const { league, userRank, zone, allLeagues } = useLeague();
  const levelInfo = levelTitles[level] || levelTitles[1];
  const nextLevelInfo = levelTitles[level + 1];

  const [activeTab, setActiveTab] = useState<'overview' | 'wisdom' | 'badges' | 'history'>('overview');
  
  // Get completed missions for wisdom tracking (based on missions completed stat)
  // This maps to the years of the missions completed
  const completedMissionYears = useMemo(() => {
    // Map mission count to completed years for wisdom tracking
    const missionYears = [1990, 1997, 2000, 2008, 2020, 2025];
    return missionYears.slice(0, stats.missionsCompleted);
  }, [stats.missionsCompleted]);
  
  const wisdomStats = useMemo(() => 
    calculateWisdomStats(completedMissionYears), 
    [completedMissionYears]
  );

  // All possible badges from BADGES
  const allBadges = BADGES;
  const earnedBadgeIds = earnedBadges.map(b => b.id);
  const lockedBadges = allBadges.filter(b => !earnedBadgeIds.includes(b.id));

  // Stats summary
  const statCards = [
    { label: 'Missions Completed', value: stats.missionsCompleted, icon: Target, color: 'text-emerald-400' },
    { label: 'Current Streak', value: `${stats.currentStreak} days`, icon: Flame, color: 'text-orange-400' },
    { label: 'Longest Streak', value: `${stats.longestStreak} days`, icon: Crown, color: 'text-amber-400' },
    { label: 'Days Played', value: stats.totalDaysPlayed, icon: Calendar, color: 'text-blue-400' },
    { label: 'Asset Classes', value: stats.assetClassesExplored, icon: TrendingUp, color: 'text-purple-400' },
    { label: 'Coaches Used', value: stats.coachesUsed, icon: BookOpen, color: 'text-pink-400' },
  ];

  return (
    <div className="min-h-screen w-full bg-[#050507] overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/timeline" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Game</span>
          </Link>
          <Button variant="outline" size="sm" className="border-white/20 text-white/70 hover:text-white hover:bg-white/10">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Profile Header */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent border border-emerald-500/30 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Level Avatar */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl blur-lg opacity-60" />
              <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-2xl">
                <span className="text-4xl font-black text-white">{level}</span>
              </div>
              <div className="absolute -bottom-2 -right-2 px-2 py-1 rounded-lg bg-amber-500 text-xs font-bold text-white shadow-lg">
                {levelInfo.title}
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
                Your Wealth Journey
              </h1>
              <p className="text-white/60 text-sm mb-4">
                Building the next generation of wealth creators
              </p>

              {/* iii Balance */}
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 border border-white/20">
                <Coins className="h-5 w-5 text-emerald-400" />
                <span className="text-2xl font-black text-white">{totalIII.toLocaleString()}</span>
                <span className="text-emerald-400 font-bold">{III_CONFIG.symbol}</span>
              </div>

              {/* Level Progress */}
              <div className="mt-4 max-w-md">
                <div className="flex justify-between text-xs text-white/50 mb-1">
                  <span>Level {level}</span>
                  <span>{iiiToNextLevel.toLocaleString()} {III_CONFIG.symbol} to Level {level + 1}</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* League Badge */}
            {league && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                <span className="text-4xl mb-2 block">{league.emoji}</span>
                <p className="font-bold text-white">{league.name}</p>
                <p className="text-sm text-white/60">Rank #{userRank}</p>
                <div className={`mt-2 text-xs px-2 py-1 rounded-full ${
                  zone === 'promotion' ? 'bg-emerald-500/20 text-emerald-400' :
                  zone === 'danger' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-white/10 text-white/60'
                }`}>
                  {zone === 'promotion' ? '🚀 Promotion' : zone === 'danger' ? '⚠️ Danger' : '✓ Safe'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 rounded-xl bg-white/5 border border-white/10 overflow-x-auto">
          {(['overview', 'wisdom', 'badges', 'history'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-fit px-4 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                activeTab === tab
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab === 'overview' && (
                <>
                  <Trophy className="h-4 w-4" />
                  <span className="hidden sm:inline">Overview</span>
                </>
              )}
              {tab === 'wisdom' && (
                <>
                  <Brain className="h-4 w-4" />
                  <span className="hidden sm:inline">Wisdom ({wisdomStats.wisdomScore})</span>
                  <span className="sm:hidden">Wisdom</span>
                </>
              )}
              {tab === 'badges' && (
                <>
                  <Award className="h-4 w-4" />
                  <span className="hidden sm:inline">Badges ({earnedBadges.length})</span>
                  <span className="sm:hidden">{earnedBadges.length}</span>
                </>
              )}
              {tab === 'history' && (
                <>
                  <Zap className="h-4 w-4" />
                  <span className="hidden sm:inline">History</span>
                </>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {statCards.map((stat, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    <span className="text-xs text-white/50">{stat.label}</span>
                  </div>
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Wisdom Score Preview */}
            <div 
              className="p-5 rounded-2xl bg-gradient-to-br from-[#9898f2]/10 via-purple-500/5 to-transparent border border-[#9898f2]/30 cursor-pointer hover:from-[#9898f2]/15 transition-all"
              onClick={() => setActiveTab('wisdom')}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Brain className="h-5 w-5 text-[#9898f2]" />
                  Wisdom Score
                </h3>
                <button className="text-sm text-[#9898f2] hover:underline flex items-center gap-1">
                  View Details <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-[#9898f2]">{wisdomStats.wisdomScore}</span>
                  <span className="text-white/40">/ 1000</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/50">Progress</span>
                    <span className="text-[#9898f2]">{wisdomStats.overallProgress}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#9898f2] to-purple-500 rounded-full"
                      style={{ width: `${wisdomStats.overallProgress}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-white/50">
                <span>🏛️ {wisdomStats.pillarsUnlocked}/{wisdomStats.pillarsTotal} Pillars</span>
                <span>📊 {wisdomStats.assetsUnlocked}/{wisdomStats.assetsTotal} Assets</span>
                <span>🎯 {wisdomStats.strategiesUnlocked}/{wisdomStats.strategiesTotal} Strategies</span>
              </div>
            </div>

            {/* Quick Badges Preview */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-400" />
                  Recent Badges
                </h3>
                <button onClick={() => setActiveTab('badges')} className="text-sm text-emerald-400 hover:underline flex items-center gap-1">
                  View All <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {earnedBadges.slice(0, 6).map((badge) => (
                  <div key={badge.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <span className="text-xl">{badge.emoji}</span>
                    <span className="text-sm font-medium text-white">{badge.name}</span>
                  </div>
                ))}
                {earnedBadges.length === 0 && (
                  <p className="text-white/50 text-sm">Complete missions to earn badges!</p>
                )}
              </div>
            </div>

            {/* League Progress */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
              <h3 className="font-bold text-white flex items-center gap-2 mb-4">
                <Trophy className="h-5 w-5 text-amber-400" />
                League Journey
              </h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allLeagues.map((l, i) => {
                  const isCurrentLeague = league?.id === l.id;
                  const isPastLeague = league && l.tier < league.tier;
                  return (
                    <div
                      key={l.id}
                      className={`flex-shrink-0 p-3 rounded-xl text-center min-w-[80px] transition-all ${
                        isCurrentLeague
                          ? 'bg-gradient-to-br from-amber-500/30 to-orange-500/20 border-2 border-amber-500/50 scale-110'
                          : isPastLeague
                          ? 'bg-emerald-500/10 border border-emerald-500/30'
                          : 'bg-white/5 border border-white/10 opacity-50'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{l.emoji}</span>
                      <span className={`text-xs font-medium ${isCurrentLeague ? 'text-amber-300' : 'text-white/70'}`}>
                        {l.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'wisdom' && (
          <WisdomLearned 
            completedMissions={completedMissionYears}
            showInsights={true}
          />
        )}

        {activeTab === 'badges' && (
          <div className="space-y-6">
            {/* Earned Badges */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
              <h3 className="font-bold text-white flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 text-amber-400" />
                Earned Badges ({earnedBadges.length})
              </h3>
              {earnedBadges.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {earnedBadges.map((badge) => (
                    <div key={badge.id} className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                      <span className="text-3xl">{badge.emoji}</span>
                      <div className="flex-1">
                        <p className="font-bold text-white">{badge.name}</p>
                        <p className="text-xs text-white/60">{badge.description}</p>
                      </div>
                      <Award className="h-5 w-5 text-amber-400" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/50">No badges earned yet</p>
                  <p className="text-white/30 text-sm">Complete missions to unlock badges!</p>
                </div>
              )}
            </div>

            {/* Locked Badges */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
              <h3 className="font-bold text-white flex items-center gap-2 mb-4">
                <Lock className="h-5 w-5 text-white/40" />
                Locked Badges ({lockedBadges.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lockedBadges.slice(0, 8).map((badge) => (
                  <div key={badge.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 opacity-60">
                    <span className="text-3xl grayscale">{badge.emoji}</span>
                    <div className="flex-1">
                      <p className="font-bold text-white/70">{badge.name}</p>
                      <p className="text-xs text-white/40">{badge.description}</p>
                    </div>
                    <Lock className="h-5 w-5 text-white/30" />
                  </div>
                ))}
              </div>
              {lockedBadges.length > 8 && (
                <p className="text-center text-white/40 text-sm mt-4">
                  +{lockedBadges.length - 8} more badges to unlock
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
            <h3 className="font-bold text-white flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-emerald-400" />
              Recent {III_CONFIG.symbol} Transactions
            </h3>
            {recentTransactions.length > 0 ? (
              <div className="space-y-2">
                {recentTransactions.slice(0, 20).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                    <div>
                      <p className="font-medium text-white text-sm">{tx.description}</p>
                      <p className="text-xs text-white/40">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`font-bold ${tx.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount} {III_CONFIG.symbol}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Zap className="h-12 w-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/50">No transactions yet</p>
                <p className="text-white/30 text-sm">Start playing to earn {III_CONFIG.symbol}!</p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-white/10">
          <div className="flex items-center justify-center gap-3">
            <Image src="/nuvc-logo.png" alt="NUVC" width={24} height={24} className="rounded" />
            <span className="text-sm text-white/40">Mini.Fi by NUVC.AI</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

