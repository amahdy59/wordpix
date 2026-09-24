import { useCallback, useEffect, useRef, useState } from "react";

export type PrivateRecordingStatus =
  "unsupported" | "idle" | "requesting" | "recording" | "ready" | "denied" | "error";

const MAX_RECORDING_MS = 20_000;

interface PrivateRecordingOptions {
  maxDurationMs?: number;
}

/**
 * Captures a short recording in memory for private self-comparison.
 * Nothing is persisted or uploaded, and every object URL is revoked on delete/unmount.
 */
export function usePrivateRecording({
  maxDurationMs = MAX_RECORDING_MS,
}: PrivateRecordingOptions = {}) {
  const safeMaxDurationMs = Math.min(Math.max(maxDurationMs, 5_000), 120_000);
  const supported =
    typeof window !== "undefined" &&
    typeof MediaRecorder !== "undefined" &&
    Boolean(navigator.mediaDevices?.getUserMedia);
  const [status, setStatus] = useState<PrivateRecordingStatus>(supported ? "idle" : "unsupported");
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [durationMs, setDurationMs] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timeoutRef = useRef<number | null>(null);
  const elapsedTimerRef = useRef<number | null>(null);
  const startedAtRef = useRef(0);
  const urlRef = useRef<string | null>(null);

  const stopTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    if (elapsedTimerRef.current !== null) window.clearInterval(elapsedTimerRef.current);
    elapsedTimerRef.current = null;
  }, []);

  const deleteRecording = useCallback(() => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    setRecordingUrl(null);
    setRecordingBlob(null);
    setDurationMs(0);
    setElapsedMs(0);
    setStatus(supported ? "idle" : "unsupported");
  }, [supported]);

  const stop = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder?.state === "recording") recorder.stop();
    stopTracks();
  }, [stopTracks]);

  const start = useCallback(async () => {
    if (!supported || status === "recording" || status === "requesting") return;
    deleteRecording();
    setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onerror = () => {
        stopTracks();
        setStatus("error");
      };
      recorder.onstop = () => {
        stopTracks();
        if (chunksRef.current.length === 0) {
          setStatus("error");
          return;
        }
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        const url = URL.createObjectURL(blob);
        urlRef.current = url;
        setRecordingBlob(blob);
        setRecordingUrl(url);
        setDurationMs(Math.max(250, performance.now() - startedAtRef.current));
        setStatus("ready");
      };
      startedAtRef.current = performance.now();
      recorder.start();
      setStatus("recording");
      setElapsedMs(0);
      elapsedTimerRef.current = window.setInterval(() => {
        setElapsedMs(Math.min(performance.now() - startedAtRef.current, safeMaxDurationMs));
      }, 250);
      timeoutRef.current = window.setTimeout(stop, safeMaxDurationMs);
    } catch (error) {
      stopTracks();
      const permissionDenied =
        error instanceof DOMException &&
        (error.name === "NotAllowedError" || error.name === "SecurityError");
      setStatus(permissionDenied ? "denied" : "error");
    }
  }, [deleteRecording, safeMaxDurationMs, status, stop, stopTracks, supported]);

  useEffect(
    () => () => {
      const recorder = recorderRef.current;
      if (recorder?.state === "recording") recorder.stop();
      stopTracks();
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    },
    [stopTracks]
  );

  return {
    status,
    recordingUrl,
    recordingBlob,
    durationMs,
    elapsedMs,
    maxDurationMs: safeMaxDurationMs,
    start,
    stop,
    deleteRecording,
  };
}
