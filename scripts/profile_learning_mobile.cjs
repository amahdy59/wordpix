/** Read-only production-build lab profile; no asset interception or production writes. */
const { chromium } = require("@playwright/test");
const fs = require("node:fs/promises");
const manifest = require("../src/app/generated/suppliedMedia.json");

async function main() {
  const base = process.argv[2] || "http://localhost:4173/wordpix/";
  if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname))
    throw Error("Profile a local production preview only");
  const assignment = manifest.find(
    (row) => row.wordId === "sales-clerk" && row.kind === "sentence"
  );
  const browser = await chromium.launch();
  const runs = [];
  try {
    for (const language of ["en", "ar"]) {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
        serviceWorkers: "block",
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      await page.addInitScript(
        ({ assignment, language }) => {
          localStorage.setItem("wordpix:interface-lang", language);
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
              sessionId: "performance-lab",
              lessonId: assignment.lessonId,
              unitId: assignment.unitId,
              wordQueue: [assignment.wordId],
              step: 3,
              attempts: [],
              startedAt: new Date(0).toISOString(),
            })
          );
          window.__profile = { longTasks: [], lcp: [] };
          new PerformanceObserver((list) =>
            window.__profile.longTasks.push(
              ...list
                .getEntries()
                .map((entry) => ({ startTime: entry.startTime, duration: entry.duration }))
            )
          ).observe({ type: "longtask", buffered: true });
          new PerformanceObserver((list) =>
            window.__profile.lcp.push(...list.getEntries().map((entry) => entry.startTime))
          ).observe({ type: "largest-contentful-paint", buffered: true });
        },
        { assignment, language }
      );
      const cdp = await context.newCDPSession(page);
      await cdp.send("Network.enable");
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
      await cdp.send("Network.emulateNetworkConditions", {
        offline: false,
        latency: 150,
        downloadThroughput: 1600000 / 8,
        uploadThroughput: 750000 / 8,
      });
      for (const cache of ["cold", "warm"]) {
        let transferredBytes = 0;
        const onLoaded = (event) => {
          transferredBytes += event.encodedDataLength;
        };
        cdp.on("Network.loadingFinished", onLoaded);
        if (cache === "cold") await cdp.send("Network.clearBrowserCache");
        if (cache === "cold")
          await page.goto(`${base}#/learn/${assignment.unitId}/step-4`, {
            waitUntil: "domcontentloaded",
          });
        else await page.reload({ waitUntil: "domcontentloaded" });
        const image = page.getByRole("img", { name: assignment.imageAlt, exact: true });
        await image.waitFor({ state: "visible", timeout: 90000 });
        await image.evaluate((element) => element.decode());
        const readyMs = await page.evaluate(() => performance.now());
        // Snapshot the real available-word controls; fail if the exercise never becomes interactive.
        const buttons = page.locator('[role="group"][lang="en"] button:not(:disabled)');
        await buttons.first().waitFor({ state: "visible" });
        const label = await buttons.first().getAttribute("aria-label");
        const started = performance.now();
        await buttons.first().click();
        const responseMs = performance.now() - started;
        await page.screenshot({
          path: `output/required-images-2026-10-30/profile-${language}-${cache}.png`,
        });
        const measurements = await page.evaluate(() => ({
          ...window.__profile,
          paint: performance
            .getEntriesByType("paint")
            .map((x) => ({ name: x.name, startTime: x.startTime })),
          scripts: performance
            .getEntriesByType("resource")
            .filter((x) => x.initiatorType === "script")
            .map((x) => ({ url: x.name, duration: x.duration, transferSize: x.transferSize })),
        }));
        runs.push({
          language,
          cache,
          readyMs,
          responseMs,
          interactionLabel: label,
          transferredBytes,
          currentImage: await image.evaluate((element) => ({
            currentSrc: element.currentSrc,
            naturalWidth: element.naturalWidth,
          })),
          ...measurements,
        });
        cdp.off("Network.loadingFinished", onLoaded);
      }
      await context.close();
    }
  } finally {
    await browser.close();
  }
  const report = {
    generatedAt: new Date().toISOString(),
    configuration: {
      cpuSlowdown: 4,
      latencyMs: 150,
      downloadMbps: 1.6,
      viewport: "390x844",
      dpr: 1,
      serviceWorkers: "blocked",
      samplesPerLocaleAndCache: 1,
    },
    limitations:
      "Lab sample on this host, not field INP or physical-device certification. Real CDN GETs; local preview; no production writes. Click time includes Playwright actionability checks.",
    runs,
  };
  await fs.writeFile(
    "output/required-images-2026-10-30/mobile-performance.json",
    JSON.stringify(report, null, 2) + "\n"
  );
  console.log(
    JSON.stringify(
      runs.map(({ language, cache, readyMs, responseMs, transferredBytes, currentImage }) => ({
        language,
        cache,
        readyMs,
        responseMs,
        transferredBytes,
        currentImage,
      })),
      null,
      2
    )
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
