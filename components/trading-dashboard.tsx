/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   MiniFi Trading Dashboard (MVP - Hackathon Edition)                         ║
 * ║   ✨ Vibe-coded by Tick.AI ✨                                                ║
 * ║   Copyright (c) 2025 NUVC.AI. All Rights Reserved. NO COMMERCIAL USE.       ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { api, handleApiError } from "@/lib/api";
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Minus,
  BarChart3,
  Activity,
  Target,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import CoachChat from "@/components/CoachChat/CoachChat";

interface Portfolio {
  [key: string]: {
    shares: number;
    avgPrice: number;
    currentPrice: number;
    dailyChange: number;
  };
}

interface AICoach {
  id: string;
  name: string;
  avatar: string;
  style: string; // e.g. "Conservative Coach" | "Balanced Coach" | "Aggressive Coach" | "Tech Coach"
  gif?: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  message: string;
  timestamp: Date;
}

interface TradingDashboardProps {
  initialPortfolio: Record<string, number>;
  selectedCoach: AICoach;
  onEndCompetition: (data: any) => void;
  startingCapital?: number;
}

// Asset Class Types - aligned with Family Office standards
type AssetClass = "equities" | "fixed_income" | "commodities" | "alternatives" | "cash" | "cryptocurrency";
type TimeHorizon = "short" | "medium" | "long";
type RiskLevel = "low" | "medium" | "high" | "extreme";

// Enhanced market data with FO-aligned asset class information
interface MarketAsset {
  price: number;
  change: number;
  assetClass: AssetClass;
  riskLevel: RiskLevel;
  timeHorizon: TimeHorizon;
  foAllocationRange: string;  // Typical Family Office allocation
  volatility: string;         // Historical volatility range
}

const marketData: Record<string, MarketAsset> = {
  apple: { 
    price: 230.45, 
    change: 2.3,
    assetClass: "equities",
    riskLevel: "medium",
    timeHorizon: "long",
    foAllocationRange: "5-15%",
    volatility: "20-30%"
  },
  microsoft: { 
    price: 506.46, 
    change: 1.8,
    assetClass: "equities",
    riskLevel: "medium",
    timeHorizon: "long",
    foAllocationRange: "5-15%",
    volatility: "18-25%"
  },
  nvidia: { 
    price: 178.1, 
    change: 4.2,
    assetClass: "equities",
    riskLevel: "high",
    timeHorizon: "long",
    foAllocationRange: "3-10%",
    volatility: "35-50%"
  },
  tesla: { 
    price: 346.76, 
    change: -1.5,
    assetClass: "equities",
    riskLevel: "high",
    timeHorizon: "long",
    foAllocationRange: "2-8%",
    volatility: "40-60%"
  },
  sp500: { 
    price: 646.33, 
    change: 1.2,
    assetClass: "equities",
    riskLevel: "medium",
    timeHorizon: "long",
    foAllocationRange: "20-40%",
    volatility: "15-20%"
  },
  etf: { 
    price: 134.18, 
    change: 0.8,
    assetClass: "equities",
    riskLevel: "medium",
    timeHorizon: "long",
    foAllocationRange: "15-30%",
    volatility: "12-18%"
  },
  bitcoin: { 
    price: 43250.0, 
    change: 3.7,
    assetClass: "cryptocurrency",
    riskLevel: "extreme",
    timeHorizon: "long",
    foAllocationRange: "0-5%",
    volatility: "60-100%"
  },
  ethereum: { 
    price: 2680.5, 
    change: 2.1,
    assetClass: "cryptocurrency",
    riskLevel: "extreme",
    timeHorizon: "long",
    foAllocationRange: "0-3%",
    volatility: "70-120%"
  },
};

// Asset class display colors and labels
const assetClassInfo: Record<AssetClass, { label: string; color: string; description: string }> = {
  equities: { 
    label: "📈 Equities", 
    color: "text-blue-600",
    description: "Stocks & shares - ownership in companies"
  },
  fixed_income: { 
    label: "📊 Fixed Income", 
    color: "text-green-600",
    description: "Bonds & treasuries - steady income with lower risk"
  },
  commodities: { 
    label: "🥇 Commodities", 
    color: "text-yellow-600",
    description: "Gold, oil, agriculture - real assets"
  },
  alternatives: { 
    label: "🏢 Alternatives", 
    color: "text-purple-600",
    description: "Real estate, private equity, hedge funds"
  },
  cash: { 
    label: "💵 Cash", 
    color: "text-slate-600",
    description: "Money market & short-term deposits"
  },
  cryptocurrency: { 
    label: "₿ Crypto", 
    color: "text-orange-600",
    description: "Digital assets - high risk/high reward"
  },
};

