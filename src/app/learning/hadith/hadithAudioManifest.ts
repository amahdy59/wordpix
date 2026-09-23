import { z } from "zod";
import manifest from "./hadithAudioManifest.json";

const clipSchema = z.object({
  objectKey: z.string().regex(/^audio\/[0-9a-f]{2}\/[0-9a-f]{64}\.mp3$/),
  chars: z.number().int().positive(),
});

const manifestSchema = z.object({
  schemaVersion: z.literal(1),
  profileVersion: z.literal(1),
  lessons: z
    .array(
      z.object({
        id: z.string().regex(/^hadith-\d{2}$/),
        arabic: clipSchema,
        translation: clipSchema,
      })
    )
    .length(42),
});

const parsed = manifestSchema.parse(manifest);

export const HADITH_AUDIO_PROFILES = {
  ar: {
    voiceId: "xvhpbk8otnNHtT3fjCpr",
    modelId: "eleven_multilingual_v2",
    stability: 0.78,
    similarityBoost: 0.78,
  },
  en: {
    voiceId: "XfNU2rGpBa01ckF309OY",
    modelId: "eleven_multilingual_v2",
    stability: 0.72,
    similarityBoost: 0.75,
  },
} as const;

export type HadithAudioAssets = (typeof parsed.lessons)[number];
export const HADITH_AUDIO_ASSETS: readonly HadithAudioAssets[] = parsed.lessons;

export function getHadithAudioAssets(lessonId: string): HadithAudioAssets | undefined {
  return HADITH_AUDIO_ASSETS.find((lesson) => lesson.id === lessonId);
}
