/**
 * MobileBottomNav - Bottom navigation for mobile devices
 * Follows iOS/Android native patterns for thumb-friendly navigation
 */

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Gamepad2,
  BookOpen,
  Trophy,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  {
    href: "/",
    icon: <Home className="h-5 w-5" />,
    label: "Home",
  },
  {
    href: "/timeline",
    icon: <Gamepad2 className="h-5 w-5" />,
    label: "Play",
  },
  {
    href: "/library",
    icon: <BookOpen className="h-5 w-5" />,
    label: "Learn",
  },
  {
    href: "/competition",
    icon: <Trophy className="h-5 w-5" />,
    label: "Compete",
  },
  {
    href: "/support",
    icon: <HelpCircle className="h-5 w-5" />,
    label: "Help",
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Gradient fade effect at top */}
      <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-t from-white/95 to-transparent pointer-events-none" />
      
      {/* Main nav container */}
      <div className="bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div 
          className="flex items-center justify-around px-2"
          style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/" && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 py-2 px-3 min-w-[60px] rounded-xl transition-all duration-200 touch-manipulation",
                  "active:scale-95",
                  isActive
                    ? "text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {/* Icon container with active indicator */}
                <div className="relative">
                  <div className={cn(
                    "p-1.5 rounded-xl transition-all duration-200",
                    isActive && "bg-indigo-100"
                  )}>
                    {item.icon}
                  </div>
                  
                  {/* Active dot indicator */}
                  {isActive && (
                    <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-600" />
                  )}
                </div>
                
                {/* Label */}
                <span className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-indigo-600" : "text-gray-500"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

// Spacer component to prevent content from being hidden behind nav
export function MobileNavSpacer() {
  return (
    <div 
      className="h-20 md:hidden" 
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    />
  );
}

export default MobileBottomNav;

