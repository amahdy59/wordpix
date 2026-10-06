import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
const dir = join("src", "app", "data", "usage");
const files = (await readdir(dir)).filter((file) => file.endsWith(".usage.json"));
const lessons = (await Promise.all(files.map(async (file) => JSON.parse(await readFile(join(dir, file), "utf8"))))).flat();
const missing = lessons.flatMap((lesson) => lesson.usage.scenes.map((scene) => ({
  unitId: lesson.unitId,
  lessonId: lesson.lessonId,
  lessonName: lesson.lessonName,
  globalOrder: lesson.globalOrder,
  chunkNumber: scene.chunkNumber,
  targetWords: Array.isArray(scene.targetWords) ? scene.targetWords : [scene.targetWords],
  imageBrief: scene.imageBrief,
  imageAlt: scene.imageAlt ?? "",
})).filter((scene) => !lesson.usage.scenes.find((candidate) => candidate.chunkNumber === scene.chunkNumber)?.imagePath));
await writeFile("docs/USAGE_IMAGE_NEEDED_2026-10-06.json", `${JSON.stringify({ generatedAt: "2026-10-06", total: missing.length, items: missing }, null, 2)}\n`);
console.log(JSON.stringify({ total: missing.length, path: "docs/USAGE_IMAGE_NEEDED_2026-10-06.json" }));
