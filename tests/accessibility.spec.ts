import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("WCAG 2.2 AAA Accessibility validation", () => {
  test("homepage should not have any automatically detectable accessibility issues", async ({
    page,
  }) => {
    await page.goto("/");

    // Wait for the app to fully load (e.g., waiting for the main container or onboarding screen)
    await page.waitForSelector("#root", { state: "visible" });

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag22aa", "wcag2aaa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
