import fs from 'node:fs';
import path from 'node:path';

const tasks = JSON.parse(fs.readFileSync('output/deck3_tasks.json', 'utf8'));
const usageSceneTasks = tasks.filter(t => (t.contentId || '').includes('usage-scene'));
console.log(`Usage scene tasks: ${usageSceneTasks.length}`);

const USAGE_DIR = 'src/app/data/usage';
let matchCount = 0;
let missingUsageFileCount = 0;
let sceneNotFoundCount = 0;

for (const task of usageSceneTasks) {
  const unitFile = path.join(USAGE_DIR, `${task.unit}.usage.json`);
  if (!fs.existsSync(unitFile)) {
    missingUsageFileCount++;
    continue;
  }
  const lessons = JSON.parse(fs.readFileSync(unitFile, 'utf8'));
  const lesson = lessons.find(l => l.lessonId === task.lesson);
  if (!lesson) {
    sceneNotFoundCount++;
    continue;
  }
  const scene = lesson.usage.scenes.find(s => `${lesson.lessonId}-usage-scene-${s.chunkNumber}` === task.contentId);
  if (scene) {
    matchCount++;
  } else {
    sceneNotFoundCount++;
  }
}

console.log({
  totalUsageSceneTasks: usageSceneTasks.length,
  matchCount,
  missingUsageFileCount,
  sceneNotFoundCount
});
