const fs = require('fs');

const marketPath = 'src/app/data/usage/market.usage.json';
const marketData = JSON.parse(fs.readFileSync(marketPath, 'utf8'));

const marketMap = {
  'market-3-3': { // Milk
    scenario: "In the chilled dairy section of the grocery store, clear glass bottles of fresh whole milk are neatly arranged on a clean refrigerated shelf beside artisan cheese and yogurt.",
    question: "Which fresh dairy beverage in a glass bottle is arranged on the refrigerated shelf?",
    prompt: "A beautiful still life photograph of a clear glass bottle of fresh whole milk with condensation droplets on the glass, sitting on a chilled marble shelf next to a small wooden bowl of artisan cheese. Crisp bright natural lighting, spotless and appetizing. Zero people, zero text, zero brand logos."
  },
  'market-3-4': { // Butter
    scenario: "In the dairy aisle, packages of golden salted butter in clean foil wrapping are displayed on a chilled shelf beside fresh heavy cream.",
    question: "Which rich dairy spread in foil wrapping is displayed on the chilled shelf?",
    prompt: "Artisanal food photography of a block of creamy golden butter resting on a white porcelain butter dish with a clean butter knife nearby on a sunlit wooden breakfast table. Fresh, appetizing, immaculate kitchen setting. Zero people, zero text, zero brand logos."
  },
  'market-3-5': { // Roll
    scenario: "In the bakery section of the market, a wicker basket is filled with freshly baked golden bread rolls beside bagels and flaky croissants.",
    question: "Which small, round golden bread is piled in the bakery wicker basket?",
    prompt: "Warm artisanal bakery photography of freshly baked golden-brown crusty dinner rolls resting in a clean cloth-lined wicker basket on a rustic bakery table. Soft warm morning bakery lighting, mouth-watering and pristine. Zero people, zero text, zero brand logos."
  },
  'market-4-1': { // Cake
    scenario: "Behind the bakery display glass, an elegant glazed strawberry vanilla cake with piped white frosting sits on a polished marble cake stand.",
    question: "Which decorated dessert on a pedestal cake stand is featured in the bakery display?",
    prompt: "Gourmet patisserie photography of a whole elegant round vanilla sponge cake topped with fresh glazed red berries and white frosting rosettes, resting on a clean white ceramic cake stand in a bright bakery showcase. Spotless, tempting, gourmet. Zero people, zero text, zero brand logos."
  },
  'market-4-2': { // Produce Section
    scenario: "The spacious supermarket produce section features wide, clean wooden display crates brimming with colorful fresh fruits and crisp vegetables under bright overhead lights.",
    question: "Which open market area is filled with fresh fruits and vegetables in display crates?",
    prompt: "Wide-angle architectural interior photography of a pristine, modern grocery produce section with clean wooden island display tables overflowing with neatly organized colorful fruits and green vegetables. Spotless polished concrete floor, warm bright ambient store lighting. Zero people, zero text, zero brand logos."
  },
  'market-4-3': { // Frozen Foods
    scenario: "Down the frozen foods aisle, tall glass-door upright freezers display neatly organized bags of frozen berries, vegetables, and meals under cool LED illumination.",
    question: "Which supermarket aisle contains tall glass-door freezers with chilled and frozen goods?",
    prompt: "Clean symmetrical photography looking down a modern supermarket frozen foods aisle with gleaming glass-door commercial freezers on both sides glowing with cool blue-white LED light. Spotless reflective floor, immaculate and organized. Zero people, zero text, zero brand logos."
  },
  'market-4-4': { // Shopping Cart
    scenario: "Near the supermarket entrance, a clean four-wheeled metal shopping cart with a comfortable red handlebar stands ready in an orderly row.",
    question: "Which four-wheeled metal carrier is provided for shoppers to hold their groceries?",
    prompt: "Eye-level commercial photography of a modern, gleaming silver wire-frame shopping cart with clean black wheels and an ergonomic red handle standing alone in a brightly lit, clean supermarket lobby. Crisp focus, sparkling clean. Zero people, zero text, zero brand logos."
  },
  'market-4-5': { // Scale
    scenario: "At the self-serve weighing station in the produce area, a modern digital scale with a flat stainless steel tray displays weight numbers for fresh produce.",
    question: "Which digital weighing device with a stainless steel tray is used to weigh fresh produce?",
    prompt: "Clean close-up product photography of a modern digital produce scale with a brushed stainless steel weighing platter on a grocery counter. A cluster of green apples rests on the platter. Crisp daylight, sparkling clean. Zero people, zero readable brand logos, no text."
  },
  'market-5-1': { // Barcode
    scenario: "At the supermarket scanner, a man's hand holds a grocery box to aim the red laser beam at the black-and-white printed barcode.",
    question: "Which series of black-and-white parallel lines on a package is scanned at checkout?",
    prompt: "Close-up photograph focusing on a man's hand holding a clean unmarked cardboard grocery package, with a fine red scanner light beam highlighting the black-and-white vertical barcode stripes. Clean checkout counter setting, sharp focus. Zero female figures, only a man's hand, zero brand logos."
  },
  'market-5-2': { // Shopping List
    scenario: "On a clean wooden shopping cart handle, a man's hand holds a neatly handwritten paper shopping list with neat checkmarks beside items.",
    question: "Which handwritten paper note helps the shopper remember what items to purchase?",
    prompt: "First-person perspective close-up of an adult man's hand holding a clean notepad with a neat bulleted grocery checklist attached to a shopping cart clipboard. Bright, clear supermarket background. Zero female figures, only a man's hand, zero commercial logos."
  },
  'market-5-3': { // Change
    scenario: "On the polished checkout counter next to a folded receipt, several gleaming silver and copper coins are received as change after payment.",
    question: "Which metal coins given back after cash payment are resting on the checkout counter?",
    prompt: "Close-up macro photography of clean, polished metallic coins of various sizes (change) resting beside a neatly folded white receipt slip on a dark granite checkout counter. Crisp reflections, sharp focus. Zero people, zero text on coins, zero brand logos."
  },
  'market-5-4': { // Kiwi
    scenario: "In the exotic fruit section, fuzzy brown kiwifruits are arranged in a clean wooden crate, with one kiwi sliced in half to show bright green flesh and black seeds.",
    question: "Which small brown fuzzy fruit is sliced open to reveal vibrant green seeded flesh?",
    prompt: "Appetizing macro food photography of fresh ripe kiwifruits on a light rustic wooden board, with one kiwi cleanly sliced in half exposing vibrant emerald green flesh, ring of tiny black seeds, and cream center. Dewy fresh, natural morning daylight. Zero people, zero text, zero brand logos."
  },
  'market-5-5': { // Freezer
    scenario: "Along the grocery wall, a large commercial supermarket chest freezer with clear sliding glass lids keeps packaged ice cream and frozen goods frozen.",
    question: "Which large chilled commercial appliance with glass sliding lids stores frozen grocery items?",
    prompt: "High-angle clean photography of a modern white commercial supermarket horizontal chest freezer with transparent sliding curved glass doors, showing neatly arranged frozen food packages inside. Clean tiled floor, sparkling bright store illumination. Zero people, zero readable text, zero brand logos."
  },
  'market-6-1': { // Customer
    scenario: "In a brightly lit, clean supermarket aisle, an adult male customer pushes a shopping cart while carefully checking a jar of pasta sauce on the shelf.",
    question: "Which person visiting the store is shopping for groceries in the aisle?",
    prompt: "Realistic photography of a 30-year-old adult man in casual collared shirt pushing a clean grocery cart in a brightly lit supermarket aisle, looking thoughtfully at products on the shelf. Dignified adult male, clean modern store environment. Strictly no women, zero text, zero brand logos."
  },
  'market-6-2': { // Manager
    scenario: "In the supermarket aisle, a professional adult male store manager in a neat collared shirt and staff lanyard holds a digital tablet while inspecting product displays.",
    question: "Which store supervisor oversees the supermarket operations and staff?",
    prompt: "Professional documentary photography of an adult male supermarket manager in a crisp button-down shirt and lanyard holding a digital tablet with a stylus, standing attentively in a pristine grocery aisle. Dignified male professional, clean store. Strictly no women, zero text, zero brand logos."
  },
  'market-6-3': { // Delivery Driver
    scenario: "At the market loading dock, a male delivery driver wearing a clean uniform and work vest wheels a stacked hand truck of fresh grocery crates from his delivery van.",
    question: "Which logistics worker transports and unloads fresh grocery inventory at the market?",
    prompt: "Documentary photography of a robust adult male delivery driver in a neat work jacket and utility vest wheeling a sturdy hand truck loaded with plastic produce crates by a clean market delivery bay. Daylight, professional adult male worker. Strictly no women, zero text, zero brand logos."
  },
  'market-6-4': { // Cart
    scenario: "Resting on the gleaming supermarket floor near the checkout register, a sturdy wheeled metal cart is loaded with neat paper grocery bags.",
    question: "Which wheeled shopping vehicle holds grocery bags at the checkout area?",
    prompt: "Eye-level photograph of a sturdy metal shopping cart filled with clean brown paper grocery bags with celery and baguettes peeking out, parked beside a clean checkout lane. Bright supermarket lighting, neat and organized. Zero people, zero text, zero brand logos."
  }
};

