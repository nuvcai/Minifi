/**
 * SavingsVault - Internal XP Savings System
 * Teaches teens about saving, compound interest, and delayed gratification
 * Simple, gamified savings that rewards patience
 */

"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  PiggyBank,
  TrendingUp,
  Clock,
  Sparkles,
  Gift,
  ChevronRight,
  Lock,
  Unlock,
  Coins,
  Target,
  Calendar,
  Flame,
  Star,
  Info,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════
// Savings Account Types - Simple, Teen-Friendly
// ═══════════════════════════════════════════════════════════════════════════

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  interestEarned: number;
  createdAt: Date;
  targetDate?: Date;
  emoji: string;
  completed: boolean;
}

interface SavingsStats {
  totalSaved: number;
  totalInterestEarned: number;
  currentStreak: number;
  savingsGoals: number;
  goalsCompleted: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// Interest Rates - Reward Saving Behavior
// ═══════════════════════════════════════════════════════════════════════════

const DAILY_INTEREST_RATE = 0.005; // 0.5% daily = ~180% APY (gamified!)
const STREAK_BONUS_RATES: Record<number, number> = {
  3: 0.001,   // +0.1% bonus at 3 day streak
  7: 0.002,   // +0.2% bonus at 7 day streak
  14: 0.003,  // +0.3% bonus at 14 day streak
  30: 0.005,  // +0.5% bonus at 30 day streak
};

// Preset savings goals for teens
const SUGGESTED_GOALS = [
  { name: "Emergency Fund", target: 500, emoji: "🛡️", description: "Save for a rainy day" },
  { name: "Big Purchase", target: 1000, emoji: "🎯", description: "Something you really want" },
  { name: "Weekly Saver", target: 200, emoji: "📅", description: "Build the habit" },
  { name: "XP Millionaire", target: 10000, emoji: "💰", description: "The ultimate goal!" },
];

// Storage key
const SAVINGS_STORAGE_KEY = "minifi_savings_vault";

// ═══════════════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════════════

interface SavingsVaultProps {
  availableXP: number;
  streakDays: number;
  onDeposit: (amount: number) => void;
  onWithdraw: (amount: number) => void;
  onInterestEarned: (amount: number) => void;
}

export function SavingsVault({
  availableXP,
  streakDays,
  onDeposit,
  onWithdraw,
  onInterestEarned,
}: SavingsVaultProps) {
  // State
  const [savings, setSavings] = useState<SavingsGoal[]>([]);
  const [stats, setStats] = useState<SavingsStats>({
    totalSaved: 0,
    totalInterestEarned: 0,
    currentStreak: streakDays,
    savingsGoals: 0,
    goalsCompleted: 0,
  });
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState(50);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState(500);
  const [newGoalEmoji, setNewGoalEmoji] = useState("🎯");
  const [lastInterestDate, setLastInterestDate] = useState<string | null>(null);
  const [pendingInterest, setPendingInterest] = useState(0);
  const [showInterestClaimed, setShowInterestClaimed] = useState(false);

  // Calculate current interest rate with streak bonus
  const getCurrentInterestRate = useCallback(() => {
    let rate = DAILY_INTEREST_RATE;
    
    // Add streak bonuses
    Object.entries(STREAK_BONUS_RATES).forEach(([days, bonus]) => {
      if (streakDays >= parseInt(days)) {
        rate += bonus;
      }
    });
    
    return rate;
  }, [streakDays]);

  // Load savings from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVINGS_STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setSavings(data.savings?.map((s: SavingsGoal) => ({
          ...s,
          createdAt: new Date(s.createdAt),
          targetDate: s.targetDate ? new Date(s.targetDate) : undefined,
        })) || []);
        setLastInterestDate(data.lastInterestDate || null);
        setStats(data.stats || stats);
      }
    } catch (e) {
      console.error("Failed to load savings:", e);
    }
  }, []);

  // Save to localStorage when savings change
  useEffect(() => {
    try {
      localStorage.setItem(SAVINGS_STORAGE_KEY, JSON.stringify({
        savings,
        lastInterestDate,
        stats,
      }));
    } catch (e) {
      console.error("Failed to save savings:", e);
    }
  }, [savings, lastInterestDate, stats]);

  // Calculate and accumulate interest daily
  useEffect(() => {
    const today = new Date().toDateString();
    
    if (lastInterestDate !== today && stats.totalSaved > 0) {
      const rate = getCurrentInterestRate();
      const interest = Math.floor(stats.totalSaved * rate);
      
      if (interest > 0) {
        setPendingInterest(interest);
      }
    }
  }, [lastInterestDate, stats.totalSaved, getCurrentInterestRate]);

  // Claim daily interest
  const claimInterest = () => {
    if (pendingInterest <= 0) return;
    
    const today = new Date().toDateString();
    
    // Add interest to main savings goal or create one
    if (savings.length > 0) {
      setSavings(prev => prev.map((goal, index) => {
        if (index === 0) {
          return {
            ...goal,
            currentAmount: goal.currentAmount + pendingInterest,
            interestEarned: goal.interestEarned + pendingInterest,
          };
        }
        return goal;
      }));
    }
    
    setStats(prev => ({
      ...prev,
      totalSaved: prev.totalSaved + pendingInterest,
      totalInterestEarned: prev.totalInterestEarned + pendingInterest,
    }));
    
    setLastInterestDate(today);
    onInterestEarned(pendingInterest);
    
    setShowInterestClaimed(true);
    setTimeout(() => setShowInterestClaimed(false), 2000);
    
    setPendingInterest(0);
  };

  // Create a new savings goal
  const createGoal = (name: string, target: number, emoji: string) => {
    const newGoal: SavingsGoal = {
      id: `goal_${Date.now()}`,
      name,
      targetAmount: target,
      currentAmount: 0,
      interestEarned: 0,
      createdAt: new Date(),
      emoji,
      completed: false,
    };
    
    setSavings(prev => [...prev, newGoal]);
    setStats(prev => ({
      ...prev,
      savingsGoals: prev.savingsGoals + 1,
    }));
    
    setShowGoalModal(false);
    setNewGoalName("");
    setNewGoalTarget(500);
  };

  // Deposit to a goal
  const deposit = (goalId: string, amount: number) => {
    if (amount > availableXP || amount <= 0) return;
    
    setSavings(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const newAmount = goal.currentAmount + amount;
        const isNowComplete = newAmount >= goal.targetAmount && !goal.completed;
        
        if (isNowComplete) {
          setStats(p => ({ ...p, goalsCompleted: p.goalsCompleted + 1 }));
        }
        
        return {
          ...goal,
          currentAmount: newAmount,
          completed: newAmount >= goal.targetAmount,
        };
      }
      return goal;
    }));
    
    setStats(prev => ({
      ...prev,
      totalSaved: prev.totalSaved + amount,
    }));
    
    onDeposit(amount);
    setShowDepositModal(false);
  };

  // Withdraw from a goal
  const withdraw = (goalId: string, amount: number) => {
    const goal = savings.find(g => g.id === goalId);
    if (!goal || amount > goal.currentAmount || amount <= 0) return;
    
    setSavings(prev => prev.map(g => {
      if (g.id === goalId) {
        return {
          ...g,
          currentAmount: g.currentAmount - amount,
          completed: false,
        };
      }
      return g;
    }));
    
    setStats(prev => ({
      ...prev,
      totalSaved: prev.totalSaved - amount,
    }));
    
    onWithdraw(amount);
  };

  // Quick deposit to main goal
  const quickDeposit = () => {
    if (savings.length === 0) {
      // Create default goal first
      createGoal("My Savings", 1000, "💰");
    }
    setSelectedGoal(savings[0] || null);
    setShowDepositModal(true);
  };

  const interestRate = getCurrentInterestRate();
  const dailyInterestPreview = Math.floor(stats.totalSaved * interestRate);

  return (
    <>
      {/* Main Savings Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border border-emerald-200 shadow-xl shadow-emerald-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
              <PiggyBank className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Savings Vault</h3>
              <p className="text-xs text-gray-500">Grow your 🪙 iii!</p>
            </div>
          </div>
          
          {/* Interest Rate Badge */}
          <div className="text-right">
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
              <TrendingUp className="h-3 w-3 mr-1" />
              {(interestRate * 100).toFixed(1)}% daily
            </Badge>
            {streakDays >= 3 && (
              <p className="text-xs text-amber-600 mt-1 flex items-center justify-end gap-1">
                <Flame className="h-3 w-3" />
                Streak bonus active!
              </p>
            )}
          </div>
        </div>

        {/* Total Saved Display */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white mb-4">
          <p className="text-sm text-emerald-100">Total Saved</p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold">{stats.totalSaved.toLocaleString()}</p>
            <p className="text-emerald-200 pb-1">XP</p>
          </div>
          <div className="flex items-center justify-between mt-2 text-sm">
            <span className="text-emerald-100">Interest Earned</span>
            <span className="font-semibold text-emerald-100">+{stats.totalInterestEarned.toLocaleString()} 🪙</span>
          </div>
        </div>

        {/* Daily Interest Claim */}
        {pendingInterest > 0 && (
          <button
            onClick={claimInterest}
            className="w-full p-3 rounded-xl bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300 mb-4 hover:shadow-lg transition-all animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <span className="font-semibold text-amber-700">Daily Interest Ready!</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-amber-600">+{pendingInterest}</span>
                <ArrowRight className="h-4 w-4 text-amber-500" />
              </div>
            </div>
          </button>
        )}

        {/* Interest Claimed Success */}
        {showInterestClaimed && (
          <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-200 mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <span className="text-emerald-700 font-medium">Interest claimed! 🎉</span>
          </div>
        )}

        {/* Savings Goals Preview */}
        {savings.length > 0 && (
          <div className="space-y-2 mb-4">
            <p className="text-sm font-semibold text-gray-700">Your Goals</p>
            {savings.slice(0, 2).map((goal) => {
              const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
              
              return (
                <button
                  key={goal.id}
                  onClick={() => {
                    setSelectedGoal(goal);
                    setShowDepositModal(true);
                  }}
                  className="w-full p-3 rounded-xl bg-white border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{goal.emoji}</span>
                      <span className="font-medium text-gray-900">{goal.name}</span>
                      {goal.completed && (
                        <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                          ✓ Done!
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {goal.currentAmount.toLocaleString()} / {goal.targetAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        goal.completed 
                          ? "bg-gradient-to-r from-emerald-400 to-teal-400" 
                          : "bg-gradient-to-r from-emerald-500 to-teal-500"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={quickDeposit}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold shadow-lg shadow-emerald-200"
          >
            <Coins className="h-4 w-4 mr-2" />
            Save XP
          </Button>
          <Button
            onClick={() => setShowGoalModal(true)}
            variant="outline"
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            <Target className="h-4 w-4 mr-1" />
            New Goal
          </Button>
        </div>

        {/* Daily Interest Preview */}
        {stats.totalSaved > 0 && (
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-emerald-600">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Tomorrow you'll earn ~{dailyInterestPreview} XP interest!</span>
          </div>
        )}

        {/* Educational Tip */}
        <div className="mt-3 p-3 rounded-xl bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-700">
              <span className="font-semibold">Pro tip:</span> The longer you save, the more interest you earn! 
              This is called <span className="font-semibold">compound interest</span> - your money makes money! 🚀
            </p>
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      <Dialog open={showDepositModal} onOpenChange={setShowDepositModal}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-2 border-emerald-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PiggyBank className="h-6 w-6 text-emerald-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {selectedGoal ? `Save to ${selectedGoal.name}` : "Save 🪙 iii"}
              </span>
            </DialogTitle>
            <DialogDescription>
              Put your 🪙 iii to work! Watch it grow with daily interest.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Current Goal Progress */}
            {selectedGoal && (
              <div className="p-4 rounded-xl bg-white border border-emerald-200">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{selectedGoal.emoji}</span>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{selectedGoal.name}</p>
                    <p className="text-sm text-gray-500">
                      {selectedGoal.currentAmount.toLocaleString()} / {selectedGoal.targetAmount.toLocaleString()} XP
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-emerald-600 font-medium">
                      {Math.round((selectedGoal.currentAmount / selectedGoal.targetAmount) * 100)}%
                    </p>
                  </div>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((selectedGoal.currentAmount / selectedGoal.targetAmount) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Amount Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">Amount to Save</p>
                <p className="text-sm text-gray-500">Available: {availableXP.toLocaleString()} 🪙</p>
              </div>
              
              <div className="p-4 rounded-xl bg-white border border-gray-200">
                <div className="text-3xl font-bold text-center text-emerald-600 mb-4">
                  {depositAmount.toLocaleString()} XP
                </div>
                <Slider
                  value={[depositAmount]}
                  onValueChange={(value) => setDepositAmount(value[0])}
                  min={10}
                  max={availableXP}
                  step={10}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>10 🪙</span>
                  <span>{availableXP.toLocaleString()} 🪙</span>
                </div>
              </div>

              {/* Quick Select */}
              <div className="flex gap-2">
                {[25, 50, 75, 100].map((percent) => {
                  const amount = Math.floor(availableXP * (percent / 100));
                  if (amount < 10) return null;
                  return (
                    <Button
                      key={percent}
                      variant="outline"
                      size="sm"
                      onClick={() => setDepositAmount(amount)}
                      className={depositAmount === amount ? "border-emerald-500 bg-emerald-50" : ""}
                    >
                      {percent}%
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Interest Preview */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <p className="text-sm font-semibold text-emerald-700 mb-2">What You'll Earn</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-gray-500">Tomorrow</p>
                  <p className="font-bold text-emerald-600">
                    +{Math.floor(depositAmount * interestRate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">In 7 days</p>
                  <p className="font-bold text-emerald-600">
                    +{Math.floor(depositAmount * interestRate * 7)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">In 30 days</p>
                  <p className="font-bold text-emerald-600">
                    +{Math.floor(depositAmount * interestRate * 30)}
                  </p>
                </div>
              </div>
            </div>

            {/* Deposit Button */}
            <Button
              onClick={() => selectedGoal && deposit(selectedGoal.id, depositAmount)}
              disabled={depositAmount < 10 || depositAmount > availableXP}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3"
            >
              <PiggyBank className="h-4 w-4 mr-2" />
              Save {depositAmount.toLocaleString()} XP
            </Button>

            {/* Withdraw Option */}
            {selectedGoal && selectedGoal.currentAmount > 0 && (
              <Button
                onClick={() => withdraw(selectedGoal.id, selectedGoal.currentAmount)}
                variant="outline"
                className="w-full border-gray-300 text-gray-600"
              >
                <Unlock className="h-4 w-4 mr-2" />
                Withdraw All ({selectedGoal.currentAmount.toLocaleString()} 🪙)
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* New Goal Modal */}
      <Dialog open={showGoalModal} onOpenChange={setShowGoalModal}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-2 border-emerald-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-emerald-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Create Savings Goal
              </span>
            </DialogTitle>
            <DialogDescription>
              Set a target and watch your savings grow!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Suggested Goals */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Quick Start</p>
              <div className="grid grid-cols-2 gap-2">
                {SUGGESTED_GOALS.map((goal) => (
                  <button
                    key={goal.name}
                    onClick={() => {
                      setNewGoalName(goal.name);
                      setNewGoalTarget(goal.target);
                      setNewGoalEmoji(goal.emoji);
                    }}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      newGoalName === goal.name
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-200 bg-white hover:border-emerald-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span>{goal.emoji}</span>
                      <span className="font-medium text-gray-900 text-sm">{goal.name}</span>
                    </div>
                    <p className="text-xs text-gray-500">{goal.target.toLocaleString()} 🪙</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Goal */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Goal Name</label>
                <input
                  type="text"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  placeholder="e.g., New Headphones"
                  className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Target Amount</label>
                <div className="mt-1 p-3 rounded-xl bg-white border border-gray-200">
                  <div className="text-2xl font-bold text-center text-emerald-600 mb-2">
                    {newGoalTarget.toLocaleString()} XP
                  </div>
                  <Slider
                    value={[newGoalTarget]}
                    onValueChange={(value) => setNewGoalTarget(value[0])}
                    min={100}
                    max={10000}
                    step={100}
                  />
                </div>
              </div>

              {/* Emoji Picker */}
              <div>
                <label className="text-sm font-medium text-gray-700">Choose an Icon</label>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {["🎯", "💰", "🛡️", "🎮", "📱", "👟", "🎧", "✈️", "🎁", "⭐"].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setNewGoalEmoji(emoji)}
                      className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                        newGoalEmoji === emoji
                          ? "bg-emerald-100 border-2 border-emerald-500"
                          : "bg-gray-100 border-2 border-transparent hover:bg-gray-200"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Create Button */}
            <Button
              onClick={() => createGoal(newGoalName, newGoalTarget, newGoalEmoji)}
              disabled={!newGoalName || newGoalTarget < 100}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3"
            >
              <Target className="h-4 w-4 mr-2" />
              Create Goal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SavingsVault;

