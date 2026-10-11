import fs from "node:fs";
import { FIGMA_IMAGE_REPLACEMENTS } from "../src/generated/figmaImageReplacements.ts";

const BASE_URL = "https://pub-e84a3f9882a141ac9f33296bbad85e2a.r2.dev";

async function auditHeroes() {
  const blankHeroNames = [];
  const files = fs.readdirSync("public/scene-images");
  for (const f of files) {
    if (!f.includes("-hero.")) continue;
    const stat = fs.statSync(`public/scene-images/${f}`);
    if (stat.size === 1566 || stat.size === 568) {
      blankHeroNames.push(f);
    }
  }

  console.log(`Found ${blankHeroNames.length} locally blank hero files.`);
  
  let mappedCount = 0;
  let unmappedCount = 0;
  const unmapped = [];
  const mapped = [];

  for (const hero of blankHeroNames) {
    const key = `scene-images/${hero}`;
    const replacement = FIGMA_IMAGE_REPLACEMENTS[key];
    if (replacement) {
      mappedCount++;
      mapped.push({ key, replacement });
    } else {
      unmappedCount++;
      unmapped.push(key);
    }
  }

  console.log(`Mapped in FIGMA_IMAGE_REPLACEMENTS: ${mappedCount}`);
  console.log(`Unmapped (still resolving to blank): ${unmappedCount}`);
  console.log("Unmapped samples:", unmapped);

  // Test 5 mapped heroes against R2
  console.log("\nChecking R2 HEAD for 5 mapped heroes...");
  for (const m of mapped.slice(0, 5)) {
    const url = `${BASE_URL}/images/v1/${m.replacement}`;
    try {
      const res = await fetch(url, { method: "HEAD" });
      console.log(`${m.replacement} -> ${res.status} (Content-Length: ${res.headers.get("content-length")})`);
    } catch (e) {
      console.log(`${m.replacement} -> ERROR: ${e.message}`);
    }
  }
}

auditHeroes();
