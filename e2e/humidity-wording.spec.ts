import { expect, test } from "@playwright/test";
import { disableNarrationForContentTest } from "./audioFixture";
import { waitForStyles } from "./waitForStyles";

for (const language of ["en", "ar"]) {
  test(`natural humidity wording reaches the recorded phrase builder (${language})`, async ({
    page,
  }) => {
    await disableNarrationForContentTest(page);
    await page.addInitScript((language) => {
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
          sessionId: "humidity-migration",
          lessonId: "jungle-5",
          unitId: "jungle",
          wordQueue: ["humidity"],
          step: 3,
          attempts: [],
          startedAt: new Date(0).toISOString(),
        })
      );
    }, language);
    await page.goto("/#/learn/jungle/step-4", { waitUntil: "domcontentloaded" });
    await waitForStyles(page);
    // The phrase is initially blanked and its tiles are shuffled. Complete it
    // through the controls rather than expecting the hidden answer as prose.
    await page.getByRole("button", { name: /High/ }).click();
    await page.getByRole("button", { name: /humidity/ }).click();
    await page.getByRole("button", { name: /makes/ }).click();
    await expect(page.locator("main")).toContainText(
      /High\s*humidity\s*makes\s*the\s*air\s*feel\s*damp/
    );
    await expect(page.locator("main")).not.toContainText("swelters");
    await expect(page.locator("html")).toHaveAttribute("dir", language === "ar" ? "rtl" : "ltr");
  });
}
