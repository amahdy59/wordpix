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
 *   --include-new   also fetch units Figma has that the app does not
 *   --max-width N   downscale card artwork wider than this (default 1024)
 *   --scene-width N downscale scene artwork wider than this (default 1920)
 *   --quality N     AVIF quality (default 55)
 *
 * Images are skipped when a real file is already present, so an interrupted
 * run resumes cheaply. "Real" is decided by the file's magic bytes rather than
 * its size or its existence: the repo was once full of SVG placeholders saved
 * under an image extension, which both weaker checks happily treated as done.
 */

import { appendFile, mkdir, open, readFile, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { HEADER_BYTES, isRealArtwork } from "./lib/image-format.mjs";

const execFileAsync = promisify(execFile);

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FILE_KEY = process.env.FIGMA_FILE_KEY ?? "gRlyhrMavAHXUAT5brWFWu";
const TOKEN = process.env.FIGMA_TOKEN;
const API = "https://api.figma.com/v1";

/**
 * Figma's export API renders to png, jpg, svg or pdf only. Artwork is fetched
 * as png and converted locally.
 */
const FIGMA_EXPORT_FORMAT = "png";
/**
 * Figma renders at this multiple of the frame's design size.
 *
 * 4 is the API's maximum, and it is not enough on its own: a card frame is
 * 214px wide in the design, so even at 4 a render tops out at 856px against
 * the 1344 device pixels the exercise card wants. Measured at scale 3 the
 * cards came back 642x384.
 *
 * This is therefore the fallback path. Artwork normally comes from the
 * original uploaded fills instead — see resolveOriginalFills.
 */
const FIGMA_EXPORT_SCALE = 4;
/** Artwork is written in this format. Figma cannot export it, so sharp converts. */
const IMAGE_EXT = "avif";

/**
 * A frame is a content unit only if it holds this many cards.
 *
 * The file mixes vocabulary units with design-system, wireframe and flow
 * frames. Measured across the whole document the two populations do not
 * overlap: every frame matching an app unit carries at least 40 cards, while
 * every design frame carries 15 or fewer. Twenty sits in the gap.
 */
const MIN_CARDS_FOR_UNIT = 20;

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
  includeNew: has("--include-new"),
  debugPairing: has("--debug-pairing"),
  /**
   * 6 was fine when a card was a 33 KB render; originals are whole
   * photographs, and the bathroom run measured ~1.5s per image — about four
   * and a half hours across all 10,848, past the job timeout. The time is
   * almost all download latency rather than encoding, so more requests in
   * flight is the lever that matters.
   */
  concurrency: Number(valuesOf("--concurrency")[0] ?? 16),
  /**
   * The 480 this used to be was measured against the wrong element.
   *
   * It was sized for the 214x128 option tile, but the same file is also the
   * hero of every Context Fill and Quick Quiz question, where it fills a
   * 672 CSS px card — 1344 device pixels on a retina screen. Feeding 480 px
   * into that is a 2.8x upscale, and it looked exactly as soft as that
   * sounds.
   *
   * 1024 covers the card at 2x with a little room. It is affordable only
   * because the format changed with it: at AVIF q55 a card averages ~31 KB,
   * against ~67 KB for the same pixels as webp q88 — so full retina detail
   * costs ~0.5 GB across all 10,848 images where webp would have cost 1.1 GB
   * and blown through the 1 GB GitHub Pages limit.
   */
  maxWidth: Number(valuesOf("--max-width")[0] ?? 1024),
  // Scene illustrations are the full-width hero of a unit (912x400 in the
  // design), so they need a much higher cap than the cards.
  sceneWidth: Number(valuesOf("--scene-width")[0] ?? 1920),
  /**
   * AVIF quality. 55 is not comparable to a JPEG or webp 55 — AVIF's scale
   * runs lower for the same perceptual result, and 55 here sits between
   * webp 82 and webp 88 by eye while costing half the bytes.
   */
  quality: Number(valuesOf("--quality")[0] ?? 55),
  /**
   * Commit and push after this many units, so a run that dies keeps what it
   * already fetched.
   *
   * Every failure in this import so far has cost the whole run: a cancel at
   * 245 minutes and a socket error at 79 both threw away everything, because
   * the branch was only pushed once the sync had finished. With checkpoints a
   * re-run skips what is already real on the branch and continues.
   */
  checkpointEvery: Number(valuesOf("--checkpoint-every")[0] ?? 0),
  /** Fetch one image, report its real size, and stop. */
  probe: has("--probe"),
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

/**
 * Maps a Figma frame name onto the unit id the app already uses.
 *
 * Figma has moved on since the app was generated, so the two sides disagree
 * about names in ways that are cosmetic but fatal to an image import: Figma
 * writes "Tech & Gadgets" where the app has `tech-gadgets`, and prefixes some
 * frames with a level ("l5-hospital"). Writing artwork under the Figma name
 * would fill directories `lessons.ts` never reads — the unit would still show
 * placeholders, with the download paid for anyway.
 *
 * Canonicalising both sides to letters and digits, minus a leading article,
 * a level prefix and the word "and", matches 181 of the app's 182 units.
 */
function canonicalKey(value) {
  return value
    .toLowerCase()
    .replace(/^the[\s-]+/, "")
    .replace(/^l\d+[\s-]+/, "")
    .replace(/\band\b/g, "")
    .replace(/[^a-z0-9]/g, "");
}

/** Unit ids registered in the app, read from the vocabulary data layer. */
async function readAppUnitIds() {
  try {
    const source = await readFile(join(ROOT, "src", "app", "data", "lessons.ts"), "utf8");
    const start = source.indexOf("export const COURSE_UNITS");
    if (start === -1) return new Map();
    const body = source.slice(start, source.indexOf("\nexport const COURSE_MODULES", start));
    const ids = [...body.matchAll(/^ {2}"?([a-zA-Z0-9_-]+)"?: \{/gm)].map((m) => m[1]);
    return new Map(ids.map((id) => [canonicalKey(id), id]));
  } catch {
    return new Map();
  }
}

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
  // Pairing is by document order, deliberately.
  //
  // Geometry looked like the more robust choice, so it was tried: a materials
  // frame belongs to the nearest unit frame to its left that it overlaps
  // vertically. That collapsed detection from 99 units to 2, and the debug
  // output shows why — every "Learning Materials" frame reports the same
  // origin (x=1000, y=0), stacked rather than laid out beside its unit. There
  // is no spatial relationship to exploit, so position cannot pair them.
  //
  // Document order can: a materials frame follows the unit it belongs to.
  // The one improvement kept from the attempt is loose name matching, so a
  // frame named "Learning Materials " or "📚 Learning Materials" still pairs.
  const isMaterials = (frame) => /learning\s*materials?/i.test(frame.name);

  const units = [];
  for (const frame of pageChildren) {
    if (frame.type !== "FRAME") continue;
    if (isMaterials(frame)) {
      if (units.length) units[units.length - 1].materialsNode = frame;
      continue;
    }
    units.push({
      id: slug(frame.name.replace(/^the\s+/i, "")),
      name: frame.name,
      unitNode: frame,
    });
  }

  if (OPTS.debugPairing) {
    const paired = units.filter((u) => u.materialsNode).length;
    const total = pageChildren.filter((f) => f.type === "FRAME" && isMaterials(f)).length;
    console.log(`PAIRING: ${units.length} unit frame(s), ${total} materials frame(s), ${paired} paired`);
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
      cards.push({
        kind: "card",
        id,
        label,
        ipa,
        cefr,
        imageNodeId: image?.id,
        // The photograph as uploaded, before Figma scaled it into a 214px
        // card. See resolveOriginalFills for why this is worth having.
        imageRef: (image?.fills ?? []).find((f) => f.type === "IMAGE" && f.imageRef)?.imageRef,
      });
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
    const { buffer, bytesRead } = await handle.read(Buffer.alloc(HEADER_BYTES), 0, HEADER_BYTES, 0);
    if (bytesRead < 12) return true;
    return !isRealArtwork(buffer.subarray(0, bytesRead));
  } catch {
    return true; // missing counts as "needs downloading"
  } finally {
    await handle?.close();
  }
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

async function toAvif(pngBuffer, maxWidth) {
  const sharp = await loadSharp();
  return sharp(pngBuffer)
    .resize({ width: maxWidth, withoutEnlargement: true })
    // effort 4 is sharp's default. Higher squeezes out a few more percent but
    // costs seconds per image, and this encodes ten thousand of them.
    .avif({ quality: OPTS.quality, effort: 4 })
    .toBuffer();
}

/**
 * Maps every image fill in the file to the original file the designer uploaded.
 *
 * Rendering a node caps out well below what the artwork actually contains. A
 * card frame is 214px wide in the design and Figma's render scale stops at 4,
 * so the best a node render can give is 856px — measured at scale 3 the cards
 * came back 642x384, which is still short of the 1344 device pixels the
 * exercise card wants on a retina screen.
 *
 * The uploaded photographs are much larger than the box they were placed in.
 * This endpoint hands them over at full size, so the only limit left is the
 * one we choose.
 *
 * The trade is framing: an original is uncropped, where a node render bakes in
 * whatever crop the fill's transform applies. Every surface in the app draws
 * these with `object-cover`, so the final framing is the app's decision either
 * way — and detail that was never downloaded cannot be recovered later.
 *
 * Returns an empty map on failure; callers fall back to rendering the node.
 */
let originalFillsCache;
async function resolveOriginalFills() {
  if (originalFillsCache) return originalFillsCache;
  try {
    const { meta, err } = await api(`/files/${FILE_KEY}/images`);
    if (err) throw new Error(err);
    originalFillsCache = new Map(Object.entries(meta?.images ?? {}));
    console.log(`  original image fills available: ${originalFillsCache.size}`);
  } catch (error) {
    console.warn(`  ! could not list original image fills (${error.message}); rendering nodes instead`);
    originalFillsCache = new Map();
  }
  return originalFillsCache;
}

/**
 * Downloads one image, retrying the failures that are worth retrying.
 *
 * `fetch` rejects rather than resolving when the socket itself fails — a reset
 * connection, a DNS blip, a TLS error. That rejection used to propagate
 * straight out of the worker pool and end the process: batch 1 of the AVIF
 * import died on its 27th unit with nothing but "fetch failed", throwing away
 * 26 units of completed downloads because none of it had been pushed yet.
 *
 * One flaky image out of ten thousand must cost that image, not the run. So a
 * transport error and a 5xx are retried with backoff, and anything still
 * failing after that returns null for the caller to count as skipped. A 4xx is
 * not retried: an expired or malformed URL will not fix itself, and the caller
 * has a fallback URL to try instead.
 */
async function downloadImage(url, { retries = 3 } = {}) {
  for (let attempt = 0; ; attempt++) {
    let res;
    try {
      res = await fetch(url);
    } catch (error) {
      if (attempt >= retries) throw new Error(`network: ${error.message}`);
      await new Promise((r) => setTimeout(r, 500 * 2 ** attempt));
      continue;
    }

    if (res.ok) {
      try {
        return Buffer.from(await res.arrayBuffer());
      } catch (error) {
        // The body can still die mid-stream after a 200.
        if (attempt >= retries) throw new Error(`body: ${error.message}`);
        await new Promise((r) => setTimeout(r, 500 * 2 ** attempt));
        continue;
      }
    }

    if (res.status < 500 || attempt >= retries) throw new Error(`HTTP ${res.status}`);
    await new Promise((r) => setTimeout(r, 500 * 2 ** attempt));
  }
}

/**
 * Writes a line to the run's job summary as well as stdout.
 *
 * Job logs cannot be read while a job is still running — the REST endpoint
 * 404s until it completes — so a four-hour run was completely opaque: there
 * was no way to tell a job that was nearly done from one that was stuck, which
 * is exactly the question that matters when a timeout is approaching. The step
 * summary is readable live, so progress goes there too.
 */
async function report(line) {
  console.log(line);
  const summary = process.env.GITHUB_STEP_SUMMARY;
  if (!summary) return;
  try {
    await appendFile(summary, `${line}\n`);
  } catch {
    // Progress reporting must never be the thing that fails a run.
  }
}

/** Wall-clock progress with a rate and a projection, for timeout decisions. */
function progressLine(done, total, startedAt) {
  const elapsedMs = Date.now() - startedAt;
  const perUnit = elapsedMs / Math.max(done, 1);
  const remaining = ((total - done) * perUnit) / 60000;
  const mins = (elapsedMs / 60000).toFixed(1);
  return `  [${done}/${total} units · ${mins} min elapsed · ~${remaining.toFixed(0)} min left]`;
}

/**
 * Runs the checkpoint command, if one is configured.
 *
 * The command comes from the environment rather than being built here: this
 * script knows about Figma and images, not about git branches or CI, and
 * keeping the push out of it means the checkpoint can be tested by pointing
 * SYNC_CHECKPOINT_CMD at `echo`.
 */
async function checkpoint(label) {
  const command = process.env.SYNC_CHECKPOINT_CMD;
  if (!command) return;
  await report(`  · checkpoint after ${label}`);
  try {
    const { stdout, stderr } = await execFileAsync("bash", ["-lc", command], {
      maxBuffer: 8 * 1024 * 1024,
    });
    const tail = `${stdout}${stderr}`.trim().split("\n").slice(-3).join(" | ");
    if (tail) console.log(`    ${tail}`);
  } catch (error) {
    // A failed push must not lose the images still being fetched.
    console.warn(`    ! checkpoint failed: ${error.message.split("\n")[0]}`);
  }
}

/**
 * Fetches a single image and reports what actually came back.
 *
 * The first AVIF import asked for 1024px and got 642, because a card frame is
 * 214px wide in Figma and the render scale caps at 4 — an assumption that cost
 * a full run to discover. One image answers the question in seconds, so check
 * before committing to ten thousand.
 */
async function probeUnit(unit, cards) {
  const card = cards.find((c) => c.kind === "card" && c.imageNodeId);
  if (!card) {
    await report(`  probe: ${unit.id} has no card with an image`);
    return;
  }

  const fills = await resolveOriginalFills();
  const originalUrl = card.imageRef ? fills.get(card.imageRef) : undefined;
  const { images } = await api(
    `/images/${FILE_KEY}?ids=${encodeURIComponent(card.imageNodeId)}` +
      `&format=${FIGMA_EXPORT_FORMAT}&scale=${FIGMA_EXPORT_SCALE}`
  );
  const renderUrl = images?.[card.imageNodeId];

  const sharp = await loadSharp();
  for (const [source, url] of [
    ["original fill", originalUrl],
    [`node render @${FIGMA_EXPORT_SCALE}x`, renderUrl],
  ]) {
    if (!url) {
      await report(`  probe ${source.padEnd(22)} unavailable`);
      continue;
    }
    try {
      const buf = await downloadImage(url);
      const meta = await sharp(buf).metadata();
      const encoded = await toAvif(buf, OPTS.maxWidth);
      const out = await sharp(encoded).metadata();
      await report(
        `  probe ${source.padEnd(22)} source ${meta.width}x${meta.height} → ` +
          `${out.width}x${out.height} ${IMAGE_EXT} q${OPTS.quality} ` +
          `(${(encoded.length / 1024).toFixed(1)} KB)`
      );
    } catch (error) {
      await report(`  probe ${source.padEnd(22)} failed: ${error.message}`);
    }
  }
  await report(
    `  probe: --max-width ${OPTS.maxWidth} is ` +
      `${OPTS.maxWidth > 0 ? "only reachable if a source above is at least that wide" : "unset"}`
  );
}

async function downloadImages(unit, cards) {
  const targets = [];
  for (const card of cards) {
    if (card.kind !== "card" || !card.imageNodeId) continue;
    const dest = join(ROOT, "public", "word-images", unit.id, `${card.id}.${IMAGE_EXT}`);
    if (!OPTS.force && !(await isPlaceholder(dest))) continue;
    targets.push({
      nodeId: card.imageNodeId,
      imageRef: card.imageRef,
      dest,
      label: `${unit.id}/${card.id}`,
      maxWidth: OPTS.maxWidth,
    });
  }

  const sceneNode = [...walk(unit.unitNode)].find(({ node }) => node.name === "asset")?.node;
  if (sceneNode) {
    const dest = join(ROOT, "public", "scene-images", `${unit.id}-hero.${IMAGE_EXT}`);
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
      `/images/${FILE_KEY}?ids=${encodeURIComponent(ids)}&format=${FIGMA_EXPORT_FORMAT}&scale=${FIGMA_EXPORT_SCALE}`
    );
    if (err) throw new Error(`image render failed: ${err}`);
    Object.assign(urls, images);
  }

  let downloaded = 0;
  let skipped = 0;
  const fills = await resolveOriginalFills();

  let fromOriginal = 0;
  await pooled(targets, OPTS.concurrency, async (t) => {
    // Prefer the uploaded photograph; fall back to the rendered node. A render
    // is capped by the 214px card frame, so it is the lower-detail option
    // whenever an original exists.
    const originalUrl = t.imageRef ? fills.get(t.imageRef) : undefined;
    const url = originalUrl ?? urls[t.nodeId];
    if (!url) {
      console.warn(`  ! no render for ${t.label} (empty frame in Figma?)`);
      skipped++;
      return;
    }
    let body;
    try {
      body = await downloadImage(url);
      if (body && originalUrl) fromOriginal++;
    } catch (error) {
      console.warn(`  ! ${t.label} → ${error.message}`);
      body = null;
    }

    // A stale or expired fill URL must not cost us the image entirely.
    if (!body && originalUrl && urls[t.nodeId]) {
      try {
        body = await downloadImage(urls[t.nodeId]);
      } catch (error) {
        console.warn(`  ! ${t.label} (render fallback) → ${error.message}`);
        body = null;
      }
    }

    if (!body) {
      skipped++;
      return;
    }

    let encoded;
    try {
      encoded = await toAvif(body, t.maxWidth);
    } catch (error) {
      console.warn(`  ! ${t.label} failed to encode → ${error.message}`);
      skipped++;
      return;
    }
    if (!isRealArtwork(encoded.subarray(0, HEADER_BYTES))) {
      console.warn(`  ! ${t.label} did not convert to ${IMAGE_EXT}, not written`);
      skipped++;
      return;
    }
    await mkdir(dirname(t.dest), { recursive: true });
    await writeFile(t.dest, encoded);
    downloaded++;
  });

  console.log(
    `  ${unit.id}: ${downloaded} downloaded (${fromOriginal} from original fills), ${skipped} skipped`
  );
  return { downloaded, skipped };
}

async function main() {
  console.log(`Reading Figma file ${FILE_KEY} …`);
  const file = await api(`/files/${FILE_KEY}`);
  const pages = file.document.children ?? [];
  const frames = pages.flatMap((p) => p.children ?? []);
  let units = pairFrames(frames);

  const appUnits = await readAppUnitIds();
  const discovered = units.length;

  // Drop design-system, wireframe and flow frames, then resolve each remaining
  // frame onto the app's own id so artwork lands where lessons.ts reads it.
  units = units.filter((u) => {
    const cardCount = collectCards(u.unitNode).filter((c) => c.kind === "card").length;
    u.cardCount = cardCount;
    return cardCount >= MIN_CARDS_FOR_UNIT;
  });

  const newUnits = [];
  for (const unit of units) {
    const appId = appUnits.get(canonicalKey(unit.id));
    if (appId) {
      unit.appId = appId;
      unit.id = appId;
    } else {
      newUnits.push(unit);
    }
  }

  if (!OPTS.includeNew && newUnits.length) {
    units = units.filter((u) => u.appId);
  }

  if (OPTS.units.length) units = units.filter((u) => OPTS.units.includes(u.id));

  console.log(
    `Discovered ${discovered} frame(s); ${units.length} unit(s) selected ` +
      `(${discovered - units.length} skipped as non-units, unmapped or filtered).`
  );
  if (newUnits.length) {
    console.log(
      `${newUnits.length} unit(s) exist in Figma but not in the app` +
        `${OPTS.includeNew ? " (included)" : " — skipped, pass --include-new to fetch them"}:`
    );
    for (const u of newUnits) console.log(`  ${u.id} (${u.cardCount} cards)`);
  }

  const totals = { downloaded: 0, skipped: 0, materials: 0 };

  const startedAt = Date.now();
  let unitsDone = 0;
  let sinceCheckpoint = 0;

  for (const unit of units) {
    const cards = collectCards(unit.unitNode);
    const cardCount = cards.filter((c) => c.kind === "card").length;
    const subtopics = cards.filter((c) => c.kind === "subtopic").map((c) => c.subtopic);
    await report(`\n${unit.name} — ${cardCount} cards, ${subtopics.length} sub-topics`);

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

    if (OPTS.probe) {
      await probeUnit(unit, cards);
      break;
    }

    if (OPTS.images) {
      const r = await downloadImages(unit, cards);
      totals.downloaded += r.downloaded;
      totals.skipped += r.skipped;
    }

    unitsDone++;
    sinceCheckpoint++;
    await report(progressLine(unitsDone, units.length, startedAt));

    if (OPTS.checkpointEvery > 0 && sinceCheckpoint >= OPTS.checkpointEvery) {
      sinceCheckpoint = 0;
      await checkpoint(`${unitsDone}/${units.length} units`);
    }
  }

  // Anything since the last checkpoint would otherwise die with the runner.
  if (OPTS.checkpointEvery > 0 && sinceCheckpoint > 0) {
    await checkpoint(`${unitsDone}/${units.length} units (final)`);
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
