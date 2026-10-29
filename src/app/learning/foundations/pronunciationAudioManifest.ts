import { z } from "zod";
import source from "./pronunciationAudioManifest.json";

const audioProfileSchema = z.object({
  voiceId: z.string().min(1),
  modelId: z.string().min(1),
  stability: z.number().min(0).max(1),
  similarityBoost: z.number().min(0).max(1),
});

const clipSchema = z.object({
  objectKey: z.string().regex(/^audio\/[0-9a-f]{2}\/[0-9a-f]{64}\.mp3$/),
  displayText: z.string().min(1),
  synthesisText: z.string().min(1),
  speaker: z.string().min(1),
  profile: audioProfileSchema,
  source: z.enum(["general-corpus", "foundation-corpus", "derived-profile"]),
});

const manifestSchema = z.object({
  schemaVersion: z.literal(1),
  r2Prefix: z.literal("audio/"),
  clips: z.record(z.string(), z.array(clipSchema).min(1)),
});

export type PronunciationAudioClip = z.infer<typeof clipSchema>;
export const PRONUNCIATION_AUDIO_MANIFEST = manifestSchema.parse(source);

export function normalizePronunciationAudioLabel(value: string): string {
  return value
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("en-US");
}

/**
 * Selects an existing clip deterministically. Transfer uses the last available
 * speaker variant; other stages prefer exact display-text casing and the
 * normal production clip. No entry means the caller should use its fallback.
 */
export function getPronunciationAudioClip(
  displayText: string,
  transfer = false
): PronunciationAudioClip | null {
  const clips = PRONUNCIATION_AUDIO_MANIFEST.clips[normalizePronunciationAudioLabel(displayText)];
  if (!clips?.length) return null;
  if (transfer) {
    const distinctSpeaker = [...clips].reverse().find((clip) => clip.speaker !== clips[0].speaker);
    return distinctSpeaker ?? clips.at(-1) ?? null;
  }
  return (
    clips.find((clip) => clip.displayText === displayText && clip.source === "derived-profile") ??
    clips.find((clip) => clip.displayText === displayText) ??
    clips[0]
  );
}
