"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { Bell, CheckCircle2, XCircle, FileText, Zap, X, BellOff, BellRing } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications, type AppNotification } from "@/hooks/useNotifications";

interface TopBarProps {
  title?: string;
  subtitle?: string;
  showNotifications?: boolean;
  rightElement?: React.ReactNode;
}

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Ahora";
  if (mins < 60) return `Hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `Hace ${days}d`;
  return new Date(timestamp).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

const TYPE_ICON = {
  request_approved: CheckCircle2,
  request_rejected: XCircle,
  new_request: FileText,
  overtime: Zap,
};

const TYPE_COLOR = {
  request_approved: "var(--success)",
  request_rejected: "var(--danger)",
  new_request: "var(--violet)",
  overtime: "var(--warning)",
};

const TYPE_BG = {
  request_approved: "var(--success-light)",
  request_rejected: "var(--danger-light)",
  new_request: "var(--violet-light)",
  overtime: "var(--warning-light)",
};

function NotifItem({ n, onRead }: { n: AppNotification; onRead: (id: string) => void }) {
  const Icon = TYPE_ICON[n.type];
  const color = TYPE_COLOR[n.type];
  const bg = TYPE_BG[n.type];

  return (
    <motion.button
      layout
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.15 }}
      onClick={() => onRead(n.id)}
      className="w-full flex items-start gap-3 px-4 py-3 text-left surface-hover transition-colors"
      style={{ borderBottom: "1px solid var(--border)", opacity: n.read ? 0.55 : 1 }}
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: bg }}
      >
        <Icon size={14} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
            {n.title}
          </p>
          {!n.read && (
            <span
              className="flex-shrink-0 w-2 h-2 rounded-full mt-1"
              style={{ background: "var(--primary)" }}
            />
          )}
        </div>
        <p className="text-[11px] mt-0.5 leading-snug line-clamp-2" style={{ color: "var(--text-secondary)" }}>
          {n.message}
        </p>
        <p className="text-[10px] mt-1" style={{ color: "var(--text-tertiary)" }}>
          {timeAgo(n.timestamp)}
        </p>
      </div>
    </motion.button>
  );
}

export function TopBar({ title, subtitle, showNotifications = true, rightElement }: TopBarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const { user } = useAuth();
  const { notifications, permission, requestPermission, markAsRead, markAllAsRead } = useNotifications();
  const panelRef = useRef<HTMLDivElement>(null);

  const userNotifs = user
    ? notifications.filter((n) => n.forUserId === user.id)
    : [];
  const unreadCount = userNotifs.filter((n) => !n.read).length;

  // Close panel on outside click
  useEffect(() => {
    if (!notifOpen) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [notifOpen]);

  return (
    <div className="sticky top-0 z-40" ref={panelRef}>
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-blur px-4 py-3 flex items-center justify-between"
      >
        {/* Left: Logo or Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xs tracking-wider">A</span>
            </div>
            <div>
              {title ? (
                <>
                  <p className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
                    AMITEC
                  </p>
                  <p className="text-sm font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
                    {title}
                  </p>
                </>
              ) : (
                <span className="font-bold text-base gradient-text tracking-tight">
                  AMITEC
                </span>
              )}
              {subtitle && (
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {rightElement}
          {showNotifications && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setNotifOpen((v) => !v)}
              className="relative w-10 h-10 rounded-xl flex items-center justify-center surface-hover"
            >
              <Bell
                size={18}
                style={{ color: notifOpen ? "var(--primary)" : "var(--text-secondary)" }}
              />
              {unreadCount > 0 && (
                <motion.span
                  key={unreadCount}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                  style={{ background: "var(--primary)" }}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </motion.span>
              )}
            </motion.button>
          )}
          <ThemeToggle />
        </div>
      </motion.header>

      {/* Notification panel */}
      <AnimatePresence>
        {notifOpen && showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{
              transformOrigin: "top",
              background: "var(--bg-surface)",
              borderBottom: "1px solid var(--border)",
              boxShadow: "var(--card-shadow)",
              maxHeight: "70dvh",
              overflowY: "auto",
            }}
          >
            {/* Panel header */}
            <div
              className="flex items-center justify-between px-4 py-3 sticky top-0"
              style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                  Notificaciones
                </p>
                {unreadCount > 0 && (
                  <span
                    className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ background: "var(--primary-light)", color: "var(--primary)" }}
                  >
                    {unreadCount} nuevas
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && user && (
                  <button
                    onClick={() => markAllAsRead(user.id)}
                    className="text-[11px] font-semibold"
                    style={{ color: "var(--primary)" }}
                  >
                    Leer todas
                  </button>
                )}
                <button
                  onClick={() => setNotifOpen(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center surface-hover"
                >
                  <X size={14} style={{ color: "var(--text-tertiary)" }} />
                </button>
              </div>
            </div>

            {/* Push permission banner */}
            {(permission === "default" || permission === "denied") && (
              <div
                className="mx-3 my-2 px-3 py-3 rounded-2xl flex items-start gap-3"
                style={{
                  background: permission === "denied" ? "var(--warning-light)" : "var(--primary-light)",
                  border: `1px solid ${permission === "denied" ? "rgba(245,158,11,0.2)" : "rgba(14,165,233,0.2)"}`,
                }}
              >
                <BellOff size={16} style={{ color: permission === "denied" ? "var(--warning)" : "var(--primary)", flexShrink: 0, marginTop: 1 }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold" style={{ color: permission === "denied" ? "var(--warning)" : "var(--primary)" }}>
                    {permission === "denied" ? "Notificaciones bloqueadas" : "Recibe avisos en tu móvil"}
                  </p>
                  <p className="text-[10px] mt-0.5 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {permission === "denied"
                      ? "Actívalas en Ajustes del dispositivo → Notificaciones → AMITEC"
                      : "Notificaciones aunque la app esté cerrada"}
                  </p>
                </div>
                {permission === "default" && (
                  <button
                    onClick={requestPermission}
                    className="flex-shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-bold text-white mt-0.5"
                    style={{ background: "var(--primary)" }}
                  >
                    Activar
                  </button>
                )}
              </div>
            )}
            {permission === "granted" && (
              <div className="flex items-center gap-1.5 px-4 py-2">
                <BellRing size={11} style={{ color: "var(--success)" }} />
                <p className="text-[10px]" style={{ color: "var(--success)" }}>
                  Notificaciones activadas
                </p>
              </div>
            )}

            {/* Notification list */}
            <AnimatePresence>
              {userNotifs.length > 0 ? (
                userNotifs.map((n) => (
                  <NotifItem key={n.id} n={n} onRead={markAsRead} />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-2 py-10 text-center"
                >
                  <Bell size={24} style={{ color: "var(--text-tertiary)" }} />
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    Sin notificaciones
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
