"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, TrendingUp, Users, Lightbulb, Star, GraduationCap } from "lucide-react";
import { WisdomCard } from "./WisdomCard";
import {
  wealthPillars,
  wealthEras,
  investorWisdom,
  hopeMessages,
  foPrinciples
} from "@/components/data/wealthWisdom";

interface WisdomLibraryProps {
  initialTab?: string;
}

export function WisdomLibrary({ initialTab = "pillars" }: WisdomLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEraFilter, setSelectedEraFilter] = useState<string | null>(null);
  
  // Filter function for search
  const filterContent = (text: string) => {
    if (!searchTerm) return true;
    return text.toLowerCase().includes(searchTerm.toLowerCase());
  };
  
  // Filter pillars
  const filteredPillars = wealthPillars.filter(
    p => filterContent(p.name) || filterContent(p.principle) || filterContent(p.forTeens)
  );
  
  // Filter eras
  const filteredEras = wealthEras.filter(
    e => filterContent(e.era) || filterContent(e.transformativeTrend) || filterContent(e.forTeens)
  ).filter(e => !selectedEraFilter || e.era === selectedEraFilter);
  
  // Filter investor wisdom
  const filteredInvestors = investorWisdom.filter(
    i => filterContent(i.investor) || filterContent(i.quote) || filterContent(i.lesson)
  );
  
  // Filter principles
  const filteredPrinciples = foPrinciples.filter(
    p => filterContent(p.principle) || filterContent(p.explanation)
  );
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
          📚 Wealth Wisdom Library
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Learn the secrets of generational wealth from Family Office principles, 
          legendary investors, and historical patterns. Knowledge that compounds like money!
        </p>
      </div>
      
      {/* Search */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search wisdom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {/* Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-3xl mx-auto">
        <div className="bg-amber-50 rounded-lg p-3 text-center border border-amber-200">
          <div className="text-2xl font-bold text-amber-600">{wealthPillars.length}</div>
          <div className="text-xs text-amber-700">Wealth Pillars</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{wealthEras.length}</div>
          <div className="text-xs text-blue-700">Wealth Eras</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">{investorWisdom.length}</div>
          <div className="text-xs text-purple-700">Investor Insights</div>
        </div>
        <div className="bg-emerald-50 rounded-lg p-3 text-center border border-emerald-200">
          <div className="text-2xl font-bold text-emerald-600">{foPrinciples.length}</div>
          <div className="text-xs text-emerald-700">FO Principles</div>
        </div>
        <div className="bg-rose-50 rounded-lg p-3 text-center border border-rose-200">
          <div className="text-2xl font-bold text-rose-600">{hopeMessages.length}</div>
          <div className="text-xs text-rose-700">Hope Messages</div>
        </div>
      </div>
      
      {/* Main Content Tabs */}
      <Tabs defaultValue={initialTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 max-w-2xl mx-auto">
          <TabsTrigger value="pillars" className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            <span className="hidden sm:inline">Pillars</span>
          </TabsTrigger>
          <TabsTrigger value="eras" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Eras</span>
          </TabsTrigger>
          <TabsTrigger value="investors" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Legends</span>
          </TabsTrigger>
          <TabsTrigger value="principles" className="flex items-center gap-1">
            <Lightbulb className="h-4 w-4" />
            <span className="hidden sm:inline">Principles</span>
          </TabsTrigger>
          <TabsTrigger value="hope" className="flex items-center gap-1">
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Hope</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Pillars Tab */}
        <TabsContent value="pillars" className="mt-6">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold">🏛️ The Four Pillars of Generational Wealth</h3>
              <p className="text-gray-600 text-sm">How Family Offices build wealth that lasts generations</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {filteredPillars.map((pillar) => (
                <WisdomCard
                  key={pillar.id}
                  title={pillar.name}
                  emoji={pillar.emoji}
                  category="pillar"
                  mainContent={pillar.principle}
                  expandedContent={pillar.foWisdom}
                  forTeens={pillar.forTeens}
                  keyActions={pillar.keyActions}
                  historicalExample={pillar.historicalExample}
                  tags={["Family Office", "Generational Wealth"]}
                />
              ))}
            </div>
          </div>
        </TabsContent>
        
        {/* Eras Tab */}
        <TabsContent value="eras" className="mt-6">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold">📈 Wealth-Building Eras</h3>
              <p className="text-gray-600 text-sm">Every generation has their moment - this is yours!</p>
            </div>
            
            {/* Era Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge 
                variant={selectedEraFilter === null ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedEraFilter(null)}
              >
                All Eras
              </Badge>
              {wealthEras.map((era) => (
                <Badge 
                  key={era.era}
                  variant={selectedEraFilter === era.era ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedEraFilter(era.era)}
                >
                  {era.emoji} {era.period}
                </Badge>
              ))}
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEras.map((era) => (
                <WisdomCard
                  key={era.era}
                  title={`${era.emoji} ${era.era}`}
                  category="era"
                  mainContent={era.whatChanged}
                  expandedContent={era.howPeopleGotRich}
                  forTeens={era.forTeens}
                  keyActions={era.keyInvestments}
                  historicalExample={era.wealthCreators.join(" | ")}
                  tags={[era.period, era.transformativeTrend]}
                />
              ))}
            </div>
          </div>
        </TabsContent>
        
        {/* Investors Tab */}
        <TabsContent value="investors" className="mt-6">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold">🏆 Legendary Investor Wisdom</h3>
              <p className="text-gray-600 text-sm">Learn from the masters who built lasting wealth</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredInvestors.map((investor) => (
                <WisdomCard
                  key={investor.investor}
                  title={investor.investor}
                  category="investor"
                  mainContent={investor.backgroundStory}
                  quote={investor.quote}
                  expandedContent={investor.lesson}
                  forTeens={investor.forTeens}
                  tags={[investor.era]}
                />
              ))}
            </div>
          </div>
        </TabsContent>
        
        {/* Principles Tab */}
        <TabsContent value="principles" className="mt-6">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold">💡 Family Office Principles</h3>
              <p className="text-gray-600 text-sm">The rules wealthy families follow for generations</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {filteredPrinciples.map((principle) => (
                <WisdomCard
                  key={principle.number}
                  title={`#${principle.number}: ${principle.principle}`}
                  category="principle"
                  mainContent={principle.explanation}
                  expandedContent={principle.howFamilyOfficesApplyIt}
                  forTeens={principle.howTeensCanApplyIt}
                  tags={["FO Strategy", "Wealth Building"]}
                />
              ))}
            </div>
          </div>
        </TabsContent>
        
        {/* Hope Tab */}
        <TabsContent value="hope" className="mt-6">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold">✨ Hope & Opportunity</h3>
              <p className="text-gray-600 text-sm">Inspiring messages to fuel your wealth-building journey</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {hopeMessages.map((message, idx) => (
                <WisdomCard
                  key={idx}
                  title={message.title}
                  emoji="🌟"
                  category="hope"
                  mainContent={message.message}
                  expandedContent={message.evidence}
                  forTeens={message.callToAction}
                  tags={["Inspiration", "Your Future"]}
                />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default WisdomLibrary;


