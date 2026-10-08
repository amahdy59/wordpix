#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const catalogs = [
  {
    directory: "src/app/learning/conversation",
    stem: "conversationCatalog",
  },
  {
    directory: "src/app/learning/business",
    stem: "businessCatalog",
  },
];

for (const { directory, stem } of catalogs) {
  const sourcePath = path.resolve(directory, `${stem}.json`);
  const units = JSON.parse(await readFile(sourcePath, "utf8"));
  if (!Array.isArray(units) || units.length !== 40) {
    throw new Error(`${sourcePath} must contain exactly 40 units before it can be sharded.`);
  }

  const shards = [
    ["units-01-20", units.slice(0, 20)],
    ["units-21-40", units.slice(20)],
  ];
  for (const [suffix, shard] of shards) {
    const targetPath = path.resolve(directory, `${stem}.${suffix}.json`);
    try {
      const existingShard = JSON.parse(await readFile(targetPath, "utf8"));
      if (JSON.stringify(existingShard) === JSON.stringify(shard)) continue;
    } catch {
      // A missing or invalid generated shard must be replaced from the canonical catalog.
    }
    await writeFile(targetPath, `${JSON.stringify(shard, null, 2)}\n`, "utf8");
  }
}

console.log("Prepared four specialist curriculum data shards.");

// Home needs stable IDs and titles for resume links, not complete lesson bodies.
const summaries = {};
for (const [kind, sourcePath] of [
  ["hadith", "src/app/learning/hadith/figmaHadithContent.json"],
  ["pronunciation", "src/app/learning/foundations/figmaPronunciationContent.json"],
  ["conversation", "src/app/learning/conversation/conversationCatalog.json"],
  ["business", "src/app/learning/business/businessCatalog.json"],
]) {
  const data = JSON.parse(await readFile(sourcePath, "utf8"));
  const lessons = Array.isArray(data) ? data : data.lessons;
  summaries[kind] = lessons.map((lesson) => {
    const number = lesson.number ?? lesson.unitNumber;
    const title = lesson.title ?? lesson.text.find((line) => line.startsWith(`Lesson ${number} —`))?.replace(`Lesson ${number} —`, "").trim();
    if (!title) throw new Error(`Missing specialist lesson title: ${kind}/${number}`);
    return { id: lesson.id ?? `lesson-${String(number).padStart(2, "0")}`, number, title };
  });
}
const summaryPath = "src/app/generated/specialistLessonSummaries.json";
const summaryText = `${JSON.stringify(summaries, null, 2)}\n`;
if (await readFile(summaryPath, "utf8").catch(() => "") !== summaryText) await writeFile(summaryPath, summaryText);
console.log("Prepared lightweight specialist lesson summaries.");
