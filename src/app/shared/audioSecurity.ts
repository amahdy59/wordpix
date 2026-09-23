const LEGACY_AUDIO_CREDENTIAL_KEYS = [
  "wordpix_elevenlabs_key",
  "wordpix_elevenlabs_voice_id",
] as const;

/**
 * Remove provider credentials saved by older WordPix builds.
 *
 * Audio is generated server-side and delivered from R2. Keeping a reusable
 * provider secret in browser storage would expose it to any script running in
 * the origin, so current builds proactively clean up the legacy values.
 */
export function purgeLegacyAudioCredentials(
  storage: Pick<Storage, "removeItem"> | undefined
): void {
  if (!storage) return;
  for (const key of LEGACY_AUDIO_CREDENTIAL_KEYS) storage.removeItem(key);
}
