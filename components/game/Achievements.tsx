"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Star,
  Shield,
  Zap,
  Target,
  TrendingUp,
  Coins,
  Award,
  Lock,
  CheckCircle,
} from "lucide-react";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
  category: "trading" | "learning" | "exploration" | "mastery";
  rarity: "common" | "rare" | "epic" | "legendary";
}

export const defaultAchievements: Achievement[] = [
  // Trading Achievements
  {
    id: "first_trade",
    name: "First Steps",
    description: "Complete your first trade",
    icon: "👶",
    xpReward: 50,
    unlocked: false,
    category: "trading",
    rarity: "common",
  },
  {
    id: "diversified",
    name: "Diversifier",
    description: "Hold 3+ different assets at once",
    icon: "🎯",
    xpReward: 100,
    unlocked: false,
    category: "trading",
    rarity: "common",
  },
  {
    id: "profit_100",
    name: "Green Day",
    description: "Make a profitable trade of $100+",
    icon: "💚",
    xpReward: 150,
    unlocked: false,
    category: "trading",
    rarity: "rare",
  },
  {
    id: "profit_streak_3",
    name: "Hot Streak",
    description: "3 profitable trades in a row",
    icon: "🔥",
    xpReward: 200,
    unlocked: false,
    category: "trading",
    rarity: "rare",
  },
  {
    id: "diamond_hands",
    name: "Diamond Hands",
    description: "Hold an asset through a 20% drop",
    icon: "💎",
    xpReward: 300,
    unlocked: false,
    category: "trading",
    rarity: "epic",
  },

  // Learning Achievements
  {
    id: "first_mission",
    name: "Time Traveler",
    description: "Complete your first historical mission",
    icon: "⏰",
    xpReward: 75,
    unlocked: false,
    category: "learning",
    rarity: "common",
  },
  {
    id: "survivor_1990",
    name: "Bubble Survivor",
    description: "Navigate the 1990 Japan bubble",
    icon: "🛡️",
    xpReward: 150,
    unlocked: false,
    category: "learning",
    rarity: "rare",
  },
  {
    id: "crisis_master",
    name: "Crisis Master",
    description: "Complete the 2008 Financial Crisis",
    icon: "🏆",
    xpReward: 250,
    unlocked: false,
    category: "learning",
    rarity: "epic",
  },
  {
    id: "all_missions",
    name: "History Master",
    description: "Complete all historical missions",
    icon: "📚",
    xpReward: 500,
    unlocked: false,
    category: "learning",
    rarity: "legendary",
  },

  // Exploration Achievements
  {
    id: "curious_mind",
    name: "Curious Mind",
    description: "Ask your coach 10 questions",
    icon: "🤔",
    xpReward: 100,
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    category: "exploration",
    rarity: "common",
  },
  {
    id: "all_coaches",
    name: "Team Player",
    description: "Try all 4 different coaches",
    icon: "👥",
    xpReward: 150,
    unlocked: false,
    progress: 0,
    maxProgress: 4,
    category: "exploration",
    rarity: "rare",
  },
  {
    id: "night_owl",
    name: "Night Owl",
    description: "Trade after midnight",
    icon: "🦉",
    xpReward: 75,
    unlocked: false,
    category: "exploration",
    rarity: "common",
  },

  // Mastery Achievements
  {
    id: "level_5",
    name: "Rising Star",
    description: "Reach Level 5",
    icon: "⭐",
    xpReward: 200,
    unlocked: false,
    category: "mastery",
    rarity: "rare",
  },
  {
    id: "level_10",
    name: "Investment Pro",
    description: "Reach Level 10",
    icon: "🌟",
    xpReward: 500,
    unlocked: false,
    category: "mastery",
    rarity: "legendary",
  },
  {
    id: "xp_1000",
    name: "XP Hunter",
    description: "Earn 1000 total XP",
    icon: "💰",
    xpReward: 100,
    unlocked: false,
    category: "mastery",
    rarity: "rare",
  },
];

