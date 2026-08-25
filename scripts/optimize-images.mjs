#!/usr/bin/env node
/**
 * Caps committed artwork at the resolution the app actually renders.
 *
 *   node scripts/optimize-images.mjs            # report only
 *   node scripts/optimize-images.mjs --write    # rewrite oversized files
 *
 * Word cards render at 214x128 CSS, so 480px covers a 2x display with room to
 * spare; scene illustrations are a unit's full-width hero (912x400 in the
 * design) and get a much higher cap. Earlier imports committed artwork at up
 * to 1920px, which costs repository size and download bandwidth for pixels no
 * layout ever shows.
 *
 * Placeholders are skipped: they are SVG documents saved under a `.webp`
 * extension, and re-encoding them would turn a recognisable "not imported yet"
 * marker into something that looks like real artwork to every check that
 * reads magic bytes.
 *
 * Run this after a Figma sync that used a larger cap, or leave it alone —
 * `figma-sync.mjs` already writes at these limits.
 */

import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const TARGETS = [
  { dir: join(ROOT, "public", "word-images"), maxWidth: 480, label: "cards" },
  { dir: join(ROOT, "public", "scene-images"), maxWidth: 1600, label: "scenes" },
];

const QUALITY = 82;
const WRITE = process.argv.includes("--write");

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.error("sharp is required. Install it with:  pnpm add -D sharp");
  process.exit(2);
}

/** Real artwork is a RIFF/WEBP container; anything else is a placeholder. */
function isRealWebp(buffer) {
  return (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  );
}

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (entry.name.endsWith(".webp")) yield path;
  }
}

async function processTarget({ dir, maxWidth, label }) {
  let scanned = 0;
  let placeholders = 0;
  let resized = 0;
  let bytesBefore = 0;
  let bytesAfter = 0;

  for await (const path of walk(dir)) {
    scanned++;
    const original = await readFile(path);

    if (!isRealWebp(original)) {
      placeholders++;
      continue;
    }

    const { width } = await sharp(original).metadata();
    if (!width || width <= maxWidth) {
      bytesBefore += original.length;
      bytesAfter += original.length;
      continue;
    }

    const optimized = await sharp(original)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toBuffer();

    // Never trade a smaller image for a larger file.
    if (optimized.length >= original.length) {
      bytesBefore += original.length;
      bytesAfter += original.length;
      continue;
    }

    bytesBefore += original.length;
    bytesAfter += optimized.length;
    resized++;

    if (WRITE) await writeFile(path, optimized);
  }

  const mb = (n) => (n / 1e6).toFixed(1);
  console.log(
    `${label.padEnd(7)} scanned ${String(scanned).padStart(6)}  ` +
      `placeholders ${String(placeholders).padStart(6)}  ` +
      `${WRITE ? "resized" : "would resize"} ${String(resized).padStart(5)}  ` +
      `${mb(bytesBefore)} MB → ${mb(bytesAfter)} MB`
  );

  return { bytesBefore, bytesAfter, resized };
}

let totalBefore = 0;
let totalAfter = 0;
let totalResized = 0;

for (const target of TARGETS) {
  const r = await processTarget(target);
  totalBefore += r.bytesBefore;
  totalAfter += r.bytesAfter;
  totalResized += r.resized;
}

const savedMb = ((totalBefore - totalAfter) / 1e6).toFixed(1);
console.log(
  `\n${WRITE ? "Rewrote" : "Would rewrite"} ${totalResized} file(s), ` +
    `${WRITE ? "saving" : "saving"} ${savedMb} MB.`
);
if (!WRITE && totalResized > 0) console.log("Re-run with --write to apply.");
