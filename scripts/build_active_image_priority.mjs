/** Local technical triage + bounded public GET evidence. Never changes runtime assignments. */
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { objectKey } from "./lib/media_catalog.mjs";

const args = process.argv.slice(2);
if (args.length !== 1 || !args[0].startsWith("--source-root="))
  throw Error(
    "Use --source-root=<checkout containing the read-only media catalog and local copies>"
  );
const sourceRoot = path.resolve(args[0].slice(14));
const read = async (file) => JSON.parse(await fs.readFile(file, "utf8"));
const catalog = await read(path.join(sourceRoot, "output/media-catalog/catalog.json"));
const demands = (await read("output/media-catalog/demands.json")).demands;
const previous = await read("docs/media/image-checkup-reviews.json");
const byKey = new Map();
for (const row of demands) {
  const key = objectKey(row.resolvedUrl);
  if (key) byKey.set(key, [...(byKey.get(key) ?? []), row]);
}
const health = (await read(path.join(sourceRoot, "output/image-quality/local-image-health.json")))
  .local;
const byFile = new Map(health.map((row) => [row.file, row]));
const queue = [];
for (const asset of catalog.assets) {
  const uses = byKey.get(asset.key);
  if (asset.kind !== "image" || !uses) continue;
  const copies = asset.localPaths.map((file) => byFile.get(file)).filter(Boolean);
  const copy = copies.filter((row) => row.flags.length).sort((a, b) => b.bytes - a.bytes)[0];
  if (!copy) continue;
  queue.push({
    key: asset.key,
    bytes: copy.bytes,
    width: copy.width,
    height: copy.height,
    flags: copy.flags,
    localFile: copy.file,
    useCount: uses.length,
    uses,
  });
}
queue.sort((a, b) => b.bytes - a.bytes || a.key.localeCompare(b.key));
const output = "output/image-quality/active-priority";
await fs.mkdir(output, { recursive: true });
await fs.writeFile(
  `${output}/queue.json`,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      scope:
        "Current vocabulary, sentence and scene resolver; specialist-course artwork requires a separate audit. Technical flags do not approve regeneration.",
      assets: queue,
    },
    null,
    2
  ) + "\n"
);
const reviewed = new Set(previous.proposals.map((row) => objectKey(row.url)));
const sample = queue.filter((row) => !reviewed.has(row.key));
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
const evidence = [];
let cursor = 0;
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (cursor < sample.length) {
      const index = cursor++;
      const row = sample[index];
      const resolved = row.uses[0].resolvedUrl;
      const local = await fs.readFile(path.join(sourceRoot, row.localFile));
      const remote = /^https?:\/\//.test(resolved);
      const response = remote
        ? await fetch(resolved, { signal: AbortSignal.timeout(30000) })
        : null;
      if (response && !response.ok) throw Error(`Public GET failed: ${response.status} ${row.key}`);
      const bytes = response ? Buffer.from(await response.arrayBuffer()) : local;
      const meta = await sharp(bytes).metadata();
      await sharp(bytes).raw().toBuffer();
      await fs.writeFile(`${output}/${index + 1}.webp`, bytes);
      evidence[index] = {
        index: index + 1,
        key: row.key,
        evidenceBasis: remote ? "public-get" : "local-public-source",
        servedSha256: sha(bytes),
        localMatchesRemote: sha(bytes) === sha(local),
        servedBytes: bytes.length,
        width: meta.width,
        height: meta.height,
        uses: row.uses,
        useCount: row.useCount,
      };
    }
  })
);
for (let page = 0; page < Math.ceil(evidence.length / 48); page++) {
  const tiles = [];
  for (const [position, row] of evidence.slice(page * 48, (page + 1) * 48).entries()) {
    const label = `${row.index}. ${row.uses[0].wordId}`
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;");
    const tile = await sharp(`${output}/${row.index}.webp`)
      .resize(260, 170, { fit: "contain", background: "white" })
      .extend({ bottom: 28, top: 0, left: 0, right: 0, background: "white" })
      .composite([
        {
          input: Buffer.from(
            `<svg width="260" height="28"><text x="6" y="20" font-size="14">${label}</text></svg>`
          ),
          left: 0,
          top: 170,
        },
      ])
      .png()
      .toBuffer();
    tiles.push({ input: tile, left: (position % 6) * 260, top: Math.floor(position / 6) * 198 });
  }
  if (tiles.length)
    await sharp({
      create: {
        width: 1560,
        height: Math.ceil(tiles.length / 6) * 198,
        channels: 3,
        background: "white",
      },
    })
      .composite(tiles)
      .png()
      .toFile(`${output}/contact-sheet-${page + 1}.png`);
}
await fs.writeFile(
  `${output}/evidence.json`,
  JSON.stringify({ generatedAt: new Date().toISOString(), assets: evidence }, null, 2) + "\n"
);
console.log(
  JSON.stringify({
    activeFlaggedAssets: queue.length,
    fetchedAndDecoded: evidence.length,
    totalFlaggedBytes: queue.reduce((sum, row) => sum + row.bytes, 0),
    allLocalCopiesMatch: evidence.every((row) => row.localMatchesRemote),
  })
);
