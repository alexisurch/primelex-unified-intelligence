import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { GlassCard, KPICard, SectionCard, Pill } from "@/components/shared/Cards";
import { Truck, Truck as TruckIcon, Package, Clock, Gauge, Wallet, ArrowRight, TriangleAlert as AlertTriangle, Wrench, IdCard, ShieldAlert, Flame, ShieldCheck, TrendingDown, Bell, CalendarDays, User, Route as RouteIcon, Package as PackageIcon, Building2, Satellite } from "lucide-react";
import { alerts, priorities, fleetBreakdown, costBreakdown, kpis } from "@/lib/mock-data";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useProfileDrawer } from "@/lib/profile-drawer";

export const Route = createFileRoute("/_app/")({
  component: Dashboard,
});

const alertIcons = { AlertTriangle, Wrench, IdCard, ShieldAlert };
const priorityIcons = { Flame, Clock, Wrench, ShieldCheck };

/* ------------------------------------------------------------------ */
/* Notification panel data                                             */
/* ------------------------------------------------------------------ */

interface NotificationRecord {
  id: string;
  title: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  status: string;
  time: string;
  description: string;
  relatedTruck?: string;
  relatedDriver?: string;
  relatedRoute?: string;
  relatedTrip?: string;
  relatedClient?: string;
  assignedUser: string;
  aiReview?: string;
  recommendedActions: string[];
  timeline: { time: string; event: string }[];
}

const ALERT_RECORDS: Record<string, NotificationRecord> = {
  "alert-1": {
    id: "alert-1", title: "Delivery Delayed", category: "Alert", priority: "High",
    status: "Open", time: "10 min ago",
    description: "Trip TRP-7382 to ABC Stores is delayed beyond the scheduled delivery window.",
    relatedTrip: "TRP-7382", relatedClient: "ABC Stores",
    assignedUser: "Operations Team",
    aiReview: "This delay pattern matches recurring congestion on the Lagos–Ibadan corridor on weekday mornings. Consider rerouting via the Sagamu interchange.",
    recommendedActions: ["Contact driver to confirm current position.", "Notify ABC Stores of revised ETA.", "Log delay in the trip record for SLA reporting."],
    timeline: [{ time: "10 min ago", event: "Delay alert triggered automatically." }, { time: "Pending", event: "Awaiting driver confirmation." }],
  },
  "alert-2": {
    id: "alert-2", title: "Maintenance Due", category: "Alert", priority: "Medium",
    status: "Scheduled", time: "25 min ago",
    description: "Truck KJA 89XY is due for scheduled maintenance in 3 days.",
    relatedTruck: "TRK-1002",
    assignedUser: "Maintenance Team",
    aiReview: "Based on current mileage rate, this truck will reach the 10,000km service interval in approximately 72 hours. Schedule now to avoid unplanned downtime.",
    recommendedActions: ["Book workshop slot for the next available window.", "Confirm driver availability for drop-off.", "Prepare parts list for the service."],
    timeline: [{ time: "25 min ago", event: "Maintenance threshold reached." }, { time: "Pending", event: "Workshop booking required." }],
  },
  "alert-3": {
    id: "alert-3", title: "License Expiring", category: "Alert", priority: "Medium",
    status: "Open", time: "1 hr ago",
    description: "Driver Tunde A.'s license expires in 7 days. Renewal action is required.",
    relatedDriver: "DRV-004",
    assignedUser: "Compliance Team",
    aiReview: "This is a compliance risk. Allowing a driver to operate with an expired license exposes the organization to regulatory fines.",
    recommendedActions: ["Notify Tunde A. to begin renewal immediately.", "Flag as blocked from dispatch after expiry date.", "Update document tracker once renewed."],
    timeline: [{ time: "1 hr ago", event: "License expiry warning generated." }, { time: "7 days", event: "License expiry deadline." }],
  },
  "alert-4": {
    id: "alert-4", title: "Insurance Expiring", category: "Alert", priority: "High",
    status: "Open", time: "3 hr ago",
    description: "Insurance for GGE 543RT expires in 5 days. Renewal must be completed before expiry.",
    relatedTruck: "TRK-1005",
    assignedUser: "Finance Team",
    aiReview: "Operating an uninsured vehicle is a critical compliance violation. This truck should be grounded if insurance is not renewed before expiry.",
    recommendedActions: ["Contact insurer immediately to initiate renewal.", "Confirm coverage end date and renewal terms.", "Ground vehicle if renewal is not confirmed 24h before expiry."],
    timeline: [{ time: "3 hr ago", event: "Insurance expiry warning triggered." }, { time: "5 days", event: "Insurance expiry deadline." }],
  },
};

