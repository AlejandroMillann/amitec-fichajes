"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TopBar } from "@/components/layout/TopBar";
import {
  CalendarDays, Plus, Clock, CheckCircle2, XCircle, ChevronRight,
  Umbrella, Stethoscope, Timer, X, Loader2, CalendarPlus,
  Upload, FileText, Paperclip, AlertCircle,
} from "lucide-react";
import { useRequests } from "@/hooks/useRequests";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { useLocale } from "@/providers/LocaleProvider";
import type { VacationRequest, RequestType } from "@/lib/types";
import { formatDateShort, calcWorkingDays } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } },
};

const TYPE_VISUAL: Record<RequestType, { icon: React.ElementType; color: string; bg: string; requiresDoc: boolean }> = {
  vacaciones: { icon: Umbrella, color: "var(--primary)", bg: "var(--primary-light)", requiresDoc: false },
  permiso: { icon: CalendarDays, color: "var(--cyan)", bg: "var(--cyan-light)", requiresDoc: true },
  ausencia_horas: { icon: Timer, color: "var(--warning)", bg: "var(--warning-light)", requiresDoc: true },
  baja_medica: { icon: Stethoscope, color: "var(--violet)", bg: "var(--violet-light)", requiresDoc: true },
};

const STATUS_VISUAL = {
  pendiente: { icon: Clock, color: "var(--warning)", bg: "var(--warning-light)" },
  aprobada: { icon: CheckCircle2, color: "var(--success)", bg: "var(--success-light)" },
  rechazada: { icon: XCircle, color: "var(--danger)", bg: "var(--danger-light)" },
};

interface AttachmentData {
  data: string;
  name: string;
  mimeType: string;
}

interface NewRequestModalProps {
  onClose: () => void;
  onSubmit: (req: Partial<VacationRequest>) => void;
}

