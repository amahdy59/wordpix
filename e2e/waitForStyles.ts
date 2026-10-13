import type { Page } from "@playwright/test";

/** Wait for the app's styles without waiting on remote images or audio. */
export async function waitForStyles(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    const styles = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'));
    // WebKit can expose a sheet before its imported rules are applied.
    return (
      styles.length > 0 &&
      styles.every((link) => link.sheet !== null) &&
      getComputedStyle(document.documentElement).getPropertyValue("--wp-brand").trim() !== ""
    );
  });
}
