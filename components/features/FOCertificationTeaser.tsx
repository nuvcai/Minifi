/**
 * FOCertificationTeaser.tsx - Family Office Certification progress teaser
 * Encourages players to complete the certification path
 */

"use client";

import React from "react";
import { 
  GraduationCap, 
  Award,
  Lock,
  CheckCircle2,
  ChevronRight,
  Star,
  Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface CertificationLevel {
  id: string;
  name: string;
  badge: string;
  requirements: string[];
  completedRequirements: number;
  unlocked: boolean;
  color: string;
}

const certificationLevels: CertificationLevel[] = [
  {
    id: "guardian",
    name: "Capital Guardian",
    badge: "🥉",
    requirements: [
      "Complete 'Cash is King' lesson",
      "Build a conservative portfolio",
      "Survive a market crash mission"
    ],
    completedRequirements: 0,
    unlocked: true,
    color: "from-amber-600 to-amber-700"
  },
  {
    id: "investor",
    name: "Balanced Investor",
    badge: "🥈",
    requirements: [
      "Master 3 asset classes",
      "Build a balanced portfolio",
      "Beat market benchmark in 2 missions"
    ],
    completedRequirements: 0,
    unlocked: false,
    color: "from-slate-400 to-slate-500"
  },
  {
    id: "fellow",
    name: "FO Fellow",
    badge: "🥇",
    requirements: [
      "Master all 6 asset classes",
      "Build aggressive portfolio with proper risk management",
      "Complete all historical missions with profit"
    ],
    completedRequirements: 0,
    unlocked: false,
    color: "from-yellow-400 to-amber-500"
  }
];

interface FOCertificationTeaserProps {
  variant?: "compact" | "full" | "badge";
  currentLevel?: number; // 0 = none, 1 = guardian, 2 = investor, 3 = fellow
  className?: string;
}

export function FOCertificationTeaser({
  variant = "compact",
  currentLevel = 0,
  className = ""
}: FOCertificationTeaserProps) {
  const activeLevel = certificationLevels[currentLevel] || certificationLevels[0];
  const progress = activeLevel.completedRequirements / activeLevel.requirements.length * 100;

  if (variant === "badge") {
    // Ultra minimal badge for headers
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <div className="relative">
          <GraduationCap className="h-4 w-4 text-amber-400" />
          {currentLevel > 0 && (
            <div className="absolute -top-1 -right-1 text-[10px]">
              {certificationLevels[currentLevel - 1]?.badge}
            </div>
          )}
        </div>
        <span className="text-xs text-slate-400">
          {currentLevel === 0 ? "Start Cert" : certificationLevels[currentLevel - 1]?.name}
        </span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`${className}`}>
        <div className="p-3 rounded-xl bg-linear-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-linear-to-br from-amber-500 to-orange-500">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-slate-300">FO Certification</span>
                  <Badge className="text-[10px] bg-amber-500/20 text-amber-300 border-amber-500/30 px-1">
                    Coming Soon
                  </Badge>
                </div>
                <span className="text-[10px] text-slate-500">Level {currentLevel + 1}: {activeLevel.name}</span>
              </div>
            </div>
            <span className="text-2xl">{activeLevel.badge}</span>
          </div>
          
          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Progress to next level</span>
              <span>{activeLevel.completedRequirements}/{activeLevel.requirements.length}</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
          
          {/* Next requirement hint */}
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400">
            <ChevronRight className="h-3 w-3" />
            <span className="line-clamp-1">Next: {activeLevel.requirements[activeLevel.completedRequirements] || "Complete all requirements"}</span>
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-linear-to-br from-amber-500 to-orange-500">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-100">FO Certification Path</h2>
              <Badge className="text-[10px] bg-purple-500/20 text-purple-300 border-purple-500/30">
                <Lock className="h-2.5 w-2.5 mr-1" />
                Coming Soon
              </Badge>
            </div>
            <p className="text-sm text-slate-400">Earn your Family Office Fellow credential</p>
          </div>
        </div>
      </div>
      
      {/* Certification levels */}
      <div className="space-y-3">
        {certificationLevels.map((level, index) => {
          const isActive = index === currentLevel;
          const isCompleted = index < currentLevel;
          const levelProgress = level.completedRequirements / level.requirements.length * 100;
          
          return (
            <div
              key={level.id}
              className={`
                relative p-4 rounded-xl border transition-all duration-200
                ${isActive 
                  ? 'bg-linear-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30' 
                  : isCompleted
                    ? 'bg-green-500/5 border-green-500/20'
                    : 'bg-slate-800/30 border-slate-700/50 opacity-60'
                }
              `}
            >
              {/* Lock overlay */}
              {!level.unlocked && !isCompleted && (
                <div className="absolute inset-0 rounded-xl bg-slate-900/50 flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center">
                    <Lock className="h-5 w-5 text-slate-500 mx-auto mb-1" />
                    <span className="text-xs text-slate-500">Complete previous level</span>
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-3">
                {/* Badge */}
                <div className={`
                  shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                  bg-linear-to-br ${level.color}
                  ${isCompleted ? 'ring-2 ring-green-400/50' : ''}
                `}>
                  {isCompleted ? <CheckCircle2 className="h-6 w-6 text-white" /> : level.badge}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-200">{level.name}</h3>
                    {isCompleted && (
                      <Badge className="text-[10px] bg-green-500/20 text-green-400">
                        Completed
                      </Badge>
                    )}
                    {isActive && (
                      <Badge className="text-[10px] bg-amber-500/20 text-amber-300">
                        In Progress
                      </Badge>
                    )}
                  </div>
                  
                  {/* Requirements list */}
                  <ul className="space-y-1 mb-2">
                    {level.requirements.map((req, reqIndex) => {
                      const isReqCompleted = reqIndex < level.completedRequirements;
                      return (
                        <li 
                          key={reqIndex}
                          className={`flex items-center gap-2 text-xs ${
                            isReqCompleted ? 'text-green-400' : 'text-slate-500'
                          }`}
                        >
                          {isReqCompleted ? (
                            <CheckCircle2 className="h-3 w-3 shrink-0" />
                          ) : (
                            <div className="w-3 h-3 rounded-full border border-slate-600 shrink-0" />
                          )}
                          <span className={isReqCompleted ? 'line-through' : ''}>{req}</span>
                        </li>
                      );
                    })}
                  </ul>
                  
                  {/* Progress bar for active level */}
                  {isActive && (
                    <Progress value={levelProgress} className="h-1.5" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Motivation footer */}
      <div className="mt-4 p-3 rounded-lg bg-linear-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-400" />
          <span className="text-xs text-slate-300">
            Complete the FO Certification to unlock exclusive badges and share your credentials!
          </span>
        </div>
      </div>
    </div>
  );
}

export default FOCertificationTeaser;


