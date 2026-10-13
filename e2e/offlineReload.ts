import { expect, type Page } from "@playwright/test";

/** WebKit can report a navigation error after its service worker restores a new document. */
export async function reloadOffline(page: Page) {
  await page.evaluate(() => Reflect.set(window, "__wordpixBeforeOfflineReload", true));
  try {
    await page.reload({ waitUntil: "domcontentloaded" });
  } catch (error) {
    if (
      !(error instanceof Error) ||
      !error.message.includes("WebKit encountered an internal error")
    )
      throw error;
  }
  // Never accept a failed reload that merely leaves the old document visible.
  await expect
    .poll(() => page.evaluate(() => Reflect.get(window, "__wordpixBeforeOfflineReload")))
    .toBeUndefined();
}
