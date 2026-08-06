import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  acceptInvitationSchema,
  assignRoleSchema,
  inviteMemberSchema,
  organisationIdSchema,
  uuidSchema,
} from "./schemas";
import {
  acceptInvitationForUser,
  cancelInvitation,
  createInvitation,
  grantRole,
  readInvitations,
  readMembers,
  readPermissions,
  readRoles,
  revokeRole,
} from "./platform.server";

export const listRoles = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => organisationIdSchema.parse(input))
  .handler(async ({ data, context }) => readRoles(context.supabase, data.organizationId));

export const listPermissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => readPermissions(context.supabase));

export const listMembers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => organisationIdSchema.parse(input))
  .handler(async ({ data, context }) => readMembers(context.supabase, data.organizationId));

export const assignRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => assignRoleSchema.parse(input))
  .handler(async ({ data, context }) => grantRole(context.supabase, context.userId, data));

export const removeRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => assignRoleSchema.parse(input))
  .handler(async ({ data, context }) => revokeRole(context.supabase, data));

export const inviteMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => inviteMemberSchema.parse(input))
  .handler(async ({ data, context }) =>
    createInvitation(context.supabase, context.userId, data),
  );

export const listInvitations = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => organisationIdSchema.parse(input))
  .handler(async ({ data, context }) => readInvitations(context.supabase, data.organizationId));

export const revokeInvitation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ({ invitationId: uuidSchema.parse((input as { invitationId: string }).invitationId) }))
  .handler(async ({ data, context }) => cancelInvitation(context.supabase, data.invitationId));

/** Joins the signed-in user to an organisation using an invitation token. */
export const acceptInvitation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => acceptInvitationSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = typeof context.claims["email"] === "string" ? context.claims["email"] : undefined;
    return acceptInvitationForUser(supabaseAdmin, context.userId, email, data.token);
  });
