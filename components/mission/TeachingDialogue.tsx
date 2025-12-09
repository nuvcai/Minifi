"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  Trophy,
  DollarSign,
  TrendingUp,
  BarChart3,
  Shield,
  Target,
} from "lucide-react";
import { PerformanceChart } from "@/components/PerformanceChart";
import { api, InvestmentMetrics, CoachRequest, CoachResponse } from "@/lib/api";
import { 
  AICoach, 
  aiCoaches,
  getCoachResponse, 
  getCoachCatchphrase,
  getCoachEncouragement,
  isCoachAlignedDecision 
} from "@/components/data/coaches";
 

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface TeachingDialogueProps {
  coach: {
    id?: string;
    name: string;
    avatar: string;
    personality: string;
    color: string;
    description: string;
    animatedAvatar: string;
  };
  selectedOption: {
    name: string;
    id: string;
  };
  actualReturn: number;
  finalAmount: number;
  performance: "profit" | "loss";
  outcome: string;
  event: {
    title: string;
    description: string;
  };
  simulationResult?: {
    performance_chart?: {
      dates: string[];
      values: number[];
    };
    [key: string]: unknown;
  };
  onComplete: () => void;
  onXpEarned?: (amount: number) => void;
}

interface TeachingMessage {
  id: string;
  type: "greeting" | "lesson" | "completion";
  content: string;
  showContinue?: boolean;
  showComplete?: boolean;
  showMetrics?: boolean;
  showChart?: boolean;
  showReturnsChart?: boolean;
  showAnalysis?: boolean;
  metricButtons?: Array<{
    key: string;
    label: string;
    icon: React.ReactElement<{ className?: string }>;
    targetMetric: string;
  }>;
}

// ============================================================================
// CONSTANTS & CONFIGURATIONS
// ============================================================================

const TICKER_MAP: Record<string, string> = {
  // ============================================================================
  // 1990 Japanese Bubble options
  // ============================================================================
  "Japanese Stocks": "^N225", // Nikkei 225 - Japanese stock market
  "Tokyo Real Estate": "^N225", // Using Nikkei as proxy for Japanese real estate (same period correlation)
  "US Treasury Bonds": "^TYX", // 30-year Treasury yield (better for long-term bonds)
  "Gold": "GLD", // Gold ETF (or ^GOLD for spot gold)

  // ============================================================================
  // 1997 Asian Financial Crisis options
  // ============================================================================
  "Asian Stocks": "^N225", // Using Nikkei as proxy for Asian markets
  "US Stocks": "^GSPC", // S&P 500
  "Bonds": "^TYX", // 30-year Treasury yield
  "US Dollar Cash": "UUP", // US Dollar ETF

  // ============================================================================
  // 2000 Dot-com Bubble options
  // ============================================================================
  "Tech Stocks": "^IXIC", // NASDAQ Composite
  "Dot-com Startups": "^IXIC", // NASDAQ Composite (best proxy for dot-coms)
  "Traditional Stocks": "^DJI", // Dow Jones Industrial Average
  "Cash": "^IRX", // 3-month Treasury Bill rate (proxy for cash returns)

  // ============================================================================
  // 2008 Financial Crisis options
  // ============================================================================
  "Global Stocks": "^GSPC", // S&P 500 as global equity proxy
  "Banking Stocks": "XLF", // Financial Select Sector SPDR Fund
  "Bank Stocks": "XLF", // Financial Select Sector SPDR Fund (alias)

  // ============================================================================
  // 2020 COVID-19 options
  // ============================================================================
  "Tech Growth": "^IXIC", // NASDAQ
  "Travel & Airlines": "JETS", // US Global Jets ETF (or XAL for airlines index)
  "Value Stocks": "^GSPC", // S&P 500
  "Safe Havens": "GLD", // Gold ETF

  // ============================================================================
  // 2025 Current Market options
  // ============================================================================
  "AI Tech Stocks": "^IXIC", // NASDAQ (includes major AI companies)
  "Green Energy Stocks": "ICLN", // iShares Global Clean Energy ETF
  "Inflation-Protected Bonds (TIPS)": "TIP", // iShares TIPS Bond ETF
  "Commodities Basket": "DJP", // iPath Bloomberg Commodity Index ETN

  // ============================================================================
  // General/Shared assets across multiple missions
  // ============================================================================
  "Real Estate": "VNQ", // Vanguard Real Estate ETF
  "Government Bonds": "^TYX", // 30-year Treasury yield
  "Australian Stocks": "^AXJO", // ASX 200
  "Bitcoin": "BTC-USD", // Bitcoin spot price
  "Ethereum": "ETH-USD", // Ethereum spot price
  "Commodities": "DJP", // Bloomberg Commodity Index (alias)
};

const TYPING_SPEED = 15; // milliseconds per character (faster typing)

// Global cache for AI coach advice to prevent duplicate API calls across component instances
const aiAdviceCache = new Map<
  string,
  { data: CoachResponse; timestamp: number }
>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Global request lock to prevent duplicate API calls
const activeRequests = new Set<string>();

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Maps coach personality to risk tolerance
 */
const getRiskTolerance = (personality: string): number => {
  const toleranceMap: Record<string, number> = {
    "Conservative Coach": 0.2,
    "Balanced Coach": 0.5,
    "Aggressive Coach": 0.8,
    "Income Coach": 0.3,
  };
  return toleranceMap[personality] || 0.5;
};

/**
 * Maps coach personality to investment goal
 */
const getInvestmentGoal = (
  personality: string
): "balanced" | "capital_gains" | "cash_flow" => {
  const goalMap: Record<string, "balanced" | "capital_gains" | "cash_flow"> = {
    "Conservative Coach": "capital_gains",
    "Balanced Coach": "balanced",
    "Aggressive Coach": "capital_gains",
    "Income Coach": "cash_flow",
  };
  return goalMap[personality] || "balanced";
};

/**
 * Extracts year from event title
 */
const extractEventYear = (eventTitle: string): number => {
  const yearMatch = eventTitle.match(/\d{4}/);
  return parseInt(yearMatch?.[0] || "1990");
};

/**
 * Formats percentage with sign
 */
const _formatPercentage = (value: number): string => {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
};
void _formatPercentage;

/**
 * Determines player level based on mission difficulty, performance, and experience
 */
const getPlayerLevel = (
  eventTitle: string,
  actualReturn: number,
  performance: "profit" | "loss",
  selectedOption: string
): "beginner" | "intermediate" | "advanced" => {
  // Mission difficulty analysis based on event title
  const eventDifficulty = getEventDifficulty(eventTitle);

  // Investment option complexity
  const optionComplexity = getOptionComplexity(selectedOption);

  // Performance analysis
  const returnMagnitude = Math.abs(actualReturn);
  const isProfitable = performance === "profit";

  // Calculate difficulty score (0-100)
  let difficultyScore = 0;

  // Event difficulty weight: 40%
  difficultyScore += eventDifficulty * 0.4;

  // Option complexity weight: 30%
  difficultyScore += optionComplexity * 0.3;

  // Performance weight: 30%
  if (isProfitable) {
    difficultyScore += Math.min(returnMagnitude / 2, 30); // Cap at 30 points
  } else {
    difficultyScore += Math.min(returnMagnitude / 4, 15); // Losses get fewer points
  }

  // Determine level based on difficulty score
  if (difficultyScore >= 70) {
    return "advanced";
  } else if (difficultyScore >= 40) {
    return "intermediate";
  } else {
    return "beginner";
  }
};

/**
 * Analyzes event difficulty based on historical context
 */
