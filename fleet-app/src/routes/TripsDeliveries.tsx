import {
  Package,
  Navigation,
  CheckCircle2,
  Clock,
  Route as RouteIcon,
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
  trips,
  trucks,
  drivers,
  routes,
  type Trip,
  type TripStatus,
} from "@/lib/mock-data";
import { useProfileDrawer } from "@/lib/profile-drawer";

/* ------------------------------------------------------------------ */
/* Tone maps                                                           */
/* ------------------------------------------------------------------ */

const STATUS_TONE: Record<TripStatus, Tone> = {
  Delivered: "success",
  "In Transit": "info",
  Delayed: "danger",
  Scheduled: "warning",
};

/* ------------------------------------------------------------------ */
/* Lookups                                                             */
/* ------------------------------------------------------------------ */

/** Truck id → plate. */
const TRUCK_PLATE = new Map(trucks.map((t) => [t.id, t.plate]));

/** Driver name → id. */
const DRIVER_ID_BY_NAME = new Map(drivers.map((d) => [d.name, d.id]));

/** Route id → name. */
const ROUTE_NAME = new Map(routes.map((r) => [r.id, r.name]));

/* ------------------------------------------------------------------ */
/* KPI computations                                                    */
/* ------------------------------------------------------------------ */

const inTransit = trips.filter((t) => t.status === "In Transit").length;
const delivered = trips.filter((t) => t.status === "Delivered").length;
const delayed = trips.filter((t) => t.status === "Delayed").length;

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

export function TripsDeliveries() {
  const { open: openProfile } = useProfileDrawer();

  const rows = trips as unknown as Record<string, unknown>[];

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "id",
      label: "Trip ID",
      render: (row) => {
        const t = row as unknown as Trip;
        return (
          <ProfileLink
            onClick={() => openProfile({ kind: "trip", id: t.id })}
          >
            {t.id}
          </ProfileLink>
        );
      },
    },
    { key: "origin", label: "Origin" },
    { key: "destination", label: "Destination" },
    {
      key: "truck",
      label: "Truck",
      render: (row) => {
        const t = row as unknown as Trip;
        const plate = TRUCK_PLATE.get(t.truck) ?? t.truck;
        return (
          <ProfileLink
            onClick={() => openProfile({ kind: "truck", id: t.truck })}
          >
            {plate}
          </ProfileLink>
        );
      },
    },
    {
      key: "driver",
      label: "Driver",
      render: (row) => {
        const t = row as unknown as Trip;
        const driverId = DRIVER_ID_BY_NAME.get(t.driver);
        return (
          <ProfileLink
            onClick={() => {
              if (driverId) openProfile({ kind: "driver", id: driverId });
            }}
          >
            {t.driver}
          </ProfileLink>
        );
      },
    },
    {
      key: "distance",
      label: "Distance",
      render: (row) => {
        const t = row as unknown as Trip;
        return <span>{t.distance} km</span>;
      },
    },
    {
      key: "routeId",
      label: "Route",
      render: (row) => {
        const t = row as unknown as Trip;
        const name = ROUTE_NAME.get(t.routeId) ?? t.routeId;
        return (
          <button
            type="button"
            onClick={() => openProfile({ kind: "route", id: t.routeId })}
            className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-white/[0.02] px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-white/[0.04] hover:text-primary"
          >
            <RouteIcon className="h-3.5 w-3.5" strokeWidth={2} />
            {name}
          </button>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const t = row as unknown as Trip;
        return <Pill tone={STATUS_TONE[t.status]}>{t.status}</Pill>;
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Header
        title="Trips & Deliveries"
        subtitle="Track every trip from origin to destination across the network."
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard
          icon={Package}
          label="Total Trips"
          value={trips.length}
          tone="info"
          delta={{ value: 8, direction: "up" }}
        />
        <KPICard
          icon={Navigation}
          label="In Transit"
          value={inTransit}
          tone="info"
        />
        <KPICard
          icon={CheckCircle2}
          label="Delivered"
          value={delivered}
          tone="success"
          delta={{ value: "12%", direction: "up" }}
        />
        <KPICard
          icon={Clock}
          label="Delayed"
          value={delayed}
          tone="danger"
          delta={{ value: 2, direction: "down" }}
        />
      </div>

      {/* Trips table */}
      <DataTable
        columns={columns}
        rows={rows}
        searchKeys={["id", "origin", "destination", "truck", "driver", "status"]}
      />
    </div>
  );
}

export default TripsDeliveries;
