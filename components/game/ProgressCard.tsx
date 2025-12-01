import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MetricsGrid, MetricItem } from "@/components/shared/MetricsGrid";
import { Trophy, Users, Star, Zap } from "lucide-react";
import { DailyStreak } from "@/components/gamification/DailyStreak";
import { levelTitles } from "@/components/gamification/LevelUpCelebration";

interface ProgressCardProps {
  playerXP: number;
  completedCount: number;
  availableCount: number;
  playerLevel?: number;
  maxXP?: number;
  onStreakBonusClaimed?: (bonus: number) => void;
}

export function ProgressCard({ 
  playerXP, 
  completedCount, 
  availableCount,
  playerLevel = 1,
  maxXP = 1000,
  onStreakBonusClaimed,
}: ProgressCardProps) {
  const xpInLevel = playerXP % maxXP;
  const xpProgress = (xpInLevel / maxXP) * 100;
  const xpNeeded = maxXP - xpInLevel;
  
  const levelInfo = levelTitles[playerLevel] || levelTitles[1];
  const nextLevelInfo = levelTitles[playerLevel + 1];

  const progressMetrics: MetricItem[] = [
    {
      id: "completed",
      icon: <Trophy className="h-6 w-6 text-emerald-400" />,
      title: "Missions Crushed 💪",
      value: completedCount,
    },
    {
      id: "available",
      icon: <Users className="h-6 w-6 text-teal-400" />,
      title: "Ready to Play 🎮",
      value: availableCount,
    },
  ];

  return (
    <div className="space-y-4 mt-6">
      {/* Daily Streak Card */}
      <DailyStreak onBonusClaimed={onStreakBonusClaimed} />
      
      {/* Progress Card */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <Trophy className="h-5 w-5 text-amber-400" />
            Your Progress 📊
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Level Display */}
            <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
              <div className={`bg-gradient-to-br ${levelInfo.color} rounded-full p-2`}>
                {levelInfo.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-100">
                    Level {playerLevel}
                  </span>
                  <span className="text-sm text-slate-400">
                    {levelInfo.title}
                  </span>
                </div>
                {nextLevelInfo && (
                  <p className="text-xs text-slate-500">
                    Next: {nextLevelInfo.title}
                  </p>
                )}
              </div>
            </div>
            
            {/* XP Progress */}
            <div>
              <div className="flex justify-between text-sm mb-2 text-slate-300">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-400" />
                  <span>Experience Points</span>
                </div>
                <span className="text-emerald-400 font-medium">
                  {xpInLevel.toLocaleString()}/{maxXP.toLocaleString()}
                </span>
              </div>
              <Progress value={xpProgress} className="h-3 bg-slate-700" />
              <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                <Zap className="h-3 w-3" />
                <span>{xpNeeded.toLocaleString()} XP to Level {playerLevel + 1}</span>
              </div>
            </div>
            
            <MetricsGrid metrics={progressMetrics} columns={2} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}