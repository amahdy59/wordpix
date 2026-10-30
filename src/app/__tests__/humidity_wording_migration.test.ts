import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import jungle from "../data/usage/jungle.usage.json";
import approval from "../../../docs/media/APPROVED_HUMIDITY_REPAIR_2026-10-30.json";
import receipts from "../../../docs/media/PUBLISHED_HUMIDITY_RECEIPT_2026-10-30.json";
import { edgeRecordingPayload } from "../shared/edgeRecording";
import { isEdgeRecordingAvailable } from "../shared/edgeRecordingAvailability";

describe("atomic humidity wording migration", () => {
  it("updates the scene, reading, linked exercises and dialogue together", () => {
    const lesson = jungle.find((item) => item.lessonId === "jungle-5")!;
    const serialized = JSON.stringify(lesson);
    expect(serialized).not.toContain(approval.oldText);
    expect(serialized.split(approval.newText).length - 1).toBe(5);
    expect(lesson.usage.scenes[0].scenario).toContain(approval.newText);
    expect(lesson.reading.text).toContain(lesson.usage.scenes[0].scenario);
    expect(lesson.usage.scenes[0].check.expectedAnswer).toBe("Splash");
  });

  it("exposes every exact approved recording in the lazy playback indexes", async () => {
    expect(receipts.verifiedFiles).toBe(8);
    for (const file of approval.files) {
      const digest = createHash("sha256").update(edgeRecordingPayload(file.text)).digest("hex");
      expect(file.key).toBe(`audio/edge-v1/en-US-JennyNeural/${digest}.mp3`);
      expect(await isEdgeRecordingAvailable(file.key)).toBe(true);
      const receipt = receipts.receipts.find((item) => item.key === file.key)!;
      expect(receipt.sha256).toBe(file.sha256);
      expect(receipt.bytes).toBe(file.bytes);
      expect(receipt.checksumVerified && receipt.corsVerified).toBe(true);
    }
  });
});
