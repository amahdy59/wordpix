#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import readline from "node:readline";
import { createRequire } from "node:module";
import sharp from "sharp";

const require = createRequire(import.meta.url);
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");

loadEnv();

const token = process.env.FIGMA_TOKEN || process.env.Figma_token || process.env.Figma_token_download;
if (!token) throw new Error("Configured Figma token missing from environment");

const FILE_KEY = "BVURolbmrORDIa286I9m8q";
const NODE_ID = "9:2";

// Command line flags
const DRY_RUN = process.argv.includes("--dry-run");
const SKIP_UPLOAD = process.argv.includes("--skip-upload");
const limitArg = process.argv.indexOf("--limit");
const LIMIT = limitArg !== -1 ? parseInt(process.argv[limitArg + 1], 10) : Infinity;
const concurrencyArg = process.argv.indexOf("--concurrency");
const CONCURRENCY = concurrencyArg !== -1 ? parseInt(process.argv[concurrencyArg + 1], 10) : 6;

// Directories
const ROOT = path.resolve(".");
const WORK_DIR = path.join(ROOT, "output/figma-remaining");
const RAW_DIR = path.join(WORK_DIR, "raw");
const WEBP_DIR = path.join(WORK_DIR, "webp");
const PUBLIC_V2_DIR = path.join(ROOT, "public/question-images/v2");
const MEDIA_MANIFEST_PATH = path.join(ROOT, "src/app/generated/reviewedExactSentenceMedia.json");
const INVENTORY_PATH = path.join(ROOT, "docs/question-sentence-image-inventory.csv");

fs.mkdirSync(WORK_DIR, { recursive: true });
fs.mkdirSync(RAW_DIR, { recursive: true });
fs.mkdirSync(WEBP_DIR, { recursive: true });
fs.mkdirSync(PUBLIC_V2_DIR, { recursive: true });

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function retry(fn, maxAttempts = 5) {
  let lastErr;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt === maxAttempts - 1) break;
      await new Promise((r) => setTimeout(r, 300 * Math.pow(2, attempt)));
    }
  }
  throw lastErr;
}

async function loadInventory() {
  console.log("Loading question-sentence-image-inventory.csv...");
  const rl = readline.createInterface({
    input: fs.createReadStream(INVENTORY_PATH),
    crlfDelay: Infinity,
  });

  const bySentence = new Map();
  const byUnitWord = new Map();
  let rowCount = 0;

  for await (const line of rl) {
    rowCount++;
    if (rowCount === 1) continue;
    const match = line.match(/^"([^"]+)","([^"]+)","([^"]+)","([^"]+)","([^"]+)","([^"]+)","([^"]+)","([^"]*)"/);
    if (match) {
      const [, questionId, unitId, lessonId, wordId, word, stage, sentence, generationPrompt] = match;
      const item = { questionId, unitId, lessonId, wordId, word, stage, sentence, generationPrompt };
      const norm = sentence.trim().toLowerCase();
      if (!bySentence.has(norm)) bySentence.set(norm, []);
      bySentence.get(norm).push(item);

      const uwKey = `${unitId}:::${wordId}`;
      if (!byUnitWord.has(uwKey)) byUnitWord.set(uwKey, []);
      byUnitWord.get(uwKey).push(item);
    }
  }
  console.log(`Loaded ${rowCount - 1} inventory rows.`);
  return { bySentence, byUnitWord };
}

