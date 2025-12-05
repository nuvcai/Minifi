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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Crown,
  TrendingUp,
  Shield,
  ChevronUp,
  ChevronDown,
  Clock,
  AlertTriangle,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

import { type League } from './LeagueSystem';

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
// BRAND COLORS
// =============================================================================

// Primary Brand Colors - Teen Tech palette
// primary: #9898f2 (lavender purple)
// white: #F4F4F4 (off-white)
// These colors are used directly in className strings below

// =============================================================================
// LEAGUE COLORS - Now using brand-consistent palette
// =============================================================================

const leagueColors: Record<string, { 
  bg: string; 
  border: string; 
  text: string; 
  glow: string;
  gradient: string;
  shadowColor: string;
  iconBg: string;
  accentColor: string;
}> = {
  bronze: {
    bg: 'bg-[#9898f2]/10',
    border: 'border-[#9898f2]/30',
    text: 'text-amber-400',
    glow: 'shadow-[#9898f2]/20',
    gradient: 'from-[#9898f2] via-[#8585e0] to-[#7272ce]',
    shadowColor: 'shadow-[#9898f2]/25',
    iconBg: 'bg-[#9898f2]/20',
    accentColor: '#CD7F32', // Bronze accent
  },
  silver: {
    bg: 'bg-[#9898f2]/10',
    border: 'border-[#9898f2]/30',
    text: 'text-slate-300',
    glow: 'shadow-[#9898f2]/20',
    gradient: 'from-[#9898f2] via-[#a8a8ff] to-[#b8b8ff]',
    shadowColor: 'shadow-[#9898f2]/25',
    iconBg: 'bg-[#9898f2]/20',
    accentColor: '#C0C0C0', // Silver accent
  },
  gold: {
    bg: 'bg-[#9898f2]/10',
    border: 'border-[#9898f2]/30',
    text: 'text-yellow-400',
    glow: 'shadow-[#9898f2]/25',
    gradient: 'from-[#9898f2] via-[#a890f0] to-[#c8a0f8]',
    shadowColor: 'shadow-[#9898f2]/30',
    iconBg: 'bg-[#9898f2]/20',
    accentColor: '#FFD700', // Gold accent
  },
  platinum: {
    bg: 'bg-[#9898f2]/15',
    border: 'border-[#9898f2]/40',
    text: 'text-violet-300',
    glow: 'shadow-[#9898f2]/30',
    gradient: 'from-[#9898f2] via-[#a0a0ff] to-[#c0b0ff]',
    shadowColor: 'shadow-[#9898f2]/35',
    iconBg: 'bg-[#9898f2]/25',
    accentColor: '#E5E4E2', // Platinum accent
  },
  diamond: {
    bg: 'bg-[#9898f2]/15',
    border: 'border-[#9898f2]/50',
    text: 'text-cyan-300',
    glow: 'shadow-[#9898f2]/40',
    gradient: 'from-[#9898f2] via-[#90c0ff] to-[#a0d8ff]',
    shadowColor: 'shadow-[#9898f2]/45',
    iconBg: 'bg-[#9898f2]/30',
    accentColor: '#B9F2FF', // Diamond accent
  },
};

const zoneConfig = {
  promotion: {
    icon: TrendingUp,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/30',
    label: 'Promotion Zone',
  },
  safe: {
    icon: Shield,
    color: 'text-[#9898f2]',
    bg: 'bg-[#9898f2]/15',
    border: 'border-[#9898f2]/30',
    label: 'Safe Zone',
  },
  danger: {
    icon: AlertTriangle,
    color: 'text-red-400',
    bg: 'bg-red-500/15',
    border: 'border-red-500/30',
    label: 'Danger Zone',
  },
};

// =============================================================================
// COMPACT BADGE (For navbar/header) - Premium Design with League Colors
// =============================================================================

