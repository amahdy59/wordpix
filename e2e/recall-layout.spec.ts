import { expect, test } from "@playwright/test";
import { resolveGroup } from "../src/app/data/lessons";

const lesson = resolveGroup("construction-site-1");

for (const viewport of [
  { width: 390, height: 844, minimumCardWidth: 150 },
  { width: 768, height: 1024, minimumCardWidth: 300 },
  { width: 1440, height: 900, minimumCardWidth: 300 },
  { width: 1920, height: 1080, minimumCardWidth: 420 },
]) {
  test(`audio-match images use the viewport at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.addInitScript(
      ({ lessonId, wordQueue }) => {
        localStorage.setItem(
          "wordpix:learner-state:v4",
          JSON.stringify({
            id: "lesson",
            mode: "NEW_LESSON",
            sessionId: "recall-layout-check",
            lessonId,
            unitId: "construction-site",
            wordQueue,
            step: 1,
            attempts: [],
            startedAt: new Date(0).toISOString(),
          })
        );
      },
      { lessonId: lesson.id, wordQueue: lesson.wordIds }
    );

    await page.goto("/#/learn/construction-site/step-2");
    await expect(page.getByRole("heading", { name: "Audio Match" })).toBeVisible();

    const choices = page.getByRole("group", { name: "Choose matching picture for audio prompt" });
    const cards = choices.getByRole("button");
    await expect(cards).toHaveCount(4);
    await expect(cards.first()).toBeVisible();

    const box = await cards.first().boundingBox();
    const choicesBox = await choices.boundingBox();
    expect(box).not.toBeNull();
    expect(choicesBox).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(viewport.minimumCardWidth);
    expect(box!.height).toBeGreaterThanOrEqual(120);
    // Leave room only for the shell's bottom padding and mobile safe area.
    expect(choicesBox!.y + choicesBox!.height).toBeGreaterThanOrEqual(viewport.height - 64);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true
    );
  });
}
