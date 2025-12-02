/**
 * RoadmapTeaser.tsx - Visual teaser for future development
 * Links wealth wisdom to upcoming features for marketing
 */

"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  Sparkles, 
  Lock, 
  Rocket,
  ChevronRight,
  Calendar,
  Zap,
  Star,
  Target,
  BookOpen
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  futureFeatureTeasers, 
  getUpcomingTeasers,
  getRandomTagline,
  type MarketingTagline
} from "@/components/data/marketingMessages";

interface RoadmapTeaserProps {
  variant?: "compact" | "expanded" | "banner";
  maxItems?: number;
  showWisdomConnection?: boolean;
  className?: string;
}

// Static mappings moved outside component to prevent re-creation
const STATUS_COLORS: Record<string, string> = {
  development: "from-emerald-500 to-green-600",
  coming_soon: "from-purple-500 to-violet-600",
  design: "from-blue-500 to-cyan-500",
  research: "from-amber-500 to-orange-500",
  beta: "from-pink-500 to-rose-500"
} as const;

const STATUS_LABELS: Record<string, string> = {
  development: "In Development",
  coming_soon: "Coming Soon",
  design: "Designing",
  research: "Researching",
  beta: "Beta Testing"
} as const;

const TAGLINE_ROTATION_INTERVAL = 8000;

