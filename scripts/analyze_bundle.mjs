// Cross-platform bundle analysis: sets ANALYZE=1 and runs the Vite build.
// The visualizer plugin in vite.config.ts only activates under ANALYZE=1,
// so normal `pnpm run build` output is unchanged.
import { spawnSync } from "node:child_process";

const result = spawnSync("npx", ["vite", "build"], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, ANALYZE: "1" },
});
process.exit(result.status ?? 1);
