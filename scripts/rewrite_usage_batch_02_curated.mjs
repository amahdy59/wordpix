import { readFile, writeFile } from "node:fs/promises";

const lessonSpecs = {
  "bedroom-4": [
    ["Before bed, Hana puts her glasses on the photo album beside two books.", "What does Hana put on the photo album?", "Glasses", "A bedside table with two books, a closed photo album, and glasses resting on the album."],
    ["Omar puts his phone in his backpack and leaves the jewelry box on the dresser.", "Where does Omar put his phone?", "Backpack", "An adult placing a phone into an open backpack while a jewelry box sits on a nearby dresser."],
    ["Maya connects the charger to her laptop and sets her headphones beside it.", "What does Maya connect to the laptop?", "Charger", "A tidy bedroom desk with a laptop connected to a charger and headphones beside the computer."],
    ["The tablet is playing music through the speaker under the reading light.", "What is playing music?", "Tablet", "A tablet on a bedroom desk, a small speaker nearby, and a reading light illuminating both."],
    ["Before she sleeps, Lina leaves the remote control on the nightstand.", "What does Lina leave on the nightstand?", "Remote Control", "A hand placing a remote control on a nightstand beside a neatly made bed."],
  ],
  "bathroom-1": [
    ["The shower is above the bathtub, and the toilet is beside it.", "What is above the bathtub?", "Shower", "A clean bathroom showing a shower above a bathtub and a toilet beside the bathtub."],
    ["Water runs from the faucet into the sink and goes down the drain.", "Where does the water go after it enters the sink?", "Drain", "A close view of water running from a faucet into a sink and flowing toward the visible drain."],
    ["Rami looks in the mirror while a clean towel hangs on the towel rack beside the cabinet.", "What does Rami look in?", "Mirror", "An adult facing a mirror, with a towel on a rack and a bathroom cabinet nearby."],
    ["The blue tiles make the bathroom wall easy to clean.", "What covers the bathroom wall?", "Tiles", "A clean bathroom wall clearly covered with blue ceramic tiles."],
  ],
  "bathroom-2": [
    ["Nour washes her hair with shampoo, then uses conditioner; the soap stays by the sink.", "What does Nour use after shampoo?", "Conditioner", "An adult shower routine with shampoo and conditioner bottles in use and a bar of soap by the sink."],
    ["After brushing, Sami puts the toothbrush beside the toothpaste and dries his face with a towel.", "What does Sami use to dry his face?", "Towel", "An adult holding a towel near a sink, with a toothbrush and toothpaste together on the counter."],
    ["Leila uses a comb for the ends of her hair, a hairbrush for the rest, and lotion for her hands.", "What does Leila put on her hands?", "Lotion", "An adult applying lotion to one hand; a comb and hairbrush are clearly visible on the counter."],
    ["Before work, Kareem uses deodorant after his shower.", "What does Kareem use after his shower?", "Deodorant", "An adult completing a morning routine and holding an unbranded deodorant container."],
  ],
  "bathroom-3": [
    ["A roll of toilet paper is beside a jar of cotton balls and a small pack of cotton swabs.", "Which item is on a roll?", "Toilet Paper", "A bathroom shelf with one toilet-paper roll, a clear jar of cotton balls, and a small pack of cotton swabs."],
    ["After shaving with a razor, Amir uses the nail clipper; the hair dryer stays unplugged.", "What does Amir use for shaving?", "Razor", "A safe grooming scene with an adult using a razor, a nail clipper nearby, and an unplugged hair dryer."],
    ["The scale is on the floor, the laundry basket holds clothes, and the first aid kit is in the cabinet.", "What holds the clothes?", "Laundry Basket", "A bathroom with a floor scale, a laundry basket containing clothes, and an open cabinet with a first aid kit."],
    ["Mona checks her temperature with a thermometer because she feels unwell.", "What does Mona use to check her temperature?", "Thermometer", "An adult safely using a digital thermometer in a home bathroom."],
  ],
  "bathroom-4": [
    ["The bath mat is outside the shower curtain, directly below the shower head.", "What is on the floor outside the shower?", "Bath Mat", "A shower area with a shower curtain, shower head, and bath mat clearly positioned outside on the floor."],
    ["After her shower, Dina uses the bath towel; a hand towel and washcloth remain by the sink.", "What does Dina use after her shower?", "Bath Towel", "An adult wrapping up in a bath towel, with a smaller hand towel and washcloth beside the sink."],
    ["The soap sits in the soap dish beside the shampoo bottle, while a rubber duck floats in the bath.", "Where is the soap?", "Soap Dish", "A soap bar in a soap dish beside a shampoo bottle, with a rubber duck floating in the bathtub."],
    ["Yousef squeezes shower gel onto his hand before washing.", "What does Yousef put on his hand?", "Shower Gel", "An adult squeezing unbranded shower gel onto one hand in a shower area."],
  ],
  "bathroom-5": [
    ["Before going outside, Salma uses face cream, sunscreen, and lip balm.", "What protects Salma's skin from the sun?", "Sunscreen", "An adult preparing to go outdoors, applying sunscreen with face cream and lip balm nearby."],
    ["At the sink, Ali uses hand soap; the body wash is in the shower and the mouthwash is by his toothbrush.", "What does Ali use at the sink?", "Hand Soap", "An adult washing hands at a sink; body wash is in the shower and mouthwash is near a toothbrush."],
    ["After washing her face with face wash, Huda uses dental floss; the hand sanitizer stays in her bag.", "What does Huda use between her teeth?", "Dental Floss", "An adult using dental floss safely, with face wash on the counter and hand sanitizer visible in an open bag."],
    ["Tariq keeps wet wipes in his travel bag for quick cleanups.", "What does Tariq keep in his travel bag?", "Wet Wipes", "An adult packing an unbranded packet of wet wipes into a small travel bag."],
  ],
  "bathroom-6": [
    ["Mariam fills the bucket, wets the sponge, and scrubs the bath with a brush.", "What does Mariam fill with water?", "Bucket", "An adult cleaning a bathtub with a sponge and brush beside a bucket of water."],
    ["Omar wears gloves, sprays the mirror with a spray bottle, and wipes it with a cloth.", "What does Omar use to wipe the mirror?", "Cloth", "An adult wearing cleaning gloves and wiping a mirror with a cloth; a spray bottle is in the other hand."],
    ["The plunger is beside the toilet, the squeegee is by the shower, and the tissue is near the sink.", "What is beside the toilet?", "Plunger", "A bathroom with a plunger beside the toilet, a squeegee by the shower, and tissues near the sink."],
    ["Nadia washes her hands, brushes her teeth, and then takes a shower.", "What does Nadia do before brushing her teeth?", "Wash Hands", "A three-step morning-routine composition showing handwashing, toothbrushing, and shower preparation without text or numbers."],
    ["After his shower, Samir dries off, flushes the toilet, and combs his hair.", "What does Samir do to his wet hair?", "Comb Hair", "An adult in a bathrobe combing damp hair; a towel and toilet are also visible in the bathroom."],
    ["Rana applies lotion to her arms, then gargles with water at the sink.", "What does Rana do first?", "Apply Lotion", "An adult applying lotion to one arm before holding a glass of water near the sink for gargling."],
  ],
  "kitchen-1": [
    ["Mona takes vegetables from the refrigerator, cooks them on the stove, and warms bread in the oven.", "Where does Mona keep the vegetables?", "Refrigerator", "An adult taking vegetables from a refrigerator, with a stove and oven clearly visible in the same kitchen."],
    ["After lunch, Karim puts the plates in the dishwasher and reheats soup in the microwave; the toaster is ready for breakfast.", "Where does Karim put the plates?", "Dishwasher", "An adult loading plates into a dishwasher, with a microwave and toaster visible on the counter."],
    ["For breakfast, Dalia uses the blender for fruit, the kettle for tea, and the coffee maker for coffee.", "What does Dalia use for fruit?", "Blender", "A breakfast counter with an adult using a blender; a kettle and coffee maker are clearly separate."],
    ["The frozen peas are in the freezer, while a pot and a pan are ready on the stove.", "Where are the frozen peas?", "Freezer", "An open freezer with a bag of peas; a pot and pan sit safely on an unlit stove."],
    ["Rami fries an egg in the frying pan, warms sauce in the saucepan, and puts vegetables on the baking tray.", "What does Rami use to fry the egg?", "Frying Pan", "An adult cooking an egg in a frying pan, with sauce in a saucepan and vegetables arranged on a baking tray."],
  ],
  "kitchen-2": [
    ["At dinner, Chen cooks vegetables in a wok and serves baked food from a casserole dish and a baking dish.", "What does Chen use to cook the vegetables?", "Wok", "An adult cooking vegetables in a wok, with distinct casserole and baking dishes ready for serving."],
    ["Sara cooks rice in the pressure cooker, steams vegetables in the steamer, and places a fork beside the plate.", "What does Sara use for the rice?", "Pressure Cooker", "An adult preparing rice in a pressure cooker and vegetables in a steamer, with a fork beside a plate."],
    ["Khaled cuts a tomato with a knife, tastes the soup with a spoon, and turns food with a spatula.", "What does Khaled use to cut the tomato?", "Knife", "A safe kitchen scene with an adult cutting a tomato with a knife, a spoon by soup, and a spatula by a pan."],
    ["Nora serves soup with a ladle, mixes eggs with a whisk, and lifts salad with tongs.", "What does Nora use for the soup?", "Ladle", "An adult serving soup with a ladle; a whisk is in a bowl of eggs and tongs are beside salad."],
    ["For the pie, Adam uses a peeler on the apples, a grater on the cheese, and a rolling pin on the dough.", "What does Adam use on the dough?", "Rolling Pin", "An adult rolling dough with a rolling pin, with a peeler near apples and a grater near cheese."],
  ],
  "kitchen-3": [
    ["At dinner, Layla opens a can with the can opener, opens a bottle with the corkscrew, and sets out a plate.", "What does Layla use for the can?", "Can Opener", "An adult using a can opener, with a corkscrew beside a bottle and an empty plate nearby."],
    ["Hassan pours soup into a bowl, coffee into a mug, and water into a glass.", "Which item holds the soup?", "Bowl", "An adult serving soup in a bowl, coffee in a mug, and water in a clear glass."],
    ["The cup sits on its saucer beside the cutting board.", "What is directly under the cup?", "Saucer", "A cup resting on a saucer next to a clean cutting board."],
    ["Amal drains pasta in the colander and uses a measuring cup and measuring spoon for the sauce.", "What does Amal use to drain the pasta?", "Colander", "An adult draining pasta in a colander, with a measuring cup and measuring spoon beside sauce ingredients."],
    ["Yara mixes juice in the pitcher, dries the mixing bowl with a dish towel, and sets both on the counter.", "What does Yara dry?", "Mixing Bowl", "An adult drying a mixing bowl with a dish towel while a pitcher of juice sits on the counter."],
  ],
  "kitchen-4": [
    ["While baking, Tarek wears an apron, uses an oven mitt, and puts scraps in the trash can.", "What protects Tarek's hand from the hot tray?", "Oven Mitt", "An adult baker wearing an apron and oven mitt while placing food scraps in a kitchen trash can."],
    ["Heba covers one dish with plastic wrap, another with aluminum foil, and cleans a spill with a paper towel.", "What does Heba use to clean the spill?", "Paper Towel", "An adult wiping a small spill with paper towel; two dishes are separately covered with plastic wrap and aluminum foil."],
    ["After dinner, Walid washes a food container with dish soap and a sponge.", "What does Walid wash?", "Food Container", "An adult washing a reusable food container at the sink with dish soap and a sponge."],
    ["The clean dishes dry in the dish rack while bread is covered with cling film.", "Where do the clean dishes dry?", "Dish Rack", "Clean dishes drying in a dish rack, with a loaf of bread partly covered by transparent cling film."],
    ["For breakfast, Reem fries an egg and serves it with bread, butter, and milk.", "What does Reem fry?", "Egg", "An adult frying an egg and setting a breakfast table with bread, butter, and a glass of milk."],
  ],
  "kitchen-5": [
    ["For a quick dinner, Bilal cooks pasta and rice, then adds cheese to the pasta.", "What does Bilal add to the pasta?", "Cheese", "An adult adding grated cheese to cooked pasta, with a separate bowl of rice nearby."],
    ["Maha pours cooking oil into the pan and adds a little salt, but no sugar.", "What does Maha pour into the pan?", "Cooking Oil", "An adult pouring cooking oil into a pan, with separate unlabelled containers of salt and sugar nearby."],
    ["To make the sauce, Fadi mixes flour with vinegar and adds pepper.", "What does Fadi add for a spicy taste?", "Pepper", "An adult making sauce with flour and vinegar, sprinkling visible ground pepper into the bowl."],
    ["At breakfast, Amina puts honey on apple slices and drinks a glass of juice.", "What does Amina put on the apple slices?", "Honey", "An adult drizzling honey over apple slices, with a glass of juice beside the plate."],
  ],
  "living-room-1": [
    ["Maya sits on the sofa, her guest uses the armchair, and their drinks rest on the coffee table.", "Where do the drinks rest?", "Coffee Table", "Two adults seated on a sofa and armchair with drinks on the coffee table between them."],
    ["A book lies on the side table while Omar rests his feet on the ottoman beside the rocking chair.", "Where does Omar rest his feet?", "Ottoman", "An adult resting feet on an ottoman, with a book on a side table and an empty rocking chair nearby."],
    ["The family eats at the dining table; two people use dining chairs and one sits on the bench.", "Where does one person sit instead of a chair?", "Bench", "Adults eating at a dining table, with dining chairs and one person seated on a bench."],
    ["A small plant sits on the stool between the bookshelf and the TV stand.", "What holds the small plant?", "Stool", "A small plant on a stool positioned between a bookshelf and a TV stand."],
    ["The cabinet has doors, the sideboard holds serving dishes, and the wall shelf displays a vase.", "What holds the serving dishes?", "Sideboard", "A living room with a closed cabinet, a sideboard holding serving dishes, and a wall shelf displaying a vase."],
  ],
  "living-room-2": [
    ["Nadia puts keys in the drawer, magazines in the magazine rack, and a model in the display case.", "Where does Nadia put the magazines?", "Magazine Rack", "An adult organizing keys into a drawer, magazines into a rack, and a model into a glass display case."],
    ["Guests leave coats on the coat rack and shoes on the shoe rack before watching television.", "Where do guests leave their shoes?", "Shoe Rack", "Adults entering a living room, hanging coats on a coat rack and placing shoes on a shoe rack near a television."],
    ["Sam uses the remote control to start the game console, and the sound comes through the speaker.", "What does Sam use to start the console?", "Remote Control", "An adult holding a remote control near a game console, with sound represented subtly from a speaker."],
    ["The DVD player and sound bar sit below the television, while the Wi-Fi router is on a higher shelf.", "What provides the wireless internet connection?", "Wi-Fi Router", "A media unit with a DVD player and sound bar below a television and a Wi-Fi router on a higher shelf."],
    ["A cable connects the television to the power strip, and the strip's plug goes into the wall socket.", "What goes into the wall socket?", "Plug", "A safe close-up showing a television cable connected to a power strip and its plug inserted into a wall socket."],
  ],
  "living-room-3": [
    ["The floor lamp stands by the sofa, the table lamp sits beside it, and the ceiling light lights the whole room.", "Which light stands on the floor?", "Floor Lamp", "A living room clearly showing a floor lamp beside a sofa, a table lamp on a side table, and a ceiling light."],
    ["A chandelier hangs above the table, a candle burns safely below, and a spare light bulb rests nearby.", "What hangs above the table?", "Chandelier", "A chandelier above a table, a safely contained candle below, and an unused light bulb nearby."],
    ["The candle sits in a candle holder beside the picture frame, with string lights on the wall behind them.", "What holds the candle?", "Candle Holder", "A candle safely seated in a candle holder beside a picture frame, with unlettered string lights behind them."],
    ["The wall clock hangs above the sofa, where a cushion and throw blanket make the seat comfortable.", "What tells the time?", "Wall Clock", "A wall clock above a sofa furnished with one cushion and a folded throw blanket."],
    ["A small rug lies over part of the carpet, and a curtain hangs beside the window.", "What covers only part of the carpet?", "Rug", "A clearly bounded small rug laid over a larger carpet, with a curtain beside the window."],
  ],
  "living-room-4": [
    ["At dinner, the tablecloth covers the table, each plate sits on a placemat, and each glass has a coaster.", "What is under each glass?", "Coaster", "A dining table with a tablecloth, visible placemats under plates, and coasters under glasses."],
    ["A plant stands just inside the door, a doormat lies outside, and a tapestry hangs on the wall.", "What lies outside the door?", "Doormat", "A doorway with a doormat outside, a plant inside, and a tapestry on the interior wall."],
    ["Fresh flowers fill the vase beside a photo frame, with a painting hanging above them.", "What holds the fresh flowers?", "Vase", "Fresh flowers in a vase beside a photo frame, with a painting hanging above the arrangement."],
    ["On Sunday morning, Farah reads a newspaper while a book and magazine wait on the table.", "What is Farah reading?", "Newspaper", "An adult reading a newspaper, with a closed book and magazine separately visible on the table."],
    ["Friends play a board game while a puzzle and a pack of playing cards wait on the shelf.", "What are the friends playing?", "Board Game", "Adults playing a board game, with a puzzle box and a pack of playing cards on a shelf."],
  ],
  "living-room-5": [
    ["The lamp lights the table while Lina checks her phone and her tablet charges nearby.", "What lights the table?", "Lamp", "A lamp illuminating a table where an adult checks a phone and a tablet rests nearby."],
    ["Kareem connects the charger to his phone, puts on his headphones, and watches TV.", "What does Kareem put on his ears?", "Headphones", "An adult wearing headphones while watching television, with a phone visibly connected to a charger."],
    ["After dinner, the family reads a book, plays games, and listens to music together.", "What do they do with the book?", "Read Book", "Adults sharing a living room: one reads a book, others play a game, and music plays from a speaker."],
    ["Two friends sit down to chat while their host relaxes on the sofa.", "What do the two friends do together?", "Chat", "Two adults seated and talking together while another adult relaxes comfortably on a sofa."],
    ["After lunch, Ibrahim takes a nap on the sofa.", "What does Ibrahim do on the sofa?", "Take a Nap", "An adult taking a short daytime nap on a sofa in a quiet living room."],
  ],
  "fruits-1": [
    ["At the market, Jo chooses an apple for lunch, a banana for breakfast, and an orange for juice.", "Which fruit is for breakfast?", "Banana", "An adult shopper placing an apple with lunch items, a banana with breakfast items, and oranges beside a juicer."],
    ["The fruit salad has grapes and strawberries, and a large watermelon is ready to slice.", "Which fruit is ready to slice?", "Watermelon", "A fruit-salad bowl with grapes and strawberries beside a whole watermelon and a safe cutting area."],
    ["Mina buys a pineapple and a mango, then chooses a soft peach to eat today.", "Which fruit will Mina eat today?", "Peach", "An adult shopper holding a ripe peach, with a pineapple and mango already in the shopping basket."],
    ["A pear is in the lunch box, while blueberries and raspberries top the yogurt.", "What is in the lunch box?", "Pear", "A pear inside an open lunch box, with separate blueberries and raspberries on a bowl of yogurt."],
    ["The baker decorates one tart with blackberries, one with cranberries, and one with gooseberries.", "Which berries are on the first tart?", "Blackberry", "Three separate fruit tarts: the first with blackberries, the second with cranberries, and the third with gooseberries, without labels."],
  ],
  "fruits-2": [
    ["At the café, the bowls contain mulberries, boysenberries, and açaí berries for three different smoothies.", "Which berries are in the middle bowl?", "Boysenberry", "Three distinct bowls arranged left to right with mulberries, boysenberries, and acai berries for smoothies."],
    ["The market stall displays lingonberries and elderberries beside one ripe papaya.", "Which fruit is the largest?", "Papaya", "A market display with small piles of lingonberries and elderberries beside one clearly larger ripe papaya."],
    ["Nina opens a coconut, slices a guava, and spoons out the inside of a passion fruit.", "Which fruit does Nina open?", "Coconut", "An adult preparing fruit: opening a coconut, slicing a guava, and spooning pulp from a passion fruit."],
    ["For a tasting plate, the chef peels a lychee and slices dragon fruit and star fruit.", "Which fruit does the chef peel?", "Lychee", "A chef peeling a lychee, with sliced dragon fruit and star fruit displayed separately on a tasting plate."],
    ["The shopkeeper cuts the jackfruit, keeps the durian closed, and places rambutan in a basket.", "Which fruit does the shopkeeper cut?", "Jackfruit", "A market worker cutting a jackfruit, with a closed durian and a basket of rambutan nearby."],
  ],
  "fruits-3": [
    ["For breakfast, Salma squeezes a lemon, slices a lime, and halves a grapefruit.", "Which fruit does Salma squeeze?", "Lemon", "An adult squeezing a lemon, with a sliced lime and halved grapefruit clearly separate."],
    ["The fruit bowl holds a tangerine, a mandarin, and two small clementines.", "Which fruit appears twice?", "Clementine", "A fruit bowl with exactly one tangerine, one mandarin, and two clearly smaller clementines."],
    ["At the citrus stall, the kumquat is the smallest fruit, the pomelo is the largest, and the blood orange is cut open.", "Which fruit is the largest?", "Pomelo", "A citrus display comparing a small kumquat, a large pomelo, and a cut blood orange."],
    ["The cook adds yuzu to a sauce while a cherry and a plum remain on the plate.", "What does the cook add to the sauce?", "Yuzu", "A cook adding yuzu juice to a sauce, with one cherry and one plum remaining on a plate."],
    ["For a snack, Adil packs an apricot, a nectarine, and three dates.", "Which fruit does Adil pack three of?", "Date", "An open snack box with one apricot, one nectarine, and exactly three dates."],
  ],
};

