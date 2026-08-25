import { describe, expect, it } from "vitest";
import { closeSync, openSync, readSync, statSync } from "node:fs";
import { join } from "node:path";
import { COURSE_UNITS } from "../data/lessons";

/**
 * Guards against the failure this suite could not previously see.
 *
 * Every referenced image path resolved to a file on disk, and a test asserting
 * exactly that passed — while most of those files were generated placeholder
 * tiles rather than photographs. Checking that a path exists says nothing
 * about whether there is an image behind it.
 *
 * File size was the second wrong answer: the placeholders are SVG documents
 * saved under a `.webp` extension, so a large one would slip through a size
 * threshold. Magic bytes settle it exactly — real artwork is a RIFF/WEBP
 * container, and anything else is a placeholder however big it is.
 *
 * The real artwork lives in Figma as image fills. `scripts/figma-sync.mjs`
 * pulls it down, and the "Sync content from Figma" workflow runs that on a
 * GitHub runner. Until it has been run for every unit this is a ratchet rather
 * than a pass/fail gate: the count may only go down. Lower the baseline
 * whenever artwork lands, and the day it reaches zero, replace the ratchet
 * with a flat assertion that no placeholder survives.
 */

/**
 * Placeholders still outstanding. This number may only decrease.
 *
 * After the first full Figma import it is 200 — every one of them in
 * `human-body`, the single app unit the design file has no counterpart for:
 * Figma split it into four units (head & face, upper body, lower body, hands
 * & feet) that the app has not adopted yet. Adopting them, or renaming to
 * match, takes this to zero.
 */
const PLACEHOLDER_BASELINE = 200;

/** The only unit still allowed to contain placeholders. */
const UNIMPORTED_UNITS = new Set(["human-body"]);

const PUBLIC_DIR = join(process.cwd(), "public");

type AssetState = "missing" | "real" | "placeholder";

function assetState(imgPath: string): AssetState {
  const relative = imgPath.replace(/^\.?\//, "");
  const absolute = join(PUBLIC_DIR, relative);

  let fd: number | undefined;
  try {
    if (statSync(absolute).size < 12) return "placeholder";
    fd = openSync(absolute, "r");
    const header = Buffer.alloc(12);
    readSync(fd, header, 0, 12, 0);
    const isWebp =
      header.subarray(0, 4).toString("ascii") === "RIFF" &&
      header.subarray(8, 12).toString("ascii") === "WEBP";
    return isWebp ? "real" : "placeholder";
  } catch {
    return "missing";
  } finally {
    if (fd !== undefined) closeSync(fd);
  }
}

describe("word image assets", () => {
  const words = Object.values(COURSE_UNITS).flatMap((unit) =>
    unit.vocabulary.map((word) => ({ unitId: unit.id, word }))
  );

  it("resolves every referenced image to a file on disk", () => {
    const missing = words.filter(({ word }) => assetState(word.img) === "missing");
    expect(missing.map(({ word }) => word.img)).toEqual([]);
  }, 60000);

  it("never regresses the number of placeholder images", () => {
    const placeholders = words.filter(({ word }) => assetState(word.img) === "placeholder");

    expect(
      placeholders.length,
      placeholders.length > PLACEHOLDER_BASELINE
        ? `Placeholder count rose to ${placeholders.length} (baseline ${PLACEHOLDER_BASELINE}). ` +
            "Real artwork was probably overwritten by generated tiles."
        : `Placeholder count is now ${placeholders.length}; lower PLACEHOLDER_BASELINE to match.`
    ).toBeLessThanOrEqual(PLACEHOLDER_BASELINE);
  }, 60000);

  it("keeps every imported unit free of placeholders", () => {
    // Inverted from an allow-list of three good units to a deny-list of one
    // bad one: after the full import, real artwork is the rule and a
    // placeholder is the exception that has to be named.
    for (const unit of Object.values(COURSE_UNITS)) {
      if (UNIMPORTED_UNITS.has(unit.id)) continue;
      const bad = unit.vocabulary.filter((word) => assetState(word.img) === "placeholder");
      expect(
        bad.map((w) => w.img),
        `${unit.id} contains placeholder artwork`
      ).toEqual([]);
    }
  }, 60000);
});
