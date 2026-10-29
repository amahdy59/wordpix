const fs = require('fs');

const smPath = 'src/app/data/usage/supermarket.usage.json';
const smData = JSON.parse(fs.readFileSync(smPath, 'utf8'));

const part2Map = {
  // Supermarket 6
  'supermarket-6-1': { // Butter
    scenario: "In the chilled dairy case, foil-wrapped blocks of golden creamy butter rest neatly stacked beside cartons of whole milk and artisanal cheeses.",
    question: "Which rich, creamy golden dairy block is stacked in the chilled case?",
    prompt: "Appetizing still life food photography of a block of creamy golden butter resting on a white ceramic butter dish with a silver spreader on a clean wooden table. Morning sunlight, spotless and gourmet. Zero people, zero text, zero brand logos."
  },
  'supermarket-6-2': { // Juice
    scenario: "In the refrigerated beverage case, chilled glass carafes of freshly squeezed golden orange juice stand beside sparkling waters.",
    question: "Which freshly squeezed, vitamin-rich citrus beverage is displayed in the chilled case?",
    prompt: "Vivid commercial product photography of a cold glass carafe filled with vibrant orange juice with fine condensation drops, resting on a clean marble surface beside orange slices. Crisp bright lighting, mouth-watering. Zero people, zero text, zero brand logos."
  },
  'supermarket-6-3': { // Frozen Vegetables
    scenario: "In the supermarket freezer section, a clear bag displays a colorful mix of frozen garden peas, sweet corn, and diced carrots dusted with fine frost.",
    question: "Which frost-dusted mix of garden peas, corn, and carrots is found in the freezer case?",
    prompt: "Macro culinary photography of a colorful assortment of frozen green peas, sweet yellow corn kernels, and diced orange carrots with delicate white frost crystals on a clean slate surface. Crisp, vibrant colors, clean studio lighting. Zero people, zero text, zero brand logos."
  },
  'supermarket-6-4': { // Cottage Cheese
    scenario: "On the dairy shelf, a fresh white ceramic bowl contains curds of wholesome cottage cheese garnished with a fresh mint leaf.",
    question: "Which high-protein, curded white dairy product is presented in the ceramic bowl?",
    prompt: "Artisanal food photography of a clean white ceramic bowl filled with creamy, curded white cottage cheese, placed on a light wooden tabletop in soft morning light. Fresh, wholesome, immaculate culinary presentation. Zero people, zero text, zero brand logos."
  },
  'supermarket-6-5': { // Margarine
    scenario: "In the chilled spread section, a clean tub of smooth vegetable-oil margarine spread is displayed beside cooking oils and butter.",
    question: "Which plant-based golden spread made from vegetable oils is found in the chilled section?",
    prompt: "Commercial food photography of a smooth golden tub of soft plant-based margarine spread, neatly opened showing a clean swirl of spreadable texture on a white plate. Fresh daylight, spotless presentation. Zero people, zero text, zero brand logos."
  },

  // Supermarket 7
  'supermarket-7-1': { // Parmesan
    scenario: "At the specialty cheese counter, an aged wedge of hard Parmesan cheese with a textured golden rind rests beside a small cheese knife.",
    question: "Which hard, granular Italian cheese wedge with a golden rind is displayed at the cheese counter?",
    prompt: "Gourmet culinary photography of a triangular wedge of aged Parmigiano-Reggiano cheese showing granular crumbly texture, resting on a rustic dark wooden board with delicate curls of shaved cheese. Warm side lighting, sophisticated. Zero people, zero text, zero brand logos."
  },
  'supermarket-7-2': { // Oat Milk
    scenario: "On the plant-based milk shelf, a smooth carton of creamy oat milk sits beside almond and soy alternatives.",
    question: "Which popular plant-based dairy alternative made from soaked oats is on the shelf?",
    prompt: "Minimalist product photography of a clean unmarked glass bottle of creamy oat milk beside a small dish of raw rolled oats on a light stone countertop. Soft Nordic daylight, elegant and pure. Zero people, zero text, zero brand logos."
  },
  'supermarket-7-3': { // Croissant
    scenario: "In the bakery display, freshly baked flaky golden-brown French croissants with delicate buttery layers rest on parchment paper.",
    question: "Which crescent-shaped, flaky buttery pastry is displayed on bakery parchment?",
    prompt: "Mouth-watering artisanal bakery photography of golden-brown flaky French croissants with glistening butter glaze on unbleached baking parchment over a dark wooden counter. Crisp airy layers, warm morning light. Zero people, zero text, zero brand logos."
  },
  'supermarket-7-4': { // Rice
    scenario: "In the dry grains aisle, a transparent glass bowl is filled with long, polished white basmati rice grains beside brown rice and quinoa.",
    question: "Which staple dry grain with slender white polished grains is presented in the glass bowl?",
    prompt: "Crisp still life photography of a clear glass bowl overflowing with long, uncooked white basmati rice grains resting on a clean bamboo mat. Pristine focus, clean culinary lighting. Zero people, zero text, zero brand logos."
  },
  'supermarket-7-5': { // Flour
    scenario: "On the baking prep table, a ceramic scoop rests in a bowl of fine, sifted white wheat flour ready for bread making.",
    question: "Which fine, white powdered grain essential for baking bread and pastries is shown in the bowl?",
    prompt: "Warm culinary still life photography of a white ceramic bowl filled with finely sifted white all-purpose baking flour with a wooden measuring scoop resting inside. Soft dusting of flour on a dark marble counter, soft natural light. Zero people, zero text, zero brand logos."
  },

  // Supermarket 8
  'supermarket-8-1': { // Pie
    scenario: "In the bakery showcase, a freshly baked golden lattice-crust apple pie releases fragrant steam from its bubbly fruit filling.",
    question: "Which traditional baked dessert with a golden woven lattice pastry crust is featured in the showcase?",
    prompt: "Appetizing food photography of a whole, freshly baked golden-brown lattice-crust pie in a white ceramic baking dish, showing glossy warm berry filling bubbling through the pastry slits. Warm bakery lighting, irresistible. Zero people, zero text, zero brand logos."
  },
  'supermarket-8-2': { // Oatmeal
    scenario: "On the breakfast counter, a warm ceramic bowl of thick rolled-oat oatmeal is topped with sliced bananas and pure honey.",
    question: "Which hearty, warm whole-grain breakfast cereal is served in the ceramic bowl?",
    prompt: "Cozy morning food photography of a steaming ceramic bowl of cooked rolled oatmeal garnished with neat banana slices and a swirl of golden honey. Clean wooden table setting, soft morning sunlight. Zero people, zero text, zero brand logos."
  },
  'supermarket-8-3': { // Pita
    scenario: "In the flatbread section, a stack of soft, round pocket pita breads with toasted golden spots rests in a woven bread basket.",
    question: "Which round Middle Eastern pocket flatbread with toasted spots is stacked in the basket?",
    prompt: "Artisanal food photography of a stack of soft, puffy round pita flatbreads showing light golden toasted spots, wrapped in a clean linen towel inside a woven basket. Warm daylight, authentic and fresh. Zero people, zero text, zero brand logos."
  },
  'supermarket-8-4': { // Waffle
    scenario: "On the breakfast platter, a crisp golden-brown Belgian waffle with deep square pockets is dusted with powdered sugar.",
    question: "Which crisp, grid-patterned breakfast cake with square pockets is served on the platter?",
    prompt: "Irresistible culinary photography of two golden-crisp Belgian waffles with deep square grid pockets, lightly dusted with powdered sugar on a white ceramic plate with a small jug of maple syrup nearby. Crisp daylight, immaculate. Zero people, zero text, zero brand logos."
  },
  'supermarket-8-5': { // Couscous
    scenario: "In the specialty grains section, a terracotta bowl holds delicate steamed golden semolina couscous grains garnished with parsley.",
    question: "Which tiny, steamed golden semolina grain traditional in North African cuisine is in the bowl?",
    prompt: "Authentic culinary photography of a warm terracotta bowl filled with fluffy, golden steamed couscous grains garnished with a fresh herb sprig on a clean slate surface. Warm natural side lighting, appetizing and wholesome. Zero people, zero text, zero brand logos."
  },

  // Supermarket 9
  'supermarket-9-1': { // Chicken
    scenario: "At the butcher counter, fresh, skinless chicken breast cutlets of tender pink poultry rest on a butcher display tray garnished with rosemary.",
    question: "Which tender pink poultry cut is arranged on the butcher tray?",
    prompt: "Clean and hygienic commercial butcher photography of fresh, trimmed raw chicken breast fillets with delicate pink texture resting on a sanitized stainless steel tray with a sprig of fresh rosemary. Bright daylight, sparkling clean and appetizing. Zero people, zero text, zero brand logos."
  },
  'supermarket-9-2': { // Fish
    scenario: "On the seafood bed of shaved ice, a fresh whole silvery sea bass with clear bright eyes and shimmering scales is artfully presented.",
    question: "Which whole silvery catch with bright clear eyes rests on the seafood ice bed?",
    prompt: "Professional seafood market photography of a fresh whole silver fish with bright clear eyes and glistening scales resting on a bed of clean crushed ice with fresh lemon wedges. Crisp cool market lighting, spotless and fresh. Zero people, zero text, zero brand logos."
  },
  'supermarket-9-3': { // Bacon
    scenario: "In the cured meats case, neat parallel strips of smoked cured bacon display alternating layers of rich red lean and white marbling.",
    question: "Which striped, cured and smoked breakfast meat is arranged in parallel rows?",
    prompt: "Gourmet culinary photography of several neat, uncooked strips of smoked bacon showing rich mahogany red meat and delicate white marbling, laid flat on clean brown butcher paper. Crisp studio lighting, gourmet charcuterie presentation. Zero people, zero text, zero brand logos."
  },
  'supermarket-9-4': { // Tuna
    scenario: "At the fresh seafood counter, a thick ruby-red fresh tuna steak with firm velvety grain rests on a black display slate.",
    question: "Which thick, deep ruby-red seafood steak is showcased on the display slate?",
    prompt: "Stunning gourmet food photography of a thick, firm ruby-red fresh ahi tuna steak resting on a clean dark slate platter with a sliced lime and sesame seeds. Pristine seafood quality, crisp focus. Zero people, zero text, zero brand logos."
  },
  'supermarket-9-5': { // Lobster
    scenario: "In the gourmet seafood tank display, a live whole red-and-dark lobster rests on clean river pebbles with impressive claws.",
    question: "Which large marine crustacean with prominent heavy claws is featured in the gourmet display?",
    prompt: "Vivid commercial photography of a whole cooked bright-red lobster arranged neatly on a clean white serving platter with lemon wedges and melted herb butter in a small ramekin. Crisp focus, sparkling clean presentation. Zero people, zero text, zero brand logos."
  },

  // Supermarket 10
  'supermarket-10-1': { // Ground Beef
    scenario: "In the chilled butcher case, freshly minced lean ground beef with a vibrant rich-red color is formed into a neat display mound.",
    question: "Which finely minced, rich-red butcher meat used for burgers is displayed in the case?",
    prompt: "Hygienic butcher-shop food photography of fresh, vibrant-red lean ground beef neatly mounded on a sanitized white porcelain tray garnished with a sprig of thyme. Crisp bright lighting, spotless grocery butcher setting. Zero people, zero text, zero brand logos."
  },
  'supermarket-10-2': { // Drumstick
    scenario: "At the poultry section, fresh raw chicken drumsticks with plump meat and clean bone handles are lined up in a chilled tray.",
    question: "Which lower-leg poultry cuts with plump meat are lined up in the tray?",
    prompt: "Clean commercial culinary photography of fresh raw chicken drumsticks with plump, pale-pink meat and clean white bones arranged neatly on a stainless steel butcher tray. Spotless hygienic environment, crisp focus. Zero people, zero text, zero brand logos."
  },
  'supermarket-10-3': { // Oyster
    scenario: "On the chilled raw bar counter, freshly shucked oysters on the half shell glisten in their briny liquor over crushed ice.",
    question: "Which briny bivalve shellfish served raw on the half shell rests on the crushed ice?",
    prompt: "Gourmet seafood photography of freshly shucked raw oysters on their rough half shells, glistening with natural seawater liquor on a bed of sparkling crushed ice with lemon quarters. Elegant restaurant raw bar presentation, cool natural lighting. Zero people, zero text, zero brand logos."
  },
  'supermarket-10-4': { // Shopping Cart
    scenario: "In the supermarket entrance foyer, a gleaming silver metal shopping cart with an ergonomic handle stands ready for grocery shoppers.",
    question: "Which four-wheeled metal vehicle is provided for shoppers to hold their items?",
    prompt: "Clean architectural commercial photography of a modern, polished stainless-steel four-wheeled supermarket shopping cart standing in a bright, clean grocery store entrance hall with polished floors. Symmetrical, spotless. Zero people, zero text, zero brand logos."
  },
  'supermarket-10-5': { // Aisle
    scenario: "Looking down a supermarket grocery aisle, brightly illuminated parallel shelves are lined with neatly front-faced packaged goods on a polished floor.",
    question: "Which long walkway between rows of grocery store shelves is shown in the store?",
    prompt: "Wide-angle symmetrical architectural photograph looking straight down a clean, modern supermarket grocery aisle with brightly lit, perfectly organized shelves on both sides and a gleaming polished floor. Warm ambient store lights. Zero people, zero readable text, zero brand logos."
  }
};

