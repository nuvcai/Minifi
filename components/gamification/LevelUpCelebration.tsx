/**
 * LevelUpCelebration - Confetti celebration modal for level ups
 * 
 * Shows an exciting celebration when players level up with:
 * - Confetti animation
 * - Level badge reveal
 * - New title announcement
 * - Rewards preview
 */

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Trophy,
  Star,
  Sparkles,
  Zap,
  Crown,
  Rocket,
  Target,
  Award,
} from "lucide-react";

// Level titles and their icons
const levelTitles: Record<number, { title: string; icon: React.ReactNode; color: string }> = {
  1: { title: "Rookie Investor", icon: <Target className="h-6 w-6" />, color: "from-slate-400 to-slate-500" },
  2: { title: "Market Explorer", icon: <Sparkles className="h-6 w-6" />, color: "from-emerald-400 to-teal-500" },
  3: { title: "Rising Trader", icon: <Zap className="h-6 w-6" />, color: "from-blue-400 to-cyan-500" },
  4: { title: "Smart Investor", icon: <Star className="h-6 w-6" />, color: "from-purple-400 to-pink-500" },
  5: { title: "Market Mover", icon: <Trophy className="h-6 w-6" />, color: "from-amber-400 to-orange-500" },
  6: { title: "Wall Street Wolf", icon: <Rocket className="h-6 w-6" />, color: "from-red-400 to-rose-500" },
  7: { title: "Financial Guru", icon: <Award className="h-6 w-6" />, color: "from-indigo-400 to-violet-500" },
  8: { title: "Investment Legend", icon: <Crown className="h-6 w-6" />, color: "from-yellow-400 to-amber-500" },
};

// Level unlock rewards
const levelRewards: Record<number, string[]> = {
  2: ["New coach advice unlocked!", "Bonus 🪙 multiplier: 1.1x"],
  3: ["Competition Mode early access!", "Exclusive badge: Early Bird"],
  4: ["Advanced market insights!", "Bonus 🪙 multiplier: 1.2x"],
  5: ["Premium rewards unlocked!", "Exclusive badge: Market Mover"],
  6: ["Expert challenges available!", "Bonus 🪙 multiplier: 1.3x"],
  7: ["Master tier rewards!", "Exclusive badge: Financial Guru"],
  8: ["Legend status achieved!", "All features unlocked!"],
};

interface LevelUpCelebrationProps {
  open: boolean;
  newLevel: number;
  previousLevel: number;
  onClose: () => void;
}

// Confetti particle colors (static for Tailwind compatibility)
const CONFETTI_COLORS = [
  "bg-emerald-500",
  "bg-teal-500",
  "bg-amber-500",
  "bg-pink-500",
  "bg-purple-500",
  "bg-blue-500",
  "bg-red-500",
  "bg-yellow-500",
];

// Confetti particle component with pre-computed values for stability
interface ConfettiParticleProps {
  delay: number;
  left: number;
  colorIndex: number;
  size: number;
  rotation: number;
}

function ConfettiParticle({ delay, left, colorIndex, size, rotation }: ConfettiParticleProps) {
  const color = CONFETTI_COLORS[colorIndex % CONFETTI_COLORS.length];

  return (
    <div
      className={`absolute ${color} rounded-sm opacity-90`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        top: "-20px",
        transform: `rotate(${rotation}deg)`,
        animation: `confetti-fall 3s ease-out ${delay}s forwards`,
      }}
    />
  );
}

