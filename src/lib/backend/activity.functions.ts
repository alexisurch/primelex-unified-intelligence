import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  auditEventSchema,
  auditQuerySchema,
  createNotificationSchema,
  notificationQuerySchema,
} from "./schemas";
import {
  readAuditLogs,
  readNotifications,
  setNotificationStatus,
  writeAuditEvent,
  writeNotification,
} from "./platform.server";
import { notificationStatusSchema } from "./status-schemas";

export const listAuditLogs = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => auditQuerySchema.parse(input))
  .handler(async ({ data, context }) => readAuditLogs(context.supabase, data));

export const recordAuditEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => auditEventSchema.parse(input))
  .handler(async ({ data, context }) =>
    writeAuditEvent(context.supabase, context.userId, data),
  );

export const listNotifications = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => notificationQuerySchema.parse(input))
  .handler(async ({ data, context }) =>
    readNotifications(context.supabase, context.userId, data),
  );

export const createNotification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => createNotificationSchema.parse(input))
  .handler(async ({ data, context }) =>
    writeNotification(context.supabase, context.userId, data),
  );

export const updateNotificationStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => notificationStatusSchema.parse(input))
  .handler(async ({ data, context }) =>
    setNotificationStatus(context.supabase, data.ids, data.status),
  );
