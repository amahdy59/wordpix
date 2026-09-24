/**
 * Imports the 400 prepared Conversation vocabulary images from Figma to R2.
 *
 * Safety contract:
 * - Figma is read-only (GET).
 * - R2 uses HEAD and PUT only.
 * - Existing R2 objects are always skipped; there is no force/replace mode.
 * - Images are converted in memory and are never written into the repository.
 * - Audio files and audio metadata are never read or modified.
 */
const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");

loadEnv();

const ROOT = path.resolve(__dirname, "..");
const CATALOG_PATH = path.join(
  ROOT,
  "src",
  "app",
  "learning",
  "conversation",
  "conversationCatalog.json"
);
const FIGMA_FILE_KEY = "gRlyhrMavAHXUAT5brWFWu";
const FIGMA_NODE_ID = "1300:2187";
const EXPECTED_UNITS = 40;
const EXPECTED_IMAGES = 400;
const DRY_RUN = process.argv.includes("--dry-run");
const CONCURRENCY = 4;
const AUDIT_CONCURRENCY = 12;

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

function collectPreparedImages(node, output) {
  if (Array.isArray(node.fills)) {
    for (const fill of node.fills) {
      const match = /^U(\d{2})-(\d{2})\s+(.+)$/.exec(node.name ?? "");
      if (fill.type === "IMAGE" && match) {
        const unit = Number(match[1]);
        const slot = Number(match[2]);
        output.set(`${unit}-${slot}`, {
          unit,
          slot,
          term: match[3].trim(),
          imageRef: fill.imageRef,
          nodeId: node.id,
        });
      }
    }
  }
  for (const child of node.children ?? []) collectPreparedImages(child, output);
}

function createImportPlan(catalog, preparedImages) {
  if (catalog.length !== EXPECTED_UNITS) {
    throw new Error(`Expected ${EXPECTED_UNITS} Conversation units, found ${catalog.length}`);
  }
  if (preparedImages.size !== EXPECTED_IMAGES) {
    throw new Error(`Expected ${EXPECTED_IMAGES} named Figma images, found ${preparedImages.size}`);
  }

  const plan = [];
  for (const unit of catalog) {
    if (unit.languageBank.length !== 10) {
      throw new Error(`Unit ${unit.unitNumber} must contain exactly 10 vocabulary items`);
    }
    unit.languageBank.forEach((item, index) => {
      const slot = index + 1;
      const prepared = preparedImages.get(`${unit.unitNumber}-${slot}`);
      if (!prepared)
        throw new Error(`Missing Figma image for unit ${unit.unitNumber}, slot ${slot}`);
      if (
        prepared.term.toLocaleLowerCase("en-US") !== item.term.trim().toLocaleLowerCase("en-US")
      ) {
        throw new Error(
          `Term mismatch at unit ${unit.unitNumber}, slot ${slot}: catalog="${item.term}", Figma="${prepared.term}"`
        );
      }
      const unitSegment = String(unit.unitNumber).padStart(2, "0");
      const slotSegment = String(slot).padStart(2, "0");
      const key = `conversation/v1/images/unit-${unitSegment}/${slotSegment}-${slugify(item.term)}.webp`;
      plan.push({ ...prepared, item, key, imageSrc: `/${key}` });
    });
  }
  return plan;
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

  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const nodeResponse = await figmaGet(
    `/files/${FIGMA_FILE_KEY}/nodes?ids=${encodeURIComponent(FIGMA_NODE_ID)}`,
    figmaToken
  );
  const document = nodeResponse.nodes?.[FIGMA_NODE_ID]?.document;
  if (!document) throw new Error(`Figma node ${FIGMA_NODE_ID} was not returned`);

  const preparedImages = new Map();
  collectPreparedImages(document, preparedImages);
  const plan = createImportPlan(catalog, preparedImages);
  const r2 = createClient();

  const existence = await runPool(plan, AUDIT_CONCURRENCY, (item) => r2.exists(item.key));
  const pending = plan.filter((_, index) => !existence[index]);
  const existing = plan.length - pending.length;

  console.log(`prepared : ${plan.length}`);
  console.log(`existing : ${existing}`);
  console.log(`pending  : ${pending.length}`);
  console.log("policy   : skip existing; never overwrite; never delete");
  if (DRY_RUN) {
    console.log("\n--dry-run: no images downloaded, uploaded, or changed.");
    return;
  }

  const refs = [...new Set(pending.map((item) => item.imageRef))];
  const imageResponse = await figmaGet(`/files/${FIGMA_FILE_KEY}/images`, figmaToken);
  const imageUrls = imageResponse.meta?.images ?? {};
  for (const ref of refs) {
    if (!imageUrls[ref]) throw new Error(`Figma did not provide a source URL for image ${ref}`);
  }

  let cursor = 0;
  let uploaded = 0;
  let skippedDuringUpload = 0;
  async function worker() {
    while (cursor < pending.length) {
      const item = pending[cursor++];
      // Repeat HEAD immediately before PUT so a concurrent import cannot be overwritten.
      if (await r2.exists(item.key)) {
        skippedDuringUpload += 1;
        continue;
      }
      const response = await fetch(imageUrls[item.imageRef]);
      if (!response.ok)
        throw new Error(`Image download failed (${response.status}) for ${item.key}`);
      const source = Buffer.from(await response.arrayBuffer());
      if (source.length === 0) throw new Error(`Figma returned an empty image for ${item.key}`);
      const webp = await sharp(source)
        .rotate()
        .resize({ width: 1200, height: 900, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 88, effort: 5 })
        .toBuffer();
      if (webp.length === 0) throw new Error(`WebP conversion returned no data for ${item.key}`);
      await r2.put(item.key, webp, {
        contentType: "image/webp",
        immutable: true,
      });
      uploaded += 1;
      if ((uploaded + skippedDuringUpload) % 25 === 0) {
        console.log(`processed ${uploaded + skippedDuringUpload}/${pending.length}`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

  // Every planned object must exist before the application catalog is changed.
  const verified = await runPool(plan, AUDIT_CONCURRENCY, (item) => r2.exists(item.key));
  for (const [index, item] of plan.entries()) {
    if (!verified[index]) throw new Error(`R2 verification failed for ${item.key}`);
    item.item.imageSrc = item.imageSrc;
  }
  fs.writeFileSync(CATALOG_PATH, `${JSON.stringify(catalog, null, 2)}\n`);
  console.log(`\nuploaded : ${uploaded}`);
  console.log(`skipped  : ${existing + skippedDuringUpload}`);
  console.log(`catalog  : ${plan.length} imageSrc values updated`);
}

main().catch((error) => {
  console.error(`\nConversation image import failed: ${error.message}`);
  process.exitCode = 1;
});
