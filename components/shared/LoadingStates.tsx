/**
 * Loading States & Skeleton Components
 * Consistent loading UX across the app
 * © 2025 NUVC.AI. All Rights Reserved.
 */

"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2, Sparkles, Brain, TrendingUp } from "lucide-react";

/**
 * Skeleton pulse animation component
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700/50",
        className
      )}
    />
  );
}

/**
 * Generic loading spinner with optional message
 */
export function LoadingSpinner({ 
  message, 
  size = "default",
  className 
}: { 
  message?: string; 
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <Loader2 className={cn("animate-spin text-violet-500", sizeClasses[size])} />
      {message && (
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}

/**
 * Mission loading skeleton - used when loading mission data
 */
export function MissionLoadingSkeleton() {
  return (
    <div className="space-y-6 p-4">
      {/* Header skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* Coach message skeleton */}
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>

      {/* Options skeleton */}
      <div className="grid gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>

      {/* Button skeleton */}
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}

/**
 * Investment decision loading state
 */
export function InvestmentLoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/30 animate-pulse">
          <Brain className="h-8 w-8 text-white" />
        </div>
        <div className="absolute -top-1 -right-1">
          <Sparkles className="h-5 w-5 text-amber-400 animate-bounce" />
        </div>
      </div>
      <div className="text-center space-y-1">
        <p className="font-semibold text-gray-900 dark:text-white">
          Analyzing Market Data...
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Your coach is preparing insights
        </p>
      </div>
    </div>
  );
}

/**
 * Results calculating loading state
 */
export function ResultsLoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <TrendingUp className="h-8 w-8 text-white animate-bounce" />
        </div>
      </div>
      <div className="text-center space-y-1">
        <p className="font-semibold text-gray-900 dark:text-white">
          Calculating Results...
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Simulating your investment outcome
        </p>
      </div>
      
      {/* Fake progress bar */}
      <div className="w-48 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-progress" />
      </div>
    </div>
  );
}

/**
 * Dashboard card skeleton
 */
export function DashboardCardSkeleton() {
  return (
    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-2 w-full rounded-full" />
    </div>
  );
}

/**
 * Leaderboard skeleton
 */
export function LeaderboardSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50"
        >
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

/**
 * Quiz loading state
 */
export function QuizLoadingState() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-6 w-3/4 mx-auto" />
      <div className="space-y-3 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

/**
 * Full page loading state
 */
export function PageLoadingState({ message }: { message?: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-xl shadow-violet-500/30">
          <Loader2 className="h-10 w-10 text-white animate-spin" />
        </div>
      </div>
      <p className="text-lg font-medium text-gray-900 dark:text-white">
        {message || "Loading..."}
      </p>
    </div>
  );
}

// Add custom animation for progress bar
const progressStyles = `
  @keyframes progress {
    0% { width: 0%; }
    50% { width: 70%; }
    100% { width: 100%; }
  }
  .animate-progress {
    animation: progress 2s ease-in-out infinite;
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = progressStyles;
  document.head.appendChild(style);
}

export default {
  Skeleton,
  LoadingSpinner,
  MissionLoadingSkeleton,
  InvestmentLoadingState,
  ResultsLoadingState,
  DashboardCardSkeleton,
  LeaderboardSkeleton,
  QuizLoadingState,
  PageLoadingState,
};
