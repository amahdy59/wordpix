/** Immutable, prerecorded Edge takes. The browser never contacts the TTS service. */
export const EDGE_RECORDING_VERSION = "edge-v1";
export const EDGE_VOICES = {
  en: "en-US-JennyNeural",
  ar: "ar-SA-ZariyahNeural",
} as const;

export function recordingLanguage(language: string): keyof typeof EDGE_VOICES {
  return language.toLowerCase().startsWith("ar") ? "ar" : "en";
}

export function normalizeRecordingText(text: string): string {
  return text.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, " ").trim();
}

export function edgeRecordingPayload(text: string, language = "en") {
  const voice = EDGE_VOICES[recordingLanguage(language)];
  return `${EDGE_RECORDING_VERSION}|${voice}|rate=+0%|pitch=+0Hz|volume=+0%\n${normalizeRecordingText(text)}`;
}

export async function edgeRecordingKey(text: string, language = "en"): Promise<string | null> {
  if (!globalThis.crypto?.subtle || !normalizeRecordingText(text)) return null;
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(edgeRecordingPayload(text, language))
  );
  const hash = [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return `audio/${EDGE_RECORDING_VERSION}/${EDGE_VOICES[recordingLanguage(language)]}/${hash}.mp3`;
}
