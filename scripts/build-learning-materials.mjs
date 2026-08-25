#!/usr/bin/env node
/**
 * Turns the Figma content dump into typed learning-material modules.
 *
 *   node scripts/figma-sync.mjs --content     # produces figma-dump/*.json
 *   node scripts/build-learning-materials.mjs # produces src/app/learning/units/*.ts
 *
 * Flags
 *   --check     report what would be generated, write nothing
 *   --unit X    restrict to one unit (repeatable)
 *   --overwrite regenerate hand-authored modules too (see below)
 *   --include-new emit modules for units Figma has that the app does not
 *
 * Hand-authored modules are left alone. A generated module is stamped
 * GENERATED in its header; anything without that stamp was written by a person
 * who could pick real distractors and write real explanations, which this
 * script cannot. Regenerating over it would be a quiet downgrade.
 *
 * Every unit's "Learning Materials" frame holds the same eight blocks, and
 * each block flattens to an ordered list of text lines. The parsers below turn
 * those lines back into structure. Anything that does not parse cleanly is
 * dropped with a warning rather than emitted half-formed: a missing section
 * renders as absent, while a malformed one would render as broken.
 */

import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DUMP_DIR = join(ROOT, "figma-dump");
const OUT_DIR = join(ROOT, "src", "app", "learning", "units");
const REGISTRY = join(ROOT, "src", "app", "learning", "registry.ts");

const args = process.argv.slice(2);
const CHECK = args.includes("--check");
const OVERWRITE = args.includes("--overwrite");
const INCLUDE_NEW = args.includes("--include-new");
const ONLY = args.reduce((acc, a, i) => (a === "--unit" && args[i + 1] ? [...acc, args[i + 1]] : acc), []);

/** Strips a leading emoji/pictograph and surrounding whitespace from a heading. */
const stripLeadingEmoji = (s) =>
  s.replace(/^[\p{Extended_Pictographic}️‍\s]+/u, "").trim();

/** Figma writes "1.  Some text" with padded numbering. */
const stripNumbering = (s) => s.replace(/^\d+\.\s*/, "").trim();

const textsOf = (block) => (block?.lines ?? []).map((l) => l.text.trim()).filter(Boolean);

/* --------------------------------------------------------------- parsers */

function parsePassage(block, unitId) {
  const lines = textsOf(block);
  if (lines.length < 3) return undefined;

  const questionsStart = lines.findIndex((l) => /^comprehension questions$/i.test(l));
  const before = questionsStart === -1 ? lines.slice(1) : lines.slice(1, questionsStart);
  if (!before.length) return undefined;

  // Templates differ in where the passage sits: one puts it immediately after
  // the heading, another inserts a "Level: B1 · Topic: …" line first. Taking
  // the longest line ahead of the questions finds the prose in both, rather
  // than a metadata line that rendered as an empty passage.
  const text = before.reduce((longest, line) => (line.length > longest.length ? line : longest), "");
  if (text.length < 80) return undefined;

  const heading = stripLeadingEmoji(lines[0]);
  const level =
    heading.match(/\(([A-C][12])\)/)?.[1] ??
    before.join(" ").match(/level:\s*([A-C][12])/i)?.[1] ??
    "B1";
  const title = heading.replace(/\s*\([^)]*\)\s*$/, "").trim() || "Reading Passage";

  const rawQuestions =
    questionsStart === -1 ? [] : lines.slice(questionsStart + 1).map(stripNumbering).filter(Boolean);

  // Every generated question is a prompt, never a quiz.
  //
  // Mechanical conversion to multiple choice was tried and produces answers
  // that are confidently wrong: for "Where does the writer keep jackets and
  // shirts?" it picked "Dresser" where the passage says wardrobe. Picking a
  // vocabulary word that merely appears near the question's words is not
  // comprehension, and a wrong answer marked correct teaches the wrong thing —
  // worse than no quiz at all.
  //
  // Hand-authored modules still carry real multiple choice, because a person
  // can read the passage and choose distractors that discriminate. Until that
  // is done per unit, the questions stand as Figma wrote them.
  return {
    title,
    level,
    text,
    questions: [],
    ...(rawQuestions.length ? { openQuestions: rawQuestions } : {}),
  };
}

