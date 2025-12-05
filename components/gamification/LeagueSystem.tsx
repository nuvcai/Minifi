'use client';

/**
 * LeagueSystem - KEEP-inspired League Division System
 * 
 * Based on Keep app (China's 200M+ user fitness platform)
 * Key principles:
 * 1. Small cohort competition (30-50 players per league)
 * 2. Weekly seasons with promotion/demotion
 * 3. Visual league identity with exclusive aesthetics
 * 4. Clear "zones" - Promotion, Safe, Danger
 */

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Flame,
  Shield,
  Zap,
  TrendingUp,
  TrendingDown,
  Clock,
  ChevronUp,
  Sparkles,
  Target,
  AlertTriangle,
  Trophy,
  Crown,
  Medal,
  Award,
  Star,
  Gem,
} from 'lucide-react';

// =============================================================================
// LEAGUE DEFINITIONS (KEEP-Style)
// =============================================================================

export interface League {
  id: string;
  name: string;
  tier: number; // 1-10 (higher = better)
  emoji: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgGradient: string;
  borderColor: string;
  textColor: string;
  glowColor: string;
  description: string;
  minXpToEnter: number;
  promotionSlots: number; // Top X get promoted
  relegationSlots: number; // Bottom X get demoted
  cohortSize: number; // Players per league instance
  weeklyRewards: LeagueReward[];
}

export interface LeagueReward {
  rank: number | [number, number]; // Single rank or range [start, end]
  xpBonus: number;
  badge?: string;
  specialReward?: string;
}

export const LEAGUES: League[] = [
  {
    id: 'bronze',
    name: 'Bronze League',
    tier: 1,
    emoji: '🥉',
    icon: Shield,
    color: '#CD7F32',
    bgGradient: 'from-amber-900/40 via-amber-800/30 to-stone-900/40',
    borderColor: 'border-amber-700/50',
    textColor: 'text-amber-400',
    glowColor: 'shadow-amber-500/20',
    description: 'Begin your investment journey',
    minXpToEnter: 0,
    promotionSlots: 10,
    relegationSlots: 0, // Can't go lower
    cohortSize: 30,
    weeklyRewards: [
      { rank: 1, xpBonus: 100, badge: 'bronze_champion' },
      { rank: 2, xpBonus: 75 },
      { rank: 3, xpBonus: 50 },
      { rank: [4, 10], xpBonus: 25 },
    ],
  },
  {
    id: 'silver',
    name: 'Silver League',
    tier: 2,
    emoji: '🥈',
    icon: Shield,
    color: '#C0C0C0',
    bgGradient: 'from-slate-700/40 via-slate-600/30 to-slate-800/40',
    borderColor: 'border-slate-400/50',
    textColor: 'text-slate-300',
    glowColor: 'shadow-slate-400/20',
    description: 'Rising through the ranks',
    minXpToEnter: 500,
    promotionSlots: 10,
    relegationSlots: 5,
    cohortSize: 30,
    weeklyRewards: [
      { rank: 1, xpBonus: 200, badge: 'silver_champion' },
      { rank: 2, xpBonus: 150 },
      { rank: 3, xpBonus: 100 },
      { rank: [4, 10], xpBonus: 50 },
    ],
  },
  {
    id: 'gold',
    name: 'Gold League',
    tier: 3,
    emoji: '🥇',
    icon: Trophy,
    color: '#FFD700',
    bgGradient: 'from-yellow-600/40 via-amber-500/30 to-yellow-700/40',
    borderColor: 'border-yellow-500/50',
    textColor: 'text-yellow-400',
    glowColor: 'shadow-yellow-500/30',
    description: 'Among the dedicated learners',
    minXpToEnter: 1500,
    promotionSlots: 10,
    relegationSlots: 5,
    cohortSize: 30,
    weeklyRewards: [
      { rank: 1, xpBonus: 400, badge: 'gold_champion' },
      { rank: 2, xpBonus: 300 },
      { rank: 3, xpBonus: 200 },
      { rank: [4, 10], xpBonus: 100 },
    ],
  },
  {
    id: 'platinum',
    name: 'Platinum League',
    tier: 4,
    emoji: '💎',
    icon: Sparkles,
    color: '#E5E4E2',
    bgGradient: 'from-violet-600/40 via-purple-500/30 to-violet-700/40',
    borderColor: 'border-violet-400/50',
    textColor: 'text-violet-300',
    glowColor: 'shadow-violet-500/30',
    description: 'Elite investor territory',
    minXpToEnter: 3500,
    promotionSlots: 8,
    relegationSlots: 5,
    cohortSize: 30,
    weeklyRewards: [
      { rank: 1, xpBonus: 750, badge: 'platinum_champion', specialReward: 'exclusive_avatar' },
      { rank: 2, xpBonus: 500 },
      { rank: 3, xpBonus: 350 },
      { rank: [4, 8], xpBonus: 200 },
    ],
  },
  {
    id: 'diamond',
    name: 'Diamond League',
    tier: 5,
    emoji: '👑',
    icon: Crown,
    color: '#B9F2FF',
    bgGradient: 'from-cyan-500/40 via-blue-400/30 to-cyan-600/40',
    borderColor: 'border-cyan-400/50',
    textColor: 'text-cyan-300',
    glowColor: 'shadow-cyan-500/40',
    description: 'The pinnacle of achievement',
    minXpToEnter: 7500,
    promotionSlots: 3, // Only top 3 reach the Hall of Fame
    relegationSlots: 10,
    cohortSize: 30,
    weeklyRewards: [
      { rank: 1, xpBonus: 1500, badge: 'diamond_champion', specialReward: 'hall_of_fame' },
      { rank: 2, xpBonus: 1000, badge: 'diamond_elite' },
      { rank: 3, xpBonus: 750, badge: 'diamond_star' },
      { rank: [4, 10], xpBonus: 400 },
    ],
  },
];

