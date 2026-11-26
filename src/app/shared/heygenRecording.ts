import { normalizeRecordingText, recordingLanguage } from "./edgeRecording";

/** Secondary HeyGen (Nadine) recordings stored on R2. Never overrides primary audio. */
export const HEYGEN_RECORDING_PREFIX = "audio/heygen-v1/nadine";

export const VOICE_OPTIONS = [
  { id: "primary", labelKey: "settings.voicePrimary" },
  { id: "nadine", labelKey: "settings.voiceNadine" },
] as const;

const loaders = import.meta.glob<{ default: string[] }>("../generated/heygenRecordings/*.json");
const shards = new Map<string, Promise<ReadonlySet<string>>>();

/**
 * Looks up whether a secondary HeyGen (Nadine) recording exists for an English
 * transcript in the generated availability shards. Returns its R2 object key
 * (`audio/heygen-v1/nadine/<sha256>.mp3`) or `null` when unavailable.
 */
export async function heygenRecordingKey(text: string, language = "en"): Promise<string | null> {
  if (!globalThis.crypto?.subtle) return null;
  if (recordingLanguage(language) !== "en") return null;
  const normalized = normalizeRecordingText(text);
  if (!normalized) return null;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalized));
  const hash = [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  const prefix = hash.slice(0, 2);
  const loader = loaders[`../generated/heygenRecordings/${prefix}.json`];
  if (!loader) return null;
  let pending = shards.get(prefix);
  if (!pending) {
    pending = loader().then((module) => new Set(module.default));
    shards.set(prefix, pending);
    void pending.catch(() => shards.delete(prefix));
  }
  return (await pending).has(hash) ? `${HEYGEN_RECORDING_PREFIX}/${hash}.mp3` : null;
}
