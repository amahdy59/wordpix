import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
const args = process.argv.slice(2);
if (args.length !== 1 || !args[0].startsWith("--input="))
  throw Error("Use --input=<reviewed source folder>");
const input = path.resolve(args[0].slice(8));
const read = async (file) => JSON.parse(await fs.readFile(file, "utf8"));
const review = await read("docs/media/SUPPLIED_IMAGE_REVIEW_2026-10-30.json");
const baseline = await read("output/required-images-2026-10-30/runtime-before.json");
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const directory = "output/required-images-2026-10-30/prepared";
await fs.mkdir(directory, { recursive: true });
const files = [],
  bindings = [],
  identities = new Set();
for (const image of review.images) {
  if (image.decision !== "use-as-reference-support") continue;
  if (path.basename(image.name) !== image.name) throw Error("Invalid source filename");
  const bytes = await fs.readFile(path.join(input, image.name));
  if (sha(bytes) !== image.sha256 || bytes.length !== image.bytes)
    throw Error("Changed reviewed image: " + image.index);
  const variants = [];
  for (const width of [640, 1280]) {
    const data = await sharp(bytes)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 84 })
      .toBuffer();
    const metadata = await sharp(data).metadata();
    await sharp(data).raw().toBuffer();
    if (data.length > 300000) throw Error("Image exceeds delivery budget: " + image.index);
    const hash = sha(data),
      key = `question-images/v2/supplied-20261030/${hash}.webp`;
    const file = `${directory}/${hash}.webp`;
    await fs.writeFile(file, data);
    files.push({
      sourceIndex: image.index,
      file,
      key,
      sha256: hash,
      bytes: data.length,
      width: metadata.width,
      height: metadata.height,
    });
    variants.push({
      url: `https://pub-e84a3f9882a141ac9f33296bbad85e2a.r2.dev/${key}`,
      width: metadata.width,
    });
  }
  const candidates = baseline.filter((row) => row.index === image.index);
  for (const row of candidates) {
    // The two wall images serve different exact sentences for the same word.
    if (
      (image.index === 9 && row.contextIndex !== 1) ||
      (image.index === 10 && row.contextIndex !== 0)
    )
      continue;
    if (image.index === 34 && row.contextIndex !== 1) continue;
    if (image.index === 38) {
      row.text = "Please sit down.";
      row.sourceKey = null;
    }
    const identity = `${row.kind}\0${row.unitId}\0${row.wordId}\0${row.text}`;
    if (identities.has(identity)) continue;
    identities.add(identity);
    bindings.push({
      sourceIndex: image.index,
      kind: row.kind,
      unitId: row.unitId,
      lessonId: row.lessonId,
      wordId: row.wordId,
      text: row.text,
      expectedSourceKey: row.sourceKey,
      imagePath: variants.at(-1).url,
      imageAlt: image.imageAlt,
      imagePurpose: "word-reference",
      responsiveSources: variants,
    });
  }
}
const uniqueFiles = [...new Map(files.map((file) => [file.key, file])).values()];
if (
  uniqueFiles.length > 72 ||
  uniqueFiles.length < 36 ||
  bindings.some((row) => !row.text || !row.imageAlt)
)
  throw Error(
    "Unexpected review batch: " +
      JSON.stringify({
        files: uniqueFiles.length,
        invalid: bindings.filter((row) => !row.text || !row.imageAlt),
      })
  );
const batch = {
  schemaVersion: 1,
  status: "prepared-awaiting-publication-approval",
  reviewedImages: review.images.filter((row) => row.decision === "use-as-reference-support").length,
  heldFiles: review.images.filter((row) => row.decision === "hold").length,
  files: uniqueFiles,
  bindings,
};
await fs.writeFile(
  "docs/media/SUPPLIED_IMAGE_BATCH_2026-10-30.json",
  JSON.stringify(batch, null, 2) + "\n"
);
console.log(
  JSON.stringify({
    images: batch.reviewedImages,
    held: batch.heldFiles,
    files: uniqueFiles.length,
    contexts: bindings.length,
    preparedBytes: uniqueFiles.reduce((sum, file) => sum + file.bytes, 0),
    originalBytes: review.images
      .filter((row) => row.decision === "use-as-reference-support")
      .reduce((sum, row) => sum + row.bytes, 0),
  })
);
