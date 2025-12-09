'use client';

/**
 * 🔥 FOMO ACTIVITY FEED - "Others are learning, why aren't you?"
 * 
 * This component creates urgency and social proof by showing
 * real-time (or simulated) activity from other users.
 * 
 * Psychology: FOMO + Social Proof = Strong engagement driver
 * 
 * Types of FOMO:
 * 1. Activity FOMO - "Sarah just completed the 2008 mission"
 * 2. Achievement FOMO - "12 people earned this badge today"  
 * 3. Streak FOMO - "Your streak is at risk!"
 * 4. Friend FOMO - "Alex passed you on the leaderboard"
 */

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Trophy,
  Flame,
  Users,
  TrendingUp,
  Sparkles,
  Clock,
  AlertTriangle,
  ChevronRight,
  X,
} from 'lucide-react';

// Activity types for the feed
interface ActivityItem {
  id: string;
  type: 'mission_complete' | 'badge_earned' | 'level_up' | 'streak' | 'signup' | 'challenge';
  userName: string;
  country?: string;
  detail: string;
  timeAgo: string;
  emoji: string;
}

// Generate realistic-looking random activities
const FIRST_NAMES = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Drew'];
const COUNTRIES = ['🇺🇸', '🇬🇧', '🇨🇦', '🇦🇺', '🇩🇪', '🇫🇷', '🇯🇵', '🇸🇬', '🇮🇳', '🇧🇷'];
const MISSIONS = ['1990 Japan Bubble', '1997 Asian Crisis', '2000 Dot-com Crash', '2008 Financial Crisis', '2020 COVID Market'];
const BADGES = ['First Investment', 'Crisis Survivor', 'Diversification Pro', 'Market Historian', 'Risk Manager'];

function generateRandomActivity(): ActivityItem {
  const types: ActivityItem['type'][] = ['mission_complete', 'badge_earned', 'level_up', 'streak', 'signup'];
  const type = types[Math.floor(Math.random() * types.length)];
  const name = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
  const timeAgo = `${Math.floor(Math.random() * 10) + 1}m ago`;
  
  switch (type) {
    case 'mission_complete':
      const mission = MISSIONS[Math.floor(Math.random() * MISSIONS.length)];
      const returnPct = (Math.random() * 50 - 10).toFixed(1);
      return {
        id: `${Date.now()}-${Math.random()}`,
        type,
        userName: name,
        country,
        detail: `completed ${mission} with ${parseFloat(returnPct) > 0 ? '+' : ''}${returnPct}%`,
        timeAgo,
        emoji: '🎯',
      };
    case 'badge_earned':
      const badge = BADGES[Math.floor(Math.random() * BADGES.length)];
      return {
        id: `${Date.now()}-${Math.random()}`,
        type,
        userName: name,
        country,
        detail: `earned "${badge}" badge`,
        timeAgo,
        emoji: '🏆',
      };
    case 'level_up':
      const level = Math.floor(Math.random() * 20) + 5;
      return {
        id: `${Date.now()}-${Math.random()}`,
        type,
        userName: name,
        country,
        detail: `reached Level ${level}!`,
        timeAgo,
        emoji: '🚀',
      };
    case 'streak':
      const days = Math.floor(Math.random() * 30) + 7;
      return {
        id: `${Date.now()}-${Math.random()}`,
        type,
        userName: name,
        country,
        detail: `hit a ${days}-day streak!`,
        timeAgo,
        emoji: '🔥',
      };
    case 'signup':
      return {
        id: `${Date.now()}-${Math.random()}`,
        type,
        userName: name,
        country,
        detail: `joined MiniFi`,
        timeAgo,
        emoji: '👋',
      };
    default:
      return {
        id: `${Date.now()}-${Math.random()}`,
        type: 'signup',
        userName: name,
        country,
        detail: `joined MiniFi`,
        timeAgo,
        emoji: '👋',
      };
  }
}

// ============================================================================
// FOMO TOAST - Single activity notification
// ============================================================================

interface FOMOToastProps {
  activity: ActivityItem;
  onDismiss: () => void;
  onAction?: () => void;
  actionLabel?: string;
}

