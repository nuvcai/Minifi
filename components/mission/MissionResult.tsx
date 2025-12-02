"use client";

import React, { useState, useEffect, useMemo } from "react";
import { InvestmentOption } from "@/components/data/missions";
import { FinancialEvent } from "@/components/data/events";
import { TeachingDialogue } from "@/components/mission/TeachingDialogue";
import { aiCoaches, AICoach } from "@/components/data/coaches";
import { getRandomHopeMessage, type HopeMessage } from "@/components/data/wealthWisdom";

interface MissionResultProps {
  selectedOption: InvestmentOption;
  actualReturn: number;
  finalAmount: number;
  performance: "profit" | "loss";
  outcome: string;
  event: FinancialEvent;
  simulationResult?: any;
  playerLevel: number;
  completedMissions: string[];
  selectedCoach: AICoach; // Add selectedCoach prop
  onComplete: () => void;
  onXpEarned?: (amount: number) => void;
}

// Confetti particle colors
const CONFETTI_COLORS = [
  "bg-emerald-500",
  "bg-teal-500",
  "bg-amber-500",
  "bg-pink-500",
  "bg-purple-500",
  "bg-blue-500",
  "bg-cyan-500",
  "bg-yellow-400",
];

// Individual confetti particle
function ConfettiParticle({ delay, left, color, size, rotation }: {
  delay: number;
  left: number;
  color: string;
  size: number;
  rotation: number;
}) {
  return (
    <div
      className={`absolute ${color} rounded-sm opacity-90 pointer-events-none`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        top: "-20px",
        transform: `rotate(${rotation}deg)`,
        animation: `confetti-fall 3s ease-out ${delay}s forwards`,
      }}
    />
  );
}

export function MissionResult({
  selectedOption,
  actualReturn,
  finalAmount,
  performance,
  outcome,
  event,
  simulationResult,
  playerLevel,
  completedMissions,
  selectedCoach, // Add selectedCoach parameter
  onComplete,
  onXpEarned,
}: MissionResultProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const [wisdomTip, setWisdomTip] = useState<HopeMessage | null>(null);

  // Load a hope message on mount
  useEffect(() => {
    setWisdomTip(getRandomHopeMessage());
  }, []);

  // Pre-compute confetti particles for consistent rendering
  const confettiParticles = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      delay: (i * 0.02) % 0.6,
      left: (i * 2.5) % 100,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 6 + (i % 6),
      rotation: (i * 9) % 360,
    }));
  }, []);

  // Auto-hide confetti after animation
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6 relative">
      {/* Celebration Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
          {confettiParticles.map((particle) => (
            <ConfettiParticle key={particle.id} {...particle} />
          ))}
        </div>
      )}

      {/* Wisdom Tip Banner - Shows after confetti settles */}
      {wisdomTip && !showConfetti && (
        <div className="bg-linear-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-lg p-4 mb-4 animate-bounce-in">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✨</span>
            <div>
              <h4 className="font-semibold text-amber-300 text-sm mb-1">{wisdomTip.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{wisdomTip.callToAction}</p>
            </div>
          </div>
        </div>
      )}

      {/* Teaching AI Coach Dialogue */}
      <div className="mt-6">
        <TeachingDialogue
          coach={selectedCoach} // Use the selected coach instead of playerLevel-based coach
          selectedOption={selectedOption}
          actualReturn={actualReturn}
          finalAmount={finalAmount}
          performance={performance}
          outcome={outcome}
          event={event}
          simulationResult={simulationResult}
          onComplete={onComplete}
          onXpEarned={onXpEarned}
        />
      </div>

      {/* CSS for confetti animation */}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(500px) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
