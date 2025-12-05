/**
 * RewardsStore - Flybuys-style rewards redemption
 * Clean, intuitive rewards browsing and redemption
 */

"use client";

import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  MapPin,
  ChevronRight,
  Lock,
  TrendingUp,
  Info,
  X,
} from "lucide-react";
import {
  PointsBalance,
  RewardItem,
  PointsTier,
  TIER_INFO,
  REWARDS_CATALOG,
  POINTS_CONFIG,
  pointsToDollars,
  formatPoints,
  getEarnRateDescription,
} from "./pointsSystem";

interface RewardsStoreProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  balance: PointsBalance;
  onRedeem: (reward: RewardItem) => { success: boolean; message: string };
  canAfford: (reward: RewardItem) => boolean;
  meetsTier: (tier?: PointsTier) => boolean;
}

const categoryConfig = {
  food: { icon: <Coffee className="h-4 w-4" />, label: "Food & Drink", color: "text-orange-500" },
  entertainment: { icon: <Film className="h-4 w-4" />, label: "Entertainment", color: "text-purple-500" },
  gaming: { icon: <Gamepad2 className="h-4 w-4" />, label: "Gaming", color: "text-blue-500" },
  shopping: { icon: <ShoppingBag className="h-4 w-4" />, label: "Shopping", color: "text-pink-500" },
  charity: { icon: <Heart className="h-4 w-4" />, label: "Charity", color: "text-red-500" },
  experience: { icon: <MapPin className="h-4 w-4" />, label: "Experiences", color: "text-teal-500" },
};

