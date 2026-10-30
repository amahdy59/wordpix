import fs from "node:fs/promises";
import ts from "typescript";
import { compileSentenceMedia, scopeSentenceMedia } from "./lib/sentence_media_runtime.mjs";
if (process.argv.slice(2).some((arg) => arg !== "--check"))
  throw Error("Only --check is supported");
const read = async (path) => JSON.parse(await fs.readFile(path, "utf8"));
const data = compileSentenceMedia(
  await read("src/app/generated/reviewedExactSentenceMedia.json"),
  await read("src/app/generated/rejectedSentenceMedia.json")
);
const check = process.argv.includes("--check");
async function emit(target, value) {
  const output = JSON.stringify(value) + "\n";
  const existing = await fs.readFile(target, "utf8").catch((error) => {
    if (error.code !== "ENOENT") throw error;
    return "";
  });
  if (existing.replace(/\r\n/g, "\n") === output) return;
  if (check)
    throw Error(
      `Stale sentence-media runtime: ${target}; run node scripts/build_sentence_media_runtime.mjs`
    );
  await fs.writeFile(target, output);
}
// Retain the complete derivative for parity checks and editorial tooling.
// Browser code imports only the per-unit tables below.
await emit("src/app/generated/sentenceMediaRuntime.json", data);
const directory = "src/app/generated/sentenceMediaUnits";
if (!check) await fs.mkdir(directory, { recursive: true });
let units = 0;
let largest = 0;
for (const name of (await fs.readdir("src/app/data/units")).sort()) {
  if (!name.endsWith(".ts")) continue;
  const source = await fs.readFile(`src/app/data/units/${name}`, "utf8");
  const file = ts.createSourceFile(name, source, ts.ScriptTarget.Latest, true);
  const declaration = file.statements
    .filter(ts.isVariableStatement)
    .flatMap((statement) => [...statement.declarationList.declarations])
    .find((item) => item.name.getText(file) === "VOCABULARY");
  if (!declaration?.initializer || !ts.isArrayLiteralExpression(declaration.initializer))
    throw Error(`Expected literal unit vocabulary: ${name}`);
  const wordIds = declaration.initializer.elements.map((element) => {
    if (!ts.isObjectLiteralExpression(element)) throw Error(`Expected word object: ${name}`);
    const id = element.properties.find((property) => property.name?.getText(file) === "id");
    if (!id || !ts.isPropertyAssignment(id) || !ts.isStringLiteral(id.initializer))
      throw Error(`Expected stable word ID: ${name}`);
    return id.initializer.text;
  });
  const scoped = scopeSentenceMedia(data, wordIds);
  largest = Math.max(largest, Buffer.byteLength(JSON.stringify(scoped)));
  await emit(`${directory}/${name.replace(/\.ts$/, ".json")}`, scoped);
  units++;
}
console.log(
  `Sentence-media runtime: ${data.rows.length} exact pairs; ${units} lazy unit tables, largest ${Math.ceil(largest / 1024)} KiB; source mappings unchanged`
);
