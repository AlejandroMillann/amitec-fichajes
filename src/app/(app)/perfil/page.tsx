"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TopBar } from "@/components/layout/TopBar";
import { useAuth } from "@/hooks/useAuth";
import {
  User, Mail, Phone, Building2, Calendar, LogOut,
  ChevronRight, Shield, Bell, Moon, HelpCircle, Lock, Globe,
} from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { getInitials, formatDateShort } from "@/lib/utils";
import { useLocale } from "@/providers/LocaleProvider";
import { LOCALE_LABELS, LOCALE_FLAGS, type Locale } from "@/lib/translations";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } },
};

function AvatarCircle({ name, lastName }: { name: string; lastName: string }) {
  const initials = getInitials(name, lastName);
  return (
    <div
      className="relative w-20 h-20 rounded-3xl flex items-center justify-center text-white font-black text-2xl"
      style={{
        background: "linear-gradient(135deg, var(--primary), var(--violet))",
        boxShadow: "0 0 32px rgba(14,165,233,0.4), 0 8px 24px rgba(0,0,0,0.3)",
      }}
    >
      {initials}
      <div
        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 flex items-center justify-center"
        style={{
          background: "var(--success)",
          borderColor: "var(--bg-surface)",
        }}
      />
    </div>
  );
}

function LanguageSelector() {
  const { locale, setLocale } = useLocale();
  const locales: Locale[] = ["es", "en", "fr"];

  return (
    <div className="flex gap-2">
      {locales.map((l) => (
        <motion.button
          key={l}
          whileTap={{ scale: 0.92 }}
          onClick={() => setLocale(l)}
          className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{
            background: locale === l ? "var(--primary-light)" : "var(--bg-elevated)",
            color: locale === l ? "var(--primary)" : "var(--text-secondary)",
            border: locale === l ? "1.5px solid rgba(14,165,233,0.3)" : "1.5px solid transparent",
          }}
        >
          <span className="text-base">{LOCALE_FLAGS[l]}</span>
          <span>{LOCALE_LABELS[l]}</span>
        </motion.button>
      ))}
    </div>
  );
}

export default function PerfilPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { tr } = useLocale();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const menuSections = [
    {
      title: tr.profile.sectionAccount,
      items: [
        { icon: User, label: tr.profile.personalData, sub: tr.profile.personalDataSub },
        { icon: Lock, label: tr.profile.changePassword, sub: tr.profile.changePasswordSub },
        { icon: Bell, label: tr.profile.notifications, sub: tr.profile.notificationsSub },
      ],
    },
    {
      title: tr.profile.sectionPrefs,
      items: [
        {
          icon: Moon, label: tr.profile.appearance, sub: tr.profile.appearanceSub,
          rightElement: <ThemeToggle />,
        },
        { icon: Shield, label: tr.profile.privacy, sub: tr.profile.privacySub },
      ],
    },
    {
      title: tr.profile.sectionSupport,
      items: [
        { icon: HelpCircle, label: tr.profile.help, sub: tr.profile.helpSub },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title={tr.profile.title} showNotifications={false} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 px-4 pb-8 space-y-5 max-w-lg mx-auto w-full pt-4"
      >
        {/* Profile Header Card */}
        <motion.div variants={itemVariants} className="glass rounded-3xl p-6">
          <div className="flex items-center gap-4">
            <AvatarCircle name={user.name} lastName={user.lastName} />
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-extrabold" style={{ color: "var(--text-primary)" }}>
                {user.name} {user.lastName}
              </h2>
              <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
                {user.role}
              </p>
              <div
                className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: user.isAdmin ? "var(--violet-light)" : "var(--primary-light)",
                  color: user.isAdmin ? "var(--violet)" : "var(--primary)",
                }}
              >
                <Shield size={10} />
                {user.isAdmin ? tr.profile.admin : tr.profile.employee}
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div className="mt-5 grid grid-cols-1 gap-2">
            {[
              { icon: Mail, label: user.email },
              { icon: Building2, label: `${user.department} · ${user.weeklyHours}h/semana` },
              { icon: Calendar, label: `${tr.profile.joinDate} ${formatDateShort(user.joinDate)}` },
              ...(user.phone ? [{ icon: Phone, label: user.phone }] : []),
            ].map((info, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-2xl"
                   style={{ background: "var(--bg-elevated)" }}>
                <info.icon size={14} style={{ color: "var(--text-tertiary)" }} />
                <span className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                  {info.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Vacation mini summary */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {tr.profile.vacationYear}
            </p>
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              {user.vacationDays - user.vacationUsed} {tr.profile.daysAvailable}
            </span>
          </div>
          <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, var(--primary), var(--cyan))",
                boxShadow: "0 0 8px rgba(14,165,233,0.4)",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${(user.vacationUsed / user.vacationDays) * 100}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
              {user.vacationUsed} {tr.profile.daysUsed}
            </span>
            <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
              {user.vacationDays} {tr.profile.daysTotal}
            </span>
          </div>
        </motion.div>

        {/* Language selector */}
        <motion.div variants={itemVariants} className="glass rounded-2xl overflow-hidden">
          <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
            <div className="flex items-center gap-2">
              <Globe size={14} style={{ color: "var(--text-tertiary)" }} />
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                {tr.profile.sectionLanguage}
              </p>
            </div>
          </div>
          <div className="p-3">
            <LanguageSelector />
          </div>
        </motion.div>

        {/* Menu sections */}
        {menuSections.map((section) => (
          <motion.div key={section.title} variants={itemVariants} className="glass rounded-2xl overflow-hidden">
            <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                {section.title}
              </p>
            </div>
            <div>
              {section.items.map((item, i) => (
                <motion.button
                  key={item.label}
                  whileTap={{ scale: 0.99 }}
                  className="w-full flex items-center gap-3 px-4 py-4 surface-hover text-left"
                  style={{
                    borderTop: i > 0 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--bg-elevated)" }}
                  >
                    <item.icon size={16} style={{ color: "var(--text-secondary)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {item.label}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                      {item.sub}
                    </p>
                  </div>
                  {item.rightElement ?? (
                    <ChevronRight size={16} style={{ color: "var(--text-tertiary)" }} />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Logout button */}
        <motion.div variants={itemVariants}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full h-12 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm"
            style={{
              background: "var(--danger-light)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "var(--danger)",
            }}
          >
            <LogOut size={16} />
            {tr.profile.logout}
          </motion.button>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center pb-2">
          <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
            {tr.profile.footer}
          </p>
        </motion.div>
      </motion.div>

      {/* Logout confirm modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.93 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-3xl p-7 w-full max-w-sm space-y-5 text-center"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
                style={{ background: "var(--danger-light)" }}
              >
                <LogOut size={24} style={{ color: "var(--danger)" }} />
              </div>
              <div>
                <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                  {tr.profile.logoutTitle}
                </h3>
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                  {tr.profile.logoutBody}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="btn-secondary h-12 rounded-2xl text-sm font-semibold"
                >
                  {tr.common.cancel}
                </button>
                <button
                  onClick={handleLogout}
                  className="h-12 rounded-2xl text-sm font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #EF4444, #DC2626)" }}
                >
                  {tr.common.confirm}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
