/**
 * Library Page - Wealth Wisdom
 * Light, fun design for teens
 * © 2025 NUVC.AI. All Rights Reserved.
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronRight, BookOpen } from "lucide-react";
import { DailyWisdom } from "@/components/library/DailyWisdom";
import { WisdomLibrary } from "@/components/library/WisdomLibrary";

export default function LibraryPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-amber-50 via-white to-orange-50 overflow-x-hidden">
      {/* Background blobs - Full viewport coverage */}
      <div className="fixed inset-0 w-screen h-screen pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-0 sm:right-10 w-56 sm:w-72 h-56 sm:h-72 bg-amber-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-0 sm:left-10 w-64 sm:w-80 h-64 sm:h-80 bg-orange-200/30 rounded-full blur-3xl" />
      </div>
      
      <div className="relative w-full">
        {/* Navigation */}
        <nav className={`w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="flex items-center gap-2 text-gray-500 hover:text-amber-600 transition-colors group"
            >
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
              <span className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Library
              </span>
            </div>
            
            <Link 
              href="/timeline"
              className="text-sm px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Play
            </Link>
          </div>
        </nav>

        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          {/* Hero */}
          <div className={`max-w-2xl mx-auto pt-8 pb-12 text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="text-5xl mb-4">📚</div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Wealth Wisdom
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Timeless insights from history's greatest investors.
              <span className="font-semibold text-amber-600"> Learn the secrets that built fortunes!</span>
            </p>
          </div>

          {/* Daily Wisdom */}
          <div className={`max-w-2xl mx-auto pb-12 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <DailyWisdom />
          </div>
          
          {/* Main Library */}
          <div className={`pb-12 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <WisdomLibrary />
          </div>

          {/* CTA */}
          <div className={`max-w-xl mx-auto pb-16 text-center transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-gray-500 mb-6">Ready to apply this wisdom? 🚀</p>
            <Link href="/timeline">
              <button className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 hover:scale-105 transition-all">
                Start a mission
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-gray-100 bg-white/50 backdrop-blur">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <span>© 2025 NUVC.AI</span>
              <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
              <Link href="/support" className="hover:text-amber-600 transition-colors">Support</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
