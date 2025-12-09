/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   🏆 LEADERBOARD - Weekly Competition Rankings                               ║
 * ║   Apple-style minimal design with smooth interactions                        ║
 * ║   Consistent with Mini.Fi design language                                    ║
 * ║   © 2025 NUVC.AI. All Rights Reserved.                                      ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Trophy,
  Crown,
  TrendingUp,
  TrendingDown,
  Clock,
  ChevronUp,
  ChevronDown,
  Minus,
  Flame,
  Sparkles,
  ChevronRight,
  Gift,
} from "lucide-react";
import { useLeague } from "@/hooks/useLeague";
import { useIII } from "@/hooks/useIII";

const III_CONFIG = {
  symbol: 'iii',
  emoji: '✦',
};

export default function LeaderboardPage() {
  const {
    league,
    standings,
    userRank,
    zone,
    timeRemaining,
    xpToNextRank,
    allLeagues,
    isLoading,
  } = useLeague();

  const { weeklyIII } = useIII();
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);

  const activeLeagueId = selectedLeague || league?.id || 'bronze';

  const formatTime = () => {
    const { days, hours, minutes } = timeRemaining;
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getRankChangeIcon = (change: number) => {
    if (change > 0) return <ChevronUp className="h-4 w-4 text-emerald-500" />;
    if (change < 0) return <ChevronDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-3 w-3 text-slate-300 dark:text-slate-600" />;
  };

  const zoneConfig = {
    promotion: { 
      label: '↑ Promotion',
      style: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 border-emerald-200 dark:border-emerald-500/30'
    },
    safe: { 
      label: 'Safe Zone',
      style: 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-500/15 border-slate-200 dark:border-slate-500/30'
    },
    danger: { 
      label: '↓ Danger',
      style: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/15 border-amber-200 dark:border-amber-500/30'
    },
  };

  const topThree = standings?.players?.slice(0, 3) || [];

  return (
    <div className="min-h-screen w-full page-bg overflow-x-hidden">
      
      {/* Background - Matching home page style */}
      <div className="fixed inset-0 w-screen h-screen pointer-events-none overflow-hidden">
        {/* Dark mode */}
        <div className="dark:block hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl" />
        </div>
        {/* Light mode */}
        <div className="dark:hidden block">
          <div className="absolute top-20 right-20 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-40 left-10 w-80 h-80 bg-orange-100/40 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="relative w-full max-w-3xl mx-auto px-4 sm:px-6 py-6">
        
        {/* Header - Clean Apple style */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/timeline" 
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 
              hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back</span>
          </Link>
          
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">{formatTime()} left</span>
          </div>
        </div>

        {/* Hero Section - Minimal */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
            bg-amber-50 dark:bg-amber-500/10 
            border border-amber-200 dark:border-amber-500/30
            mb-4">
            <Trophy className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-bold text-amber-700 dark:text-amber-400">WEEKLY COMPETITION</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-2">
            {allLeagues.find(l => l.id === activeLeagueId)?.emoji} {allLeagues.find(l => l.id === activeLeagueId)?.name}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Compete to climb the ranks
          </p>
        </div>

        {/* League Tabs - Pill style */}
        <div className="flex justify-center gap-2 overflow-x-auto pb-2 mb-6 -mx-4 px-4">
          {allLeagues.map((l) => {
            const isActive = activeLeagueId === l.id;
            const isUserLeague = l.id === league?.id;
            return (
              <button
                key={l.id}
                onClick={() => setSelectedLeague(l.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm transition-all ${
                  isActive
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <span className="text-base">{l.emoji}</span>
                <span className="hidden sm:inline">{l.name.replace(' League', '')}</span>
                {isUserLeague && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Your Stats Card - Frosted glass style */}
        {league && activeLeagueId === league.id && (
          <div className="mb-6 p-5 rounded-2xl
            bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl
            border border-slate-200 dark:border-slate-700/50
            shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Your Rank</p>
                  <p className="text-4xl font-black text-slate-900 dark:text-white">#{userRank}</p>
                </div>
                
                {/* Divider */}
                <div className="w-px h-12 bg-slate-200 dark:bg-slate-700" />
                
                {/* Weekly XP */}
                <div className="text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Weekly</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{weeklyIII}</span>
                    <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{III_CONFIG.symbol}</span>
                  </div>
                </div>
              </div>
              
              {/* Zone Badge */}
              <div className={`px-4 py-2 rounded-xl border text-sm font-bold ${zoneConfig[zone].style}`}>
                {zoneConfig[zone].label}
              </div>
            </div>
            
            {/* Progress to next rank */}
            {xpToNextRank > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-bold text-slate-900 dark:text-white">{xpToNextRank.toLocaleString()} {III_CONFIG.symbol}</span> to rank up
                </span>
              </div>
            )}
          </div>
        )}

        {/* Viewing other league message */}
        {league && activeLeagueId !== league.id && (
          <div className="mb-6 p-4 rounded-2xl text-center
            bg-slate-50 dark:bg-slate-800/50
            border border-slate-200 dark:border-slate-700">
            <span className="text-slate-600 dark:text-slate-400 text-sm">
              Viewing {allLeagues.find(l => l.id === activeLeagueId)?.name} •{' '}
              <button 
                onClick={() => setSelectedLeague(league.id)}
                className="text-slate-900 dark:text-white font-bold hover:underline"
              >
                Back to yours →
              </button>
            </span>
          </div>
        )}

        {/* Top 3 Podium - Minimalist */}
        {topThree.length >= 3 && (
          <div className="mb-6 grid grid-cols-3 gap-3">
            {/* 2nd Place */}
            <div className="pt-6">
              <div className="p-4 rounded-2xl text-center
                bg-white dark:bg-slate-800/80
                border border-slate-200 dark:border-slate-700/50">
                <div className="relative inline-block mb-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center text-lg font-bold text-slate-600 dark:text-slate-300">
                    {topThree[1]?.display_name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="absolute -bottom-1 -right-1 text-lg">🥈</span>
                </div>
                <p className="font-bold text-slate-800 dark:text-white text-sm truncate">{topThree[1]?.display_name}</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">{topThree[1]?.weekly_xp?.toLocaleString()} {III_CONFIG.symbol}</p>
              </div>
            </div>
            
            {/* 1st Place */}
            <div>
              <div className="p-4 rounded-2xl text-center
                bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10
                border-2 border-amber-200 dark:border-amber-500/30
                shadow-lg shadow-amber-100 dark:shadow-amber-500/10">
                <Crown className="h-5 w-5 text-amber-500 mx-auto mb-1" />
                <div className="relative inline-block mb-2">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-amber-400/30">
                    {topThree[0]?.display_name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="absolute -bottom-1 -right-1 text-xl">👑</span>
                </div>
                <p className="font-black text-slate-900 dark:text-white truncate">{topThree[0]?.display_name}</p>
                <p className="text-amber-600 dark:text-amber-400 text-sm font-bold">{topThree[0]?.weekly_xp?.toLocaleString()} {III_CONFIG.symbol}</p>
              </div>
            </div>
            
            {/* 3rd Place */}
            <div className="pt-8">
              <div className="p-4 rounded-2xl text-center
                bg-white dark:bg-slate-800/80
                border border-slate-200 dark:border-slate-700/50">
                <div className="relative inline-block mb-2">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-200 to-orange-300 dark:from-orange-500/30 dark:to-orange-600/30 flex items-center justify-center text-base font-bold text-orange-700 dark:text-orange-300">
                    {topThree[2]?.display_name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="absolute -bottom-1 -right-1 text-base">🥉</span>
                </div>
                <p className="font-bold text-slate-800 dark:text-white text-sm truncate">{topThree[2]?.display_name}</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">{topThree[2]?.weekly_xp?.toLocaleString()} {III_CONFIG.symbol}</p>
              </div>
            </div>
          </div>
        )}

        {/* Standings List - Clean cards */}
        <div className="rounded-2xl overflow-hidden
          bg-white dark:bg-slate-900/80
          border border-slate-200 dark:border-slate-700/50
          shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50">
          
          {/* Loading State */}
          {isLoading && (
            <div className="p-12 text-center">
              <div className="w-10 h-10 rounded-full border-2 border-amber-500 border-t-transparent animate-spin mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400">Loading...</p>
            </div>
          )}

          {/* Players List */}
          {!isLoading && standings?.players && (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {standings.players.slice(3).map((player, index) => {
                const actualRank = index + 4;
                const isCurrentUser = player.is_current_user;
                const isPromotion = actualRank <= (league?.promotionSlots || 10);
                const isRelegation = league?.relegationSlots && actualRank > standings.players.length - league.relegationSlots;

                return (
                  <div
                    key={player.id}
                    className={`flex items-center gap-4 px-5 py-4 transition-all ${
                      isCurrentUser
                        ? 'bg-violet-50 dark:bg-violet-500/10 border-l-4 border-violet-500'
                        : isPromotion
                        ? 'bg-emerald-50/30 dark:bg-emerald-500/5'
                        : isRelegation
                        ? 'bg-red-50/30 dark:bg-red-500/5'
                        : ''
                    }`}
                  >
                    {/* Rank */}
                    <div className="w-8 text-center">
                      <span className={`font-bold text-sm ${
                        isCurrentUser ? 'text-violet-600 dark:text-violet-400' : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        {player.rank}
                      </span>
                    </div>

                    {/* Avatar & Name */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                        isCurrentUser
                          ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        {player.display_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className={`font-semibold truncate ${
                          isCurrentUser ? 'text-violet-700 dark:text-violet-300' : 'text-slate-800 dark:text-white'
                        }`}>
                          {isCurrentUser ? 'You' : player.display_name}
                        </p>
                        {player.country && (
                          <span className="text-xs text-slate-400 dark:text-slate-500">{player.country}</span>
                        )}
                      </div>
                    </div>

                    {/* Weekly XP */}
                    <div className="text-right">
                      <div className="flex items-baseline gap-1 justify-end">
                        <span className={`font-bold ${
                          isCurrentUser ? 'text-violet-600 dark:text-violet-400' : 'text-slate-800 dark:text-white'
                        }`}>
                          {player.weekly_xp.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-400">{III_CONFIG.symbol}</span>
                      </div>
                    </div>

                    {/* Streak */}
                    {player.current_streak > 0 && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full 
                        bg-orange-50 dark:bg-orange-500/10 
                        text-orange-600 dark:text-orange-400 text-xs font-bold">
                        <Flame className="h-3 w-3" />
                        {player.current_streak}
                      </div>
                    )}

                    {/* Rank Change */}
                    <div className="w-6 text-center">
                      {getRankChangeIcon(player.rank_change)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Zone Legend - Minimal */}
        <div className="mt-4 flex justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Promotion</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span>Relegation</span>
          </div>
        </div>

        {/* Season Rewards - Clean card */}
        <div className="mt-8 rounded-2xl overflow-hidden
          bg-white dark:bg-slate-900/80
          border border-slate-200 dark:border-slate-700/50
          shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-400/30">
                <Gift className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Season Rewards</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Finish the week strong!</p>
              </div>
            </div>
          </div>
          
          {/* Rewards */}
          <div className="p-5 grid grid-cols-3 gap-4">
            {/* 1st */}
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-400/20">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <p className="font-bold text-slate-900 dark:text-white text-sm">1st</p>
              <p className="text-amber-600 dark:text-amber-400 font-bold text-sm">
                +{league?.id === 'diamond' ? '1500' : league?.id === 'platinum' ? '750' : league?.id === 'gold' ? '400' : league?.id === 'silver' ? '200' : '100'} {III_CONFIG.symbol}
              </p>
            </div>
            
            {/* 2nd */}
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                <span className="text-xl">🥈</span>
              </div>
              <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">2nd</p>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                +{league?.id === 'diamond' ? '1000' : league?.id === 'platinum' ? '500' : league?.id === 'gold' ? '300' : league?.id === 'silver' ? '150' : '75'} {III_CONFIG.symbol}
              </p>
            </div>
            
            {/* 3rd */}
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center">
                <span className="text-xl">🥉</span>
              </div>
              <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">3rd</p>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                +{league?.id === 'diamond' ? '750' : league?.id === 'platinum' ? '350' : league?.id === 'gold' ? '200' : league?.id === 'silver' ? '100' : '50'} {III_CONFIG.symbol}
              </p>
            </div>
          </div>
          
          {/* Info */}
          <div className="px-5 pb-5">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span><span className="text-emerald-600 dark:text-emerald-400 font-semibold">Top {league?.promotionSlots || 10}</span> → promoted</span>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <span><span className="text-red-600 dark:text-red-400 font-semibold">Bottom {league?.relegationSlots || 5}</span> → relegated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pro Tip - Subtle */}
        <div className="mt-6 p-4 rounded-2xl
          bg-violet-50 dark:bg-violet-500/10
          border border-violet-100 dark:border-violet-500/20">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-violet-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-violet-800 dark:text-violet-300 text-sm mb-0.5">Pro Tip</p>
              <p className="text-xs text-violet-600 dark:text-violet-400/80">
                Complete daily missions and maintain your streak to climb faster! 🔥
              </p>
            </div>
          </div>
        </div>

        {/* Footer - Minimal */}
        <footer className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center justify-center gap-3">
            <Image src="/nuvc-logo.png" alt="NUVC" width={24} height={24} className="rounded opacity-60" />
            <span className="text-sm text-slate-400 dark:text-slate-500">Mini.Fi by NUVC.AI</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
