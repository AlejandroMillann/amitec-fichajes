"use client";

import { motion } from "framer-motion";
import {
  Users, Clock, TrendingUp, AlertCircle, CheckCircle2, XCircle,
  Activity, Calendar, ChevronRight, Wifi,
} from "lucide-react";
import { LIVE_EMPLOYEES, VACATION_REQUESTS, WEEK_CHART_DATA } from "@/lib/mock-data";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const workingNow = LIVE_EMPLOYEES.filter((e) => e.status === "working").length;
const onBreak = LIVE_EMPLOYEES.filter((e) => e.status === "paused").length;
const absent = LIVE_EMPLOYEES.filter((e) => e.status === "absent").length;
const pendingRequests = VACATION_REQUESTS.filter((r) => r.status === "pendiente").length;

const ADMIN_STATS = [
  { icon: Users, label: "Total empleados", value: LIVE_EMPLOYEES.length, color: "var(--primary)", bg: "var(--primary-light)" },
  { icon: Activity, label: "Trabajando ahora", value: workingNow, color: "var(--success)", bg: "var(--success-light)" },
  { icon: Clock, label: "En pausa", value: onBreak, color: "var(--warning)", bg: "var(--warning-light)" },
  { icon: AlertCircle, label: "Solicitudes", value: pendingRequests, color: "var(--violet)", bg: "var(--violet-light)" },
];

