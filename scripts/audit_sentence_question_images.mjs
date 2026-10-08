import { createServer } from "vite";
import { writeFile } from "node:fs/promises";

// Evaluate the same authored/example/context sentence selection as the app.
// Vite supplies import.meta.glob for the read-only curriculum registries.
const server = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, watch: null } });
try {
  const { COURSE_UNITS } = await server.ssrLoadModule("/src/app/data/courseCatalog.ts");
  const { loadUnitVocabulary } = await server.ssrLoadModule("/src/app/data/vocabulary.ts");
  const { loadLessonUsage } = await server.ssrLoadModule("/src/app/data/usageRegistry.ts");
  const { getRichSentence } = await server.ssrLoadModule("/src/app/exercises/exerciseContent.ts");
  const { getAuthoredSentence } = await server.ssrLoadModule("/src/app/exercises/content/authoredLessonContent.ts");
  const rows = [];
  let assessedSentences = 0;
  for (const [unitId, unit] of Object.entries(COURSE_UNITS)) {
    const words = await loadUnitVocabulary(unitId);
    const byId = new Map(words.map((word) => [word.id, word]));
    for (const group of unit.groups) {
      const usage = await loadLessonUsage(group.id);
      for (const id of group.wordIds) {
        const word = byId.get(id);
        if (!word) throw new Error(`Missing vocabulary ${unitId}/${id}`);
        const sentences = new Map([
          [getRichSentence(word, usage).full, "gap-fill"],
          [getRichSentence(word, usage, 1).full, "sentence-builder"],
        ]);
        for (const [sentence, stage] of sentences) {
          assessedSentences++;
          const authored = getAuthoredSentence(id);
          const hasMedia = authored?.full === sentence && authored.media || usage?.usage.scenes.some(
            (scene) => scene.imagePath && scene.imageAlt && scene.scenario.includes(sentence)
          );
          if (hasMedia) continue;
          rows.push({ questionId: `${group.id}:${id}:${stage}`, unitId, lessonId: group.id,
            wordId: id, word: word.label, stage, sentence,
            generationPrompt: `Illustrate exactly: ${sentence} Adult learning context. Preserve the specified objects, quantities, colors, positions, and actions. No written answer, captions, decorative numbers, or watermarks. Keep all visual clues in frame.` });
        }
      }
    }
  }
  const columns = ["questionId", "unitId", "lessonId", "wordId", "word", "stage", "sentence", "generationPrompt"];
  const csv = (value) => `"${String(value).replaceAll('"', '""')}"`;
  await writeFile("docs/question-sentence-image-inventory.csv", [columns.join(","), ...rows.map(
    (row) => columns.map((column) => csv(row[column])).join(",")
  )].join("\n") + "\n");
  const priority = rows.filter((row) => ["numbers-counting", "colors"].includes(row.unitId));
  await writeFile("docs/question-sentence-image-priority.csv", [columns.join(","), ...priority.map(
    (row) => columns.map((column) => csv(row[column])).join(",")
  )].join("\n") + "\n");
  console.log(JSON.stringify({ assessedSentences, missingSentenceImages: rows.length,
    report: "docs/question-sentence-image-inventory.csv" }));
} finally {
  await server.close();
}
