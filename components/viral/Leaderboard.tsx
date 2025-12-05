'use client';

import React, { useState } from 'react';
import { type LeaderboardEntry, LEADERBOARDS, type Leaderboard as LeaderboardType } from '@/components/data/viralMarketing';

interface LeaderboardProps {
  leaderboardId?: string;
  entries: LeaderboardEntry[];
  currentUserId?: string;
  showTabs?: boolean;
}

// Mock data for demonstration
const MOCK_ENTRIES: LeaderboardEntry[] = [
  { rank: 1, userId: '1', displayName: 'CryptoKing_Alex', score: 12450, level: 15, country: '🇺🇸', rankChange: 0 },
  { rank: 2, userId: '2', displayName: 'InvestorJane', score: 11200, level: 14, country: '🇬🇧', rankChange: 2 },
  { rank: 3, userId: '3', displayName: 'WealthBuilder99', score: 10890, level: 13, country: '🇦🇺', rankChange: -1 },
  { rank: 4, userId: '4', displayName: 'FinanceWhiz', score: 9750, level: 12, country: '🇨🇦', rankChange: 1 },
  { rank: 5, userId: '5', displayName: 'MoneyMaster', score: 9200, level: 11, country: '🇸🇬', rankChange: -2 },
  { rank: 6, userId: '6', displayName: 'FutureMillionaire', score: 8900, level: 11, country: '🇮🇳', rankChange: 3 },
  { rank: 7, userId: '7', displayName: 'SmartInvestor', score: 8500, level: 10, country: '🇩🇪', rankChange: 0 },
  { rank: 8, userId: '8', displayName: 'WallStreetKid', score: 8200, level: 10, country: '🇯🇵', rankChange: 1 },
  { rank: 9, userId: '9', displayName: 'StockNinja', score: 7800, level: 9, country: '🇧🇷', rankChange: -1 },
  { rank: 10, userId: '10', displayName: 'TradingPro', score: 7500, level: 9, country: '🇫🇷', rankChange: 0 },
];

export function Leaderboard({
  leaderboardId = 'global_xp',
  entries = MOCK_ENTRIES,
  currentUserId,
  showTabs = true,
}: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState<'global' | 'weekly' | 'friends'>('global');
  
  const leaderboard = LEADERBOARDS.find(l => l.id === leaderboardId);
  
  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankChangeIndicator = (change?: number) => {
    if (!change || change === 0) return null;
    if (change > 0) return <span className="text-green-400 text-xs">▲{change}</span>;
    return <span className="text-red-400 text-xs">▼{Math.abs(change)}</span>;
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-b border-white/10">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          🏆 {leaderboard?.name || 'Leaderboard'}
        </h2>
        {leaderboard && (
          <p className="text-sm text-gray-400 mt-1">
            {leaderboard.period === 'all_time' ? 'All Time' : 
             leaderboard.period === 'weekly' ? 'This Week' : 
             leaderboard.period === 'monthly' ? 'This Month' : 'Today'}
          </p>
        )}
      </div>

      {/* Tabs */}
      {showTabs && (
        <div className="flex border-b border-white/10">
          {(['global', 'weekly', 'friends'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                flex-1 py-3 text-sm font-medium transition-all
                ${activeTab === tab 
                  ? 'text-white bg-white/10 border-b-2 border-yellow-500' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'}
              `}
            >
              {tab === 'global' ? '🌍 Global' : tab === 'weekly' ? '📅 Weekly' : '👥 Friends'}
            </button>
          ))}
        </div>
      )}

      {/* Top 3 Podium */}
      <div className="p-4 flex justify-center gap-4 border-b border-white/10">
        {entries.slice(0, 3).map((entry, i) => {
          const order = [1, 0, 2][i]; // Show 2nd, 1st, 3rd
          const podiumEntry = entries[order];
          const height = order === 0 ? 'h-24' : order === 1 ? 'h-20' : 'h-16';
          
          return (
            <div 
              key={podiumEntry.userId}
              className={`flex flex-col items-center ${order === 0 ? 'order-2' : order === 1 ? 'order-1' : 'order-3'}`}
            >
              <div className="text-4xl mb-1">{getRankBadge(podiumEntry.rank)}</div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                {podiumEntry.displayName.substring(0, 2).toUpperCase()}
              </div>
              <div className="text-xs text-white mt-1 font-medium text-center max-w-[80px] truncate">
                {podiumEntry.displayName}
              </div>
              <div className="text-xs text-yellow-400">{podiumEntry.score.toLocaleString()} 🪙</div>
              <div className={`${height} w-16 bg-gradient-to-t from-yellow-600/50 to-yellow-400/30 rounded-t-lg mt-2`} />
            </div>
          );
        })}
      </div>

      {/* Full List */}
      <div className="max-h-96 overflow-y-auto">
        {entries.map((entry, index) => {
          const isCurrentUser = entry.userId === currentUserId;
          
          return (
            <div
              key={entry.userId}
              className={`
                flex items-center gap-3 px-4 py-3 border-b border-white/5 transition-all
                ${isCurrentUser ? 'bg-purple-600/20 border-purple-500/50' : 'hover:bg-white/5'}
              `}
            >
              {/* Rank */}
              <div className="w-10 text-center">
                {index < 3 ? (
                  <span className="text-xl">{getRankBadge(entry.rank)}</span>
                ) : (
                  <span className="text-gray-400 font-medium">{entry.rank}</span>
                )}
              </div>

              {/* Rank change */}
              <div className="w-6">
                {getRankChangeIndicator(entry.rankChange)}
              </div>

              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-white text-sm font-medium">
                {entry.displayName.substring(0, 2).toUpperCase()}
              </div>

              {/* Name & Level */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-medium truncate ${isCurrentUser ? 'text-purple-300' : 'text-white'}`}>
                    {entry.displayName}
                    {isCurrentUser && <span className="ml-1 text-xs">(You)</span>}
                  </span>
                  {entry.country && <span className="text-sm">{entry.country}</span>}
                </div>
                {entry.level && (
                  <div className="text-xs text-gray-500">Level {entry.level}</div>
                )}
              </div>

              {/* Score */}
              <div className="text-right">
                <div className="font-bold text-yellow-400">{entry.score.toLocaleString()}</div>
                <div className="text-xs text-gray-500">XP</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Current user not in top - show their rank */}
      {currentUserId && !entries.find(e => e.userId === currentUserId) && (
        <div className="p-4 bg-slate-800/50 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="text-gray-400">Your rank: #234</div>
            <div className="flex-1 h-px bg-white/10" />
            <div className="text-yellow-400">5,420 🪙 iii</div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            2,080 🪙 to enter top 100
          </div>
        </div>
      )}

      {/* Footer CTA */}
      <div className="p-4 bg-gradient-to-r from-purple-600/10 to-blue-600/10">
        <p className="text-center text-sm text-gray-400">
          Complete missions to climb the leaderboard! 🚀
        </p>
      </div>
    </div>
  );
}


