/**
 * FloatingXp - Animated floating XP notification
 * 
 * Shows a "+XP" animation that floats up and fades out.
 * Best practice implementation with:
 * - CSS-only animations (no JS animation loops)
 * - Automatic cleanup after animation
 * - Accessible (uses aria-live for screen readers)
 * - Performant (uses transform + opacity for GPU acceleration)
 */

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Zap, Sparkles, Star } from "lucide-react";

// Types for floating XP notifications
export interface FloatingXpItem {
  id: string;
  amount: number;
  x: number;
  y: number;
  type?: "default" | "courage" | "bonus" | "streak";
}

interface FloatingXpProps {
  amount: number;
  type?: "default" | "courage" | "bonus" | "streak";
  onComplete?: () => void;
}

// Single floating XP element
export function FloatingXp({ amount, type = "default", onComplete }: FloatingXpProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-remove after animation completes
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  // Style variants based on type
  const variants = {
    default: {
      bg: "from-emerald-500 to-teal-500",
      text: "text-emerald-400",
      icon: <Zap className="h-3 w-3" />,
    },
    courage: {
      bg: "from-amber-500 to-orange-500",
      text: "text-amber-400",
      icon: <Sparkles className="h-3 w-3" />,
    },
    bonus: {
      bg: "from-purple-500 to-pink-500",
      text: "text-purple-400",
      icon: <Star className="h-3 w-3" />,
    },
    streak: {
      bg: "from-orange-500 to-red-500",
      text: "text-orange-400",
      icon: <Zap className="h-3 w-3" />,
    },
  };

  const variant = variants[type];

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none animate-float-up-fade"
    >
      <div className={`
        inline-flex items-center gap-1 px-2 py-1 
        rounded-full shadow-lg backdrop-blur-sm
        bg-gradient-to-r ${variant.bg} bg-opacity-90
        text-white font-bold text-sm
        transform-gpu
      `}>
        {variant.icon}
        <span>+{amount}</span>
        <span className="text-xs opacity-80">XP</span>
      </div>
    </div>
  );
}

// Hook for managing multiple floating XP notifications
export function useFloatingXp() {
  const [floatingItems, setFloatingItems] = useState<FloatingXpItem[]>([]);

  const showFloatingXp = useCallback((
    amount: number,
    type: FloatingXpItem["type"] = "default",
    position?: { x: number; y: number }
  ) => {
    const id = `xp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Default position is slightly randomized for visual interest
    const x = position?.x ?? 50 + (Math.random() * 20 - 10);
    const y = position?.y ?? 50;

    setFloatingItems(prev => [...prev, { id, amount, x, y, type }]);
  }, []);

  const removeFloatingXp = useCallback((id: string) => {
    setFloatingItems(prev => prev.filter(item => item.id !== id));
  }, []);

  return { floatingItems, showFloatingXp, removeFloatingXp };
}

// Container component for rendering floating XP items
interface FloatingXpContainerProps {
  items: FloatingXpItem[];
  onItemComplete: (id: string) => void;
}

export function FloatingXpContainer({ items, onItemComplete }: FloatingXpContainerProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {items.map(item => (
        <div
          key={item.id}
          className="absolute"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <FloatingXp
            amount={item.amount}
            type={item.type}
            onComplete={() => onItemComplete(item.id)}
          />
        </div>
      ))}
    </div>
  );
}

// Inline floating XP for use within components (relative positioning)
interface InlineFloatingXpProps {
  show: boolean;
  amount: number;
  type?: "default" | "courage" | "bonus" | "streak";
  onComplete?: () => void;
  className?: string;
}

export function InlineFloatingXp({ 
  show, 
  amount, 
  type = "default", 
  onComplete,
  className = ""
}: InlineFloatingXpProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        onComplete?.();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!isAnimating) return null;

  const variants = {
    default: "text-emerald-400",
    courage: "text-amber-400",
    bonus: "text-purple-400",
    streak: "text-orange-400",
  };

  return (
    <span 
      className={`
        absolute -top-1 left-1/2 -translate-x-1/2
        text-xs font-bold ${variants[type]}
        animate-float-up-fade pointer-events-none
        whitespace-nowrap
        ${className}
      `}
      role="status"
      aria-live="polite"
    >
      +{amount} XP
    </span>
  );
}

export default FloatingXp;

