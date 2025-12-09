"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ArrowLeft, Loader2 } from "lucide-react";

// Lazy load to avoid SSR issues with client-only components
const TradingDashboard = dynamic(
  () => import("@/components/trading-dashboard"),
  { ssr: false }
);

function TradingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [competitionConfig, setCompetitionConfig] = useState<{
    portfolio: any;
    coach: any;
  } | null>(null);

  useEffect(() => {
    const portfolioParam = searchParams.get("portfolio");
    const coachParam = searchParams.get("coach");

    if (portfolioParam && coachParam) {
      try {
        const portfolio = JSON.parse(decodeURIComponent(portfolioParam));
        const coach = JSON.parse(decodeURIComponent(coachParam));
        setCompetitionConfig({ portfolio, coach });
      } catch (error) {
        console.error("Failed to parse competition config:", error);
        router.push("/competition");
      }
    } else {
      // Redirect to competition setup if no config
      router.push("/competition");
    }
  }, [searchParams, router]);

  const handleEndCompetition = (results: any) => {
    if (results && typeof results.finalValue === "number" && typeof results.totalReturn === "number") {
      // Store full results in sessionStorage for the results page
      const fullResults = {
        finalValue: results.finalValue,
        totalReturn: results.totalReturn,
        portfolio: results.portfolio || {},
        cash: results.cash || 0,
        chartData: results.chartData || null,
        sharpeRatio: results.sharpeRatio || null,
        volatility: results.volatility || null,
        maxDrawdown: results.maxDrawdown || null,
      };
      
      try {
        sessionStorage.setItem('competitionResults', JSON.stringify(fullResults));
      } catch (e) {
        console.warn('Could not store results in sessionStorage:', e);
      }
      
      // Navigate with basic params as fallback
      const finalValue = results.finalValue;
      const totalReturn = results.totalReturn;
      router.push(
        `/competition/results?finalValue=${finalValue}&totalReturn=${totalReturn}`
      );
    } else {
      // Go back to competition setup
      router.push("/competition");
    }
  };

  if (!competitionConfig) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading competition...</p>
        </div>
      </div>
    );
  }

  return (
    <TradingDashboard
      initialPortfolio={competitionConfig.portfolio}
      selectedCoach={competitionConfig.coach}
      onEndCompetition={handleEndCompetition}
    />
  );
}

export default function TradingPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-emerald-50 via-white to-teal-50 overflow-x-hidden">
      {/* Background blobs - Full viewport coverage */}
      <div className="fixed inset-0 w-screen h-screen pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-0 sm:right-20 w-48 sm:w-64 h-48 sm:h-64 bg-emerald-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-0 sm:left-10 w-64 sm:w-80 h-64 sm:h-80 bg-teal-200/30 rounded-full blur-3xl" />
      </div>
      
      {/* Header */}
      <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-xl">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/competition" className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Exit</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <Image
                src="/minifi-logo.svg"
                alt="Mini.Fi"
                width={100}
                height={36}
                className="h-9 w-auto"
              />
              <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Trading
              </span>
            </div>
            
            <div className="w-16" />
          </div>
        </div>
      </nav>
      
      <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><Loader2 className="h-8 w-8 animate-spin text-emerald-500" /></div>}>
        <TradingContent />
      </Suspense>
    </div>
  );
}
