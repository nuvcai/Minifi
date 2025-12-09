/**
 * ShareResultCard - Viral sharing component after mission completion
 * 
 * Encourages users to share their results and earn XP rewards.
 * Implements viral moments defined in marketingMessages.ts
 * 
 * Designed for light AND dark themes with Apple-inspired aesthetics.
 */

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Share2,
  Twitter,
  MessageCircle,
  Linkedin,
  Mail,
  Copy,
  CheckCircle,
  Sparkles,
  Gift,
  Users,
  Clock,
  Zap,
} from "lucide-react";
import { SHARE_REWARDS, calculateShareReward, claimShareReward } from "@/lib/marketing";
import { InlineFloatingXp } from "@/components/gamification/FloatingXp";

// MiniFi website URL
const MINIFI_URL = "https://minifi.games";

interface ShareResultCardProps {
  missionTitle: string;
  year: number;
  performance: "profit" | "loss";
  returnPercent: number;
  finalAmount: number;
  lessonLearned: string;
  streakDays?: number;
  level?: number;
  totalXp?: number;
  onShareComplete?: (platform: string, xpEarned: number) => void;
  compact?: boolean;
}

const platformConfig: Record<string, { 
  icon: React.ReactNode; 
  label: string; 
  lightColor: string;
  darkColor: string;
  hoverLight: string;
  hoverDark: string;
  key: string;
}> = {
  twitter: { 
    icon: <Twitter className="h-4 w-4" />, 
    label: "X (Twitter)", 
    lightColor: "bg-slate-900 text-white",
    darkColor: "dark:bg-white dark:text-slate-900",
    hoverLight: "hover:bg-slate-800",
    hoverDark: "dark:hover:bg-slate-100",
    key: "twitter"
  },
  whatsapp: { 
    icon: <MessageCircle className="h-4 w-4" />, 
    label: "WhatsApp", 
    lightColor: "bg-emerald-500 text-white",
    darkColor: "dark:bg-emerald-500 dark:text-white",
    hoverLight: "hover:bg-emerald-600",
    hoverDark: "dark:hover:bg-emerald-400",
    key: "whatsapp"
  },
  linkedin: { 
    icon: <Linkedin className="h-4 w-4" />, 
    label: "LinkedIn", 
    lightColor: "bg-blue-600 text-white",
    darkColor: "dark:bg-blue-500 dark:text-white",
    hoverLight: "hover:bg-blue-700",
    hoverDark: "dark:hover:bg-blue-400",
    key: "linkedin"
  },
  email: { 
    icon: <Mail className="h-4 w-4" />, 
    label: "Email", 
    lightColor: "bg-violet-500 text-white",
    darkColor: "dark:bg-violet-500 dark:text-white",
    hoverLight: "hover:bg-violet-600",
    hoverDark: "dark:hover:bg-violet-400",
    key: "email"
  },
  copy_link: { 
    icon: <Copy className="h-4 w-4" />, 
    label: "Copy Link", 
    lightColor: "bg-slate-100 text-slate-800",
    darkColor: "dark:bg-slate-700 dark:text-slate-200",
    hoverLight: "hover:bg-slate-200",
    hoverDark: "dark:hover:bg-slate-600",
    key: "copy_link"
  },
};

