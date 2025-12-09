"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Bookmark, Sparkles, Quote, Lightbulb } from "lucide-react";
import {
  wealthPillars,
  investorWisdom,
  hopeMessages,
  foPrinciples,
  getRandomHopeMessage,
  getRandomInvestorWisdom
} from "@/components/data/wealthWisdom";

type WisdomType = "pillar" | "investor" | "hope" | "principle" | "story";

interface DailyWisdomContent {
  type: WisdomType;
  title: string;
  content: string;
  source?: string;
  forTeens?: string;
}

// 7 curated inspirational stories for the first week
const weekOneStories: DailyWisdomContent[] = [
  {
    type: "story",
    title: "Time Is Your Greatest Asset",
    content: "Here's math that should excite you: $100/month invested from age 15-25 (just 10 years) then left alone beats $100/month invested from age 25-65 (40 years!). Early money has more time to compound.",
    forTeens: "Start with even $10/month. Your future self will thank you for starting young."
  },
  {
    type: "story", 
    title: "The Coffee Shop Millionaire",
    content: "A teenager who skipped one $5 coffee per week and invested it instead would have over $150,000 by retirement. Small choices today become big results tomorrow.",
    forTeens: "Find your 'coffee' - a small expense you can redirect toward your future."
  },
  {
    type: "story",
    title: "Warren Buffett's First Investment",
    content: "At age 11, Warren Buffett bought his first stock for $38.25. He sold it when it rose to $40 - making just $5. Later, that stock rose to $200. He learned: patience pays more than quick wins.",
    source: "Warren Buffett, Age 11",
    forTeens: "The best investors aren't the smartest - they're the most patient."
  },
  {
    type: "story",
    title: "Why Rich People Stay Rich",
    content: "The wealthy don't work for money - they make money work for them. While you sleep, your investments are growing. This is called passive income, and it's the real secret to financial freedom.",
    forTeens: "Learn to build assets that generate income even when you're not working."
  },
  {
    type: "story",
    title: "The Rule of 72",
    content: "Want to know when your money will double? Divide 72 by your interest rate. At 8% returns, your money doubles every 9 years. Start at 15, and your money could double 6 times by 65!",
    forTeens: "That's 64x your original investment - math is on your side when you start young."
  },
  {
    type: "story",
    title: "Failing Forward",
    content: "Every great investor has lost money. Peter Lynch had many losing stocks. The key? His winners grew so much they covered all losses and more. You don't need to be right every time.",
    source: "Peter Lynch, Legendary Fund Manager",
    forTeens: "Don't fear mistakes - they're tuition for your financial education."
  },
  {
    type: "story",
    title: "The Power of Consistency",
    content: "Investing isn't about timing the market perfectly. It's about time IN the market. Someone who invested $200/month consistently for 40 years would have over $1 million, even through crashes.",
    forTeens: "Set up automatic investing and let consistency be your superpower."
  }
];

function getDailyWisdom(): DailyWisdomContent {
  // Get user's first visit date from localStorage, or set it
  const getStartDate = (): Date => {
    if (typeof window === 'undefined') return new Date();
    
    const stored = localStorage.getItem('minifi_first_visit');
    if (stored) {
      return new Date(stored);
    }
    const now = new Date();
    localStorage.setItem('minifi_first_visit', now.toISOString());
    return now;
  };
  
  const startDate = getStartDate();
  const today = new Date();
  const daysSinceStart = Math.floor(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // For the first 7 days, show curated stories
  if (daysSinceStart < 7) {
    return weekOneStories[daysSinceStart];
  }
  
  // After day 7, cycle through other content
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 
    (1000 * 60 * 60 * 24)
  );
  
  const types: WisdomType[] = ["pillar", "investor", "hope", "principle"];
  const typeIndex = dayOfYear % types.length;
  const type = types[typeIndex];
  
  switch (type) {
    case "pillar": {
      const pillar = wealthPillars[dayOfYear % wealthPillars.length];
      return {
        type: "pillar",
        title: pillar.name,
        content: pillar.foWisdom,
        forTeens: pillar.forTeens
      };
    }
    case "investor": {
      const investor = investorWisdom[dayOfYear % investorWisdom.length];
      return {
        type: "investor",
        title: investor.investor,
        content: `"${investor.quote}"`,
        source: investor.era,
        forTeens: investor.forTeens
      };
    }
    case "hope": {
      const hope = hopeMessages[dayOfYear % hopeMessages.length];
      return {
        type: "hope",
        title: hope.title,
        content: hope.message,
        forTeens: hope.callToAction
      };
    }
    case "principle": {
      const principle = foPrinciples[dayOfYear % foPrinciples.length];
      return {
        type: "principle",
        title: `Principle #${principle.number}`,
        content: principle.principle,
        forTeens: principle.howTeensCanApplyIt
      };
    }
    default:
      return weekOneStories[0];
  }
}

