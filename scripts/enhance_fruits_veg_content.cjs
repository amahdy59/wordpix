const fs = require('fs');

const fruitsPath = 'src/app/data/usage/fruits.usage.json';
const vegPath = 'src/app/data/usage/vegetables.usage.json';

const fruitsData = JSON.parse(fs.readFileSync(fruitsPath, 'utf8'));
const vegData = JSON.parse(fs.readFileSync(vegPath, 'utf8'));

// Fruits improvements for the 11 pending scenes
const fruitsMap = {
  'fruits-1-2': { // Watermelon
    scenario: "At the morning fruit stand, a customer selects a crisp, freshly sliced ripe watermelon displaying vibrant red flesh and dark seeds.",
    question: "Which large, refreshing sweet melon does the customer choose?",
    prompt: "Appetizing close-up photography of a freshly sliced wedge of ripe red watermelon resting on a clean light wooden cutting board. Glistening sweet droplets on the ruby-red flesh, natural black seeds, clean green rind. Bright sunny morning natural lighting, crisp and mouth-watering. Zero people, zero text, zero brand logos."
  },
  'fruits-1-4': { // Pear
    scenario: "Arranged on a porcelain fruit platter, a ripe golden Bosc pear rests beside green apples and sweet plums.",
    question: "Which teardrop-shaped sweet fruit is arranged on the platter?",
    prompt: "Still life photography of a ripe, speckled golden-brown Bosc pear with a delicate wooden stem, sitting elegantly on a clean white ceramic platter beside an apple. Soft natural kitchen daylight, immaculate and appetizing. Zero people, zero text, zero brand logos."
  },
  'fruits-1-5': { // Blackberry
    scenario: "In the fresh berry section, small wooden punnets display plump, glossy ripe blackberries bursting with deep purple juice.",
    question: "Which dark, glossy clustered berries are displayed in the wooden punnets?",
    prompt: "Macro close-up photography of a small rustic wooden basket filled with plump, glossy, deep purple-black ripe blackberries. Individual drupelets glisten with fresh dew. Spotless market stand setting, vibrant natural light. Zero people, zero text, zero brand logos."
  },
  'fruits-2-1': { // Boysenberry
    scenario: "At the specialty farm shop, a basket of ripe boysenberries shows their distinct reddish-purple hue and juicy texture.",
    question: "Which large reddish-purple hybrid berry is featured at the farm shop?",
    prompt: "Close-up culinary photography of fresh ripe boysenberries in a clean ceramic bowl. Deep maroon-purple color, velvety texture, glistening fresh. Bright daylight in a clean farmhouse kitchen. Zero people, zero text, zero brand logos."
  },
  'fruits-2-2': { // Papaya
    scenario: "On the tropical fruit counter, a ripe papaya is cut in half lengthwise, revealing its bright orange flesh and round black seeds.",
    question: "Which tropical fruit is sliced in half to show vibrant orange flesh and black seeds?",
    prompt: "Vibrant documentary food photography of a ripe tropical papaya sliced in half lengthwise on a clean bamboo cutting board, showing vivid bright orange flesh and shiny black round seeds. Natural daylight, clean tropical fruit presentation. Zero people, zero text, zero brand logos."
  },
  'fruits-2-3': { // Coconut
    scenario: "At the island produce market, a whole brown fibrous coconut rests beside a cracked half showing pure white meat and clear water.",
    question: "Which hard-shelled tropical nut is cracked open to reveal fresh white meat?",
    prompt: "A rustic yet clean tropical still life of a whole brown coconut beside a cleanly cracked coconut half, showing thick pure white coconut meat inside. Set on a clean wooden table with bright diffused sunlight. Zero people, zero text, zero brand logos."
  },
  'fruits-2-4': { // Lychee
    scenario: "Displayed on crushed ice, a cluster of fresh lychees shows their bumpy reddish-pink peel and one fruit peeled to show translucent sweet flesh.",
    question: "Which fragrant Asian fruit has a textured reddish peel and translucent white flesh?",
    prompt: "Detailed close-up photograph of a cluster of fresh lychees with rough pinkish-red shells, with one lychee partially peeled to reveal the juicy, translucent white grape-like fruit inside. Clean kitchen setting with bright morning light. Zero people, zero text, zero brand logos."
  },
  'fruits-2-5': { // Jackfruit
    scenario: "At the exotic fruit market, a massive spiky green jackfruit is displayed with a large yellow pod sliced open for shoppers.",
    question: "Which enormous spiky tropical fruit contains rich, sweet golden-yellow pods?",
    prompt: "Impressive photography of a large textured green jackfruit resting on a clean market wooden table, with a section cut open revealing sweet golden-yellow fleshy bulbs inside. Clean, appetizing market lighting. Zero people, zero text, zero brand logos."
  },
  'fruits-3-2': { // Clementine
    scenario: "In a fruit bowl on the breakfast table, small sweet clementines are piled together, with one easy-to-peel fruit half unpeeled.",
    question: "Which small, easy-to-peel sweet citrus fruit is partially unpeeled in the bowl?",
    prompt: "Bright morning breakfast scene featuring a white ceramic bowl filled with vibrant orange clementines, with one clementine partially peeled showing juicy segments on a clean wooden table. Sparkling natural daylight, fresh and fragrant. Zero people, zero text, zero brand logos."
  },
  'fruits-3-4': { // Yuzu
    scenario: "In the Japanese culinary market, aromatic yellow yuzu citrus fruits with bumpy fragrant rinds are arranged in a cedar box.",
    question: "Which highly aromatic Japanese citrus fruit has a textured yellow rind?",
    prompt: "Minimalist food photography of fresh yellow yuzu citrus fruits with aromatic, bumpy textured rinds arranged neatly in a light cedar wooden box. Soft natural diffused lighting, elegant culinary presentation. Zero people, zero text, zero brand logos."
  },
  'fruits-4-1': { // Fig
    scenario: "On a gourmet cheese board, ripe purple mission figs are quartered to reveal their sweet, jammy ruby-pink interior.",
    question: "Which sweet Mediterranean fruit is sliced open to display its honeyed ruby interior?",
    prompt: "Artisanal food photography of ripe dark purple mission figs, with two figs sliced open into quarters showing the rich ruby-pink seeded center on a clean slate board. Soft warm daylight, elegant and appetizing. Zero people, zero text, zero brand logos."
  }
};

