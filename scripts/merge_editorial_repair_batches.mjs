import { readFile, writeFile } from "node:fs/promises";

// Repair batches have one level of unit dictionaries. Merge repeated unit blocks
// before applying them so additions cannot silently hide earlier corrections.
for (const file of [
  "semantic_definition_repairs",
  "editorial_definition_repairs",
  "editorial_arabic_repairs",
]) {
  const path = `scripts/${file}.json`;
  const source = await readFile(path, "utf8");
  const merged = {};
  const counts = {};
  for (const match of source.matchAll(/"([^"\n]+)"\s*:\s*(\{[^{}]*\})/gu)) {
    const [unit, values] = [match[1], JSON.parse(match[2])];
    counts[unit] = (counts[unit] ?? 0) + 1;
    merged[unit] = { ...merged[unit], ...values };
  }
  if (Object.keys(merged).length !== Object.keys(JSON.parse(source)).length)
    throw new Error(`Unexpected batch structure: ${path}`);
  const duplicates = Object.entries(counts).filter(([, count]) => count > 1);
  if (duplicates.length) await writeFile(path, JSON.stringify(merged, null, 2) + "\n");
  console.log(file, duplicates);
}
