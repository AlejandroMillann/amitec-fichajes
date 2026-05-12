"use client";

import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell,
} from "recharts";
import { TopBar } from "@/components/layout/TopBar";
import { TrendingUp, Clock, Award, CalendarCheck, Zap, Target } from "lucide-react";
import { WEEK_CHART_DATA, MONTH_STATS } from "@/lib/mock-data";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="glass rounded-2xl px-4 py-3 min-w-[100px]"
      style={{ boxShadow: "var(--card-shadow)" }}
    >
      <p className="text-xs font-medium mb-1" style={{ color: "var(--text-tertiary)" }}>{label}</p>
      <p className="text-base font-bold" style={{ color: "var(--primary)" }}>
        {payload[0].value}h
      </p>
    </div>
  );
}

export default function EstadisticasPage() {
  const weekTotal = WEEK_CHART_DATA.reduce((s, d) => s + d.hours, 0);
  const weekTarget = WEEK_CHART_DATA.reduce((s, d) => s + d.target, 0);
  const weekProgress = Math.min((weekTotal / weekTarget) * 100, 100) || 0;
  const overtime = Math.max(weekTotal - weekTarget, 0);

  const statCards = [
    {
      icon: Clock,
      label: "Horas esta semana",
      value: `${weekTotal.toFixed(1)}h`,
      sub: `de ${weekTarget}h objetivo`,
      color: "var(--primary)",
      bg: "var(--primary-light)",
    },
    {
      icon: Target,
      label: "Horas este mes",
      value: `${MONTH_STATS.totalHours}h`,
      sub: `de ${MONTH_STATS.targetHours}h`,
      color: "var(--cyan)",
      bg: "var(--cyan-light)",
    },
    {
      icon: Zap,
      label: "Horas extra",
      value: `+${overtime.toFixed(1)}h`,
      sub: "esta semana",
      color: "var(--success)",
      bg: "var(--success-light)",
    },
    {
      icon: CalendarCheck,
      label: "Días trabajados",
      value: `${MONTH_STATS.daysWorked}`,
      sub: `de ${MONTH_STATS.workingDays} laborables`,
      color: "var(--violet)",
      bg: "var(--violet-light)",
    },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Estadísticas" showNotifications={false} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 px-4 pb-8 space-y-5 max-w-lg mx-auto w-full pt-4"
      >
        {/* Stat Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * i, duration: 0.35 }}
              whileHover={{ scale: 1.02 }}
              className="glass rounded-2xl p-4 space-y-3"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: card.bg }}
              >
                <card.icon size={18} style={{ color: card.color }} />
              </div>
              <div>
                <p className="text-2xl font-extrabold tabular-nums" style={{ color: "var(--text-primary)" }}>
                  {card.value}
                </p>
                <p className="text-[11px] font-medium mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                  {card.sub}
                </p>
              </div>
              <p className="text-[11px] font-semibold" style={{ color: card.color }}>
                {card.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Weekly Progress */}
        <motion.div variants={itemVariants} className="glass rounded-3xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                Progreso semanal
              </h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                {weekTotal.toFixed(1)}h de {weekTarget}h objetivo
              </p>
            </div>
            <div
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{
                background: weekProgress >= 100 ? "var(--success-light)" : "var(--primary-light)",
                color: weekProgress >= 100 ? "var(--success)" : "var(--primary)",
              }}
            >
              {Math.round(weekProgress)}%
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-3 rounded-full overflow-hidden mb-5" style={{ background: "var(--bg-elevated)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{
                background: weekProgress >= 100
                  ? "linear-gradient(90deg, var(--success), #34D399)"
                  : "linear-gradient(90deg, var(--primary), var(--cyan))",
                boxShadow: weekProgress >= 100
                  ? "0 0 12px rgba(16,185,129,0.5)"
                  : "0 0 12px rgba(14,165,233,0.5)",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(weekProgress, 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            />
          </div>

          {/* Bar Chart */}
          <div style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEK_CHART_DATA} barSize={28} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "var(--text-tertiary)" }}
                />
                <YAxis hide domain={[0, 10]} />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <ReferenceLine
                  y={8}
                  stroke="var(--border-strong)"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                />
                <Bar dataKey="hours" radius={[6, 6, 4, 4]}>
                  {WEEK_CHART_DATA.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        entry.hours === 0
                          ? "var(--bg-elevated)"
                          : entry.hours > 8
                          ? "url(#gradientGreen)"
                          : "url(#gradientBlue)"
                      }
                    />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="gradientBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={1} />
                    <stop offset="100%" stopColor="var(--cyan)" stopOpacity={0.8} />
                  </linearGradient>
                  <linearGradient id="gradientGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--success)" stopOpacity={1} />
                    <stop offset="100%" stopColor="#34D399" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-center mt-2" style={{ color: "var(--text-tertiary)" }}>
            — — Línea de 8h objetivo
          </p>
        </motion.div>

        {/* Month Summary */}
        <motion.div variants={itemVariants} className="glass rounded-3xl p-5">
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--violet-light)" }}
            >
              <Award size={18} style={{ color: "var(--violet)" }} />
            </div>
            <div>
              <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                Resumen mensual
              </h3>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                {MONTH_STATS.month}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Horas trabajadas", value: `${MONTH_STATS.totalHours}h`, target: `${MONTH_STATS.targetHours}h obj.` },
              { label: "Días trabajados", value: MONTH_STATS.daysWorked, target: `${MONTH_STATS.workingDays} lab.` },
              { label: "Horas extra", value: `+${MONTH_STATS.overtimeHours}h`, target: "este mes" },
              { label: "Puntualidad", value: "94%", target: "media" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl p-3"
                style={{ background: "var(--bg-elevated)" }}
              >
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{item.label}</p>
                <p className="text-lg font-extrabold mt-1 tabular-nums" style={{ color: "var(--text-primary)" }}>
                  {item.value}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>{item.target}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weekly trend */}
        <motion.div variants={itemVariants} className="glass rounded-3xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--primary-light)" }}
            >
              <TrendingUp size={18} style={{ color: "var(--primary)" }} />
            </div>
            <div>
              <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                Días de esta semana
              </h3>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>Detalle por día</p>
            </div>
          </div>

          <div className="space-y-3">
            {WEEK_CHART_DATA.filter((d) => d.target > 0).map((day, i) => {
              const pct = day.hours > 0 ? Math.min((day.hours / 8) * 100, 100) : 0;
              const isToday = i === 0; // Mock: Monday is "today"
              return (
                <div key={day.day} className="flex items-center gap-3">
                  <span
                    className="text-xs font-semibold w-8 flex-shrink-0"
                    style={{ color: isToday ? "var(--primary)" : "var(--text-tertiary)" }}
                  >
                    {day.day}
                  </span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: day.hours > 8
                          ? "linear-gradient(90deg, var(--success), #34D399)"
                          : "linear-gradient(90deg, var(--primary), var(--cyan))",
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
                    />
                  </div>
                  <span
                    className="text-xs font-bold tabular-nums w-10 text-right flex-shrink-0"
                    style={{ color: day.hours > 8 ? "var(--success)" : "var(--text-primary)" }}
                  >
                    {day.hours > 0 ? `${day.hours}h` : "—"}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
