"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Home } from "lucide-react";
import Link from "next/link";
import { WisdomLibrary } from "@/components/library/WisdomLibrary";
import { DailyWisdom } from "@/components/library/DailyWisdom";

export default function LibraryPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-amber-50 via-white to-orange-50">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-amber-100">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-amber-600" />
            <span className="font-bold text-gray-900">Wealth Wisdom Library</span>
          </div>
          
          <Link href="/timeline">
            <Button variant="outline" size="sm" className="gap-2">
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
          <p className="text-gray-600">
            Ready to apply this wisdom? Start your wealth-building journey!
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/timeline">
              <Button className="bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                📚 Historical Missions
              </Button>
            </Link>
            <Link href="/competition">
              <Button variant="outline">
                🏆 Investment Competition
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}