const investmentNames: Record<string, string> = {
  apple: "Apple Inc.",
  microsoft: "Microsoft Corp.",
  nvidia: "NVIDIA Corp.",
  tesla: "Tesla Inc.",
  sp500: "S&P 500 ETF",
  etf: "Global ETF",
  bitcoin: "Bitcoin",
  ethereum: "Ethereum",
};

export default function TradingDashboard({
  initialPortfolio,
  selectedCoach,
  onEndCompetition,
  startingCapital = 5000,
}: TradingDashboardProps) {
  const [portfolio, setPortfolio] = useState<Portfolio>({});
  const [cash, setCash] = useState(0);
  const [totalValue, setTotalValue] = useState(startingCapital);
  const [dailyReturn, setDailyReturn] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [day, setDay] = useState(1);

  // user input: per-asset trade qty
  const [tradeQty, setTradeQty] = useState<Record<string, number>>({});

  // live prices
  const [prices, setPrices] = useState<Record<string, number>>(
    Object.fromEntries(
      Object.keys(marketData).map((k) => [k, (marketData as any)[k].price])
    )
  );

  type PerfPoint = { time: number; total: number } & Record<string, number>;
  const [performanceData, setPerformanceData] = useState<PerfPoint[]>([
    {
      time: 0,
      total: startingCapital,
      ...Object.fromEntries(
        Object.keys(marketData).map((k) => [k, (marketData as any)[k].price])
      ),
    },
  ]);

  // refs for timer loop
  const hourRef = useRef(0);
  const runningRef = useRef(true);
  const cashRef = useRef(cash);
  const portfolioRef = useRef(portfolio);
  useEffect(() => {
    cashRef.current = cash;
  }, [cash]);
  useEffect(() => {
    portfolioRef.current = portfolio;
  }, [portfolio]);

  // market simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      const nextHour = hourRef.current + 1;
      if (nextHour > 24 || !runningRef.current) {
        runningRef.current = false;
        clearInterval(interval);
        return;
      }
      let nextPrices: Record<string, number> = {};
      setPrices((prev) => {
        const next: Record<string, number> = { ...prev };
        Object.keys(prev).forEach((asset) => {
          const rf = 1 + (Math.random() * 0.1 - 0.05);
          next[asset] = Math.max(0, next[asset] * rf);
        });
        nextPrices = next;
        return next;
      });
      let portfolioValue = 0;
      Object.entries(portfolioRef.current).forEach(([asset, holding]) => {
        const p = nextPrices[asset] ?? (marketData as any)[asset].price;
        portfolioValue += holding.shares * p;
      });
      const newTotal = portfolioValue + cashRef.current;
      setPerformanceData((prev) => [
        ...prev,
        { time: nextHour, total: newTotal, ...nextPrices },
      ]);
      setPortfolio((prev) => {
        const updated: Portfolio = { ...prev };
        Object.keys(updated).forEach((asset) => {
          if (updated[asset]) {
            updated[asset].currentPrice =
              nextPrices[asset] ?? updated[asset].currentPrice;
          }
        });
        return updated;
      });
      hourRef.current = nextHour;
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const hourlyTicks = useMemo(() => {
    if (performanceData.length === 0) return [0];
    const maxHour = performanceData[performanceData.length - 1].time;
    return Array.from({ length: maxHour + 1 }, (_, i) => i);
  }, [performanceData]);

  // init from initialPortfolio
  useEffect(() => {
    const initialCash =
      startingCapital -
      Object.values(initialPortfolio).reduce((sum, val) => sum + val, 0);
    setCash(initialCash);

    const newPortfolio: Portfolio = {};
    Object.entries(initialPortfolio).forEach(([asset, allocation]) => {
      if (allocation > 0) {
        const currentPrice = (marketData as any)[asset].price;
        const shares = allocation / currentPrice;
        newPortfolio[asset] = {
          shares,
          avgPrice: currentPrice,
          currentPrice,
          dailyChange: (marketData as any)[asset].change,
        };
      }
    });
    setPortfolio(newPortfolio);
    setTradeQty(
      Object.fromEntries(Object.keys(newPortfolio).map((k) => [k, 0.1]))
    );

    // initial greeting (from AI backend or local)
    setChatMessages([
      {
        id: "1",
        sender: "ai",
        message: `Hello! I'm ${selectedCoach.name}, your AI coach. Share your plan or make a move and I'll react.`,
        timestamp: new Date(),
      },
    ]);
  }, [initialPortfolio, selectedCoach, startingCapital]);

  // recompute totals
  useEffect(() => {
    const portfolioValue = Object.values(portfolio).reduce(
      (sum, holding) => sum + holding.shares * holding.currentPrice,
      0
    );
    const newTotalValue = portfolioValue + cash;
    setTotalValue(newTotalValue);
    setDailyReturn(((newTotalValue - startingCapital) / startingCapital) * 100);
  }, [portfolio, cash, startingCapital]);

  const getLivePrice = (asset: string) =>
    prices[asset] ?? (marketData as any)[asset].price;

  // ====================
  // Coach API integration
  // ====================
  type CoachAction = {
    type: "buy" | "sell";
    asset: string;
    amount: number;
    price: number;
  };

  function updateChatMessageById(
    id: string,
    updater: (old: ChatMessage) => ChatMessage
  ) {
    setChatMessages((prev) => prev.map((m) => (m.id === id ? updater(m) : m)));
  }

  async function askCoach({
    userMessage,
    action,
    snapshot,
  }: {
    userMessage?: string;
    action?: {
      type: "buy" | "sell";
      asset: string;
      amount: number;
      price: number;
    };
    snapshot?: { portfolio: Portfolio; cash: number };
  }) {
    // 1) Insert placeholder AI message first
    const pendingId = (Date.now() + Math.random()).toString();
    setChatMessages((prev) => [
      ...prev,
      {
        id: pendingId,
        sender: "ai",
        message: "Thinking…",
        timestamp: new Date(),
      },
    ]);

    // Wait for the next frame and give the UI a chance to render
    const nextFrame = () =>
      new Promise<void>((r) => requestAnimationFrame(() => r()));
    await nextFrame();

    try {
      // 2) Request the backend again
      const { reply } = await api.getCoachChat({
        selectedCoach,
        userMessage,
        portfolio: snapshot?.portfolio ?? portfolio,
        cash: snapshot?.cash ?? cash,
        action,
      });

      // 3) Typewriter effect
      function typeIntoMessage(id: string, fullText: string, speedMs = 20) {
        let i = 0;
        const tick = () => {
          i += 2; // Two characters each time
          updateChatMessageById(id, (old) => ({
            ...old,
            message: fullText.slice(0, i),
          }));
          if (i < fullText.length) setTimeout(tick, speedMs);
        };
        tick();
      }

      typeIntoMessage(pendingId, reply ?? "Updated.");
    } catch (error: any) {
      // 4) If there is an error, provide a helpful fallback response instead of error
      const fallbackResponses = {
        "Conservative Coach": [
          "Great effort exploring your portfolio! Remember, family offices think in generations, not days. Keep building that diversified foundation! 🛡️",
          "I love your curiosity! Steady progress wins the race. Consider bonds and defensive stocks for stability. 💎",
          "You're thinking like a wealth manager! Capital preservation is key - keep exploring different asset classes."
        ],
        "Balanced Coach": [
          "Fantastic strategic thinking! Balance is the key to family office success. Mix growth with stability. ⚖️",
          "You're exploring like a family office CIO! Try mixing 2-3 different asset classes for better diversification.",
          "Great effort! Family offices master asset allocation. Keep experimenting with different combinations! 📊"
        ],
        "Aggressive Coach": [
          "Bold move! Family offices built wealth by exploring new frontiers early. Keep that growth mindset! 🚀",
          "I like your courage! Innovation comes from trying new things. Explore tech and emerging markets!",
          "You're thinking ahead! Family offices weren't afraid to take calculated risks. Keep exploring! 💪"
        ],
        "Tech Coach": [
          "Excellent tech exploration! The future belongs to those who embrace innovation. Keep learning! 💻",
          "Great effort in the tech space! Diversify within tech sectors for better resilience. 🔮",
          "You're building knowledge like the best tech investors! Keep exploring AI, cloud, and emerging tech!"
        ]
      };
      
      const coachStyle = selectedCoach.style || selectedCoach.name || "Balanced Coach";
      const responses = fallbackResponses[coachStyle as keyof typeof fallbackResponses] || fallbackResponses["Balanced Coach"];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      // Add context about the action if there was one
      let fallbackMessage = randomResponse;
      if (action) {
        fallbackMessage = `${action.type === "buy" ? "Nice buy" : "Smart sell"} on ${action.asset}! ${randomResponse}`;
      }
      
      updateChatMessageById(pendingId, (old) => ({
        ...old,
        message: fallbackMessage,
        timestamp: new Date(),
      }));
      
      // Log the actual error for debugging
      console.error("Coach chat error (using fallback):", handleApiError(error));
    }
  }

  // replace mock chat with real backend call
  const sendMessage = async () => {
    const msg = newMessage.trim();
    if (!msg) return;
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "user",
        message: msg,
        timestamp: new Date(),
      },
    ]);
    setNewMessage("");
    await askCoach({ userMessage: msg });
  };

  // compute snapshot first, then setState, then call backend with snapshot
  const handleBuy = (asset: string, amount: number) => {
    const price = getLivePrice(asset);
    const cost = amount * price;
    if (!(amount > 0 && cost <= cash)) return;

    // snapshot
    const snapPortfolio: Portfolio = JSON.parse(JSON.stringify(portfolio));
    const prev = snapPortfolio[asset];
    if (prev) {
      const totalCost = prev.shares * prev.avgPrice + cost;
      const totalShares = prev.shares + amount;
      snapPortfolio[asset] = {
        ...prev,
        shares: totalShares,
        avgPrice: totalCost / totalShares,
        currentPrice: price,
      };
    } else {
      snapPortfolio[asset] = {
        shares: amount,
        avgPrice: price,
        currentPrice: price,
        dailyChange: (marketData as any)[asset].change,
      };
    }
    const snapCash = cash - cost;

    setCash(snapCash);
    setPortfolio(snapPortfolio);

    // AI reaction
    askCoach({
      action: { type: "buy", asset, amount, price },
      snapshot: { portfolio: snapPortfolio, cash: snapCash },
    });
  };

  const handleSell = (asset: string, amount: number) => {
    const holding = portfolio[asset];
    if (!(holding && amount > 0 && holding.shares > 0)) return;

    const price = getLivePrice(asset);
    const sellAmount = Math.min(amount, holding.shares);
    const proceeds = sellAmount * price;

    const snapPortfolio: Portfolio = JSON.parse(JSON.stringify(portfolio));
    snapPortfolio[asset] = {
      ...snapPortfolio[asset],
      shares: snapPortfolio[asset].shares - sellAmount,
      currentPrice: price,
    };
    const snapCash = cash + proceeds;

    setCash(snapCash);
    setPortfolio(snapPortfolio);

    // AI reaction
    askCoach({
      action: { type: "sell", asset, amount: sellAmount, price },
      snapshot: { portfolio: snapPortfolio, cash: snapCash },
    });
  };

  const handleEndCompetition = () => {
    // Calculate additional performance metrics using performanceData
    const portfolioHistory = performanceData.length > 0 
      ? performanceData.map(p => ({ time: p.time, value: p.total }))
      : [{ time: 0, value: startingCapital }];
    
    // Calculate volatility (standard deviation of hourly returns)
    const hourlyReturns: number[] = [];
    for (let i = 1; i < portfolioHistory.length; i++) {
      const prevValue = portfolioHistory[i - 1].value;
      const currValue = portfolioHistory[i].value;
      if (prevValue > 0) {
        hourlyReturns.push((currValue - prevValue) / prevValue);
      }
    }
    
    const avgReturn = hourlyReturns.length > 0 
      ? hourlyReturns.reduce((a, b) => a + b, 0) / hourlyReturns.length 
      : 0;
    
    const variance = hourlyReturns.length > 0
      ? hourlyReturns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / hourlyReturns.length
      : 0;
    
    // Annualize: ~252 trading days * 6.5 hours per day
    const volatility = Math.sqrt(variance) * Math.sqrt(252 * 6.5) * 100;
    
    // Calculate max drawdown
    let maxDrawdown = 0;
    let peak = portfolioHistory[0]?.value || startingCapital;
    
    for (const point of portfolioHistory) {
      if (point.value > peak) {
        peak = point.value;
      }
      const drawdown = (peak - point.value) / peak;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }
    
    // Calculate Sharpe ratio (assuming risk-free rate of 4%)
    const riskFreeRate = 0.04;
    const annualizedReturn = dailyReturn; // Already in percentage
    const sharpeRatio = volatility > 0 
      ? (annualizedReturn / 100 - riskFreeRate) / (volatility / 100) 
      : 0;
    
    // Generate chart data for results page
    const chartData = portfolioHistory.map((point, index) => {
      const date = new Date();
      date.setHours(date.getHours() - (portfolioHistory.length - 1 - index));
      return {
        date: date.toISOString().split('T')[0] + ' ' + date.toTimeString().slice(0, 5),
        value: point.value,
      };
    });
    
    onEndCompetition({
      finalValue: totalValue,
      totalReturn: dailyReturn,
      portfolio,
      cash,
      volatility: Math.abs(volatility).toFixed(1),
      sharpeRatio: sharpeRatio.toFixed(2),
      maxDrawdown: (maxDrawdown * 100).toFixed(1),
      annualizedReturn: annualizedReturn.toFixed(1),
      chartData,
    });
  };

  return (
    <div className="relative">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          {/* Mobile Layout */}
          <div className="sm:hidden space-y-3">
            {/* Title Section */}
            <div className="text-center">
              <h1 className="text-lg font-bold text-white mb-1">
                Investment Competition - Day {day}
              </h1>
              <p className="text-xs text-white/50">
                Investing with {selectedCoach.name}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onEndCompetition(null)}
                className="flex items-center gap-1 bg-transparent flex-1 py-2 text-sm"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to Setup
              </Button>
              <Button
                variant="destructive"
                onClick={handleEndCompetition}
                className="flex-1 py-2 text-sm bg-destructive hover:bg-destructive/90"
              >
                End Competition
              </Button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => onEndCompetition(null)}
              className="flex items-center gap-2 bg-transparent py-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Setup
            </Button>
            <div className="text-center flex-1">
              <h1 className="text-3xl font-serif font-bold text-foreground mb-1">
                Investment Competition - Day {day}
              </h1>
              <p className="text-base text-muted-foreground">
                Investing with {selectedCoach.name}
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleEndCompetition}
              className="py-2 bg-destructive hover:bg-destructive/90"
            >
              End Competition
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6 sm:space-y-8">
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Portfolio Overview */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Performance Summary - Mobile-optimized grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Card className="bg-card border-border touch-manipulation active:scale-[0.98] transition-transform">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-2 rounded-xl bg-primary/10">
                        <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
                          Total Assets
                        </p>
                        <p className="text-base sm:text-lg md:text-xl font-bold text-foreground">
                          ${totalValue.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border touch-manipulation active:scale-[0.98] transition-transform">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-2 rounded-xl bg-secondary/10">
                        <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">Cash</p>
                        <p className="text-base sm:text-lg md:text-xl font-bold text-foreground">
                          ${cash.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border touch-manipulation active:scale-[0.98] transition-transform">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`p-2 rounded-xl ${dailyReturn >= 0 ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                        {dailyReturn >= 0 ? (
                          <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
                          Return
                        </p>
                        <p
                          className={`text-base sm:text-lg md:text-xl font-bold ${
                            dailyReturn >= 0 ? "text-emerald-500" : "text-red-500"
                          }`}
                        >
                          {dailyReturn >= 0 ? "+" : ""}
                          {dailyReturn.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border touch-manipulation active:scale-[0.98] transition-transform">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`p-2 rounded-xl ${totalValue >= startingCapital ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                        <Target className={`h-4 w-4 sm:h-5 sm:w-5 ${totalValue >= startingCapital ? "text-emerald-500" : "text-red-500"}`} />
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">P&L</p>
                        <p
                          className={`text-base sm:text-lg md:text-xl font-bold ${
                            totalValue >= startingCapital
                              ? "text-emerald-500"
                              : "text-red-500"
                          }`}
                        >
                          ${(totalValue - startingCapital).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Portfolio Performance Chart */}
              <Card className="bg-card border-border">
                <CardHeader className="pb-2 sm:pb-3 md:pb-6">
                  <CardTitle className="flex items-center gap-1 sm:gap-2 text-foreground text-sm sm:text-base md:text-lg">
                    <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                    Portfolio Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-3 md:p-6">
                  <ResponsiveContainer
                    width="100%"
                    height={200}
                    className="sm:h-[250px] md:h-[300px]"
                  >
                    <LineChart data={performanceData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--border)"
                      />
                      <XAxis
                        dataKey="time"
                        type="number"
                        domain={[0, 24]}
                        ticks={hourlyTicks}
                        tickFormatter={(h) =>
                          `${String(h).padStart(2, "0")}:00`
                        }
                        stroke="var(--muted-foreground)"
                      />
                      <YAxis
                        domain={["auto", "auto"]}
                        stroke="var(--muted-foreground)"
                      />
                      <Tooltip
                        labelFormatter={(h) =>
                          `${String(h).padStart(2, "0")}:00`
                        }
                        formatter={(val, name) => {
                          const num = Number(val);
                          return [
                            `$${num.toFixed(2)}`,
                            name === "total" ? "Total" : name,
                          ];
                        }}
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="var(--primary)"
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                        name="total"
                      />
                      {Object.entries(portfolio).map(([asset, holding], idx) =>
                        holding.shares > 0 ? (
                          <Line
                            key={asset}
                            type="monotone"
                            dataKey={asset}
                            stroke={`var(--chart-${(idx % 5) + 1})`}
                            strokeWidth={1.75}
                            dot={false}
                            isAnimationActive={false}
                            name={(investmentNames as any)[asset] || asset}
                          />
                        ) : null
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Holdings & Trading */}
              <Card className="bg-card border-border">
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="text-foreground text-sm sm:text-base">
                    Holdings & Trading
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-4">
                  <div className="space-y-3 sm:space-y-4">
                    {Object.entries(portfolio).map(([asset, holding]) => {
                      if (holding.shares > 0) {
                        const currentValue =
                          holding.shares * holding.currentPrice;
                        const gainLoss =
                          ((holding.currentPrice - holding.avgPrice) /
                            holding.avgPrice) *
                          100;
                        const qty = tradeQty[asset] ?? 1;
                        const canBuy =
                          cash >= qty * getLivePrice(asset) && qty > 0;
                        const canSell = holding.shares > 0 && qty > 0;
                        return (
                          <div
                            key={asset}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-muted rounded-lg space-y-2 sm:space-y-0"
                          >
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground text-sm sm:text-base">
                                {(investmentNames as any)[asset]}
                              </h4>
                              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mt-1">
                                <span>Shares: {holding.shares.toFixed(4)}</span>
                                <span>Avg: ${holding.avgPrice.toFixed(2)}</span>
                                <span>
                                  Current: ${holding.currentPrice.toFixed(2)}
                                </span>
                                <Badge
                                  className={
                                    gainLoss >= 0
                                      ? "bg-chart-1 text-white text-xs"
                                      : "bg-chart-2 text-white text-xs"
                                  }
                                >
                                  {gainLoss >= 0 ? "+" : ""}
                                  {gainLoss.toFixed(2)}%
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                              <span className="font-semibold text-foreground text-sm sm:text-base">
                                ${currentValue.toFixed(2)}
                              </span>
                              {/* Mobile-optimized trading controls with larger touch targets */}
                              <div className="flex items-center gap-2 sm:gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleBuy(asset, qty)}
                                  disabled={!canBuy}
                                  className="min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] bg-primary text-primary-foreground hover:bg-primary/90 touch-manipulation"
                                  title={
                                    !canBuy
                                      ? "Not enough cash or invalid qty"
                                      : "Buy"
                                  }
                                >
                                  <ShoppingCart className="h-4 w-4 sm:h-3 sm:w-3" />
                                </Button>
                                <Input
                                  type="number"
                                  inputMode="decimal"
                                  min={0}
                                  step={0.1}
                                  className="w-20 sm:w-16 h-11 sm:h-9 bg-white text-foreground text-center text-base sm:text-sm font-medium rounded-lg"
                                  value={Number.isFinite(qty) ? qty : 0.1}
                                  onChange={(e) => {
                                    const v = parseFloat(e.target.value);
                                    setTradeQty((prev) => ({
                                      ...prev,
                                      [asset]: isNaN(v) ? 0 : v,
                                    }));
                                  }}
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSell(asset, qty)}
                                  disabled={!canSell}
                                  className="min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] bg-destructive text-destructive-foreground hover:bg-destructive/90 touch-manipulation"
                                  title={!canSell ? "Invalid qty" : "Sell"}
                                >
                                  <Minus className="h-4 w-4 sm:h-3 sm:w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Coach Chat */}
            <div className="lg:col-span-1">
              <CoachChat
                selectedCoach={selectedCoach}
                chatMessages={chatMessages}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                sendMessage={sendMessage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
