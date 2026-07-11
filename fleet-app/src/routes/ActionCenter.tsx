import { useMemo, useState, type ComponentType, type ReactNode } from "react";
import {
  AlertTriangle,
  Wrench,
  IdCard,
  Clock,
  Flame,
  ListChecks,
  Filter,
  ExternalLink,
  type LucideProps,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProfileDrawer } from "@/lib/profile-drawer";
import {
  incidents,
  maintenanceRecords,
  documents,
  trips,
  trucks,
  drivers,
  type Incident,
  type MaintenanceRecord,
  type DocumentRecord,
} from "@/lib/mock-data";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type Priority = "High" | "Medium" | "Low";
type ActionStatus = "Open" | "Overdue" | "Scheduled" | "Expiring" | "Expired" | "Delayed" | "Investigating";
type ActionCategory = "Incident" | "Maintenance" | "Document" | "Trip";

interface ActionItem {
  id: string;
  category: ActionCategory;
  title: string;
  priority: Priority;
  status: ActionStatus;
  due: string;
  assignedTo: string;
  /** Profile drawer target, if any. */
  target?: { kind: "truck" | "driver" | "incident" | "trip"; id: string };
}

/* ------------------------------------------------------------------ */
/* Tone maps (literal classes for Tailwind v4)                         */
/* ------------------------------------------------------------------ */

const priorityTone: Record<Priority, Tone> = {
  High: "danger",
  Medium: "warning",
  Low: "success",
};

const statusTone: Record<ActionStatus, Tone> = {
  Open: "danger",
  Overdue: "danger",
  Expired: "danger",
  Investigating: "warning",
  Scheduled: "info",
  Expiring: "warning",
  Delayed: "warning",
};

const categoryIcon: Record<ActionCategory, ComponentType<LucideProps>> = {
  Incident: AlertTriangle,
  Maintenance: Wrench,
  Document: IdCard,
  Trip: Clock,
};

/* ------------------------------------------------------------------ */
/* Builders — derive actions from mock data                            */
/* ------------------------------------------------------------------ */

function incidentPriority(severity: Incident["severity"]): Priority {
  if (severity === "Critical" || severity === "High") return "High";
  if (severity === "Medium") return "Medium";
  return "Low";
}

function incidentStatus(status: Incident["status"]): ActionStatus {
  if (status === "Open") return "Open";
  if (status === "Investigating") return "Investigating";
  return "Open";
}

function maintenancePriority(priority: MaintenanceRecord["priority"]): Priority {
  return priority;
}

function maintenanceStatus(status: MaintenanceRecord["status"]): ActionStatus {
  if (status === "Overdue") return "Overdue";
  if (status === "Scheduled") return "Scheduled";
  return "Scheduled";
}

function documentPriority(status: DocumentRecord["status"]): Priority {
  if (status === "Expired") return "High";
  if (status === "Expiring Soon") return "Medium";
  return "Low";
}

function documentStatus(status: DocumentRecord["status"]): ActionStatus {
  if (status === "Expired") return "Expired";
  if (status === "Expiring Soon") return "Expiring";
  return "Expiring";
}

function buildActions(): ActionItem[] {
  const actions: ActionItem[] = [];

  // Open / investigating incidents
  for (const inc of incidents) {
    if (inc.status === "Resolved") continue;
    const truck = trucks.find((t) => t.id === inc.truckId);
    const driver = drivers.find((d) => d.id === inc.driverId);
    actions.push({
      id: inc.id,
      category: "Incident",
      title: `${inc.type} — ${inc.id}`,
      priority: incidentPriority(inc.severity),
      status: incidentStatus(inc.status),
      due: inc.date,
      assignedTo: driver?.name ?? inc.investigator,
      target: { kind: "incident", id: inc.id },
    });
    // Reference truck/driver to satisfy linter for future enrichment
    void truck;
  }

  // Overdue & scheduled maintenance
  for (const mnt of maintenanceRecords) {
    if (mnt.status === "Completed") continue;
    actions.push({
      id: mnt.id,
      category: "Maintenance",
      title: `${mnt.service} — ${mnt.truck}`,
      priority: maintenancePriority(mnt.priority),
      status: maintenanceStatus(mnt.status),
      due: mnt.date,
      assignedTo: mnt.performedBy,
      target: { kind: "truck", id: mnt.truck },
    });
  }

  // Expiring / expired documents
  for (const doc of documents) {
    if (doc.status === "Valid") continue;
    actions.push({
      id: doc.id,
      category: "Document",
      title: `${doc.type} — ${doc.owner}`,
      priority: documentPriority(doc.status),
      status: documentStatus(doc.status),
      due: doc.expiryDate,
      assignedTo: doc.issuedBy,
    });
  }

  // Delayed trips
  for (const trip of trips) {
    if (trip.status !== "Delayed") continue;
    actions.push({
      id: trip.id,
      category: "Trip",
      title: `${trip.origin} → ${trip.destination} — ${trip.id}`,
      priority: "Medium",
      status: "Delayed",
      due: trip.arrivalTime,
      assignedTo: trip.driver,
      target: { kind: "trip", id: trip.id },
    });
  }

  return actions;
}

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

