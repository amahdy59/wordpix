import fs from "node:fs/promises";
import ts from "typescript";
import { format, resolveConfig } from "prettier";
const formatting = await resolveConfig("src/app/generated/vocabularySearch-0.json");

// Reads labels and translations only. No media fields are emitted or changed.
const rows = [];
for (const name of (await fs.readdir("src/app/data/units"))
  .filter((name) => name.endsWith(".ts"))
  .sort()) {
  const unit = name.slice(0, -3);
  const source = ts.createSourceFile(
    name,
    await fs.readFile(`src/app/data/units/${name}`, "utf8"),
    ts.ScriptTarget.Latest,
    true
  );
  let vocabulary;
  source.forEachChild((node) => {
    if (ts.isVariableStatement(node))
      for (const item of node.declarationList.declarations)
        if (item.name.getText(source) === "VOCABULARY") vocabulary = item.initializer;
  });
  if (!vocabulary || !ts.isArrayLiteralExpression(vocabulary))
    throw new Error(`Expected vocabulary array: ${name}`);
  const bilingual = JSON.parse(
    await fs.readFile(`src/app/data/bilingual/${unit}.json`, "utf8").catch((error) => {
      if (error.code === "ENOENT") return "{}";
      throw error;
    })
  );
  for (const item of vocabulary.elements) {
    if (!ts.isObjectLiteralExpression(item)) throw new Error(`Expected vocabulary item: ${name}`);
    const fields = {};
    for (const property of item.properties)
      if (ts.isPropertyAssignment(property) && ts.isStringLiteralLike(property.initializer))
        fields[property.name.getText(source).replaceAll('"', "")] = property.initializer.text;
    if (!fields.id || !fields.label) throw new Error(`Missing search identity: ${name}`);
    rows.push([
      unit,
      fields.id,
      fields.label,
      bilingual[fields.id]?.arabicTranslation ?? fields.arabicTranslation ?? "",
      fields.cefr ?? "",
    ]);
  }
}
for (let part = 0; part < 8; part++) {
  const output = await format(
    JSON.stringify(
      rows.slice(part * Math.ceil(rows.length / 8), (part + 1) * Math.ceil(rows.length / 8))
    ),
    { ...formatting, parser: "json" }
  );
  const target = `src/app/generated/vocabularySearch-${part}.json`;
  if (process.argv.includes("--check")) {
    if ((await fs.readFile(target, "utf8")).replaceAll("\r\n", "\n") !== output)
      throw new Error("Stale bilingual search index");
  } else await fs.writeFile(target, output);
}
const estimates = {};
const shard = (id) => {
  let hash = 0;
  for (const char of id.trim().toLowerCase().replace(/[-_]/g, ""))
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash % 64;
};
for (const unit of [...new Set(rows.map((row) => row[0]))]) {
  const ids = rows.filter((row) => row[0] === unit).map((row) => row[1]);
  const paths = [
    `src/app/data/units/${unit}.ts`,
    `src/app/data/bilingual/${unit}.json`,
    ...[...new Set(ids.map(shard))].map((part) => `src/app/data/contentChunks/lexicon-${part}.ts`),
  ];
  const sizes = await Promise.all(
    paths.map(async (path) => (await fs.stat(path).catch(() => ({ size: 0 }))).size)
  );
  // Conservative source-size estimate plus shared shell/passage allowance.
  estimates[unit] = sizes.reduce((sum, size) => sum + size, 0) + 6000000;
}
const estimateTarget = "src/app/generated/offlineTextEstimates.json";
const estimateText = await format(JSON.stringify(estimates), { ...formatting, parser: "json" });
if (process.argv.includes("--check")) {
  if ((await fs.readFile(estimateTarget, "utf8")).replaceAll("\r\n", "\n") !== estimateText)
    throw new Error("Stale offline text estimates");
} else await fs.writeFile(estimateTarget, estimateText);
console.log(`Bilingual search index: ${rows.length} unit-specific entries; no media references.`);