// 1. Update supermarket.usage.json
smData.forEach((lesson, lIdx) => {
  lesson.usage.scenes.forEach((scene, sIdx) => {
    const key = `supermarket-${lIdx + 1}-${sIdx + 1}`;
    if (part2Map[key]) {
      scene.scenario = part2Map[key].scenario;
      scene.check.question = part2Map[key].question;
    }
  });
});
fs.writeFileSync(smPath, JSON.stringify(smData, null, 2), 'utf8');

// 2. Update pipeline items safely (only for supermarket items!)
const pipelinePath = 'output/illustrations/generation_batches_pipeline.json';
const pipeline = JSON.parse(fs.readFileSync(pipelinePath, 'utf8'));
const b4 = pipeline.batches[4];

let updatedCount = 0;
b4.items.forEach(item => {
  if (item.sceneId.startsWith('supermarket-')) {
    const parts = item.sceneId.split('-usage-scene-');
    const lKey = parts[0].split('-').slice(-1)[0];
    const sKey = parts[1];
    const key = `supermarket-${lKey}-${sKey}`;

    if (part2Map[key]) {
      item.scenario = part2Map[key].scenario;
      item.optimizedPrompt = part2Map[key].prompt;
      updatedCount++;
    }
  }
});

fs.writeFileSync(pipelinePath, JSON.stringify(pipeline, null, 2), 'utf8');
console.log(`Successfully elevated 25 Supermarket Part 2 scenes in supermarket.usage.json and updated ${updatedCount} pipeline items.`);
