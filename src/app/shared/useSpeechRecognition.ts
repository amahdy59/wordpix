import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Minimal typings for the Web Speech API.
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
  "unsupported" | "idle" | "listening" | "denied" | "no-speech" | "error";

export type PronunciationGrade = "excellent" | "good" | "fair" | "try-again";

export interface SpeechAttempt {
  /** What the engine heard, lowercased and stripped of punctuation. */
  heard: string;
  /** The engine's own confidence, 0–1. */
  confidence: number;
  matched: boolean;
  /** Legacy binary transcription-match indicator. Does not measure pronunciation. */
  accuracy: number;
  /** Qualitative pronunciation grade */
  grade: PronunciationGrade;
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
 */
export function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    const row = [i];
    for (let j = 1; j <= b.length; j += 1) {
      row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = row;
  }
  return prev[b.length];
}

/**
 * Legacy recognition indicator (0 or 100), never a pronunciation score.
 */
export function calculateAccuracy(heard: string, target: string): number {
  const normHeard = normaliseTranscript(heard);
  const normTarget = normaliseTranscript(target);
  if (!normHeard || !normTarget) return 0;
  if (normHeard === normTarget) return 100;

  // A transcription match is recognition evidence, not acoustic accuracy.
  return transcriptMatches(normHeard, normTarget) ? 100 : 0;
}

export function getPronunciationGrade(accuracy: number): PronunciationGrade {
  if (accuracy >= 90) return "excellent";
  if (accuracy >= 75) return "good";
  if (accuracy >= 50) return "fair";
  return "try-again";
}

/**
 * Does the transcript contain the complete target word or phrase?
 */
export function transcriptMatches(transcript: string, target: string): boolean {
  const heard = normaliseTranscript(transcript);
  const want = normaliseTranscript(target);
  if (!heard || !want) return false;
  // Match complete tokens/phrases. Never accept pin as part of pinned or pen.
  return ` ${heard} `.includes(` ${want} `);
}

interface Options {
  lang?: string;
  /** Listening stops automatically after this long. */
  timeoutMs?: number;
}

/**
 * Real speech recognition for speaking drills with live audio level analysis.
 */
export function useSpeechRecognition({ lang = "en-US", timeoutMs = 6000 }: Options = {}) {
  const [status, setStatus] = useState<RecognitionStatus>(() =>
    getRecognitionConstructor() ? "idle" : "unsupported"
  );
  const [attempt, setAttempt] = useState<SpeechAttempt | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const targetRef = useRef<string>("");
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const stopAudioAnalysis = useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      try {
        audioContextRef.current.close();
      } catch {
        // Ignore
      }
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  const startAudioAnalysis = useCallback(async () => {
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      micStreamRef.current = stream;

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const update = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setAudioLevel(normalized);
        animFrameRef.current = requestAnimationFrame(update);
      };
      update();
    } catch {
      // Microphone permissions or node error: fallback to passive listening without mic meter
    }
  }, []);

  const cleanup = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    stopAudioAnalysis();
    const recognition = recognitionRef.current;
    if (recognition) {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.onstart = null;
      try {
        recognition.abort();
      } catch {
        // Already stopped
      }
      recognitionRef.current = null;
    }
  }, [stopAudioAnalysis]);

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

      recognition.onstart = () => {
        setStatus("listening");
        startAudioAnalysis();
      };

      recognition.onresult = (event) => {
        stopAudioAnalysis();
        const result = event.results[event.resultIndex];
        if (!result) return;

        let best: SpeechAttempt = {
          heard: "",
          confidence: 0,
          matched: false,
          accuracy: 0,
          grade: "try-again",
        };

        for (let i = 0; i < result.length; i += 1) {
          const alt = result[i];
          const matched = transcriptMatches(alt.transcript, targetRef.current);
          const accuracy = calculateAccuracy(alt.transcript, targetRef.current);
          const grade = getPronunciationGrade(accuracy);

          if (matched || alt.confidence > best.confidence || accuracy > best.accuracy) {
            best = {
              heard: normaliseTranscript(alt.transcript),
              confidence: alt.confidence ?? 0,
              matched,
              accuracy,
              grade,
            };
          }
          if (matched) break;
        }

        setAttempt(best);
        setStatus("idle");
      };

      recognition.onerror = (event) => {
        stopAudioAnalysis();
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setStatus("denied");
        } else if (event.error === "no-speech") {
          setStatus("no-speech");
        } else if (event.error !== "aborted") {
          setStatus("error");
        }
      };

      recognition.onend = () => {
        stopAudioAnalysis();
        setStatus((current) => (current === "listening" ? "idle" : current));
      };

      recognitionRef.current = recognition;

      try {
        recognition.start();
      } catch {
        stopAudioAnalysis();
        setStatus("error");
        return;
      }

      timeoutRef.current = window.setTimeout(() => {
        try {
          recognition.stop();
        } catch {
          // Already ended
        }
      }, timeoutMs);
    },
    [lang, timeoutMs, cleanup, startAudioAnalysis, stopAudioAnalysis]
  );

  const stop = useCallback(() => {
    stopAudioAnalysis();
    const recognition = recognitionRef.current;
    if (recognition) {
      try {
        recognition.stop();
      } catch {
        // Already ended
      }
    }
    setStatus((current) => (current === "listening" ? "idle" : current));
  }, [stopAudioAnalysis]);

  const reset = useCallback(() => {
    cleanup();
    setAttempt(null);
    setStatus(getRecognitionConstructor() ? "idle" : "unsupported");
  }, [cleanup]);

  return {
    status,
    attempt,
    audioLevel,
    isSupported: status !== "unsupported",
    isListening: status === "listening",
    listen,
    stop,
    reset,
  };
}