const getEventDifficulty = (eventTitle: string): number => {
  const title = eventTitle.toLowerCase();

  // High difficulty events (complex market conditions)
  if (
    title.includes("bubble") ||
    title.includes("crisis") ||
    title.includes("crash")
  ) {
    return 90;
  }

  // Medium difficulty events (significant market movements)
  if (
    title.includes("recession") ||
    title.includes("inflation") ||
    title.includes("deflation")
  ) {
    return 70;
  }

  // Moderate difficulty events (market volatility)
  if (
    title.includes("volatility") ||
    title.includes("uncertainty") ||
    title.includes("change")
  ) {
    return 50;
  }

  // Lower difficulty events (stable conditions)
  if (
    title.includes("growth") ||
    title.includes("stability") ||
    title.includes("recovery")
  ) {
    return 30;
  }

  // Default difficulty
  return 40;
};

/**
 * Analyzes investment option complexity
 */
const getOptionComplexity = (selectedOption: string): number => {
  const option = selectedOption.toLowerCase();

  // High complexity options (cryptocurrency, derivatives)
  if (
    option.includes("bitcoin") ||
    option.includes("ethereum") ||
    option.includes("crypto")
  ) {
    return 90;
  }

  // Medium-high complexity (international markets, commodities)
  if (
    option.includes("japanese") ||
    option.includes("australian") ||
    option.includes("gold")
  ) {
    return 70;
  }

  // Medium complexity (bonds, real estate)
  if (
    option.includes("bonds") ||
    option.includes("real estate") ||
    option.includes("treasury")
  ) {
    return 50;
  }

  // Lower complexity (cash, stable assets)
  if (option.includes("cash") || option.includes("dollar")) {
    return 30;
  }

  // Default complexity
  return 50;
};

/**
 * Generates a cache key for AI coach advice
 */
const generateCacheKey = (
  coachName: string,
  selectedOption: string,
  eventTitle: string,
  actualReturn: number,
  finalAmount: number,
  performance: string
): string => {
  return `${coachName}-${selectedOption}-${eventTitle}-${actualReturn}-${finalAmount}-${performance}`;
};

/**
 * Checks if cached AI advice is still valid
 */
