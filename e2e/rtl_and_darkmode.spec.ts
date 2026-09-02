import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Multi-Viewport RTL & Dark Mode Matrix", () => {
  test("loads cleanly, verifies no horizontal overflow, and tests RTL mirroring", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Check no horizontal scrollbar / overflow in standard viewport
    const isOverflowing = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth + 2;
    });
    expect(isOverflowing).toBe(false);

    // Switch to Arabic / RTL via storage
    await page.evaluate(() => {
      localStorage.setItem("wordpix:interface-lang", "ar");
    });
    await page.reload();
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

    // Re-verify no horizontal overflow under RTL
    const isRtlOverflowing = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth + 2;
    });
    expect(isRtlOverflowing).toBe(false);
  });

  test("dark mode toggles theme class and passes accessibility contrast", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const hasDarkClass = await page.evaluate(() =>
      document.documentElement.classList.contains("dark")
    );
    expect(hasDarkClass).toBe(true);

    // Run Axe scan in dark mode
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