function CompactLeagueBadge({
  league,
  rank,
  zone,
  weeklyXp: _weeklyXp,
}: {
  league: League;
  rank: number;
  zone: 'promotion' | 'safe' | 'danger';
  weeklyXp: number;
}) {
  const colors = leagueColors[league.id] || leagueColors.bronze;
  
  // Zone-specific styling for the badge - brand consistent with light/dark support
  const zoneBadgeStyles = {
    promotion: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    safe: 'bg-white/50 dark:bg-white/10 text-slate-600 dark:text-white/80 border-slate-300 dark:border-white/20',
    danger: 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30 animate-pulse',
  };
  
  return (
    <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl bg-gradient-to-r ${colors.gradient} shadow-lg ${colors.shadowColor} hover:shadow-xl hover:scale-[1.02] transition-all group cursor-pointer`}>
      {/* League Icon with Glow */}
      <div className="relative">
        <div className="absolute inset-0 bg-white/20 rounded-xl blur opacity-60 group-hover:opacity-80 transition-opacity" />
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
          <span className="text-xl">{league.emoji}</span>
        </div>
      </div>
      
      {/* League Info - Always white text since badge has colored gradient background */}
      <div className="flex flex-col min-w-[80px]">
        <div className="flex items-center gap-1.5">
          <Crown className="h-3 w-3 text-white/70" />
          <span className="text-xs font-semibold text-white/90">
            {league.name.split(' ')[0]}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-lg font-black text-white">#{rank}</span>
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${zoneBadgeStyles[zone]}`}>
            {zone === 'promotion' ? '🚀' : zone === 'danger' ? '⚠️' : '✓'}
          </span>
        </div>
      </div>
      
      {/* Decorative Arrow */}
      <ChevronDown className="h-4 w-4 text-white/50 group-hover:text-white/80 transition-colors" />
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
    <div className="w-72 p-4 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-[#1a1a2e]/98 dark:via-[#16162a]/99 dark:to-[#0f0f1a] backdrop-blur-xl border border-[#9898f2]/30 shadow-2xl shadow-[#9898f2]/10">
      {/* League Header with Brand Gradient */}
      <div className={`-mx-4 -mt-4 mb-4 px-4 py-3 rounded-t-2xl bg-gradient-to-r ${colors.gradient}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <span className="text-xl">{league.emoji}</span>
            </div>
            <div>
              <h4 className="font-bold text-white">{league.name}</h4>
              <p className="text-xs text-white/60">Tier {league.tier} of 5</p>
            </div>
          </div>
          <Badge className={`${zoneInfo.bg} ${zoneInfo.color} border ${zoneInfo.border}`}>
            <ZoneIcon className="h-3 w-3 mr-1" />
            #{rank}
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2.5 rounded-xl bg-[#9898f2]/10 border border-[#9898f2]/20">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wide">Weekly 🪙</p>
          <p className="text-lg font-bold text-[#9898f2]">{weeklyXp.toLocaleString()}</p>
        </div>
        <div className="p-2.5 rounded-xl bg-[#9898f2]/10 border border-[#9898f2]/20">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wide">Season Ends</p>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-[#9898f2]" />
            <span className="text-sm font-mono text-slate-700 dark:text-white">
              {timeRemaining.days}d {timeRemaining.hours}h
            </span>
          </div>
        </div>
      </div>

      {/* Targets */}
      <div className="space-y-2">
        {xpToNextRank > 0 && (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ChevronUp className="h-3 w-3 text-emerald-500 dark:text-emerald-400" />
                <span className="text-xs text-slate-600 dark:text-slate-300">To next rank</span>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">+{xpToNextRank} 🪙</span>
            </div>
          </div>
        )}
        
        {xpLead > 0 && zone !== 'promotion' && (
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ChevronDown className="h-3 w-3 text-amber-500 dark:text-amber-400" />
                <span className="text-xs text-slate-600 dark:text-slate-300">Lead over #{rank + 1}</span>
              </div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{xpLead} 🪙</span>
            </div>
          </div>
        )}
      </div>

      {/* Zone Status */}
      <div className={`mt-3 p-2.5 rounded-xl ${zoneInfo.bg} border ${zoneInfo.border} text-center`}>
        <div className="flex items-center justify-center gap-1.5">
          <ZoneIcon className={`h-4 w-4 ${zoneInfo.color}`} />
          <span className={`text-sm font-semibold ${zoneInfo.color}`}>
            {zoneInfo.label}
          </span>
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
          {zone === 'promotion' 
            ? `Top ${league.promotionSlots} get promoted!`
            : zone === 'danger'
              ? `Bottom ${league.relegationSlots} get relegated!`
              : 'Keep earning 🪙 to climb!'
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

