import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { imageTextPolicy } from "./reference_image_text.mjs";
import {
  applyLessonLearningContexts,
  applySceneLearningContext,
} from "../../src/app/data/sceneLearningContext.mjs";

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
export function contentDigest(lesson, phrases, bilingual = {}) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify({ lesson, phrases, bilingual }))
    .digest("hex");
}
export function referenceGenerationPrompt(scene) {
  const textPolicy = imageTextPolicy(scene.imageSymbols, scene.imageLabels);
  if (scene.imageLabels !== undefined)
    return `Create one clear educational visual for adult English vocabulary. Concept: ${scene.check.expectedAnswer}. ${scene.imageBrief} Use a polished editorial educational illustration, realistic proportions, calm natural colors, uncluttered pale background, strong dark readable labels and landscape 4:3 composition. Minimum people needed; every person must be an adult man in modest clothing. Absolutely no women, girls, children or female silhouettes, including posters or screens. ${textPolicy} Labels explain vocabulary and must not invent medical treatment, identity or coverage. No commercial branding or watermarks. Return exactly one image.`;
  return `Create one realistic adult-learning vocabulary reference. Concept: ${scene.check.expectedAnswer}. ${scene.imageBrief} Prefer a human-free composition. Essential non-gender-specific roles use one modest adult man; any indispensable woman wears hijab covering hair and neck, loose opaque full-length clothing and long sleeves. No incidental people, arrows, circles or answer highlighting. ${textPolicy} 4:3 landscape; preserve meaningful details at mobile size. Return one image.`;
}
export function loadGenerationReviews(sourceRoot, reviewFile) {
  const directory = path.join(sourceRoot, "docs/content-review");
  const files = reviewFile
    ? [path.resolve(reviewFile)]
    : fs.existsSync(directory)
      ? fs
          .readdirSync(directory)
          .filter((f) => f.endsWith("-review.json"))
          .sort()
          .map((f) => path.join(directory, f))
      : [];
  const seen = new Set();
  return files.flatMap((file) => {
    const data = JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
    if (!Array.isArray(data.items)) throw new Error(`Review file needs an items array: ${file}`);
    for (const review of data.items) {
      const identity = `${review.unitId}/${review.lessonId}`;
      if (seen.has(identity)) throw new Error(`Duplicate lesson review: ${identity}`);
      seen.add(identity);
    }
    return data.items;
  });
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
  const rawLesson = read(
    path.join(sourceRoot, "src/app/data/usage", `${item.unitId}.usage.json`)
  ).find((entry) => entry.lessonId === item.lessonId);
  if (!rawLesson) throw new Error(`Unknown lesson: ${item.lessonId}`);
  const lesson = applyLessonLearningContexts(rawLesson);
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
  const bilingualFile = path.join(sourceRoot, "src/app/data/bilingual", `${item.unitId}.json`);
  const bilingual = fs.existsSync(bilingualFile) ? read(bilingualFile) : {};
  return {
    lesson,
    scene,
    phrases,
    bilingual,
    digest: contentDigest(rawLesson, phrases, bilingual),
  };
}
export function contentIssues(lesson, phrases) {
  const staleContexts = lesson.usage.scenes.filter(
    (scene) => scene.learningContext && applySceneLearningContext(scene) === scene
  );
  lesson = applyLessonLearningContexts(lesson);
  const issues = staleContexts.map(
    (scene) => `${lesson.lessonId}-usage-scene-${scene.chunkNumber}: stale written-task anchor`
  );
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
    try {
      referenceGenerationPrompt(scene);
    } catch {
      issues.push(`${id}: invalid reviewed image symbols`);
    }
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
export function assertLessonReviewReady(item, sourceRoot) {
  const source = loadGenerationSource(item, sourceRoot);
  const issues = contentIssues(source.lesson, source.phrases);
  if (issues.length) throw new Error(`Content repair required: ${issues.join("; ")}`);
  const review = item.contentReview;
  const reviewDate = new Date(review?.reviewedAt ?? "");
  if (
    !review ||
    review.status !== "approved" ||
    review.unitId !== item.unitId ||
    review.lessonId !== item.lessonId ||
    review.lessonSha256 !== source.digest ||
    typeof review.reviewedBy !== "string" ||
    !review.reviewedBy.trim() ||
    !/^\d{4}-\d{2}-\d{2}$/.test(review.reviewedAt ?? "") ||
    !Number.isFinite(reviewDate.getTime()) ||
    reviewDate.toISOString().slice(0, 10) !== review.reviewedAt ||
    review.reviewedAt > new Date().toISOString().slice(0, 10) ||
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

export function assertGenerationReady(item, sourceRoot) {
  const source = assertLessonReviewReady(item, sourceRoot);
  if (source.scene.imageGenerationHold)
    throw new Error(`Image generation held: ${item.sceneId}: ${source.scene.imageGenerationHold}`);
  return source;
}
