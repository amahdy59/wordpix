import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const dir = join("src", "app", "data", "usage");
const files = (await readdir(dir)).filter((file) => file.endsWith(".usage.json"));
const joinWords = (words) => words.length <= 1 ? words[0] : words.length === 2 ? `${words[0]} and ${words[1]}` : `${words.slice(0, -1).join(", ")}, and ${words.at(-1)}`;
const lower = (value) => value.replace(/^L\d+\s+/u, "").trim().toLowerCase();
function learnerFor(unit) {
  if (/airport|station|train|travel|hotel|restaurant|shopping|bank|clinic|hospital/iu.test(unit)) return "traveler";
  if (/academic|university|school|class|study/iu.test(unit)) return "student";
  if (/lab|printer|engineering|technology|software|computer|science/iu.test(unit)) return "technician";
  if (/office|business|work|meeting/iu.test(unit)) return "colleague";
  return "adult learner";
}
function createReading(lesson) {
  const setting = lower(lesson.unitName);
  const learner = learnerFor(setting);
  const groups = lesson.usage.scenes.map((scene) => Array.isArray(scene.targetWords) ? scene.targetWords : [scene.targetWords]);
  const first = groups[0] ?? lesson.targetWordsEnglish.slice(0, 3);
  const lines = [`At the ${setting}, a ${learner} handles a real-world responsibility and must make a clear decision.`];
  groups.forEach((group, index) => {
    const terms = joinWords(group);
    const transition = index === 0 ? "First" : index === groups.length - 1 ? "Finally" : "Next";
    lines.push(`${transition}, the ${learner} considers ${terms}. The choice depends on the role of each term in the context, so the ${learner} checks the details before moving on.`);
  });
  lines.push(`By the end, the ${learner} can explain the decision clearly and use the new words in a connected response.`);
  return lines.join(" ");
}
let changed = 0;
for (const file of files) {
  const filePath = join(dir, file);
  const lessons = JSON.parse(await readFile(filePath, "utf8"));
  let dirty = false;
  for (const lesson of lessons) {
    if (lesson.globalOrder < 451) continue;
    const text = createReading(lesson);
    if (lesson.reading.text !== text) { lesson.reading.text = text; dirty = true; changed += 1; }
  }
  if (dirty) await writeFile(filePath, `${JSON.stringify(lessons, null, 2)}\n`);
}
console.log(JSON.stringify({ changed }));
