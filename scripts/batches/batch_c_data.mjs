const BATCH_C = [
  {
    id: "fruits-1-usage-scene-2",
    targetFile: "public/scene-images/grape-cluster.webp",
    prompt: "Photorealistic macro photography of a generous cluster of dark purple concord grapes on the vine, dusted with delicate natural white bloom, fresh green vine tendrils. Crisp clear visual focus. Strictly human-free composition. Strictly no text, labels, or watermarks. Aspect ratio 4:3."
  },
  {
    id: "fruits-2-usage-scene-1",
    targetFile: "public/scene-images/berries-trio.webp",
    prompt: "Macro culinary comparison of three distinct dark berries arranged side-by-side on a rustic white ceramic plate: oblong deep purple mulberries with small stems, plump dark boysenberries with distinct drupelets, and round smooth black acai berries. Bright natural light. Strictly human-free composition. Strictly no text, labels, or watermarks. Aspect ratio 4:3."
  },
  {
    id: "fruits-3-usage-scene-2",
    targetFile: "public/scene-images/citrus-trio.webp",
    prompt: "Culinary comparison of three fresh orange citrus fruits on a wooden board: one slightly flattened loose-skinned mandarin with a section peeling away, one bright smooth round clementine, and one deep reddish-orange tangerine. Crisp natural light. Strictly human-free composition. Strictly no stickers, text, or watermarks. Aspect ratio 4:3."
  },
  {
    id: "vegetables-1-usage-scene-3",
    targetFile: "public/scene-images/yam-vs-beet.webp",
    prompt: "Culinary produce comparison on a slate cutting board: a large genuine rough bark-skinned brown yam root cut in half showing creamy off-white starchy flesh, placed clearly beside a smooth deep crimson-red round beetroot with reddish stem. Crisp daylight. Strictly human-free composition. Strictly no text, labels, or watermarks. Aspect ratio 4:3."
  },
  {
    id: "vegetables-2-usage-scene-4",
    targetFile: "public/scene-images/rapini-bunch.webp",
    prompt: "A fresh bundle of rapini (broccoli rabe) tied with natural twine on a wooden kitchen counter, clearly showcasing its jagged dark green leaves and small tender broccoli-like florets. Fresh morning light. Strictly human-free composition. Strictly no text, labels, or watermarks. Aspect ratio 4:3."
  },
  {
    id: "vegetables-3-usage-scene-3",
    targetFile: "public/scene-images/bitter-melon-gourd.webp",
    prompt: "Produce comparison of unusual vegetables: a bumpy-skinned green oblong bitter melon with warty ridges resting beside a smooth pale green pear-shaped chayote squash on a light marble kitchen surface. Natural light. Strictly human-free composition. Strictly no labels, text, or watermarks. Aspect ratio 4:3."
  },
  {
    id: "bedroom-1-usage-scene-1",
    targetFile: "public/scene-images/bedroom-desk-setup.webp",
    prompt: "Clean modern adult bedroom interior showing an oak work desk with comfortable chair, small bookshelf with neatly arranged books with blank spines, and warm morning light streaming through windows. Strictly human-free composition (no framed portraits, no people). Strictly no text, writing, or watermarks. Aspect ratio 4:3."
  },
  {
    id: "bedroom-2-usage-scene-1",
    targetFile: "public/scene-images/thick-comforter-bed.webp",
    prompt: "A luxurious adult king-size bed featuring a very thick, plush, puffy quilted down comforter in warm charcoal grey, generously draped over the bed with deep soft folds, resting over clean white sheets and supportive pillows. Contemporary adult bedroom. Strictly human-free composition. Strictly no text, labels, or watermarks. Aspect ratio 4:3."
  },
  {
    id: "bedroom-2-usage-scene-2",
    targetFile: "public/scene-images/wooden-bed-frame.webp",
    prompt: "Contemporary adult bedroom highlighting the solid natural walnut wooden bed frame: substantial low-profile wooden platform base, solid wooden legs, and matching wooden slatted headboard prominently visible and supporting a neat mattress. Warm morning sunlight. Strictly human-free composition. Strictly no text or watermarks. Aspect ratio 4:3."
  },
  {
    id: "bedroom-2-usage-scene-4",
    targetFile: "public/scene-images/wall-to-wall-carpet.webp",
    prompt: "Spacious modern adult bedroom featuring seamless, luxurious wall-to-wall plush neutral wool carpeting covering the entire floor from corner to corner and meeting the wooden baseboards, with a bed and armchair resting on it. Natural daylight. Strictly human-free composition. Strictly no text or watermarks. Aspect ratio 4:3."
  },
  {
    id: "bedroom-3-usage-scene-4",
    targetFile: "public/scene-images/folded-pajamas.webp",
    prompt: "A set of high-quality navy blue cotton pajama top and trousers, neatly folded in a tidy square resting on a crisp white duvet atop an adult bed. Soft morning light. Strictly human-free composition. Strictly no text, tags, clothing labels, or watermarks. Aspect ratio 4:3."
  },
  {
    id: "bedroom-4-usage-scene-2",
    targetFile: "public/scene-images/wooden-jewelry-box.webp",
    prompt: "An elegant handcrafted dark cherrywood jewelry box with polished brass hinges sitting open on a marble bedroom dresser, revealing lined velvet compartments holding cufflinks and a classic wristwatch. Soft warm ambient lighting. Strictly human-free composition. Strictly no text, brand names, or watermarks. Aspect ratio 4:3."
  },
  {
    id: "bedroom-4-usage-scene-3",
    targetFile: "public/scene-images/phone-on-nightstand-charging.webp",
    prompt: "A modern smartphone resting on an oak bedroom nightstand with its braided charging cable neatly plugged into its port and leading down to the wall outlet. Small water glass and reading glasses beside it. Soft evening bedside lamp light. Strictly human-free composition. Strictly no screen text, brand logos, or watermarks. Aspect ratio 4:3."
  },
  {
    id: "bathroom-1-usage-scene-1",
    targetFile: "public/scene-images/shower-over-bathtub.webp",
    prompt: "Clean modern bathroom interior showing a deep white porcelain bathtub equipped with an overhead chrome rain showerhead fixture mounted on the wall directly above it and a clear folding glass splash screen. Pristine white subway tile surround. Strictly human-free composition. Strictly no text, labels, or watermarks. Aspect ratio 4:3."
  },
  {
    id: "bathroom-1-usage-scene-2",
    targetFile: "public/scene-images/chrome-floor-drain.webp",
    prompt: "Close-up perspective of a gleaming chrome circular floor drain with perforated square grate set flush into contemporary grey slate bathroom floor tiles, with glistening clear water droplets flowing towards it. Bright clean lighting. Strictly human-free composition. Strictly no text or watermarks. Aspect ratio 4:3."
  },
  {
    id: "bathroom-1-usage-scene-4",
    targetFile: "public/scene-images/blue-tile-bathroom.webp",
    prompt: "Stylish contemporary bathroom featuring vibrant glossy Mediterranean deep blue ceramic wall tiles, chrome fixtures, clean white ceramic sink, and neatly folded white bath towels. Natural light. Strictly human-free composition. Strictly no text, labels, or watermarks. Aspect ratio 4:3."
  },
  {
    id: "bathroom-2-usage-scene-1",
    targetFile: "public/scene-images/shampoo-and-conditioner.webp",
    prompt: "Two complementary modern bathroom bottles on a shower shelf: one tall dark bottle of hair shampoo and one matching squeezy tube bottle of hair conditioner, distinct shapes and textures, with fresh clean water droplets. Strictly human-free composition. Strictly no readable text, brand names, letters, or watermarks on the bottles. Aspect ratio 4:3."
  },
  {
    id: "bathroom-4-usage-scene-4",
    targetFile: "public/scene-images/shower-gel-dispenser.webp",
    prompt: "A translucent seafoam-green pump bottle of body wash shower gel with rich silky bubbles visible inside, resting on a wet teak shower caddy beside a natural loofah sponge. Soft bathroom light. Strictly human-free composition. Strictly no text, labels, brand names, or watermarks on bottle. Aspect ratio 4:3."
  },
  {
    id: "bathroom-5-usage-scene-3",
    targetFile: "public/scene-images/cosmetic-bottles-trio.webp",
    prompt: "Trio of distinct transparent glass cosmetic bottles on a clean bathroom shelf: one dropper bottle of clear facial serum, one frosted bottle of skin toner, and one mist spray bottle of rosewater. Elegant minimalist bathroom. Strictly human-free composition. Strictly no text, labels, or watermarks on bottles. Aspect ratio 4:3."
  },
  {
    id: "bathroom-5-usage-scene-4",
    targetFile: "public/scene-images/wipes-and-tissues.webp",
    prompt: "Comparison on a bathroom vanity: a sleek white plastic dispenser box with a pop-up lid holding moisture-retaining wet wipes beside a simple cardboard square cube box dispensing dry facial tissues. Clean modern bathroom. Strictly human-free composition. Strictly no text, brand logos, or watermarks on boxes. Aspect ratio 4:3."
  },
  {
    id: "bathroom-6-usage-scene-3",
    targetFile: "public/scene-images/shower-squeegee.webp",
    prompt: "A sleek modern stainless steel shower squeegee with a flexible black silicone wiper blade, hanging neatly from a minimalist hook on a clear glass shower partition wall with light water condensation. Strictly human-free composition. Strictly no text or watermarks. Aspect ratio 4:3."
  },
  {
    id: "kitchen-1-usage-scene-1",
    targetFile: "public/scene-images/bread-baking-in-oven.webp",
    prompt: "Looking through the clean double-glass door of a modern built-in kitchen oven: a golden-brown crusty artisan sourdough bread loaf baking on a pizza stone, illuminated by the warm interior oven light. Strictly human-free composition. Strictly no digital numbers, brand logos, text, or watermarks on oven. Aspect ratio 4:3."
  },
  {
    id: "kitchen-1-usage-scene-2",
    targetFile: "public/scene-images/soup-in-microwave.webp",
    prompt: "A steaming ceramic bowl of colorful vegetable soup with carrots and peas resting on the glass turntable inside a modern stainless steel microwave with the door swung open, revealing the warm illuminated interior. Clean kitchen counter. Strictly human-free composition. Strictly no digital clock numbers, text, or watermarks. Aspect ratio 4:3."
  },
  {
    id: "kitchen-1-usage-scene-3",
    targetFile: "public/scene-images/fruit-blender.webp",
    prompt: "A heavy-duty glass countertop blender jug filled with colorful freshly sliced fruit: bright red strawberries, sweet yellow banana chunks, and orange juice, ready to blend, sitting on a marble kitchen island. Daylight. Strictly human-free composition. Strictly no brand logos, measurement numbers, text, or watermarks. Aspect ratio 4:3."
  },
  {
    id: "kitchen-3-usage-scene-2",
    targetFile: "public/scene-images/soup-and-water-table.webp",
    prompt: "A simple, appetizing dining table setting: a warm ceramic bowl of hearty lentil vegetable soup with a spoon resting beside it, accompanied by a tall clear glass of sparkling water with ice and lemon slice on a woven placemat. Strictly human-free composition. Strictly no text or watermarks. Aspect ratio 4:3."
  },
  {
    id: "kitchen-5-usage-scene-2",
    targetFile: "public/scene-images/salt-and-sugar-jars.webp",
    prompt: "Two distinct clear glass spice jars on a wooden kitchen shelf: one ceramic salt cellar with fine white table salt and small wooden spoon, and one glass sugar bowl containing sparkling coarse granulated white sugar with a silver spoon. Clean kitchen background. Strictly human-free composition. Strictly no labels, words, or watermarks. Aspect ratio 4:3."
  },
  {
    id: "living-room-1-usage-scene-3",
    targetFile: "public/scene-images/living-room-seating.webp",
    prompt: "Elegant living room conversation area: a large three-seater grey upholstered sofa facing two comfortable matching armchairs across a low round wooden coffee table with a small ceramic vase, resting on a soft textured area rug. Bright daylight. Strictly human-free composition. Strictly no text or watermarks. Aspect ratio 4:3."
  },
  {
    id: "living-room-2-usage-scene-3",
    targetFile: "public/scene-images/gaming-console-shelf.webp",
    prompt: "Modern television media console shelf: a sleek matte black video game console resting horizontally with its matching wireless handheld game controller resting beside it on oak wood, cables hidden neatly. Soft ambient LED backlighting. Strictly human-free composition. Strictly no brand logos, text, or watermarks. Aspect ratio 4:3."
  },
  {
    id: "living-room-3-usage-scene-1",
    targetFile: "public/scene-images/lamp-beside-sofa.webp",
    prompt: "A tall minimalist brass standing floor lamp with a drum shade, positioned directly beside a large comfortable modern grey fabric sofa, casting a warm reading light onto the corner cushion. Living room interior. Strictly human-free composition. Strictly no text or watermarks. Aspect ratio 4:3."
  },
  {
    id: "living-room-4-usage-scene-3",
    targetFile: "public/scene-images/framed-painting-above-credenza.webp",
    prompt: "A handsome wooden living room credenza sideboard, with a beautifully framed impressionist landscape oil painting securely hung on the neutral wall directly centered above it, with a decorative ceramic bowl on the credenza surface. Strictly human-free composition. Strictly no text, signature, or watermarks. Aspect ratio 4:3."
  },
  {
    id: "human-body-head-and-face-1-usage-scene-1",
    targetFile: "public/scene-images/scalp-skull-exam.webp",
    prompt: "A medical clinical consultation setting: a male physician gently examining the crown of the head of an adult male patient, checking the hair scalp layer above the cranium with focused examination light. Clean hospital clinic setting. No women. Strictly no text, charts with writing, words, or watermarks. Aspect ratio 4:3."
  },
  {
    id: "human-body-head-and-face-1-usage-scene-2",
    targetFile: "public/scene-images/hair-styling-temple-crown.webp",
    prompt: "Upscale gentleman's barbershop styling consultation: a male barber holding scissors and comb, carefully gesturing to the side temple and the crown of an adult male client's hair in front of a clean vanity mirror. No women. Strictly no text, logos, or watermarks. Aspect ratio 4:3."
  },
  {
    id: "human-body-head-and-face-1-usage-scene-3",
    targetFile: "public/scene-images/passport-posture-portrait.webp",
    prompt: "Official portrait photography studio: a modest adult man sitting upright with neutral expression, head held high with clearly defined jawline, chin, and neck posture against a clean solid light-grey background. Studio umbrella softbox lighting visible. No women. Strictly no text, stamps, numbers, or watermarks. Aspect ratio 4:3."
  },
  {
    id: "human-body-head-and-face-1-usage-scene-4",
    targetFile: "public/scene-images/throat-eye-exam.webp",
    prompt: "Ear-nose-throat medical clinic: a male doctor with penlight inspecting the throat and eye area of an adult male patient sitting in an examination chair. Clean clinical environment. No women. Strictly no text, labels, or watermarks. Aspect ratio 4:3."
  },
  {
    id: "human-body-head-and-face-1-usage-scene-5",
    targetFile: "public/scene-images/pupil-eye-test.webp",
    prompt: "Optometry vision test: a male optometrist using a small penlight to carefully inspect the pupil and eyelid of an adult male patient in a dimly lit examination room. Precision clinical focus. No women. Strictly no text, charts, or watermarks. Aspect ratio 4:3."
  },
  {
    id: "shapes-geometry-polygons",
    targetFile: "public/scene-images/shapes-geometry-polygons.webp",
    prompt: "Clean educational geometric illustration of regular 2D polygons: an equilateral triangle, a square, a regular pentagon, a regular hexagon, and a regular octagon, each cleanly rendered in distinct solid contrasting colors on a clean neutral background. Strictly human-free composition. Strictly no text, letter labels, angle measurements, or watermarks. Aspect ratio 4:3."
  },
  {
    id: "shapes-geometry-3d-solids",
    targetFile: "public/scene-images/shapes-geometry-3d-solids.webp",
    prompt: "Clean educational geometric illustration of basic 3D solids: a smooth sphere, a cube, a cylinder, a cone, and a square-based pyramid, rendered with subtle architectural shading on a light wooden tabletop. Strictly human-free composition. Strictly no text, labels, or watermarks. Aspect ratio 4:3."
  },
  {
    id: "shapes-geometry-circles-ellipses",
    targetFile: "public/scene-images/shapes-geometry-circles-ellipses.webp",
    prompt: "Clean educational graphic demonstration comparing circles and ellipses: perfect concentric circular rings cleanly contrasted beside elongated elliptical shapes with subtle dashed geometric guide axes. Neutral clean background. Strictly human-free composition. Strictly no text, letter labels, or watermarks. Aspect ratio 4:3."
  },
  {
    id: "shapes-geometry-parallel-lines",
    targetFile: "public/scene-images/shapes-geometry-parallel-lines.webp",
    prompt: "Clean architectural graphic demonstration of lines: two perfectly straight parallel rails contrasted clearly with two intersecting perpendicular lines forming a clean 90-degree square corner. Neutral educational background. Strictly human-free composition. Strictly no text, degree numbers, or watermarks. Aspect ratio 4:3."
  },
  {
    id: "reading-colors-optics",
    targetFile: "public/scene-images/reading-colors-optics.webp",
    prompt: "Optical science educational demonstration: a clear glass triangular prism splitting a focused beam of sunlight into a vibrant, clear spectrum of rainbow colors (red, orange, yellow, green, blue, violet) across a clean white surface in a dark studio. Strictly human-free composition. Strictly no text, labels, wavelength numbers, or watermarks. Aspect ratio 4:3."
  }
];

export { BATCH_C };
