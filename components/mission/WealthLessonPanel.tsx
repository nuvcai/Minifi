"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  Lightbulb, 
  TrendingUp, 
  Star,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Sparkles
} from "lucide-react";
import { missionData, type MissionData } from "@/components/data/missions";

interface WealthLessonPanelProps {
  year: number;
  selectedOption?: string;
  actualReturn?: number;
  performance?: "profit" | "loss";
  compact?: boolean;
  onExploreLibrary?: () => void;
}

export function WealthLessonPanel({
  year,
  selectedOption,
  actualReturn,
  performance,
  compact = false,
  onExploreLibrary
}: WealthLessonPanelProps) {
  const [isExpanded, setIsExpanded] = useState(!compact);
  
  const mission = missionData[year];
  
  if (!mission || !mission.wealthLesson) {
    return null;
  }
  
  // Get personalized context based on performance
  const getPersonalizedContext = () => {
    if (!performance || !selectedOption || actualReturn === undefined) {
      return "";
    }
    
    if (performance === "profit") {
      return `Great choice with ${selectedOption}! Your ${actualReturn.toFixed(1)}% return shows you understood this era's dynamics.`;
    } else {
      return `${selectedOption} was challenging in this era. Your ${actualReturn.toFixed(1)}% loss teaches valuable lessons for future decisions.`;
    }
  };
  
  if (compact) {
    return (
      <Card className="bg-linear-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="p-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-amber-600" />
              <span className="font-semibold text-gray-800">Wealth Lesson</span>
            </div>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            )}
          </button>
          
          {isExpanded && (
            <div className="mt-4 space-y-3">
              <p className="text-sm text-gray-700">{mission.wealthLesson}</p>
              {onExploreLibrary && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onExploreLibrary}
                  className="w-full"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Explore Wisdom Library
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden border-2 border-amber-200 shadow-lg">
      {/* Gradient Header */}
      <div className="bg-linear-to-r from-amber-400 to-orange-500 text-white p-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 rounded-full p-2">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Wealth Wisdom from {year}</h3>
            <p className="text-white/80 text-sm">Lessons that build generational wealth</p>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6 space-y-6">
        {/* Personalized Context */}
        {getPersonalizedContext() && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start gap-2">
              <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
              <p className="text-blue-800">{getPersonalizedContext()}</p>
            </div>
          </div>
        )}
        
        {/* Wealth Lesson */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-100 text-amber-800">
              <GraduationCap className="h-3 w-3 mr-1" />
              Wealth Lesson
            </Badge>
          </div>
          <p className="text-gray-700 leading-relaxed">{mission.wealthLesson}</p>
        </div>
        
        {/* FO Wisdom */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-100 text-purple-800">
              <Lightbulb className="h-3 w-3 mr-1" />
              Family Office Wisdom
            </Badge>
          </div>
          <p className="text-gray-700 leading-relaxed">{mission.foWisdom}</p>
        </div>
        
        {/* Historical Opportunity */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800">
              <TrendingUp className="h-3 w-3 mr-1" />
              The Opportunity
            </Badge>
          </div>
          <p className="text-gray-700 leading-relaxed">{mission.historicalOpportunity}</p>
        </div>
        
        {/* Hope Message */}
        <div className="bg-linear-to-r from-rose-50 to-orange-50 rounded-lg p-4 border border-rose-200">
          <div className="flex items-start gap-2">
            <Star className="h-5 w-5 text-rose-500 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-800 mb-1">For You</p>
              <p className="text-gray-700">{mission.hopeMessage}</p>
            </div>
          </div>
        </div>
        
        {/* CTA to Wisdom Library */}
        {onExploreLibrary && (
          <div className="pt-2">
            <Button 
              onClick={onExploreLibrary}
              className="w-full bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Explore Full Wisdom Library
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default WealthLessonPanel;


