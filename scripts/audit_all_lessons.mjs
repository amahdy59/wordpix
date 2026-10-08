import { createServer } from "vite";

console.log("Loading curriculum audit runtime...");
const server = await createServer({ configFile: false, server: { middlewareMode: true, watch: null }, optimizeDeps: { noDiscovery: true }, appType: "custom" });
try {
  const { runAudit } = await server.ssrLoadModule("/scripts/lesson_content_audit.ts");
  console.log("Reviewing each lesson...");
  await runAudit(process.argv.includes("--baseline") ? "baseline" : "current");
} finally {
  await server.close();
}