// Vegetables improvements for the 12 pending scenes
const vegMap = {
  'vegetables-1-3': { // Parsnip
    scenario: "At the organic vegetable market, a bunch of cream-colored parsnips with tapered root ends is bundled with garden twine.",
    question: "Which pale, cream-colored root vegetable is bundled with twine?",
    prompt: "A bundle of fresh, unblemished cream-colored parsnip roots tied with natural twine resting on a clean wooden farm-table. Crisp natural morning light, rustic clean organic produce aesthetic. Zero people, zero text, zero brand logos."
  },
  'vegetables-1-4': { // Rutabaga
    scenario: "In the root vegetable basket, a solid round rutabaga displays its characteristic yellow-brown skin and purple-tinged top.",
    question: "Which dense, round root vegetable has yellow flesh and a purple crown?",
    prompt: "Close-up photograph of a fresh, sturdy round rutabaga root with purple-tinted shoulders and golden-tan skin on a clean stone countertop. Crisp studio daylight, clean and wholesome. Zero people, zero text, zero brand logos."
  },
  'vegetables-1-5': { // Kale
    scenario: "Arranged in the leafy greens crate, a vibrant bunch of curly green kale displays crinkled, nutrient-dense leaves.",
    question: "Which hardy dark green vegetable has tightly crinkled, ruffled leaves?",
    prompt: "Vivid close-up photography of a fresh, crisp bunch of curly dark green kale with delicate water droplets on the ruffled leaves, standing in a clean wooden market crate. Bright natural market lighting. Zero people, zero text, zero brand logos."
  },
  'vegetables-2-1': { // Chard
    scenario: "In the organic farm box, a bunch of Swiss chard displays crisp dark green leaves supported by bright ruby and golden stalks.",
    question: "Which leafy green vegetable features vibrant colorful red and yellow stems?",
    prompt: "A fresh bundle of rainbow Swiss chard with vibrant red, yellow, and white stems and lush green leaves resting on a clean butcher-block counter. Bright daylight highlighting the vivid stalk colors. Zero people, zero text, zero brand logos."
  },
  'vegetables-2-2': { // Watercress
    scenario: "Prepared for a fresh salad, delicate sprigs of crisp peppery watercress with small round leaves are rinsed in a stainless colander.",
    question: "Which peppery aquatic salad green has tiny round leaves and tender stems?",
    prompt: "Crisp sprigs of fresh green watercress glistening with cool water droplets inside a polished stainless steel colander on a clean white kitchen counter. Fresh, appetizing, hygienic culinary setting. Zero people, zero text, zero brand logos."
  },
  'vegetables-2-4': { // Rapini
    scenario: "At the Italian grocer, a bundle of fresh rapini displays slender green stems topped with tender leaves and small broccoli-like florets.",
    question: "Which bitter green vegetable has tender leafy stems and tiny florets?",
    prompt: "Fresh bundle of leafy green rapini (broccoli rabe) with small tender broccoli-like florets and crisp stalks tied with twine on a clean marble surface. Bright natural kitchen lighting. Zero people, zero text, zero brand logos."
  },
  'vegetables-2-5': { // Savoy Cabbage
    scenario: "On the vegetable market table, a round head of Savoy cabbage features intricate, deeply crinkled and textured emerald leaves.",
    question: "Which cabbage variety is recognized by its crinkled, textured ruffled leaves?",
    prompt: "A fresh, perfect whole head of Savoy cabbage with deeply crinkled, textured emerald-green outer leaves resting on a clean wooden table. Crisp natural light highlighting the intricate leaf texture. Zero people, zero text, zero brand logos."
  },
  'vegetables-3-3': { // Gourd
    scenario: "On the autumn harvest stand, an ornamental curved hard-shelled gourd displays colorful striped and bumpy skin.",
    question: "Which decorative hard-shelled autumn vegetable has a unique curved shape?",
    prompt: "A beautifully curved, clean decorative harvest gourd with striped green and yellow patterns resting on a rustic wooden windowsill in warm autumn sunlight. Crisp clean still life photography. Zero people, zero text, zero brand logos."
  },
  'vegetables-3-5': { // Chili Pepper
    scenario: "On the spice counter, several glossy bright red chili peppers with green stems lie beside a wooden cutting board.",
    question: "Which slender, pungent red pepper is used to add heat to cooking?",
    prompt: "Vibrant close-up photography of fresh glossy bright red chili peppers with crisp green stems resting on a clean dark slate cutting board. Glistening smooth skins, sharp colorful contrast in natural light. Zero people, zero text, zero brand logos."
  },
  'vegetables-4-2': { // Cayenne
    scenario: "In the fresh pepper basket, slender elongated red cayenne peppers are harvested for drying and seasoning.",
    question: "Which long, slender fiery red pepper is harvested for pungent seasoning?",
    prompt: "Close-up photograph of slender, vibrant red cayenne peppers resting in a clean woven basket on a sunlit wooden counter. Crisp detail on the tapered pods, bright clean culinary atmosphere. Zero people, zero text, zero brand logos."
  },
  'vegetables-4-4': { // Scallion
    scenario: "On the prep board, a fresh bunch of green scallions features crisp white root ends transitioning into long, hollow green stalks.",
    question: "Which slender green spring onion has white bulbous bases and long green tops?",
    prompt: "A neat bundle of fresh, crisp green scallions (spring onions) with clean white roots and slender hollow emerald stalks resting on a light wooden cutting board. Fresh culinary daylight, hygienic kitchen. Zero people, zero text, zero brand logos."
  },
  'vegetables-4-5': { // Celery
    scenario: "Beside the salad bowl, a fresh head of celery stands upright with crisp, ribbed pale-green stalks and leafy tops.",
    question: "Which crunchy, ribbed pale-green vegetable stalk is commonly chopped for soups and salads?",
    prompt: "A crisp, fresh head of pale-green celery with ribbed crunchy stalks and leafy tops resting beside a chef's knife on a clean white kitchen island. Natural morning light, spotless culinary environment. Zero people, zero text, zero brand logos."
  }
};

