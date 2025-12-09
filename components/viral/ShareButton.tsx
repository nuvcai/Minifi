'use client';

import React, { useState } from 'react';
import {
  generateShareUrl,
  SOCIAL_PLATFORMS,
  buildShareContent,
  type SocialPlatform,
  type ShareContentType,
} from '@/components/data/viralMarketing';

interface ShareButtonProps {
  contentType: ShareContentType;
  data: Record<string, string | number>;
  referralCode?: string;
  baseUrl?: string;
  onShare?: (platform: SocialPlatform) => void;
  variant?: 'button' | 'icon' | 'inline';
  platforms?: SocialPlatform[];
  showLabel?: boolean;
}

export function ShareButton({
  contentType,
  data,
  referralCode,
  baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://minifi.games',
  onShare,
  variant = 'button',
  platforms = ['twitter', 'whatsapp', 'linkedin', 'copy_link'],
  showLabel = true,
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { title, description, hashtags } = buildShareContent(contentType, data, referralCode);
  
  const shareUrl = referralCode 
    ? `${baseUrl}?ref=${referralCode}` 
    : baseUrl;

  const handleShare = async (platform: SocialPlatform) => {
    if (platform === 'copy_link') {
      await navigator.clipboard.writeText(`${title}\n\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      const url = generateShareUrl(platform, {
        url: shareUrl,
        title,
        description,
        hashtags,
        via: 'MiniFiApp',
      });
      window.open(url, '_blank', 'width=600,height=400');
    }
    
    onShare?.(platform);
    setIsOpen(false);
  };

  // Native share if available (mobile)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
        onShare?.('copy_link');
      } catch {
        // User cancelled or error - fall back to modal
        setIsOpen(true);
      }
    } else {
      setIsOpen(true);
    }
  };

  const availablePlatforms = platforms.filter(p => SOCIAL_PLATFORMS[p].available);

  if (variant === 'inline') {
    return (
      <div className="flex gap-2">
        {availablePlatforms.map(platform => (
          <button
            key={platform}
            onClick={() => handleShare(platform)}
            className="p-2 rounded-lg transition-all hover:scale-110"
            style={{ backgroundColor: SOCIAL_PLATFORMS[platform].color + '20' }}
            title={SOCIAL_PLATFORMS[platform].name}
          >
            <span className="text-lg">{SOCIAL_PLATFORMS[platform].icon}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className={`
          ${variant === 'button' 
            ? 'px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-all hover:scale-105 shadow-lg'
            : 'p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all'}
        `}
      >
        <span className="text-lg">📤</span>
        {showLabel && variant === 'button' && <span>Share</span>}
      </button>

      {/* Share Modal */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full right-0 mb-2 w-72 bg-slate-900 rounded-xl shadow-2xl border border-white/10 z-50 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/10">
              <h3 className="font-bold text-white">Share your achievement</h3>
              <p className="text-sm text-gray-400 mt-1 line-clamp-2">{title}</p>
            </div>

            {/* Platform buttons */}
            <div className="p-3 grid grid-cols-4 gap-2">
              {availablePlatforms.map(platform => {
                const config = SOCIAL_PLATFORMS[platform];
                return (
                  <button
                    key={platform}
                    onClick={() => handleShare(platform)}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/10 transition-all group"
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: config.color }}
                    >
                      {platform === 'copy_link' 
                        ? (copied ? '✓' : config.icon)
                        : config.icon
                      }
                    </div>
                    <span className="text-xs text-gray-400">
                      {platform === 'copy_link' && copied ? 'Copied!' : config.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bonus XP */}
            <div className="px-4 pb-4">
              <div className="bg-yellow-500/20 text-yellow-300 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
                <span>⭐</span>
                <span>Earn +50 🪙 when you share!</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