const rarityColors = {
  common: "from-gray-400 to-gray-600",
  rare: "from-blue-400 to-indigo-600",
  epic: "from-purple-400 to-pink-600",
  legendary: "from-yellow-400 to-orange-600",
};

const rarityBorders = {
  common: "border-gray-300",
  rare: "border-blue-400",
  epic: "border-purple-400",
  legendary: "border-yellow-400 shadow-lg shadow-yellow-400/20",
};

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

export function AchievementBadge({
  achievement,
  size = "md",
  onClick,
}: AchievementBadgeProps) {
  const sizes = {
    sm: "w-12 h-12 text-xl",
    md: "w-16 h-16 text-2xl",
    lg: "w-24 h-24 text-4xl",
  };

  return (
    <motion.button
      onClick={onClick}
      className={`relative rounded-full border-2 flex items-center justify-center transition-all ${
        sizes[size]
      } ${
        achievement.unlocked
          ? `bg-gradient-to-br ${rarityColors[achievement.rarity]} ${
              rarityBorders[achievement.rarity]
            }`
          : "bg-muted border-muted-foreground/30"
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {achievement.unlocked ? (
        <span>{achievement.icon}</span>
      ) : (
        <Lock className="h-1/2 w-1/2 text-muted-foreground" />
      )}

      {/* Progress indicator for progressive achievements */}
      {!achievement.unlocked &&
        achievement.progress !== undefined &&
        achievement.maxProgress && (
          <svg
            className="absolute inset-0 -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-muted-foreground/20"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeDasharray={`${
                (achievement.progress / achievement.maxProgress) * 283
              } 283`}
              className="text-primary"
            />
          </svg>
        )}
    </motion.button>
  );
}

interface AchievementUnlockPopupProps {
  achievement: Achievement | null;
  show: boolean;
  onClose: () => void;
}

export function AchievementUnlockPopup({
  achievement,
  show,
  onClose,
}: AchievementUnlockPopupProps) {
  if (!achievement) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", damping: 15 }}
            className={`bg-gradient-to-br ${rarityColors[achievement.rarity]} p-1 rounded-3xl shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-card rounded-3xl p-8 text-center min-w-[300px]">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ repeat: 2, duration: 0.5 }}
                className="text-6xl mb-4"
              >
                {achievement.icon}
              </motion.div>

              <Badge
                className={`mb-2 bg-gradient-to-r ${rarityColors[achievement.rarity]} text-white border-0`}
              >
                {achievement.rarity.toUpperCase()}
              </Badge>

              <h2 className="text-2xl font-bold mt-2">{achievement.name}</h2>
              <p className="text-muted-foreground mt-1">
                {achievement.description}
              </p>

              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600">
                <Zap className="h-5 w-5" />
                <span className="font-bold">+{achievement.xpReward} XP</span>
              </div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={onClose}
                className="mt-6 w-full px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
              >
                Awesome!
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface AchievementsGridProps {
  achievements: Achievement[];
  onAchievementClick?: (achievement: Achievement) => void;
}

export function AchievementsGrid({
  achievements,
  onAchievementClick,
}: AchievementsGridProps) {
  const categories = ["trading", "learning", "exploration", "mastery"] as const;
  const categoryLabels = {
    trading: "Trading",
    learning: "Learning",
    exploration: "Exploration",
    mastery: "Mastery",
  };
  const categoryIcons = {
    trading: TrendingUp,
    learning: Trophy,
    exploration: Target,
    mastery: Award,
  };

  return (
    <div className="space-y-6">
      {categories.map((category) => {
        const categoryAchievements = achievements.filter(
          (a) => a.category === category
        );
        const unlockedCount = categoryAchievements.filter(
          (a) => a.unlocked
        ).length;
        const Icon = categoryIcons[category];

        return (
          <div key={category}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">{categoryLabels[category]}</h3>
              </div>
              <span className="text-sm text-muted-foreground">
                {unlockedCount}/{categoryAchievements.length}
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              {categoryAchievements.map((achievement) => (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                  size="md"
                  onClick={() => onAchievementClick?.(achievement)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

