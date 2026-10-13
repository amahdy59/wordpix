import type { Page, TestInfo } from "@playwright/test";

/** Valid PCM media for playback-state checks, independent of system MP3 codecs.
 * The route mock preserves the requested authored key; it never replaces a production asset.
 */
export function playbackFixture(): Buffer {
  const samples = 4_800;
  const sampleRate = 24_000;
  const bytes = Buffer.alloc(44 + samples * 2);
  bytes.write("RIFF", 0);
  bytes.writeUInt32LE(bytes.length - 8, 4);
  bytes.write("WAVEfmt ", 8);
  bytes.writeUInt32LE(16, 16);
  bytes.writeUInt16LE(1, 20);
  bytes.writeUInt16LE(1, 22);
  bytes.writeUInt32LE(sampleRate, 24);
  bytes.writeUInt32LE(sampleRate * 2, 28);
  bytes.writeUInt16LE(2, 32);
  bytes.writeUInt16LE(16, 34);
  bytes.write("data", 36);
  bytes.writeUInt32LE(samples * 2, 40);
  for (let index = 0; index < samples; index++)
    bytes.writeInt16LE(
      Math.round(Math.sin((index * 2 * Math.PI * 440) / sampleRate) * 2_000),
      44 + index * 2
    );
  return bytes;
}

/** The Windows WebKit runner rejects both test MP3 and PCM clips.
 * Its UI contract is exercised through real HTTP/cache reads, with deterministic
 * media events. Chromium retains native decoding; physical Safari is a manual gate.
 */
export async function installWebKitPlaybackFixture(page: Page, info: TestInfo) {
  if (info.project.name !== "mobile-webkit") return;
  await page.addInitScript(() => {
    class HttpAudio {
      src: string;
      preload = "auto";
      paused = true;
      currentTime = 0;
      duration = 0.2;
      playbackRate = 1;
      volume = 1;
      onplaying: (() => void) | null = null;
      onended: (() => void) | null = null;
      onerror: (() => void) | null = null;
      ontimeupdate: (() => void) | null = null;
      constructor(src = "") {
        this.src = src;
      }
      async play() {
        this.paused = false;
        try {
          const response = await fetch(this.src);
          const bytes = await response.arrayBuffer();
          if (!response.ok || bytes.byteLength < 44) throw new Error("Unavailable test media");
          if (this.paused) return;
          this.onplaying?.();
          queueMicrotask(() => {
            if (this.paused) return;
            this.currentTime = this.duration;
            this.ontimeupdate?.();
            this.onended?.();
          });
        } catch (error) {
          this.onerror?.();
          throw error;
        }
      }
      pause() {
        this.paused = true;
      }
    }
    window.Audio = HttpAudio as unknown as typeof Audio;
  });
}
