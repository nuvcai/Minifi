'use client';

/**
 * LeagueBadge - Compact league indicator for headers and profiles
 * 
 * Shows:
 * - Current league emoji and name
 * - Current rank in cohort
 * - Zone indicator (promotion/safe/danger)
 * - Expandable mini-standings on click
 */

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Crown,
  TrendingUp,
  TrendingDown,
  Shield,
  ChevronUp,
  ChevronDown,
  Clock,
  Flame,
  Target,
  AlertTriangle,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface League {
  id: string;
  name: string;
  tier: number;
  emoji: string;
  min_xp: number;
  promotion_slots: number;
  relegation_slots: number;
  cohort_size: number;
}

interface LeagueBadgeProps {
  league: League | null;
  rank: number;
  zone: 'promotion' | 'safe' | 'danger';
  weeklyXp: number;
  timeRemaining: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  xpToNextRank: number;
  xpLead: number;
  compact?: boolean;
  onClick?: () => void;
}

// =============================================================================
// LEAGUE COLORS
// =============================================================================

const leagueColors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  bronze: {
    bg: 'bg-amber-900/30',
    border: 'border-amber-600/50',
    text: 'text-amber-400',
    glow: 'shadow-amber-500/20',
  },
  silver: {
    bg: 'bg-slate-600/30',
    border: 'border-slate-400/50',
    text: 'text-slate-300',
    glow: 'shadow-slate-400/20',
  },
  gold: {
    bg: 'bg-yellow-600/30',
    border: 'border-yellow-500/50',
    text: 'text-yellow-400',
    glow: 'shadow-yellow-500/30',
  },
  platinum: {
    bg: 'bg-violet-600/30',
    border: 'border-violet-400/50',
    text: 'text-violet-300',
    glow: 'shadow-violet-500/30',
  },
  diamond: {
    bg: 'bg-cyan-500/30',
    border: 'border-cyan-400/50',
    text: 'text-cyan-300',
    glow: 'shadow-cyan-500/40',
  },
};

const zoneConfig = {
  promotion: {
    icon: TrendingUp,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500/30',
    label: 'Promotion Zone',
  },
  safe: {
    icon: Shield,
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/30',
    label: 'Safe Zone',
  },
  danger: {
    icon: AlertTriangle,
    color: 'text-red-400',
    bg: 'bg-red-500/20',
    border: 'border-red-500/30',
    label: 'Danger Zone',
  },
};

// =============================================================================
// COMPACT BADGE (For navbar/header)
// =============================================================================

