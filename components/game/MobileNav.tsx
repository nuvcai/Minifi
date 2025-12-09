"use client";

import React from "react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import {
  Map,
  Briefcase,
  MessageCircle,
  Trophy,
  Gift,
} from "lucide-react";

interface NavItem {
  id: string;
  icon: React.ElementType;
  label: string;
  href?: string;
  action?: () => void;
  badge?: number;
}

interface MobileNavProps {
  onCoachClick?: () => void;
  onRewardsClick?: () => void;
  coachBadge?: number;
  rewardsBadge?: number;
}

export function MobileNav({
  onCoachClick,
  onRewardsClick,
  coachBadge,
  rewardsBadge,
}: MobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems: NavItem[] = [
    {
      id: "timeline",
      icon: Map,
      label: "Timeline",
      href: "/timeline",
    },
    {
      id: "competition",
      icon: Briefcase,
      label: "Trade",
      href: "/competition",
    },
    {
      id: "coach",
      icon: MessageCircle,
      label: "Coach",
      action: onCoachClick,
      badge: coachBadge,
    },
    {
      id: "rewards",
      icon: Gift,
      label: "Rewards",
      action: onRewardsClick,
      badge: rewardsBadge,
    },
  ];

  const handleNavClick = (item: NavItem) => {
    if (item.action) {
      item.action();
    } else if (item.href) {
      router.push(item.href);
    }
  };

  const isActive = (item: NavItem) => {
    if (item.href) {
      return pathname === item.href;
    }
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-card/95 backdrop-blur-md border-t border-border shadow-lg">
      <div className="flex justify-around items-center py-2 px-2 safe-area-pb">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);

          return (
            <motion.button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`relative flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-colors ${
                active
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              whileTap={{ scale: 0.9 }}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${active ? "stroke-[2.5]" : ""}`} />
                
                {/* Badge */}
                {item.badge && item.badge > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold px-1"
                  >
                    {item.badge > 9 ? "9+" : item.badge}
                  </motion.span>
                )}
              </div>
              
              <span className={`text-[10px] mt-1 font-medium ${active ? "text-primary" : ""}`}>
                {item.label}
              </span>

              {/* Active Indicator */}
              {active && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}

// Safe area padding for iOS
const styles = `
  .safe-area-pb {
    padding-bottom: env(safe-area-inset-bottom, 8px);
  }
`;

// Add styles to document
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

