import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const usageDir = join("src", "app", "data", "usage");
const files = (await readdir(usageDir)).filter((file) => file.endsWith(".usage.json"));
let changedLessons = 0;
let changedScenes = 0;

for (const file of files) {
  const path = join(usageDir, file);
  const lessons = JSON.parse(await readFile(path, "utf8"));
  let fileChanged = false;
  for (const lesson of lessons) {
    if (lesson.globalOrder < 451) continue;
    const targets = lesson.targetWordsEnglish;
    const targetSentence = targets.length === 1
      ? targets[0]
      : `${targets.slice(0, -1).join(", ")}, and ${targets.at(-1)}`;
    const contextIntro = `In the ${lesson.unitName.toLowerCase()} setting, the adult completes a realistic task and uses the lesson vocabulary accurately.`;
    for (const scene of lesson.usage.scenes) {
      const sceneTargets = Array.isArray(scene.targetWords) ? scene.targetWords : [scene.targetWords];
      const sceneList = sceneTargets.length === 1
        ? sceneTargets[0]
        : `${sceneTargets.slice(0, -1).join(", ")}, and ${sceneTargets.at(-1)}`;
      const nextScenario = `${contextIntro} The task requires the learner to compare ${sceneList} and choose the option that fits the situation.`;
      if (scene.scenario !== nextScenario) {
        scene.scenario = nextScenario;
        changedScenes += 1;
        fileChanged = true;
      }
    }
    const readingAddition = ` The situation also involves ${targetSentence}. Each term has a distinct role in the task, so the learner must use the words precisely.`;
    if (!lesson.reading.text.includes(targets[targets.length - 1])) {
      lesson.reading.text = `${lesson.reading.text.trim()}${readingAddition}`;
      fileChanged = true;
    }
    const hasCoverageExercise = lesson.exercises.some((exercise) => exercise.contextTag === "target-coverage-review");
    if (!hasCoverageExercise) {
      lesson.exercises.push({
        prompt: `Apply the lesson vocabulary in the ${lesson.unitName.toLowerCase()} task. Use ${targetSentence} in a connected response and explain one choice.`,
        answer: "Open response: use each target term accurately and explain the choice.",
        questionType: "production",
        responseMode: "extended-response",
        contextTag: "target-coverage-review",
      });
      fileChanged = true;
    }
    if (fileChanged) changedLessons += 1;
  }
  if (fileChanged) await writeFile(path, `${JSON.stringify(lessons, null, 2)}\n`);
}
console.log(JSON.stringify({ changedLessons, changedScenes }));
