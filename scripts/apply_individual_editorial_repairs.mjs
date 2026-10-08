import fs from "node:fs/promises";

async function writeText(path, text) {
  for (let attempt = 0; ; attempt++) {
    try {
      await fs.writeFile(path, text);
      return;
    } catch (error) {
      if (attempt >= 4 || !["UNKNOWN", "EBUSY", "EPERM"].includes(error.code)) throw error;
      await new Promise((resolve) => setTimeout(resolve, 100 * 2 ** attempt));
    }
  }
}

const repairs = JSON.parse(await fs.readFile("scripts/individual_editorial_repairs.json", "utf8"));
const ledgerPath = "docs/lesson-content-audit/editorial-corrections.json";
const ledger = JSON.parse(await fs.readFile(ledgerPath, "utf8"));
const pending = [];
for (const [unit, rows] of Object.entries(repairs)) {
  if (!/^[a-z0-9-]+$/.test(unit)) throw new Error(`Invalid unit ${unit}`);
  const path = `src/app/data/bilingual/${unit}.json`;
  const data = JSON.parse(await fs.readFile(path, "utf8"));
  for (const [id, fields] of Object.entries(rows)) {
    if (!data[id]) throw new Error(`Unknown word ${unit}/${id}`);
    for (const [field, value] of Object.entries(fields)) {
      if (
        !["definition", "arabicTranslation"].includes(field) ||
        typeof value !== "string" ||
        !value.trim()
      )
        throw new Error(`Invalid text ${unit}/${id}/${field}`);
    }
  }
  pending.push({ unit, rows, path, data });
}
let count = 0;
for (const { unit, rows, path, data } of pending) {
  let changed = false;
  for (const [id, fields] of Object.entries(rows)) {
    for (const [field, after] of Object.entries(fields)) {
      if (data[id][field] === after) continue;
      const key = `${unit}/${id}/${field}`;
      ledger[key] = {
        unit,
        id,
        field,
        before: ledger[key]?.before ?? data[id][field] ?? "",
        after,
      };
      data[id][field] = after;
      count++;
      changed = true;
    }
  }
  if (changed) await writeText(path, JSON.stringify(data, null, 2) + "\n");
}
await writeText(ledgerPath, JSON.stringify(ledger, null, 2) + "\n");
console.log(`Applied ${count} individually reviewed text fields. Media references are unchanged.`);
