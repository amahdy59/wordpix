import { z } from "zod";

export const imageReportReasonSchema = z.enum([
  "mismatch",
  "unclear",
  "cropped",
  "answerVisible",
  "unavailable",
]);
export type ImageReportReason = z.infer<typeof imageReportReasonSchema>;
export const imageReportContextSchema = z
  .object({
    kind: z.enum(["vocabulary", "sentence", "scene", "illustration"]),
    unitId: z.string().max(160).optional(),
    wordId: z.string().max(160).optional(),
    text: z.string().min(1).max(4000),
  })
  .strict();
export type ImageReportContext = z.infer<typeof imageReportContextSchema>;
export const imageReportSchema = z
  .object({
    id: z.string().regex(/^[a-f0-9]{64}$/),
    contentId: z.string().regex(/^[a-f0-9]{64}$/),
    assetId: z.string().regex(/^[a-f0-9]{64}$/),
    assetUrl: z.string().url(),
    context: imageReportContextSchema,
    reason: imageReportReasonSchema,
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    occurrences: z.number().int().positive(),
  })
  .strict();
export const imageReportExportSchema = z
  .object({
    schemaVersion: z.literal(1),
    exportedAt: z.iso.datetime(),
    reports: z.array(imageReportSchema).max(500),
  })
  .strict();
export type ImageReport = z.infer<typeof imageReportSchema>;