// =============================================================================
// LEAGUE PLAYER DATA
// =============================================================================

export interface LeaguePlayer {
  id: string;
  displayName: string;
  avatarUrl?: string;
  weeklyXp: number;
  totalXp: number;
  currentStreak: number;
  country?: string;
  isCurrentUser?: boolean;
  lastActive?: string; // ISO timestamp
  rankChange?: number;
}

// Generate mock cohort data (in production, this comes from backend)
function generateMockCohort(league: League, currentUserRank: number): LeaguePlayer[] {
  const names = [
    'InvestorPro', 'WealthBuilder', 'StockNinja', 'CryptoKing', 'ValueHunter',
    'TrendFollower', 'DividendKing', 'GrowthSeeker', 'SafetyFirst', 'RiskTaker',
    'MarketMaster', 'FundManager', 'ETFExpert', 'BondKing', 'IndexFan',
    'TechInvestor', 'GreenInvestor', 'GlobalTrader', 'LocalHero', 'PatientInvestor',
    'QuickTrader', 'LongTermHolder', 'DayTrader', 'SwingTrader', 'ValueInvestor',
    'MomentumPro', 'ContrarianKing', 'QuantTrader', 'FundamentalFan', 'ChartMaster',
  ];
  
  const countries = ['🇺🇸', '🇬🇧', '🇨🇦', '🇦🇺', '🇩🇪', '🇫🇷', '🇯🇵', '🇸🇬', '🇮🇳', '🇧🇷'];
  
  const players: LeaguePlayer[] = [];
  
  for (let i = 0; i < league.cohortSize; i++) {
    const isUser = i === currentUserRank - 1;
    const baseXp = league.minXpToEnter + (league.cohortSize - i) * 50 + Math.random() * 200;
    
    players.push({
      id: isUser ? 'current_user' : `player_${i}`,
      displayName: isUser ? 'You' : names[i % names.length] + (i >= names.length ? `_${Math.floor(i / names.length)}` : ''),
      weeklyXp: Math.floor(baseXp),
      totalXp: Math.floor(baseXp * 3 + Math.random() * 1000),
      currentStreak: Math.floor(Math.random() * 14),
      country: countries[i % countries.length],
      isCurrentUser: isUser,
      lastActive: isUser ? 'now' : `${Math.floor(Math.random() * 24)}h ago`,
      rankChange: Math.floor(Math.random() * 7) - 3,
    });
  }
  
  // Sort by weekly XP
  return players.sort((a, b) => b.weeklyXp - a.weeklyXp);
}

