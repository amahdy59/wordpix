---
name: playwright-generate-test
description: Generates deterministic, resilient Playwright E2E tests for WordPix following best practices.
metadata:
  category: testing
  upstream: global playwright-generate-test
---

# Playwright Test Generation (WordPix)

Use when creating, maintaining, or fixing browser E2E tests in `e2e/`.

## 1. Locator Hierarchy (strict priority)

1. Role: `page.getByRole('button', { name: 'Save changes' })`
2. Label: `page.getByLabel('Email address')`
3. Placeholder: `page.getByPlaceholder('Search products...')`
4. Visible text: `page.getByText('Order confirmed')`
5. Test ID fallback only: `page.getByTestId('order-id')`

NEVER XPath or fragile CSS (`div > div.wrapper > span.btn`).

## 2. Deterministic Assertions (auto-retrying)

```ts
await expect(page.getByRole("alert")).toBeVisible();
await expect(page.getByRole("status")).toHaveText("Saved");
await expect(page.getByRole("button", { name: "Submit" })).toBeEnabled();
```

NEVER `expect(await locator.isVisible()).toBe(true)` — no retry.

## 3. Browser Health (required on critical flows)

```ts
test("checkout flow has zero unhandled console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));
  await page.goto("/checkout");
  // ... steps ...
  expect(errors).toEqual([]);
});
```

## 4. WordPix Conventions

- Base URL `http://localhost:6173`, projects: `chromium` + `mobile-chrome` (Pixel 5) — see `playwright.config.ts`.
- Axe-core: `@axe-core/playwright` for a11y specs (`e2e/accessibility.spec.ts`); AAA targets 7:1 / 4.5:1.
- Bilingual flows: assert both `en` + `ar` where copy matters; RTL-safe locators (role/name, not layout position).
- Offline-first: critical learner loop must work without network — do not mock away IndexedDB.

## References

- `playwright.config.ts`, `e2e/`
- `docs/10_TESTING_QA_AND_ACCESSIBILITY_VALIDATION.md`
- `.agents/skills/accessibility/SKILL.md`
