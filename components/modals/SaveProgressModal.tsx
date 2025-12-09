/**
 * Save Progress Modal
 * Prompts users to save their progress via email
 * Shows after first mission completion
 * © 2025 NUVC.AI. All Rights Reserved.
 */

"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Mail,
  Sparkles,
  CheckCircle2,
  X,
  Smartphone,
  Gift,
  Loader2,
} from "lucide-react";
import { III_CONFIG } from "@/hooks/useIII";

interface SaveProgressModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (email: string) => Promise<boolean>;
  currentIII?: number;
  completedMissions?: number;
  streakDays?: number;
  lastMissionReward?: number;
}

export function SaveProgressModal({
  open,
  onClose,
  onSave,
  currentIII = 0,
  completedMissions = 0,
  streakDays = 0,
  lastMissionReward = 0,
}: SaveProgressModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await onSave(email);
      if (success) {
        setIsSaved(true);
        // Auto close after showing success
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError("Failed to save. Please try again.");
      }
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    // Save to localStorage that user skipped
    localStorage.setItem("minifi_save_prompt_dismissed", "true");
    onClose();
  };

  // Success state
  if (isSaved) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Progress Saved! 🎉
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your journey is now saved to the cloud. Play on any device!
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <DialogTitle className="text-xl font-bold">
              {lastMissionReward > 0 ? "You Did It! 🏆" : "Save Your Progress! ☁️"}
            </DialogTitle>
          </div>
          <DialogDescription>
            {lastMissionReward > 0 
              ? `You just earned +${lastMissionReward} ${III_CONFIG.symbol}! Save now to keep your progress safe.`
              : "Don't lose your hard-earned iii tokens and achievements!"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Mission Complete Celebration */}
          {lastMissionReward > 0 && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/20 dark:to-teal-500/10 border-2 border-emerald-300 dark:border-emerald-500/40 animate-pulse">
              <div className="flex items-center justify-center gap-3">
                <div className="text-3xl">🎉</div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Mission Complete!
                  </p>
                  <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                    +{lastMissionReward} {III_CONFIG.symbol}
                  </p>
                </div>
                <div className="text-3xl">🎉</div>
              </div>
            </div>
          )}
          
          {/* Current Progress */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-500/10 dark:to-purple-500/10 border border-violet-200 dark:border-violet-500/30">
            <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-3">
              YOUR TOTAL PROGRESS
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentIII}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  {III_CONFIG.symbol} earned
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {completedMissions}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  missions done
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {streakDays}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  day streak
                </p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              <Smartphone className="h-4 w-4 text-emerald-500 flex-shrink-0" />
              <span>Play on any device - phone, tablet, computer</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              <Shield className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <span>Never lose your tokens or badges</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              <Gift className="h-4 w-4 text-amber-500 flex-shrink-0" />
              <span>
                <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-0 mr-1">
                  +50 {III_CONFIG.symbol}
                </Badge>
                bonus for saving!
              </span>
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
            {error && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <X className="h-3 w-3" />
                {error}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleSave}
              disabled={isLoading || !email}
              className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Save Progress & Get +50 {III_CONFIG.symbol}
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="w-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Maybe later
            </Button>
          </div>

          {/* Privacy Note */}
          <p className="text-[10px] text-center text-gray-500 dark:text-gray-500">
            🔒 We respect your privacy. No spam, ever. Your email is only used
            to save your game progress.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SaveProgressModal;
