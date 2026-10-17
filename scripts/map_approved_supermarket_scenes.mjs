import fs from 'node:fs';
import path from 'node:path';

const approvedScenes = {
  // Lesson 1 (5/5)
  'supermarket-1-usage-scene-1': 'Crisp red apples stacked neatly in a wooden display crate in a supermarket produce aisle.',
  'supermarket-1-usage-scene-2': 'Plump clusters of deep purple grapes resting on crushed ice in a supermarket produce display.',
  'supermarket-1-usage-scene-3': 'A crisp head of fresh green iceberg lettuce in a chilled supermarket produce section.',
  'supermarket-1-usage-scene-4': 'Golden yellow onions with dry papery skins arranged in a woven wicker basket.',
  'supermarket-1-usage-scene-5': 'A ripe oval mango with blushed red and yellow skin on a fresh produce shelf.',

  // Lesson 2 (5/5)
  'supermarket-2-usage-scene-1': 'Smooth deep purple ripe plums nestled in a wooden crate in a fruit market.',
  'supermarket-2-usage-scene-2': 'Fresh ripe red raspberries displayed in a small cardboard punnet.',
  'supermarket-2-usage-scene-3': 'A ripe pebbled-skin avocado halved to reveal the pale green flesh and central round pit.',
  'supermarket-2-usage-scene-4': 'A vibrant crimson pomegranate sliced open showing ruby seed arils.',
  'supermarket-2-usage-scene-5': 'Ripe purple Adriatic figs with soft green tops arranged on a rustic wooden table.',

  // Lesson 3 (5/5)
  'supermarket-3-usage-scene-1': 'Crisp slender dark green cucumbers displayed fresh in a produce crate.',
  'supermarket-3-usage-scene-2': 'Tender dark green baby spinach leaves piled fresh in a produce bin.',
  'supermarket-3-usage-scene-3': 'Fresh smooth-skinned green zucchini squash resting in a rustic market bin.',
  'supermarket-3-usage-scene-4': 'Slender snap green beans bundled neatly in a wooden farm crate.',
  'supermarket-3-usage-scene-5': 'A round ribbed orange pumpkin resting on an autumn market table.',

  // Lesson 4 (3 approved; scenes 2 & 3 preserved in R2)
  'supermarket-4-usage-scene-1': 'Deep red round beetroot roots with fresh leafy tops in a farm stand crate.',
  'supermarket-4-usage-scene-4': 'Compact green Brussels sprouts arranged in a wooden market container.',
  'supermarket-4-usage-scene-5': 'A whole fresh globe artichoke with tightly layered green leaves on a cutting board.',

  // Lesson 5 (5/5)
  'supermarket-5-usage-scene-1': 'Fresh vibrant green sweet basil sprigs in a small glass vase on a wooden kitchen counter.',
  'supermarket-5-usage-scene-2': 'A freshly cut bunch of flat-leaf green parsley tied with twine on a marble surface.',
  'supermarket-5-usage-scene-3': 'Feathery green sprigs of fresh dill resting on a rustic prep board.',
  'supermarket-5-usage-scene-4': 'Dried aromatic dark green bay leaves displayed in a shallow ceramic dish.',
  'supermarket-5-usage-scene-5': 'A glass bottle of cold white whole milk beside a filled drinking glass on a counter.',

  // Lesson 7 (1/5)
  'supermarket-7-usage-scene-3': 'Golden, flaky freshly baked croissants neatly arranged on parchment paper in a bakery case.',

  // Lesson 8 (1/5)
  'supermarket-8-usage-scene-3': 'Round, pocketed flatbread pita loaves stacked neatly in clear unbranded packaging.',

  // Lesson 9 (2/5)
  'supermarket-9-usage-scene-1': 'Fresh skinless chicken breast cutlets arranged neatly on a chilled butcher tray.',
  'supermarket-9-usage-scene-5': 'A fresh whole lobster resting in a seafood market display tank.',

  // Lesson 10 (4/5)
  'supermarket-10-usage-scene-1': 'Freshly ground red beef arranged neatly on a black butcher tray.',
  'supermarket-10-usage-scene-2': 'Fresh raw chicken drumsticks displayed in neat rows in a butcher meat case.',
  'supermarket-10-usage-scene-3': 'Fresh whole oysters in rough gray shells resting on a bed of crushed ice.',
  'supermarket-10-usage-scene-4': 'A clean silver metal supermarket shopping cart in the store entry area.',

  // Lesson 11 (4/5)
  'supermarket-11-usage-scene-1': 'A folded white paper receipt lying beside paper grocery bags on a checkout counter.',
  'supermarket-11-usage-scene-2': 'A digital produce scale with a brushed stainless steel platform in a supermarket aisle.',
  'supermarket-11-usage-scene-3': 'An automated self-checkout payment station with an item scanner and touch screen.',
  'supermarket-11-usage-scene-4': 'A curved glass delicatessen service counter displaying gourmet cheeses and meats.',

  // Lesson 12 (5/5)
  'supermarket-12-usage-scene-1': 'An unbranded bottle of liquid laundry detergent with a measuring cap on a laundry shelf.',
  'supermarket-12-usage-scene-2': 'A roll of black plastic trash bags beside a clean waste container.',
  'supermarket-12-usage-scene-3': 'A household sweeping broom with natural bristles leaning against a clean wall.',
  'supermarket-12-usage-scene-4': 'A clear squeeze dispenser bottle of amber liquid dish soap beside a clean kitchen sink.',
  'supermarket-12-usage-scene-5': 'A silver roll of kitchen aluminum foil partially unrolled on a countertop.',

  // Lesson 13 (5/5)
  'supermarket-13-usage-scene-1': 'A household dustpan and handheld brush resting neatly on a tiled floor.',
  'supermarket-13-usage-scene-2': 'A sturdy plastic utility cleaning bucket sitting upright on a clean floor.',
  'supermarket-13-usage-scene-3': 'Dark roasted aromatic coffee beans spilling from a glass jar beside a white cup.',
  'supermarket-13-usage-scene-4': 'A tall, sleek unbranded metallic drink can on a counter with water droplets.',
  'supermarket-13-usage-scene-5': 'A chilled glass bottle of sparkling water poured into a glass with bubbles and lime.',

  // Lesson 14 (5/5)
  'supermarket-14-usage-scene-1': 'A chilled glass pitcher and glass filled with fresh orange juice beside whole oranges.',
  'supermarket-14-usage-scene-2': 'A thick fruit smoothie poured into a glass tumbler with fresh berries and a glass straw.',
  'supermarket-14-usage-scene-3': 'A chilled glass of bubbly ginger ale with ice cubes and a slice of fresh ginger.',
  'supermarket-14-usage-scene-4': 'Crisp golden potato chips served in a ceramic bowl on a wooden tabletop.',
  'supermarket-14-usage-scene-5': 'Assorted colorful sweet candies arranged in a clear glass apothecary jar.',

  // Lesson 15 (5/5)
  'supermarket-15-usage-scene-1': 'An assortment of shelled whole almonds, walnuts, and cashews in a wooden bowl.',
  'supermarket-15-usage-scene-2': 'Crispy salted twisted pretzels piled neatly in a stoneware bowl.',
  'supermarket-15-usage-scene-3': 'A nourishing blend of dried cranberries, raisins, and roasted mixed nuts in a bowl.',
  'supermarket-15-usage-scene-4': 'A glossy swirl lollipop on a white stick resting on a colorful surface.',
  'supermarket-15-usage-scene-5': 'An unbranded silver tin can of prepared vegetable soup on a pantry shelf.',

  // Lesson 16 (5/5)
  'supermarket-16-usage-scene-1': 'A clear glass bottle of rich red tomato ketchup resting on a dining table.',
  'supermarket-16-usage-scene-2': 'A tin can of cooked beans open on a counter showing red kidney beans.',
  'supermarket-16-usage-scene-3': 'A tinted glass bottle of golden-green extra virgin olive oil beside fresh olives.',
  'supermarket-16-usage-scene-4': 'A metal tin can of tuna fish opened to reveal flaked tuna in brine.',
  'supermarket-16-usage-scene-5': 'A glass maple leaf jug filled with pure golden-amber maple syrup.',

  // Lesson 17 (5/5)
  'supermarket-17-usage-scene-1': 'A clear glass bottle of pure golden cooking oil standing on a wooden surface.',
  'supermarket-17-usage-scene-2': 'A glass jar of rich creamy chocolate hazelnut spread beside toasted bread and hazelnuts.',
  'supermarket-17-usage-scene-3': 'A glass salt shaker filled with fine white mineral salt crystals on a dining table.',
  'supermarket-17-usage-scene-4': 'A slender glass bottle with cork stopper containing amber cider vinegar beside fresh apples.',
  'supermarket-17-usage-scene-5': 'A small glass spice jar containing ground cinnamon powder beside whole cinnamon sticks.',

  // Lesson 18 (5/5)
  'supermarket-18-usage-scene-1': 'A small ceramic bowl holding earthy ground cumin powder on a spice prep table.',
  'supermarket-18-usage-scene-2': 'Whole oval nutmeg seeds and freshly grated spice powder beside a stainless steel grater.',
  'supermarket-18-usage-scene-3': 'An amber glass dropper bottle of pure vanilla extract beside cured dark vanilla beans.',
  'supermarket-18-usage-scene-4': 'A ceramic bowl filled with soft golden-brown sugar on a wooden cutting board.',
  'supermarket-18-usage-scene-5': 'A glass dish filled with whole dark brown dried clove flower buds.',

  // Lesson 19 (5/5)
  'supermarket-19-usage-scene-1': 'A clean tube of mint toothpaste with a flip cap resting beside a toothbrush on a bathroom vanity.',
  'supermarket-19-usage-scene-2': 'A classic chrome safety razor in a metal stand beside a shaving brush on a bathroom counter.',
  'supermarket-19-usage-scene-3': 'A plain white pump bottle of sunscreen lotion beside dark sunglasses by a swimming pool.',
  'supermarket-19-usage-scene-4': 'An amber glass pump dispenser bottle of creamy hair conditioner on a shower shelf.',
  'supermarket-19-usage-scene-5': 'A white dispenser container of waxed dental floss with thread pulled out on a bathroom ledge.',

  // Lesson 20 (5/5)
  'supermarket-20-usage-scene-1': 'A small twist-up tube of moisturizing beeswax lip balm on a bedside nightstand.',
  'supermarket-20-usage-scene-2': 'An amber pharmacy bottle with child-safe cap and a blister pack of tablets in a medicine cabinet.',
  'supermarket-20-usage-scene-3': 'A sealed corrugated cardboard box with clean packaging tape on a wooden work table.',
  'supermarket-20-usage-scene-4': 'A plain blue-and-white gable-top paperboard carton standing on a supermarket shelf.',
  'supermarket-20-usage-scene-5': 'A neat parcel wrapped in brown kraft paper and tied with natural twine on a wooden desk.',

  // Lesson 21 (3/5)
  'supermarket-21-usage-scene-1': 'Freshly baked breakfast pastries arranged on a stainless steel baking tray.',
  'supermarket-21-usage-scene-2': 'An open molded cardboard carton containing a full set of twelve brown farm eggs.',
  'supermarket-21-usage-scene-3': 'A person\'s hands pulling a metal shopping cart forward from a nested line of carts.',

  // Lesson 22 (4/5)
  'supermarket-22-usage-scene-1': 'A person carrying a sturdy brown paper bag filled with fresh groceries in a parking lot.',
  'supermarket-22-usage-scene-2': 'A person\'s hands loading brown paper grocery bags into the open trunk of a car.',
  'supermarket-22-usage-scene-4': 'A baker in a white hat and apron pulling freshly baked sourdough loaves from an oven on a wooden peel.',
  'supermarket-22-usage-scene-5': 'A uniformed store security guard standing near the automatic glass sliding doors of a supermarket.',

  // Lesson 23 (5/5)
  'supermarket-23-usage-scene-1': 'A plain gallon jug of fresh milk and a filled glass on a kitchen counter.',
  'supermarket-23-usage-scene-2': 'A whole crusty loaf of artisanal sourdough bread on a wooden cutting board with a bread knife.',
  'supermarket-23-usage-scene-3': 'A single sliced triangular piece of fresh strawberry tart on a porcelain dessert plate.',
  'supermarket-23-usage-scene-4': 'A plain white pint ice cream container with gold rim lid beside a scoop of vanilla ice cream.',
  'supermarket-23-usage-scene-5': 'A plain unbranded food container representing specialized dietary goods on a kitchen surface.',

  // Lesson 24 (4/5)
  'supermarket-24-usage-scene-1': 'Crisp heads of fresh green romaine lettuce glistening with fine water droplets in a produce display.',
  'supermarket-24-usage-scene-3': 'A plain, clean packaging pouch on a wooden shelf representing certified food goods.',
  'supermarket-24-usage-scene-4': 'A bright, clean supermarket grocery aisle with stocked shelves and polished flooring.',
  'supermarket-24-usage-scene-5': 'A generic contactless payment terminal beside a bank card on a wooden retail counter.',

  // Lesson 25 (3/3)
  'supermarket-25-usage-scene-1': 'A customer presenting a paper receipt across a service counter to a store assistant.',
  'supermarket-25-usage-scene-2': 'A food server offering a slice of cheese on wax paper over a glass counter to a customer.',
  'supermarket-25-usage-scene-3': 'A gleaming metal supermarket shopping cart standing in the store entrance area.',
};

