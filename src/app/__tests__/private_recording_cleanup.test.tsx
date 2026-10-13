import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { usePrivateRecording } from "../shared/usePrivateRecording";

describe("private microphone lifecycle", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("releases a microphone permission result that arrives after leaving the lesson", async () => {
    const stop = vi.fn();
    let resolve: (value: MediaStream) => void = () => undefined;
    const permission = new Promise<MediaStream>((done) => {
      resolve = done;
    });
    vi.stubGlobal("MediaRecorder", class {});
    vi.stubGlobal("navigator", { mediaDevices: { getUserMedia: vi.fn(() => permission) } });
    const { result, unmount } = renderHook(() => usePrivateRecording());
    let start: Promise<void> = Promise.resolve();
    act(() => {
      start = result.current.start();
    });
    expect(result.current.status).toBe("requesting");
    unmount();
    await act(async () => {
      resolve({ getTracks: () => [{ stop }] } as unknown as MediaStream);
      await start;
    });
    expect(stop).toHaveBeenCalledOnce();
  });
  it("releases a late permission result after cancelling inside the same lesson", async () => {
    const stop = vi.fn();
    let resolve: (value: MediaStream) => void = () => undefined;
    const permission = new Promise<MediaStream>((done) => {
      resolve = done;
    });
    vi.stubGlobal("MediaRecorder", class {});
    vi.stubGlobal("navigator", { mediaDevices: { getUserMedia: vi.fn(() => permission) } });
    const { result } = renderHook(() => usePrivateRecording());
    let start = Promise.resolve();
    act(() => {
      start = result.current.start();
    });
    expect(result.current.status).toBe("requesting");
    act(() => result.current.deleteRecording());
    expect(result.current.status).toBe("idle");
    await act(async () => {
      resolve({ getTracks: () => [{ stop }] } as unknown as MediaStream);
      await start;
    });
    expect(stop).toHaveBeenCalledOnce();
    expect(result.current.status).toBe("idle");
    expect(result.current.recordingUrl).toBeNull();
  });
});
