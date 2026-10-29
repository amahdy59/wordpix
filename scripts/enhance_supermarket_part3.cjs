const fs = require('fs');

const smPath = 'src/app/data/usage/supermarket.usage.json';
const smData = JSON.parse(fs.readFileSync(smPath, 'utf8'));

const part3Map = {
  // Supermarket 11
  'supermarket-11-1': { // Receipt
    scenario: "On the polished checkout counter next to paper grocery bags, a neatly printed white paper receipt displays itemized lines.",
    question: "Which printed paper proof of purchase is placed on the checkout counter?",
    prompt: "Close-up macro photography of a clean, printed white paper receipt resting neatly beside a brown kraft grocery bag on a polished dark stone checkout counter. Crisp focus, clean lines. Zero people, zero legible text, zero brand logos."
  },
  'supermarket-11-2': { // Scale
    scenario: "At the supermarket produce weighing station, a digital scale with a brushed stainless steel tray displays weight numbers for fresh fruits.",
    question: "Which digital weighing device with a stainless steel tray is used to weigh produce?",
    prompt: "Product photography of a sleek modern digital supermarket produce scale with a brushed stainless steel tray holding three crisp green apples. Bright supermarket daylight, spotless and clean. Zero people, zero readable text, zero brand logos."
  },
  'supermarket-11-3': { // Self-Checkout
    scenario: "In the front checkout plaza, a modern self-checkout station with an illuminated touch screen and flat item scanner stands ready for shoppers.",
    question: "Which automated payment kiosk with a touch screen allows customers to scan and pay for their own groceries?",
    prompt: "Clean architectural interior photography of a modern, sleek supermarket self-checkout kiosk station with a glowing blank digital interface screen and barcode scanner bed. Spotless tiled floor, bright grocery lights. Zero people, zero readable text, zero brand logos."
  },
  'supermarket-11-4': { // Deli Counter
    scenario: "Behind the curved glass deli counter, gourmet roasted meats and wheels of aged artisan cheeses are neatly displayed on chilled trays.",
    question: "Which specialized grocery service counter displays sliced meats and gourmet cheeses?",
    prompt: "Commercial food photography looking through the sparkling curved glass of a supermarket deli counter displaying neat rows of roast turkey, pastrami, and artisan cheese wheels on stainless steel platters. Sparkling clean, gourmet lighting. Zero people, zero text, zero brand logos."
  },
  'supermarket-11-5': { // Sale Sign
    scenario: "Hanging neatly below a shelf of pantry staples, a bright promotional sale tag highlights a special weekly discount.",
    question: "Which promotional tag attached to a store shelf indicates a special price reduction?",
    prompt: "Eye-level retail photography of a clean grocery shelf stocked with organized olive oil bottles, featuring a neat colorful promotional shelf tag (sale sign) clipped to the shelf edge. Crisp store lighting, spotless and organized. Zero people, zero legible text, zero brand logos."
  },

  // Supermarket 12
  'supermarket-12-1': { // Detergent
    scenario: "In the laundry care aisle, a large, sturdy bottle of concentrated liquid laundry detergent with a measuring cap stands on a clean shelf.",
    question: "Which liquid cleaning agent used for washing clothes is displayed on the shelf?",
    prompt: "Clean commercial product photography of an elegant, unmarked blue plastic jug of liquid laundry detergent with a clear measuring cap, resting on a clean white laundry room shelf. Bright fresh daylight, immaculate setting. Zero people, zero text, zero brand logos."
  },
  'supermarket-12-2': { // Trash Bag
    scenario: "On the household supplies rack, a roll of heavy-duty black trash bags with sturdy drawstring closures rests in a clean utility cabinet.",
    question: "Which durable plastic liner used to collect household waste is shown in the cabinet?",
    prompt: "Product photography of a neat roll of thick, durable black plastic trash bags with visible red drawstrings resting on a clean white utility shelf beside folded microfiber cloths. Crisp studio lighting, clean and organized. Zero people, zero text, zero brand logos."
  },
  'supermarket-12-3': { // Broom
    scenario: "In the home cleaning section, a modern sweeping broom with dense, angled bristles and a long aluminum handle stands beside a dustpan.",
    question: "Which long-handled cleaning tool with stiff bristles is used to sweep floors?",
    prompt: "Still life photography of a sleek modern broom with clean grey-and-teal angled bristles and an aluminum handle leaning gracefully against a clean white wall on a polished tiled floor. Bright minimalist setting. Zero people, zero text, zero brand logos."
  },
  'supermarket-12-4': { // Dish Soap
    scenario: "Beside the gleaming stainless steel kitchen sink, a clear bottle of citrus-scented liquid dish soap rests next to a clean sponge.",
    question: "Which liquid soap formulated for hand-washing dirty dishes sits beside the sink?",
    prompt: "Bright culinary photography of a clear glass pump bottle filled with sparkling golden-yellow liquid dish soap resting on the edge of a spotless stainless steel sink beside a neat natural sponge. Sparkling water drops, fresh daylight. Zero people, zero text, zero brand logos."
  },
  'supermarket-12-5': { // Aluminum Foil
    scenario: "On the kitchen baking counter, a roll of shiny silver aluminum foil is unrolled slightly to reveal its reflective metallic surface.",
    question: "Which thin, shiny metallic foil used for wrapping food and baking is unrolled on the counter?",
    prompt: "Clean kitchen photography of a roll of gleaming, reflective silver aluminum foil resting on a dark slate countertop, with a neat sheet unrolled showing its smooth metallic surface. Crisp focus, clean studio light. Zero people, zero text, zero brand logos."
  },

  // Supermarket 13
  'supermarket-13-1': { // Dustpan
    scenario: "In the household utility closet, a flat plastic dustpan with a thin rubber lip rests on the clean floor ready to collect swept dirt.",
    question: "Which flat, handheld pan with a rubber edge is used to catch sweepings?",
    prompt: "Still life product photography of a modern ergonomic grey dustpan with a flexible green rubber lip resting on a clean hardwood floor beside a small hand brush. Spotless minimalist home setting, natural daylight. Zero people, zero text, zero brand logos."
  },
  'supermarket-13-2': { // Bucket
    scenario: "On the clean tiled utility room floor, a sturdy plastic cleaning bucket with a stainless steel bail handle holds clean soapy water.",
    question: "Which deep, round container with a carry handle is used to hold wash water?",
    prompt: "Commercial product photography of a clean, sturdy navy-blue plastic mop bucket with a polished metal carrying handle, resting on a gleaming white tiled floor. Fresh, sparkling reflections in bright daylight. Zero people, zero text, zero brand logos."
  },
  'supermarket-13-3': { // Coffee
    scenario: "On the café table, a porcelain cup of steaming dark espresso coffee sits on a saucer with a few roasted aromatic coffee beans.",
    question: "Which hot, aromatic brewed beverage made from roasted dark beans is served in the cup?",
    prompt: "Appetizing culinary photography of a classic white porcelain cup filled with rich, steaming dark coffee with a delicate crema layer, sitting on a matching saucer with whole roasted coffee beans scattered on a rustic wooden table. Soft morning light. Zero people, zero text, zero brand logos."
  },
  'supermarket-13-4': { // Energy Drink
    scenario: "In the chilled drink cooler, a sleek metallic can of cold carbonated energy drink stands frosted with fine condensation droplets.",
    question: "Which carbonated beverage formulated for mental and physical alertness is chilled in the can?",
    prompt: "Dynamic commercial beverage photography of a sleek, unbranded brushed-aluminum slim beverage can glistening with icy cold condensation droplets, resting on a dark reflective surface with a cool blue ambient backlight. Crisp focus, thirst-quenching. Zero people, zero text, zero brand logos."
  },
  'supermarket-13-5': { // Sparkling Water
    scenario: "On a sunlit patio table, a clear glass of sparkling water with effervescent bubbles rising to the surface is garnished with a fresh lime wheel.",
    question: "Which crisp, carbonated water with fizzy bubbles is poured in the glass?",
    prompt: "Refreshing beverage photography of a tall, clear glass of effervescent sparkling water filled with crystalline ice cubes and rising bubbles, garnished with a crisp green lime wheel on a clean glass tabletop. Bright sunny day, crystal clear. Zero people, zero text, zero brand logos."
  },

  // Supermarket 14
  'supermarket-14-1': { // Orange Juice
    scenario: "On the breakfast counter, a tall glass of freshly squeezed, pulp-rich orange juice sits beside sliced citrus halves.",
    question: "Which vibrant citrus fruit juice is poured into the breakfast glass?",
    prompt: "Mouth-watering breakfast photography of a tall glass of freshly squeezed bright orange juice with ice cubes and visible pulp, sitting on a light wooden table beside two juicy orange halves. Glistening morning light, invigorating and fresh. Zero people, zero text, zero brand logos."
  },
  'supermarket-14-2': { // Smoothie
    scenario: "In a tall glass tumbler, a thick, creamy berry smoothie blended with strawberries and yogurt is garnished with fresh mint.",
    question: "Which thick, blended fruit-and-yogurt beverage is served in the tumbler?",
    prompt: "Appetizing culinary photography of a tall glass filled with a creamy, rich berry-red smoothie, garnished with a fresh strawberry on the rim and a mint sprig, resting on a white marble counter with a bamboo straw. Soft natural daylight, healthy and fresh. Zero people, zero text, zero brand logos."
  },
  'supermarket-14-3': { // Ginger Ale
    scenario: "In a chilled glass with ice cubes, effervescent golden ginger ale sparkles with fine bubbles beside a slice of fresh ginger root.",
    question: "Which sweet, bubbly carbonated soft drink flavored with ginger is poured over ice?",
    prompt: "Crisp commercial photography of a tumbler of effervescent golden-amber ginger ale over clear ice cubes with bubbles rising, beside a piece of fresh sliced ginger on a clean slate surface. Refreshing and sparkling, bright studio light. Zero people, zero text, zero brand logos."
  },
  'supermarket-14-4': { // Chips
    scenario: "In a ceramic snack bowl, crisp, golden-fried potato chips with rippled edges are piled high for a savory snack.",
    question: "Which crisp, thinly sliced golden potato snack is piled in the ceramic bowl?",
    prompt: "Appetizing food photography of a shallow ceramic bowl overflowing with crunchy, golden-brown salted potato chips with wavy ridges, resting on a clean wooden table. Crisp texture, warm inviting daylight. Zero people, zero text, zero brand logos."
  },
  'supermarket-14-5': { // Candy
    scenario: "In a glass candy jar, an assortment of colorful glossy fruit-flavored candies catches the bright light on a dessert table.",
    question: "Which sweet, colorful confectionary treats are displayed in the glass jar?",
    prompt: "Vibrant close-up photography of a clean glass jar filled with glossy, gem-like colorful fruit hard candies in rich jewel tones (ruby, amber, emerald) on a white marble tabletop. Sparkling reflections, cheerful and appetizing. Zero people, zero text, zero brand logos."
  },

  // Supermarket 15
  'supermarket-15-1': { // Nuts
    scenario: "On the pantry counter, a rustic wooden bowl is filled with a wholesome mixture of roasted almonds, walnuts, and cashews.",
    question: "Which assortment of wholesome roasted tree nuts is served in the wooden bowl?",
    prompt: "Gourmet culinary photography of a shallow wooden bowl filled with a healthy mix of roasted almonds, shelled walnuts, pecans, and creamy cashews on a clean dark slate table. Warm natural lighting, wholesome and rich. Zero people, zero text, zero brand logos."
  },
  'supermarket-15-2': { // Pretzels
    scenario: "In a clean snack basket, golden-brown baked knotted pretzels sprinkled with coarse white salt crystals are piled neatly.",
    question: "Which knotted, baked savory snack with coarse salt crystals is piled in the basket?",
    prompt: "Artisanal food photography of traditional knotted golden-brown baked pretzels with coarse sea salt crystals resting in a linen-lined basket on a rustic wooden table. Warm bakery light, crisp focus. Zero people, zero text, zero brand logos."
  },
  'supermarket-15-3': { // Trail Mix
    scenario: "In a clear glass bowl, energy-rich trail mix combines roasted nuts, dark raisins, and dried cranberries for hiking snacks.",
    question: "Which nutritious mix of dried fruits and roasted nuts is served in the bowl?",
    prompt: "Wholesome food photography of a small clear bowl filled with gourmet trail mix combining whole almonds, golden raisins, dried cranberries, and pumpkin seeds on a light pine table. Crisp natural light, healthy snack aesthetic. Zero people, zero text, zero brand logos."
  },
  'supermarket-15-4': { // Lollipop
    scenario: "In a small ceramic cup on the checkout counter, a glossy swirl lollipop with vibrant spiral colors stands on a white paper stick.",
    question: "Which hard sugar confection on a stick is presented in the cup?",
    prompt: "Vivid close-up photography of a large, glossy round lollipop with vibrant red, yellow, and blue spiral swirls on a clean white paper stick, resting on a clean white countertop. Sparkling surface, playful and clean. Zero people, zero text, zero brand logos."
  },
  'supermarket-15-5': { // Canned Soup
    scenario: "On the pantry shelf, an unmarked tin can with a pull-tab lid sits beside a bowl of warm vegetable soup.",
    question: "Which preserved, ready-to-heat canned food containing soup broth and vegetables is shown on the shelf?",
    prompt: "Culinary still life of an unmarked silver tin soup can with an easy-open pull-tab lid resting beside a steaming ceramic bowl of hearty vegetable soup with herbs on a dark wooden pantry shelf. Warm ambient light, appetizing. Zero people, zero text, zero brand logos."
  }
};

// 1. Update supermarket.usage.json
smData.forEach((lesson, lIdx) => {
  lesson.usage.scenes.forEach((scene, sIdx) => {
    const key = `supermarket-${lIdx + 1}-${sIdx + 1}`;
    if (part3Map[key]) {
      scene.scenario = part3Map[key].scenario;
      scene.check.question = part3Map[key].question;
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

    if (part3Map[key]) {
      item.scenario = part3Map[key].scenario;
      item.optimizedPrompt = part3Map[key].prompt;
      updatedCount++;
    }
  }
});

fs.writeFileSync(pipelinePath, JSON.stringify(pipeline, null, 2), 'utf8');
console.log(`Successfully elevated 25 Supermarket Part 3 scenes in supermarket.usage.json and updated ${updatedCount} pipeline items.`);
