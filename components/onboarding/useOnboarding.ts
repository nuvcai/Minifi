/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   🎯 USE ONBOARDING HOOK                                                     ║
 * ║   Manages onboarding state and integrates with marketing data collection    ║
 * ║   ✨ MiniFi / Legacy Guardians ✨                                           ║
 * ║   Copyright (c) 2025 NUVC.AI / Tick.AI. All Rights Reserved.                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useEffect, useCallback } from 'react';
import type { OnboardingData } from './OnboardingFlow';
import type { AICoach } from '@/components/data/coaches';

// =============================================================================
// LOCAL STORAGE KEYS
// =============================================================================

const STORAGE_KEYS = {
  ONBOARDING_COMPLETED: 'lg_onboarding_completed',
  ONBOARDING_DATA: 'lg_onboarding_data',
  SELECTED_COACH: 'lg_selected_coach',
  USER_PROFILE: 'lg_user_profile'
} as const;

// =============================================================================
// TYPES
// =============================================================================

export interface OnboardingState {
  isCompleted: boolean;
  data: Partial<OnboardingData> | null;
  selectedCoach: AICoach | null;
}

export interface UseOnboardingReturn {
  // State
  isOnboardingCompleted: boolean;
  onboardingData: Partial<OnboardingData> | null;
  selectedCoach: AICoach | null;
  showOnboarding: boolean;
  
  // Actions
  completeOnboarding: (data: OnboardingData) => Promise<void>;
  skipOnboarding: () => void;
  resetOnboarding: () => void;
  triggerOnboarding: () => void;
  updateSelectedCoach: (coach: AICoach) => void;
}

// =============================================================================
// HOOK
// =============================================================================

export function useOnboarding(): UseOnboardingReturn {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData> | null>(null);
  const [selectedCoach, setSelectedCoach] = useState<AICoach | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const completed = localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      const savedData = localStorage.getItem(STORAGE_KEYS.ONBOARDING_DATA);
      const savedCoach = localStorage.getItem(STORAGE_KEYS.SELECTED_COACH);
      
      setIsOnboardingCompleted(completed === 'true');
      
      if (savedData) {
        setOnboardingData(JSON.parse(savedData));
      }
      
      if (savedCoach) {
        setSelectedCoach(JSON.parse(savedCoach));
      }
      
      // Show onboarding if not completed
      setShowOnboarding(completed !== 'true');
    } catch (error) {
      console.error('Failed to load onboarding state:', error);
    }
    
    setIsHydrated(true);
  }, []);

  // Complete onboarding
  const completeOnboarding = useCallback(async (data: OnboardingData) => {
    try {
      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
      localStorage.setItem(STORAGE_KEYS.ONBOARDING_DATA, JSON.stringify(data));
      
      if (data.selectedCoach) {
        localStorage.setItem(STORAGE_KEYS.SELECTED_COACH, JSON.stringify(data.selectedCoach));
        setSelectedCoach(data.selectedCoach);
      }

      // Send to backend API for database storage and marketing integration
      try {
        const response = await fetch('/api/onboarding/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            // Core profile data
            ageRange: data.ageRange,
            country: data.country,
            
            // Financial background
            hasPartTimeJob: data.hasPartTimeJob,
            hasSavingsGoal: data.hasSavingsGoal,
            familyDiscussesFinances: data.familyDiscussesFinances,
            
            // Risk profile (include raw answers for analytics)
            riskPersonality: data.riskPersonality,
            riskScore: data.riskScore,
            riskAnswers: data.riskAnswers,
            
            // Learning preferences
            learningStyle: data.learningStyle,
            preferredSessionLength: data.preferredSessionLength,
            
            // Coach selection
            selectedCoach: data.selectedCoach?.id,
            
            // Consent
            termsAccepted: data.termsAccepted,
            marketingConsent: data.marketingConsent,
            
            // Metadata
            completedAt: data.completedAt?.toISOString(),
            source: data.source,
            sessionId: getOrCreateSessionId(),
            
            // UTM tracking from URL
            ...getUtmParams()
          })
        });

        if (!response.ok) {
          console.warn('Failed to sync onboarding to backend');
        } else {
          const result = await response.json();
          console.log('✅ Onboarding synced:', result.data);
        }
      } catch (apiError) {
        // Don't fail the onboarding if API call fails
        console.warn('API sync failed:', apiError);
      }

      // Update state
      setIsOnboardingCompleted(true);
      setOnboardingData(data);
      setShowOnboarding(false);

    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      throw error;
    }
  }, []);

  // Skip onboarding
  const skipOnboarding = useCallback(() => {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'skipped');
    setShowOnboarding(false);
  }, []);

  // Reset onboarding
  const resetOnboarding = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    localStorage.removeItem(STORAGE_KEYS.ONBOARDING_DATA);
    localStorage.removeItem(STORAGE_KEYS.SELECTED_COACH);
    setIsOnboardingCompleted(false);
    setOnboardingData(null);
    setSelectedCoach(null);
    setShowOnboarding(true);
  }, []);

  // Trigger onboarding manually
  const triggerOnboarding = useCallback(() => {
    setShowOnboarding(true);
  }, []);

  // Update coach
  const updateSelectedCoach = useCallback((coach: AICoach) => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_COACH, JSON.stringify(coach));
    setSelectedCoach(coach);
    
    // Update onboarding data if exists
    if (onboardingData) {
      const updated = { ...onboardingData, selectedCoach: coach };
      localStorage.setItem(STORAGE_KEYS.ONBOARDING_DATA, JSON.stringify(updated));
      setOnboardingData(updated);
    }
  }, [onboardingData]);

  return {
    isOnboardingCompleted,
    onboardingData,
    selectedCoach,
    showOnboarding: isHydrated ? showOnboarding : false,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding,
    triggerOnboarding,
    updateSelectedCoach
  };
}

// =============================================================================
// HELPERS
// =============================================================================

function getUtmParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref'];
  utmKeys.forEach(key => {
    const value = params.get(key);
    if (value) utm[key] = value;
  });
  
  return utm;
}

/**
 * Get or create a session ID for anonymous user tracking
 * Persists in localStorage so the same user can be identified across sessions
 */
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  const SESSION_KEY = 'lg_session_id';
  let sessionId = localStorage.getItem(SESSION_KEY);
  
  if (!sessionId) {
    // Generate a unique session ID
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  
  return sessionId;
}

export default useOnboarding;

