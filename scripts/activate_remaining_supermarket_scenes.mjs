import fs from "node:fs";
import path from "node:path";

const usagePath = "src/app/data/usage/supermarket.usage.json";
const usageData = JSON.parse(fs.readFileSync(usagePath, "utf8"));

const genManifestPath = "output/illustrations/generated/manifest.json";
const genData = JSON.parse(fs.readFileSync(genManifestPath, "utf8"));
const genItems = new Map(genData.items.filter(i => i.unitId === "supermarket").map(i => [i.sceneId, i]));

const publicSceneDir = "public/scene-images";
const overridesPath = "src/app/generated/localAssetOverrides.json";
const overrides = JSON.parse(fs.readFileSync(overridesPath, "utf8"));
const overrideSet = new Set(overrides);

const altDescriptions = {
  "supermarket-4-usage-scene-2": "Fresh plump dark blackberries displayed in a small produce punnet in a grocery market.",
  "supermarket-4-usage-scene-3": "A ripe tropical papaya halved to show deep orange flesh and black seeds on a market board.",
  "supermarket-6-usage-scene-1": "Foil-wrapped blocks of rich golden creamy butter arranged neatly in a chilled dairy case.",
  "supermarket-6-usage-scene-2": "Chilled glass bottles of freshly squeezed golden citrus juice in a supermarket beverage case.",
  "supermarket-6-usage-scene-3": "A clear bag of colorful mixed frozen peas, corn, and diced carrots in a supermarket freezer display.",
  "supermarket-6-usage-scene-4": "Wholesome curds of white cottage cheese served in a fresh ceramic bowl on a dairy shelf.",
  "supermarket-6-usage-scene-5": "A clean tub of smooth plant-based margarine spread with an open lid on a chilled market shelf.",
  "supermarket-7-usage-scene-1": "An aged wedge of hard Parmesan cheese with crumbly crystalline texture on a rustic cutting board.",
  "supermarket-7-usage-scene-2": "A carton of creamy plant-based oat milk resting beside a filled glass in the grocery section.",
  "supermarket-7-usage-scene-4": "A transparent glass bowl filled with polished long-grain white rice in a dry goods aisle.",
  "supermarket-7-usage-scene-5": "Fine sifted white baking flour in a ceramic prep bowl with a wooden scoop.",
  "supermarket-8-usage-scene-1": "A freshly baked golden lattice-crust fruit pie displayed on parchment paper in a bakery showcase.",
  "supermarket-8-usage-scene-2": "A warm ceramic bowl of thick rolled-oat oatmeal topped with fresh berries on a breakfast table.",
  "supermarket-8-usage-scene-4": "A crisp golden-brown Belgian waffle with deep square pockets served on a white ceramic plate.",
  "supermarket-8-usage-scene-5": "Steamed delicate golden semolina couscous grains in a terracotta bowl garnished with fresh herbs.",
  "supermarket-9-usage-scene-2": "A fresh whole silvery sea bass with clear bright eyes resting on a bed of crushed shaved ice.",
  "supermarket-9-usage-scene-3": "Neat parallel strips of cured smoked bacon showing alternating red lean and white marbling.",
  "supermarket-9-usage-scene-4": "A thick ruby-red fresh tuna steak with firm velvety grain resting on a black seafood display slate.",
  "supermarket-10-usage-scene-5": "A brightly illuminated clean supermarket grocery aisle with parallel shelves of packaged goods.",
  "supermarket-11-usage-scene-5": "A bright promotional discount sale tag hanging below a shelf of pantry staples.",
  "supermarket-21-usage-scene-4": "A customer holding a contactless payment card against a chip terminal at a supermarket checkout.",
  "supermarket-21-usage-scene-5": "A shopper reaching out to choose a crisp ripe red apple from a produce display bin.",
  "supermarket-22-usage-scene-3": "A grocery store bagger in a clean staff apron carefully packing groceries into sturdy paper bags.",
  "supermarket-24-usage-scene-2": "Two identical grocery jars displayed side by side representing a buy-one-get-one-free offer."
};

let copiedCount = 0;
let mappedCount = 0;

for (const lesson of usageData) {
  for (const scene of lesson.usage.scenes) {
    const sceneId = `${lesson.lessonId}-usage-scene-${scene.chunkNumber}`;
    if (!scene.imagePath && genItems.has(sceneId)) {
      const gen = genItems.get(sceneId);
      const destFileName = `${sceneId}.webp`;
      const destPath = path.join(publicSceneDir, destFileName);

      if (fs.existsSync(gen.localWebp)) {
        fs.copyFileSync(gen.localWebp, destPath);
        copiedCount++;
      }

      scene.imagePath = `scene-images/${destFileName}`;
      scene.imageAlt = altDescriptions[sceneId] || scene.imageAlt || `${scene.check.expectedAnswer} in supermarket context.`;
      overrideSet.add(`scene-images/${destFileName}`);
      mappedCount++;
    }
  }
}

fs.writeFileSync(usagePath, JSON.stringify(usageData, null, 2) + "\n", "utf8");
console.log(`Copied ${copiedCount} files to ${publicSceneDir}.`);
console.log(`Mapped ${mappedCount} previously unillustrated scenes in ${usagePath}.`);

const updatedOverrides = Array.from(overrideSet).sort();
fs.writeFileSync(overridesPath, JSON.stringify(updatedOverrides, null, 2) + "\n", "utf8");
console.log(`Updated ${overridesPath} with ${updatedOverrides.length} entries.`);
