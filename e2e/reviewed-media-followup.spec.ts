import fs from "node:fs";
import { expect, test } from "@playwright/test";
import { COURSE_UNITS, resolveGroup } from "../src/app/data/courseCatalog";
import { waitForStyles } from "./waitForStyles";
import { disableNarrationForContentTest } from "./audioFixture";

const batch = JSON.parse(
  fs.readFileSync("docs/media/PUBLICATION_REVIEW_BATCH_2026-10-30.json", "utf8")
);
const assignments = [
  ...batch.responsiveAssociations.map(
    (row: {
      wordId: string;
      unitId: string;
      sentence: string;
      originalUrl: string;
      proposedImageAlt: string;
      responsiveSources: { url: string; width: number }[];
    }) => ({
      ...row,
      lessonId: Object.values(COURSE_UNITS[row.unitId].groups).find((group) =>
        group.wordIds.includes(row.wordId)
      )!.id,
      imagePath: row.originalUrl,
      imageAlt: row.proposedImageAlt,
    })
  ),
  ...batch.existingArtReuse.map(
    (row: {
      content: { wordId: string; unitId: string; lessonId: string };
      url: string;
      imageAlt: string;
    }) => ({
      ...row.content,
      imagePath: row.url,
      imageAlt: row.imageAlt,
      responsiveSources: undefined,
    })
  ),
];
// A fixed density exercises the smaller variant; high-density screens may
// correctly select the retained original from the same width-descriptor set.
test.use({ serviceWorkers: "block", deviceScaleFactor: 1 });

for (const language of ["en", "ar"] as const) {
  for (const assignment of assignments) {
    const wordId = assignment.wordId;
    test(`reviewed ${wordId} image reaches the sentence exercise (${language})`, async ({
      page,
    }, info) => {
      const lesson = resolveGroup(assignment.lessonId);
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await disableNarrationForContentTest(page);
      await page.emulateMedia({ reducedMotion: "reduce" });
      // Test the actual resolver and rendering, independently of CDN latency.
      // The real CDN bytes have separate GET/SHA-256 review evidence.
      await page.route("**/*", (route) =>
        route.request().resourceType() === "image"
          ? language === "ar" && /\/responsive-(480|960)\//.test(route.request().url())
            ? route.abort("failed")
            : route.fulfill({
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
      if (assignment.responsiveSources && language === "en") {
        await expect(image).toHaveAttribute(
          "srcset",
          assignment.responsiveSources
            .map((source: { url: string; width: number }) => `${source.url} ${source.width}w`)
            .join(", ")
        );
        await expect
          .poll(() => image.evaluate((element) => (element as HTMLImageElement).currentSrc))
          .toMatch(/\/responsive-(480|960)\//);
      } else if (assignment.responsiveSources) {
        await expect(image).not.toHaveAttribute("srcset");
        await expect(image).toHaveAttribute("src", assignment.imagePath);
      }
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
