/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   MiniFi Trading Dashboard (MVP - Hackathon Edition)                         ║
 * ║   ✨ Vibe-coded by Tick.AI ✨                                                ║
 * ║   Copyright (c) 2025 NUVC.AI / Tick.AI. All Rights Reserved.                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import TradingDashboard from "@/components/trading-dashboard";

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
    if (
      results &&
      typeof results.finalValue === "number" &&
      typeof results.totalReturn === "number"
    ) {
      // Navigate to results with data
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
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading competition...</p>
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
    <Suspense
      fallback={
        <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading...</p>
          </div>
        </div>
      }
    >
      <TradingContent />
    </Suspense>
  );
}
