import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  validateJobs,
  requestFor,
  assertCurrentScene,
  generateBatch,
} from "../generate_reviewed_scene_batch.mjs";
import {
  loadGenerationSource,
  referenceGenerationPrompt,
} from "../lib/usage_generation_preflight.mjs";
const source = JSON.parse(fs.readFileSync("src/app/data/usage/classroom.usage.json"))[0];
const scene = loadGenerationSource(
  {
    unitId: source.unitId,
    lessonId: source.lessonId,
    sceneId: `${source.lessonId}-usage-scene-${source.usage.scenes[0].chunkNumber}`,
  },
  "."
).scene;
const job = {
  sceneId: `${source.lessonId}-usage-scene-${scene.chunkNumber}`,
  unitId: source.unitId,
  lessonId: source.lessonId,
  prompt: referenceGenerationPrompt(scene),
  reviewedScenario: scene.scenario,
  reviewedQuestion: scene.check.question,
  reviewedAnswer: scene.check.expectedAnswer,
};
test("rejects duplicate identities and path traversal before API access", () => {
  assert.throws(() => validateJobs([job, job]), /duplicate/);
  assert.throws(() => validateJobs([{ ...job, sceneId: "../escape-usage-scene-1" }]), /identity/);
});
test("rejects malformed or unevidenced prompts before generation", () => {
  assert.throws(
    () => validateJobs([{ ...job, prompt: "An undefined on a desk" }]),
    /Invalid prompt/
  );
  assert.throws(() => validateJobs([{ ...job, reviewedQuestion: "" }]), /question evidence/);
});
test("withholds generation after a question changes even if its answer is unchanged", () => {
  assert.doesNotThrow(() => assertCurrentScene(job, "."));
  assert.throws(
    () => assertCurrentScene({ ...job, reviewedQuestion: "A different question?" }, "."),
    /Question changed/
  );
});
test("requests a bounded real image without cropping or fabricated output", () => {
  const request = requestFor(job);
  assert.equal(request.generationConfig.maxOutputTokens, 4096);
  assert.equal(request.generationConfig.imageConfig.aspectRatio, "4:3");
  assert.ok(request.generationConfig.responseModalities.includes("IMAGE"));
});
test("a queue prompt cannot override the current reviewed brief or text policy", () => {
  assert.throws(
    () => assertCurrentScene({ ...job, prompt: `${job.prompt} Add a labelled answer.` }, "."),
    /Generation prompt changed/
  );
});
test("the paid runner refuses an unreviewed whole lesson before contacting the service", async (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "wordpix-runner-review-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const queue = path.join(dir, "queue.json");
  fs.writeFileSync(queue, JSON.stringify({ items: [job] }));
  let requests = 0;
  const original = globalThis.fetch;
  globalThis.fetch = async () => {
    requests++;
    throw new Error("Unexpected service request");
  };
  t.after(() => {
    globalThis.fetch = original;
  });
  await assert.rejects(
    generateBatch({ queue, sourceRoot: ".", generate: true }),
    /whole-lesson|Content repair/
  );
  assert.equal(requests, 0);
});
