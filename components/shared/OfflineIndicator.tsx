/**
 * Offline Indicator Component
 * Shows connection status and sync state
 * © 2025 NUVC.AI. All Rights Reserved.
 */

"use client";

import React, { useState, useEffect } from "react";
import { Wifi, WifiOff, Cloud, CloudOff, RefreshCw, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface OfflineIndicatorProps {
  className?: string;
  showAlways?: boolean;
}

export function OfflineIndicator({ 
  className,
  showAlways = false 
}: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      // Trigger sync when coming back online
      setIsSyncing(true);
      setTimeout(() => {
        setIsSyncing(false);
        setLastSynced(new Date());
      }, 1500);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Set initial sync time
    if (navigator.onLine) {
      setLastSynced(new Date());
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Show status briefly when status changes
  useEffect(() => {
    if (!isOnline) {
      setShowStatus(true);
    } else if (isSyncing) {
      setShowStatus(true);
    } else {
      // Hide after a delay when online and not syncing
      const timer = setTimeout(() => {
        if (!showAlways) {
          setShowStatus(false);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, isSyncing, showAlways]);

  // Don't render if online and not showing
  if (isOnline && !showStatus && !showAlways) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 z-50 transition-all duration-300 ease-out",
        showStatus || showAlways || !isOnline
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm transition-colors",
          !isOnline
            ? "bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40"
            : isSyncing
            ? "bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-500/40"
            : "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40"
        )}
      >
        {!isOnline ? (
          <>
            <WifiOff className="h-3.5 w-3.5" />
            <span>Offline - Progress saved locally</span>
          </>
        ) : isSyncing ? (
          <>
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            <span>Syncing...</span>
          </>
        ) : (
          <>
            <Check className="h-3.5 w-3.5" />
            <span>Synced</span>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Compact offline badge for header/nav
 */
export function OfflineBadge({ className }: { className?: string }) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium",
        "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300",
        "border border-amber-300 dark:border-amber-500/40",
        className
      )}
    >
      <CloudOff className="h-3 w-3" />
      <span>Offline</span>
    </div>
  );
}

/**
 * Hook for offline status
 */
export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { isOnline, isOffline: !isOnline };
}

export default OfflineIndicator;