/**
 * Two shapes appear in the file.
 *
 * The older one tags the kind inline and packs meaning and example together:
 *   "throw in the towel" / "(idiom) To give up. \"After three failed…\""
 *
 * The newer one splits them over three lines and carries no tag at all:
 *   "hit the pillow" / "go to bed and fall asleep quickly" / "\"After a long…\""
 *
 * Both are parsed. Where the tag is absent the kind is inferred from the shape
 * of the phrase — a verb followed by a particle is a phrasal verb, anything
 * else an idiom — and marked `kindInferred` so the app can be honest about it
 * rather than presenting a guess as a fact.
 */
const PARTICLES = new Set([
  "up", "down", "in", "out", "on", "off", "over", "through", "away", "back",
  "around", "along", "apart", "aside", "together", "across", "after", "into",
]);

function inferKind(phrase) {
  const words = phrase.toLowerCase().split(/\s+/);
  const last = words[words.length - 1];
  if (words.length <= 3 && PARTICLES.has(last)) return "phrasal-verb";
  return "idiom";
}

const isExampleLine = (line) => /^["“]/.test(line);

const KIND_BY_TAG = {
  idiom: "idiom",
  "phrasal verb": "phrasal-verb",
  collocation: "collocation",
};

function parsePhrases(block, unitId) {
  const lines = textsOf(block).slice(1);
  const entries = [];

  for (let i = 0; i < lines.length; ) {
    const phrase = lines[i];
    const next = lines[i + 1];
    if (!next) break;

    // Only these three are kind tags. Other parentheticals — "(of a plane)" —
    // are context notes belonging to the meaning, and must not be eaten.
    const tagged = next.match(/^\((idiom|phrasal verb|collocation)\)\s*/i);
    if (tagged) {
      const rest = next.slice(tagged[0].length);
      const example = rest.match(/["“](.+)["”]\s*$/);
      entries.push({
        id: `${unitId}-${slugify(phrase)}`,
        phrase,
        kind: KIND_BY_TAG[tagged[1].toLowerCase()],
        meaning: (example ? rest.slice(0, example.index) : rest).trim(),
        example: example ? example[1].trim() : "",
      });
      i += 2;
      continue;
    }

    // Untagged: phrase, meaning, then an optional quoted example.
    const third = lines[i + 2];
    const hasExample = third && isExampleLine(third);
    entries.push({
      id: `${unitId}-${slugify(phrase)}`,
      phrase,
      kind: inferKind(phrase),
      kindInferred: true,
      meaning: next.trim(),
      example: hasExample ? third.replace(/^["“]|["”]$/g, "").trim() : "",
    });
    i += hasExample ? 3 : 2;
  }

  return entries.length ? entries : undefined;
}

function parseDialogue(block) {
  const lines = textsOf(block);
  if (!lines.length) return undefined;
  const title = stripLeadingEmoji(lines[0]).replace(/^mini dialogue\s*[—-]\s*/i, "").trim();
  const dialogue = [];
  for (let i = 1; i + 1 < lines.length; i += 2) {
    const speaker = lines[i].replace(/:$/, "").trim();
    dialogue.push({ speaker, text: lines[i + 1] });
  }
  return dialogue.length ? { title: title || "Mini Dialogue", lines: dialogue } : undefined;
}

/** Both ✗/✓ and ❌/✅ appear in the file; accept either marker. */
const WRONG_MARK = /^(✗|❌)\s*/;
const RIGHT_MARK = /^(✓|✅)\s*/;

function parseMistakes(block, unitId) {
  const lines = textsOf(block).slice(1);
  const out = [];
  for (let i = 0; i + 2 < lines.length; i += 3) {
    if (!WRONG_MARK.test(lines[i]) || !RIGHT_MARK.test(lines[i + 1])) continue;
    const wrong = lines[i].replace(WRONG_MARK, "").trim();
    const right = lines[i + 1].replace(RIGHT_MARK, "").trim();
    out.push({ id: `${unitId}-${slugify(right).slice(0, 40)}`, wrong, right, note: lines[i + 2] });
  }
  return out.length ? out : undefined;
}

/**
 * Column layout varies: some units use Noun/Verb/Adjective/Adverb, others lead
 * with a Base Word column and drop Adverb. Read the header row rather than
 * assuming four columns — assuming produced rows shifted by one, which is
 * worse than no table at all.
 */
const WF_HEADERS = ["base word", "noun", "verb", "adjective", "adverb"];

function parseWordFormation(block) {
  const lines = textsOf(block).slice(1);
  const firstHeader = lines.findIndex((l) => WF_HEADERS.includes(l.toLowerCase()));
  if (firstHeader === -1) return undefined;

  const headers = [];
  let i = firstHeader;
  while (i < lines.length && WF_HEADERS.includes(lines[i].toLowerCase())) {
    headers.push(lines[i].toLowerCase());
    i++;
  }
  if (headers.length < 2) return undefined;

  const cells = lines.slice(i);
  const rows = [];
  for (let c = 0; c + headers.length - 1 < cells.length; c += headers.length) {
    const slice = cells.slice(c, c + headers.length).map((v) => (v === "—" ? null : v));
    const row = { noun: null, verb: null, adjective: null, adverb: null };
    headers.forEach((h, idx) => {
      if (h === "base word") row.base = slice[idx];
      else row[h] = slice[idx];
    });
    if ([row.noun, row.verb, row.adjective, row.adverb].every((v) => v === null)) continue;
    rows.push(row);
  }
  return rows.length ? rows : undefined;
}

function parseBlanks(block, unitId) {
  const lines = textsOf(block);
  const keyIndex = lines.findIndex((l) => /^answer key$/i.test(l));
  const sentenceLines = lines
    .slice(1, keyIndex === -1 ? undefined : keyIndex)
    .filter((l) => /^\d+\.\s/.test(l));
  if (!sentenceLines.length || keyIndex === -1) return undefined;

  const answers = (lines[keyIndex + 1] ?? "")
    .split(/\s*\d+\.\s*/)
    .map((a) => a.trim())
    .filter(Boolean);
  if (answers.length !== sentenceLines.length) return undefined;

  return sentenceLines.map((line, i) => ({
    id: `${unitId}-b${i + 1}`,
    sentence: stripNumbering(line).replace(/_{2,}/, "____"),
    answer: answers[i],
  }));
}

function parseNotes(block, unitId) {
  const lines = textsOf(block).slice(1);
  const out = [];
  for (let i = 0; i + 1 < lines.length; i += 2) {
    const title = stripLeadingEmoji(lines[i]);
    out.push({ id: `${unitId}-${slugify(title).slice(0, 40)}`, title, body: lines[i + 1] });
  }
  return out.length ? out : undefined;
}

function parseWordMeta(block) {
  const lines = textsOf(block);
  const headerEnd = lines.findIndex((l) => /^key collocations$/i.test(l));
  if (headerEnd === -1) return undefined;
  const cells = lines.slice(headerEnd + 1);
  const rows = [];
  for (let i = 0; i + 3 < cells.length; i += 4) {
    const [word, partOfSpeech, freq, collocations] = cells.slice(i, i + 4);
    const frequency = (freq.match(/★/g) ?? []).length;
    if (!word || !frequency) continue;
    rows.push({
      word,
      partOfSpeech,
      frequency,
      collocations: collocations.split(",").map((c) => c.trim()).filter(Boolean),
    });
  }
  return rows.length ? rows : undefined;
}

function dedupeSubtopics(subtopics) {
  const seen = new Set();
  const out = [];
  for (const topic of subtopics) {
    const wordIds = (topic.wordIds ?? []).filter((id) => {
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
    if (wordIds.length) out.push({ id: topic.id, title: topic.title ?? topic.id, wordIds });
  }
  return out;
}

/** Same canonicalisation the sync uses, so both sides agree on unit identity. */
const canonicalKey = (value) =>
  value
    .toLowerCase()
    .replace(/^the[\s-]+/, "")
    .replace(/^l\d+[\s-]+/, "")
    .replace(/\band\b/g, "")
    .replace(/[^a-z0-9]/g, "");

/** Unit ids the app actually registers, keyed canonically. */
async function readAppUnitIds() {
  const source = await readFile(join(ROOT, "src", "app", "data", "lessons.ts"), "utf8");
  const start = source.indexOf("export const COURSE_UNITS");
  if (start === -1) return new Map();
  const body = source.slice(start, source.indexOf("\nexport const COURSE_MODULES", start));
  const ids = [...body.matchAll(/^ {2}"?([a-zA-Z0-9_-]+)"?: \{/gm)].map((m) => m[1]);
  return new Map(ids.map((id) => [canonicalKey(id), id]));
}

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "item";

/* -------------------------------------------------------------- emitting */

const ts = (value) => JSON.stringify(value, null, 2).replace(/\n/g, "\n  ");

function renderModule(unitId, materials, constName) {
  return `// Learning materials for "${materials.name}".
//
// GENERATED by scripts/build-learning-materials.mjs from figma-dump/${unitId}.json.
// Figma is the source of truth: edit the design file and re-run the sync,
// do not hand-edit this file.

import type { UnitLearningMaterials } from "../types";

export const ${constName}: UnitLearningMaterials = ${ts({
    unitId,
    subtopics: materials.subtopics,
    passage: materials.passage,
    phrases: materials.phrases,
    dialogue: materials.dialogue,
    mistakes: materials.mistakes,
    wordFormation: materials.wordFormation,
    blankExercises: materials.blankExercises,
    culturalNotes: materials.culturalNotes,
    wordMeta: materials.wordMeta,
  })};
`;
}

/**
 * An identifier cannot start with a digit, so "3d-printer-lab" becomes
 * _3D_PRINTER_LAB_LEARNING — the same shape lessons.ts already uses for its
 * vocabulary constant.
 */
const constNameFor = (unitId) => {
  const name = `${unitId.toUpperCase().replace(/[^A-Z0-9]+/g, "_")}_LEARNING`;
  return /^\d/.test(name) ? `_${name}` : name;
};

function renderRegistry(unitIds) {
  const entries = unitIds
    .map(
      (id) =>
        `  "${id}": () => import("./units/${id}").then((m) => m.${constNameFor(id)}),`
    )
    .join("\n");

  return `import type { UnitLearningMaterials } from "./types";

/**
 * Learning materials are loaded per unit, on demand.
 *
 * There are hundreds of units and eight content blocks each; bundling them the
 * way \`lessons.ts\` bundles vocabulary would make every learner download all of
 * it to open one. A dynamic import keeps a unit's materials out of the main
 * bundle until someone opens that unit's Learn screen.
 *
 * GENERATED by scripts/build-learning-materials.mjs — do not hand-edit.
 * Units absent from this map have no materials in the design file yet;
 * callers get \`null\` and hide the entry point rather than showing an empty
 * screen.
 */
const LOADERS: Record<string, () => Promise<UnitLearningMaterials>> = {
${entries}
};

const cache = new Map<string, UnitLearningMaterials>();

export function hasLearningMaterials(unitId: string): boolean {
  return unitId in LOADERS;
}

/** Unit ids with materials, for tests and for coverage reporting. */
export function unitsWithLearningMaterials(): string[] {
  return Object.keys(LOADERS);
}

export async function loadLearningMaterials(
  unitId: string
): Promise<UnitLearningMaterials | null> {
  const cached = cache.get(unitId);
  if (cached) return cached;

  const loader = LOADERS[unitId];
  if (!loader) return null;

  const materials = await loader();
  cache.set(unitId, materials);
  return materials;
}
`;
}

/* ------------------------------------------------------------------ main */

const appUnitIds = await readAppUnitIds();
const files = (await readdir(DUMP_DIR)).filter((f) => f.endsWith(".json"));
const generated = [];
const skipped = [];
const handAuthored = [];
const unmapped = [];

for (const file of files) {
  const unit = JSON.parse(await readFile(join(DUMP_DIR, file), "utf8"));

  // Emit only for units the app registers. A module for a unit that does not
  // exist cannot be reached, and the integrity test rightly fails on it: the
  // sub-topic check resolves word ids against the unit's vocabulary, and there
  // is none. Same gate the artwork sync uses.
  const appId = appUnitIds.get(canonicalKey(unit.unitId));
  if (!appId && !INCLUDE_NEW) {
    if (unit.materials) unmapped.push(unit.unitId);
    continue;
  }

  const unitId = appId ?? unit.unitId;
  if (ONLY.length && !ONLY.includes(unitId)) continue;

  if (!unit.materials) {
    skipped.push({ unitId, reason: "no Learning Materials frame" });
    continue;
  }

  const target = join(OUT_DIR, `${unitId}.ts`);
  if (!OVERWRITE && existsSync(target) && !readFileSync(target, "utf8").includes("GENERATED by")) {
    handAuthored.push(unitId);
    continue;
  }

  const blocks = unit.materials;

  const materials = {
    name: unit.name,
    // A handful of units repeat a card — 28 units carry 74 duplicates between
    // them. Keeping the first occurrence means the grid shows each word once;
    // `audit-figma-vs-app.mjs` reports the duplicates so they can be fixed at
    // source rather than silently absorbed here forever.
    subtopics: dedupeSubtopics(unit.subtopics ?? []),
    passage: parsePassage(blocks["reading-passage"], unitId),
    phrases: parsePhrases(blocks["idioms-phrases"], unitId),
    dialogue: parseDialogue(blocks["mini-dialogue"]),
    mistakes: parseMistakes(blocks["common-mistakes"], unitId),
    wordFormation: parseWordFormation(blocks["word-formation"]),
    blankExercises: parseBlanks(blocks["exercises"], unitId),
    culturalNotes: parseNotes(blocks["cultural-notes"], unitId),
    wordMeta: parseWordMeta(blocks["vocabulary-metadata"]),
  };

  const filled = Object.entries(materials).filter(
    ([k, v]) => k !== "name" && v && (!Array.isArray(v) || v.length)
  ).length;

  if (!filled) {
    skipped.push({ unitId, reason: "no block parsed" });
    continue;
  }

  generated.push({ unitId, filled });
  if (!CHECK) {
    await mkdir(OUT_DIR, { recursive: true });
    await writeFile(
      join(OUT_DIR, `${unitId}.ts`),
      renderModule(unitId, materials, constNameFor(unitId))
    );
  }
}

if (!CHECK) {
  const registered = [...generated.map((g) => g.unitId), ...handAuthored].sort();
  await writeFile(REGISTRY, renderRegistry(registered));
}

// Format what was written, so regenerating is idempotent.
//
// Without this the commit hook formats the files and the next run produces a
// diff on every one of them — 84 files of pure indentation noise that hides
// whether the content actually changed. A generated pipeline is only useful
// if "regenerate and see no diff" means "nothing drifted".
if (!CHECK && generated.length) {
  const targets = generated.map((g) => join(OUT_DIR, `${g.unitId}.ts`));
  try {
    await execFileAsync("npx", ["prettier", "--write", "--log-level", "warn", REGISTRY, ...targets], {
      cwd: ROOT,
      maxBuffer: 32 * 1024 * 1024,
    });
  } catch (err) {
    console.warn(`Could not format generated files: ${err.message}`);
  }
}

console.log(
  `${CHECK ? "Would generate" : "Generated"} ${generated.length} unit module(s); ` +
    `${handAuthored.length} hand-authored kept; ${skipped.length} skipped.`
);
if (handAuthored.length) console.log(`Kept by hand: ${handAuthored.join(", ")}`);
if (unmapped.length) {
  console.log(
    `\n${unmapped.length} unit(s) have materials in Figma but no unit in the app ` +
      `(skipped; pass --include-new to emit anyway):`
  );
  for (const id of unmapped) console.log(`  ${id}`);
}
const thin = generated.filter((g) => g.filled < 4);
if (thin.length) {
  console.log(`\n${thin.length} unit(s) parsed fewer than 4 of 8 blocks:`);
  for (const t of thin) console.log(`  ${t.unitId} (${t.filled})`);
}
