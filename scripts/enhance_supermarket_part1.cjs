const fs = require('fs');

const smPath = 'src/app/data/usage/supermarket.usage.json';
const smData = JSON.parse(fs.readFileSync(smPath, 'utf8'));

const part1Map = {
  // Supermarket 1
  'supermarket-1-1': { // Apple
    scenario: "In the supermarket fresh produce section, crisp red apples are neatly stacked in a polished wooden display crate beside bananas and oranges.",
    question: "Which crisp red fruit is stacked neatly in the wooden display crate?",
    prompt: "Appetizing still life food photography of polished, crisp bright red Honeycrisp apples neatly stacked in a rustic light-wood grocery display crate. Subtle soft morning light, glistening skins, natural and wholesome. Zero people, zero text, zero brand logos."
  },
  'supermarket-1-2': { // Grapes
    scenario: "On the chilled produce shelf, heavy clusters of frosted purple grapes rest on crushed ice beside fresh strawberries and vine tomatoes.",
    question: "Which cluster of frosted purple fruit is displayed on the chilled shelf?",
    prompt: "Macro close-up photography of a lush cluster of deep purple-red table grapes with a natural frosty bloom and fresh green stem, resting on a clean grooved wooden shelf. Tiny water droplets glisten. Zero people, zero text, zero brand logos."
  },
  'supermarket-1-3': { // Lettuce
    scenario: "Under the gentle produce misting spray, a crisp green head of iceberg lettuce sits beside fresh carrots and russet potatoes.",
    question: "Which crisp, leafy green vegetable head is refreshed under the misting spray?",
    prompt: "Vivid food photography of a whole, tightly packed head of fresh green crisphead lettuce with dewy water droplets glistening on its leaves, resting on a clean supermarket display rack. Clean cool supermarket lighting. Zero people, zero text, zero brand logos."
  },
  'supermarket-1-4': { // Onion
    scenario: "In the vegetable bins, golden yellow onions with papery dry skins are arranged in a woven wicker basket beside watermelons.",
    question: "Which pungent bulb vegetable with golden papery skin is placed in the woven basket?",
    prompt: "Clean still life photography of several whole golden-brown dry onions with flaky papery skins and dry root ends resting in a clean shallow wooden crate. Warm natural light, rustic grocery aesthetic. Zero people, zero text, zero brand logos."
  },
  'supermarket-1-5': { // Mango
    scenario: "On the tropical fruit stand, a ripe red-and-gold mango with smooth fragrant skin rests beside velvety peaches and sweet pears.",
    question: "Which tropical oval fruit with blushing red-and-gold skin is showcased on the stand?",
    prompt: "Artisanal food photography of a plump, ripe tropical mango with a smooth red-orange-yellow blush skin resting on a clean wooden market surface beside a sliced half showing golden juicy fruit. Bright daylight. Zero people, zero text, zero brand logos."
  },

  // Supermarket 2
  'supermarket-2-1': { // Plum
    scenario: "In the stone fruit basket, smooth deep-purple plums with a frosted dusting are displayed beside sweet cherries and blueberries.",
    question: "Which smooth dark purple stone fruit is nestled in the market basket?",
    prompt: "Macro photography of ripe, round deep-purple plums with velvety frosted skins resting in a clean white porcelain bowl on a sunlit counter. Rich jewel tones, appetizing and clean. Zero people, zero text, zero brand logos."
  },
  'supermarket-2-2': { // Raspberry
    scenario: "In the refrigerated berry case, a transparent container is filled with delicate ruby-red raspberries beside fresh lemons and limes.",
    question: "Which delicate, hollow ruby-red berries are packaged in the berry case?",
    prompt: "Close-up culinary photography of a small clear container filled with vibrant, fresh ruby-red raspberries showing delicate velvety drupelets. Dewy, vibrant natural light, clean grocery presentation. Zero people, zero text, zero brand logos."
  },
  'supermarket-2-3': { // Avocado
    scenario: "On the specialty produce table, a ripe pebbled green Hass avocado is sliced in half to show its creamy pale-green flesh and round central seed.",
    question: "Which rich, creamy green fruit is sliced open to reveal its large round pit?",
    prompt: "Modern food photography of a ripe Hass avocado sliced cleanly in half on a light wooden cutting board, showing creamy buttery green flesh and a smooth brown pit. Crisp focus, bright daylight. Zero people, zero text, zero brand logos."
  },
  'supermarket-2-4': { // Pomegranate
    scenario: "On the autumn fruit display, a deep crimson pomegranate is split open to reveal glistening ruby-red seed arils beside grapefruit.",
    question: "Which thick-skinned crimson fruit is split open to display glistening ruby seed arils?",
    prompt: "Stunning food photography of a ripe crimson pomegranate cracked open on a clean stone surface, with jewel-like red arils spilling naturally beside whole fruit. Soft morning light, mouth-watering. Zero people, zero text, zero brand logos."
  },
  'supermarket-2-5': { // Fig
    scenario: "On the gourmet produce platter, ripe black mission figs are gently arranged beside crisp garden vegetables.",
    question: "Which soft, teardrop-shaped purple fruit with a sweet honeyed center is arranged on the platter?",
    prompt: "Artisanal still life of fresh purple mission figs, with one cut in half showing the lush pink-amber seeded center on a clean white ceramic plate. Soft natural light, immaculate presentation. Zero people, zero text, zero brand logos."
  },

  // Supermarket 3
  'supermarket-3-1': { // Cucumber
    scenario: "In the chilled salad bar cooler, crisp dark-green English cucumbers with ribbed skins lie beside colorful bell peppers and sweet corn.",
    question: "Which long, cool dark-green salad vegetable is arranged in the chilled cooler?",
    prompt: "Crisp macro photography of long, firm dark-green cucumbers with fresh dewy skin resting on a clean wooden cutting board, with several crisp sliced rounds showing pale watery seeds. Bright natural light. Zero people, zero text, zero brand logos."
  },
  'supermarket-3-2': { // Spinach
    scenario: "In the salad greens section, crisp tender baby spinach leaves with deep emerald color are piled into a clean display bowl.",
    question: "Which tender, dark-green leafy vegetable is piled in the salad display bowl?",
    prompt: "Vibrant culinary photography of a stainless steel bowl filled with fresh, tender baby spinach leaves glistening with fine moisture mist. Deep rich green tones, spotless modern kitchen setting. Zero people, zero text, zero brand logos."
  },
  'supermarket-3-3': { // Zucchini
    scenario: "In the summer squash crate, smooth slender green zucchinis with delicate pale flecks are neatly stacked beside purple eggplants.",
    question: "Which slender, smooth dark-green summer squash is stacked in the crate?",
    prompt: "Clean still life photography of two fresh, firm dark-green zucchinis with intact green stems resting on a light wooden table. Glistening smooth skin, crisp natural lighting, spotless environment. Zero people, zero text, zero brand logos."
  },
  'supermarket-3-4': { // Green Beans
    scenario: "At the loose vegetable counter, a pile of slender, snappy green beans with pointed ends is displayed in a woven basket.",
    question: "Which slender, crisp green bean pods are displayed in the woven basket?",
    prompt: "Close-up photography of a neat bundle of fresh, snap-crisp green beans (string beans) tied with twine on a clean cutting board. Vibrant emerald color, natural daylight, wholesome grocery presentation. Zero people, zero text, zero brand logos."
  },
  'supermarket-3-5': { // Pumpkin
    scenario: "In the seasonal harvest display, a smooth round bright-orange pumpkin with a sturdy brown stem sits prominently on a wooden display platform.",
    question: "Which large, ribbed orange squash is prominently showcased on the harvest display?",
    prompt: "Rustic yet clean autumn photography of a perfect, plump round orange pumpkin with deep vertical ribs and a curved stem, resting on a clean wooden grocery deck. Warm ambient lighting, pristine. Zero people, zero text, zero brand logos."
  },

  // Supermarket 4
  'supermarket-4-1': { // Beet
    scenario: "In the root vegetable section, several round deep-ruby beets with rough skins and leafy tops are bundled together.",
    question: "Which earthy, round dark-red root vegetable is bundled with green stems?",
    prompt: "Organic food photography of fresh deep-crimson beetroot with earthy skin and vibrant red-veined leafy greens, resting on a clean butcher block. Crisp studio lighting, wholesome and fresh. Zero people, zero text, zero brand logos."
  },
  'supermarket-4-2': { // Blackberry
    scenario: "In the specialty berry refrigerator, small punnets are filled with plump, midnight-black blackberries bursting with sweet juice.",
    question: "Which plump, glossy black clustered berry is packed in the specialty punnets?",
    prompt: "Macro culinary photograph of a neat clear container overflowing with glossy, plump black blackberries with dewy surfaces. Rich dark jewel tones against a clean light background. Zero people, zero text, zero brand logos."
  },
  'supermarket-4-3': { // Papaya
    scenario: "On the tropical fruit shelf, a golden-yellow papaya is cut in half to showcase vibrant salmon-orange flesh and shiny black seeds.",
    question: "Which large tropical fruit is cut open to display its salmon-orange flesh and round black seeds?",
    prompt: "Vibrant tropical food photography of a ripe golden papaya halved lengthwise on a clean bamboo board, showing the vibrant orange scooped interior and dark seeds. Bright natural light. Zero people, zero text, zero brand logos."
  },
  'supermarket-4-4': { // Brussels Sprouts
    scenario: "In the produce bin, small compact green cabbage-like buds known as Brussels sprouts are heaped in a clean wooden bowl.",
    question: "Which miniature cabbage-like green vegetable buds are heaped in the wooden bowl?",
    prompt: "Close-up photography of a white ceramic bowl filled with clean, tightly packed miniature Brussels sprouts with delicate outer green leaves. Crisp culinary lighting, fresh and appetizing. Zero people, zero text, zero brand logos."
  },
  'supermarket-4-5': { // Artichoke
    scenario: "In the gourmet vegetable case, a large globe artichoke with tightly layered green bracts and purple tips rests on a marble slab.",
    question: "Which unique green vegetable with tightly overlapping armor-like petals is displayed on the slab?",
    prompt: "Dramatic gourmet still life of a fresh, sculptural green globe artichoke with tightly closed fleshy leaves resting on a clean grey marble countertop. Fine botanical detail, soft natural light. Zero people, zero text, zero brand logos."
  },

  // Supermarket 5
  'supermarket-5-1': { // Basil
    scenario: "In the fresh herb garden section, a potted sweet basil plant shows fragrant, rounded bright green leaves beside thyme and rosemary.",
    question: "Which fragrant culinary herb with glossy green leaves is potted in the herb section?",
    prompt: "Culinary photography of a lush potted sweet basil plant with glossy, vibrant green aromatic leaves in a clean terracotta pot on a sunlit kitchen window sill. Fresh and fragrant, crisp daylight. Zero people, zero text, zero brand logos."
  },
  'supermarket-5-2': { // Parsley
    scenario: "At the fresh greens stand, a crisp bunch of flat-leaf Italian parsley with serrated green leaves is tied with a neat band beside mint.",
    question: "Which flat-leaf green culinary herb with serrated edges is tied in a neat bunch?",
    prompt: "Vivid close-up photography of a freshly cut bunch of flat-leaf Italian parsley resting on a clean light-wood cutting board with delicate water droplets. Crisp natural light, pristine grocery setting. Zero people, zero text, zero brand logos."
  },
  'supermarket-5-3': { // Dill
    scenario: "In the specialty herbs cooler, delicate feathery green fronds of fresh dill are nestled beside chives and sage.",
    question: "Which feathery, wispy green herb commonly paired with salmon is kept in the cooler?",
    prompt: "Macro culinary photograph of fresh, feathery green dill fronds arranged neatly on a dark slate board beside a slice of fresh lemon. Crisp detail on fine wispy leaves, cool daylight. Zero people, zero text, zero brand logos."
  },
  'supermarket-5-4': { // Bay Leaf
    scenario: "In the spice aisle, whole dried aromatic olive-green bay leaves with smooth edges are displayed in a small glass spice jar.",
    question: "Which dried aromatic leaf used to season soups and stews is displayed in the spice jar?",
    prompt: "Artisanal culinary still life of dried aromatic laurel bay leaves with pale olive-green surfaces resting in a small clean glass jar on a wooden pantry shelf. Warm ambient lighting, neat and organized. Zero people, zero text, zero brand logos."
  },
  'supermarket-5-5': { // Milk
    scenario: "In the dairy cooler aisle, tall glass bottles of cold fresh milk with condensation drops stand in an illuminated refrigerated cabinet.",
    question: "Which wholesome white dairy beverage is chilling in the glass bottles?",
    prompt: "Spotless commercial food photography of a cold glass bottle of fresh whole white milk with fine condensation droplets, standing on a clean refrigerated glass shelf in a supermarket dairy cooler. Crisp bright LED lighting, pristine and appetizing. Zero people, zero text, zero brand logos."
  }
};

// 1. Update supermarket.usage.json
smData.forEach((lesson, lIdx) => {
  lesson.usage.scenes.forEach((scene, sIdx) => {
    const key = `supermarket-${lIdx + 1}-${sIdx + 1}`;
    if (part1Map[key]) {
      scene.scenario = part1Map[key].scenario;
      scene.check.question = part1Map[key].question;
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

    if (part1Map[key]) {
      item.scenario = part1Map[key].scenario;
      item.optimizedPrompt = part1Map[key].prompt;
      updatedCount++;
    }
  }
});

fs.writeFileSync(pipelinePath, JSON.stringify(pipeline, null, 2), 'utf8');
console.log(`Successfully elevated 25 Supermarket scenes in supermarket.usage.json and updated ${updatedCount} pipeline items.`);
