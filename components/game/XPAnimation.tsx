"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Trophy, Star, Zap, Sparkles } from "lucide-react";

interface XPAnimationProps {
  amount: number;
  show: boolean;
  onComplete?: () => void;
  type?: "earn" | "bonus" | "levelup";
  position?: { x: number; y: number };
}

export function XPAnimation({
  amount,
  show,
  onComplete,
  type = "earn",
  position,
}: XPAnimationProps) {
  useEffect(() => {
    if (show && type === "levelup") {
      // Confetti for level up
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10b981", "#34d399", "#6ee7b7", "#fbbf24", "#f59e0b"],
      });
    }
  }, [show, type]);

  const getIcon = () => {
    switch (type) {
      case "bonus":
        return <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />;
      case "levelup":
        return <Trophy className="h-8 w-8 text-yellow-500 fill-yellow-500" />;
      default:
        return <Zap className="h-5 w-5 text-green-400 fill-green-400" />;
    }
  };

  const getColor = () => {
    switch (type) {
      case "bonus":
        return "from-yellow-400 to-orange-500";
      case "levelup":
        return "from-purple-500 to-pink-500";
      default:
        return "from-green-400 to-emerald-500";
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.5 }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            y: [20, -20, -40, -60],
            scale: [0.5, 1.2, 1, 0.8],
          }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          onAnimationComplete={onComplete}
          className="fixed z-[100] pointer-events-none"
          style={{
            left: position?.x ?? "50%",
            top: position?.y ?? "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getColor()} shadow-2xl`}
          >
            {getIcon()}
            <span className="text-white font-bold text-lg">
              +{amount} XP
            </span>
            {type === "bonus" && (
              <Sparkles className="h-4 w-4 text-yellow-200 animate-pulse" />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Level Up Celebration Component
interface LevelUpCelebrationProps {
  show: boolean;
  newLevel: number;
  onClose: () => void;
}

export function LevelUpCelebration({
  show,
  newLevel,
  onClose,
}: LevelUpCelebrationProps) {
  useEffect(() => {
    if (show) {
      // Multi-burst confetti
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#10b981", "#fbbf24", "#8b5cf6"],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#10b981", "#fbbf24", "#8b5cf6"],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", damping: 15 }}
            className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-1 rounded-3xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-card rounded-3xl p-8 text-center">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Trophy className="h-20 w-20 mx-auto text-yellow-500 fill-yellow-500" />
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold mt-6 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"
              >
                LEVEL UP!
              </motion.h2>
              
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="mt-4"
              >
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                  <Star className="h-6 w-6 fill-yellow-300 text-yellow-300" />
                  <span className="text-2xl font-bold">Level {newLevel}</span>
                  <Star className="h-6 w-6 fill-yellow-300 text-yellow-300" />
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-4 text-muted-foreground"
              >
                Keep investing wisely to unlock more rewards!
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                onClick={onClose}
                className="mt-6 px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
              >
                Continue
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Streak Counter Component
interface StreakCounterProps {
  streak: number;
  showAnimation?: boolean;
}

export function StreakCounter({ streak, showAnimation }: StreakCounterProps) {
  return (
    <motion.div
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white"
      animate={showAnimation ? { scale: [1, 1.2, 1] } : {}}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        animate={showAnimation ? { rotate: [0, 20, -20, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="text-lg"
      >
        🔥
      </motion.span>
      <span className="font-bold text-sm">{streak} Day Streak</span>
    </motion.div>
  );
}

