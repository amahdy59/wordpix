#!/usr/bin/env node

import { readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const unitsDirectory = join(root, "src", "app", "data", "units");
const files = (await readdir(unitsDirectory)).filter((file) => file.endsWith(".ts")).sort();

const rows = [];
for (const file of files) {
  const source = await readFile(join(unitsDirectory, file), "utf8");
  const total = (source.match(/^\s+id: "/gm) ?? []).length;
  const placeholders = (source.match(/description: PLACEHOLDER_DESCRIPTION/g) ?? []).length;
  rows.push({ unit: file.replace(/\.ts$/, ""), total, placeholders });
}

const debt = rows.filter((row) => row.placeholders > 0).sort((a, b) => b.placeholders - a.placeholders);
const totals = rows.reduce(
  (result, row) => ({
    words: result.words + row.total,
    placeholders: result.placeholders + row.placeholders,
  }),
  { words: 0, placeholders: 0 }
);

console.log(
  `Vocabulary definitions: ${totals.words - totals.placeholders}/${totals.words} editorial, ${totals.placeholders} placeholders across ${debt.length} units.`
);
console.table(debt.slice(0, 25));
if (debt.length > 25) console.log(`Showing the 25 largest of ${debt.length} incomplete units.`);
