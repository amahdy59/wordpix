/**
 * Content-addressed keys for generated audio.
 *
 * The key is derived from everything that affects the rendered sound — the
 * normalised text, the voice, the model, and the voice settings. Three
 * properties follow, and together they are what make "generate once, never pay
 * again" a property of the system rather than a promise:
 *
 *   1. Identical text anywhere in the app resolves to one object. "Library"
 *      appears as a vocabulary word in four units; it is synthesised once.
 *   2. The generator can ask "does this key exist?" before spending a
 *      character, so re-runs and resumed runs cost nothing.
 *   3. Objects are immutable, so they can be cached for a year. Changing the
 *      voice produces new keys instead of invalidating old ones.
 *
 * The browser derives the same key from the same text (see
 * src/app/shared/assetUrls.ts). The two implementations must agree exactly,
 * which is what audio_assets.test.ts checks.
 */
const crypto = require("crypto");

/** Known voice identifiers */
const VOICES = {
  nichalia: "XfNU2rGpBa01ckF309OY", // 🥇 Nichalia Schwartz - Bright and Friendly
  shelley: "4CrZuIW9am7gYAxgo2Af",  // Shelley - Clear, Confident and British
  alice: "Xb7hH8MSUJpSbSDYk0k2",    // Alice - Clear, Engaging Educator
};

/** Current voice settings. Changing any of these re-keys the whole corpus. */
const AUDIO_PROFILE = {
  voiceId: process.env.ELEVENLABS_VOICE_ID || VOICES.alice,
  modelId: "eleven_turbo_v2_5",
  stability: 0.7,
  similarityBoost: 0.75,
};

/**
 * Normalises text before hashing.
 *
 * Collapsing whitespace and stripping wrapping quotes means trivial
 * differences in the source data do not buy a second copy of the same clip.
 * Case is preserved: speech synthesis treats "US" and "us" differently.
 */
function normaliseText(text) {
  return String(text)
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/** The profile fields, in a fixed order, so the digest is stable. */
function profileFingerprint(profile) {
  return [
    profile.voiceId,
    profile.modelId,
    profile.stability,
    profile.similarityBoost,
  ].join("|");
}

/** Full SHA-256 of "<profile>\n<text>", hex. */
function audioHash(text, profile = AUDIO_PROFILE) {
  const payload = `${profileFingerprint(profile)}\n${normaliseText(text)}`;
  return crypto.createHash("sha256").update(payload, "utf8").digest("hex");
}

/**
 * Object key for a clip.
 *
 * Sharded by the first two hex characters so no single prefix accumulates
 * thousands of objects — R2 tolerates flat namespaces, but listing and
 * debugging a 256-way split is far easier.
 */
function audioKey(text, profile = AUDIO_PROFILE) {
  const hash = audioHash(text, profile);
  return `audio/${hash.slice(0, 2)}/${hash}.mp3`;
}

module.exports = {
  VOICES,
  AUDIO_PROFILE,
  normaliseText,
  profileFingerprint,
  audioHash,
  audioKey,
};
