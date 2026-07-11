import {
  Building2,
  CheckCircle2,
  Wallet,
  TrendingUp,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import {
  KPICard,
  Pill,
  DataTable,
  type Column,
  type Tone,
} from "@/components/shared/Cards";
import { clients, type Client, type ClientStatus } from "@/lib/mock-data";
import { useProfileDrawer } from "@/lib/profile-drawer";

/* ------------------------------------------------------------------ */
/* Tone maps                                                           */
/* ------------------------------------------------------------------ */

const STATUS_TONE: Record<ClientStatus, Tone> = {
  Active: "success",
  Inactive: "info",
};

/* ------------------------------------------------------------------ */
/* KPI computations                                                    */
/* ------------------------------------------------------------------ */

const active = clients.filter((c) => c.status === "Active").length;

/** Parse a currency string like "₦184.5M" or "₦92.3M" into a number (₦ millions). */
function parseMillions(value: string): number {
  const match = value.match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

const totalRevenueMillions = clients.reduce(
  (sum, c) => sum + parseMillions(c.totalSpent),
  0,
);
const totalRevenue = `₦${totalRevenueMillions.toFixed(1)}M`;
const totalTrips = clients.reduce((sum, c) => sum + c.totalTrips, 0);
const avgTrips =
  clients.length > 0 ? Math.round(totalTrips / clients.length) : 0;

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

export function Clients() {
  const { open: openProfile } = useProfileDrawer();

  const rows = clients as unknown as Record<string, unknown>[];

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "id",
      label: "ID",
      render: (row) => {
        const c = row as unknown as Client;
        return (
          <ProfileLink
            onClick={() => openProfile({ kind: "client", id: c.id })}
          >
            {c.id}
          </ProfileLink>
        );
      },
    },
    {
      key: "name",
      label: "Name",
      render: (row) => {
        const c = row as unknown as Client;
        return (
          <ProfileLink
            onClick={() => openProfile({ kind: "client", id: c.id })}
          >
            {c.name}
          </ProfileLink>
        );
      },
    },
    { key: "industry", label: "Industry" },
    { key: "contactPerson", label: "Contact Person" },
    {
      key: "totalTrips",
      label: "Total Trips",
      render: (row) => {
        const c = row as unknown as Client;
        return <span>{c.totalTrips}</span>;
      },
    },
    {
      key: "totalSpent",
      label: "Total Spent",
      render: (row) => {
        const c = row as unknown as Client;
        return (
          <span className="font-medium text-foreground">{c.totalSpent}</span>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const c = row as unknown as Client;
        return <Pill tone={STATUS_TONE[c.status]}>{c.status}</Pill>;
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Header
        title="Clients"
        subtitle="Customer accounts, revenue and trip volume across the portfolio."
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard
          icon={Building2}
          label="Total Clients"
          value={clients.length}
          tone="info"
        />
        <KPICard
          icon={CheckCircle2}
          label="Active"
          value={active}
          tone="success"
        />
        <KPICard
          icon={Wallet}
          label="Total Revenue"
          value={totalRevenue}
          tone="purple"
          delta={{ value: "9.2%", direction: "up" }}
        />
        <KPICard
          icon={TrendingUp}
          label="Avg Trips per Client"
          value={avgTrips}
          tone="info"
        />
      </div>

      {/* Clients table */}
      <DataTable
        columns={columns}
        rows={rows}
        searchKeys={["id", "name", "industry", "contactPerson", "status"]}
      />
    </div>
  );
}

export default Clients;
