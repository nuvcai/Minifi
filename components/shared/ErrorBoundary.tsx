/**
 * Error Boundary Component
 * Gracefully handles runtime errors in the game flow
 * © 2025 NUVC.AI. All Rights Reserved.
 */

"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    // Could send to error tracking service here
    // e.g., Sentry.captureException(error, { extra: errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="text-center max-w-md mx-auto">
            {/* Error Icon */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-500/20 dark:to-orange-500/20 flex items-center justify-center border-2 border-amber-300 dark:border-amber-500/40">
              <AlertTriangle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
            
            {/* Error Message */}
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {this.props.fallbackTitle || "Oops! Something went wrong 🙈"}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {this.props.fallbackMessage || 
                "Don't worry - your progress is saved! Try refreshing or go back to the main game."}
            </p>
            
            {/* Error Details (Development only) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-left">
                <p className="text-xs font-mono text-red-600 dark:text-red-400 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={this.handleReset}
                className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Link href="/timeline">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Game
                </Button>
              </Link>
            </div>
            
            {/* Encouragement */}
            <p className="mt-6 text-xs text-gray-500 dark:text-gray-500 italic">
              "Every bug is a learning opportunity" 🐛→🦋
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Mission Error Boundary - Specific for mission flow
 */
export function MissionErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallbackTitle="Mission Hit a Snag! 🎯"
      fallbackMessage="The mission encountered an issue. Your progress is safe - try starting the mission again!"
    >
      {children}
    </ErrorBoundary>
  );
}

/**
 * Game Error Boundary - For the main game interface
 */
export function GameErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallbackTitle="Game Paused 🎮"
      fallbackMessage="Something unexpected happened. Your iii tokens and badges are safe!"
    >
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundary;
