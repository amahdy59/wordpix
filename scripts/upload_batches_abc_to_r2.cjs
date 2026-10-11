const fs = require("fs");
const path = require("path");
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");

loadEnv();

const ROOT = path.join(__dirname, "..");
const DRY_RUN = process.argv.includes("--dry-run");

async function withRetry(operation, attempts = 5) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt === attempts - 1) break;
      await new Promise((resolve) => setTimeout(resolve, 250 * 2 ** attempt));
    }
  }
  throw lastError;
}

async function uploadFiles() {
  const r2 = createClient();
  await r2.verify();
  console.log("R2 connection verified.");

  const manifestPath = path.join(ROOT, "docs/content-review/batches-abc-2026-10-11/manifest.json");
  if (!fs.existsSync(manifestPath)) {
    throw new Error("Manifest not found. Run run_batches_abc.mjs first.");
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const allItems = [...(manifest.batchA || []), ...(manifest.batchB || []), ...(manifest.batchC || [])];
  console.log(`Found ${allItems.length} items in manifest to verify on R2.`);

  let uploaded = 0;
  let skipped = 0;

  for (const item of allItems) {
    const localRel = item.targetFile;
    const localAbs = path.join(ROOT, localRel);
    if (!fs.existsSync(localAbs)) {
      console.warn(`Local file missing for ${item.id}: ${localRel}`);
      continue;
    }

    // Determine target R2 key: images/v1/<relative_path>
    const r2Key = `images/v1/${localRel.replace(/^public\//, "")}`;
    const contentType = r2Key.endsWith(".webp") ? "image/webp" : "image/avif";

    if (DRY_RUN) {
      console.log(`[DRY-RUN] Would upload ${localRel} -> ${r2Key} (${contentType})`);
      continue;
    }

    try {
      const exists = await withRetry(() => r2.exists(r2Key));
      if (exists) {
        skipped += 1;
        continue;
      }

      const buffer = fs.readFileSync(localAbs);
      await withRetry(() => r2.put(r2Key, buffer, { contentType }));
      uploaded += 1;
      console.log(`[UPLOADED] ${r2Key} (${buffer.length} bytes)`);
    } catch (err) {
      console.error(`Error uploading ${r2Key}:`, err.message);
    }
  }

  // Also upload conductor.avif companion if exists
  const conductorAvif = path.join(ROOT, "public/word-images/music-room/conductor.avif");
  if (fs.existsSync(conductorAvif)) {
    const r2Key = "images/v1/word-images/music-room/conductor.avif";
    const exists = await withRetry(() => r2.exists(r2Key));
    if (!exists) {
      const buffer = fs.readFileSync(conductorAvif);
      await withRetry(() => r2.put(r2Key, buffer, { contentType: "image/avif" }));
      console.log(`[UPLOADED] ${r2Key} (${buffer.length} bytes)`);
      uploaded += 1;
    }
  }

  console.log(`\nR2 Upload Finished: ${uploaded} uploaded, ${skipped} already existed.`);
}

uploadFiles().catch(console.error);
