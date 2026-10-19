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

test("fitted media retains a visible frame while its image loads", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  let releaseImage = () => {};
  const imageReady = new Promise<void>((resolve) => {
    releaseImage = resolve;
  });
  await page.route("**/*", async (route) => {
    if (route.request().resourceType() !== "image") return route.continue();
    await imageReady;
    await route.fulfill({
      contentType: "image/svg+xml",
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><rect width="1024" height="1024" fill="gray"/></svg>',
    });
  });
  await prepare(page);
  try {
    await openCore(page, 3);
    const frame = page.locator(".wp-question-media").first();
    await expect(frame).toBeVisible();
    const pendingBox = (await frame.boundingBox())!;
    expect(pendingBox.width).toBeGreaterThanOrEqual(100);
    expect(pendingBox.height).toBeGreaterThanOrEqual(100);
  } finally {
    releaseImage();
  }
  await expect
    .poll(() =>
      page
        .locator(".wp-question-media img")
        .first()
        .evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)
    )
    .toBe(true);
});

for (const viewport of [
  { width: 390, height: 844 },
  { width: 820, height: 1180 },
  { width: 1280, height: 720 },
  { width: 1440, height: 900 },
]) {
  test(`sentence prompt aligns and media fills its column at ${viewport.width}`, async ({
    page,
  }, info) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize(viewport);
    // A square fixture reproduces the original letterboxing without relying
    // on the availability or proportions of remote lesson artwork.
    await page.route("**/*", (route) =>
      route.request().resourceType() === "image"
        ? route.fulfill({
            contentType: "image/svg+xml",
            body: '<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><rect width="1024" height="1024" fill="gray"/></svg>',
          })
        : route.continue()
    );
    await prepare(page);
    await openCore(page, 3);
    const prompt = page.getByLabel(/^Sentence with a missing word:/);
    const choices = page.getByRole("group", { name: "Words for the missing part", exact: true });
    await expect(choices.getByRole("button")).toHaveCount(3);
    await expect(prompt).toHaveCSS("border-top-width", "0px");
    await expect(prompt).toHaveCSS("padding-top", "0px");
    await expect(prompt).not.toContainText("____");
    const media = page.locator(".wp-question-media").first();
    await expect(media.locator("img")).toBeVisible();
    const mediaBox = (await media.boundingBox())!;
    const imageBox = (await media.locator("img").boundingBox())!;
    expect(imageBox.width).toBeGreaterThanOrEqual(100);
    expect(imageBox.height).toBeGreaterThanOrEqual(100);
    expect(Math.abs(imageBox.width - imageBox.height)).toBeLessThanOrEqual(2);
    const mediaColumn = (await page.locator('[data-exercise-zone="media"]').boundingBox())!;
    expect(mediaBox.width).toBeLessThanOrEqual(mediaColumn.width + 1);
    if (viewport.width < 768) {
      expect(mediaBox.width).toBeGreaterThan(viewport.width - 50);
    }
    if (viewport.width >= 768) {
      const promptBox = (await prompt.boundingBox())!;
      const choicesBox = (await choices.boundingBox())!;
      expect(Math.abs(promptBox.y - mediaBox.y)).toBeLessThanOrEqual(2);
      expect(choicesBox.y - (promptBox.y + promptBox.height)).toBeLessThanOrEqual(24);
    }
    const region = page.getByRole("region", {
      name: "The Five Senses 1: Complete the sentence exercise",
      exact: true,
    });
    await expect(region).toBeVisible();
    await expect
      .poll(() => region.evaluate((el) => el.scrollHeight - el.clientHeight))
      .toBeLessThanOrEqual(2);
    for (const button of await choices.getByRole("button").all()) {
      await button.focus();
      await expect(button).toBeFocused();
      await expect(button).toBeInViewport();
      const box = await button.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      expect(box!.y).toBeGreaterThanOrEqual(0);
      expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
    }
    await region.evaluate((el) => {
      el.scrollTop = 0;
    });
    await assertNoHorizontalOverflow(page);
    await capture(page, `sentence-${viewport.width}`, info);
    expect(errors).toEqual([]);
  });
}

for (const viewport of [
  { width: 390, height: 844 },
  { width: 820, height: 1180 },
  { width: 1024, height: 768 },
  { width: 1280, height: 720 },
]) {
  test(`feedback and continue button remain in viewport without scrolling at ${viewport.width}x${viewport.height}`, async ({
    page,
  }, info) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize(viewport);
    await page.route("**/*", (route) =>
      route.request().resourceType() === "image"
        ? route.fulfill({
            contentType: "image/svg+xml",
            body: '<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><rect width="1024" height="1024" fill="gray"/></svg>',
          })
        : route.continue()
    );
    await prepare(page);
    await openCore(page, 3);
    const choices = page.getByRole("group", { name: "Words for the missing part", exact: true });
    const buttons = choices.getByRole("button");
    await expect(buttons).toHaveCount(3);

    // Click an incorrect option to trigger the feedback panel
    const distractor = choices.locator('button[data-is-target="false"]').first();
    await distractor.click();

    const feedback = page.locator('[data-exercise-zone="feedback"]');
    await expect(feedback.getByRole("status")).toBeVisible();
    await expect(feedback).toBeInViewport();

    // Verify continue button appears and is in viewport
    const continueBtn = page.getByRole("button", { name: /continue/i });
    await expect(continueBtn).toBeVisible();
    if (viewport.width < 768) {
      await continueBtn.scrollIntoViewIfNeeded();
    }
    await expect(continueBtn).toBeInViewport();

    // On tablets and desktop, verify no scrolling is needed and feedback is placed under choices
    if (viewport.width >= 768) {
      const scrollContainer = page.locator(".wp-question-scroll");
      const scrollDiff = await scrollContainer.evaluate((el) => el.scrollHeight - el.clientHeight);
      expect(scrollDiff).toBeLessThanOrEqual(2);

      // Feedback must be positioned under choices in the interaction column
      const choicesBox = (await choices.boundingBox())!;
      const feedbackBox = (await feedback.boundingBox())!;
      expect(feedbackBox.y).toBeGreaterThanOrEqual(choicesBox.y + choicesBox.height - 5);
      expect(Math.abs(feedbackBox.x - choicesBox.x)).toBeLessThanOrEqual(10);
    }

    await assertNoHorizontalOverflow(page);
    await capture(page, `sentence-feedback-${viewport.width}x${viewport.height}`, info);
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
