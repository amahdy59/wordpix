import { test, expect } from "@playwright/test";
import { playbackFixture } from "./audioFixture";
import { waitForStyles } from "./waitForStyles";

test("cold Practice review presents its due non-Bedroom word without rewarding an empty session", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.route("**/audio/**/*.mp3", (route) =>
    route.fulfill({ body: playbackFixture(), contentType: "audio/wav" })
  );
  await page.addInitScript(() => {
    if (localStorage.getItem("review-regression-seeded")) return;
    localStorage.setItem("review-regression-seeded", "true");
    localStorage.setItem("wordpix:interface-lang", "en");
    localStorage.setItem(
      "wordpix:learner:v2",
      JSON.stringify({
        version: 4,
        preferences: { theme: "light" },
        accessibility: { includeListening: true, reduceMotion: true, autoPlayAudio: false },
        wordMemory: {
          "numbers-counting::one": {
            wordId: "one",
            unitId: "numbers-counting",
            exposures: 2,
            correctRecalls: 1,
            incorrectRecalls: 0,
            currentStreak: 1,
            lapses: 0,
            lastSeenAt: "2026-10-01T00:00:00Z",
            lastReviewedAt: "2026-10-01T00:00:00Z",
            nextReviewAt: "2026-10-02T00:00:00Z",
            intervalDays: 1,
            easeFactor: 2.5,
            mastery: "learning",
          },
        },
      })
    );
  });
  await page.goto("/wordpix/#/practice");
  await waitForStyles(page);
  await page.getByRole("button", { name: /Smart Review \(1 word/ }).click();
  await expect(page.getByRole("main")).toContainText(/One/);
  await expect(
    page.getByRole("heading", { name: /completed|complete!|session complete/i })
  ).toHaveCount(0);
  const xp = () =>
    page.evaluate(
      () =>
        new Promise<number>((resolve, reject) => {
          const request = indexedDB.open("wordpix_offline_db", 3);
          request.onerror = () => reject(request.error);
          request.onsuccess = () => {
            const db = request.result,
              tx = db.transaction("learner_state"),
              read = tx.objectStore("learner_state").get("primary_state");
            read.onsuccess = () => resolve(read.result.learnerProgress.xp);
            tx.oncomplete = () => db.close();
          };
        })
    );
  await expect.poll(xp).toBe(0);
  expect(errors).toEqual([]);
});

test("malformed saved navigation recovers to Home without an uncaught error", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() =>
    localStorage.setItem(
      "wordpix:learner-state:v4",
      JSON.stringify({ id: "lesson", lessonId: "numbers-counting-1" })
    )
  );
  await page.goto("/wordpix/");
  await expect(page.getByRole("heading", { level: 1, name: /Learner/ })).toBeVisible();
  await expect(page).toHaveURL(/#\/home$/);
  expect(errors).toEqual([]);
});

test("Library classifies a practised unit as in progress before any word is strong", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("wordpix:interface-lang", "en");
    localStorage.setItem(
      "wordpix:learner:v2",
      JSON.stringify({
        version: 4,
        accessibility: { reduceMotion: true },
        wordMemory: {
          "numbers-counting::one": {
            wordId: "one",
            unitId: "numbers-counting",
            exposures: 1,
            mastery: "learning",
            lastSeenAt: "2026-10-23T10:00:00Z",
          },
        },
      })
    );
  });
  await page.goto("/wordpix/#/library");
  await page.getByRole("searchbox").fill("Numbers & Counting");
  await page.getByText("Filter by level or progress", { exact: true }).click();
  const filters = page.getByRole("radiogroup", { name: "Filter by mastery status" });
  await filters.getByRole("radio", { name: "In Progress", exact: true }).click();
  const unit = page.getByRole("button", { name: /Numbers & Counting.*Unit reference/ });
  await expect(unit).toBeVisible();
  await filters.getByRole("radio", { name: "Not Started", exact: true }).click();
  await expect(unit).toHaveCount(0);
});
