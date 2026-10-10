import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const generationReviewChecks = [
  "scenarios",
  "questions",
  "reading",
  "exercises",
  "imageBriefs",
  "cefr",
  "arabic",
  "phrases",
];
export function contentDigest(lesson, phrases) {
  return crypto.createHash("sha256").update(JSON.stringify({ lesson, phrases })).digest("hex");
}
export function loadGenerationSource(item, sourceRoot) {
  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.unitId ?? "") ||
    !new RegExp(`^${item.unitId}-[1-9][0-9]*$`).test(item.lessonId ?? "") ||
    !new RegExp(`^${item.lessonId}-usage-scene-[1-9][0-9]*$`).test(item.sceneId ?? "")
  ) {
    throw new Error("Invalid unit, lesson or scene identity.");
  }
  const read = (file) => JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
  const lesson = read(
    path.join(sourceRoot, "src/app/data/usage", `${item.unitId}.usage.json`)
  ).find((entry) => entry.lessonId === item.lessonId);
  if (!lesson) throw new Error(`Unknown lesson: ${item.lessonId}`);
  const phraseFile = path.join(
    sourceRoot,
    "src/app/data/usagePhrases",
    `${item.unitId}.phrases.json`
  );
  const phrases = fs.existsSync(phraseFile)
    ? read(phraseFile).filter((entry) => entry.lessonId === item.lessonId)
    : [];
  const scene = lesson.usage.scenes.find(
    (entry) => `${lesson.lessonId}-usage-scene-${entry.chunkNumber}` === item.sceneId
  );
  if (!scene) throw new Error(`Unknown scene: ${item.sceneId}`);
  return { lesson, scene, phrases, digest: contentDigest(lesson, phrases) };
}
export function contentIssues(lesson, phrases) {
  const issues = [];
  const generic =
    /\b(?:deal with|belongs? to a different part|naturally belong in the same|connects? the words? to|lesson vocabulary accurately|real-world responsibility|the role of each term|notices .+while also considering|adult workplace or travel situation|the next step focuses on|during a routine .+ task|selects .+ for the next step)\b/iu;
  for (const scene of lesson.usage.scenes) {
    const id = `${lesson.lessonId}-usage-scene-${scene.chunkNumber}`;
    if (generic.test(scene.scenario)) issues.push(`${id}: generic scenario`);
    if (
      !scene.check.options.includes(scene.check.expectedAnswer) ||
      new Set(scene.check.options).size !== scene.check.options.length
    )
      issues.push(`${id}: invalid answer options`);
    if (
      /which (?:target .+notice first|option is the focus|option best identifies|option does the person select for the next step)/iu.test(
        scene.check.question
      )
    )
      issues.push(`${id}: unsupported or template question`);
    if (!scene.imageBrief?.trim() || !scene.imageAlt?.trim())
      issues.push(`${id}: missing image brief or alternative`);
  }
  if (generic.test(lesson.reading.text)) issues.push(`${lesson.lessonId}: generic reading`);
  if (/\bthe the\b/iu.test(JSON.stringify(lesson)))
    issues.push(`${lesson.lessonId}: repeated article`);
  if (/\ba adult\b/iu.test(JSON.stringify(lesson)))
    issues.push(`${lesson.lessonId}: incorrect indefinite article`);
  if (/\bundefined\b/iu.test(JSON.stringify(lesson)))
    issues.push(`${lesson.lessonId}: undefined content`);
  if (!lesson.exercises.length || lesson.exercises.some((e) => !e.answer?.trim()))
    issues.push(`${lesson.lessonId}: missing exercise answer`);
  if (
    lesson.exercises.some((e) =>
      /^(?:the main case described|the outcome or response|a practical situation related to the unit|the task or situation described)$/iu.test(
        e.answer
      )
    )
  )
    issues.push(`${lesson.lessonId}: generic assessment answer`);
  for (const phrase of phrases) {
    if (
      /Keep the key words together|normal statement or question word order|check whether an object can separate/iu.test(
        phrase.pattern
      )
    )
      issues.push(`${phrase.id}: unreviewed grammar template`);
  }
  return issues;
}
export function assertGenerationReady(item, sourceRoot) {
  const source = loadGenerationSource(item, sourceRoot);
  const issues = contentIssues(source.lesson, source.phrases);
  if (issues.length) throw new Error(`Content repair required: ${issues.join("; ")}`);
  const review = item.contentReview;
  if (
    !review ||
    review.status !== "approved" ||
    review.lessonSha256 !== source.digest ||
    typeof review.reviewedBy !== "string" ||
    !review.reviewedBy.trim() ||
    !/^\d{4}-\d{2}-\d{2}$/.test(review.reviewedAt ?? "") ||
    generationReviewChecks.some((check) => review.checks?.[check] !== "approved") ||
    !Array.isArray(review.sources) ||
    new Set(review.sources).size < 2 ||
    review.sources.some((url) => {
      try {
        return new URL(url).protocol !== "https:";
      } catch {
        return true;
      }
    })
  ) {
    throw new Error(`Current whole-lesson generation review required: ${item.sceneId}`);
  }
  return source;
}
