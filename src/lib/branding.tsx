import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface BrandingState {
  companyName: string;
  companyShort: string;
  industry: string;
  businessEmail: string;
  phone: string;
  logoDataUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  workspaceSlug: string;
  adminName: string;
  adminEmail: string;
}

const DEFAULTS: BrandingState = {
  companyName: "MUVD LOGISTICS",
  companyShort: "MUVD LOGISTICS",
  industry: "Logistics & Transportation",
  businessEmail: "ops@muvdlogistics.com",
  phone: "+234 800 000 0000",
  logoDataUrl: "/MOVE_LOGO.jpeg",
  primaryColor: "#3b82f6",
  secondaryColor: "#8b5cf6",
  workspaceSlug: "muvd-logistics",
  adminName: "Adeleke Oladipo",
  adminEmail: "adeleke@muvdlogistics.com",
};

interface Ctx extends BrandingState {
  update: (patch: Partial<BrandingState>) => void;
  reset: () => void;
}

const BrandingContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "muvd.branding";

export function BrandingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BrandingState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch { /* noop */ }
  }, []);

  // Apply CSS variable for primary color
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.style.setProperty("--primary", state.primaryColor);
    document.documentElement.style.setProperty("--brand-primary", state.primaryColor);
    document.documentElement.style.setProperty("--brand-secondary", state.secondaryColor);
  }, [state.primaryColor, state.secondaryColor]);

  const update = useCallback((patch: Partial<BrandingState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* noop */ }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setState(DEFAULTS);
    try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
  }, []);

  const value = useMemo<Ctx>(() => ({ ...state, update, reset }), [state, update, reset]);
  return <BrandingContext.Provider value={value}>{children}</BrandingContext.Provider>;
}

export function useBranding() {
  const ctx = useContext(BrandingContext);
  if (!ctx) throw new Error("useBranding must be used inside BrandingProvider");
  return ctx;
}

export function getAppOrigin() {
  if (typeof window === "undefined") return "";
  return window.location.origin;
}
