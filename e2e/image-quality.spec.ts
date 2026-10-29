import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
import { resolveGroup } from "../src/app/data/courseCatalog";
import { disableNarrationForContentTest } from "./audioFixture";
const en = JSON.parse(await fs.readFile("src/i18n/en.json", "utf8"));
const ar = JSON.parse(await fs.readFile("src/i18n/ar.json", "utf8"));

for (const language of ["en", "ar"] as const) {
  test(`image reports stay local and export stable content identities (${language})`, async ({
    page,
  }) => {
    const copy = language === "ar" ? ar : en;
    const lesson = resolveGroup("camping-site-1");
    await disableNarrationForContentTest(page);
    await page.route("**/*", (route) =>
      route.request().resourceType() === "image"
        ? route.fulfill({
            contentType: "image/svg+xml",
            body: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240"><rect width="320" height="240" fill="gray"/></svg>',
          })
        : route.continue()
    );
    await page.addInitScript(
      ({ language, lesson }) => {
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
            sessionId: "image-report",
            lessonId: lesson.id,
            unitId: "camping-site",
            wordQueue: ["sleeping-bag"],
            step: 2,
            attempts: [],
            startedAt: new Date(0).toISOString(),
          })
        );
      },
      { language, lesson }
    );
    await page.goto("/#/learn/camping-site/step-3", { waitUntil: "domcontentloaded" });
    const trigger = page.getByRole("button", { name: copy.imageQuality.reportImage });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: copy.imageQuality.reportImage });
    await expect(dialog).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("dir", language === "ar" ? "rtl" : "ltr");
    await dialog.getByRole("combobox").selectOption("cropped");
    await dialog.getByRole("button", { name: copy.imageQuality.saveReport }).click();
    await expect(dialog.getByRole("status")).toContainText(copy.imageQuality.reportSaved);
    await dialog.getByRole("button", { name: copy.action.close }).last().click();
    await expect(trigger).toBeFocused();
    await page.goto("/#/settings", { waitUntil: "domcontentloaded" });
    await page.getByRole("searchbox").fill(copy.imageQuality.savedReports);
    const exportButton = page.getByRole("button", { name: copy.imageQuality.exportReports });
    await expect(exportButton).toBeEnabled();
    const downloadEvent = page.waitForEvent("download");
    await exportButton.click();
    const download = await downloadEvent;
    const payload = JSON.parse(await fs.readFile((await download.path())!, "utf8"));
    expect(payload.reports).toHaveLength(1);
    expect(payload.reports[0]).toMatchObject({
      reason: "cropped",
      context: { kind: "sentence", wordId: "sleeping-bag" },
    });
    expect(payload.reports[0].contentId).toMatch(/^[a-f0-9]{64}$/);
    await page.getByRole("button", { name: copy.imageQuality.clearReports }).click();
    await expect(exportButton).toBeDisabled();
  });
}
