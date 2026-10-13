import { waitForStyles } from "./waitForStyles";
import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
const authoredLessons = JSON.parse(
  fs.readFileSync(
    path.resolve("src/app/learning/foundations/figmaPronunciationContent.json"),
    "utf8"
  )
) as { lessons: Array<{ number: number; images: Array<{ label: string; role: string }> }> };
const firstTarget = (number: number) => (number === 3 ? "led" : "log");
const pronunciationTrialCount = (number: number, stage: number) => {
  const items = authoredLessons.lessons.find((lesson) => lesson.number === number)!.images;
  const pool = items.filter((item) =>
    stage === 4 ? item.role === "transfer" : item.role !== "transfer"
  );
  const count = new Set(pool.map((item) => item.label.toLowerCase())).size;
  return stage === 2 ? Math.min(3, count) : count;
};
const progressText = (number: number, current: number) =>
  `Check ${current} of ${pronunciationTrialCount(number, 1)} in this stage`;

// These assertions intentionally observe the media request itself. Blocking the
// production service worker keeps a previously cached response from bypassing
// Playwright's route hooks; offline behavior is covered in resilience.spec.ts.
test.use({ serviceWorkers: "block" });

test("Pin or Pen includes the spoken target and its authored contrast without image clues", async ({
  page,
}) => {
  const requests: string[] = [];
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/audio/**/*.mp3", async (route) => {
    requests.push(route.request().url());
    await route.fulfill({
      body: fs.readFileSync(
        path.resolve(
          "public/audio/00/00d352d1588016d7ba44e0bf1547b1255f1960d25b7a23aec8ed1bd941ced8a9.mp3"
        )
      ),
      contentType: "audio/mpeg",
    });
  });
  await page.goto("/#/pronunciation/lesson-03", { waitUntil: "domcontentloaded" });
  await waitForStyles(page);
  await page.getByRole("button", { name: "Start listening", exact: true }).click();
  await page.getByRole("button", { name: "Play model pronunciation" }).click();
  const answer = page.getByRole("button", { name: new RegExp(`^Option \\d+: ${firstTarget(3)}$`) });
  await expect(answer).toBeVisible();
  await expect(
    page.getByRole("button", {
      name: new RegExp(`^Option \\d+: ${"lid"}$`),
    })
  ).toBeVisible();
  const clip = manifest.clips[firstTarget(3)].find((clip) => clip.source === "derived-profile")!;
  await expect.poll(() => requests.some((url) => url.endsWith(clip.objectKey))).toBe(true);
  await expect(answer.locator("img")).toHaveCount(0);
  await answer.focus();
  await page.keyboard.press("Space");
  await expect(page.getByRole("status").filter({ hasText: "Correct" })).toBeVisible();
  expect(errors).toEqual([]);
});

const manifest = JSON.parse(
  fs.readFileSync(
    path.resolve("src/app/learning/foundations/pronunciationAudioManifest.json"),
    "utf8"
  )
) as {
  clips: Record<string, Array<{ objectKey: string; displayText: string; source: string }>>;
};

test("pronunciation uses the reconciled R2 manifest key", async ({ page }) => {
  const pageErrors: string[] = [];
  const audioRequests: string[] = [];
  const fixture = path.resolve(
    "public/audio/00/00d352d1588016d7ba44e0bf1547b1255f1960d25b7a23aec8ed1bd941ced8a9.mp3"
  );
  const expectedKey = manifest.clips.cat.find(
    (clip) => clip.displayText === "cat" && clip.source === "derived-profile"
  )?.objectKey;
  expect(expectedKey).toBeTruthy();

  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("request", (request) => {
    if (request.url().includes("/audio/")) audioRequests.push(request.url());
  });
  await page.route("**/audio/**/*.mp3", async (route) => {
    await route.fulfill({
      body: fs.readFileSync(fixture),
      contentType: "audio/mpeg",
      status: 200,
    });
  });

  await page.goto("/#/pronunciation/lesson-01", { waitUntil: "domcontentloaded" });
  await waitForStyles(page);
  await expect(page.getByRole("heading", { name: /same or different/i })).toBeVisible();
  await page.getByRole("button", { name: "Play model pronunciation" }).click();
  await expect.poll(() => audioRequests.some((url) => url.endsWith(expectedKey!))).toBe(true);
  expect(pageErrors).toEqual([]);
});

