import { describe, expect, it } from "vitest";
import { closeSync, openSync, readSync, statSync } from "node:fs";
import { join } from "node:path";
import { COURSE_UNITS } from "../data/lessons";
import { loadAllUnitVocabulary } from "../data/vocabulary";
// The same detector the sync script and the audit use, so the three can never
// disagree about what counts as a real image.
// @ts-expect-error -- plain .mjs helper shared with the build scripts
import { HEADER_BYTES, isRealArtwork } from "../../../scripts/lib/image-format.mjs";

/**
 * Guards against the failure this suite could not previously see.
 *
 * Every referenced image path resolved to a file on disk, and a test asserting
 * exactly that passed — while most of those files were generated placeholder
 * tiles rather than photographs. Checking that a path exists says nothing
 * about whether there is an image behind it.
 *
 * File size was the second wrong answer: the placeholders are SVG documents
 * saved under an image extension, so a large one would slip through a size
 * threshold. Magic bytes settle it exactly — real artwork is a recognised
 * raster container, and anything else is a placeholder however big it is.
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
    const header = Buffer.alloc(HEADER_BYTES);
    const bytesRead = readSync(fd, header, 0, HEADER_BYTES, 0);
    return isRealArtwork(header.subarray(0, bytesRead)) ? "real" : "placeholder";
  } catch {
    return "missing";
  } finally {
    if (fd !== undefined) closeSync(fd);
  }
}

// Loaded once for the whole file: vocabulary is per-unit chunks now, and
// every assertion here spans the entire catalogue.
const unitWords = await loadAllUnitVocabulary();

describe("word image assets", () => {
  const words = Object.values(COURSE_UNITS).flatMap((unit) =>
    (unitWords.get(unit.id) ?? []).map((word) => ({ unitId: unit.id, word }))
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
      const bad = (unitWords.get(unit.id) ?? []).filter(
        (word) => assetState(word.img) === "placeholder"
      );
      expect(
        bad.map((w) => w.img),
        `${unit.id} contains placeholder artwork`
      ).toEqual([]);
    }
  }, 60000);
});

/**
 * Hero artwork, which the suite above never looked at.
 *
 * The word-image checks walked `unit.vocabulary` and stopped there, so
 * `unit.heroImage` — the illustration on every unit's entry screen — was
 * outside every assertion in this file. That gap turned into 148 broken
 * images in production.
 *
 * The AVIF migration retargeted image paths by rewriting quoted absolute
 * literals like `"/word-images/bathroom/sink.webp"`. Hero paths are not
 * written that way; they are template literals,
 * `` `${LOCAL_SCENE_IMAGES}/bathroom-hero.webp` ``, so the rewrite passed
 * over them and left them pointing at `.webp`. The prune step that follows
 * deletes any superseded file nothing references — and it searched for the
 * same literal form, so it read all 148 retargeted-in-name-only heroes as
 * unreferenced and removed them. Two tools agreeing on a path format neither
 * hero paths nor a human would have guessed.
 *
 * The lesson is the assertion, not the fix: check the asset a screen actually
 * loads, not the spelling of the path that leads to it.
 */
describe("unit hero images", () => {
  /**
   * `human-body` has no hero and never has. It is the one unit the Figma file
   * has no counterpart for — the design splits it into four units the app has
   * not adopted — so there is nothing to import. Named here so the assertion
   * below can stay exact instead of being softened into a ratchet.
   */
  const UNITS_WITHOUT_HERO = new Set(["human-body"]);

  const heroes = Object.values(COURSE_UNITS)
    .filter((unit) => !UNITS_WITHOUT_HERO.has(unit.id))
    .map((unit) => ({ unitId: unit.id, hero: unit.heroImage }));

  it("covers essentially every unit", () => {
    // Cheap guard against the filter above quietly swallowing the suite.
    expect(heroes.length).toBeGreaterThan(150);
  });

  it("resolves every hero image to a file on disk", () => {
    const missing = heroes.filter(({ hero }) => assetState(hero) === "missing");
    expect(
      missing.map(({ unitId, hero }) => `${unitId}: ${hero}`),
      "A unit entry screen points at artwork that is not there."
    ).toEqual([]);
  }, 60000);

  it("resolves every hero image to real artwork, not a placeholder", () => {
    const placeholders = heroes.filter(({ hero }) => assetState(hero) === "placeholder");
    expect(placeholders.map(({ unitId, hero }) => `${unitId}: ${hero}`)).toEqual([]);
  }, 60000);
});
