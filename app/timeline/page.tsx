/**
 * Mini.Fi Timeline Page
 * Light, fun game interface with all features
 * © 2025 NUVC.AI. All Rights Reserved.
 */

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Trophy, Star, Zap, Target, ChevronRight } from "lucide-react";

// Components
import { GameHeader } from "@/components/game/GameHeader";
import { CoachSidebar } from "@/components/game/CoachSidebar";
import { TimelineSection } from "@/components/game/TimelineSection";
import { EventDetailModal } from "@/components/modals/EventDetailModal";
import { MissionModal } from "@/components/modals/MissionModal";
import { SummaryModal } from "@/components/modals/SummaryModal";
import { RewardsModal } from "@/components/modals/RewardsModal";
import { LevelUpCelebration } from "@/components/gamification/LevelUpCelebration";
import { DailyStreak } from "@/components/gamification/DailyStreak";
import { DailyWisdom } from "@/components/library/DailyWisdom";

// Data
import { financialEvents, FinancialEvent } from "@/components/data/events";
import { aiCoaches } from "@/components/data/coaches";
import { missionData } from "@/components/data/missions";

// Local storage keys
const GAME_PROGRESS_KEY = "minifi_game_progress";
const USER_EMAIL_KEY = "minifi_user_email";
const SESSION_KEY = "minifi_session_id";

