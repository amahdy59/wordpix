const fs = require("node:fs");
const path = require("node:path");

const usageDirectory = path.resolve(__dirname, "../src/app/data/usage");
const files = fs.readdirSync(usageDirectory).filter((file) => file.endsWith(".usage.json"));
let totalScenes = 0;
let withImage = 0;

function countScenes(value) {
  if (!value || typeof value !== "object") return;
  for (const [key, nested] of Object.entries(value)) {
    if (key === "scenes" && Array.isArray(nested)) {
      totalScenes += nested.length;
      for (const scene of nested) {
        if (
          [scene?.imageUrl, scene?.image, scene?.illustrationUrl].some(
            (url) => typeof url === "string" && url.trim().length > 0
          )
        )
          withImage++;
      }
    } else {
      countScenes(nested);
    }
  }
}

for (const file of files) {
  countScenes(JSON.parse(fs.readFileSync(path.join(usageDirectory, file), "utf8")));
}

console.log("Total usage files:", files.length);
console.log("Total scenes in authored usage data:", totalScenes);
console.log("Scenes with an explicit image reference:", withImage);
console.log("Scenes without an explicit image reference:", totalScenes - withImage);
console.log("Runtime fallback images are not included in this authored-data count.");
