"use client";

import { useLocale } from "@/providers/LocaleProvider";

export default function OfflinePage() {
  const { tr } = useLocale();
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        padding: "32px",
        textAlign: "center",
        background: "var(--bg-base)",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 20,
          background: "linear-gradient(135deg, #0EA5E9, #7C3AED)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
          fontWeight: 900,
          color: "#fff",
          boxShadow: "0 0 32px rgba(14,165,233,0.4)",
        }}
      >
        A
      </div>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>
          {tr.offline.title}
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 280 }}>
          {tr.offline.body}
        </p>
      </div>
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: 8,
          padding: "12px 28px",
          borderRadius: 16,
          background: "linear-gradient(135deg, #0EA5E9, #7C3AED)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 14,
          border: "none",
          cursor: "pointer",
        }}
      >
        {tr.offline.retry}
      </button>
    </div>
  );
}
