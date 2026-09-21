#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import sharp from "sharp";

const require = createRequire(import.meta.url);
const { createClient } = require("./lib/r2.cjs");

const FILE_KEY = "gRlyhrMavAHXUAT5brWFWu";
const ROOT_NODE = "1156:22";
const ISLAMIC_TRADITION_REPLACEMENT_NODE = "1207:25";
const API = "https://api.figma.com/v1";
const MANIFEST = "src/generated/figmaImageReplacements.ts";
const CONCURRENCY = 8;
const targetNodeOnly = process.argv.includes("--target-node-only");

function parseEnv(source) {
  return Object.fromEntries(
    source
      .split(/\r?\n/)
      .map((line) => line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/))
      .filter(Boolean)
      .map((match) => [match[1], match[2].replace(/^(['"])(.*)\1$/, "$2")])
  );
}

const localEnv = parseEnv(await readFile(".env.local", "utf8"));
const env = { ...localEnv, ...process.env };
const token = env.FIGMA_TOKEN || env.Figma_token || env.Figma_Token;
if (!token) throw new Error("Missing FIGMA_TOKEN/Figma_token in .env.local");

async function figma(path) {
  const response = await fetch(`${API}${path}`, {
    headers: { "X-Figma-Token": token },
    signal: AbortSignal.timeout(120_000),
  });
  if (!response.ok) throw new Error(`Figma ${response.status}: ${await response.text()}`);
  return response.json();
}

function imageRef(node) {
  for (const fill of node.fills || []) if (fill.type === "IMAGE") return fill.imageRef;
  for (const child of node.children || []) {
    const found = imageRef(child);
    if (found) return found;
  }
  return null;
}

function logicalPath(name) {
  if (name.startsWith("hero-card/")) return `scene-images/${name.slice("hero-card/".length)}`;
  if (name === "concept-card/conductor.avif") return "word-images/music-room/conductor.avif";
  if (name === "concept-card/bank-hero.webp" || name === "concept-card/revision-5-hero.webp") {
    return `scene-images/${name.slice("concept-card/".length)}`;
  }
  if (name.startsWith("concept-card/")) {
    return `word-images/islamic-studies/${name.slice("concept-card/".length)}`;
  }
  if (/^[a-z0-9-]+\/[a-z0-9'-]+\.avif$/.test(name)) return `word-images/${name}`;
  return null;
}

function hashedPath(path, digest) {
  const dot = path.lastIndexOf(".");
  return `${path.slice(0, dot)}-${digest}${path.slice(dot)}`;
}

const replacementPathAliases = new Map([
  ["spa/floatation-tank", "word-images/spa/flotation-tank.avif"],
  ["cinema/red-carpet", "word-images/runway-show/red-carpet.avif"],
]);

function collectHeadingGroupedReplacements(root) {
  const replacements = [];
  let unit = null;

  for (const child of root.children || []) {
    const heading = child.name?.match(/^(.*)-heading$/);
    if (heading) {
      unit = heading[1];
      continue;
    }
    if (child.type !== "FRAME") continue;
    if (!unit)
      throw new Error(
        `Replacement image ${child.id} (${child.name}) has no preceding unit heading`
      );
    const ref = imageRef(child);
    if (!ref) throw new Error(`No image fill in ${child.id} (${unit}/${child.name})`);
    const path =
      replacementPathAliases.get(`${unit}/${child.name}`) ||
      `word-images/${unit}/${child.name}.avif`;
    replacements.push({ nodeId: child.id, name: `${unit}/${child.name}`, path, ref });
  }

  return replacements;
}

async function pooled(items, worker) {
  const queue = [...items];
  let completed = 0;
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const item = queue.shift();
      await worker(item);
      completed += 1;
      if (completed % 50 === 0 || completed === items.length) {
        console.log(`processed ${completed}/${items.length}`);
      }
    }
  });
  await Promise.all(workers);
}

async function fetchBytes(url, label) {
  let lastError;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(120_000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      lastError = error;
      if (attempt < 4) await new Promise((resolve) => setTimeout(resolve, attempt * 750));
    }
  }
  throw new Error(`Download failed for ${label} after 4 attempts`, { cause: lastError });
}

const nodeResponse = await figma(
  `/files/${FILE_KEY}/nodes?ids=${ROOT_NODE.replace(":", "%3A")}&depth=3`
);
const root = nodeResponse.nodes?.[ROOT_NODE]?.document;
if (!root) throw new Error(`Figma node ${ROOT_NODE} was not returned`);

const entries = [];
for (const section of root.children || []) {
  for (const card of section.children || []) {
    const path = logicalPath(card.name || "");
    if (!path) continue;
    const ref = imageRef(card);
    if (!ref) throw new Error(`No image fill in ${card.id} (${card.name})`);
    entries.push({ nodeId: card.id, name: card.name, path, ref });
  }
}

const replacementResponse = await figma(
  `/files/${FILE_KEY}/nodes?ids=${ISLAMIC_TRADITION_REPLACEMENT_NODE.replace(":", "%3A")}&depth=2`
);
const replacementRoot = replacementResponse.nodes?.[ISLAMIC_TRADITION_REPLACEMENT_NODE]?.document;
if (!replacementRoot) {
  throw new Error(`Figma node ${ISLAMIC_TRADITION_REPLACEMENT_NODE} was not returned`);
}
entries.push(...collectHeadingGroupedReplacements(replacementRoot));

const duplicates = entries.filter(
  (entry, index) => entries.findIndex((other) => other.path === entry.path) !== index
);
if (duplicates.length)
  throw new Error(`Duplicate target paths: ${duplicates.map((entry) => entry.path).join(", ")}`);
if (entries.length < 1000)
  throw new Error(
    `Safety check failed: expected at least 1000 named replacements, found ${entries.length}`
  );

const syncEntries = targetNodeOnly
  ? entries.filter((entry) =>
      entry.nodeId.startsWith(`${ISLAMIC_TRADITION_REPLACEMENT_NODE.split(":")[0]}:`)
    )
  : entries;

console.log(`Found ${entries.length} replacement images under Figma node ${ROOT_NODE}.`);
if (process.argv.includes("--list")) {
  console.log(entries.map((entry) => `${entry.nodeId}\t${entry.path}`).join("\n"));
  process.exit(0);
}

const originalResponse = await figma(`/files/${FILE_KEY}/images`);
const sourceUrls = originalResponse.meta?.images || {};
for (const entry of syncEntries) {
  if (!sourceUrls[entry.ref]) throw new Error(`No original image URL for ${entry.name}`);
}

if (!process.argv.includes("--upload")) {
  console.log(
    "Dry run complete. Pass --upload to optimize, upload, verify, and write the manifest."
  );
  process.exit(0);
}

const r2 = createClient(env);
await r2.verify();
const previousManifest = await readFile(MANIFEST, "utf8");
const previousManifestObject = previousManifest
  .slice(previousManifest.indexOf("{"), previousManifest.lastIndexOf("}") + 1)
  .replace(/,\s*}$/, "\n}");
const replacements = targetNodeOnly ? JSON.parse(previousManifestObject) : {};
let uploaded = 0;
let existing = 0;

await pooled(syncEntries, async (entry) => {
  const source = await fetchBytes(sourceUrls[entry.ref], entry.name);
  const isHero = entry.path.startsWith("scene-images/");
  const pipeline = sharp(source)
    .rotate()
    .resize({ width: isHero ? 1920 : 1024, withoutEnlargement: true });
  const optimized = entry.path.endsWith(".webp")
    ? await pipeline.webp({ quality: 86 }).toBuffer()
    : await pipeline.avif({ quality: 55 }).toBuffer();
  const digest = createHash("sha256").update(optimized).digest("hex").slice(0, 12);
  const versionedPath = hashedPath(entry.path, digest);
  const key = `images/v1/${versionedPath}`;
  replacements[entry.path] = versionedPath;

  if (await r2.exists(key)) {
    existing += 1;
    return;
  }
  await r2.put(key, optimized, {
    contentType: entry.path.endsWith(".webp") ? "image/webp" : "image/avif",
  });
  const roundTrip = await r2.get(key);
  if (!roundTrip?.equals(optimized))
    throw new Error(`R2 byte verification failed for ${entry.path}`);
  uploaded += 1;
});

const ordered = Object.fromEntries(
  Object.entries(replacements).sort(([a], [b]) => a.localeCompare(b))
);
const source =
  `// GENERATED by scripts/sync_figma_replacement_images.mjs.\n` +
  `// Only assets present under Figma nodes ${ROOT_NODE} and ${ISLAMIC_TRADITION_REPLACEMENT_NODE} are mapped here.\n` +
  `export const FIGMA_IMAGE_REPLACEMENTS: Readonly<Record<string, string>> = ${JSON.stringify(ordered, null, 2)};\n`;
await writeFile(MANIFEST, source);
console.log(
  `Sync complete: ${uploaded} uploaded, ${existing} already present, ${syncEntries.length} refreshed, ${Object.keys(ordered).length} linked.`
);
