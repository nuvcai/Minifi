/**
 * GameHeader - Enhanced game navigation
 * Dynamic stats display with animations
 */

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Gift, 
  Star, 
  Menu,
  X,
  Trophy,
  Mail,
  LogIn,
  LogOut,
  Check,
} from "lucide-react";
import { levelTitles } from "@/components/gamification/LevelUpCelebration";
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
  totalScore: number;
  onRewardsClick?: () => void;
}

export function GameHeader({
  playerLevel,
  playerXP,
  totalScore,
  onRewardsClick,
}: GameHeaderProps) {
  const xpToNextLevel = 1000;
  const xpInLevel = playerXP % xpToNextLevel;
  const xpProgress = (xpInLevel / xpToNextLevel) * 100;
  const levelInfo = levelTitles[playerLevel] || levelTitles[1];
  
  const [animatedXP, setAnimatedXP] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Auth state
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [signInEmail, setSignInEmail] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [signInError, setSignInError] = useState("");
  const [signInSuccess, setSignInSuccess] = useState(false);

  // Load user email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('minifi_user_email');
    if (savedEmail) {
      setUserEmail(savedEmail);
    }
  }, []);

  // Handle sign in
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
          // Reload to sync progress
          window.location.reload();
        }, 1500);
      } else {
        setSignInError("No saved progress found. Start playing to save your progress!");
      }
    } catch (error) {
      setSignInError("Unable to sign in. Please try again.");
    }
    
    setIsSigningIn(false);
  };

  // Handle sign out
  const handleSignOut = () => {
    setUserEmail(null);
    localStorage.removeItem('minifi_user_email');
    setShowMobileMenu(false);
  };

  // Animate numbers on mount and when they change
  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const xpStep = (playerXP - animatedXP) / steps;
    const scoreStep = (totalScore - animatedScore) / steps;
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setAnimatedXP(playerXP);
        setAnimatedScore(totalScore);
        clearInterval(interval);
      } else {
        setAnimatedXP(prev => Math.round(prev + xpStep));
        setAnimatedScore(prev => Math.round(prev + scoreStep));
      }
    }, duration / steps);
    
    return () => clearInterval(interval);
  }, [playerXP, totalScore]);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-indigo-100/50 border-b border-indigo-100'
        : 'bg-white/80 backdrop-blur-xl border-b border-gray-100'
    }`}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/minifi-header-logo.png"
              alt="Mini.Fi"
              width={120}
              height={44}
              className="h-11 w-auto group-hover:scale-105 transition-transform"
            />
          </Link>
          
          {/* Desktop Stats */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Sign In / User Status */}
            {userEmail ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200">
                <Check className="h-4 w-4 text-emerald-500" />
                <span className="text-xs text-emerald-700 font-medium truncate max-w-[100px]">{userEmail}</span>
                <button
                  onClick={handleSignOut}
                  className="p-1 rounded-md hover:bg-emerald-100 text-emerald-500 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSignInModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200 text-indigo-600 hover:shadow-lg hover:shadow-indigo-100 hover:scale-105 hover:border-indigo-300 transition-all group"
              >
                <LogIn className="h-4 w-4" />
                <span className="text-sm font-medium">Sign In</span>
              </button>
            )}
            
            {/* Rewards Button - Coming Soon */}
            {onRewardsClick && (
              <button
                onClick={onRewardsClick}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-slate-100 border-2 border-gray-200 text-gray-500 hover:shadow-lg hover:shadow-gray-100 hover:scale-105 hover:border-gray-300 transition-all group relative"
              >
                <Gift className="h-5 w-5 group-hover:animate-bounce text-gray-400" />
                <span className="text-sm font-bold">Rewards</span>
                <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] font-bold bg-indigo-500 text-white rounded-full">Soon</span>
              </button>
            )}
            
            {/* Level & XP Display */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-gradient-to-r from-slate-50 to-indigo-50 shadow-lg shadow-indigo-100/50 border border-indigo-100">
              {/* Animated Level Badge */}
              <div className="relative group cursor-pointer">
                <div className={`absolute inset-0 bg-gradient-to-br ${levelInfo.color} rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity`} />
                <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${levelInfo.color} shadow-lg`}>
                  <span className="text-sm font-black text-white">{playerLevel}</span>
                </div>
                {/* Tooltip */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {levelInfo.title}
                </div>
              </div>
              
              {/* XP Stats */}
              <div>
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span className="text-base font-black text-gray-900">
                    {animatedXP.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">XP</span>
                </div>
                {/* Animated Progress bar */}
                <div className="relative w-24 h-2 mt-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${xpProgress}%` }}
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Score Display */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 shadow-lg shadow-violet-100/50 border border-violet-100">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Score</p>
                <p className="text-base font-black text-violet-600">
                  {animatedScore.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          {/* Mobile Stats & Menu */}
          <div className="flex md:hidden items-center gap-2">
            {/* Compact Level Badge */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50 border border-indigo-100`}>
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${levelInfo.color} flex items-center justify-center shadow`}>
                <span className="text-xs font-black text-white">{playerLevel}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-amber-500" />
                <span className="text-xs font-bold text-gray-900">{(playerXP / 1000).toFixed(1)}k</span>
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {showMobileMenu ? (
                <X className="h-5 w-5 text-gray-600" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Dropdown Menu */}
        {showMobileMenu && (
          <div className="md:hidden mt-3 p-4 rounded-2xl bg-white border border-gray-200 shadow-xl animate-in slide-in-from-top-2 duration-200">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span className="text-xs text-gray-500">XP</span>
                </div>
                <p className="text-lg font-black text-gray-900">{playerXP.toLocaleString()}</p>
                <div className="w-full h-1.5 mt-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
              </div>
              
              <div className="p-3 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="h-4 w-4 text-violet-500" />
                  <span className="text-xs text-gray-500">Score</span>
                </div>
                <p className="text-lg font-black text-violet-600">{totalScore.toLocaleString()}</p>
              </div>
            </div>
            
            {/* Level Info */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-slate-50 to-gray-50 border border-gray-200 mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${levelInfo.color} flex items-center justify-center shadow-lg`}>
                  {levelInfo.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Current Level</p>
                  <p className="font-bold text-gray-900">Level {playerLevel} - {levelInfo.title}</p>
                </div>
              </div>
            </div>
            
            {/* Sign In / User Status - Mobile */}
            {userEmail ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 mb-3">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-emerald-700 font-medium">{userEmail}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-600 text-sm font-medium hover:bg-emerald-200 transition-colors"
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
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold shadow-lg hover:shadow-xl transition-all mb-3"
              >
                <LogIn className="h-5 w-5" />
                <span>Sign In to Save Progress</span>
              </button>
            )}
            
            {/* Rewards Button - Coming Soon */}
            {onRewardsClick && (
              <button
                onClick={() => {
                  onRewardsClick();
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-gray-200 to-slate-300 text-gray-600 font-bold shadow-lg hover:shadow-xl transition-all relative"
              >
                <Gift className="h-5 w-5" />
                <span>Rewards</span>
                <span className="px-2 py-0.5 text-xs font-bold bg-indigo-500 text-white rounded-full ml-1">Coming Soon</span>
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
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-indigo-50 via-white to-violet-50 border-2 border-indigo-200">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Mail className="h-6 w-6 text-indigo-500" />
                <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  Welcome Back!
                </span>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {signInSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Check className="h-8 w-8 text-emerald-600" />
                </div>
                <p className="text-lg font-bold text-emerald-700">Signed In!</p>
                <p className="text-sm text-gray-500">Loading your progress...</p>
              </div>
            ) : (
              <>
                <p className="text-center text-gray-600">
                  Sign in with your email to retrieve your saved streak and XP progress.
                </p>

                {signInError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                    <p className="text-red-600 text-sm text-center">{signInError}</p>
                  </div>
                )}

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      disabled={isSigningIn}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border-2 border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-gray-900 placeholder-gray-400 outline-none transition-all disabled:opacity-50"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSigningIn || !signInEmail}
                    className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-bold text-lg shadow-lg shadow-indigo-200 disabled:opacity-50"
                  >
                    {isSigningIn ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⏳</span>
                        Signing In...
                      </span>
                    ) : (
                      <>
                        <LogIn className="h-5 w-5 mr-2" />
                        Sign In
                      </>
                    )}
                  </Button>
                </form>

                <p className="text-xs text-gray-500 text-center">
                  New here? Just start playing and save your progress anytime!
                </p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
