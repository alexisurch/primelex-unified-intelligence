import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getTenant, type Tenant } from "@/lib/tenants";

export interface BrandingState {
  slug: string;
  companyName: string;
  companyShort: string;
  industry: string;
  businessEmail: string;
  phone: string;
  logoDataUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  adminName: string;
  adminEmail: string;
  region: string;
}

interface Ctx extends BrandingState {
  setTenant: (slug: string) => void;
  update: (patch: Partial<BrandingState>) => void;
}

const DEFAULTS: BrandingState = {
  slug: "primelex-logistics",
  companyName: "PrimeLex Logistics",
  companyShort: "PRIMELEX",
  industry: "Logistics & Transportation",
  businessEmail: "ops@primelex.com",
  phone: "+234 800 000 0000",
  logoDataUrl: null,
  primaryColor: "#3b82f6",
  secondaryColor: "#8b5cf6",
  adminName: "Adeleke Oladipo",
  adminEmail: "adeleke@primelex.com",
  region: "West Africa (Lagos)",
};

const BrandingContext = createContext<Ctx | null>(null);

function tenantToBranding(t: Tenant): BrandingState {
  return {
    slug: t.slug,
    companyName: t.companyName,
    companyShort: t.companyShort,
    industry: t.industry,
    businessEmail: t.businessEmail,
    phone: t.phone,
    logoDataUrl: t.logoDataUrl,
    primaryColor: t.primaryColor,
    secondaryColor: t.secondaryColor,
    adminName: t.adminName,
    adminEmail: t.adminEmail,
    region: t.region,
  };
}

export function BrandingProvider({ slug, children }: { slug: string; children: ReactNode }) {
  const [state, setState] = useState<BrandingState>(() => {
    const t = getTenant(slug);
    return t ? tenantToBranding(t) : DEFAULTS;
  });

  const setTenant = useCallback((newSlug: string) => {
    const t = getTenant(newSlug);
    if (t) setState(tenantToBranding(t));
  }, []);

  const update = useCallback((patch: Partial<BrandingState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.style.setProperty("--primary", state.primaryColor);
    document.documentElement.style.setProperty("--brand-primary", state.primaryColor);
    document.documentElement.style.setProperty("--brand-secondary", state.secondaryColor);
  }, [state.primaryColor, state.secondaryColor]);

  const value = useMemo<Ctx>(() => ({ ...state, setTenant, update }), [state, setTenant, update]);
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
