export interface OrganisationRecord {
  slug: string;
  companyName: string;
  companyShort: string;
  industry: string;
  logoDataUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  adminName: string;
  adminEmail: string;
  createdAt: string;
}

const STORAGE_KEY = "primelex.organisations";

function readAll(): Record<string, OrganisationRecord> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAll(orgs: Record<string, OrganisationRecord>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orgs));
  } catch {
    /* noop */
  }
}

export function getOrganisationBySlug(slug: string): OrganisationRecord | null {
  return readAll()[slug.toLowerCase()] ?? null;
}

export function getOrganisationByAdminEmail(email: string): OrganisationRecord | null {
  const orgs = readAll();
  return (
    Object.values(orgs).find(
      (o) => o.adminEmail.toLowerCase() === email.toLowerCase(),
    ) ?? null
  );
}

export function saveOrganisation(org: OrganisationRecord): void {
  const orgs = readAll();
  orgs[org.slug.toLowerCase()] = org;
  writeAll(orgs);
}

export function ensureSeedOrganisation(): void {
  const orgs = readAll();
  if (!orgs["primelex-logistics"]) {
    orgs["primelex-logistics"] = {
      slug: "primelex-logistics",
      companyName: "PrimeLex Logistics",
      companyShort: "PRIMELEX",
      industry: "Logistics & Transportation",
      logoDataUrl: null,
      primaryColor: "#3b82f6",
      secondaryColor: "#8b5cf6",
      adminName: "Adeleke Oladipo",
      adminEmail: "adeleke@primelex.com",
      createdAt: new Date().toISOString(),
    };
    writeAll(orgs);
  }
}
