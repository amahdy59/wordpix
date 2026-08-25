#!/usr/bin/env node
/**
 * Repoints the vocabulary data at whichever artwork actually exists on disk.
 *
 *   node scripts/retarget-artwork-paths.mjs [--ext avif] [--dry-run]
 *
 * The image format changed from webp to AVIF, and 10,848 `img:` paths in the
 * generated data layer name the old extension. Rewriting them blindly would be
 * worse than leaving them: a path pointing at a file that was never downloaded
 * is a broken image, and the integrity test would only catch it after the fact.
 *
 * So each path is switched only when a real file is sitting at the new
 * extension. A card the sync could not render keeps pointing at the artwork it
 * still has, which is the difference between a partial import and a broken one.
 *
 * Idempotent: running it twice changes nothing the second time.
 */

import { readFile, writeFile } from "node:fs/promises";
import { closeSync, existsSync, openSync, readSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { HEADER_BYTES, isRealArtwork } from "./lib/image-format.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LESSONS = join(ROOT, "src", "app", "data", "lessons.ts");

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
// `indexOf` returns -1 when the flag is absent, and `args[0]` is not the
// extension — that quietly made `--dry-run` the target format.
const extAt = args.indexOf("--ext");
const EXT = (extAt === -1 ? "avif" : (args[extAt + 1] ?? "avif")).replace(/^\./, "");

/** True when `publicPath` names a real image, not a placeholder or a gap. */
function hasRealArtwork(publicPath) {
  const absolute = join(ROOT, "public", publicPath.replace(/^\.?\//, ""));
  if (!existsSync(absolute)) return false;
  let fd;
  try {
    if (statSync(absolute).size < 12) return false;
    fd = openSync(absolute, "r");
    const header = Buffer.alloc(HEADER_BYTES);
    const bytesRead = readSync(fd, header, 0, HEADER_BYTES, 0);
    return isRealArtwork(header.subarray(0, bytesRead));
  } catch {
    return false;
  } finally {
    if (fd !== undefined) closeSync(fd);
  }
}

const source = await readFile(LESSONS, "utf8");

let switched = 0;
let alreadyThere = 0;
let leftAlone = 0;
const missing = [];

/**
 * The two ways `lessons.ts` spells an artwork path.
 *
 * Word images are quoted absolute literals. Hero images are not — they are
 * template literals built from a constant, `${LOCAL_SCENE_IMAGES}/x.webp`.
 * Matching only the first form is what left 148 heroes pointing at `.webp`
 * while the prune deleted the files underneath them, so both forms are
 * handled here and `stem` is normalised to a real public path either way.
 */
const PATH_FORMS = [
  {
    pattern: /"(\/(?:word-images|scene-images)\/[^"]+?)\.(webp|png|jpg|jpeg|avif)"/g,
    toPublicPath: (stem) => stem,
    rebuild: (stem, ext) => `"${stem}.${ext}"`,
  },
  {
    pattern: /\$\{LOCAL_SCENE_IMAGES\}\/([a-z0-9-]+)\.(webp|png|jpg|jpeg|avif)/g,
    toPublicPath: (stem) => `/scene-images/${stem}`,
    rebuild: (stem, ext) => `\${LOCAL_SCENE_IMAGES}/${stem}.${ext}`,
  },
];

// Only local artwork under public/ is a candidate; remote URLs are left as is.
let updated = source;
for (const { pattern, toPublicPath, rebuild } of PATH_FORMS) {
  updated = updated.replace(pattern, (whole, stem, currentExt) => {
    if (currentExt === EXT) {
      alreadyThere++;
      return whole;
    }
    const candidate = `${toPublicPath(stem)}.${EXT}`;
    if (hasRealArtwork(candidate)) {
      switched++;
      return rebuild(stem, EXT);
    }
    leftAlone++;
    if (missing.length < 20) missing.push(candidate);
    return whole;
  });
}

console.log(`Retarget artwork paths → .${EXT}`);
console.log(`  switched            ${switched}`);
console.log(`  already .${EXT.padEnd(12)}${alreadyThere}`);
console.log(`  left on old format  ${leftAlone}`);

if (leftAlone) {
  console.log(`\n  No real .${EXT} found for these (showing up to 20):`);
  for (const path of missing) console.log(`    ${path}`);
  console.log(`\n  These keep their existing artwork. Re-run the sync to fill them in.`);
}

if (DRY_RUN) {
  console.log("\nDry run — nothing written.");
} else if (switched) {
  await writeFile(LESSONS, updated);
  console.log(`\nWrote ${LESSONS}`);
} else {
  console.log("\nNothing to change.");
}
