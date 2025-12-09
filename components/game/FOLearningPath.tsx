/**
 * FOLearningPath - Family Office Learning Path Component
 * Light theme - Shows Tee's progression through FO education concepts
 * © 2025 NUVC.AI. All Rights Reserved.
 */

"use client";

import React, { useState } from "react";
import { 
  GraduationCap, 
  Shield, 
  TrendingUp, 
  Scale, 
  Leaf,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Lock,
  Star,
  BookOpen,
  Lightbulb,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FOConcept {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  unlocked: boolean;
  completed: boolean;
  lesson: string;
  foInsight: string;
  relatedYears: number[];
}

interface FOLearningPathProps {
  completedMissions: string[];
  onConceptClick?: (concept: FOConcept) => void;
}

const foConcepts: FOConcept[] = [
  {
    id: "preservation",
    title: "Capital Preservation",
    description: "Rule #1: Never lose money",
    icon: <Shield className="h-5 w-5" />,
    color: "text-blue-600",
    bgGradient: "from-blue-500 to-cyan-500",
    unlocked: true,
    completed: false,
    lesson: "The foundation of all Family Office wealth. Before you can grow money, you must learn to protect it.",
    foInsight: "Wealthy families survived centuries by losing LESS during crashes. A 50% loss needs 100% gain to recover!",
    relatedYears: [1990, 1997],
  },
  {
    id: "diversification",
    title: "True Diversification",
    description: "Not just many assets, but UNCORRELATED assets",
    icon: <Scale className="h-5 w-5" />,
    color: "text-emerald-600",
    bgGradient: "from-emerald-500 to-teal-500",
    unlocked: true,
    completed: false,
    lesson: "Owning 10 tech stocks isn't diversification. True FO portfolios have assets that move DIFFERENTLY.",
    foInsight: "When stocks crashed 50% in 2008, gold rose 25% and bonds gained 15%. That's real protection!",
    relatedYears: [2000, 2008],
  },
  {
    id: "trend-recognition",
    title: "Generational Trends",
    description: "Spotting tomorrow's giants today",
    icon: <TrendingUp className="h-5 w-5" />,
    color: "text-purple-600",
    bgGradient: "from-purple-500 to-violet-500",
    unlocked: false,
    completed: false,
    lesson: "Every generation has transformative moments: railroads, electricity, internet, AI. FOs position early.",
    foInsight: "Early Amazon investors made 600x. Early Google made 60x. Early AI investors? Time will tell!",
    relatedYears: [2020, 2025],
  },
  {
    id: "compounding",
    title: "Compound Interest Magic",
    description: "The 8th wonder of the world",
    icon: <Sparkles className="h-5 w-5" />,
    color: "text-amber-600",
    bgGradient: "from-amber-500 to-orange-500",
    unlocked: false,
    completed: false,
    lesson: "Warren Buffett made 99% of his wealth AFTER age 50. Not because he got smarter—compound interest needed time.",
    foInsight: "$100/month from age 15-25 (then stop!) beats $100/month from 25-65. That's the power of starting early!",
    relatedYears: [2020, 2025],
  },
  {
    id: "patience",
    title: "Generational Thinking",
    description: "Think decades, not days",
    icon: <Leaf className="h-5 w-5" />,
    color: "text-green-600",
    bgGradient: "from-green-500 to-emerald-500",
    unlocked: false,
    completed: false,
    lesson: "FOs don't chase quarterly returns. They build portfolios meant to last 100+ years across generations.",
    foInsight: "The Rothschilds have maintained wealth for 250+ years. Their secret? Patience and long-term thinking.",
    relatedYears: [1990, 2008],
  },
];

export function FOLearningPath({ completedMissions }: FOLearningPathProps) {
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null);
  
  // Calculate unlocked concepts based on completed missions
  const updatedConcepts = foConcepts.map(concept => {
    const missionYearsCompleted = concept.relatedYears.filter(year => 
      completedMissions.some(m => m.includes(year.toString()))
    );
    const isUnlocked = missionYearsCompleted.length > 0 || concept.unlocked;
    const isCompleted = missionYearsCompleted.length >= concept.relatedYears.length;
    return { ...concept, unlocked: isUnlocked, completed: isCompleted };
  });
  
  const completedCount = updatedConcepts.filter(c => c.completed).length;
  const progressPercentage = (completedCount / updatedConcepts.length) * 100;

  return (
    <div className="p-5 rounded-2xl bg-white border border-violet-100 shadow-xl shadow-violet-100/30">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-200/50">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            FO Masterclass
            <Badge className="bg-violet-100 text-violet-700 border-violet-200 text-[10px]">
              {completedCount}/{foConcepts.length} Mastered
            </Badge>
          </h3>
          <p className="text-xs text-gray-500">Family Office wisdom for Tee</p>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-2 bg-violet-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 rounded-full transition-all duration-700"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-[10px] text-gray-400 mt-1 text-right">
          {Math.round(progressPercentage)}% to FO Expert
        </p>
      </div>
      
      {/* Concept Cards */}
      <div className="space-y-2">
        {updatedConcepts.map((concept) => (
          <div
            key={concept.id}
            className={`rounded-xl overflow-hidden transition-all duration-300 ${
              concept.unlocked 
                ? "cursor-pointer hover:shadow-md" 
                : "opacity-50"
            }`}
            onClick={() => concept.unlocked && setExpandedConcept(
              expandedConcept === concept.id ? null : concept.id
            )}
          >
            {/* Concept Header */}
            <div className={`p-3 flex items-center gap-3 transition-all ${
              expandedConcept === concept.id 
                ? `bg-gradient-to-r ${concept.bgGradient} text-white`
                : "bg-violet-50 border border-violet-100 hover:border-violet-200"
            }`}>
              <div className={`p-2 rounded-lg ${
                expandedConcept === concept.id 
                  ? "bg-white/20" 
                  : `bg-gradient-to-br ${concept.bgGradient} text-white`
              }`}>
                {concept.completed ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : concept.unlocked ? (
                  concept.icon
                ) : (
                  <Lock className="h-4 w-4" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-bold truncate ${
                    expandedConcept === concept.id ? "text-white" : "text-gray-900"
                  }`}>
                    {concept.title}
                  </p>
                  {concept.completed && (
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />
                  )}
                </div>
                <p className={`text-[10px] truncate ${
                  expandedConcept === concept.id ? "text-white/80" : "text-gray-500"
                }`}>
                  {concept.description}
                </p>
              </div>
              
              <ChevronRight className={`h-4 w-4 flex-shrink-0 transition-transform ${
                expandedConcept === concept.id 
                  ? "rotate-90 text-white" 
                  : "text-gray-400"
              }`} />
            </div>
            
            {/* Expanded Content */}
            {expandedConcept === concept.id && concept.unlocked && (
              <div className="p-4 bg-white border-x border-b border-violet-100 space-y-3">
                <div className="flex items-start gap-2">
                  <BookOpen className={`h-4 w-4 ${concept.color} flex-shrink-0 mt-0.5`} />
                  <div>
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">The Lesson</p>
                    <p className="text-xs text-gray-700 leading-relaxed">{concept.lesson}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 p-3 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-100">
                  <Lightbulb className="h-4 w-4 text-violet-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-semibold text-violet-600 uppercase tracking-wide">FO Insight</p>
                    <p className="text-xs text-violet-800 leading-relaxed">{concept.foInsight}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                  <span>Learn through:</span>
                  {concept.relatedYears.map(year => (
                    <Badge 
                      key={year} 
                      variant="outline" 
                      className="text-[9px] px-1.5 py-0 border-violet-200 text-violet-600"
                    >
                      {year}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
