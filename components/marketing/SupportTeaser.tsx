/**
 * SupportTeaser.tsx - Premium feature teaser to encourage sponsorship
 * Shows locked premium features with compelling value proposition
 */

"use client";

import React, { useState } from "react";
import {
  Crown,
  Lock,
  Unlock,
  Heart,
  Sparkles,
  Zap,
  Trophy,
  Star,
  Rocket,
  Gift,
  Users,
  TrendingUp,
  ChevronRight,
  CheckCircle2,
  Gem,
  Shield,
  Target,
  BarChart3
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  tier: "supporter" | "champion" | "guardian";
  comingSoon?: boolean;
}

const premiumFeatures: PremiumFeature[] = [
  {
    id: "advanced-analytics",
    name: "Advanced Portfolio Analytics",
    description: "Deep dive into your portfolio performance with institutional-grade metrics",
    icon: <BarChart3 className="h-5 w-5" />,
    tier: "supporter"
  },
  {
    id: "ai-mentor",
    name: "Personal AI Mentor",
    description: "1-on-1 AI coaching sessions tailored to your learning style",
    icon: <Sparkles className="h-5 w-5" />,
    tier: "supporter"
  },
  {
    id: "certification",
    name: "FO Certification Fast-Track",
    description: "Accelerated path to earn your Family Office Fellow credential",
    icon: <Trophy className="h-5 w-5" />,
    tier: "champion"
  },
  {
    id: "exclusive-missions",
    name: "Exclusive Historical Missions",
    description: "Access 12+ additional time-travel scenarios with real data",
    icon: <Rocket className="h-5 w-5" />,
    tier: "champion"
  },
  {
    id: "real-rewards",
    name: "Double XP & Real Rewards",
    description: "2x XP multiplier + exclusive gift card redemptions",
    icon: <Gift className="h-5 w-5" />,
    tier: "supporter"
  },
  {
    id: "community",
    name: "Private Discord Community",
    description: "Connect with other aspiring investors and mentors",
    icon: <Users className="h-5 w-5" />,
    tier: "champion"
  },
  {
    id: "early-access",
    name: "Early Access Features",
    description: "Be first to try new features before public release",
    icon: <Zap className="h-5 w-5" />,
    tier: "supporter"
  },
  {
    id: "name-in-credits",
    name: "Name in Credits & NFT Badge",
    description: "Permanent recognition + unique supporter NFT badge",
    icon: <Gem className="h-5 w-5" />,
    tier: "guardian"
  }
];

const tierConfig = {
  supporter: {
    name: "Supporter",
    price: "$5/mo",
    color: "from-emerald-400 to-teal-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    textColor: "text-emerald-400",
    icon: <Heart className="h-5 w-5" />
  },
  champion: {
    name: "Champion",
    price: "$15/mo",
    color: "from-violet-400 to-purple-500",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/30",
    textColor: "text-violet-400",
    icon: <Star className="h-5 w-5" />
  },
  guardian: {
    name: "Guardian",
    price: "$50/mo",
    color: "from-amber-400 to-orange-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    textColor: "text-amber-400",
    icon: <Crown className="h-5 w-5" />
  }
};

interface SupportTeaserProps {
  variant?: "compact" | "full" | "banner";
  className?: string;
}

