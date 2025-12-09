/**
 * CompetitionCard - Epic boss level unlock card
 * Stunning visual effects with particles and animations
 */

"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Star, 
  Sparkles, 
  Crown, 
  Flame,
  Swords,
  Medal,
  Zap,
  ChevronRight,
  Users,
} from "lucide-react";

interface CompetitionCardProps {
  unlocked: boolean;
  onStartCompetition: () => void;
}

// Floating particle component
function FloatingParticle({ delay, duration, size, color }: { 
  delay: number; 
  duration: number; 
  size: number;
  color: string;
}) {
  return (
    <div 
      className={`absolute rounded-full ${color} animate-pulse`}
      style={{
        width: size,
        height: size,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        opacity: 0.6,
      }}
    />
  );
}

export function CompetitionCard({ unlocked, onStartCompetition }: CompetitionCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);

  useEffect(() => {
    if (unlocked) {
      const interval = setInterval(() => {
        setShowSparkle(prev => !prev);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [unlocked]);

  if (!unlocked) return null;

  const particles = Array.from({ length: 12 }, (_, i) => ({
    delay: i * 0.3,
    duration: 2 + Math.random() * 2,
    size: 4 + Math.random() * 8,
    color: ['bg-amber-400', 'bg-orange-400', 'bg-yellow-300', 'bg-red-400'][i % 4],
  }));

  return (
    <div 
      className="relative flex items-start gap-5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Boss Node with Epic Effects */}
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 blur-xl opacity-50 animate-pulse" />
        
        {/* Rotating ring */}
        <div 
          className="absolute -inset-2 rounded-3xl border-2 border-dashed border-amber-400/50 animate-spin"
          style={{ animationDuration: '10s' }}
        />
        
        {/* Main node */}
        <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border-2 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 border-amber-300 text-white shadow-2xl shadow-orange-300/50">
          <Trophy className="h-7 w-7 drop-shadow-lg" />
          
          {/* Crown on top */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <Crown className={`h-6 w-6 text-amber-400 drop-shadow-lg ${showSparkle ? 'animate-bounce' : ''}`} />
          </div>
          
          {/* Sparkles */}
          <div className="absolute -top-1 -right-1">
            <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
          </div>
          <div className="absolute -bottom-1 -left-1">
            <Star className="h-4 w-4 text-amber-300 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>
        
        {/* Level indicator */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20">
          <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-lg text-[10px] font-black px-2">
            BOSS
          </Badge>
        </div>
      </div>

      {/* Competition Card with Particles */}
      <div className="flex-1">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-white to-orange-50 border-2 border-amber-200 shadow-2xl shadow-amber-200/50">
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {particles.map((p, i) => (
              <FloatingParticle key={i} {...p} />
            ))}
          </div>
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5" />
          
          {/* Shimmer effect */}
          <div 
            className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 ${
              isHovered ? 'translate-x-full' : '-translate-x-full'
            }`}
          />
          
          <div className="relative p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl font-black bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent tracking-tight">
                    🏆 BOSS LEVEL
                  </span>
                  <Flame className="h-6 w-6 text-orange-500 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Investment Competition
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  The ultimate test of your investment skills
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border-amber-300 shadow-sm">
                  <Crown className="h-3 w-3 mr-1" />
                  Special
                </Badge>
                <Badge className="bg-gradient-to-r from-red-100 to-orange-100 text-red-700 border-red-300 shadow-sm animate-pulse">
                  <Swords className="h-3 w-3 mr-1" />
                  PvP
                </Badge>
              </div>
            </div>

            {/* Epic description */}
            <p className="text-sm text-gray-600 mb-5 leading-relaxed">
              You&apos;ve conquered all the history missions! 🎉 Now prove yourself 
              against players worldwide. Do you have what it takes to top the leaderboard?
            </p>

            {/* Features Grid */}
            <div className="mb-5 grid grid-cols-2 gap-3">
              {[
                { icon: <TrendingUpIcon />, text: "Live market action", emoji: "📊" },
                { icon: <Users className="h-4 w-4" />, text: "Global competition", emoji: "🌍" },
                { icon: <Medal className="h-4 w-4" />, text: "Epic rewards", emoji: "🏅" },
                { icon: <Zap className="h-4 w-4" />, text: "Advanced challenges", emoji: "🧠" },
              ].map((feature, i) => (
                <div 
                  key={i}
                  className={`flex items-center gap-2 p-3 rounded-xl bg-white/80 border border-amber-200/50 transition-all duration-300 ${
                    isHovered ? 'shadow-md scale-[1.02]' : ''
                  }`}
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  <div className="text-amber-500">{feature.icon}</div>
                  <span className="text-xs font-medium text-gray-700">{feature.text}</span>
                  <span className="text-sm">{feature.emoji}</span>
                </div>
              ))}
            </div>

            {/* Stats Preview */}
            <div className="mb-5 p-4 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl border border-slate-700">
              <div className="flex items-center justify-between text-white">
                <div className="text-center">
                  <p className="text-2xl font-black text-amber-400">∞</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">XP Available</p>
                </div>
                <div className="w-px h-10 bg-slate-700" />
                <div className="text-center">
                  <p className="text-2xl font-black text-emerald-400">100+</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Players</p>
                </div>
                <div className="w-px h-10 bg-slate-700" />
                <div className="text-center">
                  <p className="text-2xl font-black text-violet-400">24h</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Rounds</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 shadow-inner">
                <Star className="h-4 w-4 text-amber-500 animate-spin" style={{ animationDuration: '3s' }} />
                <span className="text-sm font-bold text-amber-700">Unlimited 🪙 iii! ⭐</span>
              </div>
              <Button
                className={`font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white shadow-xl shadow-amber-300/50 transition-all duration-300 ${
                  isHovered ? 'scale-105 shadow-2xl shadow-orange-400/50' : ''
                }`}
                onClick={onStartCompetition}
              >
                <Trophy className="h-5 w-5 mr-2" />
                Enter Competition
                <ChevronRight className="h-5 w-5 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for TrendingUp icon
function TrendingUpIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}
