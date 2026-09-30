import { access, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, "..");
const USAGE_DIR = path.join(ROOT, "src", "app", "data", "usage");
const PUBLIC_DIR = path.join(ROOT, "public");
const DOCS_DIR = path.join(ROOT, "docs");
const CHECK_ONLY = process.argv.includes("--check");

const LEVEL_ORDER = ["Pre-A1", "A1", "A2", "B1", "B2", "C1", "C2"];
const PRIORITY_ORDER = { A2: 1, B1: 2, B2: 3, C1: 4, A1: 5, "Pre-A1": 6, C2: 7 };
const GENERIC_SCENARIO_PATTERNS = [
  /\bdeal with\b/iu,
  /\bbelongs? to a different part\b/iu,
  /\bnaturally belong in the same\b/iu,
  /\bdraws? attention to\b/iu,
  /\bconnects? the words? to\b/iu,
  /\bplaces? .+ in one coherent situation\b/iu,
  /\bhas a clear role\b/iu,
  /\bwith each word connected to\b/iu,
  /\buses? or discusses?\b/iu,
  /\buses? or notices?\b/iu,
  /\bcan see, use, or do\b/iu,
  /\bcan see or use\b/iu,
];
const IMAGE_HEADERS = [
  "scene_id",
  "production_priority",
  "production_status",
  "unit_id",
  "unit_name",
  "unit_order",
  "lesson_id",
  "lesson_name",
  "lesson_order",
  "global_order",
  "cefr",
  "scene_number",
  "image_name",
  "image_path",
  "short_name",
  "target_words",
  "scenario",
  "image_brief",
  "generation_prompt",
  "image_alt",
  "alt_text_status",
  "check_question",
  "check_answer",
  "check_options",
  "content_issue",
];
const PLAN_HEADERS = [
  "lesson_id",
  "unit_id",
  "unit_name",
  "unit_order",
  "lesson_name",
  "lesson_order",
  "global_order",
  "core_cefr",
  "level_up_cefr",
  "advanced_cefr",
  "target_count",
  "scene_count",
  "exercise_count",
  "image_count",
  "missing_image_count",
  "content_issue_count",
  "editorial_status",
  "next_action",
];

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

function asArray(value) {
  return Array.isArray(value) ? value : value == null ? [] : [value];
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\r\n]/u.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function toCsv(headers, rows) {
  return `${[headers, ...rows.map((row) => headers.map((header) => row[header]))]
    .map((row) => row.map(csvCell).join(","))
    .join("\n")}\n`;
}

function markdownTable(headers, rows, rightAligned = []) {
  const widths = headers.map((header, index) =>
    Math.max(header.length, ...rows.map((row) => String(row[index]).length), 3)
  );
  const formatRow = (row, alignRight) =>
    `| ${row
      .map((cell, index) =>
        alignRight && rightAligned.includes(index)
          ? String(cell).padStart(widths[index])
          : String(cell).padEnd(widths[index])
      )
      .join(" | ")} |`;
  const separator = widths.map((width, index) =>
    rightAligned.includes(index) ? `${"-".repeat(width - 1)}:` : "-".repeat(width)
  );
  return [
    formatRow(headers, false),
    formatRow(separator, false),
    ...rows.map((row) => formatRow(row, true)),
  ].join("\n");
}

function progressionLevel(level, step) {
  const start = LEVEL_ORDER.indexOf(level);
  invariant(start >= 0, `Unknown CEFR level: ${level}`);
  const levelUpStart = Math.max(start + 1, LEVEL_ORDER.indexOf("A2"));
  return LEVEL_ORDER[Math.min(levelUpStart + step - 1, LEVEL_ORDER.indexOf("C1"))];
}