test("replaying feedback pauses automatic continuation after explicit opt-in", async ({ page }) => {
  const fixture = path.resolve(
    "public/audio/00/00d352d1588016d7ba44e0bf1547b1255f1960d25b7a23aec8ed1bd941ced8a9.mp3"
  );
  await page.route("**/audio/**/*.mp3", async (route) => {
    await route.fulfill({
      body: fs.readFileSync(fixture),
      contentType: "audio/mpeg",
      status: 200,
    });
  });

  await page.goto("/#/pronunciation/lesson-01", { waitUntil: "domcontentloaded" });
  await waitForStyles(page);
  await page.getByRole("button", { name: "Start listening", exact: true }).click();
  await expect(page.getByText(progressText(1, 1), { exact: true })).toBeVisible();
  await page.getByLabel("Lesson options", { exact: true }).click();
  await page.getByRole("button", { name: "Automatic next question: off" }).click();
  await expect(page.getByRole("button", { name: "Automatic next question: on" })).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: new RegExp(`^Option \\d+: ${firstTarget(1)}$`) }).click();
  await expect(page.getByRole("status").filter({ hasText: "Correct" })).toBeVisible();
  const replay = page.getByRole("button", { name: "Replay feedback" });
  await expect(replay).toBeVisible();
  await replay.click();
  await expect(page.getByText(progressText(1, 1), { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Next question", exact: true }).click();

  await expect(page.getByText(progressText(1, 2), { exact: true })).toBeVisible({
    timeout: 10_000,
  });
});

test("manual pronunciation feedback preserves focus and survives reload", async ({ page }) => {
  await page.goto("/#/pronunciation/lesson-03", { waitUntil: "domcontentloaded" });
  await waitForStyles(page);
  await page.getByRole("button", { name: "Start listening", exact: true }).click();
  const answer = page.getByRole("button", { name: new RegExp(`^Option \\d+: ${firstTarget(3)}$`) });
  await answer.focus();
  await page.keyboard.press("Space");
  await expect(answer).toBeFocused();
  await expect(answer).toHaveAttribute("aria-disabled", "true");
  await expect(page.getByRole("button", { name: "Next question", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Next question", exact: true }).click();
  await expect(page.getByText(progressText(3, 2), { exact: true })).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          new Promise<number | undefined>((resolve, reject) => {
            const request = indexedDB.open("wordpix_offline_db");
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
              const db = request.result;
              const transaction = db.transaction("learner_state", "readonly");
              const read = transaction.objectStore("learner_state").get("primary_state");
              transaction.oncomplete = () => {
                const state = read.result as
                  | { pronunciationProgress?: Record<string, { session?: { trial: number } }> }
                  | undefined;
                db.close();
                resolve(state?.pronunciationProgress?.["lesson-03"]?.session?.trial);
              };
              transaction.onerror = () => {
                db.close();
                reject(transaction.error);
              };
            };
          })
      )
    )
    .toBe(1);
  await page.reload({ waitUntil: "domcontentloaded" });
  await waitForStyles(page);
  await expect(page.getByText(progressText(3, 2), { exact: true })).toBeVisible();
});

test("pronunciation details contain focus and return it to the opener", async ({ page }) => {
  await page.goto("/#/pronunciation", { waitUntil: "domcontentloaded" });
  await waitForStyles(page);
  const opener = page.getByRole("button", { name: /details for lesson 2$/i });
  await opener.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(page.locator("#root")).toHaveAttribute("inert", "");
  for (let index = 0; index < 8; index++) {
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
});

test("pronunciation keeps the activity accessible in Arabic at enlarged text", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("wordpix:interface-lang", "ar"));
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto("/#/pronunciation/lesson-02", { waitUntil: "domcontentloaded" });
  await waitForStyles(page);
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("button", { name: "ابدأ الاستماع", exact: true })).toBeVisible();
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "32px";
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true
  );
  await page.getByRole("button", { name: "ابدأ الاستماع", exact: true }).click();
  await expect(page.getByRole("button", { name: /^الخيار/ }).first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true
  );
});

test("pronunciation automatic continuation is explicitly enabled", async ({ page }) => {
  const fixture = path.resolve(
    "public/audio/00/00d352d1588016d7ba44e0bf1547b1255f1960d25b7a23aec8ed1bd941ced8a9.mp3"
  );
  await page.route("**/audio/**/*.mp3", async (route) =>
    route.fulfill({ body: fs.readFileSync(fixture), contentType: "audio/mpeg" })
  );
  await page.goto("/#/pronunciation/lesson-01", { waitUntil: "domcontentloaded" });
  await waitForStyles(page);
  await page.getByRole("button", { name: "Start listening", exact: true }).click();
  await page.getByLabel("Lesson options", { exact: true }).click();
  await page.getByRole("button", { name: "Automatic next question: off" }).click();
  await expect(page.getByRole("button", { name: "Automatic next question: on" })).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: new RegExp(`^Option \\d+: ${firstTarget(1)}$`) }).click();
  await expect(page.getByText(progressText(1, 2), { exact: true })).toBeVisible({
    timeout: 20000,
  });
});

test("speaking offers an honest local alternative at narrow width and persists it", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/#/pronunciation/lesson-02", { waitUntil: "domcontentloaded" });
  await waitForStyles(page);
  await expect(page.getByRole("button", { name: "Start listening", exact: true })).toBeVisible();
  await page.evaluate(
    () =>
      new Promise<void>((resolve, reject) => {
        const request = indexedDB.open("wordpix_offline_db");
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction("learner_state", "readwrite");
          const store = transaction.objectStore("learner_state");
          const read = store.get("primary_state");
          read.onsuccess = () => {
            const state = read.result;
            state.pronunciationProgress["lesson-02"] = {
              status: "in-progress",
              currentStage: 3,
              bestScorePercent: 0,
              sessions: 0,
              updatedAt: new Date().toISOString(),
              session: {
                version: 2,
                trial: 0,
                attempts: 0,
                answer: null,
                unlockedStage: 3,
                outcomes: {},
                targetEvidence: {},
              },
            };
            store.put(state, "primary_state");
          };
          transaction.oncomplete = () => {
            db.close();
            resolve();
          };
          transaction.onerror = () => {
            db.close();
            reject(transaction.error);
          };
        };
      })
  );
  await page.reload({ waitUntil: "domcontentloaded" });
  await waitForStyles(page);
  await expect(
    page.getByRole("heading", { name: "Say this word, compare your recording, then continue." })
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /^Option/ })).toHaveCount(0);
  await expect(page.getByRole("checkbox", { name: /online feedback/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Next question", exact: true })).toHaveCount(0);
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
    .toBe(true);
  await page.screenshot({
    path: `output/pronunciation-review/speaking-320-${testInfo.project.name}.png`,
    fullPage: false,
  });
  await page
    .getByRole("button", { name: "Continue without a speaking check", exact: true })
    .click();
  await expect(page.getByText("Speaking not assessed", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Next question", exact: true }).click();
  await expect(
    page.getByText(`Check 2 of ${pronunciationTrialCount(2, 3)} in this stage`, { exact: true })
  ).toBeVisible();
  expect(errors).toEqual([]);
});
