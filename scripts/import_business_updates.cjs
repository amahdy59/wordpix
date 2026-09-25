/**
 * Imports new Business English assets (Hero thumbnails and updated concept illustrations)
 * from Figma to Cloudflare R2.
 *
 * Rules:
 * - ADD ONLY: strictly no deletions from R2.
 * - Existing objects are preserved or safely updated.
 * - Convert to WebP (85% quality, strip metadata).
 */
const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");

loadEnv();

const ROOT = path.resolve(__dirname, "..");
const MANIFEST_PATH = path.join(
  ROOT,
  "src",
  "app",
  "learning",
  "business",
  "businessImageManifest.json"
);
const AUDIT_PATH = path.join(ROOT, "scratch", "new_images_audit.json");
const FIGMA_FILE_KEY = "gRlyhrMavAHXUAT5brWFWu";
const CONCURRENCY = 6;

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function figmaGet(route, token) {
  const response = await fetch(`https://api.figma.com/v1${route}`, {
    headers: { "X-Figma-Token": token },
  });
  if (!response.ok) {
    throw new Error(`Figma ${response.status}: ${(await response.text()).slice(0, 300)}`);
  }
  return response.json();
}

async function runPool(items, concurrency, task) {
  let cursor = 0;
  const results = new Array(items.length);
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await task(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  return results;
}

function parseUnitNumber(unitName) {
  const m = unitName.match(/unit[- ]0?(\d+)/i);
  return m ? parseInt(m[1], 10) : 0;
}

async function main() {
  const figmaToken = process.env.Figma_token || process.env.FIGMA_TOKEN;
  if (!figmaToken) throw new Error("Figma_token missing in .env.local");

  const newImages = JSON.parse(fs.readFileSync(AUDIT_PATH, "utf8"));
  console.log(`Audited ${newImages.length} new image references from Figma.`);

  console.log("Fetching Figma image URLs...");
  const imageMapRes = await figmaGet(`/files/${FIGMA_FILE_KEY}/images`, figmaToken);
  const figmaImages = imageMapRes.meta?.images || {};

  const r2 = createClient();
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  if (!manifest.heroes) manifest.heroes = [];

  const uploadPlan = [];

  for (const item of newImages) {
    const unitNum = parseUnitNumber(item.unitName);
    const unitSeg = String(unitNum).padStart(2, "0");
    const figmaUrl = figmaImages[item.imageRef];

    if (!figmaUrl) {
      console.warn(`[WARN] No Figma URL for ${item.nodeName} (${item.imageRef})`);
      continue;
    }

    if (item.nodeName === "Lesson Thumbnail") {
      const key = `business/v1/heroes/unit-${unitSeg}-hero.webp`;
      uploadPlan.push({
        type: "hero",
        unitNumber: unitNum,
        nodeId: item.nodeId,
        imageRef: item.imageRef,
        figmaUrl,
        key,
        imageSrc: `/${key}`,
      });
    } else {
      const termName = item.nodeName.replace(/^Concept image\s*·\s*/i, "").trim();
      const slug = slugify(termName || "illustration");
      const key = `business/v1/images/unit-${unitSeg}/extra-${slug}.webp`;
      uploadPlan.push({
        type: "vocab",
        unitNumber: unitNum,
        nodeId: item.nodeId,
        term: termName,
        imageRef: item.imageRef,
        figmaUrl,
        key,
        imageSrc: `/${key}`,
      });
    }
  }

  console.log(`Prepared upload plan for ${uploadPlan.length} assets.`);

  let uploaded = 0;
  let skipped = 0;
  let errors = 0;

  await runPool(uploadPlan, CONCURRENCY, async (item) => {
    try {
      const exists = await r2.exists(item.key);
      if (exists) {
        console.log(`[SKIP] Already exists: ${item.key}`);
        skipped++;
      } else {
        console.log(`[FETCH] ${item.key} from ${item.figmaUrl.slice(0, 60)}...`);
        const res = await fetch(item.figmaUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const rawBuf = Buffer.from(await res.arrayBuffer());

        const webpBuf = await sharp(rawBuf)
          .rotate()
          .webp({ quality: 85, effort: 5 })
          .toBuffer();

        await r2.put(item.key, webpBuf, { contentType: "image/webp" });
        console.log(`[UPLOADED] ${item.key} (${webpBuf.length} bytes)`);
        uploaded++;
      }

      // Record in manifest
      if (item.type === "hero") {
        const existingIdx = manifest.heroes.findIndex((h) => h.unitNumber === item.unitNumber);
        const entry = {
          unitNumber: item.unitNumber,
          imageRef: item.imageRef,
          key: item.key,
          imageSrc: item.imageSrc,
        };
        if (existingIdx >= 0) {
          manifest.heroes[existingIdx] = entry;
        } else {
          manifest.heroes.push(entry);
        }
      } else {
        const existingIdx = manifest.images.findIndex(
          (m) => m.unitNumber === item.unitNumber && m.term === item.term
        );
        const entry = {
          unitNumber: item.unitNumber,
          slot: 99,
          term: item.term,
          key: item.key,
          imageSrc: item.imageSrc,
          imageRef: item.imageRef,
        };
        if (existingIdx >= 0) {
          manifest.images[existingIdx] = entry;
        } else {
          manifest.images.push(entry);
        }
      }
    } catch (err) {
      console.error(`[ERROR] Failed ${item.key}:`, err.message);
      errors++;
    }
  });

  // Sort heroes
  manifest.heroes.sort((a, b) => a.unitNumber - b.unitNumber);
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");

  console.log(`\n=== UPLOAD SUMMARY ===`);
  console.log(`Uploaded: ${uploaded}`);
  console.log(`Skipped (already on R2): ${skipped}`);
  console.log(`Errors: ${errors}`);
  console.log(`Manifest updated at ${MANIFEST_PATH}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
