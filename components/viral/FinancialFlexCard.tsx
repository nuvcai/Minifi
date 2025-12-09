'use client';

/**
 * 💎 FINANCIAL FLEX CARD - Instagram-worthy shareable achievement cards
 * 
 * These are designed to make users look SMART and ACCOMPLISHED
 * when shared on social media. The key insight: people share to
 * build their identity, not to help companies market.
 * 
 * Visual Design: Supports BOTH light and dark themes with
 * Apple-inspired aesthetics and Gen Z gradient vibes.
 */

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Download,
  Share2,
  Sparkles,
  Trophy,
  Flame,
  Crown,
  Sun,
  Moon,
} from 'lucide-react';

// MiniFi website URL
const MINIFI_URL = "https://minifi.games";

interface FinancialFlexCardProps {
  // User info
  userName: string;
  userAvatar?: string;
  userLevel: number;
  userStreak: number;
  
  // Achievement data
  achievementType: 'mission_complete' | 'level_up' | 'streak_milestone' | 'quiz_ace' | 'badge_earned';
  
  // Mission specific
  missionYear?: number;
  missionTitle?: string;
  returnPercent?: number;
  performance?: 'profit' | 'loss';
  
  // Badge specific
  badgeName?: string;
  badgeEmoji?: string;
  
  // Quote/wisdom learned
  wisdomQuote?: string;
  
  // Ranking
  percentileRank?: number; // e.g., 95 means top 5%
  
  // Callbacks
  onShare?: (platform: string) => void;
  onDownload?: () => void;
}

