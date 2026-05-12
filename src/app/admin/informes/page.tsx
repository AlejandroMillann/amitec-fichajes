"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Download, FileText, Calendar,
  TrendingUp, Clock, Users, ChevronDown, Filter,
} from "lucide-react";
import { ALL_EMPLOYEES } from "@/lib/mock-data";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend,
} from "recharts";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const MONTHS_DATA = [
  { mes: "Ene", horas: 164, objetivo: 168, extra: 0 },
  { mes: "Feb", horas: 155, objetivo: 160, extra: 0 },
  { mes: "Mar", horas: 172, objetivo: 168, extra: 4 },
  { mes: "Abr", horas: 162, objetivo: 176, extra: 0 },
  { mes: "May", horas: 156, objetivo: 168, extra: 0 },
];

const EMPLOYEE_HOURS = ALL_EMPLOYEES.slice(0, 6).map((e) => ({
  nombre: e.name,
  horas: Math.floor(Math.random() * 40 + 150),
  objetivo: e.weeklyHours * 4,
}));

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-4 py-3 text-xs min-w-[140px]" style={{ boxShadow: "var(--card-shadow)" }}>
      <p className="font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span style={{ color: "var(--text-tertiary)" }}>{p.name}</span>
          </div>
          <span className="font-bold" style={{ color: "var(--text-primary)" }}>{p.value}h</span>
        </div>
      ))}
    </div>
  );
}