// Update market.usage.json
marketData.forEach((lesson, lIdx) => {
  lesson.usage.scenes.forEach((scene, sIdx) => {
    const key = `market-${lIdx + 1}-${sIdx + 1}`;
    if (marketMap[key]) {
      scene.scenario = marketMap[key].scenario;
      scene.check.question = marketMap[key].question;
    }
  });
});
fs.writeFileSync(marketPath, JSON.stringify(marketData, null, 2), 'utf8');

// Update generation_batches_pipeline.json
const pipelinePath = 'output/illustrations/generation_batches_pipeline.json';
const pipeline = JSON.parse(fs.readFileSync(pipelinePath, 'utf8'));
const b4 = pipeline.batches[4];

let updatedCount = 0;
b4.items.forEach(item => {
  const parts = item.sceneId.split('-usage-scene-');
  const lKey = parts[0].split('-').slice(-1)[0];
  const sKey = parts[1];
  const key = `market-${lKey}-${sKey}`;

  if (marketMap[key]) {
    item.scenario = marketMap[key].scenario;
    item.optimizedPrompt = marketMap[key].prompt;
    updatedCount++;
  }
});

fs.writeFileSync(pipelinePath, JSON.stringify(pipeline, null, 2), 'utf8');
console.log(`Successfully elevated ${Object.keys(marketMap).length} market scenes in market.usage.json and updated ${updatedCount} pipeline items.`);
