"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  History, 
  Target, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  AlertTriangle,
  Brain,
  Flame,
  Diamond,
  Zap,
} from "lucide-react";
import { ConvictionChart } from "@/components/gamification/ConvictionChart";
import { MissionData } from "@/components/data/missions";
import { III_CONFIG } from "@/hooks/useIII";
import { AICoach, getCoachGreeting, getCoachCatchphrase } from "@/components/data/coaches";

interface MissionIntroProps {
  missionData: MissionData;
  selectedCoach: AICoach;
  onNext: () => void;
  onExit: () => void;
}

// Philosophy-driven crisis wisdom quotes
const crisisWisdomQuotes = [
  { quote: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { quote: "The market is a device for transferring money from the impatient to the patient.", author: "Warren Buffett" },
  { quote: "Be fearful when others are greedy, and greedy when others are fearful.", author: "Warren Buffett" },
  { quote: "The four most dangerous words in investing are: 'This time it's different.'", author: "Sir John Templeton" },
  { quote: "Risk comes from not knowing what you're doing.", author: "Warren Buffett" },
];

export function MissionIntro({
  missionData,
  selectedCoach,
  onNext,
  onExit,
}: MissionIntroProps) {
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [wisdomQuote] = useState(() => 
    crisisWisdomQuotes[Math.floor(Math.random() * crisisWisdomQuotes.length)]
  );

  // Trigger animation on step change
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [step]);

  // Get the full coach tip (already shortened in missions.ts)
  const getCoachTip = () => {
    return missionData.coachAdvice[selectedCoach.id] || "Trust your instincts!";
  };

  const handleContinue = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      onNext();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      onExit();
    }
  };

  const stepLabels = ["Crisis", "Challenge", "Conviction"];
  const stepIcons = [AlertTriangle, Target, Diamond];

  return (
    <div className="space-y-4">
      {/* Philosophy Banner - Crisis Learning */}
      <div className="bg-gradient-to-r from-amber-500/15 to-red-500/10 border border-amber-500/30 rounded-xl p-3 sm:p-4">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-amber-500/20 flex-shrink-0">
            <Flame className="h-4 w-4 text-amber-500" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-amber-700 dark:text-amber-300 leading-relaxed">
              "{wisdomQuote.quote}"
            </p>
            <p className="text-[10px] sm:text-xs text-amber-600/70 dark:text-amber-400/70 mt-1">
              — {wisdomQuote.author}
            </p>
          </div>
        </div>
      </div>

      {/* Progress bar with labels - Mobile optimized */}
      <div className="flex items-center justify-center gap-1 mb-4">
        {[0, 1, 2].map((i) => {
          const StepIcon = stepIcons[i];
          return (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    i === step 
                      ? "bg-gradient-to-r from-[#9898f2] to-[#7070c0] text-white scale-110 shadow-lg shadow-[#9898f2]/30" 
                      : i < step 
                        ? "bg-[#9898f2] text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {i < step ? (
                    <span className="text-sm">✓</span>
                  ) : (
                    <StepIcon className="h-4 w-4" />
                  )}
                </div>
                <span className={`text-[9px] sm:text-[10px] mt-1.5 font-semibold uppercase tracking-wide ${
                  i === step ? "text-[#7070c0] dark:text-[#9898f2]" : i < step ? "text-[#7070c0] dark:text-[#9898f2]" : "text-gray-400 dark:text-gray-500"
                }`}>
                  {stepLabels[i]}
                </span>
              </div>
              {i < 2 && (
                <div className={`w-6 sm:w-10 h-0.5 mx-0.5 sm:mx-1 mt-[-16px] transition-colors ${
                  i < step ? "bg-[#9898f2]" : "bg-gray-200 dark:bg-gray-700"
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className={`transition-all duration-300 ${isAnimating ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"}`}>
        {/* Step 0: The Crisis - Emphasize emotional stakes */}
        {step === 0 && (
          <Card className="border-2 border-red-300 dark:border-red-500/30 bg-gradient-to-br from-red-50 via-orange-50/50 to-white dark:from-red-500/20 dark:via-orange-500/10 dark:to-[#1a1a2e] overflow-hidden shadow-lg">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">The Crisis Moment</h4>
                  <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400 font-medium">History is about to test your conviction</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-sm">{missionData.context}</p>
              
              {/* Emotional Stakes Callout */}
              <div className="mt-4 p-3 rounded-xl bg-red-500/10 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30">
                <p className="text-xs text-red-700 dark:text-red-300 font-medium flex items-center gap-2">
                  <span className="text-base">⚠️</span>
                  Every crisis separates the disciplined from the reactive. What will you choose?
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Your Challenge - High conviction language with mini chart */}
        {step === 1 && (
          <Card className="border-2 border-[#9898f2]/30 dark:border-[#9898f2]/30 bg-gradient-to-br from-[#9898f2]/10 via-purple-50/30 to-white dark:from-[#9898f2]/20 dark:via-[#9898f2]/10 dark:to-[#1a1a2e] overflow-hidden shadow-lg">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#9898f2] to-[#7070c0] shadow-lg">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Your Challenge</h4>
                  <p className="text-[10px] sm:text-xs text-[#7070c0] dark:text-[#9898f2] font-medium">Time to challenge the status quo</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-sm">{missionData.situation}</p>
              
              {/* Mini Conviction Chart Preview */}
              <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-[#9898f2]/15 via-purple-500/10 to-indigo-500/15 border border-[#9898f2]/30">
                <div className="flex items-center gap-2 mb-2">
                  <Diamond className="h-4 w-4 text-[#7070c0] dark:text-[#9898f2]" />
                  <span className="text-xs font-bold text-[#6060a0] dark:text-[#b8b8ff]">High Conviction Moment Ahead</span>
                </div>
                <ConvictionChart compact={true} animated={false} />
                <p className="text-[10px] text-[#6060a0]/80 dark:text-[#b8b8ff]/80 mt-2 flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Quick failures teach more than slow indecision. Every bold choice earns Courage {III_CONFIG.symbol}.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Generational Wisdom - Long-term thinking with Coach Personality */}
        {step === 2 && (
          <Card className={`border-2 overflow-hidden shadow-lg ${
            selectedCoach.visualIdentity?.borderColor || "border-amber-300 dark:border-amber-500/30"
          } bg-gradient-to-br ${
            selectedCoach.id === "steady-sam" ? "from-blue-50 via-cyan-50/50 to-white dark:from-blue-500/20 dark:via-cyan-500/10 dark:to-[#1a1a2e]" :
            selectedCoach.id === "growth-guru" ? "from-emerald-50 via-teal-50/50 to-white dark:from-emerald-500/20 dark:via-teal-500/10 dark:to-[#1a1a2e]" :
            selectedCoach.id === "adventure-alex" ? "from-purple-50 via-violet-50/50 to-white dark:from-purple-500/20 dark:via-violet-500/10 dark:to-[#1a1a2e]" :
            "from-amber-50 via-yellow-50/50 to-white dark:from-amber-500/20 dark:via-amber-500/10 dark:to-[#1a1a2e]"
          }`}>
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className={`absolute -inset-1 rounded-full blur-sm opacity-40 bg-gradient-to-r ${selectedCoach.visualIdentity?.bgGradient || "from-amber-400 to-orange-500"}`} />
                  <Image
                    src={selectedCoach.avatar}
                    alt={selectedCoach.name}
                    width={48}
                    height={48}
                    className={`relative rounded-full ring-2 ${
                      selectedCoach.id === "steady-sam" ? "ring-blue-300 dark:ring-blue-500" :
                      selectedCoach.id === "growth-guru" ? "ring-emerald-300 dark:ring-emerald-500" :
                      selectedCoach.id === "adventure-alex" ? "ring-purple-300 dark:ring-purple-500" :
                      "ring-amber-300 dark:ring-amber-500"
                    } ring-offset-2 ring-offset-white dark:ring-offset-[#1a1a2e] shadow-lg`}
                  />
                  <div className={`absolute -bottom-1 -right-1 p-1 rounded-full shadow flex items-center justify-center bg-gradient-to-r ${selectedCoach.visualIdentity?.bgGradient || "from-amber-400 to-orange-500"}`}>
                    <span className="text-xs">{selectedCoach.speechStyle?.emoji || "🧠"}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">{selectedCoach.name}</h4>
                    <span className="text-lg">{selectedCoach.speechStyle?.emoji || "🎯"}</span>
                  </div>
                  <p className={`text-[10px] sm:text-xs font-medium ${
                    selectedCoach.id === "steady-sam" ? "text-blue-600 dark:text-blue-400" :
                    selectedCoach.id === "growth-guru" ? "text-emerald-600 dark:text-emerald-400" :
                    selectedCoach.id === "adventure-alex" ? "text-purple-600 dark:text-purple-400" :
                    "text-amber-600 dark:text-amber-400"
                  }`}>
                    {selectedCoach.personality} • {selectedCoach.teachingStyle?.approach || "balanced"} approach
                  </p>
                </div>
              </div>
              
              {/* Coach Greeting */}
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-sm mb-3 italic">
                "{getCoachGreeting(selectedCoach)}"
              </p>
              
              {/* Coach-specific advice */}
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-sm">
                {getCoachTip()}
              </p>
              
              {/* Coach Catchphrase */}
              <div className={`mt-4 p-3 rounded-xl border ${
                selectedCoach.id === "steady-sam" ? "bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 border-blue-200 dark:border-blue-500/30" :
                selectedCoach.id === "growth-guru" ? "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 border-emerald-200 dark:border-emerald-500/30" :
                selectedCoach.id === "adventure-alex" ? "bg-gradient-to-r from-purple-500/10 to-violet-500/10 dark:from-purple-500/20 dark:to-violet-500/20 border-purple-200 dark:border-purple-500/30" :
                "bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 border-amber-200 dark:border-amber-500/30"
              }`}>
                <p className={`text-xs font-medium flex items-center gap-2 ${
                  selectedCoach.id === "steady-sam" ? "text-blue-700 dark:text-blue-300" :
                  selectedCoach.id === "growth-guru" ? "text-emerald-700 dark:text-emerald-300" :
                  selectedCoach.id === "adventure-alex" ? "text-purple-700 dark:text-purple-300" :
                  "text-amber-700 dark:text-amber-300"
                }`}>
                  <span className="text-base">💬</span>
                  "{getCoachCatchphrase(selectedCoach)}"
                </p>
                {selectedCoach.teachingStyle?.uniqueInsight && (
                  <p className={`text-[10px] mt-2 opacity-70 ${
                    selectedCoach.id === "steady-sam" ? "text-blue-600 dark:text-blue-400" :
                    selectedCoach.id === "growth-guru" ? "text-emerald-600 dark:text-emerald-400" :
                    selectedCoach.id === "adventure-alex" ? "text-purple-600 dark:text-purple-400" :
                    "text-amber-600 dark:text-amber-400"
                  }`}>
                    💡 {selectedCoach.teachingStyle.uniqueInsight}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Navigation - Always stacked full width for mobile-first cards */}
      <div className="flex flex-col gap-3 pt-3">
        <Button 
          onClick={handleContinue} 
          className="w-full min-h-[48px] font-bold bg-gradient-to-r from-[#9898f2] via-[#8585e0] to-[#7070c0] hover:from-[#8585e0] hover:via-[#7575d0] hover:to-[#6060b0] text-white shadow-lg shadow-[#9898f2]/20 touch-manipulation active:scale-[0.98]"
        >
          {step < 2 ? (
            <>
              Continue
              <ChevronRight className="h-4 w-4 ml-1" />
            </>
          ) : (
            <>
              <Flame className="h-4 w-4 mr-2" />
              Invest with Conviction
            </>
          )}
        </Button>
        <Button 
          variant="outline" 
          onClick={handleBack}
          className="w-full min-h-[48px] touch-manipulation active:scale-[0.98]"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {step === 0 ? "Exit" : "Back"}
        </Button>
      </div>
    </div>
  );
}
