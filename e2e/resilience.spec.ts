import { expect, test, type Page } from "@playwright/test";

type OfflineSnapshot = {
  accessibilityTextSize?: string;
  queuedAccessibilityMutations: number;
};

async function readOfflineSnapshot(page: Page): Promise<OfflineSnapshot> {
  return page.evaluate(
    () =>
      new Promise<OfflineSnapshot>((resolve, reject) => {
        const request = indexedDB.open("wordpix_offline_db");
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction(["learner_state", "mutation_queue"], "readonly");
          const stateRequest = transaction.objectStore("learner_state").get("primary_state");
          const queueRequest = transaction.objectStore("mutation_queue").getAll();
          transaction.onerror = () => reject(transaction.error);
          transaction.oncomplete = () => {
            const state = stateRequest.result as
              { accessibility?: { textSize?: string } } | undefined;
            const queue = queueRequest.result as Array<{ type?: string }>;
            resolve({
              accessibilityTextSize: state?.accessibility?.textSize,
              queuedAccessibilityMutations: queue.filter(
                (operation) => operation.type === "update_accessibility"
              ).length,
            });
          };
        };
      })
  );
}

test("offline changes survive reload and remain queued for later sync", async ({
  page,
  context,
}) => {
  test.setTimeout(60_000);
  const browserErrors: string[] = [];
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });

  await page.goto("/wordpix/#/home");
  await expect(page.getByRole("main")).toBeVisible();
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await expect(page.getByRole("main")).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller)))
    .toBe(true);

  await page.getByRole("button", { name: "Settings & Accessibility" }).click();
  const extraLargeText = page.getByRole("button", { name: "150%" });
  await extraLargeText.click();
  await expect(extraLargeText).toHaveAttribute("aria-pressed", "true");
  await expect
    .poll(() => readOfflineSnapshot(page))
    .toMatchObject({ accessibilityTextSize: "xlarge", queuedAccessibilityMutations: 1 });
  await page.getByRole("button", { name: "Close settings" }).click();

  await context.setOffline(true);
  await page.evaluate(() => window.dispatchEvent(new Event("offline")));
  await expect(page.getByRole("status").filter({ hasText: "You're offline" })).toBeVisible();
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByRole("main")).toBeVisible();
  // Chromium's network emulation blocks requests but does not update
  // navigator.onLine in this environment, so exercise the browser event that
  // production devices emit when connectivity changes.
  await page.evaluate(() => window.dispatchEvent(new Event("offline")));
  await expect(page.getByRole("status").filter({ hasText: "You're offline" })).toBeVisible();
  await page.getByRole("button", { name: "Settings & Accessibility" }).click();
  await expect(page.getByRole("button", { name: "150%" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Close settings" }).click();
  await expect
    .poll(() => readOfflineSnapshot(page))
    .toMatchObject({
      accessibilityTextSize: "xlarge",
      queuedAccessibilityMutations: 1,
    });

  await context.setOffline(false);
  await page.evaluate(() => window.dispatchEvent(new Event("online")));
  await expect(page.getByRole("status").filter({ hasText: "Back online" })).toBeVisible();
  await expect
    .poll(() => readOfflineSnapshot(page))
    .toMatchObject({
      accessibilityTextSize: "xlarge",
      queuedAccessibilityMutations: 1,
    });
  expect(browserErrors).toEqual([]);
});

test("a rejected sign-in preserves credentials and guest access", async ({ page }) => {
  const browserErrors: string[] = [];
  page.on("pageerror", (error) => browserErrors.push(error.message));

  await page.route("**/auth/v1/token**", async (route) => {
    await route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({
        error: "invalid_grant",
        error_description: "Invalid login credentials",
      }),
    });
  });

  await page.goto("/wordpix/#/profile");
  await page.getByRole("button", { name: "Sign in to sync progress", exact: true }).click();
  const email = page.getByLabel("Email address");
  const password = page.getByLabel("Password");
  await email.fill("offline-test@example.invalid");
  await password.fill("not-a-real-password");
  await page.getByRole("button", { name: "Sign In", exact: true }).click();

  await expect(page.getByRole("alert")).toContainText("Invalid login credentials");
  await expect(email).toHaveValue("offline-test@example.invalid");
  await expect(password).toHaveValue("not-a-real-password");
  await expect(page.getByRole("dialog", { name: "Welcome Back" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Continue as Guest" })).toBeEnabled();
  expect(browserErrors).toEqual([]);
});

test("a preserved sync failure exposes a clear recovery action", async ({ page }) => {
  await page.goto("/wordpix/#/home");
  await expect(page.getByRole("main")).toBeVisible();
  await page.evaluate(
    () =>
      new Promise<void>((resolve, reject) => {
        const request = indexedDB.open("wordpix_offline_db");
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const transaction = request.result.transaction("mutation_queue", "readwrite");
          transaction.objectStore("mutation_queue").put({
            id: "e2e-authorization-failure",
            ownerId: "staging-learner",
            payloadVersion: 1,
            type: "add_xp",
            payload: { xp: 25 },
            createdAt: "2026-09-27T00:00:00.000Z",
            status: "failed",
            retryCount: 1,
            lastErrorCategory: "authorization",
          });
          transaction.onerror = () => reject(transaction.error);
          transaction.oncomplete = () => {
            window.dispatchEvent(new Event("wordpix:sync-queue-changed"));
            resolve();
          };
        };
      })
  );

  const status = page.getByRole("status").filter({ hasText: "Some progress needs attention" });
  await expect(status).toBeVisible();
  await expect(status).toContainText("Your progress is still safe on this device");
  const retry = page.getByRole("button", { name: "Retry sync" });
  await expect(retry).toBeVisible();
  await expect(retry).toHaveCSS("min-height", "44px");
  await retry.click();
  await expect(page.getByRole("alert")).toContainText("Sign in again, then retry");
});
