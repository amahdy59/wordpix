import { expect, test } from "@playwright/test";
import { playbackFixture } from "./audioFixture";

test("a stalled recording offers retry instead of buffering indefinitely", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    // Deterministic transport stall after a real HTTP read. Native decoding is
    // exercised separately in recorded-audio.spec.ts; this clip never ends.
    const evidence = { stalled: false };
    Object.assign(window, { stallEvidence: evidence });
    class StalledAudio {
      src: string;
      preload = "auto";
      paused = true;
      currentTime = 0;
      duration = 30;
      playbackRate = 1;
      volume = 1;
      onplaying: (() => void) | null = null;
      onwaiting: (() => void) | null = null;
      constructor(url = "") {
        this.src = url;
      }
      async play() {
        // Audio unlocking uses a silent data URL and is not the recording.
        if (!this.src.startsWith("http")) return;
        const response = await fetch(this.src);
        const bytes = await response.arrayBuffer();
        if (!response.ok || bytes.byteLength < 44) throw Error("Unavailable test media");
        this.paused = false;
        this.onplaying?.();
        this.onwaiting?.();
        evidence.stalled = true;
      }
      pause() {
        this.paused = true;
      }
    }
    window.Audio = StalledAudio as unknown as typeof Audio;
  });
  await page.route("**/audio/**/*.mp3", (route) =>
    route.fulfill({
      body: playbackFixture(),
      contentType: "audio/wav",
      headers: { "access-control-allow-origin": "*" },
    })
  );
  await page.goto("/#/home");
  await page.getByRole("button", { name: "Settings & Accessibility", exact: true }).click();
  await page.getByRole("button", { name: "Audio & Speech", exact: true }).click();
  const startTime = new Date("2026-10-30T00:00:00Z");
  await page.clock.install({ time: startTime });
  await page.clock.pauseAt(startTime);
  await page.getByRole("button", { name: "Test the WordPix sentence voice", exact: true }).click();
  const status = page.getByRole("status").filter({ hasText: /recording|audio/i });
  await expect
    .poll(() =>
      page.evaluate(
        () => (window as Window & { stallEvidence: { stalled: boolean } }).stallEvidence.stalled
      )
    )
    .toBe(true);
  await expect(status).toHaveCount(0);
  await page.clock.runFor(16000);
  // Allow React's scheduled render to commit after the deadline callback.
  await page.clock.resume();
  await expect(status).toContainText(/try again/i);
  expect(errors).toEqual([]);
});