function CompactLeagueBadge({
  league,
  rank,
  zone,
  weeklyXp,
}: {
  league: League;
  rank: number;
  zone: 'promotion' | 'safe' | 'danger';
  weeklyXp: number;
}) {
  const colors = leagueColors[league.id] || leagueColors.bronze;
  const zoneInfo = zoneConfig[zone];
  
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${colors.bg} border ${colors.border} shadow-lg ${colors.glow}`}>
      <span className="text-lg">{league.emoji}</span>
      <div className="flex flex-col">
        <span className={`text-xs font-semibold ${colors.text} leading-tight`}>
          {league.name.split(' ')[0]}
        </span>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-white/60">#{rank}</span>
          <div className={`w-1.5 h-1.5 rounded-full ${zoneInfo.bg.replace('/20', '')}`} />
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// EXPANDED POPOVER CONTENT
// =============================================================================

function LeaguePopoverContent({
  league,
  rank,
  zone,
  weeklyXp,
  timeRemaining,
  xpToNextRank,
  xpLead,
}: LeagueBadgeProps) {
  if (!league) return null;
  
  const colors = leagueColors[league.id] || leagueColors.bronze;
  const zoneInfo = zoneConfig[zone];
  const ZoneIcon = zoneInfo.icon;

  return (
    <div className={`w-72 p-4 rounded-xl ${colors.bg} border ${colors.border}`}>
      {/* League Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{league.emoji}</span>
          <div>
            <h4 className={`font-bold ${colors.text}`}>{league.name}</h4>
            <p className="text-xs text-white/50">Tier {league.tier} of 5</p>
          </div>
        </div>
        <Badge className={`${zoneInfo.bg} ${zoneInfo.color} border ${zoneInfo.border}`}>
          <ZoneIcon className="h-3 w-3 mr-1" />
          #{rank}
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2 rounded-lg bg-black/20">
          <p className="text-[10px] text-white/50 uppercase">Weekly XP</p>
          <p className={`text-lg font-bold ${colors.text}`}>{weeklyXp.toLocaleString()}</p>
        </div>
        <div className="p-2 rounded-lg bg-black/20">
          <p className="text-[10px] text-white/50 uppercase">Season Ends</p>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-amber-400" />
            <span className="text-sm font-mono text-white">
              {timeRemaining.days}d {timeRemaining.hours}h
            </span>
          </div>
        </div>
      </div>

      {/* Targets */}
      <div className="space-y-2">
        {xpToNextRank > 0 && (
          <div className={`p-2 rounded-lg ${zoneInfo.bg} border ${zoneInfo.border}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ChevronUp className="h-3 w-3 text-emerald-400" />
                <span className="text-xs text-white/80">To next rank</span>
              </div>
              <span className="text-xs font-bold text-emerald-400">+{xpToNextRank} XP</span>
            </div>
          </div>
        )}
        
        {xpLead > 0 && zone !== 'promotion' && (
          <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ChevronDown className="h-3 w-3 text-orange-400" />
                <span className="text-xs text-white/80">Lead over #{rank + 1}</span>
              </div>
              <span className="text-xs font-bold text-orange-400">{xpLead} XP</span>
            </div>
          </div>
        )}
      </div>

      {/* Zone Status */}
      <div className={`mt-3 p-2 rounded-lg ${zoneInfo.bg} border ${zoneInfo.border} text-center`}>
        <div className="flex items-center justify-center gap-1.5">
          <ZoneIcon className={`h-4 w-4 ${zoneInfo.color}`} />
          <span className={`text-sm font-medium ${zoneInfo.color}`}>
            {zoneInfo.label}
          </span>
        </div>
        <p className="text-[10px] text-white/50 mt-1">
          {zone === 'promotion' 
            ? `Top ${league.promotion_slots} get promoted!`
            : zone === 'danger'
              ? `Bottom ${league.relegation_slots} get relegated!`
              : 'Keep earning XP to climb!'
          }
        </p>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function LeagueBadge({
  league,
  rank,
  zone,
  weeklyXp,
  timeRemaining,
  xpToNextRank,
  xpLead,
  compact = true,
  onClick,
}: LeagueBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!league) {
    return (
      <Badge className="bg-slate-700/50 text-slate-400 border-slate-600">
        <Shield className="h-3 w-3 mr-1" />
        No League
      </Badge>
    );
  }

  if (compact) {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button 
            className="focus:outline-none focus:ring-2 focus:ring-white/20 rounded-full"
            onClick={onClick}
          >
            <CompactLeagueBadge 
              league={league} 
              rank={rank} 
              zone={zone} 
              weeklyXp={weeklyXp} 
            />
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className="p-0 border-0 bg-transparent shadow-2xl" 
          align="end"
          sideOffset={8}
        >
          <LeaguePopoverContent
            league={league}
            rank={rank}
            zone={zone}
            weeklyXp={weeklyXp}
            timeRemaining={timeRemaining}
            xpToNextRank={xpToNextRank}
            xpLead={xpLead}
          />
        </PopoverContent>
      </Popover>
    );
  }

  // Full display (non-compact)
  return (
    <LeaguePopoverContent
      league={league}
      rank={rank}
      zone={zone}
      weeklyXp={weeklyXp}
      timeRemaining={timeRemaining}
      xpToNextRank={xpToNextRank}
      xpLead={xpLead}
    />
  );
}

// =============================================================================
// MINI LEAGUE INDICATOR (For very compact spaces)
// =============================================================================

export function MiniLeagueBadge({
  league,
  rank,
  zone,
}: {
  league: League | null;
  rank: number;
  zone: 'promotion' | 'safe' | 'danger';
}) {
  if (!league) return null;
  
  const colors = leagueColors[league.id] || leagueColors.bronze;
  const zoneInfo = zoneConfig[zone];
  
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${colors.bg} border ${colors.border}`}>
      <span className="text-sm">{league.emoji}</span>
      <span className={`text-xs font-semibold ${colors.text}`}>#{rank}</span>
      <div className={`w-1.5 h-1.5 rounded-full ${zoneInfo.color.replace('text-', 'bg-')}`} />
    </div>
  );
}

export default LeagueBadge;

