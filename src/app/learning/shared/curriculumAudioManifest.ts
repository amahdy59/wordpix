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

/**
 * Resolves a curriculum word, phrasal verb, or idiom to its content-addressed R2 objectKey.
 */
export function getCurriculumAudioKey(term: string): string | null {
  const clean = String(term).replace(/[-_]/g, " ").trim();
  if (!clean) return null;
  const entry =
    CURRICULUM_AUDIO_MANIFEST.clips[clean] ?? CURRICULUM_AUDIO_MANIFEST.clips[clean.toLowerCase()];
  if (entry) return entry.objectKey;

  return getLowercaseClipIndex().get(clean.toLowerCase()) ?? null;
}
