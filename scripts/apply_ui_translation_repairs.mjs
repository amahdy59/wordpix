import { readFile, writeFile } from "node:fs/promises";
const repairs = JSON.parse(await readFile("scripts/ui_translation_repairs.json", "utf8"));
const pending = [];
for (const [locale, index] of [["en", 0], ["ar", 1]]) {
  const path = `src/i18n/${locale}.json`;
  const data = JSON.parse(await readFile(path, "utf8"));
  for (const [key, values] of Object.entries(repairs)) {
    const parts = key.split(".");
    const property = parts.pop();
    let object = data;
    for (const part of parts) object = object[part] ??= {};
    if (typeof object[property] === "string") continue;
    object[property] = values[index];
  }
  pending.push({ path, data });
}
for (const { path, data } of pending) await writeFile(path, JSON.stringify(data, null, 2) + "\n");
console.log(`Filled ${Object.keys(repairs).length} missing interface keys in both locales.`);
