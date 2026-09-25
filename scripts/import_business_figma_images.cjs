/**
 * Imports Business English vocabulary images from Figma to Cloudflare R2.
 *
 * Safety contract:
 * - Figma is read-only (GET).
 * - R2 uses HEAD and PUT only (NO DELETE or REMOVE).
 * - Existing R2 objects are always skipped.
 * - Images are converted in-memory to WebP and never written into git.
 * - Audio files and existing curricula are never touched.
 */
const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");

loadEnv();

const ROOT = path.resolve(__dirname, "..");
const RAW_UNITS_PATH = path.join(ROOT, "scratch", "parsed_units_raw.json");
const MANIFEST_PATH = path.join(
  ROOT,
  "src",
  "app",
  "learning",
  "business",
  "businessImageManifest.json"
);
const FIGMA_FILE_KEY = "gRlyhrMavAHXUAT5brWFWu";
const DRY_RUN = process.argv.includes("--dry-run");
const CONCURRENCY = 6;
const AUDIT_CONCURRENCY = 10;

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
  const figmaToken = process.env.Figma_token || process.env.FIGMA_TOKEN;
  if (!figmaToken) throw new Error("Figma_token is not configured in .env.local");

  if (!fs.existsSync(RAW_UNITS_PATH)) {
    throw new Error(`Raw units file missing at ${RAW_UNITS_PATH}`);
  }
  const rawUnits = JSON.parse(fs.readFileSync(RAW_UNITS_PATH, "utf8"));
  console.log(`Loaded ${rawUnits.length} units from ${RAW_UNITS_PATH}`);

  console.log("Fetching Figma image map...");
  const imageMapRes = await figmaGet(`/files/${FIGMA_FILE_KEY}/images`, figmaToken);
  const figmaImages = imageMapRes.meta?.images || {};
  console.log(`Figma provided ${Object.keys(figmaImages).length} image URLs`);

  // Build upload plan
  const plan = [];
  for (const unit of rawUnits) {
    const unitSegment = String(unit.unitNumber).padStart(2, "0");
    unit.languageBank.forEach((item, slotIndex) => {
      const slotSegment = String(slotIndex + 1).padStart(2, "0");
      const key = `business/v1/images/unit-${unitSegment}/vocab-${slotSegment}-${slugify(item.term)}.webp`;
      const figmaUrl = figmaImages[item.imageRef];
      if (!figmaUrl) {
        console.warn(`[WARN] Missing Figma URL for unit ${unit.unitNumber} "${item.term}" (${item.imageRef})`);
      }
      plan.push({
        unitNumber: unit.unitNumber,
        slot: slotIndex + 1,
        term: item.term,
        imageRef: item.imageRef,
        figmaUrl,
        key,
        imageSrc: `/${key}`,
      });
    });
  }

  console.log(`Total images in import plan: ${plan.length}`);

  const r2 = createClient();
  console.log(`Auditing ${plan.length} items against R2 bucket: ${r2.config.bucket}...`);
  const existence = await runPool(plan, AUDIT_CONCURRENCY, async (item) => {
    return r2.exists(item.key);
  });

  const pending = plan.filter((_, idx) => !existence[idx]);
  const alreadyUploaded = plan.filter((_, idx) => existence[idx]);
  console.log(`Already in R2: ${alreadyUploaded.length}`);
  console.log(`Pending upload: ${pending.length}`);

  if (DRY_RUN) {
    console.log("[DRY-RUN] No images uploaded. Sample pending items:");
    console.log(pending.slice(0, 5));
    return;
  }

  let uploadedCount = 0;
  let errorCount = 0;

  console.log(`Starting upload of ${pending.length} images with concurrency ${CONCURRENCY}...`);
  await runPool(pending, CONCURRENCY, async (item, idx) => {
    if (!item.figmaUrl) {
      console.error(`Skipping ${item.key}: No Figma URL`);
      errorCount++;
      return;
    }
    try {
      const res = await fetch(item.figmaUrl);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const rawBuffer = Buffer.from(await res.arrayBuffer());
      if (!rawBuffer.length) throw new Error("Empty buffer received");

      const webpBuffer = await sharp(rawBuffer)
        .webp({ quality: 85, effort: 4 })
        .toBuffer();

      await r2.put(item.key, webpBuffer, {
        contentType: "image/webp",
        immutable: true,
      });

      uploadedCount++;
      if (uploadedCount % 20 === 0 || uploadedCount === pending.length) {
        console.log(`Uploaded ${uploadedCount}/${pending.length} images...`);
      }
    } catch (err) {
      console.error(`Failed ${item.key}:`, err.message);
      errorCount++;
    }
  });

  console.log(`Upload complete! Uploaded: ${uploadedCount}, Errors: ${errorCount}`);

  // Save manifest
  const manifestDir = path.dirname(MANIFEST_PATH);
  if (!fs.existsSync(manifestDir)) fs.mkdirSync(manifestDir, { recursive: true });

  const manifest = {
    schemaVersion: 1,
    course: "Beyond Business English",
    totalImages: plan.length,
    uploadedAt: new Date().toISOString(),
    images: plan.map((p) => ({
      unitNumber: p.unitNumber,
      slot: p.slot,
      term: p.term,
      key: p.key,
      imageSrc: p.imageSrc,
      imageRef: p.imageRef,
    })),
  };

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`Saved manifest to ${MANIFEST_PATH}`);
}

main().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
