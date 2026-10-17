import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { createServer } from "vite";

const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, watch: null }
});

try {
  const { loadUnitUsageForEditorial } = await server.ssrLoadModule("/src/app/data/usageRegistry.ts");
  const { resolveAssetUrl } = await server.ssrLoadModule("/src/utils/assetUrl.ts");
  const files = readdirSync("src/app/data/usage").filter(f => f.endsWith(".usage.json"));

  let totalLessons = 0;
  let totalScenes = 0;
  let scenesWithImage = 0;
  let scenesWithoutImage = 0;
  const coverageByUnit = {};
  const brokenAssetUrls = [];

  for (const f of files) {
    const unitId = f.replace(".usage.json", "");
    const lessons = await loadUnitUsageForEditorial(unitId);
    if (!lessons) {
      console.error(`Failed to load: ${unitId}`);
      continue;
    }

    let unitScenes = 0;
    let unitWithImage = 0;

    for (const l of lessons) {
      totalLessons++;
      for (const s of l.usage.scenes) {
        totalScenes++;
        unitScenes++;
        if (s.imagePath) {
          scenesWithImage++;
          unitWithImage++;

          // Test resolution
          const resolved = resolveAssetUrl(s.imagePath);
          if (!resolved || resolved === "") {
            brokenAssetUrls.push({ unitId, lessonId: l.lessonId, chunk: s.chunkNumber, imagePath: s.imagePath });
          }
        } else {
          scenesWithoutImage++;
        }
      }
    }

    if (unitWithImage > 0) {
      coverageByUnit[unitId] = `${unitWithImage}/${unitScenes} (${Math.round((unitWithImage / unitScenes) * 100)}%)`;
    }
  }

  console.log("=== COMPREHENSIVE RUNTIME SCENE MAPPING AUDIT ===");
  console.log(`Total Units: ${files.length}`);
  console.log(`Total Lessons: ${totalLessons}`);
  console.log(`Total Scenes: ${totalScenes}`);
  console.log(`Scenes with verified bespoke scene image: ${scenesWithImage}`);
  console.log(`Scenes relying on vocabulary fallback: ${scenesWithoutImage}`);
  console.log(`Broken asset URLs: ${brokenAssetUrls.length}`);
  console.log("\nUnits with bespoke scene image coverage:\n", JSON.stringify(coverageByUnit, null, 2));

} finally {
  await server.close();
}
