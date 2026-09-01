/**
 * Builds the list of text that needs speech synthesis.
 *
 * ElevenLabs bills per character, so the only number that matters is DISTINCT
 * characters: "library" is a vocabulary word in several units but one clip.
 * De-duplicating before generation removes roughly a third of the vocabulary
 * spend on its own.
 *
 * Output is tiered so generation can be bought in tranches rather than as one
 * large bill, and so low-value text can be excluded deliberately rather than
 * by accident:
 *
 *   words     — distinct vocabulary labels. The core teaching audio, played
 *               constantly. Generate first.
 *   materials — passage, comprehension questions, phrases, dialogue,
 *               corrections and cloze from the Figma learning materials.
 *   lexicon   — dictionary example sentences and collocations. The bulk of the
 *               spend, and of unverified quality; sample it before buying.
 *   stories   — the three-part story passages.
 *
 * Deliberately excluded: the `story` blurb on each group. That is generated
 * filler ("In this section, you will learn about Bathtub, Shower…"), and
 * narrating a word list aloud is not worth paying for.
 *
 * Usage:
 *   node scripts/build_audio_corpus.cjs
 *   node scripts/build_audio_corpus.cjs --tiers=words,materials
 */
const fs = require("fs");
const path = require("path");
const { audioHash } = require("./lib/assetKey.cjs");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "scratch", "audio_corpus.json");

const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const captures = (source, pattern) => [...source.matchAll(pattern)].map((m) => m[1]);

/**
 * A bare speaker label, e.g. "Technician:".
 *
 * 91 of the 196 learning-material units have their dialogue fields swapped and
 * off by one: the spoken line sits in `speaker` and the speaker label in
 * `text`. Until the extractor is fixed, 923 such labels would be synthesised
 * and billed as if they were speech. Excluding them here is a guard against
 * paying for the defect, not a fix for it — see scratch/audit_dialogue.cjs.
 */
const SPEAKER_LABEL = /^[A-Z][A-Za-z .'-]{0,18}:$/;

/** A stage direction, which is printed rather than spoken. */
const SCENE_DIRECTION = /^Scene:\s/i;

/** Matches a double-quoted TS string literal, honouring backslash escapes. */
const quoted = (field) => new RegExp("\\n\\s*" + field + ': "((?:[^"\\\\]|\\\\.)*)"', "g");

const requestedUnits = (() => {
  const arg = process.argv.find((a) => a.startsWith("--unit=") || a.startsWith("--units="));
  if (!arg) return null;
  const val = arg.includes("=") ? arg.slice(arg.indexOf("=") + 1) : "";
  return new Set(val.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean));
})();

function collect() {
  const tiers = { words: [], materials: [], lexicon: [], stories: [] };

  // Vocabulary is one file per unit (src/app/data/units/<id>.ts)
  const unitsDir = path.join(ROOT, "src/app/data/units");
  for (const file of fs.readdirSync(unitsDir)) {
    if (!file.endsWith(".ts")) continue;
    const unitId = file.replace(".ts", "").toLowerCase();
    if (requestedUnits && !requestedUnits.has(unitId)) continue;

    tiers.words.push(
      ...captures(fs.readFileSync(path.join(unitsDir, file), "utf8"), quoted("label"))
    );
  }

  // Learning materials likewise (src/app/learning/units/<id>.ts)
  const learningDir = path.join(ROOT, "src/app/learning/units");
  for (const file of fs.readdirSync(learningDir)) {
    if (!file.endsWith(".ts") || file === "index.ts") continue;
    const unitId = file.replace(".ts", "").toLowerCase();
    if (requestedUnits && !requestedUnits.has(unitId)) continue;

    const raw = fs.readFileSync(path.join(learningDir, file), "utf8");

    tiers.materials.push(...captures(raw, quoted("text")));
    tiers.materials.push(...captures(raw, quoted("question")));
    tiers.materials.push(...captures(raw, quoted("phrase")));
    tiers.materials.push(...captures(raw, quoted("example")));
    // The corrected form is worth hearing; the wrong one deliberately is not.
    tiers.materials.push(...captures(raw, quoted("right")));
    // BLANK is a placeholder token, not something to read aloud.
    tiers.materials.push(
      ...captures(raw, quoted("sentence")).map((s) => s.replace(/BLANK/g, "blank"))
    );
  }

  if (!requestedUnits) {
    const lexicon = read("src/app/data/lexiconDictionary.ts");
    tiers.lexicon.push(...captures(lexicon, quoted("en")));
    for (const block of lexicon.matchAll(/collocations: \[([^\]]*)\]/g)) {
      tiers.lexicon.push(...captures(block[1], /"([^"]+)"/g));
    }

    const stories = read("src/app/data/storyTalesDictionary.ts");
    tiers.stories.push(...captures(stories, quoted("text")));
  }

  return tiers;
}

// ---------------------------------------------------------------------------

const requested = (() => {
  const arg = process.argv.find((a) => a.startsWith("--tiers="));
  return arg ? arg.slice("--tiers=".length).split(",").map((s) => s.trim()) : null;
})();

const tiers = collect();
const seen = new Map();
const summary = [];

for (const [tier, texts] of Object.entries(tiers)) {
  let added = 0;
  let chars = 0;
  for (const rawText of texts) {
    const text = String(rawText).replace(/\\"/g, '"').replace(/\\n/g, " ").trim();
    // Single characters and empty strings are not worth a network round trip.
    if (text.length < 2) continue;
    if (SPEAKER_LABEL.test(text) || SCENE_DIRECTION.test(text)) continue;
    const hash = audioHash(text);
    if (seen.has(hash)) continue;
    // Earlier tiers win, so a word that also appears in a sentence list stays
    // classified as a word.
    seen.set(hash, { hash, text, tier, chars: text.length });
    added += 1;
    chars += text.length;
  }
  summary.push({ tier, raw: texts.length, unique: added, chars });
}

const all = [...seen.values()];
const selected = requested ? all.filter((e) => requested.includes(e.tier)) : all;

const pad = (s, n) => String(s).padStart(n);
console.log("tier".padEnd(12) + pad("raw", 8) + pad("unique", 9) + pad("chars", 12));
console.log("-".repeat(41));
for (const row of summary) {
  console.log(
    row.tier.padEnd(12) + pad(row.raw, 8) + pad(row.unique, 9) + pad(row.chars.toLocaleString(), 12)
  );
}
console.log("-".repeat(41));
console.log(
  "selected".padEnd(12) +
    pad("", 8) +
    pad(selected.length, 9) +
    pad(selected.reduce((a, e) => a + e.chars, 0).toLocaleString(), 12)
);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(selected, null, 1), "utf8");
console.log("\nWrote " + path.relative(ROOT, OUT));
