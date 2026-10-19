import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { waitForStyles } from "./waitForStyles";
import { playbackFixture } from "./audioFixture";

for (const language of ["en", "ar"] as const) {
  for (const theme of ["light", "dark"] as const) {
    test(`bilingual lookup and control access: ${language}, ${theme}`, async ({ page }, info) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.addInitScript(
        ({ language, theme }) => {
          localStorage.setItem("wordpix:interface-lang", language);
          localStorage.setItem("wordpix:theme", theme);
          localStorage.setItem(
            "wordpix:learner:v2",
            JSON.stringify({ version: 3, accessibility: { reduceMotion: true } })
          );
        },
        { language, theme }
      );
      await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
      await page.route("**/audio/**/*.mp3", (route) =>
        route.fulfill({ body: playbackFixture(), contentType: "audio/wav" })
      );
      await page.setViewportSize({
        width: info.project.name === "chromium" ? 1280 : 390,
        height: 844,
      });
      await page.goto("/#/library");
      await waitForStyles(page);
      await page.getByRole("searchbox").fill("كتاب");
      const result = page
        .getByRole("article")
        .filter({ has: page.getByRole("heading", { name: /^book(?::|$)/i }) })
        .first();
      await expect(result).toBeVisible();
      const audio = result
        .getByRole("button", { name: /book/i })
        .filter({ has: page.locator("svg") })
        .first();
      // Buttons must have independent interaction semantics, not a button ancestor.
      await expect(result.getByRole("button").first()).toBeEnabled();
      await audio.focus();
      await audio.press("Enter");
      await expect(page.getByRole("dialog")).toHaveCount(0);
      expect(
        await audio.evaluate(
          (element) => element.parentElement?.closest('[role="button"]') === null
        )
      ).toBe(true);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .withRules(["color-contrast-enhanced"])
        .analyze();
      expect(results.violations).toEqual([]);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)
      ).toBe(true);
      await info.attach(`library-${language}-${theme}`, {
        body: await page.screenshot({ fullPage: true }),
        contentType: "image/png",
      });
      expect(errors).toEqual([]);
    });
  }
}

test("character shortcuts can be disabled without affecting native navigation", async ({
  page,
}) => {
  await page.goto("/#/settings");
  await page.getByRole("searchbox").fill("keyboard");
  const control = page.getByRole("switch", { name: "Character keyboard shortcuts" });
  await expect(control).toHaveAttribute("aria-checked", "true");
  await control.click();
  await expect(control).toHaveAttribute("aria-checked", "false");
  await page.goto("/#/library");
  await page.getByRole("heading", { name: "Library", exact: true }).waitFor();
  await page.keyboard.press("/");
  await expect(page.getByRole("searchbox")).not.toBeFocused();
  await expect(page.getByRole("link", { name: "Learn", exact: true })).toHaveAttribute(
    "href",
    "#/learn"
  );
});
