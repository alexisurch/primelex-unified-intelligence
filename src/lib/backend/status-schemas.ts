import { z } from "zod";

export const notificationStatusSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(200),
  status: z.enum(["unread", "read", "archived"]),
});
