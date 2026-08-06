import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { z } from "zod";
import type {
  createOrganisationSchema,
  updateBrandingSchema,
  updateSettingsSchema,
} from "./schemas";

type Client = SupabaseClient<Database>;

function unwrap<T>(result: { data: T; error: { message: string } | null }): T {
  if (result.error) throw new Error(result.error.message);
  return result.data;
}

export async function provisionOrganisation(
  supabase: Client,
  userId: string,
  input: z.infer<typeof createOrganisationSchema>,
) {
  const org = unwrap(
    await supabase
      .from("organizations")
      .insert({
        slug: input.slug,
        name: input.name,
        short_name: input.shortName ?? input.name,
        industry: input.industry ?? null,
        country: input.country ?? null,
        status: "trial",
        created_by: userId,
        updated_by: userId,
      })
      .select("*")
      .single(),
  );

  await supabase
    .from("profiles")
    .update({
      full_name: input.adminName ?? undefined,
      job_title: input.adminJobTitle ?? undefined,
      last_organization_id: org.id,
    })
    .eq("id", userId);

  const ownerRole = unwrap(
    await supabase
      .from("roles")
      .select("id")
      .is("organization_id", null)
      .eq("key", "owner")
      .single(),
  );

  // The caller must be an active member before org-scoped RLS lets them write config rows.
  unwrap(
    await supabase
      .from("organization_members")
      .insert({
        organization_id: org.id,
        user_id: userId,
        status: "active",
        is_owner: true,
        joined_at: new Date().toISOString(),
        created_by: userId,
      })
      .select("id")
      .single(),
  );

  unwrap(
    await supabase
      .from("user_roles")
      .insert({ organization_id: org.id, user_id: userId, role_id: ownerRole.id, created_by: userId })
      .select("id")
      .single(),
  );

  await supabase.from("organization_branding").insert({
    organization_id: org.id,
    logo_url: input.logoUrl ?? null,
    primary_color: input.primaryColor ?? "#3b82f6",
    secondary_color: input.secondaryColor ?? "#8b5cf6",
    updated_by: userId,
  });
  await supabase
    .from("organization_settings")
    .insert({ organization_id: org.id, updated_by: userId });
  await supabase
    .from("organization_preferences")
    .insert({ organization_id: org.id, user_id: null });
  await supabase
    .from("organization_billing")
    .insert({ organization_id: org.id, billing_name: input.name, updated_by: userId });
  await supabase.from("subscriptions").insert({
    organization_id: org.id,
    status: "trialing",
    trial_ends_at: new Date(Date.now() + 14 * 86400000).toISOString(),
    current_period_start: new Date().toISOString(),
    current_period_end: new Date(Date.now() + 30 * 86400000).toISOString(),
    created_by: userId,
  });
  await supabase.from("workspaces").insert({
    organization_id: org.id,
    slug: input.slug,
    name: input.name,
    is_primary: true,
    created_by: userId,
  });

  return org;
}

export async function readMyOrganisations(supabase: Client, userId: string) {
  const memberships = unwrap(
    await supabase
      .from("organization_members")
      .select("organization_id, is_owner, status, organizations(id, slug, name, short_name, status, is_demo)")
      .eq("user_id", userId)
      .eq("status", "active")
      .is("deleted_at", null),
  );
  return memberships;
}

