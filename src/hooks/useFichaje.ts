"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { FichajeStatus, FichajeEvent } from "@/lib/types";

interface FichajeState {
  status: FichajeStatus;
  sessionStart: number | null;
  pauseStart: number | null;
  totalWorkedSeconds: number;
  totalPausedSeconds: number;
  events: FichajeEvent[];
  todayDate: string;
}

const STORAGE_KEY = "amitec-fichaje-state";

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

function loadState(): FichajeState {
  if (typeof window === "undefined") return createEmptyState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyState();
    const parsed: FichajeState = JSON.parse(raw);
    // Reset if it's a different day
    if (parsed.todayDate !== getTodayStr()) {
      return createEmptyState();
    }
    return parsed;
  } catch {
    return createEmptyState();
  }
}

function createEmptyState(): FichajeState {
  return {
    status: "idle",
    sessionStart: null,
    pauseStart: null,
    totalWorkedSeconds: 0,
    totalPausedSeconds: 0,
    events: [],
    todayDate: getTodayStr(),
  };
}

export function useFichaje() {
  const [state, setState] = useState<FichajeState>(createEmptyState);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load persisted state on mount
  useEffect(() => {
    const saved = loadState();
    setState(saved);
  }, []);

  // Persist state on every change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  // Update elapsed timer every second
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (state.status === "working" && state.sessionStart) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const activeSeconds = Math.floor((now - state.sessionStart!) / 1000);
        setElapsedSeconds(state.totalWorkedSeconds + activeSeconds - state.totalPausedSeconds);
      }, 1000);
    } else if (state.status === "paused") {
      setElapsedSeconds(state.totalWorkedSeconds - state.totalPausedSeconds);
    } else {
      setElapsedSeconds(state.totalWorkedSeconds);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.status, state.sessionStart, state.totalWorkedSeconds, state.totalPausedSeconds]);

  const addEvent = useCallback((type: FichajeEvent["type"]): FichajeEvent => {
    const event: FichajeEvent = {
      id: `ev-${Date.now()}`,
      employeeId: "emp-001",
      type,
      timestamp: new Date().toISOString(),
    };
    return event;
  }, []);

  const ficharEntrada = useCallback(() => {
    const event = addEvent("entrada");
    setState((prev) => ({
      ...prev,
      status: "working",
      sessionStart: Date.now(),
      events: [...prev.events, event],
    }));

    // Capture geolocation in background — does not block fichaje
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setState((prev) => ({
            ...prev,
            events: prev.events.map((e) =>
              e.id === event.id
                ? { ...e, location: { lat: pos.coords.latitude, lng: pos.coords.longitude } }
                : e
            ),
          }));
        },
        () => { /* silently ignore if denied */ },
        { timeout: 8000, maximumAge: 0 }
      );
    }
  }, [addEvent]);

  const ficharSalida = useCallback(() => {
    const event = addEvent("salida");
    setState((prev) => {
      const now = Date.now();
      let totalWorked = prev.totalWorkedSeconds;
      if (prev.sessionStart) {
        const sessionSeconds = Math.floor((now - prev.sessionStart) / 1000);
        totalWorked += sessionSeconds - prev.totalPausedSeconds;
      }
      return {
        ...prev,
        status: "idle",
        sessionStart: null,
        pauseStart: null,
        totalWorkedSeconds: totalWorked,
        totalPausedSeconds: 0,
        events: [...prev.events, event],
      };
    });
  }, [addEvent]);

  const iniciarPausa = useCallback(() => {
    const event = addEvent("inicio_pausa");
    setState((prev) => ({
      ...prev,
      status: "paused",
      pauseStart: Date.now(),
      events: [...prev.events, event],
    }));
  }, [addEvent]);

  const finalizarPausa = useCallback(() => {
    const event = addEvent("fin_pausa");
    setState((prev) => {
      const pauseSeconds = prev.pauseStart
        ? Math.floor((Date.now() - prev.pauseStart) / 1000)
        : 0;
      return {
        ...prev,
        status: "working",
        pauseStart: null,
        totalPausedSeconds: prev.totalPausedSeconds + pauseSeconds,
        events: [...prev.events, event],
      };
    });
  }, [addEvent]);

  const resetDay = useCallback(() => {
    setState(createEmptyState());
    setElapsedSeconds(0);
  }, []);

  const targetSeconds = 8 * 3600; // 8h target
  const progressPercent = Math.min((elapsedSeconds / targetSeconds) * 100, 100);
  const remainingSeconds = Math.max(targetSeconds - elapsedSeconds, 0);

  return {
    status: state.status,
    elapsedSeconds,
    remainingSeconds,
    progressPercent,
    events: state.events,
    ficharEntrada,
    ficharSalida,
    iniciarPausa,
    finalizarPausa,
    resetDay,
    hasWorkedToday: state.events.length > 0 || elapsedSeconds > 0,
  };
}
