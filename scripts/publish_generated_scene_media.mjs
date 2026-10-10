import fs from "node:fs";
import path from "node:path";
import { parseEnv } from "node:util";
import { createRequire } from "node:module";
import sharp from "sharp";
import { sha256, assertCurrentScene } from "./generate_reviewed_scene_batch.mjs";
import { reviewedMediaEntry } from "./lib/reviewed_scene_media_entry.mjs";
const args = Object.fromEntries(
  process.argv
    .slice(2)
    .filter((a) => a.startsWith("--") && a.includes("="))
    .map((a) => {
      const i = a.indexOf("=");
      return [a.slice(2, i), a.slice(i + 1)];
    })
);
const reviews = JSON.parse(fs.readFileSync(args.review, "utf8")).items.filter(
  (r) => r.status === "approved"
);
if (!reviews.length || new Set(reviews.map((r) => r.sceneId)).size !== reviews.length)
  throw new Error("No approved images or duplicate identities.");
const manifestFile = "src/app/generated/reviewedGeneratedSceneMedia.json";
const manifest = JSON.parse(fs.readFileSync(manifestFile));
const legacy = Object.assign(
  {},
  ...["reviewedUsageIllustrations", "reviewedFigmaObjectScenes"].map((n) =>
    JSON.parse(fs.readFileSync(`src/app/generated/${n}.json`))
  ),
  JSON.parse(fs.readFileSync("src/app/generated/reviewedFigmaQuestionMedia.json")).scenes
);
const prepared = [];
for (const r of reviews) {
  if (!/^[a-z0-9-]+-usage-scene-\d+$/.test(r.sceneId) || !r.imageAlt?.trim())
    throw new Error("Invalid reviewed scene.");
  const lessonId = r.sceneId.replace(/-usage-scene-\d+$/, "");
  const currentScene = assertCurrentScene(
    { ...r, unitId: lessonId.replace(/-\d+$/, ""), lessonId },
    "."
  );
  if (currentScene.imagePath) throw new Error(`Preserving authored media mapping: ${r.sceneId}`);
  const bytes = fs.readFileSync(r.sourceFile),
    metadata = await sharp(bytes).metadata();
  if (
    sha256(bytes) !== r.sha256 ||
    bytes.length !== r.bytes ||
    metadata.format !== "webp" ||
    !metadata.width ||
    metadata.width < 512 ||
    !metadata.height ||
    metadata.height < 512
  )
    throw new Error(`Reviewed image changed: ${r.sceneId}`);
  const entry = reviewedMediaEntry(r, manifest, legacy);
  prepared.push({ r, bytes, entry });
}
if (!process.argv.includes("--upload"))
  console.log(
    JSON.stringify({
      approved: prepared.length,
      bytes: prepared.reduce((n, p) => n + p.bytes.length, 0),
      writes: 0,
    })
  );
else {
  const env = parseEnv(fs.readFileSync(args.env || ".env.local", "utf8"));
  const client = createRequire(import.meta.url)("./lib/r2.cjs").createClient(env);
  const base = env.VITE_ASSET_BASE_URL?.replace(/\/+$/, "");
  if (!base || new URL(base).protocol !== "https:")
    throw new Error("An HTTPS media base is required.");
  const receipt = [];
  const receiptFile = args.receipt || "output/generated-media-publication/receipt.json";
  fs.mkdirSync(path.dirname(receiptFile), { recursive: true });
  for (const { r, bytes, entry } of prepared) {
    const created = await client.putIfAbsent(entry.imagePath, bytes, { contentType: "image/webp" });
    const remote = await client.get(entry.imagePath);
    if (!remote?.equals(bytes)) throw new Error(`Remote byte verification failed: ${r.sceneId}`);
    const response = await fetch(`${base}/${entry.imagePath}`, {
      signal: AbortSignal.timeout(30000),
    });
    if (
      !response.ok ||
      response.headers.get("content-type")?.split(";")[0] !== "image/webp" ||
      !Buffer.from(await response.arrayBuffer()).equals(bytes)
    )
      throw new Error(`Public media verification failed: ${r.sceneId}`);
    manifest[r.sceneId] = entry;
    fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + "\n");
    receipt.push({
      sceneId: r.sceneId,
      imagePath: entry.imagePath,
      sha256: r.sha256,
      bytes: bytes.length,
      created,
      verified: true,
    });
    fs.writeFileSync(receiptFile, JSON.stringify(receipt, null, 2));
    console.log(`Verified new media: ${r.sceneId}`);
  }
  console.log(JSON.stringify({ verified: receipt.length, existingMappingsPreserved: true }));
}