export function ShareResultCard({
  missionTitle,
  year,
  performance,
  returnPercent,
  finalAmount: _finalAmount,
  lessonLearned,
  streakDays = 0,
  level: _level = 1,
  totalXp: _totalXp = 0,
  onShareComplete,
  compact = false,
}: ShareResultCardProps) {
  // Note: _level, _totalXp, _finalAmount reserved for enhanced share cards
  void _level;
  void _totalXp;
  void _finalAmount;
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharedPlatform, setSharedPlatform] = useState<string | null>(null);
  const [showXpAnimation, setShowXpAnimation] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Generate share text with EDUCATIONAL VIRAL HOOKS
  const generateShareText = (platform: string): string => {
    const emoji = performance === "profit" ? "📈" : "🧠";
    
    // Educational framing that makes user look smart
    const educationalHooks: Record<string, { win: string; learn: string }> = {
      "1990": {
        win: `beat Japan's 1990 bubble crash! While most lost 60%, I made ${returnPercent.toFixed(1)}%`,
        learn: `survived Japan's 1990 bubble crash and learned why 'everyone's buying' is a WARNING sign, not a green light`
      },
      "1997": {
        win: `navigated the 1997 Asian Crisis with a ${returnPercent.toFixed(1)}% return! Global diversification FTW`,
        learn: `experienced the 1997 Asian Crisis - learned why rich families NEVER concentrate in one region`
      },
      "2000": {
        win: `avoided the Dot-com bust! Made ${returnPercent.toFixed(1)}% when Nasdaq crashed 78%`,
        learn: `lost money in the Dot-com crash but learned to separate GOOD tech from HYPED tech (hello AI bubble?)`
      },
      "2008": {
        win: `found opportunity in the 2008 crash! ${returnPercent.toFixed(1)}% return while banks collapsed`,
        learn: `survived 2008 and learned: "Be greedy when others are fearful" - Warren Buffett wasn't kidding`
      },
      "2020": {
        win: `crushed COVID investing! ${returnPercent.toFixed(1)}% return by spotting accelerated trends`,
        learn: `learned the COVID investor's question: "What was growing that this crisis ACCELERATES?"`
      },
      "2025": {
        win: `made my AI era bet! Time will tell if ${returnPercent.toFixed(1)}% was the right move`,
        learn: `building my AI era investment thesis - this is OUR generation's defining moment`
      }
    };
    
    const yearKey = year.toString();
    const hook = educationalHooks[yearKey] || {
      win: `gained ${returnPercent.toFixed(1)}% during the ${year} ${missionTitle}`,
      learn: `learned valuable lessons about ${lessonLearned} from the ${missionTitle}`
    };
    
    const resultText = performance === "profit" ? hook.win : hook.learn;
    
    // Add "I'm smarter than most adults" angle for virality
    const flexLine = performance === "profit" 
      ? "Learning investing through history > watching TikTok traders lose money 📚"
      : "Every billionaire has losing trades. Difference? They learn from them 💎";
    
    const baseText = `${emoji} Just ${resultText}`;
    
    const cta = "minifi.games - Learn investing through history (free)";
    const hashtags = "#MiniFi #FinLit #GenZInvestor";
    
    if (platform === "twitter") {
      return `${baseText}\n\n${flexLine}\n\n${cta} ${hashtags}`;
    } else if (platform === "linkedin") {
      return `${baseText}\n\nMiniFi taught me something most finance courses skip: actual market history. Not theory - what REALLY happened during crashes and how smart money positioned.\n\nEvery generation has wealth-building moments. Understanding history helps you spot yours.\n\n${cta}`;
    } else if (platform === "whatsapp" || platform === "email") {
      return `${baseText}\n\n${flexLine}\n\nYou should try this - way better than guessing with real money: ${cta}`;
    }
    return baseText;
  };

  // Generate share URL
  const getShareUrl = (): string => {
    const refCode = `share_${Date.now().toString(36)}`;
    return `${MINIFI_URL}/timeline?ref=${refCode}&utm_source=share&utm_medium=social`;
  };

  // Handle share click
  const handleShare = async (platform: string) => {
    const shareText = generateShareText(platform);
    const shareUrl = getShareUrl();
    
    // Calculate reward
    const rewardInfo = calculateShareReward(platform, 1 + (streakDays * 0.05));
    
    if (!rewardInfo.canClaim) {
      // Show cooldown message
      alert(`You can share on ${platformConfig[platform].label} again in ${rewardInfo.cooldownRemaining} minutes`);
      return;
    }

    // Open share dialog based on platform
    let shareOpened = false;
    
    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          "_blank",
          "width=550,height=420"
        );
        shareOpened = true;
        break;
        
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`,
          "_blank"
        );
        shareOpened = true;
        break;
        
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
          "_blank",
          "width=550,height=500"
        );
        shareOpened = true;
        break;
        
      case "email": {
        const subject = `I just completed a mission in Mini.Fi! 🎮`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`;
        shareOpened = true;
        break;
      }
        
      case "copy_link":
        try {
          await navigator.clipboard.writeText(shareUrl);
          setCopiedLink(true);
          setTimeout(() => setCopiedLink(false), 2000);
          shareOpened = true;
        } catch (e) {
          console.error("Failed to copy link:", e);
        }
        break;
    }
    
    if (shareOpened) {
      // Claim reward
      const xpEarned = claimShareReward(platform);
      setEarnedXp(xpEarned);
      setSharedPlatform(platform);
      setShowXpAnimation(true);
      
      setTimeout(() => {
        setShowXpAnimation(false);
        if (onShareComplete) {
          onShareComplete(platform, xpEarned);
        }
      }, 1500);
    }
  };

  // Get reward info for display
  const getRewardDisplay = (platform: string) => {
    const info = calculateShareReward(platform);
    return {
      xp: SHARE_REWARDS[platform]?.xpAmount || 10,
      canClaim: info.canClaim,
      cooldown: info.cooldownRemaining,
    };
  };

  // Compact version - inline buttons
  if (compact) {
    return (
      <div className="p-4 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/50 dark:to-indigo-950/50 rounded-xl border border-violet-200 dark:border-violet-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
              <Share2 className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium text-slate-800 dark:text-white">Share & Earn 🪙</span>
          </div>
          <Button
            size="sm"
            onClick={() => setShowShareModal(true)}
            className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white shadow-md shadow-violet-500/25"
          >
            <Zap className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>

        <ShareModal
          open={showShareModal}
          onClose={() => setShowShareModal(false)}
          platforms={platformConfig}
          getRewardDisplay={getRewardDisplay}
          handleShare={handleShare}
          sharedPlatform={sharedPlatform}
          showXpAnimation={showXpAnimation}
          earnedXp={earnedXp}
        />
      </div>
    );
  }

  // Full card version
  return (
    <Card className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      {/* Gradient glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-indigo-500/5 dark:from-violet-500/10 dark:to-indigo-500/10" />
      
      {/* Decorative header stripe */}
      <div className="h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />
      
      <CardHeader className="pb-2 relative">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Share2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-slate-900 dark:text-white font-semibold">Share Your Journey</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">Earn rewards for spreading knowledge</p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 relative">
        {/* Incentive message */}
        <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl border border-amber-200/50 dark:border-amber-800/30">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/25">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">Earn 🪙 for sharing!</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Help friends learn investing and get rewarded. Every share builds financial literacy! 🎓
            </p>
          </div>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(platformConfig).slice(0, 4).map(([key, config]) => {
            const reward = getRewardDisplay(key);
            return (
              <Button
                key={key}
                onClick={() => handleShare(key)}
                className={`relative h-12 ${config.lightColor} ${config.darkColor} ${config.hoverLight} ${config.hoverDark} transition-all shadow-sm`}
                disabled={!reward.canClaim}
              >
                {config.icon}
                <span className="ml-2 font-medium">{config.label}</span>
                {reward.canClaim && (
                  <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-400 text-amber-900 text-xs border-0 shadow-md">
                    +{reward.xp}
                  </Badge>
                )}
                {!reward.canClaim && (
                  <div className="absolute -top-2 -right-2 flex items-center gap-0.5 bg-slate-600 dark:bg-slate-700 text-white text-xs px-1.5 py-0.5 rounded-full shadow">
                    <Clock className="h-3 w-3" />
                    {reward.cooldown}m
                  </div>
                )}
              </Button>
            );
          })}
        </div>

        {/* Copy link option */}
        <Button
          variant="outline"
          className="w-full h-11 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          onClick={() => handleShare("copy_link")}
        >
          {copiedLink ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Link Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              <span>Copy Shareable Link</span>
              <Badge className="ml-2 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border-0">+10 🪙</Badge>
            </>
          )}
        </Button>

        {/* Referral tease */}
        <div className="flex items-center justify-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400">
            <Users className="h-4 w-4" />
            <span className="font-medium">Invite 3 friends to unlock bonus rewards!</span>
          </div>
        </div>

        {/* XP Animation */}
        <InlineFloatingXp
          show={showXpAnimation}
          amount={earnedXp}
          type="share"
          onComplete={() => setShowXpAnimation(false)}
        />
      </CardContent>
    </Card>
  );
}

