/**
 * RiskSpectrum.tsx - Visual risk/return spectrum for investments
 * Shows where each asset sits on the risk-reward scale
 */

"use client";

import React, { useState } from "react";
import { 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Shield,
  Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface AssetPosition {
  id: string;
  name: string;
  emoji: string;
  riskLevel: number; // 0-100
  returnLevel: number; // 0-100
  description: string;
  color: string;
}

// Default asset positions on the spectrum
const defaultAssets: AssetPosition[] = [
  {
    id: "cash",
    name: "Cash",
    emoji: "💵",
    riskLevel: 5,
    returnLevel: 15,
    description: "Safest option, lowest returns",
    color: "#64748b"
  },
  {
    id: "bonds",
    name: "Bonds",
    emoji: "📊",
    riskLevel: 20,
    returnLevel: 30,
    description: "Stable income, low volatility",
    color: "#22c55e"
  },
  {
    id: "gold",
    name: "Gold",
    emoji: "🥇",
    riskLevel: 35,
    returnLevel: 40,
    description: "Inflation hedge, moderate risk",
    color: "#eab308"
  },
  {
    id: "reits",
    name: "REITs",
    emoji: "🏢",
    riskLevel: 45,
    returnLevel: 55,
    description: "Real estate exposure, income + growth",
    color: "#a855f7"
  },
  {
    id: "stocks",
    name: "Stocks",
    emoji: "📈",
    riskLevel: 60,
    returnLevel: 70,
    description: "Growth potential, market volatility",
    color: "#3b82f6"
  },
  {
    id: "crypto",
    name: "Crypto",
    emoji: "₿",
    riskLevel: 90,
    returnLevel: 85,
    description: "Extreme volatility, high potential",
    color: "#f97316"
  }
];

interface RiskSpectrumProps {
  assets?: AssetPosition[];
  selectedAsset?: string;
  onAssetSelect?: (assetId: string) => void;
  variant?: "chart" | "linear" | "compact";
  showLabels?: boolean;
  className?: string;
}

export function RiskSpectrum({
  assets = defaultAssets,
  selectedAsset,
  onAssetSelect,
  variant = "linear",
  showLabels = true,
  className = ""
}: RiskSpectrumProps) {
  const [hoveredAsset, setHoveredAsset] = useState<string | null>(null);

  if (variant === "compact") {
    // Ultra compact horizontal bar version
    return (
      <div className={`${className}`}>
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-3 w-3 text-amber-400" />
          <span className="text-xs font-medium text-slate-400">Risk Spectrum</span>
        </div>
        
        <div className="relative h-8 rounded-full bg-linear-to-r from-green-500/20 via-yellow-500/20 to-red-500/20 border border-slate-700/50">
          {/* Risk labels */}
          <div className="absolute inset-x-0 -bottom-5 flex justify-between text-[9px] text-slate-500 px-2">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>
          
          {/* Asset dots */}
          {assets.map((asset) => (
            <Tooltip key={asset.id}>
              <TooltipTrigger>
                <div
                  className={`
                    absolute top-1/2 -translate-y-1/2 -translate-x-1/2
                    transition-all duration-200 cursor-pointer
                    ${hoveredAsset === asset.id || selectedAsset === asset.id ? 'scale-125 z-10' : ''}
                  `}
                  style={{ left: `${asset.riskLevel}%` }}
                  onMouseEnter={() => setHoveredAsset(asset.id)}
                  onMouseLeave={() => setHoveredAsset(null)}
                  onClick={() => onAssetSelect?.(asset.id)}
                >
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-sm
                    bg-slate-800 border-2 shadow-lg
                    ${selectedAsset === asset.id ? 'border-white' : 'border-slate-600'}
                  `}>
                    {asset.emoji}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs">
                  <p className="font-semibold">{asset.name}</p>
                  <p className="text-slate-400">{asset.description}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "linear") {
    // Horizontal bar with asset positions
    return (
      <div className={`${className}`}>
        {showLabels && (
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-400" />
              <span className="text-xs text-slate-400">Lower Risk</span>
            </div>
            <span className="text-xs font-medium text-slate-300">Risk / Return Spectrum</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Higher Risk</span>
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </div>
          </div>
        )}
        
        {/* Spectrum bar */}
        <div className="relative h-16 rounded-xl bg-linear-to-r from-green-500/10 via-yellow-500/10 via-orange-500/10 to-red-500/10 border border-slate-700/50 overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-green-500/5 via-yellow-500/5 via-orange-500/5 to-red-500/5" />
          
          {/* Grid lines */}
          <div className="absolute inset-0 flex">
            {[0, 1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="flex-1 border-r border-slate-700/30 last:border-r-0"
              />
            ))}
          </div>
          
          {/* Asset positions */}
          {assets.map((asset) => (
            <Tooltip key={asset.id}>
              <TooltipTrigger>
                <div
                  className={`
                    absolute top-1/2 -translate-y-1/2 -translate-x-1/2
                    transition-all duration-300 cursor-pointer
                    ${hoveredAsset === asset.id || selectedAsset === asset.id 
                      ? 'scale-110 z-20' 
                      : 'z-10'
                    }
                  `}
                  style={{ left: `${asset.riskLevel}%` }}
                  onMouseEnter={() => setHoveredAsset(asset.id)}
                  onMouseLeave={() => setHoveredAsset(null)}
                  onClick={() => onAssetSelect?.(asset.id)}
                >
                  <div 
                    className={`
                      relative px-2 py-1 rounded-lg flex items-center gap-1
                      bg-slate-800/90 border shadow-lg backdrop-blur
                      ${selectedAsset === asset.id 
                        ? 'border-white ring-2 ring-white/20' 
                        : hoveredAsset === asset.id
                          ? 'border-slate-500'
                          : 'border-slate-600'
                      }
                    `}
                  >
                    <span className="text-base">{asset.emoji}</span>
                    <span className="text-xs font-medium text-slate-300 whitespace-nowrap">
                      {asset.name}
                    </span>
                    
                    {/* Return indicator */}
                    <div className={`
                      flex items-center gap-0.5 text-[10px]
                      ${asset.returnLevel > 50 ? 'text-green-400' : 'text-slate-500'}
                    `}>
                      <TrendingUp className="h-2.5 w-2.5" />
                      {Math.round(asset.returnLevel / 10)}%
                    </div>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[200px]">
                <div className="text-xs space-y-1">
                  <p className="font-semibold">{asset.name}</p>
                  <p className="text-slate-400">{asset.description}</p>
                  <div className="flex gap-3 pt-1 border-t border-slate-700">
                    <span className="text-red-400">Risk: {asset.riskLevel}%</span>
                    <span className="text-green-400">Return: {asset.returnLevel}%</span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        
        {/* Risk zone labels */}
        <div className="flex justify-between mt-2 px-2">
          <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-400 border-green-500/30">
            Safe Zone
          </Badge>
          <Badge variant="outline" className="text-[10px] bg-yellow-500/10 text-yellow-400 border-yellow-500/30">
            Balanced
          </Badge>
          <Badge variant="outline" className="text-[10px] bg-red-500/10 text-red-400 border-red-500/30">
            High Risk
          </Badge>
        </div>
      </div>
    );
  }

  // Chart variant - 2D plot
  return (
    <div className={`${className}`}>
      {showLabels && (
        <div className="flex items-center gap-2 mb-3">
          <Info className="h-4 w-4 text-blue-400" />
          <span className="text-sm font-medium text-slate-300">Risk vs Return Chart</span>
        </div>
      )}
      
      <div className="relative aspect-square max-w-[300px] mx-auto">
        {/* Background grid */}
        <div className="absolute inset-0 rounded-xl bg-slate-800/50 border border-slate-700/50">
          {/* Quadrant colors */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 rounded-xl overflow-hidden opacity-20">
            <div className="bg-yellow-500" /> {/* High return, low risk - ideal */}
            <div className="bg-green-500" /> {/* High return, high risk */}
            <div className="bg-red-500" /> {/* Low return, low risk */}
            <div className="bg-orange-500" /> {/* Low return, high risk - avoid */}
          </div>
          
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full">
            {[25, 50, 75].map((pos) => (
              <React.Fragment key={pos}>
                <line 
                  x1={`${pos}%`} y1="0" x2={`${pos}%`} y2="100%" 
                  stroke="currentColor" 
                  strokeOpacity="0.1"
                  className="text-slate-400"
                />
                <line 
                  x1="0" y1={`${pos}%`} x2="100%" y2={`${pos}%`} 
                  stroke="currentColor" 
                  strokeOpacity="0.1"
                  className="text-slate-400"
                />
              </React.Fragment>
            ))}
          </svg>
        </div>
        
        {/* Axis labels */}
        <div className="absolute -bottom-6 inset-x-0 text-center">
          <span className="text-xs text-slate-500">Risk →</span>
        </div>
        <div className="absolute -left-8 inset-y-0 flex items-center">
          <span className="text-xs text-slate-500 -rotate-90 whitespace-nowrap">← Return</span>
        </div>
        
        {/* Asset dots */}
        {assets.map((asset) => (
          <Tooltip key={asset.id}>
            <TooltipTrigger>
              <div
                className={`
                  absolute -translate-x-1/2 translate-y-1/2
                  transition-all duration-300 cursor-pointer
                  ${hoveredAsset === asset.id || selectedAsset === asset.id 
                    ? 'scale-125 z-20' 
                    : 'z-10'
                  }
                `}
                style={{ 
                  left: `${asset.riskLevel}%`, 
                  bottom: `${asset.returnLevel}%` 
                }}
                onMouseEnter={() => setHoveredAsset(asset.id)}
                onMouseLeave={() => setHoveredAsset(null)}
                onClick={() => onAssetSelect?.(asset.id)}
              >
                <div 
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-lg
                    shadow-lg border-2 transition-all
                    ${selectedAsset === asset.id 
                      ? 'border-white bg-white/20' 
                      : 'border-slate-600 bg-slate-800'
                    }
                  `}
                  style={{ 
                    boxShadow: hoveredAsset === asset.id 
                      ? `0 0 20px ${asset.color}40` 
                      : undefined 
                  }}
                >
                  {asset.emoji}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs">
                <p className="font-semibold">{asset.name}</p>
                <p className="text-slate-400">{asset.description}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
        
        {/* Legend */}
        <div className="absolute -bottom-16 left-0 right-0 flex justify-center gap-4 text-[10px]">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500/50" />
            <span className="text-slate-500">Best</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
            <span className="text-slate-500">Good</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500/50" />
            <span className="text-slate-500">Risky</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RiskSpectrum;


