'use client';

/**
 * useLeague - Custom hook for KEEP-style league system
 * 
 * Manages:
 * - Current league state
 * - Cohort standings
 * - Season countdown
 * - Season end detection & rewards
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { LEAGUES, type League } from '@/components/gamification/LeagueSystem';

// Re-export League type from LeagueSystem for consumers
export type { League } from '@/components/gamification/LeagueSystem';

// Helper to get League UI data by ID
function getLeagueById(leagueId: string): League {
  return LEAGUES.find(l => l.id === leagueId) || LEAGUES[0];
}

// =============================================================================
// TYPES
// =============================================================================

export interface LeaguePlayer {
  id: string;
  display_name: string;
  weekly_xp: number;
  total_xp: number;
  current_streak: number;
  country?: string;
  is_current_user: boolean;
  last_active: string;
  rank_change: number;
  rank: number;
}

export interface LeagueStandings {
  league: League;
  season_id: string;
  cohort_id: string;
  season_start: string;
  season_end: string;
  time_remaining_seconds: number;
  players: LeaguePlayer[];
  current_user: LeaguePlayer | null;
  user_rank: number;
  zone: 'promotion' | 'safe' | 'danger';
  targets: {
    to_pass?: {
      player: string;
      xp_needed: number;
      rank: number;
    };
    chasing?: {
      player: string;
      xp_gap: number;
      is_active: boolean;
      rank: number;
    };
  };
  promotion_threshold: number;
  relegation_threshold: number | null;
}

export interface SeasonEndResult {
  previousLeague: League;
  newLeague: League;
  finalRank: number;
  promoted: boolean;
  relegated: boolean;
  stayed: boolean;
  rewards: {
    xpBonus: number;
    badges: string[];
    special?: string;
  };
  seasonId: string;
}

export interface UseLeagueReturn {
  // State
  league: League | null;
  standings: LeagueStandings | null;
  isLoading: boolean;
  error: string | null;
  
  // Computed
  userRank: number;
  zone: 'promotion' | 'safe' | 'danger';
  timeRemaining: { days: number; hours: number; minutes: number; seconds: number };
  xpToNextRank: number;
  xpLead: number;
  
  // Season end
  seasonEndResult: SeasonEndResult | null;
  showSeasonEnd: boolean;
  dismissSeasonEnd: () => void;
  
  // Actions
  refreshStandings: () => Promise<void>;
  addXp: (amount: number) => void;
  
  // All leagues
  allLeagues: League[];
}

// =============================================================================
// LEAGUE DEFINITIONS - Using LEAGUES from LeagueSystem
// =============================================================================

// Use LEAGUES directly from LeagueSystem for UI consistency
const DEFAULT_LEAGUES = LEAGUES;

// Helper to get rewards for a league
function getLeagueRewards(leagueId: string): Array<{ rank?: number; rank_range?: [number, number]; xp_bonus: number; badge?: string; special?: string }> {
  const rewardsMap: Record<string, Array<{ rank?: number; rank_range?: [number, number]; xp_bonus: number; badge?: string; special?: string }>> = {
    bronze: [
      { rank: 1, xp_bonus: 100, badge: 'bronze_champion' },
      { rank: 2, xp_bonus: 75 },
      { rank: 3, xp_bonus: 50 },
      { rank_range: [4, 10], xp_bonus: 25 },
    ],
    silver: [
      { rank: 1, xp_bonus: 200, badge: 'silver_champion' },
      { rank: 2, xp_bonus: 150 },
      { rank: 3, xp_bonus: 100 },
      { rank_range: [4, 10], xp_bonus: 50 },
    ],
    gold: [
      { rank: 1, xp_bonus: 400, badge: 'gold_champion' },
      { rank: 2, xp_bonus: 300 },
      { rank: 3, xp_bonus: 200 },
      { rank_range: [4, 10], xp_bonus: 100 },
    ],
    platinum: [
      { rank: 1, xp_bonus: 750, badge: 'platinum_champion', special: 'exclusive_avatar' },
      { rank: 2, xp_bonus: 500 },
      { rank: 3, xp_bonus: 350 },
      { rank_range: [4, 8], xp_bonus: 200 },
    ],
    diamond: [
      { rank: 1, xp_bonus: 1500, badge: 'diamond_champion', special: 'hall_of_fame' },
      { rank: 2, xp_bonus: 1000, badge: 'diamond_elite' },
      { rank: 3, xp_bonus: 750, badge: 'diamond_star' },
      { rank_range: [4, 10], xp_bonus: 400 },
    ],
  };
  return rewardsMap[leagueId] || rewardsMap.bronze;
}

// =============================================================================
// LOCAL STORAGE KEYS
// =============================================================================

const STORAGE_KEYS = {
  PLAYER_ID: 'minifi_player_id',
  TOTAL_XP: 'minifi_total_xp',
  WEEKLY_XP: 'minifi_weekly_xp',
  CURRENT_LEAGUE: 'minifi_current_league',
  LAST_SEASON: 'minifi_last_season',
  SEASON_END_SHOWN: 'minifi_season_end_shown',
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getPlayerId(): string {
  if (typeof window === 'undefined') return 'anonymous';
  let playerId = localStorage.getItem(STORAGE_KEYS.PLAYER_ID);
  if (!playerId) {
    playerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(STORAGE_KEYS.PLAYER_ID, playerId);
  }
  return playerId;
}

function getTotalXp(): number {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_XP) || '0', 10);
}

function getWeeklyXp(): number {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem(STORAGE_KEYS.WEEKLY_XP) || '0', 10);
}

function setTotalXp(xp: number): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.TOTAL_XP, xp.toString());
}

function setWeeklyXp(xp: number): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.WEEKLY_XP, xp.toString());
}

function getLeagueByXp(totalXp: number): League {
  for (let i = DEFAULT_LEAGUES.length - 1; i >= 0; i--) {
    if (totalXp >= DEFAULT_LEAGUES[i].minXpToEnter) {
      return DEFAULT_LEAGUES[i];
    }
  }
  return DEFAULT_LEAGUES[0];
}

function calculateTimeRemaining(endTimeSeconds: number): { days: number; hours: number; minutes: number; seconds: number } {
  const seconds = Math.max(0, Math.floor(endTimeSeconds));
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
}

// =============================================================================
// MAIN HOOK
// =============================================================================

export function useLeague(): UseLeagueReturn {
  // State
  const [league, setLeague] = useState<League | null>(null);
  const [standings, setStandings] = useState<LeagueStandings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seasonEndResult, setSeasonEndResult] = useState<SeasonEndResult | null>(null);
  const [showSeasonEnd, setShowSeasonEnd] = useState(false);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(0);
  const [localWeeklyXp, setLocalWeeklyXp] = useState(0);

  // Initialize
  useEffect(() => {
    const totalXp = getTotalXp();
    const weeklyXp = getWeeklyXp();
    const currentLeague = getLeagueByXp(totalXp);
    
    setLeague(currentLeague);
    setLocalWeeklyXp(weeklyXp);
    
    // Load standings
    loadStandings(currentLeague.id, weeklyXp);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timeRemainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        const newValue = prev - 1;
        
        // Season ended!
        if (newValue <= 0 && standings) {
          handleSeasonEnd();
        }
        
        return Math.max(0, newValue);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemainingSeconds, standings]);

  // Load standings from API or generate mock
  const loadStandings = useCallback(async (leagueId: string, weeklyXp: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const playerId = getPlayerId();
      
      // Try API first
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/league/standings?` +
          `player_id=${playerId}&league_id=${leagueId}&user_weekly_xp=${weeklyXp}&user_rank=8`
        );
        
        if (response.ok) {
          const data: LeagueStandings = await response.json();
          setStandings(data);
          setTimeRemainingSeconds(data.time_remaining_seconds);
          setIsLoading(false);
          return;
        }
      } catch {
        // API not available, use mock data
        console.log('League API not available, using mock data');
      }
      
      // Generate mock standings
      const mockStandings = generateMockStandings(leagueId, weeklyXp);
      setStandings(mockStandings);
      setTimeRemainingSeconds(mockStandings.time_remaining_seconds);
      
    } catch (err) {
      setError('Failed to load league standings');
      console.error('League error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate mock standings (client-side fallback)
  const generateMockStandings = (leagueId: string, userWeeklyXp: number): LeagueStandings => {
    const league = DEFAULT_LEAGUES.find(l => l.id === leagueId) || DEFAULT_LEAGUES[2];
    const now = new Date();
    
    // Calculate season dates (Monday to Sunday)
    const dayOfWeek = now.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    const seasonEnd = new Date(now);
    seasonEnd.setDate(now.getDate() + daysUntilMonday);
    seasonEnd.setHours(0, 0, 0, 0);
    
    const seasonStart = new Date(seasonEnd);
    seasonStart.setDate(seasonEnd.getDate() - 7);
    
    // Generate mock players
    const mockNames = [
      'InvestorPro', 'WealthBuilder', 'StockNinja', 'CryptoKing', 'ValueHunter',
      'TrendFollower', 'DividendKing', 'GrowthSeeker', 'SafetyFirst', 'RiskTaker',
      'MarketMaster', 'FundManager', 'ETFExpert', 'BondKing', 'IndexFan',
      'TechInvestor', 'GreenInvestor', 'GlobalTrader', 'LocalHero', 'PatientInvestor',
      'QuickTrader', 'LongTermHolder', 'DayTrader', 'SwingTrader', 'ValueInvestor',
      'MomentumPro', 'ContrarianKing', 'QuantTrader', 'FundamentalFan', 'ChartMaster',
    ];
    const countries = ['🇺🇸', '🇬🇧', '🇨🇦', '🇦🇺', '🇩🇪', '🇫🇷', '🇯🇵', '🇸🇬', '🇮🇳', '🇧🇷'];
    
    // User rank based on XP (simple placement)
    let userRank = 8; // Default
    
    const players: LeaguePlayer[] = [];
    for (let i = 0; i < league.cohortSize; i++) {
      const isUser = i === userRank - 1;
      const baseXp = league.minXpToEnter + (league.cohortSize - i) * 50 + Math.floor(Math.random() * 200);
      
      players.push({
        id: isUser ? 'current_user' : `player_${i}`,
        display_name: isUser ? 'You' : mockNames[i % mockNames.length],
        weekly_xp: isUser ? userWeeklyXp : baseXp,
        total_xp: (isUser ? userWeeklyXp : baseXp) * 3 + Math.floor(Math.random() * 1000),
        current_streak: Math.floor(Math.random() * 14),
        country: countries[i % countries.length],
        is_current_user: isUser,
        last_active: isUser ? 'now' : `${Math.floor(Math.random() * 24)}h ago`,
        rank_change: Math.floor(Math.random() * 7) - 3,
        rank: i + 1,
      });
    }
    
    // Sort by weekly XP and reassign ranks
    players.sort((a, b) => b.weekly_xp - a.weekly_xp);
    players.forEach((p, i) => { p.rank = i + 1; });
    
    const currentUser = players.find(p => p.is_current_user)!;
    userRank = currentUser.rank;
    
    // Determine zone
    let zone: 'promotion' | 'safe' | 'danger' = 'safe';
    if (userRank <= league.promotionSlots) {
      zone = 'promotion';
    } else if (league.relegationSlots > 0 && userRank > league.cohortSize - league.relegationSlots) {
      zone = 'danger';
    }
    
    // Calculate targets
    const targets: LeagueStandings['targets'] = {};
    if (userRank > 1) {
      const playerAbove = players[userRank - 2];
      targets.to_pass = {
        player: playerAbove.display_name,
        xp_needed: playerAbove.weekly_xp - currentUser.weekly_xp + 1,
        rank: userRank - 1,
      };
    }
    if (userRank < players.length) {
      const playerBelow = players[userRank];
      targets.chasing = {
        player: playerBelow.display_name,
        xp_gap: currentUser.weekly_xp - playerBelow.weekly_xp,
        is_active: playerBelow.last_active === 'now',
        rank: userRank + 1,
      };
    }
    
    return {
      league,
      season_id: `week_${now.getFullYear()}_${Math.ceil((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / 604800000)}`,
      cohort_id: `${league.id}_cohort_1`,
      season_start: seasonStart.toISOString(),
      season_end: seasonEnd.toISOString(),
      time_remaining_seconds: Math.max(0, (seasonEnd.getTime() - now.getTime()) / 1000),
      players,
      current_user: currentUser,
      user_rank: userRank,
      zone,
      targets,
      promotion_threshold: league.promotionSlots,
      relegation_threshold: league.relegationSlots > 0 ? league.cohortSize - league.relegationSlots : null,
    };
  };

  // Handle season end
  const handleSeasonEnd = useCallback(() => {
    if (!standings || !league) return;
    
    const finalRank = standings.user_rank;
    const promoted = finalRank <= league.promotionSlots;
    const relegated = league.relegationSlots > 0 && finalRank > league.cohortSize - league.relegationSlots;
    
    // Determine new league
    let newLeague = league;
    if (promoted && league.tier < 5) {
      newLeague = DEFAULT_LEAGUES[league.tier]; // tier is 1-indexed
    } else if (relegated && league.tier > 1) {
      newLeague = DEFAULT_LEAGUES[league.tier - 2];
    }
    
    // Calculate rewards
    let xpBonus = 0;
    const badges: string[] = [];
    let special: string | undefined;
    
    for (const reward of getLeagueRewards(league.id)) {
      if (reward.rank === finalRank) {
        xpBonus = reward.xp_bonus;
        if (reward.badge) badges.push(reward.badge);
        if (reward.special) special = reward.special;
        break;
      } else if (reward.rank_range) {
        const [start, end] = reward.rank_range;
        if (finalRank >= start && finalRank <= end) {
          xpBonus = reward.xp_bonus;
          break;
        }
      }
    }
    
    const result: SeasonEndResult = {
      previousLeague: league,
      newLeague,
      finalRank,
      promoted,
      relegated,
      stayed: !promoted && !relegated,
      rewards: { xpBonus, badges, special },
      seasonId: standings.season_id,
    };
    
    setSeasonEndResult(result);
    setShowSeasonEnd(true);
    
    // Update XP with bonus
    if (xpBonus > 0) {
      const newTotal = getTotalXp() + xpBonus;
      setTotalXp(newTotal);
    }
    
    // Reset weekly XP
    setWeeklyXp(0);
    setLocalWeeklyXp(0);
    
    // Update league
    setLeague(newLeague);
    
  }, [standings, league]);

  // Dismiss season end modal
  const dismissSeasonEnd = useCallback(() => {
    setShowSeasonEnd(false);
  }, []);

  // Refresh standings
  const refreshStandings = useCallback(async () => {
    if (!league) return;
    await loadStandings(league.id, localWeeklyXp);
  }, [league, localWeeklyXp, loadStandings]);

  // Add XP
  const addXp = useCallback((amount: number) => {
    const newTotal = getTotalXp() + amount;
    const newWeekly = getWeeklyXp() + amount;
    
    setTotalXp(newTotal);
    setWeeklyXp(newWeekly);
    setLocalWeeklyXp(newWeekly);
    
    // Check if league changed
    const newLeague = getLeagueByXp(newTotal);
    if (newLeague.id !== league?.id) {
      setLeague(newLeague);
    }
    
    // Refresh standings
    if (league) {
      loadStandings(league.id, newWeekly);
    }
  }, [league, loadStandings]);

  // Computed values
  const timeRemaining = useMemo(
    () => calculateTimeRemaining(timeRemainingSeconds),
    [timeRemainingSeconds]
  );

  const xpToNextRank = useMemo(() => {
    if (!standings?.targets.to_pass) return 0;
    return standings.targets.to_pass.xp_needed;
  }, [standings]);

  const xpLead = useMemo(() => {
    if (!standings?.targets.chasing) return 0;
    return standings.targets.chasing.xp_gap;
  }, [standings]);

  return {
    // State
    league,
    standings,
    isLoading,
    error,
    
    // Computed
    userRank: standings?.user_rank || 0,
    zone: standings?.zone || 'safe',
    timeRemaining,
    xpToNextRank,
    xpLead,
    
    // Season end
    seasonEndResult,
    showSeasonEnd,
    dismissSeasonEnd,
    
    // Actions
    refreshStandings,
    addXp,
    
    // All leagues
    allLeagues: DEFAULT_LEAGUES,
  };
}

export default useLeague;

