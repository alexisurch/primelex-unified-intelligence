import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface Branding {
  companyName: string;
  companyShort: string;
  industry: string;
  businessEmail: string;
  phone: string;
  primaryColor: string;
  secondaryColor: string;
  workspaceSlug: string;
  adminName: string;
  adminEmail: string;
  logoDataUrl: string | null;
}

type BrandingUpdate = Partial<Branding>;

interface BrandingContextValue {
  branding: Branding;
  update: (patch: BrandingUpdate) => void;
  reset: () => void;
}

/* ------------------------------------------------------------------ */
/* Defaults                                                            */
/* ------------------------------------------------------------------ */

export const DEFAULT_BRANDING: Branding = {
  companyName: "PrimeLex Logistics",
  companyShort: "PRIMELEX",
  industry: "Logistics & Transportation",
  businessEmail: "operations@primelex.com",
  phone: "+1 (555) 018-2200",
  primaryColor: "#4f46e5",
  secondaryColor: "#0ea5e9",
  workspaceSlug: "primelex",
  adminName: "Alex Morgan",
  adminEmail: "admin@primelex.com",
  logoDataUrl: null,
};

const STORAGE_KEY = "fleet.branding";

/* ------------------------------------------------------------------ */
/* Storage helpers (guard against SSR / unavailable localStorage)     */
/* ------------------------------------------------------------------ */

function readStoredBranding(): Branding | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Branding>;
    // Merge over defaults so missing keys (from older saves) are filled in.
    return { ...DEFAULT_BRANDING, ...parsed };
  } catch {
    return null;
  }
}

function writeStoredBranding(value: Branding): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}

function clearStoredBranding(): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */

const BrandingContext = createContext<BrandingContextValue | null>(null);

export function useBranding(): BrandingContextValue {
  const ctx = useContext(BrandingContext);
  if (!ctx) {
    throw new Error("useBranding must be used within a <BrandingProvider>.");
  }
  return ctx;
}

/* ------------------------------------------------------------------ */
/* Provider                                                            */
/* ------------------------------------------------------------------ */

export interface BrandingProviderProps {
  children: ReactNode;
  /** Optional initial branding override (e.g. from server-side hydration). */
  initialBranding?: Partial<Branding>;
}

export function BrandingProvider({
  children,
  initialBranding,
}: BrandingProviderProps) {
  const [branding, setBranding] = useState<Branding>(() => {
    const stored = readStoredBranding();
    if (stored) return stored;
    return { ...DEFAULT_BRANDING, ...initialBranding };
  });

  const update = useCallback((patch: BrandingUpdate) => {
    setBranding((prev) => {
      const next = { ...prev, ...patch };
      writeStoredBranding(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    clearStoredBranding();
    setBranding(DEFAULT_BRANDING);
  }, []);

  const value = useMemo<BrandingContextValue>(
    () => ({ branding, update, reset }),
    [branding, update, reset],
  );

  return (
    <BrandingContext.Provider value={value}>
      {children}
    </BrandingContext.Provider>
  );
}

export default BrandingProvider;
