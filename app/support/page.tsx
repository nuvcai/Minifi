/**
 * Support Page - Dedicated sponsor & newsletter hub
 * Showcases all ways to support the project
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  Mail, 
  MessageSquare,
  Sparkles,
  Star,
  Users,
  Gift,
  Github,
  Twitter
} from "lucide-react";
import { SponsorPerks } from "@/components/marketing/SponsorPerks";
import { NewsletterSignup } from "@/components/marketing/NewsletterSignup";
import { FeedbackWidget } from "@/components/marketing/FeedbackWidget";
import { Badge } from "@/components/ui/badge";

export default function SupportPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl animate-pulse delay-500" />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-size-[60px_60px]" />
      </div>

      <div className="relative container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          
          {/* Navigation */}
          <div className={`flex items-center justify-between mb-8 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <Link 
              href="/"
              className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/nuvcai/MiniFi"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/nuvcai"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Hero Section */}
          <div className={`text-center mb-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <Image
                src="/favicon.png"
                alt="MiniFi"
                width={60}
                height={60}
                className="rounded-xl"
              />
              <div className="text-left">
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  Support Mini.Fi
                </h1>
                <p className="text-slate-400">Help us make financial literacy free for every teen</p>
              </div>
            </div>
            
            {/* Impact statement */}
            <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20">
              <p className="text-lg text-slate-300">
                <span className="text-2xl mr-2">💚</span>
                Every sponsorship directly funds free financial education for teenagers who don&apos;t have access to wealth-building knowledge.
              </p>
            </div>
          </div>

          {/* Sponsor Tiers */}
          <section className={`mb-16 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <SponsorPerks variant="full" />
          </section>

          {/* Newsletter Section */}
          <section className={`mb-16 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-6">
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 mb-4">
                <Mail className="h-3 w-3 mr-1" />
                Stay Connected
              </Badge>
              <h2 className="text-2xl font-bold text-slate-100 mb-2">
                Join Our Newsletter
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto">
                Not ready to sponsor? No problem! Get free weekly tips, early access to features, and exclusive content.
              </p>
            </div>
            <NewsletterSignup variant="full" source="support-page" />
          </section>

          {/* Feedback Section */}
          <section className={`mb-16 transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-6">
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 mb-4">
                <MessageSquare className="h-3 w-3 mr-1" />
                Your Voice Matters
              </Badge>
              <h2 className="text-2xl font-bold text-slate-100 mb-2">
                Share Your Feedback
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto">
                Help shape the future of Mini.Fi. Your ideas and feedback directly influence our roadmap!
              </p>
            </div>
            <FeedbackWidget variant="inline" pageContext="support-page" />
          </section>

          {/* Other Ways to Help */}
          <section className={`mb-16 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-2xl font-bold text-slate-100 mb-6 text-center">
              Other Ways to Help 🙌
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Star on GitHub */}
              <a
                href="https://github.com/nuvcai/MiniFi"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-amber-500/30 hover:bg-slate-800 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                    <Star className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-slate-200">Star on GitHub</span>
                </div>
                <p className="text-sm text-slate-400">
                  Help us get discovered by more developers and educators
                </p>
              </a>
              
              {/* Share */}
              <a
                href="https://twitter.com/intent/tweet?text=Check%20out%20Legacy%20Guardians%20-%20a%20free%20game%20that%20teaches%20teens%20about%20investing!%20🎮📈&url=https://minifi.app"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 hover:bg-slate-800 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-slate-200">Tell a Friend</span>
                </div>
                <p className="text-sm text-slate-400">
                  Share with parents, teachers, or teens who&apos;d love this
                </p>
              </a>
              
              {/* Contribute */}
              <a
                href="https://github.com/nuvcai/MiniFi/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/30 hover:bg-slate-800 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                    <Gift className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-slate-200">Contribute</span>
                </div>
                <p className="text-sm text-slate-400">
                  Developers - submit PRs or report issues!
                </p>
              </a>
              
              {/* Partner */}
              <a
                href="mailto:hello@nuvc.ai?subject=Partnership%20Inquiry"
                className="group p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/30 hover:bg-slate-800 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-slate-200">Partner With Us</span>
                </div>
                <p className="text-sm text-slate-400">
                  Schools, orgs, or brands - let&apos;s collaborate!
                </p>
              </a>
            </div>
          </section>

          {/* Footer */}
          <footer className={`text-center pb-8 transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Image
                src="/nuvc-logo.png"
                alt="NUVC.AI"
                width={24}
                height={24}
                className="rounded"
              />
              <span className="text-sm text-slate-500">
                Made with 💚 by <a href="https://nuvc.ai" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">NUVC.AI</a>
              </span>
            </div>
            <p className="text-xs text-slate-600">
              © 2025 NUVC.AI × Tick.AI • All Rights Reserved
            </p>
          </footer>
        </div>
      </div>

      {/* Floating Feedback Button */}
      <FeedbackWidget variant="floating" pageContext="support-page" />
    </div>
  );
}


