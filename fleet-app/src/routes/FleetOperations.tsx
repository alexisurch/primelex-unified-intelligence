import {
  Truck,
  CircleDot,
  Wrench,
  ParkingCircle,
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
  trucks,
  drivers,
  type Truck as TruckType,
  type TruckStatus,
} from "@/lib/mock-data";
import { useProfileDrawer } from "@/lib/profile-drawer";

/* ------------------------------------------------------------------ */
/* Tone maps                                                           */
/* ------------------------------------------------------------------ */

const STATUS_TONE: Record<TruckStatus, Tone> = {
  "On The Road": "success",
  Idle: "warning",
  Maintenance: "danger",
  Offline: "info",
};

const BAR_TONE: Record<Tone, string> = {
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  purple: "bg-purple",
};

/* ------------------------------------------------------------------ */
/* KPI computations                                                    */
/* ------------------------------------------------------------------ */

const onTheRoad = trucks.filter((t) => t.status === "On The Road").length;
const inMaintenance = trucks.filter((t) => t.status === "Maintenance").length;
const idle = trucks.filter((t) => t.status === "Idle").length;

/** Name → driver id lookup map. */
const DRIVER_ID_BY_NAME = new Map(drivers.map((d) => [d.name, d.id]));

/* ------------------------------------------------------------------ */
/* Fuel / engine health meter                                          */
/* ------------------------------------------------------------------ */

function fuelTone(fuel: number): Tone {
  if (fuel >= 60) return "success";
  if (fuel >= 30) return "warning";
  return "danger";
}

function engineTone(health: number): Tone {
  if (health >= 85) return "success";
  if (health >= 65) return "warning";
  return "danger";
}

function Meter({ value, tone }: { value: number; tone: Tone }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${BAR_TONE[tone]}`}
          style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground">{value}%</span>
    </div>
  );
}

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

export function FleetOperations() {
  const { open: openProfile } = useProfileDrawer();

  const rows = trucks as unknown as Record<string, unknown>[];

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "plate",
      label: "Plate",
      render: (row) => {
        const t = row as unknown as TruckType;
        return (
          <ProfileLink
            onClick={() => openProfile({ kind: "truck", id: t.id })}
          >
            {t.plate}
          </ProfileLink>
        );
      },
    },
    { key: "model", label: "Model" },
    {
      key: "driver",
      label: "Driver",
      render: (row) => {
        const t = row as unknown as TruckType;
        if (t.driver === "Unassigned") {
          return <span className="text-muted-foreground">Unassigned</span>;
        }
        return (
          <ProfileLink
            onClick={() => {
              const driverId = DRIVER_ID_BY_NAME.get(t.driver);
              if (driverId) openProfile({ kind: "driver", id: driverId });
            }}
          >
            {t.driver}
          </ProfileLink>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const t = row as unknown as TruckType;
        return <Pill tone={STATUS_TONE[t.status]}>{t.status}</Pill>;
      },
    },
    {
      key: "fuel",
      label: "Fuel %",
      render: (row) => {
        const t = row as unknown as TruckType;
        return <Meter value={t.fuel} tone={fuelTone(t.fuel)} />;
      },
    },
    {
      key: "engineHealth",
      label: "Engine Health",
      render: (row) => {
        const t = row as unknown as TruckType;
        return (
          <Meter value={t.engineHealth} tone={engineTone(t.engineHealth)} />
        );
      },
    },
    { key: "location", label: "Location" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Header
        title="Fleet Operations"
        subtitle="Real-time status of every truck across the fleet."
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard
          icon={Truck}
          label="Total Trucks"
          value={trucks.length}
          tone="info"
          delta={{ value: 4, direction: "up" }}
        />
        <KPICard
          icon={CircleDot}
          label="On The Road"
          value={onTheRoad}
          tone="success"
          footnote={`${Math.round((onTheRoad / trucks.length) * 100)}% of fleet`}
        />
        <KPICard
          icon={Wrench}
          label="In Maintenance"
          value={inMaintenance}
          tone="danger"
        />
        <KPICard
          icon={ParkingCircle}
          label="Idle"
          value={idle}
          tone="warning"
        />
      </div>

      {/* Trucks table */}
      <DataTable
        columns={columns}
        rows={rows}
        searchKeys={["plate", "model", "driver", "location", "status"]}
      />
    </div>
  );
}

export default FleetOperations;
