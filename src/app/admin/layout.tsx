"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import {
  LayoutDashboard, Users, FileText, LogOut, Bell, ChevronRight,
} from "lucide-react";
import Link from "next/link";

const NAV_ITEMS = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/empleados", icon: Users, label: "Empleados" },
  { href: "/admin/informes", icon: FileText, label: "Informes" },
];

// ── Desktop sidebar ──────────────────────────────────────────
function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "var(--bg-surface)", borderRight: "1px solid var(--border)" }}
    >
      {/* Logo */}
      <div className="p-5" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center shadow-glow-blue">
            <span className="text-white font-black text-sm">A</span>
          </div>
          <div>
            <span className="font-extrabold text-base gradient-text">AMITEC</span>
            <p className="text-[10px] font-medium" style={{ color: "var(--text-tertiary)" }}>Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                className="flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-150 cursor-pointer"
                style={{
                  background: isActive ? "var(--primary-light)" : "transparent",
                  color: isActive ? "var(--primary)" : "var(--text-secondary)",
                }}
              >
                <item.icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="p-4 space-y-2" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl" style={{ background: "var(--bg-elevated)" }}>
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: "linear-gradient(135deg, var(--primary), var(--violet))" }}
          >
            {user?.name.charAt(0)}{user?.lastName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>
              {user?.name} {user?.lastName}
            </p>
            <p className="text-[10px] truncate" style={{ color: "var(--text-tertiary)" }}>
              {user?.role}
            </p>
          </div>
        </div>
        <button
          onClick={() => { logout(); router.push("/login"); }}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-2xl text-sm transition-all"
          style={{ color: "var(--danger)", background: "var(--danger-light)" }}
        >
          <LogOut size={15} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

// ── Mobile bottom nav ────────────────────────────────────────
function AdminBottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="bottom-nav fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div
        className="flex items-center justify-around px-2 py-1"
        style={{ paddingBottom: "max(8px, env(safe-area-inset-bottom))" }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <motion.button
              key={item.href}
              whileTap={{ scale: 0.88 }}
              onClick={() => router.push(item.href)}
              className="relative flex flex-col items-center justify-center gap-0.5 px-4 py-2 rounded-2xl min-w-[72px]"
              style={{ color: isActive ? "var(--primary)" : "var(--text-tertiary)" }}
            >
              {isActive && (
                <motion.div
                  layoutId="admin-nav-active"
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: "var(--primary-light)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <div className="relative z-10">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} className="transition-all duration-200" />
              </div>
              <span className="text-[10px] font-medium relative z-10" style={{ fontWeight: isActive ? 600 : 500 }}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="admin-nav-dot"
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full z-10"
                  style={{ background: "var(--primary)" }}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}

// ── Layout ───────────────────────────────────────────────────
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      router.replace(user ? "/dashboard" : "/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user?.isAdmin) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center animate-pulse">
          <span className="text-white font-black">A</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex" style={{ background: "var(--bg)" }}>
      {/* Desktop sidebar — hidden on mobile */}
      <aside className="hidden lg:flex flex-col w-60 xl:w-64 flex-shrink-0 sticky top-0 h-dvh">
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar — shared mobile + desktop */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-5 py-3 glass-blur"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          {/* Mobile: logo · Desktop: page title */}
          <div>
            <p className="hidden lg:block text-lg font-extrabold" style={{ color: "var(--text-primary)" }}>
              {NAV_ITEMS.find((n) => n.href === pathname)?.label ?? "Admin"}
            </p>
            <p className="hidden lg:block text-xs" style={{ color: "var(--text-tertiary)" }}>
              {new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center">
                <span className="text-white font-black text-xs">A</span>
              </div>
              <span className="font-bold text-base gradient-text">AMITEC Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative w-10 h-10 rounded-xl flex items-center justify-center surface-hover">
              <Bell size={18} style={{ color: "var(--text-secondary)" }} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-500" />
            </button>
            <ThemeToggle />
          </div>
        </header>

        {/* Page content */}
        <AnimatePresence mode="sync">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="flex-1 p-4 lg:p-8 overflow-auto"
            style={{ paddingBottom: "calc(var(--nav-height) + 8px)" }}
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>

      {/* Mobile bottom nav */}
      <AdminBottomNav />
    </div>
  );
}
