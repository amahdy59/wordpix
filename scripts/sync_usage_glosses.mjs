import { createServer } from "vite";
const server = await createServer({
  configFile: false,
  server: { middlewareMode: true, watch: null },
  optimizeDeps: { noDiscovery: true },
  appType: "custom",
});
try {
  const { syncGlosses } = await server.ssrLoadModule("/scripts/sync_usage_glosses.ts");
  await syncGlosses();
} finally {
  await server.close();
}
