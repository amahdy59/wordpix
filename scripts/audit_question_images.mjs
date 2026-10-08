import { readdir, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createServer } from "vite";

// Read-only inventory. This script never writes asset files or content mappings.
const directory = "src/app/data/usage";
const files = (await readdir(directory)).filter((file) => file.endsWith(".usage.json"));
const items = [];
let totalScenes = 0;
const server = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, watch: null } });
const { loadUnitUsageForEditorial } = await server.ssrLoadModule("/src/app/data/usageRegistry.ts");
try {
for (const file of files) {
  const lessons = await loadUnitUsageForEditorial(file.replace(/\.usage\.json$/, ""));
  if (!lessons) throw new Error(`Invalid curriculum usage: ${file}`);
  for (const lesson of lessons) {
    for (const scene of lesson.usage.scenes) {
      totalScenes++;
      let reason = !scene.imagePath ? "missing-scene-image" : !scene.imageAlt ? "missing-image-description" : "";
      const verifiedKey = /^(?:usage-illustrations|question-images)\/v1\/[a-z0-9-]+\/[a-f0-9]{64}\.webp$/u.test(scene.imagePath ?? "");
      if (scene.imagePath && !verifiedKey && !/^https?:/u.test(scene.imagePath)) {
        const localPath = resolve("public", scene.imagePath.replace(/^\.?\//u, ""));
        try {
          if ((await stat(localPath)).size === 0) reason = "empty-image-file";
        } catch { reason = "missing-image-file"; }
      }
      if (!reason) continue;
      items.push({
        unitId: lesson.unitId, lessonId: lesson.lessonId,
        sceneId: `${lesson.lessonId}-usage-scene-${scene.chunkNumber}`,
        targetWords: scene.targetWords, reason,
        scenario: scene.scenario, question: scene.check.question,
        expectedAnswer: scene.check.expectedAnswer,
        existingImagePath: scene.imagePath ?? "",
        generationPrompt: `${scene.imageBrief}\nRepresent this exact context: ${scene.scenario}\nAdult learner scene. Preserve every quantity, position, object, and color specified. Show the complete scene without cropping critical clues. No captions, answer words, watermarks, or decorative numerals.`,
      });
    }
  }
}
} finally { await server.close(); }
const report = { totalScenes, imagesNeeded: items.length,
  scope: "Effective curriculum usage scenes from the production editorial loader, including reviewed media overlays and content not yet released. Content-hashed media keys have separate remote-verification receipts. Other existing images still need semantic review. Sentence-specific artwork must match the exact sentence; vocabulary artwork is not a substitute.", items };
await writeFile("docs/question-image-inventory.json", `${JSON.stringify(report, null, 2)}\n`);
const columns = ["sceneId", "unitId", "lessonId", "reason", "scenario", "question", "expectedAnswer", "generationPrompt"];
const csv = (value) => `"${String(value).replaceAll('"', '""')}"`;
await writeFile("docs/question-image-inventory.csv", [columns.join(","), ...items.map((item) => columns.map((column) => csv(item[column])).join(","))].join("\n") + "\n");
const priority = items.filter((item) => /^(numbers-counting|colors)-\d+$/u.test(item.lessonId));
await writeFile("docs/question-image-priority.csv", [columns.join(","), ...priority.map((item) => columns.map((column) => csv(item[column])).join(","))].join("\n") + "\n");
console.log(JSON.stringify({ totalScenes, imagesNeeded: items.length, report: "docs/question-image-inventory.csv" }));
