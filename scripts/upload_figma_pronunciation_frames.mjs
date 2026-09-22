import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");
loadEnv();

const fileKey = "gRlyhrMavAHXUAT5brWFWu";
const pageId = "1126:3665";
const token = process.env.Figma_token;
if (!token) throw new Error("Figma_token is missing");
const headers = { "X-Figma-Token": token };

const nodeResponse = await fetch(
  `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${encodeURIComponent(pageId)}`,
  { headers },
);
if (!nodeResponse.ok) throw new Error(`Figma node request failed: ${nodeResponse.status}`);
const payload = await nodeResponse.json();
const document = payload.nodes?.[pageId]?.document;
const frames = [];
for (const section of document?.children ?? []) {
  for (const frame of section.children ?? []) {
    if (/^lesson-\d+-/.test(frame.name ?? "")) frames.push(frame);
  }
}
frames.sort((a, b) => Number(a.name.match(/lesson-(\d+)/)?.[1]) - Number(b.name.match(/lesson-(\d+)/)?.[1]));
if (frames.length !== 68) throw new Error(`Expected 68 lesson frames, found ${frames.length}`);

const r2 = createClient();
let uploaded = 0;
let skipped = 0;
for (const frame of frames) {
  const number = String(frame.name.match(/lesson-(\d+)/)?.[1]).padStart(2, "0");
  const imageResponse = await fetch(
    `https://api.figma.com/v1/images/${fileKey}?ids=${encodeURIComponent(frame.id)}&format=png&scale=1`,
    { headers },
  );
  if (!imageResponse.ok) throw new Error(`Figma export failed for ${frame.id}: ${imageResponse.status}`);
  const imageMap = await imageResponse.json();
  const imageUrl = imageMap.images?.[frame.id];
  if (!imageUrl) throw new Error(`No exported image URL for ${frame.id}`);
  const bytes = Buffer.from(await (await fetch(imageUrl)).arrayBuffer());
  const key = `pronunciation/v1/lesson-${number}.png`;
  if (await r2.exists(key)) {
    skipped += 1;
    continue;
  }
  await r2.put(key, bytes, { contentType: "image/png" });
  uploaded += 1;
  console.log(`lesson ${number}: uploaded (${bytes.length} bytes)`);
}
console.log(`pronunciation frames uploaded=${uploaded} skipped=${skipped}`);
