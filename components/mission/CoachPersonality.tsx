/**
 * CoachPersonality - Enhanced coach personality integration for missions
 * 
 * This component provides coach-specific messaging, reactions, and visual styling
 * to make each coach feel distinct during gameplay.
 */

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { 
  AICoach, 
  getCoachGreeting, 
  getCoachResponse, 
  getCoachOpinion,
  getCoachCatchphrase,
  wrapWithCoachPersonality 
} from "@/components/data/coaches";
import { Shield, Building2, Rocket, Coins, Sparkles, Quote } from "lucide-react";

// Coach icon mapping
const coachIconMap: Record<string, React.ReactNode> = {
  "steady-sam": <Shield className="h-4 w-4" />,
  "growth-guru": <Building2 className="h-4 w-4" />,
  "adventure-alex": <Rocket className="h-4 w-4" />,
  "yield-yoda": <Coins className="h-4 w-4" />,
};

interface CoachMessageProps {
  coach: AICoach;
  message: string;
  type?: "greeting" | "advice" | "reaction" | "encouragement" | "warning";
  showAvatar?: boolean;
  showCatchphrase?: boolean;
  animated?: boolean;
  className?: string;
}

/**
 * CoachMessage - Displays a message with coach-specific styling
 */
export function CoachMessage({
  coach,
  message,
  type = "advice",
  showAvatar = true,
  showCatchphrase = false,
  animated = true,
  className = "",
}: CoachMessageProps) {
  const [displayedText, setDisplayedText] = useState(animated ? "" : message);
  const [isTyping, setIsTyping] = useState(animated);

  // Typing animation
  useEffect(() => {
    if (!animated) {
      setDisplayedText(message);
      return;
    }

    setDisplayedText("");
    setIsTyping(true);
    let index = 0;

    const typeChar = () => {
      if (index < message.length) {
        setDisplayedText(message.slice(0, index + 1));
        index++;
        setTimeout(typeChar, 20);
      } else {
        setIsTyping(false);
      }
    };

    typeChar();
  }, [message, animated]);

  // Get coach-specific colors
  const getCoachColors = () => {
    switch (coach.id) {
      case "steady-sam":
        return {
          bg: "from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10",
          border: "border-blue-200 dark:border-blue-500/30",
          text: "text-blue-800 dark:text-blue-200",
          accent: "text-blue-600 dark:text-blue-400",
        };
      case "growth-guru":
        return {
          bg: "from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10",
          border: "border-emerald-200 dark:border-emerald-500/30",
          text: "text-emerald-800 dark:text-emerald-200",
          accent: "text-emerald-600 dark:text-emerald-400",
        };
      case "adventure-alex":
        return {
          bg: "from-purple-50 to-violet-50 dark:from-purple-500/10 dark:to-violet-500/10",
          border: "border-purple-200 dark:border-purple-500/30",
          text: "text-purple-800 dark:text-purple-200",
          accent: "text-purple-600 dark:text-purple-400",
        };
      case "yield-yoda":
        return {
          bg: "from-amber-50 to-yellow-50 dark:from-amber-500/10 dark:to-yellow-500/10",
          border: "border-amber-200 dark:border-amber-500/30",
          text: "text-amber-800 dark:text-amber-200",
          accent: "text-amber-600 dark:text-amber-400",
        };
      default:
        return {
          bg: "from-gray-50 to-slate-50 dark:from-gray-500/10 dark:to-slate-500/10",
          border: "border-gray-200 dark:border-gray-500/30",
          text: "text-gray-800 dark:text-gray-200",
          accent: "text-gray-600 dark:text-gray-400",
        };
    }
  };

  const colors = getCoachColors();

  return (
    <div className={`rounded-2xl bg-gradient-to-br ${colors.bg} border ${colors.border} p-4 ${className}`}>
      {/* Coach header */}
      {showAvatar && (
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <Image
              src={coach.avatar}
              alt={coach.name}
              width={40}
              height={40}
              className="rounded-full ring-2 ring-white dark:ring-gray-800"
            />
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r ${coach.visualIdentity?.bgGradient || 'from-violet-500 to-purple-500'} flex items-center justify-center`}>
              {coachIconMap[coach.id] || <Sparkles className="h-2.5 w-2.5 text-white" />}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-gray-900 dark:text-white">{coach.name}</span>
              <span className="text-base">{coach.speechStyle?.emoji || "🎯"}</span>
            </div>
            <span className={`text-xs ${colors.accent} font-medium`}>{coach.personality}</span>
          </div>
        </div>
      )}

      {/* Message content */}
      <div className={`${colors.text} text-sm leading-relaxed`}>
        {displayedText}
        {isTyping && (
          <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse" />
        )}
      </div>

      {/* Catchphrase */}
      {showCatchphrase && !isTyping && (
        <div className={`mt-3 pt-3 border-t ${colors.border}`}>
          <div className="flex items-center gap-2">
            <Quote className={`h-3 w-3 ${colors.accent}`} />
            <span className={`text-xs italic ${colors.accent}`}>
              "{getCoachCatchphrase(coach)}"
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

interface CoachReactionProps {
  coach: AICoach;
  outcome: "profit" | "loss" | "highRisk" | "safeChoice";
  showDetails?: boolean;
}

/**
 * CoachReaction - Shows coach's emotional response to an outcome
 */
export function CoachReaction({ coach, outcome, showDetails = true }: CoachReactionProps) {
  const reaction = getCoachResponse(coach, outcome);
  
  // Determine emoji based on outcome and coach
  const getReactionEmoji = () => {
    if (outcome === "profit") {
      return coach.id === "adventure-alex" ? "🚀" : coach.id === "yield-yoda" ? "🧘" : "🎉";
    }
    if (outcome === "loss") {
      return coach.id === "steady-sam" ? "🛡️" : coach.id === "adventure-alex" ? "💪" : "📊";
    }
    if (outcome === "highRisk") {
      return coach.id === "adventure-alex" ? "🔥" : coach.id === "steady-sam" ? "⚠️" : "🎲";
    }
    return coach.id === "yield-yoda" ? "🧘" : "✅";
  };

  return (
    <CoachMessage
      coach={coach}
      message={`${getReactionEmoji()} ${reaction}`}
      type="reaction"
      showCatchphrase={outcome === "profit"}
    />
  );
}

interface CoachOpinionBadgeProps {
  coach: AICoach;
  assetType: string;
  riskLevel: string;
  compact?: boolean;
}

/**
 * CoachOpinionBadge - Shows a quick badge with coach's opinion on a decision
 */
export function CoachOpinionBadge({ coach, assetType, riskLevel, compact = false }: CoachOpinionBadgeProps) {
  const opinion = getCoachOpinion(coach, assetType, riskLevel);
  
  const sentimentStyles = {
    positive: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30",
    neutral: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-500/20 dark:text-gray-300 dark:border-gray-500/30",
    cautious: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30",
  };

  const sentimentEmoji = {
    positive: "👍",
    neutral: "🤔",
    cautious: "⚠️",
  };

  if (compact) {
    return (
      <Badge className={`${sentimentStyles[opinion.sentiment]} border text-xs`}>
        {sentimentEmoji[opinion.sentiment]} {coach.name}
      </Badge>
    );
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${sentimentStyles[opinion.sentiment]}`}>
      <Image
        src={coach.avatar}
        alt={coach.name}
        width={24}
        height={24}
        className="rounded-full"
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{coach.name} thinks:</p>
        <p className="text-[10px] opacity-80 truncate">{opinion.message}</p>
      </div>
      <span className="text-lg">{sentimentEmoji[opinion.sentiment]}</span>
    </div>
  );
}

interface CoachGreetingProps {
  coach: AICoach;
  playerName?: string;
  context?: "mission_start" | "mission_end" | "dashboard";
}

/**
 * CoachGreeting - Personalized greeting from the coach
 */
export function CoachGreeting({ coach, playerName, context = "dashboard" }: CoachGreetingProps) {
  const [greeting, setGreeting] = useState(getCoachGreeting(coach));

  useEffect(() => {
    setGreeting(getCoachGreeting(coach));
  }, [coach]);

  // Add context-specific prefix
  const getContextPrefix = () => {
    switch (context) {
      case "mission_start":
        return "Ready for action! ";
      case "mission_end":
        return "Mission complete! ";
      default:
        return "";
    }
  };

  const fullGreeting = `${getContextPrefix()}${greeting}${playerName ? ` ${playerName}!` : ""}`;

  return (
    <CoachMessage
      coach={coach}
      message={fullGreeting}
      type="greeting"
      showCatchphrase
    />
  );
}

interface CoachComparisonProps {
  coaches: AICoach[];
  assetType: string;
  riskLevel: string;
}

/**
 * CoachComparison - Shows how all coaches feel about a decision
 */
export function CoachComparison({ coaches, assetType, riskLevel }: CoachComparisonProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
        What each coach thinks about this choice:
      </p>
      <div className="grid grid-cols-2 gap-2">
        {coaches.map((coach) => (
          <CoachOpinionBadge
            key={coach.id}
            coach={coach}
            assetType={assetType}
            riskLevel={riskLevel}
          />
        ))}
      </div>
    </div>
  );
}

export default CoachMessage;
