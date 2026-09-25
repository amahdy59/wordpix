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
const ALL_IMAGES_PATH = path.join(ROOT, "scratch", "all_unit_images.json");
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

async function main() {
  const token = process.env.Figma_token || process.env.FIGMA_TOKEN;
  if (!token) throw new Error("Figma token missing in environment");

  const r2 = createClient();
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  if (!manifest.heroes) manifest.heroes = [];
  if (!manifest.images) manifest.images = [];

  const rawImages = JSON.parse(fs.readFileSync(ALL_IMAGES_PATH, "utf8"));
  console.log(`Loaded ${rawImages.length} image elements from Figma canvas.`);

  console.log("Fetching Figma image download URLs...");
  const figmaImageRes = await figmaGet(`/files/${FIGMA_FILE_KEY}/images`, token);
  const figmaImages = figmaImageRes.meta?.images || {};

  const plan = [];
  const plannedKeys = new Set();

  for (const item of rawImages) {
    if (item.unitNum < 1 || item.unitNum > 40) continue;
    const unitSeg = String(item.unitNum).padStart(2, "0");
    const figmaUrl = figmaImages[item.imageRef];

    if (!figmaUrl) {
      console.warn(`[SKIP] No Figma download URL for imageRef: ${item.imageRef}`);
      continue;
    }

    const isHero = /Lesson Thumbnail/i.test(item.nodeName);

    if (isHero) {
      const key = `business/v1/heroes/unit-${unitSeg}-hero.webp`;
      if (!plannedKeys.has(key)) {
        plannedKeys.add(key);
        plan.push({
          type: "hero",
          unitNumber: item.unitNum,
          nodeId: item.nodeId,
          imageRef: item.imageRef,
          figmaUrl,
          key,
          imageSrc: `/${key}`,
        });
      }
    } else {
      let term = item.nodeName
        .replace(/^Concept image\s*·\s*/i, "")
        .replace(/\s*·\s*meaning-first/i, "")
        .trim();
      if (!term || term.toLowerCase() === "rectangle" || term.toLowerCase() === "concept illustration") {
        term = `concept-${item.nodeId.replace(":", "-")}`;
      }
      const slug = slugify(term);
      const key = `business/v1/images/unit-${unitSeg}/vocab-${slug}.webp`;

      if (!plannedKeys.has(key)) {
        plannedKeys.add(key);
        plan.push({
          type: "vocab",
          unitNumber: item.unitNum,
          nodeId: item.nodeId,
          term,
          imageRef: item.imageRef,
          figmaUrl,
          key,
          imageSrc: `/${key}`,
        });
      }
    }
  }

  console.log(`Prepared upload plan for ${plan.length} unique assets.`);

  let uploaded = 0;
  let skipped = 0;
  let errors = 0;

  await runPool(plan, CONCURRENCY, async (item, idx) => {
    try {
      const exists = await r2.exists(item.key);
      if (exists) {
        skipped++;
      } else {
        const res = await fetch(item.figmaUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const rawBuf = Buffer.from(await res.arrayBuffer());

        const webpBuf = await sharp(rawBuf)
          .rotate()
          .webp({ quality: 85, effort: 5 })
          .toBuffer();

        await r2.put(item.key, webpBuf, { contentType: "image/webp" });
        uploaded++;
        if (uploaded % 20 === 0) {
          console.log(`[PROGRESS] Uploaded ${uploaded} new assets to R2...`);
        }
      }

      // Record in manifest
      if (item.type === "hero") {
        const existingIdx = manifest.heroes.findIndex((h) => h.unitNumber === item.unitNumber);
        const heroEntry = {
          unitNumber: item.unitNumber,
          imageRef: item.imageRef,
          key: item.key,
          imageSrc: item.imageSrc,
        };
        if (existingIdx >= 0) {
          manifest.heroes[existingIdx] = heroEntry;
        } else {
          manifest.heroes.push(heroEntry);
        }
      } else {
        const existingIdx = manifest.images.findIndex(
          (m) => m.unitNumber === item.unitNumber && m.term?.toLowerCase() === item.term?.toLowerCase()
        );
        const vocabEntry = {
          unitNumber: item.unitNumber,
          slot: 99,
          term: item.term,
          key: item.key,
          imageSrc: item.imageSrc,
          imageRef: item.imageRef,
        };
        if (existingIdx >= 0) {
          manifest.images[existingIdx] = vocabEntry;
        } else {
          manifest.images.push(vocabEntry);
        }
      }
    } catch (err) {
      console.error(`[ERROR] Failed ${item.key}:`, err.message);
      errors++;
    }
  });

  manifest.heroes.sort((a, b) => a.unitNumber - b.unitNumber);
  manifest.images.sort((a, b) => a.unitNumber - b.unitNumber);
  manifest.totalImages = manifest.images.length;
  manifest.uploadedAt = new Date().toISOString();

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");

  console.log(`\n=== SYNC SUMMARY ===`);
  console.log(`New uploads to R2: ${uploaded}`);
  console.log(`Already on R2 (skipped): ${skipped}`);
  console.log(`Errors: ${errors}`);
  console.log(`Total heroes in manifest: ${manifest.heroes.length}`);
  console.log(`Total images in manifest: ${manifest.images.length}`);
  console.log(`Updated manifest saved to ${MANIFEST_PATH}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
