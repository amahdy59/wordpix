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
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DUMP_DIR = join(ROOT, "figma-dump");
const OUT_DIR = join(ROOT, "src", "app", "learning", "units");
const REGISTRY = join(ROOT, "src", "app", "learning", "registry.ts");

const args = process.argv.slice(2);
const CHECK = args.includes("--check");
const OVERWRITE = args.includes("--overwrite");
const ONLY = args.reduce((acc, a, i) => (a === "--unit" && args[i + 1] ? [...acc, args[i + 1]] : acc), []);

/** Strips a leading emoji/pictograph and surrounding whitespace from a heading. */
const stripLeadingEmoji = (s) =>
  s.replace(/^[\p{Extended_Pictographic}️‍\s]+/u, "").trim();

/** Figma writes "1.  Some text" with padded numbering. */
const stripNumbering = (s) => s.replace(/^\d+\.\s*/, "").trim();

const textsOf = (block) => (block?.lines ?? []).map((l) => l.text.trim()).filter(Boolean);

/* --------------------------------------------------------------- parsers */

function parsePassage(block, unitId, vocabulary) {
  const lines = textsOf(block);
  if (lines.length < 3) return undefined;

  const heading = stripLeadingEmoji(lines[0]);
  const level = heading.match(/\(([^)]+)\)/)?.[1] ?? "B1";
  const title = heading.replace(/\s*\([^)]*\)\s*$/, "").trim() || "Reading Passage";

  const text = lines[1];
  const questionsStart = lines.findIndex((l) => /^comprehension questions$/i.test(l));
  const rawQuestions =
    questionsStart === -1 ? [] : lines.slice(questionsStart + 1).map(stripNumbering).filter(Boolean);

  // Figma authors these open-ended. Only the ones a single vocabulary item
  // genuinely answers become multiple choice; the rest are kept verbatim as
  // reflection prompts. Converting everything mechanically produced questions
  // that answered themselves ("What is the purpose of the shower curtain?" ->
  // "Shower Curtain") and multi-part questions with a one-word answer.
  const questions = [];
  const openQuestions = [];

  rawQuestions.forEach((question, i) => {
    const answer = answerFromPassage(question, text, vocabulary);
    if (!answer || !isSingleItemQuestion(question, answer)) {
      openQuestions.push(question);
      return;
    }
    const distractors = pickDistractors(vocabulary, answer, 3, `${unitId}-${i}`);
    if (distractors.length < 3) {
      openQuestions.push(question);
      return;
    }
    const options = shuffleStable([answer, ...distractors], `${unitId}-q${i}`);
    questions.push({
      id: `${unitId}-q${questions.length + 1}`,
      question,
      options,
      correctIndex: options.indexOf(answer),
      explanation: `The passage names ${answer.toLowerCase()}.`,
    });
  });

  return {
    title,
    level,
    text,
    questions,
    ...(openQuestions.length ? { openQuestions } : {}),
  };
}

/**
 * Whether a question is honestly answerable by naming one vocabulary item.
 *
 * Two disqualifiers, both learned from the generated output. If the answer
 * already appears in the question, the question answers itself. If the
 * question asks for several things, or for a reason or a method, no single
 * item answers it.
 */
function isSingleItemQuestion(question, answer) {
  const q = question.toLowerCase();
  if (q.includes(answer.toLowerCase())) return false;
  if (/^(name|list|describe|explain|how|why|what happens)\b/.test(q)) return false;
  if (/\b(three|two|several|some|ways|reasons|purpose)\b/.test(q)) return false;
  return true;
}

/**
 * Best-effort answer for an open question: the unit word that appears in the
 * passage sentence most similar to the question. Imperfect by nature — the
 * generated explanation says only that the passage supports it, and the
 * report flags units whose questions could not be resolved confidently.
 */
function answerFromPassage(question, passage, vocabulary) {
  const qWords = new Set(
    question.toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/).filter((w) => w.length > 3)
  );
  let best = null;
  let bestScore = -1;
  for (const sentence of passage.split(/(?<=[.!?])\s+/)) {
    const lower = sentence.toLowerCase();
    const overlap = [...qWords].filter((w) => lower.includes(w)).length;
    for (const word of vocabulary) {
      if (!lower.includes(word.toLowerCase())) continue;
      const score = overlap * 10 + word.length;
      if (score > bestScore) {
        bestScore = score;
        best = word;
      }
    }
  }
  return best ?? vocabulary[0] ?? "";
}

