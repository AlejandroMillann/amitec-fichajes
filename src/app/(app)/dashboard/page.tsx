"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TopBar } from "@/components/layout/TopBar";
import { FichajeButton } from "@/components/fichaje/FichajeButton";
import { TimerDisplay } from "@/components/fichaje/TimerDisplay";
import { useFichaje } from "@/hooks/useFichaje";
import { useAuth } from "@/hooks/useAuth";
import { formatTime, formatTimeHHMM, getGreeting } from "@/lib/utils";
import { RECENT_SESSIONS, WEEK_CHART_DATA } from "@/lib/mock-data";
import { Coffee, Clock, TrendingUp, ChevronRight, Pause, Play, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    status,
    elapsedSeconds,
    remainingSeconds,
    progressPercent,
    events,
    ficharEntrada,
    ficharSalida,
    iniciarPausa,
    finalizarPausa,
  } = useFichaje();

  const [showConfirm, setShowConfirm] = useState<"exit" | null>(null);

  const handleMainButton = () => {
    if (status === "idle") {
      ficharEntrada();
    } else if (status === "working") {
      setShowConfirm("exit");
    } else if (status === "paused") {
      finalizarPausa();
    }
  };

  const handleConfirmExit = () => {
    ficharSalida();
    setShowConfirm(null);
  };

  const weekTotal = WEEK_CHART_DATA.reduce((sum, d) => sum + d.hours, 0);
  const todayHoursDecimal = elapsedSeconds / 3600;

  return (
    <div className="flex flex-col min-h-full">
      <TopBar />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 px-4 pb-8 space-y-5 max-w-lg mx-auto w-full"
      >
        {/* Greeting */}
        <motion.div variants={itemVariants} className="pt-4">
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
            {getGreeting(user?.name ?? "Usuario")}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
            {new Date().toLocaleDateString("es-ES", {
              weekday: "long", day: "numeric", month: "long",
            })}
          </p>
        </motion.div>

        {/* Quick stats row */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3">
          {[
            {
              icon: Clock,
              label: "Hoy",
              value: elapsedSeconds > 0 ? formatTime(elapsedSeconds) : "0:00:00",
              color: "var(--primary)",
            },
            {
              icon: TrendingUp,
              label: "Semana",
              value: `${(weekTotal + todayHoursDecimal).toFixed(1)}h`,
              color: "var(--cyan)",
            },
            {
              icon: Coffee,
              label: "Pausas",
              value: `${events.filter((e) => e.type === "inicio_pausa").length}`,
              color: "var(--violet)",
            },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.02 }}
              className="glass rounded-2xl p-3 flex flex-col gap-1"
            >
              <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                   style={{ background: `${stat.color}18` }}>
                <stat.icon size={14} style={{ color: stat.color }} />
              </div>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{stat.label}</p>
              <p className="text-sm font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Timer Display */}
        <motion.div variants={itemVariants} className="glass rounded-3xl p-6">
          <TimerDisplay
            elapsedSeconds={elapsedSeconds}
            remainingSeconds={remainingSeconds}
            progressPercent={progressPercent}
            status={status}
          />
        </motion.div>

        {/* Main Fichaje Button */}
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-4">
          <FichajeButton status={status} onPress={handleMainButton} />

          {/* Secondary actions */}
          <div className="flex gap-3">
            {status === "working" && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileTap={{ scale: 0.92 }}
                onClick={iniciarPausa}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold"
                style={{
                  background: "var(--warning-light)",
                  border: "1px solid rgba(245,158,11,0.2)",
                  color: "var(--warning)",
                }}
              >
                <Pause size={14} />
                Pausar
              </motion.button>
            )}
            {status === "paused" && (
              <>
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={finalizarPausa}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold"
                  style={{
                    background: "var(--success-light)",
                    border: "1px solid rgba(16,185,129,0.2)",
                    color: "var(--success)",
                  }}
                >
                  <Play size={14} />
                  Reanudar
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setShowConfirm("exit")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold"
                  style={{
                    background: "var(--danger-light)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    color: "var(--danger)",
                  }}
                >
                  <LogOut size={14} />
                  Salida
                </motion.button>
              </>
            )}
          </div>
        </motion.div>

        {/* Today's events timeline */}
        {events.length > 0 && (
          <motion.div variants={itemVariants} className="glass rounded-3xl p-5">
            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-secondary)" }}>
              Actividad de hoy
            </h3>
            <div className="space-y-3">
              {events.slice().reverse().slice(0, 5).map((event, i) => {
                const typeConfig = {
                  entrada: { label: "Entrada", color: "var(--success)", bg: "var(--success-light)" },
                  salida: { label: "Salida", color: "var(--danger)", bg: "var(--danger-light)" },
                  inicio_pausa: { label: "Inicio pausa", color: "var(--warning)", bg: "var(--warning-light)" },
                  fin_pausa: { label: "Fin pausa", color: "var(--primary)", bg: "var(--primary-light)" },
                }[event.type];

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: typeConfig.color }}
                    />
                    <div
                      className="flex-1 flex items-center justify-between px-3 py-2 rounded-xl"
                      style={{ background: typeConfig.bg }}
                    >
                      <span className="text-xs font-medium" style={{ color: typeConfig.color }}>
                        {typeConfig.label}
                      </span>
                      <span className="text-xs font-semibold tabular-nums" style={{ color: typeConfig.color }}>
                        {formatTimeHHMM(event.timestamp)}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Recent days */}
        <motion.div variants={itemVariants} className="glass rounded-3xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
              Últimas jornadas
            </h3>
            <button className="flex items-center gap-1 text-xs font-medium" style={{ color: "var(--primary)" }}>
              Ver todo <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {RECENT_SESSIONS.map((session, i) => {
              const hours = Math.floor(session.totalMinutes / 60);
              const mins = session.totalMinutes % 60;
              const date = new Date(session.date);
              const isOver = session.totalMinutes > 480;
              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 surface-hover rounded-2xl px-3 py-2.5 cursor-pointer"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}
                  >
                    {date.getDate()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>
                      {date.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" })}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                      {session.entryTime} — {session.exitTime}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={cn("text-xs font-bold tabular-nums",
                      isOver ? "text-emerald-500" : ""
                    )} style={{ color: isOver ? "var(--success)" : "var(--text-primary)" }}>
                      {hours}h {mins > 0 ? `${mins}m` : ""}
                    </p>
                    {isOver && (
                      <p className="text-[10px]" style={{ color: "var(--success)" }}>+extra</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>

      {/* Confirm Exit Modal */}
      <AnimatePresence>
        {showConfirm === "exit" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
            onClick={() => setShowConfirm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.93 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-3xl p-7 w-full max-w-sm space-y-5"
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: "var(--danger-light)" }}
                >
                  <LogOut size={24} style={{ color: "var(--danger)" }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                    ¿Fichar salida?
                  </h3>
                  <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                    Llevas trabajando{" "}
                    <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                      {formatTime(elapsedSeconds)}
                    </span>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowConfirm(null)}
                  className="btn-secondary h-12 rounded-2xl text-sm font-semibold"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConfirmExit}
                  className="h-12 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #EF4444, #DC2626)",
                    boxShadow: "0 4px 16px rgba(239,68,68,0.3)",
                  }}
                >
                  <LogOut size={16} />
                  Confirmar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