export function RewardsStore({
  open,
  onOpenChange,
  balance,
  onRedeem,
  canAfford,
  meetsTier,
}: RewardsStoreProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [redeemResult, setRedeemResult] = useState<{ success: boolean; message: string } | null>(null);

  const tierInfo = TIER_INFO[balance.tier];

  // Filter rewards
  const filteredRewards = useMemo(() => {
    return REWARDS_CATALOG.filter(reward => {
      if (!reward.inStock) return false;
      if (selectedCategory && reward.category !== selectedCategory) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          reward.name.toLowerCase().includes(query) ||
          reward.partner.toLowerCase().includes(query) ||
          reward.description.toLowerCase().includes(query)
        );
      }
      return true;
    }).sort((a, b) => {
      // Featured first, then by points cost
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.pointsCost - b.pointsCost;
    });
  }, [selectedCategory, searchQuery]);

  // Featured rewards
  const featuredRewards = useMemo(() => {
    return REWARDS_CATALOG.filter(r => r.featured && r.inStock && meetsTier(r.minTier)).slice(0, 4);
  }, [meetsTier]);

  const handleRedeem = () => {
    if (!selectedReward) return;
    
    const result = onRedeem(selectedReward);
    setRedeemResult(result);
    
    if (result.success) {
      setTimeout(() => {
        setSelectedReward(null);
        setRedeemResult(null);
      }, 2500);
    }
  };

  const closeRewardModal = () => {
    setSelectedReward(null);
    setRedeemResult(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden bg-white border-0 shadow-2xl p-0">
        {/* Header with Points Balance */}
        <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="flex items-center gap-2 text-white text-xl">
              <Gift className="h-6 w-6" />
              Rewards Store
            </DialogTitle>
          </DialogHeader>
          
          {/* Points Balance Card */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70">Your Points</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{balance.current.toLocaleString()}</span>
                <span className="text-white/60">pts</span>
              </div>
              <p className="text-sm text-emerald-300 mt-1">
                ≈ ${pointsToDollars(balance.current).toFixed(2)} value
              </p>
            </div>
            
            <div className="text-right">
              <Badge className={`bg-white/20 text-white border-white/30 px-3 py-1`}>
                {tierInfo.emoji} {tierInfo.name}
              </Badge>
              <p className="text-xs text-white/70 mt-2">
                {getEarnRateDescription(balance.tier)}
              </p>
              {balance.nextTierAt && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <span>{balance.nextTierAt - balance.lifetime} pts to next tier</span>
                  </div>
                  <div className="h-1.5 w-24 bg-white/20 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full"
                      style={{ width: `${balance.tierProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search rewards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
            <Button
              size="sm"
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? "bg-indigo-600" : ""}
            >
              All
            </Button>
            {Object.entries(categoryConfig).map(([key, config]) => (
              <Button
                key={key}
                size="sm"
                variant={selectedCategory === key ? "default" : "outline"}
                onClick={() => setSelectedCategory(key)}
                className={`flex-shrink-0 ${selectedCategory === key ? "bg-indigo-600" : ""}`}
              >
                {config.icon}
                <span className="ml-1">{config.label}</span>
              </Button>
            ))}
          </div>

          {/* Featured Section (when no category selected) */}
          {!selectedCategory && !searchQuery && featuredRewards.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-4 w-4 text-amber-500" />
                <h3 className="font-semibold text-gray-900">Featured Rewards</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {featuredRewards.map(reward => (
                  <button
                    key={reward.id}
                    onClick={() => setSelectedReward(reward)}
                    className="p-3 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 hover:border-amber-400 hover:shadow-md transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{reward.partnerLogo}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{reward.name}</p>
                        <p className="text-xs text-gray-500">{reward.partner}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-sm font-bold ${canAfford(reward) ? "text-indigo-600" : "text-gray-400"}`}>
                        {formatPoints(reward.pointsCost)} pts
                      </span>
                      <span className="text-xs text-emerald-600">${reward.dollarValue}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* All Rewards */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              {selectedCategory ? categoryConfig[selectedCategory as keyof typeof categoryConfig].label : "All Rewards"}
              <span className="text-gray-400 font-normal ml-2">({filteredRewards.length})</span>
            </h3>
            
            <div className="space-y-2">
              {filteredRewards.map(reward => {
                const affordable = canAfford(reward);
                const hasTier = meetsTier(reward.minTier);
                const available = affordable && hasTier;
                
                return (
                  <button
                    key={reward.id}
                    onClick={() => hasTier && setSelectedReward(reward)}
                    disabled={!hasTier}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      available
                        ? "bg-white border-gray-200 hover:border-indigo-400 hover:shadow-md cursor-pointer"
                        : hasTier
                          ? "bg-gray-50 border-gray-200 cursor-pointer"
                          : "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
                        {reward.partnerLogo}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">{reward.name}</p>
                          {reward.featured && (
                            <Badge className="bg-amber-100 text-amber-700 text-xs px-1.5 py-0">
                              <Star className="h-3 w-3" />
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{reward.partner}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{reward.description}</p>
                      </div>
                      
                      <div className="text-right flex-shrink-0">
                        <p className={`text-lg font-bold ${affordable ? "text-indigo-600" : "text-gray-400"}`}>
                          {formatPoints(reward.pointsCost)}
                        </p>
                        <p className="text-xs text-gray-400">pts</p>
                        <p className="text-xs text-emerald-600 mt-1">${reward.dollarValue} value</p>
                      </div>
                    </div>
                    
                    {/* Tier lock message */}
                    {!hasTier && reward.minTier && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-amber-600">
                        <Lock className="h-3 w-3" />
                        Requires {TIER_INFO[reward.minTier].name} tier
                      </div>
                    )}
                  </button>
                );
              })}
              
              {filteredRewards.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Gift className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No rewards found</p>
                  <p className="text-sm text-gray-400 mt-1">Try a different search or category</p>
                </div>
              )}
            </div>
          </div>

          {/* How Points Work */}
          <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-blue-800 text-sm">How Points Work</p>
                <ul className="text-xs text-blue-700 mt-1 space-y-1">
                  <li>• Earn points when you complete missions (10% of 🪙 iii)</li>
                  <li>• Bonus points for daily streaks and saving iii</li>
                  <li>• 100 points = $1 in rewards value</li>
                  <li>• Higher tiers earn points faster!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Reward Detail Modal */}
        <Dialog open={!!selectedReward} onOpenChange={() => closeRewardModal()}>
          <DialogContent className="sm:max-w-md bg-white">
            {selectedReward && (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-lg">Redeem Reward</DialogTitle>
                    <button onClick={closeRewardModal} className="p-1 rounded hover:bg-gray-100">
                      <X className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </DialogHeader>

                {redeemResult?.success ? (
                  // Success State
                  <div className="text-center py-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Check className="h-10 w-10 text-emerald-600" />
                    </div>
                    <p className="text-2xl font-bold text-emerald-700 mb-2">Redeemed! 🎉</p>
                    <p className="text-gray-500">{selectedReward.name}</p>
                    <p className="text-sm text-gray-400 mt-4">
                      Check your email for your reward code
                    </p>
                  </div>
                ) : (
                  // Confirmation State
                  <div className="space-y-4 mt-4">
                    {/* Reward Preview */}
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                      <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center text-3xl shadow">
                        {selectedReward.partnerLogo}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{selectedReward.name}</p>
                        <p className="text-sm text-gray-500">{selectedReward.partner}</p>
                        <p className="text-xs text-gray-400 mt-1">{selectedReward.description}</p>
                      </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Cost</span>
                          <span className="font-bold text-indigo-600">
                            {selectedReward.pointsCost.toLocaleString()} pts
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Your Balance</span>
                          <span>{balance.current.toLocaleString()} pts</span>
                        </div>
                        <div className="h-px bg-indigo-200" />
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">After Redemption</span>
                          <span className={`font-bold ${
                            canAfford(selectedReward) ? "text-emerald-600" : "text-red-600"
                          }`}>
                            {(balance.current - selectedReward.pointsCost).toLocaleString()} pts
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Value highlight */}
                    <div className="flex items-center justify-center gap-2 text-sm text-emerald-600">
                      <Sparkles className="h-4 w-4" />
                      <span>${selectedReward.dollarValue} value for {selectedReward.pointsCost} points!</span>
                    </div>

                    {/* Error message */}
                    {redeemResult && !redeemResult.success && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                        <p className="text-sm text-red-700 text-center">{redeemResult.message}</p>
                      </div>
                    )}

                    {/* Redeem Button */}
                    <Button
                      onClick={handleRedeem}
                      disabled={!canAfford(selectedReward)}
                      className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-bold py-3"
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      {canAfford(selectedReward) 
                        ? `Redeem for ${formatPoints(selectedReward.pointsCost)} pts`
                        : `Need ${formatPoints(selectedReward.pointsCost - balance.current)} more pts`
                      }
                    </Button>

                    <p className="text-xs text-center text-gray-400">
                      Reward code will be sent to your registered email
                    </p>
                  </div>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}

export default RewardsStore;

