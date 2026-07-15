/**
 * Frontend-only action items store for the Action Center.
 * All data lives in-memory on the client; no database involved.
 * When the backend build begins, swap these implementations
 * with real supabase-js calls. Function signatures stay identical.
 */

export interface ActionItem {
  id: string;
  title: string;
  detail: string;
  priority: "High" | "Medium" | "Low";
  category: string;
  entity_type: string | null;
  entity_id: string | null;
  entity_label: string | null;
  due_date: string | null;
  status: "open" | "in_progress" | "resolved" | "dismissed";
  assigned_to: string;
  module: string;
  auto_generated: boolean;
  created_at: string;
  resolved_at: string | null;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3600000).toISOString();
}

function minsAgo(m: number): string {
  return new Date(Date.now() - m * 60000).toISOString();
}

/* ------------------------------------------------------------------ */
/* Seed data (in-memory, resets on page reload)                       */
/* ------------------------------------------------------------------ */

let _actionItems: ActionItem[] = [
  { id: "ai-1", title: "Driver license expiring", detail: "Driver Tunde A. license expires in 7 days. Renewal must be initiated immediately to avoid compliance breach.", priority: "High", category: "License Expiry", entity_type: "driver", entity_id: "DRV-004", entity_label: "Tunde Adeyemi", due_date: daysFromNow(7), status: "open", assigned_to: "Compliance Team", module: "Fleet", auto_generated: true, created_at: minsAgo(10), resolved_at: null },
  { id: "ai-2", title: "Insurance expiring — GGE 543RT", detail: "Insurance for GGE 543RT expires in 5 days. Vehicle must be grounded if not renewed before expiry date.", priority: "High", category: "Insurance Expiry", entity_type: "truck", entity_id: "TRK-1005", entity_label: "GGE 543RT", due_date: daysFromNow(5), status: "open", assigned_to: "Finance Team", module: "Fleet", auto_generated: true, created_at: minsAgo(15), resolved_at: null },
  { id: "ai-3", title: "Fuel cost variance — 8.4% above target", detail: "Fleet-wide fuel cost increased 8.4% vs last week. Three trucks identified as primary contributors. Investigation required.", priority: "High", category: "Fuel Review", entity_type: "fuel", entity_id: null, entity_label: "Fleet-wide", due_date: daysFromNow(1), status: "open", assigned_to: "Fleet Manager", module: "Fuel Intelligence", auto_generated: true, created_at: minsAgo(20), resolved_at: null },
  { id: "ai-4", title: "Trip TRP-7382 delayed beyond SLA", detail: "Trip TRP-7382 to ABC Stores is delayed beyond the service level agreement window. Client notification required.", priority: "High", category: "Delayed Trip", entity_type: "trip", entity_id: "TRP-7382", entity_label: "Trip TRP-7382", due_date: daysFromNow(0), status: "open", assigned_to: "Operations Team", module: "Trips", auto_generated: true, created_at: minsAgo(5), resolved_at: null },
  { id: "ai-5", title: "Maintenance due — KJA 89XY", detail: "Truck KJA 89XY is due for scheduled maintenance in 3 days. Book workshop slot to avoid unplanned downtime.", priority: "Medium", category: "Maintenance Due", entity_type: "truck", entity_id: "TRK-1002", entity_label: "KJA 89XY", due_date: daysFromNow(3), status: "open", assigned_to: "Maintenance Team", module: "Maintenance", auto_generated: true, created_at: minsAgo(25), resolved_at: null },
  { id: "ai-6", title: "On-time delivery below target", detail: "11 deliveries delayed this week. Current rate is 89.2%, below the 95% target. Review affected routes.", priority: "Medium", category: "KPI Below Target", entity_type: "kpi", entity_id: null, entity_label: "Delivery KPI", due_date: daysFromNow(2), status: "open", assigned_to: "Operations Lead", module: "Operations", auto_generated: true, created_at: minsAgo(25), resolved_at: null },
  { id: "ai-7", title: "10 vehicles due for scheduled service", detail: "10 vehicles are due or overdue for scheduled maintenance this week. 4 are already past the mileage threshold.", priority: "Medium", category: "Maintenance Due", entity_type: "maintenance", entity_id: null, entity_label: "Fleet Maintenance", due_date: daysFromNow(7), status: "open", assigned_to: "Maintenance Supervisor", module: "Maintenance", auto_generated: true, created_at: minsAgo(60), resolved_at: null },
  { id: "ai-8", title: "5 documents expiring within 7 days", detail: "5 documents and permits are expiring within the next 7 days. Three are vehicle permits required for interstate routes.", priority: "Low", category: "Document Expiry", entity_type: "document", entity_id: null, entity_label: "Fleet Documents", due_date: daysFromNow(7), status: "open", assigned_to: "Compliance Officer", module: "Documents", auto_generated: true, created_at: hoursAgo(3), resolved_at: null },
  { id: "ai-9", title: "Compliance score below 95% target", detail: "Overall compliance score is 94%. Review expiring permits to reach target. 5 items need immediate renewal.", priority: "Low", category: "Compliance", entity_type: "compliance", entity_id: null, entity_label: "Fleet Compliance", due_date: daysFromNow(14), status: "open", assigned_to: "Compliance Officer", module: "Documents", auto_generated: true, created_at: hoursAgo(3), resolved_at: null },
];

/* ------------------------------------------------------------------ */
/* API (sync wrappers to keep async signature for future swap)        */
/* ------------------------------------------------------------------ */

export async function fetchActionItems(
  statusFilter?: ActionItem["status"][],
): Promise<ActionItem[]> {
  let results = [..._actionItems];
  if (statusFilter && statusFilter.length > 0) {
    results = results.filter((i) => statusFilter.includes(i.status));
  }
  return results.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export function updateActionStatus(
  id: string,
  status: ActionItem["status"],
): void {
  const item = _actionItems.find((i) => i.id === id);
  if (item) {
    item.status = status;
    item.resolved_at = status === "resolved" ? new Date().toISOString() : null;
  }
}

export function createActionItem(
  item: Omit<ActionItem, "id" | "created_at" | "resolved_at">,
): void {
  _actionItems = [
    {
      ...item,
      id: `ai-${Date.now()}`,
      created_at: new Date().toISOString(),
      resolved_at: null,
    },
    ..._actionItems,
  ];
}
