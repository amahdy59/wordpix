import scenariosData from "./curriculumScenarios.json";

export interface ScenarioLine {
  speaker: string;
  text: string;
  startSeconds: number;
  endSeconds: number;
  clipRelativePath: string;
}

export interface ScenarioLesson {
  unitId: string;
  lessonId: string;
  titleEn: string;
  titleAr: string;
  totalDurationSeconds: number;
  masterAudioRelative: string;
  targetWords: string[];
  lines: ScenarioLine[];
}

const allScenarios: ScenarioLesson[] = scenariosData as ScenarioLesson[];

const scenariosByUnit = new Map<string, ScenarioLesson[]>();
const scenariosByLesson = new Map<string, ScenarioLesson>();

for (const item of allScenarios) {
  const existing = scenariosByUnit.get(item.unitId) || [];
  existing.push(item);
  scenariosByUnit.set(item.unitId, existing);
  scenariosByLesson.set(item.lessonId, item);
}

/**
 * Retrieve all conversation scenarios authored for a curriculum unit (e.g. "numbers-counting").
 */
export function getScenariosForUnit(unitId: string): ScenarioLesson[] {
  return scenariosByUnit.get(unitId) ?? [];
}

/**
 * Retrieve the scenario associated with an atomic lesson (e.g. "numbers-counting-1").
 */
export function getScenarioForLesson(lessonId: string): ScenarioLesson | undefined {
  return scenariosByLesson.get(lessonId);
}

/**
 * Parses the lesson order number from a lesson ID (e.g. "numbers-counting-1" -> 1).
 */
export function getLessonNumberFromLessonId(lessonId: string): number {
  const match = lessonId.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : 1;
}

/**
 * Formats a clear, pedagogical section badge and title for a scenario.
 * e.g. "Lesson 1 of 4", "Lesson 1: The Date Harvest Box"
 */
export function getScenarioDisplayInfo(
  scenario: ScenarioLesson,
  unitScenarios?: ScenarioLesson[]
): {
  lessonNumber: number;
  sectionLabel: string;
  badgeLabel: string;
  fullTitle: string;
} {
  const allInUnit = unitScenarios ?? getScenariosForUnit(scenario.unitId);
  const foundIdx = allInUnit.findIndex((s) => s.lessonId === scenario.lessonId);
  const lessonNumber =
    foundIdx !== -1 ? foundIdx + 1 : getLessonNumberFromLessonId(scenario.lessonId);
  const total = allInUnit.length;

  const sectionLabel = total > 1 ? `Lesson ${lessonNumber} of ${total}` : `Lesson ${lessonNumber}`;
  const badgeLabel = `Lesson ${lessonNumber}`;
  const fullTitle = `${badgeLabel}: ${scenario.titleEn}`;

  return {
    lessonNumber,
    sectionLabel,
    badgeLabel,
    fullTitle,
  };
}

/**
 * Finds the authentic scenario that covers a given set of vocabulary word IDs.
 */
export function findScenarioForWords(
  unitId: string,
  wordIds: string[]
): ScenarioLesson | undefined {
  const scenarios = getScenariosForUnit(unitId);
  if (!scenarios.length) return undefined;
  if (!wordIds.length) return scenarios[0];

  const normalized = new Set(wordIds.map((w) => w.trim().toLowerCase()));
  let bestScenario: ScenarioLesson | undefined = undefined;
  let maxOverlap = 0;

  for (const s of scenarios) {
    let overlap = 0;
    for (const tw of s.targetWords) {
      if (normalized.has(tw.toLowerCase())) overlap++;
    }
    if (overlap > maxOverlap) {
      maxOverlap = overlap;
      bestScenario = s;
    }
  }

  return bestScenario ?? scenarios[0];
}
