"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl skeleton" />
    );
  }

  const isDark = theme === "dark";

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-10 h-10 rounded-xl flex items-center justify-center
                 surface-hover cursor-pointer"
      aria-label="Cambiar tema"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotate: -30, opacity: 0, scale: 0.8 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 30, opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Moon size={18} className="text-primary-400" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 30, opacity: 0, scale: 0.8 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -30, opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Sun size={18} className="text-amber-500" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
