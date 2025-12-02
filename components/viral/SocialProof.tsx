/**
 * SocialProof - Dynamic social proof components
 * Shows real-time activity and stats to drive FOMO and conversions
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Users, 
  Globe, 
  GraduationCap, 
  Target, 
  TrendingUp,
  Sparkles,
  Trophy,
  Flame,
  Star,
  ChevronRight,
} from 'lucide-react';

interface SocialProofProps {
  variant?: 'banner' | 'toast' | 'stats' | 'activity' | 'minimal';
  showClose?: boolean;
  onClose?: () => void;
  className?: string;
}

// Stats interface
interface SocialStats {
  totalUsers: number;
  totalMissions: number;
  countriesCount: number;
  schoolsCount: number;
  todaySignups: number;
  isLoading: boolean;
}

// Activity types
interface RecentActivity {
  type: 'signup' | 'mission' | 'badge' | 'levelup' | 'referral' | 'streak';
  name: string;
  country?: string;
  achievement?: string;
  badge?: string;
  level?: number;
  referrals?: number;
  streak?: number;
  time: string;
}

// Generate realistic recent activity
const generateRecentActivity = (): RecentActivity[] => {
  const names = [
    'Alex K.', 'Sarah M.', 'James L.', 'Emma W.', 'Lucas P.', 
    'Mia T.', 'Noah B.', 'Olivia C.', 'Ethan R.', 'Ava S.',
    'Liam D.', 'Sophia G.', 'Mason H.', 'Isabella J.', 'Logan N.',
  ];
  
  const countries = ['🇺🇸', '🇬🇧', '🇦🇺', '🇨🇦', '🇸🇬', '🇮🇳', '🇩🇪', '🇯🇵', '🇧🇷', '🇫🇷', '🇳🇿', '🇮🇪'];
  const missions = ['2008 Crisis', 'Dot-com Bubble', 'Japan 1990', 'COVID Crash', 'Gold Rush', 'Bitcoin Boom'];
  const badges = ['Crash Survivor', 'Diamond Hands', 'Risk Taker', 'Steady Investor', 'Bull Rider'];
  const times = ['just now', '1 min ago', '2 min ago', '3 min ago', '5 min ago', '8 min ago', '10 min ago'];
  
  const activities: RecentActivity[] = [];
  const types: RecentActivity['type'][] = ['signup', 'mission', 'badge', 'levelup', 'referral', 'streak'];
  
  for (let i = 0; i < 15; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const activity: RecentActivity = {
      type,
      name: names[i % names.length],
      time: times[Math.min(i, times.length - 1)],
    };
    
    switch (type) {
      case 'signup':
        activity.country = countries[Math.floor(Math.random() * countries.length)];
        break;
      case 'mission':
        activity.achievement = missions[Math.floor(Math.random() * missions.length)];
        break;
      case 'badge':
        activity.badge = badges[Math.floor(Math.random() * badges.length)];
        break;
      case 'levelup':
        activity.level = Math.floor(Math.random() * 15) + 5;
        break;
      case 'referral':
        activity.referrals = Math.floor(Math.random() * 5) + 1;
        break;
      case 'streak':
        activity.streak = Math.floor(Math.random() * 30) + 7;
        break;
    }
    
    activities.push(activity);
  }
  
  return activities;
};

// Default stats with realistic values
const DEFAULT_STATS: SocialStats = {
  totalUsers: 12847,
  totalMissions: 156432,
  countriesCount: 47,
  schoolsCount: 234,
  todaySignups: 127,
  isLoading: false,
};

export function SocialProof({ 
  variant = 'toast', 
  showClose = false,
  onClose,
  className = '',
}: SocialProofProps) {
  const [stats, setStats] = useState<SocialStats>({ ...DEFAULT_STATS, isLoading: true });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Fetch real stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats({
            totalUsers: data.totalUsers || DEFAULT_STATS.totalUsers,
            totalMissions: data.totalMissions || DEFAULT_STATS.totalMissions,
            countriesCount: data.countriesCount || DEFAULT_STATS.countriesCount,
            schoolsCount: data.schoolsCount || DEFAULT_STATS.schoolsCount,
            todaySignups: data.todaySignups || DEFAULT_STATS.todaySignups,
            isLoading: false,
          });
        } else {
          setStats({ ...DEFAULT_STATS, isLoading: false });
        }
      } catch {
        setStats({ ...DEFAULT_STATS, isLoading: false });
      }
    };

    fetchStats();
    
    // Refresh stats every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Generate activity on mount
  useEffect(() => {
    setRecentActivity(generateRecentActivity());
  }, []);

  // Rotate through activities for toast variant
  useEffect(() => {
    if (variant !== 'toast' || recentActivity.length === 0) return;
    
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % recentActivity.length);
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [variant, recentActivity.length]);

  // Activity icon helper
  const getActivityIcon = useCallback((type: RecentActivity['type']) => {
    switch (type) {
      case 'signup': return <Users className="h-4 w-4" />;
      case 'mission': return <Target className="h-4 w-4" />;
      case 'badge': return <Trophy className="h-4 w-4" />;
      case 'levelup': return <TrendingUp className="h-4 w-4" />;
      case 'referral': return <Star className="h-4 w-4" />;
      case 'streak': return <Flame className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  }, []);

  // Activity emoji helper
  const getActivityEmoji = useCallback((type: RecentActivity['type']) => {
    switch (type) {
      case 'signup': return '👋';
      case 'mission': return '🎯';
      case 'badge': return '🏆';
      case 'levelup': return '⬆️';
      case 'referral': return '🤝';
      case 'streak': return '🔥';
      default: return '✨';
    }
  }, []);

  // Banner variant - horizontal stats bar
  if (variant === 'banner') {
    return (
      <div className={`bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white py-2.5 px-4 ${className}`}>
        <div className="container mx-auto flex items-center justify-center gap-6 text-sm overflow-x-auto scrollbar-hide">
          <span className="flex items-center gap-2 whitespace-nowrap">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <strong>{stats.totalUsers.toLocaleString()}</strong> investors learning
          </span>
          <span className="text-white/30">|</span>
          <span className="flex items-center gap-2 whitespace-nowrap">
            <Globe className="h-4 w-4" />
            <strong>{stats.countriesCount}</strong> countries
          </span>
          <span className="text-white/30">|</span>
          <span className="flex items-center gap-2 whitespace-nowrap">
            <GraduationCap className="h-4 w-4" />
            <strong>{stats.schoolsCount}</strong> schools
          </span>
          <span className="text-white/30">|</span>
          <span className="flex items-center gap-2 whitespace-nowrap">
            <Target className="h-4 w-4" />
            <strong>{stats.totalMissions.toLocaleString()}</strong> missions completed
          </span>
          {stats.todaySignups > 0 && (
            <>
              <span className="text-white/30">|</span>
              <span className="flex items-center gap-2 whitespace-nowrap text-amber-300">
                <Sparkles className="h-4 w-4" />
                <strong>+{stats.todaySignups}</strong> today
              </span>
            </>
          )}
        </div>
      </div>
    );
  }

  // Stats grid variant
  if (variant === 'stats') {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
        <StatCard
          icon={<Users className="h-6 w-6 text-indigo-400" />}
          value={stats.totalUsers.toLocaleString()}
          label="Active Learners"
          trend={`+${stats.todaySignups} today`}
          trendUp
          loading={stats.isLoading}
        />
        <StatCard
          icon={<Target className="h-6 w-6 text-emerald-400" />}
          value={stats.totalMissions.toLocaleString()}
          label="Missions Completed"
          trend="+2,340 this week"
          trendUp
          loading={stats.isLoading}
        />
        <StatCard
          icon={<Globe className="h-6 w-6 text-violet-400" />}
          value={stats.countriesCount.toString()}
          label="Countries"
          loading={stats.isLoading}
        />
        <StatCard
          icon={<GraduationCap className="h-6 w-6 text-amber-400" />}
          value={stats.schoolsCount.toString()}
          label="Schools"
          trend="+12 this month"
          trendUp
          loading={stats.isLoading}
        />
      </div>
    );
  }

  // Activity feed variant
  if (variant === 'activity') {
    return (
      <div className={`bg-slate-900/80 rounded-2xl border border-white/10 overflow-hidden ${className}`}>
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Live Activity
          </h3>
          <span className="text-xs text-slate-500">{recentActivity.length} recent</span>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {recentActivity.map((activity, index) => (
            <ActivityItem key={index} activity={activity} getEmoji={getActivityEmoji} />
          ))}
        </div>
        <div className="p-3 bg-slate-800/50 border-t border-white/10">
          <button className="w-full text-center text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center justify-center gap-1">
            View all activity <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    );
  }

  // Minimal variant - just a counter
  if (variant === 'minimal') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 ${className}`}>
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span className="text-xs text-slate-300">
          <strong className="text-white">{stats.totalUsers.toLocaleString()}</strong> investors online
        </span>
      </div>
    );
  }

  // Toast variant (default) - appears in corner
  const activity = recentActivity[currentIndex];
  
  if (!activity) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className={`fixed bottom-4 left-4 z-50 max-w-xs ${className}`}
        >
          <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-3 flex items-center gap-3">
            {/* Icon */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white">
              <span className="text-lg">{getActivityEmoji(activity.type)}</span>
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white">
                {activity.type === 'signup' && (
                  <>
                    <strong className="text-indigo-300">{activity.name}</strong> {activity.country} just joined!
                  </>
                )}
                {activity.type === 'mission' && (
                  <>
                    <strong className="text-indigo-300">{activity.name}</strong> survived{' '}
                    <span className="text-emerald-400">{activity.achievement}</span>
                  </>
                )}
                {activity.type === 'badge' && (
                  <>
                    <strong className="text-indigo-300">{activity.name}</strong> earned{' '}
                    <span className="text-amber-400">{activity.badge}</span>
                  </>
                )}
                {activity.type === 'levelup' && (
                  <>
                    <strong className="text-indigo-300">{activity.name}</strong> reached{' '}
                    <span className="text-violet-400">Level {activity.level}!</span>
                  </>
                )}
                {activity.type === 'referral' && (
                  <>
                    <strong className="text-indigo-300">{activity.name}</strong> referred{' '}
                    <span className="text-pink-400">{activity.referrals} friends!</span>
                  </>
                )}
                {activity.type === 'streak' && (
                  <>
                    <strong className="text-indigo-300">{activity.name}</strong> hit{' '}
                    <span className="text-orange-400">{activity.streak}-day streak! 🔥</span>
                  </>
                )}
              </div>
              <div className="text-xs text-slate-500">{activity.time}</div>
            </div>
            
            {/* Close button */}
            {showClose && (
              <button 
                onClick={() => {
                  setIsVisible(false);
                  onClose?.();
                }}
                className="text-slate-500 hover:text-white p-1 -mr-1"
              >
                ×
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Stat card component
function StatCard({ 
  icon, 
  value, 
  label, 
  trend,
  trendUp,
  loading = false,
}: { 
  icon: React.ReactNode;
  value: string; 
  label: string; 
  trend?: string;
  trendUp?: boolean;
  loading?: boolean;
}) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-slate-600/50 transition-colors group">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-lg bg-slate-700/50 group-hover:bg-slate-700 transition-colors">
          {icon}
        </div>
        {trend && (
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            trendUp 
              ? 'bg-emerald-500/20 text-emerald-400' 
              : 'bg-slate-700/50 text-slate-400'
          }`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        {loading ? (
          <div className="h-8 w-20 bg-slate-700 rounded animate-pulse" />
        ) : (
          <div className="text-2xl font-bold text-white">{value}</div>
        )}
        <div className="text-sm text-slate-400">{label}</div>
      </div>
    </div>
  );
}

// Activity item component
function ActivityItem({ 
  activity,
  getEmoji,
}: { 
  activity: RecentActivity;
  getEmoji: (type: RecentActivity['type']) => string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/5 hover:bg-white/5 transition-colors">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-sm">
        {getEmoji(activity.type)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-white">
          <strong className="text-slate-200">{activity.name}</strong>
          {activity.type === 'signup' && (
            <span className="text-slate-400"> joined from {activity.country}</span>
          )}
          {activity.type === 'mission' && (
            <span className="text-slate-400"> completed <span className="text-emerald-400">{activity.achievement}</span></span>
          )}
          {activity.type === 'badge' && (
            <span className="text-slate-400"> earned <span className="text-amber-400">{activity.badge}</span></span>
          )}
          {activity.type === 'levelup' && (
            <span className="text-slate-400"> hit <span className="text-violet-400">Level {activity.level}</span></span>
          )}
          {activity.type === 'referral' && (
            <span className="text-slate-400"> referred <span className="text-pink-400">{activity.referrals} friends</span></span>
          )}
          {activity.type === 'streak' && (
            <span className="text-slate-400"> hit <span className="text-orange-400">{activity.streak}-day streak</span></span>
          )}
        </div>
      </div>
      <div className="text-xs text-slate-500 whitespace-nowrap">{activity.time}</div>
    </div>
  );
}

export default SocialProof;
