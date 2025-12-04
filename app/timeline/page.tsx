/**
 * Mini.Fi Timeline Page
 * Light, fun game interface with all features
 * © 2025 NUVC.AI. All Rights Reserved.
 */

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Trophy, Star, ChevronRight, Gift } from "lucide-react";

// Components
import { GameHeader } from "@/components/game/GameHeader";
import { CoachSidebar } from "@/components/game/CoachSidebar";
import { TimelineSection } from "@/components/game/TimelineSection";
import { EventDetailModal } from "@/components/modals/EventDetailModal";
import { MissionModal } from "@/components/modals/MissionModal";
import { SummaryModal } from "@/components/modals/SummaryModal";
import { RewardsModal } from "@/components/modals/RewardsModal";
import { LevelUpCelebration, BadgeDisplay, MilestoneAchievement } from "@/components/gamification";
import { DailyStreak } from "@/components/gamification/DailyStreak";

// Hooks
import { useEffortRewards } from "@/hooks/useEffortRewards";

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
  const [streakDays, setStreakDays] = useState(0);
  
  // Effort rewards tracking
  const {
    stats: effortStats,
    earnedRewards,
    pendingNotifications,
    totalEffortXp,
    recordInvestment,
    recordRiskPreviewViewed,
    recordCoachAdviceViewed,
    recordMissionCompleted,
    clearPendingNotification,
    getLossEncouragement,
  } = useEffortRewards();
  
  // Milestone notification state
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [currentMilestoneNotification, setCurrentMilestoneNotification] = useState<typeof pendingNotifications[0] | null>(null);
  
  // Handle pending notifications (milestones, badges, courage rewards)
  useEffect(() => {
    if (pendingNotifications.length > 0 && !showMilestoneModal) {
      const notification = pendingNotifications[0];
      setCurrentMilestoneNotification(notification);
      setShowMilestoneModal(true);
    }
  }, [pendingNotifications, showMilestoneModal]);

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
      
      // Track investment for effort rewards
      const riskLevel = option.risk.toLowerCase();
      const assetClass = option.assetClass || "equities";
      const wasLoss = performance === "loss";
      recordInvestment(riskLevel, assetClass, wasLoss);

      setMissionResult({
        option,
        actualReturn: adjustedReturn,
        finalAmount,
        performance,
      });

      setMissionStep("result");
    }
  };
  
  // Track coach selection for exploration rewards
  const handleCoachSelect = (coach: typeof aiCoaches[0]) => {
    setSelectedCoach(coach);
    recordCoachAdviceViewed(coach.id);
  };

  const completeMission = () => {
    if (missionEvent && missionResult) {
      const missionReward = missionEvent.reward;
      const newXP = playerXP + missionReward;
      const newMissions = [...completedMissions, missionEvent.title];

      setPlayerXP(newXP);
      setTotalScore(newXP);
      setCompletedMissions(newMissions);
      
      // Record mission completion for effort rewards
      recordMissionCompleted();

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

  const handleStreakBonus = (bonus: number, days?: number) => {
    const newXP = playerXP + bonus;
    setPlayerXP(newXP);
    setTotalScore(newXP);
    if (days) {
      setStreakDays(days);
    }
    
    const newLevel = Math.floor(newXP / 1000) + 1;
    if (newLevel > playerLevel) {
      setPlayerLevel(newLevel);
    }
    
    // Save progress
    saveProgress(newXP, Math.max(newLevel, playerLevel), completedMissions);
  };
  
  // Handle milestone XP claim
  const handleMilestoneXpClaim = (xp: number) => {
    handleXpEarned(xp);
    clearPendingNotification();
    setShowMilestoneModal(false);
    setCurrentMilestoneNotification(null);
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
          streakDays={streakDays}
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
                onCoachSelect={handleCoachSelect}
              />

              {/* Daily Streak */}
              <DailyStreak onBonusClaimed={handleStreakBonus} />
              
              {/* Effort Badges */}
              <BadgeDisplay
                earnedBadgeIds={earnedRewards.filter(r => r.type === "badge").map(r => r.data.id)}
                earnedMilestoneIds={earnedRewards.filter(r => r.type === "milestone").map(r => r.data.id)}
                stats={{
                  missionsCompleted: effortStats.missionsCompleted,
                  differentRiskLevelsTried: effortStats.differentRiskLevelsTried.size,
                  differentAssetClassesTried: effortStats.differentAssetClassesTried.size,
                  coachesUsed: effortStats.coachesUsed.size,
                  lossesExperienced: effortStats.lossesExperienced,
                  investmentsAfterLoss: effortStats.investmentsAfterLoss,
                  investmentsMade: effortStats.investmentsMade,
                }}
                compact={true}
              />

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
        
        {/* Mobile Bottom Bar - Quick Access to Key Features */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-lg z-40 safe-area-bottom">
          <div className="flex items-center justify-around py-2 px-4">
            {/* Coach */}
            <button 
              onClick={() => {/* Could open coach modal */}}
              className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <img 
                src={selectedCoach.avatar} 
                alt={selectedCoach.name}
                className="w-8 h-8 rounded-full border-2 border-indigo-200"
              />
              <span className="text-[10px] text-gray-600 font-medium">Coach</span>
            </button>
            
            {/* Progress */}
            <div className="flex flex-col items-center gap-1 p-2">
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-100">
                <span className="text-sm font-bold text-indigo-600">{completedCount}/{financialEvents.length}</span>
              </div>
              <span className="text-[10px] text-gray-600 font-medium">Missions</span>
            </div>
            
            {/* Streak */}
            <button className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${streakDays > 0 ? 'bg-orange-100' : 'bg-gray-100'}`}>
                <span className="text-sm">🔥</span>
                <span className={`text-sm font-bold ${streakDays > 0 ? 'text-orange-600' : 'text-gray-400'}`}>{streakDays}</span>
              </div>
              <span className="text-[10px] text-gray-600 font-medium">Streak</span>
            </button>
            
            {/* Rewards */}
            <button 
              onClick={() => setShowRewardsStore(true)}
              className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100">
                <Gift className="h-4 w-4 text-amber-600" />
              </div>
              <span className="text-[10px] text-gray-600 font-medium">Rewards</span>
            </button>
          </div>
        </div>
        
        {/* Spacer for mobile bottom bar */}
        <div className="lg:hidden h-20" />

        {/* Footer */}
        <footer className="mt-12 border-t border-gray-100 bg-white/50 backdrop-blur">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Image
                  src="/nuvc-logo.png"
                  alt="NUVC.AI"
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
      
      {/* Milestone Achievement Modal */}
      <MilestoneAchievement
        open={showMilestoneModal}
        milestone={currentMilestoneNotification?.type === "milestone" ? currentMilestoneNotification.data as any : undefined}
        courageReward={currentMilestoneNotification?.type === "courage" ? currentMilestoneNotification.data as any : undefined}
        onClose={() => {
          clearPendingNotification();
          setShowMilestoneModal(false);
          setCurrentMilestoneNotification(null);
        }}
        onXpClaimed={handleMilestoneXpClaim}
      />
    </div>
  );
}