const PRIORITY_RECORDS: Record<string, NotificationRecord> = {
  "pri-1": {
    id: "pri-1", title: "Reduce Fuel Cost", category: "Priority", priority: "High",
    status: "Pending", time: "10 min ago",
    description: "Fuel cost increased by 8.4% vs last week across the fleet.",
    assignedUser: "Fleet Manager",
    aiReview: "The cost increase correlates with 3 trucks operating on suboptimal routes with idle engine time. Targeted driver coaching and route optimization can recover ~5% of this increase.",
    recommendedActions: ["Review top 5 fuel consumers in Fuel Intelligence.", "Enable idle-time alerts for flagged trucks.", "Brief drivers on fuel-efficient driving protocols."],
    timeline: [{ time: "10 min ago", event: "Fuel cost threshold exceeded." }, { time: "Pending", event: "Awaiting management review." }],
  },
  "pri-2": {
    id: "pri-2", title: "Improve On-Time Delivery", category: "Priority", priority: "Medium",
    status: "Pending", time: "25 min ago",
    description: "11 deliveries were delayed this week, exceeding the acceptable threshold.",
    assignedUser: "Operations Lead",
    aiReview: "Route RT-007 accounts for 6 of the 11 delays. Traffic analysis suggests departure times should be shifted 45 minutes earlier on this corridor.",
    recommendedActions: ["Review delayed trips in Trips & Deliveries.", "Adjust departure schedules for RT-007.", "Escalate recurring delay patterns to the route planner."],
    timeline: [{ time: "25 min ago", event: "Weekly KPI threshold breached." }, { time: "Pending", event: "Review in progress." }],
  },
  "pri-3": {
    id: "pri-3", title: "Maintenance Due", category: "Priority", priority: "Low",
    status: "Scheduled", time: "1 hr ago",
    description: "10 vehicles are due for scheduled service this week.",
    assignedUser: "Maintenance Supervisor",
    aiReview: "Deferring scheduled maintenance beyond 500km of the due mileage statistically increases breakdown risk by 37%. Prioritize the 4 trucks already past due.",
    recommendedActions: ["Open Maintenance module and filter by 'Due Soon'.", "Assign workshop slots for all 10 vehicles.", "Confirm parts availability with the workshop."],
    timeline: [{ time: "1 hr ago", event: "Maintenance due list updated." }, { time: "Pending", event: "Scheduling in progress." }],
  },
  "pri-4": {
    id: "pri-4", title: "Compliance Review", category: "Priority", priority: "Low",
    status: "Pending", time: "3 hr ago",
    description: "5 documents and permits are expiring within the next 7 days.",
    assignedUser: "Compliance Officer",
    aiReview: "3 of the 5 expiring documents are vehicle permits required for interstate operations. Failure to renew will restrict those trucks to intrastate routes only.",
    recommendedActions: ["Open Documents module and filter by expiry date.", "Initiate renewal for all 5 items immediately.", "Notify relevant drivers and managers."],
    timeline: [{ time: "3 hr ago", event: "Document expiry scan completed." }, { time: "Pending", event: "Renewals pending." }],
  },
};

