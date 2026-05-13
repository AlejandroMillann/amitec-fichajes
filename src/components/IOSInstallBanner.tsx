"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share } from "lucide-react";
import { useLocale } from "@/providers/LocaleProvider";

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isInStandaloneMode() {
  if (typeof window === "undefined") return false;
  return (
    ("standalone" in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true) ||
    window.matchMedia("(display-mode: standalone)").matches
  );
}

const DISMISSED_KEY = "amitec-ios-banner-dismissed";

export function IOSInstallBanner() {
  const [show, setShow] = useState(false);
  const { tr } = useLocale();

  useEffect(() => {
    if (!isIOS()) return;
    if (isInStandaloneMode()) return;
    if (sessionStorage.getItem(DISMISSED_KEY)) return;
    // Small delay so it doesn't flash on first paint
    const t = setTimeout(() => setShow(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(DISMISSED_KEY, "1");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="fixed z-50 left-3 right-3"
          style={{ bottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
        >
          <div
            className="glass rounded-3xl px-4 py-4"
            style={{
              boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
              border: "1px solid rgba(14,165,233,0.25)",
            }}
          >
            {/* Close */}
            <button
              onClick={dismiss}
              className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: "var(--bg-elevated)" }}
            >
              <X size={13} style={{ color: "var(--text-tertiary)" }} />
            </button>

            <div className="flex items-start gap-3 pr-6">
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #0EA5E9, #7C3AED)" }}
              >
                <span className="text-white font-black text-lg">A</span>
              </div>

              <div>
                <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                  {tr.install.title}
                </p>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {tr.install.body}
                </p>
              </div>
            </div>

            {/* Steps */}
            <div
              className="mt-3 rounded-2xl px-3 py-2.5 flex items-center gap-2"
              style={{ background: "var(--bg-elevated)" }}
            >
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {tr.install.instruction}
              </span>
              <div
                className="flex items-center justify-center w-6 h-6 rounded-lg"
                style={{ background: "var(--primary-light)" }}
              >
                <Share size={13} style={{ color: "var(--primary)" }} />
              </div>
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {tr.install.instructionEnd}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
