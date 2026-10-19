import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const args = process.argv.slice(2);
function argument(name, fallback) {
  const index = args.indexOf(name);
  if (index === -1) return fallback;
  if (!args[index + 1] || args[index + 1].startsWith("--")) throw new Error(`Missing ${name}`);
  return args[index + 1];
}
const source = path.resolve(argument("--source", "output/question-layout-check"));
const destination = path.resolve(argument("--out", "output/question-layout-review.html"));
const escape = (text) =>
  text.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character]
  );

async function collect(directory) {
  const found = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory() && entry.name !== "attachments") found.push(...(await collect(file)));
    else if (entry.isFile() && entry.name.endsWith(".png") && entry.name !== "test-failed-1.png")
      found.push(file);
  }
  return found;
}
const screenshots = [];
for (const file of await collect(source)) {
  const bytes = await fs.readFile(file);
  if (bytes.length < 24 || bytes.subarray(1, 4).toString() !== "PNG") continue;
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  const browser = path
    .basename(path.dirname(file))
    .match(/-(mobile-webkit|mobile-chrome|chromium)$/)?.[1];
  const label = `${path.basename(file, ".png")}${browser ? ` · ${browser}` : ""}`;
  const href = path
    .relative(path.dirname(destination), file)
    .split(path.sep)
    .map(encodeURIComponent)
    .join("/");
  screenshots.push({
    label,
    href,
    width,
    height,
    viewport: width < height ? "portrait" : "landscape",
  });
}
screenshots.sort((a, b) => a.label.localeCompare(b.label));
if (!screenshots.length)
  throw new Error("No question screenshots found. Run e2e/question-layout.spec.ts first.");

const cards = screenshots
  .map(
    (item) => `<figure data-size="${item.viewport}" data-label="${escape(item.label)}">
<a href="${item.href}" target="_blank" rel="noopener" aria-label="Open ${escape(item.label)} full size"><img src="${item.href}" width="${item.width}" height="${item.height}" loading="lazy" alt="${escape(item.label)} question layout"></a>
<figcaption><strong>${escape(item.label)}</strong><span>${item.width} × ${item.height}</span></figcaption></figure>`
  )
  .join("\n");
await fs.mkdir(path.dirname(destination), { recursive: true });
await fs.writeFile(
  destination,
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>WordPix question layout review</title>
<style>
:root{color-scheme:light dark;font:16px/1.5 system-ui}*{box-sizing:border-box}body{margin:0;padding:clamp(1rem,3vw,3rem);background:Canvas;color:CanvasText}header{max-width:75rem;margin:0 auto 2rem}h1{font-size:1.6rem;margin:0 0 .5rem}p{max-width:75ch}.filters{display:flex;flex-wrap:wrap;gap:1rem;align-items:end}label{display:grid;gap:.25rem}input,select{font:inherit;min-height:44px;padding:.5rem;background:Canvas;color:CanvasText;border:1px solid GrayText;border-radius:.5rem}a:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid Highlight;outline-offset:3px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,22rem),1fr));gap:1.5rem;max-width:100rem;margin:auto}figure{margin:0;border:1px solid GrayText;border-radius:.75rem;overflow:hidden;min-width:0}figure[hidden]{display:none}figure a{display:block;background:Canvas;height:25rem}img{display:block;width:100%;height:100%;object-fit:contain;object-position:top}figcaption{display:grid;gap:.25rem;padding:1rem;overflow-wrap:anywhere}figcaption span{font-size:.875rem}body[data-filter="portrait"] main{grid-template-columns:repeat(auto-fit,minmax(min(100%,17rem),1fr))}body[data-filter="portrait"] figure a{height:36rem}
</style><header><h1>WordPix question layout review</h1><p>Local browser captures. Open any image to inspect it at full resolution. Portrait and landscape labels describe the captured viewport, not device hardware. These files do not alter production images or R2 mappings.</p><div class="filters"><label>Find a layout<input id="search" type="search" autocomplete="off"></label><label>Viewport<select id="size"><option value="all">All viewports</option><option value="portrait">Portrait / phones</option><option value="landscape">Landscape / desktop</option></select></label><p id="count" role="status" aria-live="polite">${screenshots.length} captures</p></div></header><main>${cards}</main><script>
const search=document.getElementById('search');const size=document.getElementById('size');const cards=[...document.querySelectorAll('figure')];function filter(){let count=0;document.body.dataset.filter=size.value;for(const card of cards){card.hidden=!(card.dataset.label.toLowerCase().includes(search.value.toLowerCase())&&(size.value==='all'||size.value===card.dataset.size));if(!card.hidden)count++;}document.getElementById('count').textContent=count+' captures';}search.addEventListener('input',filter);size.addEventListener('change',filter);
</script></html>`,
  "utf8"
);
console.log(
  `Prepared ${screenshots.length} captures: ${path.relative(process.cwd(), destination)}`
);
