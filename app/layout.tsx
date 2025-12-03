/**
 * Mini.Fi - Root Layout
 * © 2025 NUVC.AI. All Rights Reserved.
 */

import type React from "react";
import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { MobileBottomNav, MobileNavSpacer } from "@/components/shared/MobileBottomNav";

// Outfit - Modern geometric sans for headings
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800"],
});

// Plus Jakarta Sans - Clean sans for body
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Mini.Fi - Learn to Invest Through Play",
  description: "A free game that teaches teens about investing through time-travel adventures. Built by NUVC.AI for the AWS AI Hackathon 2025.",
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  authors: [{ name: "NUVC.AI", url: "https://nuvc.ai" }],
  creator: "NUVC.AI",
  keywords: ["financial literacy", "investment education", "game", "teens", "AI"],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mini.Fi",
  },
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
      <body 
        className="font-sans min-h-screen bg-[#0a0a0f] text-white" 
        suppressHydrationWarning={true}
      >
        {children}
        {/* Mobile bottom navigation - hidden on desktop */}
        <MobileBottomNav />
        <MobileNavSpacer />
      </body>
    </html>
  );
}