export function LevelUpCelebration({
  open,
  newLevel,
  previousLevel,
  onClose,
}: LevelUpCelebrationProps) {
  const [showContent, setShowContent] = useState(false);

  const levelInfo = levelTitles[newLevel] || levelTitles[8];
  const rewards = levelRewards[newLevel] || [];

  // Pre-compute confetti particles once using useMemo (stable random values)
  const confettiParticles = useMemo(() => {
    // Use a seeded approach for consistent particles
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      delay: (i * 0.01) % 0.5, // Distributed delays
      left: (i * 2.1) % 100, // Distributed positions
      colorIndex: i,
      size: 8 + (i % 8), // Sizes 8-15
      rotation: (i * 7.2) % 360, // Distributed rotations
    }));
  }, []);

  useEffect(() => {
    if (open) {
      // Delay showing content for dramatic effect
      const timer = setTimeout(() => setShowContent(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-amber-500/50">
        {/* Confetti Container */}
        {open && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {confettiParticles.map((particle) => (
              <ConfettiParticle
                key={particle.id}
                delay={particle.delay}
                left={particle.left}
                colorIndex={particle.colorIndex}
                size={particle.size}
                rotation={particle.rotation}
              />
            ))}
          </div>
        )}

        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 via-transparent to-transparent pointer-events-none" />

        <DialogHeader className="relative z-10">
          <DialogTitle className="text-center">
            <div
              className={`
                transform transition-all duration-700
                ${showContent ? "scale-100 opacity-100" : "scale-50 opacity-0"}
              `}
            >
              {/* Level Up Text */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-amber-400 animate-pulse" />
                <span className="text-2xl font-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 bg-clip-text text-transparent">
                  LEVEL UP!
                </span>
                <Sparkles className="h-6 w-6 text-amber-400 animate-pulse" />
              </div>

              {/* Level Badge */}
              <div className="relative mx-auto w-24 h-24 mb-4">
                <div className={`absolute inset-0 bg-gradient-to-br ${levelInfo.color} rounded-full animate-pulse opacity-50`} />
                <div className={`absolute inset-2 bg-gradient-to-br ${levelInfo.color} rounded-full flex items-center justify-center shadow-lg`}>
                  <span className="text-3xl font-black text-white">{newLevel}</span>
                </div>
                {/* Orbiting stars */}
                <div className="absolute inset-0 animate-spin-slow">
                  <Star className="absolute -top-2 left-1/2 -translate-x-1/2 h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <Star className="absolute top-1/2 -right-2 -translate-y-1/2 h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <Star className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <Star className="absolute top-1/2 -left-2 -translate-y-1/2 h-4 w-4 text-yellow-400 fill-yellow-400" />
                </div>
              </div>

              {/* New Title */}
              <div className="flex items-center justify-center gap-2 text-slate-100">
                {levelInfo.icon}
                <span className="text-xl font-bold">{levelInfo.title}</span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div
          className={`
            relative z-10 space-y-4 mt-4
            transform transition-all duration-700 delay-300
            ${showContent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
          `}
        >
          {/* Level Progress */}
          <div className="text-center text-slate-400 text-sm">
            <span className="text-slate-500">Level {previousLevel}</span>
            <span className="mx-2">→</span>
            <span className="text-emerald-400 font-bold">Level {newLevel}</span>
          </div>

          {/* Rewards */}
          {rewards.length > 0 && (
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
              <h4 className="text-sm font-semibold text-amber-400 mb-2 flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                New Rewards Unlocked!
              </h4>
              <ul className="space-y-2">
                {rewards.map((reward, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-sm text-slate-300"
                  >
                    <Zap className="h-3 w-3 text-emerald-400" />
                    {reward}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Next Level Preview */}
          {newLevel < 8 && levelTitles[newLevel + 1] && (
            <div className="text-center text-xs text-slate-500">
              Next: <span className="text-slate-400">{levelTitles[newLevel + 1].title}</span>
              <span className="text-slate-600"> (1000 🪙 iii)</span>
            </div>
          )}

          {/* Continue Button */}
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold"
          >
            <Rocket className="h-4 w-4 mr-2" />
            Let's Keep Going! 🚀
          </Button>
        </div>

        {/* CSS for confetti animation */}
        <style jsx global>{`
          @keyframes confetti-fall {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(400px) rotate(720deg);
              opacity: 0;
            }
          }
          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}

// Export level titles for use elsewhere
export { levelTitles };

export default LevelUpCelebration;

