import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type TrackingMode = "manual" | "automated";
export type ThemePreference = "dark" | "light" | "system";
export type ResolvedTheme = "dark" | "light";

interface PreferencesContextValue {
  trackingMode: TrackingMode;
  setTrackingMode: (mode: TrackingMode) => void;
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  resolvedTheme: ResolvedTheme;
}

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const STORAGE_KEY_TRACKING = "fleet.preferences.trackingMode";
const STORAGE_KEY_THEME = "fleet.preferences.theme";

const DEFAULT_TRACKING_MODE: TrackingMode = "automated";
const DEFAULT_THEME: ThemePreference = "dark";

/* ------------------------------------------------------------------ */
/* Storage helpers (guard against SSR / unavailable localStorage)     */
/* ------------------------------------------------------------------ */

function readStoredString(key: string): string | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStoredString(key: string, value: string): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, value);
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}

function parseTrackingMode(value: string | null): TrackingMode {
  return value === "manual" || value === "automated"
    ? value
    : DEFAULT_TRACKING_MODE;
}

function parseTheme(value: string | null): ThemePreference {
  return value === "dark" || value === "light" || value === "system"
    ? value
    : DEFAULT_THEME;
}

/* ------------------------------------------------------------------ */
/* System theme resolution                                             */
/* ------------------------------------------------------------------ */

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined" || !window.matchMedia) return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */

const PreferencesContext = createContext<PreferencesContextValue | null>(
  null,
);

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error(
      "usePreferences must be used within a <PreferencesProvider>.",
    );
  }
  return ctx;
}

/* ------------------------------------------------------------------ */
/* Provider                                                            */
/* ------------------------------------------------------------------ */

export interface PreferencesProviderProps {
  children: ReactNode;
}

export function PreferencesProvider({
  children,
}: PreferencesProviderProps) {
  const [trackingMode, setTrackingModeState] = useState<TrackingMode>(() =>
    parseTrackingMode(readStoredString(STORAGE_KEY_TRACKING)),
  );
  const [theme, setThemeState] = useState<ThemePreference>(() =>
    parseTheme(readStoredString(STORAGE_KEY_THEME)),
  );

  // Resolve "system" theme to a concrete value, and re-evaluate when the
  // user's OS preference changes.
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() =>
    getSystemTheme(),
  );

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-color-scheme: light)");
    const handler = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? "light" : "dark");
    };
    // Prefer addEventListener where available; fall back to legacy API.
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    }
    mql.addListener(handler);
    return () => mql.removeListener(handler);
  }, []);

  const resolvedTheme: ResolvedTheme = useMemo(
    () => (theme === "system" ? systemTheme : theme),
    [theme, systemTheme],
  );

  const setTrackingMode = useCallback((mode: TrackingMode) => {
    setTrackingModeState(mode);
    writeStoredString(STORAGE_KEY_TRACKING, mode);
  }, []);

  const setTheme = useCallback((next: ThemePreference) => {
    setThemeState(next);
    writeStoredString(STORAGE_KEY_THEME, next);
  }, []);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      trackingMode,
      setTrackingMode,
      theme,
      setTheme,
      resolvedTheme,
    }),
    [trackingMode, setTrackingMode, theme, setTheme, resolvedTheme],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export default PreferencesProvider;
