import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { disableNarrationForContentTest } from "./audioFixture";
import { waitForStyles } from "./waitForStyles";

for (const locale of ["en", "ar"]) {
  test.describe(locale, () => {
    test.beforeEach(async ({ page }) => {
      await disableNarrationForContentTest(page);
      await page.setViewportSize({ width: 320, height: 568 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.addInitScript((locale) => {
        localStorage.setItem("wordpix:interface-lang", locale);
        localStorage.setItem(
          "wordpix:learner:v2",
          JSON.stringify({
            version: 3,
            accessibility: { autoPlayAudio: false, autoAdvance: false, reduceMotion: true },
          })
        );
      }, locale);
    });

    test("focused skip link has a full touch target and visible focus", async ({ page }) => {
      await page.goto("/#/learn");
      await waitForStyles(page);
      const link = page.getByRole("link", {
        name: /Skip to content|تخطي إلى المحتوى|تخط.*المحتوى/,
      });
      await link.focus();
      await expect(link).toBeFocused();
      await expect
        .poll(async () =>
          link.evaluate((element) => {
            const rect = element.getBoundingClientRect();
            return Math.min(rect.width, rect.height);
          })
        )
        .toBeGreaterThanOrEqual(44);
      const focus = await link.evaluate((element) => getComputedStyle(element).outlineWidth);
      expect(parseFloat(focus)).toBeGreaterThanOrEqual(2);
    });

    for (const route of ["/#/hadith/lesson-1", "/#/conversation/unit-01"]) {
      test(`${route} reflows actions at 200% text`, async ({ page }) => {
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto(route);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 20_000 });
        await waitForStyles(page);
        await page.evaluate(() => {
          document.documentElement.style.fontSize = "32px";
        });
        const buttons = page.getByRole("main").getByRole("button");
        await expect(buttons.first()).toBeVisible();
        if (route.includes("conversation")) {
          await page
            .getByRole("button", {
              name: locale === "en" ? "Continue to Reading" : "المتابعة إلى القراءة",
              exact: true,
            })
            .click();
          await expect(
            page.getByRole("button", {
              name: locale === "en" ? "Continue to Language Bank" : "المتابعة إلى بنك اللغة",
              exact: true,
            })
          ).toBeVisible();
        }
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)
        ).toBe(true);
        const small = await buttons.evaluateAll((elements) =>
          elements
            .filter((element) => {
              const rect = element.getBoundingClientRect();
              const style = getComputedStyle(element);
              return (
                rect.width > 0 &&
                rect.height > 0 &&
                style.visibility !== "hidden" &&
                (rect.width < 44 || rect.height < 44)
              );
            })
            .map((element) => element.getAttribute("aria-label") || element.textContent)
        );
        expect(small).toEqual([]);
        const axe = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze();
        expect(axe.violations).toEqual([]);
        expect(errors).toEqual([]);
      });
    }
  });
}
