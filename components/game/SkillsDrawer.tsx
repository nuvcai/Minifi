/**
 * SkillsDrawer - Collapsible Learning Dashboard
 * Optimized for both light and dark mode visibility
 * Single instance, expandable panel showing wealth pillars and skills
 * © 2025 NUVC.AI. All Rights Reserved.
 */

"use client";

import React, { useState } from "react";
import { 
  Crown,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Lock,
  CheckCircle2,
  Brain,
  Lightbulb,
  ArrowUpRight,
  MessageCircle,
  GraduationCap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FinancialEvent } from "@/components/data/events";
import { 
  wealthPillars, 
  generationalOpportunities,
  assetClasses,
  strategies,
  innovationCycles,
  getPillarMastery,
  getAssetMastery,
  getStrategyMastery,
  calculateOverallProgress,
} from "@/components/data/chapters";
import { calculateWisdomStats } from "@/components/gamification/WisdomLearned";

interface SkillsDrawerProps {
  events: FinancialEvent[];
  onAskCoach?: () => void;
  defaultExpanded?: boolean;
}

type TabId = "pillars" | "generations" | "assets" | "strategies";

export function SkillsDrawer({ events, onAskCoach, defaultExpanded = false }: SkillsDrawerProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [activeTab, setActiveTab] = useState<TabId>("pillars");
  
  const completedMissions = events.filter(e => e.completed).map(e => e.year);
  const totalProgress = calculateOverallProgress(completedMissions);
  const wisdomStats = calculateWisdomStats(completedMissions);
  
  return (
    <div className="rounded-2xl overflow-hidden shadow-lg transition-all duration-300
      bg-white dark:bg-slate-900/80
      border border-slate-200 dark:border-slate-700/50">
      
      {/* Collapsible Header - Optimized for both modes */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 sm:p-5 transition-colors
          bg-gradient-to-br from-[#9898f2]/15 via-[#9898f2]/5 to-transparent
          dark:from-[#9898f2]/25 dark:via-[#9898f2]/10 dark:to-transparent
          border-b border-slate-200 dark:border-slate-700/50
          hover:from-[#9898f2]/20 hover:via-[#9898f2]/8 hover:to-transparent
          dark:hover:from-[#9898f2]/30 dark:hover:via-[#9898f2]/15 dark:hover:to-transparent"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#9898f2] to-purple-600 shadow-lg shadow-[#9898f2]/30">
              <Crown className="h-4 w-4 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                How Rich Families Think
                <Sparkles className="h-4 w-4 text-[#9898f2]" />
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tap to {isExpanded ? 'collapse' : 'explore'} wealth secrets
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wisdom Score Badge */}
            <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl 
              bg-gradient-to-r from-amber-500/20 to-orange-500/10 
              border border-amber-500/30">
              <Brain className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-amber-500 dark:text-amber-400" />
              <span className="text-[10px] sm:text-xs font-black text-amber-600 dark:text-amber-300">
                {wisdomStats.wisdomScore}
              </span>
            </div>
            
            {/* Progress Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl 
              bg-[#9898f2]/15 dark:bg-[#9898f2]/25 
              border border-[#9898f2]/30 dark:border-[#9898f2]/40">
              <GraduationCap className="h-3.5 w-3.5 text-[#7070c0] dark:text-[#9898f2]" />
              <span className="text-xs font-bold text-[#5858a0] dark:text-[#b8b8ff]">
                {totalProgress}%
              </span>
            </div>
            
            {/* Expand/Collapse Icon */}
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-slate-600 dark:text-slate-300" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-600 dark:text-slate-300" />
              )}
            </div>
          </div>
        </div>
      </button>
      
      {/* Expandable Content */}
      {isExpanded && (
        <div className="p-4 sm:p-5 bg-slate-50/50 dark:bg-slate-900/50 animate-slide-down">
          {/* Wisdom Score Summary Card */}
          <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent 
            dark:from-amber-500/20 dark:via-orange-500/10 dark:to-transparent
            border border-amber-500/20 dark:border-amber-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Wisdom Score</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-amber-600 dark:text-amber-400">{wisdomStats.wisdomScore}</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">/ 1000</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400">Learning Velocity</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{wisdomStats.learningVelocity}</p>
              </div>
            </div>
            {/* Quick Stats Row */}
            <div className="mt-3 grid grid-cols-4 gap-2">
              <div className="text-center p-1.5 rounded-lg bg-white/50 dark:bg-slate-800/50">
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Pillars</p>
                <p className="text-xs font-bold text-amber-600 dark:text-amber-400">{wisdomStats.pillarsUnlocked}/{wisdomStats.pillarsTotal}</p>
              </div>
              <div className="text-center p-1.5 rounded-lg bg-white/50 dark:bg-slate-800/50">
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Assets</p>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{wisdomStats.assetsUnlocked}/{wisdomStats.assetsTotal}</p>
              </div>
              <div className="text-center p-1.5 rounded-lg bg-white/50 dark:bg-slate-800/50">
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Strategies</p>
                <p className="text-xs font-bold text-violet-600 dark:text-violet-400">{wisdomStats.strategiesUnlocked}/{wisdomStats.strategiesTotal}</p>
              </div>
              <div className="text-center p-1.5 rounded-lg bg-white/50 dark:bg-slate-800/50">
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Eras</p>
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400">{wisdomStats.erasCompleted}/{wisdomStats.erasTotal}</p>
              </div>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex items-center gap-1 p-1.5 rounded-xl w-fit overflow-x-auto mb-4
            bg-slate-100 dark:bg-slate-800/80 
            border border-slate-200 dark:border-slate-700">
            {[
              { id: "pillars" as TabId, label: "3 Rules", icon: <Crown className="h-3.5 w-3.5" /> },
              { id: "generations" as TabId, label: "Your Gen", icon: <Brain className="h-3.5 w-3.5" /> },
              { id: "assets" as TabId, label: "Invest", icon: <Lightbulb className="h-3.5 w-3.5" /> },
              { id: "strategies" as TabId, label: "Moves", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-white dark:bg-[#9898f2]/30 text-[#5858a0] dark:text-[#c8c8ff] border border-[#9898f2]/40 dark:border-[#9898f2]/50 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Wealth Pillars Tab */}
          {activeTab === "pillars" && (
            <div className="space-y-4">
              {wealthPillars.map((pillar) => {
                const mastery = getPillarMastery(pillar, completedMissions);
                const Icon = pillar.icon;
                
                return (
                  <div 
                    key={pillar.id}
                    className={`p-4 rounded-xl border transition-all ${
                      mastery.isUnlocked
                        ? `bg-gradient-to-br ${pillar.bgColor} hover:scale-[1.01]
                           border-${pillar.borderColor.replace('border-', '')}
                           dark:bg-gradient-to-br dark:${pillar.bgColor}`
                        : "bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-70"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${pillar.color} shadow-lg`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <h4 className={`font-bold ${mastery.isUnlocked ? `${pillar.textColor}` : "text-slate-400 dark:text-slate-500"}`}>
                            {pillar.name}
                          </h4>
                          {mastery.isUnlocked && (
                            <Badge className={`${pillar.bgColor} ${pillar.textColor} border-0 text-xs font-bold`}>
                              {mastery.percentage}%
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
                          {pillar.description}
                        </p>
                        
                        {mastery.isUnlocked ? (
                          <div className="flex flex-wrap gap-1.5">
                            {pillar.strategies.map((strategy) => (
                              <span 
                                key={strategy}
                                className="text-[10px] px-2 py-1 rounded-full 
                                  bg-white/80 dark:bg-slate-800/80 
                                  text-slate-700 dark:text-slate-200 
                                  border border-slate-200 dark:border-slate-600"
                              >
                                {strategy}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500">
                            <Lock className="h-3 w-3" />
                            <span>Complete missions to unlock</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Key Insight */}
              <div className="p-3 rounded-xl 
                bg-gradient-to-br from-[#9898f2]/15 to-purple-500/10 
                dark:from-[#9898f2]/20 dark:to-purple-500/15 
                border border-[#9898f2]/25 dark:border-[#9898f2]/35">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-[#7070c0] dark:text-[#9898f2] flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-white text-xs mb-1">
                      💡 Why Rich Stay Rich
                    </h5>
                    <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">Make money</span> → 
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold"> Keep money</span> → 
                      <span className="text-violet-600 dark:text-violet-400 font-semibold"> Pass it on</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Generations Tab */}
          {activeTab === "generations" && (
            <div className="space-y-3">
              {generationalOpportunities.map((gen) => {
                const Icon = gen.icon;
                
                return (
                  <div 
                    key={gen.id}
                    className={`p-3 rounded-xl border transition-all ${
                      gen.isCurrentGen
                        ? "bg-gradient-to-br from-[#9898f2]/20 to-purple-500/10 dark:from-[#9898f2]/30 dark:to-purple-500/15 border-[#9898f2]/40 dark:border-[#9898f2]/50 ring-2 ring-[#9898f2]/20 dark:ring-[#9898f2]/30"
                        : "bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {gen.isCurrentGen && (
                      <Badge className="bg-gradient-to-r from-[#9898f2] to-purple-600 text-white border-0 text-[9px] mb-2 shadow-sm">
                        YOUR ERA
                      </Badge>
                    )}
                    
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl bg-gradient-to-br ${gen.color} shadow-md`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-bold text-sm ${gen.isCurrentGen ? "text-[#5858a0] dark:text-[#b8b8ff]" : "text-slate-800 dark:text-white"}`}>
                            {gen.generation}
                          </h4>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">{gen.era}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-1.5">
                          {gen.opportunities.map((opp) => (
                            <Badge 
                              key={opp}
                              className={`text-[9px] ${
                                gen.isCurrentGen
                                  ? "bg-[#9898f2]/20 dark:bg-[#9898f2]/30 text-[#5858a0] dark:text-[#c8c8ff] border-[#9898f2]/40"
                                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600"
                              }`}
                            >
                              {opp}
                            </Badge>
                          ))}
                        </div>
                        
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Lightbulb className="h-2.5 w-2.5" />
                          {gen.keyLesson}
                        </p>
                      </div>
                      
                      {gen.isCurrentGen && (
                        <ArrowUpRight className="h-4 w-4 text-[#7070c0] dark:text-[#9898f2]" />
                      )}
                    </div>
                  </div>
                );
              })}
              
              {/* Innovation Cycles Mini */}
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                  Tech Waves
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {innovationCycles.map((cycle) => {
                    const isLearned = completedMissions.includes(cycle.year);
                    const Icon = cycle.icon;
                    
                    return (
                      <div 
                        key={cycle.id}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          isLearned
                            ? "bg-emerald-100 dark:bg-emerald-500/20 border-emerald-300 dark:border-emerald-500/40"
                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-60"
                        }`}
                      >
                        <Icon className={`h-3 w-3 mx-auto mb-0.5 ${isLearned ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}`} />
                        <p className={`text-[9px] font-bold ${isLearned ? "text-emerald-700 dark:text-emerald-300" : "text-slate-500 dark:text-slate-400"}`}>{cycle.year}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          
          {/* Assets Tab */}
          {activeTab === "assets" && (
            <div className="grid grid-cols-2 gap-2">
              {assetClasses.map((asset) => {
                const mastery = getAssetMastery(asset, completedMissions);
                const Icon = asset.icon;
                
                return (
                  <div 
                    key={asset.id}
                    className={`relative p-3 rounded-xl border transition-all ${
                      mastery.isUnlocked
                        ? `${asset.bgColor} ${asset.borderColor} dark:${asset.bgColor}`
                        : "bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-70"
                    }`}
                  >
                    {mastery.isUnlocked && mastery.percentage === 100 && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 fill-emerald-100 dark:fill-emerald-500/30 absolute -top-1 -right-1" />
                    )}
                    
                    <div className="flex items-start gap-2 mb-2">
                      <div className={`p-1.5 rounded-lg bg-gradient-to-br ${asset.color} shadow-sm`}>
                        <Icon className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-bold text-xs ${mastery.isUnlocked ? asset.textColor : "text-slate-400 dark:text-slate-500"}`}>
                          {asset.name}
                        </h4>
                      </div>
                    </div>
                    
                    {mastery.isUnlocked ? (
                      <>
                        <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-1.5">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${asset.color}`}
                            style={{ width: `${mastery.percentage}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[9px]">
                          <span className="text-slate-500 dark:text-slate-400">
                            {asset.simpleAllocation}
                          </span>
                          <Badge className={`${asset.bgColor} ${asset.textColor} border-0 text-[8px] px-1 py-0`}>
                            {asset.riskLevel}
                          </Badge>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-1 text-[9px] text-slate-400 dark:text-slate-500">
                        <Lock className="h-2.5 w-2.5" />
                        <span>Locked</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Strategies Tab */}
          {activeTab === "strategies" && (
            <div className="space-y-3">
              {["create", "preserve", "transfer"].map((pillarId) => {
                const pillar = wealthPillars.find(p => p.id === pillarId)!;
                const pillarStrategies = strategies.filter(s => s.pillar === pillarId);
                const PillarIcon = pillar.icon;
                
                return (
                  <div key={pillarId}>
                    <h4 className={`text-[10px] font-bold mb-1.5 flex items-center gap-1 ${pillar.textColor}`}>
                      <PillarIcon className="h-3 w-3" />
                      {pillar.name}
                    </h4>
                    <div className="grid gap-1.5">
                      {pillarStrategies.map((strategy) => {
                        const mastery = getStrategyMastery(strategy, completedMissions);
                        const Icon = strategy.icon;
                        
                        return (
                          <div 
                            key={strategy.id}
                            className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                              mastery.isUnlocked
                                ? `${pillar.bgColor} ${pillar.borderColor} dark:${pillar.bgColor}`
                                : "bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-70"
                            }`}
                          >
                            <div className={`p-1.5 rounded-lg ${
                              mastery.isUnlocked 
                                ? `bg-gradient-to-br ${pillar.color}` 
                                : "bg-slate-200 dark:bg-slate-700"
                            }`}>
                              <Icon className={`h-3 w-3 ${mastery.isUnlocked ? "text-white" : "text-slate-400 dark:text-slate-500"}`} />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h5 className={`font-semibold text-xs ${
                                mastery.isUnlocked ? "text-slate-800 dark:text-white" : "text-slate-400 dark:text-slate-500"
                              }`}>
                                {strategy.name}
                              </h5>
                            </div>
                            
                            {mastery.isUnlocked ? (
                              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded 
                                bg-white dark:bg-slate-800 
                                border border-slate-200 dark:border-slate-600">
                                <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
                                <span className="text-[9px] font-medium text-slate-600 dark:text-slate-300">
                                  {mastery.learned}/{mastery.total}
                                </span>
                              </div>
                            ) : (
                              <Lock className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Ask Coach CTA */}
          {onAskCoach && (
            <button
              onClick={onAskCoach}
              className="w-full mt-4 p-3 rounded-xl border-2 border-dashed transition-all group
                border-slate-300 dark:border-slate-600 
                hover:border-[#9898f2] dark:hover:border-[#9898f2] 
                hover:bg-[#9898f2]/10 dark:hover:bg-[#9898f2]/20"
            >
              <div className="flex items-center justify-center gap-2 
                text-slate-500 dark:text-slate-400 
                group-hover:text-[#7070c0] dark:group-hover:text-[#9898f2]">
                <MessageCircle className="h-4 w-4" />
                <span className="font-semibold text-xs">Confused? Ask your AI Coach! 🤖</span>
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default SkillsDrawer;
