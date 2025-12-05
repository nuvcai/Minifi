/**
 * StakingCard - Solana-style staking interface
 * Beautiful, gamified staking UI for teens
 */

"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Coins,
  Lock,
  Unlock,
  TrendingUp,
  Clock,
  Sparkles,
  Gift,
  ChevronRight,
  Zap,
  Trophy,
  ArrowRight,
  Info,
  Flame,
  RefreshCw,
} from "lucide-react";
import { StakingPool, UserStake, StakingStats, FlybuysPoints } from "./stakingTypes";
import { stakingPools, getTierByPoints, getNextTier } from "./stakingData";

interface StakingCardProps {
  currentXP: number;
  streakDays: number;
  stakes: UserStake[];
  stats: StakingStats;
  points: FlybuysPoints;
  onStake: (poolId: string, amount: number) => { success: boolean; message: string };
  onUnstake: (stakeId: string, forceEarly?: boolean) => { success: boolean; amount: number; penalty: number };
  onClaimRewards: (stakeId: string) => { success: boolean; amount: number };
  onClaimAllRewards: () => { success: boolean; totalAmount: number };
  onCompound: (stakeId: string) => { success: boolean; compounded: number };
  calculatePendingRewards: (stake: UserStake) => number;
  getEffectiveAPY: (poolId: string) => number;
  canUnstake: (stakeId: string) => { canUnstake: boolean; penalty: number; daysRemaining: number };
}

