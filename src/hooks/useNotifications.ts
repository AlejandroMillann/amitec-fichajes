"use client";

import { useState, useEffect, useCallback } from "react";

export interface AppNotification {
  id: string;
  type: "request_approved" | "request_rejected" | "new_request" | "overtime";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  forUserId: string;
  requestId?: string;
}

const STORAGE_KEY = "amitec-notifications";

// Seed: a couple of pre-existing notifications so the demo isn't empty
const SEED: AppNotification[] = [
  {
    id: "notif-seed-001",
    type: "request_approved",
    title: "Solicitud aprobada",
    message: "Tu solicitud de vacaciones (10 días, 04 ago — 15 ago) ha sido aprobada",
    timestamp: "2025-05-16T09:00:00",
    read: false,
    forUserId: "emp-001",
    requestId: "req-001",
  },
  {
    id: "notif-seed-002",
    type: "new_request",
    title: "Nueva solicitud pendiente",
    message: "Lucía Fernández ha solicitado vacaciones (10 días) — pendiente de revisión",
    timestamp: "2025-05-20T11:00:00",
    read: false,
    forUserId: "admin-001",
    requestId: "req-003",
  },
];

function loadNotifications(): AppNotification[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED;
    return JSON.parse(raw) as AppNotification[];
  } catch {
    return SEED;
  }
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>(SEED);

  useEffect(() => {
    setNotifications(loadNotifications());
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    }
  }, [notifications]);

  const addNotification = useCallback((n: Omit<AppNotification, "id" | "timestamp" | "read">) => {
    const newNotif: AppNotification = {
      ...n,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback((forUserId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.forUserId === forUserId ? { ...n, read: true } : n))
    );
  }, []);

  return { notifications, addNotification, markAsRead, markAllAsRead };
}