/* ------------------------------------------------------------------ */
/* Notification slide-out panel                                        */
/* ------------------------------------------------------------------ */

const PRIORITY_TONE = { High: "danger", Medium: "warning", Low: "success" } as const;
const STATUS_TONE = { Open: "danger", Scheduled: "info", Pending: "warning", Resolved: "success" } as const;

function NotificationPanel({ record, onOpen }: {
  record: NotificationRecord;
  onOpen: (t: { kind: "truck" | "driver" | "route" | "trip" | "client" | "incident" | "fleet-manager"; id: string }) => void;
}) {
  return (
    <div className="flex flex-col gap-6 px-6 py-8">
      {/* Header */}
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{record.category}</div>
        <h2 className="mt-1 text-xl font-semibold text-foreground">{record.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{record.description}</p>
      </div>

      {/* Core details */}
      <div className="grid grid-cols-2 gap-4">
        <DetailRow icon={Bell} label="Category" value={record.category} />
        <div className="flex flex-col gap-0.5">
          <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"><Bell className="h-3 w-3" />Priority</span>
          <Pill tone={PRIORITY_TONE[record.priority]}>{record.priority}</Pill>
        </div>
        <DetailRow icon={CalendarDays} label="Date & Time" value={record.time} />
        <div className="flex flex-col gap-0.5">
          <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"><Satellite className="h-3 w-3" />Status</span>
          <Pill tone={(STATUS_TONE as Record<string, string>)[record.status] as "danger" | "info" | "warning" | "success" | "purple" ?? "info"}>{record.status}</Pill>
        </div>
        <DetailRow icon={User} label="Assigned User" value={record.assignedUser} />
      </div>

      {/* Related records */}
      {(record.relatedTruck || record.relatedDriver || record.relatedRoute || record.relatedTrip || record.relatedClient) && (
        <div>
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Related Records</div>
          <div className="flex flex-col gap-2">
            {record.relatedTruck && (
              <button type="button" onClick={() => onOpen({ kind: "truck", id: record.relatedTruck! })}
                className="flex items-center gap-3 rounded-lg border border-border/40 bg-white/[0.02] px-4 py-3 text-left transition-colors hover:border-primary/40 hover:bg-white/[0.04]">
                <TruckIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-primary">Truck {record.relatedTruck}</span>
                <span className="ml-auto text-xs text-muted-foreground">Open profile →</span>
              </button>
            )}
            {record.relatedDriver && (
              <button type="button" onClick={() => onOpen({ kind: "driver", id: record.relatedDriver! })}
                className="flex items-center gap-3 rounded-lg border border-border/40 bg-white/[0.02] px-4 py-3 text-left transition-colors hover:border-primary/40 hover:bg-white/[0.04]">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-primary">Driver {record.relatedDriver}</span>
                <span className="ml-auto text-xs text-muted-foreground">Open profile →</span>
              </button>
            )}
            {record.relatedRoute && (
              <button type="button" onClick={() => onOpen({ kind: "route", id: record.relatedRoute! })}
                className="flex items-center gap-3 rounded-lg border border-border/40 bg-white/[0.02] px-4 py-3 text-left transition-colors hover:border-primary/40 hover:bg-white/[0.04]">
                <RouteIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-primary">Route {record.relatedRoute}</span>
                <span className="ml-auto text-xs text-muted-foreground">Open profile →</span>
              </button>
            )}
            {record.relatedTrip && (
              <button type="button" onClick={() => onOpen({ kind: "trip", id: record.relatedTrip! })}
                className="flex items-center gap-3 rounded-lg border border-border/40 bg-white/[0.02] px-4 py-3 text-left transition-colors hover:border-primary/40 hover:bg-white/[0.04]">
                <PackageIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-primary">Trip {record.relatedTrip}</span>
                <span className="ml-auto text-xs text-muted-foreground">Open profile →</span>
              </button>
            )}
            {record.relatedClient && (
              <button type="button" onClick={() => onOpen({ kind: "client", id: record.relatedClient! })}
                className="flex items-center gap-3 rounded-lg border border-border/40 bg-white/[0.02] px-4 py-3 text-left transition-colors hover:border-primary/40 hover:bg-white/[0.04]">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-primary">Client {record.relatedClient}</span>
                <span className="ml-auto text-xs text-muted-foreground">Open profile →</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* AI Review */}
      {record.aiReview && (
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">AI Operational Review</div>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm leading-relaxed text-foreground">{record.aiReview}</p>
          </div>
        </div>
      )}

      {/* Recommended Actions */}
      <div>
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Recommended Actions</div>
        <ul className="flex flex-col gap-2">
          {record.recommendedActions.map((action, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[11px] font-semibold text-primary">{i + 1}</span>
              <span className="text-foreground">{action}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Timeline */}
      <div>
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Timeline</div>
        <div className="flex flex-col gap-0">
          {record.timeline.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
                {i < record.timeline.length - 1 && <span className="my-1 w-px flex-1 bg-border/60" style={{ minHeight: 24 }} />}
              </div>
              <div className="flex flex-col gap-0.5 pb-3">
                <span className="text-xs text-muted-foreground">{item.time}</span>
                <span className="text-sm text-foreground">{item.event}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attachments placeholder */}
      <div>
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Attachments</div>
        <div className="rounded-lg border border-dashed border-border/60 p-4 text-center text-xs text-muted-foreground">
          No attachments. This section is ready for future file upload support.
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: typeof Bell; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" />{label}
      </span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* We need an inline sheet since profile-drawer only supports 7 kinds  */
/* ------------------------------------------------------------------ */

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

function Dashboard() {
  const { open } = useProfileDrawer();
  const [activeNotification, setActiveNotification] = useState<NotificationRecord | null>(null);
  const [allAlertsOpen, setAllAlertsOpen] = useState(false);
  const [allPrioritiesOpen, setAllPrioritiesOpen] = useState(false);

  function openNotification(record: NotificationRecord) {
    setActiveNotification(record);
  }

  function handleRelatedOpen(t: { kind: "truck" | "driver" | "route" | "trip" | "client" | "incident" | "fleet-manager"; id: string }) {
    setActiveNotification(null);
    // small delay so the notification sheet closes first
    setTimeout(() => open(t), 50);
  }

  return (
    <>
      <Header title="Overview" subtitle="Real-time summary of your fleet operations" />
      <div className="space-y-6 p-8">
        {/* KPI row */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          <KPICard label="Total Trucks" value={kpis.totalTrucks} icon={Truck} tone="info" delta={{ value: "4", direction: "up" }} />
          <KPICard label="Trucks On The Road" value={kpis.onTheRoad} icon={TruckIcon} tone="success" footnote="76.6% of fleet" />
          <KPICard label="Active Deliveries" value={kpis.activeDeliveries} icon={Package} tone="purple" delta={{ value: "12", direction: "up" }} />
          <KPICard label="On-Time Delivery" value={`${kpis.onTimeRate}%`} icon={Clock} tone="info" delta={{ value: "3.2%", direction: "down" }} />
          <KPICard label="Fleet Utilization" value={`${kpis.utilization}%`} icon={Gauge} tone="warning" delta={{ value: "5.6%", direction: "up" }} />
          <KPICard label="Total Operating Cost" value={kpis.operatingCost} icon={Wallet} tone="danger" delta={{ value: "8.4%", direction: "down" }} />
        </div>

        {/* Second row */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {/* Fleet at a Glance */}
          <SectionCard title="Fleet at a Glance" >
            <div className="flex items-center gap-3">
              <div className="relative h-[140px] w-[140px] shrink-0">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={fleetBreakdown} innerRadius={44} outerRadius={62} paddingAngle={2.5} dataKey="value">
                      {fleetBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-xl font-semibold">128</div>
                  <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Total</div>
                </div>
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                {fleetBreakdown.map((f) => (
                  <div key={f.name} className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: f.color }} />
                      <span className="truncate text-muted-foreground">{f.name}</span>
                    </div>
                    <span className="shrink-0 font-medium text-foreground">{f.value} ({((f.value/128)*100).toFixed(1)}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* Operations Overview — no "all operations running smoothly" message */}
          <SectionCard title="Operations Overview (Today)">
            <div className="flex items-center justify-between px-2">
              {[
                { icon: Truck, label: "Departed", value: 156, delta: "8%", tone: "info", up: true },
                { icon: TruckIcon, label: "In Transit", value: 142, delta: "5%", tone: "success", up: true },
                { icon: Package, label: "Delivered", value: 112, delta: "12%", tone: "warning", up: true },
                { icon: AlertTriangle, label: "Delayed", value: 18, delta: "10%", tone: "danger", up: false },
              ].map((s, i, arr) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="flex flex-col items-center gap-2">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-full bg-${s.tone}/15`}>
                      <s.icon className={`h-5 w-5 text-${s.tone}`} />
                    </div>
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</span>
                    <span className="text-lg font-semibold">{s.value}</span>
                    <span className={`text-[11px] font-medium ${s.up ? "text-success" : "text-danger"}`}>{s.up ? "▲" : "▼"} {s.delta}</span>
                  </div>
                  {i < arr.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Delivery Performance — NO line chart */}
          <SectionCard
            title="Deliveries Performance"
            action={<select className="rounded-md border border-border bg-elevated/60 px-2 py-1 text-xs"><option>This Week</option><option>This Month</option></select>}
          >
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">On-Time Delivery</div>
              <div className="flex items-center gap-3">
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-success" style={{ width: "92.3%" }} />
                </div>
                <span className="text-sm font-semibold text-success">92.3%</span>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div><div className="text-[11px] uppercase tracking-wider text-muted-foreground">Total</div><div className="mt-1 text-xl font-semibold">142</div></div>
              <div><div className="text-[11px] uppercase tracking-wider text-muted-foreground">On-Time</div><div className="mt-1 text-xl font-semibold text-success">131</div></div>
              <div><div className="text-[11px] uppercase tracking-wider text-muted-foreground">Delayed</div><div className="mt-1 text-xl font-semibold text-danger">11</div></div>
            </div>
          </SectionCard>
        </div>

        {/* Third row */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {/* Alerts */}
          <SectionCard title="Alerts & Notifications" action={<button className="text-xs text-primary hover:underline" onClick={() => setAllAlertsOpen(true)}>View all (8)</button>}>
            <div className="space-y-2">
              {alerts.map((a) => {
                const Icon = alertIcons[a.icon];
                const recordKey = `alert-${a.id}`;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => openNotification(ALERT_RECORDS[recordKey])}
                    className="flex w-full items-start gap-3 rounded-lg p-2 -mx-2 text-left transition-colors hover:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-${a.type}/15`}>
                      <Icon className={`h-4 w-4 text-${a.type}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <div className="text-sm font-medium truncate">{a.title}</div>
                        <div className="text-[11px] text-muted-foreground shrink-0">{a.time}</div>
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{a.detail}</div>
                    </div>
                  </button>
                );
              })}
            </div>
            <button className="mt-3 flex items-center gap-1 text-xs text-primary hover:underline" onClick={() => setAllAlertsOpen(true)}>View all alerts <ArrowRight className="h-3 w-3" /></button>
          </SectionCard>

          {/* Priorities */}
          <SectionCard title="Top Priorities" action={<button className="text-xs text-primary hover:underline" onClick={() => setAllPrioritiesOpen(true)}>View all</button>}>
            <div className="space-y-2">
              {priorities.map((p) => {
                const Icon = priorityIcons[p.icon];
                const recordKey = `pri-${p.id}`;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => openNotification(PRIORITY_RECORDS[recordKey])}
                    className="flex w-full items-start gap-3 rounded-lg p-2 -mx-2 text-left transition-colors hover:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-${p.color}/15`}>
                      <Icon className={`h-4 w-4 text-${p.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <div className={`text-sm font-medium truncate text-${p.color}`}>{p.title}</div>
                        <div className="text-[11px] text-muted-foreground shrink-0">{p.time}</div>
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{p.detail}</div>
                    </div>
                  </button>
                );
              })}
            </div>
            <button className="mt-3 flex items-center gap-1 text-xs text-primary hover:underline" onClick={() => setAllPrioritiesOpen(true)}>View all priorities <ArrowRight className="h-3 w-3" /></button>
          </SectionCard>

          {/* Cost Summary */}
          <SectionCard title="Cost Summary (This Month)" >
            <div className="flex items-center gap-4">
              <div>
                <div className="text-3xl font-semibold">₦1.42B</div>
                <div className="mt-1 text-xs text-muted-foreground">Total Operating Cost</div>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <Pill tone="danger"><TrendingDown className="mr-1 h-3 w-3 inline" />6.7% vs last month</Pill>
                </div>
              </div>
              <div className="relative h-[140px] w-[140px] shrink-0">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={costBreakdown} innerRadius={44} outerRadius={64} paddingAngle={2.5} dataKey="value">
                      {costBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-4 space-y-1.5">
              {costBreakdown.map((c) => (
                <div key={c.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-sm" style={{ background: c.color }} />
                    <span className="text-muted-foreground">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">{c.value}%</span>
                    <span className="w-16 text-right font-medium">{c.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Notification slide-out panel */}
      <Sheet open={!!activeNotification} onOpenChange={(o) => { if (!o) setActiveNotification(null); }}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl overflow-y-auto scrollbar-thin border-l border-border bg-background/95 backdrop-blur p-0"
        >
          {activeNotification && (
            <NotificationPanel record={activeNotification} onOpen={handleRelatedOpen} />
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={allAlertsOpen} onOpenChange={setAllAlertsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>All Alerts ({alerts.length})</DialogTitle></DialogHeader>
          <div className="space-y-2 pt-2">
            {alerts.map((a) => {
              const Icon = alertIcons[a.icon];
              const tone = a.type === "danger" ? "text-danger bg-danger/15" : a.type === "warning" ? "text-warning bg-warning/15" : a.type === "purple" ? "text-purple bg-purple/15" : "text-info bg-info/15";
              return (
                <button
                  key={a.id}
                  className="flex w-full items-start gap-3 rounded-lg border border-border/60 bg-background/30 p-3 text-left hover:border-primary/40"
                  onClick={() => { setAllAlertsOpen(false); openNotification(ALERT_RECORDS[`alert-${a.id}`]); }}
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tone}`}><Icon className="h-4 w-4" /></span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{a.title}</div>
                    <div className="text-xs text-muted-foreground">{a.detail}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{a.time}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={allPrioritiesOpen} onOpenChange={setAllPrioritiesOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>All Priorities ({priorities.length})</DialogTitle></DialogHeader>
          <div className="space-y-2 pt-2">
            {priorities.map((p) => {
              const Icon = priorityIcons[p.icon];
              const tone = p.color === "danger" ? "text-danger bg-danger/15" : p.color === "warning" ? "text-warning bg-warning/15" : p.color === "success" ? "text-success bg-success/15" : "text-info bg-info/15";
              return (
                <button
                  key={p.id}
                  className="flex w-full items-start gap-3 rounded-lg border border-border/60 bg-background/30 p-3 text-left hover:border-primary/40"
                  onClick={() => { setAllPrioritiesOpen(false); openNotification(PRIORITY_RECORDS[`pri-${p.id}`]); }}
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tone}`}><Icon className="h-4 w-4" /></span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{p.title}</div>
                    <div className="text-xs text-muted-foreground">{p.detail}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{p.time}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