export function SupportTeaser({
  variant = "compact",
  className = ""
}: SupportTeaserProps) {
  const [selectedTier, setSelectedTier] = useState<"supporter" | "champion" | "guardian">("supporter");
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  // Compact Banner for top of pages
  if (variant === "banner") {
    return (
      <div className={`${className}`}>
        <div className="relative overflow-hidden rounded-xl bg-linear-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-pink-500/20 p-4">
          {/* Animated background */}
          <div className="absolute inset-0 bg-linear-to-r from-pink-500/5 via-purple-500/5 to-indigo-500/5 animate-pulse" />
          
          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-linear-to-br from-pink-500 to-purple-500">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-100">Unlock the Full Experience</span>
                  <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30 text-xs">
                    <Sparkles className="h-2.5 w-2.5 mr-1" />
                    Premium
                  </Badge>
                </div>
                <p className="text-sm text-slate-400">
                  Support our mission & get exclusive features!
                </p>
              </div>
            </div>
            
            <a
              href="https://github.com/sponsors/nuvcai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/40 transition-all hover:scale-105 whitespace-nowrap"
            >
              <Heart className="h-4 w-4" />
              Become a Sponsor
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Compact preview widget
  if (variant === "compact") {
    return (
      <div className={`${className}`}>
        <div className="relative p-4 rounded-xl bg-linear-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 overflow-hidden">
          {/* Glow effect */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-linear-to-br from-pink-500 to-purple-500">
                  <Crown className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-slate-200">Go Premium</span>
              </div>
              <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30 text-[10px]">
                <Sparkles className="h-2.5 w-2.5 mr-1" />
                8 Features
              </Badge>
            </div>
            
            {/* Feature preview */}
            <div className="space-y-2 mb-3">
              {premiumFeatures.slice(0, 3).map((feature) => (
                <div 
                  key={feature.id}
                  className="flex items-center gap-2 text-xs text-slate-400"
                >
                  <Lock className="h-3 w-3 text-pink-400/50" />
                  <span className="line-clamp-1">{feature.name}</span>
                </div>
              ))}
              <div className="text-xs text-slate-500 pl-5">
                +5 more premium features...
              </div>
            </div>
            
            <a
              href="https://github.com/sponsors/nuvcai"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-linear-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 text-pink-300 text-sm font-medium rounded-lg border border-pink-500/30 transition-all"
            >
              <Heart className="h-3.5 w-3.5" />
              Unlock from $5/mo
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Full detailed view
  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 mb-4">
          <Sparkles className="h-4 w-4 text-pink-400 animate-pulse" />
          <span className="text-sm font-semibold text-pink-300">Support Our Mission</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-100 mb-2">
          Unlock the <span className="bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Full Experience</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Your sponsorship helps us make financial literacy free for every teen. 
          Get exclusive features and join our community of supporters!
        </p>
      </div>

      {/* Tier Selector */}
      <div className="flex justify-center gap-3 mb-8">
        {(Object.keys(tierConfig) as Array<keyof typeof tierConfig>).map((tier) => {
          const config = tierConfig[tier];
          const isSelected = selectedTier === tier;
          return (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`
                relative px-6 py-3 rounded-xl border transition-all duration-300
                ${isSelected 
                  ? `${config.bgColor} ${config.borderColor} scale-105 shadow-lg` 
                  : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 opacity-70 hover:opacity-100'
                }
              `}
            >
              {tier === "champion" && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                  <Badge className="bg-violet-500 text-white text-[10px] px-2">
                    Popular
                  </Badge>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg bg-linear-to-br ${config.color}`}>
                  {config.icon}
                </div>
                <div className="text-left">
                  <div className={`font-semibold ${isSelected ? config.textColor : 'text-slate-300'}`}>
                    {config.name}
                  </div>
                  <div className="text-xs text-slate-500">{config.price}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Features Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {premiumFeatures.map((feature) => {
          const isUnlocked = 
            (feature.tier === "supporter") ||
            (feature.tier === "champion" && (selectedTier === "champion" || selectedTier === "guardian")) ||
            (feature.tier === "guardian" && selectedTier === "guardian");
          const tierConf = tierConfig[feature.tier];
          
          return (
            <div
              key={feature.id}
              className={`
                relative p-4 rounded-xl border transition-all duration-300
                ${isUnlocked 
                  ? `${tierConf.bgColor} ${tierConf.borderColor}` 
                  : 'bg-slate-800/30 border-slate-700/50 opacity-50'
                }
              `}
              onMouseEnter={() => setHoveredFeature(feature.id)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              {/* Lock/Unlock indicator */}
              <div className="absolute -top-2 -right-2">
                {isUnlocked ? (
                  <div className={`p-1 rounded-full bg-linear-to-br ${tierConf.color}`}>
                    <Unlock className="h-3 w-3 text-white" />
                  </div>
                ) : (
                  <div className="p-1 rounded-full bg-slate-700">
                    <Lock className="h-3 w-3 text-slate-400" />
                  </div>
                )}
              </div>
              
              {/* Icon */}
              <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center mb-3
                ${isUnlocked 
                  ? `bg-linear-to-br ${tierConf.color} text-white` 
                  : 'bg-slate-700 text-slate-400'
                }
              `}>
                {feature.icon}
              </div>
              
              {/* Content */}
              <h4 className={`font-semibold mb-1 ${isUnlocked ? tierConf.textColor : 'text-slate-400'}`}>
                {feature.name}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2">
                {feature.description}
              </p>
              
              {/* Tier badge */}
              <Badge 
                className={`
                  mt-2 text-[10px]
                  ${isUnlocked 
                    ? `${tierConf.bgColor} ${tierConf.textColor} ${tierConf.borderColor}` 
                    : 'bg-slate-800 text-slate-500 border-slate-700'
                  }
                `}
              >
                {tierConf.name}
              </Badge>
            </div>
          );
        })}
      </div>

      {/* Impact Statement */}
      <div className="bg-linear-to-r from-emerald-500/10 to-teal-500/10 rounded-xl p-6 border border-emerald-500/20 mb-8">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-linear-to-br from-emerald-500 to-teal-500">
            <Target className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 mb-2">Your Impact</h3>
            <p className="text-sm text-slate-400 mb-4">
              Every dollar you contribute helps us:
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-300">Keep the platform 100% free for teens</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-300">Build more educational content</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-300">Expand to schools & communities</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <a
          href="https://github.com/sponsors/nuvcai"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white font-bold text-lg rounded-2xl shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/40 transition-all hover:scale-105"
        >
          <Heart className="h-5 w-5" />
          Become a {tierConfig[selectedTier].name}
          <span className="text-white/70">({tierConfig[selectedTier].price})</span>
        </a>
        <p className="text-sm text-slate-500 mt-3">
          Cancel anytime • Secure payment via GitHub Sponsors
        </p>
      </div>
    </div>
  );
}

export default SupportTeaser;


