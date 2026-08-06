import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { z } from "zod";
import type {
  addCommentSchema,
  assignRoleSchema,
  auditEventSchema,
  auditQuerySchema,
  commentQuerySchema,
  createNotificationSchema,
  fileQuerySchema,
  inviteMemberSchema,
  notificationQuerySchema,
  registerFileSchema,
} from "./schemas";

type Client = SupabaseClient<Database>;

function fail(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

/* ----------------------------- RBAC ----------------------------- */

export async function readRoles(supabase: Client, organizationId: string) {
  const { data, error } = await supabase
    .from("roles")
    .select("id, key, name, description, is_system, rank, organization_id")
    .or(`organization_id.is.null,organization_id.eq.${organizationId}`)
    .is("deleted_at", null)
    .order("rank");
  fail(error);
  return data ?? [];
}

export async function readPermissions(supabase: Client) {
  const { data, error } = await supabase
    .from("permissions")
    .select("id, key, module, label, description")
    .order("module");
  fail(error);
  return data ?? [];
}

export async function readMembers(supabase: Client, organizationId: string) {
  const { data, error } = await supabase
    .from("organization_members")
    .select(
      "id, user_id, status, is_owner, joined_at, created_at, profiles:user_id(id, full_name, email, phone, job_title, avatar_url)",
    )
    .eq("organization_id", organizationId)
    .is("deleted_at", null)
    .order("created_at");
  fail(error);

  const { data: assigned, error: rolesError } = await supabase
    .from("user_roles")
    .select("user_id, role_id, roles(key, name, rank)")
    .eq("organization_id", organizationId);
  fail(rolesError);

  return (data ?? []).map((member) => ({
    ...member,
    roles: (assigned ?? [])
      .filter((r) => r.user_id === member.user_id)
      .map((r) => r.roles as { key: string; name: string; rank: number } | null)
      .filter(Boolean),
  }));
}

export async function grantRole(
  supabase: Client,
  actorId: string,
  input: z.infer<typeof assignRoleSchema>,
) {
  const { data, error } = await supabase
    .from("user_roles")
    .insert({
      organization_id: input.organizationId,
      user_id: input.userId,
      role_id: input.roleId,
      created_by: actorId,
    })
    .select("id")
    .single();
  fail(error);
  return data;
}

export async function revokeRole(
  supabase: Client,
  input: z.infer<typeof assignRoleSchema>,
) {
  const { error } = await supabase
    .from("user_roles")
    .delete()
    .eq("organization_id", input.organizationId)
    .eq("user_id", input.userId)
    .eq("role_id", input.roleId);
  fail(error);
  return { ok: true };
}

/* -------------------------- Invitations -------------------------- */

export async function createInvitation(
  supabase: Client,
  actorId: string,
  input: z.infer<typeof inviteMemberSchema>,
) {
  let roleId = input.roleId ?? null;
  if (!roleId && input.roleKey) {
    const { data } = await supabase
      .from("roles")
      .select("id")
      .or(`organization_id.is.null,organization_id.eq.${input.organizationId}`)
      .eq("key", input.roleKey)
      .limit(1)
      .maybeSingle();
    roleId = data?.id ?? null;
  }

  const token = crypto.randomUUID().replace(/-/g, "");
  const { data, error } = await supabase
    .from("invitations")
    .insert({
      organization_id: input.organizationId,
      email: input.email.toLowerCase(),
      role_id: roleId,
      status: "pending",
      token,
      expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
      created_by: actorId,
    })
    .select("id, email, status, expires_at, token")
    .single();
  fail(error);
  return data;
}

export async function readInvitations(supabase: Client, organizationId: string) {
  const { data, error } = await supabase
    .from("invitations")
    .select("id, email, status, expires_at, accepted_at, created_at, roles(key, name)")
    .eq("organization_id", organizationId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });
  fail(error);
  return data ?? [];
}

