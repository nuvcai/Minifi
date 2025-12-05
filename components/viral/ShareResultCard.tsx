/**
 * ShareResultCard - Viral sharing component after mission completion
 * 
 * Encourages users to share their results and earn XP rewards.
 * Implements viral moments defined in marketingMessages.ts
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
} from "lucide-react";
import { SHARE_REWARDS, calculateShareReward, claimShareReward } from "@/lib/marketing";
import { InlineFloatingXp } from "@/components/gamification/FloatingXp";

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
  color: string;
  hoverColor: string;
  key: string;
}> = {
  twitter: { 
    icon: <Twitter className="h-4 w-4" />, 
    label: "X (Twitter)", 
    color: "bg-black text-white",
    hoverColor: "hover:bg-gray-800",
    key: "twitter"
  },
  whatsapp: { 
    icon: <MessageCircle className="h-4 w-4" />, 
    label: "WhatsApp", 
    color: "bg-emerald-500 text-white",
    hoverColor: "hover:bg-emerald-600",
    key: "whatsapp"
  },
  linkedin: { 
    icon: <Linkedin className="h-4 w-4" />, 
    label: "LinkedIn", 
    color: "bg-blue-600 text-white",
    hoverColor: "hover:bg-blue-700",
    key: "linkedin"
  },
  email: { 
    icon: <Mail className="h-4 w-4" />, 
    label: "Email", 
    color: "bg-violet-500 text-white",
    hoverColor: "hover:bg-violet-600",
    key: "email"
  },
  copy_link: { 
    icon: <Copy className="h-4 w-4" />, 
    label: "Copy Link", 
    color: "bg-gray-200 text-gray-800",
    hoverColor: "hover:bg-gray-300",
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
    
    const cta = "minifi.app - Learn investing through history (free)";
    const hashtags = "#MiniFi #FinLit #GenZInvestor";
    
    if (platform === "twitter") {
      return `${baseText}\n\n${flexLine}\n\n${cta} ${hashtags}`;
    } else if (platform === "linkedin") {
      return `${baseText}\n\nMini.Fi taught me something most finance courses skip: actual market history. Not theory - what REALLY happened during crashes and how smart money positioned.\n\nEvery generation has wealth-building moments. Understanding history helps you spot yours.\n\n${cta}`;
    } else if (platform === "whatsapp" || platform === "email") {
      return `${baseText}\n\n${flexLine}\n\nYou should try this - way better than guessing with real money: ${cta}`;
    }
    return baseText;
  };

  // Generate share URL
  const getShareUrl = (): string => {
    const baseUrl = "https://minifi.app";
    const refCode = `share_${Date.now().toString(36)}`;
    return `${baseUrl}/timeline?ref=${refCode}&utm_source=share&utm_medium=social`;
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
      <div className="p-4 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-violet-500" />
            <span className="font-medium text-gray-800">Share & Earn 🪙</span>
          </div>
          <Button
            size="sm"
            onClick={() => setShowShareModal(true)}
            className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600"
          >
            <Gift className="h-4 w-4 mr-1" />
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
    <Card className="bg-gradient-to-br from-violet-50 via-white to-indigo-50 border-2 border-violet-200 overflow-hidden">
      {/* Decorative header */}
      <div className="h-2 bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-500" />
      
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Share2 className="h-5 w-5 text-violet-500" />
          Share Your Journey
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Incentive message */}
        <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-violet-100">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-gray-800">Earn 🪙 for sharing!</p>
            <p className="text-sm text-gray-600">
              Help friends learn investing and get rewarded. Every share helps build financial literacy! 🎓
            </p>
          </div>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(platformConfig).slice(0, 4).map(([key, config]) => {
            const reward = getRewardDisplay(key);
            return (
              <Button
                key={key}
                onClick={() => handleShare(key)}
                className={`${config.color} ${config.hoverColor} relative`}
                disabled={!reward.canClaim}
              >
                {config.icon}
                <span className="ml-2">{config.label}</span>
                {reward.canClaim && (
                  <Badge className="absolute -top-2 -right-2 bg-amber-400 text-amber-900 text-xs border-0">
                    +{reward.xp}
                  </Badge>
                )}
                {!reward.canClaim && (
                  <div className="absolute -top-2 -right-2 flex items-center gap-0.5 bg-gray-600 text-white text-xs px-1.5 py-0.5 rounded-full">
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
          className="w-full"
          onClick={() => handleShare("copy_link")}
        >
          {copiedLink ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2 text-emerald-500" />
              Link Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy Shareable Link
              <Badge className="ml-2 bg-amber-100 text-amber-700 border-0">+10 🪙</Badge>
            </>
          )}
        </Button>

        {/* Referral tease */}
        <div className="flex items-center justify-center gap-2 pt-2 border-t border-violet-100 text-sm text-violet-600">
          <Users className="h-4 w-4" />
          <span>Invite 3 friends to unlock bonus rewards!</span>
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
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-violet-500" />
            Share & Earn 🪙
          </DialogTitle>
          <DialogDescription>
            Share your progress and earn 🪙 iii rewards!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {Object.entries(platforms).map(([key, config]) => {
            const reward = getRewardDisplay(key);
            const isShared = sharedPlatform === key;
            
            return (
              <Button
                key={key}
                onClick={() => handleShare(key)}
                className={`w-full justify-between ${config.color} ${config.hoverColor}`}
                disabled={!reward.canClaim || isShared}
              >
                <div className="flex items-center gap-2">
                  {config.icon}
                  <span>{config.label}</span>
                </div>
                
                {isShared && showXpAnimation ? (
                  <Badge className="bg-emerald-400 text-emerald-900">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    +{earnedXp} 🪙
                  </Badge>
                ) : !reward.canClaim ? (
                  <div className="flex items-center gap-1 text-xs opacity-75">
                    <Clock className="h-3 w-3" />
                    {reward.cooldown}m
                  </div>
                ) : (
                  <Badge className="bg-amber-400/80 text-amber-900">
                    +{reward.xp} 🪙
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>

        <p className="text-xs text-center text-gray-500 mt-2">
          💡 Higher rewards for LinkedIn and Email shares!
        </p>
      </DialogContent>
    </Dialog>
  );
}

export default ShareResultCard;

