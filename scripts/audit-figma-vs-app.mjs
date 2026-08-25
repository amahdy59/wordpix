#!/usr/bin/env node
/**
 * Reconciles the app against the Figma dump, treating Figma as the truth.
 *
 *   node scripts/figma-sync.mjs --content --include-new
 *   node scripts/audit-figma-vs-app.mjs [--json report.json]
 *
 * Reports, per unit and in total:
 *   - units Figma has that the app does not, and vice versa
 *   - words Figma has that the app is missing, and words the app has that
 *     Figma has dropped
 *   - sub-topic grouping the app flattens away
 *   - artwork that is still a placeholder
 *   - which units carry learning materials
 *
 * Read-only. It changes nothing; it says what would have to change.
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { closeSync, openSync, readSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { HEADER_BYTES, isRealArtwork } from "./lib/image-format.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DUMP_DIR = join(ROOT, "figma-dump");
const LESSONS = join(ROOT, "src", "app", "data", "lessons.ts");

const args = process.argv.slice(2);
const jsonPath = args[args.indexOf("--json") + 1];
const wantJson = args.includes("--json") && jsonPath;

/** Same canonicalisation the sync uses, so both sides agree on identity. */
const canonicalKey = (value) =>
  value
    .toLowerCase()
    .replace(/^the[\s-]+/, "")
    .replace(/^l\d+[\s-]+/, "")
    .replace(/\band\b/g, "")
    .replace(/[^a-z0-9]/g, "");

