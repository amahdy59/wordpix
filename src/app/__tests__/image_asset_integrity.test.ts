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
 * The real artwork lives in Figma. `scripts/figma-sync.mjs` pulls it down, and
 * the "Sync content from Figma" workflow runs that on a GitHub runner. This
 * used to be a ratchet — a placeholder count that could only go down — because
 * 200 images in `human-body` had no counterpart in the design file to import.
 * That unit has since been replaced by the four Figma splits it always
 * corresponded to, so the ratchet is gone and this is a flat assertion: no
 * placeholder survives anywhere.
 */

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

  it("contains no placeholder artwork at all", () => {
    // Was an allow-list of three good units, then a deny-list of one bad one,
    // and now neither: every unit in the course has real photographs behind
    // every word. The last exception was `human-body`, which the design file
    // never had — it is split four ways there, and adopting that split is what
    // finally imported those 200 images.
    const placeholders = words.filter(({ word }) => assetState(word.img) === "placeholder");
    expect(placeholders.map(({ unitId, word }) => `${unitId}: ${word.img}`)).toEqual([]);
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
   * A unit either declares a hero or it does not, and both are legitimate.
   *
   * Seven units — fire-station, zoo, aquarium, cinema, music-room,
   * science-lab, space-center — have word cards in Figma but no scene
   * illustration, so `heroImage` is genuinely absent rather than broken.
   * Explore renders a named panel for those instead of an `<img>`.
   *
   * That distinction is what this suite checks. An absent hero is fine; a
   * hero that names a file which is not there is the bug that put 148 broken
   * images into production, and it stays an exact assertion.
   */
  const heroes = Object.values(COURSE_UNITS)
    .filter((unit): unit is typeof unit & { heroImage: string } => Boolean(unit.heroImage))
    .map((unit) => ({ unitId: unit.id, hero: unit.heroImage }));

  it("covers essentially every unit", () => {
    // Cheap guard against the filter above quietly swallowing the suite: most
    // units do have a hero, and a sudden collapse here means something else.
    expect(heroes.length).toBeGreaterThan(150);
  });

  it("omits the hero rather than naming a file that is not there", () => {
    // The failure mode this replaces: a unit with no scene art still declaring
    // `<id>-hero.avif`, which type-checks, renders, and 404s.
    const withoutHero = Object.values(COURSE_UNITS).filter((unit) => !unit.heroImage);
    for (const unit of withoutHero) {
      expect(unit.heroImage, `${unit.id} should have no hero at all`).toBeUndefined();
    }
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
