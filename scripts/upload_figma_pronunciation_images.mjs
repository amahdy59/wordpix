import fs from "node:fs/promises";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");
loadEnv();
const manifest = JSON.parse(await fs.readFile("src/app/learning/foundations/figmaPronunciationImageManifest.json", "utf8"));
const r2 = createClient();
let uploaded = 0;
let skipped = 0;
const entries = Object.entries(manifest.images);
let cursor = 0;
async function worker() {
 while (cursor < entries.length) {
  const [ref, url] = entries[cursor++];
  const key = `pronunciation/v1/images/${ref}.png`;
  if (await r2.exists(key)) { skipped += 1; continue; }
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Figma image download failed for ${ref}: ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (!bytes.length) throw new Error(`Empty Figma image for ${ref}`);
  await r2.put(key, bytes, { contentType: "image/png" });
  uploaded += 1;
  if ((uploaded + skipped) % 25 === 0) console.log(`processed ${uploaded + skipped}/${entries.length}`);
 }
}
await Promise.all(Array.from({ length: 8 }, () => worker()));
console.log(`pronunciation images uploaded=${uploaded} skipped=${skipped}`);