export async function readOrganisationContext(
  supabase: Client,
  userId: string,
  organizationId: string,
) {
  const [organisation, branding, settings, subscription, workspace, permissions, roles] =
    await Promise.all([
      supabase.from("organizations").select("*").eq("id", organizationId).maybeSingle(),
      supabase
        .from("organization_branding")
        .select("*")
        .eq("organization_id", organizationId)
        .maybeSingle(),
      supabase
        .from("organization_settings")
        .select("*")
        .eq("organization_id", organizationId)
        .maybeSingle(),
      supabase
        .from("subscriptions")
        .select("*")
        .eq("organization_id", organizationId)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("workspaces")
        .select("*")
        .eq("organization_id", organizationId)
        .eq("is_primary", true)
        .maybeSingle(),
      supabase
        .from("user_roles")
        .select("role_id, roles(key, name, role_permissions(permissions(key)))")
        .eq("organization_id", organizationId)
        .eq("user_id", userId),
      supabase
        .from("roles")
        .select("id, key, name, description, is_system, rank")
        .or(`organization_id.is.null,organization_id.eq.${organizationId}`)
        .order("rank"),
    ]);

  const permissionKeys = new Set<string>();
  for (const row of permissions.data ?? []) {
    const role = row.roles as
      | { role_permissions?: { permissions?: { key: string } | null }[] }
      | null;
    for (const rp of role?.role_permissions ?? []) {
      if (rp.permissions?.key) permissionKeys.add(rp.permissions.key);
    }
  }

  return {
    organisation: organisation.data,
    branding: branding.data,
    settings: settings.data,
    subscription: subscription.data,
    workspace: workspace.data,
    roles: (permissions.data ?? []).map(
      (r) => (r.roles as { key: string; name: string } | null)?.key ?? null,
    ),
    availableRoles: roles.data ?? [],
    permissions: [...permissionKeys],
  };
}

export async function writeBranding(
  supabase: Client,
  input: z.infer<typeof updateBrandingSchema>,
) {
  return unwrap(
    await supabase
      .from("organization_branding")
      .upsert(
        {
          organization_id: input.organizationId,
          logo_url: input.logoUrl ?? null,
          logo_path: input.logoPath ?? null,
          ...(input.primaryColor ? { primary_color: input.primaryColor } : {}),
          ...(input.secondaryColor ? { secondary_color: input.secondaryColor } : {}),
        },
        { onConflict: "organization_id" },
      )
      .select("*")
      .single(),
  );
}

export async function writeSettings(
  supabase: Client,
  input: z.infer<typeof updateSettingsSchema>,
) {
  return unwrap(
    await supabase
      .from("organization_settings")
      .upsert(
        {
          organization_id: input.organizationId,
          ...(input.timezone ? { timezone: input.timezone } : {}),
          ...(input.currency ? { currency: input.currency } : {}),
          ...(input.distanceUnit ? { distance_unit: input.distanceUnit } : {}),
          ...(input.volumeUnit ? { volume_unit: input.volumeUnit } : {}),
          ...(input.dateFormat ? { date_format: input.dateFormat } : {}),
          ...(input.fleetTrackingMode ? { fleet_tracking_mode: input.fleetTrackingMode } : {}),
          ...(input.fuelVarianceReviewPct !== undefined
            ? { fuel_variance_review_pct: input.fuelVarianceReviewPct }
            : {}),
          ...(input.fuelVarianceCriticalPct !== undefined
            ? { fuel_variance_critical_pct: input.fuelVarianceCriticalPct }
            : {}),
          ...(input.learningBaselineEnabled !== undefined
            ? { learning_baseline_enabled: input.learningBaselineEnabled }
            : {}),
        },
        { onConflict: "organization_id" },
      )
      .select("*")
      .single(),
  );
}

/** Public: slug -> workspace name + branding for the employee login screen. */
export async function readWorkspaceBySlug(supabase: Client, slug: string) {
  const workspace = await supabase
    .from("workspaces")
    .select("slug, name, organization_id")
    .ilike("slug", slug)
    .is("deleted_at", null)
    .maybeSingle();

  if (workspace.error) throw new Error(workspace.error.message);
  if (!workspace.data) return null;

  const [organisation, branding] = await Promise.all([
    supabase
      .from("organizations")
      .select("id, slug, name, short_name, industry, status")
      .eq("id", workspace.data.organization_id)
      .maybeSingle(),
    supabase
      .from("organization_branding")
      .select("logo_url, primary_color, secondary_color")
      .eq("organization_id", workspace.data.organization_id)
      .maybeSingle(),
  ]);

  return {
    slug: workspace.data.slug,
    name: workspace.data.name,
    organisation: organisation.data,
    branding: branding.data,
  };
}
