import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const lang of ["en", "ar"] as const) {
  test(`optional lesson help works on touch and keyboard without opening the lesson (${lang})`, async ({
    page,
  }) => {
    await page.addInitScript((language) => {
      localStorage.setItem("wordpix:interface-lang", language);
    }, lang);
    await page.setViewportSize({ width: 320, height: 760 });
    await page.goto("/#/conversation");
    const card = page.getByRole("article").first();
    const trigger = card.locator("summary");
    const details = card.locator("details");
    await expect(trigger).toBeVisible({ timeout: 20_000 });
    await trigger.focus();
    await trigger.hover();
    await expect(details).not.toHaveAttribute("open", "");
    await trigger.press("Enter");
    await expect(details).toHaveAttribute("open", "");
    await expect(page).toHaveURL(/#\/conversation$/);
    const box = await details.locator("div").boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(320);
    const target = await trigger.boundingBox();
    expect(target!.width).toBeGreaterThanOrEqual(44);
    expect(target!.height).toBeGreaterThanOrEqual(44);
    await trigger.press("Escape");
    await expect(details).not.toHaveAttribute("open", "");
    await expect(trigger).toBeFocused();
    await trigger.click();
    await expect(details).toHaveAttribute("open", "");
    await trigger.click();
    await expect(details).not.toHaveAttribute("open", "");
    await trigger.click();
    await page.getByRole("heading", { level: 1 }).click();
    await expect(details).not.toHaveAttribute("open", "");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true
    );
    const scan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(scan.violations).toEqual([]);
  });
}

for (const course of ["conversation", "business", "hadith", "pronunciation"]) {
  test(`${course} orientation is optional while the next lesson stays available`, async ({
    page,
  }, testInfo) => {
    await page.goto(`/#/${course}`, { waitUntil: "domcontentloaded" });
    const header = page.getByRole("main").locator("header").first();
    await expect(header.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 20_000 });
    const help = header
      .locator("details")
      .filter({ has: page.getByText("About this course", { exact: true }) });
    await expect(help).not.toHaveAttribute("open", "");
    await help.locator("summary").click();
    await expect(help).toHaveAttribute("open", "");
    await expect(header.getByRole("button").first()).toBeEnabled();
    await help.locator("summary").press("Escape");
    await expect(help).not.toHaveAttribute("open", "");
    await page.screenshot({
      path: `output/simplified-${course}-${testInfo.project.name}.png`,
      animations: "disabled",
    });
  });
}
