import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const OUT = "/tmp/claude-0/-home-user-wordpix/49f84eb9-6503-58a4-880e-c83b52e479cc/scratchpad/shots";
mkdirSync(OUT, { recursive: true });

const BASE = "http://localhost:4173/wordpix/";
const VIEWPORTS = [
  { name: "phone", width: 390, height: 844, dpr: 3 },
  { name: "tablet", width: 820, height: 1180, dpr: 2 },
  { name: "desktop", width: 1440, height: 900, dpr: 2 },
];
const ROUTES = [
  ["home", "#/home"],
  ["explore", "#/explore"],
  ["practice", "#/practice"],
  ["profile", "#/profile"],
  ["skills", "#/skills"],
  ["lesson-entry", "#/learn/bathroom"],
  ["study", "#/learn/bathroom/study"],
  ["step1", "#/learn/bathroom/step-1"],
  ["step2", "#/learn/bathroom/step-2"],
  ["step3", "#/learn/bathroom/step-3"],
];

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const findings = [];

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.dpr,
    hasTouch: vp.name === "phone",
    isMobile: vp.name === "phone",
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });

  // Skip onboarding so the real screens render.
  await page.addInitScript(() => {
    try {
      localStorage.setItem("wordpix_onboarded", "true");
    } catch (e) {}
  });

  for (const [name, hash] of ROUTES) {
    try {
      await page.goto(BASE + hash, { waitUntil: "networkidle", timeout: 20000 });
      await page.waitForTimeout(700);
      await page.screenshot({ path: `${OUT}/${vp.name}-${name}.png`, fullPage: false });

      // Horizontal overflow: the body must never scroll sideways.
      const overflow = await page.evaluate(() => {
        const de = document.documentElement;
        return { scrollW: de.scrollWidth, clientW: de.clientWidth };
      });
      if (overflow.scrollW > overflow.clientW + 1) {
        findings.push(
          `OVERFLOW ${vp.name}/${name}: scrollWidth ${overflow.scrollW} > clientWidth ${overflow.clientW}`
        );
      }

      // Any element sticking out past the viewport edge.
      const wide = await page.evaluate((vw) => {
        const out = [];
        for (const el of document.querySelectorAll("body *")) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          if (r.right > vw + 2 || r.left < -2) {
            out.push(
              `${el.tagName.toLowerCase()}.${(el.className && typeof el.className === "string" ? el.className : "").slice(0, 70)} left=${Math.round(r.left)} right=${Math.round(r.right)}`
            );
          }
          if (out.length > 6) break;
        }
        return out;
      }, vp.width);
      for (const w of wide) findings.push(`ESCAPES ${vp.name}/${name}: ${w}`);

      // Broken images.
      const broken = await page.evaluate(() =>
        [...document.images]
          .filter((i) => i.complete && i.naturalWidth === 0)
          .map((i) => i.currentSrc || i.src)
          .slice(0, 5)
      );
      for (const b of broken) findings.push(`BROKENIMG ${vp.name}/${name}: ${b}`);

      // Touch targets below 44px on the phone.
      if (vp.name === "phone") {
        const small = await page.evaluate(() => {
          const out = [];
          for (const el of document.querySelectorAll("button, a[href], [role=button]")) {
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) continue;
            if (r.height < 40 || r.width < 24) {
              out.push(
                `${el.tagName.toLowerCase()} "${(el.textContent || "").trim().slice(0, 24)}" ${Math.round(r.width)}x${Math.round(r.height)}`
              );
            }
            if (out.length > 5) break;
          }
          return out;
        });
        for (const s of small) findings.push(`SMALLTAP phone/${name}: ${s}`);
      }
    } catch (e) {
      findings.push(`NAVFAIL ${vp.name}/${name}: ${String(e).split("\n")[0]}`);
    }
  }
  for (const e of [...new Set(errors)].slice(0, 5)) findings.push(`JSERROR ${vp.name}: ${e}`);
  await ctx.close();
}

await browser.close();
console.log(findings.length ? findings.join("\n") : "NO FINDINGS");
