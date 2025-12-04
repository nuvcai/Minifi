"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Trophy,
  TrendingUp,
  Shield,
  Coins,
  LineChart,
  PieChart,
  AlertTriangle,
  CheckCircle,
  Lock,
  ChevronRight,
} from "lucide-react";

export interface FinancialConcept {
  id: string;
  name: string;
  category: "basics" | "strategy" | "risk" | "advanced";
  icon: string;
  summary: string;
  fullExplanation: string;
  examples: string[];
  masteryLevel: number; // 0-100
  unlocked: boolean;
  unlockedAt?: string;
}

export const defaultConcepts: FinancialConcept[] = [
  {
    id: "diversification",
    name: "Diversification",
    category: "basics",
    icon: "🎯",
    summary: "Don't put all your eggs in one basket",
    fullExplanation:
      "Diversification is a risk management strategy that mixes a variety of investments within a portfolio. The rationale is that a portfolio of different assets will, on average, yield higher returns and pose lower risk than any individual investment.",
    examples: [
      "Investing in both stocks AND bonds",
      "Owning companies from different industries",
      "Mixing domestic and international investments",
    ],
    masteryLevel: 0,
    unlocked: true,
  },
  {
    id: "compound-interest",
    name: "Compound Interest",
    category: "basics",
    icon: "📈",
    summary: "Your money making money on its money",
    fullExplanation:
      "Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods. It's often called 'interest on interest' and is why starting to invest early is so powerful.",
    examples: [
      "$1,000 at 10% for 30 years = $17,449",
      "Starting 10 years earlier can double your wealth",
      "Reinvesting dividends accelerates growth",
    ],
    masteryLevel: 0,
    unlocked: true,
  },
  {
    id: "risk-reward",
    name: "Risk vs. Reward",
    category: "risk",
    icon: "⚖️",
    summary: "Higher potential returns come with higher risk",
    fullExplanation:
      "The risk-return tradeoff is the principle that potential return rises with an increase in risk. Low levels of uncertainty are associated with low potential returns, whereas high levels of uncertainty are associated with high potential returns.",
    examples: [
      "Bonds: Low risk, low return (~4-6%)",
      "Stocks: Medium risk, medium return (~8-12%)",
      "Crypto: High risk, high potential return (volatile)",
    ],
    masteryLevel: 0,
    unlocked: false,
  },
  {
    id: "market-cycles",
    name: "Market Cycles",
    category: "strategy",
    icon: "🔄",
    summary: "Markets go through phases of boom and bust",
    fullExplanation:
      "Market cycles are patterns of growth (expansion) and decline (contraction) in the economy and stock market. Understanding these cycles helps investors make better decisions about when to buy and sell.",
    examples: [
      "Bull markets: Prices rising, optimism high",
      "Bear markets: Prices falling, pessimism high",
      "Recovery: Economy starting to improve after recession",
    ],
    masteryLevel: 0,
    unlocked: false,
  },
  {
    id: "dollar-cost-averaging",
    name: "Dollar Cost Averaging",
    category: "strategy",
    icon: "📅",
    summary: "Invest regularly regardless of market conditions",
    fullExplanation:
      "Dollar cost averaging (DCA) is an investment strategy where you invest a fixed amount at regular intervals, regardless of asset price. This reduces the impact of volatility and removes the pressure of trying to time the market.",
    examples: [
      "Invest $100 every month automatically",
      "Buy more shares when prices are low",
      "Smooths out the average purchase price over time",
    ],
    masteryLevel: 0,
    unlocked: false,
  },
  {
    id: "asset-allocation",
    name: "Asset Allocation",
    category: "advanced",
    icon: "🧩",
    summary: "How you divide investments across asset classes",
    fullExplanation:
      "Asset allocation is an investment strategy that aims to balance risk and reward by distributing a portfolio's assets according to an individual's goals, risk tolerance, and investment horizon. The three main asset classes are stocks, bonds, and cash.",
    examples: [
      "Aggressive: 80% stocks, 15% bonds, 5% cash",
      "Balanced: 60% stocks, 30% bonds, 10% cash",
      "Conservative: 30% stocks, 60% bonds, 10% cash",
    ],
    masteryLevel: 0,
    unlocked: false,
  },
];

