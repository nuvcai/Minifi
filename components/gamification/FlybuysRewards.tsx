/**
 * FlybuysRewards - Flybuys-style rewards store
 * Partner rewards catalog with points redemption
 */

"use client";

import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Gift,
  Search,
  Star,
  Sparkles,
  Check,
  ShoppingBag,
  Coffee,
  Gamepad2,
  Film,
  Heart,
  Coins,
  Clock,
  Lock,
} from "lucide-react";
import { FlybuysPoints, PartnerReward, RewardCategory, MembershipTier } from "./stakingTypes";
import { partnerRewards, membershipTiers, getTierByPoints, getNextTier } from "./stakingData";

interface FlybuysRewardsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  points: FlybuysPoints;
  onRedeem: (amount: number, description: string) => boolean;
}

const categoryIcons: Record<RewardCategory, React.ReactNode> = {
  food_drink: <Coffee className="h-4 w-4" />,
  entertainment: <Film className="h-4 w-4" />,
  shopping: <ShoppingBag className="h-4 w-4" />,
  gaming: <Gamepad2 className="h-4 w-4" />,
  experiences: <Star className="h-4 w-4" />,
  charity: <Heart className="h-4 w-4" />,
  crypto: <Coins className="h-4 w-4" />,
};

const categoryLabels: Record<RewardCategory, string> = {
  food_drink: "Food & Drink",
  entertainment: "Entertainment",
  shopping: "Shopping",
  gaming: "Gaming",
  experiences: "Experiences",
  charity: "Charity",
  crypto: "Crypto/NFT",
};

