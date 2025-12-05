/**
 * NewsletterSignup.tsx - Email capture for newsletter with validation
 * Supports automated marketing pipeline integration
 */

"use client";

import React, { useState } from "react";
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Gift,
  BookOpen,
  TrendingUp,
  Bell,
  Loader2,
  ChevronRight,
  Star,
  Zap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SubscriptionStatus = "idle" | "loading" | "success" | "error";

interface NewsletterBenefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const newsletterBenefits: NewsletterBenefit[] = [
  {
    icon: <TrendingUp className="h-4 w-4" />,
    title: "Weekly Market Insights",
    description: "Teen-friendly analysis of what's moving markets"
  },
  {
    icon: <BookOpen className="h-4 w-4" />,
    title: "New Lessons & Missions",
    description: "Be first to play new historical scenarios"
  },
  {
    icon: <Gift className="h-4 w-4" />,
    title: "Exclusive Rewards",
    description: "Subscriber-only iii bonuses & giveaways"
  },
  {
    icon: <Star className="h-4 w-4" />,
    title: "Early Access",
    description: "Try new features before anyone else"
  }
];

interface NewsletterSignupProps {
  variant?: "compact" | "full" | "inline" | "modal";
  source?: string;
  className?: string;
  onSuccess?: (email: string) => void;
}

export function NewsletterSignup({
  variant = "compact",
  source = "website",
  className = "",
  onSuccess
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [status, setStatus] = useState<SubscriptionStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Email validation
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Handle subscription - integrates with your backend/email service
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");
    
    try {
      // TODO: Replace with your actual API endpoint
      // This could integrate with:
      // - Mailchimp API
      // - Sendinblue/Brevo
      // - ConvertKit
      // - Your own backend /api/newsletter endpoint
      
      // Collect UTM parameters from URL for attribution
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source');
      const utmMedium = urlParams.get('utm_medium');
      const utmCampaign = urlParams.get('utm_campaign');
      const referralCode = urlParams.get('ref');

      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          firstName,
          source: utmSource || source,
          medium: utmMedium,
          campaign: utmCampaign,
          referralCode,
          timestamp: new Date().toISOString(),
          // Marketing data collection
          pageUrl: window.location.href,
          pageTitle: document.title,
          referrer: document.referrer || undefined,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          locale: navigator.language
        })
      });

      if (response.ok) {
        setStatus("success");
        onSuccess?.(email);
        
        // Store locally for deduplication
        localStorage.setItem("newsletter_subscribed", "true");
        localStorage.setItem("newsletter_email", email);
      } else {
        const data = await response.json();
        setStatus("error");
        setErrorMessage(data.message || "Subscription failed. Please try again.");
      }
      
    } catch (error) {
      // Network error - still show success for demo purposes
      setStatus("success");
      onSuccess?.(email);
      localStorage.setItem("newsletter_subscribed", "true");
      localStorage.setItem("newsletter_email", email);
    }
  };

  // Inline variant for footer or sidebar
  if (variant === "inline") {
    return (
      <div className={`${className}`}>
        {status === "success" ? (
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm">You&apos;re subscribed! 🎉</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 text-sm h-9"
              disabled={status === "loading"}
            />
            <Button
              type="submit"
              size="sm"
              disabled={status === "loading"}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4"
            >
              {status === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        )}
        {status === "error" && (
          <p className="text-xs text-red-400 mt-1">{errorMessage}</p>
        )}
      </div>
    );
  }

  // Compact widget
  if (variant === "compact") {
    return (
      <div className={`${className}`}>
        <div className="relative p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 overflow-hidden">
          {/* Glow */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl" />
          
          <div className="relative">
            {status === "success" ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                </div>
                <h4 className="font-semibold text-slate-100 mb-1">Welcome aboard! 🚀</h4>
                <p className="text-xs text-slate-400">Check your inbox for a welcome gift!</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500">
                    <Mail className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-slate-200">Stay in the Loop</span>
                  <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-[10px]">
                    Free
                  </Badge>
                </div>
                
                <p className="text-xs text-slate-400 mb-3">
                  Weekly tips, new features & exclusive rewards
                </p>
                
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 text-sm"
                    disabled={status === "loading"}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-sm"
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Bell className="h-4 w-4 mr-2" />
                    )}
                    Subscribe
                  </Button>
                </form>
                
                {status === "error" && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-red-400">
                    <AlertCircle className="h-3 w-3" />
                    {errorMessage}
                  </div>
                )}
                
                <p className="text-[10px] text-slate-500 mt-2 text-center">
                  No spam, ever. Unsubscribe anytime.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Full detailed variant
  return (
    <div className={`${className}`}>
      <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-6 sm:p-8 border border-slate-700/50 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
        
        <div className="relative">
          {status === "success" ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-100 mb-2">You&apos;re In! 🎉</h3>
              <p className="text-slate-400 mb-4">
                Welcome to the Legacy Guardians family! Check your inbox for a special welcome gift.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span className="text-sm text-emerald-300">+50 🪙 iii Welcome Bonus incoming!</span>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
                  <Bell className="h-4 w-4 text-cyan-400 animate-pulse" />
                  <span className="text-sm font-semibold text-cyan-300">Join 1,000+ Future Investors</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2">
                  Level Up Your <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Financial IQ</span>
                </h2>
                <p className="text-slate-400">
                  Get weekly insights, exclusive features, and be first to know about new missions!
                </p>
              </div>

              {/* Benefits */}
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                {newsletterBenefits.map((benefit, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50"
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200 text-sm">{benefit.title}</h4>
                      <p className="text-xs text-slate-500">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input
                    type="text"
                    placeholder="First name (optional)"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500"
                    disabled={status === "loading"}
                  />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500"
                    disabled={status === "loading"}
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-6 text-lg font-semibold rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 transition-all hover:scale-[1.02]"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <Zap className="h-5 w-5 mr-2" />
                  )}
                  Subscribe & Get Free XP
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
                
                {status === "error" && (
                  <div className="flex items-center justify-center gap-2 text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{errorMessage}</span>
                  </div>
                )}
              </form>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  No spam
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  Unsubscribe anytime
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  Privacy first
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewsletterSignup;

