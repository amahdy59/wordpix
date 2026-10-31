import fs from "node:fs/promises";
import path from "node:path";
import { createServer } from "vite";
import { digest, sceneVisualSupport } from "./lib/media_catalog.mjs";

// Resolve the same vocabulary, usage overlays and sentence media as the app.
// Output is audit data only; no source registries are written.
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, watch: null },
});
try {
  const load = (file) => server.ssrLoadModule(`/src/${file}`);
  const { COURSE_UNITS } = await load("app/data/courseCatalog.ts");
  const { loadUnitVocabulary } = await load("app/data/vocabulary.ts");
  const { loadLessonUsage } = await load("app/data/usageRegistry.ts");
  const { getRichSentence } = await load("app/exercises/exerciseContent.ts");
  const { resolveSentenceMedia } = await load("app/content/sentenceMedia.ts");
  const { getSuppliedSceneMedia } = await load("app/content/suppliedMedia.ts");
  const { isReviewedImageHeld } = await load("app/content/reviewedImageHolds.ts");
  const { resolveAssetUrl } = await load("utils/assetUrl.ts");
  const demands = [];
  const add = (item, imagePath) =>
    demands.push({
      ...item,
      demandId: `demand-${digest(JSON.stringify([item.kind, item.unitId, item.lessonId, item.wordId, item.text])).slice(0, 24)}`,
      resolvedUrl: imagePath ? resolveAssetUrl(imagePath) : null,
    });
  for (const [unitId, unit] of Object.entries(COURSE_UNITS)) {
    const words = new Map((await loadUnitVocabulary(unitId)).map((word) => [word.id, word]));
    for (const group of unit.groups) {
      const usage = await loadLessonUsage(group.id);
      for (const wordId of group.wordIds) {
        const word = words.get(wordId);
        if (!word) throw new Error(`Missing vocabulary: ${unitId}/${wordId}`);
        add({ kind: "vocabulary", unitId, lessonId: group.id, wordId, text: word.label }, word.img);
        const sentences = new Set([
          getRichSentence(word, usage).full,
          getRichSentence(word, usage, 1).full,
        ]);
        for (const text of sentences)
          add(
            { kind: "sentence", unitId, lessonId: group.id, wordId, text },
            resolveSentenceMedia(wordId, text, usage)?.imagePath
          );
      }
      for (const scene of usage?.usage.scenes ?? []) {
        const supplied = getSuppliedSceneMedia(group.id, scene);
        const support = sceneVisualSupport(
          scene,
          group.wordIds.map((id) => words.get(id))
        );
        add(
          {
            kind: "usage-scene",
            unitId,
            lessonId: group.id,
            wordId: `scene-${scene.chunkNumber}`,
            text: scene.scenario,
            generationHold: scene.imageGenerationHold ?? null,
            referenceOnly: supplied ? true : support.referenceOnly,
            imageSupport: supplied ? "word-reference" : support.imageSupport,
          },
          isReviewedImageHeld(
            "usage-scene",
            `scene-${scene.chunkNumber}`,
            scene.scenario,
            supplied?.imagePath ?? support.imagePath,
            group.id
          )
            ? undefined
            : (supplied?.imagePath ?? support.imagePath)
        );
      }
    }
  }
  const output = path.resolve("output/media-catalog");
  await fs.mkdir(output, { recursive: true });
  const unique = [...new Map(demands.map((d) => [d.demandId, d])).values()];
  await fs.writeFile(
    path.join(output, "demands.json"),
    JSON.stringify(
      {
        schemaVersion: 1,
        generatedAt: new Date().toISOString(),
        scope:
          "Runtime vocabulary, two sentence selections, and usage scenes including their rendered word-reference fallbacks for COURSE_UNITS. Reference-only support is identified separately and does not prove full scene-context coverage. Specialist/story coverage is reported separately; no complete semantic coverage claim.",
        demands: unique,
      },
      null,
      2
    ) + "\n"
  );
  console.log(
    JSON.stringify({
      demands: unique.length,
      assigned: unique.filter((d) => d.resolvedUrl).length,
      withoutAssignment: unique.filter((d) => !d.resolvedUrl).length,
      referenceOnlyUses: unique.filter((d) => d.referenceOnly).length,
    })
  );
} finally {
  await server.close();
}
