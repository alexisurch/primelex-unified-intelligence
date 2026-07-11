import { ShieldAlert, CircleAlert as AlertCircle, Search, CircleCheck as CheckCircle2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import {
  KPICard,
  Pill,
  DataTable,
  type Column,
  type Tone,
} from "@/components/shared/Cards";
import {
  incidents,
  trucks,
  drivers,
  routes,
  type Incident,
  type IncidentStatus,
  type IncidentSeverity,
} from "@/lib/mock-data";
import { useProfileDrawer } from "@/lib/profile-drawer";

/* ------------------------------------------------------------------ */
/* Tone maps                                                           */
/* ------------------------------------------------------------------ */

const STATUS_TONE: Record<IncidentStatus, Tone> = {
  Open: "danger",
  Investigating: "warning",
  Resolved: "success",
};

const SEVERITY_TONE: Record<IncidentSeverity, Tone> = {
  Critical: "danger",
  High: "danger",
  Medium: "warning",
  Low: "success",
};

/* ------------------------------------------------------------------ */
/* Lookups                                                             */
/* ------------------------------------------------------------------ */

/** Truck id → plate. */
const TRUCK_PLATE = new Map(trucks.map((t) => [t.id, t.plate]));

/** Driver id → name. */
const DRIVER_NAME = new Map(drivers.map((d) => [d.id, d.name]));

/** Route id → name. */
const ROUTE_NAME = new Map(routes.map((r) => [r.id, r.name]));

/* ------------------------------------------------------------------ */
/* KPI computations                                                    */
/* ------------------------------------------------------------------ */

const openIncidents = incidents.filter((i) => i.status === "Open").length;
const investigating = incidents.filter(
  (i) => i.status === "Investigating",
).length;
const resolved = incidents.filter((i) => i.status === "Resolved").length;

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

export function Incidents() {
  const { open: openProfile } = useProfileDrawer();

  const rows = incidents as unknown as Record<string, unknown>[];

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "id",
      label: "ID",
      render: (row) => {
        const i = row as unknown as Incident;
        return (
          <ProfileLink
            onClick={() => openProfile({ kind: "incident", id: i.id })}
          >
            {i.id}
          </ProfileLink>
        );
      },
    },
    { key: "type", label: "Type" },
    {
      key: "severity",
      label: "Severity",
      render: (row) => {
        const i = row as unknown as Incident;
        return <Pill tone={SEVERITY_TONE[i.severity]}>{i.severity}</Pill>;
      },
    },
    {
      key: "truckId",
      label: "Truck",
      render: (row) => {
        const i = row as unknown as Incident;
        const plate = TRUCK_PLATE.get(i.truckId) ?? i.truckId;
        return (
          <ProfileLink
            onClick={() => openProfile({ kind: "truck", id: i.truckId })}
          >
            {plate}
          </ProfileLink>
        );
      },
    },
    {
      key: "driverId",
      label: "Driver",
      render: (row) => {
        const i = row as unknown as Incident;
        const name = DRIVER_NAME.get(i.driverId) ?? i.driverId;
        return (
          <ProfileLink
            onClick={() => openProfile({ kind: "driver", id: i.driverId })}
          >
            {name}
          </ProfileLink>
        );
      },
    },
    {
      key: "routeId",
      label: "Route",
      render: (row) => {
        const i = row as unknown as Incident;
        const name = ROUTE_NAME.get(i.routeId) ?? i.routeId;
        return (
          <ProfileLink
            onClick={() => openProfile({ kind: "route", id: i.routeId })}
          >
            {name}
          </ProfileLink>
        );
      },
    },
    { key: "date", label: "Date" },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const i = row as unknown as Incident;
        return <Pill tone={STATUS_TONE[i.status]}>{i.status}</Pill>;
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Header
        title="Incidents"
        subtitle="Accidents, theft, damage and violations across the fleet."
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard
          icon={ShieldAlert}
          label="Total Incidents"
          value={incidents.length}
          tone="info"
        />
        <KPICard
          icon={AlertCircle}
          label="Open"
          value={openIncidents}
          tone="danger"
        />
        <KPICard
          icon={Search}
          label="Investigating"
          value={investigating}
          tone="warning"
        />
        <KPICard
          icon={CheckCircle2}
          label="Resolved"
          value={resolved}
          tone="success"
        />
      </div>

      {/* Incidents table */}
      <DataTable
        columns={columns}
        rows={rows}
        searchKeys={["id", "type", "severity", "truckId", "driverId", "routeId", "status"]}
      />
    </div>
  );
}

export default Incidents;
