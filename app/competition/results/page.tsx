/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   MiniFi Competition Results (MVP - Hackathon Edition)                       ║
 * ║   ✨ Vibe-coded by Tick.AI ✨                                                ║
 * ║   Copyright (c) 2025 NUVC.AI / Tick.AI. All Rights Reserved.                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import CompetitionResults from "@/components/competition-results";

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [resultsData, setResultsData] = useState<{
    finalValue: number;
    totalReturn: number;
  } | null>(null);

  useEffect(() => {
    const finalValueParam = searchParams.get("finalValue");
    const totalReturnParam = searchParams.get("totalReturn");

    if (finalValueParam && totalReturnParam) {
      try {
        const finalValue = parseFloat(finalValueParam);
        const totalReturn = parseFloat(totalReturnParam);

        if (!isNaN(finalValue) && !isNaN(totalReturn)) {
          setResultsData({ finalValue, totalReturn });
        } else {
          router.push("/competition");
        }
      } catch (error) {
        console.error("Failed to parse results data:", error);
        router.push("/competition");
      }
    } else {
      // Redirect to competition setup if no results data
      router.push("/competition");
    }
  }, [searchParams, router]);

  const handleBackToHome = () => {
    router.push("/timeline");
  };

  if (!resultsData) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <CompetitionResults
      finalValue={resultsData.finalValue}
      totalReturn={resultsData.totalReturn}
      onBackToHome={handleBackToHome}
    />
  );
}

export default function ResultsPage() {
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
      <ResultsContent />
    </Suspense>
  );
}
