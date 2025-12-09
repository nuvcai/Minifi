/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   🎓 KNOWLEDGE QUIZ - Post-Mission Learning Verification                     ║
 * ║   Validates understanding with micro-assessments                             ║
 * ║   FO Principle: "Test your assumptions, validate your learning"              ║
 * ║   Copyright (c) 2025 NUVC.AI. All Rights Reserved.                          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Sparkles,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Award,
  Lightbulb,
  Trophy,
  Star,
  Zap,
} from "lucide-react";
import { MissionData, InvestmentOption } from "@/components/data/missions";

// Quiz question types
interface QuizQuestion {
  id: string;
  question: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
  concept: string;
  xpReward: number;
}

// Generate quiz questions based on mission
const generateQuizQuestions = (
  missionData: MissionData,
  eventYear: number,
  selectedOption: InvestmentOption,
  actualPerformance: "profit" | "loss"
): QuizQuestion[] => {
  const questions: QuizQuestion[] = [];
  
  // Question 1: Understanding the event
  const eventQuestions: Record<number, QuizQuestion> = {
    1990: {
      id: "q1",
      question: "What caused Japan's 1990 bubble to burst? 🇯🇵",
      options: [
        { id: "a", text: "The central bank raised interest rates suddenly", isCorrect: true },
        { id: "b", text: "An earthquake destroyed major cities", isCorrect: false },
        { id: "c", text: "Japan ran out of technology exports", isCorrect: false },
        { id: "d", text: "The US banned Japanese imports", isCorrect: false },
      ],
      explanation: "Japan's central bank raised interest rates to cool down speculation, which caused both stock and real estate prices to crash dramatically.",
      concept: "Interest Rate Impact",
      xpReward: 25,
    },
    1997: {
      id: "q1",
      question: "What triggered the Asian Financial Crisis of 1997? 💱",
      options: [
        { id: "a", text: "A typhoon destroyed major factories", isCorrect: false },
        { id: "b", text: "Thailand let its currency float freely", isCorrect: true },
        { id: "c", text: "China invaded Hong Kong", isCorrect: false },
        { id: "d", text: "Oil prices tripled overnight", isCorrect: false },
      ],
      explanation: "When Thailand depegged its currency (the Baht) from the US dollar, it triggered a domino effect of currency collapses across Asia.",
      concept: "Currency Risk",
      xpReward: 25,
    },
    2000: {
      id: "q1",
      question: "Why did most dot-com companies fail in 2000? 💻",
      options: [
        { id: "a", text: "The internet stopped working", isCorrect: false },
        { id: "b", text: "They had no real business model or profits", isCorrect: true },
        { id: "c", text: "All the programmers quit", isCorrect: false },
        { id: "d", text: "Computers became too expensive", isCorrect: false },
      ],
      explanation: "Most dot-com companies were valued on hype rather than actual profits. When investors demanded real returns, companies without sustainable business models collapsed.",
      concept: "Business Fundamentals",
      xpReward: 25,
    },
    2008: {
      id: "q1",
      question: "What made the 2008 Financial Crisis so severe? 🏦",
      options: [
        { id: "a", text: "Banks made risky loans that couldn't be repaid", isCorrect: true },
        { id: "b", text: "A volcano disrupted global trade", isCorrect: false },
        { id: "c", text: "The government banned all investing", isCorrect: false },
        { id: "d", text: "Too many people invested in gold", isCorrect: false },
      ],
      explanation: "Banks gave home loans to people who couldn't afford them (subprime mortgages), then packaged these risky loans as 'safe' investments. When defaults started, the whole system collapsed.",
      concept: "Credit Risk",
      xpReward: 25,
    },
    2020: {
      id: "q1",
      question: "Why did tech stocks surge during the COVID crash? 🦠→📈",
      options: [
        { id: "a", text: "Everyone was stuck at home using technology", isCorrect: true },
        { id: "b", text: "The government gave money only to tech companies", isCorrect: false },
        { id: "c", text: "Tech CEOs secretly planned the pandemic", isCorrect: false },
        { id: "d", text: "All other industries shut down forever", isCorrect: false },
      ],
      explanation: "Remote work, online shopping, and digital entertainment exploded during lockdowns. Companies like Zoom, Amazon, and Netflix thrived while physical businesses struggled.",
      concept: "Trend Acceleration",
      xpReward: 25,
    },
    2025: {
      id: "q1",
      question: "What makes AI similar to previous tech revolutions? 🤖",
      options: [
        { id: "a", text: "It's mostly just a scam", isCorrect: false },
        { id: "b", text: "It multiplies human capability like past revolutions did", isCorrect: true },
        { id: "c", text: "It only benefits tech companies", isCorrect: false },
        { id: "d", text: "It doesn't affect regular people", isCorrect: false },
      ],
      explanation: "Like steam power, electricity, and computers before it, AI multiplies what humans can accomplish. This multiplication effect is what creates enormous wealth opportunities.",
      concept: "Technological Disruption",
      xpReward: 25,
    },
  };
  
  // Add event-specific question
  if (eventQuestions[eventYear]) {
    questions.push(eventQuestions[eventYear]);
  }
  
  // Question 2: FO Principle from this mission
  questions.push({
    id: "q2",
    question: "What Family Office principle does this mission teach? 🏛️",
    options: [
      { id: "a", text: "Put all your money in one investment for maximum gains", isCorrect: false },
      { id: "b", text: "Diversification protects wealth across market cycles", isCorrect: true },
      { id: "c", text: "Only invest in cash during uncertain times", isCorrect: false },
      { id: "d", text: "Follow what everyone else is doing", isCorrect: false },
    ],
    explanation: missionData.foWisdom,
    concept: "Diversification",
    xpReward: 30,
  });
  
  // Question 3: Asset class understanding
  const bestOption = [...missionData.options].sort((a, b) => b.actualReturn - a.actualReturn)[0];
  questions.push({
    id: "q3",
    question: `Which asset class performed BEST in this scenario? 📊`,
    options: missionData.options.map(opt => ({
      id: opt.id,
      text: `${opt.name} (${opt.assetClass || "mixed"})`,
      isCorrect: opt.id === bestOption.id,
    })),
    explanation: `${bestOption.name} performed best with a ${bestOption.actualReturn}% return. Understanding which assets perform well in different conditions is key to Family Office investing.`,
    concept: "Asset Allocation",
    xpReward: 35,
  });
  
  return questions;
};

