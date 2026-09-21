import { createRequire } from "node:module";
import { existsSync, statSync } from "node:fs";
import { basename, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { audioKey } from "../shared/assetUrls";
import {
  getPronunciationAssetText,
  getPronunciationAssetSpec,
  hasPronunciationOverride,
  PRONUNCIATION_OVERRIDES,
} from "../shared/pronunciationOverrides";

const require = createRequire(import.meta.url);
const generator = require("../../../scripts/lib/pronunciationOverrides.cjs") as {
  getPronunciationAssetText: (text: string) => string;
};

describe("pronunciation overrides", () => {
  it("pins isolated Ant to the short-a CMU pronunciation across capitalization", () => {
    for (const label of ["ant", "Ant"]) {
      expect(hasPronunciationOverride(label)).toBe(true);
      expect(getPronunciationAssetText(label)).toContain('ph="AE1 N T"');
      expect(getPronunciationAssetSpec(label).profile.modelId).toBe("eleven_flash_v2");
    }
  });

  it("does not alter contextual sentences or unrelated words", () => {
    expect(getPronunciationAssetText("I see an ant.")).toBe("I see an ant.");
    expect(getPronunciationAssetText("apple")).toBe("apple");
  });

  it("keeps browser and generator resolution identical", () => {
    const labels = PRONUNCIATION_OVERRIDES.flatMap((override) => override.matches);
    for (const label of [...labels, "apple"]) {
      expect(getPronunciationAssetText(label)).toBe(generator.getPronunciationAssetText(label));
    }
  });

  it("keeps every corrected immutable clip in the tracked override backup", async () => {
    for (const override of PRONUNCIATION_OVERRIDES) {
      const label = override.matches[0];
      const corrected = getPronunciationAssetSpec(label);
      const correctedKey = await audioKey(corrected.text, corrected.profile);
      expect(correctedKey).toBeTruthy();
      const backup = resolve(
        __dirname,
        "../../..",
        "assets",
        "audio-batches",
        "pronunciation-overrides",
        basename(correctedKey!)
      );
      expect(existsSync(backup), `${label} corrected backup must exist`).toBe(true);
      expect(statSync(backup).size).toBeGreaterThan(0);
    }
  });

  it("uses a new immutable key instead of replacing the old recording", async () => {
    const corrected = getPronunciationAssetSpec("ant");
    const oldKey = await audioKey("ant");
    const correctedKey = await audioKey(corrected.text, corrected.profile);
    expect(correctedKey).not.toBe(oldKey);

    for (const key of [oldKey, correctedKey]) {
      expect(key).toBeTruthy();
      const file = resolve(__dirname, "../../..", "public", key!);
      expect(existsSync(file), `${key} must remain available`).toBe(true);
      expect(statSync(file).size).toBeGreaterThan(0);
    }
  });

  it("has no duplicate exact matches", () => {
    const matches = PRONUNCIATION_OVERRIDES.flatMap((override) => override.matches);
    expect(new Set(matches).size).toBe(matches.length);
  });
});
