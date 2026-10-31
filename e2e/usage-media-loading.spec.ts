import { test, expect } from "@playwright/test";
import { resolveGroup } from "../src/app/data/courseCatalog";
import { disableNarrationForContentTest } from "./audioFixture";

test.use({ serviceWorkers: "block" });

for (const unitId of ["numbers-counting", "classroom", "shopping-mall"]) {
  test(`sentence practice loads only ${unitId} usage imagery`, async ({ page }) => {
    const lesson = resolveGroup(`${unitId}-1`);
    const requests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/usage-media-unit-")) requests.push(request.url());
    });
    await disableNarrationForContentTest(page);
    await page.addInitScript(
      ({ unitId, lesson }) => {
        localStorage.setItem("wordpix:interface-lang", "en");
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
            sessionId: "usage-media-loading",
            lessonId: lesson.id,
            unitId,
            wordQueue: lesson.wordIds.slice(0, 3),
            step: 2,
            attempts: [],
            startedAt: new Date(0).toISOString(),
          })
        );
      },
      { unitId, lesson }
    );
    const loaded = page.waitForResponse(
      (response) => response.url().includes(`/usage-media-unit-${unitId}-`) && response.ok()
    );
    await page.goto(`/#/learn/${unitId}/step-3`, { waitUntil: "domcontentloaded" });
    await loaded;
    await expect(page.locator('[data-exercise-zone="activity"]').getByRole("button")).toHaveCount(
      3
    );
    expect(requests.length).toBeGreaterThan(0);
    expect(requests.every((url) => url.includes(`/usage-media-unit-${unitId}-`))).toBe(true);
    const button = page.locator('[data-exercise-zone="activity"]').getByRole("button").first();
    await button.focus();
    await expect(button).toBeFocused();
    await expect(button).toBeInViewport();
  });
}
