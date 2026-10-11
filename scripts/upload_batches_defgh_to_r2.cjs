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

  const manifestPath = path.join(ROOT, "docs/content-review/batches-efgh-2026-10-11/manifest.json");
  if (!fs.existsSync(manifestPath)) {
    throw new Error("Manifest not found. Run run_batches_efgh.mjs first.");
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const allBatchItems = [
    ...(manifest.batchE || []),
    ...(manifest.batchF || []),
    ...(manifest.batchG || []),
    ...(manifest.batchH || [])
  ];

  console.log(`Found ${allBatchItems.length} items in Batches E, F, G, H manifest.`);

  // Collect all files to check and upload (both .webp and .avif pairs)
  const filesToUpload = new Set();

  for (const item of allBatchItems) {
    if (item.targetFile) {
      filesToUpload.add(item.targetFile);
      filesToUpload.add(item.targetFile.replace(/\.webp$/, ".avif"));
    }
  }

  // Also include Islamic studies vocabulary files
  const islamicDir = "public/word-images/islamic-studies";
  const islamicFiles = ["gain", "intend", "judged", "marry", "migration", "motive", "worldly"];
  for (const f of islamicFiles) {
    filesToUpload.add(`${islamicDir}/${f}.webp`);
    filesToUpload.add(`${islamicDir}/${f}.avif`);
  }

  console.log(`Total candidate files to inspect for R2 upload: ${filesToUpload.size}`);

  let uploaded = 0;
  let skipped = 0;

  for (const localRel of filesToUpload) {
    const localAbs = path.join(ROOT, localRel);
    if (!fs.existsSync(localAbs)) {
      continue;
    }

    // Skip if local file is a tiny placeholder
    const stat = fs.statSync(localAbs);
    if (stat.size < 2000) {
      console.warn(`Skipping small placeholder: ${localRel} (${stat.size} bytes)`);
      continue;
    }

    // Target R2 key: images/v1/<rel_path>
    const r2Key = `images/v1/${localRel.replace(/^public\//, "")}`;
    const contentType = r2Key.endsWith(".webp") ? "image/webp" : "image/avif";

    if (DRY_RUN) {
      console.log(`[DRY-RUN] Would upload ${localRel} -> ${r2Key} (${contentType}, ${stat.size} bytes)`);
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

  console.log(`\n========================================`);
  console.log(`R2 Upload Complete: ${uploaded} uploaded, ${skipped} already existed.`);
  console.log(`========================================\n`);
}

uploadFiles().catch(console.error);
