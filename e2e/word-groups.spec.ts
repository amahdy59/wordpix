import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const width of [320, 390, 768, 1280, 1600]) {
  test(`word group layout at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(() =>
      localStorage.setItem("wordpix:learner-state:v4", JSON.stringify({ id: "explore" }))
    );
    await page.goto("/#/learn/bathroom");
    const list = page.getByRole("region", { name: "Word groups" });
    await expect(list.getByRole("heading", { name: "Select a Word Group" })).toBeVisible();
    const cards = list.locator("li[data-menu-container]");
    expect(await cards.count()).toBeGreaterThan(0);
    for (const card of await cards.all()) {
      await card.scrollIntoViewIfNeeded();
      await expect(card.locator("img")).toBeVisible();
      await expect(card.locator("img")).toHaveAttribute("src", /group-thumbnails/);
      await expect
        .poll(() =>
          card
            .locator("img")
            .evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)
        )
        .toBe(true);
      expect(
        await card.evaluate((el) => {
          const r = el.getBoundingClientRect();
          return r.left >= 0 && r.right <= innerWidth;
        })
      ).toBe(true);
      await card.screenshot({
        path: testInfo.outputPath(`${await card.getAttribute("data-menu-container")}.png`),
      });
      const primary = card.getByRole("button", { name: /^Start lesson:/ });
      await expect(primary).toHaveCount(1);
      expect(
        await primary.evaluate((el) => el.getBoundingClientRect().height)
      ).toBeGreaterThanOrEqual(44);
    }
    await list.evaluate((el) => {
      el.scrollTop = 0;
    });
    await page.screenshot({ path: testInfo.outputPath("word-groups.png"), fullPage: true });
    expect(
      (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze())
        .violations
    ).toEqual([]);
    const options = cards.first().getByRole("button", { name: /More options/ });
    await options.click();
    await expect(page.getByRole("menuitem", { name: /Read Story/ })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(options).toBeFocused();
    await cards
      .first()
      .getByRole("button", { name: /^Start lesson:/ })
      .click();
    await expect(page.getByRole("heading", { name: "Listen & repeat" })).toBeVisible();
  });
}
