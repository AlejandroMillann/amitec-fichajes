"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TopBar } from "@/components/layout/TopBar";
import {
  CalendarDays, Plus, Clock, CheckCircle2, XCircle, ChevronRight,
  Umbrella, Stethoscope, Timer, X, Loader2, CalendarPlus,
} from "lucide-react";
import { useRequests } from "@/hooks/useRequests";
import { useAuth } from "@/hooks/useAuth";
import type { VacationRequest, RequestType } from "@/lib/types";
import { formatDateShort, calcWorkingDays } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const TYPE_CONFIG: Record<RequestType, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  vacaciones: { label: "Vacaciones", icon: Umbrella, color: "var(--primary)", bg: "var(--primary-light)" },
  permiso: { label: "Permiso", icon: CalendarDays, color: "var(--cyan)", bg: "var(--cyan-light)" },
  ausencia_horas: { label: "Ausencia horas", icon: Timer, color: "var(--warning)", bg: "var(--warning-light)" },
  baja_medica: { label: "Baja médica", icon: Stethoscope, color: "var(--violet)", bg: "var(--violet-light)" },
};

const STATUS_CONFIG = {
  pendiente: { label: "Pendiente", icon: Clock, color: "var(--warning)", bg: "var(--warning-light)" },
  aprobada: { label: "Aprobada", icon: CheckCircle2, color: "var(--success)", bg: "var(--success-light)" },
  rechazada: { label: "Rechazada", icon: XCircle, color: "var(--danger)", bg: "var(--danger-light)" },
};

interface NewRequestModalProps {
  onClose: () => void;
  onSubmit: (req: Partial<VacationRequest>) => void;
}

