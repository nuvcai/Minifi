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
import { Play, Sparkles, TrendingUp, Trophy, Zap, ChevronRight, Star, Heart, Github, Share2, Copy, Check } from "lucide-react";
import { aiCoaches } from "@/components/data/coaches";

export default function HomePage() {
  const [selectedCoachIndex, setSelectedCoachIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = "https://minifi.nuvc.ai";
  const shareText = "🎮 Check out Legacy Guardians - a free game that teaches teens about investing through time-travel adventures! Built with AI for the AWS Hackathon 2025 🚀";
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
  };

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

                {/* Share Buttons */}
                <div className="pt-4 border-t border-border/30 mt-4">
                  <p className="text-sm text-muted-foreground mb-3 flex items-center justify-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Spread the word!
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {/* Twitter/X */}
                    <a
                      href={shareLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-all hover:scale-105"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      Share
                    </a>
                    
                    {/* LinkedIn */}
                    <a
                      href={shareLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#0077B5] hover:bg-[#006399] text-white text-sm font-medium rounded-lg transition-all hover:scale-105"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      Share
                    </a>
                    
                    {/* WhatsApp */}
                    <a
                      href={shareLinks.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20BD5A] text-white text-sm font-medium rounded-lg transition-all hover:scale-105"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Share
                    </a>
                    
                    {/* Copy Link */}
                    <button
                      onClick={handleCopyLink}
                      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all hover:scale-105 ${
                        copied 
                          ? 'bg-green-500 text-white' 
                          : 'bg-muted hover:bg-muted/80 text-foreground border border-border'
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy Link
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground pt-4">
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