const getCachedAdvice = (cacheKey: string): CoachResponse | null => {
  const cached = aiAdviceCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

/**
 * Checks if a request is already in progress for the given cache key
 */
const isRequestInProgress = (cacheKey: string): boolean => {
  return activeRequests.has(cacheKey);
};

/**
 * Marks a request as in progress
 */
const markRequestInProgress = (cacheKey: string): void => {
  activeRequests.add(cacheKey);
};

/**
 * Marks a request as completed
 */
const markRequestCompleted = (cacheKey: string): void => {
  activeRequests.delete(cacheKey);
};

/**
 * Stores AI advice in cache
 */
const cacheAdvice = (cacheKey: string, advice: CoachResponse): void => {
  aiAdviceCache.set(cacheKey, { data: advice, timestamp: Date.now() });
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function TeachingDialogue({
  coach,
  selectedOption,
  actualReturn,
  finalAmount,
  performance,
  outcome: _outcome,
  event,
  simulationResult,
  onComplete,
  onXpEarned,
}: TeachingDialogueProps) {
  void _outcome; // Kept for future use
  // Add custom styles for animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes bounce-slide-up {
        0% { transform: translateY(20px); opacity: 0; }
        30% { transform: translateY(-10px); opacity: 1; }
        50% { transform: translateY(-15px); opacity: 1; }
        70% { transform: translateY(-12px); opacity: 1; }
        100% { transform: translateY(-20px); opacity: 0; }
      }
      
      @keyframes sparkle-1 {
        0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
        50% { opacity: 1; transform: scale(1) rotate(180deg); }
      }
      
      @keyframes sparkle-2 {
        0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
        40% { opacity: 1; transform: scale(1.2) rotate(90deg); }
      }
      
      @keyframes sparkle-3 {
        0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
        60% { opacity: 1; transform: scale(0.8) rotate(270deg); }
      }
      
      @keyframes sparkle-4 {
        0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
        35% { opacity: 1; transform: scale(1.1) rotate(135deg); }
      }
      
      @keyframes sparkle-5 {
        0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
        55% { opacity: 1; transform: scale(0.9) rotate(225deg); }
      }
      
      .animate-bounce-slide-up {
        animation: bounce-slide-up 1.5s ease-out forwards;
      }
      
      .animate-sparkle-1 { animation: sparkle-1 1.2s ease-out infinite; }
      .animate-sparkle-2 { animation: sparkle-2 1.3s ease-out infinite 0.1s; }
      .animate-sparkle-3 { animation: sparkle-3 1.1s ease-out infinite 0.2s; }
      .animate-sparkle-4 { animation: sparkle-4 1.4s ease-out infinite 0.15s; }
      .animate-sparkle-5 { animation: sparkle-5 1.2s ease-out infinite 0.25s; }
      
      @keyframes pulse-gradient {
        0%, 100% { background: rgba(147, 51, 234, 0.1); }
        50% { background: rgba(147, 51, 234, 0.2); }
      }
      
      .animate-pulse-gradient {
        animation: pulse-gradient 2s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [messages, setMessages] = useState<TeachingMessage[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [_displayedText, setDisplayedText] = useState(""); void _displayedText;
  const [_isTyping, setIsTyping] = useState(false); void _isTyping;
  const [showContinue, setShowContinue] = useState(false);
  const [realMetrics, setRealMetrics] = useState<InvestmentMetrics | null>(
    null
  );
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [aiCoachAdvice, setAiCoachAdvice] = useState<CoachResponse | null>(
    null
  );
  const [loadingAiAdvice, setLoadingAiAdvice] = useState(false);
  // Use ref to track if we've already generated dialogue
  const hasGeneratedDialogue = useRef(false);
  // Track whether dialogue was generated with AI advice
  const [dialogueGeneratedWithAi, setDialogueGeneratedWithAi] = useState(false);
  // Track if we've already fetched AI advice to prevent duplicate API calls
  const hasFetchedAiAdvice = useRef(false);
  // Track selected metric button and its explanation
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [metricExplanation, setMetricExplanation] = useState<string>("");
  // Track hover state for metric highlighting
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);
  // Track XP earned this session
  const [_sessionXp, setSessionXp] = useState<number>(0); void _sessionXp;
  // Track XP animation
  const [showXpAnimation, setShowXpAnimation] = useState<boolean>(false);
  // Track coach typing effect
  const [coachTypingText, setCoachTypingText] = useState<string>("");
  const [isCoachTyping, setIsCoachTyping] = useState<boolean>(false);
  // Track viewed buttons to prevent duplicate XP - separate shared and step-specific
  const [viewedSharedButtons, setViewedSharedButtons] = useState<Set<string>>(new Set());
  const [viewedStepButtons, setViewedStepButtons] = useState<Set<string>>(new Set());

  // Generate cache key for this mission - use useMemo to prevent recreation
  const cacheKey = React.useMemo(
    () =>
      generateCacheKey(
        coach.name,
        selectedOption.name,
        event.title,
        actualReturn,
        finalAmount,
        performance
      ),
    [
      coach.name,
      selectedOption.name,
      event.title,
      actualReturn,
      finalAmount,
      performance,
    ]
  );

  // ============================================================================
  // DIALOGUE GENERATION
  // ============================================================================

  // ============================================================================
  // DATA FETCHING EFFECTS
  // ============================================================================

  // Fetch real investment metrics
  useEffect(() => {
    const fetchRealMetrics = async () => {
      setLoadingMetrics(true);
      try {
        const ticker = TICKER_MAP[selectedOption.name] || "^GSPC"; // Default to S&P 500
        const eventYear = extractEventYear(event.title);
        const metrics = await api.getHistoricalPerformance(ticker, eventYear);
        setRealMetrics(metrics);
      } catch (error) {
        console.error("Failed to fetch real metrics:", error);
        // Fall back to simulation data
      } finally {
        setLoadingMetrics(false);
      }
    };

    fetchRealMetrics();
  }, [selectedOption.name, event.title]);

  // Fetch AI coach advice
  useEffect(() => {
    // Check cache first
    const cachedAdvice = getCachedAdvice(cacheKey);
    if (cachedAdvice) {
      setAiCoachAdvice(cachedAdvice);
      hasFetchedAiAdvice.current = true;
      return;
    }

    // Check if request is already in progress globally
    if (isRequestInProgress(cacheKey)) {
      return;
    }

    // Prevent duplicate API calls within this component
    if (hasFetchedAiAdvice.current) {
      return;
    }

    const fetchAiCoachAdvice = async () => {
      markRequestInProgress(cacheKey); // Mark as in progress globally
      setLoadingAiAdvice(true);

      // Set a timeout to fall back if API takes too long
      const timeoutId = setTimeout(() => {
        if (!hasFetchedAiAdvice.current) {
          console.warn("AI coach advice timed out - using fallback");
          const timeoutFallback: CoachResponse = {
            advice: `Let's discuss your ${selectedOption.name} investment! You took action during ${event.title} - that's how real investors learn.`,
            recommendations: [
              "Diversify your portfolio across different asset classes",
              "Think long-term like family offices do",
              "Learn from each investment decision"
            ],
            next_steps: [
              "Explore another mission to continue learning",
              "Try a different investment strategy"
            ],
            risk_assessment: "Every investment carries risk - understanding this is key to becoming a smart investor.",
            educational_insights: ["Family offices build wealth through patience and diversification"],
            encouragement: "Keep investing and learning! You're on the path to thinking like a family office. 💪"
          };
          setAiCoachAdvice(timeoutFallback);
          hasFetchedAiAdvice.current = true;
          setLoadingAiAdvice(false);
          markRequestCompleted(cacheKey);
        }
      }, 8000); // 8 second timeout

      try {
        const coachRequest: CoachRequest = {
          player_level: getPlayerLevel(
            event.title,
            actualReturn,
            performance,
            selectedOption.name
          ),
          current_portfolio: { [selectedOption.name]: 1.0 }, // 100% in selected option
          investment_goal: getInvestmentGoal(coach.personality),
          risk_tolerance: getRiskTolerance(coach.personality),
          time_horizon: 365,
          completed_missions: ["Basic Investment", "Risk Management"],
          current_mission: event.title,
          player_context: `Player just completed an investment mission where they invested in ${
            selectedOption.name
          } during ${
            event.title
          }. The investment resulted in a ${performance} with ${actualReturn}% return, ending with $${Math.round(
            finalAmount
          ).toLocaleString()}. The player is working with ${coach.name} (${
            coach.personality
          }) who specialises in ${coach.description}.`,
        };

        const advice = await api.getCoachAdvice(coachRequest);
        clearTimeout(timeoutId); // Clear timeout on success
        setAiCoachAdvice(advice);
        hasFetchedAiAdvice.current = true; // Mark as fetched

        // Cache the advice for future use
        cacheAdvice(cacheKey, advice);
      } catch (error) {
        clearTimeout(timeoutId); // Clear timeout on error
        console.error("Failed to fetch AI coach advice:", error);
        hasFetchedAiAdvice.current = true; // Mark as fetched even on error
        
        // Set fallback AI advice so the game can continue
        const fallbackAdvice: CoachResponse = {
          advice: performance === "profit" 
            ? `Great work on your ${selectedOption.name} investment! You showed courage by investing during ${event.title}. This is how family offices learn - by taking action and studying the results.`
            : `Your ${selectedOption.name} investment during ${event.title} may not have gone as planned, but every great investor learns from challenges. Family offices build wealth by learning from every experience.`,
          recommendations: [
            "Diversify across multiple asset classes like family offices do",
            "Consider your risk tolerance when choosing investments",
            "Study how different assets perform during market events"
          ],
          next_steps: [
            "Try a different asset class in your next mission",
            "Explore how other investments performed during this event"
          ],
          risk_assessment: "Understanding risk is key to building long-term wealth. Each investment teaches valuable lessons.",
          educational_insights: [
            "Family offices diversify across 4-6+ asset classes",
            "Past performance helps us understand market behavior"
          ],
          encouragement: "You're learning like a family office! Keep exploring different investments and building your knowledge. 🚀"
        };
        setAiCoachAdvice(fallbackAdvice);
      } finally {
        setLoadingAiAdvice(false);
        markRequestCompleted(cacheKey); // Mark as completed globally
      }
    };

    fetchAiCoachAdvice();
  }, [cacheKey]); // Only depend on cacheKey changes

  // Generate simplified teaching dialogue function (3 steps instead of 7)
  const generateDialogue = () => {
    const newMessages: TeachingMessage[] = [];
    const useAiAdvice = aiCoachAdvice && !loadingAiAdvice;

    // Only generate dialogue if we have AI advice
    if (!useAiAdvice) {
      return;
    }

    // Get coach-specific greeting
    const coachEmoji = fullCoach?.speechStyle?.emoji || "🎯";
    const profitReaction = fullCoach 
      ? getCoachResponse(fullCoach, "profit").split("!")[0] + "!"
      : "Nice work!";
    const lossReaction = fullCoach
      ? getCoachResponse(fullCoach, "loss").split(".")[0] + "."
      : "Let's analyze this.";

    // Step 1: Portfolio Performance (Annual) - Combined greeting + chart
    newMessages.push({
      id: "portfolio_performance",
      type: "greeting",
      content: `${coachEmoji} ${performance === "profit" ? profitReaction : lossReaction} Ask ${coach.name} about your ${selectedOption.name} results!`,
      showContinue: true,
      showMetrics: true,
      showChart: true,
      showReturnsChart: false,
      showAnalysis: false,
      metricButtons: [
        {
          key: "final_value",
          label: "Final Value",
          icon: <DollarSign className="h-4 w-4" />,
          targetMetric: "final_value"
        },
        {
          key: "total_return",
          label: "Total Return", 
          icon: <TrendingUp className="h-4 w-4" />,
          targetMetric: "total_return"
        },
        {
          key: "volatility",
          label: "Volatility",
          icon: <BarChart3 className="h-4 w-4" />,
          targetMetric: "volatility"
        },
        {
          key: "sharpe_ratio",
          label: "Sharpe Ratio",
          icon: <Target className="h-4 w-4" />,
          targetMetric: "sharpe_ratio"
        },
        {
          key: "portfolio_chart",
          label: "Portfolio Chart",
          icon: <Shield className="h-4 w-4" />,
          targetMetric: "portfolio_performance"
        }
      ]
    });

    // Step 2: Annual Returns Analysis
    newMessages.push({
      id: "annual_returns", 
      type: "lesson",
      content: `**Annual Returns Analysis** 📈\n\n${aiCoachAdvice.risk_assessment.includes('high') ? 'Notice the volatility!' : 'See the patterns?'} Let ${coach.name} break it down for you.`,
      showContinue: true,
      showMetrics: true,
      showChart: false,
      showReturnsChart: true,
      showAnalysis: false,
      metricButtons: [
        {
          key: "final_value",
          label: "Final Value",
          icon: <DollarSign className="h-4 w-4" />,
          targetMetric: "final_value"
        },
        {
          key: "total_return",
          label: "Total Return", 
          icon: <TrendingUp className="h-4 w-4" />,
          targetMetric: "total_return"
        },
        {
          key: "volatility",
          label: "Volatility",
          icon: <BarChart3 className="h-4 w-4" />,
          targetMetric: "volatility"
        },
        {
          key: "sharpe_ratio",
          label: "Sharpe Ratio",
          icon: <Target className="h-4 w-4" />,
          targetMetric: "sharpe_ratio"
        },
        {
          key: "portfolio_chart",
          label: "Portfolio Chart",
          icon: <Shield className="h-4 w-4" />,
          targetMetric: "portfolio_performance"
        }
      ]
    });

    // Step 3: Risk Analysis
    newMessages.push({
      id: "risk_analysis",
      type: "lesson", 
      content: `**Risk Analysis** ⚖️\n\nUnderstanding risk helps you make smarter choices! Let ${coach.name} help you analyze.`,
      showContinue: true,
      showMetrics: true,
      showChart: false,
      showReturnsChart: false,
      showAnalysis: true,
      metricButtons: [
        {
          key: "final_value",
          label: "Final Value",
          icon: <DollarSign className="h-4 w-4" />,
          targetMetric: "final_value"
        },
        {
          key: "total_return",
          label: "Total Return", 
          icon: <TrendingUp className="h-4 w-4" />,
          targetMetric: "total_return"
        },
        {
          key: "volatility",
          label: "Volatility",
          icon: <BarChart3 className="h-4 w-4" />,
          targetMetric: "volatility"
        },
        {
          key: "sharpe_ratio",
          label: "Sharpe Ratio",
          icon: <Target className="h-4 w-4" />,
          targetMetric: "sharpe_ratio"
        },
        {
          key: "portfolio_chart",
          label: "Portfolio Chart",
          icon: <Shield className="h-4 w-4" />,
          targetMetric: "portfolio_performance"
        }
      ]
    });

    // Step 4: Summary and Completion with detailed recommendations
    const fallbackRecommendations = [
      "Rebalance your portfolio regularly",
      "Consider adding more growth assets if your risk tolerance allows", 
      "Learn about market cycles and economic indicators"
    ];
    
    const fallbackNextSteps = [
      "Try the portfolio optimization feature",
      "Experiment with different rebalancing strategies"
    ];
    
    const fallbackEncouragement = "You're becoming a confident investor! Keep exploring and learning. Ready for your next challenge?";
    
    const recommendations = aiCoachAdvice.recommendations && aiCoachAdvice.recommendations.length > 0 
      ? aiCoachAdvice.recommendations.slice(0, 3) 
      : fallbackRecommendations;
      
    const _nextSteps = aiCoachAdvice.next_steps && aiCoachAdvice.next_steps.length > 0
      ? aiCoachAdvice.next_steps.slice(0, 2)
      : fallbackNextSteps;
    void _nextSteps; // Available for future enhancements
      
    const encouragement = aiCoachAdvice.encouragement || fallbackEncouragement;
    
    // Generate intelligent summary based on mission results - NOW WITH COACH PERSONALITY
    const generateIntelligentSummary = (): string => {
      const actualFinalValue = realMetrics ? realMetrics.final_value : finalAmount;
      const actualTotalReturn = realMetrics ? realMetrics.total_return : actualReturn;
      
      // Coach-specific mission context
      const getCoachMissionContext = () => {
        if (!fullCoach) {
          // Default context
          if (event.title.toLowerCase().includes("bubble")) {
            return actualTotalReturn > 0 ? 
              "You successfully navigated the market bubble by staying disciplined during volatile times." :
              "Market bubbles are challenging - this experience teaches valuable lessons about market psychology.";
          } else if (event.title.toLowerCase().includes("crisis")) {
            return actualTotalReturn > 0 ?
              "Impressive! You found opportunity during the crisis when others were paralyzed by fear." :
              "Financial crises test every investor - your experience builds resilience for future challenges.";
          }
          return actualTotalReturn > 0 ?
            "Your investment approach worked well for this market environment." :
            "This challenging period provided valuable learning about market dynamics.";
        }
        
        // Coach-specific context
        switch (fullCoach.id) {
          case "steady-sam":
            if (event.title.toLowerCase().includes("bubble") || event.title.toLowerCase().includes("crisis")) {
              return actualTotalReturn > 0 ?
                "Your defensive approach protected capital while capturing gains. This is exactly how wealth is preserved across generations!" :
                "The market was brutal, but our conservative stance limited the damage. Remember: it takes 100% gain to recover a 50% loss. Protection first!";
            }
            return actualTotalReturn > 0 ?
              "Steady, consistent growth - exactly how the wealthiest families build and preserve their fortunes." :
              "A setback, but our diversified approach means you're still in the game. That's the most important thing.";
            
          case "growth-guru":
            if (event.title.toLowerCase().includes("bubble") || event.title.toLowerCase().includes("crisis")) {
              return actualTotalReturn > 0 ?
                "Your balanced allocation worked perfectly! When some assets fell, others held strong. This is the power of true diversification." :
                "Market turmoil tested our allocation, but the portfolio structure absorbed the shock. Time to rebalance and move forward.";
            }
            return actualTotalReturn > 0 ?
              "The architecture of your portfolio delivered. Different assets working together in harmony - beautiful!" :
              "The portfolio behaved as designed. Some assets down, some up. This is why we diversify.";
            
          case "adventure-alex":
            if (event.title.toLowerCase().includes("bubble") || event.title.toLowerCase().includes("crisis")) {
              return actualTotalReturn > 0 ?
                "BOOM! 🚀 While others panicked, you saw opportunity! This is how fortunes are made during market chaos!" :
                "Volatility is the price of admission to the moon! 🌙 Every great investor has down periods. The key is staying in the game!";
            }
            return actualTotalReturn > 0 ?
              "You took the shot and it PAID OFF! This is what happens when you believe in the future! 🔥" :
              "Not every rocket reaches the moon on the first try. But fortune favors those who keep launching!";
            
          case "yield-yoda":
            if (event.title.toLowerCase().includes("bubble") || event.title.toLowerCase().includes("crisis")) {
              return actualTotalReturn > 0 ?
                "Through market turmoil, patience rewarded you. Remember: Buffett made 99% of his wealth after age 50. Time is your ally." :
                "Paper losses come and go. The compound interest continues its work in silence. Stay the course, young investor.";
            }
            return actualTotalReturn > 0 ?
              "The eighth wonder of the world works in your favor. Compound interest is patient, and so are you." :
              "A temporary setback in a lifetime of compounding. The journey of a thousand miles continues.";
            
          default:
            return actualTotalReturn > 0 ?
              "Your investment approach worked well for this market environment." :
              "This challenging period provided valuable learning about market dynamics.";
        }
      };
      
      const missionContext = getCoachMissionContext();
      const coachEmoji = fullCoach?.speechStyle?.emoji || "🎯";
      const catchphrase = fullCoach ? getCoachCatchphrase(fullCoach) : "Keep learning and growing";
      
      return `${coachEmoji} **Mission Summary: ${event.title}**\n\nYour ${selectedOption.name} investment achieved a **${actualTotalReturn.toFixed(2)}%** return, ending at **$${Math.round(actualFinalValue).toLocaleString()}**.\n\n${missionContext}\n\n**🎓 ${coach.name}'s Recommendations:**\n${recommendations.slice(0, 3).map(rec => `• ${rec}`).join('\n')}\n\n**💬 "${catchphrase}"**\n\n**💪 ${encouragement}**`;
    };
    
    const intelligentSummary = generateIntelligentSummary();
    
    newMessages.push({
      id: "summary_completion",
      type: "completion",
      content: intelligentSummary,
      showComplete: true,
      showMetrics: false,
      showChart: false,
      showReturnsChart: false,
      showAnalysis: false,
      // No metricButtons - this step should not have interactive buttons
    });

    setMessages(newMessages);
    hasGeneratedDialogue.current = true; // Mark dialogue as generated
    setDialogueGeneratedWithAi(true); // Mark that dialogue was generated with AI advice
  };

  // Generate simplified teaching dialogue
  useEffect(() => {
    // Wait for AI advice to be fetched before generating dialogue
    if (loadingAiAdvice) {
      return; // Don't generate dialogue while loading
    }

    // Only generate dialogue if we have AI advice and haven't generated it yet
    if (aiCoachAdvice && !hasGeneratedDialogue.current) {
      generateDialogue();
    } else if (
      aiCoachAdvice &&
      hasGeneratedDialogue.current &&
      !dialogueGeneratedWithAi
    ) {
      // Regenerate dialogue with AI advice if it wasn't generated with it before
      hasGeneratedDialogue.current = false;
      generateDialogue();
    } else if (
      aiCoachAdvice &&
      hasGeneratedDialogue.current &&
      dialogueGeneratedWithAi
    ) {
      // AI advice available and dialogue already generated with AI advice
    } else {
      // Waiting for AI advice
    }
  }, [
    // Only depend on loadingAiAdvice and aiCoachAdvice
    loadingAiAdvice,
    aiCoachAdvice,
  ]);

  // Track component mount
  useEffect(() => {
    // Clean up old cache entries
    const now = Date.now();
    for (const [key, value] of aiAdviceCache.entries()) {
      if (now - value.timestamp > CACHE_DURATION) {
        aiAdviceCache.delete(key);
      }
    }

    return () => {
      // Component unmounting
    };
  }, []);

  // ============================================================================
  // TYPING ANIMATION
  // ============================================================================

  // Typing effect
  useEffect(() => {
    if (messages.length === 0) return;

    const currentMessage = messages[currentMessageIndex];
    if (!currentMessage) return;

    setIsTyping(true);
    setShowContinue(false);
    setDisplayedText("");

    let currentIndex = 0;
    const text = currentMessage.content;

    const typeNextChar = () => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
        setTimeout(typeNextChar, TYPING_SPEED);
      } else {
        setIsTyping(false);
        setShowContinue(true);
      }
    };

    typeNextChar();
  }, [currentMessageIndex, messages]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleContinue = () => {
    if (currentMessageIndex < messages.length - 1) {
      setCurrentMessageIndex(currentMessageIndex + 1);
      // Clear button selection state when moving to next step
      setSelectedMetric(null);
      setMetricExplanation("");
      setCoachTypingText("");
      setIsCoachTyping(false);
      // Clear chart highlighting as well
      setHoveredMetric(null);
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  const handleBack = () => {
    if (currentMessageIndex > 0) {
      setCurrentMessageIndex(currentMessageIndex - 1);
      // Clear current selection when going back
      setSelectedMetric(null);
      setMetricExplanation("");
      setCoachTypingText("");
      setIsCoachTyping(false);
      // Clear chart highlighting as well
      setHoveredMetric(null);
    }
  };

  const handleMetricClick = async (metricKey: string, targetMetric: string) => {
    // Toggle selection
    const isAlreadySelected = selectedMetric === metricKey;
    setSelectedMetric(isAlreadySelected ? null : metricKey);
    
    if (!isAlreadySelected) {
      // Determine if this is a shared button (first 4) or step-specific button (5th)
      const isSharedButton = ["final_value", "total_return", "volatility", "sharpe_ratio"].includes(metricKey);
      const isStepSpecificButton = metricKey === "portfolio_chart";
      
      // Generate step-specific key for step buttons
      const stepSpecificKey = isStepSpecificButton ? `${metricKey}_${currentMessage.id}` : metricKey;
      
      // Check if first view based on button type
      const isFirstView = isSharedButton 
        ? !viewedSharedButtons.has(metricKey)
        : !viewedStepButtons.has(stepSpecificKey);
      
      if (isFirstView) {
        setSessionXp(prev => prev + 5);
        setShowXpAnimation(true);
        
        // Update appropriate viewed set
        if (isSharedButton) {
          setViewedSharedButtons(prev => new Set([...prev, metricKey]));
        } else {
          setViewedStepButtons(prev => new Set([...prev, stepSpecificKey]));
        }
        
        // Call XP callback if provided
        if (onXpEarned) {
          onXpEarned(5);
        }
        
        // Reset XP animation after delay
        setTimeout(() => setShowXpAnimation(false), 1500);
      }
      
      // Generate AI explanation for the selected metric
      const explanation = await generateMetricExplanation(metricKey, targetMetric);
      
      // Start typing effect for coach response
      setIsCoachTyping(true);
      setCoachTypingText("");
      typeCoachMessage(explanation);
    } else {
      setMetricExplanation("");
      setCoachTypingText("");
      setIsCoachTyping(false);
    }
  };

  // Coach typing effect
  const typeCoachMessage = (message: string) => {
    let currentIndex = 0;
    setCoachTypingText("");
    
    const typeNextChar = () => {
      if (currentIndex < message.length) {
        setCoachTypingText(message.slice(0, currentIndex + 1));
        currentIndex++;
        setTimeout(typeNextChar, 20); // Faster typing for coach
      } else {
        setIsCoachTyping(false);
        setMetricExplanation(message); // Set final message
      }
    };
    
    typeNextChar();
  };

  const handleMetricHover = (metricKey: string | null) => {
    setHoveredMetric(metricKey);
  };

  // Helper function to clean advice text - remove titles and format properly
  const _cleanAdviceText = (text: string | undefined): string => {
    if (!text) return "";
    // Remove common title prefixes and clean up the text
    return text
      .replace(/^(Key Recommendations?|Next Steps?|My Key Recommendations?|🎓 My Key Recommendations?|🚀 Next Steps?):\s*/i, "")
      .replace(/^[•\-*]\s*/, "") // Remove bullet points
      .trim();
  };
  void _cleanAdviceText; // Available for future enhancements

  // Get the full coach object for personality-driven responses
  const fullCoach: AICoach | undefined = coach.id ? aiCoaches.find(c => c.id === coach.id) : undefined;
  
  // Get coach-specific emoji and catchphrase
  const getCoachEmoji = () => fullCoach?.speechStyle?.emoji || "🎯";
  const getPersonalizedEncouragement = () => {
    if (fullCoach) {
      return getCoachEncouragement(fullCoach);
    }
    return aiCoachAdvice?.encouragement || "Great job on this investment!";
  };
  
  // Check if decision aligned with coach's preferences
  const _isAlignedDecision = fullCoach ? isCoachAlignedDecision(fullCoach, selectedOption.name) : false;
  void _isAlignedDecision; // Available for future enhancements

  // Generate AI explanation based on metric and current data - NOW WITH COACH PERSONALITY
  const generateMetricExplanation = async (metricKey: string, _targetMetric: string): Promise<string> => {
    void _targetMetric; // Available for future enhancements
    if (!aiCoachAdvice) return "Loading explanation...";
    
    // Use actual data from props and realMetrics
    const actualFinalValue = realMetrics ? realMetrics.final_value : finalAmount;
    const actualTotalReturn = realMetrics ? realMetrics.total_return : actualReturn;
    const actualVolatility = realMetrics ? realMetrics.volatility : 16.26;
    const actualSharpe = realMetrics ? realMetrics.sharpe_ratio : 0.1;
    
    // Get coach-specific intro based on their personality
    const getCoachIntro = () => {
      if (!fullCoach) return "";
      switch (fullCoach.id) {
        case "steady-sam":
          return actualTotalReturn > 0 
            ? "Good news, and more importantly - you stayed safe! " 
            : "Here's the reality, but remember - preservation is key. ";
        case "growth-guru":
          return actualTotalReturn > 0 
            ? "Let's look at the architecture of this return. " 
            : "The portfolio structure absorbed this. Here's why: ";
        case "adventure-alex":
          return actualTotalReturn > 0 
            ? "YESSS! Look at these numbers! 🔥 " 
            : "Volatility is the price of admission! Here's the deal: ";
        case "yield-yoda":
          return actualTotalReturn > 0 
            ? "Patience rewarded. Observe: " 
            : "Markets fluctuate, wisdom endures. Consider: ";
        default:
          return "";
      }
    };
    
    // Get coach-specific conclusion
    const getCoachConclusion = () => {
      if (!fullCoach) return "";
      const catchphrase = getCoachCatchphrase(fullCoach);
      return ` Remember: "${catchphrase}" ${getCoachEmoji()}`;
    };
    
    switch (metricKey) {
      case "final_value":
        return `${getCoachIntro()}Your final investment value is $${Math.round(actualFinalValue).toLocaleString()}. ${actualTotalReturn > 0 ? 
          `${getCoachEmoji()} Your investment grew by ${actualTotalReturn.toFixed(2)}%! ${getPersonalizedEncouragement()}` : 
          `Though your investment declined by ${Math.abs(actualTotalReturn).toFixed(2)}%, ${fullCoach ? getCoachResponse(fullCoach, "loss") : "this is valuable learning experience."}`}${getCoachConclusion()}`;
        
      case "total_return": {
        const returnAssessment = fullCoach?.id === "adventure-alex" 
          ? (actualTotalReturn > 20 ? "Now THAT'S what I call a moonshot! 🚀" : actualTotalReturn > 0 ? "Decent gains! But we can go bigger!" : "Temporary setback. The trend is our friend!")
          : fullCoach?.id === "steady-sam"
          ? (actualTotalReturn > 0 ? "Solid, steady growth. Just how we like it." : "The defensive position limited our exposure. Smart.")
          : fullCoach?.id === "yield-yoda"
          ? (actualTotalReturn > 0 ? "The compound interest force is strong." : "Paper losses. The income stream continues.")
          : `${Math.abs(actualTotalReturn) > 20 ? "significant" : "moderate"} ${actualTotalReturn > 0 ? "gain" : "loss"}`;
        
        return `${getCoachIntro()}Your total return is ${actualTotalReturn.toFixed(2)}%. ${returnAssessment} ${aiCoachAdvice.risk_assessment || "Market conditions played a role."}${getCoachConclusion()}`;
      }
        
      case "volatility": {
        const volatilityView = fullCoach?.id === "adventure-alex"
          ? (actualVolatility > 20 ? "High volatility = high opportunity! This is where fortunes are made!" : "Pretty calm waters... might want more excitement!")
          : fullCoach?.id === "steady-sam"
          ? (actualVolatility > 20 ? "This volatility is concerning. We prefer smoother rides." : "Nice and stable. Just how I like it!")
          : fullCoach?.id === "growth-guru"
          ? "Volatility teaches us about asset behavior. This data is valuable for future allocation."
          : "Volatility reflects the investment's price swings.";
          
        return `${getCoachIntro()}Volatility is ${actualVolatility.toFixed(2)}%. ${volatilityView}${getCoachConclusion()}`;
      }
        
      case "sharpe_ratio": {
        const sharpeView = fullCoach?.id === "yield-yoda"
          ? (actualSharpe > 1 ? "Excellent risk-adjusted returns. The compound way rewards patience." : "The journey matters more than the destination. Time will improve this.")
          : fullCoach?.id === "steady-sam"
          ? (actualSharpe > 1 ? "Great risk-adjusted performance! This is the way." : actualSharpe > 0 ? "Acceptable risk-return trade-off." : "We need to improve our risk management here.")
          : `${actualSharpe > 1 ? "Excellent risk-adjusted performance!" : actualSharpe > 0 ? "Reasonable risk-return balance." : "The return may not have justified the risk."}`;
        
        return `${getCoachIntro()}Sharpe ratio is ${actualSharpe.toFixed(2)}, measuring risk-adjusted returns. ${sharpeView}${getCoachConclusion()}`;
      }
        
      case "portfolio_chart": {
        let chartExplanation = getCoachIntro();
        if (currentMessage.id === "portfolio_performance") {
          chartExplanation += `This chart shows how your $100,000 investment in ${selectedOption.name} performed over time, ending at $${Math.round(actualFinalValue).toLocaleString()}. `;
        } else if (currentMessage.id === "annual_returns") {
          chartExplanation += `This annual returns chart reveals the year-by-year performance patterns of your ${selectedOption.name} investment during ${event.title}. `;
        } else if (currentMessage.id === "risk_analysis") {
          chartExplanation += `The risk analysis shows your investment's volatility (${actualVolatility.toFixed(1)}%) and maximum drawdown, helping you understand the ups and downs you experienced. `;
        }
        
        // Coach-specific chart interpretation
        const chartView = fullCoach?.id === "adventure-alex"
          ? (actualTotalReturn > 0 ? "See those dips? Those were buying opportunities! The trend was UP!" : "Look at the volatility - that's where the next opportunity hides!")
          : fullCoach?.id === "steady-sam"
          ? (actualTotalReturn > 0 ? "Notice the steady climb. Consistency beats chaos." : "The defensive allocation limited the damage. That's the plan working.")
          : fullCoach?.id === "growth-guru"
          ? "Notice how different assets behave differently? That's why diversification matters."
          : "Time in the market beats timing the market.";
        
        return chartExplanation + chartView + getCoachConclusion();
      }
        
      default:
        return `${getCoachEmoji()} ${aiCoachAdvice.advice || "Let me know if you have any questions about your investment performance!"}${getCoachConclusion()}`;
    }
  };

  // Get metric value helper - available for future enhancements
  const _getMetricValue = (targetMetric: string) => {
    switch (targetMetric) {
      case "final_value": return realMetrics ? realMetrics.final_value : finalAmount;
      case "total_return": return realMetrics ? realMetrics.total_return : actualReturn;
      case "volatility": return realMetrics ? realMetrics.volatility : 16.26;
      case "sharpe_ratio": return realMetrics ? realMetrics.sharpe_ratio : 0.1;
      default: return 0;
    }
  };
  void _getMetricValue;

  // ============================================================================
  // RENDER HELPERS - Available for future enhancements
  // ============================================================================

  const _renderMetricsCard = (
    icon: React.ReactNode,
    label: string,
    value: string | number,
    colorClass?: string
  ) => (
    <Card className="text-center p-4">
      <div className="flex flex-col items-center gap-2">
        {icon}
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className={`text-xl font-bold ${colorClass || ""}`}>
            {loadingMetrics ? "Loading..." : value}
          </p>
        </div>
      </div>
    </Card>
  );
  void _renderMetricsCard;

  const _renderMarkdownComponents = {
    p: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement> & { children?: React.ReactNode }) => <span {...props}>{children}</span>,
    strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) => (
      <strong className="font-bold text-blue-800" {...props}>
        {children}
      </strong>
    ),
    ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement> & { children?: React.ReactNode }) => (
      <ul className="list-disc list-inside space-y-1 mt-2" {...props}>
        {children}
      </ul>
    ),
    li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement> & { children?: React.ReactNode }) => (
      <li className="text-gray-700" {...props}>
        {children}
      </li>
    ),
  };
  void _renderMarkdownComponents;

  // ============================================================================
  // RENDER
  // ============================================================================

  // Show loading state while fetching AI advice
  if (loadingAiAdvice && messages.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        {/* Coach Header */}
        <div className="flex items-center gap-3 mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="relative w-20 h-20 shrink-0">
            {/* Simple glow effect based on performance */}
            <div
              className={`absolute -inset-1 rounded-full ${
                performance === "profit"
                  ? "bg-green-400/20"
                  : "bg-orange-400/20"
              } animate-pulse`}
            ></div>
            <Image
              src={coach.animatedAvatar}
              alt={coach.name}
              fill
              sizes="80px"
              className="rounded-full object-cover border-2 border-white shadow-lg relative z-10"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">{coach.name}</h3>
              <Badge variant="secondary" className={coach.color}>
                {coach.personality}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{coach.description}</p>
          </div>
        </div>

        {/* Loading State */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="text-gray-700">
              <p className="font-medium text-lg">
                Getting personalized advice from {coach.name}...
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Analyzing your investment decision and preparing insights
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentMessage = messages[currentMessageIndex];
  if (!currentMessage) return null;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
      {/* Coach Header - Enhanced with personality & light mode optimized */}
      {(() => {
        // Get coach-specific colors - Light mode optimized
        const coachColors = fullCoach?.id === "steady-sam" 
          ? { 
              gradient: "from-blue-50 via-cyan-50 to-blue-50 dark:from-blue-500/20 dark:via-cyan-500/15 dark:to-blue-500/20", 
              glow: "bg-blue-400/40 dark:bg-blue-400/30", 
              border: "border-blue-200 dark:border-blue-500/40",
              accent: "text-blue-700 dark:text-blue-300",
              badge: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
            }
          : fullCoach?.id === "growth-guru"
          ? { 
              gradient: "from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-500/20 dark:via-teal-500/15 dark:to-emerald-500/20", 
              glow: "bg-emerald-400/40 dark:bg-emerald-400/30", 
              border: "border-emerald-200 dark:border-emerald-500/40",
              accent: "text-emerald-700 dark:text-emerald-300",
              badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
            }
          : fullCoach?.id === "adventure-alex"
          ? { 
              gradient: "from-purple-50 via-violet-50 to-purple-50 dark:from-purple-500/20 dark:via-violet-500/15 dark:to-purple-500/20", 
              glow: "bg-purple-400/40 dark:bg-purple-400/30", 
              border: "border-purple-200 dark:border-purple-500/40",
              accent: "text-purple-700 dark:text-purple-300",
              badge: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300"
            }
          : fullCoach?.id === "yield-yoda"
          ? { 
              gradient: "from-amber-50 via-yellow-50 to-amber-50 dark:from-amber-500/20 dark:via-yellow-500/15 dark:to-amber-500/20", 
              glow: "bg-amber-400/40 dark:bg-amber-400/30", 
              border: "border-amber-200 dark:border-amber-500/40",
              accent: "text-amber-700 dark:text-amber-300",
              badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
            }
          : { 
              gradient: "from-violet-50 via-purple-50 to-violet-50 dark:from-violet-500/20 dark:via-purple-500/15 dark:to-violet-500/20", 
              glow: "bg-violet-400/40 dark:bg-violet-400/30", 
              border: "border-violet-200 dark:border-violet-500/40",
              accent: "text-violet-700 dark:text-violet-300",
              badge: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300"
            };
        
        return (
          <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 p-4 bg-gradient-to-br ${coachColors.gradient} rounded-xl border-2 ${coachColors.border} shadow-sm`}>
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0">
              {/* Coach-specific glow effect */}
              <div className={`absolute -inset-1 rounded-full ${coachColors.glow} blur-sm ${isCoachTyping ? 'animate-pulse' : ''}`}></div>
              {/* Performance indicator ring */}
              <div className={`absolute -inset-2 rounded-full ${performance === "profit" ? "bg-emerald-400/20 dark:bg-emerald-400/10" : "bg-orange-400/20 dark:bg-orange-400/10"} ${isCoachTyping ? 'animate-ping' : ''}`} style={{ animationDuration: '2s' }}></div>
              <Image
                src={isCoachTyping ? coach.animatedAvatar : coach.avatar}
                alt={coach.name}
                fill
                sizes="80px"
                className={`rounded-full object-cover border-2 ${coachColors.border} shadow-lg relative z-10`}
              />
              {/* Status indicator */}
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${isCoachTyping ? 'bg-emerald-500' : 'bg-slate-400'} border-2 border-white dark:border-slate-900 flex items-center justify-center z-20 shadow-md`}>
                <span className="text-xs">{isCoachTyping ? "💬" : fullCoach?.speechStyle?.emoji || "🎯"}</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <h3 className={`font-bold text-lg ${coachColors.accent}`}>{coach.name}</h3>
                <span className="text-xl">{fullCoach?.speechStyle?.emoji || "🎯"}</span>
                <Badge className={`${coachColors.badge} border-0 text-xs font-semibold`}>
                  {coach.personality}
                </Badge>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{coach.description}</p>
              {/* Teaching style hint */}
              {fullCoach && (
                <div className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg ${coachColors.badge} text-xs font-medium`}>
                  <span>💡</span>
                  <span>Teaching style: {fullCoach.teachingStyle?.approach || "balanced"}</span>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Coach Interaction Panel - Always Visible - Light Mode Optimized */}
      <div className="mb-4 relative">
        <div className="bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm relative">
          {/* Chat bubble pointer pointing to coach header */}
          <div className="absolute -top-2 left-16 sm:left-20 w-4 h-4 bg-slate-50 dark:bg-slate-800/50 border-l-2 border-t-2 border-slate-200 dark:border-slate-700 transform rotate-45"></div>
          
          {/* Coach response area */}
          {selectedMetric && (isCoachTyping || metricExplanation) ? (
            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              {isCoachTyping ? (
                <>
                  {coachTypingText}
                  <span className="inline-block w-2 h-4 bg-[#9898f2] ml-1 animate-pulse rounded-sm"></span>
                </>
              ) : (
                metricExplanation
              )}
            </div>
          ) : currentMessage.id === "summary_completion" ? (
            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4 prose prose-sm dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: currentMessage.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>') }} />
            </div>
          ) : (
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-4 p-3 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-base mr-1">💡</span>
              <span className="font-medium text-slate-800 dark:text-white">Ask {coach.name} about your results:</span>
              <span className="text-slate-500 dark:text-slate-400"> Click any button below to get detailed explanations!</span>
            </div>
          )}
          
          {/* Interactive Buttons - Now inside chat bubble */}
          {currentMessage.metricButtons && (
            <div className="relative">
              {/* XP Animation - Absolute positioned for stability */}
              {showXpAnimation && (
                <div className="absolute -top-2 right-0 z-10">
                  <div className="text-yellow-600 font-bold text-lg animate-bounce-slide-up">
                    +5 🪙
                  </div>
                  {/* Sparkle effects */}
                  <div className="absolute -inset-4 pointer-events-none">
                    <div className="absolute top-0 left-0 w-2 h-2 text-yellow-400 animate-sparkle-1">✨</div>
                    <div className="absolute top-1 right-0 w-2 h-2 text-yellow-300 animate-sparkle-2">⭐</div>
                    <div className="absolute -top-1 left-3 w-2 h-2 text-amber-400 animate-sparkle-3">✦</div>
                    <div className="absolute bottom-0 left-1 w-2 h-2 text-yellow-500 animate-sparkle-4">✨</div>
                    <div className="absolute bottom-1 right-2 w-2 h-2 text-amber-300 animate-sparkle-5">⭐</div>
                  </div>
                </div>
              )}
              
              {/* Metric buttons - first row (4 buttons) - Mobile optimized */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-3">
                {currentMessage.metricButtons.slice(0, 4).map((button) => {
                  const isViewed = viewedSharedButtons.has(button.key);
                  return (
                    <button
                      key={button.key}
                      className={`relative px-3 py-2.5 min-h-[48px] sm:min-h-[45px] rounded-xl border-2 transition-all duration-200 touch-manipulation active:scale-[0.97] ${
                        hoveredMetric === button.key ? "shadow-md scale-[1.02]" : ""
                      } ${
                        selectedMetric === button.key
                          ? "bg-gradient-to-r from-[#9898f2] to-violet-500 text-white border-[#9898f2] shadow-lg shadow-[#9898f2]/30"
                          : isViewed
                          ? "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-500/20 dark:to-teal-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-[#9898f2]/50 hover:bg-slate-50 dark:hover:bg-slate-700"
                      } ${isCoachTyping ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() => !isCoachTyping && handleMetricClick(button.key, button.targetMetric)}
                      onMouseEnter={() => !isCoachTyping && handleMetricHover(button.key)}
                      onMouseLeave={() => !isCoachTyping && handleMetricHover(null)}
                      disabled={isCoachTyping}
                    >
                      <div className="flex items-center gap-1.5 justify-center">
                        {React.cloneElement(button.icon, {
                          className: `h-4 w-4 sm:h-3.5 sm:w-3.5 ${
                            selectedMetric === button.key
                              ? "text-white"
                              : isViewed
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-slate-500 dark:text-slate-400"
                          }`,
                        })}
                        <span className="text-xs sm:text-[11px] font-semibold">{button.label}</span>
                        {isViewed && <span className="text-emerald-500 text-xs">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {/* Chart-specific button - second row - Full width on mobile */}
              {currentMessage.metricButtons.length > 4 && (
                <div className="flex justify-center">
                  {(() => {
                    const extraMetricButton = currentMessage.metricButtons[4];
                    const stepSpecificKey = `${extraMetricButton.key}_${currentMessage.id}`;
                    const isViewed = viewedStepButtons.has(stepSpecificKey);
                    return (
                      <button
                        key={extraMetricButton.key}
                        className={`w-full sm:w-auto relative px-4 py-2.5 min-h-[48px] sm:min-h-[45px] rounded-xl border-2 transition-all duration-200 touch-manipulation active:scale-[0.97] ${
                          hoveredMetric === extraMetricButton.key ? "shadow-md scale-[1.02]" : ""
                        } ${
                          selectedMetric === extraMetricButton.key
                            ? "bg-gradient-to-r from-[#9898f2] to-violet-500 text-white border-[#9898f2] shadow-lg shadow-[#9898f2]/30"
                            : isViewed
                            ? "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-500/20 dark:to-teal-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40"
                            : "bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-500/15 dark:to-purple-500/10 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-500/40 hover:border-violet-300 dark:hover:border-violet-500/60"
                        } ${isCoachTyping ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() => !isCoachTyping && handleMetricClick(extraMetricButton.key, extraMetricButton.targetMetric)}
                        onMouseEnter={() => !isCoachTyping && handleMetricHover(extraMetricButton.key)}
                        onMouseLeave={() => !isCoachTyping && handleMetricHover(null)}
                        disabled={isCoachTyping}
                      >
                        <div className="flex items-center gap-2 justify-center">
                          {React.cloneElement(extraMetricButton.icon, {
                            className: `h-4 w-4 sm:h-3.5 sm:w-3.5 ${
                              selectedMetric === extraMetricButton.key
                                ? "text-white"
                                : isViewed
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-violet-600 dark:text-violet-400"
                            }`,
                          })}
                          <span className="text-xs sm:text-[11px] font-semibold">
                            {currentMessage.id === "portfolio_performance" && "Portfolio Performance (Annual)"}
                            {currentMessage.id === "annual_returns" && "Annual Returns Chart"}
                            {currentMessage.id === "risk_analysis" && "Risk Analysis Chart"}
                          </span>
                          {isViewed && <span className="text-emerald-500 text-xs">✓</span>}
                        </div>
                      </button>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>


      {/* Key Metrics Display - REMOVED, now handled by PerformanceChart */}
      {/* Performance Chart - Show progressively */}
      {(currentMessage.showChart ||
        currentMessage.showReturnsChart ||
        currentMessage.showAnalysis) && (
        <div className="mb-6">
          <h4 className="font-semibold text-lg mb-4 text-gray-800">
            Portfolio Performance Over Time
          </h4>
          <Card className="p-4">
            <PerformanceChart
              data={
                realMetrics?.chart_data?.map((item) => ({
                  date: item.date,
                  value: item.portfolio_value,
                })) ||
                simulationResult?.performance_chart?.dates?.map(
                  (date: string, index: number) => ({
                    date: date,
                    value: simulationResult?.performance_chart?.values[index] ?? 0,
                  })
                ) ||
                []
              }
              initialValue={100000}
              finalValue={realMetrics?.final_value || finalAmount}
              totalReturn={realMetrics?.total_return || actualReturn}
              volatility={realMetrics ? realMetrics.volatility / 100 : 0.1626}
              sharpeRatio={realMetrics ? realMetrics.sharpe_ratio : 0.1}
              maxDrawdown={
                realMetrics ? realMetrics.max_drawdown / 100 : -0.1956
              }
              showMetrics={currentMessage.showMetrics} // Now show metrics here
              showPortfolioChart={currentMessage.showChart}
              showReturnsChart={currentMessage.showReturnsChart}
              showRiskAnalysis={currentMessage.showAnalysis}
              highlightedMetric={hoveredMetric} // Pass hover state for highlighting
            />
          </Card>
        </div>
      )}

      {/* Risk Analysis - REMOVED to avoid duplication with PerformanceChart */}
      {/* Action Buttons - Always stacked full width for mobile-first cards */}
      <div className="flex flex-col gap-3">
        {/* Continue/Complete Buttons */}
        {currentMessage.showComplete ? (
          <Button
            onClick={handleComplete}
            className="w-full min-h-[48px] flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
            disabled={isCoachTyping}
          >
            <Trophy className="h-4 w-4" />
            Complete Mission
          </Button>
        ) : (
          <Button
            onClick={handleContinue}
            className="w-full min-h-[48px] flex items-center justify-center gap-2 bg-gradient-to-r from-[#9898f2] to-[#7070c0] hover:from-[#8585e0] hover:to-[#6060b0] text-white"
            disabled={isCoachTyping || !showContinue}
          >
            Continue
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
        
        {/* Back Button - only show after step 1 */}
        {currentMessageIndex > 0 && (
          <Button
            onClick={handleBack}
            variant="outline"
            className="w-full min-h-[48px] flex items-center justify-center gap-2"
            disabled={isCoachTyping}
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Back
          </Button>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center mt-6">
        <div className="text-center">
          <div className="flex justify-center gap-2 mb-2">
            {messages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index <= currentMessageIndex ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Step {currentMessageIndex + 1} of {messages.length}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            {currentMessage.id === "portfolio_performance" && "📈 Portfolio Performance"}
            {currentMessage.id === "annual_returns" && "📊 Annual Returns"}
            {currentMessage.id === "risk_analysis" && "⚖️ Risk Analysis"}
            {currentMessage.id === "summary_completion" && "🎉 Mission Summary"}
          </p>
        </div>
      </div>
    </div>
  );
}
