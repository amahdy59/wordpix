#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import sharp from "sharp";

const require = createRequire(import.meta.url);
const { createClient } = require("./lib/r2.cjs");

const FILE_KEY = "gRlyhrMavAHXUAT5brWFWu";
const LIBRARY_NODE = "1134:4887";
const PRONUNCIATION_SECTION = "1088:22";
const API = "https://api.figma.com/v1";
const upload = process.argv.includes("--upload");
const writeLocal = process.argv.includes("--local");
const LOCAL_DIR = "public/word-images/pronunciation";
const VERSION_MODULE = "src/app/learning/foundations/pronunciationImageVersions.ts";

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
    signal: AbortSignal.timeout(90_000),
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

function textValues(node) {
  const values = node.type === "TEXT" && node.characters ? [node.characters] : [];
  for (const child of node.children || []) values.push(...textValues(child));
  return values;
}

const libraryResponse = await figma(`/files/${FILE_KEY}/nodes?ids=${LIBRARY_NODE.replace(":", "%3A")}`);
const library = libraryResponse.nodes[LIBRARY_NODE].document;
const cards = library.children.flatMap((batch) => batch.children || []).filter((node) =>
  node.name?.startsWith("Vocabulary · ")
);

const entries = cards
  .map((card) => {
    const texts = textValues(card);
    const nameParts = card.name.split(" · ").map((value) => value.trim());
    // Cards originally used `Vocabulary · word`. The current Figma library
    // uses `Vocabulary · category · word · lesson refs`.
    const word = nameParts.length >= 3 ? nameParts[2] : nameParts[1];
    return {
      word,
      nodeId: card.id,
      imageRef: imageRef(card),
      description: texts.find((value) => value !== card.name.replace(/^Vocabulary · /, "").trim() && !value.startsWith("Lessons:")),
      lessonRefs: (texts.find((value) => value.startsWith("Lessons:")) || "")
        .replace(/^Lessons:\s*/, "")
        .split(/,\s*/)
        .filter(Boolean),
    };
  })
  .filter((entry) => entry.imageRef && entry.lessonRefs.includes(PRONUNCIATION_SECTION))
  .sort((a, b) => a.word.localeCompare(b.word));

console.log(`Found ${cards.length} vocabulary cards; ${entries.length} are tagged for pronunciation.`);
console.log(entries.map(({ word, description }) => `${word}\t${description || ""}`).join("\n"));

if (upload || writeLocal) {
  const originals = await figma(`/files/${FILE_KEY}/images`);
  const urls = originals.meta?.images || {};
  const r2 = upload ? createClient(env) : null;
  if (r2) await r2.verify();
  let uploaded = 0;
  let existing = 0;
  let changed = 0;
  const versions = {};

  for (const entry of entries) {
    const slug = entry.word.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const sourceUrl = urls[entry.imageRef];
    if (!sourceUrl) throw new Error(`No original Figma image URL for ${entry.word}`);
    const response = await fetch(sourceUrl, { signal: AbortSignal.timeout(90_000) });
    if (!response.ok) throw new Error(`Image download failed for ${entry.word}: ${response.status}`);
    const source = Buffer.from(await response.arrayBuffer());
    const optimized = await sharp(source)
      .rotate()
      .resize({ width: 1024, height: 768, fit: "cover", position: "attention" })
      .webp({ quality: 86 })
      .toBuffer();

    let baseline = null;
    try {
      baseline = await readFile(`${LOCAL_DIR}/${slug}.webp`);
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }

    const isChanged = !baseline?.equals(optimized);
    const digest = createHash("sha256").update(optimized).digest("hex").slice(0, 12);
    const filename = isChanged ? `${slug}-${digest}.webp` : `${slug}.webp`;
    const key = `images/v1/word-images/pronunciation/${filename}`;
    versions[slug] = filename;
    if (isChanged) changed += 1;

    if (r2) {
      const isPresent = await r2.exists(key);
      if (isPresent) {
        existing += 1;
      } else {
        await r2.put(key, optimized, { contentType: "image/webp" });
        const roundTrip = await r2.get(key);
        if (!roundTrip?.equals(optimized)) throw new Error(`R2 byte verification failed for ${entry.word}`);
        uploaded += 1;
        console.log(`uploaded ${entry.word} -> ${key} (${optimized.length} bytes)`);
      }
    }
    if (writeLocal) {
      await mkdir(LOCAL_DIR, { recursive: true });
      await writeFile(`${LOCAL_DIR}/${filename}`, optimized);
    }
  }
  if (writeLocal) {
    const moduleSource = `// GENERATED by scripts/sync_figma_pronunciation_images.mjs.\n` +
      `// Figma node ${LIBRARY_NODE}; changed artwork uses immutable content-addressed filenames.\n` +
      `export const PRONUNCIATION_IMAGE_FILES = ${JSON.stringify(versions, null, 2)} as const;\n`;
    await writeFile(VERSION_MODULE, moduleSource);
  }
  console.log(`Sync complete: ${changed} changed, ${uploaded} uploaded, ${existing} already present, ${entries.length} total.`);
}