console.log(`Total approved scenes to map: ${Object.keys(approvedScenes).length}`);

// 1. Copy images from output/illustrations/generated/ to public/scene-images/
const srcDir = 'output/illustrations/generated';
const dstDir = 'public/scene-images';
if (!fs.existsSync(dstDir)) {
  fs.mkdirSync(dstDir, { recursive: true });
}

let copiedCount = 0;
for (const sceneId of Object.keys(approvedScenes)) {
  const srcFile = path.join(srcDir, `${sceneId}.webp`);
  const dstFile = path.join(dstDir, `${sceneId}.webp`);

  if (!fs.existsSync(srcFile)) {
    throw new Error(`Source file missing: ${srcFile}`);
  }

  fs.copyFileSync(srcFile, dstFile);
  copiedCount++;
}
console.log(`Successfully copied ${copiedCount} files to ${dstDir}`);

// 2. Update src/app/data/usage/supermarket.usage.json
const usagePath = 'src/app/data/usage/supermarket.usage.json';
const usageData = JSON.parse(fs.readFileSync(usagePath, 'utf8'));

let mappedScenesCount = 0;
let preservedScenesCount = 0;
let unillustratedScenesCount = 0;

for (const lesson of usageData) {
  for (const scene of lesson.usage.scenes) {
    const sceneId = `${lesson.lessonId}-usage-scene-${scene.chunkNumber}`;

    // Never touch preserved R2 assets
    if (sceneId === 'supermarket-4-usage-scene-2' || sceneId === 'supermarket-4-usage-scene-3') {
      preservedScenesCount++;
      continue;
    }

    if (approvedScenes[sceneId]) {
      scene.imagePath = `scene-images/${sceneId}.webp`;
      scene.imageAlt = approvedScenes[sceneId];
      mappedScenesCount++;
    } else {
      // Unillustrated or rejected scenes do not have an imagePath so fallback cascade activates
      delete scene.imagePath;
      unillustratedScenesCount++;
    }
  }
}

fs.writeFileSync(usagePath, JSON.stringify(usageData, null, 2) + '\n', 'utf8');
console.log(`Updated ${usagePath}:`);
console.log(`- Mapped approved scenes: ${mappedScenesCount}`);
console.log(`- Preserved R2 scenes: ${preservedScenesCount}`);
console.log(`- Unillustrated fallback scenes: ${unillustratedScenesCount}`);

// 3. Update src/app/generated/localAssetOverrides.json
const overridesPath = 'src/app/generated/localAssetOverrides.json';
const existingOverrides = JSON.parse(fs.readFileSync(overridesPath, 'utf8'));
const overrideSet = new Set(existingOverrides);

for (const sceneId of Object.keys(approvedScenes)) {
  overrideSet.add(`scene-images/${sceneId}.webp`);
}

const sortedOverrides = Array.from(overrideSet).sort();
fs.writeFileSync(overridesPath, JSON.stringify(sortedOverrides, null, 2) + '\n', 'utf8');
console.log(`Updated ${overridesPath}: total entries now ${sortedOverrides.length}`);
