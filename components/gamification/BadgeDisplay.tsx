/**
 * BadgeDisplay - Visual display of earned effort badges
 * 
 * Showcases badges earned through effort, exploration, and learning.
 * Emphasizes the journey over outcomes.
 */

"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Award,
  Target,
  Sparkles,
  Trophy,
  ChevronRight,
  Lock,
  Star,
} from "lucide-react";
import { III_CONFIG } from "@/hooks/useIII";
import { EffortBadge, effortBadges, learningMilestones } from "./effortRewards";

interface BadgeDisplayProps {
  earnedBadgeIds: string[];
  earnedMilestoneIds: string[];
  stats: {
    missionsCompleted: number;
    differentRiskLevelsTried: number;
    differentAssetClassesTried: number;
    coachesUsed: number;
    lossesExperienced: number;
    investmentsAfterLoss: number;
    investmentsMade: number;
  };
  compact?: boolean;
  onBadgeClick?: (badge: EffortBadge) => void;
}

const tierColors: Record<string, string> = {
  bronze: "from-amber-600 to-amber-700",
  silver: "from-slate-400 to-slate-500",
  gold: "from-yellow-400 to-amber-500",
  platinum: "from-violet-400 to-purple-500",
};

const tierBgColors: Record<string, string> = {
  bronze: "bg-amber-50 border-amber-200",
  silver: "bg-slate-50 border-slate-200",
  gold: "bg-yellow-50 border-yellow-200",
  platinum: "bg-violet-50 border-violet-200",
};

