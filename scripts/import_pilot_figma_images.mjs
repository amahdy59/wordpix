#!/usr/bin/env node
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const FILE_KEY = "gRlyhrMavAHXUAT5brWFWu";
const REVISED_FRAME_IDS = ["1581:220", "1581:322", "1581:402", "1596:2"];
const EXPECTED_FIGMA_IMAGES = 114;
const CONCURRENCY = 5;

const REJECTED_FILES = new Set();

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
const token = process.env.FIGMA_TOKEN || process.env.Figma_token || localEnv.FIGMA_TOKEN || localEnv.Figma_token;
if (!token) throw new Error("Missing FIGMA_TOKEN/Figma_token in .env.local");

async function figma(route) {
  const response = await fetch(`https://api.figma.com/v1${route}`, {
    headers: { "X-Figma-Token": token },
    signal: AbortSignal.timeout(120_000),
  });
  if (!response.ok) throw new Error(`Figma ${response.status}: ${(await response.text()).slice(0, 300)}`);
  return response.json();
}

function collectImages(node, output) {
  const imageFill = Array.isArray(node.fills)
    ? node.fills.find((fill) => fill.type === "IMAGE" && fill.imageRef)
    : undefined;
  if (node.type === "RECTANGLE" && imageFill && /\.avif$/.test(node.name ?? "")) {
    output.push({ file: node.name, imageRef: imageFill.imageRef, nodeId: node.id });
  }
  for (const child of node.children ?? []) collectImages(child, output);
}

async function fetchBytes(url, label) {
  const response = await fetch(url, { signal: AbortSignal.timeout(120_000) });
  if (!response.ok) throw new Error(`Image download failed (${response.status}) for ${label}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length === 0) throw new Error(`Figma returned an empty image for ${label}`);
  return bytes;
}

function destination(file) {
  const folder = file.startsWith("numbers-counting-")
    ? "numbers-counting"
    : file.startsWith("colors-")
      ? "colors"
      : "shapes-geometry";
  return path.join("public", "learning-scenes", folder, file);
}

const nodeQuery = REVISED_FRAME_IDS.map(encodeURIComponent).join(",");
const nodeResponse = await figma(`/files/${FILE_KEY}/nodes?ids=${nodeQuery}`);
const found = [];
for (const id of REVISED_FRAME_IDS) {
  const root = nodeResponse.nodes?.[id]?.document;
  if (!root) throw new Error(`Figma node ${id} was not returned`);
  collectImages(root, found);
}

if (found.length !== EXPECTED_FIGMA_IMAGES) {
  throw new Error(`Expected ${EXPECTED_FIGMA_IMAGES} revised images, found ${found.length}`);
}
const duplicates = found.filter(
  (entry, index) => found.findIndex((candidate) => candidate.file === entry.file) !== index
);
if (duplicates.length) throw new Error(`Duplicate Figma filenames: ${duplicates.map((item) => item.file).join(", ")}`);

const approved = found.filter((entry) => !REJECTED_FILES.has(entry.file));
const imageResponse = await figma(`/files/${FILE_KEY}/images`);
const sourceUrls = imageResponse.meta?.images ?? {};
for (const entry of approved) {
  if (!sourceUrls[entry.imageRef]) throw new Error(`No Figma source URL for ${entry.file}`);
}

let cursor = 0;
let imported = 0;
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (cursor < approved.length) {
      const entry = approved[cursor++];
      const target = destination(entry.file);
      await mkdir(path.dirname(target), { recursive: true });
      const source = await fetchBytes(sourceUrls[entry.imageRef], entry.file);
      const optimized = await sharp(source)
        .rotate()
        .resize(1200, 900, { fit: "cover", position: "centre" })
        .avif({ quality: 62, effort: 6 })
        .toBuffer();
      if (optimized.length === 0) throw new Error(`AVIF conversion returned no data for ${entry.file}`);
      await writeFile(target, optimized);
      const metadata = await sharp(target).metadata();
      if (metadata.width !== 1200 || metadata.height !== 900) {
        throw new Error(`Unexpected dimensions for ${entry.file}: ${metadata.width}x${metadata.height}`);
      }
      if ((await stat(target)).size === 0) throw new Error(`Zero-byte output for ${entry.file}`);
      imported += 1;
      if (imported % 20 === 0 || imported === approved.length) {
        console.log(`imported ${imported}/${approved.length}`);
      }
    }
  })
);

console.log(`approved: ${approved.length}`);
console.log(`withheld: ${REJECTED_FILES.size}`);
console.log("R2: untouched");
