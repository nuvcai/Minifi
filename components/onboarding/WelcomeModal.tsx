/**
 * WelcomeModal — Apple-inspired First-time User Onboarding
 * 
 * Clean, minimal introduction with save progress option
 */

"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ChevronRight,
  Play,
  Mail,
  Check,
  Trophy,
  Flame,
  Users,
} from "lucide-react";

interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
  onStartPlaying: () => void;
}

export function WelcomeModal({ open, onClose, onStartPlaying }: WelcomeModalProps) {
  const [step, setStep] = useState<"intro" | "save">("intro");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleContinue = () => {
    setStep("save");
  };

  const handleSkipSave = () => {
    onClose();
    onStartPlaying();
  };

  const handleSaveProgress = async () => {
    if (!email || isSaving) return;
    
    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Save email to localStorage
      localStorage.setItem('minifi_user_email', email.toLowerCase());
      
      // Initialize streak data
      const today = new Date().toDateString();
      localStorage.setItem('minifi_streak_data', JSON.stringify({
        currentStreak: 1,
        lastClaimDate: today,
        todayClaimed: false,
        totalXP: 0,
      }));
      
      // Sync to server
      await fetch('/api/streak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync',
          email: email.toLowerCase(),
          streakData: {
            totalXP: 0,
            playerLevel: 1,
            completedMissions: [],
          },
        }),
      }).catch(() => {});
      
      setSaved(true);
      
      setTimeout(() => {
        onClose();
        onStartPlaying();
      }, 1500);
    } catch {
      // Continue anyway
      onClose();
      onStartPlaying();
    }
    
    setIsSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-[#1A1A1A] border border-black/[0.06] dark:border-white/[0.08] p-0 overflow-hidden">
        
        {step === "intro" ? (
          <>
            {/* Header */}
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-violet-500 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Welcome to Mini.Fi
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Learn to build wealth through interactive missions based on real market events.
              </p>
            </div>
            
            {/* Features */}
            <div className="px-8 pb-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.04]">
                  <Trophy className="h-5 w-5 text-amber-500 mb-2" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">6 Missions</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Historic market events</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.04]">
                  <Flame className="h-5 w-5 text-orange-500 mb-2" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Daily Streaks</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Earn bonus rewards</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.04]">
                  <Users className="h-5 w-5 text-violet-500 mb-2" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">AI Coaches</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">4 unique mentors</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.04]">
                  <Sparkles className="h-5 w-5 text-emerald-500 mb-2" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Earn iii</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Climb the leagues</p>
                </div>
              </div>
            </div>
            
            {/* Action */}
            <div className="p-6 border-t border-black/[0.04] dark:border-white/[0.06]">
              <Button
                onClick={handleContinue}
                className="w-full py-5 bg-violet-500 hover:bg-violet-600 text-white font-medium text-base"
              >
                Get Started
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Save Progress Step */}
            <div className="p-8 text-center">
              {saved ? (
                <>
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                    <Check className="h-8 w-8 text-emerald-500" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Progress Saved!
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    Your iii tokens and streak will be saved to this email.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-emerald-500 flex items-center justify-center">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                  
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Save Your Progress
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Enter your email to save your iii tokens, streaks, and achievements.
                  </p>
                  
                  {/* Email Input */}
                  <div className="relative mb-4">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all"
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveProgress()}
                    />
                  </div>
                  
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
                    We'll only use this to save your progress. No spam, ever.
                  </p>
                </>
              )}
            </div>
            
            {/* Actions */}
            {!saved && (
              <div className="p-6 pt-0 space-y-3">
                <Button
                  onClick={handleSaveProgress}
                  disabled={!email || isSaving}
                  className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-base disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save & Start Playing"}
                </Button>
                
                <button
                  onClick={handleSkipSave}
                  className="w-full text-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 py-2 transition-colors"
                >
                  Skip for now
                </button>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default WelcomeModal;
