#!/usr/bin/env node

import { readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const unitsDirectory = join(root, "src", "app", "data", "units");
const requestedUnits = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
const json = process.argv.includes("--json");

function normalize(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function slug(value) {
  return normalize(value).replace(/ /g, "-");
}

function sourceLinks(label) {
  const term = slug(label);
  return {
    cambridge: `https://dictionary.cambridge.org/dictionary/english/${term}`,
    oxford: `https://www.oxfordlearnersdictionaries.com/definition/english/${term}`,
  };
}

function parseItems(source, unit) {
  return [...source.matchAll(/\{\n\s+id: "([^"]+)",[\s\S]*?label: "([^"]+)",[\s\S]*?cefr: "([^"]+)",[\s\S]*?description: (PLACEHOLDER_DESCRIPTION|"([^"]*)"),[\s\S]*?topic: "([^"]+)"/g)].map(
    (match) => ({
      unit,
      id: match[1],
      label: match[2],
      cefr: match[3],
      placeholder: match[4] === "PLACEHOLDER_DESCRIPTION",
      description: match[5] ?? "",
      topic: match[6],
      sources: sourceLinks(match[2]),
    })
  );
}

const files = (await readdir(unitsDirectory)).filter((file) => file.endsWith(".ts")).sort();
const selectedFiles = requestedUnits.length
  ? files.filter((file) => requestedUnits.includes(file.replace(/\.ts$/, "")))
  : files;
const items = [];
for (const file of selectedFiles) {
  items.push(...parseItems(await readFile(join(unitsDirectory, file), "utf8"), file.replace(/\.ts$/, "")));
}

const seen = new Map();
const findings = [];
for (const item of items) {
  const flags = [];
  if (item.placeholder) flags.push("placeholder");
  if (!item.description) flags.push("missing");
  if (item.description && !/\.$/.test(item.description)) flags.push("no-final-period");
  if (item.description && item.description[0] !== item.description[0].toUpperCase()) flags.push("not-capitalized");
  if (item.description && /known as|needs manual|undefined/i.test(item.description)) flags.push("generated-copy");
  const words = item.description.trim().split(/\s+/).filter(Boolean).length;
  const min = item.cefr === "A1" || item.cefr === "A2" ? 8 : 10;
  const max = item.cefr === "A1" || item.cefr === "A2" ? 18 : 24;
  if (!item.placeholder && (words < min || words > max)) flags.push(`word-count-${words}-target-${min}-${max}`);
  if (item.description && normalize(item.description).includes(normalize(item.label))) flags.push("headword-leakage");
  const key = normalize(item.description);
  if (key && !item.placeholder) {
    const prior = seen.get(key);
    if (prior) flags.push(`duplicate-of-${prior.unit}/${prior.id}`);
    else seen.set(key, item);
  }
  if (flags.length) findings.push({ ...item, words, flags });
}

const result = {
  units: selectedFiles.map((file) => file.replace(/\.ts$/, "")),
  words: items.length,
  placeholders: items.filter((item) => item.placeholder).length,
  findings,
  reviewRule: "Use Cambridge and Oxford links to confirm the pictured sense, part of speech, CEFR fit, and regional usage. Write original WordPix copy; never paste dictionary text or examples.",
};

if (json) console.log(JSON.stringify(result, null, 2));
else {
  console.log(`Vocabulary review: ${result.words} words, ${result.placeholders} placeholders, ${findings.length} findings.`);
  for (const finding of findings) {
    console.log(`${finding.unit}/${finding.id}\t${finding.flags.join(",")}\tCambridge: ${finding.sources.cambridge}\tOxford: ${finding.sources.oxford}`);
  }
}

if (findings.some((finding) => finding.flags.some((flag) => !flag.startsWith("placeholder")))) process.exitCode = 1;
