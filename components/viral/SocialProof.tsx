'use client';

import React, { useState, useEffect } from 'react';

interface SocialProofProps {
  variant?: 'banner' | 'toast' | 'stats' | 'activity';
}

// Mock data - in production, this would come from your API
const STATS = {
  totalUsers: 12847,
  totalMissions: 156432,
  countriesCount: 47,
  schoolsCount: 234,
  todaySignups: 127,
};

const RECENT_ACTIVITY = [
  { type: 'signup', name: 'Alex K.', country: '🇺🇸', time: '2 min ago' },
  { type: 'mission', name: 'Sarah M.', achievement: '2008 Crisis', time: '3 min ago' },
  { type: 'badge', name: 'James L.', badge: 'Crash Survivor', time: '5 min ago' },
  { type: 'signup', name: 'Emma W.', country: '🇬🇧', time: '6 min ago' },
  { type: 'levelup', name: 'Lucas P.', level: 10, time: '8 min ago' },
  { type: 'signup', name: 'Mia T.', country: '🇦🇺', time: '10 min ago' },
  { type: 'referral', name: 'Noah B.', referrals: 5, time: '12 min ago' },
];

export function SocialProof({ variant = 'toast' }: SocialProofProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Rotate through activities for toast variant
  useEffect(() => {
    if (variant !== 'toast') return;
    
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % RECENT_ACTIVITY.length);
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [variant]);

  if (variant === 'banner') {
    return (
      <div className="bg-linear-to-r from-purple-600 to-blue-600 text-white py-2 px-4">
        <div className="flex items-center justify-center gap-6 text-sm overflow-x-auto">
          <span className="flex items-center gap-2 whitespace-nowrap">
            <span className="animate-pulse">🟢</span>
            <strong>{STATS.totalUsers.toLocaleString()}</strong> investors learning
          </span>
          <span className="text-white/30">|</span>
          <span className="flex items-center gap-2 whitespace-nowrap">
            🌍 <strong>{STATS.countriesCount}</strong> countries
          </span>
          <span className="text-white/30">|</span>
          <span className="flex items-center gap-2 whitespace-nowrap">
            🎓 <strong>{STATS.schoolsCount}</strong> schools
          </span>
          <span className="text-white/30">|</span>
          <span className="flex items-center gap-2 whitespace-nowrap">
            📈 <strong>{STATS.totalMissions.toLocaleString()}</strong> missions completed
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'stats') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        <StatCard
          icon="👥"
          value={STATS.totalUsers.toLocaleString()}
          label="Active Learners"
          trend="+127 today"
        />
        <StatCard
          icon="🎯"
          value={STATS.totalMissions.toLocaleString()}
          label="Missions Completed"
          trend="+2,340 this week"
        />
        <StatCard
          icon="🌍"
          value={STATS.countriesCount.toString()}
          label="Countries"
        />
        <StatCard
          icon="🏫"
          value={STATS.schoolsCount.toString()}
          label="Schools Participating"
          trend="+12 this month"
        />
      </div>
    );
  }

  if (variant === 'activity') {
    return (
      <div className="bg-slate-900/80 rounded-xl border border-white/10 overflow-hidden">
        <div className="p-3 border-b border-white/10">
          <h3 className="text-sm font-medium text-white flex items-center gap-2">
            <span className="animate-pulse">🔴</span>
            Live Activity
          </h3>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {RECENT_ACTIVITY.map((activity, index) => (
            <ActivityItem key={index} {...activity} />
          ))}
        </div>
      </div>
    );
  }

  // Toast variant (default) - appears in corner
  const activity = RECENT_ACTIVITY[currentIndex];
  
  return (
    <div 
      className={`
        fixed bottom-4 left-4 z-50 max-w-xs transition-all duration-300
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      <div className="bg-slate-900 border border-white/20 rounded-lg shadow-2xl p-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-lg">
          {activity.type === 'signup' && '👋'}
          {activity.type === 'mission' && '🎯'}
          {activity.type === 'badge' && '🏆'}
          {activity.type === 'levelup' && '⬆️'}
          {activity.type === 'referral' && '🤝'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm text-white font-medium">
            {activity.type === 'signup' && (
              <>
                <strong>{activity.name}</strong> {activity.country} just joined!
              </>
            )}
            {activity.type === 'mission' && (
              <>
                <strong>{activity.name}</strong> survived {activity.achievement}
              </>
            )}
            {activity.type === 'badge' && (
              <>
                <strong>{activity.name}</strong> earned {activity.badge}
              </>
            )}
            {activity.type === 'levelup' && (
              <>
                <strong>{activity.name}</strong> reached Level {activity.level}!
              </>
            )}
            {activity.type === 'referral' && (
              <>
                <strong>{activity.name}</strong> referred {activity.referrals} friends!
              </>
            )}
          </div>
          <div className="text-xs text-gray-500">{activity.time}</div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  icon, 
  value, 
  label, 
  trend 
}: { 
  icon: string; 
  value: string; 
  label: string; 
  trend?: string;
}) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
      <div className="flex items-start justify-between">
        <span className="text-2xl">{icon}</span>
        {trend && (
          <span className="text-xs text-green-400 bg-green-400/20 px-2 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div className="mt-2">
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-sm text-gray-400">{label}</div>
      </div>
    </div>
  );
}

function ActivityItem(activity: typeof RECENT_ACTIVITY[0]) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 border-b border-white/5 hover:bg-white/5 transition-colors">
      <div className="w-8 h-8 rounded-full bg-linear-to-br from-slate-700 to-slate-600 flex items-center justify-center text-sm">
        {activity.type === 'signup' && '👋'}
        {activity.type === 'mission' && '🎯'}
        {activity.type === 'badge' && '🏆'}
        {activity.type === 'levelup' && '⬆️'}
        {activity.type === 'referral' && '🤝'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-white">
          <strong>{activity.name}</strong>
          {activity.type === 'signup' && <span className="text-gray-400"> joined from {activity.country}</span>}
          {activity.type === 'mission' && <span className="text-gray-400"> completed {activity.achievement}</span>}
          {activity.type === 'badge' && <span className="text-gray-400"> earned {activity.badge}</span>}
          {activity.type === 'levelup' && <span className="text-gray-400"> hit Level {activity.level}</span>}
          {activity.type === 'referral' && <span className="text-gray-400"> referred {activity.referrals} friends</span>}
        </div>
      </div>
      <div className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</div>
    </div>
  );
}


