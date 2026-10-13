import {
  getFigmaPronunciationActivityData,
  getPronunciationQuestion,
  type FigmaPronunciationImage,
} from "./figmaPronunciationCatalog";
import { normalizePronunciationSession, type PronunciationSession } from "./pronunciationProgress";

/** A checkpoint belongs to this ordered, authored target set, independent of media URLs. */
export function pronunciationContentRevision(number: number): string {
  const items = getFigmaPronunciationActivityData(number).items;
  return JSON.stringify(items.map((item) => [item.role, pronunciationTargetId(item.label)]));
}

export function resumablePronunciationSession(
  number: number,
  stage: number,
  value: unknown
): PronunciationSession | undefined {
  const session = normalizePronunciationSession(value);
  if (
    !session ||
    session.version !== 2 ||
    !Number.isInteger(stage) ||
    stage < 0 ||
    stage > 4 ||
    stage > session.unlockedStage ||
    session.trial >= pronunciationTrialCount(number, stage) ||
    (session.contentRevision !== undefined &&
      session.contentRevision !== pronunciationContentRevision(number))
  )
    return undefined;
  if (stage === 0 && (session.trial !== 0 || session.answer !== null || session.attempts !== 0))
    return undefined;
  if (
    stage > 0 &&
    session.currentTargetId &&
    pronunciationTargetId(
      getPronunciationQuestion(
        number,
        stage as 1 | 2 | 3 | 4,
        session.trial,
        false,
        session.currentTargetId
      ).target.label
    ) !== session.currentTargetId
  )
    return undefined;
  if (
    Object.keys(session.outcomes).some((key) => {
      const evidenceStage = Number(key[0]);
      if (evidenceStage === 3 || evidenceStage > session.unlockedStage) return true;
      const targets = getPronunciationTargets(number, evidenceStage === 4).slice(
        0,
        evidenceStage === 2 ? 3 : undefined
      );
      return !targets.some((item) => pronunciationTargetId(item.label) === key.slice(2));
    })
  )
    return undefined;
  return session;
}

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
