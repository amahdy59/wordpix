import { expect, test, type Page, type TestInfo } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { resolveGroup } from "../src/app/data/courseCatalog";
import { EXERCISES } from "../src/app/core/skillExerciseCatalog";
import { waitForStyles } from "./waitForStyles";
import { disableNarrationForContentTest } from "./audioFixture";

test.use({ serviceWorkers: "block" });

async function prepare(page: Page, language = "en", textSize = "standard") {
  await disableNarrationForContentTest(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(
    ({ language, textSize }) => {
      localStorage.setItem("wordpix:learner-state:v4", JSON.stringify({ id: "explore" }));
      localStorage.setItem("wordpix:interface-lang", language);
      localStorage.setItem(
        "wordpix:learner:v2",
        JSON.stringify({
          version: 3,
          accessibility: {
            textSize,
            reduceMotion: true,
            autoAdvance: false,
            autoPlayAudio: false,
            timedExercises: false,
          },
        })
      );
    },
    { language, textSize }
  );
}

async function openCore(page: Page, step: number, unitId = "five-senses") {
  const lesson = resolveGroup(`${unitId}-1`);
  await page.addInitScript(
    ({ lesson, step, unitId }) => {
      localStorage.setItem(
        "wordpix:learner-state:v4",
        JSON.stringify({
          id: "lesson",
          mode: "NEW_LESSON",
          sessionId: `question-layout-${unitId}-${step}`,
          lessonId: lesson.id,
          unitId,
          wordQueue: lesson.wordIds.slice(0, 5),
          step: step - 1,
          attempts: [],
          startedAt: new Date(0).toISOString(),
        })
      );
    },
    { lesson, step, unitId }
  );
  await page.goto(`/#/learn/${unitId}/step-${step}`, { waitUntil: "domcontentloaded" });
  await waitForStyles(page);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("progressbar").first()).toBeVisible();
}

async function assertNoHorizontalOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true
  );
}

async function capture(page: Page, name: string, info: TestInfo) {
  const screenshotPath = info.outputPath(`${name}.png`);
  await page.screenshot({ path: screenshotPath, animations: "disabled", scale: "css" });
  await info.attach(`${name}.png`, { path: screenshotPath, contentType: "image/png" });
}

test("sentence stays usable when its image is unavailable", async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route("**/*", (route) =>
    route.request().resourceType() === "image" ? route.abort() : route.continue()
  );
  await prepare(page);
  await openCore(page, 3);
  await expect(
    page.getByText("We’re updating this image. Use the text clue to answer.")
  ).toBeVisible();
  const support = page.locator("details").filter({ has: page.getByText(/Meaning clue:/) });
  await expect(support).toHaveAttribute("open", "");
  const region = page.locator(".wp-question-scroll");
  await expect
    .poll(() => region.evaluate((el) => el.scrollHeight - el.clientHeight))
    .toBeLessThanOrEqual(2);
  const choices = page.getByRole("group", { name: "Words for the missing part", exact: true });
  for (const choice of await choices.getByRole("button").all())
    await expect(choice).toBeInViewport();
  await capture(page, "sentence-image-unavailable", info);
});

for (const viewport of [
  { width: 390, height: 844 },
  { width: 1280, height: 720 },
  { width: 1440, height: 900 },
]) {
  test(`sentence prompt is distinct and the entire question fits at ${viewport.width}`, async ({
    page,
  }, info) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize(viewport);
    await prepare(page);
    await openCore(page, 3);
    const prompt = page.getByLabel(/^Sentence with a missing word:/);
    const choices = page.getByRole("group", { name: "Words for the missing part", exact: true });
    await expect(choices.getByRole("button")).toHaveCount(3);
    await expect(prompt).toHaveCSS("border-top-width", "0px");
    await expect(prompt).toHaveCSS("padding-top", "0px");
    const region = page.getByRole("region", {
      name: "The Five Senses 1: Complete the sentence exercise",
      exact: true,
    });
    await expect
      .poll(() => region.evaluate((el) => el.scrollHeight - el.clientHeight))
      .toBeLessThanOrEqual(2);
    for (const button of await choices.getByRole("button").all()) {
      const box = await button.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      expect(box!.y).toBeGreaterThanOrEqual(0);
      expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
    }
    await assertNoHorizontalOverflow(page);
    await capture(page, `sentence-${viewport.width}`, info);
    expect(errors).toEqual([]);
  });
}

