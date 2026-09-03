import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Seeds both nav state (skips onboarding) and interface language before every page load.
// addInitScript fires before every navigation in the page context, including reload().
function seedStorage(lang: "en" | "ar" = "en") {
  return (page: import("@playwright/test").Page) =>
    page.addInitScript(
      ({ navState, ifaceLang }: { navState: string; ifaceLang: string }) => {
        localStorage.setItem("wordpix:learner-state:v4", navState);
        localStorage.setItem("wordpix:interface-lang", ifaceLang);
      },
      {
        navState: JSON.stringify({ id: "explore" }),
        ifaceLang: lang,
      }
    );
}

test.describe("Multi-Viewport RTL & Dark Mode Matrix", () => {
  test("loads cleanly, verifies no horizontal overflow, and tests RTL mirroring", async ({
    page,
  }) => {
    // Start in English (LTR), confirm no overflow
    await seedStorage("en")(page);
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const isOverflowing = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 2
    );
    expect(isOverflowing).toBe(false);

    // Switch to Arabic RTL — re-seed with ar so reload picks it up immediately
    await page.addInitScript(
      ({ navState, ifaceLang }: { navState: string; ifaceLang: string }) => {
        localStorage.setItem("wordpix:learner-state:v4", navState);
        localStorage.setItem("wordpix:interface-lang", ifaceLang);
      },
      { navState: JSON.stringify({ id: "explore" }), ifaceLang: "ar" }
    );
    await page.reload();
    await page.waitForLoadState("networkidle");

    // dir="rtl" is set by a useEffect; wait up to 10s for it to appear
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl", { timeout: 10000 });

    const isRtlOverflowing = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 2
    );
    expect(isRtlOverflowing).toBe(false);
  });

  test("dark mode toggles theme class and passes accessibility contrast", async ({ page }) => {
    await seedStorage("en")(page);
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const hasDarkClass = await page.evaluate(() =>
      document.documentElement.classList.contains("dark")
    );
    expect(hasDarkClass).toBe(true);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
