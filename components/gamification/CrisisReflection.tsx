/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   🎓 CRISIS REFLECTION - Learning Through Failure Component                  ║
 * ║   The most valuable lessons come from our failures, not successes            ║
 * ║   ✨ MiniFi / Legacy Guardians Educational Content ✨                       ║
 * ║   Copyright (c) 2025 NUVC.AI / Tick.AI. All Rights Reserved.                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Core Philosophy: "The market is the best teacher, and losses are its lessons."
 * This component transforms investment failures into powerful learning moments.
 */

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  Brain,
  Lightbulb,
  TrendingUp,
  Shield,
  Sparkles,
  ChevronRight,
  Award,
  Target,
  Flame,
  Heart,
  GraduationCap,
  Quote,
  CheckCircle2,
} from "lucide-react";

// Crisis reflection wisdom database
const crisisWisdom = {
  bubble_burst: {
    lesson: "Bubbles happen when everyone forgets that prices should reflect real value.",
    quote: "Be fearful when others are greedy, and greedy when others are fearful.",
    quoter: "Warren Buffett",
    reflection: "What warning signs did you miss? What would diversification have done?",
    survivalStory: "The Rockefellers TRIPLED their fortune during the Great Depression by buying when everyone sold.",
    foWisdom: "Family Offices survived Japan's 1990 crash, the 2000 dot-com bust, and 2008 because they NEVER put all eggs in one basket.",
    nextTimeHint: "Look for signs of euphoria: When taxi drivers give stock tips, it's time to be cautious.",
  },
  panic_sell: {
    lesson: "Panic selling locks in losses. Recovery always comes for those who hold quality assets.",
    quote: "The stock market is a device for transferring money from the impatient to the patient.",
    quoter: "Warren Buffett",
    reflection: "What emotion drove your decision? How would waiting have changed the outcome?",
    survivalStory: "Those who panic-sold in March 2020 missed a 100% recovery within 18 months.",
    foWisdom: "Family Offices keep 10-15% in cash specifically to BUY during panics, not sell.",
    nextTimeHint: "Before selling in fear, ask: 'Would I buy this at current prices?' If yes, don't sell.",
  },
  fomo_trap: {
    lesson: "FOMO makes you buy at the top when everyone is euphoric. By the time your friend is bragging, it's usually too late.",
    quote: "Know what you own, and know why you own it.",
    quoter: "Peter Lynch",
    reflection: "Did you understand the investment, or were you chasing others' gains?",
    survivalStory: "Pets.com investors who FOMO'd in 2000 lost 99%. Amazon survived because it had a real business.",
    foWisdom: "Family Offices do 80% research, 20% action. Most retail investors do the opposite.",
    nextTimeHint: "If you can't explain WHY an investment makes sense in simple terms, you're gambling.",
  },
  overleveraged: {
    lesson: "Leverage amplifies both gains AND losses. The market has unlimited ways to humble the greedy.",
    quote: "Risk comes from not knowing what you're doing.",
    quoter: "Warren Buffett",
    reflection: "What made you want to maximize gains instead of protecting capital?",
    survivalStory: "LTCM had Nobel Prize winners and blew up from leverage. The families still wealthy after 100+ years never risked what they had for what they didn't need.",
    foWisdom: "Family Offices don't try to maximize returns - they try to SURVIVE. Survival compounds into serious wealth.",
    nextTimeHint: "If you're using leverage, you've already lost the long-term game.",
  },
  high_risk_loss: {
    lesson: "High risk means high potential for loss. The key is position sizing - never risk more than you can afford to lose.",
    quote: "Rule No. 1: Never lose money. Rule No. 2: Never forget Rule No. 1.",
    quoter: "Warren Buffett",
    reflection: "How much of your portfolio was at risk? Would smaller position have been smarter?",
    survivalStory: "Professional traders lose money on 40-60% of their trades. Winners limit losses, let winners run.",
    foWisdom: "Family Offices typically limit any single position to 5% max. Losing 5% hurts; losing 50% is devastating.",
    nextTimeHint: "Before any trade, ask: 'What's my maximum loss, and can I live with it?'",
  },
  impatient_exit: {
    lesson: "Wealth building is measured in decades, not days. Impatience is the enemy of compound growth.",
    quote: "The stock market is designed to transfer money from the Active to the Patient.",
    quoter: "Warren Buffett",
    reflection: "What made you sell early? What opportunity cost did impatience create?",
    survivalStory: "If the Walton family (Walmart) had 'taken profits' early, they wouldn't be worth $250 billion today.",
    foWisdom: "Family Offices think in generations. Your great-grandchildren don't care about this month's returns.",
    nextTimeHint: "Before selling, imagine holding for 20 years. Does your thesis still hold?",
  },
  default: {
    lesson: "Every loss contains a lesson if you're willing to learn. Pain + Reflection = Progress.",
    quote: "I've failed over and over and over again in my life. And that is why I succeed.",
    quoter: "Michael Jordan",
    reflection: "What would you do differently if you could replay this decision?",
    survivalStory: "Ray Dalio nearly went bankrupt in his 30s. Instead of giving up, he studied WHY and built systems. Now worth billions.",
    foWisdom: "The best investors keep a 'mistake journal.' The patterns you see will make you wealthy.",
    nextTimeHint: "Record this lesson somewhere. You'll thank yourself when you face a similar situation.",
  },
};