const categoryIcons: Record<string, React.ElementType> = {
  basics: BookOpen,
  strategy: TrendingUp,
  risk: AlertTriangle,
  advanced: LineChart,
};

const categoryColors: Record<string, string> = {
  basics: "from-green-500 to-emerald-600",
  strategy: "from-blue-500 to-indigo-600",
  risk: "from-yellow-500 to-orange-600",
  advanced: "from-purple-500 to-pink-600",
};

interface KnowledgeLibraryProps {
  concepts: FinancialConcept[];
  onConceptClick?: (concept: FinancialConcept) => void;
}

export function KnowledgeLibrary({
  concepts,
  onConceptClick,
}: KnowledgeLibraryProps) {
  const [selectedConcept, setSelectedConcept] =
    useState<FinancialConcept | null>(null);

  const categories = ["basics", "strategy", "risk", "advanced"] as const;
  const categoryLabels = {
    basics: "Investment Basics",
    strategy: "Strategies",
    risk: "Risk Management",
    advanced: "Advanced Topics",
  };

  const handleConceptClick = (concept: FinancialConcept) => {
    if (concept.unlocked) {
      setSelectedConcept(concept);
      onConceptClick?.(concept);
    }
  };

  const totalMastery =
    concepts.reduce((sum, c) => sum + (c.unlocked ? c.masteryLevel : 0), 0) /
    concepts.filter((c) => c.unlocked).length;

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Knowledge Library
              </CardTitle>
              <CardDescription>
                Concepts you've learned on your journey
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                {concepts.filter((c) => c.unlocked).length}/{concepts.length}
              </p>
              <p className="text-xs text-muted-foreground">Concepts Unlocked</p>
            </div>
          </div>

          {/* Overall Mastery */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Overall Mastery</span>
              <span>{Math.round(totalMastery || 0)}%</span>
            </div>
            <Progress value={totalMastery || 0} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {categories.map((category) => {
            const categoryConcepts = concepts.filter(
              (c) => c.category === category
            );
            const Icon = categoryIcons[category];

            return (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`p-1.5 rounded-lg bg-gradient-to-br ${categoryColors[category]}`}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm">
                    {categoryLabels[category]}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {categoryConcepts.map((concept, index) => (
                    <motion.button
                      key={concept.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleConceptClick(concept)}
                      disabled={!concept.unlocked}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        concept.unlocked
                          ? "hover:border-primary hover:shadow-md cursor-pointer bg-card"
                          : "opacity-50 cursor-not-allowed bg-muted"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{concept.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm truncate">
                              {concept.name}
                            </p>
                            {!concept.unlocked && (
                              <Lock className="h-3 w-3 text-muted-foreground" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {concept.summary}
                          </p>
                          {concept.unlocked && (
                            <div className="mt-2">
                              <Progress
                                value={concept.masteryLevel}
                                className="h-1"
                              />
                            </div>
                          )}
                        </div>
                        {concept.unlocked && (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Concept Detail Dialog */}
      <Dialog
        open={!!selectedConcept}
        onOpenChange={() => setSelectedConcept(null)}
      >
        <DialogContent className="max-w-lg">
          {selectedConcept && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="text-3xl">{selectedConcept.icon}</span>
                  {selectedConcept.name}
                </DialogTitle>
                <DialogDescription>
                  <Badge
                    className={`bg-gradient-to-r ${
                      categoryColors[selectedConcept.category]
                    } text-white border-0 mt-2`}
                  >
                    {
                      categoryLabels[
                        selectedConcept.category as keyof typeof categoryLabels
                      ]
                    }
                  </Badge>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Mastery Level */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Your Mastery</span>
                    <span>{selectedConcept.masteryLevel}%</span>
                  </div>
                  <Progress
                    value={selectedConcept.masteryLevel}
                    className="h-2"
                  />
                </div>

                {/* Full Explanation */}
                <div>
                  <h4 className="font-semibold mb-2">What is it?</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedConcept.fullExplanation}
                  </p>
                </div>

                {/* Examples */}
                <div>
                  <h4 className="font-semibold mb-2">Examples</h4>
                  <ul className="space-y-2">
                    {selectedConcept.examples.map((example, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Button onClick={() => setSelectedConcept(null)} className="w-full">
                Got it!
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

