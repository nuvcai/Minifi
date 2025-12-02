/**
 * Mini.Fi Competition Results
 * © 2025 NUVC.AI. All Rights Reserved.
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2 } from "lucide-react";
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
      router.push("/competition");
    }
  }, [searchParams, router]);

  const handleBackToHome = () => {
    router.push("/timeline");
  };

  if (!resultsData) {
    return (
      <div className="flex items-center justify-center pt-32">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-400 mx-auto mb-4" />
          <p className="text-white/40">Loading results...</p>
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
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Subtle gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-indigo-950/10 via-transparent to-violet-950/5 pointer-events-none" />
      
      {/* Header */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/timeline" className="flex items-center gap-2 text-white/50 hover:text-white/90 transition-colors group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm">Back</span>
            </Link>
            
            <div className="flex items-center gap-3">
              <Image
                src="/favicon.png"
                alt="Mini.Fi"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-white/70 font-medium">Results</span>
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
        <ResultsContent />
      </Suspense>
    </div>
  );
}
