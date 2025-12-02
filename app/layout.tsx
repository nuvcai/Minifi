/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   MiniFi - Financial Literacy Platform (MVP - Hackathon Edition)            ║
 * ║   ✨ Vibe-coded by Tick.AI for AWS AI Hackathon 2025 ✨                      ║
 * ║   Copyright (c) 2025 NUVC.AI / Tick.AI. All Rights Reserved.                ║
 * ║   PROPRIETARY - NO COMMERCIAL USE | https://nuvc.ai                         ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import type React from "react";
import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Outfit - Modern geometric sans for headings, bold and youthful
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800", "900"],
});

// Plus Jakarta Sans - Contemporary rounded sans for body, friendly and readable
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mini.Fi by NUVC.AI - Financial Literacy Platform",
  description: "Empowering Australian teens with AI-powered investment education through gamified learning. © 2025 NUVC.AI / Tick.AI",
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  authors: [{ name: "NUVC.AI / Tick.AI", url: "https://nuvc.ai" }],
  creator: "NUVC.AI",
  publisher: "Tick.AI",
  keywords: ["financial literacy", "investment education", "AI coaching", "NUVC.AI", "Tick.AI", "Australian teens"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${plusJakarta.variable} antialiased`}
    >
      <body className="font-sans min-h-screen flex flex-col bg-slate-950" suppressHydrationWarning={true}>
        <main className="flex-1">
          {children}
        </main>
        {/* NUVC.AI Watermark Footer */}
        <footer className="w-full py-3 px-4 text-center text-xs text-slate-500 border-t border-slate-800/50 bg-slate-950/80 backdrop-blur">
          <p>
            ✨ Vibe-coded by <a href="https://tick.ai" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors font-medium">Tick.AI</a> • MVP for AWS AI Hackathon 2025 • © <a href="https://nuvc.ai" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">NUVC.AI</a>
          </p>
        </footer>
      </body>
    </html>
  );
}
