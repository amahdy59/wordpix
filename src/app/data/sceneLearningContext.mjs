/** Preserve immutable media source evidence while improving the written task.
 * A retained picture is vocabulary support, never proof of the revised story.
 * Stale anchors fail closed rather than silently rebinding media to new content.
 */
export function applySceneLearningContext(scene) {
  const context = scene.learningContext;
  if (
    !context ||
    context.sourceScenario !== scene.scenario ||
    context.sourceQuestion !== scene.check.question ||
    context.sourceAnswer !== scene.check.expectedAnswer ||
    typeof context.scenario !== "string" ||
    !context.scenario.trim() ||
    typeof context.question !== "string" ||
    !context.question.trim() ||
    typeof context.imageBrief !== "string" ||
    !context.imageBrief.trim()
  )
    return scene;
  const revised = {
    ...scene,
    scenario: context.scenario,
    check: { ...scene.check, question: context.question },
    imageBrief: context.imageBrief,
    ...(scene.imagePath ? { imagePurpose: "word-reference" } : {}),
  };
  delete revised.learningContext;
  return revised;
}
export function applyLessonLearningContexts(lesson) {
  const scenes = lesson.usage.scenes.map(applySceneLearningContext);
  return {
    ...lesson,
    usage: { ...lesson.usage, scenes },
    exercises: lesson.exercises.map((exercise) => {
      const scene = scenes.find((s) => exercise.contextTag === `scene-${s.chunkNumber}`);
      return scene && scene !== lesson.usage.scenes.find((s) => s.chunkNumber === scene.chunkNumber)
        ? {
            ...exercise,
            prompt: `${scene.scenario}\n${scene.check.question}`,
            answer: scene.check.expectedAnswer,
          }
        : exercise;
    }),
  };
}