// Encouragement messages for resilience
const resilienceMessages = [
  { icon: "🦁", text: "Every successful investor has a folder full of losses. You just added to your education!" },
  { icon: "💎", text: "Warren Buffett lost $23 billion in 2008. He kept investing. So should you!" },
  { icon: "🎓", text: "This loss is tuition for your financial education - way cheaper than business school!" },
  { icon: "🧠", text: "The market just taught you something no textbook could. That knowledge is yours forever." },
  { icon: "🔥", text: "You showed up, you tried, you learned. That's more than most people ever do!" },
  { icon: "🚀", text: "The best time to learn about risk is with virtual money. No real stakes, all the lessons!" },
];

export interface CrisisReflectionProps {
  // The type of loss/crisis experienced
  crisisType?: keyof typeof crisisWisdom;
  
  // Mission context
  missionYear?: number;
  missionTitle?: string;
  investmentChoice?: string;
  actualReturn?: number;
  
  // The specific wealth lesson from the mission (from missions.ts)
  missionWealthLesson?: string;
  missionFoWisdom?: string;
  missionHistoricalOpportunity?: string;
  missionHopeMessage?: string;
  
  // Callbacks
  onClose: () => void;
  onReflectionComplete?: (reflection: string) => void;
  
  // XP rewards
  baseXpEarned?: number;
  bonusXpForReflection?: number;
}

