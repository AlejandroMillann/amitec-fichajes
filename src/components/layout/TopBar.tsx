"use client";

import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { Bell } from "lucide-react";
import { useState } from "react";

interface TopBarProps {
  title?: string;
  subtitle?: string;
  showNotifications?: boolean;
  rightElement?: React.ReactNode;
}

export function TopBar({ title, subtitle, showNotifications = true, rightElement }: TopBarProps) {
  const [hasUnread] = useState(true);

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-40 glass-blur px-4 py-3 flex items-center justify-between"
    >
      {/* Left: Logo or Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {/* AMITEC Logo mark */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xs tracking-wider">A</span>
          </div>
          <div>
            {title ? (
              <>
                <p className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
                  AMITEC
                </p>
                <p className="text-sm font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
                  {title}
                </p>
              </>
            ) : (
              <span className="font-bold text-base gradient-text tracking-tight">
                AMITEC
              </span>
            )}
            {subtitle && (
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {rightElement}
        {showNotifications && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="relative w-10 h-10 rounded-xl flex items-center justify-center surface-hover"
          >
            <Bell size={18} style={{ color: "var(--text-secondary)" }} />
            {hasUnread && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-500" />
            )}
          </motion.button>
        )}
        <ThemeToggle />
      </div>
    </motion.header>
  );
}
