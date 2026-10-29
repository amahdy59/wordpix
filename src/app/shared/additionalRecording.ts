import { normalizeRecordingText, recordingLanguage } from "./edgeRecording";

const loaders = import.meta.glob<{ default: Record<string, string> }>(
  "../generated/additionalRecordings/*.json"
);
const shards = new Map<string, Promise<Readonly<Record<string, string>>>>();

/** Exact-text aliases for verified existing takes; loaded only after ordinary lookups miss. */
export async function additionalRecordingKey(text: string, language = "en") {
  if (!globalThis.crypto?.subtle) return null;
  const payload = `${recordingLanguage(language)}\0${normalizeRecordingText(text)}`;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(payload));
  const id = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  const prefix = id.slice(0, 2);
  const loader = loaders[`../generated/additionalRecordings/${prefix}.json`];
  if (!loader) return null;
  let pending = shards.get(prefix);
  if (!pending) {
    pending = loader().then((module) => module.default);
    shards.set(prefix, pending);
    void pending.catch(() => shards.delete(prefix));
  }
  return (await pending)[id] ?? null;
}
