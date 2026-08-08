import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Minimal typings for the Web Speech API.
 *
 * SpeechRecognition is not in lib.dom.d.ts because it has never left the
 * unofficial spec, so the shape is declared here rather than pulled from a
 * dependency.
 */
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}
interface SpeechRecognitionResult {
  readonly length: number;
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionEventLike extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
}
interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionConstructor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export type RecognitionStatus =
  | "unsupported"
  | "idle"
  | "listening"
  | "denied"
  | "no-speech"
  | "error";

export interface SpeechAttempt {
  /** What the engine heard, lowercased and stripped of punctuation. */
  heard: string;
  /** The engine's own confidence, 0–1. */
  confidence: number;
  matched: boolean;
}

/** Normalises a transcript for comparison: lowercase, no punctuation, single spaces. */
export function normaliseTranscript(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Levenshtein distance, used to accept near-misses.
 *
 * Recognition engines routinely return a homophone or a near-spelling for a
 * single spoken word ("wardrobe" -> "war drobe"). Requiring an exact string
 * match would fail a learner who pronounced the word correctly.
 */
export function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    const row = [i];
    for (let j = 1; j <= b.length; j += 1) {
      row[j] = Math.min(
        prev[j] + 1,
        row[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    prev = row;
  }
  return prev[b.length];
}

/**
 * Does the transcript contain the target word, allowing for small engine slips?
 *
 * Deliberately generous: this judges whether the learner said the right word,
 * not how well they pronounced it. The Web Speech API reports no phoneme-level
 * detail, so a pronunciation *score* would be fabricated — which is exactly
 * what this app used to display.
 */
export function transcriptMatches(transcript: string, target: string): boolean {
  const heard = normaliseTranscript(transcript);
  const want = normaliseTranscript(target);
  if (!heard || !want) return false;
  if (heard === want || heard.includes(want)) return true;

  // Allow one edit per four characters, minimum one.
  const tolerance = Math.max(1, Math.floor(want.length / 4));
  return heard.split(" ").some((token) => editDistance(token, want) <= tolerance);
}

interface Options {
  lang?: string;
  /** Listening stops automatically after this long. */
  timeoutMs?: number;
}

/**
 * Real speech recognition for the speaking drills.
 *
 * Availability is genuinely partial — Chrome, Edge, and Safari implement this;
 * Firefox does not — so `isSupported` is part of the contract and callers are
 * expected to fall back to self-assessment rather than pretend.
 */
export function useSpeechRecognition({ lang = "en-US", timeoutMs = 6000 }: Options = {}) {
  const [status, setStatus] = useState<RecognitionStatus>(() =>
    getRecognitionConstructor() ? "idle" : "unsupported"
  );
  const [attempt, setAttempt] = useState<SpeechAttempt | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const targetRef = useRef<string>("");

  const cleanup = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    const recognition = recognitionRef.current;
    if (recognition) {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.onstart = null;
      try {
        recognition.abort();
      } catch {
        // Already stopped; nothing to unwind.
      }
      recognitionRef.current = null;
    }
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const listen = useCallback(
    (target: string) => {
      const Ctor = getRecognitionConstructor();
      if (!Ctor) {
        setStatus("unsupported");
        return;
      }

      cleanup();
      setAttempt(null);
      targetRef.current = target;

      const recognition = new Ctor();
      recognition.lang = lang;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 3;

      recognition.onstart = () => setStatus("listening");

      recognition.onresult = (event) => {
        const result = event.results[event.resultIndex];
        if (!result) return;

        // Check every alternative: the top pick is often a homophone while a
        // lower-ranked one is exactly right.
        let best: SpeechAttempt = { heard: "", confidence: 0, matched: false };
        for (let i = 0; i < result.length; i += 1) {
          const alt = result[i];
          const matched = transcriptMatches(alt.transcript, targetRef.current);
          if (matched || alt.confidence > best.confidence) {
            best = {
              heard: normaliseTranscript(alt.transcript),
              confidence: alt.confidence ?? 0,
              matched,
            };
          }
          if (matched) break;
        }

        setAttempt(best);
        setStatus("idle");
      };

      recognition.onerror = (event) => {
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setStatus("denied");
        } else if (event.error === "no-speech") {
          setStatus("no-speech");
        } else if (event.error !== "aborted") {
          setStatus("error");
        }
      };

      recognition.onend = () => {
        setStatus((current) => (current === "listening" ? "idle" : current));
      };

      recognitionRef.current = recognition;

      try {
        recognition.start();
      } catch {
        setStatus("error");
        return;
      }

      timeoutRef.current = window.setTimeout(() => {
        try {
          recognition.stop();
        } catch {
          // Already ended.
        }
      }, timeoutMs);
    },
    [lang, timeoutMs, cleanup]
  );

  const stop = useCallback(() => {
    const recognition = recognitionRef.current;
    if (recognition) {
      try {
        recognition.stop();
      } catch {
        // Already ended.
      }
    }
    setStatus((current) => (current === "listening" ? "idle" : current));
  }, []);

  const reset = useCallback(() => {
    cleanup();
    setAttempt(null);
    setStatus(getRecognitionConstructor() ? "idle" : "unsupported");
  }, [cleanup]);

  return {
    status,
    attempt,
    isSupported: status !== "unsupported",
    isListening: status === "listening",
    listen,
    stop,
    reset,
  };
}
