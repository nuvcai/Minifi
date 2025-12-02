"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Share2, Bookmark, Sparkles } from "lucide-react";
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

// Generate deterministic "daily" wisdom based on date
function getDailyWisdom(): DailyWisdomContent {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 
    (1000 * 60 * 60 * 24)
  );
  
  // Rotate through different content types
  const types: WisdomType[] = ["pillar", "investor", "hope", "principle"];
  const typeIndex = dayOfYear % types.length;
  const type = types[typeIndex];
  
  switch (type) {
    case "pillar": {
      const pillar = wealthPillars[dayOfYear % wealthPillars.length];
      return {
        type: "pillar",
        title: `${pillar.emoji} ${pillar.name}`,
        content: pillar.foWisdom,
        forTeens: pillar.forTeens
      };
    }
    case "investor": {
      const investor = investorWisdom[dayOfYear % investorWisdom.length];
      return {
        type: "investor",
        title: `🏆 ${investor.investor}`,
        content: `"${investor.quote}"`,
        source: investor.era,
        forTeens: investor.forTeens
      };
    }
    case "hope": {
      const hope = hopeMessages[dayOfYear % hopeMessages.length];
      return {
        type: "hope",
        title: `✨ ${hope.title}`,
        content: hope.message,
        forTeens: hope.callToAction
      };
    }
    case "principle": {
      const principle = foPrinciples[dayOfYear % foPrinciples.length];
      return {
        type: "principle",
        title: `💡 Principle #${principle.number}`,
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
        title: `${pillar.emoji} ${pillar.name}`,
        content: pillar.foWisdom,
        forTeens: pillar.forTeens
      };
    }
    case "investor": {
      const investor = getRandomInvestorWisdom();
      return {
        type: "investor",
        title: `🏆 ${investor.investor}`,
        content: `"${investor.quote}"`,
        source: investor.era,
        forTeens: investor.forTeens
      };
    }
    case "hope": {
      const hope = getRandomHopeMessage();
      return {
        type: "hope",
        title: `✨ ${hope.title}`,
        content: hope.message,
        forTeens: hope.callToAction
      };
    }
    case "principle": {
      const principle = foPrinciples[Math.floor(Math.random() * foPrinciples.length)];
      return {
        type: "principle",
        title: `💡 Principle #${principle.number}`,
        content: principle.principle,
        forTeens: principle.howTeensCanApplyIt
      };
    }
  }
}

const typeColors = {
  pillar: "from-amber-400 to-orange-500",
  investor: "from-purple-400 to-pink-500",
  hope: "from-rose-400 to-orange-500",
  principle: "from-emerald-400 to-teal-500"
};

const typeLabels = {
  pillar: "Wealth Pillar",
  investor: "Investor Wisdom",
  hope: "Daily Inspiration",
  principle: "FO Principle"
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
    <Card className={`overflow-hidden ${compact ? "" : "shadow-lg"}`}>
      {/* Gradient Header */}
      <div className={`bg-linear-to-r ${typeColors[wisdom.type]} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <Badge className="bg-white/20 text-white border-white/30 mb-2">
              <Sparkles className="h-3 w-3 mr-1" />
              {typeLabels[wisdom.type]}
            </Badge>
            <h3 className="text-xl font-bold">{wisdom.title}</h3>
            {wisdom.source && (
              <p className="text-white/80 text-sm mt-1">{wisdom.source}</p>
            )}
          </div>
          {showControls && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={refreshWisdom}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`text-white hover:bg-white/20 ${isBookmarked ? "bg-white/20" : ""}`}
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <CardContent className={`${compact ? "p-4" : "p-6"} space-y-4`}>
        {/* Main Content */}
        <p className={`text-gray-700 ${wisdom.type === "investor" ? "italic text-lg" : ""}`}>
          {wisdom.content}
        </p>
        
        {/* For Teens Section */}
        {wisdom.forTeens && !compact && (
          <div className="bg-linear-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🎯</span>
              <span className="font-semibold text-gray-800">What This Means For You</span>
            </div>
            <p className="text-gray-700 text-sm">{wisdom.forTeens}</p>
          </div>
        )}
        
        {/* Action Buttons */}
        {showControls && !compact && (
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" className="text-gray-500">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DailyWisdom;