const readings = {
  "bedroom-4": ["A Tidy Evening", "Hana gets ready for bed. She puts her books and photo album on the shelf, then places her glasses on top. Her phone goes into her backpack. At the desk, she charges her laptop and leaves her headphones beside it. Finally, she puts the remote control on the nightstand."],
  "bathroom-1": ["A Quick Bathroom Check", "Rami checks the bathroom before a guest arrives. The shower and bathtub are clean. Water runs from the faucet into the sink and down the drain. A towel hangs on the towel rack, and supplies are inside the cabinet. He wipes the mirror and checks the tiles."],
  "bathroom-2": ["Nour's Morning Routine", "Nour washes her hair with shampoo and conditioner. She brushes her teeth with a toothbrush and toothpaste, then dries her face with a towel. She uses a comb and hairbrush before applying lotion. Her deodorant is the last item she uses before leaving for work."],
  "bathroom-3": ["Getting Ready Safely", "Amir keeps bathroom supplies in clear places. Toilet paper, cotton balls, and a cotton swab are on a shelf. His razor, nail clipper, and hair dryer are in a drawer. The scale is on the floor, clean clothes are in the laundry basket, and the first aid kit is in the cabinet."],
  "bathroom-4": ["After the Shower", "Dina closes the shower curtain and turns on the shower head. The bath mat stays dry outside. After washing, she uses a bath towel. A hand towel and washcloth remain by the sink. Soap rests in its dish, and the shower gel goes back beside the shampoo bottle."],
  "bathroom-5": ["Personal Care for a Day Out", "Before going outside, Salma washes her face and uses face cream, sunscreen, and lip balm. At the sink, she washes her hands with hand soap. She also packs dental floss, hand sanitizer, and wet wipes. The body wash and mouthwash stay in the bathroom."],
  "bathroom-6": ["Cleaning and Getting Ready", "Mariam cleans the bathroom with a sponge, brush, and bucket. She wears gloves and wipes the mirror with a cloth. Her routine is to wash hands, brush teeth, then take a shower. Afterward, she remembers to dry off and flush, then combs her hair, applies lotion, and gargles before leaving."],
  "kitchen-1": ["Breakfast in a Busy Kitchen", "Dalia takes fruit from the refrigerator and blends it. The kettle heats water while the coffee maker makes coffee. A pot sits on the stove, and bread warms in the oven. After breakfast, she puts the dishes in the dishwasher and stores frozen food in the freezer."],
  "kitchen-2": ["Preparing Dinner", "Sara cooks rice in the pressure cooker and vegetables in the steamer. She cuts tomatoes with a knife and turns food with a spatula. A ladle is ready for the soup, and tongs are beside the salad. Last, she uses a whisk and rolling pin for dessert."],
  "kitchen-3": ["Setting the Table", "Layla opens a can and begins dinner. She serves soup in a bowl and water in a glass. A cup rests on a saucer. She measures the sauce with a measuring cup and spoon, drains pasta in a colander, and dries the mixing bowl with a dish towel."],
  "kitchen-4": ["Cooking and Cleaning", "Tarek wears an apron and uses an oven mitt for the hot tray. Heba covers leftover food with plastic wrap and aluminum foil. After dinner, they wash a food container with a sponge and dish soap. Clean plates dry in the dish rack, ready for breakfast."],
  "kitchen-5": ["A Simple Meal", "Maha pours cooking oil into a pan and adds a little salt and pepper. Bilal cooks rice and pasta, then adds cheese to the pasta. For dessert, they cut an apple and add honey. They drink juice with the meal and store the flour, sugar, and vinegar."],
  "living-room-1": ["Guests in the Living Room", "Maya welcomes two friends. She sits on the sofa, and they use the armchair and rocking chair. The dining chair is beside the dining table, while drinks go on the coffee table. A book rests on the side table, and a plant stands on a stool between the bookshelf and the TV stand."],
  "living-room-2": ["A Connected Living Room", "Before watching television, Sam puts his shoes on the shoe rack and his coat on the coat rack. He starts the game console with the remote control. The speaker and sound bar play clearly, while the Wi-Fi router connects the devices to the internet."],
  "living-room-3": ["Warm Light", "In the evening, the ceiling light and floor lamp brighten the room. A table lamp helps Nora read. A candle sits safely in its holder beneath the chandelier. She adds a cushion and throw blanket to the sofa, closes the curtain, and places her feet on the rug."],
  "living-room-4": ["A Relaxed Sunday", "Farah sets the table with a tablecloth, placemats, and coasters. After lunch, she reads the newspaper beside a vase of flowers. Her friends arrive and choose a board game. A puzzle and playing cards stay on the shelf for another day."],
  "living-room-5": ["An Evening at Home", "Kareem connects his phone to the charger and puts on his headphones. His family plans to watch TV, read a book, and play games. Later, they listen to music and chat. When the room becomes quiet, Kareem can relax, sit down, or take a nap on the sofa."],
  "fruits-1": ["Fruit for the Week", "Jo shops for fruit on Sunday. He buys bananas for breakfast and apples for lunch. He chooses oranges for juice and a grape and strawberry for a fruit salad. At home, he slices a watermelon, packs a pear, and adds a blueberry and raspberry to yogurt. A baker uses a blackberry, cranberry, and gooseberry in three tarts."],
  "fruits-2": ["A Fruit-Tasting Market", "Nina visits a market with fruit from many regions. She tries mulberry, boysenberry, and acai berry in a smoothie. A seller displays lingonberry and elderberry beside papaya. Nearby, another seller opens a coconut and slices guava, lychee, dragon fruit, star fruit, jackfruit, durian, and rambutan."],
  "fruits-3": ["Choosing Citrus and Stone Fruit", "Salma buys lemon and lime for cooking, plus grapefruit for breakfast. She compares a small kumquat with a large pomelo. At another stall, she chooses cherries, plums, apricots, and nectarines. Before leaving, she adds a box of dates for quick snacks."],
};

