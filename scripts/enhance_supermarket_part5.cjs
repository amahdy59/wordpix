const fs = require('fs');

const smPath = 'src/app/data/usage/supermarket.usage.json';
const smData = JSON.parse(fs.readFileSync(smPath, 'utf8'));

const part5Map = {
  // Supermarket 21
  'supermarket-21-1': { // Tray
    scenario: "In the bakery display, a polished stainless steel baking tray holds fresh, golden morning pastries dusted with sugar.",
    question: "Which flat, shallow metal container is used to hold and display pastries?",
    prompt: "Commercial food photography of a gleaming rectangular stainless steel baking tray loaded with fresh golden croissants and pain au chocolat on parchment paper, sitting on a marble counter. Crisp natural morning light. Zero people, zero text, zero brand logos."
  },
  'supermarket-21-2': { // Dozen
    scenario: "In the dairy cooler, an open molded paperboard egg carton reveals a full set of twelve brown farm-fresh eggs.",
    question: "Which quantity word refers to the group of twelve eggs in the carton?",
    prompt: "Artisanal food photography of an open recycled paperboard egg carton showing twelve (one dozen) clean, speckled brown farm eggs resting on a rustic wooden table with soft morning sunlight. Crisp focus, wholesome. Zero people, zero text, zero brand logos."
  },
  'supermarket-21-3': { // Pull
    scenario: "At the store entrance, a man's hand pulls a metal shopping cart forward from the nested row of carts.",
    question: "Which action describes moving the shopping cart forward toward oneself?",
    prompt: "First-person close-up photography of an adult man's hand gripping the handle of a metal shopping cart and pulling it smoothly out of a nested line of carts in a grocery entrance. Clean, sharp focus. Zero female figures, only a man's hand, zero logos."
  },
  'supermarket-21-4': { // Pay
    scenario: "At the checkout register, a man's hand holds a contactless card against the illuminated chip terminal to complete payment.",
    question: "Which action describes handing over money or using a card to settle the grocery bill?",
    prompt: "Macro close-up photography of an adult man's hand tapping a dark payment card on the top of a modern black contactless payment terminal on a clean checkout desk. Crisp focus, blue LED light indicator. Zero female figures, only a man's hand, zero bank logos."
  },
  'supermarket-21-5': { // Choose
    scenario: "In front of the apple bin, a man's hand reaches out to select a crisp, ripe Honeycrisp apple from the display.",
    question: "Which action describes deciding on and selecting a specific fruit from several options?",
    prompt: "Close-up photography of an adult man's hand carefully picking up a single perfect, polished red apple from a wooden crate filled with fresh apples. Bright natural market daylight. Zero female figures, only a man's hand, zero text, zero brand logos."
  },

  // Supermarket 22
  'supermarket-22-1': { // Carry
    scenario: "Leaving the checkout counter, a man's hands carry a sturdy brown paper bag filled with fresh groceries and baguettes.",
    question: "Which action describes holding and supporting the weight of grocery bags while walking?",
    prompt: "Documentary photography of an adult man's arms holding a heavy brown kraft grocery bag filled with fresh greens and a loaf of bread, walking across a sunlit grocery parking area. Modest male attire. Zero female figures, zero text, zero brand logos."
  },
  'supermarket-22-2': { // Load
    scenario: "In the parking lot, a man's hands load bagged groceries from a shopping cart into the clean trunk of a car.",
    question: "Which action describes placing grocery bags into the vehicle trunk?",
    prompt: "Clean lifestyle photography focusing on an adult man's hands placing neat paper grocery bags into the clean, open trunk of a car on a bright sunny afternoon. Crisp daylight, dignified adult setting. Zero female figures, zero license plates, zero logos."
  },
  'supermarket-22-3': { // Bagger
    scenario: "At the end of the checkout register, a male grocery store bagger in a neat staff apron packs canned goods into paper bags.",
    question: "Which grocery worker is responsible for packing purchased items into bags?",
    prompt: "Realistic documentary photography of an adult male supermarket employee wearing a clean green store apron and name badge, carefully placing cereal boxes into paper grocery bags at a checkout lane. Bright store lighting, professional male worker. Zero female figures, zero legible text, zero logos."
  },
  'supermarket-22-4': { // Baker
    scenario: "In the artisan bakery kitchen, an adult male baker wearing a white hat and apron inspects freshly baked loaves of sourdough bread.",
    question: "Which culinary professional bakes fresh bread and pastries for the store?",
    prompt: "Authentic documentary photography of a 35-year-old adult male baker dusted with flour, wearing a clean white baker's apron and cap, sliding a wooden peel holding crusty golden sourdough loaves from a stone deck oven. Warm golden glow, professional male artisan. Zero female figures, zero text, zero logos."
  },
  'supermarket-22-5': { // Security Guard
    scenario: "Near the supermarket exit doors, a professional adult male security guard in a dark uniform stands watch to protect store safety.",
    question: "Which uniformed staff member ensures security and loss prevention in the supermarket?",
    prompt: "Professional documentary photography of an adult male security guard in a neat navy-blue uniform with shoulder epaulets and a security badge, standing attentively near a modern supermarket glass entrance. Confident, dignified male professional. Zero female figures, zero text, zero logos."
  },

  // Supermarket 23
  'supermarket-23-1': { // A Gallon Of
    scenario: "In the dairy cooler, a large translucent plastic jug containing a full gallon of fresh whole milk sits on the bottom rack.",
    question: "Which large liquid volume measurement describes the full milk jug?",
    prompt: "Commercial product photography of a classic translucent plastic one-gallon milk jug with an ergonomic handle and blue cap, filled with cold white milk on a chilled supermarket shelf with fine condensation. Crisp LED lighting. Zero people, zero text, zero brand logos."
  },
  'supermarket-23-2': { // A Loaf Of
    scenario: "On the bakery counter, an uncut whole loaf of crusty French artisan bread rests on a wooden cutting board beside a bread knife.",
    question: "Which unit word describes a whole shaped and baked piece of bread?",
    prompt: "Artisanal food photography of a whole, oblong loaf of crusty golden-brown sourdough bread dusted with white flour, resting on a rustic wooden cutting board with a serrated bread knife. Warm morning light. Zero people, zero text, zero brand logos."
  },
  'supermarket-23-3': { // A Piece Of
    scenario: "On a porcelain dessert plate, a single triangular piece of gourmet strawberry tart is served with a delicate silver fork.",
    question: "Which portion word describes a single sliced portion of the tart?",
    prompt: "Gourmet pastry photography of an individual sliced triangular piece of glazed strawberry custard tart resting on a clean white porcelain dessert plate with a small silver pastry fork on a marble table. Immaculate presentation. Zero people, zero text, zero brand logos."
  },
  'supermarket-23-4': { // A Pint Of
    scenario: "In the frozen dessert freezer, a compact cardboard pint tub of rich artisan vanilla ice cream rests among frozen treats.",
    question: "Which traditional small container size containing sixteen ounces of ice cream is shown?",
    prompt: "Product photography of an unbranded, elegant white-and-gold cylindrical paperboard pint tub of artisan ice cream, sitting on a chilled slate surface with a scoop of creamy vanilla ice cream beside it. Cool soft lighting. Zero people, zero text, zero brand logos."
  },
  'supermarket-23-5': { // Gluten-Free
    scenario: "In the specialty health foods section, a dedicated shelf of certified gluten-free baked oat loaves displays clean wheat-free labels.",
    question: "Which dietary label indicates foods made without wheat gluten for sensitive eaters?",
    prompt: "Clean still life photography of an artisan oat-and-seed bread loaf resting beside a small ceramic dish of rolled gluten-free oats, with an unbranded clean green leaf symbol card on a light wood grocery shelf. Crisp daylight, wholesome. Zero people, zero readable text, zero brand logos."
  },

  // Supermarket 24
  'supermarket-24-1': { // Fresh
    scenario: "Under the automated vegetable mister, crisp heads of emerald-green romaine lettuce glisten with cool dewy water droplets.",
    question: "Which quality word describes crisp, newly harvested produce that is not canned or frozen?",
    prompt: "Macro culinary photography of freshly harvested, crisp emerald-green romaine lettuce leaves glistening with fine cool water mist in a grocery display rack. Vibrant natural color, invigorating and wholesome. Zero people, zero text, zero brand logos."
  },
  'supermarket-24-2': { // Buy 1 Get 1 Free
    scenario: "Along the grocery aisle shelf, two identical jars of pasta sauce stand side by side beneath a promotional twin-pack deal tag.",
    question: "Which promotional shopping deal offers a second identical product at no additional charge?",
    prompt: "Retail product photography of two identical, unbranded clear glass jars of rich red tomato pasta sauce sitting side by side on a clean supermarket shelf beneath a bright yellow promotional price tag. Clean store lighting. Zero people, zero readable text, zero brand logos."
  },
  'supermarket-24-3': { // Non-GMO
    scenario: "On the organic breakfast shelf, a package of non-GMO certified stone-ground oats displays natural whole-grain wholesome quality.",
    question: "Which agricultural term certifies that food is produced without genetic engineering?",
    prompt: "Artisanal food photography of a simple unbranded brown kraft paper bag of whole rolled oats with a small clean green circular butterfly-and-leaf emblem card beside it on a sunlit kitchen table. Warm natural light, wholesome. Zero people, zero legible text, zero brand logos."
  },
  'supermarket-24-4': { // Where can I find...?
    scenario: "In the grocery store center aisle, an adult male shopper consults a male store associate standing beside aisle signage.",
    question: "Which common customer inquiry phrase asks store staff for the location of an item?",
    prompt: "Documentary photography of an adult male customer in a casual polo shirt speaking politely with an adult male store clerk in a staff vest in a brightly lit, clean supermarket aisle. Helpful, professional male interaction. Zero female figures, zero text, zero brand logos."
  },
  'supermarket-24-5': { // Cash or card?
    scenario: "At the supermarket checkout counter, a payment terminal displays prompt options for payment by paper bills or bank card.",
    question: "Which standard cashier question asks the customer which payment method they wish to use?",
    prompt: "Clean retail photography of a modern point-of-sale register area with a credit card terminal on the counter next to a clean cash drawer with coin slots. Spotless counter, bright daylight. Zero people, zero legible text, zero brand logos."
  },

  // Supermarket 25
  'supermarket-25-1': { // I need a refund
    scenario: "At the supermarket customer service counter, an adult male customer presents a receipt to the male service manager for a return.",
    question: "Which phrase is used by a customer requesting their money back for a returned product?",
    prompt: "Professional documentary photography of an adult male customer speaking politely with an adult male customer service supervisor across a clean store service desk, with a folded paper receipt on the counter. Dignified male interaction. Zero female figures, zero text, zero brand logos."
  },
  'supermarket-25-2': { // Can I taste this?
    scenario: "At the specialty gourmet cheese counter, an adult male customer asks for a small sample from the male cheesemonger.",
    question: "Which polite question is asked when requesting a small food sample before buying?",
    prompt: "Culinary market photography of an adult male cheesemonger in an apron holding a thin slice of aged yellow cheese on a small sheet of wax paper over a glass counter toward a male customer's hand. Warm appetizing market light. Zero female figures, only adult men, zero text, zero brand logos."
  },
  'supermarket-25-3': { // Cart
    scenario: "Near the grocery store entrance, a gleaming silver metal shopping cart with smooth caster wheels stands ready for use.",
    question: "Which wheeled carrier is pushed by customers to hold their grocery selections?",
    prompt: "Commercial eye-level photography of a modern, clean four-wheeled stainless steel shopping cart standing in a bright grocery store lobby with polished reflective tiles. Sharp focus, sparkling clean. Zero people, zero text, zero brand logos."
  }
};

// 1. Update supermarket.usage.json
smData.forEach((lesson, lIdx) => {
  lesson.usage.scenes.forEach((scene, sIdx) => {
    const key = `supermarket-${lIdx + 1}-${sIdx + 1}`;
    if (part5Map[key]) {
      scene.scenario = part5Map[key].scenario;
      scene.check.question = part5Map[key].question;
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

    if (part5Map[key]) {
      item.scenario = part5Map[key].scenario;
      item.optimizedPrompt = part5Map[key].prompt;
      updatedCount++;
    }
  }
});

fs.writeFileSync(pipelinePath, JSON.stringify(pipeline, null, 2), 'utf8');
console.log(`Successfully elevated 23 Supermarket Part 5 scenes in supermarket.usage.json and updated ${updatedCount} pipeline items.`);