export async function cancelInvitation(supabase: Client, invitationId: string) {
  const { error } = await supabase
    .from("invitations")
    .update({ status: "revoked" })
    .eq("id", invitationId);
  fail(error);
  return { ok: true };
}

/**
 * Accepts an invitation for the signed-in user. Uses the admin client because
 * the invitee is not yet a member, so org-scoped RLS cannot see the rows.
 */
export async function acceptInvitationForUser(
  admin: Client,
  userId: string,
  email: string | undefined,
  token: string,
) {
  const { data: invitation, error } = await admin
    .from("invitations")
    .select("*")
    .eq("token", token)
    .maybeSingle();
  fail(error);
  if (!invitation) throw new Error("Invitation not found");
  if (invitation.status !== "pending") throw new Error("Invitation is no longer valid");
  if (new Date(invitation.expires_at).getTime() < Date.now()) {
    await admin.from("invitations").update({ status: "expired" }).eq("id", invitation.id);
    throw new Error("Invitation has expired");
  }
  if (email && invitation.email.toLowerCase() !== email.toLowerCase()) {
    throw new Error("This invitation was issued to a different email address");
  }

  await admin.from("organization_members").upsert(
    {
      organization_id: invitation.organization_id,
      user_id: userId,
      status: "active",
      is_owner: false,
      invited_by: invitation.created_by,
      joined_at: new Date().toISOString(),
    },
    { onConflict: "organization_id,user_id" },
  );

  if (invitation.role_id) {
    await admin.from("user_roles").upsert(
      {
        organization_id: invitation.organization_id,
        user_id: userId,
        role_id: invitation.role_id,
      },
      { onConflict: "organization_id,user_id,role_id" },
    );
  }

  await admin
    .from("invitations")
    .update({ status: "accepted", accepted_at: new Date().toISOString(), accepted_by: userId })
    .eq("id", invitation.id);

  await admin
    .from("profiles")
    .update({ last_organization_id: invitation.organization_id })
    .eq("id", userId);

  return { organizationId: invitation.organization_id };
}

/* ----------------------------- Audit ----------------------------- */

export async function readAuditLogs(
  supabase: Client,
  input: z.infer<typeof auditQuerySchema>,
) {
  let query = supabase
    .from("audit_logs")
    .select("*")
    .eq("organization_id", input.organizationId)
    .order("created_at", { ascending: false })
    .limit(input.limit ?? 200);

  if (input.entityType) query = query.eq("entity_type", input.entityType);
  if (input.entityId) query = query.eq("entity_id", input.entityId);
  if (input.module) query = query.eq("module", input.module);

  const { data, error } = await query;
  fail(error);
  return data ?? [];
}

export async function writeAuditEvent(
  supabase: Client,
  actorId: string,
  input: z.infer<typeof auditEventSchema>,
) {
  const { error } = await supabase.from("audit_logs").insert({
    organization_id: input.organizationId,
    actor_id: actorId,
    module: input.module,
    entity_type: input.entityType,
    entity_id: input.entityId ?? null,
    entity_label: input.entityLabel ?? null,
    action: input.action,
    field_name: input.fieldName ?? null,
    previous_value: input.previousValue ?? null,
    new_value: input.newValue ?? null,
    notes: input.notes ?? null,
  });
  fail(error);
  return { ok: true };
}

/* -------------------------- Notifications -------------------------- */

export async function readNotifications(
  supabase: Client,
  userId: string,
  input: z.infer<typeof notificationQuerySchema>,
) {
  let query = supabase
    .from("notifications")
    .select("*")
    .eq("organization_id", input.organizationId)
    .or(`recipient_id.is.null,recipient_id.eq.${userId}`)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(input.limit ?? 50);
  if (input.status) query = query.eq("status", input.status);

  const { data, error } = await query;
  fail(error);
  return data ?? [];
}