// Update fruits usage data
fruitsData.forEach((lesson, lIdx) => {
  lesson.usage.scenes.forEach((scene, sIdx) => {
    const key = `fruits-${lIdx + 1}-${sIdx + 1}`;
    if (fruitsMap[key]) {
      scene.scenario = fruitsMap[key].scenario;
      scene.check.question = fruitsMap[key].question;
    }
  });
});
fs.writeFileSync(fruitsPath, JSON.stringify(fruitsData, null, 2), 'utf8');

// Update veg usage data
vegData.forEach((lesson, lIdx) => {
  lesson.usage.scenes.forEach((scene, sIdx) => {
    const key = `vegetables-${lIdx + 1}-${sIdx + 1}`;
    if (vegMap[key]) {
      scene.scenario = vegMap[key].scenario;
      scene.check.question = vegMap[key].question;
    }
  });
});
fs.writeFileSync(vegPath, JSON.stringify(vegData, null, 2), 'utf8');

// Also update pipeline items
const pipelinePath = 'output/illustrations/generation_batches_pipeline.json';
const pipeline = JSON.parse(fs.readFileSync(pipelinePath, 'utf8'));
const b4 = pipeline.batches[4];

let updatedCount = 0;
b4.items.forEach(item => {
  const parts = item.sceneId.split('-usage-scene-');
  const lKey = parts[0].split('-').slice(-1)[0];
  const sKey = parts[1];
  const key = `${parts[0].replace(/-\d+$/, '')}-${lKey}-${sKey}`;

  if (fruitsMap[key]) {
    item.scenario = fruitsMap[key].scenario;
    item.optimizedPrompt = fruitsMap[key].prompt;
    updatedCount++;
  } else if (vegMap[key]) {
    item.scenario = vegMap[key].scenario;
    item.optimizedPrompt = vegMap[key].prompt;
    updatedCount++;
  }
});

fs.writeFileSync(pipelinePath, JSON.stringify(pipeline, null, 2), 'utf8');
console.log(`Successfully updated fruits.usage.json, vegetables.usage.json, and ${updatedCount} pipeline items with refined scenarios, questions, and appetizing prompts.`);
