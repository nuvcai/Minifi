"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote, BookOpen, Lightbulb } from "lucide-react";
import { investorWisdom, type InvestorWisdom } from "@/components/data/wealthWisdom";

interface InvestorSpotlightProps {
  autoRotate?: boolean;
  rotateInterval?: number;
}

export function InvestorSpotlight({ 
  autoRotate = true, 
  rotateInterval = 10000 
}: InvestorSpotlightProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const currentInvestor = investorWisdom[currentIndex];
  
  // Auto-rotate
  useEffect(() => {
    if (!autoRotate) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % investorWisdom.length);
    }, rotateInterval);
    
    return () => clearInterval(interval);
  }, [autoRotate, rotateInterval]);
  
  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % investorWisdom.length);
  };
  
  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + investorWisdom.length) % investorWisdom.length);
  };
  
  return (
    <Card className="bg-linear-to-br from-purple-50 via-pink-50 to-orange-50 border-purple-200 overflow-hidden">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <h3 className="font-bold text-gray-900">Investor Spotlight</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={goPrev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-500">
              {currentIndex + 1} / {investorWisdom.length}
            </span>
            <Button variant="ghost" size="sm" onClick={goNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Investor Info */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-2xl font-bold text-gray-900">{currentInvestor.investor}</h4>
              <Badge variant="outline" className="mt-1">{currentInvestor.era}</Badge>
            </div>
          </div>
          
          {/* Background Story */}
          <div className="bg-white/60 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-purple-600" />
              <span className="font-semibold text-gray-800">Their Story</span>
            </div>
            <p className="text-gray-700 text-sm">{currentInvestor.backgroundStory}</p>
          </div>
          
          {/* Quote */}
          <blockquote className="relative bg-linear-to-r from-purple-100 to-pink-100 rounded-lg p-4 border-l-4 border-purple-400">
            <Quote className="absolute top-2 right-2 h-6 w-6 text-purple-300" />
            <p className="text-lg font-medium text-gray-800 italic pr-8">
              "{currentInvestor.quote}"
            </p>
          </blockquote>
          
          {/* Lesson */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-amber-600" />
              <span className="font-semibold text-gray-800">The Lesson</span>
            </div>
            <p className="text-gray-700">{currentInvestor.lesson}</p>
          </div>
          
          {/* For Teens */}
          <div className="bg-linear-to-r from-amber-100 to-orange-100 rounded-lg p-4 border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">💡</span>
              <span className="font-semibold text-gray-800">For You</span>
            </div>
            <p className="text-gray-700 text-sm">{currentInvestor.forTeens}</p>
          </div>
        </div>
        
        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-4">
          {investorWisdom.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all
                ${idx === currentIndex 
                  ? "bg-purple-500 w-4" 
                  : "bg-gray-300 hover:bg-gray-400"
                }
              `}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default InvestorSpotlight;


