import { expect, test } from "@playwright/test";
import { COURSE_UNITS, resolveGroup } from "../src/app/data/courseCatalog";
import { waitForStyles } from "./waitForStyles";
import { disableNarrationForContentTest } from "./audioFixture";

import fs from "node:fs";
const corrections: Array<{ wordId: string; sentence: string; imageAlt: string }> = JSON.parse(
  fs.readFileSync("src/app/content/sentenceMediaCorrections.json", "utf8")
);
const supplied: Array<{
  kind: string;
  lessonId: string;
  wordId: string;
  text: string;
  imageAlt: string;
  imagePath: string;
}> = JSON.parse(fs.readFileSync("src/app/generated/suppliedMedia.json", "utf8"));
const assignments = corrections
  .filter((row) => ["triangle", "oval", "sales-clerk", "shopper", "kahl-a"].includes(row.wordId))
  .map((row) => {
    const unitId =
      row.wordId === "kahl-a"
        ? "spirits-liqueurs"
        : ["sales-clerk", "shopper"].includes(row.wordId)
          ? "shopping-mall"
          : "shapes-geometry";
    const stage =
      row.sentence.startsWith("He chooses") ||
      row.sentence.startsWith("A knowledgeable") ||
      row.sentence.startsWith("Kahlúa is")
        ? 2
        : 3;
    const lessonId = Object.values(COURSE_UNITS[unitId].groups).find((group) =>
      group.wordIds.includes(row.wordId)
    )!.id;
    const latest = supplied.find(
      (item) =>
        item.kind === "sentence" &&
        item.wordId === row.wordId &&
        item.lessonId === lessonId &&
        item.text === row.sentence
    );
    return {
      ...row,
      stage,
      unitId,
      lessonId,
      imageAlt: latest?.imageAlt ?? row.imageAlt,
      imagePath: latest?.imagePath,
    };
  });
// Match the fourth-stage phrase builder shown in the learner's screenshots.
test.use({ serviceWorkers: "block", deviceScaleFactor: 1 });

for (const language of ["en", "ar"] as const) {
  for (const assignment of assignments) {
    const wordId = assignment.wordId;
    test(`corrected ${wordId} image reaches stage ${assignment.stage + 1} (${language})`, async ({
      page,
    }, info) => {
      const lesson = resolveGroup(assignment.lessonId);
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await disableNarrationForContentTest(page);
      await page.emulateMedia({ reducedMotion: "reduce" });
      // Keep display assertions independent of CDN timing; publication checks verify remote bytes.
      await page.route("https://pub-e84a3f9882a141ac9f33296bbad85e2a.r2.dev/**", (route) =>
        route.request().resourceType() === "image"
          ? route.fulfill({
              contentType: "image/svg+xml",
              body: '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect width="320" height="180" fill="gray"/></svg>',
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
          path: `output/content-repair-2026-10-30/${wordId}-stage-${assignment.stage + 1}-${language}-${info.project.name}.png`,
        }),
        contentType: "image/png",
      });
      expect(errors).toEqual([]);
    });
  }
}
