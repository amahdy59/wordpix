import { test } from "@playwright/test";

test("dashboard to explore flow", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector("text=Start Learning");
  await page.click("text=Start Learning");
  await page.waitForSelector("text=Explore the Garden");
});
