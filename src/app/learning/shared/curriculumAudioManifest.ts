import manifest from "./curriculumAudioManifest.json";

export interface CurriculumAudioClip {
  objectKey: string;
  synthesisText: string;
  category: string;
  domains: string[];
  chars: number;
}

export interface CurriculumAudioManifest {
  schemaVersion: number;
  generatedAt: string;
  profile: {
    voiceId: string;
    modelId: string;
    stability: number;
    similarityBoost: number;
  };
  clips: Record<string, CurriculumAudioClip>;
}

export const CURRICULUM_AUDIO_MANIFEST = manifest as unknown as CurriculumAudioManifest;

let lowercaseClipIndex: Map<string, string> | null = null;

function getLowercaseClipIndex(): Map<string, string> {
  if (!lowercaseClipIndex) {
    lowercaseClipIndex = new Map<string, string>();
    for (const [key, value] of Object.entries(CURRICULUM_AUDIO_MANIFEST.clips)) {
      lowercaseClipIndex.set(key.toLowerCase(), value.objectKey);
    }
  }
  return lowercaseClipIndex;
}

export function cleanCurriculumTerm(term: string): string {
  return String(term)
    .replace(/^\d+[.)]\s*/, "")
    .replace(/\s*[/(].*$/, "")
    .replace(/[\u0600-\u06FF]/g, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Resolves a curriculum word, phrasal verb, or idiom to its content-addressed R2 objectKey.
 */
export function getCurriculumAudioKey(term: string): string | null {
  const directClean = String(term).replace(/[-_]/g, " ").trim();
  if (!directClean) return null;

  const entry =
    CURRICULUM_AUDIO_MANIFEST.clips[directClean] ??
    CURRICULUM_AUDIO_MANIFEST.clips[directClean.toLowerCase()];
  if (entry) return entry.objectKey;

  const fromIndex = getLowercaseClipIndex().get(directClean.toLowerCase());
  if (fromIndex) return fromIndex;

  // Try cleaned version (stripping Arabic, slashes, parenthesized translations)
  const normalized = cleanCurriculumTerm(term);
  if (normalized && normalized !== directClean) {
    const normEntry =
      CURRICULUM_AUDIO_MANIFEST.clips[normalized] ??
      CURRICULUM_AUDIO_MANIFEST.clips[normalized.toLowerCase()];
    if (normEntry) return normEntry.objectKey;

    const fromNormIndex = getLowercaseClipIndex().get(normalized.toLowerCase());
    if (fromNormIndex) return fromNormIndex;
  }

  return null;
}