// Generate or get session ID for anonymous users
const getOrCreateSessionId = () => {
  if (typeof window === 'undefined') return null;
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

export default function TimelinePage() {
  // State
  const [selectedEvent, setSelectedEvent] = useState<FinancialEvent | null>(null);
  const [missionEvent, setMissionEvent] = useState<FinancialEvent | null>(null);
  const [selectedCoach, setSelectedCoach] = useState(aiCoaches[0]);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [playerXP, setPlayerXP] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryDismissed, setSummaryDismissed] = useState(false);
  const summaryTimerRef = useRef<number | null>(null);
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [competitionUnlocked, setCompetitionUnlocked] = useState(false);
  const [showRewardsStore, setShowRewardsStore] = useState(false);
  const [redeemedRewards, setRedeemedRewards] = useState<string[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState({ newLevel: 1, previousLevel: 0 });
  const [missionStep, setMissionStep] = useState<"intro" | "decision" | "result">("intro");
  const [selectedInvestment, setSelectedInvestment] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [missionResult, setMissionResult] = useState<any>(null);

  // Load saved progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      const savedEmail = localStorage.getItem(USER_EMAIL_KEY);
      const sessionId = getOrCreateSessionId(); // Create session ID if needed
      
      let dbXP = 0;
      let dbLevel = 1;
      let loadedFromDb = false;
      
      // Try to load from database first
      if (savedEmail || sessionId) {
        try {
          const params = new URLSearchParams();
          if (savedEmail) params.append('email', savedEmail);
          else if (sessionId) params.append('sessionId', sessionId);
          
          const response = await fetch(`/api/streak?${params.toString()}`);
          const result = await response.json();
          
          if (result.success && result.data) {
            const data = result.data;
            if (data.totalXP > 0) {
              dbXP = data.totalXP;
              dbLevel = data.playerLevel || Math.floor(data.totalXP / 1000) + 1;
              loadedFromDb = true;
            }
          }
        } catch (e) {
          console.log("Falling back to localStorage for game progress");
        }
      }
      
      // Also check localStorage for completed missions and compare XP
      try {
        const saved = localStorage.getItem(GAME_PROGRESS_KEY);
        if (saved) {
          const progress = JSON.parse(saved);
          if (progress.completedMissions) {
            setCompletedMissions(progress.completedMissions);
            // Restore completed status on events
            progress.completedMissions.forEach((title: string) => {
              const event = financialEvents.find(e => e.title === title);
              if (event) event.completed = true;
            });
            updateUnlockStatus();
          }
          
          // Use higher XP value between DB and localStorage
          const localXP = progress.playerXP || 0;
          const localLevel = progress.playerLevel || 1;
          
          if (localXP > dbXP) {
            setPlayerXP(localXP);
            setTotalScore(localXP);
            setPlayerLevel(localLevel);
          } else if (loadedFromDb) {
            setPlayerXP(dbXP);
            setTotalScore(dbXP);
            setPlayerLevel(dbLevel);
          }
        } else if (loadedFromDb) {
          // No local storage, use DB values
          setPlayerXP(dbXP);
          setTotalScore(dbXP);
          setPlayerLevel(dbLevel);
        }
      } catch (e) {
        console.error("Failed to load game progress:", e);
        // Still apply DB values if available
        if (loadedFromDb) {
          setPlayerXP(dbXP);
          setTotalScore(dbXP);
          setPlayerLevel(dbLevel);
        }
      }
    };
    
    loadProgress();
  }, []);

  // Save progress to localStorage and database when it changes
  const saveProgress = async (xp: number, level: number, missions: string[]) => {
    // Save to localStorage
    const progress = {
      playerXP: xp,
      playerLevel: level,
      completedMissions: missions,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(GAME_PROGRESS_KEY, JSON.stringify(progress));
    
    // Sync to database - always try (will create profile if needed)
    const savedEmail = localStorage.getItem(USER_EMAIL_KEY);
    const sessionId = getOrCreateSessionId();
    
    if (savedEmail || sessionId) {
      try {
        await fetch('/api/streak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'sync',
            email: savedEmail,
            sessionId,
            streakData: {
              totalXP: xp,
              playerLevel: level,
              completedMissions: missions,
            },
          }),
        });
      } catch (e) {
        console.log("Failed to sync progress to database");
      }
    }
  };

  const updateUnlockStatus = () => {
    financialEvents.forEach((event) => {
      if (event.unlockRequirements.length > 0) {
        const allRequirementsMet = event.unlockRequirements.every((requiredYear) => {
          const requiredEvent = financialEvents.find((e) => e.year === requiredYear);
          return requiredEvent?.completed === true;
        });
        event.unlocked = allRequirementsMet;
      }
    });
  };

  const allMissionsCompleted = financialEvents.every((event) => event.completed);

  useEffect(() => {
    updateUnlockStatus();
  }, []);

  useEffect(() => {
    if (allMissionsCompleted && !showSummary && !summaryDismissed) {
      summaryTimerRef.current = window.setTimeout(() => {
        setShowSummary(true);
      }, 1000);
    }
    return () => {
      if (summaryTimerRef.current) {
        clearTimeout(summaryTimerRef.current);
        summaryTimerRef.current = null;
      }
    };
  }, [allMissionsCompleted, showSummary, summaryDismissed]);

  const handleEventClick = async (event: FinancialEvent) => {
    if (event.unlocked) {
      setSelectedEvent(event);
    }
  };

  const startMission = (event: FinancialEvent) => {
    setSelectedEvent(null);
    setMissionEvent(event);
    setGameStarted(true);
    setMissionStep("intro");
  };

  const makeInvestment = async (optionId: string) => {
    if (!missionEvent) return;
    const mission = missionData[missionEvent.year as keyof typeof missionData];
    const option = mission?.options.find((opt) => opt.id === optionId);

    if (option) {
      setSelectedInvestment(optionId);

      const getCoachAdjustedReturn = (baseReturn: number, coachPersonality: string) => {
        const adjustmentFactors: Record<string, number> = {
          "Conservative Coach": 0.8,
          "Balanced Coach": 1.0,
          "Aggressive Coach": 1.3,
          "Income Coach": 0.9,
        };
        const factor = adjustmentFactors[coachPersonality] || 1.0;
        const randomFactor = 0.9 + Math.random() * 0.2;
        const adjustedReturn = baseReturn * factor * randomFactor;
        return Math.max(-0.8, Math.min(2.0, adjustedReturn));
      };

      const adjustedReturn = getCoachAdjustedReturn(option.actualReturn, selectedCoach.personality);
      const finalAmount = 10000 * (1 + adjustedReturn);
      const performance = adjustedReturn > 0 ? "profit" : "loss";

      setMissionResult({
        option,
        actualReturn: adjustedReturn,
        finalAmount,
        performance,
      });

      setMissionStep("result");
    }
  };

  const completeMission = () => {
    if (missionEvent && missionResult) {
      const missionReward = missionEvent.reward;
      const newXP = playerXP + missionReward;
      const newMissions = [...completedMissions, missionEvent.title];

      setPlayerXP(newXP);
      setTotalScore(newXP);
      setCompletedMissions(newMissions);

      const eventIndex = financialEvents.findIndex((e) => e.year === missionEvent.year);
      if (eventIndex !== -1) {
        financialEvents[eventIndex].completed = true;
        updateUnlockStatus();
      }

      const newLevel = Math.floor(newXP / 1000) + 1;
      if (newLevel > playerLevel) {
        setLevelUpInfo({ newLevel, previousLevel: playerLevel });
        setPlayerLevel(newLevel);
        setTimeout(() => setShowLevelUp(true), 500);
        // Save with new level
        saveProgress(newXP, newLevel, newMissions);
      } else {
        // Save with current level
        saveProgress(newXP, playerLevel, newMissions);
      }

      if (missionEvent.year === 2025 && missionEvent.title === "Current Challenges") {
        setCompetitionUnlocked(true);
      }

      closeMissionModal();
    }
  };

  const startCompetition = () => {
    window.location.href = "/competition";
  };

  const redeemReward = (reward: { id: string; cost: number }) => {
    if (playerXP >= reward.cost && !redeemedRewards.includes(reward.id)) {
      const newXP = playerXP - reward.cost;
      setPlayerXP(newXP);
      setTotalScore(newXP); // Keep score in sync with XP
      setRedeemedRewards((prev) => [...prev, reward.id]);
      // Save progress after redeeming
      saveProgress(newXP, playerLevel, completedMissions);
    }
  };

  const handleXpEarned = (amount: number) => {
    const newXP = playerXP + amount;
    setPlayerXP(newXP);
    setTotalScore(newXP);
    
    const newLevel = Math.floor(newXP / 1000) + 1;
    if (newLevel > playerLevel) {
      setPlayerLevel(newLevel);
    }
    
    // Save progress
    saveProgress(newXP, Math.max(newLevel, playerLevel), completedMissions);
  };

  const handleStreakBonus = (bonus: number) => {
    const newXP = playerXP + bonus;
    setPlayerXP(newXP);
    setTotalScore(newXP);
    
    const newLevel = Math.floor(newXP / 1000) + 1;
    if (newLevel > playerLevel) {
      setPlayerLevel(newLevel);
    }
    
    // Save progress
    saveProgress(newXP, Math.max(newLevel, playerLevel), completedMissions);
  };

  const closeMissionModal = () => {
    setGameStarted(false);
    setMissionEvent(null);
    setMissionStep("intro");
    setSelectedInvestment(null);
    setMissionResult(null);
  };

  const currentMission = missionEvent
    ? missionData[missionEvent.year as keyof typeof missionData]
    : null;

  const completedCount = financialEvents.filter((e) => e.completed).length;
  const availableCount = financialEvents.filter((e) => e.unlocked && !e.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-violet-50">
      {/* Fun background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-violet-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-purple-200/20 rounded-full blur-3xl" />
      </div>
      
      <div className="relative">
        <GameHeader
          playerLevel={playerLevel}
          playerXP={playerXP}
          totalScore={totalScore}
          onRewardsClick={() => setShowRewardsStore(true)}
        />

        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
            
            {/* Sidebar - All Features */}
            <div className="lg:col-span-1 space-y-5">
              
              {/* Coach Selection */}
              <CoachSidebar
                coaches={aiCoaches}
                selectedCoach={selectedCoach}
                onCoachSelect={setSelectedCoach}
              />

              {/* Daily Streak */}
              <DailyStreak onBonusClaimed={handleStreakBonus} />

              {/* Progress Card */}
              <div className="p-5 rounded-2xl bg-white shadow-xl shadow-indigo-100 border border-indigo-100">
                <h3 className="text-sm font-semibold text-gray-500 mb-4 flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  Your Progress
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Missions</span>
                    <span className="font-bold text-gray-900">
                      {completedCount} / {financialEvents.length}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                      style={{ width: `${(completedCount / financialEvents.length) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Available</span>
                    <span className="font-bold text-indigo-600">{availableCount} 🎮</span>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Total XP</span>
                    <span className="font-bold text-violet-600">{playerXP.toLocaleString()} ⭐</span>
                  </div>
                </div>
              </div>

              {/* Upcoming Features Teaser */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 shadow-lg shadow-purple-100">
                <h3 className="text-sm font-semibold text-purple-700 mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Coming Soon 🚀
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg border border-purple-100">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white text-sm">📈</div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-800">Asset Mastery</p>
                      <p className="text-[10px] text-gray-500">Track your skills</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg border border-purple-100">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm">🏆</div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-800">Certifications</p>
                      <p className="text-[10px] text-gray-500">Earn badges</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg border border-purple-100">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm">👥</div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-800">Multiplayer</p>
                      <p className="text-[10px] text-gray-500">Challenge friends</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Daily Wisdom - Compact */}
              <DailyWisdom compact showControls={false} />

              {/* Wisdom Library Link */}
              <Link href="/library">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 shadow-lg shadow-amber-100 hover:shadow-xl hover:shadow-amber-200 hover:-translate-y-1 transition-all cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">Wealth Library 📚</p>
                        <p className="text-xs text-gray-500">Learn from the greats</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-amber-500" />
                  </div>
                </div>
              </Link>
            </div>

            {/* Timeline - Main Content */}
            <div className="lg:col-span-3">
              <TimelineSection
                events={financialEvents}
                competitionUnlocked={competitionUnlocked}
                onEventClick={handleEventClick}
                onStartCompetition={startCompetition}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t border-gray-100 bg-white/50 backdrop-blur">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Image
                  src="/favicon.png"
                  alt="Mini.Fi"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <span className="text-sm text-gray-500">
                  Made with 💜 by{" "}
                  <a href="https://nuvc.ai" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline font-medium">
                    NUVC.AI
                  </a>
                </span>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
                <Link href="/library" className="hover:text-indigo-600 transition-colors">Library</Link>
                <Link href="/support" className="hover:text-indigo-600 transition-colors">Support</Link>
                <a href="https://github.com/nuvcai/MiniFi" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <EventDetailModal
        event={selectedEvent}
        selectedCoach={selectedCoach}
        onClose={() => setSelectedEvent(null)}
        onStartMission={() => selectedEvent && startMission(selectedEvent)}
      />

      <MissionModal
        open={gameStarted}
        event={missionEvent}
        selectedCoach={selectedCoach}
        missionData={currentMission}
        missionStep={missionStep}
        selectedInvestment={selectedInvestment}
        missionResult={missionResult}
        simulationResult={null}
        playerLevel={playerLevel}
        completedMissions={completedMissions}
        onClose={closeMissionModal}
        onStepChange={setMissionStep}
        onInvestmentSelect={setSelectedInvestment}
        onInvestmentConfirm={makeInvestment}
        onMissionComplete={completeMission}
        onXpEarned={handleXpEarned}
      />

      <SummaryModal
        open={showSummary}
        playerXP={playerXP}
        totalScore={totalScore}
        events={financialEvents}
        onClose={() => {
          setShowSummary(false);
          setSummaryDismissed(true);
        }}
        onRestart={() => window.location.reload()}
      />

      <RewardsModal
        open={showRewardsStore}
        onOpenChange={setShowRewardsStore}
        playerXP={playerXP}
        redeemedRewards={redeemedRewards}
        onRedeemReward={redeemReward}
      />

      <LevelUpCelebration
        open={showLevelUp}
        newLevel={levelUpInfo.newLevel}
        previousLevel={levelUpInfo.previousLevel}
        onClose={() => setShowLevelUp(false)}
      />
    </div>
  );
}
