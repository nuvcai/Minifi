"use client";

import { useState, useEffect, useRef } from "react";

// Import components
import { GameHeader } from "@/components/game/GameHeader";
import { CoachSidebar } from "@/components/game/CoachSidebar";
import { ProgressCard } from "@/components/game/ProgressCard";
import { TimelineSection } from "@/components/game/TimelineSection";
import { EventDetailModal } from "@/components/modals/EventDetailModal";
import { MissionModal } from "@/components/modals/MissionModal";
import { SummaryModal } from "@/components/modals/SummaryModal";
import { RewardsModal } from "@/components/modals/RewardsModal";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Users } from "lucide-react";

// Import data
import { financialEvents, FinancialEvent } from "@/components/data/events";
import { aiCoaches } from "@/components/data/coaches";
import { missionData } from "@/components/data/missions";

export default function TimelinePage() {
  // State management
  const [selectedEvent, setSelectedEvent] = useState<FinancialEvent | null>(
    null
  );
  const [missionEvent, setMissionEvent] = useState<FinancialEvent | null>(null);
  const [selectedCoach, setSelectedCoach] = useState(aiCoaches[0]);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [playerXP, setPlayerXP] = useState(0); // Spendable XP (can redeem rewards)
  const [lifetimeXP, setLifetimeXP] = useState(0); // Total earned (for leveling, never decreases)
  const [showSummary, setShowSummary] = useState(false);
  const [summaryDismissed, setSummaryDismissed] = useState(false);
  const summaryTimerRef = useRef<number | null>(null);
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [competitionUnlocked, setCompetitionUnlocked] = useState(false);
  const [showRewardsStore, setShowRewardsStore] = useState(false);
  const [redeemedRewards, setRedeemedRewards] = useState<string[]>([]);

  // Mission game state management
  const [missionStep, setMissionStep] = useState<
    "intro" | "decision" | "result"
  >("intro");
  const [selectedInvestment, setSelectedInvestment] = useState<string | null>(
    null
  );
  const [missionResult, setMissionResult] = useState<any>(null);

  const updateUnlockStatus = () => {
    financialEvents.forEach((event) => {
      if (event.unlockRequirements.length > 0) {
        const allRequirementsMet = event.unlockRequirements.every(
          (requiredYear) => {
            const requiredEvent = financialEvents.find(
              (e) => e.year === requiredYear
            );
            return requiredEvent?.completed === true;
          }
        );
        event.unlocked = allRequirementsMet;
      }
    });
  };

  const allMissionsCompleted = financialEvents.every(
    (event) => event.completed
  );

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
      // Base mission reward
      const baseReward = missionEvent.reward;
      
      // Performance bonus: +50% XP for profitable investments!
      const performanceBonus = missionResult.performance === "profit" 
        ? Math.round(baseReward * 0.5) 
        : 0;
      
      // Total XP earned this mission
      const totalMissionXP = baseReward + performanceBonus;

      // Update XP - both spendable and lifetime
      setPlayerXP((prev) => prev + totalMissionXP);
      setLifetimeXP((prev) => prev + totalMissionXP);
      setCompletedMissions((prev) => [...prev, missionEvent.title]);

      // Update event completion status
      const eventIndex = financialEvents.findIndex(
        (e) => e.year === missionEvent.year
      );
      if (eventIndex !== -1) {
        financialEvents[eventIndex].completed = true;
        updateUnlockStatus();
      }

      // Level up based on LIFETIME XP (not affected by spending)
      // Smoother progression: 250, 600, 1000, 1500, 2000...
      const xpThresholds = [0, 250, 600, 1000, 1500, 2000, 2600, 3300, 4100, 5000];
      const newLifetimeXP = lifetimeXP + totalMissionXP;
      const newLevel = xpThresholds.findIndex((threshold, i) => 
        newLifetimeXP < (xpThresholds[i + 1] || Infinity)
      ) + 1;
      
      if (newLevel > playerLevel) {
        setPlayerLevel(newLevel);
      }

      // Unlock competition after completing final mission
      if (missionEvent.year === 2025 && missionEvent.title === "Current Challenges") {
        setCompetitionUnlocked(true);
      }

      closeMissionModal();
    }
  };

  const startCompetition = () => {
    // Navigate to competition page using Next.js router
    window.location.href = "/competition";
  };

  const redeemReward = (reward: any) => {
    if (playerXP >= reward.cost && !redeemedRewards.includes(reward.id)) {
      setPlayerXP((prev) => prev - reward.cost); // Only deduct from spendable XP
      setRedeemedRewards((prev) => [...prev, reward.id]);
      // Lifetime XP stays the same - level is preserved!
    }
  };

  // Real-time XP callback for learning interactions (+10 XP per step completed)
  const handleXpEarned = (amount: number) => {
    setPlayerXP((prev) => prev + amount);
    setLifetimeXP((prev) => prev + amount);
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

  const [showCoachSheet, setShowCoachSheet] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <GameHeader
        playerLevel={playerLevel}
        playerXP={playerXP}
        lifetimeXP={lifetimeXP}
        onRewardsClick={() => setShowRewardsStore(true)}
      />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="grid lg:grid-cols-4 gap-4 sm:gap-8">
          {/* Sidebar - Hidden on mobile, shown on large screens */}
          <div className="hidden lg:block lg:col-span-1">
            <CoachSidebar
              coaches={aiCoaches}
              selectedCoach={selectedCoach}
              onCoachSelect={setSelectedCoach}
            />

            <ProgressCard
              playerXP={playerXP}
              completedCount={financialEvents.filter((e) => e.completed).length}
              availableCount={
                financialEvents.filter((e) => e.unlocked && !e.completed).length
              }
            />
          </div>

          {/* Main Timeline - Full width on mobile */}
          <div className="lg:col-span-3">
            {/* Mobile: Quick coach indicator */}
            <div className="lg:hidden mb-4 flex items-center justify-between bg-card rounded-lg p-3 border shadow-sm">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCoach.avatar}
                  alt={selectedCoach.name}
                  className="w-10 h-10 rounded-full border-2 border-primary"
                />
                <div>
                  <p className="font-medium text-sm">{selectedCoach.name}</p>
                  <p className="text-xs text-muted-foreground">Your Coach</p>
                </div>
              </div>
              <Sheet open={showCoachSheet} onOpenChange={setShowCoachSheet}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Users className="h-4 w-4" />
                    <span className="hidden xs:inline">Change</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[70vh] rounded-t-2xl">
                  <div className="pt-4 pb-8 overflow-y-auto h-full">
                    <h3 className="font-serif font-bold text-lg mb-4 px-1">Choose Your Coach</h3>
                    <div className="space-y-3">
                      {aiCoaches.map((coach) => (
                        <div
                          key={coach.id}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all active:scale-[0.98] ${
                            selectedCoach.id === coach.id
                              ? "border-primary bg-primary/10 shadow-md"
                              : "border-border hover:border-primary/50 hover:bg-primary/5"
                          }`}
                          onClick={() => {
                            setSelectedCoach(coach);
                            setShowCoachSheet(false);
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={coach.avatar}
                              alt={coach.name}
                              className="w-14 h-14 rounded-full"
                            />
                            <div className="flex-1">
                              <p className="font-semibold">{coach.name}</p>
                              <p className="text-sm text-primary font-medium">
                                {coach.personality}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {coach.description}
                              </p>
                            </div>
                            {selectedCoach.id === coach.id && (
                              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                <span className="text-white text-sm">✓</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <TimelineSection
              events={financialEvents}
              competitionUnlocked={competitionUnlocked}
              onEventClick={handleEventClick}
              onStartCompetition={startCompetition}
            />
          </div>
        </div>
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
        playerLevel={playerLevel}
        completedMissions={completedMissions}
        onClose={closeMissionModal}
        onStepChange={setMissionStep}
        onInvestmentSelect={setSelectedInvestment}
        onInvestmentConfirm={makeInvestment}
        onMissionComplete={completeMission}
        onXpEarned={handleXpEarned}
      />

      {/* Summary Modal */}
      <SummaryModal
        open={showSummary}
        playerXP={playerXP}
        lifetimeXP={lifetimeXP}
        events={financialEvents}
        onClose={() => {
          setShowSummary(false);
          setSummaryDismissed(true);
        }}
        onRestart={() => window.location.reload()}
      />

      {/* Rewards Modal */}
      <RewardsModal
        open={showRewardsStore}
        onOpenChange={setShowRewardsStore}
        playerXP={playerXP}
        redeemedRewards={redeemedRewards}
        onRedeemReward={redeemReward}
      />
    </div>
  );
}
