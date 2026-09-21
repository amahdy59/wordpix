import { useCallback, useEffect, useRef, useState } from "react";

export type PrivateRecordingStatus =
  "unsupported" | "idle" | "requesting" | "recording" | "ready" | "denied" | "error";

const MAX_RECORDING_MS = 20_000;

/**
 * Captures a short recording in memory for private self-comparison.
 * Nothing is persisted or uploaded, and every object URL is revoked on delete/unmount.
 */
export function usePrivateRecording() {
  const supported =
    typeof window !== "undefined" &&
    typeof MediaRecorder !== "undefined" &&
    Boolean(navigator.mediaDevices?.getUserMedia);
  const [status, setStatus] = useState<PrivateRecordingStatus>(supported ? "idle" : "unsupported");
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timeoutRef = useRef<number | null>(null);
  const urlRef = useRef<string | null>(null);

  const stopTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }, []);

  const deleteRecording = useCallback(() => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    setRecordingUrl(null);
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
        setRecordingUrl(url);
        setStatus("ready");
      };
      recorder.start();
      setStatus("recording");
      timeoutRef.current = window.setTimeout(stop, MAX_RECORDING_MS);
    } catch (error) {
      stopTracks();
      const permissionDenied =
        error instanceof DOMException &&
        (error.name === "NotAllowedError" || error.name === "SecurityError");
      setStatus(permissionDenied ? "denied" : "error");
    }
  }, [deleteRecording, status, stop, stopTracks, supported]);

  useEffect(
    () => () => {
      const recorder = recorderRef.current;
      if (recorder?.state === "recording") recorder.stop();
      stopTracks();
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    },
    [stopTracks]
  );

  return { status, recordingUrl, start, stop, deleteRecording };
}
