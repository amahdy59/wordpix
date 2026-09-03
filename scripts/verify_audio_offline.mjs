import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";

// Read-only production check: plays one clip, verifies persisted bytes, reloads
// to clear the in-memory audio cache, then plays the same clip without a network.
// Optional second URL serves a local build under the first URL's browser origin.
// Service workers are blocked to prove IndexedDB playback independently of CacheStorage.
const baseURL = process.argv[2] || "https://amahdy59.github.io/wordpix/";
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ serviceWorkers: "block" });
  const appSource = process.argv[3];
  if (appSource) {
    await context.route(`${baseURL.replace(/\/$/, "")}/**`, async (route) => {
      const source = route
        .request()
        .url()
        .replace(baseURL.replace(/\/$/, ""), appSource.replace(/\/$/, ""));
      await route.fulfill({ response: await context.request.get(source) });
    });
  }
  await context.addInitScript(() => {
    window.audioEvidence = [];
    window.audioAttempts = [];
    const NativeAudio = window.Audio;
    window.Audio = class extends NativeAudio {
      constructor(url) {
        super(url);
        window.audioAttempts.push(String(url));
        this.addEventListener("error", () =>
          window.audioAttempts.push(`error:${this.error?.message}`)
        );
        this.addEventListener("playing", () => window.audioEvidence.push(String(url)));
      }
    };
  });
  const page = await context.newPage();
  page.on("console", (message) => {
    if (message.type() === "error") console.error(message.text());
  });
  await page.goto(`${baseURL.replace(/\/$/, "")}/#/learn/bathroom/study/learn`);
  const reveal = () => page.getByRole("button", { name: /^Reveal Word/ }).click();
  await reveal();
  await page.waitForFunction(() => window.audioEvidence.some((url) => url.startsWith("https:")));
  const url = await page.evaluate(() =>
    window.audioEvidence.find((url) => url.startsWith("https:"))
  );
  await expect
    .poll(
      () =>
        page.evaluate(async (url) => {
          const db = await new Promise((resolve, reject) => {
            const request = indexedDB.open("wordpix_offline_db");
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
          });
          try {
            return await new Promise((resolve, reject) => {
              const request = db
                .transaction("audio_cache")
                .objectStore("audio_cache")
                .get(`cdn:${url}`);
              request.onsuccess = () => resolve(request.result?.blob?.size || 0);
              request.onerror = () => reject(request.error);
            });
          } finally {
            db.close();
          }
        }, url),
      { timeout: 15000 }
    )
    .toBeGreaterThan(0);
  console.log("PASS: CDN clip played and nonempty audio persisted in IndexedDB.", url);
  await page.reload();
  await page.getByRole("button", { name: /^Reveal Word/ }).waitFor();
  await context.setOffline(true);
  await reveal();
  await page
    .waitForFunction(() => window.audioEvidence.some((url) => url.startsWith("blob:")))
    .catch(async (error) => {
      console.log(
        await page.evaluate(() => ({
          attempts: window.audioAttempts,
          played: window.audioEvidence,
        }))
      );
      throw error;
    });
  const played = await page.evaluate(() => window.audioEvidence);
  assert(played.some((url) => url.startsWith("blob:")));
  assert(!played.some((url) => url.startsWith("https:")));
  console.log("PASS: after reload, the app played the persisted clip offline through a blob URL.");
} finally {
  await browser.close();
}
