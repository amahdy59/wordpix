#!/usr/bin/env node
/**
 * Pulls WordPix content out of Figma and writes it into the repo.
 *
 * Run this on a machine with direct internet access. It cannot run in CI or in
 * a Claude Code web session: those environments' egress policies refuse
 * figma.com, so every request fails with a 403 on CONNECT.
 *
 *   FIGMA_TOKEN=figd_xxx node scripts/figma-sync.mjs --images
 *   FIGMA_TOKEN=figd_xxx node scripts/figma-sync.mjs --content
 *
 * Flags
 *   --images        download card + scene artwork into public/
 *   --content       dump unit/learning-material JSON into figma-dump/
 *   --unit <id>     restrict to one unit (repeatable), e.g. --unit bathroom
 *   --force         re-download assets that already exist locally
 *   --dry-run       report what would happen, write nothing
 *   --concurrency N parallel downloads (default 6)
 *   --max-width N   downscale card artwork wider than this (default 480)
 *   --scene-width N downscale scene artwork wider than this (default 1600)
 *
 * Images are skipped when a real file is already present, so an interrupted
 * run resumes cheaply. "Real" means larger than PLACEHOLDER_MAX_BYTES — the
 * repo is currently full of ~1.4 KB generated placeholder tiles that a plain
 * existence check would happily treat as done.
 */

import { mkdir, open, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FILE_KEY = process.env.FIGMA_FILE_KEY ?? "gRlyhrMavAHXUAT5brWFWu";
const TOKEN = process.env.FIGMA_TOKEN;
const API = "https://api.figma.com/v1";

/**
 * Figma's export API renders to png, jpg, svg or pdf — there is no webp
 * option. Artwork is fetched as png and converted locally, so the filenames
 * the vocabulary data already points at keep working.
 */
const FIGMA_EXPORT_FORMAT = "png";

const args = process.argv.slice(2);
const has = (flag) => args.includes(flag);
const valuesOf = (flag) =>
  args.reduce((acc, a, i) => (a === flag && args[i + 1] ? [...acc, args[i + 1]] : acc), []);

const OPTS = {
  images: has("--images"),
  content: has("--content"),
  force: has("--force"),
  dryRun: has("--dry-run"),
  units: valuesOf("--unit"),
  concurrency: Number(valuesOf("--concurrency")[0] ?? 6),
  // Cards render at 214x128 CSS, so 480 covers a 2x display with room to
  // spare. Measured on real artwork: 480 averages ~33 KB per card against
  // ~136 KB at the 1024 the earlier imports used, which is the difference
  // between roughly 0.36 GB and 1.5 GB across all 10,848 images.
  maxWidth: Number(valuesOf("--max-width")[0] ?? 480),
  // Scene illustrations are the full-width hero of a unit (912x400 in the
  // design), so they need a much higher cap than the cards.
  sceneWidth: Number(valuesOf("--scene-width")[0] ?? 1600),
};

if (!OPTS.images && !OPTS.content) {
  console.error("Nothing to do: pass --images, --content, or both.");
  process.exit(2);
}
if (!TOKEN) {
  console.error("FIGMA_TOKEN is not set. Create a personal access token in Figma settings.");
  process.exit(2);
}

/** Fetch with retry — Figma rate-limits hard on large files. */
async function api(path, { retries = 4 } = {}) {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`${API}${path}`, { headers: { "X-Figma-Token": TOKEN } });
    if (res.ok) return res.json();
    const retriable = res.status === 429 || res.status >= 500;
    if (!retriable || attempt >= retries) {
      throw new Error(`GET ${path} → ${res.status} ${res.statusText}`);
    }
    const waitMs = Number(res.headers.get("retry-after") ?? 0) * 1000 || 2000 * 2 ** attempt;
    console.warn(`  ${res.status} on ${path}; retrying in ${waitMs}ms`);
    await new Promise((r) => setTimeout(r, waitMs));
  }
}

/** Runs tasks with a bounded number in flight. */
async function pooled(items, limit, worker) {
  const queue = [...items];
  const results = [];
  const runners = Array.from({ length: Math.min(limit, queue.length) }, async () => {
    while (queue.length) {
      const item = queue.shift();
      results.push(await worker(item));
    }
  });
  await Promise.all(runners);
  return results;
}

const slug = (s) =>
  s.trim().toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Depth-first walk over a Figma node tree. */
function* walk(node, depth = 0) {
  yield { node, depth };
  for (const child of node.children ?? []) yield* walk(child, depth + 1);
}

