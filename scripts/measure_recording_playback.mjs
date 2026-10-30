import fs from "node:fs/promises";
import { chromium, devices, expect } from "@playwright/test";

const baseURL = process.argv[2] ?? "http://localhost:6174";
const phase = process.argv[3] ?? "current";
if (!/^[a-z-]+$/.test(phase)) throw Error("Invalid report phase");
const browser = await chromium.launch();
const results = [];
try {
  for (const profile of ["desktop", "mobile-slow"]) {
    const context = await browser.newContext({
      ...(profile === "mobile-slow" ? devices["Pixel 5"] : {}),
      serviceWorkers: "block",
    });
    await context.addInitScript(() => {
      window.playbackProbe = { events: [], clickedAt: 0 };
      const NativeAudio = window.Audio;
      window.Audio = class extends NativeAudio {
        constructor(url) {
          super(url);
          this.addEventListener("playing", () => {
            if (/^(?:https?:|blob:)/.test(this.src))
              window.playbackProbe.events.push({
                source: this.src,
                milliseconds: performance.now() - window.playbackProbe.clickedAt,
              });
          });
        }
      };
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    const requests = new Map();
    cdp.on("Network.responseReceived", (event) => {
      if (/\/audio\/.*\.mp3/.test(event.response.url))
        requests.set(event.requestId, {
          url: event.response.url,
          type: event.type,
          status: event.response.status,
          fromDiskCache: event.response.fromDiskCache ?? false,
        });
    });
    cdp.on("Network.loadingFinished", (event) => {
      if (requests.has(event.requestId))
        requests.get(event.requestId).encodedDataLength = event.encodedDataLength;
    });
    await page.goto(`${baseURL}/#/home`);
    await page.getByRole("button", { name: "Settings & Accessibility", exact: true }).click();
    await page.getByRole("button", { name: "Audio & Speech", exact: true }).click();
    if (profile === "mobile-slow") {
      await cdp.send("Network.emulateNetworkConditions", {
        offline: false,
        latency: 150,
        downloadThroughput: 128000,
        uploadThroughput: 64000,
        connectionType: "cellular3g",
      });
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    }
    await page.evaluate(() => {
      window.playbackProbe.clickedAt = performance.now();
    });
    await page
      .getByRole("button", { name: "Test the WordPix sentence voice", exact: true })
      .click();
    await page.waitForFunction(
      () => window.playbackProbe.events.some((event) => event.source.startsWith("https:")),
      undefined,
      { timeout: 45000 }
    );
    const cold = await page.evaluate(() =>
      window.playbackProbe.events.find((event) => event.source.startsWith("https:"))
    );
    await expect
      .poll(
        () =>
          page.evaluate(
            () =>
              new Promise((resolve, reject) => {
                const request = indexedDB.open("wordpix_offline_db");
                request.onerror = () => reject(request.error);
                request.onsuccess = () => {
                  const db = request.result;
                  const lookup = db.transaction("audio_cache").objectStore("audio_cache").getAll();
                  lookup.onsuccess = () => {
                    resolve(
                      lookup.result.some(
                        (row) => (row.bytes?.byteLength ?? row.blob?.size ?? 0) > 0
                      )
                    );
                    db.close();
                  };
                };
              })
          ),
        { timeout: 15000 }
      )
      .toBe(true);
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 0,
      downloadThroughput: -1,
      uploadThroughput: -1,
    });
    await page.reload();
    await page.getByRole("button", { name: "Audio & Speech", exact: true }).click();
    await context.setOffline(true);
    await page.evaluate(() => {
      window.playbackProbe.clickedAt = performance.now();
    });
    await page
      .getByRole("button", { name: "Test the WordPix sentence voice", exact: true })
      .click();
    let offline = null;
    let offlineFailure = null;
    try {
      await page.waitForFunction(
        () => window.playbackProbe.events.some((event) => event.source.startsWith("blob:")),
        undefined,
        { timeout: 5000 }
      );
      offline = await page.evaluate(() =>
        window.playbackProbe.events.find((event) => event.source.startsWith("blob:"))
      );
    } catch (error) {
      offlineFailure = error.message.split("\n")[0];
    }
    results.push({
      profile,
      coldStartupMs: Math.round(cold.milliseconds),
      offlineAfterReloadMs: offline ? Math.round(offline.milliseconds) : null,
      coldSource: cold.source,
      offlineSource: offline ? "persisted blob" : null,
      offlineFailure,
      requests: [...requests.values()],
      pageErrors: errors,
      conditions:
        profile === "mobile-slow"
          ? "Pixel 5 emulation, 150 ms latency, 1.024 Mbps download, 4x CPU throttle applied after Settings loaded"
          : "local production app, live public recording, unthrottled desktop",
    });
    await context.close();
  }
} finally {
  await browser.close();
}
const report = {
  measuredAt: new Date().toISOString(),
  phase,
  results,
  limitations:
    "One isolated cold and persisted-offline playback per profile. Live public network variance applies; this is not field Core Web Vitals or a physical device test.",
};
await fs.mkdir("output/media-followup-2026-10-30", { recursive: true });
await fs.writeFile(
  `output/media-followup-2026-10-30/playback-${phase}.json`,
  JSON.stringify(report, null, 2) + "\n"
);
console.log(JSON.stringify(report, null, 2));
if (phase !== "before" && results.some((row) => row.offlineFailure || row.pageErrors.length))
  process.exitCode = 1;
