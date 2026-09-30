import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const usageDir = "src/app/data/usage";
const genericPatterns = [
  ["can-see-or-use", /\bcan see(?:, use, or do|, use, or meet| or use)\b/iu],
  ["deal-with", /\bdeal with\b/iu],
  ["different-part", /\bbelongs? to a different part\b/iu],
  ["naturally-belong", /\bnaturally belong in the same\b/iu],
  ["draws-attention", /\bdraws? attention to\b/iu],
  ["connects-words", /\bconnects? the words? to\b/iu],
  ["coherent-situation", /\bplaces? .+ in one coherent situation\b/iu],
  ["clear-role", /\bhas a clear role\b/iu],
  ["connected-to", /\bwith each word connected to\b/iu],
  ["uses-discusses", /\buses? or discusses?\b/iu],
  ["uses-notices", /\buses? or notices?\b/iu],
];

const normalize = (value) => value
  .normalize("NFKD")
  .replace(/\p{Mark}/gu, "")
  .toLocaleLowerCase()
  .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
  .trim();
const asArray = (value) => (Array.isArray(value) ? value : [value]);

const scenes = [];
for (const filename of (await readdir(usageDir)).filter((name) => name.endsWith(".usage.json"))) {
  const lessons = JSON.parse((await readFile(path.join(usageDir, filename), "utf8")).replace(/^\uFEFF/u, ""));
  for (const lesson of lessons) {
    for (const scene of asArray(lesson.usage.scenes)) {
      let frame = normalize(scene.scenario);
      for (const target of [...asArray(scene.targetWords)].sort((a, b) => b.length - a.length)) {
        frame = frame.replaceAll(normalize(target), "{target}");
      }
      scenes.push({
        lessonId: lesson.lessonId,
        unitId: lesson.unitId,
        globalOrder: lesson.globalOrder,
        cefr: lesson.cefrStage,
        scene: scene.chunkNumber,
        scenario: scene.scenario,
        frame,
        generic: genericPatterns.filter(([, pattern]) => pattern.test(scene.scenario)).map(([name]) => name),
      });
    }
  }
}

const frameCounts = new Map();
for (const scene of scenes) frameCounts.set(scene.frame, (frameCounts.get(scene.frame) ?? 0) + 1);
const repeatedFrames = [...frameCounts.entries()]
  .filter(([, count]) => count > 1)
  .sort((left, right) => right[1] - left[1]);
const genericScenes = scenes.filter((scene) => scene.generic.length > 0);
const completedRangeViolations = genericScenes.filter((scene) => scene.globalOrder <= 40);
const report = {
  generatedAt: new Date().toISOString(),
  totals: {
    lessons: new Set(scenes.map((scene) => scene.lessonId)).size,
    scenes: scenes.length,
    genericScenes: genericScenes.length,
    repeatedExactFrames: repeatedFrames.reduce((total, [, count]) => total + count, 0),
    uniqueRepeatedFrames: repeatedFrames.length,
    completedRangeViolations: completedRangeViolations.length,
  },
  genericByPattern: Object.fromEntries(
    genericPatterns.map(([name]) => [name, genericScenes.filter((scene) => scene.generic.includes(name)).length])
  ),
  genericByLevel: Object.fromEntries(
    [...new Set(genericScenes.map((scene) => scene.cefr))].map((level) => [level, genericScenes.filter((scene) => scene.cefr === level).length])
  ),
  topRepeatedFrames: repeatedFrames.slice(0, 30).map(([frame, count]) => ({ frame, count })),
  completedRangeViolations,
};
await writeFile("docs/usage-sentence-diversity-report.json", `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify(report.totals, null, 2));
if (completedRangeViolations.length > 0) process.exitCode = 1;
