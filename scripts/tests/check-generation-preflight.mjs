import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import {
  assertGenerationReady,
  assertLessonReviewReady,
  contentDigest,
  contentIssues,
  generationReviewChecks,
  loadGenerationSource,
  loadGenerationReviews,
  referenceGenerationPrompt,
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
      unitId: "sample",
      lessonId: "sample-1",
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
test("a bilingual sense repair invalidates the review without changing the scene", (t) => {
  const { root, item } = fixture(t);
  const dir = path.join(root, "src/app/data/bilingual");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, "sample.json"),
    JSON.stringify({
      pencil: { definition: "A writing instrument.", arabicTranslation: "قلم رصاص" },
    })
  );
  assert.throws(() => assertGenerationReady(item, root), /whole-lesson/);
});
test("refuses impossible dates and reviews attached to another lesson", (t) => {
  const { root, item } = fixture(t);
  item.contentReview.reviewedAt = "2026-02-30";
  assert.throws(() => assertGenerationReady(item, root), /whole-lesson/);
  item.contentReview.reviewedAt = "2026-10-09";
  item.contentReview.lessonId = "sample-2";
  assert.throws(() => assertGenerationReady(item, root), /whole-lesson/);
});
test("anchors and revised learner context are both bound to generation approval", (t) => {
  const { root, item } = fixture(t);
  const revised = structuredClone(lesson);
  const scene = revised.usage.scenes[0];
  scene.learningContext = {
    sourceScenario: scene.scenario,
    sourceQuestion: scene.check.question,
    sourceAnswer: scene.check.expectedAnswer,
    scenario: "Mina draws with a pencil, then signs with a pen.",
    question: "Which tool does Mina draw with?",
    imageBrief: "One pencil on a blank drawing pad.",
  };
  const file = path.join(root, "src/app/data/usage/sample.usage.json");
  fs.writeFileSync(file, JSON.stringify([revised]));
  assert.throws(() => assertGenerationReady(item, root), /whole-lesson/);
  item.contentReview.lessonSha256 = contentDigest(revised, []);
  assert.equal(
    assertGenerationReady(item, root).scene.check.question,
    scene.learningContext.question
  );
  scene.learningContext.sourceAnswer = "Pen";
  fs.writeFileSync(file, JSON.stringify([revised]));
  item.contentReview.lessonSha256 = contentDigest(revised, []);
  assert.throws(() => assertGenerationReady(item, root), /stale written-task anchor/);
});
test("refuses conflicting lesson reviews across tracked section ledgers", (t) => {
  const { root, item } = fixture(t);
  const dir = path.join(root, "docs/content-review");
  fs.mkdirSync(dir, { recursive: true });
  for (const name of ["a-review.json", "b-review.json"])
    fs.writeFileSync(path.join(dir, name), JSON.stringify({ items: [item.contentReview] }));
  assert.throws(() => loadGenerationReviews(root), /Duplicate lesson review/);
});
test("numeric glyph exceptions cannot bypass the strict no-readable-text policy", () => {
  const scene = lesson.usage.scenes[0];
  assert.match(referenceGenerationPrompt(scene), /No readable text/);
  assert.throws(
    () => referenceGenerationPrompt({ ...scene, imageSymbols: ["2", "+", "3", "=", "5"] }),
    /symbols are prohibited/
  );
  assert.throws(
    () => referenceGenerationPrompt({ ...scene, imageSymbols: ["Take two pills"] }),
    /symbols are prohibited/
  );
});

test("reviewed illustration labels are bounded and do not permit historical symbol exceptions", () => {
  const scene = { ...lesson.usage.scenes[0], imageLabels: ["Cold Pack"] };
  assert.match(referenceGenerationPrompt(scene), /ONLY these exact readable labels: "Cold Pack"/);
  assert.match(referenceGenerationPrompt(scene), /Absolutely no women/);
  assert.match(referenceGenerationPrompt(scene), /No other text, numbers/);
  for (const imageLabels of [
    [],
    [""],
    ["A", "A"],
    ["A", "B", "C", "D", "E", "F"],
    [" A"],
    ["A".repeat(81)],
  ])
    assert.throws(
      () => referenceGenerationPrompt({ ...scene, imageLabels }),
      /reviewed image labels/
    );
  assert.throws(
    () => referenceGenerationPrompt({ ...scene, imageSymbols: ["2"] }),
    /symbols are prohibited/
  );
});

test("an approved written lesson can hold imagery; queues and paid preflight exclude it", (t) => {
  const { root, item } = fixture(t);
  const revised = structuredClone(lesson);
  revised.usage.scenes[0].imageGenerationHold = "A blank bottle cannot identify its contents.";
  fs.writeFileSync(
    path.join(root, "src/app/data/usage/sample.usage.json"),
    JSON.stringify([revised])
  );
  item.contentReview.lessonSha256 = contentDigest(revised, []);
  assert.doesNotThrow(() => assertLessonReviewReady(item, root));
  assert.throws(() => assertGenerationReady(item, root), /Image generation held/);
  const reviews = path.join(root, "reviews.json");
  const output = path.join(root, "queue.json");
  fs.writeFileSync(reviews, JSON.stringify({ items: [item.contentReview] }));
  execFileSync(process.execPath, [
    "scripts/build_image_generation_queue.mjs",
    `--source=${root}`,
    "--units=sample",
    `--reviews=${reviews}`,
    `--output=${output}`,
  ]);
  const queue = JSON.parse(fs.readFileSync(output));
  assert.equal(queue.items.length, 0);
  assert.equal(queue.held.length, 1);
  assert.equal(queue.held[0].sceneId, item.sceneId);
});
