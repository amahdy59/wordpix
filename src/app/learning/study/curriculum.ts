import type { CourseUnit } from "../../data/lessons";
import type { UnitLearningMaterials } from "../types";
import {
  getUnitCurriculumDesign,
  type CurriculumStage,
  type SkillStrand,
} from "../curriculumModel";
import type { StudyNode } from "./types";

/** Small enough for active retrieval, large enough to keep a session meaningful. */
export const MAX_ACTIVE_WORDS_PER_LESSON = 8;

function chunks<T>(items: T[], size = MAX_ACTIVE_WORDS_PER_LESSON): T[][] {
  const result: T[][] = [];
  for (let index = 0; index < items.length; index += size)
    result.push(items.slice(index, index + size));
  return result;
}

function addVocabularySequence(
  nodes: StudyNode[],
  id: string,
  title: string,
  wordIds: string[],
  seen: Set<string>,
  curriculum: ReturnType<typeof getUnitCurriculumDesign>
) {
  const unique = wordIds.filter((wordId) => {
    if (seen.has(wordId)) return false;
    seen.add(wordId);
    return true;
  });

  const parts = chunks(unique);
  parts.forEach((part, index) => {
    const suffix = parts.length > 1 ? ` · Part ${index + 1}` : "";
    nodes.push({
      id: index === 0 ? id : `${id}-${index + 1}`,
      area: "learn",
      title: `${title}${suffix}`,
      description:
        index === 0
          ? "Recognise the meaning, hear the form, then retrieve it without the picture."
          : "Build on the previous set with a short, manageable group of new language.",
      type: "vocabulary",
      wordIds: part,
      estimatedMinutes: Math.max(3, Math.ceil(part.length * 0.75)),
      stage: index === 0 ? "meaning" : "sound",
      outcome: curriculum.canDo[0],
      successCriteria: [
        "Recognise the item from meaning or audio.",
        "Recall the English form without relying on the image.",
      ],
      skillStrands: ["listening", "reading", "spoken-production"],
      cefr: curriculum.cefr,
      gseRange: curriculum.gseRange,
      isCore: title !== "Extension language",
    });
  });
}

function contextualNode(
  node: Omit<StudyNode, "cefr" | "gseRange" | "outcome" | "successCriteria">,
  curriculum: ReturnType<typeof getUnitCurriculumDesign>,
  stage: CurriculumStage,
  skillStrands: SkillStrand[],
  outcomeIndex: number
): StudyNode {
  return {
    ...node,
    stage,
    skillStrands,
    outcome: curriculum.canDo[outcomeIndex] ?? curriculum.outcome,
    successCriteria: [
      "Understand the key message.",
      "Use the target language for the stated purpose.",
    ],
    cefr: curriculum.cefr,
    gseRange: curriculum.gseRange,
    isCore: node.isCore ?? true,
  };
}

