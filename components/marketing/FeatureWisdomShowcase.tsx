/**
 * FeatureWisdomShowcase.tsx - Shows how features connect to wealth wisdom
 * Links quick wins to marketing messages and educational value
 */

"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  BookOpen,
  Zap,
  Trophy,
  Flame,
  Target,
  TrendingUp,
  Shield,
  Rocket,
  Gift,
  ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { featureBenefits, FeatureBenefit } from "@/components/data/marketingMessages";
import { wealthPillars } from "@/components/data/wealthWisdom";

interface FeatureWisdomShowcaseProps {
  variant?: "grid" | "list" | "carousel";
  showPillarContext?: boolean;
  className?: string;
}

const pillarIcons: Record<string, React.ReactNode> = {
  accumulation: <TrendingUp className="h-4 w-4" />,
  preservation: <Shield className="h-4 w-4" />,
  growth: <Rocket className="h-4 w-4" />,
  transfer: <Gift className="h-4 w-4" />
};

const pillarColors: Record<string, string> = {
  accumulation: "from-emerald-500 to-green-600",
  preservation: "from-blue-500 to-cyan-600",
  growth: "from-purple-500 to-pink-600",
  transfer: "from-amber-500 to-orange-600"
};

export function FeatureWisdomShowcase({ 
  variant = "grid",
  showPillarContext = true,
  className = ""
}: FeatureWisdomShowcaseProps) {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);

  const filteredFeatures = selectedPillar 
    ? featureBenefits.filter(f => f.wisdomPillar === selectedPillar)
    : featureBenefits;

  // Get pillar info
  const getPillarInfo = (pillarId: string) => {
    return wealthPillars.find(p => p.id === pillarId);
  };

  if (variant === "carousel") {
    return (
      <div className={`${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-purple-400" />
          <span className="text-sm font-semibold text-slate-300">Features × Wisdom</span>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {featureBenefits.map((feature) => (
            <div
              key={feature.featureId}
              className="flex-shrink-0 w-64 p-4 rounded-xl border border-slate-700/50 
                         bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur
                         hover:border-purple-500/30 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{feature.emoji}</span>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white line-clamp-1">
                    {feature.featureName}
                  </h4>
                </div>
              </div>
              
              <p className="text-xs text-emerald-400 mb-2">
                💡 {feature.marketingBenefit}
              </p>
              
              <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                {feature.userValue}
              </p>
              
              <Badge 
                className={`text-[10px] bg-gradient-to-r ${pillarColors[feature.wisdomPillar]} text-white border-0`}
              >
                {pillarIcons[feature.wisdomPillar]}
                <span className="ml-1 capitalize">{feature.wisdomPillar}</span>
              </Badge>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className={`${className}`}>
        <div className="space-y-3">
          {featureBenefits.slice(0, 5).map((feature) => (
            <div
              key={feature.featureId}
              className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 
                         border border-slate-700/50 hover:border-emerald-500/30 transition-all"
            >
              <span className="text-2xl">{feature.emoji}</span>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white">{feature.featureName}</h4>
                <p className="text-xs text-slate-400">{feature.userValue}</p>
              </div>
              <Badge 
                variant="outline" 
                className={`text-[10px] border-slate-600 text-slate-400`}
              >
                <span className="capitalize">{feature.wisdomPillar}</span>
              </Badge>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Grid variant (default)
  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Every Feature Teaches</h3>
            <p className="text-sm text-slate-400">Gamification powered by Family Office wisdom</p>
          </div>
        </div>
        
        {/* Pillar filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedPillar(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedPillar === null 
                ? 'bg-purple-500 text-white' 
                : 'bg-slate-700/50 text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          {wealthPillars.map((pillar) => (
            <button
              key={pillar.id}
              onClick={() => setSelectedPillar(pillar.id === selectedPillar ? null : pillar.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                selectedPillar === pillar.id 
                  ? `bg-gradient-to-r ${pillarColors[pillar.id]} text-white` 
                  : 'bg-slate-700/50 text-slate-400 hover:text-white'
              }`}
            >
              {pillar.emoji}
              <span className="hidden sm:inline">{pillar.name.split(" ")[1]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected pillar context */}
      {showPillarContext && selectedPillar && (
        <div className={`mb-6 p-4 rounded-xl border border-slate-700/50 bg-gradient-to-r ${pillarColors[selectedPillar].replace('from-', 'from-').replace('to-', 'to-')}/10`}>
          {(() => {
            const pillarInfo = getPillarInfo(selectedPillar);
            if (!pillarInfo) return null;
            return (
              <div className="flex items-start gap-3">
                <span className="text-3xl">{pillarInfo.emoji}</span>
                <div>
                  <h4 className="font-bold text-white">{pillarInfo.name}</h4>
                  <p className="text-sm text-slate-300 mb-2">{pillarInfo.principle}</p>
                  <p className="text-xs text-slate-400 italic">"{pillarInfo.forTeens.slice(0, 150)}..."</p>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Features grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFeatures.map((feature) => (
          <div
            key={feature.featureId}
            className="group relative"
            onMouseEnter={() => setHoveredFeature(feature.featureId)}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className={`
              relative h-full p-4 rounded-xl border border-slate-700/50 
              bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur
              hover:border-purple-500/30 transition-all duration-300
              ${hoveredFeature === feature.featureId ? 'scale-[1.02]' : ''}
            `}>
              {/* Glow effect */}
              <div className={`
                absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 
                transition-opacity duration-300 bg-gradient-to-br ${pillarColors[feature.wisdomPillar]}
              `} />
              
              <div className="relative">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                    {feature.emoji}
                  </span>
                  <Badge 
                    className={`text-[10px] bg-gradient-to-r ${pillarColors[feature.wisdomPillar]} text-white border-0`}
                  >
                    {pillarIcons[feature.wisdomPillar]}
                  </Badge>
                </div>
                
                {/* Feature name */}
                <h4 className="text-sm font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {feature.featureName}
                </h4>
                
                {/* Marketing benefit */}
                <div className="flex items-start gap-2 mb-2">
                  <Target className="h-3 w-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-emerald-400 font-medium">
                    {feature.marketingBenefit}
                  </p>
                </div>
                
                {/* User value */}
                <p className="text-xs text-slate-400">
                  {feature.userValue}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-emerald-400" />
            <div>
              <p className="text-sm font-semibold text-white">
                Every feature connects to proven wealth-building principles
              </p>
              <p className="text-xs text-slate-400">
                Learn the same strategies Family Offices use to build generational wealth
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors">
            Start Learning
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FeatureWisdomShowcase;

