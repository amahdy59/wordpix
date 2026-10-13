import {
  getFigmaPronunciationActivityData,
  type FigmaPronunciationImage,
} from "./figmaPronunciationCatalog";

/** IDs depend on authored text, never on display order or an audio URL. */
export function pronunciationTargetId(label: string): string {
  return `target:${encodeURIComponent(label.trim().toLocaleLowerCase("en-US"))}`;
}

export function getPronunciationTargets(
  number: number,
  transfer: boolean
): readonly FigmaPronunciationImage[] {
  const activity = getFigmaPronunciationActivityData(number);
  const targets = activity.items.filter((item) =>
    transfer ? item.role === "transfer" : item.role !== "transfer"
  );
  return targets.length ? targets : activity.items;
}

export function pronunciationTrialCount(number: number, stage: number): number {
  const count = getPronunciationTargets(number, stage === 4).length;
  return stage === 2 ? Math.min(3, count) : count;
}

export function pronunciationEvidenceKey(stage: number, label: string): string {
  return `${stage}:${pronunciationTargetId(label)}`;
}