/** Builds an action-oriented path from the existing authored content pools. */
export function generateCurriculum(
  materials: UnitLearningMaterials,
  unit: Pick<CourseUnit, "id" | "name" | "wordIds"> = {
    id: materials.unitId,
    name: materials.unitId.replace(/-/g, " "),
    wordIds: materials.subtopics?.flatMap((subtopic) => subtopic.wordIds) ?? [],
  }
): StudyNode[] {
  const nodes: StudyNode[] = [];
  const curriculum = getUnitCurriculumDesign(unit, materials);
  const seen = new Set<string>();

  // The Figma metadata gives an editorial 1–3 frequency rating for most units.
  // Respect authored tiers first; otherwise use those ratings, leaving unrated
  // words in their existing subtopic order rather than guessing their priority.
  const normalizeWord = (value: string) => value.trim().toLowerCase().replace(/\s+/g, "-");
  const unitIdsByName = new Map(unit.wordIds.map((id) => [normalizeWord(id), id]));
  const frequency = new Map(
    (materials.wordMeta ?? []).map((entry) => [normalizeWord(entry.word), entry.frequency])
  );
  const sourceTiers = materials.priorityTiers ?? {
    essential: unit.wordIds.filter((id) => frequency.get(normalizeWord(id)) === 3),
    important: unit.wordIds.filter((id) => frequency.get(normalizeWord(id)) === 2),
    goodToKnow: unit.wordIds.filter((id) => frequency.get(normalizeWord(id)) === 1),
  };
  const toUnitIds = (ids: string[]) =>
    ids.flatMap((id) => {
      const unitId = unitIdsByName.get(normalizeWord(id));
      return unitId ? [unitId] : [];
    });
  const tiers = {
    essential: toUnitIds(sourceTiers.essential),
    important: toUnitIds(sourceTiers.important),
    goodToKnow: toUnitIds(sourceTiers.goodToKnow),
  };
  const extensionIds = new Set(tiers.goodToKnow.map(normalizeWord));

  addVocabularySequence(
    nodes,
    "learn-essential",
    "Essential language",
    tiers.essential,
    seen,
    curriculum
  );

  addVocabularySequence(
    nodes,
    "learn-important",
    "Useful supporting language",
    tiers.important,
    seen,
    curriculum
  );

  materials.subtopics?.forEach((subtopic) => {
    addVocabularySequence(
      nodes,
      `learn-${subtopic.id}`,
      subtopic.title,
      subtopic.wordIds.filter((id) => !extensionIds.has(normalizeWord(id))),
      seen,
      curriculum
    );
  });

  addVocabularySequence(
    nodes,
    "learn-extension",
    "Extension language",
    tiers.goodToKnow,
    seen,
    curriculum
  );
  // Never lose a word because an authored subtopic or priority tier omitted it.
  addVocabularySequence(
    nodes,
    "learn-remaining",
    "More useful words",
    unit.wordIds.filter((id) => !extensionIds.has(normalizeWord(id))),
    seen,
    curriculum
  );

  if (materials.phrases || materials.collocations) {
    nodes.push(
      contextualNode(
        {
          id: "use-phrases",
          area: "use",
          title: "Functional phrases & word partners",
          description: "Combine vocabulary into language you can use immediately.",
          type: "phrases",
          estimatedMinutes: 4,
        },
        curriculum,
        "function",
        ["listening", "reading", "spoken-production"],
        1
      )
    );
  }

  if (materials.dialogue) {
    nodes.push(
      contextualNode(
        {
          id: "use-dialogue",
          area: "use",
          title: "Guided interaction",
          description: "Follow a realistic exchange, then rehearse both roles.",
          type: "dialogue",
          estimatedMinutes: 5,
        },
        curriculum,
        "interaction",
        ["listening", "spoken-interaction"],
        1
      )
    );
  }

  if (materials.passage) {
    const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
    const isStretchReading =
      levels.indexOf(materials.passage.level) > levels.indexOf(curriculum.cefr);
    nodes.push(
      contextualNode(
        {
          id: "use-reading",
          area: "use",
          title: isStretchReading
            ? `Optional ${materials.passage.level} extension reading`
            : "Integrated text & response",
          description: materials.passage.title,
          level: materials.passage.level,
          type: "reading",
          estimatedMinutes: 6,
          isCore: !isStretchReading,
        },
        curriculum,
        "integrated",
        ["reading", "mediation"],
        2
      )
    );
  }

  if (materials.mistakes) {
    nodes.push(
      contextualNode(
        {
          id: "use-mistakes",
          area: "use",
          title: "Notice & repair",
          description: "Recognise a common error and reformulate it clearly.",
          type: "mistakes",
          estimatedMinutes: 3,
        },
        curriculum,
        "function",
        ["reading", "writing"],
        1
      )
    );
  }

  if (materials.culturalNotes) {
    nodes.push(
      contextualNode(
        {
          id: "use-culture",
          area: "use",
          title: "Culture, register & appropriate use",
          type: "culture",
          estimatedMinutes: 3,
        },
        curriculum,
        "integrated",
        ["reading", "mediation"],
        2
      )
    );
  }

  const hasPractice =
    (materials.blankExercises && materials.blankExercises.length > 0) ||
    materials.additionalExercises ||
    materials.collocationsQuiz ||
    materials.errorCorrection ||
    materials.writingPrompts;

  if (hasPractice) {
    nodes.push(
      contextualNode(
        {
          id: "practice-session",
          area: "practice",
          title: "Retrieve & transfer",
          description: "Recall the language in new combinations without copying the model.",
          type: "practice",
          estimatedMinutes: 8,
        },
        curriculum,
        "recall",
        ["reading", "writing", "spoken-production"],
        2
      )
    );
  }

  nodes.push(
    contextualNode(
      {
        id: materials.selfAssessment?.length ? "review-assessment" : "review-difficult",
        area: "review",
        title: "Can-do checkpoint & spaced review",
        description: curriculum.finalTask,
        type: "assessment",
        estimatedMinutes: 5,
      },
      curriculum,
      "review",
      ["listening", "reading", "spoken-interaction", "spoken-production", "writing"],
      2
    )
  );

  nodes.push({
    id: "reference-all",
    area: "reference",
    title: "All words & reference",
    description: "Optional lookup material; it does not count toward unit completion.",
    type: "reference",
    stage: "reference",
    cefr: curriculum.cefr,
    gseRange: curriculum.gseRange,
    isCore: false,
  });

  let previousCoreId: string | undefined;
  return nodes.map((node) => {
    if (!node.isCore || node.area === "reference") return node;
    const next = { ...node, prerequisiteNodeIds: previousCoreId ? [previousCoreId] : [] };
    previousCoreId = node.id;
    return next;
  });
}