export function BadgeDisplay({
  earnedBadgeIds,
  earnedMilestoneIds,
  stats,
  compact = false,
  onBadgeClick: _onBadgeClick,
}: BadgeDisplayProps) {
  const [selectedBadge, setSelectedBadge] = useState<EffortBadge | null>(null);
  const [showAllBadges, setShowAllBadges] = useState(false);

  const earnedBadges = effortBadges.filter((b) => earnedBadgeIds.includes(b.id));
  const lockedBadges = effortBadges.filter((b) => !earnedBadgeIds.includes(b.id));

  // Calculate progress for locked badges
  const getBadgeProgress = (badge: EffortBadge): number => {
    switch (badge.requirement) {
      case "complete_1_mission":
        return Math.min(stats.missionsCompleted / 1, 1) * 100;
      case "complete_3_missions":
        return Math.min(stats.missionsCompleted / 3, 1) * 100;
      case "complete_6_missions":
        return Math.min(stats.missionsCompleted / 6, 1) * 100;
      case "try_3_risk_levels":
        return Math.min(stats.differentRiskLevelsTried / 3, 1) * 100;
      case "try_all_risk_levels":
        return Math.min(stats.differentRiskLevelsTried / 5, 1) * 100;
      case "try_3_asset_classes":
        return Math.min(stats.differentAssetClassesTried / 3, 1) * 100;
      case "try_all_asset_classes":
        return Math.min(stats.differentAssetClassesTried / 6, 1) * 100;
      case "try_2_coaches":
        return Math.min(stats.coachesUsed / 2, 1) * 100;
      case "try_4_coaches":
        return Math.min(stats.coachesUsed / 4, 1) * 100;
      case "invest_after_loss":
        return stats.investmentsAfterLoss >= 1 ? 100 : 0;
      case "experience_3_losses":
        return Math.min(stats.lossesExperienced / 3, 1) * 100;
      default:
        return 0;
    }
  };

  // Compact version for sidebar
  if (compact) {
    return (
      <div className="p-4 rounded-2xl bg-white shadow-lg border border-indigo-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Award className="h-4 w-4 text-indigo-500" />
            Effort Badges
          </h3>
          <Badge className="bg-indigo-100 text-indigo-700 border-0">
            {earnedBadges.length}/{effortBadges.length}
          </Badge>
        </div>

        {/* Show earned badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {earnedBadges.slice(0, 6).map((badge) => (
            <button
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg 
                ${tierBgColors[badge.tier]} border-2 hover:scale-110 transition-transform cursor-pointer`}
              title={badge.name}
            >
              {badge.emoji}
            </button>
          ))}
          {earnedBadges.length === 0 && (
            <p className="text-xs text-gray-500 italic">Complete missions to earn badges!</p>
          )}
        </div>

        {/* Progress to next badge */}
        {lockedBadges.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Next: {lockedBadges[0].name}</span>
              <span>{Math.round(getBadgeProgress(lockedBadges[0]))}%</span>
            </div>
            <Progress value={getBadgeProgress(lockedBadges[0])} className="h-1.5" />
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAllBadges(true)}
          className="w-full mt-2 text-indigo-600 hover:text-indigo-700"
        >
          View All Badges
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>

        {/* Badge detail modal */}
        <BadgeDetailModal
          badge={selectedBadge}
          isEarned={selectedBadge ? earnedBadgeIds.includes(selectedBadge.id) : false}
          progress={selectedBadge ? getBadgeProgress(selectedBadge) : 0}
          onClose={() => setSelectedBadge(null)}
        />

        {/* All badges modal */}
        <AllBadgesModal
          open={showAllBadges}
          onClose={() => setShowAllBadges(false)}
          earnedBadgeIds={earnedBadgeIds}
          earnedMilestoneIds={earnedMilestoneIds}
          getBadgeProgress={getBadgeProgress}
          stats={stats}
        />
      </div>
    );
  }

  // Full version
  return (
    <div className="space-y-6">
      {/* Earned Badges Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-5 w-5 text-amber-500" />
          <h3 className="font-semibold text-lg">Your Effort Badges</h3>
          <Badge className="bg-amber-100 text-amber-700">
            {earnedBadges.length} Earned
          </Badge>
        </div>

        {earnedBadges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {earnedBadges.map((badge) => (
              <Card
                key={badge.id}
                className={`cursor-pointer hover:scale-105 transition-all ${tierBgColors[badge.tier]} border-2`}
                onClick={() => setSelectedBadge(badge)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{badge.emoji}</div>
                  <p className="font-medium text-sm">{badge.name}</p>
                  <Badge className={`mt-2 bg-gradient-to-r ${tierColors[badge.tier]} text-white border-0 text-xs`}>
                    {badge.tier.toUpperCase()}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-gray-50 border-dashed">
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No badges yet!</p>
              <p className="text-gray-500 text-sm">Complete missions and explore to earn badges</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Locked Badges Preview */}
      {lockedBadges.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Lock className="h-5 w-5 text-gray-400" />
            <h3 className="font-semibold text-lg text-gray-600">Badges to Unlock</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {lockedBadges.slice(0, 4).map((badge) => (
              <Card
                key={badge.id}
                className="bg-gray-100 border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setSelectedBadge(badge)}
              >
                <CardContent className="p-4 text-center relative">
                  <div className="text-3xl mb-2 opacity-40">{badge.emoji}</div>
                  <p className="font-medium text-sm text-gray-500">{badge.name}</p>
                  <Progress value={getBadgeProgress(badge)} className="h-1 mt-2" />
                  <Lock className="absolute top-2 right-2 h-4 w-4 text-gray-400" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Badge detail modal */}
      <BadgeDetailModal
        badge={selectedBadge}
        isEarned={selectedBadge ? earnedBadgeIds.includes(selectedBadge.id) : false}
        progress={selectedBadge ? getBadgeProgress(selectedBadge) : 0}
        onClose={() => setSelectedBadge(null)}
      />
    </div>
  );
}

// Badge Detail Modal
function BadgeDetailModal({
  badge,
  isEarned,
  progress,
  onClose,
}: {
  badge: EffortBadge | null;
  isEarned: boolean;
  progress: number;
  onClose: () => void;
}) {
  if (!badge) return null;

  return (
    <Dialog open={!!badge} onOpenChange={onClose}>
      <DialogContent className={`max-w-sm ${tierBgColors[badge.tier]} border-2`}>
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="text-5xl mb-2">{badge.emoji}</div>
            <span className={isEarned ? "" : "text-gray-500"}>
              {badge.name}
            </span>
          </DialogTitle>
          <DialogDescription className="text-center">
            {badge.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-center">
            <Badge className={`bg-gradient-to-r ${tierColors[badge.tier]} text-white border-0 px-4 py-1`}>
              {badge.tier.toUpperCase()} TIER
            </Badge>
          </div>

          {isEarned ? (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full">
                <Star className="h-4 w-4" />
                <span className="font-medium">Badge Earned!</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-gray-500 text-center italic">
                Keep going! Every effort counts toward this badge.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// All Badges Modal
function AllBadgesModal({
  open,
  onClose,
  earnedBadgeIds,
  earnedMilestoneIds,
  getBadgeProgress,
  stats,
}: {
  open: boolean;
  onClose: () => void;
  earnedBadgeIds: string[];
  earnedMilestoneIds: string[];
  getBadgeProgress: (badge: EffortBadge) => number;
  stats: BadgeDisplayProps['stats'];
}) {
  const [activeTab, setActiveTab] = useState<"badges" | "milestones">("badges");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-6 w-6 text-indigo-500" />
            Your Achievement Journey
          </DialogTitle>
          <DialogDescription>
            Badges earned through effort, exploration, and perseverance
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={activeTab === "badges" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("badges")}
          >
            <Trophy className="h-4 w-4 mr-1" />
            Effort Badges ({earnedBadgeIds.length}/{effortBadges.length})
          </Button>
          <Button
            variant={activeTab === "milestones" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("milestones")}
          >
            <Target className="h-4 w-4 mr-1" />
            Milestones ({earnedMilestoneIds.length}/{learningMilestones.length})
          </Button>
        </div>

        {activeTab === "badges" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {effortBadges.map((badge) => {
              const isEarned = earnedBadgeIds.includes(badge.id);
              const progress = getBadgeProgress(badge);
              return (
                <Card
                  key={badge.id}
                  className={`${isEarned ? tierBgColors[badge.tier] : "bg-gray-50"} 
                    border-2 ${isEarned ? "" : "border-gray-200 opacity-60"}`}
                >
                  <CardContent className="p-3 text-center relative">
                    <div className={`text-2xl mb-1 ${isEarned ? "" : "opacity-40"}`}>
                      {badge.emoji}
                    </div>
                    <p className={`text-xs font-medium ${isEarned ? "" : "text-gray-500"}`}>
                      {badge.name}
                    </p>
                    {!isEarned && (
                      <>
                        <Progress value={progress} className="h-1 mt-2" />
                        <Lock className="absolute top-1 right-1 h-3 w-3 text-gray-400" />
                      </>
                    )}
                    {isEarned && (
                      <Badge className={`mt-1 bg-gradient-to-r ${tierColors[badge.tier]} text-white border-0 text-[10px]`}>
                        ✓
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {learningMilestones.map((milestone) => {
              const isEarned = earnedMilestoneIds.includes(milestone.id);
              let current = 0;
              switch (milestone.type) {
                case "missions_attempted":
                  current = stats.investmentsMade;
                  break;
                case "assets_explored":
                  current = stats.differentAssetClassesTried;
                  break;
                case "risks_taken":
                  current = stats.differentRiskLevelsTried;
                  break;
                case "coaches_consulted":
                  current = stats.coachesUsed;
                  break;
              }
              const progress = Math.min((current / milestone.requirement) * 100, 100);
              
              return (
                <Card
                  key={milestone.id}
                  className={`${isEarned ? "bg-emerald-50 border-emerald-200" : "bg-white"} border`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className={`h-5 w-5 ${isEarned ? "text-emerald-500" : "text-gray-400"}`} />
                        <span className={`font-medium ${isEarned ? "text-emerald-700" : ""}`}>
                          {milestone.name}
                        </span>
                      </div>
                      <Badge className={isEarned ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
                        +{milestone.xpReward} {III_CONFIG.symbol}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                    {!isEarned && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{current} / {milestone.requirement}</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                      </div>
                    )}
                    {isEarned && (
                      <div className="text-xs text-emerald-600 font-medium">✓ Milestone Achieved!</div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Encouragement message */}
        <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-lg border border-indigo-100 text-center">
          <p className="text-sm text-indigo-700">
            💪 Remember: Every badge celebrates <strong>effort</strong>, not just outcomes.
            Keep exploring, keep learning, keep growing!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default BadgeDisplay;

