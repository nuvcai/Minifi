"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button as _Button } from "@/components/ui/button";
import { ChevronRight, Clock, TrendingUp, Users, Lightbulb } from "lucide-react";
import { wealthEras, type WealthEra } from "@/components/data/wealthWisdom";

interface EraTimelineProps {
  onEraSelect?: (era: WealthEra) => void;
  highlightCurrent?: boolean;
}

export function EraTimeline({ onEraSelect, highlightCurrent = true }: EraTimelineProps) {
  const [selectedEra, setSelectedEra] = useState<WealthEra | null>(null);
  
  const handleEraClick = (era: WealthEra) => {
    setSelectedEra(era === selectedEra ? null : era);
    onEraSelect?.(era);
  };
  
  const currentEra = wealthEras[wealthEras.length - 1];
  
  return (
    <div className="space-y-6">
      {/* Timeline Header */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900">
          🌍 Wealth Creation Through History
        </h3>
        <p className="text-gray-600 text-sm mt-1">
          Click any era to explore how that generation built wealth
        </p>
      </div>
      
      {/* Visual Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-400 via-blue-400 to-purple-400" />
        
        {/* Era Cards */}
        <div className="space-y-4">
          {wealthEras.map((era, index) => {
            const isLeft = index % 2 === 0;
            const isCurrent = era === currentEra && highlightCurrent;
            
            return (
              <div
                key={era.era}
                className={`relative flex items-center ${
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline Dot */}
                <div className={`absolute left-4 md:left-1/2 transform -translate-x-1/2 z-10`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg
                    ${isCurrent 
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse" 
                      : "bg-white border-2 border-gray-300"
                    }`}
                  >
                    {era.emoji}
                  </div>
                </div>
                
                {/* Era Card */}
                <div className={`ml-12 md:ml-0 md:w-[45%] ${isLeft ? "md:pr-8" : "md:pl-8"}`}>
                  <Card 
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg
                      ${isCurrent ? "border-purple-400 bg-purple-50" : "hover:border-blue-300"}
                      ${selectedEra === era ? "ring-2 ring-blue-400" : ""}
                    `}
                    onClick={() => handleEraClick(era)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge variant="outline" className="mb-2">
                            <Clock className="h-3 w-3 mr-1" />
                            {era.period}
                          </Badge>
                          <h4 className="font-bold text-gray-900">{era.era}</h4>
                          <p className="text-sm text-gray-600 mt-1">{era.transformativeTrend}</p>
                        </div>
                        <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform
                          ${selectedEra === era ? "rotate-90" : ""}
                        `} />
                      </div>
                      
                      {isCurrent && (
                        <Badge className="mt-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          🚀 YOUR ERA!
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Selected Era Details */}
      {selectedEra && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{selectedEra.emoji}</span>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedEra.era}</h3>
                <p className="text-gray-600">{selectedEra.period}</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  What Changed
                </h4>
                <p className="text-sm text-gray-700">{selectedEra.whatChanged}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  Wealth Creators
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {selectedEra.wealthCreators.slice(0, 3).map((creator, idx) => (
                    <li key={idx}>• {creator}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-amber-600" />
                Message for You
              </h4>
              <p className="text-gray-700">{selectedEra.forTeens}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">📊 Key Investments of the Era:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedEra.keyInvestments.map((investment, idx) => (
                  <Badge key={idx} variant="secondary">{investment}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default EraTimeline;


