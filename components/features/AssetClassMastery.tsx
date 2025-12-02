/**
 * AssetClassMastery.tsx - Progress tracking for asset class exploration
 * Shows player's journey across different asset classes
 */

"use client";

import React from "react";
import { 
  Trophy, 
  Lock,
  CheckCircle2,
  Star,
  Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Asset class mastery data
interface AssetMastery {
  id: string;
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
  missionsTotal: number;
  missionsCompleted: number;
  unlocked: boolean;
}

const assetMasteryData: AssetMastery[] = [
  {
    id: "equities",
    name: "Stocks",
    emoji: "📈",
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    missionsTotal: 4,
    missionsCompleted: 0,
    unlocked: true
  },
  {
    id: "fixed_income",
    name: "Bonds",
    emoji: "📊",
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    missionsTotal: 3,
    missionsCompleted: 0,
    unlocked: true
  },
  {
    id: "commodities",
    name: "Commodities",
    emoji: "🥇",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/20",
    missionsTotal: 3,
    missionsCompleted: 0,
    unlocked: true
  },
  {
    id: "alternatives",
    name: "Alternatives",
    emoji: "🏢",
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
    missionsTotal: 2,
    missionsCompleted: 0,
    unlocked: false
  },
  {
    id: "cash",
    name: "Cash",
    emoji: "💵",
    color: "text-slate-400",
    bgColor: "bg-slate-500/20",
    missionsTotal: 2,
    missionsCompleted: 0,
    unlocked: true
  },
  {
    id: "crypto",
    name: "Crypto",
    emoji: "₿",
    color: "text-orange-400",
    bgColor: "bg-orange-500/20",
    missionsTotal: 1,
    missionsCompleted: 0,
    unlocked: false
  }
];

interface AssetClassMasteryProps {
  variant?: "compact" | "full" | "mini";
  completedMissions?: string[]; // IDs of completed missions
  className?: string;
}

export function AssetClassMastery({ 
  variant = "compact",
  completedMissions = [],
  className = ""
}: AssetClassMasteryProps) {
  // Calculate overall progress
  const totalMissions = assetMasteryData.reduce((sum, a) => sum + a.missionsTotal, 0);
  const completedCount = assetMasteryData.reduce((sum, a) => sum + a.missionsCompleted, 0);
  const overallProgress = totalMissions > 0 ? (completedCount / totalMissions) * 100 : 0;
  
  // Count mastered classes
  const masteredCount = assetMasteryData.filter(
    a => a.missionsCompleted === a.missionsTotal && a.missionsTotal > 0
  ).length;

  if (variant === "mini") {
    // Ultra compact for header/nav
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex -space-x-1">
          {assetMasteryData.slice(0, 4).map((asset) => (
            <Tooltip key={asset.id}>
              <TooltipTrigger>
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs
                  ${asset.unlocked ? asset.bgColor : 'bg-slate-700'}
                  border-2 border-slate-800
                `}>
                  {asset.unlocked ? asset.emoji : <Lock className="h-2.5 w-2.5 text-slate-500" />}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{asset.name}: {asset.missionsCompleted}/{asset.missionsTotal}</p>
              </TooltipContent>
            </Tooltip>
          ))}
          {assetMasteryData.length > 4 && (
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] bg-slate-700 border-2 border-slate-800 text-slate-400">
              +{assetMasteryData.length - 4}
            </div>
          )}
        </div>
        <span className="text-xs text-slate-400">{masteredCount}/6</span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-semibold text-slate-300">Asset Mastery</span>
          </div>
          <Badge className="bg-amber-500/20 text-amber-300 text-xs border-amber-500/30">
            {masteredCount}/6 mastered
          </Badge>
        </div>
        
        {/* Horizontal asset class pills */}
        <div className="flex flex-wrap gap-2">
          {assetMasteryData.map((asset) => {
            const progress = asset.missionsTotal > 0 
              ? (asset.missionsCompleted / asset.missionsTotal) * 100 
              : 0;
            const isMastered = progress === 100 && asset.missionsTotal > 0;
            
            return (
              <Tooltip key={asset.id}>
                <TooltipTrigger>
                  <div className={`
                    relative px-3 py-1.5 rounded-full flex items-center gap-1.5
                    transition-all duration-200
                    ${asset.unlocked 
                      ? `${asset.bgColor} border border-transparent hover:border-${asset.color.replace('text-', '')}/50` 
                      : 'bg-slate-800/50 border border-slate-700'
                    }
                    ${isMastered ? 'ring-2 ring-amber-400/50' : ''}
                  `}>
                    {/* Icon or lock */}
                    <span className="text-sm">
                      {asset.unlocked ? asset.emoji : '🔒'}
                    </span>
                    
                    {/* Name */}
                    <span className={`text-xs font-medium ${
                      asset.unlocked ? asset.color : 'text-slate-500'
                    }`}>
                      {asset.name}
                    </span>
                    
                    {/* Progress indicator */}
                    {asset.unlocked && (
                      <span className={`text-[10px] ${
                        isMastered ? 'text-amber-400' : 'text-slate-500'
                      }`}>
                        {asset.missionsCompleted}/{asset.missionsTotal}
                      </span>
                    )}
                    
                    {/* Mastered star */}
                    {isMastered && (
                      <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs">
                    <p className="font-semibold">{asset.name}</p>
                    {asset.unlocked ? (
                      <p className="text-slate-400">
                        {asset.missionsCompleted}/{asset.missionsTotal} missions completed
                      </p>
                    ) : (
                      <p className="text-slate-400">Complete more missions to unlock</p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
        
        {/* Overall progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
            <span>Overall Progress</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-1.5" />
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-linear-to-br from-amber-500 to-orange-500">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Asset Class Mastery</h2>
            <p className="text-sm text-slate-400">Master all 6 to become a FO Fellow</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-amber-400">{masteredCount}/6</div>
          <div className="text-xs text-slate-500">classes mastered</div>
        </div>
      </div>
      
      {/* Asset class grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {assetMasteryData.map((asset) => {
          const progress = asset.missionsTotal > 0 
            ? (asset.missionsCompleted / asset.missionsTotal) * 100 
            : 0;
          const isMastered = progress === 100 && asset.missionsTotal > 0;
          
          return (
            <div
              key={asset.id}
              className={`
                relative p-3 rounded-xl border transition-all duration-200
                ${asset.unlocked 
                  ? `${asset.bgColor} border-transparent hover:scale-102` 
                  : 'bg-slate-800/30 border-slate-700/50'
                }
                ${isMastered ? 'ring-2 ring-amber-400/50' : ''}
              `}
            >
              {/* Mastered badge */}
              {isMastered && (
                <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-1">
                  <CheckCircle2 className="h-3 w-3 text-white" />
                </div>
              )}
              
              {/* Lock overlay for locked assets */}
              {!asset.unlocked && (
                <div className="absolute inset-0 rounded-xl bg-slate-900/50 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
              )}
              
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{asset.emoji}</span>
                <span className={`text-sm font-semibold ${
                  asset.unlocked ? asset.color : 'text-slate-500'
                }`}>
                  {asset.name}
                </span>
              </div>
              
              {asset.unlocked && (
                <>
                  <Progress value={progress} className="h-1.5 mb-1" />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">
                      {asset.missionsCompleted}/{asset.missionsTotal} missions
                    </span>
                    {isMastered && (
                      <Badge className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0">
                        <Star className="h-2 w-2 mr-0.5 fill-amber-300" />
                        Mastered
                      </Badge>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Unlock hint */}
      {masteredCount < 6 && (
        <div className="mt-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-xs text-slate-400">
              <span className="text-slate-300">Pro tip:</span> Complete missions using different asset classes to unlock the Diversification Pro badge!
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssetClassMastery;


