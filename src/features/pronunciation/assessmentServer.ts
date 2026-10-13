import { z } from "zod";
import { pronunciationAssessmentResultSchema } from "./assessmentSchema.ts";

const score = z.number().finite().min(0).max(100);
const providerSchema = z.object({
  RecognitionStatus: z.string(),
  NBest: z
    .array(
      z.object({
        Confidence: z.number().min(0).max(1),
        PronunciationAssessment: z.object({ AccuracyScore: score }),
        Words: z
          .array(
            z.object({
              Word: z.string().max(100),
              PronunciationAssessment: z.object({
                AccuracyScore: score,
                ErrorType: z.string().max(40),
              }),
              Phonemes: z
                .array(
                  z.object({
                    Phoneme: z.string().max(30),
                    PronunciationAssessment: z.object({ AccuracyScore: score }),
                  })
                )
                .max(100)
                .optional(),
            })
          )
          .max(100),
      })
    )
    .max(10)
    .optional(),
});

export function normalizeProviderAssessment(value: unknown) {
  const parsed = providerSchema.safeParse(value);
  if (!parsed.success) return { status: "unassessed", reason: "uncertain" } as const;
  if (parsed.data.RecognitionStatus !== "Success")
    return { status: "unassessed", reason: "no-speech" } as const;
  const best = parsed.data.NBest?.[0];
  // This is a conservative confidence screen, not a mastery cutoff.
  if (!best || best.Confidence < 0.65 || !best.Words.length)
    return { status: "unassessed", reason: "uncertain" } as const;
  return pronunciationAssessmentResultSchema.parse({
    status: "assessed",
    accuracy: best.PronunciationAssessment.AccuracyScore,
    words: best.Words.map((word) => ({
      word: word.Word,
      accuracy: word.PronunciationAssessment.AccuracyScore,
      errorType: word.PronunciationAssessment.ErrorType,
      phonemes: (word.Phonemes ?? []).map((phoneme) => ({
        phoneme: phoneme.Phoneme,
        accuracy: phoneme.PronunciationAssessment.AccuracyScore,
      })),
    })),
  });
}

interface Dependencies {
  allowedOrigins: readonly string[];
  enabled: boolean;
  verifyUser: (authorization: string) => Promise<string | null>;
  consumeQuota: (userId: string) => Promise<boolean>;
  assess: (audio: Uint8Array, reference: string, signal: AbortSignal) => Promise<unknown>;
}

/** No audio, reference text, transcripts, or upstream error messages are logged or persisted. */
export function createAssessmentHandler(dependencies: Dependencies) {
  return async (request: Request): Promise<Response> => {
    const origin = request.headers.get("origin") ?? "";
    const headers = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      Vary: "Origin",
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    };
    const respond = (status: number, body: unknown) =>
      new Response(JSON.stringify(body), { status, headers });
    if (!dependencies.allowedOrigins.includes(origin)) return new Response(null, { status: 403 });
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (request.method !== "POST") return respond(405, { error: "method" });
    if (!dependencies.enabled) return respond(503, { error: "unavailable" });
    const authorization = request.headers.get("authorization") ?? "";
    if (!/^Bearer \S+$/.test(authorization)) return respond(401, { error: "authentication" });
    try {
      const userId = await dependencies.verifyUser(authorization);
      if (!userId) return respond(401, { error: "authentication" });
      if (!(await dependencies.consumeQuota(userId))) return respond(429, { error: "rate-limit" });
      // Bound the body even when Content-Length is missing or forged.
      const reader = request.body?.getReader();
      if (!reader) return respond(400, { error: "recording" });
      const chunks: Uint8Array[] = [];
      let size = 0;
      while (true) {
        const next = await reader.read();
        if (next.done) break;
        size += next.value.byteLength;
        if (size > 700000) {
          await reader.cancel();
          return respond(413, { error: "size" });
        }
        chunks.push(next.value);
      }
      const bytes = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.byteLength;
      }
      const form = await new Response(bytes, {
        headers: { "Content-Type": request.headers.get("content-type") ?? "" },
      }).formData();
      const reference = z
        .string()
        .trim()
        .min(1)
        .max(200)
        .regex(/^[\p{L}\p{N}\s.,!?':;’“”"·/()–—-]+$/u)
        .safeParse(form.get("referenceText"));
      const file = form.get("audio");
      if (!reference.success || !(file instanceof Blob) || file.size <= 44 || file.size > 640044)
        return respond(400, { error: "input" });
      const audio = new Uint8Array(await file.arrayBuffer());
      const view = new DataView(audio.buffer);
      const text = (start: number, length: number) =>
        new TextDecoder().decode(audio.slice(start, start + length));
      if (
        text(0, 4) !== "RIFF" ||
        text(8, 4) !== "WAVE" ||
        text(12, 4) !== "fmt " ||
        text(36, 4) !== "data" ||
        view.getUint32(16, true) !== 16 ||
        view.getUint16(20, true) !== 1 ||
        view.getUint16(22, true) !== 1 ||
        view.getUint32(24, true) !== 16000 ||
        view.getUint32(28, true) !== 32000 ||
        view.getUint16(32, true) !== 2 ||
        view.getUint16(34, true) !== 16 ||
        view.getUint32(40, true) !== audio.length - 44 ||
        view.getUint32(4, true) !== audio.length - 8 ||
        (audio.length - 44) % 2 !== 0
      )
        return respond(400, { error: "format" });
      const controller = new AbortController();
      const abort = () => controller.abort();
      request.signal.addEventListener("abort", abort, { once: true });
      const timeout = setTimeout(abort, 15000);
      try {
        return respond(
          200,
          normalizeProviderAssessment(
            await dependencies.assess(audio, reference.data, controller.signal)
          )
        );
      } finally {
        clearTimeout(timeout);
        request.signal.removeEventListener("abort", abort);
      }
    } catch {
      return respond(503, { error: "unavailable" });
    }
  };
}
