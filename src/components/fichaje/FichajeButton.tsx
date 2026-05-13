"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Play, Square, RotateCcw } from "lucide-react";
import type { FichajeStatus } from "@/lib/types";
import { useLocale } from "@/providers/LocaleProvider";

interface FichajeButtonProps {
  status: FichajeStatus;
  onPress: () => void;
  disabled?: boolean;
}

const STATUS_VISUAL = {
  idle: {
    gradient: "from-primary-500 to-primary-700",
    glow: "rgba(14,165,233,0.5)",
    ringColor: "rgba(14,165,233,0.3)",
    ringColorStrong: "rgba(14,165,233,0.6)",
    outerRing: "rgba(14,165,233,0.1)",
    icon: Play,
    pulse: false,
  },
  working: {
    gradient: "from-emerald-500 to-emerald-700",
    glow: "rgba(16,185,129,0.5)",
    ringColor: "rgba(16,185,129,0.35)",
    ringColorStrong: "rgba(16,185,129,0.65)",
    outerRing: "rgba(16,185,129,0.12)",
    icon: Square,
    pulse: true,
  },
  paused: {
    gradient: "from-amber-500 to-amber-600",
    glow: "rgba(245,158,11,0.5)",
    ringColor: "rgba(245,158,11,0.35)",
    ringColorStrong: "rgba(245,158,11,0.65)",
    outerRing: "rgba(245,158,11,0.12)",
    icon: RotateCcw,
    pulse: true,
  },
};

export function FichajeButton({ status, onPress, disabled }: FichajeButtonProps) {
  const { tr } = useLocale();
  const config = STATUS_VISUAL[status];
  const Icon = config.icon;

  const labels = {
    idle:    { label: tr.fichaje.clockIn,   sub: tr.fichaje.tapToStart },
    working: { label: tr.fichaje.clockOut,  sub: tr.fichaje.activeShift },
    paused:  { label: tr.fichaje.resume,    sub: tr.fichaje.activePause },
  }[status];

  return (
    <div className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>
      <div className="absolute rounded-full border" style={{ width: 280, height: 280, borderColor: config.outerRing, borderWidth: 1 }} />

      <AnimatePresence>
        {config.pulse && (
          <>
            <motion.div key="pulse-outer" initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: [0.88, 1.02, 0.88], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute rounded-full"
              style={{ width: 248, height: 248, border: `2px solid ${config.ringColor}` }}
            />
            <motion.div key="pulse-inner" initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: [0.92, 1.04, 0.92], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              className="absolute rounded-full"
              style={{ width: 228, height: 228, border: `1.5px solid ${config.ringColorStrong}` }}
            />
          </>
        )}
      </AnimatePresence>

      {!config.pulse && (
        <div className="absolute rounded-full" style={{ width: 228, height: 228, border: `1.5px solid ${config.ringColor}` }} />
      )}

      <motion.button
        whileTap={{ scale: 0.93 }}
        whileHover={{ scale: 1.03 }}
        onClick={onPress}
        disabled={disabled}
        className="relative rounded-full flex flex-col items-center justify-center gap-3 cursor-pointer select-none focus:outline-none"
        style={{ width: 200, height: 200, boxShadow: `0 0 40px ${config.glow}, 0 0 80px ${config.glow.replace("0.5", "0.2")}, 0 8px 32px rgba(0,0,0,0.4)` }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <motion.div className={`absolute inset-0 rounded-full bg-gradient-to-br ${config.gradient}`} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} />
        <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%)" }} />

        <AnimatePresence mode="wait">
          <motion.div key={status} initial={{ scale: 0.6, opacity: 0, rotate: -15 }} animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.6, opacity: 0, rotate: 15 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="relative z-10 flex flex-col items-center gap-2"
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
              <Icon size={28} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-[11px] tracking-[0.12em]">{labels.label}</p>
              <p className="text-white/70 text-[10px] mt-0.5">{labels.sub}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {status === "working" && (
          <div className="absolute bottom-6 flex gap-1">
            {[0, 0.2, 0.4].map((delay, i) => (
              <motion.div key={i} animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1, repeat: Infinity, delay, ease: "easeInOut" }}
                className="w-1.5 h-1.5 rounded-full bg-white/80"
              />
            ))}
          </div>
        )}
      </motion.button>
    </div>
  );
}
