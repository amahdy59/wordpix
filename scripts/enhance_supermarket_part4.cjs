const fs = require('fs');

const smPath = 'src/app/data/usage/supermarket.usage.json';
const smData = JSON.parse(fs.readFileSync(smPath, 'utf8'));

const part4Map = {
  // Supermarket 16
  'supermarket-16-1': { // Ketchup
    scenario: "On the picnic table, a glass bottle of rich red tomato ketchup sits beside mustard and mayonnaise jars.",
    question: "Which sweet, tangy red tomato condiment bottle is placed on the table?",
    prompt: "Appetizing still life food photography of a classic glass bottle of thick, deep-red tomato ketchup resting on a rustic wooden picnic table beside a ceramic ramekin with a neat dollop of ketchup. Warm daylight, spotless. Zero people, zero text, zero brand logos."
  },
  'supermarket-16-2': { // Canned Beans
    scenario: "On the pantry shelf, an unmarked tin can of black beans rests beside canned sweet corn and diced tomatoes.",
    question: "Which canned legume staple is stored on the pantry shelf?",
    prompt: "Still life pantry photography of an unmarked tin can with a pull-tab lid sitting beside a small white ceramic bowl of plump cooked black beans with fresh cilantro on a dark wooden shelf. Soft warm ambient light. Zero people, zero text, zero brand logos."
  },
  'supermarket-16-3': { // Olive Oil
    scenario: "In the gourmet oils aisle, a tall dark-green tinted glass bottle of extra virgin olive oil catches the warm store lighting.",
    question: "Which cold-pressed Mediterranean cooking oil in a dark green bottle is featured?",
    prompt: "Artisanal culinary photography of an elegant dark-green glass bottle of golden-green extra virgin olive oil with a cork pourer, resting on a white marble slab beside a small saucer of golden oil and green olives. Natural daylight, gourmet. Zero people, zero text, zero brand logos."
  },
  'supermarket-16-4': { // Tuna Can
    scenario: "On the canned fish shelf, a shallow cylindrical tin can of solid light tuna in spring water sits ready for pantry storage.",
    question: "Which shallow round tin containing preserved seafood is placed on the shelf?",
    prompt: "Product photography of a clean, unbranded round silver tin can of tuna fish with an easy-open pull ring, resting beside a lemon slice and a fresh sprig of parsley on a light grey slate surface. Crisp clean studio light. Zero people, zero text, zero brand logos."
  },
  'supermarket-16-5': { // Maple Syrup
    scenario: "On the breakfast counter, an amber glass jug of pure Canadian maple syrup displays its rich golden-brown hue.",
    question: "Which rich, golden-brown tree syrup commonly poured over pancakes is shown in the glass jug?",
    prompt: "Appetizing breakfast photography of a classic small glass pitcher filled with rich, translucent amber maple syrup with a small finger loop handle, sitting on a sunlit wooden breakfast counter near a stack of pancakes. Glistening warm morning light. Zero people, zero text, zero brand logos."
  },

  // Supermarket 17
  'supermarket-17-1': { // Vegetable Oil
    scenario: "In the baking section, a clear bottle of pure golden vegetable oil is displayed beside coconut and sunflower oils.",
    question: "Which clear, neutral golden cooking and frying oil is displayed in the bottle?",
    prompt: "Commercial product photography of a tall clear bottle of brilliant, translucent golden vegetable cooking oil on a clean stainless steel kitchen counter. Crisp daylight reflections, sparkling clean. Zero people, zero text, zero brand logos."
  },
  'supermarket-17-2': { // Nutella / Chocolate Hazelnut Spread
    scenario: "On the breakfast table, a clear glass jar of creamy chocolate hazelnut spread rests beside toasted bread and roasted hazelnuts.",
    question: "Which rich, creamy cocoa and hazelnut breakfast spread is served on the table?",
    prompt: "Irresistible food photography of a clean glass jar filled with rich, velvety dark chocolate hazelnut spread with a wooden butter knife resting across a slice of golden toast, surrounded by whole roasted hazelnuts on a clean board. Warm natural light. Zero people, zero text, zero brand logos."
  },
  'supermarket-17-3': { // Salt
    scenario: "On the seasoning counter, a clear glass salt shaker filled with fine white mineral salt crystals sits beside a black pepper grinder.",
    question: "Which essential white mineral seasoning is contained in the clear shaker?",
    prompt: "Culinary still life photography of a classic clear glass salt shaker with a polished chrome cap filled with pure white crystalline table salt, sitting on a dark granite kitchen surface. Crisp studio light, sparkling crystals. Zero people, zero text, zero brand logos."
  },
  'supermarket-17-4': { // Vinegar
    scenario: "In the condiment aisle, a slender glass bottle of fermented apple cider vinegar displays a warm amber tone beside soy sauce.",
    question: "Which acidic, fermented liquid used for salad dressings and marinades is in the bottle?",
    prompt: "Artisanal product photography of a slender, clean glass bottle filled with clear amber apple cider vinegar with a cork stopper, resting on a rustic wooden table beside fresh crisp apples. Soft natural daylight, pristine. Zero people, zero text, zero brand logos."
  },
  'supermarket-17-5': { // Cinnamon
    scenario: "In the spice rack, a small glass jar holds fragrant reddish-brown ground cinnamon powder beside whole rolled cinnamon sticks.",
    question: "Which warm, aromatic sweet spice made from tree bark is featured in the jar?",
    prompt: "Macro culinary photography of fragrant reddish-brown ground cinnamon powder in a small glass spice jar, with several tightly rolled natural cinnamon quills (bark sticks) resting beside it on a dark slate surface. Warm cozy lighting. Zero people, zero text, zero brand logos."
  },

  // Supermarket 18
  'supermarket-18-1': { // Cumin
    scenario: "In the spice drawer, a small ceramic bowl holds warm, earthy ground cumin powder beside coriander and turmeric.",
    question: "Which earthy, aromatic brownish-yellow ground spice staple in chili and curry is in the bowl?",
    prompt: "Warm culinary still life photography of a small terracotta bowl filled with finely ground golden-brown cumin powder, flanked by whole ribbed cumin seeds on a dark stone surface. Warm atmospheric light, rich texture. Zero people, zero text, zero brand logos."
  },
  'supermarket-18-2': { // Nutmeg
    scenario: "On the baking prep board, a whole oval nutmeg seed with furrowed brown shell lies next to a fine stainless steel spice grater.",
    question: "Which hard, aromatic oval seed grated into holiday baking and custards is shown with the grater?",
    prompt: "Culinary photography of two whole textured brown nutmeg seeds and a small pile of freshly grated nutmeg powder beside a sleek stainless steel microplane grater on a dark wood cutting board. Crisp focus, gourmet lighting. Zero people, zero text, zero brand logos."
  },
  'supermarket-18-3': { // Vanilla Extract
    scenario: "In the baking cabinet, an amber glass dropper bottle of pure aromatic vanilla extract rests beside dark cured vanilla beans.",
    question: "Which fragrant dark liquid flavoring extracted from cured orchid pods is in the bottle?",
    prompt: "Artisanal food photography of a small dark amber glass apothecary bottle of pure vanilla extract with an eye dropper cap, resting beside two glossy, slender dark vanilla bean pods on a white marble pastry board. Soft natural light, elegant. Zero people, zero text, zero brand logos."
  },
  'supermarket-18-4': { // Brown Sugar
    scenario: "On the pastry counter, a ceramic bowl holds moist, soft golden-brown sugar with natural molasses aroma ready for cookies.",
    question: "Which moist, soft crystalline sweetener infused with natural molasses is in the bowl?",
    prompt: "Mouth-watering culinary photography of a white ceramic bowl filled with soft, crumbly golden-brown sugar showing its rich caramel color and texture, resting on a clean kitchen prep surface with a wooden measuring spoon. Warm side light. Zero people, zero text, zero brand logos."
  },
  'supermarket-18-5': { // Cloves
    scenario: "In the whole spice collection, aromatic dark-brown whole dried flower buds of cloves are displayed in a small glass dish.",
    question: "Which nail-shaped, pungent dried flower buds used in mulled cider and baking are shown in the dish?",
    prompt: "Macro culinary photograph of whole dried dark-brown cloves with their distinct nail-like stems and rounded bud heads, arranged in a small clear glass dish on a rustic dark wood surface. Crisp detail, warm studio lighting. Zero people, zero text, zero brand logos."
  },

  // Supermarket 19
  'supermarket-19-1': { // Toothpaste
    scenario: "On the clean bathroom vanity, a tube of fluoride toothpaste with a flip cap rests beside a bamboo toothbrush.",
    question: "Which paste or gel formulated for cleaning and protecting teeth is on the vanity?",
    prompt: "Clean modern product photography of an elegant white tube of toothpaste with a neat swirl of fresh blue-and-white striped paste on a clean wooden toothbrush, resting on a white ceramic bathroom vanity tray. Bright hygienic daylight, sparkling clean. Zero people, zero text, zero brand logos."
  },
  'supermarket-19-2': { // Razor
    scenario: "On the grooming shelf, a precision men's double-edge safety razor in chrome finish rests in a dedicated metal stand.",
    question: "Which sharp grooming tool used for facial shaving rests in the stand?",
    prompt: "High-end product photography of a gleaming chrome metal safety razor resting in an upright chrome stand on a dark granite bathroom counter beside a white shaving brush. Crisp reflections, masculine grooming aesthetic. Zero people, zero text, zero brand logos."
  },
  'supermarket-19-3': { // Sunscreen
    scenario: "On a poolside table, an unmarked white pump bottle of broad-spectrum SPF sunscreen lotion sits beside dark sunglasses.",
    question: "Which protective skin lotion formulated to block ultraviolet sun rays is on the table?",
    prompt: "Commercial product photography of a sleek white pump bottle of water-resistant sunscreen lotion resting on a warm teak wood surface next to clean dark sunglasses and a folded blue towel. Bright sunny outdoor daylight, crisp and clean. Zero people, zero text, zero brand logos."
  },
  'supermarket-19-4': { // Conditioner
    scenario: "In the shower niche, a sleek pump dispenser bottle of hydrating hair conditioner stands on clean marble tiles.",
    question: "Which nourishing hair-care product used to soften and detangle hair is in the dispenser?",
    prompt: "Spa-like product photography of an amber pump bottle of hair conditioner with a drop of rich white cream on a clean grey marble shower shelf with gentle water mist in the background. Crisp hygienic setting. Zero people, zero text, zero brand logos."
  },
  'supermarket-19-5': { // Dental Floss
    scenario: "On the bathroom shelf, a compact white plastic dispenser of waxed mint dental floss shows a clean thread ready to pull.",
    question: "Which thin, strong filament used to clean between teeth is in the dispenser?",
    prompt: "Clean product photography of a small, minimalist white pocket dispenser of dental floss with a few inches of clean white waxed thread extended through the tiny metal cutter, resting on a clean porcelain shelf. Bright hygienic light. Zero people, zero text, zero brand logos."
  },

  // Supermarket 20
  'supermarket-20-1': { // Lip Balm
    scenario: "On the bedside nightstand, a small twist-up tube of soothing beeswax lip balm rests with its cap beside it.",
    question: "Which moisturizing wax stick formulated to relieve chapped lips rests on the nightstand?",
    prompt: "Product photography of an unbranded sleek twist-up tube of natural beeswax lip balm, uncapped to reveal the smooth, rounded moisturizing wax tip, resting on a clean light oak bedside table. Soft warm morning light. Zero people, zero text, zero brand logos."
  },
  'supermarket-20-2': { // Medicine
    scenario: "Inside a well-lit medicine cabinet, an amber pharmacy bottle with a white child-resistant safety cap sits neatly on a glass shelf.",
    question: "Which pharmaceutical container holding therapeutic tablets is stored in the cabinet?",
    prompt: "Clean, hygienic still life photography of a classic amber translucent medicine bottle with a clean white safety cap, standing upright on a sparkling glass medicine cabinet shelf beside a blister pack of white tablets. Bright clean lighting. Zero people, zero legible text, zero brand logos."
  },
  'supermarket-20-3': { // Box
    scenario: "On the warehouse packing table, a sturdy corrugated cardboard box is neatly assembled with taped seams ready for shipping.",
    question: "Which sturdy, rectangular corrugated container made for packaging and storage is on the table?",
    prompt: "Commercial product photography of a clean, unmarked brown kraft corrugated cardboard box, neatly taped and sitting on a clean wooden packing workbench in a bright, modern storage space. Crisp edges, professional. Zero people, zero text, zero brand logos."
  },
  'supermarket-20-4': { // Carton
    scenario: "In the dairy cooler, a sturdy gable-top paperboard carton designed for fresh liquid beverages sits on a refrigerated shelf.",
    question: "Which gable-top paperboard container with peaked folded flaps is on the shelf?",
    prompt: "Clean product photography of an unmarked, crisp white-and-blue gable-top paperboard carton standing firmly on a clean supermarket shelf under cool LED grocery lighting. Sharp geometric lines, spotless presentation. Zero people, zero readable text, zero brand logos."
  },
  'supermarket-20-5': { // Package
    scenario: "On the mailroom reception desk, a sealed brown parcel package wrapped in kraft paper and tied with natural twine sits awaiting delivery.",
    question: "Which neatly wrapped and sealed parcel prepared for mailing rests on the desk?",
    prompt: "Warm still life photography of a neat brown kraft paper postal package parcel neatly tied with crosswise natural twine, resting on a polished dark mahogany counter beside a small vintage brass letter scale. Warm indoor light. Zero people, zero text, zero brand logos."
  }
};

// 1. Update supermarket.usage.json
smData.forEach((lesson, lIdx) => {
  lesson.usage.scenes.forEach((scene, sIdx) => {
    const key = `supermarket-${lIdx + 1}-${sIdx + 1}`;
    if (part4Map[key]) {
      scene.scenario = part4Map[key].scenario;
      scene.check.question = part4Map[key].question;
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

    if (part4Map[key]) {
      item.scenario = part4Map[key].scenario;
      item.optimizedPrompt = part4Map[key].prompt;
      updatedCount++;
    }
  }
});

fs.writeFileSync(pipelinePath, JSON.stringify(pipeline, null, 2), 'utf8');
console.log(`Successfully elevated 25 Supermarket Part 4 scenes in supermarket.usage.json and updated ${updatedCount} pipeline items.`);
