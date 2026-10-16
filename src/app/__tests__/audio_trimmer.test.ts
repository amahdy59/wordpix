import { describe, it, expect, vi } from "vitest";
import { trimAudioSilence, encodeAudioBufferToWav } from "../shared/audioTrimmer";

describe("audioTrimmer", () => {
  it("returns original blob when AudioContext is unavailable", async () => {
    const originalBlob = new Blob(["fake audio data"], { type: "audio/webm" });
    const result = await trimAudioSilence(originalBlob);
    expect(result).toBe(originalBlob);
  });

  it("encodes an AudioBuffer into a valid WAV blob", async () => {
    // Construct a mock AudioBuffer
    const sampleRate = 44100;
    const length = 4410; // 0.1s
    const channelData = new Float32Array(length);
    for (let i = 0; i < length; i++) {
      channelData[i] = Math.sin((2 * Math.PI * 440 * i) / sampleRate);
    }

    const mockBuffer = {
      sampleRate,
      length,
      numberOfChannels: 1,
      duration: length / sampleRate,
      getChannelData: vi.fn().mockReturnValue(channelData),
    } as unknown as AudioBuffer;

    const wavBlob = encodeAudioBufferToWav(mockBuffer, 0, length);
    expect(wavBlob).toBeInstanceOf(Blob);
    expect(wavBlob.type).toBe("audio/wav");

    // Check WAV header
    const buffer = await wavBlob.arrayBuffer();
    const view = new DataView(buffer);
    const decoder = new TextDecoder();

    expect(decoder.decode(buffer.slice(0, 4))).toBe("RIFF");
    expect(decoder.decode(buffer.slice(8, 12))).toBe("WAVE");
    expect(decoder.decode(buffer.slice(12, 16))).toBe("fmt ");
    expect(view.getUint16(20, true)).toBe(1); // PCM format
    expect(view.getUint16(22, true)).toBe(1); // Mono channel
    expect(view.getUint32(24, true)).toBe(sampleRate);
    expect(view.getUint16(34, true)).toBe(16); // 16-bit
    expect(decoder.decode(buffer.slice(36, 40))).toBe("data");
    expect(view.getUint32(40, true)).toBe(length * 2); // 2 bytes per sample
  });

  it("safely handles silence trimming with mocked AudioContext", async () => {
    const sampleRate = 16000;
    const length = 16000; // 1s
    const channelData = new Float32Array(length);

    // 0.4s silence, 0.2s tone, 0.4s silence
    const toneStart = 6400;
    const toneEnd = 9600;
    for (let i = toneStart; i < toneEnd; i++) {
      channelData[i] = 0.5;
    }

    const mockBuffer = {
      sampleRate,
      length,
      numberOfChannels: 1,
      duration: 1,
      getChannelData: vi.fn().mockReturnValue(channelData),
    } as unknown as AudioBuffer;

    class MockAudioContext {
      state = "running";
      decodeAudioData = vi.fn().mockResolvedValue(mockBuffer);
      close = vi.fn().mockResolvedValue(undefined);
    }

    const globalScope = globalThis as unknown as { AudioContext?: unknown };
    const originalAudioContext = globalScope.AudioContext;
    try {
      globalScope.AudioContext = MockAudioContext;

      const fakeBlob = new Blob([new Uint8Array([1, 2, 3])], { type: "audio/webm" });
      const trimmedBlob = await trimAudioSilence(fakeBlob, -40, 0.05);

      expect(trimmedBlob).toBeInstanceOf(Blob);
      expect(trimmedBlob.type).toBe("audio/wav");

      // Verify that the output blob is smaller than full 1 second
      const trimmedBuffer = await trimmedBlob.arrayBuffer();
      const trimmedSamples = (trimmedBuffer.byteLength - 44) / 2;
      expect(trimmedSamples).toBeLessThan(length);
      expect(trimmedSamples).toBeGreaterThan(toneEnd - toneStart);
    } finally {
      globalScope.AudioContext = originalAudioContext;
    }
  });
});
