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

async function uploadBatchesIJ() {
  const r2 = createClient();
  await r2.verify();
  console.log("R2 connection verified.");

  const manifestPath = path.join(ROOT, "docs/content-review/batches-ij-2026-10-11/manifest.json");
  if (!fs.existsSync(manifestPath)) {
    throw new Error("Manifest not found. Run run_batches_ij.mjs first.");
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const allBatchItems = [
    ...(manifest.batchI || []),
    ...(manifest.batchJ || [])
  ];

  console.log(`Found ${allBatchItems.length} items in Batches I & J manifest.`);

  const filesToUpload = new Set();
  for (const item of allBatchItems) {
    if (item.targetFile) {
      filesToUpload.add(item.targetFile);
      filesToUpload.add(item.targetFile.replace(/\.webp$/, ".avif"));
    }
  }

  console.log(`Total file variants to check & upload: ${filesToUpload.size}`);

  let uploaded = 0;
  let alreadyExisted = 0;

  for (const relFile of filesToUpload) {
    const localPath = path.join(ROOT, relFile);
    if (!fs.existsSync(localPath)) {
      console.warn(`[MISSING LOCAL FILE] ${relFile}`);
      continue;
    }

    const stat = fs.statSync(localPath);
    if (stat.size < 2000) {
      console.warn(`Skipping small file: ${relFile}`);
      continue;
    }

    // Prefix under images/v1/
    const normalized = relFile.replace(/^public\//, "").replace(/^\/+/, "");
    const objectKey = `images/v1/${normalized}`;
    const contentType = relFile.endsWith(".avif") ? "image/avif" : "image/webp";

    const exists = await withRetry(() => r2.exists(objectKey));
    if (exists) {
      alreadyExisted++;
      continue;
    }

    if (DRY_RUN) {
      console.log(`[DRY RUN] Would upload: ${objectKey}`);
      uploaded++;
      continue;
    }

    const buffer = fs.readFileSync(localPath);
    await withRetry(() => r2.put(objectKey, buffer, { contentType }));
    uploaded++;
    if (uploaded % 10 === 0) {
      console.log(`Uploaded ${uploaded} files to R2...`);
    }
  }

  console.log(`\n=== Batches I & J R2 Upload Complete ===`);
  console.log(`Uploaded: ${uploaded}`);
  console.log(`Already existed: ${alreadyExisted}`);
  console.log(`Total checked: ${filesToUpload.size}`);
}

uploadBatchesIJ().catch((err) => {
  console.error("Upload failed:", err);
  process.exit(1);
});
