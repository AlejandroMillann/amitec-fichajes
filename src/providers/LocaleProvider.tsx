"use client";

import { createContext, useContext, useEffect, useState } from "react";
import t, { type Locale, detectLocale } from "@/lib/translations";

const STORAGE_KEY = "amitec-locale";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  tr: typeof t.es;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "es",
  setLocale: () => {},
  tr: t.es,
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored && (stored === "es" || stored === "en" || stored === "fr")) {
      setLocaleState(stored);
    } else {
      setLocaleState(detectLocale());
    }
  }, []);

  const setLocale = (l: Locale) => {
    localStorage.setItem(STORAGE_KEY, l);
    setLocaleState(l);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, tr: t[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
