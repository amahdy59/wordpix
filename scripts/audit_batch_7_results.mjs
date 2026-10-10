import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const sourceRoot = path.resolve(".");
const batchDir = path.join(sourceRoot, "output/batch-7-gemini");
const queueFile = path.join(sourceRoot, "output/batch-7-reviewed-queue.json");
const queue = JSON.parse(fs.readFileSync(queueFile, "utf8")).items;
const webps = fs.readdirSync(batchDir).filter((f) => f.endsWith(".webp"));

const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");

console.log(`Found ${webps.length} delivered webp files in ${batchDir}`);

const paired = [];
let totalBytes = 0;
let totalTokens = { prompt: 0, candidates: 0, total: 0, thoughts: 0 };

for (const item of queue) {
  const matches = webps.filter((w) => w.startsWith(item.sceneId));
  const chosen = matches.find((m) => m.includes("-v2-")) || matches[0];
  if (!chosen) {
    throw new Error(`Missing delivered webp for ${item.sceneId}`);
  }

  const imagePath = path.join(batchDir, chosen);
  const jsonPath = imagePath.replace(/\.webp$/, ".json");
  const receipt = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  const buf = fs.readFileSync(imagePath);
  const meta = await sharp(buf).metadata();

  totalBytes += buf.length;
  if (receipt.usage) {
    totalTokens.prompt += receipt.usage.promptTokenCount || 0;
    totalTokens.candidates += receipt.usage.candidatesTokenCount || 0;
    totalTokens.total += receipt.usage.totalTokenCount || 0;
    totalTokens.thoughts += receipt.usage.thoughtsTokenCount || 0;
  }

  paired.push({
    sceneId: item.sceneId,
    unitId: item.unitId,
    lessonId: item.lessonId,
    concept: item.reviewedAnswer,
    prompt: item.prompt,
    filename: chosen,
    bytes: buf.length,
    sha256: sha256(buf),
    width: meta.width,
    height: meta.height,
    aspectRatio: `${meta.width}:${meta.height}`,
    finishReason: receipt.finishReason || "STOP",
    receiptPath: jsonPath,
    tokens: receipt.usage,
  });
}

console.log(`Successfully audited all ${paired.length} scenes in Batch 7.`);
console.log(`Total payload size: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
console.log(`Total tokens: ${JSON.stringify(totalTokens)}`);

fs.writeFileSync(
  path.join(sourceRoot, "output/batch-7-audit.json"),
  JSON.stringify({ paired, totalBytes, totalTokens }, null, 2)
);
