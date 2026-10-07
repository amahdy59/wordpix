import { describe, expect, it } from "vitest";
import catalog from "../learning/business/businessCatalog.json";
import manifest from "../learning/business/businessReadingAudioManifest.json";
import { getBusinessReadingAudio } from "../learning/business/businessReadingAudio";

describe("verified Business v4 recordings", () => {
  it("selects only matching authored transcripts and measured timing", () => {
    expect(manifest.profile.modelId).toBe("eleven_v4");
    const keys = new Set<string>();
    for (const [id, unit] of Object.entries(manifest.units)) {
      const authored = catalog.find((item) => item.id === id)!;
      const texts = [
        `${authored.mainInput.title}. ${authored.mainInput.context} ${authored.mainInput.dialogue.map((line) => line.text).join(" ")}`,
        authored.mainInput.context,
        ...authored.mainInput.dialogue.map((line) => line.text),
        ...authored.languageBank.flatMap((item) => [item.term, item.example]),
      ].map((text) => text.replace(/\s+/g, " ").trim());
      for (const entry of [unit.full, ...unit.paragraphs].filter((item) => item !== null)) {
        expect(texts).toContain(entry.text);
        const recording = getBusinessReadingAudio(id, entry.text)!;
        expect(recording.key).toBe(entry.key);
        expect(recording.spans.length).toBeGreaterThan(0);
        for (const span of recording.spans) {
          expect(span.from).toBeGreaterThanOrEqual(0);
          expect(span.to).toBeGreaterThan(span.from);
          expect(span.start).toBeGreaterThanOrEqual(0);
          expect(span.end).toBeLessThanOrEqual(entry.text.length);
        }
        keys.add(entry.key);
      }
    }
    expect(keys.size).toBeGreaterThanOrEqual(45);
  });

  it("retains the audio fallback for missing or changed recordings", () => {
    expect(getBusinessReadingAudio("unit-01", "Revised transcript.")).toBeUndefined();
    expect(getBusinessReadingAudio("unit-40", "Missing recording.")).toBeUndefined();
    const missing = catalog[0].languageBank
      .map((item) => item.example)
      .find((text) => !getBusinessReadingAudio("unit-01", text));
    expect(missing).toBeDefined();
  });
});
