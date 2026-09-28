import { expect, test } from "@playwright/test";

test("word details fetch bounded shards and survive a cached offline reload", async ({
  page,
  context,
}) => {
  test.setTimeout(60_000);
  const scripts = new Set<string>();
  const errors: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "script") scripts.add(request.url());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/wordpix/#/home");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await expect
    .poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller)))
    .toBe(true);
  await page.goto("/wordpix/#/learn/construction-site");
  await expect(page.getByRole("button", { name: /^Start lesson:/ }).first()).toBeVisible({
    timeout: 15_000,
  });
  expect([...scripts].filter((url) => /\/lexicon-\d+-/.test(url))).toHaveLength(0);
  expect([...scripts].some((url) => /\/story-.*-groups-/.test(url))).toBe(false);

  await page
    .getByRole("button", { name: /^Start lesson:/ })
    .first()
    .click();
  await page.getByRole("button", { name: "Word details", exact: true }).click();
  await expect(page.getByRole("region", { name: /^Examples/ })).toBeVisible();
  const shards = [...scripts].filter((url) => /\/lexicon-\d+-/.test(url));
  expect(shards.length).toBeGreaterThan(0);
  expect(shards.length).toBeLessThanOrEqual(2); // active word plus one speculative next word
  expect([...scripts].some((url) => url.includes("lexicon-dictionary"))).toBe(false);
  await expect
    .poll(() =>
      page.evaluate(async (urls) => {
        // Inspect stored URLs without inventing the Origin headers of module requests.
        const cached = await Promise.all(
          urls.map((url) => caches.match(url, { ignoreVary: true }))
        );
        return cached.every(Boolean);
      }, shards)
    )
    .toBe(true);

  await context.setOffline(true);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Word details", exact: true }).click();
  await expect(page.getByRole("region", { name: /^Examples/ })).toBeVisible();
  await context.setOffline(false);
  expect(errors).toEqual([]);
});
