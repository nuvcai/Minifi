/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   🏆 REWARDS DASHBOARD - Dual Rewards Display (Badges + III Tokens)         ║
 * ║   Complete overview of player achievements and currency                     ║
 * ║   ✨ MiniFi / Legacy Guardians ✨                                           ║
 * ║   Copyright (c) 2025 NUVC.AI / Tick.AI. All Rights Reserved.                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Trophy,
  Coins,
  Star,
  Crown,
  Sparkles,
  TrendingUp,
  Award,
  Target,
  Flame,
  Shield,
  Compass,
  Brain,
  ChevronRight,
  Lock,
  Gift,
  History,
} from "lucide-react";
import {
  ALL_BADGES,
  TIER_CONFIG,
  CATEGORY_INFO,
  type DualRewardBadge,
  type RewardCategory,
  type BadgeTier,
  calculateBadgeIIIReward,
  getBadgeSummary,
} from "./dualRewards";

// III Token Config
const III_CONFIG = {
  symbol: 'iii',
  emoji: '✦',
  name: 'III Tokens',
};

// Category icons mapping
const CATEGORY_ICONS: Record<RewardCategory, React.ReactNode> = {
  crisis_wisdom: <Flame className="h-4 w-4" />,
  effort: <Target className="h-4 w-4" />,
  streak: <Flame className="h-4 w-4" />,
  mastery: <Trophy className="h-4 w-4" />,
  exploration: <Compass className="h-4 w-4" />,
  resilience: <Shield className="h-4 w-4" />,
  generational: <Crown className="h-4 w-4" />,
};

// =============================================================================
// TYPES
// =============================================================================

interface RewardsDashboardProps {
  // III Token data
  totalIII: number;
  weeklyIII: number;
  stakedIII?: number;
  
  // Badge data
  earnedBadgeIds: string[];
  
  // Optional callbacks
  onBadgeClick?: (badge: DualRewardBadge) => void;
  onViewTransactions?: () => void;
  onStakeIII?: () => void;
  
  // Compact mode for sidebar
  compact?: boolean;
  
