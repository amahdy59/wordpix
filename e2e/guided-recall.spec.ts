import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("Business recall supports answer-later navigation and retains checked answers", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#/business/unit-02/recall");
  await expect(page.getByRole("heading", { name: /which word or phrase/i })).toBeVisible({
    timeout: 30_000,
  });
  await expect(page.getByRole("textbox")).toHaveCount(0);
  await expect(page.getByRole("radiogroup")).toHaveCount(1);
  await page.getByRole("button", { name: /next question.*answer later/i }).click();
  await expect(page.getByText("Question 2 of 7", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /previous question/i }).click();
  await page.getByRole("radio", { name: "role", exact: true }).click();
  await page.getByRole("button", { name: /check answer/i }).click();
  await expect(page.getByRole("status").filter({ hasText: /correct/i })).toContainText(/correct/i);
  await page.getByRole("button", { name: /begin lesson warm-up/i }).click();
  await page.getByRole("button", { name: "Recall", exact: true }).click();
  await expect(page.getByRole("radio", { name: "role", exact: true })).toHaveAttribute(
    "aria-checked",
    "true"
  );
  await expect(
    page.getByRole("navigation", { name: "Lesson sections" }).getByRole("progressbar")
  ).toHaveAttribute("aria-valuenow", "0");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true
  );
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
  expect(errors).toEqual([]);
  await page.screenshot({
    path: `output/playwright/guided-recall-${test.info().project.name}.png`,
    fullPage: true,
  });
});