function asArray(value) {
  return Array.isArray(value) ? value : [value];
}

function normalizeLearnerPhrase(value) {
  if (value === "Take Shower") return "Take a Shower";
  if (value === "Read Book") return "Read a Book";
  return value;
}

const arabicCorrections = {
  Shower: "دُشّ (مِرَشَّةُ الاسْتِحْمَام)",
  Plunger: "سَلَّاكَةُ المِرْحَاض (مِكْبَس)",
  Juice: "عَصِير",
  "Playing Cards": "أَوْرَاقُ اللَّعِب (وَرَقُ الكُوتْشِينَة)",
  "Watch TV": "مُشَاهَدَةُ التِّلْفَاز",
  "Read a Book": "قِرَاءَةُ كِتَاب",
  "Play Games": "لَعِبُ الأَلْعَاب",
  "Listen to Music": "الاسْتِمَاعُ إِلَى المُوسِيقَى",
  Relax: "الاسْتِرْخَاء",
  "Sit Down": "الجُلُوس",
  Chat: "الدَّرْدَشَة (التَّحَدُّث)",
  "Take a Nap": "أَخْذُ قَيْلُولَة",
};

const unitFiles = [...new Set(Object.keys(lessonSpecs).map((lessonId) => lessonId.replace(/-\d+$/u, "")))];

