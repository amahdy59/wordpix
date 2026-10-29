import fs from "node:fs/promises";
import { createServer } from "vite";
const manifest = JSON.parse(
  await fs.readFile("output/media-catalog/runtime-assignment-proposals.json", "utf8")
);
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, watch: null },
});
try {
  const { resolveAssetUrl } = await server.ssrLoadModule("/src/utils/assetUrl.ts");
  const ids = new Set();
  for (const assignment of manifest.assignments) {
    if (ids.has(assignment.contentId))
      throw new Error(`Duplicate proposal: ${assignment.contentId}`);
    ids.add(assignment.contentId);
    if (resolveAssetUrl(assignment.imagePath) !== assignment.imagePath)
      throw new Error(`Resolver changed approved URL: ${assignment.contentId}`);
    if (!assignment.imageAlt || assignment.imageSha256 !== assignment.remoteEvidence.sha256)
      throw new Error(`Invalid reviewed media: ${assignment.contentId}`);
  }
  console.log(
    `Validated ${ids.size} assignment proposals against the application asset resolver. No live mappings modified.`
  );
} finally {
  await server.close();
}
