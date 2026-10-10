import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  assertGenerationReady,
  contentDigest,
  contentIssues,
  generationReviewChecks,
  loadGenerationSource,
} from "../lib/usage_generation_preflight.mjs";
const lesson = {
  unitId: "sample",
  lessonId: "sample-1",
  usage: {
    scenes: [
      {
        chunkNumber: 1,
        targetWords: ["Pencil", "Pen"],
        scenario: "Mina uses a pencil to sketch a plan and a pen to sign the form.",
        check: {
          question: "What does Mina use to sketch the plan?",
          expectedAnswer: "Pencil",
          options: ["Pen", "Pencil"],
        },
        imageBrief: "A blank plan and unbranded writing tools.",
        imageAlt: "Two writing tools beside a blank page.",
      },
    ],
  },
  reading: {
    text: "Mina prepares for a meeting. She sketches a plan and signs the form before leaving.",
  },
  exercises: [{ prompt: "What does Mina use to sketch the plan?", answer: "Pencil" }],
};
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wordpix-preflight-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const dir = path.join(root, "src/app/data/usage");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "sample.usage.json"), JSON.stringify([lesson]));
  const item = {
    unitId: "sample",
    lessonId: "sample-1",
    sceneId: "sample-1-usage-scene-1",
    contentReview: {
      status: "approved",
      lessonSha256: contentDigest(lesson, []),
      reviewedBy: "Editor",
      reviewedAt: "2026-10-09",
      checks: Object.fromEntries(generationReviewChecks.map((key) => [key, "approved"])),
      sources: [
        "https://dictionary.cambridge.org/dictionary/english/pencil",
        "https://www.collinsdictionary.com/dictionary/english/pencil",
      ],
    },
  };
  return { root, item };
}
test("accepts only a current complete review, not a historical approval label", (t) => {
  const { root, item } = fixture(t);
  assert.doesNotThrow(() => assertGenerationReady(item, root));
  assert.throws(
    () => assertGenerationReady({ ...item, contentReview: undefined }, root),
    /whole-lesson/
  );
});
test("reading or exercise edits invalidate the scene review even when the answer stays the same", (t) => {
  const { root, item } = fixture(t);
  const edited = structuredClone(lesson);
  edited.reading.text += " She takes a taxi.";
  fs.writeFileSync(
    path.join(root, "src/app/data/usage/sample.usage.json"),
    JSON.stringify([edited])
  );
  assert.throws(() => assertGenerationReady(item, root), /whole-lesson/);
});
test("phrase revisions invalidate the whole-lesson digest", (t) => {
  const { root, item } = fixture(t);
  const dir = path.join(root, "src/app/data/usagePhrases");
  fs.mkdirSync(dir);
  fs.writeFileSync(
    path.join(dir, "sample.phrases.json"),
    JSON.stringify([{ lessonId: "sample-1", pattern: "use + a pencil", phrase: "use a pencil" }])
  );
  assert.throws(() => assertGenerationReady(item, root), /whole-lesson/);
});
test("rejects path traversal and mismatched lesson identities", (t) => {
  const { root, item } = fixture(t);
  assert.throws(() => loadGenerationSource({ ...item, unitId: "../sample" }, root), /identity/);
  assert.throws(() => loadGenerationSource({ ...item, lessonId: "other-1" }, root), /identity/);
});
test("blocks generic content, duplicate options and missing answers before paid generation", () => {
  const bad = structuredClone(lesson);
  bad.usage.scenes[0].scenario = "The adult uses the lesson vocabulary accurately.";
  bad.usage.scenes[0].check.options = ["Pencil", "Pencil"];
  bad.exercises[0].answer = "";
  const issues = contentIssues(bad, []);
  assert.ok(issues.some((i) => i.includes("generic scenario")));
  assert.ok(issues.some((i) => i.includes("answer options")));
  assert.ok(issues.some((i) => i.includes("exercise answer")));
});
test("requires every language, exercise and visual check and two distinct evidence sources", (t) => {
  const { root, item } = fixture(t);
  item.contentReview.checks.phrases = "pending";
  assert.throws(() => assertGenerationReady(item, root), /whole-lesson/);
  item.contentReview.checks.phrases = "approved";
  item.contentReview.sources = ["https://example.com", "https://example.com"];
  assert.throws(() => assertGenerationReady(item, root), /whole-lesson/);
});
test("blocks incorrect indefinite articles before review or paid generation", () => {
  const bad = structuredClone(lesson);
  bad.reading.text = "A adult prepares for a meeting.";
  assert.ok(contentIssues(bad, []).some((issue) => issue.includes("indefinite article")));
});
