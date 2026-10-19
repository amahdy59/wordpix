import type { EnglishLevel } from "../context/LearnerContext";
import { CEFR_STAGES, CURRICULUM_SEQUENCE } from "../data/curriculumSequence";
export interface PlacementRecommendation {
  level: Exclude<EnglishLevel, "C2">;
  startingUnitId: string;
  correctCount: number;
  totalQuestions: number;
  listeningAssessed?: boolean;
}
export function getStartingUnitForLevel(level: EnglishLevel): string {
  if (level === "A1") return "numbers-counting";
  if (level === "A2") return "supermarket";
  if (level === "B1") return "business-communication";
  const phase = CEFR_STAGES.find((stage) => stage.cefr === (level === "C2" ? "C1" : level));
  return CURRICULUM_SEQUENCE[phase?.start ?? 0];
}
interface PlacementItem {
  prompt: string;
  options: readonly string[];
  answer: number;
  audio?: boolean;
}
// Provisional samples informed by CEFR descriptors, not a validated proficiency test.
export const PLACEMENT_ITEMS: readonly PlacementItem[] = [
  {
    prompt: "My name is Sara. I live in Cairo. Where does Sara live?",
    options: ["In Cairo", "In a school", "With Sara"],
    answer: 0,
  },
  { prompt: "There ___ two buses outside.", options: ["is", "are", "am"], answer: 1 },
  {
    prompt: "The shop opens at nine in the morning. When does it open?",
    options: ["At night", "At noon", "At nine"],
    answer: 2,
    audio: true,
  },
  {
    prompt:
      "Please call before you arrive so we can meet you at the station. What should you do first?",
    options: ["Call", "Wait at home", "Buy a ticket"],
    answer: 0,
  },
  { prompt: "Yesterday we ___ the train to work.", options: ["take", "took", "taking"], answer: 1 },
  {
    prompt: "I wanted a window seat, but only aisle seats were available. Where did I sit?",
    options: ["By the window", "Outside", "By the aisle"],
    answer: 2,
    audio: true,
  },
  {
    prompt: "Although the course was demanding, Amal completed it. Which is true?",
    options: [
      "She finished despite the difficulty",
      "She left because it was easy",
      "She has not started",
    ],
    answer: 0,
  },
  {
    prompt: "If I had more time, I ___ another language.",
    options: ["will study", "would study", "studied"],
    answer: 1,
  },
  {
    prompt:
      "The meeting has been put off until Friday because the report is not ready. What changed?",
    options: ["The report was cancelled", "Friday was a holiday", "The meeting was postponed"],
    answer: 2,
    audio: true,
  },
  {
    prompt:
      "The proposal is promising, provided that funding can be secured. What does the writer imply?",
    options: [
      "Its success depends on funding",
      "Funding is already guaranteed",
      "The proposal has no merit",
    ],
    answer: 0,
  },
  {
    prompt: "By this time next year, the team ___ the project.",
    options: ["had completed", "will have completed", "has been complete"],
    answer: 1,
  },
  {
    prompt:
      "The plan saves money now, yet its long-term costs could outweigh those savings. What is the concern?",
    options: [
      "No money can be saved now",
      "The plan has already failed",
      "Later costs may exceed early savings",
    ],
    answer: 2,
    audio: true,
  },
  {
    prompt:
      "The committee's apparent unanimity concealed reservations that surfaced only after the vote. What can be inferred?",
    options: [
      "Some members had unexpressed doubts",
      "Every member changed their vote",
      "No vote took place",
    ],
    answer: 0,
  },
  {
    prompt: "Had the evidence been available earlier, the outcome ___ different.",
    options: ["will be", "might have been", "has been"],
    answer: 1,
  },
  {
    prompt:
      "While not dismissing the findings outright, the reviewer questioned how far they could be generalised. What is the reviewer's position?",
    options: [
      "The findings are entirely false",
      "They apply everywhere",
      "Their wider applicability is uncertain",
    ],
    answer: 2,
    audio: true,
  },
];
export function recommendFromEvidence(
  answers: readonly boolean[],
  usedTranscript = false
): PlacementRecommendation {
  const levels = ["A1", "A2", "B1", "B2", "C1"] as const;
  let level: PlacementRecommendation["level"] = "A1";
  for (let band = 0; band < levels.length; band++) {
    const sample = answers.slice(band * 3, band * 3 + 3);
    if (sample.length !== 3 || sample.filter(Boolean).length < 2) break;
    level = levels[band];
  }
  return {
    level,
    startingUnitId: getStartingUnitForLevel(level),
    correctCount: answers.filter(Boolean).length,
    totalQuestions: answers.length,
    listeningAssessed: !usedTranscript,
  };
}
/** Tiny aggregate samples only support starter guidance. */
export function recommendPlacement(
  correctCount: number,
  totalQuestions = 3
): PlacementRecommendation {
  return {
    level: "A1",
    startingUnitId: getStartingUnitForLevel("A1"),
    correctCount,
    totalQuestions,
  };
}
