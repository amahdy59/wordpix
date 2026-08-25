import { describe, expect, it } from "vitest";
import { statSync } from "node:fs";
import { join } from "node:path";
import { COURSE_UNITS } from "../data/lessons";

/**
 * Guards against the failure this suite could not previously see.
 *
 * Every referenced image path resolved to a file on disk, and a test asserting
 * exactly that passed — while 10,285 of those files were ~1.4 KB generated
 * placeholder tiles rather than photographs. Checking that a path exists says
 * nothing about whether there is an image behind it.
 *
 * The real artwork lives in Figma as image fills; `scripts/figma-sync.mjs`
 * pulls it down. Until that has been run for every unit, this is a ratchet
 * rather than a pass/fail gate: the count may only go down. Lower the baseline
 * whenever images land, and the day it reaches zero, replace the ratchet with
 * a flat assertion that no placeholder survives.
 */

/** At or below this many bytes, a .webp is a generated tile, not a photo. */
const PLACEHOLDER_MAX_BYTES = 3000;

/**
 * Placeholders present when the guard was introduced. This number may only
 * decrease. If a change pushes it up, real artwork has been overwritten.
 */
const PLACEHOLDER_BASELINE = 10285;

const PUBLIC_DIR = join(process.cwd(), "public");

function sizeOf(imgPath: string): number | null {
  const relative = imgPath.replace(/^\.?\//, "");
  try {
    return statSync(join(PUBLIC_DIR, relative)).size;
  } catch {
    return null;
  }
}

describe("word image assets", () => {
  const words = Object.values(COURSE_UNITS).flatMap((unit) =>
    unit.vocabulary.map((word) => ({ unitId: unit.id, word }))
  );

  it("resolves every referenced image to a file on disk", () => {
    const missing = words.filter(({ word }) => sizeOf(word.img) === null);
    expect(missing.map(({ word }) => word.img)).toEqual([]);
  }, 60000);

  it("never regresses the number of placeholder images", () => {
    const placeholders = words.filter(({ word }) => {
      const size = sizeOf(word.img);
      return size !== null && size <= PLACEHOLDER_MAX_BYTES;
    });

    expect(
      placeholders.length,
      placeholders.length > PLACEHOLDER_BASELINE
        ? `Placeholder count rose to ${placeholders.length} (baseline ${PLACEHOLDER_BASELINE}). ` +
            "Real artwork was probably overwritten by generated tiles."
        : `Placeholder count is now ${placeholders.length}; lower PLACEHOLDER_BASELINE to match.`
    ).toBeLessThanOrEqual(PLACEHOLDER_BASELINE);
  }, 60000);

  it("keeps the fully-imported units free of placeholders", () => {
    // These three units have real artwork today; they must stay that way.
    const IMPORTED_UNITS = ["bathroom", "classroom", "playground"];
    for (const unitId of IMPORTED_UNITS) {
      const unit = COURSE_UNITS[unitId];
      if (!unit) continue;
      const bad = unit.vocabulary.filter((word) => {
        const size = sizeOf(word.img);
        return size !== null && size <= PLACEHOLDER_MAX_BYTES;
      });
      expect(
        bad.map((w) => w.img),
        `${unitId} lost real artwork`
      ).toEqual([]);
    }
  }, 60000);
});
