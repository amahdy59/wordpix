import { build } from "vite";
import sharp from "sharp";
import { mkdir, mkdtemp, rm, access, writeFile, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

// Generate only group-cover images; preserve aspect ratio for focal-point cropping in CSS.
const temporary = await mkdtemp(join(tmpdir(), "wordpix-groups-"));
try {
  const output = join(temporary, "groups.mjs");
  const entry = join(temporary, "entry.js");
  const lessons = JSON.stringify(resolve("src/app/data/lessons.ts").replaceAll("\\", "/"));
  const vocabulary = JSON.stringify(resolve("src/app/data/vocabulary.ts").replaceAll("\\", "/"));
  await writeFile(
    entry,
    `import { COURSE_UNITS } from ${lessons}; import { loadUnitVocabulary } from ${vocabulary}; export async function images(){const rows=[];for(const unit of Object.values(COURSE_UNITS)){const words=await loadUnitVocabulary(unit.id);for(const group of unit.groups){const word=words.find(w=>w.id===group.wordIds[0]);if(word?.img.startsWith('/word-images/'))rows.push({unit:unit.id,group:group.id,img:word.img});}}return rows;}`
  );
  await build({
    configFile: false,
    publicDir: false,
    logLevel: "error",
    build: {
      outDir: temporary,
      emptyOutDir: false,
      minify: false,
      lib: { entry, formats: ["es"], fileName: () => "groups.mjs" },
      rollupOptions: { output: { inlineDynamicImports: true } },
    },
  });
  const { images } = await import(pathToFileURL(output).href);
  const rows = await images();
  let count = 0;
  const recipeUpdated = (await stat(fileURLToPath(import.meta.url))).mtimeMs;
  for (const row of rows) {
    const source = resolve("public", "." + row.img);
    try {
      await access(source);
    } catch {
      continue;
    } // The UI retains its existing image fallback.
    const directory = resolve("public/group-thumbnails", row.unit);
    await mkdir(directory, { recursive: true });
    const updated = Math.max(recipeUpdated, (await stat(source)).mtimeMs);
    const targets = [160, 320].map((size) => join(directory, `${row.group}-${size}.webp`));
    const cached = await Promise.all(
      targets.map((target) =>
        stat(target)
          .then((info) => info.mtimeMs >= updated)
          .catch(() => false)
      )
    );
    if (cached.every(Boolean)) {
      count++;
      continue;
    }
    for (const size of [160, 320]) {
      await sharp(source)
        .resize({ width: size, withoutEnlargement: true })
        .webp({ quality: 76 })
        .toFile(join(directory, `${row.group}-${size}.webp`));
    }
    count++;
  }
  console.log(`Prepared responsive thumbnails for ${count} word groups.`);
} finally {
  if (
    !resolve(temporary).startsWith(resolve(tmpdir()) + "\\") &&
    !resolve(temporary).startsWith(resolve(tmpdir()) + "/")
  )
    throw new Error("Unexpected temporary directory");
  await rm(temporary, { recursive: true, force: true });
}
