import { expect, test } from "@playwright/test";

test("Hadith curriculum exposes all 42 lessons and opens the canonical source", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/#/hadith");

  await expect(page.getByRole("heading", { name: "Hadith English curriculum" })).toBeVisible();
  const results = page.getByRole("tabpanel");
  await expect(results.getByRole("button")).toHaveCount(42);
  await expect(
    page.getByRole("heading", { name: "Foundations, intention, and clear choices" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Spiritual growth, accountability, and hope" })
  ).toBeAttached();
  const allFilter = page.getByRole("tab", { name: "All: 42" });
  await allFilter.focus();
  await allFilter.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Due for review: 0" })).toHaveAttribute(
    "aria-selected",
    "true"
  );
  await expect(page.getByRole("heading", { name: "No Hadith lessons found" })).toBeVisible();
  await page.getByRole("tab", { name: "Due for review: 0" }).press("Home");
  await expect(results.getByRole("button")).toHaveCount(42);
  const hadithScroller = page.getByRole("main", { name: "Hadith English curriculum" });
  expect(
    await hadithScroller.evaluate((element) => element.scrollHeight > element.clientHeight)
  ).toBe(true);
  await hadithScroller.evaluate((element) => element.scrollTo({ top: element.scrollHeight }));
  await expect(results.getByRole("button").last()).toBeVisible();
  await hadithScroller.evaluate((element) => element.scrollTo({ top: 0 }));
  await page.getByRole("button", { name: /Actions and Intentions/ }).click();
  await expect(page).toHaveURL(/#\/hadith\/lesson-1$/);
  await page.getByRole("button", { name: "Read & Listen" }).click();
  await expect(page.getByText("Complete Hadith", { exact: true })).toHaveCount(1);
  await expect(page.getByText(/Actions are \(judged\) by motives/)).toHaveCount(1);
  expect(errors).toEqual([]);
});

test("pronunciation curriculum is grouped, searchable, and uses R2-backed artwork", async ({
  page,
}) => {
  const errors: string[] = [];
  const imageRequests: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (request.url().includes("/pronunciation/v1/")) imageRequests.push(request.url());
  });

  await page.goto("/#/pronunciation");

  await expect(page.getByRole("heading", { name: "Pronunciation curriculum" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Sound contrasts/i })).toBeVisible();
  const chapterNavigation = page.getByRole("navigation", {
    name: "Jump to a pronunciation chapter",
  });
  await expect(chapterNavigation.getByRole("button")).toHaveCount(8);
  await chapterNavigation.getByRole("button", { name: "Chapter 8" }).click();
  await expect(page.getByRole("heading", { name: /Transfer/i }).last()).toBeVisible();
  const pronunciationScroller = page.getByRole("main", { name: "Pronunciation curriculum" });
  expect(
    await pronunciationScroller.evaluate((element) => element.scrollHeight > element.clientHeight)
  ).toBe(true);
  await pronunciationScroller.evaluate((element) =>
    element.scrollTo({ top: element.scrollHeight })
  );
  await expect(page.getByRole("button", { name: /Final Real-Speech Capstone/i })).toBeVisible();
  await pronunciationScroller.evaluate((element) => element.scrollTo({ top: 0 }));
  await page.getByLabel("Search pronunciation lessons").fill("Sheep or Ship");
  await page.getByRole("button", { name: /Sheep or Ship/ }).click();

  await expect(page).toHaveURL(/#\/pronunciation\/lesson-02$/);
  await expect(page.getByRole("heading", { name: /Sheep or Ship/ })).toBeVisible();
  await expect(page.getByRole("list", { name: "Target sound contrasts" })).toContainText(
    "sheep / ship"
  );
  await expect.poll(() => imageRequests.length).toBeGreaterThan(0);
  const appOrigin = new URL(page.url()).origin;
  expect(
    imageRequests.every((url) => {
      const asset = new URL(url);
      return asset.origin !== appOrigin && asset.pathname.startsWith("/pronunciation/v1/");
    })
  ).toBe(true);
  expect(errors).toEqual([]);
});