function NewRequestModal({ onClose, onSubmit }: NewRequestModalProps) {
  const [type, setType] = useState<RequestType>("vacaciones");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    onSubmit({ type, startDate, endDate, notes, status: "pendiente" });
    setLoading(false);
    onClose();
  };

  const typeOptions: RequestType[] = ["vacaciones", "permiso", "ausencia_horas", "baja_medica"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.93 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="glass rounded-3xl w-full max-w-sm overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center">
              <CalendarPlus size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Nueva solicitud</h3>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>Paso {step} de 2</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center surface-hover">
            <X size={16} style={{ color: "var(--text-tertiary)" }} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-secondary)" }}>
                  Tipo de solicitud
                </p>
                <div className="space-y-2">
                  {typeOptions.map((t) => {
                    const cfg = TYPE_CONFIG[t];
                    const Icon = cfg.icon;
                    const isSelected = type === t;
                    return (
                      <motion.button
                        key={t}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setType(t)}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-150"
                        style={{
                          background: isSelected ? cfg.bg : "var(--bg-elevated)",
                          border: `1.5px solid ${isSelected ? cfg.color + "40" : "transparent"}`,
                        }}
                      >
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                             style={{ background: isSelected ? cfg.bg : "var(--bg-surface)" }}>
                          <Icon size={16} style={{ color: cfg.color }} />
                        </div>
                        <span className="text-sm font-medium" style={{ color: isSelected ? cfg.color : "var(--text-primary)" }}>
                          {cfg.label}
                        </span>
                        {isSelected && (
                          <CheckCircle2 size={14} className="ml-auto" style={{ color: cfg.color }} />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "var(--text-secondary)" }}>
                      Desde
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="input-base w-full h-11 rounded-2xl px-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "var(--text-secondary)" }}>
                      Hasta
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                      className="input-base w-full h-11 rounded-2xl px-3 text-sm"
                    />
                  </div>
                </div>
                {startDate && endDate && (
                  <p className="text-xs font-medium" style={{ color: "var(--primary)" }}>
                    {calcWorkingDays(startDate, endDate)} día{calcWorkingDays(startDate, endDate) !== 1 ? "s" : ""} laborable{calcWorkingDays(startDate, endDate) !== 1 ? "s" : ""}
                  </p>
                )}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "var(--text-secondary)" }}>
                    Observaciones (opcional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Añade detalles..."
                    rows={3}
                    className="input-base w-full rounded-2xl p-3 text-sm resize-none"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3 pt-2">
            {step === 2 && (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setStep(1)}
                className="btn-secondary flex-1 h-12 rounded-2xl text-sm font-semibold"
              >
                Atrás
              </motion.button>
            )}
            {step === 1 ? (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setStep(2)}
                className="btn-primary flex-1 h-12 rounded-2xl text-sm font-bold flex items-center justify-center gap-2"
              >
                Siguiente <ChevronRight size={15} />
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.96 }}
                disabled={!startDate || loading}
                onClick={handleSubmit}
                className="btn-primary flex-1 h-12 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <Loader2 size={16} className="animate-spin text-white" /> : <>Enviar solicitud</>}
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function VacacionesPage() {
  const { user } = useAuth();
  const { requests: allRequests, addRequest } = useRequests();
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"todas" | "pendientes" | "aprobadas">("todas");

  const myRequests = allRequests.filter((r) => r.employeeId === (user?.id ?? "emp-001"));

  const usedDays = myRequests
    .filter((r) => r.status === "aprobada")
    .reduce((sum, r) => sum + r.days, 0);
  const pendingDays = myRequests
    .filter((r) => r.status === "pendiente")
    .reduce((sum, r) => sum + r.days, 0);
  const totalDays = user?.vacationDays ?? 23;
  const remaining = Math.max(totalDays - usedDays - pendingDays, 0);

  const filtered = myRequests.filter((r) => {
    if (activeTab === "todas") return true;
    if (activeTab === "pendientes") return r.status === "pendiente";
    if (activeTab === "aprobadas") return r.status === "aprobada";
    return true;
  });

  const handleNewRequest = (req: Partial<VacationRequest>) => {
    const start = req.startDate ?? "";
    const end = req.endDate ?? req.startDate ?? "";
    const newReq: VacationRequest = {
      id: `req-${Date.now()}`,
      employeeId: user?.id ?? "emp-001",
      employeeName: `${user?.name ?? "Alejandro"} ${user?.lastName ?? "Millán"}`,
      type: req.type ?? "vacaciones",
      startDate: start,
      endDate: end,
      days: calcWorkingDays(start, end),
      status: "pendiente",
      notes: req.notes,
      createdAt: new Date().toISOString(),
    };
    addRequest(newReq);
  };

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Vacaciones" showNotifications={false} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 px-4 pb-8 space-y-5 max-w-lg mx-auto w-full pt-4"
      >
        {/* Balance cards */}
        <motion.div variants={itemVariants} className="glass rounded-3xl p-5">
          <h3 className="text-sm font-bold mb-4" style={{ color: "var(--text-secondary)" }}>
            Saldo de vacaciones 2025
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total", value: totalDays, color: "var(--text-primary)", sub: "días/año" },
              { label: "Disfrutados", value: usedDays, color: "var(--success)", sub: "utilizados" },
              { label: "Disponibles", value: remaining, color: "var(--primary)", sub: "restantes" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl p-3 text-center"
                style={{ background: "var(--bg-elevated)" }}
              >
                <p className="text-2xl font-extrabold" style={{ color: item.color }}>
                  {item.value}
                </p>
                <p className="text-[10px] mt-0.5 font-medium" style={{ color: "var(--text-tertiary)" }}>
                  {item.sub}
                </p>
                <p className="text-[10px] mt-1 font-semibold" style={{ color: "var(--text-secondary)" }}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          {/* Visual progress */}
          <div className="mt-4 space-y-1.5">
            <div className="h-2.5 rounded-full overflow-hidden flex" style={{ background: "var(--bg-elevated)" }}>
              <motion.div
                className="h-full rounded-l-full"
                style={{ background: "var(--success)" }}
                initial={{ width: 0 }}
                animate={{ width: `${(usedDays / totalDays) * 100}%` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
              <motion.div
                className="h-full"
                style={{ background: "var(--primary)", opacity: 0.5 }}
                initial={{ width: 0 }}
                animate={{ width: `${(pendingDays / totalDays) * 100}%` }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
              />
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: "var(--success)" }} />
                <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Usados</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full opacity-50" style={{ background: "var(--primary)" }} />
                <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Pendientes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: "var(--bg-elevated)" }} />
                <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Disponibles</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* New Request Button */}
        <motion.button
          variants={itemVariants}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowModal(true)}
          className="btn-primary w-full h-13 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm"
          style={{ height: 52 }}
        >
          <Plus size={18} />
          Nueva solicitud
        </motion.button>

        {/* Tabs */}
        <motion.div variants={itemVariants} className="flex gap-1 p-1 rounded-2xl" style={{ background: "var(--bg-elevated)" }}>
          {(["todas", "pendientes", "aprobadas"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-200 capitalize"
              style={{
                background: activeTab === tab ? "var(--bg-surface)" : "transparent",
                color: activeTab === tab ? "var(--primary)" : "var(--text-tertiary)",
                boxShadow: activeTab === tab ? "var(--card-shadow)" : "none",
              }}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Requests list */}
        <motion.div variants={itemVariants} className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((req) => {
              const typeCfg = TYPE_CONFIG[req.type];
              const statusCfg = STATUS_CONFIG[req.status];
              const TypeIcon = typeCfg.icon;
              const StatusIcon = statusCfg.icon;

              return (
                <motion.div
                  key={req.id}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  whileHover={{ scale: 1.01 }}
                  className="glass rounded-2xl p-4 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: typeCfg.bg }}
                    >
                      <TypeIcon size={18} style={{ color: typeCfg.color }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                          {typeCfg.label}
                        </p>
                        <div
                          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0"
                          style={{ background: statusCfg.bg, color: statusCfg.color }}
                        >
                          <StatusIcon size={10} />
                          {statusCfg.label}
                        </div>
                      </div>

                      <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                        {formatDateShort(req.startDate)}
                        {req.startDate !== req.endDate && ` — ${formatDateShort(req.endDate)}`}
                      </p>

                      {req.notes && (
                        <p className="text-xs mt-1.5 line-clamp-1" style={{ color: "var(--text-tertiary)" }}>
                          {req.notes}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] font-medium" style={{ color: "var(--text-tertiary)" }}>
                          {req.days} día{req.days !== 1 ? "s" : ""}
                        </span>
                        <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                          {new Date(req.createdAt).toLocaleDateString("es-ES")}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3 py-12 text-center"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                   style={{ background: "var(--bg-elevated)" }}>
                <CalendarDays size={24} style={{ color: "var(--text-tertiary)" }} />
              </div>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>No hay solicitudes</p>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                Crea una nueva solicitud con el botón de arriba
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <NewRequestModal onClose={() => setShowModal(false)} onSubmit={handleNewRequest} />
        )}
      </AnimatePresence>
    </div>
  );
}
