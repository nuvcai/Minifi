/**
 * GameHeader — Apple-inspired Navigation
 * 
 * Clean, minimal, functional
 * No overwhelming visual elements
 */

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Menu,
  X,
  Mail,
  LogIn,
  LogOut,
  Check,
  User,
  Trophy,
  Sun,
  Moon,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useTheme } from "next-themes";
import { levelTitles } from "@/components/gamification/LevelUpCelebration";
import { SeasonEndCelebration } from "@/components/gamification";
import { useLeague } from "@/hooks/useLeague";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface GameHeaderProps {
  playerLevel: number;
  playerXP: number;
  totalScore?: number;
  weeklyXP?: number;
  onRewardsClick?: () => void;
}

export function GameHeader({
  playerLevel,
  playerXP,
  weeklyXP = 0,
}: GameHeaderProps) {
  const xpToNextLevel = 1000;
  const xpInLevel = playerXP % xpToNextLevel;
  const xpProgress = (xpInLevel / xpToNextLevel) * 100;
  const levelInfo = levelTitles[playerLevel] || levelTitles[1];
  
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { theme, setTheme } = useTheme();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const { 
    league, 
    userRank, 
    zone,
    seasonEndResult,
    showSeasonEnd,
    dismissSeasonEnd,
  } = useLeague();
  
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [signInEmail, setSignInEmail] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [signInError, setSignInError] = useState("");
  const [signInSuccess, setSignInSuccess] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('minifi_user_email');
    if (savedEmail) {
      setUserEmail(savedEmail);
    }
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail || isSigningIn) return;
    
    setIsSigningIn(true);
    setSignInError("");
    
    try {
      const response = await fetch(`/api/streak?email=${encodeURIComponent(signInEmail.toLowerCase())}`);
      const result = await response.json();
      
      if (result.success && result.data && (result.data.totalXP > 0 || result.data.currentStreak > 0)) {
        setUserEmail(signInEmail.toLowerCase());
        localStorage.setItem('minifi_user_email', signInEmail.toLowerCase());
        localStorage.setItem('minifi_streak_data', JSON.stringify({
          currentStreak: result.data.currentStreak || 0,
          todayClaimed: result.data.todayClaimed,
          totalXP: result.data.totalXP || 0,
          lastClaimDate: result.data.lastClaimDate,
        }));
        setSignInSuccess(true);
        setTimeout(() => {
          setShowSignInModal(false);
          setSignInSuccess(false);
          setSignInEmail("");
          window.location.reload();
        }, 1500);
      } else {
        setSignInError("No saved progress found. Start playing to save your progress!");
      }
    } catch {
      setSignInError("Unable to sign in. Please try again.");
    }
    
    setIsSigningIn(false);
  };

  const handleSignOut = () => {
    setUserEmail(null);
    localStorage.removeItem('minifi_user_email');
    setShowMobileMenu(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${
      isScrolled 
        ? 'bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl border-b border-black/[0.04] dark:border-white/[0.06] shadow-sm'
        : 'bg-white/60 dark:bg-transparent backdrop-blur-xl border-b border-black/[0.02] dark:border-white/[0.04]'
    }`}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/minifi-logo.svg"
              alt="Mini.Fi"
              width={100}
              height={36}
              className="h-8 w-auto"
            />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            
            {/* Nav Links */}
            <nav className="flex items-center mr-4">
              <Link 
                href="/leaderboard" 
                className="px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors flex items-center gap-1.5"
              >
                <Trophy className="h-4 w-4" />
                <span>Leaderboard</span>
              </Link>
              <Link 
                href="/profile" 
                className="px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors flex items-center gap-1.5"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </nav>
            
            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                title={theme === "dark" ? "Light mode" : "Dark mode"}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            )}
            
            {/* User Status */}
            {userEmail ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/[0.06]">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-xs text-gray-600 dark:text-gray-300 font-medium truncate max-w-[100px]">{userEmail}</span>
                <button
                  onClick={handleSignOut}
                  className="p-1 rounded hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSignInModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </button>
            )}
            
            {/* Stats Pill */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-gray-100 dark:bg-white/[0.06] border border-black/[0.04] dark:border-white/[0.06]">
              {/* Level */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center text-white text-sm font-bold">
                  {playerLevel}
                </div>
                <div className="hidden lg:block">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Level</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{levelInfo.title}</p>
                </div>
              </div>
              
              {/* Divider */}
              <div className="w-px h-6 bg-gray-200 dark:bg-white/10" />
              
              {/* iii Tokens */}
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {playerXP.toLocaleString()}
                    <span className="text-xs text-amber-500 ml-0.5">iii</span>
                  </p>
                  {/* Progress bar */}
                  <div className="w-16 h-1 mt-0.5 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-violet-500 transition-all duration-500"
                      style={{ width: `${xpProgress}%` }}
                    />
                  </div>
                </div>
              </div>
              
              {/* League Badge */}
              {league && (
                <>
                  <div className="w-px h-6 bg-gray-200 dark:bg-white/10" />
                  <Link 
                    href="/leaderboard"
                    className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                  >
                    <span className="text-lg">{league.emoji}</span>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">#{userRank}</p>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{league.name}</p>
                    </div>
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile */}
          <div className="flex md:hidden items-center gap-2">
            {/* Compact Stats */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/[0.06]">
              <div className="w-6 h-6 rounded bg-violet-500 flex items-center justify-center text-white text-xs font-bold">
                {playerLevel}
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-500" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {(playerXP / 1000).toFixed(1)}k
                </span>
              </div>
              {league && (
                <span className="text-sm">{league.emoji}</span>
              )}
            </div>
            
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
            >
              {showMobileMenu ? (
                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden mt-3 p-4 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-black/[0.04] dark:border-white/[0.06] shadow-lg animate-slide-up">
            {/* Stats Card */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.04] mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-violet-500 flex items-center justify-center text-white text-lg font-bold">
                  {playerLevel}
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Level {playerLevel}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{levelInfo.title}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span className="font-bold text-gray-900 dark:text-white">{playerXP.toLocaleString()} iii</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{Math.round(xpProgress)}% to next</span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-violet-500"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>
            
            {/* League */}
            {league && (
              <Link 
                href="/leaderboard"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.04] mb-2 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{league.emoji}</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{league.name} League</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Rank #{userRank} • {zone === 'promotion' ? '↑ Promotion' : zone === 'danger' ? '↓ Danger' : '✓ Safe'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
            )}
            
            {/* Nav Links */}
            <div className="space-y-1 mb-4">
              <Link 
                href="/leaderboard" 
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors"
              >
                <Trophy className="h-5 w-5 text-amber-500" />
                <span className="font-medium text-gray-900 dark:text-white">Leaderboard</span>
              </Link>
              <Link 
                href="/profile" 
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors"
              >
                <User className="h-5 w-5 text-emerald-500" />
                <span className="font-medium text-gray-900 dark:text-white">Profile</span>
              </Link>
            </div>
            
            {/* Theme Toggle */}
            {mounted && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/[0.04] mb-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Appearance</span>
                <div className="flex items-center gap-1 p-1 rounded-lg bg-white dark:bg-white/[0.06]">
                  <button
                    onClick={() => setTheme("light")}
                    className={`p-1.5 rounded-md transition-colors ${
                      theme === "light" 
                        ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white" 
                        : "text-gray-400"
                    }`}
                  >
                    <Sun className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`p-1.5 rounded-md transition-colors ${
                      theme === "dark" 
                        ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white" 
                        : "text-gray-400"
                    }`}
                  >
                    <Moon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
            
            {/* User */}
            {userEmail ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">{userEmail}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-emerald-600 dark:text-emerald-400 font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowSignInModal(true);
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-violet-500 text-white font-medium"
              >
                <LogIn className="h-4 w-4" />
                Sign In to Save Progress
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Sign In Modal */}
      <Dialog open={showSignInModal} onOpenChange={(open) => {
        setShowSignInModal(open);
        if (!open) {
          setSignInError("");
          setSignInEmail("");
          setSignInSuccess(false);
        }
      }}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-[#1A1A1A] border border-black/[0.06] dark:border-white/[0.08]">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold text-gray-900 dark:text-white">
              Welcome Back
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {signInSuccess ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                  <Check className="h-6 w-6 text-emerald-500" />
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">Signed In!</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading your progress...</p>
              </div>
            ) : (
              <>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Enter your email to retrieve your saved progress.
                </p>

                {signInError && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20">
                    <p className="text-red-600 dark:text-red-400 text-sm text-center">{signInError}</p>
                  </div>
                )}

                <form onSubmit={handleSignIn} className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      disabled={isSigningIn}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all disabled:opacity-50"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSigningIn || !signInEmail}
                    className="w-full py-2.5 bg-violet-500 hover:bg-violet-600 text-white font-medium disabled:opacity-50"
                  >
                    {isSigningIn ? "Signing In..." : "Sign In"}
                  </Button>
                </form>

                <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                  New here? Just start playing — your progress saves automatically!
                </p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <SeasonEndCelebration
        open={showSeasonEnd}
        onClose={dismissSeasonEnd}
        result={seasonEndResult}
        onContinue={dismissSeasonEnd}
      />
    </header>
  );
}
