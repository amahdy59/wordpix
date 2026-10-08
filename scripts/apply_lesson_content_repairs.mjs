import { readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";

// Text-only editorial corrections. No asset registry or media URL is written.
const repairs = JSON.parse(await readFile("scripts/lesson_content_repairs.json", "utf8"));
const ledgerPath = "docs/lesson-content-audit/editorial-corrections.json";
const ledger = JSON.parse(await readFile(ledgerPath, "utf8"));
const pending = [];
for (const [unit, rows] of Object.entries(repairs)) {
  const path = `src/app/data/bilingual/${unit}.json`;
  const data = JSON.parse(await readFile(path, "utf8"));
  const original = JSON.parse(execFileSync("git", ["show", `HEAD:${path}`], { encoding: "utf8" }));
  for (const [id, [definition, exampleUsage, arabicTranslation]] of Object.entries(rows)) {
    if (!data[id]) throw new Error(`Unknown content ID: ${unit}/${id}`);
    const values = {
      definition,
      exampleUsage,
      ...(arabicTranslation ? { arabicTranslation } : {}),
    };
    for (const [field, after] of Object.entries(values)) {
      if (!after?.trim()) throw new Error(`Empty correction: ${unit}/${id}/${field}`);
      const key = `${unit}/${id}/${field}`;
      ledger[key] = {
        unit,
        id,
        field,
        before: ledger[key]?.before ?? original[id]?.[field] ?? "",
        after,
      };
      data[id][field] = after;
    }
  }
  pending.push({ path, data });
}
for (const { path, data } of pending) await writeFile(path, JSON.stringify(data, null, 2) + "\n");
await writeFile(ledgerPath, JSON.stringify(ledger, null, 2) + "\n");
