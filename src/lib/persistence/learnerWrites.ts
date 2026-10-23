import type { LearnerStateSchema } from "../../app/context/LearnerContext";
import { saveLearnerChange, type LearnerMutation } from "./db";

export type LearnerSaveStatus = "saved" | "saving" | "failed";
type Job = { state: LearnerStateSchema; mutations: readonly LearnerMutation[]; id: string };
const pending = new Map<string, Job>();
const listeners = new Set<() => void>();
let status: LearnerSaveStatus = "saved";
let writing: Promise<void> | undefined;
let generation = 0;
function announce(next: LearnerSaveStatus) {
  status = next;
  queueMicrotask(() => listeners.forEach((listener) => listener()));
}
export const subscribeLearnerSave = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
export const getLearnerSaveStatus = () => status;
export const getUnsavedLearnerSnapshot = () => [...pending.values()].at(-1)?.state;

export function flushLearnerWrites(): Promise<void> {
  if (writing) return writing;
  const currentGeneration = generation;
  const task = (async () => {
    if (pending.size) announce("saving");
    try {
      while (pending.size > 0) {
        const current = pending.entries().next().value;
        if (!current) break;
        const [id, job] = current;
        await saveLearnerChange(job.state, job.mutations, id);
        if (currentGeneration !== generation) return;
        if (pending.get(id) === job) pending.delete(id);
      }
      if (currentGeneration === generation) announce("saved");
    } catch {
      if (currentGeneration === generation) announce("failed");
    }
  })().finally(() => {
    if (writing === task) {
      writing = undefined;
      if (pending.size && status !== "failed") void flushLearnerWrites();
    }
  });
  writing = task;
  return task;
}
export function enqueueLearnerWrite(
  state: LearnerStateSchema,
  mutations: readonly LearnerMutation[],
  id: string
) {
  pending.set(id, { state, mutations, id });
  void flushLearnerWrites();
}
export function resetLearnerWritesForTests() {
  generation++;
  pending.clear();
  status = "saved";
  writing = undefined;
}