function normalizeImagePath(imagePath) {
  return imagePath.replace(/^\.\//u, "").replaceAll("/", path.sep);
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readLessons() {
  const filenames = (await readdir(USAGE_DIR))
    .filter((name) => name.endsWith(".usage.json"))
    .sort();
  const lessons = [];
  for (const filename of filenames) {
    const source = await readFile(path.join(USAGE_DIR, filename), "utf8");
    const parsed = JSON.parse(source.replace(/^\uFEFF/u, ""));
    invariant(Array.isArray(parsed) && parsed.length > 0, `${filename} must contain lessons.`);
    lessons.push(...parsed);
  }
  return lessons.sort((left, right) => left.globalOrder - right.globalOrder);
}

function validateLesson(lesson, sceneIds) {
  invariant(lesson.lessonId, "A lesson is missing lessonId.");
  invariant(lesson.unitId, `${lesson.lessonId} is missing unitId.`);
  invariant(
    asArray(lesson.targetWordsEnglish).length > 0,
    `${lesson.lessonId} has no target words.`
  );
  invariant(asArray(lesson.usage?.scenes).length > 0, `${lesson.lessonId} has no usage scenes.`);
  for (const scene of asArray(lesson.usage.scenes)) {
    const sceneId = `${lesson.lessonId}-usage-scene-${scene.chunkNumber}`;
    invariant(!sceneIds.has(sceneId), `Duplicate scene ID: ${sceneId}`);
    sceneIds.add(sceneId);
    invariant(scene.scenario?.trim(), `${sceneId} has no scenario.`);
    invariant(scene.imageBrief?.trim(), `${sceneId} has no image brief.`);
    invariant(scene.check?.question?.trim(), `${sceneId} has no check question.`);
    invariant(asArray(scene.check.options).length > 0, `${sceneId} has no answer options.`);
  }
}

function issueFor(scene) {
  const issues = [];
  if (GENERIC_SCENARIO_PATTERNS.some((pattern) => pattern.test(scene.scenario))) {
    issues.push("generic or repetitive scenario requires editorial rewrite");
  }
  if (!asArray(scene.check.options).includes(scene.check.expectedAnswer)) {
    issues.push("expected answer is not in authored options");
  }
  if (scene.imagePath && !scene.imageAlt) issues.push("linked image has no alt text");
  return issues.join("; ");
}

function imagePrompt(lesson, scene) {
  return [
    `Create one clean, realistic, adult-oriented 4:3 learning scene for ${lesson.unitName}.`,
    `Represent these targets clearly and with equal visual importance: ${asArray(scene.targetWords).join(", ")}.`,
    scene.imageBrief.trim(),
    "Keep the main subjects safely centered for object-cover cropping.",
    "Use a natural contemporary setting and avoid stereotypes or child-oriented styling.",
    "Do not include visible words, letters, numerals, captions, labels, borders, logos, or watermarks.",
    "Do not visually reveal which option answers the assessment question.",
  ].join(" ");
}

async function buildRows(lessons) {
  const imageRows = [];
  const planRows = [];
  const sceneIds = new Set();

  for (const lesson of lessons) {
    validateLesson(lesson, sceneIds);
    const scenes = asArray(lesson.usage.scenes);
    let existingImages = 0;
    let issueCount = 0;

    for (const scene of scenes) {
      const sceneId = `${lesson.lessonId}-usage-scene-${scene.chunkNumber}`;
      const filename = scene.imagePath
        ? path.posix.basename(scene.imagePath)
        : `${lesson.lessonId}-scene-${scene.chunkNumber}.avif`;
      const imagePath = scene.imagePath ?? `./learning-scenes/${lesson.unitId}/${filename}`;
      const filePresent = await exists(path.join(PUBLIC_DIR, normalizeImagePath(imagePath)));
      const issue = issueFor(scene);
      if (scene.imagePath && filePresent) existingImages += 1;
      if (issue) issueCount += 1;

      const productionStatus = issue
        ? "content revision required"
        : scene.imagePath
          ? filePresent
            ? "complete"
            : "linked file missing"
          : "editorial review required";

      imageRows.push({
        scene_id: sceneId,
        production_priority: PRIORITY_ORDER[lesson.cefrStage] ?? 99,
        production_status: productionStatus,
        unit_id: lesson.unitId,
        unit_name: lesson.unitName,
        unit_order: lesson.unitOrder,
        lesson_id: lesson.lessonId,
        lesson_name: lesson.lessonName,
        lesson_order: lesson.lessonOrderInUnit,
        global_order: lesson.globalOrder,
        cefr: lesson.cefrStage,
        scene_number: scene.chunkNumber,
        image_name: filename,
        image_path: imagePath,
        short_name: `${lesson.unitName} — ${lesson.lessonName} — Scene ${scene.chunkNumber}`,
        target_words: asArray(scene.targetWords).join(" | "),
        scenario: scene.scenario,
        image_brief: scene.imageBrief,
        generation_prompt: imagePrompt(lesson, scene),
        image_alt: scene.imageAlt ?? "",
        alt_text_status: scene.imageAlt ? "reviewed draft" : "needed after image selection",
        check_question: scene.check.question,
        check_answer: scene.check.expectedAnswer,
        check_options: asArray(scene.check.options).join(" | "),
        content_issue: issue,
      });
    }

    planRows.push({
      lesson_id: lesson.lessonId,
      unit_id: lesson.unitId,
      unit_name: lesson.unitName,
      unit_order: lesson.unitOrder,
      lesson_name: lesson.lessonName,
      lesson_order: lesson.lessonOrderInUnit,
      global_order: lesson.globalOrder,
      core_cefr: lesson.cefrStage,
      level_up_cefr: progressionLevel(lesson.cefrStage, 1),
      advanced_cefr: progressionLevel(lesson.cefrStage, 2),
      target_count: asArray(lesson.targetWordsEnglish).length,
      scene_count: scenes.length,
      exercise_count: lesson.exercises.length,
      image_count: existingImages,
      missing_image_count: scenes.length - existingImages,
      content_issue_count: issueCount,
      editorial_status:
        issueCount === 0 ? "baseline present; enrichment needed" : "repair before enrichment",
      next_action:
        issueCount === 0
          ? "Review core senses and collocations, then author optional level-up and advanced uses."
          : "Fix deterministic answer or media metadata issues before editorial enrichment.",
    });
  }

  imageRows.sort(
    (left, right) =>
      left.production_priority - right.production_priority ||
      left.global_order - right.global_order ||
      left.scene_number - right.scene_number
  );
  return { imageRows, planRows };
}

function summaryMarkdown(lessons, imageRows, planRows) {
  const complete = imageRows.filter((row) => row.production_status === "complete").length;
  const linkedMissing = imageRows.filter(
    (row) => row.production_status === "linked file missing"
  ).length;
  const issues = imageRows.filter((row) => row.content_issue).length;
  const levelRows = LEVEL_ORDER.filter((level) => level !== "C2").map((level) => {
    const levelLessons = planRows.filter((row) => row.core_cefr === level);
    const levelScenes = imageRows.filter((row) => row.cefr === level);
    const levelComplete = levelScenes.filter((row) => row.production_status === "complete").length;
    return [
      level,
      levelLessons.length,
      levelScenes.length,
      levelComplete,
      levelScenes.length - levelComplete,
    ];
  });
  const inventoryTable = markdownTable(
    ["Measure", "Count"],
    [
      ["Units", new Set(lessons.map((lesson) => lesson.unitId)).size],
      ["Lessons with usage sections", lessons.length],
      ["Usage scenes / required scene images", imageRows.length],
      ["Complete linked images", complete],
      ["Images still required", imageRows.length - complete],
      ["Linked image files missing", linkedMissing],
      ["Scenes flagged for content review", issues],
    ],
    [1]
  );
  const levelTable = markdownTable(
    ["Core CEFR", "Lessons", "Scenes", "Images complete", "Images required"],
    levelRows,
    [1, 2, 3, 4]
  );

  return `# Usage content and image production inventory

Generated from the production usage JSON. Do not edit generated counts by hand. Run \`pnpm content:usage:manifests\` after usage content changes.

## Current inventory

${inventoryTable}

${levelTable}

## Working files

- \`docs/usage-image-manifest.csv\`: one stable row per usage scene and required 4:3 image.
- \`docs/usage-authoring-plan.csv\`: one row per lesson with the proposed Core, Level up, and Advanced CEFR layers.

## Editorial model

1. **Core use** is required, assessed, and written at the lesson's current CEFR band.
2. **Level up** is a proposed optional authoring target, starting at A2 or above and capped at C1. It is not a verified label for existing text.
3. **Advanced** is a proposed optional authoring target, capped at C1. Each new sense and task needs its own level review.
4. Every new use needs a stable usage ID, an exact sense, a natural pattern or collocation, register, spoken/written scope, frequency evidence, and human editorial approval.
5. Images belong to the scene, not to an answer option. They must support comprehension without revealing the assessed answer.

## Production order

Work in this order: A2, B1, B2, C1, A1, then Pre-A1. Within a level, follow \`global_order\`. Complete content repair and editorial review before generating an image so visual work is not wasted on a scene that later changes.

Rows marked \`editorial review required\` have only passed automated checks. Rows marked \`complete\` have a linked image file; this does not certify content quality. Follow [the source and evidence policy](USAGE_SOURCE_AND_EVIDENCE_POLICY.md) before approving any new image brief.

## Safety

This inventory proposes local \`public/learning-scenes/\` paths only. It does not upload, rename, delete, or change any R2 content-ID mapping.
`;
}

async function writeOrCheck(filePath, content) {
  if (CHECK_ONLY) {
    const existing = await readFile(filePath, "utf8").catch(() => "");
    invariant(existing === content, `${path.relative(ROOT, filePath)} is stale.`);
    return;
  }
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content, "utf8");
}

const lessons = await readLessons();
const { imageRows, planRows } = await buildRows(lessons);
invariant(lessons.length === 864, `Expected 864 lessons; found ${lessons.length}.`);
invariant(new Set(lessons.map((lesson) => lesson.unitId)).size === 200, "Expected 200 units.");

await writeOrCheck(
  path.join(DOCS_DIR, "usage-image-manifest.csv"),
  toCsv(IMAGE_HEADERS, imageRows)
);
await writeOrCheck(path.join(DOCS_DIR, "usage-authoring-plan.csv"), toCsv(PLAN_HEADERS, planRows));
await writeOrCheck(
  path.join(DOCS_DIR, "USAGE_CONTENT_AND_IMAGE_INVENTORY.md"),
  summaryMarkdown(lessons, imageRows, planRows)
);

console.log(
  `${CHECK_ONLY ? "Verified" : "Generated"} ${lessons.length} lesson plans and ${imageRows.length} scene-image rows.`
);
