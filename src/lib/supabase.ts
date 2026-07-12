import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* ------------------------------------------------------------------ */
/* Types mirroring the Supabase schema                                 */
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
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Fetch all comments for an entity, ordered oldest-first. */
export async function fetchComments(
  entityType: string,
  entityId: string,
): Promise<DbComment[]> {
  const { data, error } = await supabase
    .from("operational_comments")
    .select("*")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as DbComment[];
}

/** Add a new comment. */
export async function addComment(
  payload: Omit<DbComment, "id" | "created_at">,
): Promise<DbComment> {
  const { data, error } = await supabase
    .from("operational_comments")
    .insert(payload)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data as DbComment;
}

/** Fetch all audit entries for an entity, newest-first. */
export async function fetchAuditTrail(
  entityType?: string,
  entityId?: string,
  module?: string,
  limit = 200,
): Promise<DbAuditEntry[]> {
  let q = supabase
    .from("audit_trail")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (entityType) q = q.eq("entity_type", entityType);
  if (entityId) q = q.eq("entity_id", entityId);
  if (module) q = q.eq("module", module);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as DbAuditEntry[];
}

/** Append a single audit entry (fire-and-forget friendly). */
export async function appendAudit(
  entry: Omit<DbAuditEntry, "id" | "created_at">,
): Promise<void> {
  await supabase.from("audit_trail").insert(entry);
}

/** Fetch open action items, sorted by priority then date. */
export async function fetchActionItems(
  statusFilter?: DbActionItem["status"][],
): Promise<DbActionItem[]> {
  let q = supabase
    .from("action_items")
    .select("*")
    .order("created_at", { ascending: false });
  if (statusFilter && statusFilter.length > 0) {
    q = q.in("status", statusFilter);
  }
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as DbActionItem[];
}

/** Resolve or dismiss an action item. */
export async function updateActionStatus(
  id: string,
  status: DbActionItem["status"],
): Promise<void> {
  await supabase
    .from("action_items")
    .update({ status, resolved_at: status === "resolved" ? new Date().toISOString() : null })
    .eq("id", id);
}

/** Insert a new action item. */
export async function createActionItem(
  item: Omit<DbActionItem, "id" | "created_at" | "resolved_at">,
): Promise<void> {
  await supabase.from("action_items").insert(item);
}