// =============================================================================
// COUNTDOWN TIMER COMPONENT
// =============================================================================

function SeasonCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      // Next Monday at midnight
      const nextMonday = new Date(now);
      nextMonday.setDate(now.getDate() + ((8 - now.getDay()) % 7 || 7));
      nextMonday.setHours(0, 0, 0, 0);
      
      const diff = nextMonday.getTime() - now.getTime();
      
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };
    
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/30 border border-white/10">
      <Clock className="h-4 w-4 text-amber-400 animate-pulse" />
      <div className="flex items-center gap-1 font-mono text-sm">
        <span className="text-white font-bold">{timeLeft.days}d</span>
        <span className="text-gray-500">:</span>
        <span className="text-white font-bold">{String(timeLeft.hours).padStart(2, '0')}h</span>
        <span className="text-gray-500">:</span>
        <span className="text-white font-bold">{String(timeLeft.minutes).padStart(2, '0')}m</span>
        <span className="text-gray-500">:</span>
        <span className="text-amber-400 font-bold">{String(timeLeft.seconds).padStart(2, '0')}s</span>
      </div>
      <span className="text-xs text-gray-400 hidden sm:inline">until season ends</span>
    </div>
  );
}

// =============================================================================
// ZONE INDICATOR
// =============================================================================

type Zone = 'promotion' | 'safe' | 'danger';

function getZone(rank: number, league: League): Zone {
  if (rank <= league.promotionSlots) return 'promotion';
  if (rank > league.cohortSize - league.relegationSlots) return 'danger';
  return 'safe';
}

function ZoneBadge({ zone }: { zone: Zone }) {
  const config = {
    promotion: {
      icon: ChevronUp,
      text: 'Promotion Zone',
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500/50',
      textColor: 'text-emerald-400',
      iconColor: 'text-emerald-400',
    },
    safe: {
      icon: Shield,
      text: 'Safe Zone',
      bg: 'bg-blue-500/20',
      border: 'border-blue-500/50',
      textColor: 'text-blue-400',
      iconColor: 'text-blue-400',
    },
    danger: {
      icon: AlertTriangle,
      text: 'Danger Zone',
      bg: 'bg-red-500/20',
      border: 'border-red-500/50',
      textColor: 'text-red-400',
      iconColor: 'text-red-400',
    },
  }[zone];
  
  const Icon = config.icon;
  
  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${config.bg} border ${config.border}`}>
      <Icon className={`h-3 w-3 ${config.iconColor}`} />
      <span className={`text-xs font-medium ${config.textColor}`}>{config.text}</span>
    </div>
  );
}

// =============================================================================
// PLAYER ROW COMPONENT
// =============================================================================

interface PlayerRowProps {
  player: LeaguePlayer;
  rank: number;
  league: League;
  showZone?: boolean;
}

function PlayerRow({ player, rank, league, showZone = false }: PlayerRowProps) {
  const zone = getZone(rank, league);
  const _isTopThree = rank <= 3;
  
  const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;
  
  const zoneBg = {
    promotion: 'bg-emerald-500/5 hover:bg-emerald-500/10',
    safe: 'hover:bg-white/5',
    danger: 'bg-red-500/5 hover:bg-red-500/10',
  }[zone];
  
  const userHighlight = player.isCurrentUser 
    ? 'ring-2 ring-purple-500/50 bg-purple-500/10' 
    : '';
  
  return (
    <div className={`
      flex items-center gap-3 px-4 py-3 transition-all rounded-lg
      ${zoneBg} ${userHighlight}
    `}>
      {/* Rank */}
      <div className="w-10 flex items-center justify-center">
        {rankEmoji ? (
          <span className="text-xl">{rankEmoji}</span>
        ) : (
          <span className={`text-sm font-bold ${zone === 'danger' ? 'text-red-400' : 'text-gray-400'}`}>
            #{rank}
          </span>
        )}
      </div>
      
      {/* Rank Change */}
      <div className="w-8 flex items-center justify-center">
        {player.rankChange !== undefined && player.rankChange !== 0 && (
          <div className={`flex items-center ${player.rankChange > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {player.rankChange > 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span className="text-xs font-medium">{Math.abs(player.rankChange)}</span>
          </div>
        )}
      </div>
      
      {/* Avatar */}
      <div className={`
        w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm
        ${player.isCurrentUser 
          ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
          : 'bg-gradient-to-br from-slate-600 to-slate-700'}
      `}>
        {player.displayName.substring(0, 2).toUpperCase()}
      </div>
      
      {/* Name & Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-medium truncate ${player.isCurrentUser ? 'text-purple-300' : 'text-white'}`}>
            {player.displayName}
          </span>
          {player.country && <span className="text-sm">{player.country}</span>}
          {player.currentStreak >= 3 && (
            <div className="flex items-center gap-0.5">
              <Flame className="h-3 w-3 text-orange-400" />
              <span className="text-xs text-orange-400">{player.currentStreak}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Level {Math.floor(player.totalXp / 1000) + 1}</span>
          {player.lastActive && <span>• Active {player.lastActive}</span>}
        </div>
      </div>
      
      {/* Zone Badge (on hover or for user) */}
      {(showZone || player.isCurrentUser) && (
        <ZoneBadge zone={zone} />
      )}
      
      {/* Weekly XP */}
      <div className="text-right">
        <div className={`font-bold ${league.textColor}`}>
          {player.weeklyXp.toLocaleString()}
        </div>
        <div className="text-xs text-gray-500">XP this week</div>
      </div>
    </div>
  );
}

