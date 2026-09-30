import { readFile, writeFile } from "node:fs/promises";

const source = await readFile("docs/usage-image-manifest.csv", "utf8");
const fromOrder = Number(process.argv[2] ?? 21);
const toOrder = Number(process.argv[3] ?? 40);
const outputPath = process.argv[4] ?? "docs/usage-image-manifest-batch-02.csv";
const expectedCount = Number(process.argv[5] ?? 95);
const rows = [];
let row = [];
let value = "";
let quoted = false;
for (let index = 0; index < source.length; index += 1) {
  const char = source[index];
  if (quoted && char === '"' && source[index + 1] === '"') {
    value += '"';
    index += 1;
  } else if (char === '"') quoted = !quoted;
  else if (!quoted && char === ",") { row.push(value); value = ""; }
  else if (!quoted && (char === "\n" || char === "\r")) {
    if (char === "\r" && source[index + 1] === "\n") index += 1;
    row.push(value); value = "";
    if (row.some(Boolean)) rows.push(row);
    row = [];
  } else value += char;
}
if (value || row.length) { row.push(value); rows.push(row); }
const [headers, ...data] = rows;
const parsed = data.map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""])));
const batch = parsed.filter(
  (item) => Number(item.global_order) >= fromOrder && Number(item.global_order) <= toOrder
);
if (batch.length !== expectedCount) {
  throw new Error(`Expected ${expectedCount} scenes for orders ${fromOrder}–${toOrder}, found ${batch.length}.`);
}
const csvCell = (input) => {
  const text = String(input ?? "");
  return /[",\r\n]/u.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};
await writeFile(
  outputPath,
  `${[headers, ...batch.map((item) => headers.map((header) => item[header]))]
    .map((line) => line.map(csvCell).join(","))
    .join("\n")}\n`,
  "utf8"
);
console.log(`Generated ${batch.length} image rows for global orders ${fromOrder}–${toOrder}.`);
