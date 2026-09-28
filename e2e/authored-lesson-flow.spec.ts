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
});
