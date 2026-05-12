"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(user.isAdmin ? "/admin" : "/dashboard");
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError("Introduce tu email"); return; }
    if (!password) { setError("Introduce tu contraseña"); return; }
    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 900)); // Simulate API call
    const success = login(email, password);

    if (success) {
      router.push("/dashboard");
    } else {
      setError("Email o contraseña incorrectos");
      setLoading(false);
    }
  };

  if (isLoading) return null;

  return (
    <div
      className="min-h-dvh flex flex-col relative overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Background glow orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[120px] opacity-20"
          style={{ background: "var(--primary)" }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-[120px] opacity-15"
          style={{ background: "var(--violet)" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[100px] opacity-10"
          style={{ background: "var(--cyan)" }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(var(--primary) 1px, transparent 1px),
            linear-gradient(90deg, var(--primary) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Top bar */}
      <div className="relative z-10 flex justify-between items-center px-6 pt-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center shadow-glow-blue">
            <span className="text-white font-black text-sm">A</span>
          </div>
          <span className="font-bold text-lg gradient-text">AMITEC</span>
        </div>
        <ThemeToggle />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{
                background: "var(--primary-light)",
                border: "1px solid rgba(14,165,233,0.2)",
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
              <span className="text-xs font-medium" style={{ color: "var(--primary)" }}>
                Control Horario Empresarial
              </span>
            </motion.div>

            <h1
              className="text-3xl font-extrabold tracking-tight mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              Bienvenido
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Accede a tu cuenta para gestionar
              <br />
              tu jornada laboral
            </p>
          </div>

          {/* Form Card */}
          <div
            className="rounded-3xl p-7 glass"
            style={{ boxShadow: "var(--card-shadow)" }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
                  Email
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Mail size={16} style={{ color: "var(--text-tertiary)" }} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="tu@empresa.com"
                    className="input-base w-full pl-11 pr-4 h-12 rounded-2xl text-sm"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Lock size={16} style={{ color: "var(--text-tertiary)" }} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="••••••••"
                    className="input-base w-full pl-11 pr-12 h-12 rounded-2xl text-sm"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showPassword
                      ? <EyeOff size={16} style={{ color: "var(--text-tertiary)" }} />
                      : <Eye size={16} style={{ color: "var(--text-tertiary)" }} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 py-3 rounded-2xl badge-danger text-xs font-medium">
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.97 }}
                className="btn-primary w-full h-13 rounded-2xl flex items-center justify-center gap-2
                           font-semibold text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ height: "52px", marginTop: "8px" }}
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin text-white" />
                ) : (
                  <>
                    <span>Entrar</span>
                    <ArrowRight size={16} className="text-white" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Demo hint */}
            <div className="mt-5 pt-5" style={{ borderTop: "1px solid var(--border)" }}>
              <p className="text-xs text-center" style={{ color: "var(--text-tertiary)" }}>
                Demo: usa cualquier email y contraseña
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => { setEmail("empleado@empresa.com"); setPassword("demo123"); }}
                  className="flex-1 py-2 rounded-xl text-xs font-medium surface-hover"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Empleado
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail("maria.garcia@empresa.com"); setPassword("demo123"); }}
                  className="flex-1 py-2 rounded-xl text-xs font-medium surface-hover"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Admin
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs mt-8" style={{ color: "var(--text-tertiary)" }}>
            © 2025 AMITEC · Control Horario v2.0
          </p>
        </motion.div>
      </div>
    </div>
  );
}