export function FinancialFlexCard({
  userName,
  userAvatar: _userAvatar,
  userLevel,
  userStreak,
  achievementType,
  missionYear,
  missionTitle,
  returnPercent = 0,
  performance = 'profit',
  badgeName,
  badgeEmoji,
  wisdomQuote,
  percentileRank,
  onShare,
  onDownload,
}: FinancialFlexCardProps) {
  // _userAvatar reserved for future custom avatar display
  void _userAvatar;
  
  const [showModal, setShowModal] = useState(false);
  const [cardTheme, setCardTheme] = useState<'dark' | 'light'>('dark');
  const cardRef = useRef<HTMLDivElement>(null);

  // Generate achievement headline based on type
  const getHeadline = (): { main: string; sub: string; emoji: string } => {
    switch (achievementType) {
      case 'mission_complete':
        return {
          main: performance === 'profit' 
            ? `+${returnPercent?.toFixed(1)}% RETURN`
            : 'WISDOM EARNED',
          sub: `${missionYear} ${missionTitle}`,
          emoji: performance === 'profit' ? '📈' : '🧠',
        };
      case 'level_up':
        return {
          main: `LEVEL ${userLevel}`,
          sub: 'Investor Achieved',
          emoji: '🚀',
        };
      case 'streak_milestone':
        return {
          main: `${userStreak} DAYS`,
          sub: 'Learning Streak',
          emoji: '🔥',
        };
      case 'quiz_ace':
        return {
          main: '100% SCORE',
          sub: 'Perfect Quiz',
          emoji: '🎯',
        };
      case 'badge_earned':
        return {
          main: badgeName || 'Badge Earned',
          sub: 'Achievement Unlocked',
          emoji: badgeEmoji || '🏆',
        };
      default:
        return {
          main: 'ACHIEVEMENT',
          sub: 'Unlocked',
          emoji: '✨',
        };
    }
  };

  const headline = getHeadline();

  // Generate flex message (the "brag")
  const getFlexMessage = (): string => {
    if (wisdomQuote) return `"${wisdomQuote}"`;
    
    switch (achievementType) {
      case 'mission_complete':
        return performance === 'profit'
          ? 'Learning from history pays off 💰'
          : 'Every loss is a lesson learned 💎';
      case 'level_up':
        return 'Building financial wisdom, one level at a time';
      case 'streak_milestone':
        return 'Consistency is the key to wealth';
      case 'quiz_ace':
        return 'Knowledge is the best investment';
      case 'badge_earned':
        return 'Another step towards financial mastery';
      default:
        return 'Growing smarter about money';
    }
  };

  const handleShare = async (platform: string) => {
    onShare?.(platform);
    
    const shareText = `${headline.emoji} ${headline.main} on MiniFi!\n\n${getFlexMessage()}\n\nminifi.games - Learn investing through history`;
    
    if (platform === 'native' && navigator.share) {
      try {
        await navigator.share({
          title: `${headline.main} on MiniFi`,
          text: shareText,
          url: MINIFI_URL,
        });
      } catch {
        // User cancelled
      }
    } else if (platform === 'twitter') {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
        '_blank'
      );
    } else if (platform === 'instagram') {
      // For Instagram, we'd need to trigger download and prompt user
      handleDownload();
    }
  };

  const handleDownload = async () => {
    onDownload?.();
    // In production, this would use html-to-image or similar
    // For now, we'll show instructions
    alert('📸 Screenshot this card to save and share on Instagram!');
  };

  return (
    <>
      {/* Trigger Button */}
      <Button
        onClick={() => setShowModal(true)}
        variant="outline"
        className="border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-950/50"
      >
        <Sparkles className="h-4 w-4 mr-2" />
        Create Flex Card
      </Button>

      {/* Card Preview Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md p-0 bg-transparent border-0 shadow-none">
          <DialogHeader className="sr-only">
            <DialogTitle>Financial Flex Card</DialogTitle>
          </DialogHeader>

          {/* The Actual Flex Card */}
          <div
            ref={cardRef}
            className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Background - Theme dependent */}
            {cardTheme === 'dark' ? (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/30 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/30 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-50" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-300/40 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-300/40 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl" />
              </>
            )}
            
            {/* Content */}
            <div className={`relative h-full flex flex-col p-6 ${cardTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {/* Header - Logo & User */}
              <div className="flex items-center justify-between mb-auto">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-violet-500/30">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">@{userName}</p>
                    <p className={`text-xs ${cardTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Level {userLevel}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500">
                    minifi
                  </p>
                  <p className={`text-[10px] ${cardTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>.games</p>
                </div>
              </div>

              {/* Main Achievement */}
              <div className="text-center my-8">
                <div className="text-6xl mb-4 drop-shadow-lg">{headline.emoji}</div>
                <h2 className="text-4xl font-black tracking-tight mb-2">
                  <span className={`text-transparent bg-clip-text ${
                    cardTheme === 'dark' 
                      ? 'bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400' 
                      : 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500'
                  }`}>
                    {headline.main}
                  </span>
                </h2>
                <p className={`text-lg font-medium ${cardTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{headline.sub}</p>
              </div>

              {/* Flex Quote */}
              <div className="text-center mb-6">
                <p className={`text-sm italic ${cardTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  &ldquo;{getFlexMessage()}&rdquo;
                </p>
              </div>

              {/* Stats Footer */}
              <div className="flex items-center justify-center gap-4 mt-auto">
                {userStreak > 0 && (
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                    cardTheme === 'dark' ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'
                  }`}>
                    <Flame className="h-4 w-4" />
                    <span className="text-sm font-bold">{userStreak}d</span>
                  </div>
                )}
                {percentileRank && percentileRank >= 50 && (
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                    cardTheme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    <Crown className="h-4 w-4" />
                    <span className="text-sm font-bold">Top {100 - percentileRank}%</span>
                  </div>
                )}
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                  cardTheme === 'dark' ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-100 text-violet-600'
                }`}>
                  <Trophy className="h-4 w-4" />
                  <span className="text-sm font-bold">Lvl {userLevel}</span>
                </div>
              </div>

              {/* Watermark */}
              <div className={`absolute bottom-3 right-4 text-[10px] font-medium ${cardTheme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>
                minifi.games
              </div>
            </div>
          </div>

          {/* Share Actions - Below Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 mt-4 space-y-3 border border-slate-200 dark:border-slate-800">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Share your achievement
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCardTheme(cardTheme === 'dark' ? 'light' : 'dark')}
                className="h-8 px-3 border-slate-200 dark:border-slate-700"
              >
                {cardTheme === 'dark' ? (
                  <><Sun className="h-3.5 w-3.5 mr-1.5" /> Light</>
                ) : (
                  <><Moon className="h-3.5 w-3.5 mr-1.5" /> Dark</>
                )}
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={() => handleShare('native')}
                className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white shadow-md shadow-violet-500/25"
              >
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button
                onClick={() => handleShare('twitter')}
                variant="outline"
                className="border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                𝕏
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                +25 🪙 bonus for sharing!
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Quick helper to generate a flex card from mission result
export function MissionFlexCard({
  userName,
  userLevel,
  userStreak,
  missionYear,
  missionTitle,
  returnPercent,
  performance,
  onShare,
}: {
  userName: string;
  userLevel: number;
  userStreak: number;
  missionYear: number;
  missionTitle: string;
  returnPercent: number;
  performance: 'profit' | 'loss';
  onShare?: (platform: string) => void;
}) {
  return (
    <FinancialFlexCard
      userName={userName}
      userLevel={userLevel}
      userStreak={userStreak}
      achievementType="mission_complete"
      missionYear={missionYear}
      missionTitle={missionTitle}
      returnPercent={returnPercent}
      performance={performance}
      onShare={onShare}
    />
  );
}

export default FinancialFlexCard;
