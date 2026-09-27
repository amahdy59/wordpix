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
