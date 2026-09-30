import {
  unitUsageDataSchema,
  unitUsageApprovalDataSchema,
  unitUsagePhraseDataSchema,
  type UnitUsageData,
  type LessonUsageData,
  type UsageLessonApproval,
  type UsagePhrase,
  type UsageSceneChunk,
} from "./usageTypes";
import { enrichReferenceLesson } from "./referenceUnitEnrichment";

/**
 * Lazy registry for unit curriculum usage data.
 * Uses Vite's import.meta.glob to dynamically code-split all 200 units on demand,
 * ensuring zero bloat in the initial app bundle.
 */
const USAGE_MODULES = import.meta.glob<{ default: unknown }>("./usage/*.usage.json");
const APPROVED_PHRASE_MODULES = import.meta.glob<{ default: unknown }>(
  "./usagePhrases/*.phrases.json"
);
const APPROVED_USAGE_MODULES = import.meta.glob<{ default: unknown }>(
  "./usageApprovals/*.approval.json"
);

async function loadUnitApprovals(unitId: string): Promise<UsageLessonApproval[]> {
  const loader = APPROVED_USAGE_MODULES[`./usageApprovals/${unitId}.approval.json`];
  if (!loader) return [];
  try {
    const mod = await loader();
    return unitUsageApprovalDataSchema.parse(mod.default ?? mod);
  } catch {
    return [];
  }
}

async function loadApprovedUnitPhrases(unitId: string): Promise<UsagePhrase[]> {
  const loader = APPROVED_PHRASE_MODULES[`./usagePhrases/${unitId}.phrases.json`];
  if (!loader) return [];
  try {
    const mod = await loader();
    return unitUsagePhraseDataSchema.parse(mod.default ?? mod);
  } catch {
    // Invalid editorial exports fail closed: scenes remain available, but the
    // affected phrase records never reach learners.
    return [];
  }
}

function attachApprovedPhrases(lessons: UnitUsageData, phrases: UsagePhrase[]): UnitUsageData {
  return lessons.map((lesson) => {
    const lessonSceneIds = new Set(
      lesson.usage.scenes.map((scene) => `${lesson.lessonId}-usage-scene-${scene.chunkNumber}`)
    );
    const seenSlots = new Set<UsagePhrase["slot"]>();
    const approvedPhrases = phrases.filter((phrase) => {
      if (
        phrase.lessonId !== lesson.lessonId ||
        phrase.unitId !== lesson.unitId ||
        !lessonSceneIds.has(phrase.sceneId) ||
        seenSlots.has(phrase.slot)
      ) {
        return false;
      }
      seenSlots.add(phrase.slot);
      return true;
    });

    return {
      ...lesson,
      usage: {
        ...lesson.usage,
        phrases: approvedPhrases,
      },
    };
  });
}

/** Raw curriculum source for audits and editorial tooling; never call from learner UI. */
export async function loadUnitUsageForEditorial(unitId: string): Promise<UnitUsageData | null> {
  const path = `./usage/${unitId}.usage.json`;
  const loader = USAGE_MODULES[path];
  if (!loader) return null;
  try {
    const mod = await loader();
    const parsed = unitUsageDataSchema.parse(mod.default ?? mod).map(enrichReferenceLesson);
    const phrases = await loadApprovedUnitPhrases(unitId);
    return attachApprovedPhrases(parsed, phrases);
  } catch {
    return null;
  }
}

/** Learner-facing loader. A missing or invalid whole-lesson approval fails closed. */
export async function loadUnitUsage(unitId: string): Promise<UnitUsageData | null> {
  const [lessons, approvals] = await Promise.all([
    loadUnitUsageForEditorial(unitId),
    loadUnitApprovals(unitId),
  ]);
  if (!lessons) return null;

  const placeholderArabic = /(?:يُسمّى|مصطلح مرتبط بالموضوع|جزء يُسمّى|شخص يُسمّى)/u;
  const approvedLessonIds = new Set(
    approvals.filter((approval) => approval.unitId === unitId).map((approval) => approval.lessonId)
  );
  const released = lessons.filter(
    (lesson) =>
      approvedLessonIds.has(lesson.lessonId) &&
      lesson.targetWordsArabic.every((translation) => !placeholderArabic.test(translation))
  );
  return released.length > 0 ? released : null;
}

export function hasUnitUsage(unitId: string): boolean {
  return `./usage/${unitId}.usage.json` in USAGE_MODULES;
}

export async function loadLessonUsage(lessonId: string): Promise<LessonUsageData | null> {
  const unitSlug = lessonId.replace(/-\d+$/, "");
  const unitData = await loadUnitUsage(unitSlug);
  if (!unitData) return null;
  return unitData.find((l) => l.lessonId === lessonId) ?? null;
}

/** Raw lesson source for tests, audits, and editorial tooling; never call from learner UI. */
export async function loadLessonUsageForEditorial(
  lessonId: string
): Promise<LessonUsageData | null> {
  const unitSlug = lessonId.replace(/-\d+$/, "");
  const unitData = await loadUnitUsageForEditorial(unitSlug);
  if (!unitData) return null;
  return unitData.find((lesson) => lesson.lessonId === lessonId) ?? null;
}

/** Finds an authored visual that supports a contextual question for one target word. */
export function findLessonSceneImage(
  usage: LessonUsageData,
  wordLabel: string
): UsageSceneChunk | undefined {
  const target = wordLabel.toLocaleLowerCase();
  return usage.usage.scenes.find(
    (scene) =>
      Boolean(scene.imagePath) &&
      scene.targetWords.some((word) => word.toLocaleLowerCase() === target)
  );
}
