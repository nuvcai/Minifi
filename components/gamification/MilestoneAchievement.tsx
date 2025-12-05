/**
 * MilestoneAchievement - Celebration modal for learning milestones
 * 
 * Celebrates when players reach learning milestones through effort.
 * Emphasizes the educational journey over financial outcomes.
 */

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Target,
  Sparkles,
  BookOpen,
  Brain,
  Compass,
  Users,
  Star,
  Zap,
  TrendingUp,
  Award,
} from "lucide-react";
import { LearningMilestone, CourageReward } from "./effortRewards";

interface MilestoneAchievementProps {
  open: boolean;
  milestone?: LearningMilestone;
  courageReward?: CourageReward;
  onClose: () => void;
  onXpClaimed?: (xp: number) => void;
}

// Confetti colors for celebration
const CONFETTI_COLORS = [
  "bg-amber-400",
  "bg-emerald-400",
  "bg-violet-400",
  "bg-pink-400",
  "bg-cyan-400",
  "bg-orange-400",
];

// Milestone type icons and colors
const milestoneTypeConfig: Record<string, { icon: React.ReactNode; color: string; bgColor: string }> = {
  missions_attempted: {
    icon: <Target className="h-8 w-8" />,
    color: "text-indigo-600",
    bgColor: "from-indigo-400 to-violet-500",
  },
  assets_explored: {
    icon: <Compass className="h-8 w-8" />,
    color: "text-emerald-600",
    bgColor: "from-emerald-400 to-teal-500",
  },
  risks_taken: {
    icon: <Zap className="h-8 w-8" />,
    color: "text-amber-600",
    bgColor: "from-amber-400 to-orange-500",
  },
  coaches_consulted: {
    icon: <Users className="h-8 w-8" />,
    color: "text-purple-600",
    bgColor: "from-purple-400 to-pink-500",
  },
};

// Educational messages based on milestone type
const educationalMessages: Record<string, string[]> = {
  missions_attempted: [
    "The more you practice, the better you get! Each investment decision builds your intuition.",
    "Experience is the best teacher. You're building real investing instincts!",
    "Every mission teaches something new. Your financial education is compounding!",
  ],
  assets_explored: [
    "Diversification is key! Knowing different asset classes makes you a smarter investor.",
    "Family offices invest across many asset classes - you're learning like the pros!",
    "Understanding different assets helps you build a balanced portfolio.",
  ],
  risks_taken: [
    "Taking calculated risks is how great investors learn. Courage beats comfort!",
    "Warren Buffett says 'Risk comes from not knowing what you're doing.' Now you know more!",
    "Bold moves teach bold lessons. You're building risk management skills!",
  ],
  coaches_consulted: [
    "Different perspectives make better decisions. Smart investors seek diverse advice!",
    "Family offices always consult multiple experts. You're thinking like them!",
    "Learning from different coaches expands your investment philosophy.",
  ],
};

function ConfettiParticle({ delay, left, color, size, rotation }: {
  delay: number;
  left: number;
  color: string;
  size: number;
  rotation: number;
}) {
  return (
    <div
      className={`absolute ${color} rounded-full opacity-90`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        top: "-20px",
        transform: `rotate(${rotation}deg)`,
        animation: `milestone-confetti-fall 2.5s ease-out ${delay}s forwards`,
      }}
    />
  );
}

