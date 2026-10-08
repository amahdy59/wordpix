import { readFile, writeFile, mkdir } from "node:fs/promises";

const directory = "docs/lesson-content-audit";
await mkdir(directory, { recursive: true });
const ledgerPath = `${directory}/editorial-corrections.json`;
let ledger = {};
try {
  ledger = JSON.parse(await readFile(ledgerPath, "utf8"));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
// Validate the entire batch before writing any lesson or the correction ledger.
for (const file of [
  "editorial_arabic_repairs.json",
  "editorial_definition_repairs.json",
  "beginner_definition_repairs.json",
  "semantic_definition_repairs.json",
  "context_sense_repairs.json",
]) {
  const repairs = JSON.parse(await readFile(`scripts/${file}`, "utf8"));
  for (const [unit, rows] of Object.entries(repairs)) {
    if (!/^[a-z0-9-]+$/.test(unit)) throw new Error(`Invalid unit: ${unit}`);
    const data = JSON.parse(await readFile(`src/app/data/bilingual/${unit}.json`, "utf8"));
    for (const [id, value] of Object.entries(rows)) {
      if (!data[id] || typeof value !== "string" || !value.trim())
        throw new Error(`Invalid repair: ${unit}/${id}`);
    }
  }
}
for (const [file, field] of [
  ["editorial_arabic_repairs.json", "arabicTranslation"],
  ["editorial_definition_repairs.json", "definition"],
  ["beginner_definition_repairs.json", "definition"],
  ["semantic_definition_repairs.json", "definition"],
  ["context_sense_repairs.json", "definition"],
]) {
  const repairs = JSON.parse(await readFile(`scripts/${file}`, "utf8"));
  for (const [unit, rows] of Object.entries(repairs)) {
    if (!/^[a-z0-9-]+$/.test(unit)) throw new Error(`Invalid unit: ${unit}`);
    const path = `src/app/data/bilingual/${unit}.json`;
    const data = JSON.parse(await readFile(path, "utf8"));
    let changed = false;
    for (const [id, value] of Object.entries(rows)) {
      if (!data[id] || typeof value !== "string" || !value.trim())
        throw new Error(`Invalid repair: ${unit}/${id}`);
      if (data[id][field] === value) continue;
      const key = `${unit}/${id}/${field}`;
      ledger[key] = {
        unit,
        id,
        field,
        before: ledger[key]?.before ?? data[id][field] ?? "",
        after: value,
      };
      data[id][field] = value;
      changed = true;
    }
    if (changed) await writeFile(path, JSON.stringify(data, null, 2) + "\n");
  }
}
await writeFile(ledgerPath, JSON.stringify(ledger, null, 2) + "\n");
console.log(
  `Tracked ${Object.keys(ledger).length} editorial corrections. Media registries were not written.`
);