export function RoadmapTeaser({ 
  variant = "compact", 
  maxItems = 4,
  showWisdomConnection = false,
  className = ""
}: RoadmapTeaserProps) {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [currentTagline, setCurrentTagline] = useState<MarketingTagline>(() => getRandomTagline());
  
  // Memoize computed values
  const upcomingFeatures = useMemo(() => getUpcomingTeasers(maxItems), [maxItems]);

  // Rotate taglines with stable interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTagline(getRandomTagline());
    }, TAGLINE_ROTATION_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Memoized handlers
  const handleFeatureHover = useCallback((featureId: string | null) => {
    setHoveredFeature(featureId);
  }, []);

  // Compact banner version
  if (variant === "banner") {
    return (
      <div className={`relative overflow-hidden rounded-xl ${className}`}>
        <div className="absolute inset-0 bg-linear-to-r from-purple-900/50 via-violet-900/50 to-pink-900/50" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.1)_1px,transparent_1px)] bg-size-[20px_20px]" />
        
        <div className="relative p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
              <Rocket className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <div className="text-xs text-purple-300 uppercase tracking-wider font-semibold">Coming Soon</div>
              <div className="text-sm text-white font-medium flex items-center gap-2">
                <span>{currentTagline.emoji}</span>
                <span className="line-clamp-1">{currentTagline.text}</span>
                {currentTagline.attribution && (
                  <span className="text-purple-400 text-xs">— {currentTagline.attribution}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {upcomingFeatures.slice(0, 3).map((feature) => (
              <div 
                key={feature.id}
                className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 border border-white/20"
              >
                <span className="text-sm">{feature.icon}</span>
                <span className="text-xs text-white/80">{feature.title.split(" ")[0]}</span>
              </div>
            ))}
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-500 hover:bg-purple-600 text-white text-xs font-medium transition-colors">
              Preview
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Compact card grid
  if (variant === "compact") {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-linear-to-br from-purple-500 to-pink-500">
              <Rocket className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">The Journey Ahead</h3>
              <p className="text-xs text-slate-400">Features coming to Legacy Guardians</p>
            </div>
          </div>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
            {futureFeatureTeasers.length} features planned
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {upcomingFeatures.map((feature) => (
            <div
              key={feature.id}
              className="group relative"
              onMouseEnter={() => setHoveredFeature(feature.id)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className={`
                relative p-3 rounded-xl border border-slate-700/50 
                bg-linear-to-br from-slate-800/80 to-slate-900/80 backdrop-blur
                hover:border-purple-500/30 transition-all duration-300
                ${hoveredFeature === feature.id ? 'scale-[1.02]' : ''}
              `}>
                {/* Glow effect */}
                <div className={`
                  absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 
                  transition-opacity duration-300 bg-linear-to-br ${STATUS_COLORS[feature.status]}
                `} />
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{feature.icon}</span>
                    <Lock className="h-3 w-3 text-slate-500" />
                  </div>
                  
                  <h4 className="text-xs font-semibold text-white mb-1 line-clamp-1">
                    {feature.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 line-clamp-2 mb-2">
                    {feature.teaser}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Calendar className="h-2.5 w-2.5" />
                      {feature.eta}
                    </div>
                    <Badge 
                      className={`text-[8px] px-1.5 py-0.5 bg-linear-to-r ${STATUS_COLORS[feature.status]} text-white border-0`}
                    >
                      {STATUS_LABELS[feature.status]}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showWisdomConnection && (
          <div className="mt-4 p-3 rounded-lg bg-linear-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
            <div className="flex items-start gap-2">
              <BookOpen className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-300">
                <span className="font-semibold">Built on Wealth Wisdom:</span>
                <span className="text-amber-300/80 ml-1">
                  Every feature connects to Family Office principles and generational wealth strategies.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Expanded version with full details
  return (
    <div className={`${className}`}>
      {/* Header with rotating tagline */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-4">
          <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
          <span className="text-sm text-purple-300 font-medium">The Road Ahead</span>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Building the Future of Financial Education
        </h2>
        
        {/* Rotating tagline */}
        <div className="min-h-[40px] flex items-center justify-center">
          <p className="text-slate-400 flex items-center gap-2 transition-opacity duration-500">
            <span className="text-xl">{currentTagline.emoji}</span>
            <span className="italic">"{currentTagline.text}"</span>
            {currentTagline.attribution && (
              <span className="text-slate-500">— {currentTagline.attribution}</span>
            )}
          </p>
        </div>
      </div>

      {/* Features timeline */}
      <div className="space-y-4">
        {upcomingFeatures.map((feature, index) => (
          <div
            key={feature.id}
            className="group relative"
            onMouseEnter={() => setHoveredFeature(feature.id)}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className={`
              relative p-5 rounded-2xl border border-slate-700/50 
              bg-linear-to-br from-slate-800/80 to-slate-900/80 backdrop-blur
              hover:border-purple-500/30 transition-all duration-300
            `}>
              {/* Animated background */}
              <div className={`
                absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 
                transition-opacity duration-300 bg-linear-to-br ${STATUS_COLORS[feature.status]}
              `} />
              
              <div className="relative flex gap-4">
                {/* Icon and timeline */}
                <div className="flex flex-col items-center">
                  <div className={`
                    w-14 h-14 rounded-xl bg-linear-to-br ${STATUS_COLORS[feature.status]}
                    flex items-center justify-center text-2xl shadow-lg
                    group-hover:scale-110 transition-transform duration-300
                  `}>
                    {feature.icon}
                  </div>
                  {index < upcomingFeatures.length - 1 && (
                    <div className="w-0.5 h-full bg-linear-to-b from-purple-500/50 to-transparent mt-2" />
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-slate-400">{feature.teaser}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={`text-xs bg-linear-to-r ${STATUS_COLORS[feature.status]} text-white border-0`}
                      >
                        {STATUS_LABELS[feature.status]}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-full">
                        <Calendar className="h-3 w-3" />
                        {feature.eta}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-300 mb-3">
                    {feature.fullDescription}
                  </p>
                  
                  {/* Marketing hook */}
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-400">
                      {feature.marketingHook}
                    </span>
                  </div>
                  
                  {/* Teen benefit */}
                  <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
                    <div className="flex items-start gap-2">
                      <Zap className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs text-amber-400 font-semibold">For Teens:</span>
                        <p className="text-xs text-slate-400 mt-0.5">{feature.benefitForTeens}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Wisdom connection */}
                  {showWisdomConnection && (
                    <div className="mt-2 flex items-start gap-2 text-xs text-purple-400">
                      <BookOpen className="h-3 w-3 shrink-0 mt-0.5" />
                      <span>{feature.wisdomConnection}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-8 text-center">
        <div className="inline-flex flex-col sm:flex-row items-center gap-4">
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold transition-all hover:scale-105 shadow-lg shadow-purple-500/25">
            <Star className="h-5 w-5" />
            Get Early Access
          </button>
          <span className="text-sm text-slate-500">
            Join {Math.floor(Math.random() * 500) + 2500}+ teens on the waitlist
          </span>
        </div>
      </div>
    </div>
  );
}

export default RoadmapTeaser;