export function FlybuysRewards({
  open,
  onOpenChange,
  points,
  onRedeem,
}: FlybuysRewardsProps) {
  const [selectedCategory, setSelectedCategory] = useState<RewardCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReward, setSelectedReward] = useState<PartnerReward | null>(null);
  const [_showConfirm, setShowConfirm] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState(false);

  const currentTier = getTierByPoints(points.lifetimeEarned);
  const nextTier = getNextTier(points.lifetimeEarned);

  // Filter rewards
  const filteredRewards = useMemo(() => {
    return partnerRewards.filter(reward => {
      // Category filter
      if (selectedCategory !== "all" && reward.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          reward.name.toLowerCase().includes(query) ||
          reward.partnerName.toLowerCase().includes(query) ||
          reward.description.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  // Group by category for display
  const categories = useMemo(() => {
    const cats = new Set(partnerRewards.map(r => r.category));
    return Array.from(cats);
  }, []);

  const handleRedeem = () => {
    if (!selectedReward) return;
    
    const success = onRedeem(selectedReward.pointsCost, `Redeemed: ${selectedReward.name}`);
    
    if (success) {
      setRedeemSuccess(true);
      setTimeout(() => {
        setRedeemSuccess(false);
        setShowConfirm(false);
        setSelectedReward(null);
      }, 2000);
    }
  };

  const canAffordReward = (reward: PartnerReward) => points.balance >= reward.pointsCost;
  
  const meetsMinTier = (reward: PartnerReward) => {
    if (!reward.minTier) return true;
    const tierOrder: MembershipTier[] = ["starter", "bronze", "silver", "gold", "vip"];
    return tierOrder.indexOf(currentTier.tier) >= tierOrder.indexOf(reward.minTier);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-50 border-2 border-indigo-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-6 w-6 text-indigo-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Rewards Store
            </span>
          </DialogTitle>
          <DialogDescription>
            Redeem your points for awesome rewards from our partners!
          </DialogDescription>
        </DialogHeader>

        {/* Points Balance Header */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-white/80">Your Balance</p>
              <p className="text-3xl font-bold">{points.balance.toLocaleString()} pts</p>
            </div>
            <div className="text-right">
              <Badge className="bg-white/20 text-white border-white/30 mb-1">
                {currentTier.emoji} {currentTier.name}
              </Badge>
              <p className="text-xs text-white/70">{currentTier.pointsMultiplier}x earn rate</p>
            </div>
          </div>
          {nextTier && (
            <div>
              <div className="flex items-center justify-between text-xs text-white/80 mb-1">
                <span>{nextTier.minPoints - points.lifetimeEarned} pts to {nextTier.name}</span>
                <span>{Math.round(points.tierProgress)}%</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${points.tierProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search rewards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as RewardCategory | "all")}
            className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{categoryLabels[cat]}</option>
            ))}
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mt-2 no-scrollbar">
          <Button
            size="sm"
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            className={selectedCategory === "all" ? "bg-indigo-500" : ""}
          >
            All
          </Button>
          {categories.map(cat => (
            <Button
              key={cat}
              size="sm"
              variant={selectedCategory === cat ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? "bg-indigo-500" : ""}
            >
              {categoryIcons[cat]}
              <span className="ml-1">{categoryLabels[cat]}</span>
            </Button>
          ))}
        </div>

        {/* Rewards Grid */}
        <div className="overflow-y-auto max-h-[40vh] mt-4 -mx-2 px-2 space-y-2">
          {filteredRewards.map(reward => {
            const canAfford = canAffordReward(reward);
            const meetsTier = meetsMinTier(reward);
            const isAvailable = reward.inStock && meetsTier;
            
            return (
              <button
                key={reward.id}
                onClick={() => isAvailable && canAfford && setSelectedReward(reward)}
                disabled={!isAvailable || !canAfford}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  isAvailable && canAfford
                    ? "bg-white border-gray-200 hover:border-indigo-400 hover:shadow-lg cursor-pointer"
                    : "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Partner Logo */}
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-2xl flex-shrink-0">
                    {reward.emoji}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-900 truncate">{reward.name}</p>
                      {reward.featured && (
                        <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      {reward.limitedTime && (
                        <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Limited
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{reward.partnerName}</p>
                    <p className="text-sm text-gray-600 truncate">{reward.description}</p>
                  </div>
                  
                  {/* Price */}
                  <div className="text-right flex-shrink-0">
                    <p className={`text-lg font-bold ${canAfford ? "text-indigo-600" : "text-gray-400"}`}>
                      {reward.pointsCost.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">pts</p>
                    {reward.dollarValue > 0 && (
                      <p className="text-xs text-emerald-600">${reward.dollarValue} value</p>
                    )}
                  </div>
                </div>
                
                {/* Tier requirement */}
                {reward.minTier && !meetsTier && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-amber-600">
                    <Lock className="h-3 w-3" />
                    Requires {membershipTiers.find(t => t.tier === reward.minTier)?.name} tier
                  </div>
                )}
              </button>
            );
          })}

          {filteredRewards.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Gift className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No rewards found</p>
            </div>
          )}
        </div>

        {/* Redeem Confirmation Modal */}
        <Dialog open={!!selectedReward} onOpenChange={(open) => !open && setSelectedReward(null)}>
          <DialogContent className="sm:max-w-md bg-white">
            <DialogHeader>
              <DialogTitle>Redeem Reward</DialogTitle>
            </DialogHeader>

            {selectedReward && (
              <div className="space-y-4">
                {redeemSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Check className="h-8 w-8 text-emerald-600" />
                    </div>
                    <p className="text-xl font-bold text-emerald-700">Redeemed! 🎉</p>
                    <p className="text-gray-500 mt-2">Check your email for your reward code.</p>
                  </div>
                ) : (
                  <>
                    {/* Reward Preview */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-200">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center text-3xl shadow">
                          {selectedReward.emoji}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{selectedReward.name}</p>
                          <p className="text-sm text-gray-500">{selectedReward.partnerName}</p>
                          <p className="text-sm text-gray-600 mt-1">{selectedReward.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Cost</span>
                        <span className="font-bold text-indigo-600">
                          {selectedReward.pointsCost.toLocaleString()} pts
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Your Balance</span>
                        <span className="font-medium">{points.balance.toLocaleString()} pts</span>
                      </div>
                      <div className="h-px bg-gray-200 my-2" />
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">After Redemption</span>
                        <span className={`font-bold ${
                          points.balance - selectedReward.pointsCost >= 0 ? "text-emerald-600" : "text-red-600"
                        }`}>
                          {(points.balance - selectedReward.pointsCost).toLocaleString()} pts
                        </span>
                      </div>
                    </div>

                    {/* Value */}
                    {selectedReward.dollarValue > 0 && (
                      <div className="flex items-center justify-center gap-2 text-sm text-emerald-600">
                        <Sparkles className="h-4 w-4" />
                        <span>${selectedReward.dollarValue} value for {selectedReward.pointsCost} points!</span>
                      </div>
                    )}

                    {/* Confirm Button */}
                    <Button
                      onClick={handleRedeem}
                      disabled={!canAffordReward(selectedReward)}
                      className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-bold py-3"
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      Redeem for {selectedReward.pointsCost.toLocaleString()} pts
                    </Button>

                    <p className="text-xs text-center text-gray-500">
                      Reward code will be sent to your registered email
                    </p>
                  </>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}

export default FlybuysRewards;

