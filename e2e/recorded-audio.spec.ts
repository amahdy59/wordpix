import { createHash } from "node:crypto";
import { expect, test } from "@playwright/test";
import { installWebKitPlaybackFixture, playbackFixture } from "./audioFixture";

test.use({ serviceWorkers: "block" });

const hash = createHash("sha256")
  .update("edge-v1|en-US-JennyNeural|rate=+0%|pitch=+0Hz|volume=+0%\nHello! Welcome to WordPix.")
  .digest("hex");
const recordingKey = `audio/edge-v1/en-US-JennyNeural/${hash}.mp3`;

test("a verified recording plays, caches, and survives reload without invoking device speech", async ({
  page,
}, info) => {
  await installWebKitPlaybackFixture(page, info);
  await page.addInitScript(() => {
    const evidence = { deviceCalls: 0, playing: [] as string[] };
    Object.assign(window, { recordingEvidence: evidence });
    const synth = window.speechSynthesis;
    if (synth)
      synth.speak = () => {
        evidence.deviceCalls++;
        throw Error("Device speech is forbidden");
      };
    const NativeAudio = window.Audio;
    window.Audio = class extends NativeAudio {
      constructor(url?: string) {
        super(url);
      }
      async play() {
        await super.play();
        evidence.playing.push(this.src);
      }
    };
  });
  let networkAvailable = true;
  const requests: string[] = [];
  await page.route("**/audio/**/*.mp3", (route) => {
    requests.push(route.request().url());
    return networkAvailable
      ? route.fulfill({
          body: playbackFixture(),
          contentType: "audio/wav",
          headers: { "access-control-allow-origin": "*" },
        })
      : route.abort("failed");
  });
  const openPreview = async () => {
    await page.goto("/#/home");
    await page.getByRole("button", { name: "Settings & Accessibility", exact: true }).click();
    await page.getByRole("button", { name: "Audio & Speech", exact: true }).click();
  };
  await openPreview();
  await page.getByRole("button", { name: "Test the WordPix sentence voice", exact: true }).click();
  await expect.poll(() => requests.some((url) => url.endsWith(recordingKey))).toBe(true);
  await expect
    .poll(() =>
      page.evaluate(
        (key) =>
          new Promise<boolean>((resolve, reject) => {
            const request = indexedDB.open("wordpix_offline_db");
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
              const db = request.result;
              const lookup = db
                .transaction("audio_cache", "readonly")
                .objectStore("audio_cache")
                .getAll();
              lookup.onsuccess = () => {
                resolve(
                  lookup.result.some(
                    (entry: { key: string; blob?: Blob; bytes?: ArrayBuffer }) =>
                      entry.key.endsWith(key) &&
                      (entry.blob?.size ?? entry.bytes?.byteLength ?? 0) > 0
                  )
                );
                db.close();
              };
              lookup.onerror = () => {
                reject(lookup.error);
                db.close();
              };
            };
          }),
        recordingKey
      )
    )
    .toBe(true);
  await page.reload();
  networkAvailable = false;
  await page.getByRole("button", { name: "Audio & Speech", exact: true }).click();
  await page.getByRole("button", { name: "Test the WordPix sentence voice", exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(() =>
        (
          window as Window & { recordingEvidence: { playing: string[] } }
        ).recordingEvidence.playing.some((url) => url.startsWith("blob:"))
      )
    )
    .toBe(true);
  expect(
    await page.evaluate(
      () =>
        (window as Window & { recordingEvidence: { deviceCalls: number } }).recordingEvidence
          .deviceCalls
    )
  ).toBe(0);
});

test("unavailable recordings expose recovery and never start device speech", async ({
  page,
}, info) => {
  await installWebKitPlaybackFixture(page, info);
  await page.addInitScript(() => {
    const evidence = { deviceCalls: 0 };
    Object.assign(window, { recordingEvidence: evidence });
    if (window.speechSynthesis)
      window.speechSynthesis.speak = () => {
        evidence.deviceCalls++;
      };
  });
  await page.route("**/audio/**/*.mp3", (route) => route.abort("failed"));
  await page.goto("/#/home");
  await page.getByRole("button", { name: "Settings & Accessibility", exact: true }).click();
  await page.getByRole("button", { name: "Audio & Speech", exact: true }).click();
  await page.getByRole("button", { name: "Test the WordPix sentence voice", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: /recording|audio/i })).toContainText(
    /try again/i
  );
  expect(
    await page.evaluate(
      () =>
        (window as Window & { recordingEvidence: { deviceCalls: number } }).recordingEvidence
          .deviceCalls
    )
  ).toBe(0);
});
