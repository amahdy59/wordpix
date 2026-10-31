import fs from "node:fs/promises";
import { compileUsageMedia } from "./lib/usage_media_runtime.mjs";

if (process.argv.slice(2).some((arg) => arg !== "--check"))
  throw Error("Only --check is supported");
const check = process.argv.includes("--check");
const read = async (name) =>
  JSON.parse(await fs.readFile(`src/app/generated/${name}.json`, "utf8"));
const figma = await read("reviewedFigmaQuestionMedia");
async function emit(target, value) {
  const output = JSON.stringify(value) + "\n";
  const existing = await fs.readFile(target, "utf8").catch((error) => {
    if (error.code !== "ENOENT") throw error;
    return "";
  });
  if (existing.replace(/\r\n/g, "\n") === output) return;
  if (check) throw Error(`Stale usage-media runtime: ${target}`);
  await fs.writeFile(target, output);
}
await emit("src/app/generated/pilotMediaReviews.json", {
  sentences: figma.sentences,
  readings: figma.readings,
});
const units = (await fs.readdir("src/app/data/usage"))
  .filter((name) => name.endsWith(".usage.json"))
  .map((name) => name.slice(0, -".usage.json".length))
  .sort();
const tables = compileUsageMedia(
  [
    await read("reviewedUsageIllustrations"),
    figma.scenes,
    await read("reviewedFigmaObjectScenes"),
    await read("reviewedGeneratedSceneMedia"),
  ],
  units
);
const directory = "src/app/generated/usageMediaUnits";
if (!check) await fs.mkdir(directory, { recursive: true });
let largest = 0;
for (const [unitId, table] of Object.entries(tables)) {
  const target = `${directory}/${unitId}.json`;
  const output = JSON.stringify(table) + "\n";
  largest = Math.max(largest, Buffer.byteLength(output));
  await emit(target, table);
}
const expected = new Set(units.map((id) => `${id}.json`));
for (const name of await fs.readdir(directory)) {
  if (!expected.has(name)) throw Error(`Unexpected unit usage media file: ${name}`);
}
console.log(
  `Usage media: ${units.length} lazy unit tables; largest ${Math.ceil(largest / 1024)} KiB; original manifests unchanged`
);