const textOf = (node) => (node?.characters ?? node?.name ?? "").trim();

/**
 * Figma names each unit's top frame after the unit ("The Bathroom") and puts a
 * sibling "Learning Materials" frame beside it. Pair them by document order:
 * a Learning Materials frame belongs to the most recent unit frame before it.
 */
function pairFrames(pageChildren) {
  const units = [];
  for (const frame of pageChildren) {
    if (/^learning materials$/i.test(frame.name)) {
      if (units.length) units[units.length - 1].materialsNode = frame;
      continue;
    }
    if (frame.type !== "FRAME") continue;
    units.push({ id: slug(frame.name.replace(/^the\s+/i, "")), name: frame.name, unitNode: frame });
  }
  return units;
}

/** Card artwork: every `card-<slug>` frame's image rectangle. */
function collectCards(unitNode) {
  const cards = [];
  let subtopic = null;
  for (const { node } of walk(unitNode)) {
    if (node.name?.startsWith("topic-") && node.name !== "topic-header") {
      subtopic = { id: node.name.replace(/^topic-/, ""), title: null, wordIds: [] };
      cards.push({ kind: "subtopic", subtopic });
    }
    if (node.name === "topic-header" && subtopic && !subtopic.title) {
      const label = (node.children ?? [])[0];
      subtopic.title = textOf(label);
    }
    if (node.name?.startsWith("card-")) {
      const id = node.name.replace(/^card-/, "");
      const image = (node.children ?? []).find((c) => c.type === "RECTANGLE" || c.type === "ROUNDED_RECTANGLE" || /image|^img$/i.test(c.name));
      const lbl = (node.children ?? []).find((c) => c.name === "lbl");
      const [label, ipa, cefr] = (lbl?.children ?? []).map(textOf);
      if (subtopic) subtopic.wordIds.push(id);
      cards.push({ kind: "card", id, label, ipa, cefr, imageNodeId: image?.id });
    }
  }
  return cards;
}

/** The eight learning-material blocks, keyed by their Figma frame names. */
function collectMaterials(materialsNode) {
  if (!materialsNode) return null;
  const blocks = {};
  for (const child of materialsNode.children ?? []) {
    const contentFrame = (child.children ?? []).find((c) => c.name === "content") ?? child;
    const lines = [];
    for (const { node, depth } of walk(contentFrame)) {
      if (node.type === "TEXT") lines.push({ text: textOf(node), depth, name: node.name });
    }
    blocks[child.name] = { nodeId: child.id, lines };
  }
  return blocks;
}

/**
 * True when the file is not real raster artwork.
 *
 * Size was the wrong test. The repository is full of files named `.webp` whose
 * contents are SVG — a letter on a gradient — so they are placeholders no
 * matter how many bytes they happen to occupy. Reading the magic bytes
 * identifies them exactly: real artwork is a RIFF/WEBP container.
 */
async function isPlaceholder(path) {
  let handle;
  try {
    handle = await open(path, "r");
    const { buffer, bytesRead } = await handle.read(Buffer.alloc(12), 0, 12, 0);
    if (bytesRead < 12) return true;
    return !isRealWebp(buffer);
  } catch {
    return true; // missing counts as "needs downloading"
  } finally {
    await handle?.close();
  }
}

function isRealWebp(buffer) {
  return (
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  );
}

/**
 * sharp is loaded lazily and only when artwork is actually being written, so
 * `--content` and `--dry-run` runs need no native dependency at all.
 */
let sharpModule;
async function loadSharp() {
  if (sharpModule) return sharpModule;
  try {
    sharpModule = (await import("sharp")).default;
  } catch {
    throw new Error(
      "sharp is required to convert Figma's png exports to webp.\n" +
        "Install it first:  pnpm add -D sharp"
    );
  }
  return sharpModule;
}

async function toWebp(pngBuffer, maxWidth) {
  const sharp = await loadSharp();
  return sharp(pngBuffer)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
}

