/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   MiniFi - Financial Literacy Platform (MVP - Hackathon Edition)            ║
 * ║   ✨ Vibe-coded by Tick.AI for AWS AI Hackathon 2025 ✨                      ║
 * ║   Copyright (c) 2025 NUVC.AI / Tick.AI. All Rights Reserved.                ║
 * ║   PROPRIETARY - NO COMMERCIAL USE | https://nuvc.ai                         ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Sparkles, TrendingUp, Trophy, Zap, ChevronRight, Star, Heart, Github } from "lucide-react";
import { aiCoaches } from "@/components/data/coaches";

export default function HomePage() {
  const [selectedCoachIndex, setSelectedCoachIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    // Auto-cycle through coaches for preview
    const interval = setInterval(() => {
      setSelectedCoachIndex((prev) => (prev + 1) % aiCoaches.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const selectedCoach = aiCoaches[selectedCoachIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-500" />
        
        {/* Floating coins/icons */}
        <div className="absolute top-1/4 left-1/4 text-4xl animate-bounce delay-100">💰</div>
        <div className="absolute top-1/3 right-1/4 text-3xl animate-bounce delay-300">📈</div>
        <div className="absolute bottom-1/3 left-1/3 text-3xl animate-bounce delay-500">🚀</div>
        <div className="absolute bottom-1/4 right-1/3 text-4xl animate-bounce delay-700">💎</div>
      </div>

      <div className="relative container mx-auto px-4 py-6 sm:py-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Hero Section */}
          <div className={`text-center space-y-4 sm:space-y-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Logo and Title */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 rounded-full blur-xl animate-pulse" />
                <Image
                  src="/favicon.png"
                  alt="Legacy Guardians"
                  width={100}
                  height={100}
                  className="relative object-contain w-20 h-20 sm:w-24 sm:h-24 drop-shadow-lg"
                />
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black text-primary leading-tight">
                Legacy Guardians
              </h1>
              <p className="text-xl sm:text-2xl font-medium text-muted-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent animate-pulse" />
                Time-travel. Learn. Level up your money game!
                <Sparkles className="h-5 w-5 text-accent animate-pulse" />
              </p>
            </div>

            {/* Quick Stats Preview */}
            <div className="flex justify-center gap-4 sm:gap-8 py-4">
              <div className="text-center px-4 py-2 bg-card/50 backdrop-blur rounded-xl border border-border/50">
                <div className="text-2xl sm:text-3xl font-bold text-primary">6</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Epic Missions</div>
              </div>
              <div className="text-center px-4 py-2 bg-card/50 backdrop-blur rounded-xl border border-border/50">
                <div className="text-2xl sm:text-3xl font-bold text-accent">4</div>
                <div className="text-xs sm:text-sm text-muted-foreground">AI Coaches</div>
              </div>
              <div className="text-center px-4 py-2 bg-card/50 backdrop-blur rounded-xl border border-border/50">
                <div className="text-2xl sm:text-3xl font-bold text-secondary">∞</div>
                <div className="text-xs sm:text-sm text-muted-foreground">XP to Earn</div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className={`grid lg:grid-cols-2 gap-6 sm:gap-8 mt-8 sm:mt-12 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Left: What You'll Do */}
            <div className="bg-card/80 backdrop-blur rounded-2xl shadow-xl p-6 sm:p-8 border border-border/50">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground mb-6 flex items-center gap-2">
                <Zap className="h-6 w-6 text-accent" />
                What&apos;s the Vibe?
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    🕹️
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Play Through History</h3>
                    <p className="text-sm text-muted-foreground">
                      Travel to epic market moments - crashes, bubbles, and comebacks!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl bg-secondary/5 hover:bg-secondary/10 transition-colors group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    🤖
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Get AI Coaching</h3>
                    <p className="text-sm text-muted-foreground">
                      Pick your coach - from chill & safe to full send risk-taker!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl bg-accent/5 hover:bg-accent/10 transition-colors group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    💸
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Make Big Decisions</h3>
                    <p className="text-sm text-muted-foreground">
                      Invest virtual cash and see what would&apos;ve happened IRL!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    🎁
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Score Real Rewards</h3>
                    <p className="text-sm text-muted-foreground">
                      Earn XP and trade it for gift cards - Spotify, JB Hi-Fi & more!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Coach Preview */}
            <div className="bg-card/80 backdrop-blur rounded-2xl shadow-xl p-6 sm:p-8 border border-border/50">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground mb-6 flex items-center gap-2">
                <Star className="h-6 w-6 text-accent" />
                Meet Your Coaches
              </h2>

              {/* Featured Coach */}
              <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 mb-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
                <div className="relative flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur animate-pulse" />
                    <Image
                      src={selectedCoach.animatedAvatar}
                      alt={selectedCoach.name}
                      width={80}
                      height={80}
                      className="relative rounded-full border-2 border-white shadow-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground">{selectedCoach.name}</h3>
                    <p className={`text-sm font-medium px-2 py-0.5 rounded-full inline-block ${selectedCoach.color}`}>
                      {selectedCoach.personality}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {selectedCoach.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Coach Selector */}
              <div className="flex justify-center gap-3">
                {aiCoaches.map((coach, index) => (
                  <button
                    key={coach.id}
                    onClick={() => setSelectedCoachIndex(index)}
                    className={`relative p-1 rounded-full transition-all duration-300 ${
                      index === selectedCoachIndex 
                        ? 'ring-2 ring-primary ring-offset-2 scale-110' 
                        : 'opacity-60 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <Image
                      src={coach.avatar}
                      alt={coach.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  </button>
                ))}
              </div>

              {/* Teaser Stats */}
              <div className="mt-6 p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Starting Level</span>
                  <span className="font-bold text-primary flex items-center gap-1">
                    <Trophy className="h-4 w-4" /> Level 1
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-muted-foreground">First Mission</span>
                  <span className="font-bold text-secondary">Japan 1990 🇯🇵</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-muted-foreground">Potential XP</span>
                  <span className="font-bold text-accent flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" /> 100+ per mission
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className={`text-center mt-10 sm:mt-14 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Link href="/timeline">
              <button className="group relative bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] hover:bg-right text-primary-foreground text-lg sm:text-xl px-10 sm:px-14 py-4 sm:py-5 font-bold rounded-2xl transition-all duration-500 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95">
                <span className="flex items-center gap-3">
                  <Play className="h-6 w-6 group-hover:animate-pulse" />
                  Let&apos;s Go! 🚀
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                {/* Shine effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </Link>
            
            <p className="text-sm text-muted-foreground mt-4 flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              No sign-up needed • Jump right in!
            </p>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
              </span>
              <span>Built for teens, by AI 🤖</span>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:flex items-center gap-1">
                100% free to play 🎮
              </span>
            </div>
          </div>

          {/* Bottom Feature Pills */}
          <div className={`flex flex-wrap justify-center gap-3 mt-8 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {['Zero Risk 🛡️', 'Real History 📚', 'AI Powered 🤖', 'Earn Rewards 🎁', 'Learn Fast ⚡'].map((feature) => (
              <span 
                key={feature}
                className="px-4 py-2 bg-card/60 backdrop-blur border border-border/50 rounded-full text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all cursor-default"
              >
                {feature}
              </span>
            ))}
          </div>

          {/* MVP Support Banner */}
          <div className={`mt-12 sm:mt-16 transition-all duration-1000 delay-900 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 rounded-2xl p-6 sm:p-8 border border-border/30 backdrop-blur">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-full shadow-lg">
                  ✨ MVP Preview
                </span>
              </div>
              
              <div className="text-center space-y-4">
                <h3 className="text-lg sm:text-xl font-serif font-bold text-foreground">
                  Love what we&apos;re building? 💜
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
                  This is an early MVP built for the AWS AI Hackathon 2025! We&apos;re on a mission to make 
                  financial literacy fun and accessible for every teen. Your support helps us keep building!
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <a
                    href="https://github.com/sponsors/nuvcai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    <Heart className="h-5 w-5 group-hover:animate-pulse" />
                    Become a Sponsor
                  </a>
                  <a
                    href="https://github.com/nuvcai/MiniFi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-card hover:bg-muted border border-border rounded-xl font-medium text-foreground transition-all hover:scale-105"
                  >
                    <Github className="h-5 w-5" />
                    Star on GitHub ⭐
                  </a>
                </div>

                <p className="text-xs text-muted-foreground pt-2">
                  Made with 💜 by{" "}
                  <a href="https://nuvc.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    NUVC.AI
                  </a>
                  {" "}× Tick.AI for teens everywhere
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