/** Real artwork is a recognised image container; anything else is a placeholder. */
function isPlaceholder(imgPath) {
  const absolute = join(ROOT, "public", imgPath.replace(/^\.?\//, ""));
  let fd;
  try {
    if (statSync(absolute).size < 12) return true;
    fd = openSync(absolute, "r");
    const header = Buffer.alloc(HEADER_BYTES);
    const bytesRead = readSync(fd, header, 0, HEADER_BYTES, 0);
    return !isRealArtwork(header.subarray(0, bytesRead));
  } catch {
    return true;
  } finally {
    if (fd !== undefined) closeSync(fd);
  }
}

/** Units and their vocabulary, parsed out of the generated data layer. */
async function readAppUnits() {
  const source = await readFile(LESSONS, "utf8");
  const start = source.indexOf("export const COURSE_UNITS");
  const body = source.slice(start, source.indexOf("\nexport const COURSE_MODULES", start));

  const units = new Map();
  const unitPattern = /^ {2}"?([a-zA-Z0-9_-]+)"?: \{/gm;
  const ids = [...body.matchAll(unitPattern)].map((m) => m[1]);

  // Vocabulary arrays are declared above COURSE_UNITS and referenced by name,
  // so read them from the whole file rather than from the registry block.
  for (const id of ids) {
    // A const cannot start with a digit, so "3d-printer-lab" is declared as
    // _3D_PRINTER_LAB_VOCABULARY. Read the reference out of the unit's own
    // registry entry instead of reconstructing the name, which reported that
    // unit as having zero words and looked like real drift.
    const entryAt = body.indexOf(`\n  ${id}: {`) >= 0 ? body.indexOf(`\n  ${id}: {`) : body.indexOf(`\n  "${id}": {`);
    const entry = entryAt === -1 ? "" : body.slice(entryAt, entryAt + 800);
    const referenced = entry.match(/vocabulary:\s*([A-Za-z0-9_$]+)/)?.[1];
    const constName = referenced ?? `${id.toUpperCase().replace(/[^A-Z0-9]+/g, "_")}_VOCABULARY`;
    const at = source.indexOf(`export const ${constName}`);
    if (at === -1) {
      units.set(id, { id, words: [], images: new Map() });
      continue;
    }
    const block = source.slice(at, source.indexOf("\n];", at));
    const words = [...block.matchAll(/^\s{4}id: "([^"]+)"/gm)].map((m) => m[1]);
    const images = new Map(
      [...block.matchAll(/id: "([^"]+)",[\s\S]{0,300}?img: "([^"]+)"/g)].map((m) => [m[1], m[2]])
    );
    units.set(id, { id, words, images });
  }
  return units;
}

const appUnits = await readAppUnits();
const appByCanon = new Map([...appUnits.keys()].map((id) => [canonicalKey(id), id]));

const files = (await readdir(DUMP_DIR)).filter((f) => f.endsWith(".json"));
const figmaUnits = [];
for (const file of files) {
  const unit = JSON.parse(await readFile(join(DUMP_DIR, file), "utf8"));
  if (unit.cards.length < 20) continue; // design/wireframe frame, not a unit
  figmaUnits.push(unit);
}

const report = {
  figmaUnits: figmaUnits.length,
  appUnits: appUnits.size,
  matched: 0,
  figmaOnly: [],
  appOnly: [],
  unitsWithMaterials: 0,
  wordDrift: [],
  totals: { figmaWords: 0, appWords: 0, missingInApp: 0, staleInApp: 0, placeholders: 0 },
};

const matchedAppIds = new Set();

for (const unit of figmaUnits) {
  report.totals.figmaWords += unit.cards.length;
  if (unit.materials) report.unitsWithMaterials++;

  const appId = appByCanon.get(canonicalKey(unit.unitId));
  if (!appId) {
    report.figmaOnly.push({ id: unit.unitId, name: unit.name, cards: unit.cards.length });
    continue;
  }

  matchedAppIds.add(appId);
  report.matched++;

  const app = appUnits.get(appId);
  const figmaIds = unit.cards.map((c) => c.id);
  const appIds = new Set(app.words);
  const figmaSet = new Set(figmaIds);

  const missingInApp = figmaIds.filter((id) => !appIds.has(id));
  const staleInApp = app.words.filter((id) => !figmaSet.has(id));
  const placeholders = app.words.filter((id) => {
    const img = app.images.get(id);
    return img ? isPlaceholder(img) : true;
  });

  report.totals.appWords += app.words.length;
  report.totals.missingInApp += missingInApp.length;
  report.totals.staleInApp += staleInApp.length;
  report.totals.placeholders += placeholders.length;

  if (missingInApp.length || staleInApp.length || placeholders.length) {
    report.wordDrift.push({
      unit: appId,
      figmaName: unit.name,
      figmaCards: figmaIds.length,
      appWords: app.words.length,
      missingInApp,
      staleInApp,
      placeholders: placeholders.length,
      subtopics: (unit.subtopics ?? []).length,
      hasMaterials: Boolean(unit.materials),
    });
  }
}

report.appOnly = [...appUnits.keys()].filter((id) => !matchedAppIds.has(id));

/* ------------------------------------------------------------------ output */

const pct = (n, d) => (d ? `${((n / d) * 100).toFixed(1)}%` : "—");

console.log("FIGMA vs APP\n");
console.log(`Figma content units      ${report.figmaUnits}`);
console.log(`App units                ${report.appUnits}`);
console.log(`Matched                  ${report.matched}`);
console.log(`In Figma, not in app     ${report.figmaOnly.length}`);
console.log(`In app, not in Figma     ${report.appOnly.length}`);
console.log(`Units with materials     ${report.unitsWithMaterials}`);

console.log(`\nWords`);
console.log(`  Figma                  ${report.totals.figmaWords}`);
console.log(`  App (matched units)    ${report.totals.appWords}`);
console.log(
  `  Missing from app       ${report.totals.missingInApp} (${pct(report.totals.missingInApp, report.totals.figmaWords)} of Figma)`
);
console.log(
  `  Stale in app           ${report.totals.staleInApp} (in app, gone from Figma)`
);
console.log(`  Still placeholder art  ${report.totals.placeholders}`);

const drifted = report.wordDrift.filter((d) => d.missingInApp.length || d.staleInApp.length);
console.log(`\nUnits whose word list differs from Figma: ${drifted.length}`);
for (const d of drifted.slice(0, 25)) {
  const bits = [];
  if (d.missingInApp.length) bits.push(`+${d.missingInApp.length} missing`);
  if (d.staleInApp.length) bits.push(`-${d.staleInApp.length} stale`);
  console.log(`  ${d.unit.padEnd(28)} figma ${String(d.figmaCards).padStart(3)}  app ${String(d.appWords).padStart(3)}  ${bits.join(", ")}`);
}
if (drifted.length > 25) console.log(`  … and ${drifted.length - 25} more`);

if (report.figmaOnly.length) {
  console.log(`\nIn Figma, not in the app:`);
  for (const u of report.figmaOnly) console.log(`  ${u.id.padEnd(32)} ${u.cards} cards`);
}
if (report.appOnly.length) {
  console.log(`\nIn the app, not in Figma:`);
  for (const id of report.appOnly) console.log(`  ${id}`);
}

if (wantJson) {
  await writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`\nFull report written to ${jsonPath}`);
}
