/**
 * PersonalizedJourneyHeader - Personalized welcome for Tee
 * Light theme - Family Office inspired learning journey header
 * © 2025 NUVC.AI. All Rights Reserved.
 */

"use client";

import React, { useState, useEffect } from "react";
import { 
  Rocket, 
  Target, 
  Flame, 
  Trophy,
  Sparkles,
  Crown,
  Zap,
  Heart,
  GraduationCap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PersonalizedJourneyHeaderProps {
  userName?: string;
  playerLevel: number;
  completedMissions: number;
  totalMissions: number;
  streakDays: number;
  totalXP: number;
}

const encouragementMessages = [
  { threshold: 0, message: "Your wealth journey begins! Every expert was once a beginner 🌱", icon: Rocket },
  { threshold: 1, message: "First mission done! You're learning how FOs think 📚", icon: Target },
  { threshold: 2, message: "Building momentum! Consistency beats intensity 🔥", icon: Flame },
  { threshold: 3, message: "Pattern spotter! You're connecting the dots across history 🧠", icon: Sparkles },
  { threshold: 4, message: "Almost there! Real FO knowledge in the making 👑", icon: Crown },
  { threshold: 5, message: "Mastery achieved! You think like Family Office pros 🏆", icon: Trophy },
];

const timeBasedGreetings = [
  { start: 5, end: 12, greeting: "Good morning" },
  { start: 12, end: 17, greeting: "Good afternoon" },
  { start: 17, end: 21, greeting: "Good evening" },
  { start: 21, end: 5, greeting: "Burning the midnight oil" },
];

export function PersonalizedJourneyHeader({
  userName = "Tee",
  playerLevel,
  completedMissions,
  totalMissions,
  streakDays,
  totalXP,
}: PersonalizedJourneyHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    setIsVisible(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  
  const hour = currentTime.getHours();
  const greeting = timeBasedGreetings.find(g => 
    g.start < g.end 
      ? hour >= g.start && hour < g.end
      : hour >= g.start || hour < g.end
  )?.greeting || "Welcome back";
  
  const encouragement = encouragementMessages.reduce((acc, curr) => 
    completedMissions >= curr.threshold ? curr : acc
  , encouragementMessages[0]);
  
  const EncouragementIcon = encouragement.icon;
  
  const progressPercent = (completedMissions / totalMissions) * 100;
  const levelTitle = playerLevel < 3 ? "Apprentice" : playerLevel < 5 ? "Strategist" : playerLevel < 8 ? "Analyst" : "FO Master";

  return (
    <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
      {/* Main Hero Card - Light Theme */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-violet-100 p-6 md:p-8 shadow-xl shadow-violet-100/50">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-violet-100/50 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-100/40 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-purple-100/30 rounded-full blur-2xl" />
        </div>
        
        <div className="relative z-10">
          {/* Top row - Greeting + Stats */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            {/* Left: Personal greeting */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-violet-500 text-sm font-medium">{greeting},</span>
                <Heart className="h-3.5 w-3.5 text-rose-400 fill-rose-400 animate-pulse" />
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">
                Welcome back, <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">{userName}</span>!
              </h1>
              <p className="text-gray-500 text-sm flex items-center gap-2">
                <EncouragementIcon className="h-4 w-4 text-violet-500" />
                {encouragement.message}
              </p>
            </div>
            
            {/* Right: Quick stats badges */}
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 border border-violet-200 px-3 py-1.5">
                <Crown className="h-3.5 w-3.5 mr-1.5 text-violet-500" />
                Level {playerLevel} {levelTitle}
              </Badge>
              {streakDays > 0 && (
                <Badge className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border border-orange-200 px-3 py-1.5">
                  <Flame className="h-3.5 w-3.5 mr-1.5 text-orange-500" />
                  {streakDays} Day Streak
                </Badge>
              )}
              <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border border-amber-200 px-3 py-1.5">
                <Zap className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
                {totalXP.toLocaleString()} XP
              </Badge>
            </div>
          </div>
          
          {/* Journey Progress Section */}
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl border border-violet-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-violet-600" />
                <span className="text-gray-700 text-sm font-semibold">Your FO Learning Journey</span>
              </div>
              <span className="text-violet-600 text-sm font-bold">
                {completedMissions}/{totalMissions} Missions
              </span>
            </div>
            
            {/* Progress Bar with milestones */}
            <div className="relative">
              <div className="h-3 bg-violet-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 rounded-full transition-all duration-1000 relative"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
              </div>
              
              {/* Milestone markers */}
              <div className="absolute -top-1 left-0 right-0 flex justify-between px-0.5">
                {[0, 25, 50, 75, 100].map((milestone, i) => (
                  <div 
                    key={milestone}
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all duration-300 ${
                      progressPercent >= milestone
                        ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-300"
                        : "bg-violet-100 text-violet-400 border border-violet-200"
                    }`}
                    style={{ transform: `translateX(${i === 0 ? '0' : i === 4 ? '-100%' : '-50%'})`}}
                  >
                    {i === 4 ? "🏆" : i + 1}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Era Labels */}
            <div className="flex justify-between mt-3 text-[10px] text-gray-400">
              <span>1990s Era</span>
              <span>2000s Crisis</span>
              <span>Modern Era</span>
            </div>
          </div>
          
          {/* Wisdom Quote */}
          <div className="mt-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/50">
            <p className="text-amber-700 text-xs italic text-center">
              "The best time to plant a tree was 20 years ago. The second best time is now."
              <span className="text-amber-500 ml-2">— Chinese Proverb</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