for (const unitId of unitFiles) {
  const file = `src/app/data/usage/${unitId}.usage.json`;
  const lessons = JSON.parse((await readFile(file, "utf8")).replace(/^\uFEFF/u, ""));
  let changed = false;
  const updated = lessons.map((lesson) => {
    const specs = lessonSpecs[lesson.lessonId];
    if (!specs) return lesson;
    changed = true;
    const scenes = asArray(lesson.usage.scenes);
    if (scenes.length !== specs.length) {
      throw new Error(`${lesson.lessonId}: expected ${scenes.length} curated scene specs, received ${specs.length}.`);
    }
    const curatedScenes = scenes.map((scene, index) => {
      const [scenario, question, expectedAnswer, imageBrief] = specs[index];
      const options = asArray(scene.targetWords);
      if (!options.includes(expectedAnswer)) {
        throw new Error(`${lesson.lessonId} scene ${scene.chunkNumber}: ${expectedAnswer} is not a target option.`);
      }
      return {
        ...scene,
        targetWords: asArray(scene.targetWords).map(normalizeLearnerPhrase),
        scenario,
        check: { question, options: options.map(normalizeLearnerPhrase), expectedAnswer: normalizeLearnerPhrase(expectedAnswer) },
        imageBrief,
      };
    });
    const [readingTitle, readingText] = readings[lesson.lessonId];
    const firstTargets = asArray(curatedScenes[0].targetWords);
    const lastTargets = asArray(curatedScenes.at(-1).targetWords);
    const normalizedEnglish = lesson.targetWordsEnglish.map(normalizeLearnerPhrase);
    const normalizedArabic = normalizedEnglish.map(
      (target, index) => arabicCorrections[target] ?? lesson.targetWordsArabic[index]
    );
    return {
      ...lesson,
      targetWordsEnglish: normalizedEnglish,
      targetWordsArabic: normalizedArabic,
      usage: {
        ...lesson.usage,
        goal: `Recognize and use common ${lesson.unitName.toLowerCase()} vocabulary in practical everyday situations.`,
        canDoStatement: `I can understand and use common ${lesson.unitName.toLowerCase()} words in a simple situation`,
        scenes: curatedScenes,
      },
      reading: {
        title: readingTitle,
        text: readingText,
        imageBrief: `Show the main adult everyday situation from “${readingTitle}” with the key objects clearly visible, naturally arranged, and free of written labels.`,
      },
      exercises: [
        ...curatedScenes.map((scene) => ({
          prompt: scene.check.question,
          answer: scene.check.expectedAnswer,
          questionType: "context-cloze",
          responseMode: "choice",
          contextTag: `${lesson.lessonId}-scene-${scene.chunkNumber}`,
        })),
        {
          prompt: `Use “${firstTargets[0]}” in one short sentence about an everyday situation.`,
          answer: curatedScenes[0].scenario,
          questionType: "production",
          responseMode: "sentence",
          contextTag: `${lesson.lessonId}-personal-use`,
        },
        {
          prompt: `Name another lesson word that can be used with “${lastTargets[0]}” in the same situation.`,
          answer: lastTargets[1] ?? lastTargets[0],
          questionType: "transfer",
          responseMode: "short-answer",
          contextTag: `${lesson.lessonId}-transfer`,
        },
      ],
      video: {
        title: `${lesson.lessonName}: Words in Action`,
        idea: `A 30–50 second adult everyday scene based on the curated lesson situations. Show each target naturally, pause for one context question, then model the answer in a complete sentence.`,
        scriptStarter: curatedScenes[0].scenario,
      },
    };
  });
  if (changed) await writeFile(file, `${JSON.stringify(updated, null, 2)}\n`, "utf8");
}

console.log(`Curated ${Object.keys(lessonSpecs).length} lessons for Batch 2 (global order 21–40).`);
