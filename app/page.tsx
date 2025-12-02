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
import { Play, Sparkles, TrendingUp, Trophy, Zap, ChevronRight, Star, Heart, Github, Share2, Copy, Check, Target, Users, GraduationCap, ExternalLink, Rocket, Mail, Crown, Lock } from "lucide-react";
import { aiCoaches } from "@/components/data/coaches";
import { UpcomingFeatures } from "@/components/features/UpcomingFeatures";
import { AssetClassMastery } from "@/components/features/AssetClassMastery";
import { SupportTeaser } from "@/components/marketing/SupportTeaser";
import { NewsletterSignup } from "@/components/marketing/NewsletterSignup";
import { RoadmapTeaser } from "@/components/marketing/RoadmapTeaser";
import { FeatureWisdomShowcase } from "@/components/marketing/FeatureWisdomShowcase";
import { DailyWisdom } from "@/components/library/DailyWisdom";
import { BookOpen } from "lucide-react";

export default function HomePage() {
  const [selectedCoachIndex, setSelectedCoachIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = "https://minifi.app";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500" />
        
        {/* Floating coins/icons */}
        <div className="absolute top-1/4 left-1/4 text-4xl animate-bounce delay-100">💰</div>
        <div className="absolute top-1/3 right-1/4 text-3xl animate-bounce delay-300">📈</div>
        <div className="absolute bottom-1/3 left-1/3 text-3xl animate-bounce delay-500">🚀</div>
        <div className="absolute bottom-1/4 right-1/3 text-4xl animate-bounce delay-700">💎</div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Top Bar - NUVC Logo & Quick Actions */}
          <div className={`flex items-center justify-between mb-6 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <a 
              href="https://nuvc.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 group"
            >
              <Image
                src="/nuvc-logo.png"
                alt="NUVC.AI"
                width={40}
                height={40}
                className="rounded-lg group-hover:scale-105 transition-transform"
              />
              <span className="text-sm font-semibold text-slate-400 group-hover:text-emerald-400 transition-colors hidden sm:inline">NUVC.AI</span>
            </a>
            
            {/* Quick Share & Sponsor - Always Visible */}
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/sponsors/nuvcai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-500/20 to-rose-500/20 hover:from-pink-500/30 hover:to-rose-500/30 text-pink-400 text-xs font-semibold rounded-full border border-pink-500/30 transition-all hover:scale-105"
              >
                <Heart className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sponsor</span>
              </a>
              <button
                onClick={handleCopyLink}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-all hover:scale-105 ${
                  copied 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-slate-700/50 text-slate-300 border border-slate-600/50 hover:bg-slate-600/50'
                }`}
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Hero Section */}
          <div className={`text-center space-y-4 sm:space-y-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Logo and Title */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-full blur-xl animate-pulse" />
                <Image
                  src="/favicon.png"
                  alt="Legacy Guardians"
                  width={100}
                  height={100}
                  className="relative object-contain w-20 h-20 sm:w-24 sm:h-24 drop-shadow-lg"
                />
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
                Legacy Guardians
              </h1>
              <p className="text-xl sm:text-2xl font-medium text-slate-300 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-400 animate-pulse" />
                Time-travel. Learn. Level up your money game!
                <Sparkles className="h-5 w-5 text-emerald-400 animate-pulse" />
              </p>
            </div>

            {/* Quick Stats Preview */}
            <div className="flex justify-center gap-4 sm:gap-8 py-4">
              <div className="text-center px-4 py-2 bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700/50">
                <div className="text-2xl sm:text-3xl font-bold text-emerald-400">6</div>
                <div className="text-xs sm:text-sm text-slate-400">Epic Missions</div>
              </div>
              <div className="text-center px-4 py-2 bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700/50">
                <div className="text-2xl sm:text-3xl font-bold text-teal-400">4</div>
                <div className="text-xs sm:text-sm text-slate-400">AI Coaches</div>
              </div>
              <div className="text-center px-4 py-2 bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700/50">
                <div className="text-2xl sm:text-3xl font-bold text-cyan-400">∞</div>
                <div className="text-xs sm:text-sm text-slate-400">XP to Earn</div>
              </div>
            </div>
          </div>

          {/* NUVC Mission Section - Prominent */}
          <div className={`mt-8 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative bg-gradient-to-br from-emerald-500/10 via-slate-800/50 to-teal-500/10 rounded-2xl p-6 sm:p-8 border border-emerald-500/20 backdrop-blur overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl" />
              
              <div className="relative">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-emerald-400" />
                  <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Our Mission</span>
                </div>
                
                <blockquote className="text-center">
                  <p className="text-xl sm:text-2xl lg:text-3xl font-light text-slate-200 leading-relaxed max-w-3xl mx-auto">
                    &ldquo;Financial literacy shouldn&apos;t be a privilege of the wealthy.{" "}
                    <span className="font-semibold text-emerald-400">Every teenager deserves</span>{" "}
                    to learn how money works.&rdquo;
                  </p>
                </blockquote>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-teal-400" />
                      <span><strong className="text-slate-200">70%</strong> of Aussie teens have no financial education</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-slate-700/50">
                  <a 
                    href="https://nuvc.ai" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors group"
                  >
                    <Image
                      src="/nuvc-logo.png"
                      alt="NUVC.AI"
                      width={24}
                      height={24}
                      className="rounded"
                    />
                    <span>Powered by <strong className="text-slate-300 group-hover:text-emerald-400">NUVC.AI</strong></span>
                    <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                  </a>
                  <span className="text-slate-600">•</span>
                  <span className="text-sm text-slate-500">Entrepreneur in Residence @ Wade Institute</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className={`grid lg:grid-cols-2 gap-6 sm:gap-8 mt-8 sm:mt-10 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Left: What You'll Do */}
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-700/50">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                <Zap className="h-6 w-6 text-emerald-400" />
                What&apos;s the Vibe?
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 rounded-xl bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors group border border-emerald-500/10">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    🕹️
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100">Play Through History</h3>
                    <p className="text-sm text-slate-400">
                      Travel to epic market moments - crashes, bubbles, and comebacks!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl bg-teal-500/5 hover:bg-teal-500/10 transition-colors group border border-teal-500/10">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    🤖
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100">Get AI Coaching</h3>
                    <p className="text-sm text-slate-400">
                      Pick your coach - from chill & safe to full send risk-taker!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl bg-cyan-500/5 hover:bg-cyan-500/10 transition-colors group border border-cyan-500/10">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    💸
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100">Make Big Decisions</h3>
                    <p className="text-sm text-slate-400">
                      Invest virtual cash and see what would&apos;ve happened IRL!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl bg-amber-500/5 hover:bg-amber-500/10 transition-colors group border border-amber-500/10">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    🎁
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100">Score Real Rewards</h3>
                    <p className="text-sm text-slate-400">
                      Earn XP and trade it for gift cards - Spotify, JB Hi-Fi & more!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Coach Preview */}
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-700/50">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                <Star className="h-6 w-6 text-teal-400" />
                Meet Your Coaches
              </h2>

              {/* Featured Coach */}
              <div className="relative bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-6 mb-6 overflow-hidden border border-slate-700/50">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl" />
                <div className="relative flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur animate-pulse" />
                    <Image
                      src={selectedCoach.animatedAvatar}
                      alt={selectedCoach.name}
                      width={80}
                      height={80}
                      className="relative rounded-full border-2 border-slate-700 shadow-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-100">{selectedCoach.name}</h3>
                    <p className={`text-sm font-medium px-2 py-0.5 rounded-full inline-block ${selectedCoach.color}`}>
                      {selectedCoach.personality}
                    </p>
                    <p className="text-sm text-slate-400 mt-2">
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
                        ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-slate-800 scale-110' 
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
              <div className="mt-6 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Starting Level</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <Trophy className="h-4 w-4" /> Level 1
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-slate-400">First Mission</span>
                  <span className="font-bold text-teal-400">Japan 1990 🇯🇵</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-slate-400">Potential XP</span>
                  <span className="font-bold text-cyan-400 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" /> 100+ per mission
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className={`text-center mt-10 sm:mt-12 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Link href="/timeline">
              <button className="group relative bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 bg-[length:200%_100%] hover:bg-right text-white text-lg sm:text-xl px-10 sm:px-14 py-4 sm:py-5 font-bold rounded-2xl transition-all duration-500 shadow-xl shadow-emerald-500/25 hover:shadow-2xl hover:shadow-emerald-500/40 hover:scale-105 active:scale-95">
                <span className="flex items-center gap-3">
                  <Play className="h-6 w-6 group-hover:animate-pulse" />
                  Let&apos;s Go! 🚀
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                {/* Shine effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </Link>
            
            <p className="text-sm text-slate-400 mt-4 flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              No sign-up needed • Jump right in!
            </p>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
              </span>
              <span>Built for teens, by AI 🤖</span>
              <span className="hidden sm:inline text-slate-600">|</span>
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
                className="px-4 py-2 bg-slate-800/60 backdrop-blur border border-slate-700/50 rounded-full text-sm text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 transition-all cursor-default"
              >
                {feature}
              </span>
            ))}
          </div>

          {/* Upcoming Features Preview - Teaser Section */}
          <div className={`mt-10 sm:mt-12 transition-all duration-1000 delay-750 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-slate-800/30 backdrop-blur rounded-2xl p-6 border border-slate-700/50">
              <UpcomingFeatures variant="compact" maxItems={4} />
              
              {/* Roadmap Teaser Banner */}
              <div className="mt-6 pt-6 border-t border-slate-700/50">
                <RoadmapTeaser variant="banner" maxItems={3} />
              </div>
              
              {/* Asset Class Mastery Preview */}
              <div className="mt-6 pt-6 border-t border-slate-700/50">
                <AssetClassMastery variant="compact" />
              </div>
              
              {/* Feature Wisdom Showcase - Shows how features connect to learning */}
              <div className="mt-6 pt-6 border-t border-slate-700/50">
                <FeatureWisdomShowcase variant="carousel" />
              </div>

              {/* Wisdom Library Teaser */}
              <div className="mt-6 pt-6 border-t border-slate-700/50">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1">
                    <DailyWisdom compact showControls={false} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link href="/library">
                      <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-amber-500/25">
                        <BookOpen className="h-5 w-5" />
                        Explore Wealth Library
                      </button>
                    </Link>
                    <p className="text-xs text-slate-400 text-center">
                      Learn from history&apos;s greatest investors
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sponsor & Share Section - Prominent */}
          <div className={`mt-10 sm:mt-12 transition-all duration-1000 delay-800 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Sponsor Card */}
              <div className="relative bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-slate-800/50 rounded-2xl p-6 border border-pink-500/20 backdrop-blur overflow-hidden group hover:border-pink-500/40 transition-colors">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl group-hover:bg-pink-500/20 transition-colors" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="h-5 w-5 text-pink-400" />
                    <h3 className="font-bold text-slate-100">Support Our Mission</h3>
                  </div>
                  <p className="text-sm text-slate-400 mb-4">
                    Help us make financial literacy accessible to every teen. Your support keeps this free!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <a
                      href="https://github.com/sponsors/nuvcai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/40 transition-all hover:scale-105"
                    >
                      <Heart className="h-4 w-4" />
                      Become a Sponsor
                    </a>
                    <a
                      href="https://github.com/nuvcai/MiniFi"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-xl font-medium text-slate-200 transition-all hover:scale-105"
                    >
                      <Github className="h-4 w-4" />
                      Star on GitHub
                    </a>
                  </div>
                </div>
              </div>

              {/* Share Card */}
              <div className="relative bg-gradient-to-br from-cyan-500/10 via-teal-500/5 to-slate-800/50 rounded-2xl p-6 border border-cyan-500/20 backdrop-blur overflow-hidden group hover:border-cyan-500/40 transition-colors">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-colors" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <Share2 className="h-5 w-5 text-cyan-400" />
                    <h3 className="font-bold text-slate-100">Spread the Word</h3>
                  </div>
                  <p className="text-sm text-slate-400 mb-4">
                    Know a teen who&apos;d love this? Share it with friends, parents, and teachers!
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {/* Twitter/X */}
                    <a
                      href={shareLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-all hover:scale-105"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      X
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
                      LinkedIn
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
                      WhatsApp
                    </a>
                    
                    {/* Copy Link */}
                    <button
                      onClick={handleCopyLink}
                      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all hover:scale-105 ${
                        copied 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-slate-700/50 hover:bg-slate-700 text-slate-200 border border-slate-600/50'
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
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Experience Teaser */}
          <div className={`mt-8 transition-all duration-1000 delay-850 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Premium Teaser */}
              <SupportTeaser variant="compact" />
              
              {/* Newsletter Signup */}
              <NewsletterSignup variant="compact" source="homepage" />
            </div>
            
            {/* Full Support Page Link */}
            <div className="mt-4 text-center">
              <Link 
                href="/support"
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-pink-400 transition-colors group"
              >
                <Crown className="h-4 w-4" />
                <span>View all sponsor perks & benefits</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Footer / MVP Badge */}
          <div className={`mt-10 sm:mt-12 pb-6 transition-all duration-1000 delay-900 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-medium text-slate-400">
                  MVP Preview • AWS AI Hackathon 2025
                </span>
              </div>
              
              <p className="text-sm text-slate-500">
                Made with 💚 by{" "}
                <a href="https://nuvc.ai" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 hover:underline">
                  NUVC.AI
                </a>
                {" "}× Tick.AI for teens everywhere
              </p>
              
              <div className="flex items-center justify-center gap-4 text-xs text-slate-600">
                <a href="https://nuvc.ai" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 transition-colors">About NUVC</a>
                <span>•</span>
                <a href="https://wadeinstitute.org.au" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 transition-colors">Wade Institute</a>
                <span>•</span>
                <Link href="/support" className="hover:text-slate-400 transition-colors">Support Us</Link>
                <span>•</span>
                <a href="mailto:hello@nuvc.ai" className="hover:text-slate-400 transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
