#!/usr/bin/env node
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
    return {
      word: card.name.replace(/^Vocabulary · /, "").trim(),
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

  for (const entry of entries) {
    const key = `images/v1/word-images/pronunciation/${entry.word.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.webp`;
    const isPresent = r2 ? await r2.exists(key) : false;
    let optimized;
    if (isPresent) {
      existing += 1;
      optimized = writeLocal ? await r2.get(key) : null;
    } else {
      const sourceUrl = urls[entry.imageRef];
      if (!sourceUrl) throw new Error(`No original Figma image URL for ${entry.word}`);
      const response = await fetch(sourceUrl, { signal: AbortSignal.timeout(90_000) });
      if (!response.ok) throw new Error(`Image download failed for ${entry.word}: ${response.status}`);
      const source = Buffer.from(await response.arrayBuffer());
      optimized = await sharp(source)
        .rotate()
        .resize({ width: 1024, height: 768, fit: "cover", position: "attention" })
        .webp({ quality: 86 })
        .toBuffer();
      if (r2) {
        await r2.put(key, optimized, { contentType: "image/webp" });
        const roundTrip = await r2.get(key);
        if (!roundTrip?.equals(optimized)) throw new Error(`R2 byte verification failed for ${entry.word}`);
        uploaded += 1;
        console.log(`uploaded ${entry.word} -> ${key} (${optimized.length} bytes)`);
      }
    }
    if (writeLocal && optimized) {
      const localDir = "public/word-images/pronunciation";
      await mkdir(localDir, { recursive: true });
      await writeFile(`${localDir}/${entry.word.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.webp`, optimized);
    }
  }
  console.log(`R2 complete: ${uploaded} uploaded, ${existing} already present, ${entries.length} total.`);
}
