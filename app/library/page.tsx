"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { WisdomLibrary } from "@/components/library/WisdomLibrary";
import { DailyWisdom } from "@/components/library/DailyWisdom";

export default function LibraryPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-slate-300 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-400" />
            <span className="font-bold text-white">Wealth Wisdom Library</span>
          </div>
          
          <Link href="/timeline">
            <Button variant="outline" size="sm" className="gap-2 border-slate-600 text-slate-300 hover:bg-slate-800">
              <span>Play Missions</span>
            </Button>
          </Link>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Daily Wisdom Feature Card */}
        <div className="max-w-2xl mx-auto">
          <DailyWisdom />
        </div>
        
        {/* Main Library */}
        <WisdomLibrary />
        
        {/* Footer CTA */}
        <div className="text-center py-8 space-y-4">
          <p className="text-slate-400">
            Ready to apply this wisdom? Start your wealth-building journey!
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/timeline">
              <Button className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600">
                📚 Historical Missions
              </Button>
            </Link>
            <Link href="/competition">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                🏆 Investment Competition
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}


