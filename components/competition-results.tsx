"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  BarChart3,
  Target,
  Crown,
  Flame,
  Clock,
  ChevronUp,
  Shield,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { LeagueSystem } from "@/components/gamification";

interface CompetitionResultsProps {
  finalValue: number;
  totalReturn: number;
  onBackToHome: () => void;
}

export default function CompetitionResults({
  finalValue,
  totalReturn,
  onBackToHome,
}: CompetitionResultsProps) {
  const [activeTab, setActiveTab] = useState("league");
  const [userLeague, setUserLeague] = useState("gold");
  const [userRank, setUserRank] = useState(4);
  
  const profit = finalValue - 1000;

  // Calculate user rank based on return
  useEffect(() => {
    if (totalReturn >= 15) {
      setUserRank(1);
      setUserLeague("diamond");
    } else if (totalReturn >= 12) {
      setUserRank(2);
      setUserLeague("platinum");
    } else if (totalReturn >= 9) {
      setUserRank(3);
      setUserLeague("gold");
    } else if (totalReturn >= 6) {
      setUserRank(4);
      setUserLeague("gold");
    } else if (totalReturn >= 3) {
      setUserRank(7);
      setUserLeague("silver");
    } else {
      setUserRank(10);
      setUserLeague("bronze");
    }
  }, [totalReturn]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <Trophy className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
    } else if (rank <= 10) {
      return "bg-gradient-to-r from-blue-500 to-blue-600 text-white";
    } else {
      return "bg-muted text-muted-foreground";
    }
  };

  // Get zone based on rank
  const getZone = () => {
    if (userRank <= 10) return "promotion";
    if (userRank > 25) return "danger";
    return "safe";
  };

  const zone = getZone();

  return (
    <div className="relative">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full mb-3 sm:mb-4">
            <Trophy className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">
            Competition Results
          </h1>
          <p className="text-base sm:text-lg text-white/50">
            Congratulations on completing the investment competition!
          </p>
        </div>

        {/* User Performance Summary */}
        <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
          <Card className="bg-gradient-to-br from-card to-card/80 border-2 border-primary/20 shadow-xl">
            <CardHeader className="text-center pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-2xl font-serif text-foreground flex items-center justify-center gap-1 sm:gap-2">
                <Target className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                Your Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                    Final Assets
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">
                    ${finalValue.toFixed(2)}
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {totalReturn >= 0 ? (
                      <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-chart-1" />
                    ) : (
                      <TrendingDown className="h-6 w-6 sm:h-8 sm:w-8 text-chart-2" />
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                    Total Return
                  </p>
                  <p
                    className={`text-lg sm:text-2xl font-bold ${
                      totalReturn >= 0 ? "text-chart-1" : "text-chart-2"
                    }`}
                  >
                    {totalReturn >= 0 ? "+" : ""}
                    {totalReturn.toFixed(2)}%
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-secondary" />
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                    P&L Amount
                  </p>
                  <p
                    className={`text-lg sm:text-2xl font-bold ${
                      profit >= 0 ? "text-chart-1" : "text-chart-2"
                    }`}
                  >
                    {profit >= 0 ? "+" : ""}${profit.toFixed(2)}
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {getRankIcon(userRank)}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                    League Rank
                  </p>
                  <Badge
                    className={`text-sm sm:text-lg px-2 sm:px-3 py-1 ${getRankBadge(
                      userRank
                    )}`}
                  >
                    #{userRank}
                  </Badge>
                </div>
              </div>
              
              {/* Zone Status */}
              <div className="mt-4 flex justify-center">
                <div className={`
                  flex items-center gap-2 px-4 py-2 rounded-full
                  ${zone === 'promotion' ? 'bg-emerald-500/20 border border-emerald-500/30' : ''}
                  ${zone === 'safe' ? 'bg-blue-500/20 border border-blue-500/30' : ''}
                  ${zone === 'danger' ? 'bg-red-500/20 border border-red-500/30' : ''}
                `}>
                  {zone === 'promotion' && <ChevronUp className="h-4 w-4 text-emerald-400" />}
                  {zone === 'safe' && <Shield className="h-4 w-4 text-blue-400" />}
                  {zone === 'danger' && <AlertTriangle className="h-4 w-4 text-red-400" />}
                  <span className={`text-sm font-medium
                    ${zone === 'promotion' ? 'text-emerald-400' : ''}
                    ${zone === 'safe' ? 'text-blue-400' : ''}
                    ${zone === 'danger' ? 'text-red-400' : ''}
                  `}>
                    {zone === 'promotion' && '🚀 Promotion Zone - Great job!'}
                    {zone === 'safe' && '🛡️ Safe Zone'}
                    {zone === 'danger' && '⚠️ Danger Zone'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboards - Now with KEEP-Style Leagues */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="bg-card border-border shadow-lg overflow-hidden">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-lg sm:text-2xl font-serif text-foreground flex items-center gap-1 sm:gap-2">
                <Users className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                League Standings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 rounded-none border-b border-border">
                  <TabsTrigger
                    value="league"
                    className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm rounded-none data-[state=active]:bg-primary/10"
                  >
                    <Crown className="h-3 w-3 sm:h-4 sm:w-4" />
                    Your League
                  </TabsTrigger>
                  <TabsTrigger
                    value="all"
                    className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm rounded-none data-[state=active]:bg-primary/10"
                  >
                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                    All Leagues
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="league" className="mt-0">
                  <LeagueSystem 
                    currentLeagueId={userLeague}
                    currentUserRank={userRank}
                    onEarnXp={onBackToHome}
                  />
                </TabsContent>

                <TabsContent value="all" className="mt-0 p-4">
                  <div className="space-y-3">
                    {[
                      { id: 'diamond', name: 'Diamond League', emoji: '👑', color: 'from-cyan-500/30 to-blue-500/30', border: 'border-cyan-400/50' },
                      { id: 'platinum', name: 'Platinum League', emoji: '💎', color: 'from-violet-500/30 to-purple-500/30', border: 'border-violet-400/50' },
                      { id: 'gold', name: 'Gold League', emoji: '🥇', color: 'from-yellow-500/30 to-amber-500/30', border: 'border-yellow-400/50' },
                      { id: 'silver', name: 'Silver League', emoji: '🥈', color: 'from-slate-400/30 to-gray-500/30', border: 'border-slate-400/50' },
                      { id: 'bronze', name: 'Bronze League', emoji: '🥉', color: 'from-amber-700/30 to-orange-600/30', border: 'border-amber-600/50' },
                    ].map((league) => (
                      <div
                        key={league.id}
                        className={`
                          p-4 rounded-xl border transition-all
                          bg-gradient-to-r ${league.color} ${league.border}
                          ${league.id === userLeague ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'opacity-70'}
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{league.emoji}</span>
                            <div>
                              <h4 className="font-bold text-foreground">{league.name}</h4>
                              <p className="text-xs text-muted-foreground">
                                {league.id === userLeague ? 'You are here!' : 'Unlock by earning more XP'}
                              </p>
                            </div>
                          </div>
                          {league.id === userLeague && (
                            <Badge className="bg-primary text-primary-foreground">
                              Current
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <Button
            onClick={onBackToHome}
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-semibold shadow-lg"
          >
            <Flame className="h-5 w-5 mr-2" />
            Continue Journey
          </Button>
        </div>
      </div>
    </div>
  );
}
