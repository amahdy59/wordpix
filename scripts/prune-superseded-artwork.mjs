#!/usr/bin/env node
/**
 * Deletes artwork that a newer format has replaced.
 *
 *   node scripts/prune-superseded-artwork.mjs [--ext avif] [--dry-run]
 *
 * After the AVIF import, `public/` holds both formats — roughly 260 MB of webp
 * the app no longer references plus 510 MB of AVIF it does — which together
 * push the published site towards the 1 GB GitHub Pages limit for no benefit.
 *
 * The rule is deliberately narrow: a file is deleted only when a real image of
 * the new format sits beside it under the same name, and only when nothing in
 * the vocabulary data still points at it. Either check alone would be enough to
 * be careful; both together mean a half-finished import cannot take the old
 * artwork down with it.
 */

import { readdir, readFile, stat, unlink } from "node:fs/promises";
import { closeSync, openSync, readSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { HEADER_BYTES, isRealArtwork } from "./lib/image-format.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "public");
const LESSONS = join(ROOT, "src", "app", "data", "lessons.ts");
const SEARCH_DIRS = ["word-images", "scene-images"];

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
// `indexOf` returns -1 when the flag is absent, and `args[0]` is not the
// extension — that quietly made `--dry-run` the target format.
const extAt = args.indexOf("--ext");
const EXT = (extAt === -1 ? "avif" : (args[extAt + 1] ?? "avif")).replace(/^\./, "");

function isReal(absolute) {
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

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

/**
 * Every artwork file the app still references, so a file in use is never
 * deleted even if a same-named replacement happens to exist.
 *
 * Matched by file name rather than by full path, and that is a deliberate
 * loosening. The previous version looked for quoted absolute literals like
 * `"/scene-images/bathroom-hero.webp"`. Hero images are not written that way —
 * they are template literals, `${LOCAL_SCENE_IMAGES}/bathroom-hero.webp` — so
 * all 148 of them read as unreferenced and were deleted out from under the
 * data still pointing at them.
 *
 * A name-based check cannot know how a path was assembled, which is exactly
 * why it is the safer question for a tool whose only action is `unlink`. It
 * errs towards keeping a file: two units sharing an image name means neither
 * copy is pruned. That costs disk. The precise version cost 148 broken
 * screens in production, and this is not a trade worth making twice.
 */
const lessons = await readFile(LESSONS, "utf8");
const referenced = new Set(
  [...lessons.matchAll(/([A-Za-z0-9._-]+\.(?:webp|avif|png|jpe?g))/g)].map((m) => m[1])
);

let deleted = 0;
let bytesFreed = 0;
let keptInUse = 0;
let keptNoReplacement = 0;

for (const dir of SEARCH_DIRS) {
  for await (const file of walk(join(PUBLIC, dir))) {
    if (file.endsWith(`.${EXT}`)) continue;
    if (!/\.(webp|png|jpe?g)$/i.test(file)) continue;

    const replacement = file.replace(/\.[^.]+$/, `.${EXT}`);
    if (!isReal(replacement)) {
      keptNoReplacement++;
      continue;
    }

    const fileName = relative(PUBLIC, file).split(/[\\/]/).pop();
    if (referenced.has(fileName)) {
      keptInUse++;
      continue;
    }

    bytesFreed += (await stat(file)).size;
    deleted++;
    if (!DRY_RUN) await unlink(file);
  }
}

const mb = (bytesFreed / 1024 / 1024).toFixed(1);
console.log(`Prune superseded artwork (keeping .${EXT})`);
console.log(`  ${DRY_RUN ? "would delete" : "deleted"}        ${deleted}  (${mb} MB)`);
console.log(`  kept, still referenced ${keptInUse}`);
console.log(`  kept, no replacement   ${keptNoReplacement}`);
if (DRY_RUN) console.log("\nDry run — nothing removed.");
