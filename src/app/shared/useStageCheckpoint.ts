import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { z } from "zod";
import { useLessonSession } from "./LessonSessionContext";

const envelope = z.object({ sessionId: z.string(), value: z.unknown() });
/** Essential local session state. Never synced or emitted as diagnostics. */
export function useStageCheckpoint<T>(
  name: string,
  initial: T,
  schema: z.ZodType<T>
): [T, Dispatch<SetStateAction<T>>] {
  const session = useLessonSession();
  const key = session?.unitId ? `wordpix:stage:${session.unitId}:${session.current}:${name}` : null;
  const restore = (): T => {
    if (!key || !session?.sessionId) return initial;
    try {
      const saved = envelope.safeParse(JSON.parse(localStorage.getItem(key) ?? "null"));
      if (!saved.success || saved.data.sessionId !== session.sessionId) return initial;
      const parsed = schema.safeParse(saved.data.value);
      return parsed.success ? parsed.data : initial;
    } catch {
      return initial;
    }
  };
  const sessionId = session?.sessionId;
  const [savedState, setSavedState] = useState(() => ({ key, sessionId, value: restore() }));
  const value =
    savedState.key === key && savedState.sessionId === sessionId ? savedState.value : restore();
  if (savedState.key !== key || savedState.sessionId !== sessionId)
    setSavedState({ key, sessionId, value });
  const setValue: Dispatch<SetStateAction<T>> = useCallback(
    (next) =>
      setSavedState((previous) => ({
        key,
        sessionId,
        value: typeof next === "function" ? (next as (value: T) => T)(previous.value) : next,
      })),
    [key, sessionId]
  );
  useEffect(() => {
    if (!key || !session?.sessionId) return;
    try {
      localStorage.setItem(key, JSON.stringify({ sessionId: session.sessionId, value }));
    } catch {
      /* progress still persists through the authoritative store */
    }
  }, [key, session?.sessionId, value]);
  return [value, setValue];
}
