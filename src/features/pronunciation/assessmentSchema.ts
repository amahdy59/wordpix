import { z } from "zod";
const score = z.number().finite().min(0).max(100);
export const pronunciationAssessmentResultSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("assessed"),
    accuracy: score,
    words: z
      .array(
        z.object({
          word: z.string().max(100),
          accuracy: score,
          errorType: z.string().max(40),
          phonemes: z.array(z.object({ phoneme: z.string().max(30), accuracy: score })).max(100),
        })
      )
      .min(1)
      .max(100),
  }),
  z.object({
    status: z.literal("unassessed"),
    reason: z.enum(["no-speech", "uncertain", "unavailable", "rate-limit"]),
  }),
]);
export type PronunciationAssessmentResult = z.infer<typeof pronunciationAssessmentResultSchema>;
