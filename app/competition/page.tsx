/**
 * Mini.Fi Competition Page
 * © 2025 NUVC.AI. All Rights Reserved.
 */

"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import InvestmentCompetition from "@/components/investment-competition";

export default function CompetitionPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/timeline');
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleStartTrading = (portfolio: any, coach: any) => {
    const portfolioParam = encodeURIComponent(JSON.stringify(portfolio));
    const coachParam = encodeURIComponent(JSON.stringify(coach));
    router.push(`/competition/trading?portfolio=${portfolioParam}&coach=${coachParam}`);
  };

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
              <span className="text-white/70 font-medium">Competition</span>
            </div>
            
            <div className="w-16" /> {/* Spacer */}
          </div>
        </div>
      </nav>

      <InvestmentCompetition
        onBack={handleBack}
        onStartTrading={handleStartTrading}
      />
    </div>
  );
}
