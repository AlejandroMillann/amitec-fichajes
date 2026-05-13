"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, BarChart2, CalendarDays, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/providers/LocaleProvider";

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { tr } = useLocale();

  const NAV_ITEMS = [
    { href: "/dashboard", icon: Home, label: tr.nav.home },
    { href: "/estadisticas", icon: BarChart2, label: tr.nav.stats },
    { href: "/vacaciones", icon: CalendarDays, label: tr.nav.vacations },
    { href: "/perfil", icon: User, label: tr.nav.profile },
  ];

  return (
    <nav className="bottom-nav fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="flex items-center justify-around px-2 py-1"
           style={{ paddingBottom: "max(20px, env(safe-area-inset-bottom))" }}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <motion.button
              key={item.href}
              whileTap={{ scale: 0.88 }}
              onClick={() => router.push(item.href)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 px-4 py-2 rounded-2xl",
                "transition-all duration-200 min-w-[60px]",
                isActive ? "text-primary-400" : ""
              )}
              style={{ color: isActive ? "var(--primary)" : "var(--text-tertiary)" }}
            >
              {/* Active background pill */}
              {isActive && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: "var(--primary-light)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}

              {/* Icon */}
              <div className="relative z-10">
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className="transition-all duration-200"
                />
              </div>

              {/* Label */}
              <span className={cn(
                "text-[10px] font-medium transition-all duration-200 relative z-10",
                isActive ? "font-semibold" : ""
              )}>
                {item.label}
              </span>

              {/* Active dot */}
              {isActive && (
                <motion.div
                  layoutId="nav-dot"
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full z-10"
                  style={{ background: "var(--primary)" }}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
