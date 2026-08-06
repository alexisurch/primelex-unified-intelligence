import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  createOrganisationSchema,
  organisationIdSchema,
  updateBrandingSchema,
  updateSettingsSchema,
  workspaceLookupSchema,
} from "./schemas";
import {
  provisionOrganisation,
  readOrganisationContext,
  readMyOrganisations,
  writeBranding,
  writeSettings,
  readWorkspaceBySlug,
} from "./organisations.server";

/** Creates an organisation, its config rows and makes the caller its owner. */
export const createOrganisation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => createOrganisationSchema.parse(input))
  .handler(async ({ data, context }) =>
    provisionOrganisation(context.supabase, context.userId, data),
  );

/** Organisations the signed-in user belongs to. */
export const listMyOrganisations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => readMyOrganisations(context.supabase, context.userId));

/** Full tenant context: organisation, branding, settings, subscription, permissions. */
export const getOrganisationContext = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => organisationIdSchema.parse(input))
  .handler(async ({ data, context }) =>
    readOrganisationContext(context.supabase, context.userId, data.organizationId),
  );

export const updateOrganisationBranding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => updateBrandingSchema.parse(input))
  .handler(async ({ data, context }) => writeBranding(context.supabase, data));

export const updateOrganisationSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => updateSettingsSchema.parse(input))
  .handler(async ({ data, context }) => writeSettings(context.supabase, data));

/**
 * Public workspace lookup used by /{organisation}/login.
 * Returns only the slug, display name and branding — never member data.
 */
export const lookupWorkspace = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => workspaceLookupSchema.parse(input))
  .handler(async ({ data }) => {
    const { createPublicServerClient } = await import("./public-client.server");
    return readWorkspaceBySlug(createPublicServerClient(), data.slug);
  });
