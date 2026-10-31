import { test, expect } from "./offlineTest";
import { reloadOffline } from "./offlineReload";
import { disableNarrationForContentTest } from "./audioFixture";

test("selected unit preparation saves text modules and reopens vocabulary offline", async ({
  page,
  offlineServer,
  browserName,
}) => {
  test.setTimeout(90_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => {
    // This download explicitly excludes images/audio. WebKit reports native
    // failures for uncached optional resources through pageerror as well as
    // requestfailed. Keep application exceptions fatal; do not require media
    // that the UI correctly says is unavailable offline.
    if (
      browserName === "webkit" &&
      ["Response served by service worker is an error", "Cannot load ."].includes(error.message)
    )
      return;
    errors.push(error.message);
  });
  await disableNarrationForContentTest(page);
  await page.goto("/wordpix/#/settings", { waitUntil: "domcontentloaded" });
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await reloadOffline(page);
  await expect
    .poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller)))
    .toBe(true);
  await page.getByRole("searchbox", { name: "Search settings" }).fill("offline");
  await page.getByLabel("Prepare one unit for offline reading").selectOption("numbers-counting");
  await page.getByRole("button", { name: "Prepare selected unit text", exact: true }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Text prepared on this browser" })
  ).toBeVisible({ timeout: 45_000 });
  const prepared = await page.evaluate(async () =>
    (await (await caches.open("wordpix-downloads-v1")).keys()).map((request) => request.url)
  );
  expect(prepared.some((url) => /lexicon-\d+-/.test(url))).toBe(true);
  expect(prepared.some((url) => /story-.*-groups-/.test(url))).toBe(true);
  expect(prepared.some((url) => /usage-media-unit-numbers-counting-/.test(url))).toBe(true);
  expect(
    prepared
      .filter((url) => /usage-media-unit-/.test(url))
      .every((url) => /usage-media-unit-numbers-counting-/.test(url))
  ).toBe(true);
  offlineServer.setOffline(true);
  await page.goto("/wordpix/#/learn/numbers-counting", { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("heading", { name: "Numbers & Counting", exact: true })
  ).toBeVisible();
  await page.getByRole("button", { name: "Options for Numbers & Counting 1", exact: true }).click();
  await page.getByRole("menuitem", { name: /Browse Words/ }).click();
  await expect(page.getByRole("heading", { name: "One", exact: true })).toBeVisible();
  await reloadOffline(page);
  await expect(page.getByRole("heading", { name: "One", exact: true })).toBeVisible({
    timeout: 15000,
  });
  offlineServer.setOffline(false);
  expect(errors).toEqual([]);
});
