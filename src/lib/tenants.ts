/**
 * Frontend-only tenant registry for multi-organisation workspaces.
 * Each tenant represents one organisation (e.g. PrimeLex Logistics).
 * Data persists in localStorage; swap with backend calls when ready.
 */

export interface Tenant {
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

const DEFAULT_TENANTS: Tenant[] = [
  {
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
  },
];

export const DEFAULT_TENANT_SLUG = "primelex-logistics";

const STORAGE_KEY = "primelex.tenants";

function load(): Tenant[] {
  if (typeof window === "undefined") return DEFAULT_TENANTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Tenant[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* noop */ }
  save(DEFAULT_TENANTS);
  return DEFAULT_TENANTS;
}

function save(tenants: Tenant[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tenants));
  } catch { /* noop */ }
}

let _tenants: Tenant[] = typeof window !== "undefined" ? load() : DEFAULT_TENANTS;

export function listTenants(): Tenant[] {
  return [..._tenants];
}

export function getTenant(slug: string): Tenant | undefined {
  return _tenants.find((t) => t.slug === slug);
}

export function createTenant(data: Omit<Tenant, "region"> & { region?: string }): Tenant {
  const tenant: Tenant = {
    ...data,
    region: data.region ?? "West Africa (Lagos)",
  };
  _tenants = [..._tenants, tenant];
  save(_tenants);
  return tenant;
}

export function updateTenant(slug: string, patch: Partial<Tenant>): Tenant | undefined {
  _tenants = _tenants.map((t) => (t.slug === slug ? { ...t, ...patch } : t));
  save(_tenants);
  return _tenants.find((t) => t.slug === slug);
}

export function tenantExists(slug: string): boolean {
  return _tenants.some((t) => t.slug === slug);
}
