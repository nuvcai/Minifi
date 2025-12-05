'use client';

import React, { useState } from 'react';
import {
  REFERRAL_TIERS,
  getReferralTier,
  generateReferralCode,
} from '@/components/data/viralMarketing';
import { ShareButton } from './ShareButton';

interface ReferralDashboardProps {
  displayName: string;
  referralCode?: string;
  referralsCount: number;
  conversionsCount: number;
  xpEarned: number;
}

export function ReferralDashboard({
  displayName,
  referralCode: existingCode,
  referralsCount = 0,
  conversionsCount = 0,
  xpEarned = 0,
}: ReferralDashboardProps) {
  const [referralCode] = useState(existingCode || generateReferralCode(displayName));
  const [copied, setCopied] = useState(false);
  
  const currentTier = getReferralTier(conversionsCount);
  const tierConfig = REFERRAL_TIERS[currentTier];
  
  // Calculate progress to next tier
  const tierOrder: (keyof typeof REFERRAL_TIERS)[] = ['STARTER', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'];
  const currentTierIndex = tierOrder.indexOf(currentTier);
  const nextTier = tierOrder[currentTierIndex + 1];
  const nextTierConfig = nextTier ? REFERRAL_TIERS[nextTier] : null;
  
  const progressToNext = nextTierConfig 
    ? Math.min(100, (conversionsCount / nextTierConfig.referralsNeeded) * 100)
    : 100;

  const copyReferralLink = async () => {
    const link = `${typeof window !== 'undefined' ? window.location.origin : 'https://minifi.app'}?ref=${referralCode}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-white/10">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              🚀 Referral Program
            </h2>
            <p className="text-gray-400 mt-1">Invite friends, earn rewards together</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              {tierConfig.name}
            </div>
            <div className="text-sm text-gray-400">{conversionsCount} successful referrals</div>
          </div>
        </div>
      </div>

      {/* Referral Code */}
      <div className="p-6 border-b border-white/10">
        <label className="text-sm text-gray-400 block mb-2">Your unique referral code</label>
        <div className="flex gap-2">
          <div className="flex-1 bg-slate-800 rounded-lg px-4 py-3 font-mono text-xl text-white border border-white/10">
            {referralCode}
          </div>
          <button
            onClick={copyReferralLink}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
          >
            {copied ? '✓ Copied!' : '📋 Copy Link'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Share this link: minifi.app?ref={referralCode}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 p-6 border-b border-white/10">
        <div className="text-center">
          <div className="text-3xl font-bold text-white">{referralsCount}</div>
          <div className="text-sm text-gray-400">Links Shared</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-400">{conversionsCount}</div>
          <div className="text-sm text-gray-400">Friends Joined</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-400">+{xpEarned}</div>
          <div className="text-sm text-gray-400">XP Earned</div>
        </div>
      </div>

      {/* Progress to Next Tier */}
      {nextTierConfig && (
        <div className="p-6 border-b border-white/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Progress to {nextTierConfig.name}</span>
            <span className="text-sm text-white">
              {conversionsCount} / {nextTierConfig.referralsNeeded}
            </span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
              style={{ width: `${progressToNext}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {nextTierConfig.referralsNeeded - conversionsCount} more referrals to unlock {nextTierConfig.referrerReward.description}
          </p>
        </div>
      )}

      {/* Tier Rewards */}
      <div className="p-6 border-b border-white/10">
        <h3 className="font-bold text-white mb-4">Referral Tiers</h3>
        <div className="space-y-3">
          {tierOrder.map((tier, index) => {
            const config = REFERRAL_TIERS[tier];
            const isUnlocked = conversionsCount >= config.referralsNeeded;
            const isCurrent = tier === currentTier;
            
            return (
              <div 
                key={tier}
                className={`
                  flex items-center justify-between p-3 rounded-lg border transition-all
                  ${isCurrent 
                    ? 'bg-purple-600/20 border-purple-500' 
                    : isUnlocked 
                      ? 'bg-green-600/10 border-green-500/50' 
                      : 'bg-slate-800/50 border-white/5'}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {isUnlocked ? '✅' : index === 0 ? '🌟' : index === 1 ? '🥉' : index === 2 ? '🥈' : index === 3 ? '🥇' : index === 4 ? '💎' : '👑'}
                  </span>
                  <div>
                    <div className={`font-medium ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                      {config.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {config.referralsNeeded}+ referrals
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm ${isUnlocked ? 'text-green-400' : 'text-gray-500'}`}>
                    {config.referrerReward.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Share CTA */}
      <div className="p-6">
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-4">
          <h4 className="font-bold text-white mb-2">Share on social media</h4>
          <p className="text-sm text-gray-400 mb-4">
            Your friends get +50 🪙 iii bonus when they use your code!
          </p>
          <ShareButton
            contentType="invite"
            data={{ referralCode }}
            referralCode={referralCode}
            variant="inline"
            platforms={['twitter', 'whatsapp', 'linkedin', 'telegram', 'email', 'copy_link']}
          />
        </div>
      </div>
    </div>
  );
}


