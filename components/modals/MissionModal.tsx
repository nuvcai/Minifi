/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   🎮 MISSION MODAL - Enhanced Learning Flow                                  ║
 * ║   Integrated with Investment Thesis, What-If Analysis & Knowledge Quiz       ║
 * ║   FO Principle: "Deliberate practice builds mastery"                         ║
 * ║   Copyright (c) 2025 NUVC.AI. All Rights Reserved.                          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TrendingUp, Brain, BarChart3, GraduationCap, PenLine, Diamond, Zap } from "lucide-react";
import { MissionIntro } from "@/components/mission/MissionIntro";
import { InvestmentDecision } from "@/components/mission/InvestmentDecision";
import { MissionResult } from "@/components/mission/MissionResult";
import { InvestmentThesis } from "@/components/mission/InvestmentThesis";
import { WhatIfAnalysis } from "@/components/mission/WhatIfAnalysis";
import { KnowledgeQuiz } from "@/components/mission/KnowledgeQuiz";
import { MissionErrorBoundary } from "@/components/shared/ErrorBoundary";
import { ResultsLoadingState } from "@/components/shared/LoadingStates";
import { FinancialEvent } from "@/components/data/events";
import { AICoach } from "@/components/data/coaches";
import { MissionData, InvestmentOption } from "@/components/data/missions";

// Enhanced mission step types
type MissionStep = "intro" | "decision" | "thesis" | "result" | "whatif" | "quiz";

interface MissionModalProps {
  open: boolean;
  event: FinancialEvent | null;
  selectedCoach: AICoach;
  missionData: MissionData | null;
  missionStep: MissionStep;
  selectedInvestment: string | null;
  missionResult: {
    option: InvestmentOption;
    actualReturn: number;
    finalAmount: number;
    performance: "profit" | "loss";
  } | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  simulationResult: any;
  playerLevel: number;
  completedMissions: string[];
  onClose: () => void;
  onStepChange: (step: MissionStep) => void;
  onInvestmentSelect: (optionId: string) => void;
  onInvestmentConfirm: (optionId: string) => void;
  onMissionComplete: () => void;
  onXpEarned?: (amount: number) => void;
}

// Initial investment amount for missions
const INITIAL_INVESTMENT = 100000;