export function CrisisReflection({
  crisisType = "default",
  missionYear,
  missionTitle,
  investmentChoice,
  actualReturn,
  missionWealthLesson,
  missionFoWisdom,
  missionHistoricalOpportunity,
  missionHopeMessage,
  onClose,
  onReflectionComplete,
  baseXpEarned = 30,
  bonusXpForReflection = 25,
}: CrisisReflectionProps) {
  const [step, setStep] = useState<"lesson" | "reflection" | "wisdom" | "complete">("lesson");
  const [userReflection, setUserReflection] = useState("");
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  
  const wisdom = crisisWisdom[crisisType] || crisisWisdom.default;
  const encouragement = resilienceMessages[Math.floor(Math.random() * resilienceMessages.length)];
  
  // Quick insights for reflection
  const quickInsights = [
    "I learned about the importance of diversification",
    "I saw how emotions can affect investment decisions",
    "I understand why timing the market is risky",
    "I learned that patience is crucial in investing",
    "I realized I should do more research before investing",
    "I understand risk-reward tradeoffs better now",
  ];
  
  const handleCompleteReflection = () => {
    const finalReflection = userReflection || selectedInsight || "Learning experience noted";
    if (onReflectionComplete) {
      onReflectionComplete(finalReflection);
    }
    setStep("wisdom");
  };
  
  const totalXp = baseXpEarned + (userReflection.length > 10 || selectedInsight ? bonusXpForReflection : 0);
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* STEP 1: The Lesson */}
          {step === "lesson" && (
            <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-amber-500/30 shadow-2xl shadow-amber-500/10">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    Learning Moment
                  </Badge>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    +{baseXpEarned} XP Earned
                  </Badge>
                </div>
                
                <CardTitle className="flex items-center gap-3 text-white mt-4">
                  <div className="p-3 rounded-xl bg-amber-500/20">
                    <BookOpen className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold">The Market Has Spoken</div>
                    <div className="text-sm text-white/60 font-normal">
                      {missionTitle && `${missionYear}: ${missionTitle}`}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Encouragement Banner */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{encouragement.icon}</span>
                    <div>
                      <p className="text-white font-medium">{encouragement.text}</p>
                      {actualReturn && (
                        <p className="text-white/60 text-sm mt-1">
                          Your choice: {investmentChoice} → {actualReturn > 0 ? '+' : ''}{actualReturn}%
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* The Core Lesson */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-400" />
                    <span className="font-semibold text-white">The Key Lesson</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-white/90 leading-relaxed">
                      {missionWealthLesson || wisdom.lesson}
                    </p>
                  </div>
                </div>
                
                {/* Wisdom Quote */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-slate-700/50 to-slate-600/50 border-l-4 border-amber-500">
                  <div className="flex items-start gap-3">
                    <Quote className="h-5 w-5 text-amber-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-white/90 italic">"{wisdom.quote}"</p>
                      <p className="text-amber-400 text-sm mt-2">— {wisdom.quoter}</p>
                    </div>
                  </div>
                </div>
                
                {/* Continue Button */}
                <Button
                  onClick={() => setStep("reflection")}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Reflect & Earn +{bonusXpForReflection} Bonus 🪙
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}
          
          {/* STEP 2: Reflection */}
          {step === "reflection" && (
            <Card className="bg-gradient-to-br from-slate-900 via-indigo-900/50 to-slate-900 border-indigo-500/30 shadow-2xl shadow-indigo-500/10">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
                    <Brain className="h-3 w-3 mr-1" />
                    Self Reflection
                  </Badge>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    +{bonusXpForReflection} Bonus 🪙 Available
                  </Badge>
                </div>
                
                <CardTitle className="flex items-center gap-3 text-white mt-4">
                  <div className="p-3 rounded-xl bg-indigo-500/20">
                    <Target className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold">Turn This Into Wisdom</div>
                    <div className="text-sm text-white/60 font-normal">
                      {wisdom.reflection}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Quick Insights */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    <span className="text-sm font-medium text-white/80">Quick Insights (tap to select)</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quickInsights.map((insight) => (
                      <Button
                        key={insight}
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedInsight(insight)}
                        className={`text-xs ${
                          selectedInsight === insight
                            ? "bg-indigo-500/30 border-indigo-400 text-indigo-300"
                            : "bg-white/5 border-white/20 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        {selectedInsight === insight && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {insight}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Custom Reflection */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-indigo-400" />
                    <span className="text-sm font-medium text-white/80">Or write your own reflection</span>
                  </div>
                  <Textarea
                    placeholder="What did you learn from this experience? What would you do differently?"
                    value={userReflection}
                    onChange={(e) => {
                      setUserReflection(e.target.value);
                      setSelectedInsight(null); // Clear quick insight if typing
                    }}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 min-h-[100px] resize-none"
                  />
                </div>
                
                {/* Survival Story */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-emerald-300 font-medium text-sm">How Others Survived Similar Challenges</p>
                      <p className="text-white/70 text-sm mt-1">{wisdom.survivalStory}</p>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep("lesson")}
                    className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleCompleteReflection}
                    disabled={!userReflection && !selectedInsight}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-semibold disabled:opacity-50"
                  >
                    Complete Reflection
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* STEP 3: Family Office Wisdom */}
          {step === "wisdom" && (
            <Card className="bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 border-purple-500/30 shadow-2xl shadow-purple-500/10">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    <Award className="h-3 w-3 mr-1" />
                    Family Office Wisdom
                  </Badge>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    🎉 +{totalXp} Total XP
                  </Badge>
                </div>
                
                <CardTitle className="flex items-center gap-3 text-white mt-4">
                  <div className="p-3 rounded-xl bg-purple-500/20">
                    <GraduationCap className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold">Generational Wisdom Unlocked</div>
                    <div className="text-sm text-white/60 font-normal">
                      Knowledge the wealthy families guard carefully
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* FO Wisdom */}
                <div className="p-5 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/30">
                      <TrendingUp className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-purple-300 font-medium mb-2">🏛️ Family Office Principle</p>
                      <p className="text-white/90 leading-relaxed">
                        {missionFoWisdom || wisdom.foWisdom}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Next Time Hint */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-amber-300 font-medium text-sm">💡 For Next Time</p>
                      <p className="text-white/70 text-sm mt-1">{wisdom.nextTimeHint}</p>
                    </div>
                  </div>
                </div>
                
                {/* Hope Message */}
                {(missionHopeMessage || missionHistoricalOpportunity) && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                    <div className="flex items-start gap-3">
                      <Heart className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-emerald-300 font-medium text-sm">✨ Remember</p>
                        <p className="text-white/70 text-sm mt-1">
                          {missionHopeMessage || missionHistoricalOpportunity}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* XP Summary */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="h-5 w-5 text-orange-400" />
                      <span className="text-white font-medium">Experience Earned</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-emerald-400">+{totalXp}</span>
                      <span className="text-white/60 text-sm ml-1">XP</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-white/50">
                    {baseXpEarned} base + {totalXp - baseXpEarned} reflection bonus
                  </div>
                </div>
                
                {/* Continue Button */}
                <Button
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Continue Your Journey
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default CrisisReflection;

