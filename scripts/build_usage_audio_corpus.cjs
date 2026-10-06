/** Exact learner-facing phrase and reading texts; no image briefs or prompts. */
const fs = require("node:fs");
const path = require("node:path");
const { AUDIO_PROFILE, audioHash } = require("./lib/assetKey.cjs");
const root = path.join(__dirname, "..");
const clips = new Map();
function add(text, tier, lessonId) {
  if (typeof text !== "string" || !text.trim()) return;
  const hash = audioHash(text, AUDIO_PROFILE);
  const clip = clips.get(hash);
  if (clip) { if (!clip.lessonIds.includes(lessonId)) clip.lessonIds.push(lessonId); return; }
  clips.set(hash, { hash, text, tier, chars: text.length, lessonIds: [lessonId] });
}
for (const file of fs.readdirSync(path.join(root, "src/app/data/usagePhrases"))) {
  if (!file.endsWith(".phrases.json")) continue;
  for (const phrase of JSON.parse(fs.readFileSync(path.join(root, "src/app/data/usagePhrases", file), "utf8"))) {
    if (phrase.editorial?.status !== "approved") continue;
    add(phrase.phrase, "phrases", phrase.lessonId);
    add(phrase.example, "phrase-examples", phrase.lessonId);
  }
}
for (const file of fs.readdirSync(path.join(root, "src/app/data/usage"))) {
  if (!file.endsWith(".usage.json")) continue;
  for (const lesson of JSON.parse(fs.readFileSync(path.join(root, "src/app/data/usage", file), "utf8"))) {
    add(lesson.reading.text, "paragraphs", lesson.lessonId);
  }
}
const output = path.join(root, "scratch/usage_audio_corpus.json");
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify([...clips.values()], null, 2) + "\n");
for (const tier of ["phrases", "phrase-examples", "paragraphs"]) {
  const rows = [...clips.values()].filter((clip) => clip.tier === tier);
  console.log(`${tier}: ${rows.length} unique clips / ${rows.reduce((sum, clip) => sum + clip.chars, 0)} characters`);
}
console.log("Wrote scratch/usage_audio_corpus.json; no generation or uploads.");
