import overrides from "./pronunciationOverrides.json";
import { AUDIO_PROFILE, normaliseText, type AudioProfile } from "./assetUrls";

type PronunciationOverride = (typeof overrides)[number];

const overridesByText = new Map<string, PronunciationOverride>(
  overrides.flatMap((override) => override.matches.map((match) => [match, override] as const))
);

/**
 * Returns synthesis-only markup for a confirmed isolated-word pronunciation.
 *
 * Matching is deliberately exact and case-sensitive. We must not inject a
 * vocabulary pronunciation into a sentence where the speech model already
 * has enough context, or confuse a lowercase word with an uppercase acronym.
 * The display label and browser-speech fallback remain the authored text.
 */
export function getPronunciationAssetText(text: string): string {
  const cleanText = normaliseText(text);
  return overridesByText.get(cleanText)?.synthesisText ?? cleanText;
}

export interface PronunciationAssetSpec {
  text: string;
  profile: AudioProfile;
}

export function getPronunciationAssetSpec(text: string): PronunciationAssetSpec {
  const cleanText = normaliseText(text);
  const override = overridesByText.get(cleanText);
  return {
    text: override?.synthesisText ?? cleanText,
    profile: { ...AUDIO_PROFILE, ...(override?.profile ?? {}) },
  };
}

export function hasPronunciationOverride(text: string): boolean {
  const cleanText = normaliseText(text);
  return overridesByText.has(cleanText);
}

export { overrides as PRONUNCIATION_OVERRIDES };
