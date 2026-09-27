/* global console, document, getComputedStyle, innerWidth, localStorage */

import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const browser = await chromium.launch({ headless: true });
const routes = [
  ["home", "/"],
  ["learn", "/#/learn"],
  ["practice", "/#/practice"],
  ["library", "/#/library"],
  ["profile", "/#/profile"],
  ["pronunciation", "/#/pronunciation"],
  ["conversation", "/#/conversation"],
];
const combinations = [
  { lang: "en", scheme: "light" },
  { lang: "ar", scheme: "dark" },
];
const results = [];

for (const combination of combinations) {
  const context = await browser.newContext({
    viewport: { width: 320, height: 720 },
    colorScheme: combination.scheme,
  });
  await context.addInitScript(
    ({ lang }) => {
      localStorage.setItem("wordpix:learner-state:v4", JSON.stringify({ id: "home" }));
      localStorage.setItem("wordpix:interface-lang", lang);
    },
    { lang: combination.lang }
  );

  const page = await context.newPage();
  for (const [route, path] of routes) {
    await page.goto(`http://localhost:6173${path}`, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });
    await page.locator("main").first().waitFor({ state: "visible", timeout: 30_000 });
    await page.waitForTimeout(250);

    const enhancedContrast = await new AxeBuilder({ page })
      .withRules(["color-contrast-enhanced"])
      .analyze();
    const targetIssues = await page
      .locator(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), [role="button"]:not([aria-disabled="true"]), [role="radio"]:not([aria-disabled="true"])'
      )
      .evaluateAll((elements) =>
        elements.flatMap((element) => {
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          if (
            style.display === "none" ||
            style.visibility === "hidden" ||
            rect.width === 0 ||
            rect.height === 0 ||
            element.getAttribute("aria-hidden") === "true" ||
            element.classList.contains("sr-only")
          ) {
            return [];
          }
          if (element.tagName === "A" && style.display === "inline") return [];
          if (rect.width >= 44 && rect.height >= 44) return [];
          return [
            {
              tag: element.tagName,
              name: (element.getAttribute("aria-label") || element.textContent || "")
                .trim()
                .slice(0, 80),
              width: Math.round(rect.width),
              height: Math.round(rect.height),
            },
          ];
        })
      );

    await page.addStyleTag({
      content:
        "* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }",
    });
    const textSpacing = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth + 2,
      width: document.documentElement.scrollWidth,
      viewport: innerWidth,
    }));

    results.push({
      ...combination,
      route,
      contrastViolations: enhancedContrast.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        nodes: violation.nodes.length,
        help: violation.help,
        evidence: violation.nodes.map((node) => ({
          target: node.target,
          html: node.html,
          failureSummary: node.failureSummary,
        })),
      })),
      targetIssues,
      textSpacing,
    });
  }
  await context.close();
}

const contrastContext = await browser.newContext({
  viewport: { width: 320, height: 720 },
  colorScheme: "light",
});
await contrastContext.addInitScript(() => {
  localStorage.setItem("wordpix:learner-state:v4", JSON.stringify({ id: "home" }));
  localStorage.setItem("wordpix:interface-lang", "en");
});
const contrastPage = await contrastContext.newPage();
await contrastPage.emulateMedia({ contrast: "more" });
await contrastPage.goto("http://localhost:6173/", {
  waitUntil: "domcontentloaded",
  timeout: 30_000,
});
await contrastPage.locator("main").first().waitFor({ state: "visible", timeout: 30_000 });
const preferredContrastScan = await new AxeBuilder({ page: contrastPage })
  .withRules(["color-contrast-enhanced"])
  .analyze();
results.push({
  lang: "en",
  scheme: "prefers-contrast-more",
  route: "home",
  computedColors: await contrastPage.evaluate(() => {
    const body = getComputedStyle(document.body);
    return { color: body.color, backgroundColor: body.backgroundColor };
  }),
  contrastViolations: preferredContrastScan.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    nodes: violation.nodes.length,
    help: violation.help,
    evidence: violation.nodes.slice(0, 5).map((node) => ({
      target: node.target,
      html: node.html,
      failureSummary: node.failureSummary,
    })),
  })),
});
await contrastContext.close();

console.log(JSON.stringify(results, null, 2));
await browser.close();
