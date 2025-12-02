"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Lightbulb, BookOpen, Star, TrendingUp } from "lucide-react";

interface WisdomCardProps {
  title: string;
  emoji?: string;
  category: "pillar" | "era" | "investor" | "principle" | "hope";
  mainContent: string;
  expandedContent?: string;
  forTeens?: string;
  keyActions?: string[];
  historicalExample?: string;
  quote?: string;
  tags?: string[];
}

const categoryStyles = {
  pillar: {
    bg: "bg-linear-to-br from-amber-50 to-orange-50",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-800",
    icon: <Star className="h-5 w-5 text-amber-600" />,
    label: "Wealth Pillar"
  },
  era: {
    bg: "bg-linear-to-br from-blue-50 to-indigo-50",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-800",
    icon: <TrendingUp className="h-5 w-5 text-blue-600" />,
    label: "Wealth Era"
  },
  investor: {
    bg: "bg-linear-to-br from-purple-50 to-pink-50",
    border: "border-purple-200",
    badge: "bg-purple-100 text-purple-800",
    icon: <BookOpen className="h-5 w-5 text-purple-600" />,
    label: "Investor Wisdom"
  },
  principle: {
    bg: "bg-linear-to-br from-emerald-50 to-teal-50",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-800",
    icon: <Lightbulb className="h-5 w-5 text-emerald-600" />,
    label: "FO Principle"
  },
  hope: {
    bg: "bg-linear-to-br from-rose-50 to-orange-50",
    border: "border-rose-200",
    badge: "bg-rose-100 text-rose-800",
    icon: <Star className="h-5 w-5 text-rose-600" />,
    label: "Hope & Opportunity"
  }
};

export function WisdomCard({
  title,
  emoji,
  category,
  mainContent,
  expandedContent,
  forTeens,
  keyActions,
  historicalExample,
  quote,
  tags
}: WisdomCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const style = categoryStyles[category];
  
  return (
    <Card className={`${style.bg} ${style.border} border-2 transition-all duration-300 hover:shadow-lg`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {style.icon}
            <Badge className={style.badge}>{style.label}</Badge>
          </div>
          {emoji && <span className="text-2xl">{emoji}</span>}
        </div>
        <CardTitle className="text-lg font-bold mt-2">{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Main Content */}
        <p className="text-gray-700 leading-relaxed">{mainContent}</p>
        
        {/* Quote (if available) */}
        {quote && (
          <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600">
            "{quote}"
          </blockquote>
        )}
        
        {/* Teen-friendly explanation */}
        {forTeens && (
          <div className="bg-white/50 rounded-lg p-3 border border-gray-200">
            <p className="text-sm font-medium text-gray-800 mb-1">💡 For You:</p>
            <p className="text-sm text-gray-700">{forTeens}</p>
          </div>
        )}
        
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Expandable Content */}
        {(expandedContent || keyActions || historicalExample) && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full justify-between"
            >
              <span>{isExpanded ? "Show Less" : "Learn More"}</span>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            
            {isExpanded && (
              <div className="space-y-4 pt-2 border-t">
                {expandedContent && (
                  <p className="text-gray-700">{expandedContent}</p>
                )}
                
                {keyActions && keyActions.length > 0 && (
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">🎯 Key Actions:</p>
                    <ul className="space-y-1">
                      {keyActions.map((action, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-emerald-500">✓</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {historicalExample && (
                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-800 mb-1">📜 Historical Example:</p>
                    <p className="text-sm text-gray-700">{historicalExample}</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default WisdomCard;