// =============================================================================
// NEXT TARGET COMPONENT
// =============================================================================

interface NextTargetProps {
  currentRank: number;
  players: LeaguePlayer[];
  league: League;
}

function NextTarget({ currentRank, players, league }: NextTargetProps) {
  const currentPlayer = players[currentRank - 1];
  const playerAbove = currentRank > 1 ? players[currentRank - 2] : null;
  const playerBelow = currentRank < players.length ? players[currentRank] : null;
  
  const xpToNext = playerAbove ? playerAbove.weeklyXp - currentPlayer.weeklyXp : 0;
  const xpLead = playerBelow ? currentPlayer.weeklyXp - playerBelow.weeklyXp : 0;
  
  const zone = getZone(currentRank, league);
  
  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10">
      <div className="flex items-center gap-2 mb-3">
        <Target className="h-4 w-4 text-amber-400" />
        <h4 className="text-sm font-semibold text-white">Your Targets</h4>
      </div>
      
      <div className="space-y-3">
        {/* Target above */}
        {playerAbove && (
          <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-2">
              <ChevronUp className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-gray-300">
                <span className="font-medium text-emerald-400">{xpToNext} 🪙</span> to pass{' '}
                <span className="font-medium text-white">{playerAbove.displayName}</span>
              </span>
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              #{currentRank - 1}
            </Badge>
          </div>
        )}
        
        {/* Threat below */}
        {playerBelow && zone !== 'promotion' && (
          <div className="flex items-center justify-between p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-400" />
              <span className="text-sm text-gray-300">
                <span className="font-medium text-white">{playerBelow.displayName}</span> is{' '}
                <span className="font-medium text-orange-400">{xpLead} 🪙</span> behind you
                {playerBelow.lastActive === 'now' && (
                  <span className="text-red-400 font-medium"> (active now!)</span>
                )}
              </span>
            </div>
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
              #{currentRank + 1}
            </Badge>
          </div>
        )}
        
        {/* Promotion/Danger zone message */}
        {zone === 'promotion' && (
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center">
            <span className="text-sm text-emerald-400 font-medium">
              🚀 You&apos;re in the promotion zone! Keep it up!
            </span>
          </div>
        )}
        
        {zone === 'danger' && (
          <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-center animate-pulse">
            <span className="text-sm text-red-400 font-medium">
              ⚠️ Danger! Complete a mission to avoid demotion!
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// MAIN LEAGUE SYSTEM COMPONENT
// =============================================================================

interface LeagueSystemProps {
  currentLeagueId?: string;
  currentUserRank?: number;
  onEarnXp?: () => void;
}

export function LeagueSystem({
  currentLeagueId = 'gold',
  currentUserRank = 8,
  onEarnXp,
}: LeagueSystemProps) {
  const [activeView, setActiveView] = useState<'standings' | 'leagues'>('standings');
  
  const currentLeague = LEAGUES.find(l => l.id === currentLeagueId) || LEAGUES[2];
  const players = generateMockCohort(currentLeague, currentUserRank);
  const currentPlayer = players.find(p => p.isCurrentUser);
  const zone = getZone(currentUserRank, currentLeague);
  
  const _LeagueIcon = currentLeague.icon;
  
  return (
    <div className={`rounded-2xl overflow-hidden border ${currentLeague.borderColor} bg-gradient-to-br ${currentLeague.bgGradient} shadow-2xl ${currentLeague.glowColor}`}>
      {/* League Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${currentLeague.color}30` }}
            >
              <span className="text-3xl">{currentLeague.emoji}</span>
            </div>
            <div>
              <h2 className={`text-xl font-bold ${currentLeague.textColor}`}>
                {currentLeague.name}
              </h2>
              <p className="text-sm text-gray-400">{currentLeague.description}</p>
            </div>
          </div>
          <SeasonCountdown />
        </div>
        
        {/* Your Position */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5">
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className={`text-2xl font-black ${currentLeague.textColor}`}>#{currentUserRank}</div>
              <div className="text-xs text-gray-500">Your Rank</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-black text-white">
                {currentPlayer?.weeklyXp.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Weekly 🪙</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <div className="flex items-center gap-1">
                <Flame className="h-5 w-5 text-orange-400" />
                <span className="text-2xl font-black text-orange-400">
                  {currentPlayer?.currentStreak || 0}
                </span>
              </div>
              <div className="text-xs text-gray-500">Day Streak</div>
            </div>
          </div>
          <ZoneBadge zone={zone} />
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {(['standings', 'leagues'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveView(tab)}
            className={`
              flex-1 py-3 text-sm font-medium transition-all capitalize
              ${activeView === tab 
                ? `${currentLeague.textColor} bg-white/10 border-b-2` 
                : 'text-gray-400 hover:text-white hover:bg-white/5'}
            `}
            style={{ borderColor: activeView === tab ? currentLeague.color : 'transparent' }}
          >
            {tab === 'standings' ? '📊 Standings' : '🏆 All Leagues'}
          </button>
        ))}
      </div>
      
      {/* Content */}
      {activeView === 'standings' ? (
        <div className="p-4 space-y-4">
          {/* Next Target */}
          <NextTarget currentRank={currentUserRank} players={players} league={currentLeague} />
          
          {/* Zone Sections */}
          <div className="space-y-2">
            {/* Promotion Zone Header */}
            <div className="flex items-center gap-2 px-2 py-1">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <ChevronUp className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Promotion Zone (Top {currentLeague.promotionSlots})
                </span>
              </div>
              <div className="flex-1 h-px bg-emerald-500/30" />
            </div>
            
            {/* Players in Promotion Zone */}
            <div className="space-y-1">
              {players.slice(0, currentLeague.promotionSlots).map((player, i) => (
                <PlayerRow key={player.id} player={player} rank={i + 1} league={currentLeague} />
              ))}
            </div>
            
            {/* Safe Zone Header */}
            <div className="flex items-center gap-2 px-2 py-1 mt-4">
              <div className="flex items-center gap-1.5 text-blue-400">
                <Shield className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Safe Zone
                </span>
              </div>
              <div className="flex-1 h-px bg-blue-500/30" />
            </div>
            
            {/* Players in Safe Zone */}
            <div className="space-y-1">
              {players.slice(currentLeague.promotionSlots, -currentLeague.relegationSlots || undefined).map((player, i) => (
                <PlayerRow 
                  key={player.id} 
                  player={player} 
                  rank={i + currentLeague.promotionSlots + 1} 
                  league={currentLeague}
                  showZone={player.isCurrentUser}
                />
              ))}
            </div>
            
            {/* Danger Zone Header */}
            {currentLeague.relegationSlots > 0 && (
              <>
                <div className="flex items-center gap-2 px-2 py-1 mt-4">
                  <div className="flex items-center gap-1.5 text-red-400">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Danger Zone (Bottom {currentLeague.relegationSlots})
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-red-500/30" />
                </div>
                
                {/* Players in Danger Zone */}
                <div className="space-y-1 rounded-lg bg-red-500/5 p-2 border border-red-500/20">
                  {players.slice(-currentLeague.relegationSlots).map((player, i) => (
                    <PlayerRow 
                      key={player.id} 
                      player={player} 
                      rank={currentLeague.cohortSize - currentLeague.relegationSlots + i + 1} 
                      league={currentLeague}
                      showZone
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          
          {/* CTA */}
          <Button 
            onClick={onEarnXp}
            className={`w-full bg-gradient-to-r ${currentLeague.bgGradient} hover:opacity-90 border ${currentLeague.borderColor} text-white font-bold`}
          >
            <Zap className="h-4 w-4 mr-2" />
            Complete a Mission to Earn 🪙
          </Button>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {/* All Leagues View */}
          {LEAGUES.map((league, i) => {
            const isCurrentLeague = league.id === currentLeagueId;
            const isLocked = league.tier > currentLeague.tier + 1;
            
            return (
              <div 
                key={league.id}
                className={`
                  p-4 rounded-xl border transition-all
                  ${isCurrentLeague 
                    ? `bg-gradient-to-r ${league.bgGradient} ${league.borderColor} ring-2 ring-offset-2 ring-offset-slate-900`
                    : isLocked
                      ? 'bg-slate-800/50 border-slate-700/50 opacity-50'
                      : `bg-gradient-to-r ${league.bgGradient} ${league.borderColor} hover:scale-[1.02]`
                  }
                `}
                style={{ boxShadow: isCurrentLeague ? `0 0 0 2px ${league.color}` : 'none' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{league.emoji}</span>
                    <div>
                      <div className={`font-bold ${league.textColor}`}>{league.name}</div>
                      <div className="text-xs text-gray-400">
                        {league.minXpToEnter.toLocaleString()}+ 🪙 to enter
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {isCurrentLeague ? (
                      <Badge className="bg-white/20 text-white">Current</Badge>
                    ) : isLocked ? (
                      <Badge className="bg-slate-700/50 text-gray-400">Locked</Badge>
                    ) : (
                      <Badge className={`${league.textColor} bg-white/10`}>
                        {league.tier < currentLeague.tier ? 'Completed' : 'Next'}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Rewards Preview */}
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-500">Rewards:</span>
                  {league.weeklyRewards.slice(0, 3).map((reward, j) => (
                    <Badge key={j} className="bg-black/20 text-white/70 border-white/10 text-xs">
                      #{typeof reward.rank === 'number' ? reward.rank : `${reward.rank[0]}-${reward.rank[1]}`}: +{reward.xpBonus} XP
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Footer Motivation */}
      <div className="p-4 bg-black/20 border-t border-white/5">
        <p className="text-center text-sm text-gray-400">
          {zone === 'promotion' 
            ? '🚀 Keep pushing! Promotion awaits at season end!'
            : zone === 'danger'
              ? '⚡ Every XP counts! Don\'t let yourself get demoted!'
              : '💪 Consistent effort beats sporadic brilliance!'
          }
        </p>
      </div>
    </div>
  );
}

export default LeagueSystem;

