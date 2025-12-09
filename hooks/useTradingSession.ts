/**
 * useTradingSession Hook
 * Manages trading session state and persistence
 * © 2025 NUVC.AI. All Rights Reserved.
 */

import { useState, useCallback, useEffect } from 'react';

interface TradingSession {
  id?: string;
  sessionId?: string;
  email?: string;
  competitionType: string;
  coachId: string;
  startingCapital: number;
  status: 'active' | 'completed' | 'abandoned';
}

interface TradingResults {
  finalValue: number;
  totalReturn: number;
  sharpeRatio?: number;
  volatility?: number;
  maxDrawdown?: number;
  annualizedReturn?: number;
  finalPortfolio?: Record<string, any>;
  finalCash?: number;
  chartData?: Array<{ date: string; value: number }>;
}

interface Transaction {
  asset: string;
  action: 'buy' | 'sell';
  shares: number;
  price: number;
  totalValue: number;
  assetClass?: string;
  portfolioValueAfter?: number;
  cashAfter?: number;
}

interface Snapshot {
  totalValue: number;
  cashValue: number;
  holdings: Record<string, any>;
  prices: Record<string, number>;
}

export function useTradingSession() {
  const [tradingSessionId, setTradingSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get session ID from localStorage or generate new one
  const getSessionId = useCallback(() => {
    if (typeof window === 'undefined') return null;
    let sessionId = localStorage.getItem('minifi_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('minifi_session_id', sessionId);
    }
    return sessionId;
  }, []);

  // Create a new trading session
  const createSession = useCallback(async (
    coachId: string,
    startingCapital: number = 5000,
    competitionType: string = 'standard'
  ): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const sessionId = getSessionId();
      const email = localStorage.getItem('minifi_email');

      const response = await fetch('/api/trading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          sessionId,
          email,
          coachId,
          startingCapital,
          competitionType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create trading session');
      }

      setTradingSessionId(data.tradingSessionId);
      
      // Store in sessionStorage for persistence across page navigation
      sessionStorage.setItem('tradingSessionId', data.tradingSessionId);

      return data.tradingSessionId;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create session';
      setError(message);
      console.error('Create session error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [getSessionId]);

  // Complete a trading session with results
  const completeSession = useCallback(async (
    results: TradingResults
  ): Promise<boolean> => {
    const sessionId = tradingSessionId || sessionStorage.getItem('tradingSessionId');
    
    if (!sessionId) {
      console.warn('No active trading session to complete');
      // Still store results in sessionStorage for offline/fallback
      sessionStorage.setItem('competitionResults', JSON.stringify(results));
      return true;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/trading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'complete',
          tradingSessionId: sessionId,
          ...results,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete trading session');
      }

      // Store results in sessionStorage as well for immediate access
      sessionStorage.setItem('competitionResults', JSON.stringify(results));
      sessionStorage.removeItem('tradingSessionId');
      setTradingSessionId(null);

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to complete session';
      setError(message);
      console.error('Complete session error:', err);
      
      // Still store results locally even if DB fails
      sessionStorage.setItem('competitionResults', JSON.stringify(results));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [tradingSessionId]);

  // Log a transaction
  const logTransaction = useCallback(async (
    transaction: Transaction
  ): Promise<boolean> => {
    const sessionId = tradingSessionId || sessionStorage.getItem('tradingSessionId');
    
    if (!sessionId) {
      console.warn('No active trading session for transaction');
      return false;
    }

    try {
      const response = await fetch('/api/trading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'transaction',
          tradingSessionId: sessionId,
          transaction,
        }),
      });

      return response.ok;
    } catch (err) {
      console.error('Log transaction error:', err);
      return false;
    }
  }, [tradingSessionId]);

  // Save portfolio snapshot
  const saveSnapshot = useCallback(async (
    snapshot: Snapshot
  ): Promise<boolean> => {
    const sessionId = tradingSessionId || sessionStorage.getItem('tradingSessionId');
    
    if (!sessionId) {
      return false;
    }

    try {
      const response = await fetch('/api/trading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'snapshot',
          tradingSessionId: sessionId,
          snapshot,
        }),
      });

      return response.ok;
    } catch (err) {
      console.error('Save snapshot error:', err);
      return false;
    }
  }, [tradingSessionId]);

  // Get past trading sessions
  const getSessions = useCallback(async (): Promise<TradingSession[]> => {
    try {
      const sessionId = getSessionId();
      const email = localStorage.getItem('minifi_email');
      
      const params = new URLSearchParams();
      if (email) params.set('email', email);
      else if (sessionId) params.set('sessionId', sessionId);
      else return [];

      const response = await fetch(`/api/trading?${params}`);
      const data = await response.json();

      return data.sessions || [];
    } catch (err) {
      console.error('Get sessions error:', err);
      return [];
    }
  }, [getSessionId]);

  // Get specific session with chart data
  const getSession = useCallback(async (id: string): Promise<TradingSession & TradingResults | null> => {
    try {
      const response = await fetch(`/api/trading?tradingSessionId=${id}`);
      const data = await response.json();

      return data.session || null;
    } catch (err) {
      console.error('Get session error:', err);
      return null;
    }
  }, []);

  // Restore session ID from sessionStorage on mount
  useEffect(() => {
    const storedSessionId = sessionStorage.getItem('tradingSessionId');
    if (storedSessionId) {
      setTradingSessionId(storedSessionId);
    }
  }, []);

  return {
    tradingSessionId,
    isLoading,
    error,
    createSession,
    completeSession,
    logTransaction,
    saveSnapshot,
    getSessions,
    getSession,
  };
}



