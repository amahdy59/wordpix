import type { Page } from "@playwright/test";

/** Wait for the app's styles without waiting on remote images or audio. */
export async function waitForStyles(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    try {
      const brand = getComputedStyle(document.documentElement)
        .getPropertyValue("--wp-brand")
        .trim();
      if (brand !== "") return true;

      const styles = Array.from(
        document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')
      );
      return (
        styles.length > 0 &&
        styles.every((link) => {
          try {
            return link.sheet !== null;
          } catch {
            return false;
          }
        })
      );
    } catch {
      return false;
    }
  });
}
