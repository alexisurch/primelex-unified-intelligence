import { useState } from "react";
import {
  Users,
  UserCheck,
  UserCog,
  History,
  Copy,
  Check,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import {
  KPICard,
  GlassCard,
  SectionCard,
  Pill,
  DataTable,
  type Column,
  type Tone,
} from "@/components/shared/Cards";
import { useFleetManagers } from "@/lib/fleet-managers-store";
import type { FleetManager, FleetManagerStatus } from "@/lib/fleet-managers-store";
import { useBranding } from "@/lib/branding";
import { useProfileDrawer } from "@/lib/profile-drawer";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type UserRole = "Administrator" | "Fleet Manager" | "Operations" | "Auditor";
type UserStatus = "Active" | "Off-Duty" | "On Leave" | "Suspended";

interface DirectoryUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: UserStatus;
  /** When set, the row opens a fleet-manager profile drawer. */
  fleetManagerId?: string;
}

/* ------------------------------------------------------------------ */
/* Tone maps                                                           */
/* ------------------------------------------------------------------ */

const DEPARTMENT_TONE: Record<string, Tone> = {
  "Northern Region": "info",
  "Southern Region": "purple",
  "Central Region": "warning",
  "Headquarters": "info",
  "Operations": "purple",
  "Compliance": "warning",
};

const STATUS_TONE: Record<UserStatus, Tone> = {
  Active: "success",
  "Off-Duty": "info",
  "On Leave": "warning",
  Suspended: "danger",
};

const FM_STATUS_TO_USER: Record<FleetManagerStatus, UserStatus> = {
  active: "Active",
  "off-duty": "Off-Duty",
  "on-leave": "On Leave",
};

/* ------------------------------------------------------------------ */
/* Static admin / ops users (alongside fleet managers from the store) */
/* ------------------------------------------------------------------ */

const BASE_USERS: DirectoryUser[] = [
  {
    id: "USR-0001",
    name: "Alex Morgan",
    email: "admin@primelex.com",
    role: "Administrator",
    department: "Headquarters",
    status: "Active",
  },
  {
    id: "USR-0002",
    name: "Funmi Adeyemi",
    email: "funmi.adeyemi@primelex.com",
    role: "Operations",
    department: "Operations",
    status: "Active",
  },
  {
    id: "USR-0003",
    name: "Tunde Bakare",
    email: "tunde.bakare@primelex.com",
    role: "Auditor",
    department: "Compliance",
    status: "Active",
  },
  {
    id: "USR-0004",
    name: "Chioma Ezeudo",
    email: "chioma.ezeudo@primelex.com",
    role: "Operations",
    department: "Operations",
    status: "On Leave",
  },
];

/* ------------------------------------------------------------------ */
/* Link button (opens a profile drawer)                                */
/* ------------------------------------------------------------------ */

function ProfileLink({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function UsersAccess() {
  const { managers } = useFleetManagers();
  const { branding } = useBranding();
  const { open: openProfile } = useProfileDrawer();
  const [copied, setCopied] = useState(false);

  // Merge fleet managers from the store into the directory. We skip the
  // admin entry in BASE_USERS that duplicates "Alex Morgan" to avoid a
  // double-listed administrator (the admin is not a fleet manager record).
  const fleetManagerRows: DirectoryUser[] = managers.map(
    (m: FleetManager) => ({
      id: `USR-FM-${m.id}`,
      name: m.name,
      email: m.email,
      role: "Fleet Manager" as UserRole,
      department: m.department,
      status: FM_STATUS_TO_USER[m.status],
      fleetManagerId: m.id,
    }),
  );

  const users: DirectoryUser[] = [...BASE_USERS, ...fleetManagerRows];

  // KPI values
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "Active").length;
  const fleetManagerCount = fleetManagerRows.length;
  const auditEvents = 1284;

  // Workspace URL
  const workspaceUrl = `https://${branding.workspaceSlug || "workspace"}.primelex.app`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(workspaceUrl);
      setCopied(true);
      toast.success("Workspace URL copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy workspace URL");
    }
  }

  const rows = users as unknown as Record<string, unknown>[];

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "id",
      label: "User ID",
      render: (row) => {
        const u = row as unknown as DirectoryUser;
        if (u.fleetManagerId) {
          return (
            <ProfileLink
              onClick={() =>
                openProfile({ kind: "fleet-manager", id: u.fleetManagerId ?? "" })
              }
            >
              {u.id}
            </ProfileLink>
          );
        }
        return <span>{u.id}</span>;
      },
    },
    {
      key: "name",
      label: "Name",
      render: (row) => {
        const u = row as unknown as DirectoryUser;
        if (u.fleetManagerId) {
          return (
            <ProfileLink
              onClick={() =>
                openProfile({ kind: "fleet-manager", id: u.fleetManagerId ?? "" })
              }
            >
              {u.name}
            </ProfileLink>
          );
        }
        return <span className="font-medium text-foreground">{u.name}</span>;
      },
    },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    {
      key: "department",
      label: "Department",
      render: (row) => {
        const u = row as unknown as DirectoryUser;
        return (
          <Pill tone={DEPARTMENT_TONE[u.department] ?? "neutral"}>
            {u.department}
          </Pill>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const u = row as unknown as DirectoryUser;
        return <Pill tone={STATUS_TONE[u.status]}>{u.status}</Pill>;
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Header
        title="Users & Access"
        subtitle="Workspace members, roles and fleet manager assignments."
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard
          icon={Users}
          label="Total Users"
          value={totalUsers}
          tone="info"
        />
        <KPICard
          icon={UserCheck}
          label="Active"
          value={activeUsers}
          tone="success"
        />
        <KPICard
          icon={UserCog}
          label="Fleet Managers"
          value={fleetManagerCount}
          tone="purple"
        />
        <KPICard
          icon={History}
          label="Audit Events"
          value={auditEvents.toLocaleString()}
          tone="warning"
          footnote="Last 30 days"
        />
      </div>

      {/* Workspace section */}
      <SectionCard
        title="Workspace"
        action={
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Globe className="h-3.5 w-3.5" strokeWidth={2} />
            {branding.companyName}
          </span>
        }
      >
        <GlassCard hover={false} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Workspace URL
            </span>
            <span className="font-mono text-sm text-foreground">
              {workspaceUrl}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-border/60 bg-white/[0.02] px-3 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-white/[0.04] hover:text-primary"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-success" strokeWidth={2.5} />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" strokeWidth={2} />
                Copy URL
              </>
            )}
          </button>
        </GlassCard>
      </SectionCard>

      {/* User directory */}
      <DataTable
        columns={columns}
        rows={rows}
        searchKeys={["id", "name", "email", "role", "department", "status"]}
      />
    </div>
  );
}

export default UsersAccess;
