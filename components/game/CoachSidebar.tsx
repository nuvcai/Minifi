/**
 * CoachSidebar — Enhanced with Personality Differentiation
 * 
 * Shows unique visual identity, catchphrases, and personality for each coach
 */

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AICoach, getCoachGreeting, getCoachCatchphrase } from "@/components/data/coaches";
import { Check, ChevronDown, Shield, Building2, Rocket, Coins, Sparkles } from "lucide-react";

interface CoachSidebarProps {
  coaches: AICoach[];
  selectedCoach: AICoach;
  onCoachSelect: (coach: AICoach) => void;
}

// Coach-specific icon mapping
const coachIcons: Record<string, React.ReactNode> = {
  "steady-sam": <Shield className="h-3 w-3" />,
  "growth-guru": <Building2 className="h-3 w-3" />,
  "adventure-alex": <Rocket className="h-3 w-3" />,
  "yield-yoda": <Coins className="h-3 w-3" />,
};

// Risk colors with enhanced visual distinction
const riskColors = {
  conservative: "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30",
  moderate: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30",
  aggressive: "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-500/30",
  very_aggressive: "bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30",
};

// Coach-specific gradient backgrounds
const coachGradients: Record<string, string> = {
  "steady-sam": "from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10",
  "growth-guru": "from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10",
  "adventure-alex": "from-purple-50 to-violet-50 dark:from-purple-500/10 dark:to-violet-500/10",
  "yield-yoda": "from-amber-50 to-yellow-50 dark:from-amber-500/10 dark:to-yellow-500/10",
};

// Coach-specific border colors
const coachBorders: Record<string, string> = {
  "steady-sam": "border-blue-300 dark:border-blue-500/40",
  "growth-guru": "border-emerald-300 dark:border-emerald-500/40",
  "adventure-alex": "border-purple-300 dark:border-purple-500/40",
  "yield-yoda": "border-amber-300 dark:border-amber-500/40",
};

export function CoachSidebar({
  coaches,
  selectedCoach,
  onCoachSelect,
}: CoachSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentCatchphrase, setCurrentCatchphrase] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  // Rotate catchphrase for selected coach
  useEffect(() => {
    setCurrentCatchphrase(getCoachCatchphrase(selectedCoach));
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [selectedCoach]);

  // Auto-rotate catchphrase every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentCatchphrase(getCoachCatchphrase(selectedCoach));
        setIsAnimating(false);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedCoach]);

  const selectedGradient = coachGradients[selectedCoach.id] || coachGradients["steady-sam"];
  const selectedBorder = coachBorders[selectedCoach.id] || coachBorders["steady-sam"];

  return (
    <div className="rounded-2xl bg-white dark:bg-[#1A1A1A] border border-black/[0.04] dark:border-white/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-black/[0.04] dark:border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Your AI Coach</h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Each coach has a unique investment style</p>
      </div>
      
      {/* Selected Coach - Enhanced display */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full p-4 flex items-center gap-3 transition-all lg:cursor-default bg-gradient-to-r ${selectedGradient}`}
      >
        <div className="relative flex-shrink-0">
          <div className={`absolute -inset-1 rounded-full bg-gradient-to-r ${selectedCoach.visualIdentity?.bgGradient || 'from-violet-500 to-purple-500'} opacity-30 blur-sm`} />
          <Image
            src={selectedCoach.avatar}
            alt={selectedCoach.name}
            width={52}
            height={52}
            className={`relative rounded-full ring-2 ${selectedBorder} ring-offset-2 ring-offset-white dark:ring-offset-[#1A1A1A]`}
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#1A1A1A] flex items-center justify-center">
            {coachIcons[selectedCoach.id] || <Check className="h-2.5 w-2.5 text-white" />}
          </div>
        </div>
        
        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-bold text-gray-900 dark:text-white truncate">{selectedCoach.name}</p>
            <span className="text-lg">{selectedCoach.speechStyle?.emoji || "🎯"}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate font-medium">{selectedCoach.personality}</p>
          {/* Animated catchphrase */}
          <p className={`text-xs text-gray-500 dark:text-gray-400 mt-1 italic transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
            "{currentCatchphrase}"
          </p>
        </div>
        
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform lg:hidden ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Coach Grid - Enhanced with personality indicators */}
      <div className={`p-4 pt-3 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        <div className="grid grid-cols-2 gap-2">
          {coaches.map((coach) => {
            const isSelected = selectedCoach.id === coach.id;
            const coachGradient = coachGradients[coach.id] || coachGradients["steady-sam"];
            const coachBorder = coachBorders[coach.id] || coachBorders["steady-sam"];
            const riskKey = coach.riskTolerance.replace('-', '_') as keyof typeof riskColors;
            
            return (
              <button
                key={coach.id}
                onClick={() => onCoachSelect(coach)}
                className={`relative p-3 rounded-xl transition-all duration-300 ${
                  isSelected 
                    ? `bg-gradient-to-br ${coachGradient} border-2 ${coachBorder} shadow-lg scale-[1.02]` 
                    : 'bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.04] hover:border-gray-200 dark:hover:border-white/[0.08] hover:scale-[1.01]'
                }`}
              >
                {isSelected && (
                  <div className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center bg-gradient-to-r ${coach.visualIdentity?.bgGradient || 'from-violet-500 to-purple-500'}`}>
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  </div>
                )}
                
                <div className="flex flex-col items-center text-center">
                  {/* Coach avatar with glow */}
                  <div className="relative mb-2">
                    {isSelected && (
                      <div className={`absolute -inset-1 rounded-full bg-gradient-to-r ${coach.visualIdentity?.bgGradient || 'from-violet-500 to-purple-500'} opacity-40 blur-sm animate-pulse`} />
                    )}
                    <Image
                      src={coach.avatar}
                      alt={coach.name}
                      width={44}
                      height={44}
                      className={`relative rounded-full transition-all ${isSelected ? `ring-2 ${coachBorder}` : ''}`}
                    />
                  </div>
                  
                  {/* Coach name with emoji */}
                  <div className="flex items-center gap-1 mb-1">
                    <p className={`font-semibold text-xs truncate ${
                      isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {coach.name}
                    </p>
                    <span className="text-sm">{coach.speechStyle?.emoji || "🎯"}</span>
                  </div>
                  
                  {/* Personality tag */}
                  <p className={`text-[9px] font-medium mb-1.5 ${
                    isSelected ? 'text-gray-700 dark:text-gray-200' : 'text-gray-500 dark:text-gray-500'
                  }`}>
                    {coach.personality}
                  </p>
                  
                  {/* Risk tolerance badge with icon */}
                  <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    riskColors[riskKey] || riskColors.moderate
                  }`}>
                    {coachIcons[coach.id]}
                    {coach.riskTolerance.replace('_', ' ')}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Teaching style indicator */}
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium">Teaching style:</span>
            <span className={`px-2 py-0.5 rounded-full bg-gradient-to-r ${selectedGradient} font-medium text-gray-700 dark:text-gray-200`}>
              {selectedCoach.teachingStyle?.approach || "balanced"}
            </span>
          </div>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 italic">
            💡 {selectedCoach.teachingStyle?.uniqueInsight || "Every investment tells a story"}
          </p>
        </div>
      </div>
    </div>
  );
}
