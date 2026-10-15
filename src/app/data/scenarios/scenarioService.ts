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
