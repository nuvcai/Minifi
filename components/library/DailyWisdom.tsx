"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Bookmark, Sparkles } from "lucide-react";
import {
  wealthPillars,
  investorWisdom,
  hopeMessages,
  foPrinciples,
  getRandomHopeMessage,
  getRandomInvestorWisdom
} from "@/components/data/wealthWisdom";

type WisdomType = "pillar" | "investor" | "hope" | "principle";

interface DailyWisdomContent {
  type: WisdomType;
  title: string;
  content: string;
  source?: string;
  forTeens?: string;
}

function getDailyWisdom(): DailyWisdomContent {
  const today = new Date();
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
  }
}

function getRandomWisdom(): DailyWisdomContent {
  const types: WisdomType[] = ["pillar", "investor", "hope", "principle"];
  const type = types[Math.floor(Math.random() * types.length)];
  
  switch (type) {
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
  }
}

const typeColors = {
  pillar: "from-amber-500/20 to-orange-500/20 border-amber-500/30",
  investor: "from-violet-500/20 to-purple-500/20 border-violet-500/30",
  hope: "from-rose-500/20 to-pink-500/20 border-rose-500/30",
  principle: "from-indigo-500/20 to-blue-500/20 border-indigo-500/30"
};

const typeLabels = {
  pillar: "Wealth Pillar",
  investor: "Investor Wisdom",
  hope: "Daily Inspiration",
  principle: "Principle"
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
  
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${typeColors[wisdom.type]} border p-5 ${compact ? "" : "p-6"}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <Badge className="bg-white/10 text-white/70 border-white/10 mb-3 text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            {typeLabels[wisdom.type]}
          </Badge>
          <h3 className="text-lg font-semibold text-white">{wisdom.title}</h3>
          {wisdom.source && (
            <p className="text-white/50 text-sm mt-1">{wisdom.source}</p>
          )}
        </div>
        {showControls && (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/50 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
              onClick={refreshWisdom}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`text-white/50 hover:text-white hover:bg-white/10 h-8 w-8 p-0 ${isBookmarked ? "text-white bg-white/10" : ""}`}
              onClick={() => setIsBookmarked(!isBookmarked)}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
            </Button>
          </div>
        )}
      </div>
      
      {/* Content */}
      <p className={`text-white/80 ${wisdom.type === "investor" ? "italic" : ""} ${compact ? "text-sm" : ""}`}>
        {wisdom.content}
      </p>
      
      {/* For Teens */}
      {wisdom.forTeens && !compact && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-sm text-white/50">
            <span className="text-white/70 font-medium">Takeaway: </span>
            {wisdom.forTeens}
          </p>
        </div>
      )}
    </div>
  );
}

export default DailyWisdom;
