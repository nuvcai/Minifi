/**
 * Mini.Fi Timeline Page
 * Simplified XP + League game interface
 * © 2025 NUVC.AI. All Rights Reserved.
 */

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, ChevronRight } from "lucide-react";

// Import components
import { GameHeader } from "@/components/game/GameHeader";
import { CoachSidebar } from "@/components/game/CoachSidebar";
import { JourneyHub } from "@/components/game/JourneyHub";
import { EventDetailModal } from "@/components/modals/EventDetailModal";
import { MissionModal } from "@/components/modals/MissionModal";
import { SummaryModal } from "@/components/modals/SummaryModal";
import { SaveProgressModal } from "@/components/modals/SaveProgressModal";
import { LevelUpCelebration, MilestoneAchievement } from "@/components/gamification";
import { IIIDashboard } from "@/components/gamification/IIIDashboard";
import { DailyWisdom } from "@/components/library/DailyWisdom";
import { WelcomeModal } from "@/components/onboarding/WelcomeModal";
import { GameErrorBoundary } from "@/components/shared/ErrorBoundary";
import { OfflineIndicator } from "@/components/shared/OfflineIndicator";

// Hooks
import { useIII } from "@/hooks/useIII";
import { useLeague } from "@/hooks/useLeague";

// Data
import { financialEvents, FinancialEvent } from "@/components/data/events";
import { aiCoaches } from "@/components/data/coaches";
import { missionData, MissionData } from "@/components/data/missions";
import { generateRandomScenario } from "@/components/data/randomScenarios";

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
  // =========================================================================
  // UNIFIED iii TOKEN SYSTEM
  // =========================================================================
  const {
    totalIII,
    level,
    levelProgress,
    iiiToNextLevel,
    weeklyIII,
    stats: _stats,
    earnedBadges,
    addIII,
    recordInvestment,
    recordCoachAdvice,
    recordMissionComplete,
    recordStreakClaim,
    getStreakBonus,
  } = useIII();
  
  // League system
  const { league, userRank, zone, addXp: addLeagueIII } = useLeague();
  
  // =========================================================================
  // GAME STATE
  // =========================================================================
  // Use state for events to trigger re-renders when completed status changes
  const [events, setEvents] = useState<FinancialEvent[]>(() => 
    financialEvents.map(e => ({ ...e })) // Create a copy to avoid mutating imported data
  );
  const [selectedEvent, setSelectedEvent] = useState<FinancialEvent | null>(null);
  const [missionEvent, setMissionEvent] = useState<FinancialEvent | null>(null);
  const [selectedCoach, setSelectedCoach] = useState(aiCoaches[0]);
  const [gameStarted, setGameStarted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryDismissed, setSummaryDismissed] = useState(false);
  const summaryTimerRef = useRef<number | null>(null);
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [competitionUnlocked, setCompetitionUnlocked] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState({ newLevel: 1, previousLevel: 0 });
  const [missionStep, setMissionStep] = useState<"intro" | "decision" | "thesis" | "result" | "whatif" | "quiz">("intro");
  const [selectedInvestment, setSelectedInvestment] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [missionResult, setMissionResult] = useState<any>(null);
  const [streakDays, setStreakDays] = useState(0);
  const [streakBonusAvailable, setStreakBonusAvailable] = useState(false);
  const [_showBadgeModal, setShowBadgeModal] = useState(false);
  
  // Compute streak bonus based on current streak days
  const streakBonus = getStreakBonus(streakDays);
  
  // Random scenario state for post-completion gameplay
  const [randomScenarios, setRandomScenarios] = useState<{ event: FinancialEvent; missionData: MissionData }[]>([]);
  const [completedRandomCount, setCompletedRandomCount] = useState(0);
  
  // Milestone notification state
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [currentMilestoneData, setCurrentMilestoneData] = useState<{ type: string; xp: number; name: string } | null>(null);
  
  // Track previous badge count to detect new badges
  const [previousBadgeCount, setPreviousBadgeCount] = useState(0);
  
  // Onboarding state
  const [showWelcome, setShowWelcome] = useState(false);
  
  // Save Progress prompt state
  const [showSaveProgress, setShowSaveProgress] = useState(false);
  const [lastMissionReward, setLastMissionReward] = useState(0);

  // =========================================================================
  // CHECK FOR FIRST-TIME USER & SHOW ONBOARDING
  // =========================================================================
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('minifi_seen_welcome');
    if (!hasSeenWelcome) {
      // Delay to let page load first
      const timer = setTimeout(() => setShowWelcome(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    localStorage.setItem('minifi_seen_welcome', 'true');
  };

  // =========================================================================
  // LOAD SAVED PROGRESS & STREAK
  // =========================================================================
  useEffect(() => {
    const loadProgress = async () => {
      const savedEmail = localStorage.getItem(USER_EMAIL_KEY);
      const sessionId = getOrCreateSessionId();
      const today = new Date().toDateString();
      
      // Try to load streak from database first
      if (savedEmail || sessionId) {
        try {
          const params = new URLSearchParams();
          if (savedEmail) params.append('email', savedEmail);
          else if (sessionId) params.append('sessionId', sessionId);
          
          const response = await fetch(`/api/streak?${params.toString()}`);
          const result = await response.json();
          
          if (result.success && result.data) {
            const dbStreak = result.data.currentStreak || 0;
            setStreakDays(dbStreak);
            
            // Check if bonus was already claimed today
            const lastClaimDate = result.data.lastClaimDate 
              ? new Date(result.data.lastClaimDate).toDateString() 
              : null;
            const todayClaimed = result.data.todayClaimed || lastClaimDate === today;
            setStreakBonusAvailable(!todayClaimed && dbStreak > 0);
          }
        } catch {
          console.log("Falling back to localStorage for streak");
          loadStreakFromLocal(today);
        }
      } else {
        loadStreakFromLocal(today);
      }

      // Note: iii tokens are automatically loaded by useIII hook from localStorage
      
      // Load completed missions from localStorage
      try {
        const saved = localStorage.getItem(GAME_PROGRESS_KEY);
        if (saved) {
          const progress = JSON.parse(saved);
          if (progress.completedMissions) {
            setCompletedMissions(progress.completedMissions);
            // Restore completed status on events using state
            setEvents(prevEvents => {
              const updatedEvents = prevEvents.map(event => ({
                ...event,
                completed: progress.completedMissions.includes(event.title)
              }));
              return updateUnlockStatus(updatedEvents);
            });
          }
        }
      } catch (e) {
        console.error("Failed to load game progress:", e);
      }
    };
    
    // Fallback streak loader from localStorage
    const loadStreakFromLocal = (today: string) => {
      try {
        const STREAK_KEY = "minifi_streak_data";
        const saved = localStorage.getItem(STREAK_KEY);
        if (saved) {
          const data = JSON.parse(saved);
          const lastClaim = data.lastClaimDate;
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          let streak = data.currentStreak || 0;
          
          // Update streak logic
          if (lastClaim !== today) {
            if (lastClaim === yesterday.toDateString()) {
              streak += 1;
            } else if (lastClaim) {
              streak = 1; // Reset streak
            } else {
              streak = 1; // First day
            }
            
            // Update localStorage
            localStorage.setItem(STREAK_KEY, JSON.stringify({
              ...data,
              currentStreak: streak,
              lastClaimDate: today,
              todayClaimed: false,
            }));
            
            setStreakBonusAvailable(true);
          } else {
            setStreakBonusAvailable(!data.todayClaimed);
          }
          
          setStreakDays(streak);
        } else {
          // First time - initialize streak
          setStreakDays(1);
          setStreakBonusAvailable(true);
          localStorage.setItem("minifi_streak_data", JSON.stringify({
            currentStreak: 1,
            lastClaimDate: today,
            todayClaimed: false,
          }));
        }
      } catch (e) {
        console.error("Failed to load streak:", e);
      }
    };
    
    loadProgress();
  }, []);

  // =========================================================================
  // DETECT NEW BADGES & SHOW CELEBRATION
  // =========================================================================
  useEffect(() => {
    if (earnedBadges.length > previousBadgeCount && previousBadgeCount > 0) {
      // New badge earned!
      const newestBadge = earnedBadges[earnedBadges.length - 1];
      setCurrentMilestoneData({
        type: 'badge',
        xp: 0, // Badges don't give extra XP in simplified system
        name: newestBadge.name,
      });
      setShowMilestoneModal(true);
    }
    setPreviousBadgeCount(earnedBadges.length);
  }, [earnedBadges, previousBadgeCount]);

  // =========================================================================
  // SAVE PROGRESS
  // =========================================================================
  const saveProgress = async (missions: string[]) => {
    const progress = {
      completedMissions: missions,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(GAME_PROGRESS_KEY, JSON.stringify(progress));
    
    // Sync to database
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
              totalXP: totalIII, // iii tokens stored as XP in backend
              playerLevel: level,
              completedMissions: missions,
            },
          }),
        });
      } catch {
        console.log("Failed to sync progress to database");
      }
    }
  };

  // =========================================================================
  // UNLOCK LOGIC
  // =========================================================================
  const updateUnlockStatus = (currentEvents: FinancialEvent[]) => {
    return currentEvents.map((event) => {
      if (event.unlockRequirements.length > 0) {
        const allRequirementsMet = event.unlockRequirements.every((requiredYear) => {
          const requiredEvent = currentEvents.find((e) => e.year === requiredYear);
          return requiredEvent?.completed === true;
        });
        return { ...event, unlocked: allRequirementsMet };
      }
      return event;
    });
  };

  const allMissionsCompleted = events.every((event) => event.completed);

  useEffect(() => {
    setEvents(prevEvents => updateUnlockStatus(prevEvents));
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

  // =========================================================================
  // EVENT HANDLERS
  // =========================================================================
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

      // Calculate coach-adjusted returns based on selected coach
      const getCoachAdjustedReturn = (
        baseReturn: number,
        coachPersonality: string
      ) => {
        const adjustmentFactors = {
          "Conservative Coach": 0.8, // More conservative, reduce extreme losses/gains
          "Balanced Coach": 1.0, // No adjustment, balanced approach
          "Aggressive Coach": 1.3, // More aggressive, amplify returns
          "Income Coach": 0.9, // Slightly conservative, focus on stability
        };
        const factor =
          adjustmentFactors[
            coachPersonality as keyof typeof adjustmentFactors
          ] || 1.0;
        // Apply adjustment with some randomness
        const randomFactor = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
        const adjustedReturn = baseReturn * factor * randomFactor;
        // Ensure returns stay within reasonable bounds
        return Math.max(-0.8, Math.min(2.0, adjustedReturn));
      };

      const adjustedReturn = getCoachAdjustedReturn(
        option.actualReturn,
        selectedCoach.personality
      );
      const finalAmount = 10000 * (1 + adjustedReturn);
      const performance = adjustedReturn > 0 ? "profit" : "loss";
      
      // Track investment and earn XP via unified system
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
  
  // Track coach selection
  const handleCoachSelect = (coach: typeof aiCoaches[0]) => {
    setSelectedCoach(coach);
    recordCoachAdvice(coach.id);
  };

  const completeMission = () => {
    if (missionEvent && missionResult) {
      const missionReward = missionEvent.reward;
      const newMissions = [...completedMissions, missionEvent.title];

      // Use unified iii token system
      const iiiEarned = recordMissionComplete(missionEvent.title, missionReward);
      addLeagueIII(iiiEarned); // Also update league weekly iii
      
      // Track the reward for the save progress modal
      setLastMissionReward(iiiEarned);
      
      setCompletedMissions(newMissions);

      // Check if this is a random scenario
      const isRandomScenario = randomScenarios.some(s => s.event.title === missionEvent.title);
      
      if (isRandomScenario) {
        setRandomScenarios(prev => 
          prev.map(s => 
            s.event.title === missionEvent.title 
              ? { ...s, event: { ...s.event, completed: true } }
              : s
          )
        );
        setCompletedRandomCount(prev => prev + 1);
      } else {
        // Update events state to mark mission as completed
        setEvents(prevEvents => {
          const updatedEvents = prevEvents.map(event => 
            event.year === missionEvent.year 
              ? { ...event, completed: true }
              : event
          );
          return updateUnlockStatus(updatedEvents);
        });
      }

      // Check for level up
      const newLevel = Math.floor(totalIII / 1000) + 1;
      if (newLevel > level) {
        setLevelUpInfo({ newLevel, previousLevel: level });
        setTimeout(() => setShowLevelUp(true), 500);
      }
      
      // Save progress
      saveProgress(newMissions);

      if (missionEvent.year === 2025 && missionEvent.title === "Current Challenges") {
        setCompetitionUnlocked(true);
      }

      closeMissionModal();
      
      // Show save progress modal if user hasn't saved yet
      // Show after every mission completion (1st, 3rd, 5th, etc.) until they save
      const savedEmail = localStorage.getItem(USER_EMAIL_KEY);
      const savePromptDismissed = localStorage.getItem('minifi_save_prompt_dismissed');
      const shouldShowSavePrompt = !savedEmail && !savePromptDismissed && 
        (newMissions.length === 1 || newMissions.length === 3 || newMissions.length % 2 === 1);
      
      if (shouldShowSavePrompt) {
        // Delay to let level up animation show first if triggered
        const delay = newLevel > level ? 2500 : 1000;
        setTimeout(() => setShowSaveProgress(true), delay);
      }
    }
  };

  const startCompetition = () => {
    // Navigate to competition page using Next.js router
    window.location.href = "/competition";
  };

  const handleIIIEarned = (amount: number, source?: string) => {
    addIII(amount, source || 'bonus', source);
    addLeagueIII(amount);
    
    // Check for level up
    const newLevel = Math.floor((totalIII + amount) / 1000) + 1;
    if (newLevel > level) {
      setLevelUpInfo({ newLevel, previousLevel: level });
      setTimeout(() => setShowLevelUp(true), 500);
    }
  };

  // Handle claiming daily streak bonus
  const handleClaimStreak = () => {
    if (!streakBonusAvailable) return;
    
    const bonus = getStreakBonus(streakDays);
    recordStreakClaim(streakDays);
    addLeagueIII(bonus);
    setStreakBonusAvailable(false);
    
    // Sync with server
    const savedEmail = localStorage.getItem(USER_EMAIL_KEY);
    const sessionId = getOrCreateSessionId();
    if (savedEmail || sessionId) {
      fetch('/api/streak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'claim',
          email: savedEmail,
          sessionId,
        }),
      }).catch(() => console.log("Failed to sync claim"));
    }
  };
  
  // Handle milestone iii token claim
  const handleMilestoneIIIClaim = (iii: number) => {
    if (iii > 0) {
      handleIIIEarned(iii, 'milestone');
    }
    setShowMilestoneModal(false);
    setCurrentMilestoneData(null);
  };

  const closeMissionModal = () => {
    setGameStarted(false);
    setMissionEvent(null);
    setMissionStep("intro");
    setSelectedInvestment(null);
    setMissionResult(null);
  };
  
  // Handle saving progress via email
  const handleSaveProgress = async (email: string): Promise<boolean> => {
    try {
      const sessionId = getOrCreateSessionId();
      const response = await fetch('/api/streak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'signup',
          email,
          streakData: {
            currentStreak: streakDays,
            totalXP: totalIII,
            sessionId,
          },
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Save email to localStorage
        localStorage.setItem(USER_EMAIL_KEY, email);
        // Give bonus iii for saving
        addIII(50, 'save_progress', '🎁 Progress saved bonus!');
        addLeagueIII(50);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to save progress:', error);
      return false;
    }
  };

  // Get mission data
  const getCurrentMissionData = (): MissionData | null => {
    if (!missionEvent) return null;
    
    const randomScenario = randomScenarios.find(s => s.event.title === missionEvent.title);
    if (randomScenario) {
      return randomScenario.missionData;
    }
    
    return missionData[missionEvent.year as keyof typeof missionData] || null;
  };
  
  const currentMission = getCurrentMissionData();
  
  // Generate a new random scenario
  const generateNewScenario = () => {
    const newScenario = generateRandomScenario();
    setRandomScenarios(prev => [...prev, newScenario]);
    return newScenario;
  };
  
  // Start a random scenario directly
  const startRandomMission = () => {
    const scenario = generateNewScenario();
    setMissionEvent(scenario.event);
    setGameStarted(true);
    setMissionStep("intro");
  };

  return (
    <div className="min-h-screen w-full page-bg overflow-x-hidden">
      {/* Background - Theme-aware with Teen Tech Purple */}
      <div className="fixed inset-0 w-screen h-screen pointer-events-none overflow-hidden">
        {/* Dark mode background */}
        <div className="dark:block hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#9898f2]/15 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-purple-950/20 to-transparent" />
          <div className="absolute top-1/4 left-4 sm:left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-[#9898f2]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-4 sm:right-1/4 w-56 sm:w-80 h-56 sm:h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        {/* Light mode background */}
        <div className="dark:hidden block">
          <div className="absolute top-20 right-4 sm:right-20 w-48 sm:w-64 h-48 sm:h-64 bg-[#9898f2]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-40 left-0 sm:left-10 w-64 sm:w-80 h-64 sm:h-80 bg-emerald-200/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-1/4 sm:right-1/3 w-40 sm:w-48 h-40 sm:h-48 bg-[#9898f2]/15 rounded-full blur-3xl" />
        </div>
      </div>
      
      <div className="relative w-full">
        <GameHeader
          playerLevel={level}
          playerXP={totalIII}
          weeklyXP={weeklyIII}
        />

        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
          <GameErrorBoundary>
            <div className="grid lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            
            {/* Sidebar - Coach appears FIRST on mobile, then stats */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-5 order-1 lg:order-1">
              
              {/* Coach Selection */}
              <CoachSidebar
                coaches={aiCoaches}
                selectedCoach={selectedCoach}
                onCoachSelect={handleCoachSelect}
              />

              {/* Consolidated iii Dashboard */}
              <IIIDashboard
                totalIII={totalIII}
                level={level}
                levelProgress={levelProgress}
                iiiToNextLevel={iiiToNextLevel}
                weeklyIII={weeklyIII}
                league={league}
                leagueRank={userRank}
                leagueZone={zone}
                streakDays={streakDays}
                streakBonusAvailable={streakBonusAvailable}
                streakBonus={streakBonus}
                onClaimStreak={handleClaimStreak}
                badgeCount={earnedBadges.length}
                onViewLeague={() => setShowBadgeModal(true)}
                onViewBadges={() => setShowBadgeModal(true)}
              />

              {/* Daily Wisdom & Library - DESKTOP ONLY (hidden on mobile) */}
              <div className="hidden lg:block space-y-4">
                <DailyWisdom compact showControls={false} />

                <Link href="/library">
                  <div className="group p-4 rounded-2xl 
                    bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 
                    dark:from-amber-500/10 dark:via-orange-500/10 dark:to-yellow-500/5
                    border border-amber-200 dark:border-amber-500/30 
                    hover:border-amber-300 dark:hover:border-amber-500/50 
                    hover:shadow-lg hover:shadow-amber-200/30 dark:hover:shadow-amber-500/10
                    hover:-translate-y-1 transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-400/30">
                          <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-amber-900 dark:text-white text-sm group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                            Wealth Library 📚
                          </p>
                          <p className="text-xs text-amber-700/70 dark:text-amber-300/60">
                            Learn from the greats
                          </p>
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-500/20 group-hover:bg-amber-200 dark:group-hover:bg-amber-500/30 transition-colors">
                        <ChevronRight className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Journey Hub - Main Content - Appears after coach on mobile */}
            <div className="lg:col-span-3 order-2 lg:order-2">
              <JourneyHub
                events={events}
                competitionUnlocked={competitionUnlocked}
                onEventClick={handleEventClick}
                onStartCompetition={startCompetition}
                randomScenarios={randomScenarios}
                completedRandomCount={completedRandomCount}
                onGenerateRandomScenario={startRandomMission}
                streakDays={streakDays}
              />
              
              {/* Daily Wisdom & Library - MOBILE ONLY (after game cards) */}
              <div className="lg:hidden space-y-4 mt-6">
                <DailyWisdom compact showControls={false} />

                <Link href="/library">
                  <div className="group p-3 sm:p-4 rounded-xl sm:rounded-2xl 
                    bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 
                    dark:from-amber-500/10 dark:via-orange-500/10 dark:to-yellow-500/5
                    border border-amber-200 dark:border-amber-500/30 
                    active:scale-[0.98] transition-all cursor-pointer touch-manipulation">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-400/30">
                          <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-amber-900 dark:text-white text-sm">
                            Wealth Library 📚
                          </p>
                          <p className="text-xs text-amber-700/70 dark:text-amber-300/60">
                            Learn from the greats
                          </p>
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-500/20">
                        <ChevronRight className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            </div>
          </GameErrorBoundary>
        </div>

        {/* Footer */}
        <footer className="mt-12 w-full border-t border-slate-200 dark:border-white/10 bg-white/80 dark:bg-black/40">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Image
                  src="/nuvc-logo.png"
                  alt="NUVC.AI"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <span className="text-sm text-slate-500 dark:text-white/60">
                  Made with 💚 by{" "}
                  <a href="https://nuvc.ai" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
                    NUVC.AI
                  </a>
                </span>
              </div>
              <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-white/60">
                <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
                <Link href="/library" className="hover:text-slate-900 dark:hover:text-white transition-colors">Library</Link>
                <Link href="/leaderboard" className="hover:text-slate-900 dark:hover:text-white transition-colors">Leaderboard</Link>
                <Link href="/profile" className="hover:text-slate-900 dark:hover:text-white transition-colors">Profile</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Event Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        selectedCoach={selectedCoach}
        onClose={() => setSelectedEvent(null)}
        onStartMission={() => selectedEvent && startMission(selectedEvent)}
      />

      {/* Mission Modal */}
      <MissionModal
        open={gameStarted}
        event={missionEvent}
        selectedCoach={selectedCoach}
        missionData={currentMission}
        missionStep={missionStep}
        selectedInvestment={selectedInvestment}
        missionResult={missionResult}
        simulationResult={null}
        playerLevel={level}
        completedMissions={completedMissions}
        onClose={closeMissionModal}
        onStepChange={setMissionStep}
        onInvestmentSelect={setSelectedInvestment}
        onInvestmentConfirm={makeInvestment}
        onMissionComplete={completeMission}
        onXpEarned={handleIIIEarned}
      />

      {/* Summary Modal */}
      <SummaryModal
        open={showSummary}
        playerXP={totalIII}
        totalScore={totalIII}
        events={events}
        onClose={() => {
          setShowSummary(false);
          setSummaryDismissed(true);
        }}
        onRestart={() => window.location.reload()}
      />

      <LevelUpCelebration
        open={showLevelUp}
        newLevel={levelUpInfo.newLevel}
        previousLevel={levelUpInfo.previousLevel}
        onClose={() => setShowLevelUp(false)}
      />
      
      {/* Badge/Milestone Achievement Modal */}
      <MilestoneAchievement
        open={showMilestoneModal}
        milestone={currentMilestoneData?.type === 'milestone' ? {
          id: 'milestone',
          name: currentMilestoneData.name,
          description: 'Achievement unlocked!',
          xpReward: currentMilestoneData.xp,
          requirement: 0,
          type: 'missions_attempted' as const,
        } : undefined}
        courageReward={currentMilestoneData?.type === 'badge' ? {
          id: 'badge',
          name: currentMilestoneData.name,
          description: 'Badge earned!',
          xpReward: 0,
          trigger: 'badge',
          emoji: '🏆',
        } : undefined}
        onClose={() => {
          setShowMilestoneModal(false);
          setCurrentMilestoneData(null);
        }}
        onXpClaimed={handleMilestoneIIIClaim}
      />
      
      {/* Welcome Onboarding Modal */}
      <WelcomeModal
        open={showWelcome}
        onClose={handleWelcomeClose}
        onStartPlaying={handleWelcomeClose}
      />
      
      {/* Save Progress Modal - Shows after mission completion */}
      <SaveProgressModal
        open={showSaveProgress}
        onClose={() => setShowSaveProgress(false)}
        onSave={handleSaveProgress}
        currentIII={totalIII}
        completedMissions={completedMissions.length}
        streakDays={streakDays}
        lastMissionReward={lastMissionReward}
      />
      
      {/* Offline Status Indicator */}
      <OfflineIndicator />
      
    </div>
  );
}