async function fetchFigmaData() {
  const cachePath = path.join(WORK_DIR, "node-9-2.json");
  if (fs.existsSync(cachePath)) {
    console.log("Using cached Figma Node 9:2 data...");
    return JSON.parse(fs.readFileSync(cachePath, "utf8"));
  }

  console.log(`Fetching Figma document tree for node ${NODE_ID}...`);
  const res = await retry(() =>
    fetch(`https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${NODE_ID}`, {
      headers: { "X-Figma-Token": token },
      signal: AbortSignal.timeout(180000),
    })
  );
  if (!res.ok) throw new Error(`Figma node fetch failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  fs.writeFileSync(cachePath, JSON.stringify(data));
  console.log("Figma Node 9:2 fetched and cached.");
  return data;
}

async function fetchImageUrls() {
  const cachePath = path.join(WORK_DIR, "image-urls.json");
  if (fs.existsSync(cachePath)) {
    console.log("Using cached Figma image URLs...");
    return JSON.parse(fs.readFileSync(cachePath, "utf8"));
  }

  console.log("Fetching Figma signed image fill URLs...");
  const res = await retry(() =>
    fetch(`https://api.figma.com/v1/files/${FILE_KEY}/images`, {
      headers: { "X-Figma-Token": token },
      signal: AbortSignal.timeout(180000),
    })
  );
  if (!res.ok) throw new Error(`Figma images endpoint failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  const urls = data.meta?.images || {};
  fs.writeFileSync(cachePath, JSON.stringify(urls));
  console.log(`Found ${Object.keys(urls).length} signed image fill URLs.`);
  return urls;
}

function extractCards(pageDocument) {
  const cards = [];

  function findCards(node, currentContext = {}) {
    if (node.type === "SECTION") {
      if (!currentContext.section) currentContext = { ...currentContext, section: node.name };
      else currentContext = { ...currentContext, subsection: node.name };
    }
    if (node.type === "FRAME" && node.name.includes("—")) {
      currentContext = { ...currentContext, frame: node.name };
    }

    if (node.children && node.children.length >= 2) {
      const imgChild = node.children.find((c) => c.fills?.some((f) => f.type === "IMAGE" && f.imageRef));
      const textChild = node.children.find((c) => c.children?.some((sc) => sc.type === "TEXT") || c.type === "TEXT");
      if (imgChild && textChild) {
        const fill = imgChild.fills.find((f) => f.type === "IMAGE" && f.imageRef);
        const textNodes = [];
        function getTexts(n) {
          if (n.type === "TEXT" && n.characters) textNodes.push(n.characters.trim());
          if (n.children) n.children.forEach(getTexts);
        }
        getTexts(textChild);

        if (fill && textNodes.length >= 2) {
          cards.push({
            ...currentContext,
            nodeId: node.id,
            imageRef: fill.imageRef,
            word: textNodes[0],
            sentence: textNodes[1],
            jobText: textNodes[2] || "",
          });
          return;
        }
      }
    }
    if (node.children) {
      for (const child of node.children) findCards(child, currentContext);
    }
  }

  findCards(pageDocument);
  return cards;
}

function resolveCardMetadata(card, inventory) {
  const norm = card.sentence.trim().toLowerCase();
  const bySentence = inventory.bySentence.get(norm);
  let inv = bySentence ? bySentence[0] : null;

  if (!inv) {
    const subClean = (card.subsection || "").replace(/·.*$/, "").trim();
    const unitSlug = slugify(subClean);
    const wordSlug = slugify(card.word);
    const uwInv = inventory.byUnitWord.get(`${unitSlug}:::${wordSlug}`);
    if (uwInv && uwInv.length > 0) inv = uwInv[0];
  }

  const wordId = inv?.wordId || slugify(card.word);
  const lessonId = inv?.lessonId || slugify(card.frame || card.subsection || "lesson-1");

  // Derive job hash suffix (e.g. 6a8a6a0e2d)
  let jobSuffix = "";
  if (card.jobText) {
    const jobMatch = card.jobText.match(/sentence-job-([a-f0-9]{10})/i);
    if (jobMatch) {
      jobSuffix = jobMatch[1].toLowerCase();
    } else {
      jobSuffix = crypto.createHash("sha256").update(card.jobText).digest("hex").slice(0, 10);
    }
  } else {
    jobSuffix = crypto.createHash("sha256").update(`${wordId}:${card.sentence}`).digest("hex").slice(0, 10);
  }

  const folderName = `sentence-${lessonId}-${wordId}-${jobSuffix}`;
  const imageAlt = inv?.generationPrompt
    ? card.sentence
    : `${card.sentence}. Educational illustration depicting ${card.word}.`;

  return {
    wordId,
    lessonId,
    folderName,
    sentence: card.sentence,
    word: card.word,
    imageAlt,
    imageRef: card.imageRef,
  };
}

async function main() {
  console.log("=== WordPix Figma Remaining Images Synchronizer ===");
  console.log(`Mode: ${DRY_RUN ? "DRY-RUN (no changes will be written)" : "LIVE EXECUTION"}`);

  const inventory = await loadInventory();
  const figmaData = await fetchFigmaData();
  const pageDoc = figmaData.nodes[NODE_ID]?.document;
  if (!pageDoc) throw new Error("Node 9:2 document missing in Figma data");

  const allCards = extractCards(pageDoc);
  console.log(`Extracted ${allCards.length} visual cards from Node 9:2.`);

  const cardsToProcess = LIMIT < allCards.length ? allCards.slice(0, LIMIT) : allCards;
  console.log(`Processing ${cardsToProcess.length} cards (Concurrency: ${CONCURRENCY})...`);

  const imageUrls = await fetchImageUrls();

  // Read existing media manifest
  let existingMedia = {};
  if (fs.existsSync(MEDIA_MANIFEST_PATH)) {
    existingMedia = JSON.parse(fs.readFileSync(MEDIA_MANIFEST_PATH, "utf8"));
  }
  const priorKeyCount = Object.keys(existingMedia).length;
  console.log(`Existing reviewedExactSentenceMedia entries: ${priorKeyCount}`);

  // Deduplicate by folderName
  const resolvedCards = new Map();
  for (const card of cardsToProcess) {
    const meta = resolveCardMetadata(card, inventory);
    if (!resolvedCards.has(meta.folderName)) {
      resolvedCards.set(meta.folderName, meta);
    }
  }
  console.log(`Unique items to process: ${resolvedCards.size}`);

  const r2 = (!DRY_RUN && !SKIP_UPLOAD) ? createClient() : null;
  if (r2) {
    console.log("Verifying R2 connection...");
    await r2.verify();
    console.log("R2 bucket verified successfully.");
  }

  let downloadedCount = 0;
  let rawCacheHitCount = 0;
  let convertedCount = 0;
  let webpCacheHitCount = 0;
  let uploadedCount = 0;
  let r2AlreadyPresentCount = 0;
  let newlyLinkedCount = 0;

  const entriesArray = Array.from(resolvedCards.values());
  let cursor = 0;
  const newManifestEntries = {};

  async function worker(workerId) {
    while (cursor < entriesArray.length) {
      const item = entriesArray[cursor++];
      const downloadUrl = imageUrls[item.imageRef];
      if (!downloadUrl) {
        console.warn(`[Worker ${workerId}] No download URL found for imageRef ${item.imageRef} (${item.folderName})`);
        continue;
      }

      const rawPath = path.join(RAW_DIR, `${item.imageRef}.png`);
      let rawBuffer;

      // 1. Download raw image
      if (fs.existsSync(rawPath) && fs.statSync(rawPath).size > 0) {
        rawBuffer = fs.readFileSync(rawPath);
        rawCacheHitCount++;
      } else {
        if (!DRY_RUN) {
          try {
            const resp = await retry(() => fetch(downloadUrl, { signal: AbortSignal.timeout(60000) }));
            if (!resp.ok) throw new Error(`Download HTTP ${resp.status}`);
            rawBuffer = Buffer.from(await resp.arrayBuffer());
            fs.writeFileSync(rawPath, rawBuffer);
            downloadedCount++;
          } catch (err) {
            console.error(`[Worker ${workerId}] Failed to download ${item.imageRef}: ${err.message}`);
            continue;
          }
        } else {
          downloadedCount++;
        }
      }

      // 2. Convert to WebP & calculate SHA256
      let webpBuffer;
      let sha256;

      if (!DRY_RUN && rawBuffer) {
        try {
          webpBuffer = await sharp(rawBuffer)
            .webp({ quality: 80, effort: 4 })
            .toBuffer();
          sha256 = crypto.createHash("sha256").update(webpBuffer).digest("hex");
          convertedCount++;
        } catch (err) {
          console.error(`[Worker ${workerId}] Sharp conversion failed for ${item.folderName}: ${err.message}`);
          continue;
        }
      } else {
        // In dry run, simulate hash
        sha256 = crypto.createHash("sha256").update(item.folderName).digest("hex");
        convertedCount++;
      }

      const relPath = `question-images/v2/${item.folderName}/${sha256}.webp`;
      const localFolder = path.join(PUBLIC_V2_DIR, item.folderName);
      const localWebpPath = path.join(localFolder, `${sha256}.webp`);
      const backupWebpFolder = path.join(WEBP_DIR, item.folderName);
      const backupWebpPath = path.join(backupWebpFolder, `${sha256}.webp`);

      if (!DRY_RUN && webpBuffer) {
        fs.mkdirSync(localFolder, { recursive: true });
        fs.writeFileSync(localWebpPath, webpBuffer);
        fs.mkdirSync(backupWebpFolder, { recursive: true });
        fs.writeFileSync(backupWebpPath, webpBuffer);
      }

      // 3. Upload to R2 (strictly additive, no delete, skip if exists)
      if (r2 && !DRY_RUN && webpBuffer) {
        try {
          const exists = await retry(() => r2.exists(relPath));
          if (exists) {
            r2AlreadyPresentCount++;
          } else {
            await retry(() => r2.put(relPath, webpBuffer, { contentType: "image/webp" }));
            uploadedCount++;
          }
        } catch (err) {
          console.error(`[Worker ${workerId}] R2 upload failed for ${relPath}: ${err.message}`);
        }
      } else if (DRY_RUN) {
        uploadedCount++;
      }

      // 4. Record manifest entry
      newManifestEntries[item.folderName] = {
        wordId: item.wordId,
        sentence: item.sentence,
        imagePath: relPath,
        imageAlt: item.imageAlt,
      };
      newlyLinkedCount++;

      const processed = downloadedCount + rawCacheHitCount;
      if (processed % 50 === 0 || cursor === entriesArray.length) {
        console.log(`[Progress] ${cursor}/${entriesArray.length} items processed (Downloaded: ${downloadedCount}, Converted: ${convertedCount}, R2 Uploaded: ${uploadedCount}, Already R2: ${r2AlreadyPresentCount})`);
      }
    }
  }

  console.log(`Starting ${CONCURRENCY} concurrent workers...`);
  await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(i + 1)));

  // Write updated manifest
  if (!DRY_RUN) {
    const updatedMedia = {
      ...existingMedia,
      ...newManifestEntries,
    };
    fs.writeFileSync(MEDIA_MANIFEST_PATH, JSON.stringify(updatedMedia, null, 2) + "\n");
    console.log(`Updated ${MEDIA_MANIFEST_PATH}. Total entries: ${Object.keys(updatedMedia).length} (added ${Object.keys(newManifestEntries).length})`);

    const receiptPath = path.join(WORK_DIR, "sync-receipt.json");
    fs.writeFileSync(
      receiptPath,
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          totalProcessed: entriesArray.length,
          downloadedCount,
          rawCacheHitCount,
          convertedCount,
          uploadedCount,
          r2AlreadyPresentCount,
          newlyLinkedCount,
          priorKeyCount,
          finalKeyCount: Object.keys(updatedMedia).length,
        },
        null,
        2
      )
    );
    console.log(`Saved execution receipt to ${receiptPath}`);
  }

  console.log("\n=== Execution Summary ===");
  console.log(`- Mode: ${DRY_RUN ? "DRY RUN" : "LIVE"}`);
  console.log(`- Total target items: ${entriesArray.length}`);
  console.log(`- Raw downloaded: ${downloadedCount} (Cached: ${rawCacheHitCount})`);
  console.log(`- WebP converted: ${convertedCount}`);
  console.log(`- R2 uploaded: ${uploadedCount} (Already present: ${r2AlreadyPresentCount})`);
  console.log(`- App entries linked: ${newlyLinkedCount}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exitCode = 1;
});
