/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   🎯 USER ONBOARDING FLOW                                                    ║
 * ║   Collects user data for personalized coaching & marketing                   ║
 * ║   ✨ MiniFi / Legacy Guardians ✨                                           ║
 * ║   Copyright (c) 2025 NUVC.AI / Tick.AI. All Rights Reserved.                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

"use client";

import React, { useState, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Target,
  Shield,
  Rocket,
  Zap,
  Check,
  User,
  GraduationCap,
  Wallet,
  Brain,
  Heart,
  Mail,
  Gift,
  Save,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { aiCoaches, AICoach } from "@/components/data/coaches";
import type { RiskPersonality, LearningStyle } from "@/components/data/personalizedCoaching";

// III Token config for display
const III_CONFIG = {
  symbol: 'iii',
  emoji: '✦',
};

// Welcome bonus amounts
const WELCOME_III_BONUS = 100;

// =============================================================================
// TYPES
// =============================================================================

export interface OnboardingData {
  // Step 0: Adventure Identity (NEW - Save State Encouragement)
  adventureName: string;       // User's chosen adventure/explorer name
  email: string;               // For save state and newsletter
  
  // Step 1: Basic Info
  ageRange: "12-14" | "15-16" | "17-18" | "19-24" | "25+";
  country: string;
  
  // Step 2: Financial Background
  hasPartTimeJob: boolean;
  hasSavingsGoal: boolean;
  familyDiscussesFinances: boolean;
  
  // Step 3: Risk Profile (5 quick questions)
  riskAnswers: number[]; // 1-5 scale for each question
  riskPersonality: RiskPersonality;
  riskScore: number;
  
  // Step 4: Learning Style (quick assessment)
  learningStyle: LearningStyle;
  preferredSessionLength: "short" | "medium" | "long";
  
  // Step 5: Coach Selection (recommended based on profile)
  selectedCoach: AICoach;
  
  // Consent
  termsAccepted: boolean;
  marketingConsent: boolean;
  
  // Metadata
  completedAt: Date;
  source: string;
  
  // Starting III bonus
  welcomeIIIBonus: number;     // Bonus iii for completing onboarding
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
  onSkip?: () => void;
  source?: string;
}

// =============================================================================
// RISK ASSESSMENT QUESTIONS
// =============================================================================

const RISK_QUESTIONS = [
  {
    question: "If your investment dropped 20% in a week, you would:",
    options: [
      { value: 1, text: "Sell everything immediately! 😰", emoji: "🛡️" },
      { value: 2, text: "Sell some to reduce risk", emoji: "⚖️" },
      { value: 3, text: "Do nothing and wait", emoji: "🧘" },
      { value: 4, text: "Maybe buy a little more", emoji: "🎯" },
      { value: 5, text: "Buy MORE - it's on sale! 🔥", emoji: "🚀" }
    ]
  },
  {
    question: "When it comes to returns, you prefer:",
    options: [
      { value: 1, text: "Slow & steady, never lose money", emoji: "🐢" },
      { value: 2, text: "Small gains with rare small losses", emoji: "🌱" },
      { value: 3, text: "Balanced - some up, some down", emoji: "⚖️" },
      { value: 4, text: "Big gains worth occasional losses", emoji: "📈" },
      { value: 5, text: "Maximum growth, I can handle drops!", emoji: "🎢" }
    ]
  },
  {
    question: "How long can you leave money invested?",
    options: [
      { value: 1, text: "I might need it anytime", emoji: "⏰" },
      { value: 2, text: "1-2 years max", emoji: "📅" },
      { value: 3, text: "3-5 years", emoji: "🎯" },
      { value: 4, text: "5-10 years", emoji: "🌳" },
      { value: 5, text: "10+ years, I'm thinking long-term!", emoji: "🏔️" }
    ]
  },
  {
    question: "Your friend says 'crypto is the future!' You:",
    options: [
      { value: 1, text: "No thanks, too risky for me", emoji: "🙅" },
      { value: 2, text: "Maybe a tiny bit someday", emoji: "🤔" },
      { value: 3, text: "I'd research it first carefully", emoji: "🔍" },
      { value: 4, text: "Sounds interesting, I'd try it", emoji: "👀" },
      { value: 5, text: "Already on it! YOLO! 🚀", emoji: "🌙" }
    ]
  },
  {
    question: "When making decisions, you typically:",
    options: [
      { value: 1, text: "Take lots of time, avoid mistakes", emoji: "🐌" },
      { value: 2, text: "Research thoroughly then decide", emoji: "📚" },
      { value: 3, text: "Balance research with instinct", emoji: "⚖️" },
      { value: 4, text: "Go with my gut mostly", emoji: "💫" },
      { value: 5, text: "Act fast, learn from mistakes!", emoji: "⚡" }
    ]
  }
];

// =============================================================================
// LEARNING STYLE QUESTIONS
// =============================================================================

const LEARNING_QUESTIONS = [
  {
    question: "How do you prefer to learn new things?",
    options: [
      { value: "visual" as LearningStyle, text: "Charts, diagrams & videos", emoji: "📊", icon: <Target /> },
      { value: "reading" as LearningStyle, text: "Reading detailed explanations", emoji: "📖", icon: <GraduationCap /> },
      { value: "kinesthetic" as LearningStyle, text: "Hands-on practice & games", emoji: "🎮", icon: <Zap /> },
      { value: "auditory" as LearningStyle, text: "Listening & discussions", emoji: "🎧", icon: <Brain /> }
    ]
  }
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function calculateRiskPersonality(answers: number[]): { personality: RiskPersonality; score: number } {
  const avgScore = answers.reduce((a, b) => a + b, 0) / answers.length;
  const score = Math.round((avgScore / 5) * 100);
  
  let personality: RiskPersonality;
  if (avgScore <= 1.5) personality = "guardian";
  else if (avgScore <= 2.5) personality = "builder";
  else if (avgScore <= 3.5) personality = "explorer";
  else personality = "pioneer";
  
  return { personality, score };
}

function recommendCoach(personality: RiskPersonality): AICoach {
  const coachMap: Record<RiskPersonality, string> = {
    guardian: "steady-sam",
    builder: "growth-guru",
    explorer: "growth-guru",
    pioneer: "adventure-alex"
  };
  return aiCoaches.find(c => c.id === coachMap[personality]) || aiCoaches[0];
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function OnboardingFlow({ onComplete, onSkip, source = "app" }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<Partial<OnboardingData>>({
    adventureName: "",
    email: "",
    ageRange: "15-16",
    country: "AU",
    hasPartTimeJob: false,
    hasSavingsGoal: false,
    familyDiscussesFinances: false,
    riskAnswers: [],
    learningStyle: "kinesthetic",
    preferredSessionLength: "medium",
    termsAccepted: false,
    marketingConsent: false,
    source,
    welcomeIIIBonus: WELCOME_III_BONUS,
  });
  
  const [currentRiskQuestion, setCurrentRiskQuestion] = useState(0);
  const [emailError, setEmailError] = useState("");

  const totalSteps = 6; // Added new adventure identity step
  const progress = ((currentStep + 1) / totalSteps) * 100;
  
  // Simple email validation
  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handlers
  const updateData = useCallback((updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleRiskAnswer = useCallback((value: number) => {
    const newAnswers = [...(data.riskAnswers || []), value];
    updateData({ riskAnswers: newAnswers });
    
    if (currentRiskQuestion < RISK_QUESTIONS.length - 1) {
      setCurrentRiskQuestion(prev => prev + 1);
    } else {
      // Calculate personality and move to next step
      const { personality, score } = calculateRiskPersonality(newAnswers);
      const recommendedCoach = recommendCoach(personality);
      updateData({ 
        riskPersonality: personality, 
        riskScore: score,
        selectedCoach: recommendedCoach
      });
      nextStep();
    }
  }, [data.riskAnswers, currentRiskQuestion, updateData, nextStep]);

  const handleComplete = useCallback(() => {
    const completeData: OnboardingData = {
      ...data as OnboardingData,
      completedAt: new Date(),
      welcomeIIIBonus: WELCOME_III_BONUS,
    };
    onComplete(completeData);
  }, [data, onComplete]);

  // ==========================================================================
  // STEP RENDERS
  // ==========================================================================

  // Step 0: Adventure Identity - Name & Email for Save State
  const renderAdventureIdentity = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center space-y-6"
    >
      {/* Welcome Banner with III Bonus */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-400/20 rounded-full blur-2xl" />
        
        <div className="relative">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur mb-4">
            <Crown className="h-8 w-8 text-yellow-300" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Begin Your Wealth Journey! 🚀
          </h2>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur">
            <Gift className="h-4 w-4 text-yellow-300" />
            <span className="text-white font-semibold">
              Earn +{WELCOME_III_BONUS} {III_CONFIG.emoji} bonus for completing setup!
            </span>
          </div>
        </div>
      </div>
      
      {/* Adventure Name Input */}
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2">
          <User className="h-5 w-5 text-emerald-400" />
          <p className="text-sm text-slate-300 font-medium">Choose Your Adventure Name</p>
        </div>
        <Input
          type="text"
          placeholder="Enter your explorer name..."
          value={data.adventureName || ""}
          onChange={(e) => updateData({ adventureName: e.target.value })}
          className="w-full max-w-sm mx-auto bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 text-center text-lg py-6 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20"
          maxLength={20}
        />
        <p className="text-xs text-slate-500">This will appear on leaderboards and badges!</p>
      </div>
      
      {/* Email Input */}
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2">
          <Mail className="h-5 w-5 text-emerald-400" />
          <p className="text-sm text-slate-300 font-medium">Save Your Progress</p>
        </div>
        <Input
          type="email"
          placeholder="your@email.com"
          value={data.email || ""}
          onChange={(e) => {
            updateData({ email: e.target.value });
            setEmailError("");
          }}
          className={`w-full max-w-sm mx-auto bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 text-center py-6 rounded-xl focus:ring-emerald-500/20 ${
            emailError ? "border-red-500 focus:border-red-500" : "focus:border-emerald-500"
          }`}
        />
        {emailError && (
          <p className="text-xs text-red-400">{emailError}</p>
        )}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <Save className="h-3 w-3" />
          <span>Your {III_CONFIG.symbol} tokens and progress will be saved!</span>
        </div>
      </div>

      <div className="flex gap-3 justify-center pt-4">
        <Button
          variant="ghost"
          onClick={onSkip}
          className="text-slate-400"
        >
          Skip for now
        </Button>
        <Button
          onClick={() => {
            if (data.email && !isValidEmail(data.email)) {
              setEmailError("Please enter a valid email address");
              return;
            }
            if (!data.adventureName?.trim()) {
              updateData({ adventureName: `Explorer${Math.floor(Math.random() * 9999)}` });
            }
            nextStep();
          }}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
        >
          Continue <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </motion.div>
  );

  // Step 1: Age Selection
  const renderAgeSelection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center space-y-6"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 mb-4">
        <Sparkles className="h-8 w-8 text-white" />
      </div>
      
      <div>
        <h2 className="text-xl font-bold text-white">
          {data.adventureName ? `Welcome, ${data.adventureName}! 👋` : "Let's Get Started! 🎯"}
        </h2>
        <p className="text-slate-400 text-sm mt-2">
          We'll personalize your learning experience based on your age
        </p>
      </div>
      
      <div className="space-y-4 pt-4">
        <p className="text-sm text-slate-300 font-medium">How old are you?</p>
        <div className="flex flex-wrap gap-3 justify-center">
          {(["12-14", "15-16", "17-18", "19-24", "25+"] as const).map((age) => (
            <button
              key={age}
              onClick={() => updateData({ ageRange: age })}
              className={`px-5 py-3 rounded-xl border-2 transition-all ${
                data.ageRange === age
                  ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                  : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600"
              }`}
            >
              {age}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 justify-center pt-6">
        <Button variant="ghost" onClick={prevStep} className="text-slate-400">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <Button
          onClick={nextStep}
          className="bg-emerald-500 hover:bg-emerald-600"
        >
          Continue <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </motion.div>
  );

  // Step 1: Financial Background
  const renderBackground = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 mb-4">
          <Wallet className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white">About Your Money Experience</h2>
        <p className="text-slate-400 text-sm mt-2">This helps us give relevant examples</p>
      </div>
      
      <div className="space-y-4">
        {[
          { key: "hasPartTimeJob", question: "Do you have a part-time job?", emoji: "💼" },
          { key: "hasSavingsGoal", question: "Are you saving for something specific?", emoji: "🎯" },
          { key: "familyDiscussesFinances", question: "Does your family discuss money?", emoji: "👨‍👩‍👧" }
        ].map(({ key, question, emoji }) => (
          <div 
            key={key}
            className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700"
          >
            <span className="text-slate-300 flex items-center gap-2">
              <span>{emoji}</span> {question}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => updateData({ [key]: true } as Partial<OnboardingData>)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  data[key as keyof OnboardingData] === true
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => updateData({ [key]: false } as Partial<OnboardingData>)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  data[key as keyof OnboardingData] === false
                    ? "bg-slate-600 text-white"
                    : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                }`}
              >
                No
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 justify-center pt-4">
        <Button variant="ghost" onClick={prevStep} className="text-slate-400">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <Button onClick={nextStep} className="bg-emerald-500 hover:bg-emerald-600">
          Continue <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </motion.div>
  );

  // Step 2: Risk Assessment
  const renderRiskAssessment = () => {
    const question = RISK_QUESTIONS[currentRiskQuestion];
    const answeredCount = data.riskAnswers?.length || 0;
    
    return (
      <motion.div
        key={currentRiskQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Your Investor Personality</h2>
          <p className="text-slate-400 text-sm mt-2">
            Question {currentRiskQuestion + 1} of {RISK_QUESTIONS.length}
          </p>
          
          {/* Mini progress bar */}
          <div className="flex gap-1 justify-center mt-3">
            {RISK_QUESTIONS.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 w-8 rounded-full transition-colors ${
                  idx < answeredCount 
                    ? "bg-purple-500" 
                    : idx === answeredCount 
                      ? "bg-purple-500/50" 
                      : "bg-slate-700"
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
          <p className="text-lg text-white font-medium text-center">
            {question.question}
          </p>
        </div>
        
        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleRiskAnswer(option.value)}
              className="w-full p-4 rounded-xl border border-slate-700 bg-slate-800/50 
                         hover:border-purple-500/50 hover:bg-purple-500/10 
                         transition-all text-left group"
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {option.emoji}
                </span>
                <span className="text-slate-300 group-hover:text-white">
                  {option.text}
                </span>
              </span>
            </button>
          ))}
        </div>

        {currentRiskQuestion > 0 && (
          <div className="flex justify-center">
            <Button 
              variant="ghost" 
              onClick={() => {
                setCurrentRiskQuestion(prev => prev - 1);
                updateData({ riskAnswers: data.riskAnswers?.slice(0, -1) });
              }} 
              className="text-slate-400"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous question
            </Button>
          </div>
        )}
      </motion.div>
    );
  };

  // Step 3: Learning Style
  const renderLearningStyle = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mb-4">
          <GraduationCap className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white">How You Learn Best</h2>
        <p className="text-slate-400 text-sm mt-2">We'll adapt content to your style</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {LEARNING_QUESTIONS[0].options.map((option) => (
          <button
            key={option.value}
            onClick={() => updateData({ learningStyle: option.value })}
            className={`p-4 rounded-xl border-2 transition-all text-center ${
              data.learningStyle === option.value
                ? "border-blue-500 bg-blue-500/20"
                : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
            }`}
          >
            <span className="text-3xl block mb-2">{option.emoji}</span>
            <span className={`text-sm ${
              data.learningStyle === option.value ? "text-blue-400" : "text-slate-300"
            }`}>
              {option.text}
            </span>
          </button>
        ))}
      </div>

      <div className="pt-4">
        <p className="text-sm text-slate-300 font-medium text-center mb-3">
          How long do you prefer learning sessions?
        </p>
        <div className="flex gap-3 justify-center">
          {[
            { value: "short" as const, label: "5-10 min", emoji: "⚡" },
            { value: "medium" as const, label: "15-20 min", emoji: "⏱️" },
            { value: "long" as const, label: "25+ min", emoji: "🎯" }
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateData({ preferredSessionLength: opt.value })}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                data.preferredSessionLength === opt.value
                  ? "bg-blue-500 text-white"
                  : "bg-slate-700 text-slate-400 hover:bg-slate-600"
              }`}
            >
              {opt.emoji} {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 justify-center pt-4">
        <Button variant="ghost" onClick={prevStep} className="text-slate-400">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <Button onClick={nextStep} className="bg-emerald-500 hover:bg-emerald-600">
          Meet Your Coach <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </motion.div>
  );

  // Step 4: Coach Selection & Consent
  const renderCoachAndConsent = () => {
    const personality = data.riskPersonality || "builder";
    const recommendedCoach = data.selectedCoach || aiCoaches[0];
    
    const personalityDescriptions: Record<RiskPersonality, { title: string; desc: string; emoji: string }> = {
      guardian: { title: "The Guardian 🛡️", desc: "Safety first! You prefer protecting what you have.", emoji: "🛡️" },
      builder: { title: "The Builder 🌱", desc: "Steady growth with balanced risks.", emoji: "🌱" },
      explorer: { title: "The Explorer 🔍", desc: "Curious and willing to try new things.", emoji: "🔍" },
      pioneer: { title: "The Pioneer 🚀", desc: "Bold and ready for big opportunities!", emoji: "🚀" }
    };
    
    const personalityInfo = personalityDescriptions[personality];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        {/* Risk Profile Result */}
        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
          <span className="text-4xl">{personalityInfo.emoji}</span>
          <h3 className="text-xl font-bold text-white mt-2">{personalityInfo.title}</h3>
          <p className="text-slate-300 text-sm">{personalityInfo.desc}</p>
          <Badge className="mt-2 bg-purple-500/20 text-purple-300">
            Risk Score: {data.riskScore}%
          </Badge>
        </div>

        {/* Recommended Coach */}
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
          <p className="text-sm text-slate-400 text-center mb-3">
            Based on your profile, we recommend:
          </p>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Image
                src={recommendedCoach.animatedAvatar}
                alt={recommendedCoach.name}
                width={64}
                height={64}
                className="rounded-full border-2 border-emerald-500"
              />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1">
                <Check className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-white">{recommendedCoach.name}</h4>
              <p className="text-sm text-emerald-400">{recommendedCoach.personality}</p>
              <p className="text-xs text-slate-400 mt-1">{recommendedCoach.description}</p>
            </div>
          </div>
          
          {/* Other coaches */}
          <div className="flex gap-2 mt-4 justify-center">
            {aiCoaches.filter(c => c.id !== recommendedCoach.id).map((coach) => (
              <button
                key={coach.id}
                onClick={() => updateData({ selectedCoach: coach })}
                className="p-1 rounded-full hover:ring-2 hover:ring-slate-600 transition-all opacity-60 hover:opacity-100"
              >
                <Image
                  src={coach.avatar}
                  alt={coach.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Consent */}
        <div className="space-y-3">
          <label className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 cursor-pointer">
            <input
              type="checkbox"
              checked={data.termsAccepted}
              onChange={(e) => updateData({ termsAccepted: e.target.checked })}
              className="mt-1 rounded border-slate-600"
            />
            <span className="text-sm text-slate-300">
              I agree to the <a href="/terms" className="text-emerald-400 underline">Terms of Service</a> and <a href="/privacy" className="text-emerald-400 underline">Privacy Policy</a>
            </span>
          </label>
          
          <label className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 cursor-pointer">
            <input
              type="checkbox"
              checked={data.marketingConsent}
              onChange={(e) => updateData({ marketingConsent: e.target.checked })}
              className="mt-1 rounded border-slate-600"
            />
            <span className="text-sm text-slate-300">
              Send me weekly wealth wisdom & tips (optional)
            </span>
          </label>
        </div>

        {/* III Welcome Bonus */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Gift className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Welcome Bonus Ready!</p>
                <p className="text-xs text-slate-400">Complete setup to claim</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-400">+{WELCOME_III_BONUS}</span>
              <span className="text-emerald-400 ml-1">{III_CONFIG.emoji}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center pt-4">
          <Button variant="ghost" onClick={prevStep} className="text-slate-400">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <Button 
            onClick={handleComplete}
            disabled={!data.termsAccepted}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Claim +{WELCOME_III_BONUS} {III_CONFIG.emoji} & Start!
          </Button>
        </div>
      </motion.div>
    );
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================

  const steps = [
    renderAdventureIdentity,   // Step 0: Name & Email
    renderAgeSelection,        // Step 1: Age
    renderBackground,          // Step 2: Financial Background
    renderRiskAssessment,      // Step 3: Risk Profile
    renderLearningStyle,       // Step 4: Learning Style
    renderCoachAndConsent      // Step 5: Coach & Consent
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-xs text-slate-500 text-center mt-2">
            Step {currentStep + 1} of {totalSteps}
          </p>
        </div>

        {/* Step content */}
        <div className="bg-slate-900/50 backdrop-blur rounded-2xl border border-slate-800 p-6">
          <AnimatePresence mode="wait">
            {steps[currentStep]()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default OnboardingFlow;


