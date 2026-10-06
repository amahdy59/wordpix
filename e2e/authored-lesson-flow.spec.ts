import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Authored lesson flow (Phase 4 & 5)", () => {
  test("loads authored Colors unit with reviewed glosses, sentences, and accessible controls", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width: 1280, height: 800 });

    // Bypass onboarding
    await page.addInitScript(() => {
      localStorage.setItem("wordpix:learner-state:v4", JSON.stringify({ id: "explore" }));
    });

    await page.goto("/#/learn/colors");
    await page.getByRole("heading", { name: /Colors/i }).waitFor({ timeout: 15_000 });

    // Verify first lesson card is visible and accessible
    const startButton = page.getByRole("button", { name: /^Start lesson:/ }).first();
    await expect(startButton).toBeVisible();

    const buttonHeight = await startButton.evaluate((el) => el.getBoundingClientRect().height);
    expect(buttonHeight).toBeGreaterThanOrEqual(44);

    // Launch lesson
    await startButton.click();
    await expect(page.getByRole("heading", { name: /Listen & repeat/i })).toBeVisible();

    // Open Word details modal / inspector
    const detailsButton = page.getByRole("button", { name: "Word details", exact: true });
    await expect(detailsButton).toBeVisible();
    await detailsButton.click();

    // Verify authored Arabic gloss and sentence are rendered
    await expect(page.getByRole("region", { name: /^Examples/i })).toBeVisible();
    await expect(page.getByText(/The apple is red\./i)).toBeVisible();

    // Verify WCAG accessibility
    const a11yScan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(a11yScan.violations).toEqual([]);
  });

  test("authored lesson displays properly at mobile viewport (390px)", async ({ page }) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width: 390, height: 844 });

    await page.addInitScript(() => {
      localStorage.setItem("wordpix:learner-state:v4", JSON.stringify({ id: "explore" }));
    });

    await page.goto("/#/learn/numbers-counting");
    await page.getByRole("heading", { name: /Numbers & Counting/i }).waitFor({ timeout: 15_000 });

    const startButton = page.getByRole("button", { name: /^Start lesson:/ }).first();
    await expect(startButton).toBeVisible();

    // Ensure no horizontal scrollbar on mobile
    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(hasHorizontalOverflow).toBe(false);

    await startButton.click();
    await expect(page.getByRole("heading", { name: /Listen & repeat/i })).toBeVisible();

    // Verify touch target size on mobile
    const prevButton = page.getByRole("button", { name: /Previous word/i });
    if (await prevButton.isVisible()) {
      const h = await prevButton.evaluate((el) => el.getBoundingClientRect().height);
      expect(h).toBeGreaterThanOrEqual(44);
    }
  });

  test("sentence building completes one short phrase without viewport overflow", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.addInitScript(() => {
      localStorage.setItem("wordpix:learner-state:v4", JSON.stringify({ id: "explore" }));
    });
    await page.goto("/#/learn/colors");
    await page.getByRole("heading", { name: /Colors/i }).waitFor({ timeout: 15_000 });
    await page
      .getByRole("button", { name: /^Start lesson:/ })
      .first()
      .click();
    await page.evaluate(() => {
      window.location.hash = "/learn/colors/step-4";
    });

    await expect(page.getByRole("heading", { name: "Complete the missing phrase." })).toBeVisible();
    const choices = page.getByRole("group", { name: "Available words" }).getByRole("button");
    await expect(choices.first()).toBeVisible();
    const choiceCount = await choices.count();
    expect(choiceCount).toBeGreaterThanOrEqual(2);
    expect(choiceCount).toBeLessThanOrEqual(3);

    for (let index = 0; index < choiceCount; index += 1) {
      const choiceHeight = await choices
        .nth(index)
        .evaluate((element) => element.getBoundingClientRect().height);
      expect(choiceHeight).toBeGreaterThanOrEqual(44);
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
    ).toBe(false);

    const a11yScan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(a11yScan.violations).toEqual([]);
    expect(errors).toEqual([]);
  });

  test("context practice rotates through focused three-choice modes", async ({ page }) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(() => {
      localStorage.setItem("wordpix:learner-state:v4", JSON.stringify({ id: "explore" }));
    });
    await page.goto("/#/learn/colors");
    await page.getByRole("heading", { name: /Colors/i }).waitFor({ timeout: 15_000 });
    await page
      .getByRole("button", { name: /^Start lesson:/ })
      .first()
      .click();
    await page.evaluate(() => {
      window.location.hash = "/learn/colors/step-3";
    });

    const choices = page
      .getByRole("group", { name: "Words for the missing part" })
      .getByRole("button");
    await expect(choices).toHaveCount(3);
    await choices.first().click();
    await page.waitForTimeout(1_800);
    await expect(page.locator("img")).toHaveCount(1);
    await expect(page.getByText(/Look at the scene/i)).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
    ).toBe(false);

    const a11yScan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(a11yScan.violations).toEqual([]);
  });

  test("final retrieval displays released usage content in the learner flow", async ({ page }) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width: 1280, height: 900 });
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.addInitScript(() => {
      localStorage.setItem("wordpix:learner-state:v4", JSON.stringify({ id: "explore" }));
    });
    await page.goto("/#/learn/colors");
    await page.getByRole("heading", { name: /Colors/i }).waitFor({ timeout: 15_000 });
    await page
      .getByRole("button", { name: /^Start lesson:/ })
      .first()
      .click();
    await page.evaluate(() => {
      window.location.hash = "/learn/colors/step-6";
    });

    await page.getByRole("button", { name: "Red", exact: true }).click();
    await expect(page.getByRole("button", { name: "Purple", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Purple", exact: true }).click();
    await expect(page.getByRole("button", { name: "Indigo", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Indigo", exact: true }).click();

    await expect(page.getByRole("button", { name: "Continue", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Use the language yourself" })).toBeVisible();
    await expect(page).toHaveURL(/step-6$/u);

    const a11yScan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(a11yScan.violations).toEqual([]);
    expect(errors).toEqual([]);
  });

  test("profile explains the six mastery dimensions without implying recognition is mastery", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem("wordpix:learner-state:v4", JSON.stringify({ id: "home" }));
    });
    await page.goto("/#/home");
    await page.getByRole("button", { name: "Profile", exact: true }).click();

    await expect(page.getByRole("heading", { name: "How you can use your words" })).toBeVisible();
    for (const skill of [
      "Visual recognition",
      "Listening recognition",
      "Context understanding",
      "Guided production",
      "Spoken production",
      "Independent transfer",
    ]) {
      await expect(page.getByRole("heading", { name: skill, exact: true })).toBeVisible();
    }
    await expect(
      page.getByText(/strong mastery also needs understanding and independent use/iu)
    ).toBeVisible();

    const a11yScan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(a11yScan.violations).toEqual([]);
  });
});