for (const viewport of [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
]) {
  test(`all practice question layouts remain reachable at ${viewport.width}`, async ({
    page,
  }, info) => {
    test.setTimeout(180_000);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize(viewport);
    await prepare(page);
    for (const exercise of EXERCISES) {
      await test.step(exercise.id, async () => {
        await page.goto(`/#/skills/${exercise.id}`, { waitUntil: "domcontentloaded" });
        await waitForStyles(page);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        await expect(page.getByRole("progressbar").first()).toBeVisible();
        await expect(page.locator(".wp-question-scroll")).toBeVisible();
        await assertNoHorizontalOverflow(page);
        const controls = page.locator(".wp-question-scroll").getByRole("button");
        const last = controls.last();
        await last.scrollIntoViewIfNeeded();
        await expect(last).toBeInViewport();
        const box = await last.boundingBox();
        expect(box!.height).toBeGreaterThanOrEqual(44);
        await page.locator(".wp-question-scroll").evaluate((el) => {
          el.scrollTop = 0;
        });
        if (info.project.name === "chromium")
          await capture(page, `${exercise.id}-${viewport.width}`, info);
      });
    }
    expect(errors).toEqual([]);
  });
}

for (const language of ["en", "ar"]) {
  test(`question reflows at 200% text on a short screen: ${language}`, async ({ page }, info) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await prepare(page, language);
    await openCore(page, 3);
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "32px";
    });
    await expect(page.locator("html")).toHaveCSS("font-size", "32px");
    const title = await page.getByRole("heading", { level: 1 }).boundingBox();
    expect(title!.width).toBeGreaterThan(200);
    await assertNoHorizontalOverflow(page);
    const choices = page.locator('[data-exercise-zone="activity"]').getByRole("button");
    await expect(choices).toHaveCount(3);
    for (const control of await choices.all()) {
      await control.focus();
      await expect(control).toBeFocused();
      await expect(control).toBeInViewport();
    }
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(result.violations).toEqual([]);
    await capture(page, `reflow-${language}`, info);
  });
}

test("sentence builder and reading keep source and response separate", async ({ page }, info) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await prepare(page);
  await openCore(page, 4, "colors");
  const tiles = page.getByRole("group", { name: "Available words", exact: true });
  await expect(tiles.getByRole("button").first()).toBeInViewport();
  await assertNoHorizontalOverflow(page);
  await capture(page, "sentence-builder", info);
  await page.getByRole("button", { name: "Skip to reading", exact: true }).click();
  await expect(page.locator('[data-exercise-family="reading-context"]')).toBeVisible();
  await assertNoHorizontalOverflow(page);
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(scan.violations).toEqual([]);
  await capture(page, "reading-context", info);
});

test("specialist quizzes use plain prompts and distinct answer controls", async ({
  page,
}, info) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 1280, height: 800 });
  await prepare(page);
  for (const [name, route] of [
    ["business", "/#/business/unit-01/exercises"],
    ["conversation", "/#/conversation/unit-01/quiz"],
    ["hadith", "/#/hadith/lesson-2"],
  ]) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await waitForStyles(page);
    if (name === "hadith") {
      await page.getByText("All steps", { exact: true }).click();
      await page.getByRole("button", { name: /Practice/ }).click();
    }
    const prompt = page.locator("[data-question-prompt]").first();
    await expect(prompt).toBeVisible();
    await expect(prompt).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(page.getByRole("radio").first()).toBeVisible();
    await assertNoHorizontalOverflow(page);
    await capture(page, name, info);
  }
});

test("pronunciation comparisons keep both choices visible on a phone", async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await prepare(page);
  await page.goto("/#/pronunciation/lesson-03", { waitUntil: "domcontentloaded" });
  await waitForStyles(page);
  await page.getByRole("button", { name: "Start listening", exact: true }).click();
  const options = page.getByRole("button", { name: /^Option \d+:/ });
  await expect(options.first()).toBeVisible();
  expect(await options.count()).toBeGreaterThanOrEqual(2);
  for (const option of await options.all()) {
    await expect(option).toBeInViewport();
    const box = await option.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
  await assertNoHorizontalOverflow(page);
  await capture(page, "pronunciation-phone", info);
});
