import { expect, test } from "@playwright/test";
import { resolveGroup } from "../src/app/data/courseCatalog";
import { waitForStyles } from "./waitForStyles";
import { disableNarrationForContentTest } from "./audioFixture";

import fs from "node:fs";
const supplied: Array<{
  sourceIndex: number;
  kind: string;
  unitId: string;
  lessonId: string;
  wordId: string;
  text: string;
  imagePath: string;
  imageAlt: string;
}> = JSON.parse(fs.readFileSync("src/app/generated/suppliedMedia.json", "utf8"));
const assignments = supplied
  .filter(
    (row) => row.kind === "sentence" && [1, 9, 19, 20, 34, 37, 38, 39].includes(row.sourceIndex)
  )
  .map((row) => ({ ...row, sentence: row.text, stage: 3 }));
// Match the fourth-stage phrase builder shown in the learner's screenshots.
test.use({ serviceWorkers: "block", deviceScaleFactor: 1 });

for (const language of ["en", "ar"] as const) {
  for (const assignment of assignments) {
    const wordId = assignment.wordId;
    test(`supplied ${wordId} image reaches stage ${assignment.stage + 1} (${language})`, async ({
      page,
    }, info) => {
      const lesson = resolveGroup(assignment.lessonId);
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await disableNarrationForContentTest(page);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.route("**/*", (route) =>
        route.request().resourceType() === "image"
          ? route.fulfill({
              contentType: "image/svg+xml",
              body: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180"><rect width="320" height="180" fill="gray"/></svg>',
            })
          : route.continue()
      );
      await page.addInitScript(
        ({ assignment, lesson, language }) => {
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
              sessionId: `reviewed-reuse-${assignment.wordId}`,
              lessonId: lesson.id,
              unitId: assignment.unitId,
              wordQueue: [assignment.wordId],
              step: assignment.stage,
              attempts: [],
              startedAt: new Date(0).toISOString(),
            })
          );
        },
        { assignment, lesson, language }
      );
      await page.goto(`/#/learn/${assignment.unitId}/step-${assignment.stage + 1}`, {
        waitUntil: "domcontentloaded",
      });
      await waitForStyles(page);
      const image = page.getByRole("img", { name: assignment.imageAlt, exact: true });
      await expect(image).toBeVisible();
      if (assignment.imagePath) await expect(image).toHaveAttribute("src", assignment.imagePath);
      else
        await expect(image).toHaveAttribute(
          "src",
          /^(?:data:image\/svg\+xml|.*\/assets\/[^/]+\.svg$)/
        );
      await expect
        .poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth))
        .toBeGreaterThan(0);
      await expect(page.locator("html")).toHaveAttribute("dir", language === "ar" ? "rtl" : "ltr");
      await info.attach(`${wordId}-${language}.png`, {
        body: await page.screenshot({
          animations: "disabled",
          path: `output/required-images-2026-10-30/${wordId}-stage-${assignment.stage + 1}-${language}-${info.project.name}.png`,
        }),
        contentType: "image/png",
      });
      expect(errors).toEqual([]);
    });
  }
}
