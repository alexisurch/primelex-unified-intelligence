import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  addCommentSchema,
  commentQuerySchema,
  fileQuerySchema,
  registerFileSchema,
  signedUrlSchema,
  uuidSchema,
} from "./schemas";
import {
  createSignedFileUrl,
  readComments,
  readFiles,
  softDeleteFile,
  writeComment,
  writeFileRecord,
} from "./platform.server";

export const registerFile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => registerFileSchema.parse(input))
  .handler(async ({ data, context }) =>
    writeFileRecord(context.supabase, context.userId, data),
  );

export const listFiles = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => fileQuerySchema.parse(input))
  .handler(async ({ data, context }) => readFiles(context.supabase, data));

export const deleteFile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ({
    fileId: uuidSchema.parse((input as { fileId: string }).fileId),
  }))
  .handler(async ({ data, context }) =>
    softDeleteFile(context.supabase, context.userId, data.fileId),
  );

export const getSignedFileUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => signedUrlSchema.parse(input))
  .handler(async ({ data, context }) =>
    createSignedFileUrl(context.supabase, data.bucketId, data.storagePath, data.expiresIn ?? 3600),
  );

export const listComments = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => commentQuerySchema.parse(input))
  .handler(async ({ data, context }) => readComments(context.supabase, data));

export const addComment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => addCommentSchema.parse(input))
  .handler(async ({ data, context }) => writeComment(context.supabase, context.userId, data));