export function StakingCard({
  currentXP,
  streakDays,
  stakes,
  stats,
  points,
  onStake,
  onUnstake,
  onClaimRewards,
  onClaimAllRewards,
  onCompound,
  calculatePendingRewards,
  getEffectiveAPY,
  canUnstake,
}: StakingCardProps) {
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedPool, setSelectedPool] = useState<StakingPool | null>(null);
  const [selectedStake, setSelectedStake] = useState<UserStake | null>(null);
  const [stakeAmount, setStakeAmount] = useState(100);
  const [isStaking, setIsStaking] = useState(false);

  const currentTier = getTierByPoints(points.lifetimeEarned);
  const nextTier = getNextTier(points.lifetimeEarned);

  // Calculate total pending rewards
  const totalPending = stakes.reduce((sum, stake) => sum + calculatePendingRewards(stake), 0);

  const handleStake = async () => {
    if (!selectedPool || isStaking) return;
    setIsStaking(true);
    
    const result = onStake(selectedPool.id, stakeAmount);
    
    if (result.success) {
      setShowStakeModal(false);
      setSelectedPool(null);
      setStakeAmount(100);
    }
    
    setIsStaking(false);
  };

  const handleClaimAll = () => {
    const result = onClaimAllRewards();
    if (result.success) {
      // Show success animation
    }
  };

  return (
    <>
      {/* Main Staking Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 border border-violet-200 shadow-xl shadow-violet-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
              <Coins className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">XP Staking</h3>
              <p className="text-xs text-gray-500">Earn rewards while you learn</p>
            </div>
          </div>
          <Badge className="bg-violet-100 text-violet-700 border-violet-200">
            {currentTier.emoji} {currentTier.name}
          </Badge>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="p-3 rounded-xl bg-white/60 border border-violet-100">
            <p className="text-xs text-gray-500 mb-0.5">Staked</p>
            <p className="text-lg font-bold text-violet-600">{stats.totalStaked.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-xl bg-white/60 border border-violet-100">
            <p className="text-xs text-gray-500 mb-0.5">Earned</p>
            <p className="text-lg font-bold text-emerald-600">+{stats.totalEarned.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-xl bg-white/60 border border-violet-100">
            <p className="text-xs text-gray-500 mb-0.5">Avg APY</p>
            <p className="text-lg font-bold text-amber-600">{stats.currentAPY.toFixed(1)}%</p>
          </div>
        </div>

        {/* Active Stakes Preview */}
        {stakes.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-700">Active Stakes ({stakes.length})</p>
              {totalPending > 0 && (
                <Button
                  size="sm"
                  onClick={handleClaimAll}
                  className="h-7 px-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs"
                >
                  <Gift className="h-3 w-3 mr-1" />
                  Claim +{totalPending.toLocaleString()}
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {stakes.slice(0, 2).map((stake) => {
                const pool = stakingPools.find(p => p.id === stake.poolId);
                const pending = calculatePendingRewards(stake);
                const { daysRemaining } = canUnstake(stake.id);
                
                return (
                  <button
                    key={stake.id}
                    onClick={() => {
                      setSelectedStake(stake);
                      setShowManageModal(true);
                    }}
                    className="w-full p-3 rounded-xl bg-white border border-gray-200 hover:border-violet-300 hover:shadow-md transition-all text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{pool?.emoji}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{pool?.name}</p>
                          <p className="text-xs text-gray-500">{stake.amount.toLocaleString()} 🪙</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {pending > 0 ? (
                          <p className="text-sm font-bold text-emerald-600">+{pending.toLocaleString()}</p>
                        ) : (
                          <p className="text-xs text-gray-400">Earning...</p>
                        )}
                        {daysRemaining > 0 && (
                          <div className="flex items-center gap-1 text-xs text-amber-600">
                            <Lock className="h-3 w-3" />
                            {daysRemaining}d
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Flybuys Points Balance */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <span className="font-semibold">Reward Points</span>
            </div>
            <span className="text-xl font-bold">{points.balance.toLocaleString()}</span>
          </div>
          {nextTier && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-white/80 mb-1">
                <span>Progress to {nextTier.emoji} {nextTier.name}</span>
                <span>{Math.round(points.tierProgress)}%</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${points.tierProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Stake Button */}
        <Button
          onClick={() => setShowStakeModal(true)}
          className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-bold shadow-lg shadow-violet-200"
        >
          <Coins className="h-4 w-4 mr-2" />
          Stake 🪙 to Earn More
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>

        {/* Streak Bonus Indicator */}
        {streakDays >= 3 && (
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-amber-600">
            <Flame className="h-3.5 w-3.5" />
            <span>{streakDays} day streak = {stats.streakBonus}x bonus!</span>
          </div>
        )}
      </div>

      {/* Stake Modal */}
      <Dialog open={showStakeModal} onOpenChange={setShowStakeModal}>
        <DialogContent className="sm:max-w-lg bg-gradient-to-br from-violet-50 via-white to-purple-50 border-2 border-violet-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Coins className="h-6 w-6 text-violet-500" />
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent font-bold">
                Stake Your XP
              </span>
            </DialogTitle>
            <DialogDescription>
              Lock your 🪙 iii to earn passive rewards. Higher locks = higher APY!
            </DialogDescription>
          </DialogHeader>

          {!selectedPool ? (
            // Pool Selection
            <div className="space-y-3 mt-4">
              <p className="text-sm font-semibold text-gray-700">Choose a Pool</p>
              {stakingPools.map((pool) => {
                const effectiveAPY = getEffectiveAPY(pool.id);
                const canAfford = currentXP >= pool.minStake;
                
                return (
                  <button
                    key={pool.id}
                    onClick={() => canAfford && setSelectedPool(pool)}
                    disabled={!canAfford}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                      canAfford
                        ? "bg-white border-gray-200 hover:border-violet-400 hover:shadow-lg cursor-pointer"
                        : "bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${pool.bgGradient} text-white text-lg`}>
                          {pool.emoji}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-gray-900">{pool.name}</p>
                            {pool.lockPeriod > 0 && (
                              <Badge variant="outline" className="text-xs">
                                <Lock className="h-2.5 w-2.5 mr-1" />
                                {pool.lockPeriod}d
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{pool.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${pool.color}`}>{effectiveAPY}%</p>
                        <p className="text-xs text-gray-400">APY</p>
                      </div>
                    </div>
                    {!canAfford && (
                      <p className="text-xs text-red-500 mt-2">
                        Need {pool.minStake.toLocaleString()} XP minimum
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            // Amount Selection
            <div className="space-y-4 mt-4">
              <button
                onClick={() => setSelectedPool(null)}
                className="text-sm text-violet-600 hover:underline flex items-center gap-1"
              >
                ← Back to pools
              </button>

              {/* Selected Pool Info */}
              <div className={`p-4 rounded-2xl bg-gradient-to-r ${selectedPool.bgGradient} text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedPool.emoji}</span>
                    <div>
                      <p className="font-bold text-lg">{selectedPool.name}</p>
                      <p className="text-sm text-white/80">{selectedPool.lockPeriod} day lock</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{getEffectiveAPY(selectedPool.id)}%</p>
                    <p className="text-xs text-white/80">APY</p>
                  </div>
                </div>
              </div>

              {/* Amount Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-700">Amount to Stake</p>
                  <p className="text-sm text-gray-500">Available: {currentXP.toLocaleString()} 🪙</p>
                </div>
                
                <div className="p-4 rounded-xl bg-white border border-gray-200">
                  <div className="text-3xl font-bold text-center text-violet-600 mb-4">
                    {stakeAmount.toLocaleString()} XP
                  </div>
                  <Slider
                    value={[stakeAmount]}
                    onValueChange={(value) => setStakeAmount(value[0])}
                    min={selectedPool.minStake}
                    max={Math.min(selectedPool.maxStake, currentXP)}
                    step={10}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Min: {selectedPool.minStake}</span>
                    <span>Max: {Math.min(selectedPool.maxStake, currentXP).toLocaleString()}</span>
                  </div>
                </div>

                {/* Quick Select */}
                <div className="flex gap-2">
                  {[25, 50, 75, 100].map((percent) => {
                    const amount = Math.floor(Math.min(currentXP, selectedPool.maxStake) * (percent / 100));
                    if (amount < selectedPool.minStake) return null;
                    return (
                      <Button
                        key={percent}
                        variant="outline"
                        size="sm"
                        onClick={() => setStakeAmount(amount)}
                        className={stakeAmount === amount ? "border-violet-500 bg-violet-50" : ""}
                      >
                        {percent}%
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Projected Earnings */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <p className="text-sm font-semibold text-emerald-700 mb-2">Projected Earnings</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs text-gray-500">Daily</p>
                    <p className="font-bold text-emerald-600">
                      +{Math.floor(stakeAmount * (selectedPool.dailyYieldPercent / 100))}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Weekly</p>
                    <p className="font-bold text-emerald-600">
                      +{Math.floor(stakeAmount * (selectedPool.dailyYieldPercent / 100) * 7)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{selectedPool.lockPeriod}d Total</p>
                    <p className="font-bold text-emerald-600">
                      +{Math.floor(stakeAmount * (selectedPool.dailyYieldPercent / 100) * Math.max(selectedPool.lockPeriod, 30))}
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning for lock period */}
              {selectedPool.lockPeriod > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2">
                  <Info className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700">
                    Early unstaking incurs a {selectedPool.earlyUnstakePenalty}% penalty. 
                    Your XP will be locked for {selectedPool.lockPeriod} days.
                  </p>
                </div>
              )}

              {/* Stake Button */}
              <Button
                onClick={handleStake}
                disabled={isStaking || stakeAmount < selectedPool.minStake}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-bold py-3"
              >
                {isStaking ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Lock className="h-4 w-4 mr-2" />
                )}
                Stake {stakeAmount.toLocaleString()} XP
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Manage Stake Modal */}
      <Dialog open={showManageModal} onOpenChange={setShowManageModal}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-white to-violet-50 border-2 border-violet-200">
          <DialogHeader>
            <DialogTitle>Manage Stake</DialogTitle>
          </DialogHeader>

          {selectedStake && (() => {
            const pool = stakingPools.find(p => p.id === selectedStake.poolId);
            const pending = calculatePendingRewards(selectedStake);
            const { daysRemaining, penalty } = canUnstake(selectedStake.id);
            
            return (
              <div className="space-y-4 mt-4">
                {/* Stake Info */}
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${pool?.bgGradient || "from-violet-400 to-purple-500"} text-white`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{pool?.emoji}</span>
                    <div>
                      <p className="font-bold text-lg">{pool?.name}</p>
                      <p className="text-sm text-white/80">Staked {new Date(selectedStake.stakedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white/20">
                      <p className="text-xs text-white/80">Staked</p>
                      <p className="text-xl font-bold">{selectedStake.amount.toLocaleString()}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/20">
                      <p className="text-xs text-white/80">Earned</p>
                      <p className="text-xl font-bold text-emerald-300">+{selectedStake.totalEarned.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Pending Rewards */}
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-emerald-700">Pending Rewards</p>
                    <p className="text-2xl font-bold text-emerald-600">+{pending.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        onClaimRewards(selectedStake.id);
                        setShowManageModal(false);
                      }}
                      disabled={pending <= 0}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      Claim
                    </Button>
                    <Button
                      onClick={() => {
                        onCompound(selectedStake.id);
                        setShowManageModal(false);
                      }}
                      disabled={pending <= 0}
                      variant="outline"
                      className="flex-1 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Compound
                    </Button>
                  </div>
                </div>

                {/* Lock Status */}
                <div className={`p-4 rounded-xl ${daysRemaining > 0 ? "bg-amber-50 border border-amber-200" : "bg-green-50 border border-green-200"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {daysRemaining > 0 ? (
                      <>
                        <Lock className="h-4 w-4 text-amber-500" />
                        <p className="text-sm font-semibold text-amber-700">Locked</p>
                      </>
                    ) : (
                      <>
                        <Unlock className="h-4 w-4 text-green-500" />
                        <p className="text-sm font-semibold text-green-700">Unlocked</p>
                      </>
                    )}
                  </div>
                  {daysRemaining > 0 ? (
                    <p className="text-xs text-amber-600">
                      {daysRemaining} days remaining. Early unstake penalty: {penalty}%
                    </p>
                  ) : (
                    <p className="text-xs text-green-600">
                      Your stake is ready to withdraw with no penalty!
                    </p>
                  )}
                </div>

                {/* Unstake Button */}
                <Button
                  onClick={() => {
                    onUnstake(selectedStake.id, daysRemaining > 0);
                    setShowManageModal(false);
                  }}
                  variant={daysRemaining > 0 ? "outline" : "default"}
                  className={daysRemaining > 0 
                    ? "w-full border-red-300 text-red-600 hover:bg-red-50" 
                    : "w-full bg-violet-500 hover:bg-violet-600"
                  }
                >
                  {daysRemaining > 0 ? (
                    <>
                      <Unlock className="h-4 w-4 mr-2" />
                      Force Unstake (-{penalty}%)
                    </>
                  ) : (
                    <>
                      <Unlock className="h-4 w-4 mr-2" />
                      Unstake All
                    </>
                  )}
                </Button>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default StakingCard;

