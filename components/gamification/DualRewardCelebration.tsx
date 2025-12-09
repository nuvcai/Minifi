/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   🎉 DUAL REWARD CELEBRATION - Badge + III Tokens Display                   ║
 * ║   Shows both rewards when a player earns an achievement (like KEEP app)     ║
 * ║   ✨ MiniFi / Legacy Guardians ✨                                           ║
 * ║   Copyright (c) 2025 NUVC.AI / Tick.AI. All Rights Reserved.                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Trophy,
  Coins,
  Crown,
  Star,
  Gift,
  ChevronRight,
  X,
} from "lucide-react";
import {
  DualRewardBadge,
  TIER_CONFIG,
  CATEGORY_INFO,
  calculateBadgeIIIReward,
  type RewardCategory,
  type BadgeTier,
} from "./dualRewards";

// III Config
const III_CONFIG = {
  symbol: 'iii',
  emoji: '✦',
};

interface DualRewardCelebrationProps {
  badge: DualRewardBadge;
  onClose: () => void;
  onClaimReward?: () => void;
}

export function DualRewardCelebration({
  badge,
  onClose,
  onClaimReward,
}: DualRewardCelebrationProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const tierConfig = TIER_CONFIG[badge.tier];
  const categoryInfo = CATEGORY_INFO[badge.category];
  const iiiReward = calculateBadgeIIIReward(badge);

  // Confetti particles
  const confettiColors = ['#fbbf24', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
  
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Confetti */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -20,
                  rotate: 0,
                  scale: Math.random() * 0.5 + 0.5,
                }}
                animate={{
                  y: window.innerHeight + 20,
                  rotate: Math.random() * 720 - 360,
                }}
                transition={{
                  duration: Math.random() * 2 + 2,
                  delay: Math.random() * 0.5,
                  ease: "linear",
                }}
                className="absolute w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: confettiColors[i % confettiColors.length],
                }}
              />
            ))}
          </div>
        )}

        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md"
        >
          <Card className="overflow-hidden border-2 border-yellow-400/50 shadow-2xl shadow-yellow-500/20">
            {/* Header - Gradient based on tier */}
            <div className={`relative p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden`}>
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
              
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="h-4 w-4 text-white/70" />
              </button>
              
              <div className="relative text-center">
                {/* Category badge */}
                <Badge className={`mb-3 ${categoryInfo.color} bg-white/10 border-white/20`}>
                  {categoryInfo.emoji} {categoryInfo.name}
                </Badge>
                
                {/* Title */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="flex items-center justify-center gap-2 mb-2"
                >
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  <h2 className="text-xl font-bold text-yellow-400">Achievement Unlocked!</h2>
                  <Trophy className="h-5 w-5 text-yellow-400" />
                </motion.div>
                
                <p className="text-white/60 text-sm">You earned a new reward!</p>
              </div>
            </div>

            <CardContent className="p-6 bg-gradient-to-b from-slate-50 to-white space-y-6">
              {/* Badge Display */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", damping: 15 }}
                className="text-center"
              >
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-2xl ${tierConfig.bgColor} border-4 ${tierConfig.borderColor} shadow-lg ${tierConfig.glowColor}`}>
                  <span className="text-5xl">{badge.emoji}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-4">{badge.name}</h3>
                <p className="text-slate-600 text-sm mt-1">{badge.description}</p>
                
                {/* Tier badge */}
                <Badge className={`mt-3 ${tierConfig.bgColor} ${tierConfig.color} border ${tierConfig.borderColor} font-bold`}>
                  {badge.tier.toUpperCase()} TIER
                </Badge>
              </motion.div>

              {/* Dual Rewards Section */}
              <div className="grid grid-cols-2 gap-4">
                {/* Badge Reward */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className={`p-4 rounded-xl ${tierConfig.bgColor} border ${tierConfig.borderColor} text-center`}
                >
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star className={`h-4 w-4 ${tierConfig.color}`} />
                    <span className={`text-xs font-semibold ${tierConfig.color}`}>BADGE</span>
                  </div>
                  <div className="text-3xl mb-1">{badge.emoji}</div>
                  <p className={`text-xs font-medium ${tierConfig.color}`}>Collected!</p>
                </motion.div>

                {/* III Token Reward */}
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 text-center"
                >
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Coins className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-semibold text-emerald-600">III TOKENS</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-2xl font-black text-emerald-600">+{iiiReward}</span>
                    <span className="text-lg text-emerald-500">{III_CONFIG.emoji}</span>
                  </div>
                  <p className="text-xs text-emerald-600 font-medium">Earned!</p>
                </motion.div>
              </div>

              {/* Wisdom Unlocked (if any) */}
              {badge.wisdomUnlocked && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-100">
                      <Sparkles className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-amber-700 mb-1">💡 Wisdom Unlocked</p>
                      <p className="text-sm text-amber-800">{badge.wisdomUnlocked}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* FO Wisdom (if any) */}
              {badge.foWisdom && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-purple-100">
                      <Crown className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-purple-700 mb-1">🏛️ Family Office Wisdom</p>
                      <p className="text-sm text-purple-800">{badge.foWisdom}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Celebration Message */}
              {badge.celebrationMessage && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="text-center text-slate-600 italic"
                >
                  "{badge.celebrationMessage}"
                </motion.p>
              )}

              {/* Claim Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <Button
                  onClick={() => {
                    onClaimReward?.();
                    onClose();
                  }}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-6"
                >
                  <Gift className="h-5 w-5 mr-2" />
                  Claim Badge + {iiiReward} {III_CONFIG.emoji}
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// =============================================================================
// MINI DUAL REWARD NOTIFICATION (for inline display)
// =============================================================================

interface MiniDualRewardProps {
  badge: DualRewardBadge;
  showFull?: boolean;
  onViewDetails?: () => void;
}

export function MiniDualReward({ badge, showFull = false, onViewDetails }: MiniDualRewardProps) {
  const tierConfig = TIER_CONFIG[badge.tier];
  const iiiReward = calculateBadgeIIIReward(badge);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex items-center gap-3 p-3 rounded-xl ${tierConfig.bgColor} border ${tierConfig.borderColor} cursor-pointer hover:shadow-md transition-shadow`}
      onClick={onViewDetails}
    >
      {/* Badge */}
      <div className="text-2xl">{badge.emoji}</div>
      
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm ${tierConfig.color} truncate`}>{badge.name}</p>
        {showFull && (
          <p className="text-xs text-slate-500 truncate">{badge.description}</p>
        )}
      </div>

      {/* Dual rewards */}
      <div className="flex items-center gap-2">
        <Badge className={`${tierConfig.bgColor} ${tierConfig.color} border-0 text-[10px]`}>
          {badge.tier.toUpperCase()}
        </Badge>
        <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">
          +{iiiReward} {III_CONFIG.emoji}
        </Badge>
      </div>
    </motion.div>
  );
}

// =============================================================================
// BADGE COLLECTION DISPLAY
// =============================================================================

interface BadgeCollectionProps {
  earnedBadgeIds: string[];
  badges: DualRewardBadge[];
  category?: RewardCategory;
  onBadgeClick?: (badge: DualRewardBadge) => void;
}

export function BadgeCollection({
  earnedBadgeIds,
  badges,
  category,
  onBadgeClick,
}: BadgeCollectionProps) {
  const filteredBadges = category ? badges.filter(b => b.category === category) : badges;
  const categoryInfo = category ? CATEGORY_INFO[category] : null;

  return (
    <div className="space-y-4">
      {categoryInfo && (
        <div className="flex items-center gap-2">
          <span className="text-xl">{categoryInfo.emoji}</span>
          <h3 className={`font-bold ${categoryInfo.color}`}>{categoryInfo.name}</h3>
          <Badge className="bg-slate-100 text-slate-600 text-xs">
            {earnedBadgeIds.filter(id => filteredBadges.some(b => b.id === id)).length}/{filteredBadges.length}
          </Badge>
        </div>
      )}

      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
        {filteredBadges.map((badge) => {
          const isEarned = earnedBadgeIds.includes(badge.id);
          const tierConfig = TIER_CONFIG[badge.tier];
          const iiiReward = calculateBadgeIIIReward(badge);

          return (
            <button
              key={badge.id}
              onClick={() => onBadgeClick?.(badge)}
              className={`relative p-3 rounded-xl border-2 transition-all ${
                isEarned
                  ? `${tierConfig.bgColor} ${tierConfig.borderColor} hover:scale-105`
                  : "bg-slate-100 border-slate-200 opacity-40 hover:opacity-60"
              }`}
            >
              <div className={`text-2xl ${isEarned ? "" : "grayscale"}`}>{badge.emoji}</div>
              
              {/* III reward indicator */}
              {isEarned && (
                <div className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-[8px] text-white font-bold">
                  +{iiiReward}
                </div>
              )}
              
              {/* Lock indicator */}
              {!isEarned && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-slate-300/80 flex items-center justify-center">
                    <span className="text-[10px]">🔒</span>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default DualRewardCelebration;


