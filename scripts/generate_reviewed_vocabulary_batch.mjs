import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { parseEnv } from "node:util";
import { pathToFileURL } from "node:url";
import sharp from "sharp";

export const sha256 = (bytes) =>
  crypto.createHash("sha256").update(bytes).digest("hex");

export function validateVocabularyJobs(items) {
  if (!Array.isArray(items) || items.length === 0)
    throw new Error("Provide a nonempty vocabulary queue.");
  const ids = new Set();
  for (const item of items) {
    const key = `${item.unitId || "vocab"}:${item.word || item.id}`;
    if (ids.has(key))
      throw new Error(`Duplicate vocabulary identity: ${key}`);
    if (
      typeof item.prompt !== "string" ||
      !item.prompt.trim() ||
      item.prompt.length > 4000 ||
      /\bundefined\b/i.test(item.prompt)
    )
      throw new Error(`Invalid prompt for vocabulary item: ${item.word || item.id}`);
    if (!item.word && !item.id)
      throw new Error("Missing word or id on vocabulary item.");
    ids.add(key);
  }
  return items;
}

export function requestForVocabulary(item) {
  return {
    contents: [{ role: "user", parts: [{ text: item.prompt }] }],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
      maxOutputTokens: 4096,
      imageConfig: { aspectRatio: "4:3", imageSize: "1K" },
    },
  };
}

export async function generateVocabularyBatch(options) {
  const queueData = JSON.parse(fs.readFileSync(options.queue, "utf8"));
  const rawItems = queueData.items ?? queueData;
  const jobs = validateVocabularyJobs(rawItems);

  const concurrency = Number(options.concurrency ?? 4),
    limit = Number(options.limit ?? 28),
    budget = Number(options.maxCostUsd ?? 5);

  if (
    !Number.isInteger(concurrency) ||
    concurrency < 1 ||
    concurrency > 8 ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    !Number.isFinite(budget) ||
    budget <= 0
  )
    throw new Error("Invalid concurrency, limit or spending bound.");

  const model = options.model ?? "gemini-nano-banana-2.1";
  if (
    !["gemini-3.1-flash-image", "gemini-3.1-flash-lite-image", "gemini-nano-banana-2.1"].includes(
      model
    )
  )
    throw new Error("Use a supported image model.");

  const selected = jobs.slice(0, Math.min(limit, Math.floor(budget / 0.15)));
  if (!selected.length)
    throw new Error("Spending bound must allow at least one $0.15 reserved request.");

  const summary = {
    model,
    words: selected.length,
    concurrency,
    reservedCostUsd: Number((selected.length * 0.15).toFixed(2)),
    imageOutputEstimateUsd: Number((selected.length * 0.0336).toFixed(4)),
    costBasis:
      "Local request reservation is not a billed cost; image output estimate excludes text/thinking. Google pricing checked 2026-10-10.",
    requests: 0,
    results: [],
  };

  if (!options.generate) {
    return summary;
  }

  const env = options.envFile ? parseEnv(fs.readFileSync(options.envFile, "utf8")) : {};
  const key = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY;
  if (!key) throw new Error("Missing Gemini credential.");

  const out = path.resolve(options.output ?? "output/vocabulary-gemini");
  fs.mkdirSync(out, { recursive: true });

  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(concurrency, selected.length) }, async () => {
      while (cursor < selected.length) {
        const item = selected[cursor++];
        const itemSlug = (item.word || item.id).toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const requestPayload = requestForVocabulary(item);
        const identity = sha256(JSON.stringify({ item, model, requestPayload }));
        const stem = path.join(out, `${itemSlug}-${identity.slice(0, 12)}`);
        const receipt = `${stem}.json`;
        const claim = `${stem}.claim`;
        const sourceFile = path.resolve(`${stem}.webp`);

        if (fs.existsSync(receipt)) {
          const previous = JSON.parse(fs.readFileSync(receipt, "utf8"));
          if (
            previous.status === "generated" &&
            fs.existsSync(sourceFile) &&
            sha256(fs.readFileSync(sourceFile)) === previous.sha256
          ) {
            summary.results.push({ word: item.word || item.id, status: "reused" });
            continue;
          }
          throw new Error(`Unresolved request must be inspected before retry: ${item.word || item.id}`);
        }

        let fd;
        try {
          fd = fs.openSync(claim, "wx");
        } catch (err) {
          if (err.code === "EEXIST") {
            summary.results.push({ word: item.word || item.id, status: "claimed-by-another-run" });
            continue;
          }
          throw err;
        }
        fs.closeSync(fd);

        const record = {
          ...item,
          model,
          identity,
          status: "request-started",
          startedAt: new Date().toISOString(),
          sourceFile,
          reviewStatus: "pending-visual-review",
        };
        fs.writeFileSync(receipt, JSON.stringify(record, null, 2), { flag: "wx" });

        summary.requests++;
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json", "x-goog-api-key": key },
              body: JSON.stringify(requestPayload),
              signal: AbortSignal.timeout(120000),
            }
          );
          record.httpStatus = response.status;
          const data = await response.json();
          record.usage = data.usageMetadata;
          record.finishReason = data.candidates?.[0]?.finishReason;

          if (!response.ok) throw new Error(`Image service returned HTTP ${response.status}.`);
          if (record.finishReason === "MAX_TOKENS") {
            throw new Error("Image service truncated response: MAX_TOKENS.");
          }
          const part = data.candidates?.[0]?.content?.parts?.find(
            (p) => p.inlineData?.mimeType?.startsWith("image/") && p.inlineData.data
          );
          if (!part) throw new Error(`Image service returned no image (finishReason: ${record.finishReason || "none"}).`);

          const bytes = Buffer.from(part.inlineData.data, "base64");
          const metadata = await sharp(bytes).metadata();
          if (
            bytes.length < 1000 ||
            !metadata.width ||
            !metadata.height ||
            metadata.width < 512 ||
            metadata.height < 512
          ) {
            throw new Error("Invalid image bytes or dimensions.");
          }

          const delivered = await sharp(bytes).webp({ quality: 85, effort: 4 }).toBuffer();
          fs.writeFileSync(sourceFile, delivered, { flag: "wx" });

          Object.assign(record, {
            status: "generated",
            sha256: sha256(delivered),
            bytes: delivered.length,
            width: metadata.width,
            height: metadata.height,
          });
        } catch (error) {
          record.status = "failed";
          record.error = error.message;
        }

        record.elapsedMs = Date.now() - Date.parse(record.startedAt);
        fs.writeFileSync(receipt, JSON.stringify(record, null, 2));
        summary.results.push({
          word: item.word || item.id,
          status: record.status,
          elapsedMs: record.elapsedMs,
        });
      }
    })
  );

  fs.writeFileSync(path.join(out, `run-${Date.now()}.json`), JSON.stringify(summary, null, 2));
  return summary;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const args = Object.fromEntries(
    process.argv
      .slice(2)
      .filter((a) => a.startsWith("--") && a.includes("="))
      .map((a) => {
        const i = a.indexOf("=");
        return [a.slice(2, i), a.slice(i + 1)];
      })
  );
  generateVocabularyBatch({
    queue: args.queue,
    sourceRoot: path.resolve(args.source ?? "."),
    output: args.output,
    envFile: args.env,
    model: args.model,
    concurrency: args.concurrency,
    limit: args.limit,
    maxCostUsd: args["max-cost-usd"],
    generate: process.argv.includes("--generate"),
  })
    .then((summary) => {
      console.log(JSON.stringify(summary));
      if (summary.results?.some((r) => !["generated", "reused"].includes(r.status)))
        process.exitCode = 1;
    })
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