const STATUS_STYLE = {
  working: { label: "Activo", color: "var(--success)", dot: "#10B981" },
  paused: { label: "Pausa", color: "var(--warning)", dot: "#F59E0B" },
  absent: { label: "Ausente", color: "var(--text-tertiary)", dot: "#4A5A7A" },
};

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function MiniTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3 py-2 text-xs" style={{ boxShadow: "var(--card-shadow)" }}>
      <p style={{ color: "var(--text-tertiary)" }}>{label}</p>
      <p className="font-bold" style={{ color: "var(--primary)" }}>{payload[0].value}h</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const pendingReqs = VACATION_REQUESTS.filter((r) => r.status === "pendiente");

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-5xl"
    >
      {/* Stats grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {ADMIN_STATS.map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.02 }}
            className="glass rounded-2xl p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: stat.bg }}>
                <stat.icon size={18} style={{ color: stat.color }} />
              </div>
              <TrendingUp size={14} style={{ color: "var(--text-tertiary)" }} />
            </div>
            <div>
              <p className="text-2xl font-extrabold" style={{ color: "var(--text-primary)" }}>{stat.value}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live employees */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass rounded-3xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--success-light)" }}>
                <Wifi size={16} style={{ color: "var(--success)" }} />
              </div>
              <div>
                <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>En tiempo real</h3>
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{workingNow} activos ahora</p>
              </div>
            </div>
            <Link href="/admin/empleados">
              <span className="text-xs font-medium flex items-center gap-1" style={{ color: "var(--primary)" }}>
                Ver todos <ChevronRight size={12} />
              </span>
            </Link>
          </div>

          <div className="p-4 space-y-2">
            {LIVE_EMPLOYEES.map((emp, i) => {
              const statusStyle = STATUS_STYLE[emp.status];
              const hours = emp.elapsedMinutes ? Math.floor(emp.elapsedMinutes / 60) : 0;
              const mins = emp.elapsedMinutes ? emp.elapsedMinutes % 60 : 0;

              return (
                <motion.div
                  key={emp.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 px-3 py-3 rounded-2xl surface-hover cursor-pointer"
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: "linear-gradient(135deg, var(--primary), var(--violet))" }}
                    >
                      {emp.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div
                      className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                      style={{
                        background: statusStyle.dot,
                        borderColor: "var(--bg-surface)",
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                      {emp.name}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{emp.department}</p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ background: `${statusStyle.color}18`, color: statusStyle.color }}
                    >
                      <motion.div
                        animate={emp.status === "working" ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: statusStyle.dot }}
                      />
                      {statusStyle.label}
                    </div>
                    {emp.elapsedMinutes ? (
                      <p className="text-[10px] mt-1 tabular-nums" style={{ color: "var(--text-tertiary)" }}>
                        {emp.entryTime} · {hours}h{mins > 0 ? ` ${mins}m` : ""}
                      </p>
                    ) : null}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Pending requests */}
          <motion.div variants={itemVariants} className="glass rounded-3xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2">
                <Calendar size={16} style={{ color: "var(--violet)" }} />
                <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Solicitudes</span>
              </div>
              <div
                className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ background: "var(--violet-light)", color: "var(--violet)" }}
              >
                {pendingRequests} nuevas
              </div>
            </div>

            <div className="p-3 space-y-2">
              {pendingReqs.slice(0, 3).map((req) => (
                <motion.div
                  key={req.id}
                  whileHover={{ scale: 1.01 }}
                  className="surface-hover rounded-2xl px-3 py-3 cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                        {req.employeeName.split(" ")[0]}
                      </p>
                      <p className="text-[10px] mt-0.5 capitalize" style={{ color: "var(--text-tertiary)" }}>
                        {req.type.replace("_", " ")} · {req.days}d
                      </p>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0 mt-0.5">
                      <button
                        className="w-7 h-7 rounded-xl flex items-center justify-center"
                        style={{ background: "var(--success-light)" }}
                      >
                        <CheckCircle2 size={13} style={{ color: "var(--success)" }} />
                      </button>
                      <button
                        className="w-7 h-7 rounded-xl flex items-center justify-center"
                        style={{ background: "var(--danger-light)" }}
                      >
                        <XCircle size={13} style={{ color: "var(--danger)" }} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
              <Link href="/admin/empleados">
                <div className="flex items-center justify-center py-2 text-xs font-medium gap-1" style={{ color: "var(--primary)" }}>
                  Ver todas <ChevronRight size={12} />
                </div>
              </Link>
            </div>
          </motion.div>

          {/* Quick stats absent */}
          <motion.div variants={itemVariants} className="glass rounded-2xl p-4">
            <p className="text-xs font-bold mb-3" style={{ color: "var(--text-secondary)" }}>Resumen hoy</p>
            <div className="space-y-2">
              {[
                { label: "Presentes", value: workingNow + onBreak, total: LIVE_EMPLOYEES.length, color: "var(--success)" },
                { label: "Ausentes", value: absent, total: LIVE_EMPLOYEES.length, color: "var(--danger)" },
                { label: "En pausa", value: onBreak, total: LIVE_EMPLOYEES.length, color: "var(--warning)" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>{item.label}</span>
                    <span className="text-[11px] font-bold" style={{ color: item.color }}>{item.value}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: item.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.value / item.total) * 100}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Weekly chart */}
      <motion.div variants={itemVariants} className="glass rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              Horas por día esta semana
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
              Total empresa: {(workingNow * 4.2).toFixed(0)}h hoy
            </p>
          </div>
          <div
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{ background: "var(--primary-light)", color: "var(--primary)" }}
          >
            Semana actual
          </div>
        </div>
        <div style={{ height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={WEEK_CHART_DATA} barSize={32} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--text-tertiary)" }} />
              <YAxis hide domain={[0, 10]} />
              <Tooltip content={<MiniTooltip />} cursor={false} />
              <Bar dataKey="hours" radius={[6, 6, 4, 4]}>
                {WEEK_CHART_DATA.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.hours === 0 ? "var(--bg-elevated)" : entry.hours > 8 ? "#10B981" : "var(--primary)"}
                    fillOpacity={entry.hours === 0 ? 0.3 : 1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[10px] text-center mt-2" style={{ color: "var(--text-tertiary)" }}>
          Verde = horas extra · Azul = dentro del objetivo
        </p>
      </motion.div>
    </motion.div>
  );
}