export function MissionModal({
  open,
  event,
  selectedCoach,
  missionData,
  missionStep,
  selectedInvestment,
  missionResult,
  simulationResult,
  playerLevel,
  completedMissions,
  onClose,
  onStepChange,
  onInvestmentSelect,
  onInvestmentConfirm,
  onMissionComplete,
  onXpEarned,
}: MissionModalProps) {
  // Local state for enhanced features
  const [_investmentThesis, setInvestmentThesis] = useState<string>("");
  const [_quizCompleted, setQuizCompleted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle moving from decision to thesis step
  const handleDecisionConfirm = useCallback(() => {
    if (selectedInvestment) {
      onStepChange("thesis");
    }
  }, [selectedInvestment, onStepChange]);

  // Handle thesis submission - proceed to confirm investment with loading
  const handleThesisSubmit = useCallback((thesis: string) => {
    setInvestmentThesis(thesis);
    if (selectedInvestment) {
      setIsTransitioning(true);
      // Simulate calculation delay for better UX
      setTimeout(() => {
        onInvestmentConfirm(selectedInvestment);
        setIsTransitioning(false);
      }, 800);
    }
  }, [selectedInvestment, onInvestmentConfirm]);

  // Handle thesis skip - directly confirm investment with loading
  const handleThesisSkip = useCallback(() => {
    if (selectedInvestment) {
      setIsTransitioning(true);
      setTimeout(() => {
        onInvestmentConfirm(selectedInvestment);
        setIsTransitioning(false);
      }, 600);
    }
  }, [selectedInvestment, onInvestmentConfirm]);

  // Handle transition from result to What-If
  const handleResultContinue = useCallback(() => {
    onStepChange("whatif");
  }, [onStepChange]);

  // Handle What-If continue - go to quiz
  const handleWhatIfContinue = useCallback(() => {
    onStepChange("quiz");
  }, [onStepChange]);

  // Handle Quiz completion
  const handleQuizComplete = useCallback((_score: number, _totalXp: number) => {
    setQuizCompleted(true);
    // Note: XP is awarded incrementally during quiz, not here
    // After quiz, complete the mission
    onMissionComplete();
  }, [onMissionComplete]);

  // Early return AFTER all hooks are called
  if (!event || !missionData) return null;

  // Get selected option for thesis
  const selectedOption = selectedInvestment 
    ? missionData.options.find(o => o.id === selectedInvestment)
    : null;

  // Dynamic dialog title based on step
  const getDialogTitle = () => {
    switch (missionStep) {
      case "intro":
        return `Crisis Mode: ${event.year}`;
      case "decision":
        return "High Conviction Moment";
      case "thesis":
        return "Investment Thesis";
      case "result":
        return missionResult?.performance === "loss" 
          ? "Wisdom Earned" 
          : "Victory Achieved";
      case "whatif":
        return "Parallel Universes";
      case "quiz":
        return "Knowledge Check";
      default:
        return `${event.year} - ${event.title}`;
    }
  };

  // Dynamic dialog description based on step
  const getDialogDescription = () => {
    switch (missionStep) {
      case "intro":
        return `${event.title} — History is about to test your discipline`;
      case "decision":
        return "Bold moves build bold investors. Quick failures teach more than slow indecision.";
      case "thesis":
        return "Family Office Principle: Document your reasoning before every major decision";
      case "result":
        return missionResult?.performance === "loss"
          ? "Every loss builds the emotional intelligence that separates great investors"
          : "Your discipline and conviction paid off. This wisdom spans generations.";
      case "whatif":
        return "Explore how each option actually performed in history";
      case "quiz":
        return "Validate your understanding of this market event";
      default:
        return event.description;
    }
  };

  // Get icon for current step
  const getStepIcon = () => {
    switch (missionStep) {
      case "decision":
        return (
          <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 shadow-lg shadow-violet-500/30">
            <Diamond className="h-5 w-5 text-white" />
          </div>
        );
      case "thesis":
        return (
          <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg shadow-violet-500/30">
            <PenLine className="h-5 w-5 text-white" />
          </div>
        );
      case "whatif":
        return (
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 shadow-lg shadow-indigo-500/30">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
        );
      case "quiz":
        return (
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
        );
      case "result":
        return missionResult?.performance === "profit" 
          ? (
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          )
          : (
            <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg shadow-violet-500/30">
              <Brain className="h-5 w-5 text-white" />
            </div>
          );
      default:
        return null;
    }
  };

  // Get step badge/emoji
  const getStepBadge = () => {
    switch (missionStep) {
      case "decision":
        return <span className="ml-1">💎</span>;
      case "thesis":
        return <span className="ml-1">📝</span>;
      case "result":
        return missionResult?.performance === "loss" ? <span className="ml-1">💎</span> : <span className="ml-1">🏆</span>;
      case "whatif":
        return <span className="ml-1">🔮</span>;
      case "quiz":
        return <span className="ml-1">🎓</span>;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        variant="mobile-sheet"
        className="max-w-4xl max-h-[90vh] overflow-y-auto max-sm:max-w-full max-sm:px-4"
      >
        <DialogHeader className="max-sm:pt-2">
          <DialogTitle className="font-serif text-xl sm:text-2xl flex items-center gap-3">
            {getStepIcon()}
            <span className={missionStep === "decision" ? "bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent" : ""}>
              {getDialogTitle()}
            </span>
            {getStepBadge()}
          </DialogTitle>
          <DialogDescription className={`text-sm sm:text-base ${missionStep === "decision" ? "flex items-center gap-2" : ""}`}>
            {missionStep === "decision" && <Zap className="h-4 w-4 text-amber-500 flex-shrink-0" />}
            <span>{getDialogDescription()}</span>
          </DialogDescription>
        </DialogHeader>

        <MissionErrorBoundary>
          {/* Loading state during transitions */}
          {isTransitioning && (
            <ResultsLoadingState />
          )}

          {/* Step 1: Mission Introduction */}
          {!isTransitioning && missionStep === "intro" && (
            <MissionIntro
              missionData={missionData}
              selectedCoach={selectedCoach}
              onNext={() => onStepChange("decision")}
              onExit={onClose}
            />
          )}

          {/* Step 2: Investment Decision */}
          {!isTransitioning && missionStep === "decision" && (
            <InvestmentDecision
              options={missionData.options}
              selectedInvestment={selectedInvestment}
              onInvestmentSelect={onInvestmentSelect}
              onConfirm={handleDecisionConfirm}
              onBack={() => onStepChange("intro")}
              selectedCoach={selectedCoach}
            />
          )}

          {/* Step 3: Investment Thesis (NEW - Forces deliberate thinking) */}
          {!isTransitioning && missionStep === "thesis" && selectedOption && (
            <InvestmentThesis
              selectedOption={selectedOption}
              coach={selectedCoach}
              eventTitle={event.title}
              eventYear={event.year}
              onSubmit={handleThesisSubmit}
              onSkip={handleThesisSkip}
              onXpEarned={onXpEarned}
            />
          )}

          {/* Step 4: Mission Results */}
          {!isTransitioning && missionStep === "result" && missionResult && (
            <MissionResult
              selectedOption={missionResult.option}
              actualReturn={missionResult.actualReturn}
              finalAmount={missionResult.finalAmount}
              performance={missionResult.performance}
              outcome={missionData.outcome}
              event={event}
              simulationResult={simulationResult}
              playerLevel={playerLevel}
              completedMissions={completedMissions}
              selectedCoach={selectedCoach}
              onComplete={handleResultContinue}
              onXpEarned={onXpEarned}
            />
          )}

          {/* Step 5: What-If Analysis (NEW - Shows all possible outcomes) */}
          {!isTransitioning && missionStep === "whatif" && missionResult && (
            <WhatIfAnalysis
              options={missionData.options}
              selectedOptionId={missionResult.option.id}
              initialInvestment={INITIAL_INVESTMENT}
              onContinue={handleWhatIfContinue}
              onXpEarned={onXpEarned}
            />
          )}

          {/* Step 6: Knowledge Quiz (NEW - Validates understanding) */}
          {!isTransitioning && missionStep === "quiz" && missionResult && (
            <KnowledgeQuiz
              missionData={missionData}
              eventYear={event.year}
              eventTitle={event.title}
              selectedOption={missionResult.option}
              actualPerformance={missionResult.performance}
              onComplete={handleQuizComplete}
              onXpEarned={onXpEarned}
            />
          )}
        </MissionErrorBoundary>
      </DialogContent>
    </Dialog>
  );
}
