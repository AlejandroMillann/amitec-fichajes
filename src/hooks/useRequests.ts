"use client";

import { useState, useEffect, useCallback } from "react";
import type { VacationRequest } from "@/lib/types";
import { VACATION_REQUESTS } from "@/lib/mock-data";

const STORAGE_KEY = "amitec-vacation-requests";

function loadRequests(): VacationRequest[] {
  if (typeof window === "undefined") return VACATION_REQUESTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return VACATION_REQUESTS;
    return JSON.parse(raw) as VacationRequest[];
  } catch {
    return VACATION_REQUESTS;
  }
}

export function useRequests() {
  const [requests, setRequests] = useState<VacationRequest[]>(VACATION_REQUESTS);

  useEffect(() => {
    setRequests(loadRequests());
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    }
  }, [requests]);

  const addRequest = useCallback((req: VacationRequest) => {
    setRequests((prev) => [req, ...prev]);
  }, []);

  const approveRequest = useCallback((id: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "aprobada" as const, reviewedAt: new Date().toISOString() } : r
      )
    );
  }, []);

  const rejectRequest = useCallback((id: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "rechazada" as const, reviewedAt: new Date().toISOString() } : r
      )
    );
  }, []);

  return { requests, addRequest, approveRequest, rejectRequest };
}
