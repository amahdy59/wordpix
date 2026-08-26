import type { UnitLearningMaterials } from "../types";
import type { StudyNode } from "./types";

export function generateCurriculum(materials: UnitLearningMaterials): StudyNode[] {
  const nodes: StudyNode[] = [];
  const { unitId } = materials;

  // 1. Learn Area
  if (unitId === "bathroom" && materials.priorityTiers?.essential) {
    // Force essential words to be the first node
    nodes.push({
      id: "learn-essential",
      area: "learn",
      title: "Essential words",
      description: "Start here — the core vocabulary.",
      type: "vocabulary",
      wordIds: materials.priorityTiers.essential,
      estimatedMinutes: 3,
    });

    // The rest of the subtopics
    materials.subtopics?.forEach((subtopic) => {
      // Filter out words that were already in 'essential'
      const remainingWords = subtopic.wordIds.filter(
        (id) => !materials.priorityTiers!.essential.includes(id)
      );

      if (remainingWords.length > 0) {
        nodes.push({
          id: `learn-${subtopic.id}`,
          area: "learn",
          title: subtopic.title,
          type: "vocabulary",
          wordIds: remainingWords,
          estimatedMinutes: Math.max(1, Math.ceil(remainingWords.length / 2)),
        });
      }
    });
  } else {
    // Generic fallback for other units
    materials.subtopics?.forEach((subtopic) => {
      nodes.push({
        id: `learn-${subtopic.id}`,
        area: "learn",
        title: subtopic.title,
        type: "vocabulary",
        wordIds: subtopic.wordIds,
        estimatedMinutes: Math.max(1, Math.ceil(subtopic.wordIds.length / 2)),
      });
    });
  }

  // 2. Use It Area
  if (materials.phrases || materials.collocations) {
    nodes.push({
      id: "use-phrases",
      area: "use",
      title: "Useful phrases",
      type: "phrases",
      estimatedMinutes: 4,
    });
  }

  if (materials.dialogue) {
    nodes.push({
      id: "use-dialogue",
      area: "use",
      title: "Conversation",
      type: "dialogue",
      estimatedMinutes: 3,
    });
  }

  if (materials.passage) {
    nodes.push({
      id: "use-reading",
      area: "use",
      title: "Reading",
      description: materials.passage.title,
      level: materials.passage.level,
      type: "reading",
      estimatedMinutes: 5,
    });
  }

  if (materials.mistakes) {
    nodes.push({
      id: "use-mistakes",
      area: "use",
      title: "Common mistakes",
      type: "mistakes",
      estimatedMinutes: 2,
    });
  }

  if (materials.culturalNotes) {
    nodes.push({
      id: "use-culture",
      area: "use",
      title: "Culture & Usage",
      type: "culture",
      estimatedMinutes: 2,
    });
  }

  // 3. Practice Area
  const hasPractice =
    (materials.blankExercises && materials.blankExercises.length > 0) ||
    materials.additionalExercises ||
    materials.collocationsQuiz ||
    materials.errorCorrection ||
    materials.writingPrompts;

  if (hasPractice) {
    nodes.push({
      id: "practice-session",
      area: "practice",
      title: "Practice",
      description: "Make yourself remember",
      type: "practice",
      estimatedMinutes: 8,
    });
  }

  // 4. Review Area
  if (materials.selfAssessment && materials.selfAssessment.length > 0) {
    nodes.push({
      id: "review-assessment",
      area: "review",
      title: "Can-do goals",
      type: "assessment",
      estimatedMinutes: 2,
    });
  }

  // 5. Reference Area (catch-all for metadata)
  nodes.push({
    id: "reference-all",
    area: "reference",
    title: "All words & reference",
    type: "reference",
  });

  return nodes;
}
