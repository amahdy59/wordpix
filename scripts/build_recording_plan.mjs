import fs from "node:fs/promises";
import { createServer } from "vite";

const args = process.argv.slice(2);
if (args.some((arg) => !arg.startsWith("--r2-list=")))
  throw Error("Only --r2-list=<read-only inventory.json> is supported");
for (const arg of args) {
  const snapshot = JSON.parse(await fs.readFile(arg.slice(10), "utf8"));
  if (!Array.isArray(snapshot.keys) || !snapshot.keys.length)
    throw Error("Empty or invalid inventory");
}
// The actual vocabulary and sentence selectors use import.meta.glob. Plain tsx
// cannot execute those Vite imports; use the same module loader as the media audits.
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, watch: null },
});
try {
  await server.ssrLoadModule("/scripts/plan_recorded_audio.ts");
} finally {
  await server.close();
}