async function downloadImages(unit, cards) {
  const targets = [];
  for (const card of cards) {
    if (card.kind !== "card" || !card.imageNodeId) continue;
    const dest = join(ROOT, "public", "word-images", unit.id, `${card.id}.webp`);
    if (!OPTS.force && !(await isPlaceholder(dest))) continue;
    targets.push({
      nodeId: card.imageNodeId,
      dest,
      label: `${unit.id}/${card.id}`,
      maxWidth: OPTS.maxWidth,
    });
  }

  const sceneNode = [...walk(unit.unitNode)].find(({ node }) => node.name === "asset")?.node;
  if (sceneNode) {
    const dest = join(ROOT, "public", "scene-images", `${unit.id}-hero.webp`);
    if (OPTS.force || (await isPlaceholder(dest))) {
      targets.push({
        nodeId: sceneNode.id,
        dest,
        label: `${unit.id}/scene`,
        maxWidth: OPTS.sceneWidth,
      });
    }
  }

  if (!targets.length) {
    console.log(`  ${unit.id}: images already present`);
    return { downloaded: 0, skipped: 0 };
  }
  if (OPTS.dryRun) {
    console.log(`  ${unit.id}: would download ${targets.length} images`);
    return { downloaded: 0, skipped: targets.length };
  }

  // /v1/images renders nodes to a URL. Batched — the query string is capped.
  const urls = {};
  for (let i = 0; i < targets.length; i += 40) {
    const batch = targets.slice(i, i + 40);
    const ids = batch.map((t) => t.nodeId).join(",");
    const { images, err } = await api(
      `/images/${FILE_KEY}?ids=${encodeURIComponent(ids)}&format=${FIGMA_EXPORT_FORMAT}&scale=2`
    );
    if (err) throw new Error(`image render failed: ${err}`);
    Object.assign(urls, images);
  }

  let downloaded = 0;
  let skipped = 0;
  await pooled(targets, OPTS.concurrency, async (t) => {
    const url = urls[t.nodeId];
    if (!url) {
      console.warn(`  ! no render for ${t.label} (empty frame in Figma?)`);
      skipped++;
      return;
    }
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`  ! ${t.label} → ${res.status}`);
      skipped++;
      return;
    }
    const rendered = Buffer.from(await res.arrayBuffer());
    const webp = await toWebp(rendered, t.maxWidth);
    if (!isRealWebp(webp)) {
      console.warn(`  ! ${t.label} did not convert to webp, not written`);
      skipped++;
      return;
    }
    await mkdir(dirname(t.dest), { recursive: true });
    await writeFile(t.dest, webp);
    downloaded++;
  });

  console.log(`  ${unit.id}: ${downloaded} downloaded, ${skipped} skipped`);
  return { downloaded, skipped };
}

async function main() {
  console.log(`Reading Figma file ${FILE_KEY} …`);
  const file = await api(`/files/${FILE_KEY}`);
  const pages = file.document.children ?? [];
  const frames = pages.flatMap((p) => p.children ?? []);
  let units = pairFrames(frames);

  if (OPTS.units.length) units = units.filter((u) => OPTS.units.includes(u.id));
  console.log(`Found ${units.length} unit frame(s).`);

  const totals = { downloaded: 0, skipped: 0, materials: 0 };

  for (const unit of units) {
    const cards = collectCards(unit.unitNode);
    const cardCount = cards.filter((c) => c.kind === "card").length;
    const subtopics = cards.filter((c) => c.kind === "subtopic").map((c) => c.subtopic);
    console.log(`\n${unit.name} — ${cardCount} cards, ${subtopics.length} sub-topics`);

    if (OPTS.content) {
      const payload = {
        unitId: unit.id,
        name: unit.name,
        subtopics,
        cards: cards.filter((c) => c.kind === "card"),
        materials: collectMaterials(unit.materialsNode),
      };
      const dest = join(ROOT, "figma-dump", `${unit.id}.json`);
      if (OPTS.dryRun) {
        console.log(`  would write ${dest}`);
      } else {
        await mkdir(dirname(dest), { recursive: true });
        await writeFile(dest, `${JSON.stringify(payload, null, 2)}\n`);
      }
      if (!unit.materialsNode) console.warn(`  ! no Learning Materials frame for ${unit.id}`);
      else totals.materials++;
    }

    if (OPTS.images) {
      const r = await downloadImages(unit, cards);
      totals.downloaded += r.downloaded;
      totals.skipped += r.skipped;
    }
  }

  console.log(
    `\nDone. images: ${totals.downloaded} downloaded, ${totals.skipped} skipped; ` +
      `materials: ${totals.materials}/${units.length} units`
  );
  if (totals.skipped) console.log("Re-run to retry skipped items; add --force to redo existing ones.");
}

main().catch((err) => {
  console.error(`\nfigma-sync failed: ${err.message}`);
  process.exit(1);
});
