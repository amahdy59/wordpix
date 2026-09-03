/**
 * Resolves generated audio to its CDN URL.
 *
 * This is the browser half of the content-addressed scheme in
 * scripts/lib/assetKey.cjs. Both sides hash the same normalised text with the
 * same voice profile, so the app can find a clip the generator uploaded
 * without shipping a manifest of what exists — which matters, because a
 * manifest of ~8,500 entries would be a payload of its own, and it would go
 * stale the moment a new clip is generated.
 *
 * If the key is absent from the bucket the request 404s and `useAudio` falls
 * through to speech synthesis, so a missing clip degrades rather than breaks.
 *
 * The two implementations must agree exactly. audio_assets.test.ts asserts
 * that by comparing this output against the generator's for the same inputs.
 */

/** Known voice identifiers */
export const VOICES = {
  nichalia: "XfNU2rGpBa01ckF309OY", // 🥇 Nichalia Schwartz - Bright and Friendly
  shelley: "4CrZuIW9am7gYAxgo2Af", // Shelley - Clear, Confident and British
  alice: "Xb7hH8MSUJpSbSDYk0k2", // Alice - Clear, Engaging Educator
} as const;

/**
 * Must mirror AUDIO_PROFILE in scripts/lib/assetKey.cjs.
 *
 * Hardcoded to the voice the corpus was generated with. VITE_ELEVENLABS_VOICE_ID
 * is for a learner's personal key (see useAudio.ts) and must NOT influence this
 * profile — a mismatch silently makes every pre-generated URL 404.
 */
export const AUDIO_PROFILE = {
  voiceId: VOICES.nichalia,
  modelId: "eleven_turbo_v2_5",
  stability: 0.7,
  similarityBoost: 0.75,
} as const;

/**
 * Public base URL of the asset bucket, e.g. https://assets.example.com.
 *
 * Not a secret — it is a public CDN origin, so inlining it in the client is
 * correct. When unset the app simply has no CDN and every caller falls back to
 * speech synthesis, which is the right behaviour for a local dev checkout with
 * no bucket configured.
 */
export const ASSET_BASE_URL: string = (import.meta.env?.VITE_ASSET_BASE_URL ?? "").replace(
  /\/+$/,
  ""
);

export function hasAssetHost(): boolean {
  return ASSET_BASE_URL.length > 0;
}

/** Mirrors normaliseText in scripts/lib/assetKey.cjs. */
export function normaliseText(text: string): string {
  return String(text).replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, " ").trim();
}

function profileFingerprint(): string {
  return [
    AUDIO_PROFILE.voiceId,
    AUDIO_PROFILE.modelId,
    AUDIO_PROFILE.stability,
    AUDIO_PROFILE.similarityBoost,
  ].join("|");
}

function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * SHA-256 of the same payload the generator hashes.
 *
 * Async because Web Crypto is async, and unavailable outside a secure context
 * — which is fine: localhost and the deployed HTTPS origin both qualify, and
 * anywhere else returns null so the caller falls back rather than throwing.
 */
export async function audioHash(text: string): Promise<string | null> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) return null;
  const payload = `${profileFingerprint()}\n${normaliseText(text)}`;
  try {
    const digest = await subtle.digest("SHA-256", new TextEncoder().encode(payload));
    return toHex(digest);
  } catch {
    return null;
  }
}

/** Object key for a clip, sharded to match the generator. */
export async function audioKey(text: string): Promise<string | null> {
  const hash = await audioHash(text);
  return hash ? `audio/${hash.slice(0, 2)}/${hash}.mp3` : null;
}

/**
 * Full CDN URL for a clip, or null when there is no bucket configured or no
 * crypto available to derive the key.
 */
export async function audioUrl(text: string): Promise<string | null> {
  if (!hasAssetHost()) return null;
  const key = await audioKey(text);
  return key ? `${ASSET_BASE_URL}/${key}` : null;
}

/** Public URL for a static asset already uploaded under a known path. */
export function assetUrl(path: string): string | null {
  if (!hasAssetHost()) return null;
  return `${ASSET_BASE_URL}/${path.replace(/^\/+/, "")}`;
}
