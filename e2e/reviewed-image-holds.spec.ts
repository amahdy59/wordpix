import { expect, test } from "@playwright/test";
import fs from "node:fs";
const audit: {
  assets: Array<{
    key: string;
    uses: Array<{ kind: string; wordId: string; unitId: string; lessonId: string; text: string }>;
  }>;
} = JSON.parse(fs.readFileSync("docs/media/ACTIVE_IMAGE_TRIAGE_2026-10-30.json", "utf8"));
import { disableNarrationForContentTest } from "./audioFixture";
import { waitForStyles } from "./waitForStyles";

const cases = audit.assets.flatMap((asset) =>
  asset.uses
    .filter((use) => use.kind === "sentence" && ["network-switch", "celery"].includes(use.wordId))
    .map((use) => ({ ...use, rejectedKey: asset.key }))
);

for (const language of ["en", "ar"]) {
  for (const row of cases) {
    test(`held ${row.wordId} picture stays absent with usable ${language} word tiles`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await disableNarrationForContentTest(page);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.addInitScript(
        ({ row, language }) => {
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
              sessionId: "reviewed-hold",
              lessonId: row.lessonId,
              unitId: row.unitId,
              wordQueue: [row.wordId],
              step: 3,
              attempts: [],
              startedAt: new Date(0).toISOString(),
            })
          );
        },
        { row, language }
      );
      await page.goto(`/#/learn/${row.unitId}/step-4`, { waitUntil: "domcontentloaded" });
      await waitForStyles(page);
      const words = page.getByRole("group", {
        name: language === "en" ? "Available words" : "الكلمات المتاحة",
        exact: true,
      });
      await expect(words).toBeVisible();
      const imageSources = await page
        .getByRole("img")
        .evaluateAll((images) => images.map((image) => image.getAttribute("src")));
      expect(imageSources.some((source) => source?.includes(row.rejectedKey))).toBe(false);
      const tile = words.getByRole("button").first();
      await tile.focus();
      await expect(tile).toBeFocused();
      await tile.press("Enter");
      await expect(tile).toBeDisabled();
      expect(errors).toEqual([]);
    });
  }
}
