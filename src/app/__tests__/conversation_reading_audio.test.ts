import { describe, expect, it } from "vitest";
import catalog from "../learning/conversation/conversationCatalog.json";
import manifest from "../learning/conversation/conversationReadingAudioManifest.json";
import { getConversationReadingAudioKey } from "../learning/conversation/conversationReadingAudio";
import timing from "../learning/conversation/conversationTranscriptTiming.json";

describe("verified Conversation v4 recordings", () => {
  it("covers every full reading and paragraph in all 40 units with matching transcripts", () => {
    expect(manifest.profile.modelId).toBe("eleven_v4");
    expect(Object.keys(manifest.units)).toHaveLength(40);
    let tracks = 0;
    for (const unit of catalog) {
      const texts = [
        `${unit.reading.title}. ${unit.reading.paragraphs.join(" ")}`,
        ...unit.reading.paragraphs,
      ];
      texts.forEach((text, index) => {
        const key = getConversationReadingAudioKey(unit.id, index === 0 ? "full" : index - 1, text);
        expect(key, `${unit.id}/${index}`).toMatch(/^audio\/[0-9a-f]{2}\/[0-9a-f]{64}\.mp3$/);
        tracks++;
      });
    }
    expect(tracks).toBe(340);
  });

  it("does not play an outdated take after a reading is edited", () => {
    expect(getConversationReadingAudioKey("unit-01", "full", "A revised reading.")).toBeUndefined();
  });

  it("provides measured sentence ranges within every verified transcript", () => {
    for (const [id, unit] of Object.entries(manifest.units)) {
      const entries = [unit.full, ...unit.paragraphs];
      const tracks = timing[id as keyof typeof timing];
      expect(tracks).toHaveLength(entries.length);
      tracks.forEach((spans, index) => {
        expect(spans.length).toBeGreaterThan(0);
        spans.forEach((span, sentence) => {
          expect(span.end).toBeLessThanOrEqual(entries[index].text.length);
          expect(span.to).toBeGreaterThan(span.from);
          expect(span.start).toBe(sentence === 0 ? 0 : spans[sentence - 1].end);
        });
      });
    }
  });

  it("preserves the ordinary audio fallback for units without a v4 recording", () => {
    expect(getConversationReadingAudioKey("unit-41", "full", "Reading")).toBeUndefined();
    expect(getConversationReadingAudioKey("unit-01", 100, "Paragraph")).toBeUndefined();
  });
});