  // Progress data for checking badge eligibility
  progress?: {
    investmentsMade?: number;
    lossesExperienced?: number;
    missionsCompleted?: number;
    currentStreak?: number;
    assetClassesTried?: number;
    riskLevelsTried?: number;
    coachesUsed?: number;
    reflectionsCompleted?: number;
  };
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function RewardsDashboard({
  totalIII,
  weeklyIII,
  stakedIII = 0,
  earnedBadgeIds,
  onBadgeClick,
  onViewTransactions,
  onStakeIII,
  compact = false,
  progress,
}: RewardsDashboardProps) {
  const [selectedBadge, setSelectedBadge] = useState<DualRewardBadge | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'history'>('overview');

  const summary = getBadgeSummary(earnedBadgeIds);
  const earnedBadges = ALL_BADGES.filter(b => earnedBadgeIds.includes(b.id));
  const lockedBadges = ALL_BADGES.filter(b => !earnedBadgeIds.includes(b.id));

  // Handle badge click
  const handleBadgeClick = useCallback((badge: DualRewardBadge) => {
    setSelectedBadge(badge);
    onBadgeClick?.(badge);
  }, [onBadgeClick]);

  // =========================================================================
  // COMPACT MODE (for sidebar)
  // =========================================================================
  
  if (compact) {
    return (
      <div className="space-y-4">
        {/* III Token Display */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                <Coins className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-white/70">{III_CONFIG.name}</p>
                <p className="text-2xl font-black">{totalIII.toLocaleString()} {III_CONFIG.emoji}</p>
              </div>
            </div>
            {weeklyIII > 0 && (
              <Badge className="bg-white/20 text-white border-0 text-xs">
                +{weeklyIII} this week
              </Badge>
            )}
          </div>
        </div>

        {/* Badge Summary */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              <span className="font-semibold text-slate-700">Badges</span>
            </div>
            <Badge className="bg-amber-100 text-amber-700 border-0">
              {summary.earnedBadges}/{summary.totalBadges}
            </Badge>
          </div>

          {/* Recent badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            {earnedBadges.slice(0, 6).map((badge) => {
              const tierConfig = TIER_CONFIG[badge.tier];
              return (
                <button
                  key={badge.id}
                  onClick={() => handleBadgeClick(badge)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${tierConfig.bgColor} border ${tierConfig.borderColor} hover:scale-110 transition-transform`}
                  title={badge.name}
                >
                  {badge.emoji}
                </button>
              );
            })}
            {earnedBadges.length === 0 && (
              <p className="text-sm text-slate-500 italic">Complete actions to earn badges!</p>
            )}
          </div>

          {/* Next badge to earn */}
          {lockedBadges.length > 0 && (
            <div className="pt-3 border-t border-slate-100">
              <p className="text-xs text-slate-500 mb-1">Next badge:</p>
              <div className="flex items-center gap-2">
                <span className="text-lg opacity-50">{lockedBadges[0].emoji}</span>
                <span className="text-sm text-slate-600">{lockedBadges[0].name}</span>
              </div>
            </div>
          )}
        </div>

        {/* Badge Detail Modal */}
        <BadgeDetailModal
          badge={selectedBadge}
          isEarned={selectedBadge ? earnedBadgeIds.includes(selectedBadge.id) : false}
          onClose={() => setSelectedBadge(null)}
        />
      </div>
    );
  }

  // =========================================================================
  // FULL MODE
  // =========================================================================

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total III */}
        <Card className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white border-0 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
          <CardContent className="p-4 relative">
            <div className="flex items-center gap-2 mb-1">
              <Coins className="h-4 w-4" />
              <span className="text-xs text-white/70">Total {III_CONFIG.name}</span>
            </div>
            <p className="text-3xl font-black">{totalIII.toLocaleString()}</p>
            <p className="text-lg text-white/80">{III_CONFIG.emoji}</p>
          </CardContent>
        </Card>

        {/* Weekly III */}
        <Card className="bg-gradient-to-br from-violet-500 to-purple-600 text-white border-0 overflow-hidden relative">
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full blur-xl" />
          <CardContent className="p-4 relative">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs text-white/70">This Week</span>
            </div>
            <p className="text-3xl font-black">+{weeklyIII.toLocaleString()}</p>
            <p className="text-lg text-white/80">{III_CONFIG.emoji}</p>
          </CardContent>
        </Card>

        {/* Badges Earned */}
        <Card className="bg-gradient-to-br from-amber-400 to-orange-500 text-white border-0 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
          <CardContent className="p-4 relative">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="h-4 w-4" />
              <span className="text-xs text-white/70">Badges Earned</span>
            </div>
            <p className="text-3xl font-black">{summary.earnedBadges}</p>
            <p className="text-sm text-white/80">of {summary.totalBadges}</p>
          </CardContent>
        </Card>

        {/* III from Badges */}
        <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 overflow-hidden relative">
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-xl" />
          <CardContent className="p-4 relative">
            <div className="flex items-center gap-2 mb-1">
              <Gift className="h-4 w-4" />
              <span className="text-xs text-white/70">From Badges</span>
            </div>
            <p className="text-3xl font-black">{summary.totalIIIFromBadges.toLocaleString()}</p>
            <p className="text-lg text-white/80">{III_CONFIG.emoji}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="badges" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            All Badges
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Category Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="h-5 w-5 text-violet-500" />
                Badge Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(Object.keys(CATEGORY_INFO) as RewardCategory[]).map((category) => {
                const info = CATEGORY_INFO[category];
                const stats = summary.byCategory[category] || { earned: 0, total: 0 };
                const progress = stats.total > 0 ? (stats.earned / stats.total) * 100 : 0;

                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{info.emoji}</span>
                        <span className={`font-medium ${info.color}`}>{info.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {stats.earned}/{stats.total}
                      </Badge>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Recent Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {earnedBadges.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {earnedBadges.slice(0, 8).map((badge) => {
                    const tierConfig = TIER_CONFIG[badge.tier];
                    const iiiReward = calculateBadgeIIIReward(badge);

                    return (
                      <button
                        key={badge.id}
                        onClick={() => handleBadgeClick(badge)}
                        className={`p-4 rounded-xl ${tierConfig.bgColor} border-2 ${tierConfig.borderColor} hover:scale-105 transition-all text-center`}
                      >
                        <div className="text-3xl mb-2">{badge.emoji}</div>
                        <p className={`text-sm font-semibold ${tierConfig.color} truncate`}>
                          {badge.name}
                        </p>
                        <Badge className="mt-2 bg-emerald-100 text-emerald-700 border-0 text-[10px]">
                          +{iiiReward} {III_CONFIG.emoji}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No badges earned yet</p>
                  <p className="text-sm text-slate-400">Complete actions to earn your first badge!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Badges Tab */}
        <TabsContent value="badges" className="space-y-6 mt-6">
          {(Object.keys(CATEGORY_INFO) as RewardCategory[]).map((category) => {
            const info = CATEGORY_INFO[category];
            const categoryBadges = ALL_BADGES.filter(b => b.category === category);

            return (
              <Card key={category}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span className="text-xl">{info.emoji}</span>
                    <span className={info.color}>{info.name}</span>
                    <Badge variant="outline" className="ml-auto text-xs">
                      {categoryBadges.filter(b => earnedBadgeIds.includes(b.id)).length}/
                      {categoryBadges.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {categoryBadges.map((badge) => {
                      const isEarned = earnedBadgeIds.includes(badge.id);
                      const tierConfig = TIER_CONFIG[badge.tier];
                      const iiiReward = calculateBadgeIIIReward(badge);

                      return (
                        <button
                          key={badge.id}
                          onClick={() => handleBadgeClick(badge)}
                          className={`relative p-3 rounded-xl border-2 transition-all ${
                            isEarned
                              ? `${tierConfig.bgColor} ${tierConfig.borderColor} hover:scale-105`
                              : "bg-slate-100 border-slate-200 opacity-50 hover:opacity-70"
                          }`}
                        >
                          <div className={`text-2xl ${isEarned ? "" : "grayscale"}`}>
                            {badge.emoji}
                          </div>
                          <p className={`text-[10px] mt-1 font-medium truncate ${
                            isEarned ? tierConfig.color : "text-slate-400"
                          }`}>
                            {badge.name}
                          </p>
                          
                          {/* III reward indicator */}
                          {isEarned && (
                            <div className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-[8px] text-white font-bold">
                              +{iiiReward}
                            </div>
                          )}
                          
                          {/* Lock indicator */}
                          {!isEarned && (
                            <Lock className="absolute top-1 right-1 h-3 w-3 text-slate-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <History className="h-5 w-5 text-blue-500" />
                Reward History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {earnedBadges.length > 0 ? (
                <div className="space-y-3">
                  {earnedBadges.map((badge) => {
                    const tierConfig = TIER_CONFIG[badge.tier];
                    const iiiReward = calculateBadgeIIIReward(badge);

                    return (
                      <div
                        key={badge.id}
                        className={`flex items-center gap-4 p-3 rounded-xl ${tierConfig.bgColor} border ${tierConfig.borderColor}`}
                      >
                        <div className="text-2xl">{badge.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold ${tierConfig.color}`}>{badge.name}</p>
                          <p className="text-xs text-slate-500 truncate">{badge.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${tierConfig.bgColor} ${tierConfig.color} border ${tierConfig.borderColor} text-[10px]`}>
                            {badge.tier.toUpperCase()}
                          </Badge>
                          <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">
                            +{iiiReward} {III_CONFIG.emoji}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <History className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No reward history yet</p>
                  <p className="text-sm text-slate-400">Start playing to earn badges and III tokens!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Badge Detail Modal */}
      <BadgeDetailModal
        badge={selectedBadge}
        isEarned={selectedBadge ? earnedBadgeIds.includes(selectedBadge.id) : false}
        onClose={() => setSelectedBadge(null)}
      />
    </div>
  );
}

// =============================================================================
// BADGE DETAIL MODAL
// =============================================================================

function BadgeDetailModal({
  badge,
  isEarned,
  onClose,
}: {
  badge: DualRewardBadge | null;
  isEarned: boolean;
  onClose: () => void;
}) {
  if (!badge) return null;

  const tierConfig = TIER_CONFIG[badge.tier];
  const categoryInfo = CATEGORY_INFO[badge.category];
  const iiiReward = calculateBadgeIIIReward(badge);

  return (
    <Dialog open={!!badge} onOpenChange={onClose}>
      <DialogContent className={`max-w-md ${tierConfig.bgColor} border-2 ${tierConfig.borderColor}`}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center flex-col gap-2">
            <div className="text-5xl">{badge.emoji}</div>
            <span className={isEarned ? tierConfig.color : "text-slate-500"}>
              {badge.name}
            </span>
          </DialogTitle>
          <DialogDescription className="text-center">
            {badge.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tier & Category */}
          <div className="flex justify-center gap-2">
            <Badge className={`${tierConfig.bgColor} ${tierConfig.color} border ${tierConfig.borderColor}`}>
              {badge.tier.toUpperCase()} TIER
            </Badge>
            <Badge className={`${categoryInfo.color} bg-white/50`}>
              {categoryInfo.emoji} {categoryInfo.name}
            </Badge>
          </div>

          {/* Rewards */}
          <div className="p-4 rounded-xl bg-white/50 text-center">
            <p className="text-xs text-slate-500 mb-2">Reward</p>
            <div className="flex items-center justify-center gap-2">
              <Coins className="h-5 w-5 text-emerald-500" />
              <span className="text-2xl font-bold text-emerald-600">+{iiiReward}</span>
              <span className="text-lg text-emerald-500">{III_CONFIG.emoji}</span>
            </div>
          </div>

          {/* Status */}
          {isEarned ? (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full">
                <Star className="h-4 w-4" />
                <span className="font-medium">Badge Earned!</span>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-500 rounded-full">
                <Lock className="h-4 w-4" />
                <span className="font-medium">Not Yet Earned</span>
              </div>
            </div>
          )}

          {/* Wisdom (if earned and has wisdom) */}
          {isEarned && badge.wisdomUnlocked && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-amber-700 mb-1">💡 Wisdom Unlocked</p>
                  <p className="text-sm text-amber-800">{badge.wisdomUnlocked}</p>
                </div>
              </div>
            </div>
          )}

          {/* FO Wisdom (if earned and has FO wisdom) */}
          {isEarned && badge.foWisdom && (
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
              <div className="flex items-start gap-2">
                <Crown className="h-4 w-4 text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-purple-700 mb-1">🏛️ Family Office Wisdom</p>
                  <p className="text-sm text-purple-800">{badge.foWisdom}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export default RewardsDashboard;


