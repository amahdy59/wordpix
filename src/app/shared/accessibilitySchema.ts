import { z } from "zod";

/** Shared local/cloud contract. Defaults preserve pre-autoplay saved preferences. */
export const accessibilitySchema = z
  .object({
    textSize: z.enum(["standard", "large", "xlarge"]),
    highContrast: z.boolean(),
    speechRate: z.number().min(0.5).max(2).finite(),
    numeralSystem: z.enum(["western", "arabic"]),
    includeSpeaking: z.boolean(),
    includeListening: z.boolean(),
    includePronunciation: z.boolean().default(true),
    timedExercises: z.boolean(),
    autoAdvance: z.boolean(),
    spokenFeedback: z.boolean(),
    reduceMotion: z.boolean(),
    autoPlayAudio: z.boolean().default(true),
  })
  .strict();