function getRandomWisdom(): DailyWisdomContent {
  const types: WisdomType[] = ["story", "pillar", "investor", "hope", "principle"];
  const type = types[Math.floor(Math.random() * types.length)];
  
  switch (type) {
    case "story": {
      return weekOneStories[Math.floor(Math.random() * weekOneStories.length)];
    }
    case "pillar": {
      const pillar = wealthPillars[Math.floor(Math.random() * wealthPillars.length)];
      return {
        type: "pillar",
        title: pillar.name,
        content: pillar.foWisdom,
        forTeens: pillar.forTeens
      };
    }
    case "investor": {
      const investor = getRandomInvestorWisdom();
      return {
        type: "investor",
        title: investor.investor,
        content: `"${investor.quote}"`,
        source: investor.era,
        forTeens: investor.forTeens
      };
    }
    case "hope": {
      const hope = getRandomHopeMessage();
      return {
        type: "hope",
        title: hope.title,
        content: hope.message,
        forTeens: hope.callToAction
      };
    }
    case "principle": {
      const principle = foPrinciples[Math.floor(Math.random() * foPrinciples.length)];
      return {
        type: "principle",
        title: `Principle #${principle.number}`,
        content: principle.principle,
        forTeens: principle.howTeensCanApplyIt
      };
    }
    default:
      return weekOneStories[0];
  }
}

const typeStyles: Record<WisdomType, {
  lightBg: string;
  darkBg: string;
  lightBorder: string;
  darkBorder: string;
  badge: string;
  accent: string;
  icon: string;
}> = {
  story: {
    lightBg: "from-[#9898f2]/20 via-[#9898f2]/10 to-white",
    darkBg: "dark:from-[#9898f2]/20 dark:via-[#9898f2]/10 dark:to-transparent",
    lightBorder: "border-[#9898f2]/40",
    darkBorder: "dark:border-[#9898f2]/30",
    badge: "bg-[#9898f2]/20 dark:bg-[#9898f2]/20 text-[#6060a0] dark:text-[#b8b8ff] border-[#9898f2]/40 dark:border-[#9898f2]/30",
    accent: "text-[#7070c0] dark:text-[#9898f2]",
    icon: "from-[#9898f2] to-[#7070c0]",
  },
  pillar: {
    lightBg: "from-amber-100 via-orange-50 to-white",
    darkBg: "dark:from-amber-500/20 dark:via-orange-500/10 dark:to-transparent",
    lightBorder: "border-amber-300",
    darkBorder: "dark:border-amber-500/30",
    badge: "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-500/30",
    accent: "text-amber-600 dark:text-amber-400",
    icon: "from-amber-400 to-orange-500",
  },
  investor: {
    lightBg: "from-violet-100 via-purple-50 to-white",
    darkBg: "dark:from-violet-500/20 dark:via-purple-500/10 dark:to-transparent",
    lightBorder: "border-violet-300",
    darkBorder: "dark:border-violet-500/30",
    badge: "bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-500/30",
    accent: "text-violet-600 dark:text-violet-400",
    icon: "from-violet-400 to-purple-500",
  },
  hope: {
    lightBg: "from-rose-100 via-pink-50 to-white",
    darkBg: "dark:from-rose-500/20 dark:via-pink-500/10 dark:to-transparent",
    lightBorder: "border-rose-300",
    darkBorder: "dark:border-rose-500/30",
    badge: "bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-500/30",
    accent: "text-rose-600 dark:text-rose-400",
    icon: "from-rose-400 to-pink-500",
  },
  principle: {
    lightBg: "from-emerald-100 via-teal-50 to-white",
    darkBg: "dark:from-emerald-500/20 dark:via-teal-500/10 dark:to-transparent",
    lightBorder: "border-emerald-300",
    darkBorder: "dark:border-emerald-500/30",
    badge: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30",
    accent: "text-emerald-600 dark:text-emerald-400",
    icon: "from-emerald-400 to-teal-500",
  }
};

