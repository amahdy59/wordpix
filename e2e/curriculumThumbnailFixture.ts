import type { Page } from "@playwright/test";

/** Navigation/content checks must not depend on dozens of live thumbnail transfers.
 * This fixture preserves requested URLs and image layout; it does not verify
 * remote availability, image meaning, or decoding of the authored artwork.
 */
export async function installCurriculumThumbnailFixture(page: Page) {
  await page.route(
    /\/(?:hadith\/v1\/images\/[^/]+\.png|scene-images\/[^/]+-hero[^/]*\.(?:avif|webp))$/,
    (route) =>
      route.fulfill({
        contentType: "image/svg+xml",
        body: '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" viewBox="0 0 400 225"><rect width="400" height="225" fill="gray"/></svg>',
      })
  );
}
