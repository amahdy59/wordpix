import { useCallback, useEffect, useRef } from "react";
import { useAccessibility } from "./useAccessibilityPreferences";
import { buildFeedbackSequence } from "../exercises/feedbackSpeech";
import { audioUrl, audioKey } from "./assetUrls";
import { getCachedAudio } from "../../lib/persistence/db";

const CHIME_CLEARANCE_MS = 180;

export const SPOKEN_ADVANCE_DELAY_MS = {
  correct: 2400,
  incorrect: 3600,
} as const;

interface SpeakInput {
  correct: boolean;
  targetLabel: string;
  targetTopic?: string;
  chosenLabel?: string | null;
  chosenTopic?: string;
}

export interface SpokenFeedback {
  enabled: boolean;
  speakFeedback: (input: SpeakInput) => void;
  cancel: () => void;
  delayFor: (correct: boolean) => number;
}

/** 
 * Resolves a text string to its cached blob URL if offline, 
 * or its remote CDN URL / local fallback if online.
 */
async function resolveAudioSource(text: string): Promise<string | null> {
  // We can't import audioHash synchronously because it uses crypto API,
  // but audioKey handles it asynchronously.
  const key = await audioKey(text);
  if (!key) return null;

  // Derive the hash from the key (audio/xx/HASH.mp3 -> HASH)
  const hash = key.split("/").pop()?.replace(".mp3", "");
  if (!hash) return null;

  // Check if we have it in IndexedDB (offline support)
  const cacheKey = `eleven:XfNU2rGpBa01ckF309OY:${text.toLowerCase().trim()}`;
  const cachedBlob = await getCachedAudio(cacheKey);
  if (cachedBlob) {
    return URL.createObjectURL(cachedBlob);
  }

  // Try the CDN
  const remoteUrl = await audioUrl(text);
  
  // If we are strictly offline (and it wasn't in DB), we might try a local public folder fallback
  // specifically for feedback stems which we copied to public/audio/feedback.
  // We prioritize the CDN URL if available, but if fetch fails, the audio element 
  // onerror can't easily switch sources seamlessly. For now, we return the remote CDN URL.
  // To handle offline properly, the service worker caches CDN requests.
  return remoteUrl ?? `/audio/feedback/${hash}.mp3`;
}

export function useSpokenFeedback(): SpokenFeedback {
  const { accessibility } = useAccessibility();
  // Feedback is always enabled if accessibility preferences allow it, 
  // since we rely on pre-generated audio rather than local TTS voices.
  const enabled = accessibility.spokenFeedback !== false;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const variantRef = useRef(0);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const sequenceQueueRef = useRef<string[]>([]);
  const isPlayingRef = useRef(false);

  const onCompleteRef = useRef<(() => void) | null>(null);

  const cancel = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    sequenceQueueRef.current = [];
    isPlayingRef.current = false;
    onCompleteRef.current = null;
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.src = "";
      currentAudioRef.current = null;
    }
  }, []);

  const playNextInSequence = useCallback(async function playNextInSequence() {
    if (sequenceQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      const onComplete = onCompleteRef.current;
      onCompleteRef.current = null;
      if (onComplete) onComplete();
      return;
    }

    const nextText = sequenceQueueRef.current.shift();
    if (!nextText) return;

    try {
      const src = await resolveAudioSource(nextText);
      if (!src) {
        // Skip this clip if we can't resolve it, move to next
        playNextInSequence();
        return;
      }

      const audio = new Audio(src);
      currentAudioRef.current = audio;
      
      audio.onended = () => {
        playNextInSequence();
      };

      audio.onerror = () => {
        // If it fails to load, gracefully skip to the next part of the sequence
        playNextInSequence();
      };

      await audio.play();
    } catch (err) {
      playNextInSequence();
    }
  }, []);

  const speakFeedback = useCallback(
    (input: SpeakInput, onComplete?: () => void) => {
      if (!enabled) {
        if (onComplete) onComplete();
        return;
      }

      cancel();

      onCompleteRef.current = onComplete || null;

      const sequence = buildFeedbackSequence({
        correct: input.correct,
        targetLabel: input.targetLabel,
        targetTopic: input.targetTopic,
        chosenLabel: input.chosenLabel,
        chosenTopic: input.chosenTopic,
        variant: variantRef.current++,
      });

      sequenceQueueRef.current = sequence;

      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        isPlayingRef.current = true;
        playNextInSequence();
      }, CHIME_CLEARANCE_MS);
    },
    [enabled, cancel, playNextInSequence]
  );

  const delayFor = useCallback(
    (correct: boolean) =>
      correct ? SPOKEN_ADVANCE_DELAY_MS.correct : SPOKEN_ADVANCE_DELAY_MS.incorrect,
    []
  );

  useEffect(() => cancel, [cancel]);

  return { enabled, speakFeedback, cancel, delayFor };
}
