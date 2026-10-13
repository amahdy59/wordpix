// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import {
  createAssessmentHandler,
  normalizeProviderAssessment,
} from "../../features/pronunciation/assessmentServer";

function wav() {
  const buffer = new ArrayBuffer(32044);
  const view = new DataView(buffer);
  const write = (offset: number, text: string) =>
    [...text].forEach((value, index) => view.setUint8(offset + index, value.charCodeAt(0)));
  write(0, "RIFF");
  write(8, "WAVE");
  write(12, "fmt ");
  write(36, "data");
  view.setUint32(4, 32036, true);
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, 16000, true);
  view.setUint32(28, 32000, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  view.setUint32(40, 32000, true);
  for (let offset = 44; offset < buffer.byteLength; offset += 2) view.setInt16(offset, 1500, true);
  return new Blob([buffer], { type: "audio/wav" });
}
const provider = {
  RecognitionStatus: "Success",
  NBest: [
    {
      Confidence: 0.9,
      PronunciationAssessment: { AccuracyScore: 73 },
      Words: [
        {
          Word: "pin",
          PronunciationAssessment: { AccuracyScore: 73, ErrorType: "Mispronunciation" },
          Phonemes: [{ Phoneme: "p", PronunciationAssessment: { AccuracyScore: 80 } }],
        },
      ],
    },
  ],
};
function setup(overrides = {}) {
  const dependencies = {
    allowedOrigins: ["https://wordpix.test"],
    enabled: true,
    verifyUser: vi.fn(async () => "user-id" as string | null),
    consumeQuota: vi.fn(async () => true),
    assess: vi.fn(async () => provider),
    ...overrides,
  };
  return { ...dependencies, handle: createAssessmentHandler(dependencies) };
}
async function request(audio: Blob = wav()) {
  const boundary = "pronunciation-test-boundary";
  const start = new TextEncoder().encode(
    `--${boundary}\r\nContent-Disposition: form-data; name="referenceText"\r\n\r\npin\r\n--${boundary}\r\nContent-Disposition: form-data; name="audio"; filename="attempt.wav"\r\nContent-Type: audio/wav\r\n\r\n`
  );
  const recording = new Uint8Array(await audio.arrayBuffer());
  const end = new TextEncoder().encode(`\r\n--${boundary}--\r\n`);
  const bytes = new Uint8Array(start.length + recording.length + end.length);
  bytes.set(start);
  bytes.set(recording, start.length);
  bytes.set(end, start.length + recording.length);
  return new Request("https://server.test", {
    method: "POST",
    headers: {
      origin: "https://wordpix.test",
      Authorization: "Bearer user-token",
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
    },
    body: bytes,
  });
}
describe("pronunciation assessment service boundary", () => {
  it("returns phoneme evidence and strips upstream transcripts", async () => {
    const service = setup();
    const result = await service.handle(await request());
    expect(result.status).toBe(200);
    expect(result.headers.get("cache-control")).toBe("no-store");
    expect(await result.json()).toMatchObject({
      status: "assessed",
      accuracy: 73,
      words: [{ phonemes: [{ phoneme: "p", accuracy: 80 }] }],
    });
    expect(service.assess).toHaveBeenCalledTimes(1);
  });
  it("fails closed when disabled, unauthenticated, over quota or from an unapproved origin", async () => {
    for (const [overrides, expected] of [
      [{ enabled: false }, 503],
      [{ verifyUser: async () => null }, 401],
      [{ consumeQuota: async () => false }, 429],
    ] as const) {
      const service = setup(overrides);
      expect((await service.handle(await request())).status).toBe(expected);
      expect(service.assess).not.toHaveBeenCalled();
    }
    const service = setup();
    expect(
      (
        await service.handle(
          new Request("https://server.test", {
            method: "OPTIONS",
            headers: { origin: "https://evil.test" },
          })
        )
      ).status
    ).toBe(403);
  });
  it("rejects fake, empty and oversized recordings without calling the provider", async () => {
    for (const audio of [
      new Blob(),
      new Blob(["not an audio file".repeat(5)]),
      new Blob([new Uint8Array(700001)]),
    ]) {
      const service = setup();
      expect([400, 413]).toContain((await service.handle(await request(audio))).status);
      expect(service.assess).not.toHaveBeenCalled();
    }
  });
  it("does not turn uncertain results, silence or provider failure into a learner score", async () => {
    expect(normalizeProviderAssessment({ RecognitionStatus: "NoMatch" })).toEqual({
      status: "unassessed",
      reason: "no-speech",
    });
    expect(
      normalizeProviderAssessment({
        ...provider,
        NBest: [{ ...provider.NBest[0], Confidence: 0.1 }],
      })
    ).toEqual({ status: "unassessed", reason: "uncertain" });
    expect(normalizeProviderAssessment({ error: "secret upstream error" })).toEqual({
      status: "unassessed",
      reason: "uncertain",
    });
    const service = setup({
      assess: async () => {
        throw new Error("secret");
      },
    });
    const response = await service.handle(await request());
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain("secret");
  });
});
