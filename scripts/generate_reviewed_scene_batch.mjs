import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { parseEnv } from "node:util";
import { pathToFileURL } from "node:url";
import sharp from "sharp";
import {
  loadGenerationSource,
  assertGenerationReady,
  referenceGenerationPrompt,
} from "./lib/usage_generation_preflight.mjs";

export const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
export function validateJobs(items) {
  if (!Array.isArray(items) || items.length === 0)
    throw new Error("Provide a nonempty scene queue.");
  const ids = new Set();
  for (const item of items) {
    if (!/^[a-z0-9-]+-usage-scene-\d+$/.test(item.sceneId) || ids.has(item.sceneId))
      throw new Error("Invalid or duplicate scene identity.");
    if (
      typeof item.prompt !== "string" ||
      !item.prompt.trim() ||
      item.prompt.length > 4000 ||
      /\bundefined\b/i.test(item.prompt)
    )
      throw new Error(`Invalid prompt: ${item.sceneId}`);
    if (
      !item.reviewedScenario?.trim() ||
      !item.reviewedAnswer?.trim() ||
      !item.reviewedQuestion?.trim()
    )
      throw new Error(`Missing question evidence: ${item.sceneId}`);
    ids.add(item.sceneId);
  }
  return items;
}
export function requestFor(item) {
  return {
    contents: [{ role: "user", parts: [{ text: item.prompt }] }],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
      maxOutputTokens: 4096,
      imageConfig: { aspectRatio: "4:3", imageSize: "1K" },
    },
  };
}
export function assertCurrentScene(item, sourceRoot) {
  const { scene } = loadGenerationSource(item, sourceRoot);
  if (
    !scene ||
    scene.scenario !== item.reviewedScenario ||
    scene.check.expectedAnswer !== item.reviewedAnswer ||
    scene.check.question !== item.reviewedQuestion
  )
    throw new Error(`Question changed; review again: ${item.sceneId}`);
  if (item.prompt !== referenceGenerationPrompt(scene))
    throw new Error(`Generation prompt changed; rebuild the reviewed queue: ${item.sceneId}`);
  return scene;
}
export async function generateBatch(options) {
  const jobs = validateJobs(JSON.parse(fs.readFileSync(options.queue, "utf8")).items);
  const concurrency = Number(options.concurrency ?? 4),
    limit = Number(options.limit ?? 12),
    budget = Number(options.maxCostUsd ?? 1);
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
  const model = options.model ?? "gemini-3.1-flash-image";
  if (
    !["gemini-3.1-flash-image", "gemini-3.1-flash-lite-image", "gemini-nano-banana-2.1"].includes(
      model
    )
  )
    throw new Error("Use a supported image model.");
  const selected = jobs.slice(0, Math.min(limit, Math.floor(budget / 0.15)));
  if (!selected.length) throw new Error("Spending bound must allow one $0.15 reserved request.");
  for (const item of selected) {
    assertCurrentScene(item, options.sourceRoot);
    assertGenerationReady(item, options.sourceRoot);
  }
  if (!options.generate)
    return {
      queued: jobs.length,
      selected: selected.length,
      concurrency,
      model,
      reservedCostUsd: selected.length * 0.15,
      costBasis: "Local request reservation; verify provider pricing and reconcile billed usage.",
      requests: 0,
    };
  const env = options.envFile ? parseEnv(fs.readFileSync(options.envFile, "utf8")) : {};
  const key = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY;
  if (!key) throw new Error("Set GEMINI_API_KEY in the environment or supply an env file.");
  const out = path.resolve(options.output ?? "output/gemini-scenes");
  fs.mkdirSync(out, { recursive: true });
  let cursor = 0;
  const results = [];
  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      while (cursor < selected.length) {
        const item = selected[cursor++];
        const identity = sha256(JSON.stringify({ item, model }));
        const stem = path.join(out, `${item.sceneId}-${identity.slice(0, 16)}`);
        const receipt = `${stem}.json`,
          image = `${stem}.webp`,
          claim = `${stem}.claim`;
        if (fs.existsSync(receipt)) {
          const existing = JSON.parse(fs.readFileSync(receipt));
          if (
            existing.status === "generated" &&
            fs.existsSync(image) &&
            sha256(fs.readFileSync(image)) === existing.sha256
          ) {
            results.push({ sceneId: item.sceneId, status: "reused" });
            continue;
          }
          results.push({ sceneId: item.sceneId, status: "requires-review-before-retry" });
          continue;
        }
        let fd;
        try {
          fd = fs.openSync(claim, "wx");
        } catch (error) {
          if (error.code === "EEXIST") {
            results.push({ sceneId: item.sceneId, status: "claimed-by-another-run" });
            continue;
          }
          throw error;
        }
        fs.closeSync(fd);
        const record = {
          ...item,
          model,
          identity,
          status: "request-started",
          reviewStatus: "pending-visual-review",
          sourceFile: image,
          startedAt: new Date().toISOString(),
        };
        fs.writeFileSync(receipt, JSON.stringify(record, null, 2), { flag: "wx" });
        try {
          assertCurrentScene(item, options.sourceRoot);
          assertGenerationReady(item, options.sourceRoot);
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json", "x-goog-api-key": key },
              body: JSON.stringify(requestFor(item)),
              signal: AbortSignal.timeout(120000),
            }
          );
          record.httpStatus = response.status;
          const data = await response.json();
          if (!response.ok) throw new Error(`Image service returned HTTP ${response.status}.`);
          const part = data.candidates?.[0]?.content?.parts?.find(
            (p) => p.inlineData?.mimeType?.startsWith("image/") && p.inlineData.data
          );
          if (!part) throw new Error("Image service returned no image.");
          const bytes = Buffer.from(part.inlineData.data, "base64");
          const metadata = await sharp(bytes).metadata();
          if (
            bytes.length < 1000 ||
            !metadata.width ||
            !metadata.height ||
            metadata.width < 512 ||
            metadata.height < 512
          )
            throw new Error("Invalid image bytes or dimensions.");
          const delivered = await sharp(bytes).webp({ quality: 85, effort: 4 }).toBuffer();
          fs.writeFileSync(image, delivered, { flag: "wx" });
          Object.assign(record, {
            status: "generated",
            sha256: sha256(delivered),
            bytes: delivered.length,
            width: metadata.width,
            height: metadata.height,
            usage: data.usageMetadata,
          });
        } catch (error) {
          record.status = "failed";
          record.error =
            error.message.startsWith("Image service") ||
            error.message.startsWith("Question changed") ||
            error.message.startsWith("Invalid image")
              ? error.message
              : error.name;
        }
        record.elapsedMs = Date.now() - Date.parse(record.startedAt);
        fs.writeFileSync(receipt, JSON.stringify(record, null, 2));
        // Claim files are retained as audit evidence; complete receipts permit reuse.
        results.push({ sceneId: item.sceneId, status: record.status, elapsedMs: record.elapsedMs });
        console.log(JSON.stringify(results.at(-1)));
      }
    })
  );
  const summary = {
    model,
    requested: selected.length,
    reservedCostUsd: selected.length * 0.15,
    costBasis: "Local request reservation; verify provider pricing and reconcile billed usage.",
    results,
  };
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
  generateBatch({
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
