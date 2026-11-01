import fs from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { chromium, devices } from "@playwright/test";
import { summarizeMeasurements } from "./lib/quality_audit.mjs";

const base = (process.argv[2] ?? "http://localhost:4173/wordpix").replace(/\/$/, "");
if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname))
  throw Error("Use a local production preview");
const output = "output/quality-followup-2026-11-02";
await fs.mkdir(output, { recursive: true });
const observations = [];
const browser = await chromium.launch();
try {
  for (const locale of ["en", "ar"])
    for (const profile of ["desktop", "mobile-slow-3g"])
      for (let repetition = 1; repetition <= 3; repetition++) {
        const context = await browser.newContext({
          ...(profile === "desktop"
            ? { viewport: { width: 1280, height: 720 } }
            : devices["Pixel 5"]),
          serviceWorkers: "block",
          reducedMotion: "reduce",
        });
        await context.addInitScript(
          ({ locale }) => {
            localStorage.setItem("wordpix:interface-lang", locale);
            localStorage.setItem(
              "wordpix:learner:v2",
              JSON.stringify({
                version: 3,
                accessibility: {
                  autoPlayAudio: false,
                  autoAdvance: false,
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
                sessionId: "quality-readiness",
                lessonId: "camping-site-5",
                unitId: "camping-site",
                wordQueue: ["rock-climbing"],
                step: 2,
                attempts: [],
                startedAt: new Date(0).toISOString(),
              })
            );
            window.qualityLongTasks = [];
            new PerformanceObserver((list) =>
              window.qualityLongTasks.push(
                ...list
                  .getEntries()
                  .map((entry) => ({ startTime: entry.startTime, duration: entry.duration }))
              )
            ).observe({ type: "longtask", buffered: true });
          },
          { locale }
        );
        const page = await context.newPage();
        const errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        const cdp = await context.newCDPSession(page);
        await cdp.send("Network.enable");
        if (profile === "mobile-slow-3g") {
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
        cdp.on("Network.responseReceived", ({ requestId, response, type }) =>
          requests.set(requestId, {
            url: response.url,
            type,
            status: response.status,
            fromDiskCache: Boolean(response.fromDiskCache),
          })
        );
        cdp.on("Network.loadingFinished", ({ requestId, encodedDataLength }) => {
          if (requests.has(requestId)) requests.get(requestId).bytes = encodedDataLength;
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
          await image.evaluate((element) => element.decode());
          const readyMs = Math.round(performance.now() - begin);
          const longTasks = await page.evaluate(() => window.qualityLongTasks);
          const scripts = [...requests.values()].filter((row) => row.type === "Script");
          observations.push({
            targetId: "camping-site-" + locale,
            profile,
            repetition,
            visit,
            readyMs,
            scriptBytes: scripts.reduce((sum, row) => sum + (row.bytes ?? 0), 0),
            largestScripts: scripts.sort((a, b) => (b.bytes ?? 0) - (a.bytes ?? 0)).slice(0, 10),
            usageMedia: scripts.filter((row) => row.url.includes("/usage-media-unit-")),
            longTaskMs: Math.round(longTasks.reduce((sum, row) => sum + row.duration, 0)),
            largestLongTasks: longTasks.sort((a, b) => b.duration - a.duration).slice(0, 5),
            errors: [...errors],
          });
          console.log(`${locale} ${profile} ${repetition} ${visit}: ${readyMs} ms`);
          await fs.writeFile(
            output + "/readiness.json",
            JSON.stringify(
              {
                measuredAt: new Date().toISOString(),
                sourceCommit: execFileSync("git", ["rev-parse", "HEAD"], {
                  encoding: "utf8",
                }).trim(),
                includesUncommittedChanges: true,
                conditions:
                  "Local production build. Three fresh contexts with same-context warm reloads per locale/profile. 150ms latency, 1.024Mbps, 4x CPU on mobile. Real image GETs; service workers blocked. Readiness is a visible decoded picture, not interactive completion. Host/public-network variation applies; no physical-device or field-metric claim.",
                observations,
                summary: summarizeMeasurements(observations),
              },
              null,
              2
            ) + "\n"
          );
        }
        await context.close();
      }
} finally {
  await browser.close();
}
if (observations.some((row) => row.errors.length)) throw Error("Page errors during measurement");
