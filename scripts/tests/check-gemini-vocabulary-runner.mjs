import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  validateVocabularyJobs,
  requestForVocabulary,
  generateVocabularyBatch,
} from "../generate_reviewed_vocabulary_batch.mjs";

const sampleJob = {
  unitId: "test-unit",
  word: "Clock",
  prompt: "Create one realistic adult-learning vocabulary reference for Clock. 4:3 landscape.",
};

test("vocabulary runner rejects duplicate identities and missing words", () => {
  assert.throws(
    () => validateVocabularyJobs([sampleJob, sampleJob]),
    /Duplicate vocabulary identity/
  );
  assert.throws(
    () => validateVocabularyJobs([{ prompt: "Just a prompt" }]),
    /Missing word or id/
  );
});

test("vocabulary runner rejects malformed or oversized prompts", () => {
  assert.throws(
    () => validateVocabularyJobs([{ ...sampleJob, prompt: "" }]),
    /Invalid prompt/
  );
  assert.throws(
    () => validateVocabularyJobs([{ ...sampleJob, prompt: "An undefined item" }]),
    /Invalid prompt/
  );
  assert.throws(
    () => validateVocabularyJobs([{ ...sampleJob, prompt: "a".repeat(4001) }]),
    /Invalid prompt/
  );
});

test("vocabulary runner creates standard 4:3 1K multimodal request", () => {
  const req = requestForVocabulary(sampleJob);
  assert.equal(req.contents[0].parts[0].text, sampleJob.prompt);
  assert.equal(req.generationConfig.maxOutputTokens, 4096);
  assert.equal(req.generationConfig.imageConfig.aspectRatio, "4:3");
  assert.equal(req.generationConfig.imageConfig.imageSize, "1K");
  assert.ok(req.generationConfig.responseModalities.includes("IMAGE"));
});

test("vocabulary runner dry-run estimates budget without network access", async () => {
  const tempQueue = path.resolve("output/test-vocab-queue.json");
  fs.mkdirSync(path.dirname(tempQueue), { recursive: true });
  fs.writeFileSync(
    tempQueue,
    JSON.stringify({
      items: [
        sampleJob,
        { unitId: "test-unit", word: "Watch", prompt: "A watch on a table." },
      ],
    })
  );

  const res = await generateVocabularyBatch({
    queue: tempQueue,
    generate: false,
    limit: 10,
    maxCostUsd: 2.0,
    concurrency: 4,
  });

  assert.equal(res.words, 2);
  assert.equal(res.reservedCostUsd, 0.3); // 2 * 0.15
  assert.equal(res.imageOutputEstimateUsd, 0.0672); // 2 * 0.0336
  assert.equal(res.requests, 0);

  // Clean up
  fs.unlinkSync(tempQueue);
});

test("vocabulary runner respects spending bounds", async () => {
  const tempQueue = path.resolve("output/test-vocab-queue-budget.json");
  fs.mkdirSync(path.dirname(tempQueue), { recursive: true });
  fs.writeFileSync(
    tempQueue,
    JSON.stringify({
      items: [sampleJob],
    })
  );

  await assert.rejects(
    () =>
      generateVocabularyBatch({
        queue: tempQueue,
        generate: false,
        limit: 10,
        maxCostUsd: 0.1, // Cannot even cover 1 * 0.15
      }),
    /Spending bound must allow at least one/
  );

  fs.unlinkSync(tempQueue);
});
