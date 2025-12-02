"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Quote, Sparkles, BookOpen } from "lucide-react";
import { AICoach } from "@/components/data/coaches";
import { getRandomInvestorWisdom, type InvestorWisdom } from "@/components/data/wealthWisdom";

// Coach-specific inspirational quotes
const coachQuotes: Record<string, string[]> = {
  "steady-sam": [
    "Slow and steady wins the race! 🐢",
    "Capital preservation is the first rule of wealth.",
    "Don't chase returns - let them come to you!",
    "A boring portfolio is a beautiful portfolio.",
    "Sleep well at night > chase maximum returns",
    "When in doubt, diversify it out! 🛡️",
  ],
  "growth-guru": [
    "Balance is the key to long-term success! ⚖️",
    "Diversification: the only free lunch in investing.",
    "Time in the market beats timing the market.",
    "Stay the course through volatility!",
    "Rebalance quarterly, stress never! 📊",
    "Growth AND stability - why not both?",
  ],
  "adventure-alex": [
    "Fortune favors the BOLD! 🚀",
    "No risk, no reward - let's GO!",
    "The best time to invest was yesterday. Second best? NOW!",
    "Big dreams require big moves! ⚡",
    "Volatility is opportunity in disguise.",
    "Winners take calculated risks!",
  ],
  "yield-yoda": [
    "Let your money work while you sleep! 💰",
    "Dividends: the gift that keeps giving.",
    "Passive income is the path to freedom.",
    "Compound interest is the 8th wonder! ✨",
    "Income today, wealth tomorrow.",
    "Patient investors harvest the richest rewards.",
  ],
};

interface CoachSidebarProps {
  coaches: AICoach[];
  selectedCoach: AICoach;
  onCoachSelect: (coach: AICoach) => void;
}

export function CoachSidebar({
  coaches,
  selectedCoach,
  onCoachSelect,
}: CoachSidebarProps) {
  const [currentQuote, setCurrentQuote] = useState("");
  const [isQuoteAnimating, setIsQuoteAnimating] = useState(false);
  const [investorTip, setInvestorTip] = useState<InvestorWisdom | null>(null);

  // Get quotes for the selected coach
  const quotes = coachQuotes[selectedCoach.id] || coachQuotes["growth-guru"];

  // Load investor wisdom on mount
  useEffect(() => {
    setInvestorTip(getRandomInvestorWisdom());
  }, []);

  // Rotate quotes every 8 seconds
  useEffect(() => {
    const getRandomQuote = () => quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(getRandomQuote());

    const interval = setInterval(() => {
      setIsQuoteAnimating(true);
      setTimeout(() => {
        setCurrentQuote(getRandomQuote());
        setIsQuoteAnimating(false);
      }, 300);
    }, 8000);

    return () => clearInterval(interval);
  }, [selectedCoach.id, quotes]);

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-100">
          <Users className="h-5 w-5 text-emerald-400" />
          Your Squad 🤖
        </CardTitle>
        <CardDescription className="text-slate-400">Pick your vibe - who&apos;s got your back?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Coach Quote Banner */}
        <div className="relative p-3 rounded-lg bg-linear-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 mb-4">
          <Quote className="absolute top-2 left-2 h-3 w-3 text-emerald-500/50" />
          <div className="flex items-start gap-2 pl-4">
            <Image
              src={selectedCoach.avatar}
              alt={selectedCoach.name}
              width={24}
              height={24}
              className="rounded-full shrink-0 mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <p className={`text-xs text-emerald-300 italic transition-opacity duration-300 ${
                isQuoteAnimating ? "opacity-0" : "opacity-100"
              }`}>
                "{currentQuote}"
              </p>
              <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                <Sparkles className="h-2.5 w-2.5" />
                {selectedCoach.name}
              </p>
            </div>
          </div>
        </div>

        {coaches.map((coach) => (
          <div
            key={coach.id}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              selectedCoach.id === coach.id
                ? "border-emerald-500/50 bg-emerald-500/10 shadow-sm shadow-emerald-500/10"
                : "border-slate-700/50 hover:border-emerald-500/30 hover:bg-emerald-500/5"
            }`}
            onClick={() => onCoachSelect(coach)}
          >
            <div className="flex items-center gap-3">
              <Image
                src={coach.avatar}
                alt={coach.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="flex-1">
                <p className="font-medium text-sm text-slate-100">{coach.name}</p>
                <p className="text-xs text-slate-400">
                  {coach.personality}
                </p>
              </div>
            </div>
            <p className="text-xs mt-2 text-slate-400">
              {coach.description}
            </p>
          </div>
        ))}

        {/* Wealth Wisdom Tip */}
        {investorTip && (
          <div className="mt-4 p-3 rounded-lg bg-linear-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-3.5 w-3.5 text-purple-400" />
              <span className="text-[10px] text-purple-400 font-medium uppercase tracking-wide">
                Investor Wisdom
              </span>
            </div>
            <p className="text-xs text-purple-200 italic mb-1">
              "{investorTip.quote}"
            </p>
            <p className="text-[10px] text-slate-500">
              — {investorTip.investor}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
