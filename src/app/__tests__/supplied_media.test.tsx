import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import manifest from "../generated/suppliedMedia.json";
import { loadUnitVocabulary } from "../data/vocabulary";
import { loadUnitUsage } from "../data/usageRegistry";
import { resolveSentenceMedia } from "../content/sentenceMedia";
import { applySuppliedSentenceMedia, getSuppliedSceneMedia } from "../content/suppliedMedia";
import { getRichSentence } from "../exercises/exerciseContent";
import { edgeRecordingPayload } from "../shared/edgeRecording";
import { isEdgeRecordingAvailable } from "../shared/edgeRecordingAvailability";
import review from "../../../docs/media/SUPPLIED_IMAGE_REVIEW_2026-10-30.json";
import approval from "../../../docs/media/APPROVED_SUPPLIED_IMAGES_2026-10-30.json";
import receipts from "../../../docs/media/PUBLISHED_SUPPLIED_IMAGE_RECEIPT_2026-10-30.json";

describe("reviewed user-supplied images", () => {
  it("binds the approved immutable batch to verified files and excludes held pictures", () => {
    const raw = readFileSync("docs/media/SUPPLIED_IMAGE_BATCH_2026-10-30.json");
    expect(createHash("sha256").update(raw).digest("hex")).toBe(approval.batchSha256);
    expect(receipts.verifiedFiles).toBe(68);
    expect(manifest).toHaveLength(34);
    for (const row of manifest) {
      expect(review.images.find((image) => image.index === row.sourceIndex)?.decision).toBe(
        "use-as-reference-support"
      );
      expect(row.responsiveSources.map((source) => source.width)).toEqual([640, 1280]);
      for (const source of row.responsiveSources) {
        const receipt = receipts.receipts.find((item) => source.url.endsWith(item.key))!;
        expect(receipt.checksumVerified && receipt.corsVerified).toBe(true);
        expect(receipt.bytes).toBeLessThan(300000);
      }
    }
  });

  it("reaches all exact current sentence and scene contexts without changing spoken selection", async () => {
    for (const row of manifest) {
      const words = await loadUnitVocabulary(row.unitId);
      const usage = (await loadUnitUsage(row.unitId))!.find(
        (lesson) => lesson.lessonId === row.lessonId
      )!;
      if (row.kind === "scene") {
        const scene = usage.usage.scenes.find(
          (item) => `scene-${item.chunkNumber}` === row.wordId
        )!;
        expect(getSuppliedSceneMedia(row.lessonId, scene)?.imagePath).toBe(row.imagePath);
        expect(
          getSuppliedSceneMedia(row.lessonId, { ...scene, scenario: scene.scenario + " Changed." })
        ).toBeUndefined();
      } else {
        const word = words.find((item) => item.id === row.wordId)!;
        expect([0, 1].map((index) => getRichSentence(word, usage, index).full)).toContain(row.text);
        const actual = resolveSentenceMedia(row.wordId, row.text, usage);
        expect(actual?.imagePath).toBe(row.imagePath);
        expect(actual?.imageAlt).toBe(row.imageAlt);
        expect(actual?.imagePurpose).toBe("word-reference");
        expect(actual?.fallbackToVocabulary).toBe(false);
        expect(actual?.imageFallbacks).toBeUndefined();
      }
    }
  });

  it("fails closed for changed text, source keys, words or lesson identities", () => {
    const original = { imagePath: "original.webp", imageAlt: "Original" };
    for (const row of manifest.filter((item) => item.kind === "sentence")) {
      expect(
        applySuppliedSentenceMedia(
          row.wordId,
          row.text + " Changed.",
          original,
          row.expectedSourceKey,
          row.lessonId
        )
      ).toBe(original);
      expect(
        applySuppliedSentenceMedia(row.wordId, row.text, original, "different.webp", row.lessonId)
      ).toBe(original);
      expect(
        applySuppliedSentenceMedia(
          "different",
          row.text,
          original,
          row.expectedSourceKey,
          row.lessonId
        )
      ).toBe(original);
      expect(
        applySuppliedSentenceMedia(
          row.wordId,
          row.text,
          original,
          row.expectedSourceKey,
          "different-lesson"
        )
      ).toBe(original);
      if (row.expectedSourceKey === null)
        expect(applySuppliedSentenceMedia(row.wordId, row.text, original, null)).toBe(original);
    }
  });

  it("repairs the park verb frame using a recording already in the published corpus", async () => {
    const word = (await loadUnitVocabulary("park")).find((item) => item.id === "sit-down")!;
    expect(getRichSentence(word).full).toBe("Please sit down.");
    const hash = createHash("sha256")
      .update(edgeRecordingPayload("Please sit down."))
      .digest("hex");
    expect(await isEdgeRecordingAvailable(`audio/edge-v1/en-US-JennyNeural/${hash}.mp3`)).toBe(
      true
    );
  });
});
