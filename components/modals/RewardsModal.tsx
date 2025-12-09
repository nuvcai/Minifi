"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Gift, 
  Clock, 
  Star, 
  Sparkles, 
  Zap, 
  Trophy,
  TrendingUp,
  Target,
  Rocket,
} from "lucide-react";
import { Reward, rewardsStore } from "@/components/data/rewards";

interface RewardsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playerXP: number;
  redeemedRewards: string[];
  onRedeemReward: (reward: Reward) => void;
}

// Level progression thresholds
const XP_MILESTONES = [
  { xp: 100, label: "First Steps", icon: "🌱" },
  { xp: 500, label: "Getting Started", icon: "🚀" },
  { xp: 1000, label: "On Track", icon: "⭐" },
  { xp: 2500, label: "Rising Star", icon: "🌟" },
  { xp: 5000, label: "Investor Pro", icon: "💎" },
  { xp: 10000, label: "Market Master", icon: "👑" },
];

export function RewardsModal({
  open,
  onOpenChange,
  playerXP,
}: RewardsModalProps) {
  const [animatedXP, setAnimatedXP] = useState(0);
  
  // Animate XP counter on open
  useEffect(() => {
    if (open) {
      setAnimatedXP(0);
      const duration = 1500;
      const steps = 60;
      const stepValue = playerXP / steps;
      let current = 0;
      
      const interval = setInterval(() => {
        current++;
        if (current >= steps) {
          setAnimatedXP(playerXP);
          clearInterval(interval);
        } else {
          setAnimatedXP(Math.round(stepValue * current));
        }
      }, duration / steps);
      
      return () => clearInterval(interval);
    }
  }, [open, playerXP]);
  
  // Get current milestone
  const currentMilestone = XP_MILESTONES.reduce((acc, milestone) => {
    return playerXP >= milestone.xp ? milestone : acc;
  }, XP_MILESTONES[0]);
  
  const nextMilestone = XP_MILESTONES.find(m => m.xp > playerXP) || XP_MILESTONES[XP_MILESTONES.length - 1];
  const progressToNext = Math.min(100, ((playerXP - (currentMilestone?.xp || 0)) / (nextMilestone.xp - (currentMilestone?.xp || 0))) * 100);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-[95vw] p-0 overflow-hidden bg-gradient-to-b from-amber-50 via-white to-orange-50 border-2 border-amber-200">
        {/* Light animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-100/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        </div>
        
        <div className="relative p-4 sm:p-6 space-y-5">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-3 text-2xl sm:text-3xl">
              <div className="relative">
                <Gift className="h-8 w-8 text-amber-500 animate-bounce" style={{ animationDuration: '2s' }} />
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 animate-pulse" />
              </div>
              <span className="font-black bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                Rewards Store
              </span>
            </DialogTitle>
          </DialogHeader>

          {/* XP Treasury - Light Theme */}
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100" />
            <div className="relative p-5 border-2 border-amber-200 rounded-2xl shadow-lg shadow-amber-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-amber-700 text-sm font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    Your XP Treasury
                  </p>
                  <p className="text-4xl sm:text-5xl font-black text-gray-900 mt-1 tabular-nums">
                    {animatedXP.toLocaleString()}
                    <span className="text-amber-500 text-2xl ml-2">XP</span>
                  </p>
                </div>
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 flex items-center justify-center shadow-xl shadow-amber-200/50">
                    <Star className="h-8 w-8 text-white fill-white" />
                  </div>
                  {playerXP >= 1000 && (
                    <Trophy className="absolute -bottom-1 -right-1 h-6 w-6 text-amber-500 fill-amber-400" />
                  )}
                </div>
              </div>
              
              {/* Progress to next milestone */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-amber-600 flex items-center gap-1">
                    <span>{currentMilestone.icon}</span>
                    {currentMilestone.label}
                  </span>
                  <span className="text-amber-600 flex items-center gap-1">
                    {nextMilestone.icon}
                    {nextMilestone.label}
                  </span>
                </div>
                <div className="h-3 bg-amber-100 rounded-full overflow-hidden border border-amber-200">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 rounded-full transition-all duration-1000 relative"
                    style={{ width: `${progressToNext}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                  </div>
                </div>
                <p className="text-xs text-amber-600 text-center font-medium">
                  {nextMilestone.xp - playerXP} 🪙 to {nextMilestone.label}
                </p>
              </div>
            </div>
          </div>

          {/* Coming Soon - Light Card */}
          <Card className="bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 border-2 border-indigo-200 shadow-lg shadow-indigo-100 overflow-hidden relative">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 right-0 w-40 h-40 bg-violet-200/30 rounded-full blur-2xl" />
            </div>
            <CardContent className="p-6 relative">
              <div className="text-center space-y-4">
                {/* Animated rocket icon */}
                <div className="relative mx-auto w-24 h-24">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-300 to-violet-300 rounded-full blur-xl opacity-50 animate-pulse" />
                  <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-500 rounded-full flex items-center justify-center shadow-xl shadow-indigo-200">
                    <Rocket className="h-12 w-12 text-white animate-bounce" style={{ animationDuration: '3s' }} />
                  </div>
                  <div className="absolute -top-2 -right-2 px-2.5 py-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full shadow-lg">
                    <span className="text-xs font-bold text-white">NEW</span>
                  </div>
                </div>
                
                <div>
                  <Badge className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white border-0 px-4 py-1.5 text-sm font-bold mb-3 shadow-lg">
                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                    Launching Soon
                  </Badge>
                  <h3 className="text-xl font-black text-gray-900 mb-2">
                    Real Rewards Incoming! 🎁
                  </h3>
                  <p className="text-sm text-gray-600 max-w-sm mx-auto">
                    Trade your 🪙 iii for real gift cards, subscriptions, and exclusive experiences. 
                    Keep stacking that iii!
                  </p>
                </div>

                {/* Animated reward previews */}
                <div className="flex justify-center gap-3 pt-3">
                  {rewardsStore.slice(0, 5).map((reward, index) => (
                    <div 
                      key={reward.id}
                      className="w-14 h-14 rounded-xl bg-white/80 backdrop-blur border-2 border-indigo-100 flex items-center justify-center text-2xl shadow-md hover:scale-110 hover:border-indigo-300 hover:shadow-lg transition-all cursor-pointer group"
                      style={{ 
                        animation: 'float 3s ease-in-out infinite',
                        animationDelay: `${index * 0.2}s`
                      }}
                    >
                      <span className="group-hover:scale-125 transition-transform">{reward.image}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How It Works - Light Theme */}
          <Card className="bg-white border-2 border-gray-200 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-gray-700">
                <Target className="h-4 w-4 text-indigo-500" />
                How to Earn Rewards
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-sm">
              {[
                { icon: <Trophy className="h-4 w-4 text-amber-500" />, text: "Complete missions", bg: "bg-amber-50 border-amber-200" },
                { icon: <Zap className="h-4 w-4 text-orange-500" />, text: "Daily streaks", bg: "bg-orange-50 border-orange-200" },
                { icon: <Star className="h-4 w-4 text-violet-500" />, text: "Earn iii badges", bg: "bg-violet-50 border-violet-200" },
                { icon: <TrendingUp className="h-4 w-4 text-emerald-500" />, text: "Level up faster", bg: "bg-emerald-50 border-emerald-200" },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-2 p-2.5 rounded-xl border ${item.bg}`}>
                  {item.icon}
                  <span className="text-gray-700 text-xs font-medium">{item.text}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* CTA Button */}
          <Button 
            onClick={() => onOpenChange(false)}
            className="w-full py-6 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 hover:from-indigo-600 hover:via-violet-600 hover:to-purple-600 text-white font-bold text-lg shadow-xl shadow-indigo-200 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <Sparkles className="h-5 w-5 mr-2" />
            Keep Earning 🪙!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
