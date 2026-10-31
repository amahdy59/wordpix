import fs from "node:fs/promises";
import { chromium, devices } from "@playwright/test";
const base = process.argv[2] ?? "http://localhost:6285";
const phase = process.argv[3] ?? "before";
if (!["before", "after"].includes(phase)) throw Error("Expected before or after");
await fs.mkdir("output/usage-loading-2026-10-31", { recursive: true });
const results = [];
const browser = await chromium.launch();
try {
  for (const profile of ["desktop", "mobile-slow"])
    for (let repetition = 1; repetition <= 3; repetition++) {
      const context = await browser.newContext({
        ...(profile === "mobile-slow" ? devices["Pixel 5"] : {}),
        serviceWorkers: "block",
      });
      await context.addInitScript(() => {
        localStorage.setItem(
          "wordpix:learner:v2",
          JSON.stringify({
            version: 3,
            accessibility: {
              autoAdvance: false,
              autoPlayAudio: false,
              reduceMotion: true,
              timedExercises: false,
            },
          })
        );
        localStorage.setItem(
          "wordpix:learner-state:v4",
          JSON.stringify({
            id: "lesson",
            mode: "NEW_LESSON",
            sessionId: "perf-review",
            lessonId: "camping-site-5",
            unitId: "camping-site",
            wordQueue: ["rock-climbing"],
            step: 2,
            attempts: [],
            startedAt: new Date(0).toISOString(),
          })
        );
        window.performanceEvidence = { longTasks: [], lcp: [] };
        new PerformanceObserver((list) =>
          window.performanceEvidence.longTasks.push(...list.getEntries().map((e) => e.duration))
        ).observe({ type: "longtask", buffered: true });
        new PerformanceObserver((list) =>
          window.performanceEvidence.lcp.push(...list.getEntries().map((e) => e.startTime))
        ).observe({ type: "largest-contentful-paint", buffered: true });
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      const cdp = await context.newCDPSession(page);
      await cdp.send("Network.enable");
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
      let requests = new Map();
      cdp.on("Network.responseReceived", (e) =>
        requests.set(e.requestId, {
          url: e.response.url,
          type: e.type,
          fromCache: e.response.fromDiskCache ?? false,
          status: e.response.status,
        })
      );
      cdp.on("Network.loadingFinished", (e) => {
        if (requests.has(e.requestId))
          requests.get(e.requestId).transferBytes = e.encodedDataLength;
      });
      for (const visit of ["cold", "warm"]) {
        requests = new Map();
        const begin = performance.now();
        if (visit === "cold")
          await page.goto(base + "/#/learn/camping-site/step-3", {
            waitUntil: "domcontentloaded",
            timeout: 90000,
          });
        else await page.reload({ waitUntil: "domcontentloaded", timeout: 90000 });
        const image = page.getByRole("img", {
          name: "A helmeted adult raises one hand to a hold on a vertical sandstone face, with feet braced against the wall.",
          exact: true,
        });
        await image.waitFor({ state: "visible", timeout: 90000 });
        await page.waitForFunction(
          () =>
            [...document.images].some(
              (i) => i.alt.startsWith("A helmeted adult") && i.complete && i.naturalWidth > 0
            ),
          undefined,
          { timeout: 90000 }
        );
        const readyMs = Math.round(performance.now() - begin);
        const state = await page.evaluate(() => ({
          navigation: performance.getEntriesByType("navigation")[0].toJSON(),
          evidence: window.performanceEvidence,
          images: [...document.images]
            .filter((i) => i.alt.startsWith("A helmeted adult"))
            .map((i) => ({ source: i.currentSrc, width: i.naturalWidth })),
        }));
        results.push({
          profile,
          repetition,
          visit,
          readyMs,
          scriptTransferBytes: [...requests.values()]
            .filter((r) => r.type === "Script")
            .reduce((s, r) => s + (r.transferBytes ?? 0), 0),
          usageRegistry: [...requests.values()].filter((r) => r.url.includes("/usageRegistry-")),
          usageMedia: [...requests.values()].filter((r) => r.url.includes("/usage-media-unit-")),
          longTaskMs: Math.round(state.evidence.longTasks.reduce((a, b) => a + b, 0)),
          longTaskCount: state.evidence.longTasks.length,
          lcpMs: Math.round(state.evidence.lcp.at(-1) ?? 0),
          image: state.images[0],
          pageErrors: errors,
        });
        await fs.writeFile(
          `output/usage-loading-2026-10-31/${phase}.json`,
          JSON.stringify(
            {
              base,
              conditions:
                "Fresh context per repetition; warm means same-context reload. Mobile: Pixel 5 emulation, 150ms latency, 1.024Mbps download and 4x CPU throttle from before navigation. Shared host load and public-network variance apply. Not physical device or field metrics.",
              results,
            },
            null,
            2
          )
        );
        console.log(`${profile} ${repetition} ${visit}: ${readyMs}ms`);
      }
      await context.close();
    }
} finally {
  await browser.close();
}
if (results.some((r) => r.pageErrors.length)) throw Error("Page errors during lesson measurement");
