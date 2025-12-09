"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dynamicImport from "next/dynamic";
import { ArrowLeft, Loader2 } from "lucide-react";

// Force dynamic rendering to prevent SSG issues
export const dynamic = 'force-dynamic';

// Lazy load the competition component to avoid SSR issues
const InvestmentCompetition = dynamicImport(
  () => import("@/components/investment-competition"),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading competition...</p>
        </div>
      </div>
    )
  }
);

export default function CompetitionPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/timeline');
  };

  const handleStartTrading = (portfolio: any, coach: any) => {
    // Encode portfolio and coach data as URL parameters
    const portfolioParam = encodeURIComponent(JSON.stringify(portfolio));
    const coachParam = encodeURIComponent(JSON.stringify(coach));
    
    router.push(`/competition/trading?portfolio=${portfolioParam}&coach=${coachParam}`);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-emerald-50 via-white to-teal-50 overflow-x-hidden">
      {/* Background blobs - Full viewport coverage */}
      <div className="fixed inset-0 w-screen h-screen pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-0 sm:left-10 w-56 sm:w-72 h-56 sm:h-72 bg-emerald-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-0 sm:right-10 w-72 sm:w-96 h-72 sm:h-96 bg-teal-200/40 rounded-full blur-3xl" />
      </div>
      
      {/* Header */}
      <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-xl">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/timeline" className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back</span>
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
                Competition
              </span>
            </div>
            
            <div className="w-16" />
          </div>
        </div>
      </nav>

      <div className="relative">
        <InvestmentCompetition
          onBack={handleBack}
          onStartTrading={handleStartTrading}
        />
      </div>
    </div>
  );
}