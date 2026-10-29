import fs from "node:fs/promises";
import { createServer } from "vite";
import { assetId, csvText, digest, objectKey, sceneVisualSupport } from "./lib/media_catalog.mjs";

const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, watch: null },
});
const rows = [];
const inventory = JSON.parse(await fs.readFile("output/media-catalog/r2-inventory.json", "utf8"));
const keys = new Set(inventory.keys);
try {
  const load = (file) => server.ssrLoadModule(`/src/${file}`);
  const { resolveAssetUrl } = await load("utils/assetUrl.ts");
  const add = (track, id, kind, text, imagePath, note = "") => {
    const url = imagePath ? resolveAssetUrl(imagePath) : null,
      key = objectKey(url);
    rows.push({
      contentId: `coverage-${digest(JSON.stringify([track, id, kind, text])).slice(0, 24)}`,
      track,
      sourceId: id,
      kind,
      text,
      resolvedUrl: url,
      imageKey: key,
      assetId: key ? assetId(key) : null,
      status: url
        ? keys.has(key)
          ? "assigned-unreviewed"
          : "local-or-unlisted-reference"
        : "visual-purpose-review-required",
      note,
    });
  };
  const { BUSINESS_UNITS } = await load("app/learning/business/businessCatalog.ts");
  for (const unit of BUSINESS_UNITS) {
    add("business", unit.id, "course-card", unit.title, unit.heroImageSrc);
    for (const word of unit.languageBank)
      add(
        "business",
        `${unit.id}/${word.id}`,
        "vocabulary",
        word.term,
        word.imageSrc,
        `Example: ${word.example}. The vocabulary illustration is not proof of an exact-sentence visual.`
      );
    for (const exercise of unit.exercises)
      add(
        "business",
        `${unit.id}/${exercise.id}`,
        "exercise-prompt",
        exercise.question,
        null,
        "Review pedagogical purpose before requesting an image for this prompt."
      );
  }
  const { CONVERSATION_UNITS } = await load("app/learning/conversation/conversationCatalog.ts");
  for (const unit of CONVERSATION_UNITS) {
    add("conversation", unit.id, "course-card", unit.title, unit.heroImage);
    for (const word of unit.languageBank)
      add(
        "conversation",
        `${unit.id}/${word.id}`,
        "vocabulary",
        word.term,
        word.imageSrc,
        `Example: ${word.example}. A word reference does not establish coverage of the complete example.`
      );
    for (const exercise of unit.quiz)
      add(
        "conversation",
        `${unit.id}/${exercise.id}`,
        "exercise-prompt",
        exercise.question,
        null,
        "A prompt may need text rather than a new illustration; review purpose first."
      );
  }
  const { FIGMA_PRONUNCIATION_LESSONS, pronunciationImagePath } = await load(
    "app/learning/foundations/figmaPronunciationCatalog.ts"
  );
  for (const lesson of FIGMA_PRONUNCIATION_LESSONS)
    for (const image of lesson.images)
      add(
        "pronunciation",
        `${lesson.nodeId}/${image.imageRef}/${image.role}`,
        "authored-image",
        image.label,
        pronunciationImagePath(image.imageRef),
        `Authored role: ${image.role}. Semantic and phonetic contrast review remains necessary.`
      );
  const { FIGMA_HADITH_LESSONS, getHadithVisualVocabulary } = await load(
    "app/learning/hadith/figmaHadithCatalog.ts"
  );
  const { parseHadithVocabulary } = await load("app/learning/hadith/hadithVocabularyContent.ts");
  const normalizeLabel = (label) =>
    label
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  for (const lesson of FIGMA_HADITH_LESSONS) {
    let lines = lesson.stages.vocabulary.text;
    if (lesson.number === 18) {
      const reading = lesson.stages["read-listen"]?.text ?? [];
      const start = reading.findIndex((line) => /^phrasal verbs/i.test(line));
      if (start >= 0) lines = [...lines, ...reading.slice(start)];
    }
    const vocabulary = parseHadithVocabulary(lines, lesson.number);
    const visuals = getHadithVisualVocabulary(
      vocabulary.map((term) => term.term),
      lesson.number
    );
    for (const term of vocabulary) {
      const image = visuals.find(
        (candidate) => normalizeLabel(candidate.label.split("·")[0]) === normalizeLabel(term.term)
      );
      add(
        "hadith",
        `${lesson.id}/${term.term}`,
        "vocabulary",
        term.term,
        image ? `hadith/v1/images/${image.imageRef}.png` : null,
        "Uses the active HadithVocabularyStage parser, lesson-specific text and exact normalized visual-label matching."
      );
    }
  }
  const { COURSE_UNITS } = await load("app/data/courseCatalog.ts");
  const { loadUnitVocabulary } = await load("app/data/vocabulary.ts");
  const { loadLessonStory } = await load("app/data/lessonStoryLoader.ts");
  const { loadLessonUsage } = await load("app/data/usageRegistry.ts");
  for (const [unitId, unit] of Object.entries(COURSE_UNITS)) {
    const words = await loadUnitVocabulary(unitId);
    for (const group of unit.groups) {
      const passage = await loadLessonStory(group.id);
      const groupWords = group.wordIds.map((id) => words.find((w) => w.id === id)).filter(Boolean);
      if (passage)
        add(
          "core-story",
          group.id,
          "passage-hero",
          passage,
          groupWords[0]?.img,
          "The app uses the first vocabulary image as the story hero; this is reference support, not proof of passage-context illustration."
        );
      const usage = await loadLessonUsage(group.id);
      for (const scene of usage?.usage.scenes ?? []) {
        const support = sceneVisualSupport(scene, groupWords);
        add(
          "core-story",
          `${group.id}/scene-${scene.chunkNumber}`,
          "scene-rendered-support",
          scene.scenario,
          support.imagePath,
          scene.imagePath
            ? "Direct overlaid scene media; semantic review required."
            : support.imagePath
              ? "Runtime word-reference fallback exists. Full scene-context coverage is not established."
              : "No direct image or matching word-reference fallback."
        );
      }
    }
  }
  const unique = [...new Map(rows.map((r) => [r.contentId, r])).values()];
  const summary = {
    generatedAt: new Date().toISOString(),
    inventoryCapturedAt: inventory.capturedAt,
    scope:
      "Specialist course cards, vocabulary and quiz prompts; pronunciation authored visuals; Hadith vocabulary; core story hero and rendered usage-scene support. Prompts without images require a visual-purpose decision, not automatic generation.",
    tracks: Object.fromEntries(
      [...new Set(unique.map((r) => r.track))].map((track) => {
        const items = unique.filter((r) => r.track === track);
        return [
          track,
          {
            uses: items.length,
            assigned: items.filter((r) => r.resolvedUrl).length,
            purposeReview: items.filter((r) => !r.resolvedUrl).length,
          },
        ];
      })
    ),
    completeSemanticAudit: false,
  };
  await fs.writeFile(
    "output/media-catalog/additional-visual-coverage.json",
    JSON.stringify({ schemaVersion: 1, summary, uses: unique }, null, 2) + "\n"
  );
  await fs.writeFile(
    "output/media-catalog/additional-visual-coverage.csv",
    csvText(unique, [
      "contentId",
      "track",
      "sourceId",
      "kind",
      "text",
      "status",
      "imageKey",
      "assetId",
      "note",
    ])
  );
  console.log(JSON.stringify(summary, null, 2));
} finally {
  await server.close();
}
