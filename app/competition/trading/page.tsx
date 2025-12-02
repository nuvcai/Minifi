/**
 * Mini.Fi Trading Dashboard
 * © 2025 NUVC.AI. All Rights Reserved.
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2 } from "lucide-react";
import TradingDashboard from "@/components/trading-dashboard";

function TradingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [competitionConfig, setCompetitionConfig] = useState<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    portfolio: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      router.push("/competition");
    }
  }, [searchParams, router]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEndCompetition = (results: any) => {
    if (results && typeof results.finalValue === "number" && typeof results.totalReturn === "number") {
      const finalValue = results.finalValue;
      const totalReturn = results.totalReturn;
      router.push(`/competition/results?finalValue=${finalValue}&totalReturn=${totalReturn}`);
    } else {
      router.push("/competition");
    }
  };

  if (!competitionConfig) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-400 mx-auto mb-4" />
          <p className="text-white/40">Loading competition...</p>
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
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Subtle gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-indigo-950/10 via-transparent to-violet-950/5 pointer-events-none" />
      
      {/* Header */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/competition" className="flex items-center gap-2 text-white/50 hover:text-white/90 transition-colors group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm">Exit</span>
            </Link>
            
            <div className="flex items-center gap-3">
              <Image
                src="/favicon.png"
                alt="Mini.Fi"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-white/70 font-medium">Trading</span>
            </div>
            
            <div className="w-16" />
          </div>
        </div>
      </nav>

      <Suspense
        fallback={
          <div className="flex items-center justify-center pt-32">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-400 mx-auto mb-4" />
              <p className="text-white/40">Loading...</p>
            </div>
          </div>
        }
      >
        <TradingContent />
      </Suspense>
    </div>
  );
}
