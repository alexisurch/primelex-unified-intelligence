import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type ThemePreference = "dark" | "light" | "system";
export type ResolvedTheme = "dark" | "light";
export type TrackingMode = "manual" | "automated";

interface PreferencesState {
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setTheme: (t: ThemePreference) => void;
  toggleTheme: () => void;
  trackingMode: TrackingMode;
  setTrackingMode: (m: TrackingMode) => void;
}

const PreferencesContext = createContext<PreferencesState | null>(null);

const THEME_KEY = "primelex.theme";
const TRACKING_KEY = "primelex.trackingMode";

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function readInitialTheme(): ThemePreference {
  if (typeof window === "undefined") return "dark";
  const v = window.localStorage.getItem(THEME_KEY);
  return v === "light" || v === "system" ? v : "dark";
}

function readInitialTracking(): TrackingMode {
  if (typeof window === "undefined") return "automated";
  const v = window.localStorage.getItem(TRACKING_KEY);
  return v === "manual" ? "manual" : "automated";
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>("dark");
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>("dark");
  const [trackingMode, setTrackingModeState] = useState<TrackingMode>("automated");

  // Hydrate from localStorage after mount to avoid SSR mismatch
  useEffect(() => {
    setThemeState(readInitialTheme());
    setTrackingModeState(readInitialTracking());
    setSystemTheme(getSystemTheme());

    const mq = window.matchMedia?.("(prefers-color-scheme: light)");
    const onChange = () => setSystemTheme(getSystemTheme());
    mq?.addEventListener?.("change", onChange);
    return () => mq?.removeEventListener?.("change", onChange);
  }, []);

  const resolvedTheme: ResolvedTheme = theme === "system" ? systemTheme : theme;

  const setTheme = (t: ThemePreference) => {
    setThemeState(t);
    try { window.localStorage.setItem(THEME_KEY, t); } catch { /* noop */ }
  };
  const setTrackingMode = (m: TrackingMode) => {
    setTrackingModeState(m);
    try { window.localStorage.setItem(TRACKING_KEY, m); } catch { /* noop */ }
  };
  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  const value = useMemo<PreferencesState>(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme, trackingMode, setTrackingMode }),
    [theme, resolvedTheme, trackingMode],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used inside PreferencesProvider");
  return ctx;
}
