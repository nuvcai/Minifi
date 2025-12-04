/**
 * Support Page - Light, friendly design
 * © 2025 NUVC.AI. All Rights Reserved.
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Heart, Github, Mail, Send, CheckCircle2, Loader2, Star, Users, Gift, Sparkles } from "lucide-react";

export default function SupportPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    
    setStatus("loading");
    try {
      await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "support-page" })
      });
      setStatus("success");
    } catch {
      setStatus("success");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-pink-50 via-white to-violet-50 overflow-x-hidden">
      {/* Background blobs - Full viewport coverage */}
      <div className="fixed inset-0 w-screen h-screen pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-0 sm:left-10 w-56 sm:w-72 h-56 sm:h-72 bg-pink-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-0 sm:right-10 w-72 sm:w-96 h-72 sm:h-96 bg-violet-200/40 rounded-full blur-3xl" />
      </div>
      
      <div className="relative w-full">
        {/* Navigation */}
        <nav className={`w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors group"
            >
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
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Support
              </span>
            </div>
            
            <div className="w-16" />
          </div>
        </nav>

        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          {/* Hero */}
          <div className={`max-w-2xl mx-auto pt-12 pb-16 text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="text-5xl mb-6">💝</div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Support Mini.Fi
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Help us make financial literacy accessible to every teenager.
              Your support keeps this project <span className="font-semibold text-pink-500">free for everyone!</span>
            </p>
          </div>

          {/* Sponsor Section */}
          <div className={`max-w-4xl mx-auto pb-16 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* GitHub Sponsors */}
              <a
                href="https://github.com/sponsors/nuvcai"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-8 rounded-3xl bg-white shadow-xl shadow-pink-100 border border-pink-100 hover:shadow-2xl hover:shadow-pink-200 hover:-translate-y-1 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Heart className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Become a Sponsor 💖</h3>
                <p className="text-gray-500 mb-4">
                  Monthly or one-time support through GitHub Sponsors. Get recognition and exclusive perks!
                </p>
                <span className="inline-flex items-center gap-2 text-pink-500 font-semibold">
                  Sponsor on GitHub
                  <ArrowLeft className="h-4 w-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>

              {/* Star on GitHub */}
              <a
                href="https://github.com/nuvcai/MiniFi"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-8 rounded-3xl bg-white shadow-xl shadow-amber-100 border border-amber-100 hover:shadow-2xl hover:shadow-amber-200 hover:-translate-y-1 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Star className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Star on GitHub ⭐</h3>
                <p className="text-gray-500 mb-4">
                  Free way to support! Stars help us get discovered by more developers and educators.
                </p>
                <span className="inline-flex items-center gap-2 text-amber-500 font-semibold">
                  View repository
                  <ArrowLeft className="h-4 w-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
              
            </div>

            {/* Other ways to help */}
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              <div className="p-6 rounded-2xl bg-white shadow-lg shadow-indigo-50 border border-indigo-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-indigo-500" />
                  </div>
                  <h4 className="font-bold text-gray-900">Tell a Friend</h4>
                </div>
                <p className="text-sm text-gray-500">Share with parents, teachers, or teens who'd love this! 📣</p>
              </div>
              
              <div className="p-6 rounded-2xl bg-white shadow-lg shadow-violet-50 border border-violet-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-violet-500" />
                  </div>
                  <h4 className="font-bold text-gray-900">Partner With Us</h4>
                </div>
                <p className="text-sm text-gray-500">Schools, orgs, or brands - <a href="mailto:hello@nuvc.ai" className="text-violet-500 hover:underline">let's collaborate!</a></p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className={`max-w-xl mx-auto pb-16 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <div className="p-8 rounded-3xl bg-white shadow-xl shadow-indigo-100 border border-indigo-100">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">📬</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Stay Updated!</h2>
                <p className="text-gray-500">
                  Get notified about new features and missions. No spam, promise! 🤞
                </p>
              </div>
              
              {status === "success" ? (
                <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-green-50 border border-green-200">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-green-700 font-medium">You're subscribed! 🎉</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                      disabled={status === "loading"}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="px-6 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all disabled:opacity-50"
                  >
                    {status === "loading" ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contact */}
          <div className={`max-w-xl mx-auto pb-16 text-center transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-gray-500 text-sm">
              Questions? Reach out at{" "}
              <a href="mailto:hello@nuvc.ai" className="text-indigo-500 hover:underline font-medium">
                hello@nuvc.ai
              </a>
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-gray-100 bg-white/50 backdrop-blur">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <span>© 2025 NUVC.AI</span>
              <a href="https://nuvc.ai" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">
                About
              </a>
              <Link href="/" className="hover:text-indigo-600 transition-colors">
                Home
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
