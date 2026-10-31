/** Prepare an atomic wording migration and exact audio delta; never write R2. */
import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";

if (process.argv.slice(2).some((arg) => arg !== "--plan")) throw Error("Only --plan is supported");
const directory = "output/content-repair-2026-10-30/humidity-migration";
const source = "src/app/data/usage/jungle.usage.json";
const before = await fs.readFile(source, "utf8");
const oldText = "Echoes fade, and humidity swelters.";
const newText = "The echoes fade. High humidity makes the air feel damp.";
const original = JSON.parse(before);
const lessons = structuredClone(original);
let replacements = 0;
function replace(value) {
  if (typeof value === "string") {
    replacements += value.split(oldText).length - 1;
    return value.replaceAll(oldText, newText);
  }
  if (Array.isArray(value)) return value.map(replace);
  if (value && typeof value === "object")
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, replace(item)]));
  return value;
}
const index = lessons.findIndex((lesson) => lesson.lessonId === "jungle-5");
if (index < 0) throw Error("Missing anchored lesson");
lessons[index] = replace(lessons[index]);
if (replacements !== 5) throw Error(`Expected five anchored occurrences, found ${replacements}`);
const draft = JSON.stringify(lessons, null, 2) + "\n";
await fs.mkdir(directory, { recursive: true });
await fs.writeFile(path.join(directory, "jungle.usage.proposed.json"), draft);
const migration = {
  schemaVersion: 1,
  status: "prepared-not-applied",
  source,
  lessonId: "jungle-5",
  originalSha256: createHash("sha256").update(before).digest("hex"),
  oldText,
  newText,
  replacements,
  r2Writes: 0,
  runtimeTextChanges: 0,
};
if (process.argv.includes("--plan")) {
  const planPath = "output/recorded-audio/plan.json";
  const missingPath = "output/recorded-audio/missing.json";
  const saved = await Promise.all([planPath, missingPath].map((file) => fs.readFile(file)));
  try {
    await fs.writeFile(source, draft);
    const result = spawnSync(
      process.execPath,
      ["scripts/build_recording_plan.mjs", "--r2-list=output/recorded-audio/r2-snapshot.json"],
      { stdio: "inherit" }
    );
    if (result.status !== 0) throw Error("Prospective recording planner failed");
    const prospective = JSON.parse(await fs.readFile(planPath, "utf8"));
    const missing = prospective.rows.filter((row) => !row.existingKey);
    const baseline = JSON.parse(saved[0]);
    const oldTranscripts = new Set(baseline.rows.map((row) => row.language + "\0" + row.text));
    const added = prospective.rows.filter(
      (row) => !oldTranscripts.has(row.language + "\0" + row.text)
    );
    if (missing.some((row) => row.sources.some((item) => !item.includes("jungle"))))
      throw Error("Unexpected audio delta outside jungle");
    await fs.writeFile(
      path.join(directory, "audio-delta.json"),
      JSON.stringify({ added, missing, candidates: prospective.rows.length }, null, 2) + "\n"
    );
    migration.newTranscripts = added.length;
    migration.missingRecordings = missing.length;
    migration.requiredKeys = missing.map((row) => row.edgeKey);
  } finally {
    await fs.writeFile(source, before);
    for (let i = 0; i < saved.length; i++) await fs.writeFile([planPath, missingPath][i], saved[i]);
  }
}
await fs.writeFile(
  path.join(directory, "migration.json"),
  JSON.stringify(migration, null, 2) + "\n"
);
console.log(JSON.stringify(migration, null, 2));
