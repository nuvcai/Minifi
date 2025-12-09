/**
 * Trading Sessions API
 * Handles saving and loading trading session data
 * © 2025 NUVC.AI. All Rights Reserved.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getSupabase() {
  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseServiceKey);
}

// GET - Get trading session(s)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const email = searchParams.get('email');
    const tradingSessionId = searchParams.get('tradingSessionId');
    
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Get specific trading session by ID
    if (tradingSessionId) {
      const { data, error } = await supabase
        .from('trading_sessions')
        .select('*')
        .eq('id', tradingSessionId)
        .single();

      if (error) throw error;
      
      return NextResponse.json({ session: data });
    }

    // Get all sessions for a user
    let query = supabase.from('trading_sessions').select('*');
    
    if (email) {
      query = query.eq('email', email);
    } else if (sessionId) {
      query = query.eq('session_id', sessionId);
    } else {
      return NextResponse.json(
        { error: 'Email or sessionId required' },
        { status: 400 }
      );
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ sessions: data || [] });
  } catch (error) {
    console.error('GET trading sessions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trading sessions', details: String(error) },
      { status: 500 }
    );
  }
}

// POST - Create or update trading session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      action,
      sessionId,
      email,
      tradingSessionId,
      // Session data
      competitionType,
      coachId,
      startingCapital,
      // Results
      finalValue,
      totalReturn,
      sharpeRatio,
      volatility,
      maxDrawdown,
      annualizedReturn,
      finalPortfolio,
      finalCash,
      chartData,
      status,
      // Transaction data
      transaction,
      // Snapshot data
      snapshot,
    } = body;

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Create new session
    if (action === 'create') {
      const { data, error } = await supabase
        .from('trading_sessions')
        .insert({
          session_id: sessionId,
          email,
          competition_type: competitionType || 'standard',
          coach_id: coachId,
          starting_capital: startingCapital || 5000,
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ 
        success: true, 
        tradingSessionId: data.id,
        message: 'Trading session created' 
      });
    }

    // Complete session with results
    if (action === 'complete') {
      if (!tradingSessionId) {
        return NextResponse.json(
          { error: 'tradingSessionId required to complete session' },
          { status: 400 }
        );
      }

      const { error } = await supabase
        .from('trading_sessions')
        .update({
          final_value: finalValue,
          total_return: totalReturn,
          sharpe_ratio: sharpeRatio,
          volatility,
          max_drawdown: maxDrawdown,
          annualized_return: annualizedReturn,
          final_portfolio: finalPortfolio,
          final_cash: finalCash,
          chart_data: chartData,
          status: 'completed',
          ended_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', tradingSessionId);

      if (error) throw error;

      return NextResponse.json({ 
        success: true, 
        message: 'Trading session completed' 
      });
    }

    // Log transaction
    if (action === 'transaction' && transaction) {
      if (!tradingSessionId) {
        return NextResponse.json(
          { error: 'tradingSessionId required for transaction' },
          { status: 400 }
        );
      }

      const { error } = await supabase
        .from('trading_transactions')
        .insert({
          session_id: tradingSessionId,
          asset: transaction.asset,
          action: transaction.action,
          shares: transaction.shares,
          price: transaction.price,
          total_value: transaction.totalValue,
          asset_class: transaction.assetClass,
          portfolio_value_after: transaction.portfolioValueAfter,
          cash_after: transaction.cashAfter,
        });

      if (error) throw error;

      return NextResponse.json({ 
        success: true, 
        message: 'Transaction logged' 
      });
    }

    // Save portfolio snapshot
    if (action === 'snapshot' && snapshot) {
      if (!tradingSessionId) {
        return NextResponse.json(
          { error: 'tradingSessionId required for snapshot' },
          { status: 400 }
        );
      }

      const { error } = await supabase
        .from('portfolio_snapshots')
        .insert({
          session_id: tradingSessionId,
          total_value: snapshot.totalValue,
          cash_value: snapshot.cashValue,
          holdings: snapshot.holdings,
          prices: snapshot.prices,
        });

      if (error) throw error;

      return NextResponse.json({ 
        success: true, 
        message: 'Snapshot saved' 
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('POST trading error:', error);
    return NextResponse.json(
      { error: 'Failed to process trading request', details: String(error) },
      { status: 500 }
    );
  }
}



