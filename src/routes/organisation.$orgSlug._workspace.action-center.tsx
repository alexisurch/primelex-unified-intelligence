import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { Zap, CircleCheck as CheckCircle2, Clock, TriangleAlert as AlertTriangle, ChevronDown, ChevronUp, ListFilter as Filter, RefreshCw, Truck, User, Fuel, Wrench, ShieldAlert, FileText, TrendingDown, Route as RouteIcon, Building2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { GlassCard, KPICard, SectionCard, Pill } from "@/components/shared/Cards";
import { cn } from "@/lib/utils";
import {
  fetchActionItems, updateActionStatus, createActionItem,
  type ActionItem,
} from "@/lib/action-items";
import { useProfileDrawer } from "@/lib/profile-drawer";
import { appendAudit } from "@/lib/local-store";

export const Route = createFileRoute("/organisation/$orgSlug/_workspace/action-center")({
  component: ActionCenter,
});

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const CATEGORY_ICON: Record<string, React.ElementType> = {
  "License Expiry": FileText,
  "Insurance Expiry": ShieldAlert,
  "Fuel Review": Fuel,
  "Delayed Trip": RouteIcon as unknown as React.ElementType,
  "Maintenance Due": Wrench,
  "KPI Below Target": TrendingDown,
  "Document Expiry": FileText,
  Compliance: CheckCircle2,
  Incident: AlertTriangle,
  General: Zap,
};

const CATEGORY_TONE: Record<string, string> = {
  "License Expiry": "text-danger bg-danger/15",
  "Insurance Expiry": "text-danger bg-danger/15",
  "Fuel Review": "text-warning bg-warning/15",
  "Delayed Trip": "text-danger bg-danger/15",
  "Maintenance Due": "text-warning bg-warning/15",
  "KPI Below Target": "text-warning bg-warning/15",
  "Document Expiry": "text-info bg-info/15",
  Compliance: "text-info bg-info/15",
  Incident: "text-danger bg-danger/15",
  General: "text-muted-foreground bg-white/10",
};

const PRIORITY_PILL: Record<string, "danger" | "warning" | "success"> = {
  High: "danger",
  Medium: "warning",
  Low: "success",
};

const MODULE_ICON: Record<string, React.ElementType> = {
  Fleet: Truck,
  Trips: RouteIcon as unknown as React.ElementType,
  "Fuel Intelligence": Fuel,
  Maintenance: Wrench,
  Operations: Zap,
  Documents: FileText,
  Incidents: ShieldAlert,
  Drivers: User,
  Clients: Building2,
  Default: Zap,
};

function dueDateLabel(due: string | null): { text: string; tone: string } {
  if (!due) return { text: "No deadline", tone: "text-muted-foreground" };
  const diff = new Date(due).getTime() - Date.now();
  const days = Math.floor(diff / 86400000);
  if (days < 0) return { text: "Overdue", tone: "text-danger" };
  if (days === 0) return { text: "Due today", tone: "text-danger" };
  if (days === 1) return { text: "Due tomorrow", tone: "text-warning" };
  if (days <= 7) return { text: `Due in ${days}d`, tone: "text-warning" };
  return { text: `Due ${new Date(due).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}`, tone: "text-muted-foreground" };
}

/* ------------------------------------------------------------------ */
/* Action Item Card                                                    */
/* ------------------------------------------------------------------ */

interface ActionCardProps {
  item: ActionItem;
  onResolve: (id: string) => void;
  onDismiss: (id: string) => void;
  onOpenProfile: (type: string, id: string) => void;
}

function ActionCard({ item, onResolve, onDismiss, onOpenProfile }: ActionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const CategoryIcon = CATEGORY_ICON[item.category] ?? Zap;
  const iconClass = CATEGORY_TONE[item.category] ?? "text-muted-foreground bg-white/10";
  const due = dueDateLabel(item.due_date);
  const ModuleIcon = MODULE_ICON[item.module] ?? MODULE_ICON.Default;

  return (
    <div className={cn(
      "group rounded-xl border bg-white/[0.015] transition-all",
      item.priority === "High" ? "border-danger/30" : item.priority === "Medium" ? "border-warning/20" : "border-border/40",
    )}>
      <button
        type="button"
        className="flex w-full items-start gap-3 px-4 py-3.5 text-left"
        onClick={() => setExpanded((v) => !v)}
      >
        <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", iconClass)}>
          <CategoryIcon className="h-4 w-4" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-semibold text-foreground">{item.title}</span>
            <div className="flex shrink-0 items-center gap-2">
              <Pill tone={PRIORITY_PILL[item.priority] ?? "info"}>{item.priority}</Pill>
            </div>
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{item.detail}</div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
            <span className="flex items-center gap-1 text-muted-foreground">
              <ModuleIcon className="h-3 w-3" />{item.module}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">{item.assigned_to}</span>
            <span className="ml-auto flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className={due.tone}>{due.text}</span>
            </span>
          </div>
        </div>
        <ChevronDown className={cn("mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform", expanded && "rotate-180")} />
      </button>

      {expanded && (
        <div className="border-t border-border/40 px-4 pb-3 pt-3 space-y-3">
          <p className="text-sm text-foreground leading-relaxed">{item.detail}</p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div><span className="text-muted-foreground">Category: </span><span className="font-medium">{item.category}</span></div>
            <div><span className="text-muted-foreground">Status: </span>
              <span className={cn("font-medium capitalize", item.status === "open" ? "text-danger" : item.status === "in_progress" ? "text-warning" : "text-success")}>
                {item.status.replace("_", " ")}
              </span>
            </div>
            <div><span className="text-muted-foreground">Assigned to: </span><span className="font-medium">{item.assigned_to}</span></div>
            {item.entity_label && (
              <div>
                <span className="text-muted-foreground">Related: </span>
                {item.entity_type && item.entity_id &&
                  ["truck", "driver", "trip", "client", "incident", "route", "fleet-manager"].includes(item.entity_type) ? (
                  <button
                    type="button"
                    onClick={() => onOpenProfile(item.entity_type!, item.entity_id!)}
                    className="font-medium text-primary hover:underline"
                  >
                    {item.entity_label}
                  </button>
                ) : (
                  <span className="font-medium">{item.entity_label}</span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => onResolve(item.id)}
              className="flex items-center gap-1.5 rounded-lg bg-success/15 px-3 py-1.5 text-xs font-semibold text-success transition-colors hover:bg-success/25"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Mark Resolved
            </button>
            <button
              type="button"
              onClick={() => onDismiss(item.id)}
              className="flex items-center gap-1.5 rounded-lg border border-border/40 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Priority Group                                                      */
/* ------------------------------------------------------------------ */

interface PriorityGroupProps {
  priority: "High" | "Medium" | "Low";
  items: ActionItem[];
  onResolve: (id: string) => void;
  onDismiss: (id: string) => void;
  onOpenProfile: (type: string, id: string) => void;
}

function PriorityGroup({ priority, items, onResolve, onDismiss, onOpenProfile }: PriorityGroupProps) {
  const [open, setOpen] = useState(true);
  const tones = {
    High: { dot: "bg-danger", label: "text-danger", border: "border-danger/40" },
    Medium: { dot: "bg-warning", label: "text-warning", border: "border-warning/40" },
    Low: { dot: "bg-success", label: "text-success", border: "border-success/40" },
  };
  const t = tones[priority];

  if (!items.length) return null;

  return (
    <div>
      <button
        type="button"
        className="mb-3 flex w-full items-center gap-2"
        onClick={() => setOpen((v) => !v)}
      >
        <span className={cn("h-2 w-2 rounded-full", t.dot)} />
        <span className={cn("text-[11px] font-bold uppercase tracking-widest", t.label)}>{priority} Priority</span>
        <span className="ml-1 rounded-full bg-white/[0.06] px-2 py-0.5 text-[11px] text-muted-foreground">{items.length}</span>
        <span className="ml-auto">
          {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </span>
      </button>
      {open && (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <ActionCard
              key={item.id}
              item={item}
              onResolve={onResolve}
              onDismiss={onDismiss}
              onOpenProfile={onOpenProfile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Action Center page                                                  */
/* ------------------------------------------------------------------ */

function ActionCenter() {
  const { open: openProfile } = useProfileDrawer();
  const [items, setItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "resolved">("open");
  const [moduleFilter, setModuleFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const statuses: ActionItem["status"][] =
        statusFilter === "all" ? ["open", "in_progress", "resolved", "dismissed"]
        : statusFilter === "resolved" ? ["resolved"]
        : ["open", "in_progress"];
      const data = await fetchActionItems(statuses);
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { void load(); }, [load]);

  async function handleResolve(id: string) {
    await updateActionStatus(id, "resolved");
    await appendAudit({
      entity_type: "action_item",
      entity_id: id,
      entity_label: "Action Item",
      action: "Resolved",
      field_name: "status",
      previous_value: "open",
      new_value: "resolved",
      changed_by: "Adeleke Oladipo",
      changed_by_role: "Fleet Manager",
      module: "Action Center",
      notes: null,
    });
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, status: "resolved" } : i));
  }

  async function handleDismiss(id: string) {
    await updateActionStatus(id, "dismissed");
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, status: "dismissed" } : i));
  }

  function handleOpenProfile(type: string, id: string) {
    const validKinds = ["truck", "driver", "trip", "client", "incident", "route", "fleet-manager"];
    if (validKinds.includes(type)) {
      openProfile({ kind: type as Parameters<typeof openProfile>[0]["kind"], id });
    }
  }

  const modules = ["all", ...Array.from(new Set(items.map((i) => i.module))).sort()];

  const filtered = items.filter((i) => {
    if (moduleFilter !== "all" && i.module !== moduleFilter) return false;
    return true;
  });

  const high = filtered.filter((i) => i.priority === "High" && i.status !== "resolved" && i.status !== "dismissed");
  const medium = filtered.filter((i) => i.priority === "Medium" && i.status !== "resolved" && i.status !== "dismissed");
  const low = filtered.filter((i) => i.priority === "Low" && i.status !== "resolved" && i.status !== "dismissed");
  const resolved = filtered.filter((i) => i.status === "resolved");
  const total = high.length + medium.length + low.length;

  return (
    <>
      <Header
        title="Action Center"
        subtitle="Aggregated operational actions requiring attention — grouped by priority."
        showExport={false}
      />
      <div className="space-y-6 p-8">
        {/* KPI row */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KPICard label="Total Open" value={total} icon={Zap} tone="warning" footnote="Requiring attention" />
          <KPICard label="High Priority" value={high.length} icon={AlertTriangle} tone="danger" footnote="Immediate action needed" />
          <KPICard label="Medium Priority" value={medium.length} icon={Clock} tone="warning" footnote="Action this week" />
          <KPICard label="Resolved Today" value={resolved.length} icon={CheckCircle2} tone="success" footnote="Well done" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1 rounded-lg border border-border/60 p-1">
            {(["open", "all", "resolved"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors capitalize",
                  statusFilter === s
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {s === "all" ? "All" : s === "open" ? "Open" : "Resolved"}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="rounded-md border border-border/60 bg-elevated/60 px-2 py-1.5 text-xs text-foreground focus:outline-none"
            >
              {modules.map((m) => (
                <option key={m} value={m}>{m === "all" ? "All Modules" : m}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => void load()}
            className="ml-auto flex items-center gap-1.5 rounded-md border border-border/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        {/* Action groups */}
        {loading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">Loading actions…</div>
        ) : total === 0 && statusFilter === "open" ? (
          <GlassCard className="py-12 text-center">
            <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-success/50" />
            <div className="text-sm font-semibold text-foreground">All clear</div>
            <div className="mt-1 text-xs text-muted-foreground">No open action items at this time.</div>
          </GlassCard>
        ) : (
          <div className="space-y-6">
            {statusFilter !== "resolved" && (
              <>
                <PriorityGroup priority="High" items={high} onResolve={handleResolve} onDismiss={handleDismiss} onOpenProfile={handleOpenProfile} />
                <PriorityGroup priority="Medium" items={medium} onResolve={handleResolve} onDismiss={handleDismiss} onOpenProfile={handleOpenProfile} />
                <PriorityGroup priority="Low" items={low} onResolve={handleResolve} onDismiss={handleDismiss} onOpenProfile={handleOpenProfile} />
              </>
            )}
            {statusFilter !== "open" && resolved.length > 0 && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-success" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-success">Resolved</span>
                  <span className="ml-1 rounded-full bg-white/[0.06] px-2 py-0.5 text-[11px] text-muted-foreground">{resolved.length}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {resolved.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 rounded-xl border border-border/30 bg-white/[0.01] px-4 py-3 opacity-60">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="flex-1 text-sm">{item.title}</span>
                      <span className="text-xs text-muted-foreground">{item.module}</span>
                      <Pill tone="success">Resolved</Pill>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
