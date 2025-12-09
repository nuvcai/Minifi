'use client';

/**
 * 🏆 CHALLENGE BUTTON - "Beat My Score" Viral Mechanic
 * 
 * This component creates direct friend challenges - proven to have
 * 3x higher conversion than generic sharing.
 * 
 * Educational Psychology: Competition drives engagement + learning retention
 * Viral Marketing: Personal challenges feel like games, not ads
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Trophy,
  Swords,
  Copy,
  CheckCircle,
  Share2,
  Users,
  Clock,
  Sparkles,
} from 'lucide-react';

interface ChallengeButtonProps {
  // Mission results
  missionId: string;
  missionTitle: string;
  year: number;
  playerReturn: number;
  playerRank?: number; // percentile rank
  
  // User info
  userName: string;
  userAvatar?: string;
  
  // Callbacks
  onChallengeCreated?: (challengeId: string, shareUrl: string) => void;
  onXpEarned?: (amount: number) => void;
}

// Generate unique challenge ID
const generateChallengeId = (): string => {
  return `ch_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 6)}`;
};

export function ChallengeButton({
  missionId,
  missionTitle,
  year,
  playerReturn,
  playerRank,
  userName,
  onChallengeCreated,
  onXpEarned,
}: ChallengeButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [challengeCreated, setcChallengeCreated] = useState(false);
  const [challengeUrl, setChallengeUrl] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Only show challenge button for good performance
  const isChallengeable = playerReturn > 0 || (playerRank && playerRank >= 50);
  
  const createChallenge = () => {
    const challengeId = generateChallengeId();
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://minifi.games';
    
    const url = `${baseUrl}/challenge/${challengeId}?` + 
      `mission=${missionId}&` +
      `year=${year}&` +
      `score=${playerReturn.toFixed(1)}&` +
      `from=${encodeURIComponent(userName)}`;
    
    setChallengeUrl(url);
    setcChallengeCreated(true);
    
    // Award XP for creating challenge
    if (onXpEarned) {
      onXpEarned(25);
    }
    
    if (onChallengeCreated) {
      onChallengeCreated(challengeId, url);
    }
  };
  
  const copyLink = async () => {
    await navigator.clipboard.writeText(challengeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Beat my score on MiniFi! 🏆`,
          text: `I made ${playerReturn > 0 ? '+' : ''}${playerReturn.toFixed(1)}% during the ${year} ${missionTitle}. Think you can beat me? 😏`,
          url: challengeUrl,
        });
      } catch {
        // User cancelled - ignore
      }
    }
  };
  
  const shareToTwitter = () => {
    const text = encodeURIComponent(
      `🏆 I made ${playerReturn > 0 ? '+' : ''}${playerReturn.toFixed(1)}% during the ${year} ${missionTitle} on @MiniFiApp!\n\n` +
      `Think you can beat my score? 😏\n\n` +
      `Challenge accepted? 👇`
    );
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(challengeUrl)}`,
      '_blank',
      'width=550,height=420'
    );
  };
  
  const shareToWhatsApp = () => {
    const text = encodeURIComponent(
      `🏆 Beat my score challenge!\n\n` +
      `I made ${playerReturn > 0 ? '+' : ''}${playerReturn.toFixed(1)}% during the ${year} ${missionTitle} on MiniFi.\n\n` +
      `Think you're smarter? Prove it: ${challengeUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  if (!isChallengeable) {
    return null; // Don't show for poor performance
  }

  return (
    <>
      {/* Challenge Button - Prominent call to action */}
      <Button
        onClick={() => setShowModal(true)}
        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg shadow-orange-500/25 dark:shadow-orange-500/15"
      >
        <Swords className="h-4 w-4 mr-2" />
        Challenge a Friend
        <Badge className="ml-2 bg-white/20 text-white border-0 text-[10px]">
          +25 🪙
        </Badge>
      </Button>

      {/* Challenge Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Trophy className="h-6 w-6 text-yellow-400" />
              {challengeCreated ? 'Challenge Created!' : 'Challenge a Friend'}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {challengeCreated 
                ? 'Share this link and see if they can beat your score!'
                : 'Think your friends can beat your score? Let\'s find out!'}
            </DialogDescription>
          </DialogHeader>

          {!challengeCreated ? (
            /* Pre-challenge view */
            <div className="space-y-4">
              {/* Your Score Display */}
              <div className="p-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Your Score</p>
                    <p className="text-3xl font-black text-emerald-400">
                      {playerReturn > 0 ? '+' : ''}{playerReturn.toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">{year} {missionTitle}</p>
                    {playerRank && (
                      <Badge className="bg-amber-500/20 text-amber-300 border-0">
                        Top {100 - playerRank}%
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Challenge Description */}
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-purple-400 mt-0.5" />
                  <div>
                    <p className="font-medium">How it works:</p>
                    <ul className="text-sm text-gray-400 space-y-1 mt-1">
                      <li>• Your friend gets a link to try the same mission</li>
                      <li>• They see your score as the target to beat</li>
                      <li>• You both earn 🪙 when they complete it!</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Challenge expires notice */}
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="h-4 w-4" />
                <span>Challenge expires in 48 hours</span>
              </div>

              {/* Create Challenge Button */}
              <Button
                onClick={createChallenge}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                <Swords className="h-4 w-4 mr-2" />
                Create Challenge
              </Button>
            </div>
          ) : (
            /* Post-challenge view - Share options */
            <div className="space-y-4">
              {/* Success Animation */}
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-3 animate-pulse">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <p className="text-emerald-400 font-medium">
                  +25 🪙 earned for creating challenge!
                </p>
              </div>

              {/* Challenge Link */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Challenge Link</label>
                <div className="flex gap-2">
                  <Input
                    value={challengeUrl}
                    readOnly
                    className="bg-slate-800 border-white/10 text-white text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyLink}
                    className="border-white/10 hover:bg-white/10"
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Share Options */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Share directly</label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    onClick={shareToTwitter}
                    className="bg-black hover:bg-gray-900 text-white"
                  >
                    𝕏 Twitter
                  </Button>
                  <Button
                    onClick={shareToWhatsApp}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    📱 WhatsApp
                  </Button>
                  <Button
                    onClick={shareNative}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    More
                  </Button>
                </div>
              </div>

              {/* Viral Hook */}
              <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  <div>
                    <p className="text-sm font-medium text-purple-300">
                      Bonus: +50 🪙 when they beat you!
                    </p>
                    <p className="text-xs text-gray-400">
                      Yes, you get rewarded when friends beat your score
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ChallengeButton;