export async function writeNotification(
  supabase: Client,
  actorId: string,
  input: z.infer<typeof createNotificationSchema>,
) {
  const { data, error } = await supabase
    .from("notifications")
    .insert({
      organization_id: input.organizationId,
      recipient_id: input.recipientId ?? null,
      type: input.type,
      priority: input.priority ?? "normal",
      status: "unread",
      title: input.title,
      body: input.body ?? null,
      module: input.module ?? null,
      entity_type: input.entityType ?? null,
      entity_id: input.entityId ?? null,
      action_url: input.actionUrl ?? null,
      assigned_to: input.assignedTo ?? null,
      created_by: actorId,
    })
    .select("*")
    .single();
  fail(error);
  return data;
}

export async function setNotificationStatus(
  supabase: Client,
  ids: string[],
  status: "unread" | "read" | "archived",
) {
  const { error } = await supabase
    .from("notifications")
    .update({ status, read_at: status === "read" ? new Date().toISOString() : null })
    .in("id", ids);
  fail(error);
  return { ok: true };
}

/* ------------------------------ Files ------------------------------ */

export async function writeFileRecord(
  supabase: Client,
  actorId: string,
  input: z.infer<typeof registerFileSchema>,
) {
  const { data, error } = await supabase
    .from("files")
    .insert({
      organization_id: input.organizationId,
      bucket_id: input.bucketId,
      storage_path: input.storagePath,
      file_name: input.fileName,
      mime_type: input.mimeType ?? null,
      size_bytes: input.sizeBytes ?? null,
      category: input.category ?? null,
      entity_type: input.entityType ?? null,
      entity_id: input.entityId ?? null,
      description: input.description ?? null,
      expires_on: input.expiresOn ?? null,
      uploaded_by: actorId,
      created_by: actorId,
    })
    .select("*")
    .single();
  fail(error);
  return data;
}

export async function readFiles(supabase: Client, input: z.infer<typeof fileQuerySchema>) {
  let query = supabase
    .from("files")
    .select("*")
    .eq("organization_id", input.organizationId)
    .is("deleted_at", null)
    .order("uploaded_at", { ascending: false })
    .limit(input.limit ?? 200);
  if (input.entityType) query = query.eq("entity_type", input.entityType);
  if (input.entityId) query = query.eq("entity_id", input.entityId);
  if (input.bucketId) query = query.eq("bucket_id", input.bucketId);

  const { data, error } = await query;
  fail(error);
  return data ?? [];
}

export async function softDeleteFile(supabase: Client, actorId: string, fileId: string) {
  const { error } = await supabase
    .from("files")
    .update({ deleted_at: new Date().toISOString(), updated_by: actorId })
    .eq("id", fileId);
  fail(error);
  return { ok: true };
}

export async function createSignedFileUrl(
  supabase: Client,
  bucketId: string,
  storagePath: string,
  expiresIn: number,
) {
  const { data, error } = await supabase.storage
    .from(bucketId)
    .createSignedUrl(storagePath, expiresIn);
  fail(error);
  return data;
}

/* ---------------------------- Comments ---------------------------- */

export async function readComments(
  supabase: Client,
  input: z.infer<typeof commentQuerySchema>,
) {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("organization_id", input.organizationId)
    .eq("entity_type", input.entityType)
    .eq("entity_id", input.entityId)
    .is("deleted_at", null)
    .order("created_at");
  fail(error);
  return data ?? [];
}

export async function writeComment(
  supabase: Client,
  actorId: string,
  input: z.infer<typeof addCommentSchema>,
) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, job_title")
    .eq("id", actorId)
    .maybeSingle();

  const { data, error } = await supabase
    .from("comments")
    .insert({
      organization_id: input.organizationId,
      entity_type: input.entityType,
      entity_id: input.entityId,
      parent_id: input.parentId ?? null,
      author_id: actorId,
      author_name: profile?.full_name ?? "Unknown user",
      author_role: profile?.job_title ?? null,
      body: input.body,
      mentions: input.mentions ?? [],
      created_by: actorId,
    })
    .select("*")
    .single();
  fail(error);
  return data;
}
