import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { loadLearningMaterials } from "../src/app/learning/registry";

interface Lesson {
  lessonId: string;
  unitId: string;
  unitName: string;
  cefrStage: string;
}
const lessons: Lesson[] = [];
for (const name of (await readdir("src/app/data/usage")).filter((n) => n.endsWith(".usage.json"))) {
  lessons.push(
    ...JSON.parse((await readFile(`src/app/data/usage/${name}`, "utf8")).replace(/^\uFEFF/u, ""))
  );
}
const rows: string[][] = [];
for (const unit of [...new Set(lessons.map((l) => l.unitId))].sort()) {
  const material = await loadLearningMaterials(unit);
  const unitLessons = lessons.filter((l) => l.unitId === unit);
  const seen = new Set<string>();
  function add(
    phrase: string,
    kind: string,
    meaning: string,
    example: string,
    pattern: string,
    source: string,
    classification: string
  ) {
    const identity = JSON.stringify([
      unit,
      phrase.toLowerCase().trim(),
      meaning.trim(),
      example.trim(),
    ]);
    if (seen.has(identity)) return;
    seen.add(identity);
    rows.push([
      `${unit}-${createHash("sha256").update(identity).digest("hex").slice(0, 12)}`,
      unit,
      unitLessons[0].unitName,
      phrase,
      kind,
      meaning,
      example,
      pattern,
      classification,
      `src/app/learning/units/${unit}.ts#${source}`,
      unitLessons.map((l) => l.lessonId).join(" | "),
      [...new Set(unitLessons.map((l) => l.cefrStage))].join(" | "),
      "Unverified",
      "Pending",
      "Pending",
      "Candidate only",
      "",
      "",
      "",
    ]);
  }
  for (const phrase of material?.phrases ?? []) {
    add(
      phrase.phrase,
      phrase.kind,
      phrase.meaning,
      phrase.example,
      "",
      `phrases/${phrase.id}`,
      phrase.kindInferred ? "Inferred in source; verify type" : "Authored source label; verify type"
    );
  }
  for (const collocation of material?.collocations ?? []) {
    add(
      collocation.phrase,
      "collocation",
      "",
      collocation.example,
      collocation.variations,
      "collocations",
      "Authored source label; verify type"
    );
  }
}
const unitsCovered = new Set(rows.map((r) => r[1]));
const missingUnits = [...new Set(lessons.map((l) => l.unitId))].filter(
  (id) => !unitsCovered.has(id)
);
const result = {
  headers: [
    "Candidate ID",
    "Unit ID",
    "Unit",
    "Phrase",
    "Source type",
    "Source meaning",
    "Source example",
    "Source variations",
    "Classification status",
    "Internal source",
    "Possible lessons (not assigned)",
    "Unit levels (not phrase levels)",
    "Phrase level",
    "Frequency evidence",
    "Source rights review",
    "Selection status",
    "Assigned phrase ID",
    "Reviewer notes",
    "Reference URL",
  ],
  rows,
  missingUnits,
};
await mkdir("output/usage-authoring", { recursive: true });
await writeFile("output/usage-authoring/phrase-candidates.json", JSON.stringify(result, null, 2));
console.log(JSON.stringify({ candidates: rows.length, units: unitsCovered.size, missingUnits }));
