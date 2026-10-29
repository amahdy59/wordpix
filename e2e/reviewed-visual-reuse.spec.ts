import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { resolveGroup } from "../src/app/data/courseCatalog";
import { waitForStyles } from "./waitForStyles";
import { disableNarrationForContentTest } from "./audioFixture";

const applied = JSON.parse(
  fs.readFileSync(path.resolve("docs/media/applied-assignments.json"), "utf8")
) as {
  assignments: Array<{
    wordId: string;
    unitId: string;
    lessonId: string;
    imagePath: string;
    imageAlt: string;
  }>;
};
test.use({ serviceWorkers: "block" });

for (const language of ["en", "ar"] as const) {
  for (const wordId of ["sleeping-bag", "garden-gloves"]) {
    test(`reviewed ${wordId} image reaches the sentence exercise (${language})`, async ({
      page,
    }, info) => {
      const assignment = applied.assignments.find((a) => a.wordId === wordId)!;
      const lesson = resolveGroup(assignment.lessonId);
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await disableNarrationForContentTest(page);
      await page.emulateMedia({ reducedMotion: "reduce" });
      // Test the actual resolver and rendering, independently of CDN latency.
      // The real CDN bytes have separate GET/SHA-256 review evidence.
      await page.route("**/*", (route) =>
        route.request().resourceType() === "image"
          ? route.fulfill({
              contentType: "image/svg+xml",
              body: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240"><rect width="320" height="240" fill="gray"/></svg>',
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
              step: 2,
              attempts: [],
              startedAt: new Date(0).toISOString(),
            })
          );
        },
        { assignment, lesson, language }
      );
      await page.goto(`/#/learn/${assignment.unitId}/step-3`, { waitUntil: "domcontentloaded" });
      await waitForStyles(page);
      const image = page.getByRole("img", { name: assignment.imageAlt, exact: true });
      await expect(image).toBeVisible();
      await expect(image).toHaveAttribute("src", assignment.imagePath);
      await expect
        .poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth))
        .toBeGreaterThan(0);
      await expect(page.locator("html")).toHaveAttribute("dir", language === "ar" ? "rtl" : "ltr");
      await info.attach(`${wordId}-${language}.png`, {
        body: await page.screenshot({ animations: "disabled" }),
        contentType: "image/png",
      });
      expect(errors).toEqual([]);
    });
  }
}