export function ActionCenter() {
  const { open: openProfile } = useProfileDrawer();

  const [priorityFilter, setPriorityFilter] = useState<"all" | Priority>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | ActionStatus>("all");

  const allActions = useMemo(() => buildActions(), []);

  const counts = useMemo(() => {
    let high = 0;
    let medium = 0;
    let low = 0;
    for (const a of allActions) {
      if (a.priority === "High") high++;
      else if (a.priority === "Medium") medium++;
      else low++;
    }
    return { high, medium, low, total: allActions.length };
  }, [allActions]);

  const filtered = useMemo(() => {
    return allActions.filter((a) => {
      if (priorityFilter !== "all" && a.priority !== priorityFilter) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      return true;
    });
  }, [allActions, priorityFilter, statusFilter]);

  const rows = useMemo(
    () => filtered.map((a) => ({ ...a })) as unknown as Record<string, unknown>[],
    [filtered],
  );

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "title",
      label: "Action",
      render: (row) => {
        const item = row as unknown as ActionItem;
        const Icon = categoryIcon[item.category];
        return (
          <button
            type="button"
            onClick={() => item.target && openProfile(item.target)}
            className="flex items-center gap-2.5 text-left transition-colors hover:text-primary"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Icon className="h-4 w-4" strokeWidth={2} />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium text-foreground group-hover:text-primary">
                {item.title}
              </span>
              <span className="text-xs text-muted-foreground">
                {item.category}
              </span>
            </span>
          </button>
        );
      },
    },
    {
      key: "priority",
      label: "Priority",
      render: (row) => {
        const item = row as unknown as ActionItem;
        return <Pill tone={priorityTone[item.priority]}>{item.priority}</Pill>;
      },
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const item = row as unknown as ActionItem;
        return <Pill tone={statusTone[item.status]}>{item.status}</Pill>;
      },
    },
    {
      key: "due",
      label: "Due",
      render: (row) => {
        const item = row as unknown as ActionItem;
        const formatted = formatDate(item.due);
        return <span className="text-sm text-muted-foreground">{formatted}</span>;
      },
    },
    {
      key: "assignedTo",
      label: "Assigned To",
      render: (row) => {
        const item = row as unknown as ActionItem;
        return (
          <span className="truncate text-sm text-foreground">
            {item.assignedTo}
          </span>
        );
      },
    },
    {
      key: "open",
      label: "",
      render: (row) => {
        const item = row as unknown as ActionItem;
        if (!item.target) {
          return (
            <span className="text-xs text-muted-foreground">—</span>
          );
        }
        return (
          <button
            type="button"
            onClick={() => item.target && openProfile(item.target)}
            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-border/60 px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
          >
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
            Open
          </button>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Header
        title="Action Center"
        subtitle="Every operational action in one place — incidents, maintenance, documents and delayed trips."
        showExport={false}
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          icon={Flame}
          label="High Priority"
          value={counts.high}
          tone="danger"
          footnote="Critical & high severity"
        />
        <KPICard
          icon={AlertTriangle}
          label="Medium Priority"
          value={counts.medium}
          tone="warning"
          footnote="Needs attention soon"
        />
        <KPICard
          icon={ListChecks}
          label="Low Priority"
          value={counts.low}
          tone="success"
          footnote="Monitor only"
        />
        <KPICard
          icon={ListChecks}
          label="Total Actions"
          value={counts.total}
          tone="info"
          footnote="Across all categories"
        />
      </div>

      {/* Filters + table */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <Filter className="h-3.5 w-3.5" strokeWidth={2} />
            Filters
          </span>

          <Select
            value={priorityFilter}
            onValueChange={(v) => setPriorityFilter(v as "all" | Priority)}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as "all" | ActionStatus)}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Investigating">Investigating</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="Expiring">Expiring</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
              <SelectItem value="Delayed">Delayed</SelectItem>
            </SelectContent>
          </Select>

          <span className="ml-auto text-xs text-muted-foreground">
            Showing {filtered.length} of {allActions.length} actions
          </span>
        </div>

        <DataTable
          columns={columns}
          rows={rows}
          searchKeys={["title", "assignedTo", "id"]}
          pageSize={8}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatDate(value: string): string {
  // Handle ISO datetime and plain date strings gracefully.
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Re-exported type alias for consumers that want the row shape. */
export type { ActionItem as ActionCenterItem };

/** Unused-but-imported guard to keep ReactNode import meaningful for typing. */
export type ActionCenterCell = ReactNode;

export default ActionCenter;
