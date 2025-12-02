/**
 * ViralSharePrompt.tsx - Share prompts triggered by viral moments
 * Integrates with gamification quick wins for maximum virality
 */

"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Share2, 
  Gift, 
  Copy, 
  Check, 
  X,
  Sparkles,
  Trophy,
  ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  viralMoments, 
  referralRewards,
  getReferralRewardForCount,
  getNextReferralMilestone,
  generateShareUrl
} from "@/components/data/marketingMessages";

interface ViralSharePromptProps {
  trigger: string;
  data?: Record<string, string | number>;
  referralCode: string;
  currentReferrals?: number;
  onShare?: (platform: string) => void;
  onDismiss?: () => void;
  variant?: "modal" | "banner" | "inline";
}

export function ViralSharePrompt({
  trigger,
  data = {},
  referralCode,
  currentReferrals = 0,
  onShare,
  onDismiss,
  variant = "modal"
}: ViralSharePromptProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showReferralDetails, setShowReferralDetails] = useState(false);

  // Memoize computed values
  const viralMoment = useMemo(
    () => viralMoments.find(vm => vm.trigger === trigger),
    [trigger]
  );
  const currentReward = useMemo(
    () => getReferralRewardForCount(currentReferrals),
    [currentReferrals]
  );
  const nextReward = useMemo(
    () => getNextReferralMilestone(currentReferrals),
    [currentReferrals]
  );
  const shareUrl = useMemo(
    () => generateShareUrl(referralCode, "copy"),
    [referralCode]
  );

  useEffect(() => {
    if (!viralMoment) return;
    
    const delay = viralMoment.timing === "immediate" ? 500 :
                  viralMoment.timing === "delayed_5s" ? 5000 : 0;
    
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [viralMoment]);

  // Memoized text replacement function
  const replaceData = useCallback((text: string): string => {
    let result = text;
    Object.entries(data).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    });
    return result;
  }, [data]);

  // Handler functions
  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [shareUrl]);

  const handleShare = useCallback((platform: string) => {
    if (!viralMoment) return;
    
    const platformShareUrl = generateShareUrl(referralCode, platform);
    const shareText = replaceData(viralMoment.sharePrompt);
    
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(platformShareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(platformShareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + platformShareUrl)}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'noopener,noreferrer,width=600,height=400');
    }
    onShare?.(platform);
  }, [viralMoment, referralCode, replaceData, onShare]);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    onDismiss?.();
  }, [onDismiss]);

  // Early return after hooks
  if (!viralMoment || !isVisible) return null;

  // Banner variant
  if (variant === "banner") {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-linear-to-r from-purple-600 via-pink-600 to-rose-600 shadow-lg"
        >
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-white animate-pulse" />
              <span className="text-white font-medium">
                {replaceData(viralMoment.sharePrompt)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleShare("twitter")}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-medium transition-colors"
              >
                Share
              </button>
              <button 
                onClick={handleDismiss} 
                className="p-1 text-white/70 hover:text-white"
                aria-label="Dismiss share banner"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Inline variant
  if (variant === "inline") {
    return (
      <div className="p-4 rounded-xl bg-linear-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-purple-500/20">
            <Share2 className="h-5 w-5 text-purple-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white mb-2">
              {replaceData(viralMoment.sharePrompt)}
            </p>
            <p className="text-xs text-slate-400 mb-3">
              {replaceData(viralMoment.referralPrompt)}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleShare("twitter")}
                className="px-3 py-1.5 bg-[#1DA1F2] hover:bg-[#1a8cd8] rounded-lg text-white text-xs font-medium transition-colors"
              >
                Twitter
              </button>
              <button
                onClick={() => handleShare("whatsapp")}
                className="px-3 py-1.5 bg-[#25D366] hover:bg-[#22c55e] rounded-lg text-white text-xs font-medium transition-colors"
              >
                WhatsApp
              </button>
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-xs font-medium transition-colors flex items-center gap-1"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Modal variant (default)
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        onClick={handleDismiss}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-md bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl" />

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white z-10"
            aria-label="Close share dialog"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="relative p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-purple-500 to-pink-500 mb-4">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {replaceData(viralMoment.sharePrompt)}
              </h3>
              <p className="text-sm text-slate-400">
                {replaceData(viralMoment.referralPrompt)}
              </p>
            </div>

            {/* Share buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleShare("twitter")}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1DA1F2] hover:bg-[#1a8cd8] rounded-xl text-white font-medium transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Share on Twitter
              </button>
              <button
                onClick={() => handleShare("whatsapp")}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#22c55e] rounded-xl text-white font-medium transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Share on WhatsApp
              </button>
              <button
                onClick={() => handleShare("linkedin")}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0A66C2] hover:bg-[#004182] rounded-xl text-white font-medium transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Share on LinkedIn
              </button>
            </div>

            {/* Copy link */}
            <div className="flex items-center gap-2 p-3 bg-slate-700/50 rounded-xl mb-4">
              <label htmlFor="share-url" className="sr-only">Share URL</label>
              <input
                id="share-url"
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 bg-transparent text-sm text-slate-300 outline-none"
                aria-label="Referral link"
              />
              <button
                onClick={handleCopyLink}
                aria-label={copied ? "Link copied" : "Copy referral link"}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  copied 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                }`}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>

            {/* Referral progress */}
            <button
              onClick={() => setShowReferralDetails(!showReferralDetails)}
              className="w-full flex items-center justify-between p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-amber-400" />
                <span className="text-sm text-slate-300">
                  {currentReferrals} referrals
                </span>
                {currentReward && (
                  <Badge className="bg-amber-500/20 text-amber-300 text-xs">
                    {currentReward.badge} {currentReward.reward.split(" ")[0]}
                  </Badge>
                )}
              </div>
              {nextReward && (
                <span className="text-xs text-slate-500">
                  {nextReward.referralsRequired - currentReferrals} more for {nextReward.badge}
                </span>
              )}
            </button>

            {/* Expanded referral details */}
            <AnimatePresence>
              {showReferralDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 space-y-2">
                    {referralRewards.map((reward) => (
                      <div
                        key={reward.tier}
                        className={`flex items-center gap-3 p-2 rounded-lg ${
                          currentReferrals >= reward.referralsRequired
                            ? 'bg-emerald-500/10 border border-emerald-500/30'
                            : 'bg-slate-700/20'
                        }`}
                      >
                        <span className="text-xl">{reward.badge}</span>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-slate-200">
                            {reward.reward}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {reward.referralsRequired} referrals • +{reward.xpBonus} XP
                          </p>
                        </div>
                        {currentReferrals >= reward.referralsRequired && (
                          <Check className="h-4 w-4 text-emerald-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Hook to manage viral share state
export function useViralShare() {
  const [activePrompt, setActivePrompt] = useState<{
    trigger: string;
    data: Record<string, string | number>;
  } | null>(null);

  const triggerShare = (trigger: string, data: Record<string, string | number> = {}) => {
    setActivePrompt({ trigger, data });
  };

  const dismissShare = () => {
    setActivePrompt(null);
  };

  return {
    activePrompt,
    triggerShare,
    dismissShare
  };
}

export default ViralSharePrompt;

