/**
 * Downloads all generated audio clips from the Cloudflare R2 public CDN
 * into a local `audio_backup/` directory for offline archival (e.g. Google Drive).
 *
 * Saves two structures:
 *   1. `audio_backup/words/<Word>.mp3` — human-friendly filenames for browsing & Drive.
 *   2. `audio_backup/audio/<prefix>/<hash>.mp3` — content-addressed mirror of R2 bucket.
 *
 * Usage:
 *   node scripts/download_audio_backup.cjs
 */
const fs = require("fs");
const path = require("path");
const { loadEnv } = require("./lib/env.cjs");

loadEnv();

const ROOT = path.resolve(__dirname, "..");
const LEDGER_PATH = path.join(ROOT, "assets", "audio-ledger.json");
const CORPUS_PATH = path.join(ROOT, "scratch", "audio_corpus.json");
const BACKUP_DIR = path.join(ROOT, "audio_backup");

const CDN_BASE = process.env.VITE_ASSET_BASE_URL || "https://pub-e84a3f9882a141ac9f33296bbad85e2a.r2.dev";

async function downloadClip(url, destPath) {
  if (fs.existsSync(destPath)) {
    return false;
  }
  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error(`HTTP ${res.status} from ${url}`);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, buffer);
  return true;
}

async function main() {
  if (!fs.existsSync(LEDGER_PATH)) {
    throw new Error("No audio-ledger.json found.");
  }
  const ledger = JSON.parse(fs.readFileSync(LEDGER_PATH, "utf8"));
  const ledgerHashes = new Set(Object.keys(ledger.clips || {}));

  console.log(`Found ${ledgerHashes.size} clips recorded in audio ledger.`);

  let corpusMap = new Map();
  if (fs.existsSync(CORPUS_PATH)) {
    const corpus = JSON.parse(fs.readFileSync(CORPUS_PATH, "utf8"));
    for (const item of corpus) {
      if (item.hash) corpusMap.set(item.hash, item.text);
    }
  }

  let downloaded = 0;
  let skipped = 0;
  let errors = 0;

  const hashes = Array.from(ledgerHashes);
  const CONCURRENCY = 6;
  let cursor = 0;

  async function worker() {
    while (cursor < hashes.length) {
      const hash = hashes[cursor++];
      const prefix = hash.slice(0, 2);
      const cdnKey = `audio/${prefix}/${hash}.mp3`;
      const cdnUrl = `${CDN_BASE}/${cdnKey}`;
      const bucketDest = path.join(BACKUP_DIR, cdnKey);

      const wordText = corpusMap.get(hash);
      const wordDest = wordText
        ? path.join(BACKUP_DIR, "words", `${wordText.replace(/[\\/:*?"<>|]/g, "_")}.mp3`)
        : null;

      try {
        const fetched = await downloadClip(cdnUrl, bucketDest);
        if (wordDest && (!fs.existsSync(wordDest) || fetched)) {
          fs.mkdirSync(path.dirname(wordDest), { recursive: true });
          fs.copyFileSync(bucketDest, wordDest);
        }
        if (fetched) downloaded++;
        else skipped++;

        if ((downloaded + skipped) % 100 === 0 || downloaded + skipped === hashes.length) {
          console.log(`Progress: ${downloaded + skipped}/${hashes.length} (${downloaded} newly downloaded, ${skipped} already present)`);
        }
      } catch (err) {
        errors++;
        console.warn(`[!] Failed to download ${cdnKey}: ${err.message}`);
      }
    }
  }

  console.log(`\nBacking up clips to: ${BACKUP_DIR}`);
  console.log(`Starting download pool (concurrency: ${CONCURRENCY})...\n`);

  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  console.log("\n------------------------------------------");
  console.log("Backup Complete!");
  console.log(`- Newly downloaded: ${downloaded}`);
  console.log(`- Already cached:   ${skipped}`);
  console.log(`- Errors:           ${errors}`);
  console.log(`- Folder:           ${BACKUP_DIR}`);
  console.log("You can now copy the audio_backup folder directly to Google Drive!");
  console.log("------------------------------------------");
}

main().catch(console.error);
