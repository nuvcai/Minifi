/**
 * CourageXpNotification - Animated notification for courage/effort iii rewards
 * 
 * Shows celebratory feedback when users earn iii tokens for trying, regardless of outcome.
 */

"use client";

import React, { useState, useEffect } from "react";
import { Zap, Sparkles, Trophy, Heart, Star } from "lucide-react";
import { III_CONFIG } from "@/hooks/useIII";

interface CourageXpNotificationProps {
  xp: number;
  label: string;
  onComplete?: () => void;
}

export function CourageXpNotification({
  xp,
  label,
  onComplete,
}: CourageXpNotificationProps) {
  const [visible, setVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState<"enter" | "show" | "exit">("enter");

  useEffect(() => {
    // Enter phase
    const enterTimer = setTimeout(() => {
      setAnimationPhase("show");
    }, 100);

    // Show phase (hold for 2.5 seconds)
    const showTimer = setTimeout(() => {
      setAnimationPhase("exit");
    }, 2600);

    // Exit phase
    const exitTimer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 3200);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(showTimer);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  if (!visible) return null;

  const getAnimationClass = () => {
    switch (animationPhase) {
      case "enter":
        return "opacity-0 scale-50 translate-y-4";
      case "show":
        return "opacity-100 scale-100 translate-y-0";
      case "exit":
        return "opacity-0 scale-75 -translate-y-8";
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {/* Background overlay with particle effects */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${animationPhase === "show" ? "opacity-100" : "opacity-0"}`}>
        {/* Floating particles - using static classes for Tailwind compatibility */}
        {[...Array(12)].map((_, i) => {
          const colorClasses = ["text-amber-300", "text-amber-400", "text-amber-500", "text-orange-400"];
          const colorClass = colorClasses[i % colorClasses.length];
          return (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${10 + (i * 7) % 80}%`,
                top: `${20 + (i * 5) % 60}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${2 + (i % 3)}s`,
              }}
            >
              <Sparkles className={`h-4 w-4 ${colorClass} opacity-60`} />
            </div>
          );
        })}
      </div>

      {/* Main notification card */}
      <div
        className={`
          relative transform transition-all duration-500 ease-out
          ${getAnimationClass()}
        `}
      >
        <div className="bg-gradient-to-br from-amber-400 via-orange-400 to-yellow-500 rounded-2xl p-1 shadow-2xl shadow-amber-500/50">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl px-8 py-6">
            {/* Top decoration */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-full p-2 shadow-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
            </div>

            {/* Content */}
            <div className="text-center pt-2">
              {/* iii Amount */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="h-5 w-5 text-amber-500 animate-pulse" />
                <span className="text-4xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  +{xp} {III_CONFIG.symbol}
                </span>
                <Star className="h-5 w-5 text-amber-500 animate-pulse" />
              </div>

              {/* Label */}
              <div className="flex items-center justify-center gap-2">
                <Trophy className="h-4 w-4 text-amber-600" />
                <span className="text-lg font-semibold text-amber-800">
                  {label}
                </span>
              </div>

              {/* Encouraging message */}
              <p className="text-sm text-amber-700 mt-2 flex items-center justify-center gap-1">
                <Heart className="h-3 w-3 text-pink-500" />
                Courage rewarded!
                <Heart className="h-3 w-3 text-pink-500" />
              </p>
            </div>
          </div>
        </div>

        {/* Side sparkles */}
        <div className="absolute -left-4 top-1/2 -translate-y-1/2">
          <Sparkles className="h-6 w-6 text-amber-400 animate-bounce" />
        </div>
        <div className="absolute -right-4 top-1/2 -translate-y-1/2">
          <Sparkles className="h-6 w-6 text-amber-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
        </div>
      </div>

      {/* Styles for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// Mini inline notification for smaller XP gains
interface MiniCourageXpProps {
  xp: number;
  className?: string;
}

export function MiniCourageXp({ xp, className = "" }: MiniCourageXpProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`
        inline-flex items-center gap-1 px-2 py-1 
        bg-gradient-to-r from-amber-100 to-orange-100 
        text-amber-700 rounded-full text-xs font-bold
        animate-bounce shadow-sm border border-amber-200
        ${className}
      `}
    >
      <Zap className="h-3 w-3" />
      +{xp} Courage {III_CONFIG.symbol}
    </div>
  );
}

export default CourageXpNotification;

