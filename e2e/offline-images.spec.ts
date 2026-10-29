import { test, expect } from "./offlineTest";
import { reloadOffline } from "./offlineReload";
import { disableNarrationForContentTest } from "./audioFixture";
import sharp from "sharp";

test("optional unit images survive offline reload and removal keeps lesson text", async ({
  page,
  offlineServer,
}) => {
  test.setTimeout(120000);
  await disableNarrationForContentTest(page);
  offlineServer.setImageFixture(true);
  let mediaOffline = false;
  const fixture = await sharp({
    create: { width: 32, height: 24, channels: 3, background: "gray" },
  })
    .png()
    .toBuffer();
  // WebKit does not route service-worker-owned CDN requests. Intercept only
  // the page's explicit pack fetch, then test native <img> delivery from the
  // real worker/cache. The exact decoded fixture width distinguishes it from
  // any accidentally fetched live CDN image.
  await page.addInitScript(
    (bytes) => {
      const nativeFetch = window.fetch.bind(window);
      window.fetch = (input, init) => {
        const url = new URL(input instanceof Request ? input.url : String(input), location.href);
        if (
          url.hostname.endsWith(".r2.dev") &&
          /\.(?:avif|webp|png|jpe?g|svg)$/i.test(url.pathname)
        ) {
          if (localStorage.getItem("test:image-network-offline") === "true")
            return Promise.reject(new TypeError("Offline"));
          return Promise.resolve(
            new Response(new Uint8Array(bytes), { headers: { "Content-Type": "image/png" } })
          );
        }
        return nativeFetch(input, init);
      };
    },
    [...fixture]
  );
  // Deterministic readable CORS images test actual CacheStorage and SW delivery.
  // Public byte/semantic evidence is checked separately by media:review.
  await page.route("**/*", (route) => {
    const request = route.request();
    return request.url().includes(".r2.dev/") || request.resourceType() === "image"
      ? mediaOffline
        ? route.abort("internetdisconnected")
        : route.fulfill({
            contentType: "image/svg+xml",
            headers: { "Access-Control-Allow-Origin": "*" },
            body: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240"><rect width="320" height="240" fill="gray"/></svg>',
          })
      : route.continue();
  });
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
  ).toBeVisible({ timeout: 45000 });
  await page.getByText("Optional unit images", { exact: true }).click();
  await page.getByRole("button", { name: "Download unit images", exact: true }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "These unit images are saved" })
  ).toBeVisible({ timeout: 45000 });
  const count = await page.evaluate(
    async () => (await (await caches.open("wordpix-images-v1-numbers-counting")).keys()).length
  );
  expect(count).toBeGreaterThan(2);
  const cachedHero = await page.evaluate(async () => {
    const cache = await caches.open("wordpix-images-v1-numbers-counting");
    const request = (await cache.keys()).find((request) => /\/one-[^/]+\.avif$/.test(request.url));
    if (!request) throw Error("Missing one image in unit pack");
    const response = await cache.match(request);
    return {
      url: request.url,
      contentType: response?.headers.get("Content-Type"),
      prefix: [...new Uint8Array(await response!.arrayBuffer())].slice(0, 8),
    };
  });
  expect(cachedHero.contentType).toBe("image/png");
  expect(cachedHero.prefix).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  await expect(
    page.getByText("Cached vocabulary images: 50 of 50; not included in this text download.", {
      exact: true,
    })
  ).toBeVisible();
  offlineServer.setOffline(true);
  mediaOffline = true;
  await page.evaluate(() => localStorage.setItem("test:image-network-offline", "true"));
  await page.goto("/wordpix/#/learn/numbers-counting", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Options for Numbers & Counting 1", exact: true }).click();
  await page.getByRole("menuitem", { name: /Browse Words/ }).click();
  await expect(page.getByRole("heading", { name: "One", exact: true })).toBeVisible();
  await reloadOffline(page);
  const hero = page.locator("img[fetchpriority=high]");
  await expect(hero).toBeVisible();
  await expect
    .poll(() => hero.evaluate((image) => (image as HTMLImageElement).naturalWidth))
    .toBe(32);
  offlineServer.setOffline(false);
  mediaOffline = false;
  await page.evaluate(() => localStorage.removeItem("test:image-network-offline"));
  await page.goto("/wordpix/#/settings", { waitUntil: "domcontentloaded" });
  await page.getByRole("searchbox", { name: "Search settings" }).fill("offline");
  await page.getByLabel("Prepare one unit for offline reading").selectOption("numbers-counting");
  await page.getByText("Optional unit images", { exact: true }).click();
  await page.getByRole("button", { name: "Remove unit images", exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(async () =>
        (await caches.keys()).includes("wordpix-images-v1-numbers-counting")
      )
    )
    .toBe(false);
  const textCount = await page.evaluate(
    async () => (await (await caches.open("wordpix-downloads-v1")).keys()).length
  );
  expect(textCount).toBeGreaterThan(0);
  await expect(
    page.getByText("Cached vocabulary images: 0 of 50; not included in this text download.", {
      exact: true,
    })
  ).toBeVisible();
});
