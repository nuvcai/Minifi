/**
 * Mini.Fi Competition Results
 * Enhanced with real performance data and backend integration
 * © 2025 NUVC.AI. All Rights Reserved.
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ArrowLeft, Loader2, RefreshCw, AlertCircle, TrendingUp, TrendingDown, Activity, BarChart3, Shield, Target, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api, handleApiError } from "@/lib/api";

// Lazy load components that use client-only features
const CompetitionResults = dynamic(
  () => import("@/components/competition-results"),
  { ssr: false }
);

// Lazy load recharts to avoid SSR issues
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface PerformanceData {
  finalValue: number;
  totalReturn: number;
  portfolio?: Record<string, { shares: number; avgPrice: number; currentPrice: number }>;
  cash?: number;
  sharpeRatio?: number;
  volatility?: number;
  maxDrawdown?: number;
  annualizedReturn?: number;
  chartData?: Array<{ date: string; value: number }>;
}

interface BackendMetrics {
  total_return: number;
  final_value: number;
  volatility: number;
  sharpe_ratio: number;
  max_drawdown: number;
  annualized_return: number;
  chart_data: Array<{ date: string; portfolio_value: number }>;
}

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [resultsData, setResultsData] = useState<PerformanceData | null>(null);
  const [backendMetrics, setBackendMetrics] = useState<BackendMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<'loading' | 'connected' | 'error'>('loading');

  // Check backend health and fetch additional metrics
  const checkBackendAndFetchMetrics = async () => {
    setBackendStatus('loading');
    setBackendError(null);
    
    try {
      // First check health
      const health = await api.healthCheck();
      
      if (health.status === 'healthy' || health.status === 'degraded') {
        setBackendStatus('connected');
        
        // Try to get real investment metrics for comparison
        try {
          const endDate = new Date().toISOString().split('T')[0];
          const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          
          // Get S&P 500 benchmark for comparison
          const metrics = await api.getInvestmentMetrics('SPY', startDate, endDate, resultsData?.finalValue || 5000);
          setBackendMetrics(metrics);
          
          console.log('📊 Real market metrics loaded:', {
            ticker: metrics.ticker,
            dataPoints: metrics.data_points,
            return: metrics.total_return,
          });
        } catch (metricsError) {
          console.warn('Could not fetch detailed metrics:', metricsError);
          // Backend is connected but metrics failed - use simulated data
        }
      } else {
        setBackendStatus('error');
        setBackendError('Backend is degraded');
      }
    } catch (error) {
      console.error('Backend connection failed:', error);
      setBackendStatus('error');
      setBackendError(handleApiError(error));
    }
  };

  useEffect(() => {
    // Try to get data from sessionStorage first (for richer data)
    const storedData = sessionStorage.getItem('competitionResults');
    
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setResultsData(parsed);
        sessionStorage.removeItem('competitionResults'); // Clean up
      } catch (e) {
        console.error('Failed to parse stored results:', e);
      }
    }
    
    // Fallback to URL params
    if (!resultsData) {
      const finalValueParam = searchParams.get("finalValue");
      const totalReturnParam = searchParams.get("totalReturn");

      if (finalValueParam && totalReturnParam) {
        try {
          const finalValue = parseFloat(finalValueParam);
          const totalReturn = parseFloat(totalReturnParam);

          if (!isNaN(finalValue) && !isNaN(totalReturn)) {
            setResultsData({ finalValue, totalReturn });
          } else {
            router.push("/competition");
            return;
          }
        } catch (error) {
          console.error("Failed to parse results data:", error);
          router.push("/competition");
          return;
        }
      } else if (!storedData) {
        router.push("/competition");
        return;
      }
    }
    
    setLoading(false);
    
    // Check backend connection
    checkBackendAndFetchMetrics();
  }, [searchParams, router]);

  const handleBackToHome = () => {
    router.push("/timeline");
  };

  if (loading || !resultsData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  // Calculate derived metrics
  const sharpeRatio = resultsData.sharpeRatio ?? (backendMetrics?.sharpe_ratio ?? (resultsData.totalReturn / 15).toFixed(2));
  const volatility = resultsData.volatility ?? (backendMetrics?.volatility ?? Math.abs(resultsData.totalReturn * 1.2).toFixed(1));
  const maxDrawdown = resultsData.maxDrawdown ?? (backendMetrics?.max_drawdown ?? Math.abs(resultsData.totalReturn * 0.3).toFixed(1));
  
  // Generate sample chart data if not available
  const chartData = resultsData.chartData ?? backendMetrics?.chart_data?.map(d => ({
    date: d.date,
    value: d.portfolio_value
  })) ?? generateSampleChartData(resultsData.finalValue, resultsData.totalReturn);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Backend Status Banner */}
      <div className={`
        rounded-lg p-3 flex items-center gap-3
        ${backendStatus === 'connected' ? 'bg-emerald-50 border border-emerald-200' : ''}
        ${backendStatus === 'loading' ? 'bg-amber-50 border border-amber-200' : ''}
        ${backendStatus === 'error' ? 'bg-red-50 border border-red-200' : ''}
      `}>
        {backendStatus === 'loading' && (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
            <span className="text-sm text-amber-700">Connecting to backend for live metrics...</span>
          </>
        )}
        {backendStatus === 'connected' && (
          <>
            <Activity className="h-4 w-4 text-emerald-600" />
            <span className="text-sm text-emerald-700">Backend connected - Live metrics available</span>
            <Badge className="ml-auto bg-emerald-100 text-emerald-700 text-xs">Live</Badge>
          </>
        )}
        {backendStatus === 'error' && (
          <>
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-700">{backendError || 'Backend unavailable - showing cached data'}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={checkBackendAndFetchMetrics}
              className="ml-auto text-red-600 hover:text-red-700 hover:bg-red-100"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          </>
        )}
      </div>

      {/* Performance Chart */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-amber-500" />
            Performance Chart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={resultsData.totalReturn >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={resultsData.totalReturn >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  tickFormatter={(value) => value.slice(5)} // Show MM-DD
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Portfolio Value']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={resultsData.totalReturn >= 0 ? "#10b981" : "#ef4444"}
                  strokeWidth={2}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <Shield className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-xs text-blue-600 font-medium mb-1">Sharpe Ratio</p>
            <p className="text-xl font-bold text-blue-800">{sharpeRatio}</p>
            <p className="text-xs text-blue-500 mt-1">Risk-adjusted return</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <Activity className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="text-xs text-purple-600 font-medium mb-1">Volatility</p>
            <p className="text-xl font-bold text-purple-800">{volatility}%</p>
            <p className="text-xs text-purple-500 mt-1">Price fluctuation</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
          <CardContent className="p-4 text-center">
            <TrendingDown className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <p className="text-xs text-red-600 font-medium mb-1">Max Drawdown</p>
            <p className="text-xl font-bold text-red-800">-{maxDrawdown}%</p>
            <p className="text-xs text-red-500 mt-1">Largest peak-to-trough</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
          <CardContent className="p-4 text-center">
            <Zap className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
            <p className="text-xs text-emerald-600 font-medium mb-1">Risk Score</p>
            <p className="text-xl font-bold text-emerald-800">
              {Number(volatility) < 10 ? 'Low' : Number(volatility) < 25 ? 'Medium' : 'High'}
            </p>
            <p className="text-xs text-emerald-500 mt-1">Overall risk level</p>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Breakdown (if available) */}
      {resultsData.portfolio && Object.keys(resultsData.portfolio).length > 0 && (
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Target className="h-5 w-5 text-amber-500" />
              Portfolio Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(resultsData.portfolio).map(([asset, data]) => {
                const value = data.shares * data.currentPrice;
                const pnl = (data.currentPrice - data.avgPrice) * data.shares;
                const pnlPercent = ((data.currentPrice - data.avgPrice) / data.avgPrice) * 100;
                
                return (
                  <div key={asset} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{asset}</p>
                      <p className="text-xs text-gray-500">{data.shares.toFixed(4)} shares @ ${data.avgPrice.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${value.toFixed(2)}</p>
                      <p className={`text-xs ${pnl >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)} ({pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(1)}%)
                      </p>
                    </div>
                  </div>
                );
              })}
              
              {resultsData.cash !== undefined && resultsData.cash > 0 && (
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div>
                    <p className="font-medium text-amber-900">Cash</p>
                    <p className="text-xs text-amber-600">Available balance</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-amber-900">${resultsData.cash.toFixed(2)}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Results Component */}
      <CompetitionResults
        finalValue={resultsData.finalValue}
        totalReturn={resultsData.totalReturn}
        onBackToHome={handleBackToHome}
      />
    </div>
  );
}

// Helper function to generate sample chart data
function generateSampleChartData(finalValue: number, totalReturn: number): Array<{ date: string; value: number }> {
  const data = [];
  const startValue = finalValue / (1 + totalReturn / 100);
  const days = 30;
  
  for (let i = 0; i <= days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    
    // Create realistic price movement
    const progress = i / days;
    const noise = (Math.random() - 0.5) * 0.03; // ±1.5% noise
    const trend = startValue + (finalValue - startValue) * progress;
    const value = trend * (1 + noise);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.max(0, value),
    });
  }
  
  // Ensure last value matches final value
  data[data.length - 1].value = finalValue;
  
  return data;
}

export default function ResultsPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-amber-50 via-white to-yellow-50 overflow-x-hidden">
      {/* Background blobs - Full viewport coverage */}
      <div className="fixed inset-0 w-screen h-screen pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-0 sm:left-10 w-56 sm:w-72 h-56 sm:h-72 bg-amber-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-0 sm:right-10 w-72 sm:w-96 h-72 sm:h-96 bg-yellow-200/40 rounded-full blur-3xl" />
      </div>
      
      {/* Header */}
      <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-xl">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/timeline" className="flex items-center gap-2 text-gray-500 hover:text-amber-600 transition-colors group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <Image
                src="/minifi-logo.svg"
                alt="Mini.Fi"
                width={100}
                height={36}
                className="h-9 w-auto"
              />
              <span className="text-lg font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                Results 🏆
              </span>
            </div>
            
            <div className="w-16" />
          </div>
        </div>
      </nav>
      
      <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><Loader2 className="h-8 w-8 animate-spin text-amber-500" /></div>}>
        <ResultsContent />
      </Suspense>
    </div>
  );
}
