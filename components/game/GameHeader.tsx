import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Gift, Zap } from "lucide-react";

interface GameHeaderProps {
  playerLevel: number;
  playerXP: number; // Spendable XP
  lifetimeXP: number; // Total earned (for leveling)
  onRewardsClick?: () => void;
}

// Level XP thresholds for smoother progression
const XP_THRESHOLDS = [0, 250, 600, 1000, 1500, 2000, 2600, 3300, 4100, 5000];

export function GameHeader({
  playerLevel,
  playerXP,
  lifetimeXP,
  onRewardsClick,
}: GameHeaderProps) {
  // Calculate progress to next level based on lifetime XP
  const currentThreshold = XP_THRESHOLDS[playerLevel - 1] || 0;
  const nextThreshold = XP_THRESHOLDS[playerLevel] || XP_THRESHOLDS[XP_THRESHOLDS.length - 1];
  const xpInCurrentLevel = lifetimeXP - currentThreshold;
  const xpNeededForLevel = nextThreshold - currentThreshold;
  const xpProgress = Math.min((xpInCurrentLevel / xpNeededForLevel) * 100, 100);

  return (
    <header className="border-b bg-card shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        {/* Mobile: Compact single-row layout */}
        <div className="flex items-center justify-between gap-2">
          {/* Logo - smaller on mobile */}
          <div className="flex items-center gap-2 shrink-0">
            <Image
              src="/favicon.png"
              alt="NUVC Icon"
              width={32}
              height={32}
              className="object-contain w-7 h-7 sm:w-10 sm:h-10"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl sm:text-2xl font-serif font-black text-primary leading-tight">
                Legacy Guardians
              </h1>
              <p className="text-xs text-muted-foreground">
                Time-Warp Wealth Adventure
              </p>
            </div>
          </div>

          {/* Mobile: XP + Level combined compact display */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end">
            {/* XP Progress - Combined Level + XP for mobile */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-green-200">
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-green-600" />
                <span className="text-sm sm:text-base font-bold text-green-700">
                  {playerXP}
                </span>
                <span className="hidden sm:inline text-xs text-green-600">XP</span>
              </div>
              {/* Mini level badge */}
              <div className="bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                L{playerLevel}
              </div>
            </div>

            {/* Rewards Button - Icon only on mobile */}
            {onRewardsClick && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRewardsClick}
                className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 hover:from-yellow-100 hover:to-orange-100 px-2 sm:px-3"
              >
                <Gift className="h-4 w-4 text-yellow-600" />
                <span className="text-yellow-700 font-medium hidden sm:inline text-sm">
                  Rewards
                </span>
              </Button>
            )}
          </div>
        </div>

        {/* XP Progress bar - shown on mobile for visual feedback */}
        <div className="mt-2 sm:hidden">
          <div className="flex items-center gap-2">
            <Progress value={xpProgress} className="h-1.5 flex-1" />
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
              {xpInCurrentLevel}/{xpNeededForLevel} to L{playerLevel + 1}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
