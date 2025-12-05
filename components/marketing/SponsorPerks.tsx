/**
 * SponsorPerks.tsx - Visual showcase of sponsor benefits and tiers
 * Encourages users to support through sponsorship
 */

"use client";

import React, { useState } from "react";
import {
  Heart,
  Crown,
  Star,
  Rocket,
  Gift,
  Users,
  Zap,
  Shield,
  Trophy,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Gem,
  Target,
  Clock,
  BadgeCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SponsorTier {
  id: string;
  name: string;
  price: string;
  monthlyPrice: number;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  borderColor: string;
  perks: string[];
  highlighted?: boolean;
  badge?: string;
}

const sponsorTiers: SponsorTier[] = [
  {
    id: "supporter",
    name: "Supporter",
    price: "$5/mo",
    monthlyPrice: 5,
    description: "Show your love and unlock starter perks",
    icon: <Heart className="h-6 w-6" />,
    color: "text-emerald-400",
    bgGradient: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/30",
    perks: [
      "Early access to new features",
      "Supporter badge on profile",
      "Double daily iii bonus",
      "Access to beta features",
      "Monthly newsletter with tips"
    ]
  },
  {
    id: "champion",
    name: "Champion",
    price: "$15/mo",
    monthlyPrice: 15,
    description: "Supercharge your learning journey",
    icon: <Star className="h-6 w-6" />,
    color: "text-violet-400",
    bgGradient: "from-violet-500/20 to-purple-500/20",
    borderColor: "border-violet-500/30",
    highlighted: true,
    badge: "Most Popular",
    perks: [
      "All Supporter perks",
      "Exclusive historical missions",
      "Private Discord community",
      "Priority feature requests",
      "Champion badge + NFT",
      "1-on-1 AI coaching sessions",
      "Advanced portfolio analytics"
    ]
  },
  {
    id: "guardian",
    name: "Guardian",
    price: "$50/mo",
    monthlyPrice: 50,
    description: "Become a founding member & shape our future",
    icon: <Crown className="h-6 w-6" />,
    color: "text-amber-400",
    bgGradient: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/30",
    badge: "Founder",
    perks: [
      "All Champion perks",
      "Name in credits & Hall of Fame",
      "Unique Guardian NFT badge",
      "Direct input on roadmap",
      "Monthly founder calls",
      "Free merchandise",
      "Lifetime premium access",
      "Sponsor a teen's access"
    ]
  }
];

interface ImpactStat {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}

const impactStats: ImpactStat[] = [
  {
    icon: <Users className="h-5 w-5" />,
    value: "1,000+",
    label: "Teens Learning",
    color: "text-emerald-400"
  },
  {
    icon: <Target className="h-5 w-5" />,
    value: "70%",
    label: "Have No Fin Education",
    color: "text-amber-400"
  },
  {
    icon: <Trophy className="h-5 w-5" />,
    value: "100%",
    label: "Free for Teens",
    color: "text-cyan-400"
  },
  {
    icon: <Clock className="h-5 w-5" />,
    value: "24/7",
    label: "AI Mentorship",
    color: "text-purple-400"
  }
];

interface SponsorPerksProps {
  variant?: "compact" | "full" | "cards";
  className?: string;
}

export function SponsorPerks({
  variant = "full",
  className = ""
}: SponsorPerksProps) {
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);

  // Compact perks preview
  if (variant === "compact") {
    return (
      <div className={`${className}`}>
        <div className="p-4 rounded-xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="h-4 w-4 text-pink-400" />
            <span className="text-sm font-semibold text-slate-200">Why Sponsor?</span>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              <span>Keep it free for every teen</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              <span>Get exclusive premium features</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              <span>Shape the future of fin-ed</span>
            </div>
          </div>
          
          <a
            href="https://github.com/sponsors/nuvcai"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-sm font-medium rounded-lg transition-all hover:scale-105"
          >
            <Heart className="h-4 w-4" />
            From $5/mo
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    );
  }

  // Card layout for comparison
  if (variant === "cards") {
    return (
      <div className={`${className}`}>
        <div className="grid md:grid-cols-3 gap-4">
          {sponsorTiers.map((tier) => (
            <div
              key={tier.id}
              className={`
                relative p-6 rounded-2xl border transition-all duration-300
                bg-gradient-to-br ${tier.bgGradient} ${tier.borderColor}
                ${hoveredTier === tier.id ? 'scale-105 shadow-2xl' : ''}
                ${tier.highlighted ? 'ring-2 ring-violet-500/50' : ''}
              `}
              onMouseEnter={() => setHoveredTier(tier.id)}
              onMouseLeave={() => setHoveredTier(null)}
            >
              {/* Badge */}
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className={`${tier.highlighted ? 'bg-violet-500 text-white' : 'bg-amber-500 text-white'} text-xs px-3`}>
                    {tier.badge}
                  </Badge>
                </div>
              )}
              
              {/* Header */}
              <div className="text-center mb-4">
                <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${tier.bgGradient} ${tier.borderColor} border flex items-center justify-center mb-3 ${tier.color}`}>
                  {tier.icon}
                </div>
                <h3 className={`text-xl font-bold ${tier.color}`}>{tier.name}</h3>
                <div className="text-2xl font-bold text-slate-100 mt-1">{tier.price}</div>
                <p className="text-xs text-slate-500 mt-1">{tier.description}</p>
              </div>
              
              {/* Perks */}
              <ul className="space-y-2 mb-6">
                {tier.perks.map((perk, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${tier.color}`} />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
              
              {/* CTA */}
              <a
                href="https://github.com/sponsors/nuvcai"
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  w-full inline-flex items-center justify-center gap-2 px-4 py-3 
                  font-semibold rounded-xl transition-all
                  ${tier.highlighted 
                    ? 'bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white' 
                    : `bg-slate-800 hover:bg-slate-700 ${tier.color} border ${tier.borderColor}`
                  }
                `}
              >
                {tier.icon}
                Become {tier.name}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Full detailed view
  return (
    <div className={`${className}`}>
      {/* Header Section */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 mb-4">
          <Heart className="h-4 w-4 text-pink-400 animate-pulse" />
          <span className="text-sm font-semibold text-pink-300">Support Our Mission</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-3">
          Join Our <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Community of Supporters</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Your support helps us make financial literacy accessible to every teenager. 
          Choose your tier and unlock exclusive benefits!
        </p>
      </div>

      {/* Impact Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {impactStats.map((stat, index) => (
          <div 
            key={index}
            className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center"
          >
            <div className={`${stat.color} flex justify-center mb-2`}>
              {stat.icon}
            </div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tier Cards */}
      <div className="grid lg:grid-cols-3 gap-6 mb-10">
        {sponsorTiers.map((tier) => (
          <div
            key={tier.id}
            className={`
              relative p-6 sm:p-8 rounded-2xl border-2 transition-all duration-300
              bg-gradient-to-br from-slate-800/80 to-slate-900/80
              ${hoveredTier === tier.id 
                ? `${tier.borderColor} scale-[1.02] shadow-2xl shadow-${tier.color}/20` 
                : 'border-slate-700/50'
              }
              ${tier.highlighted ? 'lg:-mt-4 lg:mb-4' : ''}
            `}
            onMouseEnter={() => setHoveredTier(tier.id)}
            onMouseLeave={() => setHoveredTier(null)}
          >
            {/* Badge */}
            {tier.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className={`
                  ${tier.highlighted 
                    ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white' 
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                  } text-xs px-4 py-1
                `}>
                  <Sparkles className="h-3 w-3 mr-1" />
                  {tier.badge}
                </Badge>
              </div>
            )}

            {/* Tier header */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`
                w-16 h-16 rounded-2xl bg-gradient-to-br ${tier.bgGradient}
                flex items-center justify-center ${tier.color}
                border ${tier.borderColor}
              `}>
                {tier.icon}
              </div>
              <div>
                <h3 className={`text-2xl font-bold ${tier.color}`}>{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-slate-100">{tier.price}</span>
                </div>
              </div>
            </div>

            <p className="text-slate-400 mb-6">{tier.description}</p>

            {/* Perks list */}
            <div className="space-y-3 mb-8">
              {tier.perks.map((perk, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`p-1 rounded-full bg-gradient-to-br ${tier.bgGradient}`}>
                    <CheckCircle2 className={`h-4 w-4 ${tier.color}`} />
                  </div>
                  <span className="text-slate-300 text-sm">{perk}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <a
              href="https://github.com/sponsors/nuvcai"
              target="_blank"
              rel="noopener noreferrer"
              className={`
                w-full inline-flex items-center justify-center gap-2 px-6 py-4 
                font-bold rounded-xl transition-all hover:scale-[1.02]
                ${tier.highlighted 
                  ? 'bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg shadow-purple-500/25' 
                  : `bg-gradient-to-br ${tier.bgGradient} ${tier.color} border-2 ${tier.borderColor} hover:bg-slate-800`
                }
              `}
            >
              {tier.icon}
              <span>Become a {tier.name}</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        ))}
      </div>

      {/* Trust & Social Proof */}
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 border-2 border-slate-900 flex items-center justify-center text-white text-xs font-bold"
                >
                  {['👨‍💻', '👩‍🎓', '🧑‍💼', '👨‍🏫', '👩‍🔬'][i]}
                </div>
              ))}
            </div>
            <div>
              <div className="font-semibold text-slate-100">Backed by Educators & Parents</div>
              <div className="text-sm text-slate-400">Join 50+ supporters who believe in financial literacy for all</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              <Shield className="h-3 w-3 mr-1" />
              Secure Payment
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              <BadgeCheck className="h-3 w-3 mr-1" />
              GitHub Sponsors
            </Badge>
          </div>
        </div>
      </div>

      {/* FAQ / Questions */}
      <div className="mt-8 text-center">
        <p className="text-slate-500 text-sm">
          Questions? Email us at{" "}
          <a href="mailto:hello@nuvc.ai" className="text-pink-400 hover:text-pink-300 underline">
            hello@nuvc.ai
          </a>
          {" "}or{" "}
          <a href="https://twitter.com/nuvcai" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300 underline">
            DM us on X
          </a>
        </p>
      </div>
    </div>
  );
}

export default SponsorPerks;


