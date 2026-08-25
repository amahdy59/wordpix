import { chromium } from "@playwright/test";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const ctx = await b.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:3, isMobile:true, hasTouch:true });
const p = await ctx.newPage();
for (const route of ["#/explore", "#/learn/bathroom/study"]) {
  await p.goto("http://localhost:4173/wordpix/"+route, {waitUntil:"networkidle"});
  await p.waitForTimeout(600);
  const out = await p.evaluate((vw) => {
    const res = [];
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width===0||r.height===0) continue;
      if (r.right <= vw+2 && r.left >= -2) continue;
      // Walk up: is any ancestor a horizontal scroller? Then this is by design.
      let a = el.parentElement, scroller = null;
      while (a && a !== document.body) {
        const ox = getComputedStyle(a).overflowX;
        if (ox === "auto" || ox === "scroll") { scroller = a.className.slice(0,50); break; }
        a = a.parentElement;
      }
      res.push({tag:el.tagName.toLowerCase(), cls:(el.className||"").toString().slice(0,60), left:Math.round(r.left), right:Math.round(r.right), scroller});
      if (res.length>8) break;
    }
    return res;
  }, 390);
  console.log("=== "+route+" ===");
  for (const o of out) console.log(`${o.scroller ? "[in-scroller]" : "[CLIPPED]  "} ${o.tag} ${o.left}..${o.right}  ${o.cls}  ${o.scroller?("scroller="+o.scroller):""}`);
}
await b.close();
