/**
 * Mock data layer — replaces Supabase for UI development.
 * When backend integration is ready, swap these implementations
 * with real supabase-js calls. Component signatures stay identical.
 */

/* ------------------------------------------------------------------ */
/* Types (mirror what the real DB schema would produce)                */
/* ------------------------------------------------------------------ */

export interface DbComment {
  id: string;
  entity_type: string;
  entity_id: string;
  parent_id: string | null;
  author_name: string;
  author_role: string;
  author_initials: string;
  body: string;
  mentions: string[];
  attachments: DbAttachment[];
  created_at: string;
}

export interface DbAttachment {
  name: string;
  url: string;
  type: string;
  size: string;
}

export interface DbAuditEntry {
  id: string;
  entity_type: string;
  entity_id: string;
  entity_label: string;
  action: string;
  field_name: string | null;
  previous_value: string | null;
  new_value: string | null;
  changed_by: string;
  changed_by_role: string;
  module: string;
  notes: string | null;
  created_at: string;
}

export interface DbActionItem {
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
/* In-memory stores (survive the session, reset on page reload)       */
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

// Keyed by `${entityType}:${entityId}`
const _comments: Map<string, DbComment[]> = new Map([
  ["trip:TRP-001", [
    {
      id: "c1", entity_type: "trip", entity_id: "TRP-001", parent_id: null,
      author_name: "Bola Adewale", author_role: "Fleet Manager", author_initials: "BA",
      body: "Confirmed departure with driver. Route has heavy traffic near Ojota — driver advised to use alternate via Ikorodu Road.",
      mentions: [], attachments: [], created_at: hoursAgo(3),
    },
    {
      id: "c2", entity_type: "trip", entity_id: "TRP-001", parent_id: null,
      author_name: "Chinedu Okafor", author_role: "Fleet Manager", author_initials: "CO",
      body: "@Bola Adewale Good call. I've also notified the client about the likely 40-minute delay.",
      mentions: ["Bola Adewale"], attachments: [], created_at: hoursAgo(2),
    },
    {
      id: "c3", entity_type: "trip", entity_id: "TRP-001", parent_id: "c1",
      author_name: "Adeleke Oladipo", author_role: "Fleet Manager", author_initials: "AO",
      body: "Driver confirmed he's on the alternate route. ETA updated to 15:30.",
      mentions: [], attachments: [], created_at: hoursAgo(1),
    },
  ]],
  ["incident:INC-001", [
    {
      id: "i1", entity_type: "incident", entity_id: "INC-001", parent_id: null,
      author_name: "Aisha Musa", author_role: "Fleet Manager", author_initials: "AM",
      body: "Incident reported. Police report obtained. Driver and cargo are safe.",
      mentions: [], attachments: [{ name: "police_report.pdf", url: "#", type: "pdf", size: "240 KB" }],
      created_at: hoursAgo(5),
    },
    {
      id: "i2", entity_type: "incident", entity_id: "INC-001", parent_id: null,
      author_name: "Compliance Team", author_role: "Compliance", author_initials: "CT",
      body: "Insurance claim initiated. Reference number: CLM-2026-4421.",
      mentions: [], attachments: [], created_at: hoursAgo(4),
    },
  ]],
  ["truck:TRK-001", [
    {
      id: "t1", entity_type: "truck", entity_id: "TRK-001", parent_id: null,
      author_name: "Maintenance Team", author_role: "Maintenance", author_initials: "MT",
      body: "Engine oil and filters replaced. Brake pads inspected — front pads at 40%, recommended replacement at next service.",
      mentions: [], attachments: [], created_at: hoursAgo(48),
    },
  ]],
]);

const _auditEntries: DbAuditEntry[] = [
  { id: "a1", entity_type: "trip", entity_id: "TRP-001", entity_label: "Trip TRP-001", action: "Created", field_name: null, previous_value: null, new_value: null, changed_by: "Adeleke Oladipo", changed_by_role: "Fleet Manager", module: "Trips", notes: "New trip created via Dispatch Center", created_at: hoursAgo(6) },
  { id: "a2", entity_type: "trip", entity_id: "TRP-001", entity_label: "Trip TRP-001", action: "Status Changed", field_name: "status", previous_value: "Scheduled", new_value: "In Transit", changed_by: "Bola Adewale", changed_by_role: "Fleet Manager", module: "Trips", notes: null, created_at: hoursAgo(5) },
  { id: "a3", entity_type: "truck", entity_id: "TRK-002", entity_label: "Truck KJA 89XY", action: "Status Changed", field_name: "status", previous_value: "Idle", new_value: "On The Road", changed_by: "System", changed_by_role: "System", module: "Fleet", notes: "Auto-updated on trip start", created_at: hoursAgo(5) },
  { id: "a4", entity_type: "driver", entity_id: "DRV-004", entity_label: "Tunde Adeyemi", action: "Updated", field_name: "licenseExpiry", previous_value: "2026-08-01", new_value: "2027-08-01", changed_by: "Compliance Team", changed_by_role: "Compliance", module: "Drivers", notes: "License renewed", created_at: hoursAgo(24) },
  { id: "a5", entity_type: "maintenance", entity_id: "MNT-014", entity_label: "Maintenance MNT-014", action: "Created", field_name: null, previous_value: null, new_value: null, changed_by: "Chinedu Okafor", changed_by_role: "Fleet Manager", module: "Maintenance", notes: "Scheduled service logged for LKJ 123AB", created_at: hoursAgo(26) },
  { id: "a6", entity_type: "incident", entity_id: "INC-001", entity_label: "Incident INC-001", action: "Escalated", field_name: "status", previous_value: "Open", new_value: "Investigating", changed_by: "Aisha Musa", changed_by_role: "Fleet Manager", module: "Incidents", notes: "Escalated to investigation team", created_at: hoursAgo(4) },
  { id: "a7", entity_type: "fuel", entity_id: "FUE-007", entity_label: "Fuel Assignment FUE-007", action: "Created", field_name: null, previous_value: null, new_value: null, changed_by: "Musa Yakubu", changed_by_role: "Fleet Manager", module: "Fuel Intelligence", notes: null, created_at: hoursAgo(8) },
  { id: "a8", entity_type: "trip", entity_id: "TRP-003", entity_label: "Trip TRP-003", action: "Status Changed", field_name: "status", previous_value: "In Transit", new_value: "Delivered", changed_by: "System", changed_by_role: "System", module: "Trips", notes: "Delivery confirmed by driver", created_at: hoursAgo(2) },
  { id: "a9", entity_type: "route", entity_id: "RT-007", entity_label: "Route Lagos–Ibadan", action: "Updated", field_name: "avgFuelLKm", previous_value: "0.38", new_value: "0.41", changed_by: "System", changed_by_role: "System", module: "Routes", notes: "Auto-recalculated after 3 new trip completions", created_at: hoursAgo(10) },
  { id: "a10", entity_type: "user", entity_id: "USR-005", entity_label: "New User Invite", action: "Created", field_name: null, previous_value: null, new_value: null, changed_by: "Adeleke Oladipo", changed_by_role: "Administrator", module: "Users", notes: "Invited kemi.ade@primelex.com as Dispatcher", created_at: hoursAgo(30) },
  { id: "a11", entity_type: "truck", entity_id: "TRK-008", entity_label: "Truck GGE 543RT", action: "Status Changed", field_name: "status", previous_value: "On The Road", new_value: "Maintenance", changed_by: "Maintenance Team", changed_by_role: "Maintenance", module: "Fleet", notes: null, created_at: hoursAgo(12) },
  { id: "a12", entity_type: "client", entity_id: "CLT-002", entity_label: "Dangote Industries", action: "Updated", field_name: "contact", previous_value: "Emeka Eze", new_value: "Emeka Eze (Senior)", changed_by: "Adeleke Oladipo", changed_by_role: "Fleet Manager", module: "Clients", notes: null, created_at: hoursAgo(36) },
];

const _actionItems: DbActionItem[] = [
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
/* Comment helpers                                                     */
/* ------------------------------------------------------------------ */

function commentsKey(entityType: string, entityId: string) {
  return `${entityType}:${entityId}`;
}

export async function fetchComments(
  entityType: string,
  entityId: string,
): Promise<DbComment[]> {
  return _comments.get(commentsKey(entityType, entityId)) ?? [];
}

export async function addComment(
  payload: Omit<DbComment, "id" | "created_at">,
): Promise<DbComment> {
  const comment: DbComment = {
    ...payload,
    id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    created_at: new Date().toISOString(),
  };
  const key = commentsKey(payload.entity_type, payload.entity_id);
  const existing = _comments.get(key) ?? [];
  _comments.set(key, [...existing, comment]);
  return comment;
}

/* ------------------------------------------------------------------ */
/* Audit trail helpers                                                 */
/* ------------------------------------------------------------------ */

export async function fetchAuditTrail(
  entityType?: string,
  entityId?: string,
  module?: string,
  limit = 200,
): Promise<DbAuditEntry[]> {
  let results = [..._auditEntries];
  if (entityType) results = results.filter((e) => e.entity_type === entityType);
  if (entityId) results = results.filter((e) => e.entity_id === entityId);
  if (module) results = results.filter((e) => e.module === module);
  return results
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}

export async function appendAudit(
  entry: Omit<DbAuditEntry, "id" | "created_at">,
): Promise<void> {
  _auditEntries.unshift({
    ...entry,
    id: `a-${Date.now()}`,
    created_at: new Date().toISOString(),
  });
}

/* ------------------------------------------------------------------ */
/* Action item helpers                                                 */
/* ------------------------------------------------------------------ */

export async function fetchActionItems(
  statusFilter?: DbActionItem["status"][],
): Promise<DbActionItem[]> {
  let results = [..._actionItems];
  if (statusFilter && statusFilter.length > 0) {
    results = results.filter((i) => statusFilter.includes(i.status));
  }
  return results.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export async function updateActionStatus(
  id: string,
  status: DbActionItem["status"],
): Promise<void> {
  const item = _actionItems.find((i) => i.id === id);
  if (item) {
    item.status = status;
    item.resolved_at = status === "resolved" ? new Date().toISOString() : null;
  }
}

export async function createActionItem(
  item: Omit<DbActionItem, "id" | "created_at" | "resolved_at">,
): Promise<void> {
  _actionItems.unshift({
    ...item,
    id: `ai-${Date.now()}`,
    created_at: new Date().toISOString(),
    resolved_at: null,
  });
}
