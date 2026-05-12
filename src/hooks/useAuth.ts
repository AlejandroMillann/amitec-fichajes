"use client";

import { useState, useEffect } from "react";
import type { Employee } from "@/lib/types";
import { CURRENT_USER, ADMIN_USER } from "@/lib/mock-data";

interface AuthState {
  user: Employee | null;
  isLoading: boolean;
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>({ user: null, isLoading: true });

  useEffect(() => {
    const stored = localStorage.getItem("amitec-user");
    if (stored) {
      setAuth({ user: JSON.parse(stored), isLoading: false });
    } else {
      setAuth({ user: null, isLoading: false });
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const login = (email: string, _password: string): boolean => {
    // Mock auth — accept any password for demo
    let user: Employee | null = null;
    if (email === ADMIN_USER.email) user = ADMIN_USER;
    else if (email === CURRENT_USER.email) user = CURRENT_USER;
    else if (email.includes("@")) user = CURRENT_USER; // demo fallback

    if (user) {
      localStorage.setItem("amitec-user", JSON.stringify(user));
      setAuth({ user, isLoading: false });
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("amitec-user");
    setAuth({ user: null, isLoading: false });
  };

  return { ...auth, login, logout };
}
