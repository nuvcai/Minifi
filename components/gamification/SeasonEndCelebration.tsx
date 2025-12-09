'use client';

/**
 * SeasonEndCelebration - Epic season end modal with confetti and rewards
 * 
 * Shows when a league season ends, displaying:
 * - Final rank and outcome (promoted/relegated/stayed)
 * - Rewards earned
 * - New league placement
 * - Confetti animation for promotions
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Crown,
  TrendingUp,
  TrendingDown,
  Shield,
  Star,
  Sparkles,
  Trophy,
  Gift,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { LEAGUES, type League } from './LeagueSystem';

// Minimal league interface for season end result (compatible with both UI and API types)
interface MinimalLeague {
  id: string;
  name: string;
  tier: number;
  emoji: string;
}

// =============================================================================
// CONFETTI COMPONENT
// =============================================================================

function Confetti({ count = 50 }: { count?: number }) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    delay: number;
    duration: number;
    color: string;
    size: number;
  }>>([]);

  useEffect(() => {
    const colors = ['#FFD700', '#FFA500', '#FF6347', '#00CED1', '#9370DB', '#32CD32'];
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 8 + Math.random() * 8,
    }));
    setParticles(newParticles);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-fall"
          style={{
            left: `${p.x}%`,
            top: '-20px',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear forwards;
        }
      `}</style>
    </div>
  );
}

// =============================================================================
// TYPES
// =============================================================================

export interface SeasonEndResult {
  previousLeague: MinimalLeague;
  newLeague: MinimalLeague;
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

interface SeasonEndCelebrationProps {
  open: boolean;
  onClose: () => void;
  result: SeasonEndResult | null;
  onContinue?: () => void;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function SeasonEndCelebration({
  open,
  onClose,
  result,
  onContinue,
}: SeasonEndCelebrationProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    if (open && result?.promoted) {
      setShowConfetti(true);
      // Staggered animation
      const timers = [
        setTimeout(() => setAnimationStep(1), 300),
        setTimeout(() => setAnimationStep(2), 800),
        setTimeout(() => setAnimationStep(3), 1300),
        setTimeout(() => setAnimationStep(4), 1800),
      ];
      return () => timers.forEach(clearTimeout);
    } else if (open) {
      const timers = [
        setTimeout(() => setAnimationStep(1), 200),
        setTimeout(() => setAnimationStep(2), 500),
        setTimeout(() => setAnimationStep(3), 800),
        setTimeout(() => setAnimationStep(4), 1100),
      ];
      return () => timers.forEach(clearTimeout);
    }
    return () => {
      setShowConfetti(false);
      setAnimationStep(0);
    };
  }, [open, result]);

  if (!result) return null;

  const { previousLeague, newLeague, finalRank, promoted, relegated, stayed, rewards, seasonId } = result;

  const outcomeConfig = {
    promoted: {
      icon: TrendingUp,
      title: '🎉 PROMOTED!',
      subtitle: `You've advanced to ${newLeague.name}!`,
      bgGradient: 'from-emerald-600/90 via-emerald-500/80 to-teal-500/90',
      borderColor: 'border-emerald-400',
      textColor: 'text-emerald-300',
      glowColor: 'shadow-emerald-500/50',
    },
    relegated: {
      icon: TrendingDown,
      title: '😔 Season Complete',
      subtitle: `You've moved to ${newLeague.name}`,
      bgGradient: 'from-slate-700/90 via-slate-600/80 to-slate-700/90',
      borderColor: 'border-slate-500',
      textColor: 'text-slate-300',
      glowColor: 'shadow-slate-500/30',
    },
    stayed: {
      icon: Shield,
      title: '✅ Position Secured',
      subtitle: `You've maintained your place in ${newLeague.name}`,
      bgGradient: 'from-blue-600/90 via-indigo-500/80 to-blue-600/90',
      borderColor: 'border-blue-400',
      textColor: 'text-blue-300',
      glowColor: 'shadow-blue-500/40',
    },
  };

  const outcome = promoted ? 'promoted' : relegated ? 'relegated' : 'stayed';
  const config = outcomeConfig[outcome];
  const OutcomeIcon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={`max-w-md border-2 ${config.borderColor} bg-gradient-to-br ${config.bgGradient} shadow-2xl ${config.glowColor} overflow-hidden`}>
        {showConfetti && <Confetti count={100} />}
        
        <DialogHeader className="text-center relative z-10">
          <div 
            className={`transition-all duration-500 ${animationStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
          >
            <div className="flex justify-center mb-4">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm border-2 ${config.borderColor}`}>
                <OutcomeIcon className={`h-10 w-10 ${config.textColor}`} />
              </div>
            </div>
            <DialogTitle className="text-3xl font-black text-white">
              {config.title}
            </DialogTitle>
            <DialogDescription className={`text-lg ${config.textColor} mt-2`}>
              {config.subtitle}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-4 relative z-10">
          {/* Final Rank */}
          <div 
            className={`p-4 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 transition-all duration-500 ${animationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <p className="text-xs text-white/60 uppercase tracking-wider">Final Rank</p>
                <p className="text-4xl font-black text-white">#{finalRank}</p>
                <p className="text-xs text-white/40">in {previousLeague.name}</p>
              </div>
              <ChevronRight className="h-8 w-8 text-white/30" />
              <div className="text-center flex-1">
                <p className="text-xs text-white/60 uppercase tracking-wider">New League</p>
                <p className="text-4xl">{newLeague.emoji}</p>
                <p className="text-sm font-medium text-white">{newLeague.name}</p>
              </div>
            </div>
          </div>

          {/* Rewards Section */}
          <div 
            className={`p-4 rounded-xl bg-amber-500/20 backdrop-blur-sm border border-amber-400/30 transition-all duration-500 ${animationStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Gift className="h-5 w-5 text-amber-400" />
              <h4 className="font-semibold text-white">Season Rewards</h4>
            </div>
            
            <div className="space-y-2">
              {/* XP Bonus */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-black/20">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-white/80">🪙 iii Bonus</span>
                </div>
                <Badge className="bg-yellow-500/30 text-yellow-300 border-yellow-500/50">
                  +{rewards.xpBonus} XP
                </Badge>
              </div>

              {/* Badges */}
              {rewards.badges.length > 0 && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-black/20">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-amber-400" />
                    <span className="text-sm text-white/80">Badges Earned</span>
                  </div>
                  <div className="flex gap-1">
                    {rewards.badges.map((badge, i) => (
                      <Badge key={i} className="bg-amber-500/30 text-amber-300 border-amber-500/50 text-xs">
                        🏅 {badge.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Reward */}
              {rewards.special && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/30">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-300 animate-pulse" />
                    <span className="text-sm text-white/80">Special Reward</span>
                  </div>
                  <Badge className="bg-purple-500/30 text-purple-200 border-purple-400/50">
                    ✨ {rewards.special.replace('_', ' ')}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* League Journey */}
          <div 
            className={`flex items-center justify-center gap-2 transition-all duration-500 ${animationStep >= 4 ? 'opacity-100' : 'opacity-0'}`}
          >
            {LEAGUES.map((league, i) => {
              const isCurrent = league.id === newLeague.id;
              const isPrevious = league.id === previousLeague.id;
              const isCompleted = league.tier < newLeague.tier;
              
              return (
                <div key={league.id} className="flex items-center">
                  <div 
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center transition-all
                      ${isCurrent 
                        ? 'bg-white text-xl ring-2 ring-white ring-offset-2 ring-offset-transparent scale-125' 
                        : isCompleted 
                          ? 'bg-white/30 text-sm' 
                          : 'bg-white/10 text-sm opacity-50'}
                    `}
                  >
                    {league.emoji}
                  </div>
                  {i < LEAGUES.length - 1 && (
                    <div className={`w-4 h-0.5 ${isCompleted ? 'bg-white/50' : 'bg-white/10'}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div 
            className={`flex gap-3 pt-2 transition-all duration-500 ${animationStep >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-white/30 text-white hover:bg-white/10"
            >
              View Standings
            </Button>
            <Button
              onClick={() => {
                onContinue?.();
                onClose();
              }}
              className="flex-1 bg-white text-slate-900 hover:bg-white/90 font-bold"
            >
              <Flame className="h-4 w-4 mr-2" />
              Start New Season
            </Button>
          </div>

          {/* Motivation */}
          <p className="text-center text-xs text-white/50 pt-2">
            Season {seasonId} • New season starts Monday
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SeasonEndCelebration;

