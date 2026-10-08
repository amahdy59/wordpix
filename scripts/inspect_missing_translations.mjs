import { readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
const en = JSON.parse(await readFile("src/i18n/en.json", "utf8"));
const ar = JSON.parse(await readFile("src/i18n/ar.json", "utf8"));
const files = execFileSync("rg", ["--files", "src/app"], { encoding: "utf8" }).trim().split(/\r?\n/u).filter(file => file.endsWith(".tsx") && !file.includes("__tests__"));
const lookup = (data, key) => key.split(".").reduce((value, part) => value?.[part], data);
const missing = new Map();
for (const file of files) {
  const source = await readFile(file, "utf8");
  for (const match of source.matchAll(/\bt\(\s*["']([^"']+)["']/gu)) {
    const key = match[1];
    if (lookup(en, key) !== undefined && lookup(ar, key) !== undefined) continue;
    if (missing.has(key)) continue;
    missing.set(key, { key, file, en: lookup(en, key), ar: lookup(ar, key), call: source.slice(match.index, match.index + 200) });
  }
}
console.log(JSON.stringify([...missing.values()], null, 2));