// Share Modal Component
function ShareModal({
  open,
  onClose,
  platforms,
  getRewardDisplay,
  handleShare,
  sharedPlatform,
  showXpAnimation,
  earnedXp,
}: {
  open: boolean;
  onClose: () => void;
  platforms: typeof platformConfig;
  getRewardDisplay: (platform: string) => { xp: number; canClaim: boolean; cooldown: number };
  handleShare: (platform: string) => void;
  sharedPlatform: string | null;
  showXpAnimation: boolean;
  earnedXp: number;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Share2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-slate-900 dark:text-white">Share & Earn 🪙</span>
            </div>
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            Share your progress and earn rewards!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 pt-2">
          {Object.entries(platforms).map(([key, config]) => {
            const reward = getRewardDisplay(key);
            const isShared = sharedPlatform === key;
            
            return (
              <Button
                key={key}
                onClick={() => handleShare(key)}
                className={`w-full h-12 justify-between ${config.lightColor} ${config.darkColor} ${config.hoverLight} ${config.hoverDark} transition-all`}
                disabled={!reward.canClaim || isShared}
              >
                <div className="flex items-center gap-2">
                  {config.icon}
                  <span className="font-medium">{config.label}</span>
                </div>
                
                {isShared && showXpAnimation ? (
                  <Badge className="bg-emerald-400 text-emerald-900 shadow">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    +{earnedXp} 🪙
                  </Badge>
                ) : !reward.canClaim ? (
                  <div className="flex items-center gap-1 text-xs opacity-75">
                    <Clock className="h-3 w-3" />
                    {reward.cooldown}m
                  </div>
                ) : (
                  <Badge className="bg-gradient-to-r from-amber-400 to-orange-400 text-amber-900 border-0 shadow">
                    +{reward.xp} 🪙
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>

        <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-center text-slate-500 dark:text-slate-400">
            💡 Higher rewards for LinkedIn and Email shares!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ShareResultCard;

