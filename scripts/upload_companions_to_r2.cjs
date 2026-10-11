const fs = require("fs");
const path = require("path");
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");

loadEnv();

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

function getContentType(filePath) {
  if (filePath.endsWith(".avif")) return "image/avif";
  if (filePath.endsWith(".webp")) return "image/webp";
  if (filePath.endsWith(".png")) return "image/png";
  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) return "image/jpeg";
  return "application/octet-stream";
}

async function uploadCompanions() {
  const r2 = createClient();
  await r2.verify();
  console.log("R2 connection verified.");

  const uploadQueue = [];

  // 1. Pronunciation files
  const pronDir = path.resolve("public/word-images/pronunciation");
  for (const f of fs.readdirSync(pronDir)) {
    if (f.endsWith(".avif") || f.endsWith(".webp")) {
      uploadQueue.push({
        localPath: path.join(pronDir, f),
        r2Key: `images/v1/word-images/pronunciation/${f}`,
      });
    }
  }

  // 2. Scene images AVIF
  const sceneDir = path.resolve("public/scene-images");
  for (const f of fs.readdirSync(sceneDir)) {
    if (f.endsWith(".avif")) {
      uploadQueue.push({
        localPath: path.join(sceneDir, f),
        r2Key: `images/v1/scene-images/${f}`,
      });
    }
  }

  // 3. Learning scenes WebP
  const learnDir = path.resolve("public/learning-scenes");
  function collectRecursive(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) collectRecursive(full);
      else if (e.isFile() && e.name.endsWith(".webp")) {
        const rel = path.relative("public/learning-scenes", full).replace(/\\/g, "/");
        uploadQueue.push({
          localPath: full,
          r2Key: `images/v1/learning-scenes/${rel}`,
        });
      }
    }
  }
  collectRecursive(learnDir);

  console.log(`Discovered ${uploadQueue.length} files in companion upload queue.`);

  let uploaded = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < uploadQueue.length; i++) {
    const item = uploadQueue[i];
    try {
      const exists = await withRetry(() => r2.exists(item.r2Key));
      if (exists) {
        skipped++;
      } else {
        const buf = fs.readFileSync(item.localPath);
        const contentType = getContentType(item.localPath);
        await withRetry(() => r2.put(item.r2Key, buf, { contentType }));
        uploaded++;
      }
    } catch (err) {
      console.error(`Failed to process ${item.r2Key}:`, err.message);
      errors++;
    }

    if ((i + 1) % 25 === 0 || i === uploadQueue.length - 1) {
      console.log(`Progress: ${i + 1}/${uploadQueue.length} (Uploaded: ${uploaded}, Skipped: ${skipped}, Errors: ${errors})`);
    }
  }

  console.log(`\nUpload Complete! Total: ${uploadQueue.length}, Uploaded: ${uploaded}, Skipped: ${skipped}, Errors: ${errors}`);
  if (errors > 0) process.exit(1);
}

uploadCompanions().catch((e) => {
  console.error("Companion upload crashed:", e);
  process.exit(1);
});
