const fs = require("fs");
const path = require("path");
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");

loadEnv();

const AUDIO_DIR = path.join(__dirname, "..", "assets", "audio-batches", "feedback");
const CONCURRENCY = Number(process.env.R2_UPLOAD_CONCURRENCY || 4);

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

async function main() {
  if (!fs.existsSync(AUDIO_DIR)) {
    console.log("No feedback audio directory found.");
    return;
  }
  
  const files = fs.readdirSync(AUDIO_DIR).filter(f => f.endsWith('.mp3'));
  console.log(`Uploading ${files.length} feedback audio files to R2...`);

  const r2 = createClient();
  await r2.verify();

  let cursor = 0;
  let uploaded = 0;
  let skipped = 0;

  async function worker() {
    while (cursor < files.length) {
      const fileName = files[cursor++];
      const hash = fileName.replace('.mp3', '');
      const key = `audio/${hash.slice(0, 2)}/${hash}.mp3`;
      const file = path.join(AUDIO_DIR, fileName);

      if (await withRetry(() => r2.exists(key))) {
        skipped += 1;
        continue;
      }

      await withRetry(() => r2.put(key, fs.readFileSync(file), {
        contentType: "audio/mpeg",
      }));
      uploaded += 1;

      if ((uploaded + skipped) % 10 === 0) {
        console.log(`processed ${uploaded + skipped}/${files.length}`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  console.log(`\nuploaded: ${uploaded}`);
  console.log(`skipped : ${skipped}`);
}

main().catch((error) => {
  console.error(`\nAsset upload failed: ${error.message}`);
  process.exitCode = 1;
});
