import fs from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";

const manifest = JSON.parse(await fs.readFile("dist/.vite/manifest.json", "utf8"));
function closure(key, found = new Set()) {
  if (found.has(key)) return found;
  found.add(key);
  for (const dependency of manifest[key]?.imports ?? []) closure(dependency, found);
  return found;
}
for (const [key, limit] of [
  ["index.html", 490 * 1024],
  ["src/app/core/ExploreWorlds.tsx", 520 * 1024],
  ["src/app/learning/foundations/FigmaPronunciationLessonScreen.tsx", 720 * 1024],
]) {
  if (!manifest[key]) throw new Error(`Missing budgeted entry: ${key}`);
  const files = [
    ...new Set(
      [...closure(key)].map((item) => manifest[item]?.file).filter((file) => file?.endsWith(".js"))
    ),
  ];
  const sizes = await Promise.all(
    files.map(async (file) => gzipSync(await fs.readFile(path.join("dist", file))).length)
  );
  const total = sizes.reduce((sum, size) => sum + size, 0);
  console.log(
    `${key}: ${(total / 1024).toFixed(1)} KiB gzip across ${files.length} required JS files (limit ${limit / 1024} KiB)`
  );
  if (total > limit) throw new Error(`Route budget exceeded: ${key}`);
}