function NewRequestModal({ onClose, onSubmit }: NewRequestModalProps) {
  const { tr } = useLocale();
  const [type, setType] = useState<RequestType>("vacaciones");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [attachment, setAttachment] = useState<AttachmentData | null>(null);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cfg = TYPE_VISUAL[type];
  const workingDays = startDate && endDate ? calcWorkingDays(startDate, endDate) : 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAttachmentError(null);
    if (file.size > 2 * 1024 * 1024) {
      setAttachmentError("El archivo no puede superar 2 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAttachment({ data: ev.target?.result as string, name: file.name, mimeType: file.type });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    onSubmit({
      type,
      startDate,
      endDate,
      notes,
      status: "pendiente",
      attachment: attachment?.data,
      attachmentName: attachment?.name,
    });
    setLoading(false);
    onClose();
  };

  const typeOptions: RequestType[] = ["vacaciones", "permiso", "ausencia_horas", "baja_medica"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.93 }}
        transition={{ type: "spring", stiffness: 400, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
        className="glass rounded-3xl w-full max-w-sm overflow-hidden"
        style={{ maxHeight: "90dvh", display: "flex", flexDirection: "column" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 flex-shrink-0"
             style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center">
              <CalendarPlus size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{tr.vacations.newRequest}</h3>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                {tr.vacations.step.replace("{n}", String(step))}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center surface-hover">
            <X size={16} style={{ color: "var(--text-tertiary)" }} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3"
                   style={{ color: "var(--text-secondary)" }}>
                  {tr.vacations.requestType}
                </p>
                <div className="space-y-2">
                  {typeOptions.map((t) => {
                    const c = TYPE_VISUAL[t];
                    const Icon = c.icon;
                    const isSelected = type === t;
                    return (
                      <motion.button
                        key={t}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setType(t)}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-150"
                        style={{
                          background: isSelected ? c.bg : "var(--bg-elevated)",
                          border: `1.5px solid ${isSelected ? c.color + "40" : "transparent"}`,
                        }}
                      >
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                             style={{ background: isSelected ? c.bg : "var(--bg-surface)" }}>
                          <Icon size={16} style={{ color: c.color }} />
                        </div>
                        <div className="flex-1 text-left">
                          <span className="text-sm font-medium" style={{ color: isSelected ? c.color : "var(--text-primary)" }}>
                            {tr.requestTypes[t]}
                          </span>
                          {c.requiresDoc && (
                            <p className="text-[10px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                              {tr.vacations.allowsDoc}
                            </p>
                          )}
                        </div>
                        {isSelected && <CheckCircle2 size={14} style={{ color: c.color }} />}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }} className="space-y-4">
                {/* Dates */}
                <div className="rounded-3xl overflow-hidden" style={{ border: "1.5px solid var(--border-strong)" }}>
                  {/* Desde */}
                  <div className="px-4 py-3.5" style={{ borderBottom: "1px solid var(--border)" }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5"
                       style={{ color: "var(--text-tertiary)" }}>{tr.vacations.startDate}</p>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        if (endDate < e.target.value) setEndDate(e.target.value);
                      }}
                      className="input-base w-full h-11 rounded-2xl px-3 text-base font-semibold"
                      style={{ color: startDate ? "var(--text-primary)" : "var(--text-tertiary)" }}
                    />
                  </div>

                  {/* Hasta */}
                  <div className="px-4 py-3.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5"
                       style={{ color: "var(--text-tertiary)" }}>{tr.vacations.endDate}</p>
                    <input
                      type="date"
                      value={endDate}
                      min={startDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="input-base w-full h-11 rounded-2xl px-3 text-base font-semibold"
                      style={{ color: endDate ? "var(--text-primary)" : "var(--text-tertiary)" }}
                    />
                  </div>

                  {/* Resumen días */}
                  {workingDays > 0 && (
                    <div className="px-4 py-3 flex items-center justify-between"
                         style={{ background: `${cfg.color}10`, borderTop: "1px solid var(--border)" }}>
                      <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                        {tr.vacations.workingDays}
                      </span>
                      <span className="text-sm font-extrabold tabular-nums" style={{ color: cfg.color }}>
                        {workingDays} {workingDays !== 1 ? tr.vacations.days : tr.vacations.day}
                      </span>
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5"
                         style={{ color: "var(--text-secondary)" }}>{tr.vacations.notes}</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                    placeholder={tr.vacations.notesPlaceholder} rows={2}
                    className="input-base w-full rounded-2xl p-3 text-sm resize-none" />
                </div>

                {/* File attachment */}
                {cfg.requiresDoc && (
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5"
                           style={{ color: "var(--text-secondary)" }}>
                      {tr.vacations.document}
                      <span className="ml-1 font-normal normal-case" style={{ color: "var(--text-tertiary)" }}>
                        {tr.vacations.optional}
                      </span>
                    </label>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />

                    {attachment ? (
                      <div className="rounded-2xl overflow-hidden"
                           style={{ border: "1px solid var(--border)" }}>
                        {attachment.mimeType.startsWith("image/") ? (
                          <div className="relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={attachment.data} alt="Adjunto" className="w-full h-28 object-cover" />
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 px-4 py-3"
                               style={{ background: "var(--bg-elevated)" }}>
                            <FileText size={20} style={{ color: "var(--primary)" }} />
                            <span className="text-xs font-medium truncate flex-1"
                                  style={{ color: "var(--text-primary)" }}>
                              {attachment.name}
                            </span>
                          </div>
                        )}
                        <div className="flex gap-2 px-3 py-2.5"
                             style={{ borderTop: "1px solid var(--border)" }}>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1 text-xs font-medium flex items-center justify-center gap-1.5 py-1.5 rounded-xl surface-hover"
                            style={{ color: "var(--primary)" }}
                          >
                            <Upload size={12} /> Cambiar
                          </button>
                          <button
                            onClick={() => setAttachment(null)}
                            className="flex-1 text-xs font-medium flex items-center justify-center gap-1.5 py-1.5 rounded-xl surface-hover"
                            style={{ color: "var(--danger)" }}
                          >
                            <X size={12} /> {tr.common.delete}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-20 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-colors"
                        style={{ borderColor: "var(--border-strong)", background: "var(--bg-elevated)" }}
                      >
                        <Paperclip size={18} style={{ color: "var(--text-tertiary)" }} />
                        <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                          {tr.vacations.photoOrPdf}
                        </p>
                        <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                          {tr.vacations.maxSize}
                        </p>
                      </motion.button>
                    )}

                    {attachmentError && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <AlertCircle size={12} style={{ color: "var(--danger)" }} />
                        <p className="text-xs" style={{ color: "var(--danger)" }}>{attachmentError}</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer buttons */}
        <div className="flex gap-3 px-6 pb-6 pt-2 flex-shrink-0">
          {step === 2 && (
            <motion.button whileTap={{ scale: 0.96 }} onClick={() => setStep(1)}
              className="btn-secondary flex-1 h-12 rounded-2xl text-sm font-semibold">
              {tr.common.back}
            </motion.button>
          )}
          {step === 1 ? (
            <motion.button whileTap={{ scale: 0.96 }} onClick={() => setStep(2)}
              className="btn-primary flex-1 h-12 rounded-2xl text-sm font-bold flex items-center justify-center gap-2">
              {tr.common.next} <ChevronRight size={15} />
            </motion.button>
          ) : (
            <motion.button whileTap={{ scale: 0.96 }} disabled={!startDate || loading} onClick={handleSubmit}
              className="btn-primary flex-1 h-12 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <Loader2 size={16} className="animate-spin text-white" /> : tr.vacations.sendRequest}
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function VacacionesPage() {
  const { user } = useAuth();
  const { tr } = useLocale();
  const { requests: allRequests, addRequest } = useRequests();
  const { addNotification } = useNotifications();
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"todas" | "pendientes" | "aprobadas">("todas");

  const myRequests = allRequests.filter((r) => r.employeeId === (user?.id ?? "emp-001"));

  const usedDays = myRequests.filter((r) => r.status === "aprobada").reduce((s, r) => s + r.days, 0);
  const pendingDays = myRequests.filter((r) => r.status === "pendiente").reduce((s, r) => s + r.days, 0);
  const totalDays = user?.vacationDays ?? 23;
  const remaining = Math.max(totalDays - usedDays - pendingDays, 0);

  const filtered = myRequests.filter((r) => {
    if (activeTab === "todas") return true;
    if (activeTab === "pendientes") return r.status === "pendiente";
    return r.status === "aprobada";
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
      attachment: req.attachment,
      attachmentName: req.attachmentName,
      createdAt: new Date().toISOString(),
    };
    addRequest(newReq);
    addNotification({
      type: "new_request",
      title: tr.notifications.newRequestTitle,
      message: `${newReq.employeeName} — ${tr.requestTypes[newReq.type]} (${newReq.days} ${newReq.days !== 1 ? tr.vacations.days : tr.vacations.day})`,
      forUserId: "admin-001",
      requestId: newReq.id,
    });
  };

  const TAB_LABELS = {
    todas: tr.common.all,
    pendientes: tr.vacations.pendingTab,
    aprobadas: tr.vacations.approvedTab,
  };

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title={tr.vacations.title} showNotifications={false} />

      <motion.div variants={containerVariants} initial="hidden" animate="show"
        className="flex-1 px-4 pb-8 space-y-5 max-w-lg mx-auto w-full pt-4">

        {/* Balance */}
        <motion.div variants={itemVariants} className="glass rounded-3xl p-5">
          <h3 className="text-sm font-bold mb-4" style={{ color: "var(--text-secondary)" }}>
            {tr.vacations.year}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: tr.common.all, value: totalDays, color: "var(--text-primary)", sub: tr.vacations.daysTotal },
              { label: tr.vacations.daysUsed, value: usedDays, color: "var(--success)", sub: tr.vacations.daysUsed },
              { label: tr.vacations.daysAvailable, value: remaining, color: "var(--primary)", sub: tr.vacations.daysAvailable },
            ].map((item) => (
              <div key={item.sub} className="rounded-2xl p-3 text-center"
                   style={{ background: "var(--bg-elevated)" }}>
                <p className="text-2xl font-extrabold" style={{ color: item.color }}>{item.value}</p>
                <p className="text-[10px] mt-0.5 font-medium" style={{ color: "var(--text-tertiary)" }}>{item.sub}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-1.5">
            <div className="h-2.5 rounded-full overflow-hidden flex" style={{ background: "var(--bg-elevated)" }}>
              <motion.div className="h-full rounded-l-full" style={{ background: "var(--success)" }}
                initial={{ width: 0 }}
                animate={{ width: `${(usedDays / totalDays) * 100}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }} />
              <motion.div className="h-full" style={{ background: "var(--primary)", opacity: 0.5 }}
                initial={{ width: 0 }}
                animate={{ width: `${(pendingDays / totalDays) * 100}%` }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }} />
            </div>
            <div className="flex justify-between text-[10px]" style={{ color: "var(--text-tertiary)" }}>
              <span>{tr.vacations.daysUsed}</span>
              <span>{tr.vacations.daysPending}</span>
              <span>{tr.vacations.daysAvailable}</span>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.button variants={itemVariants} whileTap={{ scale: 0.97 }} onClick={() => setShowModal(true)}
          className="btn-primary w-full rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm"
          style={{ height: 52 }}>
          <Plus size={18} /> {tr.vacations.newRequest}
        </motion.button>

        {/* Tabs */}
        <motion.div variants={itemVariants} className="flex gap-1 p-1 rounded-2xl"
          style={{ background: "var(--bg-elevated)" }}>
          {(["todas", "pendientes", "aprobadas"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-150"
              style={{
                background: activeTab === tab ? "var(--bg-surface)" : "transparent",
                color: activeTab === tab ? "var(--primary)" : "var(--text-tertiary)",
                boxShadow: activeTab === tab ? "var(--card-shadow)" : "none",
              }}>
              {TAB_LABELS[tab]}
            </button>
          ))}
        </motion.div>

        {/* List */}
        <motion.div variants={itemVariants} className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((req) => {
              const typeCfg = TYPE_VISUAL[req.type];
              const statusCfg = STATUS_VISUAL[req.status];
              const TypeIcon = typeCfg.icon;
              const StatusIcon = statusCfg.icon;

              return (
                <motion.div key={req.id} layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  whileHover={{ scale: 1.01 }}
                  className="glass rounded-2xl p-4 cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                         style={{ background: typeCfg.bg }}>
                      <TypeIcon size={18} style={{ color: typeCfg.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                          {tr.requestTypes[req.type]}
                        </p>
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0"
                             style={{ background: statusCfg.bg, color: statusCfg.color }}>
                          <StatusIcon size={10} /> {tr.status[req.status === "pendiente" ? "pending" : req.status === "aprobada" ? "approved" : "rejected"]}
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
                          {req.days} {req.days !== 1 ? tr.vacations.days : tr.vacations.day}
                        </span>
                        <div className="flex items-center gap-2">
                          {req.attachmentName && (
                            <span className="flex items-center gap-1 text-[10px]"
                                  style={{ color: "var(--primary)" }}>
                              <Paperclip size={10} /> {req.attachmentName.length > 12 ? req.attachmentName.slice(0, 12) + "…" : req.attachmentName}
                            </span>
                          )}
                          <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                            {new Date(req.createdAt).toLocaleDateString("es-ES")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                   style={{ background: "var(--bg-elevated)" }}>
                <CalendarDays size={24} style={{ color: "var(--text-tertiary)" }} />
              </div>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{tr.vacations.noRequests}</p>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                {tr.vacations.noPending}
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showModal && <NewRequestModal onClose={() => setShowModal(false)} onSubmit={handleNewRequest} />}
      </AnimatePresence>
    </div>
  );
}