export function MilestoneAchievement({
  open,
  milestone,
  courageReward,
  onClose,
  onXpClaimed,
}: MilestoneAchievementProps) {
  const [showContent, setShowContent] = useState(false);
  const [xpClaimed, setXpClaimed] = useState(false);

  // Pre-compute confetti particles
  const confettiParticles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      delay: (i * 0.03) % 0.5,
      left: (i * 3.3) % 100,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 6 + (i % 5),
      rotation: (i * 12) % 360,
    }));
  }, []);

  // Animation timing
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setShowContent(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
      setXpClaimed(false);
    }
  }, [open]);

  if (!milestone && !courageReward) return null;

  const displayItem = milestone || courageReward;
  const isMilestone = !!milestone;
  const config = isMilestone 
    ? milestoneTypeConfig[milestone!.type] || milestoneTypeConfig.missions_attempted
    : { icon: <Star className="h-8 w-8" />, color: "text-amber-600", bgColor: "from-amber-400 to-orange-500" };
  
  const messages = isMilestone 
    ? educationalMessages[milestone!.type] || educationalMessages.missions_attempted
    : ["Every action earns rewards! You're building confidence with every decision."];
  
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  const xpAmount = isMilestone ? milestone!.xpReward : courageReward!.xpReward;

  const handleClaimXp = () => {
    setXpClaimed(true);
    if (onXpClaimed) {
      onXpClaimed(xpAmount);
    }
    setTimeout(onClose, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-amber-500/30">
        {/* Confetti */}
        {open && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {confettiParticles.map((particle) => (
              <ConfettiParticle key={particle.id} {...particle} />
            ))}
          </div>
        )}

        {/* Glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-t ${config.bgColor} opacity-10 pointer-events-none`} />

        <DialogHeader className="relative z-10">
          <DialogTitle className="text-center">
            <div
              className={`transform transition-all duration-700 ${
                showContent ? "scale-100 opacity-100" : "scale-50 opacity-0"
              }`}
            >
              {/* Achievement header */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-amber-400 animate-pulse" />
                <span className="text-xl font-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 bg-clip-text text-transparent">
                  {isMilestone ? "MILESTONE ACHIEVED!" : "COURAGE REWARDED!"}
                </span>
                <Sparkles className="h-6 w-6 text-amber-400 animate-pulse" />
              </div>

              {/* Icon badge */}
              <div className="relative mx-auto w-20 h-20 mb-4">
                <div className={`absolute inset-0 bg-gradient-to-br ${config.bgColor} rounded-2xl blur-lg opacity-50 animate-pulse`} />
                <div className={`absolute inset-0 bg-gradient-to-br ${config.bgColor} rounded-2xl flex items-center justify-center shadow-xl`}>
                  <div className="text-white">
                    {isMilestone ? config.icon : <span className="text-3xl">{courageReward?.emoji}</span>}
                  </div>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-2">
                {isMilestone ? milestone!.name : courageReward!.name}
              </h3>
              <p className="text-sm text-slate-400">
                {isMilestone ? milestone!.description : courageReward!.description}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div
          className={`relative z-10 space-y-4 mt-4 transform transition-all duration-700 delay-300 ${
            showContent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          {/* XP Reward */}
          <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Award className="h-5 w-5 text-amber-400" />
              <span className="text-2xl font-bold text-amber-400">+{xpAmount} 🪙</span>
            </div>
            {isMilestone && (
              <Badge className="bg-amber-500/30 text-amber-300 border-amber-500/50">
                Learning Milestone Bonus
              </Badge>
            )}
          </div>

          {/* Educational message */}
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${config.bgColor} shrink-0`}>
                <Brain className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-300 mb-1">What This Means</p>
                <p className="text-sm text-slate-400 leading-relaxed">{randomMessage}</p>
              </div>
            </div>
          </div>

          {/* Effort acknowledgment */}
          <div className="text-center">
            <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
              <BookOpen className="h-3 w-3" />
              <span>Effort-based reward • Learning is the real win! 🎓</span>
            </p>
          </div>

          {/* Claim button */}
          <Button
            onClick={handleClaimXp}
            disabled={xpClaimed}
            className={`w-full bg-gradient-to-r ${config.bgColor} hover:opacity-90 text-white font-bold py-3 shadow-lg transition-all ${
              xpClaimed ? "opacity-75" : ""
            }`}
          >
            {xpClaimed ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                XP Claimed!
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4 mr-2" />
                Claim +{xpAmount} XP
              </>
            )}
          </Button>
        </div>

        {/* CSS for confetti animation */}
        <style jsx global>{`
          @keyframes milestone-confetti-fall {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(350px) rotate(720deg);
              opacity: 0;
            }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}

export default MilestoneAchievement;

