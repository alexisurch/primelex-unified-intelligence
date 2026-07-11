import {
  Wrench,
  AlertOctagon,
  CalendarClock,
  CheckCircle2,
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
  maintenanceRecords,
  trucks,
  type MaintenanceRecord,
  type MaintenanceStatus,
  type MaintenancePriority,
} from "@/lib/mock-data";
import { useProfileDrawer } from "@/lib/profile-drawer";

/* ------------------------------------------------------------------ */
/* Tone maps                                                           */
/* ------------------------------------------------------------------ */

const STATUS_TONE: Record<MaintenanceStatus, Tone> = {
  Completed: "success",
  Scheduled: "info",
  Overdue: "danger",
};

const PRIORITY_TONE: Record<MaintenancePriority, Tone> = {
  High: "danger",
  Medium: "warning",
  Low: "success",
};

/* ------------------------------------------------------------------ */
/* Lookups                                                             */
/* ------------------------------------------------------------------ */

/** Truck id → plate. */
const TRUCK_PLATE = new Map(trucks.map((t) => [t.id, t.plate]));

/* ------------------------------------------------------------------ */
/* KPI computations                                                    */
/* ------------------------------------------------------------------ */

const overdue = maintenanceRecords.filter((r) => r.status === "Overdue").length;
const scheduled = maintenanceRecords.filter(
  (r) => r.status === "Scheduled",
).length;
const completed = maintenanceRecords.filter(
  (r) => r.status === "Completed",
).length;

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

export function Maintenance() {
  const { open: openProfile } = useProfileDrawer();

  const rows = maintenanceRecords as unknown as Record<string, unknown>[];

  const columns: Column<Record<string, unknown>>[] = [
    { key: "id", label: "ID" },
    {
      key: "truck",
      label: "Truck",
      render: (row) => {
        const r = row as unknown as MaintenanceRecord;
        const plate = TRUCK_PLATE.get(r.truck) ?? r.truck;
        return (
          <ProfileLink
            onClick={() => openProfile({ kind: "truck", id: r.truck })}
          >
            {plate}
          </ProfileLink>
        );
      },
    },
    { key: "service", label: "Service" },
    { key: "date", label: "Date" },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const r = row as unknown as MaintenanceRecord;
        return <Pill tone={STATUS_TONE[r.status]}>{r.status}</Pill>;
      },
    },
    { key: "cost", label: "Cost" },
    {
      key: "priority",
      label: "Priority",
      render: (row) => {
        const r = row as unknown as MaintenanceRecord;
        return <Pill tone={PRIORITY_TONE[r.priority]}>{r.priority}</Pill>;
      },
    },
    { key: "performedBy", label: "Performed By" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Header
        title="Maintenance"
        subtitle="Service records, schedules and workshop activity across the fleet."
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard
          icon={Wrench}
          label="Total Records"
          value={maintenanceRecords.length}
          tone="info"
        />
        <KPICard
          icon={AlertOctagon}
          label="Overdue"
          value={overdue}
          tone="danger"
        />
        <KPICard
          icon={CalendarClock}
          label="Scheduled"
          value={scheduled}
          tone="warning"
        />
        <KPICard
          icon={CheckCircle2}
          label="Completed"
          value={completed}
          tone="success"
        />
      </div>

      {/* Maintenance records table */}
      <DataTable
        columns={columns}
        rows={rows}
        searchKeys={["id", "truck", "service", "status", "performedBy"]}
      />
    </div>
  );
}

export default Maintenance;