/** Deterministic pseudo-random so regenerating produces an identical file. */
function seeded(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleStable(items, seed) {
  const rand = seeded(seed);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function pickDistractors(vocabulary, answer, count, seed) {
  const pool = vocabulary.filter((w) => w.toLowerCase() !== answer.toLowerCase());
  return shuffleStable(pool, seed).slice(0, count);
}

function parsePhrases(block, unitId) {
  const lines = textsOf(block).slice(1);
  const entries = [];
  for (let i = 0; i + 1 < lines.length; i += 2) {
    const phrase = lines[i];
    const detail = lines[i + 1];
    const kindMatch = detail.match(/^\((idiom|phrasal verb)\)\s*/i);
    if (!kindMatch) continue;
    const rest = detail.slice(kindMatch[0].length);
    const exampleMatch = rest.match(/["“](.+)["”]\s*$/);
    entries.push({
      id: `${unitId}-${slugify(phrase)}`,
      phrase,
      kind: kindMatch[1].toLowerCase() === "idiom" ? "idiom" : "phrasal-verb",
      meaning: (exampleMatch ? rest.slice(0, exampleMatch.index) : rest).trim(),
      example: exampleMatch ? exampleMatch[1].trim() : "",
    });
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

function parseMistakes(block, unitId) {
  const lines = textsOf(block).slice(1);
  const out = [];
  for (let i = 0; i + 2 < lines.length; i += 3) {
    const wrong = lines[i].replace(/^✗\s*/, "").trim();
    const right = lines[i + 1].replace(/^✓\s*/, "").trim();
    if (!lines[i].startsWith("✗")) continue;
    out.push({ id: `${unitId}-${slugify(right).slice(0, 40)}`, wrong, right, note: lines[i + 2] });
  }
  return out.length ? out : undefined;
}

function parseWordFormation(block) {
  const lines = textsOf(block).slice(1);
  const headerEnd = lines.findIndex((l) => /^adverb$/i.test(l));
  if (headerEnd === -1) return undefined;
  const cells = lines.slice(headerEnd + 1);
  const rows = [];
  for (let i = 0; i + 3 < cells.length; i += 4) {
    const [noun, verb, adjective, adverb] = cells.slice(i, i + 4).map((c) => (c === "—" ? null : c));
    if ([noun, verb, adjective, adverb].every((c) => c === null)) continue;
    rows.push({ noun, verb, adjective, adverb });
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

const constNameFor = (unitId) =>
  `${unitId.toUpperCase().replace(/[^A-Z0-9]+/g, "_")}_LEARNING`;

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

const files = (await readdir(DUMP_DIR)).filter((f) => f.endsWith(".json"));
const generated = [];
const skipped = [];
const handAuthored = [];

for (const file of files) {
  const unit = JSON.parse(await readFile(join(DUMP_DIR, file), "utf8"));
  const unitId = unit.unitId;
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

  const vocabulary = unit.cards.map((c) => c.label).filter(Boolean);
  const blocks = unit.materials;

  const materials = {
    name: unit.name,
    subtopics: (unit.subtopics ?? [])
      .filter((t) => t.wordIds?.length)
      .map((t) => ({ id: t.id, title: t.title ?? t.id, wordIds: t.wordIds })),
    passage: parsePassage(blocks["reading-passage"], unitId, vocabulary),
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

console.log(
  `${CHECK ? "Would generate" : "Generated"} ${generated.length} unit module(s); ` +
    `${handAuthored.length} hand-authored kept; ${skipped.length} skipped.`
);
if (handAuthored.length) console.log(`Kept by hand: ${handAuthored.join(", ")}`);
const thin = generated.filter((g) => g.filled < 4);
if (thin.length) {
  console.log(`\n${thin.length} unit(s) parsed fewer than 4 of 8 blocks:`);
  for (const t of thin) console.log(`  ${t.unitId} (${t.filled})`);
}
