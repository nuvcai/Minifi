/**
 * Mini.Fi - Premium Financial Literacy Game
 * Where History Meets Wealth Wisdom
 * © 2025 NUVC.AI. All Rights Reserved.
 */

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Play, ChevronRight, ArrowRight, BookOpen, 
  Shield, Sparkles, Users, Clock, Award,
  GraduationCap, Lightbulb, Building2, History,
  Menu, X, Trophy, HelpCircle
} from "lucide-react";
import { aiCoaches } from "@/components/data/coaches";
import { wealthEras, foPrinciples, investorWisdom } from "@/components/data/wealthWisdom";

export default function HomePage() {
  const [selectedCoachIndex, setSelectedCoachIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeEraIndex, setActiveEraIndex] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Typewriter state for coach text
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const typewriterTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get full text to display for current coach
  const getCoachDisplayText = (coach: typeof aiCoaches[0]) => {
    return `${coach.description} Investment Philosophy: ${coach.investmentPhilosophy}`;
  };

  // Typewriter effect for coach text
  useEffect(() => {
    const coach = aiCoaches[selectedCoachIndex];
    const fullText = getCoachDisplayText(coach);
    
    // Reset when coach changes
    setDisplayedText("");
    setIsTypingComplete(false);
    setCurrentTextIndex(0);
    
    // Clear any existing timeout
    if (typewriterTimeoutRef.current) {
      clearTimeout(typewriterTimeoutRef.current);
    }
    
    // Start typing animation
    let charIndex = 0;
    const typeChar = () => {
      if (charIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, charIndex + 1));
        setCurrentTextIndex(charIndex + 1);
        charIndex++;
        // Speed: 25ms per character (faster for better UX)
        typewriterTimeoutRef.current = setTimeout(typeChar, 20);
      } else {
        setIsTypingComplete(true);
      }
    };
    
    // Start after a brief delay
    typewriterTimeoutRef.current = setTimeout(typeChar, 300);
    
    return () => {
      if (typewriterTimeoutRef.current) {
        clearTimeout(typewriterTimeoutRef.current);
      }
    };
  }, [selectedCoachIndex]);

  // Auto-advance coach only after typing is complete
  useEffect(() => {
    if (!isTypingComplete) return;
    
    // Wait 3 seconds after typing completes, then move to next coach
    const advanceTimeout = setTimeout(() => {
      setSelectedCoachIndex((prev) => (prev + 1) % aiCoaches.length);
    }, 3000);
    
    return () => clearTimeout(advanceTimeout);
  }, [isTypingComplete]);

  useEffect(() => {
    setIsLoaded(true);
    
    // Era rotation (independent of coach)
    const eraInterval = setInterval(() => {
      setActiveEraIndex((prev) => (prev + 1) % wealthEras.length);
    }, 5000);
    
    return () => {
      clearInterval(eraInterval);
    };
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: "-50px" }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const selectedCoach = aiCoaches[selectedCoachIndex];
  const activeEra = wealthEras[activeEraIndex];

  const stats = [
    { value: "70%", label: "of Australian teens lack financial education" },
    { value: "250+", label: "years of wealth wisdom curated" },
    { value: "6", label: "historic market moments to master" },
    { value: "4", label: "Family Office-trained AI coaches" },
  ];

  const differentiators = [
    {
      icon: <History className="h-6 w-6" />,
      title: "Learn from History",
      description: "Experience Japan's 1990 bubble, the 2008 crash, and more. Real events, real lessons.",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      icon: <Building2 className="h-6 w-6" />,
      title: "Family Office Wisdom",
      description: "Strategies used by wealthy families for generations - now accessible to everyone.",
      gradient: "from-indigo-500 to-violet-500"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Risk-Free Learning",
      description: "Make decisions with virtual money. Learn from mistakes without real consequences.",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "AI-Powered Coaching",
      description: "Four unique AI mentors teach different investment philosophies - find your style.",
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#050507] overflow-x-hidden">
      {/* Animated background - Full viewport coverage */}
      <div className="fixed inset-0 w-screen h-screen pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-violet-950/30 to-transparent" />
        {/* Floating orbs - Responsive sizing */}
        <div className="absolute top-1/4 left-4 sm:left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-4 sm:right-1/4 w-56 sm:w-80 h-56 sm:h-80 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      <div className="relative w-full">
        {/* Navigation */}
        <nav className={`w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/minifi-icon.svg"
                alt="Mini.Fi Icon"
                width={40}
                height={40}
                className="h-8 w-8 sm:h-10 sm:w-10"
              />
              <Image
                src="/minifi-logo.svg"
                alt="Mini.Fi"
                width={100}
                height={32}
                className="h-6 sm:h-8 w-auto hidden sm:block"
              />
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center gap-6">
              <Link href="/library" className="text-sm text-white/70 hover:text-white font-medium transition-colors">
                Learn
              </Link>
              <Link href="/support" className="text-sm text-white/70 hover:text-white font-medium transition-colors">
                Support
              </Link>
              <Link 
                href="/timeline"
                className="group text-sm px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-105 transition-all duration-300"
              >
                Start Free
                <ChevronRight className="inline-block h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            
            {/* Mobile Navigation */}
            <div className="flex sm:hidden items-center gap-3">
              <Link 
                href="/timeline"
                className="text-xs px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold"
              >
                Play Free
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-white/10 text-white touch-manipulation"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="sm:hidden mt-4 p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 animate-in slide-in-from-top-2 duration-200">
              <div className="space-y-1">
                <Link 
                  href="/timeline" 
                  className="flex items-center gap-3 p-3 rounded-xl text-white hover:bg-white/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Play className="h-5 w-5 text-indigo-400" />
                  <div>
                    <p className="font-medium">Play Now</p>
                    <p className="text-xs text-white/60">Start your journey</p>
                  </div>
                </Link>
                <Link 
                  href="/library" 
                  className="flex items-center gap-3 p-3 rounded-xl text-white hover:bg-white/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BookOpen className="h-5 w-5 text-amber-400" />
                  <div>
                    <p className="font-medium">Wisdom Library</p>
                    <p className="text-xs text-white/60">Learn from the greats</p>
                  </div>
                </Link>
                <Link 
                  href="/competition" 
                  className="flex items-center gap-3 p-3 rounded-xl text-white hover:bg-white/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  <div>
                    <p className="font-medium">Competition</p>
                    <p className="text-xs text-white/60">Challenge yourself</p>
                  </div>
                </Link>
                <Link 
                  href="/support" 
                  className="flex items-center gap-3 p-3 rounded-xl text-white hover:bg-white/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <HelpCircle className="h-5 w-5 text-emerald-400" />
                  <div>
                    <p className="font-medium">Help & Support</p>
                    <p className="text-xs text-white/60">Get assistance</p>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section - Mobile First, CTA Above Fold */}
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-24 sm:pb-0">
          <div className={`max-w-5xl mx-auto pt-8 sm:pt-16 pb-12 sm:pb-20 text-center transition-all duration-1000 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            {/* Mobile-First: CTA FIRST (visible immediately) */}
            <div className="sm:hidden mb-8">
              <Link href="/timeline" className="block">
                <button className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white font-bold text-lg shadow-2xl shadow-violet-500/30 active:scale-[0.98] transition-transform touch-manipulation">
                  <Play className="h-6 w-6" />
                  Play Free Now
                  <ChevronRight className="h-5 w-5" />
                </button>
              </Link>
              <p className="mt-3 text-white/60 text-xs flex items-center justify-center gap-2">
                <Shield className="h-4 w-4 text-emerald-400" />
                No sign-up • 100% free • 5 min to start
              </p>
            </div>
            
            {/* Mission Statement - HERO FOCUS */}
            <div className="relative mb-6 sm:mb-12">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
              </div>
              <div className="relative inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-red-500/10 border border-red-500/30">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span className="text-xs sm:text-sm font-medium text-red-300/90">The Problem We're Solving</span>
              </div>
            </div>

            {/* The Big Mission Quote - Responsive sizing */}
            <div className="relative mb-6 sm:mb-16">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/5 via-violet-500/5 to-purple-500/5 rounded-3xl blur-xl" />
              <blockquote className="relative">
                <p className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight">
                  <span className="text-white/90">"</span>
                  <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-red-300 bg-clip-text text-transparent">70%</span>
                  <span className="text-white/80"> of teens lack </span>
                  <span className="text-white/90">financial education.</span>
                </p>
                <p className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mt-2 sm:mt-4 tracking-tight">
                  <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                    We're changing that.
                  </span>
                  <span className="text-white/90">"</span>
                </p>
              </blockquote>
            </div>

            {/* Tagline - Shorter on mobile */}
            <p className="text-sm sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-6 sm:mb-10 leading-relaxed px-2">
              <span className="hidden sm:inline">Not just another finance app. Mini.Fi brings</span>
              <span className="sm:hidden">Learn</span>
              <span className="text-white font-medium"> 250 years of wealth wisdom</span>
              <span className="hidden sm:inline"> from history's greatest investors and</span>
              <span className="sm:hidden"> through</span>
              <span className="text-white font-medium"> Family Office strategies</span>
              <span className="hidden sm:inline"> — all through an immersive game experience.</span>
              <span className="sm:hidden"> in a fun game.</span>
            </p>

            {/* CTA Buttons - Desktop only (mobile CTA is above) */}
            <div className="hidden sm:flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-20 px-4 sm:px-0">
              <Link href="/timeline" className="w-full sm:w-auto">
                <button className="group w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white font-semibold text-base sm:text-lg shadow-2xl shadow-violet-500/20 hover:shadow-violet-500/40 hover:scale-[1.02] transition-all duration-300 touch-manipulation active:scale-[0.98]">
                  <Play className="h-5 w-5" />
                  Play Free Now
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <div className="flex items-center gap-2 text-white/60 text-xs sm:text-sm">
                <Shield className="h-4 w-4 text-emerald-400" />
                No sign-up required • 100% free
              </div>
            </div>

            {/* Quick Stats - Horizontal scroll on mobile */}
            <div className="sm:hidden overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              <div className="flex gap-3 w-max">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className={`flex-shrink-0 w-36 p-4 rounded-2xl bg-white/[0.03] border border-white/10 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  >
                    <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs text-white/70 leading-tight">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-white/40 text-center mt-2">← Swipe to see more →</p>
            </div>
            
            {/* Quick Stats - Grid on desktop */}
            <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className={`p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/30 transition-all duration-500 delay-${index * 100} ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                >
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/70 leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What Makes Us Different */}
          <section 
            id="differentiators"
            ref={(el) => { sectionRefs.current['differentiators'] = el; }}
            className={`max-w-6xl mx-auto py-24 transition-all duration-1000 ${visibleSections.has('differentiators') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
          >
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-sm font-medium mb-6">
                Why Mini.Fi is Different
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
                Not Just Another App
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Curated from the wisdom of history's greatest market moments and the strategies 
                used by Family Offices to preserve wealth across generations.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {differentiators.map((item, index) => (
                <div 
                  key={index}
                  className="group relative p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-1"
                >
                  <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${item.gradient} mb-6 text-white`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-white/70 leading-relaxed">{item.description}</p>
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                </div>
              ))}
            </div>
          </section>

          {/* Historic Eras Timeline */}
          <section 
            id="eras"
            ref={(el) => { sectionRefs.current['eras'] = el; }}
            className={`max-w-6xl mx-auto py-24 transition-all duration-1000 ${visibleSections.has('eras') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
          >
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-sm font-medium mb-6">
                <History className="inline-block h-4 w-4 mr-2" />
                Wealth Through History
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
                Every Generation Has Their Moment
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                From the Industrial Revolution to AI — learn how wealth was built across 250 years of history.
              </p>
            </div>

            {/* Era Showcase */}
            <div className="relative">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Era Selector */}
                <div className="space-y-3">
                  {wealthEras.slice(0, 5).map((era, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveEraIndex(index)}
                      className={`w-full text-left p-4 rounded-2xl transition-all duration-300 ${
                        index === activeEraIndex
                          ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-500/40'
                          : 'bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{era.emoji}</span>
                        <div>
                          <div className={`font-semibold ${index === activeEraIndex ? 'text-amber-300' : 'text-white'}`}>
                            {era.era}
                          </div>
                          <div className={`text-sm ${index === activeEraIndex ? 'text-amber-400/70' : 'text-white/60'}`}>{era.period}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Active Era Details */}
                <div className="relative p-8 rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/5 to-transparent border border-amber-500/30">
                  <div className="absolute top-4 right-4 text-6xl opacity-30">{activeEra.emoji}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">{activeEra.era}</h3>
                  <p className="text-amber-400 text-sm mb-4 font-medium">{activeEra.transformativeTrend}</p>
                  <p className="text-white/80 mb-6 leading-relaxed">{activeEra.whatChanged}</p>
                  
                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-amber-300/80 uppercase tracking-wider">Wealth Creators</div>
                    {activeEra.wealthCreators.slice(0, 2).map((creator, i) => (
                      <div key={i} className="flex items-start gap-2 text-white/80 text-sm">
                        <Award className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                        <span>{creator}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 rounded-xl bg-black/40 border border-amber-500/20">
                    <p className="text-sm text-amber-200 leading-relaxed">
                      {activeEra.forTeens}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* AI Coaches Section */}
          <section 
            id="coaches"
            ref={(el) => { sectionRefs.current['coaches'] = el; }}
            className={`max-w-6xl mx-auto py-24 transition-all duration-1000 ${visibleSections.has('coaches') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
          >
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-sm font-medium mb-6">
                <Users className="inline-block h-4 w-4 mr-2" />
                Your AI Mentors
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
                Learn from Family Office Strategies
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Four AI coaches, each trained on different investment philosophies used by the world's wealthiest families.
              </p>
            </div>

            {/* Mobile: Horizontal Scrollable Coaches */}
            <div className="sm:hidden overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              <div className="flex gap-4 w-max">
                {aiCoaches.map((coach, index) => (
                  <div 
                    key={coach.id}
                    onClick={() => setSelectedCoachIndex(index)}
                    className={`relative flex-shrink-0 w-40 p-4 rounded-2xl cursor-pointer transition-all duration-300 touch-manipulation active:scale-[0.98] ${
                      index === selectedCoachIndex 
                        ? 'bg-gradient-to-br from-indigo-500/25 via-violet-500/15 to-transparent border-2 border-indigo-500/50 shadow-lg shadow-indigo-500/20'
                        : 'bg-white/[0.03] border border-white/10'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`relative mb-3 ${index === selectedCoachIndex ? 'scale-110' : ''} transition-transform duration-300`}>
                        <Image
                          src={coach.avatar}
                          alt={coach.name}
                          width={64}
                          height={64}
                          className="rounded-full"
                        />
                        {index === selectedCoachIndex && (
                          <div className="absolute inset-0 rounded-full ring-2 ring-indigo-400 ring-offset-2 ring-offset-[#050507]" />
                        )}
                      </div>
                      <h3 className="font-semibold text-white text-sm mb-0.5">{coach.name}</h3>
                      <p className="text-xs text-indigo-400 font-medium mb-2">{coach.personality}</p>
                      <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${
                        coach.riskTolerance === 'conservative' ? 'bg-blue-500/25 text-blue-300' :
                        coach.riskTolerance === 'moderate' ? 'bg-green-500/25 text-green-300' :
                        coach.riskTolerance === 'aggressive' ? 'bg-orange-500/25 text-orange-300' :
                        'bg-red-500/25 text-red-300'
                      }`}>
                        {coach.riskTolerance.charAt(0).toUpperCase() + coach.riskTolerance.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-white/40 text-center mt-2">← Swipe to select coach →</p>
            </div>

            {/* Desktop: Grid Layout */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {aiCoaches.map((coach, index) => (
                <div 
                  key={coach.id}
                  onClick={() => setSelectedCoachIndex(index)}
                  className={`relative p-6 rounded-3xl cursor-pointer transition-all duration-500 ${
                    index === selectedCoachIndex 
                      ? 'bg-gradient-to-br from-indigo-500/25 via-violet-500/15 to-transparent border-2 border-indigo-500/50 scale-[1.02] shadow-lg shadow-indigo-500/10'
                      : 'bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`relative mb-4 ${index === selectedCoachIndex ? 'scale-110' : ''} transition-transform duration-500`}>
                      <Image
                        src={coach.avatar}
                        alt={coach.name}
                        width={80}
                        height={80}
                        className="rounded-full"
                      />
                      {index === selectedCoachIndex && (
                        <div className="absolute inset-0 rounded-full ring-2 ring-indigo-400 ring-offset-2 ring-offset-[#050507]" />
                      )}
                    </div>
                    <h3 className="font-semibold text-white text-lg mb-1">{coach.name}</h3>
                    <p className="text-sm text-indigo-400 font-medium mb-3">{coach.personality}</p>
                    <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                      coach.riskTolerance === 'conservative' ? 'bg-blue-500/25 text-blue-300 border border-blue-500/30' :
                      coach.riskTolerance === 'moderate' ? 'bg-green-500/25 text-green-300 border border-green-500/30' :
                      coach.riskTolerance === 'aggressive' ? 'bg-orange-500/25 text-orange-300 border border-orange-500/30' :
                      'bg-red-500/25 text-red-300 border border-red-500/30'
                    }`}>
                      {coach.riskTolerance.charAt(0).toUpperCase() + coach.riskTolerance.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Coach Detail - with Typewriter Effect */}
            <div className="mt-8 p-8 rounded-3xl bg-gradient-to-r from-indigo-500/15 via-violet-500/10 to-purple-500/15 border border-indigo-500/30 relative overflow-hidden">
              {/* Progress bar showing typing progress */}
              <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-100" 
                style={{ width: `${(currentTextIndex / getCoachDisplayText(selectedCoach).length) * 100}%` }} 
              />
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Image
                      src={selectedCoach.avatar}
                      alt={selectedCoach.name}
                      width={56}
                      height={56}
                      className="rounded-full ring-2 ring-indigo-400/50"
                    />
                    <div>
                      <h3 className="text-2xl font-bold text-white">{selectedCoach.name}</h3>
                      <p className="text-sm text-indigo-400 font-medium">{selectedCoach.personality}</p>
                    </div>
                  </div>
                  
                  {/* Typewriter text display */}
                  <div className="min-h-[140px] relative">
                    <p className="text-indigo-200 leading-relaxed">
                      {displayedText}
                      {!isTypingComplete && (
                        <span className="inline-block w-0.5 h-5 bg-indigo-400 ml-0.5 animate-pulse" />
                      )}
                    </p>
                    {isTypingComplete && (
                      <div className="absolute bottom-0 right-0 flex items-center gap-1 text-xs text-indigo-400/60">
                        <span>Next coach in 3s</span>
                        <Sparkles className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-5 rounded-xl bg-black/40 border border-white/10">
                    <div className="text-sm font-semibold text-white/70 mb-2">Historical Hero</div>
                    <p className="text-white/90 text-sm leading-relaxed">{selectedCoach.historicalHero}</p>
                  </div>
                  <div className="p-5 rounded-xl bg-indigo-500/15 border border-indigo-500/30">
                    <div className="text-sm font-semibold text-indigo-300 mb-2">Favorite Quote</div>
                    <p className="text-white italic text-sm leading-relaxed">"{selectedCoach.favoriteQuote}"</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Family Office Principles */}
          <section 
            id="principles"
            ref={(el) => { sectionRefs.current['principles'] = el; }}
            className={`max-w-6xl mx-auto py-24 transition-all duration-1000 ${visibleSections.has('principles') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
          >
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-medium mb-6">
                <Building2 className="inline-block h-4 w-4 mr-2" />
                Family Office Secrets
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
                Wisdom of Generational Wealth
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                The exact principles used by Family Offices to preserve and grow wealth across generations.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foPrinciples.map((principle, index) => (
                <div 
                  key={index}
                  className="group p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.05] transition-all duration-500"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20">
                      {principle.number}
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-emerald-300 transition-colors leading-tight">{principle.principle}</h3>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed mb-4">{principle.explanation}</p>
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="text-xs font-semibold text-emerald-400 mb-1.5 uppercase tracking-wide">For Teens</div>
                    <p className="text-white/80 text-sm leading-relaxed">{principle.howTeensCanApplyIt}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Investor Wisdom Quotes */}
          <section 
            id="quotes"
            ref={(el) => { sectionRefs.current['quotes'] = el; }}
            className={`max-w-4xl mx-auto py-24 transition-all duration-1000 ${visibleSections.has('quotes') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
          >
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-2 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-sm font-medium mb-6">
                <Lightbulb className="inline-block h-4 w-4 mr-2" />
                Words of Wisdom
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                From the World's Greatest Investors
              </h2>
          </div>

            <div className="space-y-6">
              {investorWisdom.slice(0, 3).map((wisdom, index) => (
                <div 
                  key={index}
                  className="p-8 rounded-3xl bg-gradient-to-r from-purple-500/15 via-violet-500/10 to-indigo-500/15 border border-purple-500/30"
                >
                  <blockquote className="text-xl sm:text-2xl font-medium text-white mb-5 italic leading-relaxed">
                    "{wisdom.quote}"
                  </blockquote>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <div className="font-semibold text-purple-300 text-lg">{wisdom.investor}</div>
                      <div className="text-sm text-white/60">{wisdom.backgroundStory}</div>
                    </div>
                    <div className="text-sm text-white/80 max-w-md bg-black/30 px-4 py-2 rounded-lg">
                      <span className="text-purple-400 font-semibold">Lesson:</span> {wisdom.lesson}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* League Competition Preview */}
          <section 
            id="leagues"
            ref={(el) => { sectionRefs.current['leagues'] = el; }}
            className={`max-w-6xl mx-auto py-24 transition-all duration-1000 ${visibleSections.has('leagues') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
          >
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-2 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-sm font-medium mb-6">
                <Trophy className="inline-block h-4 w-4 mr-2" />
                Weekly Leagues
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
                Compete. Climb. Conquer.
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Join weekly league competitions and climb through 5 tiers from Bronze to Diamond.
                Earn 🪙 iii, get promoted, and prove you're the best!
              </p>
            </div>

            {/* League Tiers Preview */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
              {[
                { id: 'bronze', name: 'Bronze', emoji: '🥉', color: 'from-amber-700/30 to-orange-600/30', border: 'border-amber-600/50' },
                { id: 'silver', name: 'Silver', emoji: '🥈', color: 'from-slate-400/30 to-gray-500/30', border: 'border-slate-400/50' },
                { id: 'gold', name: 'Gold', emoji: '🥇', color: 'from-yellow-500/30 to-amber-500/30', border: 'border-yellow-400/50' },
                { id: 'platinum', name: 'Platinum', emoji: '💎', color: 'from-violet-500/30 to-purple-500/30', border: 'border-violet-400/50' },
                { id: 'diamond', name: 'Diamond', emoji: '👑', color: 'from-cyan-500/30 to-blue-500/30', border: 'border-cyan-400/50' },
              ].map((league, index) => (
                <div
                  key={league.id}
                  className={`p-4 rounded-2xl bg-gradient-to-br ${league.color} border ${league.border} text-center transform hover:scale-105 transition-all duration-300`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="text-4xl mb-2 block">{league.emoji}</span>
                  <h4 className="font-bold text-white">{league.name}</h4>
                </div>
              ))}
            </div>

            {/* How It Works */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                  <span className="text-2xl">📈</span>
                </div>
                <h4 className="font-bold text-white mb-2">Earn 🪙 iii</h4>
                <p className="text-white/70 text-sm">Complete missions, maintain streaks, and learn from history to earn iii tokens.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                  <span className="text-2xl">🏆</span>
                </div>
                <h4 className="font-bold text-white mb-2">Compete Weekly</h4>
                <p className="text-white/70 text-sm">Face off against 30 players in your league. Top 10 get promoted each week!</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
                  <span className="text-2xl">👑</span>
                </div>
                <h4 className="font-bold text-white mb-2">Reach Diamond</h4>
                <p className="text-white/70 text-sm">Climb to the top and join the elite Diamond League for exclusive rewards!</p>
              </div>
            </div>

            <div className="text-center">
              <Link href="/competition">
                <button className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] transition-all duration-300">
                  <Trophy className="h-5 w-5" />
                  Join the Competition
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </section>

          {/* Final CTA */}
          <section 
            id="cta"
            ref={(el) => { sectionRefs.current['cta'] = el; }}
            className={`max-w-4xl mx-auto py-24 text-center transition-all duration-1000 ${visibleSections.has('cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
          >
            <div className="relative p-12 rounded-[40px] bg-gradient-to-br from-indigo-500/25 via-violet-500/15 to-purple-500/25 border border-indigo-500/40 overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-40 h-40 bg-indigo-500/30 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl" />
              
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8">
                  <GraduationCap className="h-4 w-4 text-indigo-400" />
                  <span className="text-sm text-white font-medium">Your financial future starts now</span>
              </div>
              
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
                  Join the Next Generation
                  <br />
                  <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                    of Wealth Builders
                  </span>
                </h2>

                <p className="text-lg text-white/80 max-w-xl mx-auto mb-10 leading-relaxed">
                  Every great investor started somewhere. Today, you have access to 250 years of 
                  wealth wisdom — completely free, no sign-up required.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/timeline">
                    <button className="group flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-[#050507] font-bold text-lg hover:bg-white/95 hover:scale-[1.02] shadow-2xl shadow-white/10 transition-all duration-300">
                      <Play className="h-5 w-5" />
                      Start Your Journey
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                  <Link 
                    href="/library"
                    className="flex items-center gap-2 px-6 py-5 text-white/90 hover:text-white font-medium transition-colors"
                  >
                    <BookOpen className="h-5 w-5" />
                    Explore Wisdom Library
                  </Link>
              </div>
              
                <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mt-10 text-sm text-white/70">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-emerald-400" />
                    <span>5 min to start</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-emerald-400" />
                    <span>100% free forever</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-emerald-400" />
                    <span>No account needed</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Mission Reminder */}
          <div className="max-w-3xl mx-auto text-center pb-24">
            <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.02]">
              <p className="text-xl sm:text-2xl font-light text-white/80 leading-relaxed mb-6">
                "The best time to start investing was 20 years ago.
                <br />
                <span className="text-white font-semibold">The second best time is NOW.</span>"
              </p>
              <div className="flex items-center justify-center gap-3">
              <Image
                src="/nuvc-logo.png"
                alt="NUVC.AI"
                width={32}
                height={32}
                  className="rounded-lg"
              />
                <span className="text-sm text-white/60">A NUVC.AI initiative for financial literacy</span>
              </div>
            </div>
          </div>

        </main>

        {/* Sticky Mobile CTA - Always visible while scrolling */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-[#050507] via-[#050507]/95 to-transparent pt-8">
          <Link href="/timeline">
            <button className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white font-bold text-base shadow-2xl shadow-violet-500/40 active:scale-[0.98] transition-transform touch-manipulation">
              <Play className="h-5 w-5" />
              Start Playing Free
              <ChevronRight className="h-5 w-5" />
            </button>
          </Link>
        </div>

        {/* Footer */}
        <footer className="w-full border-t border-white/10 bg-black/40">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src="/favicon.svg"
                    alt="Mini.Fi"
                    width={32}
                    height={32}
                    className="rounded-lg"
                  />
                  <span className="text-lg font-semibold text-white">Mini.Fi</span>
                </div>
                <p className="text-sm text-white/60 leading-relaxed">
                  Teaching the next generation of Australians to build wealth through interactive, 
                  history-based financial education.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Learn</h4>
                <div className="space-y-3">
                  <Link href="/timeline" className="block text-sm text-white/60 hover:text-white transition-colors">Start Playing</Link>
                  <Link href="/library" className="block text-sm text-white/60 hover:text-white transition-colors">Wisdom Library</Link>
                  <Link href="/competition" className="block text-sm text-white/60 hover:text-white transition-colors">Competition Mode</Link>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Support</h4>
                <div className="space-y-3">
                  <Link href="/support" className="block text-sm text-white/60 hover:text-white transition-colors">Help Center</Link>
                  <a href="mailto:support@nuvc.ai" className="block text-sm text-white/60 hover:text-white transition-colors">Contact Us</a>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">About</h4>
                <div className="space-y-3">
                  <a href="https://nuvc.ai" target="_blank" rel="noopener noreferrer" className="block text-sm text-white/60 hover:text-white transition-colors">NUVC.AI</a>
                  <a href="https://github.com/nuvcai/MiniFi" target="_blank" rel="noopener noreferrer" className="block text-sm text-white/60 hover:text-white transition-colors">GitHub</a>
                </div>
              </div>
            </div>
            <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-white/50">
                © 2025 NUVC.AI. All Rights Reserved. Made with ❤️ for Australian teens.
              </div>
                <a 
                  href="https://github.com/nuvcai/MiniFi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
