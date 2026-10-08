import { readFile, writeFile } from "node:fs/promises";

const targetLessons = new Set([
  "skin-hair-4",
  ...["ages-life-stages", "everyday-clothing", "accessories-jewelry", "footwear"].flatMap(
    (unit) => [1, 2, 3, 4].map((n) => `${unit}-${n}`)
  ),
]);

const contextByUnit = {
  "skin-hair": {
    setting: "a morning routine",
    person: "Maya",
    opening: "Before work, Maya checks her skin and hair in the bathroom mirror.",
    action: "She chooses the right product and explains her routine to a friend.",
  },
  "ages-life-stages": {
    setting: "a family video call",
    person: "Nadia",
    opening: "During a family video call, Nadia looks at photographs from different stages of life.",
    action: "She describes each person respectfully and explains what is happening in the photograph.",
  },
  "everyday-clothing": {
    setting: "a clothing shop",
    person: "Omar",
    opening: "At a clothing shop, Omar is choosing what to wear for work and the weekend.",
    action: "He compares the fabrics, fit, and purpose before making a practical choice.",
  },
  "accessories-jewelry": {
    setting: "packing for a trip",
    person: "Leila",
    opening: "While packing for a short trip, Leila lays her accessories on the bed.",
    action: "She chooses one useful item for each activity and checks that everything is secure.",
  },
  footwear: {
    setting: "getting ready for an activity",
    person: "Sam",
    opening: "Before leaving for the day's activity, Sam checks the footwear by the door.",
    action: "He chooses the pair that gives the right support, comfort, and protection.",
  },
};

function listWords(words) {
  if (!words || words.length === 0) return "";
  if (words.length === 1) return words[0];
  if (words.length === 2) return `${words[0]} and ${words[1]}`;
  return `${words.slice(0, -1).join(", ")}, and ${words[words.length - 1]}`;
}

function makeScene(unitId, scene, lessonIndex, lesson) {
  const context = contextByUnit[unitId] ?? contextByUnit["everyday-clothing"];
  const words = Array.isArray(scene.targetWords) ? scene.targetWords : [scene.targetWords];
  const answerIndex = (lessonIndex + scene.chunkNumber) % words.length;
  const answer = words[answerIndex];
  const otherWords = words.filter((word) => word !== answer);
  const distractors = otherWords.length > 0
    ? otherWords
    : (lesson?.targetWordsEnglish ?? []).filter((word) => word !== answer).slice(0, 2);
  const scenario = distractors.length > 0
    ? `${context.opening} ${context.person} notices ${answer} while also considering ${listWords(distractors)}. ${context.action}`
    : `${context.opening} ${context.person} reviews ${answer}. ${context.action}`;
  const question = `Which target does ${context.person} notice first in this situation?`;
  return {
    ...scene,
    scenario,
    check: { ...scene.check, question, expectedAnswer: answer },
    imageBrief: `Show an adult in ${context.setting}, with ${listWords(words)} visible in one coherent moment. The scene should support the context question without written labels, logos, or text and should not reveal the answer through a label or exaggerated emphasis.`,
  };
}

for (const [unitId, raw] of Object.entries(
  Object.fromEntries(
    await Promise.all(
      [...new Set([...targetLessons].map((id) => id.replace(/-\d+$/u, "")))].map(async (unitId) => [
        unitId,
        JSON.parse((await readFile(`src/app/data/usage/${unitId}.usage.json`, "utf8")).replace(/^\uFEFF/u, "")),
      ])
    )
  )
)) {
  let changed = false;
  const lessons = raw.map((lesson) => {
    if (!targetLessons.has(lesson.lessonId)) return lesson;
    changed = true;
    return {
      ...lesson,
      usage: {
        ...lesson.usage,
        scenes: (Array.isArray(lesson.usage.scenes) ? lesson.usage.scenes : [lesson.usage.scenes]).map(
          (scene) => makeScene(unitId, scene, lesson.lessonOrderInUnit, lesson)
        ),
      },
    };
  });
  if (changed) {
    await writeFile(`src/app/data/usage/${unitId}.usage.json`, `${JSON.stringify(lessons, null, 2)}\n`);
  }
}

console.log(`Rewrote ${targetLessons.size} lessons as draft editorial content.`);
