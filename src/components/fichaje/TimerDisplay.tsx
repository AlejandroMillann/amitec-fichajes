"use client";

import { motion } from "framer-motion";
import { formatTime } from "@/lib/utils";
import type { FichajeStatus } from "@/lib/types";
import { useLocale } from "@/providers/LocaleProvider";

interface TimerDisplayProps {
  elapsedSeconds: number;
  remainingSeconds: number;
  progressPercent: number;
  status: FichajeStatus;
}

export function TimerDisplay({ elapsedSeconds, remainingSeconds, progressPercent, status }: TimerDisplayProps) {
  const { tr } = useLocale();
  const isOvertime = progressPercent >= 100;

  const statusInfo = {
    idle:    { text: tr.fichaje.noShift,    color: "var(--text-tertiary)" },
    working: { text: tr.fichaje.activeShift, color: "var(--success)" },
    paused:  { text: tr.fichaje.onBreak,    color: "var(--warning)" },
  }[status];

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <motion.div key={status} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
      >
        <motion.div
          animate={status === "working" ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-2 h-2 rounded-full"
          style={{ background: statusInfo.color }}
        />
        <span className="text-xs font-medium" style={{ color: statusInfo.color }}>
          {statusInfo.text}
        </span>
      </motion.div>

      <div className="flex flex-col items-center">
        <motion.p key={Math.floor(elapsedSeconds)} className="font-bold tabular-nums"
          style={{ fontSize: "clamp(2.5rem, 12vw, 4rem)", letterSpacing: "-0.02em", color: isOvertime ? "var(--success)" : "var(--text-primary)" }}
        >
          {formatTime(elapsedSeconds)}
        </motion.p>
        <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>
          {isOvertime
            ? `+${formatTime(elapsedSeconds - 8 * 3600)} ${tr.fichaje.extra}`
            : `${tr.fichaje.remaining}: ${formatTime(remainingSeconds)}`}
        </p>
      </div>

      <div className="w-full max-w-xs">
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
          <motion.div className="h-full rounded-full"
            style={{
              background: isOvertime ? "linear-gradient(90deg, var(--success), #34D399)" : "linear-gradient(90deg, var(--primary), var(--cyan))",
              boxShadow: isOvertime ? "0 0 8px rgba(16,185,129,0.5)" : "0 0 8px rgba(14,165,233,0.5)",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progressPercent, 100)}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>0h</span>
          <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
            {Math.round(progressPercent)}% {tr.fichaje.completed}
          </span>
          <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>8h</span>
        </div>
      </div>
    </div>
  );
}
