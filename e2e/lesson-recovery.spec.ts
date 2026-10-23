import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { waitForStyles } from "./waitForStyles";

for (const saved of [
  { id: "lesson-entry", unitId: "removed-unit" },
  { id: "learn-words", lessonId: "removed-group" },
  { id: "conversation-lesson", unitId: "unit-99" },
]) {
  test(`unavailable saved content recovers to Home: ${JSON.stringify(saved)}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.addInitScript((navigation) => {
      localStorage.setItem("wordpix:interface-lang", "en");
      localStorage.setItem("wordpix:learner-state:v4", JSON.stringify(navigation));
    }, saved);
    await page.goto("/wordpix/");
    await expect(page).toHaveURL(/#\/home$/);
    await expect(page.getByRole("heading", { level: 1, name: /Learner/ })).toBeVisible();
    expect(errors).toEqual([]);
  });
}

for (const locale of [
  { lang: "en", retry: "Retry", back: "Back to learning path", heading: "Learn" },
  { lang: "ar", retry: "إعادة المحاولة", back: "العودة إلى مسار التعلّم", heading: "تعلّم" },
]) {
  test(`failed lesson download offers keyboard recovery in ${locale.lang}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript((lang) => {
      localStorage.setItem("wordpix:interface-lang", lang);
    }, locale.lang);
    // Fail only the requested unit chunks; keep the application available.
    await page.route(/\/assets\/numbers-counting-[^/]+\.js$/, (route) => route.abort());
    await page.goto("/wordpix/#/learn/numbers-counting");
    await waitForStyles(page);
    const alert = page.getByRole("alert");
    await expect(alert).toBeVisible();
    const retry = alert.getByRole("button", { name: locale.retry, exact: true });
    const back = alert.getByRole("button", { name: locale.back, exact: true });
    await retry.focus();
    await page.keyboard.press("Tab");
    await expect(back).toBeFocused();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "wcag2aaa"])
      .analyze();
    expect(results.violations).toEqual([]);
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#\/learn$/);
    await expect(
      page.getByRole("heading", { level: 1, name: locale.heading, exact: true })
    ).toBeVisible();
    expect(errors).toEqual([]);
  });
}
