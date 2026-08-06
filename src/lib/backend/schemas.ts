import { z } from "zod";

/**
 * Shared input schemas for the platform backend.
 * Kept out of *.functions.ts files so those stay thin wrappers.
 */

export const slugSchema = z
  .string()
  .min(3)
  .max(63)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens");

export const uuidSchema = z.string().uuid();

export const createOrganisationSchema = z.object({
  name: z.string().min(2).max(120),
  shortName: z.string().min(1).max(40).optional(),
  slug: slugSchema,
  industry: z.string().max(120).optional(),
  country: z.string().max(80).optional(),
  primaryColor: z.string().max(32).optional(),
  secondaryColor: z.string().max(32).optional(),
  logoUrl: z.string().max(2048).optional(),
  adminName: z.string().max(120).optional(),
  adminJobTitle: z.string().max(120).optional(),
});
export type CreateOrganisationInput = z.infer<typeof createOrganisationSchema>;

export const organisationIdSchema = z.object({ organizationId: uuidSchema });

export const updateBrandingSchema = z.object({
  organizationId: uuidSchema,
  logoUrl: z.string().max(2048).nullable().optional(),
  logoPath: z.string().max(1024).nullable().optional(),
  primaryColor: z.string().max(32).optional(),
  secondaryColor: z.string().max(32).optional(),
});

export const updateSettingsSchema = z.object({
  organizationId: uuidSchema,
  timezone: z.string().max(64).optional(),
  currency: z.string().max(8).optional(),
  distanceUnit: z.string().max(8).optional(),
  volumeUnit: z.string().max(16).optional(),
  dateFormat: z.string().max(32).optional(),
  fleetTrackingMode: z.enum(["manual", "automated"]).optional(),
  fuelVarianceReviewPct: z.number().min(0).max(100).optional(),
  fuelVarianceCriticalPct: z.number().min(0).max(100).optional(),
  learningBaselineEnabled: z.boolean().optional(),
});

export const workspaceLookupSchema = z.object({ slug: slugSchema });

export const inviteMemberSchema = z.object({
  organizationId: uuidSchema,
  email: z.string().email().max(255),
  roleId: uuidSchema.optional(),
  roleKey: z.string().max(64).optional(),
});

export const acceptInvitationSchema = z.object({ token: z.string().min(10).max(128) });

export const assignRoleSchema = z.object({
  organizationId: uuidSchema,
  userId: uuidSchema,
  roleId: uuidSchema,
});

export const auditQuerySchema = z.object({
  organizationId: uuidSchema,
  entityType: z.string().max(64).optional(),
  entityId: z.string().max(128).optional(),
  module: z.string().max(64).optional(),
  limit: z.number().int().min(1).max(500).optional(),
});

export const auditEventSchema = z.object({
  organizationId: uuidSchema,
  module: z.string().max(64),
  entityType: z.string().max(64),
  entityId: z.string().max(128).optional(),
  entityLabel: z.string().max(255).optional(),
  action: z.enum([
    "created",
    "updated",
    "deleted",
    "restored",
    "status_changed",
    "login",
    "logout",
    "exported",
    "approved",
    "rejected",
  ]),
  fieldName: z.string().max(64).optional(),
  previousValue: z.string().max(2000).optional(),
  newValue: z.string().max(2000).optional(),
  notes: z.string().max(2000).optional(),
});

export const notificationQuerySchema = z.object({
  organizationId: uuidSchema,
  status: z.enum(["unread", "read", "archived"]).optional(),
  limit: z.number().int().min(1).max(200).optional(),
});

export const createNotificationSchema = z.object({
  organizationId: uuidSchema,
  recipientId: uuidSchema.nullable().optional(),
  type: z.enum([
    "fuel_alert",
    "maintenance_alert",
    "incident_alert",
    "expiry_alert",
    "trip_alert",
    "dispatch_alert",
    "assignment",
    "mention",
    "system",
    "billing",
  ]),
  priority: z.enum(["low", "normal", "high", "critical"]).optional(),
  title: z.string().min(1).max(200),
  body: z.string().max(2000).optional(),
  module: z.string().max(64).optional(),
  entityType: z.string().max(64).optional(),
  entityId: z.string().max(128).optional(),
  actionUrl: z.string().max(1024).optional(),
  assignedTo: uuidSchema.nullable().optional(),
});

export const registerFileSchema = z.object({
  organizationId: uuidSchema,
  bucketId: z.enum([
    "truck-documents",
    "driver-documents",
    "incident-evidence",
    "maintenance-files",
    "organisation-assets",
    "profile-images",
    "client-documents",
    "trip-documents",
    "reports",
    "documents",
  ]),
  storagePath: z.string().min(3).max(1024),
  fileName: z.string().min(1).max(255),
  mimeType: z.string().max(128).optional(),
  sizeBytes: z.number().int().min(0).optional(),
  category: z.string().max(64).optional(),
  entityType: z.string().max(64).optional(),
  entityId: z.string().max(128).optional(),
  description: z.string().max(1000).optional(),
  expiresOn: z.string().max(32).optional(),
});

export const fileQuerySchema = z.object({
  organizationId: uuidSchema,
  entityType: z.string().max(64).optional(),
  entityId: z.string().max(128).optional(),
  bucketId: z.string().max(64).optional(),
  limit: z.number().int().min(1).max(500).optional(),
});

export const signedUrlSchema = z.object({
  bucketId: z.string().max(64),
  storagePath: z.string().max(1024),
  expiresIn: z.number().int().min(30).max(60 * 60 * 24).optional(),
});

export const commentQuerySchema = z.object({
  organizationId: uuidSchema,
  entityType: z.string().max(64),
  entityId: z.string().max(128),
});

export const addCommentSchema = z.object({
  organizationId: uuidSchema,
  entityType: z.string().max(64),
  entityId: z.string().max(128),
  parentId: uuidSchema.nullable().optional(),
  body: z.string().min(1).max(5000),
  mentions: z.array(z.string().max(120)).max(20).optional(),
});
