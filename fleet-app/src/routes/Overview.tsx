import { useState, type ComponentType, type ReactNode } from "react";
import {
  Truck,
  TruckIcon,
  Package,
  Clock,
  Gauge,
  Wallet,
  AlertTriangle,
  Wrench,
  IdCard,
  ShieldAlert,
  Flame,
  ShieldCheck,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  TrendingDown,
  type LucideProps,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  KPICard,
  GlassCard,
  SectionCard,
  Pill,
  type Tone,
} from "@/components/shared/Cards";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  alerts,
  priorities,
  fleetBreakdown,
  costBreakdown,
  kpis,
  type Alert,
  type Priority,
} from "@/lib/mock-data";
import { useProfileDrawer } from "@/lib/profile-drawer";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

/** A unified notification used by the detail dialog. */
interface NotificationDetail {
  id: string;
  icon: ComponentType<LucideProps>;
  iconTone: Tone;
  title: string;
  time: string;
  description: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  status: string;
  relatedModule: string;
  relatedTarget?: { kind: "truck" | "driver" | "incident" | "route"; id: string };
  assignedTo: string;
  createdBy: string;
}

/* ------------------------------------------------------------------ */
/* Tone → oklch color map (for pie chart segments)                     */
/* ------------------------------------------------------------------ */

const TONE_OKLCH: Record<string, string> = {
  success: "oklch(0.65 0.17 145)",
  warning: "oklch(0.75 0.16 85)",
  danger: "oklch(0.62 0.22 25)",
  muted: "oklch(0.3 0.02 260)",
  info: "oklch(0.68 0.13 230)",
  purple: "oklch(0.6 0.2 300)",
};

const PRIORITY_TONE: Record<NotificationDetail["priority"], Tone> = {
  High: "danger",
  Medium: "warning",
  Low: "success",
};

/** Static background-tint classes per tone (15% opacity) — Tailwind v4 needs literal class names. */
const toneBg15: Record<Tone, string> = {
  info: "bg-info/15",
  success: "bg-success/15",
  warning: "bg-warning/15",
  danger: "bg-danger/15",
  purple: "bg-purple/15",
};

/** Static text color classes per tone — Tailwind v4 needs literal class names. */
const toneText: Record<Tone, string> = {
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  purple: "text-purple",
};

/* ------------------------------------------------------------------ */
/* Icon resolvers for mock-data string icon names                      */
/* ------------------------------------------------------------------ */

const ALERT_ICONS: Record<Alert["icon"], ComponentType<LucideProps>> = {
  AlertTriangle,
  Wrench,
  IdCard,
  ShieldAlert,
};

const PRIORITY_ICONS: Record<Priority["icon"], ComponentType<LucideProps>> = {
  Flame,
  Clock,
  Wrench,
  ShieldCheck,
};

const ALERT_TONE: Record<Alert["type"], Tone> = {
  danger: "danger",
  warning: "warning",
  info: "info",
};

/* ------------------------------------------------------------------ */
/* Static datasets for the page                                        */
/* ------------------------------------------------------------------ */

interface OperationsStat {
  label: string;
  value: number;
  delta: string;
  direction: "up" | "down";
  icon: ComponentType<LucideProps>;
  tone: Tone;
}

const operationsStats: OperationsStat[] = [
  { label: "Departed", value: 156, delta: "+8%", direction: "up", icon: Truck, tone: "info" },
  { label: "In Transit", value: 142, delta: "+5%", direction: "up", icon: Package, tone: "purple" },
  { label: "Delivered", value: 112, delta: "+12%", direction: "up", icon: ShieldCheck, tone: "success" },
  { label: "Delayed", value: 18, delta: "-10%", direction: "down", icon: Clock, tone: "warning" },
];

const deliveryStats = [
  { label: "Total", value: 142 },
  { label: "On-Time", value: 131 },
  { label: "Delayed", value: 11 },
];

/* ------------------------------------------------------------------ */
/* Helper: build a NotificationDetail from an alert or priority       */
/* ------------------------------------------------------------------ */

function alertToDetail(alert: Alert): NotificationDetail {
  return {
    id: alert.id,
    icon: ALERT_ICONS[alert.icon],
    iconTone: ALERT_TONE[alert.type],
    title: alert.title,
    time: alert.time,
    description: alert.detail,
    category: "Alert",
    priority: alert.type === "danger" ? "High" : alert.type === "warning" ? "Medium" : "Low",
    status: "Open",
    relatedModule: "Operations",
    assignedTo: "Operations Team",
    createdBy: "System Monitor",
  };
}

