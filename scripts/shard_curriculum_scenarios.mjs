#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { CURRICULUM_SEQUENCE } from "../src/app/data/curriculumSequence.ts";

const scenariosDir = "src/app/data/scenarios";
const sourcePath = path.resolve(scenariosDir, "curriculumScenarios.json");
const raw = JSON.parse(await readFile(sourcePath, "utf8"));

if (!Array.isArray(raw) || raw.length === 0) {
  throw new Error(`${sourcePath} must be a non-empty array of scenarios.`);
}

const check = process.argv.includes("--check");

const shardDefs = [
  { suffix: "units-001-050", units: new Set(CURRICULUM_SEQUENCE.slice(0, 50)) },
  { suffix: "units-051-100", units: new Set(CURRICULUM_SEQUENCE.slice(50, 100)) },
  { suffix: "units-101-150", units: new Set(CURRICULUM_SEQUENCE.slice(100, 150)) },
  { suffix: "units-151-200", units: new Set(CURRICULUM_SEQUENCE.slice(150, 200)) },
];

let totalSharded = 0;

for (const { suffix, units } of shardDefs) {
  const items = raw.filter((s) => units.has(s.unitId));
  totalSharded += items.length;

  const targetPath = path.resolve(scenariosDir, `curriculumScenarios.${suffix}.json`);
  const content = `${JSON.stringify(items, null, 2)}\n`;

  try {
    const existing = JSON.parse(await readFile(targetPath, "utf8"));
    if (JSON.stringify(existing) === JSON.stringify(items)) continue;
  } catch {
    // Missing or invalid
  }

  if (check) {
    throw new Error(`Stale or missing scenario shard: ${targetPath}`);
  }

  await writeFile(targetPath, content, "utf8");
}

if (totalSharded !== raw.length) {
  throw new Error(
    `Sharding mismatch: partitioned ${totalSharded} scenarios out of ${raw.length} total.`
  );
}

console.log(`Sharded ${raw.length} curriculum scenarios into 4 bounded data shards.`);
