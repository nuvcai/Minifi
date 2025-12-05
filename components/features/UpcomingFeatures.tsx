/**
 * UpcomingFeatures.tsx - Teaser component for upcoming game features
 * Shows preview cards that attract users without overcrowding
 */

"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  Lock, 
  Target, 
  ChevronRight,
  Calendar,
  Gamepad2,
  GraduationCap,
  BarChart3,
  Rocket
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FeaturePreview {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: "coming_soon" | "beta" | "new";
  eta?: string;
  color: string;
}

const upcomingFeatures: FeaturePreview[] = [
  {
    id: "risk-quiz",
    title: "Risk Profile Quiz",
    description: "Discover your investor personality & get matched with your perfect AI coach",
    icon: <Target className="h-5 w-5" />,
    status: "coming_soon",
    eta: "Dec 2025",
    color: "from-violet-500 to-purple-600"
  },
  {
    id: "portfolio-builder",
    title: "Portfolio Builder",
    description: "Drag & drop to build your dream portfolio with real-time risk analysis",
    icon: <BarChart3 className="h-5 w-5" />,
    status: "coming_soon",
    eta: "Jan 2026",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "daily-challenge",
    title: "Risk Roulette",
    description: "Daily mini-game: Predict which asset wins! Earn bonus 🪙 & streaks",
    icon: <Gamepad2 className="h-5 w-5" />,
    status: "coming_soon",
    eta: "Dec 2025",
    color: "from-amber-500 to-orange-500"
  },
  {
    id: "fo-certification",
    title: "FO Certification",
    description: "Earn your Family Office Fellow badge & share your credentials",
    icon: <GraduationCap className="h-5 w-5" />,
    status: "coming_soon",
    eta: "Feb 2026",
    color: "from-emerald-500 to-teal-500"
  }
];

interface UpcomingFeaturesProps {
  variant?: "compact" | "full";
  maxItems?: number;
  className?: string;
}

export function UpcomingFeatures({ 
  variant = "compact", 
  maxItems = 4,
  className = ""
}: UpcomingFeaturesProps) {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const displayFeatures = upcomingFeatures.slice(0, maxItems);

  if (variant === "compact") {
    return (
      <div className={`${className}`}>
        {/* Compact horizontal scroll for home page */}
        <div className="flex items-center gap-2 mb-3">
          <Rocket className="h-4 w-4 text-purple-400" />
          <span className="text-sm font-semibold text-slate-300">Coming Soon</span>
          <Badge className="bg-purple-500/20 text-purple-300 text-xs border-purple-500/30">
            {upcomingFeatures.length} features
          </Badge>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {displayFeatures.map((feature) => (
            <div
              key={feature.id}
              className="shrink-0 group relative"
              onMouseEnter={() => setHoveredFeature(feature.id)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className={`
                relative w-40 p-3 rounded-xl border border-slate-700/50 
                bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur
                hover:border-purple-500/50 transition-all duration-300
                hover:shadow-lg hover:shadow-purple-500/10
                ${hoveredFeature === feature.id ? 'scale-105' : ''}
              `}>
                {/* Glow effect on hover */}
                <div className={`
                  absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300 bg-gradient-to-br ${feature.color}
                  blur-xl -z-10
                `} style={{ transform: 'scale(0.8)' }} />
                
                {/* Lock icon */}
                <div className="absolute -top-1.5 -right-1.5">
                  <div className="bg-slate-700 rounded-full p-1">
                    <Lock className="h-2.5 w-2.5 text-slate-400" />
                  </div>
                </div>
                
                {/* Icon */}
                <div className={`
                  w-8 h-8 rounded-lg bg-gradient-to-br ${feature.color}
                  flex items-center justify-center text-white mb-2
                `}>
                  {feature.icon}
                </div>
                
                {/* Title */}
                <h4 className="text-xs font-semibold text-slate-200 mb-1 line-clamp-1">
                  {feature.title}
                </h4>
                
                {/* ETA */}
                {feature.eta && (
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Calendar className="h-2.5 w-2.5" />
                    {feature.eta}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* "More coming" indicator */}
          <div className="shrink-0 w-20 flex items-center justify-center">
            <div className="text-center">
              <Sparkles className="h-4 w-4 text-purple-400 mx-auto mb-1 animate-pulse" />
              <span className="text-[10px] text-slate-500">More coming...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full variant for dedicated features page
  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Coming Soon</h2>
            <p className="text-sm text-slate-400">Exciting features on the way!</p>
          </div>
        </div>
        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
          {upcomingFeatures.length} upcoming
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {displayFeatures.map((feature) => (
          <div
            key={feature.id}
            className="group relative overflow-hidden"
            onMouseEnter={() => setHoveredFeature(feature.id)}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className={`
              relative p-4 rounded-2xl border border-slate-700/50 
              bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur
              hover:border-purple-500/30 transition-all duration-300
            `}>
              {/* Background gradient on hover */}
              <div className={`
                absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 
                transition-opacity duration-300 bg-gradient-to-br ${feature.color}
              `} />
              
              <div className="relative flex gap-4">
                {/* Icon */}
                <div className={`
                  shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color}
                  flex items-center justify-center text-white shadow-lg
                `}>
                  {feature.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-100">{feature.title}</h3>
                    <Lock className="h-3 w-3 text-slate-500" />
                  </div>
                  
                  <p className="text-sm text-slate-400 mb-2 line-clamp-2">
                    {feature.description}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className="text-[10px] bg-slate-800 border-slate-600 text-slate-400"
                    >
                      <Calendar className="h-2.5 w-2.5 mr-1" />
                      {feature.eta}
                    </Badge>
                    <Badge 
                      className={`text-[10px] ${
                        feature.status === "beta" 
                          ? "bg-amber-500/20 text-amber-300" 
                          : "bg-purple-500/20 text-purple-300"
                      }`}
                    >
                      {feature.status === "beta" ? "Beta" : "Coming Soon"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Notify me CTA */}
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <span className="text-sm text-slate-300">
              Want early access? Join our beta testers!
            </span>
          </div>
          <button className="px-4 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium transition-colors flex items-center gap-1">
            Notify Me
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpcomingFeatures;