export function FOMOToast({ activity, onDismiss, onAction, actionLabel }: FOMOToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100);
    
    // Auto dismiss after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 300);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className={`
        fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80
        bg-white rounded-xl shadow-lg border border-gray-200
        transition-all duration-300 transform z-50
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
      `}
    >
      <div className="p-3 flex items-start gap-3">
        <div className="text-2xl">{activity.emoji}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm">
            <span className="font-semibold text-gray-900">{activity.userName}</span>
            {activity.country && <span className="ml-1">{activity.country}</span>}
            <span className="text-gray-600"> {activity.detail}</span>
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{activity.timeAgo}</p>
        </div>
        <button
          onClick={onDismiss}
          className="p-1 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      {onAction && actionLabel && (
        <div className="px-3 pb-3">
          <button
            onClick={onAction}
            className="w-full py-2 px-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all flex items-center justify-center gap-1"
          >
            {actionLabel}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// FOMO ACTIVITY FEED - Scrolling feed of activities
// ============================================================================

interface FOMOActivityFeedProps {
  maxItems?: number;
  autoScroll?: boolean;
  compact?: boolean;
}

export function FOMOActivityFeed({ 
  maxItems = 5, 
  autoScroll = true,
  compact = false 
}: FOMOActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  
  useEffect(() => {
    // Initialize with some activities
    const initial = Array.from({ length: maxItems }, () => generateRandomActivity());
    setActivities(initial);
    
    if (autoScroll) {
      // Add new activity every 8-15 seconds
      const interval = setInterval(() => {
        setActivities(prev => {
          const newActivity = generateRandomActivity();
          return [newActivity, ...prev.slice(0, maxItems - 1)];
        });
      }, 8000 + Math.random() * 7000);
      
      return () => clearInterval(interval);
    }
  }, [maxItems, autoScroll]);

  return (
    <div className={`space-y-2 ${compact ? 'text-sm' : ''}`}>
      <div className="flex items-center gap-2 text-gray-500 mb-2">
        <Users className="h-4 w-4" />
        <span className="text-xs font-medium">Live Activity</span>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
      </div>
      
      <div className="space-y-1.5">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={`
              flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100
              transition-all duration-500
              ${index === 0 ? 'animate-pulse' : ''}
            `}
          >
            <span className="text-lg flex-shrink-0">{activity.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs truncate">
                <span className="font-medium text-gray-900">{activity.userName}</span>
                {activity.country && <span className="ml-1">{activity.country}</span>}
                <span className="text-gray-500"> {activity.detail}</span>
              </p>
            </div>
            <span className="text-[10px] text-gray-400 flex-shrink-0">{activity.timeAgo}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// FOMO STAT COUNTERS - "X people learning right now"
// ============================================================================

interface FOMOCounterProps {
  type: 'active_users' | 'missions_today' | 'learning_hours';
}

export function FOMOCounter({ type }: FOMOCounterProps) {
  const [count, setCount] = useState(0);
  const [isIncreasing, setIsIncreasing] = useState(false);
  
  useEffect(() => {
    // Initialize with a realistic number
    const baseNumbers = {
      active_users: 847 + Math.floor(Math.random() * 200),
      missions_today: 3420 + Math.floor(Math.random() * 500),
      learning_hours: 12847 + Math.floor(Math.random() * 1000),
    };
    setCount(baseNumbers[type]);
    
    // Periodically increase
    const interval = setInterval(() => {
      setCount(prev => {
        const increase = Math.floor(Math.random() * 5) + 1;
        setIsIncreasing(true);
        setTimeout(() => setIsIncreasing(false), 500);
        return prev + increase;
      });
    }, 5000 + Math.random() * 10000);
    
    return () => clearInterval(interval);
  }, [type]);

  const configs = {
    active_users: {
      label: 'learning right now',
      icon: <Users className="h-4 w-4 text-green-500" />,
      color: 'text-green-600',
    },
    missions_today: {
      label: 'missions completed today',
      icon: <TrendingUp className="h-4 w-4 text-blue-500" />,
      color: 'text-blue-600',
    },
    learning_hours: {
      label: 'hours learned this week',
      icon: <Clock className="h-4 w-4 text-purple-500" />,
      color: 'text-purple-600',
    },
  };

  const config = configs[type];

  return (
    <div className="flex items-center gap-2 text-sm">
      {config.icon}
      <span className={`font-bold ${config.color} ${isIncreasing ? 'scale-110' : ''} transition-transform`}>
        {count.toLocaleString()}
      </span>
      <span className="text-gray-500">{config.label}</span>
    </div>
  );
}

// ============================================================================
// STREAK WARNING - "Your streak is at risk!"
// ============================================================================

interface StreakWarningProps {
  currentStreak: number;
  hoursRemaining: number;
  onAction: () => void;
}

export function StreakWarning({ currentStreak, hoursRemaining, onAction }: StreakWarningProps) {
  if (hoursRemaining > 6) return null; // Only show when < 6 hours left
  
  const urgency = hoursRemaining <= 2 ? 'critical' : 'warning';
  
  return (
    <div className={`
      p-4 rounded-xl border-2
      ${urgency === 'critical' 
        ? 'bg-red-50 border-red-300 animate-pulse' 
        : 'bg-amber-50 border-amber-300'}
    `}>
      <div className="flex items-start gap-3">
        <div className={`
          p-2 rounded-lg
          ${urgency === 'critical' ? 'bg-red-100' : 'bg-amber-100'}
        `}>
          <AlertTriangle className={`h-5 w-5 ${urgency === 'critical' ? 'text-red-600' : 'text-amber-600'}`} />
        </div>
        <div className="flex-1">
          <h4 className={`font-bold ${urgency === 'critical' ? 'text-red-800' : 'text-amber-800'}`}>
            {urgency === 'critical' ? '🚨 Streak at Risk!' : '⚠️ Don\'t Lose Your Streak!'}
          </h4>
          <p className="text-sm text-gray-600 mt-1">
            Your <span className="font-bold">{currentStreak}-day streak</span> expires in{' '}
            <span className="font-bold">{hoursRemaining} hour{hoursRemaining !== 1 ? 's' : ''}</span>!
          </p>
          <button
            onClick={onAction}
            className={`
              mt-3 px-4 py-2 rounded-lg text-sm font-medium
              ${urgency === 'critical'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-amber-500 hover:bg-amber-600 text-white'}
            `}
          >
            <Flame className="h-4 w-4 inline mr-1" />
            Quick Mission (2 min)
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FOMO HOOKS - Use these throughout the app
// ============================================================================

export function useFOMOToast() {
  const [currentToast, setCurrentToast] = useState<ActivityItem | null>(null);
  
  const showRandomActivity = () => {
    setCurrentToast(generateRandomActivity());
  };
  
  const dismissToast = () => {
    setCurrentToast(null);
  };
  
  return {
    currentToast,
    showRandomActivity,
    dismissToast,
    FOMOToastComponent: currentToast ? (
      <FOMOToast 
        activity={currentToast} 
        onDismiss={dismissToast}
      />
    ) : null,
  };
}

export default FOMOActivityFeed;
