import {
  pronunciationAssessmentResultSchema,
  type PronunciationAssessmentResult,
} from "../../features/pronunciation/assessmentSchema";
export type { PronunciationAssessmentResult } from "../../features/pronunciation/assessmentSchema";

export type AssessmentProblem =
  | "offline"
  | "sign-in"
  | "unavailable"
  | "timeout"
  | "no-speech"
  | "too-long"
  | "clipped"
  | "uncertain"
  | "rate-limit";

export class AssessmentError extends Error {
  constructor(public readonly reason: AssessmentProblem) {
    super(reason);
  }
}

/** Encode a genuine decoded recording as mono PCM; never substitute empty audio. */
export function encodeAssessmentWav(samples: Float32Array, sampleRate = 16000): Blob {
  if (!samples.length) throw new AssessmentError("no-speech");
  const bytes = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(bytes);
  const write = (offset: number, value: string) =>
    [...value].forEach((char, index) => view.setUint8(offset + index, char.charCodeAt(0)));
  write(0, "RIFF");
  view.setUint32(4, bytes.byteLength - 8, true);
  write(8, "WAVE");
  write(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  write(36, "data");
  view.setUint32(40, samples.length * 2, true);
  samples.forEach((sample, index) => {
    const value = Math.max(-1, Math.min(1, sample));
    view.setInt16(44 + index * 2, value < 0 ? value * 32768 : value * 32767, true);
  });
  return new Blob([bytes], { type: "audio/wav" });
}

export async function prepareAssessmentAudio(blob: Blob): Promise<Blob> {
  if (
    !blob.size ||
    typeof AudioContext === "undefined" ||
    typeof OfflineAudioContext === "undefined"
  )
    throw new AssessmentError("unavailable");
  const context = new AudioContext();
  try {
    const decoded = await context.decodeAudioData(await blob.arrayBuffer());
    if (decoded.duration > 20) throw new AssessmentError("too-long");
    if (decoded.duration < 0.25) throw new AssessmentError("no-speech");
    const offline = new OfflineAudioContext(1, Math.ceil(decoded.duration * 16000), 16000);
    const source = offline.createBufferSource();
    source.buffer = decoded;
    source.connect(offline.destination);
    source.start();
    const samples = (await offline.startRendering()).getChannelData(0);
    let energy = 0;
    let clipped = 0;
    for (const sample of samples) {
      energy += sample * sample;
      if (Math.abs(sample) >= 0.99) clipped++;
    }
    // Quality screening only; volume never establishes pronunciation correctness.
    if (Math.sqrt(energy / samples.length) < 0.003) throw new AssessmentError("no-speech");
    if (clipped / samples.length > 0.02) throw new AssessmentError("clipped");
    return encodeAssessmentWav(samples);
  } finally {
    await context.close();
  }
}

export function onlineAssessmentEnabled(): boolean {
  return (
    import.meta.env.VITE_PRONUNCIATION_ASSESSMENT_ENABLED === "true" &&
    Boolean(import.meta.env.VITE_SUPABASE_URL)
  );
}

export async function assessPronunciation(
  blob: Blob,
  referenceText: string,
  signal: AbortSignal
): Promise<PronunciationAssessmentResult> {
  if (!navigator.onLine) throw new AssessmentError("offline");
  if (!onlineAssessmentEnabled()) throw new AssessmentError("unavailable");
  const { supabase } = await import("../../lib/supabase/client");
  const { data } = await supabase.auth.getSession();
  if (!data.session) throw new AssessmentError("sign-in");
  const wav = await prepareAssessmentAudio(blob);
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
  const body = new FormData();
  body.set("audio", wav, "attempt.wav");
  body.set("referenceText", referenceText.replace(/\s*·\s*(?:noun|verb)\s*$/i, ""));
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pronunciation-assessment`,
    {
      method: "POST",
      signal,
      body,
      headers: {
        Authorization: `Bearer ${data.session.access_token}`,
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
    }
  );
  if (!response.ok)
    throw new AssessmentError(
      response.status === 429 ? "rate-limit" : response.status === 401 ? "sign-in" : "unavailable"
    );
  const parsed = pronunciationAssessmentResultSchema.safeParse(await response.json());
  if (!parsed.success) throw new AssessmentError("uncertain");
  return parsed.data;
}