interface KnowledgeQuizProps {
  missionData: MissionData;
  eventYear: number;
  eventTitle: string;
  selectedOption: InvestmentOption;
  actualPerformance: "profit" | "loss";
  onComplete: (score: number, totalXp: number) => void;
  onXpEarned?: (amount: number) => void;
}

export function KnowledgeQuiz({
  missionData,
  eventYear,
  eventTitle,
  selectedOption,
  actualPerformance,
  onComplete,
  onXpEarned,
}: KnowledgeQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const questions = useMemo(
    () => generateQuizQuestions(missionData, eventYear, selectedOption, actualPerformance),
    [missionData, eventYear, selectedOption, actualPerformance]
  );
  
  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = selectedAnswers[currentQuestion?.id];
  const isAnswered = !!selectedAnswer;
  const isCorrect = currentQuestion?.options.find(o => o.id === selectedAnswer)?.isCorrect;
  
  // Calculate total score and XP
  const score = useMemo(() => {
    return questions.filter(q => {
      const answer = selectedAnswers[q.id];
      return q.options.find(o => o.id === answer)?.isCorrect;
    }).length;
  }, [questions, selectedAnswers]);
  
  const totalXpEarned = useMemo(() => {
    return questions.reduce((total, q) => {
      const answer = selectedAnswers[q.id];
      if (q.options.find(o => o.id === answer)?.isCorrect) {
        return total + q.xpReward;
      }
      return total + Math.round(q.xpReward * 0.25); // 25% XP for attempting
    }, 0);
  }, [questions, selectedAnswers]);
  
  const handleAnswerSelect = (answerId: string) => {
    if (isAnswered) return; // Can't change answer
    
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answerId,
    }));
    setShowResult(true);
    
    // Award XP
    const correct = currentQuestion.options.find(o => o.id === answerId)?.isCorrect;
    if (onXpEarned) {
      onXpEarned(correct ? currentQuestion.xpReward : Math.round(currentQuestion.xpReward * 0.25));
    }
  };
  
  const handleNextQuestion = () => {
    setShowResult(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
      onComplete(score, totalXpEarned);
    }
  };
  
  // Final Results Screen
  if (isComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    const grade = percentage >= 90 ? "A+" : percentage >= 80 ? "A" : percentage >= 70 ? "B" : percentage >= 60 ? "C" : "D";
    
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Celebration Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 mb-4 animate-bounce">
            <Trophy className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Knowledge Check Complete! 🎓
          </h3>
          <p className="text-gray-500">
            You've validated your learning from {eventTitle}
          </p>
        </div>
        
        {/* Score Card */}
        <Card className="bg-gradient-to-r from-indigo-50 to-violet-50 border-indigo-200">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-4xl font-bold text-gray-900">{score}/{questions.length}</p>
                <p className="text-xs text-gray-500">Correct Answers</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-amber-600">+{totalXpEarned}</p>
                <p className="text-xs text-gray-500">XP Earned</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-indigo-600">{grade}</p>
                <p className="text-xs text-gray-500">Grade</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Concepts Mastered */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-600 flex items-center gap-2">
            <Brain className="h-4 w-4 text-indigo-600" />
            Concepts Covered
          </h4>
          <div className="flex flex-wrap gap-2">
            {questions.map(q => {
              const correct = q.options.find(o => o.id === selectedAnswers[q.id])?.isCorrect;
              return (
                <Badge 
                  key={q.id}
                  className={correct 
                    ? "bg-emerald-100 text-emerald-700 border-emerald-300" 
                    : "bg-gray-100 text-gray-500 border-gray-200"
                  }
                >
                  {correct && <CheckCircle2 className="h-3 w-3 mr-1" />}
                  {q.concept}
                </Badge>
              );
            })}
          </div>
        </div>
        
        {/* Encouragement based on score */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-amber-600 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                {percentage >= 80 
                  ? "Outstanding! You've deeply understood this market event. This knowledge will serve you well in future investing decisions."
                  : percentage >= 60
                  ? "Good effort! You're building solid foundations. Review the explanations to strengthen your understanding."
                  : "Keep learning! Every mission teaches valuable lessons. Try revisiting the mission context to reinforce these concepts."}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Button 
          onClick={() => onComplete(score, totalXpEarned)}
          className="w-full bg-gradient-to-r from-indigo-500 to-violet-500"
        >
          Continue to Final Summary
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Knowledge Check</h3>
            <p className="text-xs text-gray-500">Test your understanding</p>
          </div>
        </div>
        <Badge variant="outline" className="text-indigo-600 border-indigo-300">
          Question {currentQuestionIndex + 1}/{questions.length}
        </Badge>
      </div>
      
      {/* Progress */}
      <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="h-1.5" />
      
      {/* Question */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600 flex-shrink-0">
              {currentQuestionIndex + 1}
            </div>
            <div>
              <p className="font-medium text-gray-900 text-lg leading-relaxed">
                {currentQuestion.question}
              </p>
              <Badge className="mt-2 bg-gray-100 text-gray-600 border-gray-200">
                <Star className="h-3 w-3 mr-1" />
                +{currentQuestion.xpReward} XP
              </Badge>
            </div>
          </div>
          
          {/* Answer Options */}
          <div className="space-y-2">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedAnswer === option.id;
              const showCorrect = showResult && option.isCorrect;
              const showWrong = showResult && isSelected && !option.isCorrect;
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleAnswerSelect(option.id)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                    showCorrect
                      ? "bg-emerald-50 border-emerald-500 text-gray-900"
                      : showWrong
                      ? "bg-red-50 border-red-500 text-gray-900"
                      : isSelected
                      ? "bg-indigo-50 border-indigo-500 text-gray-900"
                      : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  } ${isAnswered && !isSelected && !option.isCorrect ? "opacity-50" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                        showCorrect ? "bg-emerald-500 border-emerald-400 text-white" :
                        showWrong ? "bg-red-500 border-red-400 text-white" :
                        isSelected ? "bg-indigo-500 border-indigo-400 text-white" :
                        "border-gray-300 text-gray-600"
                      }`}>
                        {showCorrect ? <CheckCircle2 className="h-4 w-4 text-white" /> :
                         showWrong ? <XCircle className="h-4 w-4 text-white" /> :
                         option.id.toUpperCase()}
                      </span>
                      <span className="font-medium">{option.text}</span>
                    </div>
                    {showCorrect && (
                      <Sparkles className="h-5 w-5 text-emerald-500 animate-pulse" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Result Explanation */}
      {showResult && (
        <Card className={`animate-in fade-in slide-in-from-bottom-2 duration-300 ${
          isCorrect 
            ? "bg-emerald-500/10 border-emerald-500/30" 
            : "bg-amber-500/10 border-amber-500/30"
        }`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <>
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium text-emerald-300 mb-1">
                      Correct! +{currentQuestion.xpReward} XP 🎉
                    </p>
                    <p className="text-sm text-slate-300">{currentQuestion.explanation}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium text-amber-300 mb-1">
                      Not quite! +{Math.round(currentQuestion.xpReward * 0.25)} XP for trying
                    </p>
                    <p className="text-sm text-slate-300">{currentQuestion.explanation}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Next Button */}
      {showResult && (
        <Button
          onClick={handleNextQuestion}
          className="w-full bg-gradient-to-r from-indigo-500 to-violet-500"
        >
          {currentQuestionIndex < questions.length - 1 ? (
            <>
              Next Question
              <ChevronRight className="h-4 w-4 ml-2" />
            </>
          ) : (
            <>
              See Final Results
              <Trophy className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      )}
    </div>
  );
}

export default KnowledgeQuiz;

