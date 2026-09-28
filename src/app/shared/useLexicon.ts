import { useEffect, useState } from "react";
import { loadLexicon, type LoadedLexicon } from "../data/lexiconLoader";

/** One loading/error/retry contract for all dictionary consumers. */
export function useLexicon(wordIds: readonly string[]) {
  const key = JSON.stringify(wordIds);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<
    | { key: string; attempt: number; status: "ready"; lexicon: LoadedLexicon }
    | { key: string; attempt: number; status: "error" }
    | null
  >(null);

  useEffect(() => {
    if (key === "[]") return; // Closed inspectors must not schedule dictionary work.
    let cancelled = false;
    void loadLexicon(JSON.parse(key) as string[]).then(
      (lexicon) => {
        if (!cancelled) setResult({ key, attempt, status: "ready", lexicon });
      },
      () => {
        if (!cancelled) setResult({ key, attempt, status: "error" });
      }
    );
    return () => {
      cancelled = true;
    };
  }, [key, attempt]);

  const current = result?.key === key && result.attempt === attempt ? result : null;
  return {
    lexicon: current?.status === "ready" ? current.lexicon : null,
    lexiconFailed: current?.status === "error",
    retryLexicon: () => setAttempt((value) => value + 1),
  };
}