export default function InformesPage() {
  const [period] = useState("Mayo 2025");
  const [exportType, setExportType] = useState<"pdf" | "csv" | null>(null);

  const handleExport = (type: "pdf" | "csv") => {
    setExportType(type);
    setTimeout(() => setExportType(null), 2000);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-5xl"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold" style={{ color: "var(--text-primary)" }}>Informes</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
            Exportación y análisis de datos laborales
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleExport("pdf")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold"
            style={{
              background: exportType === "pdf" ? "var(--success-light)" : "var(--danger-light)",
              color: exportType === "pdf" ? "var(--success)" : "var(--danger)",
              border: `1px solid ${exportType === "pdf" ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
            }}
          >
            <Download size={15} />
            {exportType === "pdf" ? "Descargando..." : "PDF"}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleExport("csv")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold"
            style={{
              background: exportType === "csv" ? "var(--success-light)" : "var(--success-light)",
              color: exportType === "csv" ? "var(--success)" : "var(--success)",
              border: "1px solid rgba(16,185,129,0.2)",
            }}
          >
            <Download size={15} />
            {exportType === "csv" ? "Descargando..." : "CSV"}
          </motion.button>
        </div>
      </motion.div>

      {/* Filter bar */}
      <motion.div variants={itemVariants} className="glass rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <Filter size={14} style={{ color: "var(--text-tertiary)" }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Filtros</span>
        </div>

        <button
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium surface-hover"
        >
          <Calendar size={13} style={{ color: "var(--primary)" }} />
          <span style={{ color: "var(--text-secondary)" }}>{period}</span>
          <ChevronDown size={12} style={{ color: "var(--text-tertiary)" }} />
        </button>

        <button
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium surface-hover"
        >
          <Users size={13} style={{ color: "var(--primary)" }} />
          <span style={{ color: "var(--text-secondary)" }}>Todos los empleados</span>
          <ChevronDown size={12} style={{ color: "var(--text-tertiary)" }} />
        </button>

        <button
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium surface-hover"
        >
          <Clock size={13} style={{ color: "var(--primary)" }} />
          <span style={{ color: "var(--text-secondary)" }}>Todos los departamentos</span>
          <ChevronDown size={12} style={{ color: "var(--text-tertiary)" }} />
        </button>
      </motion.div>

      {/* KPI cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Clock, label: "Total horas mes", value: "1.024h", change: "+3.2%", positive: true, color: "var(--primary)", bg: "var(--primary-light)" },
          { icon: Users, label: "Media por empleado", value: "146h", change: "+1.5%", positive: true, color: "var(--cyan)", bg: "var(--cyan-light)" },
          { icon: TrendingUp, label: "Horas extra totales", value: "+24h", change: "este mes", positive: true, color: "var(--success)", bg: "var(--success-light)" },
          { icon: FileText, label: "Registros fichajes", value: "1.847", change: "mayo 2025", positive: true, color: "var(--violet)", bg: "var(--violet-light)" },
        ].map((kpi) => (
          <motion.div
            key={kpi.label}
            whileHover={{ scale: 1.02 }}
            className="glass rounded-2xl p-4 space-y-3"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: kpi.bg }}>
              <kpi.icon size={16} style={{ color: kpi.color }} />
            </div>
            <div>
              <p className="text-xl font-extrabold" style={{ color: "var(--text-primary)" }}>{kpi.value}</p>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>{kpi.label}</p>
            </div>
            <div
              className="text-[10px] font-semibold"
              style={{ color: kpi.positive ? "var(--success)" : "var(--danger)" }}
            >
              {kpi.change}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly trend */}
        <motion.div variants={itemVariants} className="glass rounded-3xl p-6">
          <div className="mb-5">
            <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              Evolución mensual
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
              Horas trabajadas vs objetivo
            </p>
          </div>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTHS_DATA} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--text-tertiary)" }} />
                <YAxis hide domain={[140, 185]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: "11px", color: "var(--text-tertiary)", paddingTop: "8px" }}
                />
                <Line
                  type="monotone"
                  dataKey="horas"
                  name="Trabajadas"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  dot={{ fill: "var(--primary)", r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="objetivo"
                  name="Objetivo"
                  stroke="var(--text-tertiary)"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Per employee */}
        <motion.div variants={itemVariants} className="glass rounded-3xl p-6">
          <div className="mb-5">
            <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              Horas por empleado
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>Mayo 2025</p>
          </div>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={EMPLOYEE_HOURS} barSize={20} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <XAxis dataKey="nombre" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "var(--text-tertiary)" }} />
                <YAxis hide domain={[130, 200]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="horas" name="Trabajadas" fill="var(--primary)" radius={[4, 4, 2, 2]} />
                <Bar dataKey="objetivo" name="Objetivo" fill="var(--border-strong)" radius={[4, 4, 2, 2]} fillOpacity={0.4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Fichajes table */}
      <motion.div variants={itemVariants} className="glass rounded-3xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Registro de fichajes</h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>Últimos registros del mes</p>
          </div>
          <button
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl surface-hover"
            style={{ color: "var(--primary)" }}
          >
            <Download size={13} />
            Exportar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Empleado", "Fecha", "Entrada", "Salida", "Total", "Estado"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALL_EMPLOYEES.slice(0, 5).map((emp, i) => (
                <tr
                  key={emp.id}
                  className="transition-colors"
                  style={{ borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, var(--primary), var(--violet))" }}
                      >
                        {emp.name[0]}{emp.lastName[0]}
                      </div>
                      <span className="font-medium text-xs" style={{ color: "var(--text-primary)" }}>
                        {emp.name} {emp.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs" style={{ color: "var(--text-secondary)" }}>
                    {new Date().toLocaleDateString("es-ES")}
                  </td>
                  <td className="px-5 py-3.5 text-xs font-mono" style={{ color: "var(--text-primary)" }}>
                    0{8 + i}:30
                  </td>
                  <td className="px-5 py-3.5 text-xs font-mono" style={{ color: "var(--text-primary)" }}>
                    1{7 + i}:30
                  </td>
                  <td className="px-5 py-3.5 text-xs font-semibold" style={{ color: "var(--success)" }}>
                    {7 + i < 8 ? `${7 + i}h` : `${7 + i}h`}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ background: "var(--success-light)", color: "var(--success)" }}
                    >
                      Completado
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 flex items-center justify-between" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Mostrando 5 de 1.847 registros
          </p>
          <button className="text-xs font-medium" style={{ color: "var(--primary)" }}>
            Ver todos
          </button>
        </div>
      </motion.div>

      {/* Legal compliance note */}
      <motion.div variants={itemVariants}
        className="rounded-2xl p-4 flex items-start gap-3"
        style={{ background: "var(--primary-light)", border: "1px solid rgba(14,165,233,0.2)" }}
      >
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
             style={{ background: "var(--primary)" }}>
          <FileText size={14} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--primary)" }}>
            Cumplimiento RD 8/2019
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
            Todos los registros de fichajes están almacenados con trazabilidad completa
            conforme a la normativa española de control horario. Los datos se conservan
            durante 4 años y son exportables en cualquier momento.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
