import { describe, expect, it } from "vitest";
import { isOfflineAvailable } from "../../pwa";
import { getWordFallbackDataUrl } from "../shared/WordImage";
import { BEDROOM_VOCABULARY } from "../data/lessons";

describe("Phase 4 Acceptance Criteria Verification", () => {
  it("AC 1: PWA offline availability indicates flagship Bedroom world is offline-ready", () => {
    expect(isOfflineAvailable("bedroom")).toBe(true);
    expect(isOfflineAvailable("kitchen")).toBe(false);
  });

  it("AC 2: WordImage fallback SVG rendering adapts to assessment mode without leaking text", () => {
    const pillow = BEDROOM_VOCABULARY.find((v) => v.id === "pillow")!;
    const learningSvg = getWordFallbackDataUrl(pillow, "learning");
    const assessmentSvg = getWordFallbackDataUrl(pillow, "assessment");

    expect(learningSvg).toContain(encodeURIComponent("Pillow"));
    expect(assessmentSvg).not.toContain(encodeURIComponent("Pillow"));
    expect(assessmentSvg).toContain(encodeURIComponent("?"));
  });
});
