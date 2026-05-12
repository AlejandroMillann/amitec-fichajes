"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserPlus, CheckCircle2, XCircle, Clock, ChevronRight, Users } from "lucide-react";
import { ALL_EMPLOYEES } from "@/lib/mock-data";
import { useRequests } from "@/hooks/useRequests";
import type { Employee } from "@/lib/types";
import { formatDateShort, getInitials } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } },
};

const DEPT_COLORS: Record<string, string> = {
  Tecnología: "var(--primary)",
  Diseño: "var(--cyan)",
  Operaciones: "var(--violet)",
  Finanzas: "var(--success)",
  Ventas: "var(--warning)",
  Marketing: "#EC4899",
  RRHH: "#8B5CF6",
};

function EmployeeCard({ emp }: { emp: Employee }) {
  const initials = getInitials(emp.name, emp.lastName);
  const deptColor = DEPT_COLORS[emp.department] ?? "var(--primary)";
  const vacRemaining = emp.vacationDays - emp.vacationUsed;

  return (
    <motion.div
      layout
      variants={itemVariants}
      whileHover={{ scale: 1.01 }}
      className="glass rounded-2xl p-4 cursor-pointer group"
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold"
            style={{ background: `linear-gradient(135deg, ${deptColor}, ${deptColor}99)` }}
          >
            {initials}
          </div>
          {emp.isAdmin && (
            <div
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
              style={{ background: "var(--violet)", border: "2px solid var(--bg-surface)" }}
            >
              <span className="text-white text-[8px] font-black">A</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {emp.name} {emp.lastName}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>{emp.role}</p>
            </div>
            <span
              className="flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: `${deptColor}18`, color: deptColor }}
            >
              {emp.department}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1">
              <Clock size={11} style={{ color: "var(--text-tertiary)" }} />
              <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                {emp.weeklyHours}h/sem
              </span>
            </div>
            <div className="w-1 h-1 rounded-full" style={{ background: "var(--border-strong)" }} />
            <div className="flex items-center gap-1">
              <CheckCircle2 size={11} style={{ color: "var(--success)" }} />
              <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                {vacRemaining}d vacac.
              </span>
            </div>
            <div className="w-1 h-1 rounded-full" style={{ background: "var(--border-strong)" }} />
            <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
              Desde {formatDateShort(emp.joinDate)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const REQUEST_TYPE_LABEL: Record<string, string> = {
  vacaciones: "Vacaciones",
  permiso: "Permiso",
  ausencia_horas: "Ausencia",
  baja_medica: "Baja médica",
};

export default function EmpleadosPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"empleados" | "solicitudes">("empleados");
  const [requestFilter, setRequestFilter] = useState<"todas" | "pendientes">("pendientes");

  const { requests, approveRequest, rejectRequest } = useRequests();
  const pendingCount = requests.filter((r) => r.status === "pendiente").length;

  const filtered = ALL_EMPLOYEES.filter((e) =>
    `${e.name} ${e.lastName} ${e.role} ${e.department}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const visibleRequests = requests.filter((r) =>
    requestFilter === "todas" ? true : r.status === "pendiente"
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-5 max-w-4xl"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold" style={{ color: "var(--text-primary)" }}>
            Gestión de empleados
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {ALL_EMPLOYEES.length} empleados registrados
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="btn-primary hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold"
        >
          <UserPlus size={16} />
          Añadir
        </motion.button>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="flex gap-1 p-1 rounded-2xl w-fit" style={{ background: "var(--bg-elevated)" }}>
        {(["empleados", "solicitudes"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 capitalize"
            style={{
              background: activeTab === tab ? "var(--bg-surface)" : "transparent",
              color: activeTab === tab ? "var(--primary)" : "var(--text-tertiary)",
              boxShadow: activeTab === tab ? "var(--card-shadow)" : "none",
            }}
          >
            {tab === "solicitudes" && pendingCount > 0 ? (
              <span className="flex items-center gap-2">
                {tab}
                <span
                  className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
                  style={{ background: "var(--violet-light)", color: "var(--violet)" }}
                >
                  {pendingCount}
                </span>
              </span>
            ) : tab}
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="sync">
        {activeTab === "empleados" ? (
          <motion.div
            key="empleados"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-tertiary)" }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar empleado..."
                className="input-base w-full pl-11 pr-4 h-12 rounded-2xl text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Employee list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <AnimatePresence>
                {filtered.map((emp) => (
                  <EmployeeCard key={emp.id} emp={emp} />
                ))}
              </AnimatePresence>
            </div>

            {filtered.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "var(--bg-elevated)" }}>
                  <Users size={24} style={{ color: "var(--text-tertiary)" }} />
                </div>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Sin resultados</p>
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  Prueba con otro término de búsqueda
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="solicitudes"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            {/* Filter */}
            <div className="flex gap-2">
              {(["pendientes", "todas"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setRequestFilter(f)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all"
                  style={{
                    background: requestFilter === f ? "var(--primary-light)" : "var(--bg-elevated)",
                    color: requestFilter === f ? "var(--primary)" : "var(--text-secondary)",
                    border: requestFilter === f ? "1px solid rgba(14,165,233,0.3)" : "1px solid transparent",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {visibleRequests.map((req, i) => {
                const isPending = req.status === "pendiente";
                return (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass rounded-2xl p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, var(--primary), var(--violet))" }}
                      >
                        {req.employeeName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                              {req.employeeName}
                            </p>
                            <p className="text-xs mt-0.5 capitalize" style={{ color: "var(--text-secondary)" }}>
                              {REQUEST_TYPE_LABEL[req.type]} · {req.days} día{req.days !== 1 ? "s" : ""}
                            </p>
                          </div>
                          <div
                            className="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                            style={{
                              background: req.status === "pendiente" ? "var(--warning-light)" : req.status === "aprobada" ? "var(--success-light)" : "var(--danger-light)",
                              color: req.status === "pendiente" ? "var(--warning)" : req.status === "aprobada" ? "var(--success)" : "var(--danger)",
                            }}
                          >
                            {req.status === "pendiente" ? "Pendiente" : req.status === "aprobada" ? "Aprobada" : "Rechazada"}
                          </div>
                        </div>

                        <p className="text-xs mt-2" style={{ color: "var(--text-tertiary)" }}>
                          {formatDateShort(req.startDate)}
                          {req.startDate !== req.endDate && ` — ${formatDateShort(req.endDate)}`}
                        </p>

                        {req.notes && (
                          <p className="text-xs mt-1.5 italic line-clamp-1" style={{ color: "var(--text-tertiary)" }}>
                            &ldquo;{req.notes}&rdquo;
                          </p>
                        )}

                        {isPending && (
                          <div className="flex gap-2 mt-3">
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => approveRequest(req.id)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold"
                              style={{ background: "var(--success-light)", color: "var(--success)" }}
                            >
                              <CheckCircle2 size={13} />
                              Aprobar
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => rejectRequest(req.id)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold"
                              style={{ background: "var(--danger-light)", color: "var(--danger)" }}
                            >
                              <XCircle size={13} />
                              Rechazar
                            </motion.button>
                            <button
                              className="w-9 flex items-center justify-center rounded-xl"
                              style={{ background: "var(--bg-elevated)" }}
                            >
                              <ChevronRight size={14} style={{ color: "var(--text-tertiary)" }} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {visibleRequests.length === 0 && (
                <div className="flex flex-col items-center gap-3 py-16 text-center">
                  <CheckCircle2 size={32} style={{ color: "var(--success)" }} />
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    Todo al día
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                    No hay solicitudes pendientes
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