const typeLabels: Record<WisdomType, string> = {
  story: "✨ Daily Inspiration",
  pillar: "💰 Wealth Pillar",
  investor: "🏆 Investor Wisdom",
  hope: "🌟 Hope & Growth",
  principle: "💡 Principle"
};

interface DailyWisdomProps {
  showControls?: boolean;
  compact?: boolean;
}

export function DailyWisdom({ showControls = true, compact = false }: DailyWisdomProps) {
  const [wisdom, setWisdom] = useState<DailyWisdomContent | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  useEffect(() => {
    setWisdom(getDailyWisdom());
  }, []);
  
  const refreshWisdom = () => {
    setWisdom(getRandomWisdom());
    setIsBookmarked(false);
  };
  
  if (!wisdom) return null;
  
  const style = typeStyles[wisdom.type];
  
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${style.lightBg} ${style.darkBg} border ${style.lightBorder} ${style.darkBorder} backdrop-blur-sm ${compact ? "p-4" : "p-5"} relative overflow-hidden shadow-lg dark:shadow-none`}>
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-slate-200/30 dark:bg-white/5 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-slate-200/30 dark:bg-white/5 rounded-full blur-xl" />
      
      {/* Header */}
      <div className="relative flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          {/* Icon container */}
          <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${style.icon} flex items-center justify-center shadow-lg`}>
            {wisdom.type === "investor" ? (
              <Quote className="h-5 w-5 text-white" />
            ) : (
              <Lightbulb className="h-5 w-5 text-white" />
            )}
          </div>
          <div>
            <Badge className={`${style.badge} mb-2 text-xs font-semibold`}>
              {typeLabels[wisdom.type]}
            </Badge>
            <h3 className="text-base font-bold text-slate-800 dark:text-white leading-tight">{wisdom.title}</h3>
            {wisdom.source && (
              <p className="text-slate-500 dark:text-white/50 text-xs mt-0.5">{wisdom.source}</p>
            )}
          </div>
        </div>
        {showControls && (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 dark:text-white/40 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 h-8 w-8 p-0 rounded-lg"
              onClick={refreshWisdom}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`text-slate-400 dark:text-white/40 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 h-8 w-8 p-0 rounded-lg ${isBookmarked ? "text-amber-500 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/20" : ""}`}
              onClick={() => setIsBookmarked(!isBookmarked)}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
            </Button>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="relative">
        <p className={`text-slate-600 dark:text-white/80 ${wisdom.type === "investor" ? "italic text-base leading-relaxed" : ""} ${compact ? "text-sm" : "text-sm"} leading-relaxed`}>
          {wisdom.content}
        </p>
      </div>
      
      {/* For Teens */}
      {wisdom.forTeens && !compact && (
        <div className="relative mt-4 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
          <p className="text-xs text-slate-600 dark:text-white/70">
            <span className={`font-bold ${style.accent}`}>🎯 Takeaway: </span>
            {wisdom.forTeens}
          </p>
        </div>
      )}
      
      {/* Mini sparkle decoration */}
      <div className="absolute bottom-2 right-2">
        <Sparkles className={`h-4 w-4 ${style.accent} opacity-40`} />
      </div>
    </div>
  );
}

export default DailyWisdom;
