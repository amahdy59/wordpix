import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { validateJobs, requestFor, assertCurrentScene } from "../generate_reviewed_scene_batch.mjs";
const source = JSON.parse(fs.readFileSync("src/app/data/usage/classroom.usage.json"))[0];
const scene = source.usage.scenes[0];
const job = {
  sceneId: `${source.lessonId}-usage-scene-${scene.chunkNumber}`,
  unitId: source.unitId,
  lessonId: source.lessonId,
  prompt: "A plain pencil on an adult classroom desk. No text or logos.",
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
