import { expect, test } from "@playwright/test";

test("conversation curriculum is discoverable and prevents stage skipping", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("Failed to load resource")) {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });

  await page.goto("/#/conversation");

  // Wait for the lazy curriculum route, as we do for its lesson route below.
  await expect(page.getByRole("heading", { name: "Conversation & Debate" })).toBeVisible({
    timeout: 20_000,
  });
  const units = page.getByRole("region", { name: "Units list" }).getByRole("article");
  await expect(units).toHaveCount(40);

  await page.getByLabel("Search conversation units").fill("smartphone");
  await page
    .getByRole("button", { name: /Unit 01: Could You Live Without Your Smartphone/ })
    .click();

  await expect(page).toHaveURL(/#\/conversation\/unit-01$/);
  // The URL updates before the large lesson chunk finishes loading. Wait for
  // that route boundary explicitly so full-suite CPU contention cannot turn a
  // correct loading state into a false failure.
  await expect(page.getByRole("tab", { name: "Challenge" })).toBeDisabled({ timeout: 20_000 });
  const continueButton = page.getByRole("button", { name: "Continue to Reading" });
  await expect(continueButton).toBeDisabled();
  await page.getByRole("radio").first().click();
  await expect(continueButton).toBeEnabled();
  await continueButton.click();
  await expect(page.getByRole("tab", { name: "Reading" })).toHaveAttribute("aria-selected", "true");

  expect(errors).toEqual([]);
});
