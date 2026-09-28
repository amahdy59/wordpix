import type { UnitUsageData, LessonUsageData } from "./usageTypes";

/**
 * Lazy registry for unit curriculum usage data.
 * Uses Vite's import.meta.glob to dynamically code-split all 200 units on demand,
 * ensuring zero bloat in the initial app bundle.
 */
const USAGE_MODULES = import.meta.glob<{ default: unknown }>("./usage/*.usage.json");

export async function loadUnitUsage(unitId: string): Promise<UnitUsageData | null> {
  const path = `./usage/${unitId}.usage.json`;
  const loader = USAGE_MODULES[path];
  if (!loader) return null;
  try {
    const mod = await loader();
    return (mod.default ?? mod) as UnitUsageData;
  } catch {
    return null;
  }
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