function priorityToDetail(priority: Priority): NotificationDetail {
  return {
    id: priority.id,
    icon: PRIORITY_ICONS[priority.icon],
    iconTone: priority.color,
    title: priority.title,
    time: priority.time,
    description: priority.detail,
    category: "Priority",
    priority: priority.color === "danger" ? "High" : priority.color === "warning" ? "Medium" : "Low",
    status: "Pending",
    relatedModule: "Operations",
    assignedTo: "Fleet Manager",
    createdBy: "Operations Lead",
  };
}

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

export function Overview() {
  const [selected, setSelected] = useState<NotificationDetail | null>(null);
  const { open: openProfile } = useProfileDrawer();

  const totalFleet = fleetBreakdown.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* ---------------------------------------------------------- */}
      {/* Page heading                                                */}
      {/* ---------------------------------------------------------- */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Fleet performance, operations and priorities at a glance.
        </p>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* 1. KPI Row                                                  */}
      {/* ---------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KPICard
          icon={Truck}
          label="Total Trucks"
          value={kpis.totalTrucks}
          tone="info"
          delta={{ value: 4, direction: "up" }}
        />
        <KPICard
          icon={TruckIcon}
          label="Trucks On The Road"
          value={kpis.onTheRoad}
          tone="success"
          footnote="76.6% of fleet"
        />
        <KPICard
          icon={Package}
          label="Active Deliveries"
          value={kpis.activeDeliveries}
          tone="purple"
          delta={{ value: 12, direction: "up" }}
        />
        <KPICard
          icon={Clock}
          label="On-Time Delivery"
          value={`${kpis.onTimeRate}%`}
          tone="info"
          delta={{ value: "3.2%", direction: "down" }}
        />
        <KPICard
          icon={Gauge}
          label="Fleet Utilization"
          value={`${kpis.utilization}%`}
          tone="warning"
          delta={{ value: "5.6%", direction: "up" }}
        />
        <KPICard
          icon={Wallet}
          label="Total Operating Cost"
          value={kpis.operatingCost}
          tone="danger"
          delta={{ value: "8.4%", direction: "down" }}
        />
      </div>

      {/* ---------------------------------------------------------- */}
      {/* 2. Second Row — Fleet / Operations / Delivery Performance   */}
      {/* ---------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Fleet at a Glance */}
        <SectionCard title="Fleet at a Glance">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="relative h-44 w-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fleetBreakdown}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={48}
                    outerRadius={80}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {fleetBreakdown.map((entry) => (
                      <Cell key={entry.name} fill={TONE_OKLCH[entry.color]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-semibold text-foreground">
                  {totalFleet}
                </span>
                <span className="text-xs text-muted-foreground">Total</span>
              </div>
            </div>

            <ul className="flex w-full flex-col gap-2.5">
              {fleetBreakdown.map((entry) => {
                const pct = totalFleet
                  ? ((entry.value / totalFleet) * 100).toFixed(1)
                  : "0";
                return (
                  <li
                    key={entry.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: TONE_OKLCH[entry.color] }}
                      />
                      <span className="text-foreground">{entry.name}</span>
                    </span>
                    <span className="text-muted-foreground">
                      {entry.value}{" "}
                      <span className="text-xs">({pct}%)</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </SectionCard>

        {/* Operations Overview (Today) */}
        <SectionCard title="Operations Overview (Today)">
          <div className="flex items-center justify-between gap-1">
            {operationsStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex items-center gap-1">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${toneBg15[stat.tone]} ${toneText[stat.tone]}`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <span className="text-xl font-semibold text-foreground">
                      {stat.value}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {stat.label}
                    </span>
                    <span
                      className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                        stat.direction === "up" ? "text-success" : "text-danger"
                      }`}
                    >
                      {stat.direction === "up" ? (
                        <ArrowUp className="h-3 w-3" strokeWidth={2.5} />
                      ) : (
                        <ArrowDown className="h-3 w-3" strokeWidth={2.5} />
                      )}
                      {stat.delta}
                    </span>
                  </div>
                  {idx < operationsStats.length - 1 ? (
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  ) : null}
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* Delivery Performance — NO line chart, progress bar + stats */}
        <SectionCard
          title="Delivery Performance"
          action={
            <button
              type="button"
              className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
            >
              View Delivery Performance
            </button>
          }
        >
          <div className="flex flex-col gap-5">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  On-Time Delivery
                </span>
                <span className="text-sm font-semibold text-success">
                  {kpis.onTimeRate}%
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-success transition-all"
                  style={{ width: `${kpis.onTimeRate}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {deliveryStats.map((stat) => (
                <GlassCard
                  key={stat.label}
                  hover={false}
                  className="p-3 text-center"
                >
                  <div className="text-xl font-semibold text-foreground">
                    {stat.value}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* 3. Third Row — Alerts / Priorities / Cost Summary          */}
      {/* ---------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Alerts & Notifications */}
        <SectionCard
          title="Alerts & Notifications"
          action={
            <button
              type="button"
              className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
            >
              View all alerts
            </button>
          }
        >
          <ul className="flex flex-col gap-2">
            {alerts.map((alert) => {
              const Icon = ALERT_ICONS[alert.icon];
              const tone = ALERT_TONE[alert.type];
              return (
                <li key={alert.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(alertToDetail(alert))}
                    className="flex w-full items-start gap-3 rounded-lg border border-border/40 bg-white/[0.02] p-3 text-left transition-colors hover:bg-white/[0.04] hover:border-primary/40"
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${toneBg15[tone]} ${toneText[tone]}`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="truncate text-sm font-medium text-foreground">
                        {alert.title}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {alert.detail}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {alert.time}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </SectionCard>

        {/* Top Priorities */}
        <SectionCard
          title="Top Priorities"
          action={
            <button
              type="button"
              className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
            >
              View all priorities
            </button>
          }
        >
          <ul className="flex flex-col gap-2">
            {priorities.map((priority) => {
              const Icon = PRIORITY_ICONS[priority.icon];
              const tone = priority.color;
              return (
                <li key={priority.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(priorityToDetail(priority))}
                    className="flex w-full items-start gap-3 rounded-lg border border-border/40 bg-white/[0.02] p-3 text-left transition-colors hover:bg-white/[0.04] hover:border-primary/40"
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${toneBg15[tone]} ${toneText[tone]}`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="truncate text-sm font-medium text-foreground">
                        {priority.title}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {priority.detail}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {priority.time}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </SectionCard>

        {/* Cost Summary (This Month) */}
        <SectionCard title="Cost Summary (This Month)">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-semibold text-foreground">
                  {kpis.operatingCost}
                </div>
                <div className="text-xs text-muted-foreground">
                  Total operating cost
                </div>
              </div>
              <Pill tone="success">
                <TrendingDown className="mr-1 h-3 w-3" strokeWidth={2.5} />
                -6.7% vs last month
              </Pill>
            </div>

            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="h-36 w-36 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={costBreakdown}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={38}
                      outerRadius={64}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {costBreakdown.map((entry) => (
                        <Cell key={entry.name} fill={TONE_OKLCH[entry.color]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <ul className="flex w-full flex-col gap-2">
                {costBreakdown.map((entry) => (
                  <li
                    key={entry.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: TONE_OKLCH[entry.color] }}
                      />
                      <span className="text-foreground">{entry.name}</span>
                    </span>
                    <span className="text-muted-foreground">{entry.amount}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* 4. Detail Dialog                                            */}
      {/* ---------------------------------------------------------- */}
      <Dialog
        open={selected !== null}
        onOpenChange={(next) => {
          if (!next) setSelected(null);
        }}
      >
        <DialogContent className="max-w-xl">
          {selected ? (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${toneBg15[selected.iconTone]} ${toneText[selected.iconTone]}`}
                  >
                    <selected.icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <div className="flex flex-col gap-1">
                    <DialogTitle>{selected.title}</DialogTitle>
                    <DialogDescription>
                      {selected.time} · {selected.description}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4">
                <DetailField label="Category" value={selected.category} />
                <DetailField
                  label="Priority"
                  value={
                    <Pill tone={PRIORITY_TONE[selected.priority]}>
                      {selected.priority}
                    </Pill>
                  }
                />
                <DetailField label="Status" value={selected.status} />
                <DetailField label="Related Module" value={selected.relatedModule} />
                <DetailField label="Assigned To" value={selected.assignedTo} />
                <DetailField label="Created By" value={selected.createdBy} />
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <button
                    type="button"
                    className="inline-flex h-9 items-center justify-center rounded-md border border-border/60 px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
                  >
                    Close
                  </button>
                </DialogClose>
                <button
                  type="button"
                  onClick={() => {
                    if (selected.relatedTarget) {
                      openProfile(selected.relatedTarget);
                      setSelected(null);
                    }
                  }}
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Open Related Record
                </button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Local helper component                                               */
/* ------------------------------------------------------------------ */

function DetailField({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  );
}

export default Overview;
