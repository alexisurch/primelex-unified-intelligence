import {
  Route as RouteIcon,
  MapPin,
  ShieldAlert,
  Clock,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import {
  KPICard,
  Pill,
  DataTable,
  type Column,
  type Tone,
} from "@/components/shared/Cards";
import {
  routes,
  type Route,
  type RiskLevel,
  type RouteCondition,
} from "@/lib/mock-data";
import { useProfileDrawer } from "@/lib/profile-drawer";

/* ------------------------------------------------------------------ */
/* Tone maps                                                           */
/* ------------------------------------------------------------------ */

const RISK_TONE: Record<RiskLevel, Tone> = {
  Low: "success",
  Medium: "warning",
  High: "danger",
};

const CONDITION_TONE: Record<RouteCondition, Tone> = {
  Good: "success",
  Fair: "warning",
  Poor: "danger",
};

/* ------------------------------------------------------------------ */
/* KPI computations                                                    */
/* ------------------------------------------------------------------ */

const totalRoutes = routes.length;
const avgDistance =
  totalRoutes > 0
    ? Math.round(routes.reduce((sum, r) => sum + r.distance, 0) / totalRoutes)
    : 0;
const highRiskRoutes = routes.filter((r) => r.riskLevel === "High").length;
const avgDuration =
  totalRoutes > 0
    ? (routes.reduce((sum, r) => sum + r.avgDuration, 0) / totalRoutes).toFixed(
        1,
      )
    : "0";

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

export function RouteIntelligence() {
  const { open: openProfile } = useProfileDrawer();

  const rows = routes as unknown as Record<string, unknown>[];

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "id",
      label: "ID",
      render: (row) => {
        const r = row as unknown as Route;
        return (
          <ProfileLink
            onClick={() => openProfile({ kind: "route", id: r.id })}
          >
            {r.id}
          </ProfileLink>
        );
      },
    },
    {
      key: "name",
      label: "Name",
      render: (row) => {
        const r = row as unknown as Route;
        return (
          <ProfileLink
            onClick={() => openProfile({ kind: "route", id: r.id })}
          >
            {r.name}
          </ProfileLink>
        );
      },
    },
    { key: "origin", label: "Origin" },
    { key: "destination", label: "Destination" },
    {
      key: "distance",
      label: "Distance",
      render: (row) => {
        const r = row as unknown as Route;
        return <span>{r.distance} km</span>;
      },
    },
    {
      key: "avgDuration",
      label: "Avg Duration",
      render: (row) => {
        const r = row as unknown as Route;
        return <span>{r.avgDuration} hrs</span>;
      },
    },
    {
      key: "riskLevel",
      label: "Risk Level",
      render: (row) => {
        const r = row as unknown as Route;
        return <Pill tone={RISK_TONE[r.riskLevel]}>{r.riskLevel}</Pill>;
      },
    },
    {
      key: "condition",
      label: "Condition",
      render: (row) => {
        const r = row as unknown as Route;
        return <Pill tone={CONDITION_TONE[r.condition]}>{r.condition}</Pill>;
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Header
        title="Route Intelligence"
        subtitle="Corridor performance, risk and road condition across the network."
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard
          icon={RouteIcon}
          label="Total Routes"
          value={totalRoutes}
          tone="info"
        />
        <KPICard
          icon={MapPin}
          label="Avg Distance"
          value={`${avgDistance} km`}
          tone="purple"
        />
        <KPICard
          icon={ShieldAlert}
          label="High Risk Routes"
          value={highRiskRoutes}
          tone="danger"
        />
        <KPICard
          icon={Clock}
          label="Avg Duration"
          value={`${avgDuration} hrs`}
          tone="warning"
        />
      </div>

      {/* Routes table */}
      <DataTable
        columns={columns}
        rows={rows}
        searchKeys={["id", "name", "origin", "destination", "riskLevel", "condition"]}
      />
    </div>
  );
}

export default RouteIntelligence;
