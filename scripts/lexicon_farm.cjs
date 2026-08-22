// scripts/lexicon_farm.js
module.exports = {
  // --- FARM: ANIMALS ---
  "cow": {
    arabic: "بَقَرَة",
    partOfSpeech: "noun",
    phonetic: "kaʊ",
    pronunciationTip: "Diphthong 'ow' sound /aʊ/ as in 'now' or 'how'.",
    collocations: ["dairy cow", "milk a cow", "herd of cows", "graze in the pasture", "cow bell", "spotted cow"],
    phrasalVerbs: [
      { phrase: "milk", meaning: "extract milk from a cow", arabic: "يَحْلِبُ البَقَرَة", example: "The farmer milks the dairy cows at dawn every day." }
    ],
    sentences: [
      { context: "Dairy Farming", en: "The dairy cow produces over twenty liters of fresh milk each morning.", ar: "تُنْتِجُ بَقَرَةُ الحَلِيبِ أَكْثَرَ مِنْ عِشْرِينَ لِتْراً مِنَ الحَلِيبِ الطَّازَجِ كُلَّ صَبَاحٍ." },
      { context: "Pasture Grazing", en: "A peaceful herd of black-and-white cows grazed quietly across the green hillside.", ar: "رَعَى قَطِيعٌ هَادِئٌ مِنَ الأَبْقَارِ ذَاتِ اللَّوْنَيْنِ الأَبْيَضِ وَالأَسْوَدِ عَلَى التَّلِّ الأَخْضَرِ." },
      { context: "Farm Routine", en: "The farmer leads the cows back into the warm barn as the sun sets.", ar: "يَقُودُ المُزَارِعُ الأَبْقَارَ إِلَى الحَظِيرَةِ الدَّافِئَةِ مَعَ غُرُوبِ الشَّمْسِ." }
    ]
  },
  "pig": {
    arabic: "خِنْزِير",
    partOfSpeech: "noun",
    phonetic: "pɪɡ",
    pronunciationTip: "Short 'i' vowel /ɪ/ as in 'big' or 'dig'.",
    collocations: ["pig pen", "muddy pig", "feed the pigs", "piglet", "pig snout", "sow and pigs"],
    phrasalVerbs: [
      { phrase: "pig out", meaning: "(idiom) eat a large amount of food greedily", arabic: "يَأْكُلُ بِشَرَاهَة", example: "We pigged out on pizza and ice cream after the match." }
    ],
    sentences: [
      { context: "Farm Life", en: "The cheerful pig rolled happily in the cool mud to protect its skin from the sun.", ar: "تَمَرَّغَ الخِنْزِيرُ فِي الطِّينِ البَارِدِ لِحِمَايَةِ جِلْدِهِ مِنْ حَرَارَةِ الشَّمْسِ." },
      { context: "Feeding Chores", en: "The farmer poured a bucket of fresh grain and chopped vegetables into the pig pen.", ar: "سَكَبَ المُزَارِعُ دَلْواً مِنَ الحُبُوبِ وَالخُضْرَاوَاتِ المَفْرُومَةِ فِي حَظِيرَةِ الخَنَازِيرِ." },
      { context: "Animal Behavior", en: "Pigs are highly intelligent animals with a keen sense of curiosity and smell.", ar: "تُعَدُّ الخَنَازِيرُ حَيَوَانَاتٍ ذَكِيَّةً جِدّاً وَتَمْتَلِكُ حَاسَّةَ شَمٍّ حَادَّةً." }
    ]
  },
  "sheep": {
    arabic: "خَرُوف / غَنَم (شَاة)",
    partOfSpeech: "noun",
    phonetic: "ʃiːp",
    pronunciationTip: "Long 'ee' vowel /iː/. Plural is also 'sheep' (no 's').",
    collocations: ["flock of sheep", "shear the sheep", "wool from sheep", "sheep grazing", "sheepdog", "bleat of a sheep"],
    phrasalVerbs: [
      { phrase: "round up", meaning: "gather sheep together using a dog", arabic: "يَجْمَعُ القَطِيع", example: "The border collie rounded up the stray sheep into the pen." }
    ],
    sentences: [
      { context: "Wool Harvesting", en: "Every spring, the sheep are sheared to harvest thick, natural wool for blankets.", ar: "فِي كُلِّ رَبِيعٍ، يَتِمُّ جَزُّ صُوفِ الأَغْنَامِ لِجَنْيِ الصُّوفِ الطَّبِيعِيِّ لِلْبَطَّانِيَّاتِ." },
      { context: "Hillside Grazing", en: "A large flock of white sheep wandered peacefully across the rolling green meadows.", ar: "تَجَوَّلَ قَطِيعٌ كَبِيرٌ مِنَ الأَغْنَامِ البَيْضَاءِ بِهُدُوءٍ فِي المُرُوجِ الخَضْرَاءِ." },
      { context: "Herding Dogs", en: "The trained sheepdog sprinted across the pasture to herd the lambs safely.", ar: "رَكَضَ كَلْبُ الرِّعَايَةِ المُدَرَّبُ لِتَوْجِيهِ الحُمْلانِ إِلَى الحَظِيرَةِ بِأَمَانٍ." }
    ]
  },
  "chicken": {
    arabic: "دَجَاجَة",
    partOfSpeech: "noun",
    phonetic: "ˈtʃɪk.ɪn",
    pronunciationTip: "Begins with 'ch' sound (/tʃ/), short 'i' in both syllables (/ˈtʃɪk.ɪn/).",
    collocations: ["chicken coop", "free-range chicken", "feed the chickens", "lay eggs", "clucking chicken", "roast chicken"],
    phrasalVerbs: [
      { phrase: "chicken out", meaning: "(idiom) decide not to do something out of fear", arabic: "يَتَرَاجَعُ جُبْناً", example: "He was going to dive into the lake, but chickened out at the last second." }
    ],
    sentences: [
      { context: "Egg Gathering", en: "The children collect fresh brown eggs from the chicken coop every morning.", ar: "يَجْمَعُ الأَطْفَالُ البَيْضَ البُنِّيَّ الطَّازَجَ مِنْ خُمِّ الدَّجَاجِ كُلَّ صَبَاحٍ." },
      { context: "Free-Range Life", en: "Free-range chickens roam around the farmyard pecking at grass seeds and grains.", ar: "تَتَجَوَّلُ الدَّجَاجَاتُ المَطْلُوقَةُ فِي فِنَاءِ المَزْرَعَةِ تَنْقُرُ الحُبُوبَ وَالأَعْشَابَ." },
      { context: "Farm Sounds", en: "The cheerful clucking of hens echoed outside the barn at sunrise.", ar: "تَرَدَّدَ صَوْتُ قَوْقَأَةِ الدَّجَاجِ البَهِيجِ خَارِجَ الحَظِيرَةِ عِنْدَ شُرُوقِ الشَّمْسِ." }
    ]
  },
  "horse": {
    arabic: "حِصَان (خَيْل)",
    partOfSpeech: "noun",
    phonetic: "hɔːrs",
    pronunciationTip: "Broad 'or' sound /ɔːr/ as in 'door' or 'force'.",
    collocations: ["ride a horse", "gallop of a horse", "horse stable", "brush the horse", "wild horse", "saddle a horse"],
    phrasalVerbs: [
      { phrase: "horse around", meaning: "(idiom) play roughly or foolishly", arabic: "يَمْزَحُ بِخُشُونَة", example: "Stop horsing around in the living room before you break the vase." },
      { phrase: "saddle up", meaning: "put a saddle on a horse for riding", arabic: "يُسْرِجُ الخَيْل", example: "They saddled up their horses for an early morning trail ride." }
    ],
    sentences: [
      { context: "Horseback Riding", en: "She rode her chestnut horse along the scenic forest trail at dawn.", ar: "رَكِبَتْ حِصَانَهَا الكَسْتَنَائِيَّ عَلَى طُولِ مَسَارِ الغَابَةِ الخَلابِ عِنْدَ الفَجْرِ." },
      { context: "Stable Care", en: "The groom brushed the horse's glossy coat and cleaned its hooves thoroughly.", ar: "نَظَّفَ السَّائِسُ فَرْوَةَ الحِصَانِ اللّامِعَةَ وَعَقَّمَ حَوَافِرَهُ بِعِنَايَةٍ." },
      { context: "Power & Grace", en: "The magnificent black stallion galloped effortlessly across the open pasture.", ar: "رَكَضَ الفَحْلُ الأَسْوَدُ البَدِيعُ بِسُرْعَةٍ وَرَشَاقَةٍ عَبْرَ المَرْعَى المَفْتُوحِ." }
    ]
  },
  "goat": {
    arabic: "مَاعِز (عَنْزَة)",
    partOfSpeech: "noun",
    phonetic: "ɡoʊt",
    pronunciationTip: "Long 'o' vowel /oʊ/ as in 'boat' or 'coat'.",
    collocations: ["goat cheese", "goat milk", "herd of goats", "curious goat", "mountain goat", "horns of a goat"],
    phrasalVerbs: [
      { phrase: "butt in", meaning: "interrupt (like a goat using horns)", arabic: "يَتَدَخَّلُ بِفُضُول", example: "Please don't butt into our conversation." }
    ],
    sentences: [
      { context: "Farm Dairy", en: "Fresh goat milk is crafted into delicious, tangy artisan cheeses.", ar: "يُسْتَخْدَمُ حَلِيبُ المَاعِزِ الطَّازَجُ فِي صِنَاعَةِ أَجْبَانٍ شَهِيَّةٍ وَمُمَيَّزَةٍ." },
      { context: "Playful Nature", en: "The playful young goats leaped playfully onto wooden bales of straw.", ar: "قَفَزَتْ صِغَارُ المَاعِزِ بِمَرَحٍ فَوْقَ بَالاتِ القَشِّ الخَشَبِيَّةِ فِي المَزْرَعَةِ." },
      { context: "Agility", en: "Goats are remarkably sure-footed and can easily climb steep rocky hillsides.", ar: "يَتَمَيَّزُ المَاعِزُ بِثَبَاتِ خُطُوَاتِهِ وَقُدْرَتِهِ الفَائِقَةِ عَلَى تَسَلُّقِ المُنْحَدَرَاتِ الصَّخْرِيَّةِ." }
    ]
  },
  "duck": {
    arabic: "بَطَّة",
    partOfSpeech: "noun",
    phonetic: "dʌk",
    pronunciationTip: "Short 'u' sound /ʌ/ as in 'luck' or 'truck'.",
    collocations: ["duck pond", "quacking duck", "feed the ducks", "swim like a duck", "duckling", "duck feathers"],
    phrasalVerbs: [
      { phrase: "duck out", meaning: "(idiom) leave quietly or quickly", arabic: "يَنْسَلُّ بِهُدُوء", example: "He ducked out of the meeting ten minutes early." }
    ],
    sentences: [
      { context: "Pond Life", en: "A mother duck led her six fluffy ducklings across the calm pond.", ar: "قَادَتْ أُمُّ البَطِّ صِغَارَهَا السِّتَّةَ ذَوِي الزَّغَبِ النَّاعِمِ عَبْرَ البِرْكَةِ الهَادِئَةِ." },
      { context: "Feeding Birds", en: "The children threw chopped oats and lettuce leaves to the quacking ducks.", ar: "أَلْقَى الأَطْفَالُ حُبُوبَ الشُّوفَانِ وَأَوْرَاقَ الخَسِّ لِلْبَطِّ المُتَجَمِّعِ." },
      { context: "Waterproofing", en: "Duck feathers have a natural oil coating that keeps them dry while swimming.", ar: "تَحْتَوِي رِيشَاتُ البَطِّ عَلَى زُيُوتٍ طَبِيعِيَّةٍ تَجْعَلُهَا مَانِعَةً لِلْمَاءِ أَثْنَاءَ السِّبَاحَةِ." }
    ]
  },
  "rooster": {
    arabic: "دِيك",
    partOfSpeech: "noun",
    phonetic: "ˈruː.stər",
    pronunciationTip: "Long 'oo' vowel /uː/ as in 'rooster' or 'booster'.",
    collocations: ["crowing rooster", "rooster at dawn", "colorful rooster", "rooster comb", "rooster feathers", "wake to the rooster"],
    phrasalVerbs: [
      { phrase: "strut around", meaning: "walk with a proud gait", arabic: "يَتَبَخْتَرُ", example: "The proud rooster strutted around the farmyard displaying its feathers." }
    ],
    sentences: [
      { context: "Dawn Awakening", en: "The rooster perched on the fence and crowed loudly to greet the morning sunrise.", ar: "وَقَفَ الدِّيكُ عَلَى السِّيَاجِ وَصَاحَ بِصَوْتٍ عَالٍ تَرْحِيباً بِشُرُوقِ الصَّبَاحِ." },
      { context: "Vibrant Colors", en: "With its bright red comb and iridescent green tail feathers, the rooster looked majestic.", ar: "بِعُرْفِهِ الأَحْمَرِ السَّاطِعِ وَرِيشِ ذَيْلِهِ الأَخْضَرِ اللّامِعِ، بَدَا الدِّيكُ مَهِيباً." },
      { context: "Farm Guardian", en: "The rooster keeps a watchful eye over the hens and alerts them to approaching hawks.", ar: "يُرَاقِبُ الدِّيكُ الدَّجَاجَاتِ بِحَذَرٍ وَيُحَذِّرُهَا مِنْ أَيِّ طُيُورٍ جَارِحَةٍ تَقْتَرِبُ." }
    ]
  },
  "turkey": {
    arabic: "دِيكٌ رُومِيّ",
    partOfSpeech: "noun",
    phonetic: "ˈtɜːr.ki",
    pronunciationTip: "Stress on 'TUR' (/ˈtɜːr.ki/), identical in pronunciation to the country Turkey.",
    collocations: ["wild turkey", "gobble of a turkey", "roast turkey", "flock of turkeys", "turkey feathers", "turkey farm"],
    phrasalVerbs: [
      { phrase: "gobble up", meaning: "eat greedily or make turkey sounds", arabic: "يَلْتَهِمُ بِسُرْعَة", example: "The hungry birds gobbled up all the scattered corn in minutes." }
    ],
    sentences: [
      { context: "Farm Wildlife", en: "A flock of wild turkeys strutted through the woodland clearing near the orchard.", ar: "تَجَوَّلَ سِرْبٌ مِنَ الدُّيُوكِ الرُّومِيَّةِ البَرِّيَّةِ عَبْرَ الغَابَةِ قُرْبَ البُسْتَانِ." },
      { context: "Distinctive Sound", en: "The big tom turkey puffed up his chest and made a loud gobbling sound.", ar: "نَفَخَ الدِّيكُ الرُّومِيُّ الكَبِيرُ صَدْرَهُ وَأَصْدَرَ صَوْتَ قَرْقَرَةٍ عَالِياً." },
      { context: "Holiday Feast", en: "Roast turkey seasoned with rosemary and thyme was the centerpiece of the Thanksgiving feast.", ar: "كَانَ الدِّيكُ الرُّومِيُّ المَشْوِيُّ بِإِكْلِيلِ الجَبَلِ وَالزَّعْتَرِ طَبَقَ الاِحْتِفَالِ الرَّئِيسِيَّ." }
    ]
  },
  "donkey": {
    arabic: "حِمَار",
    partOfSpeech: "noun",
    phonetic: "ˈdɑːŋ.ki",
    pronunciationTip: "First syllable has /dɑːŋ/ in American English, /ˈdɒŋ/ in British English.",
    collocations: ["bray of a donkey", "stubborn donkey", "pack donkey", "gentle donkey", "donkey cart", "pet a donkey"],
    phrasalVerbs: [
      { phrase: "carry on", meaning: "transport loads steadily", arabic: "يَحْمِلُ الأَثْقَالَ", example: "The loyal donkey carried on with the heavy pack up the mountain." }
    ],
    sentences: [
      { context: "Hard Worker", en: "The sturdy donkey patiently carried baskets of harvested apples up the hillside.", ar: "حَمَلَ الحِمَارُ المَتِينُ سِلالَ التُّفَّاحِ المَحْصُودِ بِصَبْرٍ صُعُوداً عَلَى التَّلِّ." },
      { context: "Gentle Nature", en: "The friendly grey donkey loved having its long ears gently scratched by visitors.", ar: "أَحَبَّ الحِمَارُ الرَّمَادِيُّ اللَّطِيفُ أَنْ يَمْسَحَ الزُّوَّارُ عَلَى أُذُنَيْهِ الطَّوِيلَتَيْنِ." },
      { context: "Farm Protection", en: "Farmers often keep guard donkeys to protect vulnerable sheep from coyotes.", ar: "يُرَبِّي المُزَارِعُونَ الحَمِيرَ لِحِرَاسَةِ الأَغْنَامِ وَحِمَايَتِهَا مِنَ الذِّئَابِ البَرِّيَّةِ." }
    ]
  },
  "rabbit": {
    arabic: "أَرْنَب",
    partOfSpeech: "noun",
    phonetic: "ˈræb.ɪt",
    pronunciationTip: "Short 'a' vowel /æ/ as in 'rab', followed by short /ɪt/.",
    collocations: ["pet rabbit", "hop like a rabbit", "rabbit hutch", "wild rabbit", "fluffy rabbit", "rabbit ears"],
    phrasalVerbs: [
      { phrase: "hop away", meaning: "jump quickly to escape", arabic: "يَقْفِزُ مُبْتَعِداً", example: "The wild rabbit hopped away into the tall clover when it saw us." }
    ],
    sentences: [
      { context: "Garden Visitor", en: "A cute brown rabbit nibbled quietly on crisp dandelion leaves in the vegetable garden.", ar: "قَضَمَ أَرْنَبٌ بُنِّيٌّ لَطِيفٌ أَوْرَاقَ الهِنْدَبَاءِ فِي حَدِيقَةِ الخُضْرَاوَاتِ بِهُدُوءٍ." },
      { context: "Pet Care", en: "Clean the rabbit hutch and provide fresh timothy hay and clean water daily.", ar: "نَظِّفْ قَفَصَ الأَرْنَبِ وَوَفِّرْ لَهُ قَشَّ التِّيمُوثِي الطَّازَجَ وَالمَاءَ النَّقِيَّ يَوْمِيّاً." },
      { context: "Speed & Agility", en: "The rabbit zigzagged swiftly through the meadow to outrun the barking puppy.", ar: "جَرَى الأَرْنَبُ بِسُرْعَةٍ وَتَمَوُّجٍ عَبْرَ المَرْجِ لِيَسْبِقَ الجَرْوَ النَّابِحَ." }
    ]
  },
  "goose": {
    arabic: "إِوَزَّة (إِوَزّ)",
    partOfSpeech: "noun",
    phonetic: "ɡuːs",
    pronunciationTip: "Long 'oo' vowel /uː/. Plural is 'geese' (/ɡiːs/).",
    collocations: ["flock of geese", "honking goose", "white goose", "goose feathers", "guard goose", "goose down"],
    phrasalVerbs: [
      { phrase: "fly south", meaning: "migrate during autumn in V-formation", arabic: "يُهَاجِرُ جَنُوباً", example: "Flocks of Canada geese fly south for the winter." }
    ],
    sentences: [
      { context: "Farm Sentry", en: "The vocal white goose honked loudly whenever unfamiliar visitors arrived at the gate.", ar: "صَاحَتِ الإِوَزَّةُ البَيْضَاءُ بِصَوْتٍ عَالٍ كُلَّمَا وَصَلَ زُوَّارٌ جُدُدٌ إِلَى البَوَّابَةِ." },
      { context: "Migration", en: "A majestic V-formation of wild geese soared high across the crisp autumn sky.", ar: "حَلَّقَ سِرْبٌ بَدِيعٌ مِنَ الإِوَزِّ البَرِّيِّ عَلَى شَكْلِ حَرْفِ V فِي سَمَاءِ الخَرِيفِ." },
      { context: "Soft Down", en: "High-quality winter parkas and pillows are insulated with ultra-soft goose down.", ar: "تُبَطَّنُ السُّتْرَاتُ الشَّتْوِيَّةُ الفَاخِرَةُ وَالوِسَادَاتُ بِزَغَبِ الإِوَزِّ النَّاعِمِ جِدّاً." }
    ]
  },
  "dog": {
    arabic: "كَلْب (كَلْبُ حِرَاسَة)",
    partOfSpeech: "noun",
    phonetic: "dɔːɡ",
    pronunciationTip: "Open 'aw' vowel /ɔː/ in American English, short 'o' /ɒ/ in British English.",
    collocations: ["farm dog", "barking dog", "loyal dog", "walk the dog", "guard dog", "wag its tail"],
    phrasalVerbs: [
      { phrase: "bark at", meaning: "sound alarm at strangers", arabic: "يَنْبَحُ عَلَى", example: "The loyal farm dog barked at the delivery van." },
      { phrase: "fetch", meaning: "run and retrieve a thrown object", arabic: "يَجْلِبُ الشَّيْء", example: "The golden retriever loved to fetch sticks from the pond." }
    ],
    sentences: [
      { context: "Faithful Companion", en: "The loyal sheepdog accompanied the farmer on his daily rounds across the fields.", ar: "رَافَقَ كَلْبُ الرِّعَايَةِ المُخْلِصُ المُزَارِعَ فِي جَوْلاتِهِ اليَوْمِيَّةِ عَبْرَ الحُقُولِ." },
      { context: "Herding Skill", en: "With keen intelligence and speed, the farm dog safely gathered the stray lambs.", ar: "بِذَكَاءٍ حَادٍّ وَسُرْعَةٍ خَاطِفَةٍ، جَمَعَ كَلْبُ المَزْرَعَةِ الحُمْلانَ الشَّارِدَةَ بِأَمَانٍ." },
      { context: "Welcoming Home", en: "The golden retriever wagged its tail excitedly when the children returned from school.", ar: "هَزَّ الكَلْبُ ذَيْلَهُ بِحَمَاسٍ كَبِيرٍ عِنْدَمَا عَادَ الأَطْفَالُ مِنَ المَدْرَسَةِ." }
    ]
  },
  "cat": {
    arabic: "قِطَّة (بِسَّة)",
    partOfSpeech: "noun",
    phonetic: "kæt",
    pronunciationTip: "Short 'a' vowel /æ/ as in 'hat', 'mat', or 'bat'.",
    collocations: ["barn cat", "purring cat", "pet the cat", "curled-up cat", "catch mice", "kitten"],
    phrasalVerbs: [
      { phrase: "curl up", meaning: "sleep in a rounded cozy ball", arabic: "يَلْتَفُّ لِلنَّوْم", example: "The tabby cat curled up in a sunny patch on the porch." }
    ],
    sentences: [
      { context: "Barn Patrol", en: "The nimble barn cat keeps the grain storage barn free of mice and rodents.", ar: "تُحَافِظُ قِطَّةُ الحَظِيرَةِ الرَّشِيقَةُ عَلَى مَخْزَنِ الحُبُوبِ خَالِياً مِنَ القَوَارِضِ." },
      { context: "Sunny Spot", en: "She smiled as the ginger cat purred softly while basking in the warm morning sun.", ar: "ابْتَسَمَتْ بَيْنَمَا كَانَتِ القِطَّةُ تَخْرْخِرُ بِهُدُوءٍ تَحْتَ أَشِعَّةِ شَمْسِ الصَّبَاحِ." },
      { context: "Agility", en: "The cat leaped gracefully onto the high wooden fence without making a sound.", ar: "قَفَزَتِ القِطَّةُ بِرَشَاقَةٍ فَوْقَ السِّيَاجِ الخَشَبِيِّ العَالِي دُونَ إِصْدَارِ أَيِّ صَوْتٍ." }
    ]
  },

  // --- FARM: BUILDINGS & STRUCTURES ---
  "barn": {
    arabic: "حَظِيرَة (زَرِيبَة)",
    partOfSpeech: "noun",
    phonetic: "bɑːrn",
    pronunciationTip: "Broad 'ar' vowel /ɑːr/ as in 'car' or 'farm'.",
    collocations: ["red barn", "inside the barn", "hay in the barn", "barn doors", "dairy barn", "wooden barn"],
    phrasalVerbs: [
      { phrase: "lead into", meaning: "guide animals into the barn", arabic: "يُدْخِلُ إِلَى الحَظِيرَة", example: "Lead the milk cows into the barn before it begins to rain." }
    ],
    sentences: [
      { context: "Farm Landmark", en: "The classic red wooden barn stores golden hay bales and shelters cattle in winter.", ar: "تَحْفَظُ الحَظِيرَةُ الخَشَبِيَّةُ الحَمْرَاءُ بَالاتِ القَشِّ وَتَأْوِي المَاشِيَةَ فِي الشِّتَاءِ." },
      { context: "Evening Chores", en: "They closed the heavy wooden barn doors securely after feeding the animals.", ar: "أَغْلَقُوا أَبْوَابَ الحَظِيرَةِ الخَشَبِيَّةِ الثَّقِيلَةَ بِإِحْكَامٍ بَعْدَ إِطْعَامِ الحَيَوَانَاتِ." },
      { context: "Hay Loft", en: "Pigeons nested high up in the rafters of the historic timber barn.", ar: "عَشَّشَ الحَمَامُ فِي الأَعَالِي بَيْنَ عَوَارِضِ الحَظِيرَةِ الخَشَبِيَّةِ التَّارِيخِيَّةِ." }
    ]
  },
  "farmhouse": {
    arabic: "بَيْتُ المَزْرَعَة (مَنْزِلٌ رِيفِيّ)",
    partOfSpeech: "noun",
    phonetic: "ˈfɑːrm.haʊs",
    pronunciationTip: "Compound noun: 'FARM' (/fɑːrm/) + 'HOUSE' (/haʊs/).",
    collocations: ["historic farmhouse", "cozy farmhouse", "farmhouse porch", "farmhouse kitchen", "white farmhouse", "brick farmhouse"],
    phrasalVerbs: [
      { phrase: "live in", meaning: "reside in a country farmhouse", arabic: "يَعِيشُ فِي بَيْتِ المَزْرَعَة", example: "Three generations of farmers lived in the stone farmhouse." }
    ],
    sentences: [
      { context: "Rural Home", en: "Smoke drifted gently from the chimney of the cozy two-story white farmhouse.", ar: "تَصَاعَدَ الدُّخَانُ بِرِفْقٍ مِنْ مَدْخَنَةِ بَيْتِ المَزْرَعَةِ الأَبْيَضِ المُؤَلَّفِ مِنْ طَابَقَيْنِ." },
      { context: "Country Kitchen", en: "The spacious farmhouse kitchen features a large rustic table and stone hearth.", ar: "يَتَمَيَّزُ مَطْبَخُ البَيْتِ الرِّيفِيِّ بِطَاوِلَةٍ رِيفِيَّةٍ ضَخْمَةٍ وَمَوْقِدٍ حَجَرِيٍّ دَافِئٍ." },
      { context: "Porch View", en: "From the welcoming front porch of the farmhouse, one can overlook rolling wheat fields.", ar: "مِنْ شُرْفَةِ بَيْتِ المَزْرَعَةِ الرَّئِيسِيَّةِ، يُمْكِنُكَ الإِطْلالُ عَلَى حُقُولِ القَمْحِ المُمْتَدَّةِ." }
    ]
  },
  "stable": {
    arabic: "إِسْطَبْل (مَأْوَى الخُيُول)",
    partOfSpeech: "noun",
    phonetic: "ˈsteɪ.bəl",
    pronunciationTip: "Long 'a' vowel /eɪ/ as in 'table', followed by soft /bəl/.",
    collocations: ["horse stable", "clean the stable", "stable stall", "wooden stable", "stable boy", "keep horses in a stable"],
    phrasalVerbs: [
      { phrase: "muck out", meaning: "clean animal waste from a stable", arabic: "يُنَظِّفُ الإِسْطَبْل", example: "He spent the morning mucking out the horses' stable stalls." }
    ],
    sentences: [
      { context: "Equine Care", en: "Each thoroughbred horse rests comfortably in a clean, straw-filled stable stall.", ar: "يَسْتَرِيحُ كُلُّ حِصَانٍ أَصِيلٍ فِي جَنَاحِهِ المَفْرُوشِ بِالقَشِّ النَّظِيفِ فِي الإِسْطَبْلِ." },
      { context: "Daily Routine", en: "The groom opens the stable doors every morning to let the horses out to pasture.", ar: "يَفْتَحُ السَّائِسُ أَبْوَابَ الإِسْطَبْلِ كُلَّ صَبَاحٍ لِتَنْطَلِقَ الخُيُولُ إِلَى المَرْعَى." },
      { context: "Facility Design", en: "The well-ventilated timber stable provides excellent protection during chilly winters.", ar: "يُوَفِّرُ الإِسْطَبْلُ الخَشَبِيُّ جَيِّدُ التَّهْوِيَةِ حِمَايَةً مُمْتَازَةً فِي لَيَالِي الشِّتَاءِ." }
    ]
  },
  "hen-house": {
    arabic: "خُمُّ الدَّجَاج (قُنُّ الدَّجَاج)",
    partOfSpeech: "noun",
    phonetic: "ˈhɛn ˌhaʊs",
    pronunciationTip: "Compound noun: 'HEN' (/hɛn/) + 'HOUSE' (/haʊs/).",
    collocations: ["wooden hen house", "clean the hen house", "eggs in the hen house", "hen house perch", "lock the hen house", "backyard hen house"],
    phrasalVerbs: [
      { phrase: "lock up", meaning: "secure hen house doors against predators", arabic: "يُقْفِلُ الخُمَّ لَيْلاً", example: "Always lock up the hen house at night to protect the chickens from foxes." }
    ],
    sentences: [
      { context: "Daily Chores", en: "The girl checked the nesting boxes inside the wooden hen house for fresh morning eggs.", ar: "تَفَقَّدَتِ الفَتَاةُ صَنَادِيقَ الأَعْشَاشِ فِي خُمِّ الدَّجَاجِ لِجَمْعِ البَيْضِ الصَّبَاحِيِّ." },
      { context: "Night Security", en: "The farmer securely latched the hen house door to keep out prowling night predators.", ar: "أَقْفَلَ المُزَارِعُ بَابَ خُمِّ الدَّجَاجِ بِإِحْكَامٍ لِحِمَايَةِ الطُّيُورِ مِنَ الثَّعَالِبِ." },
      { context: "Cleaning", en: "Spread fresh dry sawdust and straw across the floor of the hen house weekly.", ar: "افْرِشْ نُشَارَةَ الخَشَبِ وَالقَشَّ النَّظِيفَ عَلَى أَرْضِيَّةِ خُمِّ الدَّجَاجِ أُسْبُوعِيّاً." }
    ]
  },
  "silo": {
    arabic: "صَوْمَعَةُ غِلَال (صَوْمَعَة)",
    partOfSpeech: "noun",
    phonetic: "ˈsaɪ.loʊ",
    pronunciationTip: "Long 'i' diphthong /aɪ/ in 'SI' followed by long 'o' /loʊ/ (/ˈsaɪ.loʊ/).",
    collocations: ["grain silo", "tall silo", "concrete silo", "fill the silo", "metal silo", "silo tower"],
    phrasalVerbs: [
      { phrase: "fill up with", meaning: "load grains into a silo", arabic: "يَمْلَأُ الصَّوْمَعَة", example: "The conveyor filled up the silo with freshly harvested golden corn." }
    ],
    sentences: [
      { context: "Grain Storage", en: "The towering metal grain silo stores metric tons of harvested corn and wheat safely.", ar: "تَحْفَظُ صَوْمَعَةُ الغِلالِ المَعْدَنِيَّةُ الشَّاهِقَةُ أَطْنَاناً مِنَ الذُّرَةِ وَالقَمْحِ بِأَمَانٍ." },
      { context: "Farm Landscape", en: "Silver cylindrical silos reflect the brilliant afternoon sun across the prairie.", ar: "تَعْكِسُ الصَّوَامِعُ الأُسْطُوَانِيَّةُ الفِضِّيَّةُ أَشِعَّةَ شَمْسِ الظَّهِيرَةِ عَلَى السُّهُولِ." },
      { context: "Moisture Control", en: "Aeration fans inside the silo prevent grain spoilage and moisture buildup.", ar: "تَمْنَعُ مَرَاوِحُ التَّهْوِيَةِ دَاخِلَ الصَّوْمَعَةِ تَلَفَ الحُبُوبِ وَتَرَاكُمَ الرُّطُوبَةِ." }
    ]
  },
  "greenhouse": {
    arabic: "صَوْبَةٌ زِرَاعِيَّة (بَيْتٌ زُجَاجِيّ / دَفِيئَة)",
    partOfSpeech: "noun",
    phonetic: "ˈɡriːn.haʊs",
    pronunciationTip: "Compound noun with primary stress on 'GREEN' (/ˈɡriːn.haʊs/).",
    collocations: ["glass greenhouse", "grow in a greenhouse", "warm greenhouse", "greenhouse tomatoes", "commercial greenhouse", "greenhouse temperature"],
    phrasalVerbs: [
      { phrase: "grow in", meaning: "cultivate plants inside a greenhouse", arabic: "يَزْرَعُ فِي الصَّوْبَة", example: "They grow organic seedlings and herbs in the greenhouse all year." }
    ],
    sentences: [
      { context: "Year-Round Growing", en: "Tomatoes, cucumbers, and tender herbs thrive inside the warm, sunny glass greenhouse.", ar: "تَزْدَهِرُ الطَّمَاطِمُ وَالخِيَارُ وَالأَعْشَابُ الرَّقِيقَةُ دَاخِلَ الصَّوْبَةِ الزُّجَاجِيَّةِ الدَّافِئَةِ." },
      { context: "Seedling Starting", en: "In late February, the gardener starts pepper seeds in seedling trays in the greenhouse.", ar: "يَبْدَأُ البُسْتَانِيُّ زِرَاعَةَ بُذُورِ الفُلْفُلِ دَاخِلَ الصَّوْبَةِ فِي أَوَاخِرِ فِبْرَايِر." },
      { context: "Climate Control", en: "Automatic roof vents open to regulate internal humidity and temperature.", ar: "تُفْتَحُ فَتَحَاتُ التَّهْوِيَةِ السَّقْفِيَّةُ تِلْقَائِيّاً لِضَبْطِ الرُّطُوبَةِ وَالحَرَارَةِ دَاخِلَ الدَّفِيئَةِ." }
    ]
  },
  "shed": {
    arabic: "سَقِيفَة (كُوخُ أَدَوَات / مَخْزَنٌ خَشَبِيّ)",
    partOfSpeech: "noun",
    phonetic: "ʃɛd",
    pronunciationTip: "Short 'e' vowel /ɛ/ as in 'bed' or 'red'.",
    collocations: ["tool shed", "garden shed", "wooden shed", "keep in the shed", "storage shed", "potting shed"],
    phrasalVerbs: [
      { phrase: "put away in", meaning: "store garden tools in a shed", arabic: "يَحْفَظُ فِي السَّقِيفَة", example: "Put away the shovel and lawnmower inside the garden shed." }
    ],
    sentences: [
      { context: "Tool Storage", en: "He keeps his lawnmower, garden hoses, and pruning shears locked in the wooden shed.", ar: "يَحْتَفِظُ بِمِكْنَسَةِ العُشْبِ وَخَرَاطِيمِ المِيَاهِ وَالمَقَصَّاتِ دَاخِلَ السَّقِيفَةِ الخَشَبِيَّةِ." },
      { context: "Potting Plants", en: "The potting shed is equipped with wooden workbenches, flower pots, and rich soil.", ar: "تَمَّ تَجْهِيزُ كُوخِ الأَدَوَاتِ بِطَاوِلاتِ خَشَبٍ وَأَصَائِصَ لِتَشْتِيلِ الزُّهُورِ." },
      { context: "Organization", en: "Hang shovels and rakes neatly on wall brackets inside the tool shed.", ar: "عَلِّقِ المَجَارِفَ وَالمَشَابِكَ بِنِظَامٍ عَلَى حَوَامِلِ الجِدَارِ دَاخِلَ مَخْزَنِ الأَدَوَاتِ." }
    ]
  },
  "windmill": {
    arabic: "طَاحُونَةُ هَوَاء",
    partOfSpeech: "noun",
    phonetic: "ˈwɪnd.mɪl",
    pronunciationTip: "Compound noun: 'WIND' (/wɪnd/) + 'MILL' (/mɪl/).",
    collocations: ["wooden windmill", "blades of a windmill", "pump water with a windmill", "historic windmill", "turn of the windmill", "traditional windmill"],
    phrasalVerbs: [
      { phrase: "spin around", meaning: "rotate with the force of wind", arabic: "يَدُورُ مَعَ الرِّيَاح", example: "The large wooden windmill blades spun around in the brisk breeze." }
    ],
    sentences: [
      { context: "Pumping Water", en: "The traditional prairie windmill pumps fresh underground water for the pasture cattle.", ar: "تَضُخُّ طَاحُونَةُ الهَوَاءِ التَّقْلِيدِيَّةُ المِيَاهَ الجَوْفِيَّةَ لِمَاشِيَةِ المَرْعَى." },
      { context: "Historic Milling", en: "The historic stone windmill once ground grain into fine flour for local bakers.", ar: "كَانَتْ طَاحُونَةُ الهَوَاءِ الحَجَرِيَّةُ تَطْحَنُ الحُبُوبَ قَدِيماً إِلَى دَقِيقٍ نَاعِمٍ." },
      { context: "Clean Energy", en: "Modern wind turbines generate clean renewable electricity across windy rural plains.", ar: "تُوَلِّدُ عَنَفَاتُ الرِّيَاحِ الحَدِيثَةُ طَاقَةً كَهْرَبَائِيَّةً نَظِيفَةً عَبْرَ السُّهُولِ الرِّيفِيَّةِ." }
    ]
  },
  "well": {
    arabic: "بِئْرُ مَاء",
    partOfSpeech: "noun",
    phonetic: "wɛl",
    pronunciationTip: "Short 'e' vowel /ɛ/ as in 'bell' or 'tell'.",
    collocations: ["water well", "draw water from a well", "deep well", "stone well", "bucket in the well", "drinking well"],
    phrasalVerbs: [
      { phrase: "draw up", meaning: "pull up water using a bucket and rope", arabic: "يَسْحَبُ المَاءَ مِنَ البِئْر", example: "They drew up a bucket of icy cold water from the deep stone well." }
    ],
    sentences: [
      { context: "Fresh Groundwater", en: "They lowered a wooden bucket into the deep stone well to draw cool drinking water.", ar: "أَنْزَلُوا دَلْواً خَشَبِيّاً فِي البِئْرِ الحَجَرِيِّ العَمِيقِ لِسَحْبِ مَاءِ الشُّرْبِ العَذْبِ." },
      { context: "Rural Supply", en: "The farm relies on a modern borehole well for irrigating crops and watering livestock.", ar: "تَعْتَمِدُ المَزْرَعَةُ عَلَى بِئْرٍ ارْتِوَازِيٍّ حَدِيثٍ لِرَيِّ المَحَاصِيلِ وَسِقَايَةِ المَاشِيَةِ." },
      { context: "Heritage Charm", en: "An old wishing well made of weathered fieldstones decorates the farmhouse lawn.", ar: "تُزَيِّنُ بِئْرٌ حَجَرِيَّةٌ أَثَرِيَّةٌ جَمِيلَةٌ حَدِيقَةَ بَيْتِ المَزْرَعَةِ الرِّيفِيِّ." }
    ]
  },
  "fence": {
    arabic: "سِيَاج (سُور)",
    partOfSpeech: "noun",
    phonetic: "fɛns",
    pronunciationTip: "Short 'e' vowel /ɛ/ as in 'pen', ending in soft 's' sound.",
    collocations: ["wooden fence", "white picket fence", "wire fence", "build a fence", "fence around the pasture", "jump the fence"],
    phrasalVerbs: [
      { phrase: "fence in", meaning: "enclose an area with a fence", arabic: "يُحِيطُ بِسِيَاج", example: "The farmer fenced in the north pasture to keep the sheep safe." },
      { phrase: "mend", meaning: "repair broken fence sections", arabic: "يُصْلِحُ السِّيَاج", example: "He spent Saturday mending broken fence rails along the road." }
    ],
    sentences: [
      { context: "Pasture Boundary", en: "A sturdy wooden split-rail fence encircles the entire thirty-acre horse pasture.", ar: "يُحِيطُ سِيَاجٌ خَشَبِيٌّ مَتِينٌ بِمَرْعَى الخُيُولِ المُتَمَدِّدِ عَلَى 30 فَدَّاناً." },
      { context: "Cottage Charm", en: "A classic white picket fence and flowering roses frame the front garden.", ar: "يُؤَطِّرُ سِيَاجٌ أَبْيَضُ أَنِيقٌ مَعَ زُهُورِ الجُورِي حَدِيقَةَ المَنْزِلِ الأَمَامِيَّةَ." },
      { context: "Security", en: "Regularly inspect the perimeter wire fence to prevent livestock from wandering onto roads.", ar: "افْحَصِ السِّيَاجَ السِّلْكِيَّ بِانْتِظَامٍ لِمَنْعِ خُرُوجِ المَاشِيَةِ إِلَى الطَّرِيقِ." }
    ]
  },

  // --- FARM: TOOLS & EQUIPMENT ---
  "tractor": {
    arabic: "جَرَّارٌ زِرَاعِيّ (تَرَاكْتُور)",
    partOfSpeech: "noun",
    phonetic: "ˈtræk.tər",
    pronunciationTip: "Short 'a' vowel /æ/ in first syllable (/ˈtræk.tər/).",
    collocations: ["drive a tractor", "farm tractor", "heavy tractor", "tractor engine", "pull with a tractor", "green tractor"],
    phrasalVerbs: [
      { phrase: "plow up", meaning: "turn over soil using tractor attachments", arabic: "يَحْرُثُ بِالجَرَّار", example: "The farmer plowed up the field with his heavy diesel tractor." }
    ],
    sentences: [
      { context: "Field Work", en: "The farmer drove the green diesel tractor across the vast field to plant wheat seeds.", ar: "قَادَ المُزَارِعُ الجَرَّارَ الزِّرَاعِيَّ الأَخْضَرَ عَبْرَ الحَقْلِ الوَاسِعِ لِبَذْرِ القَمْحِ." },
      { context: "Hauling Hay", en: "A powerful tractor pulled a heavy flatbed trailer loaded with sixty hay bales.", ar: "سَحَبَ الجَرَّارُ القَوِيُّ مَقْطُورَةً ثَقِيلَةً مُحَمَّلَةً بِـ 60 بَالَةَ قَشٍّ." },
      { context: "Maintenance", en: "Check the tractor's engine oil, tire pressures, and hydraulics before harvest season.", ar: "تَفَقَّدْ زَيْتَ مُحَرِّكِ الجَرَّارِ وَضَغْطَ الإِطَارَاتِ قَبْلَ بَدْءِ مَوْسِمِ الحَصَادِ." }
    ]
  },
  "plow": {
    arabic: "مِحْرَاث",
    partOfSpeech: "noun",
    phonetic: "plaʊ",
    pronunciationTip: "Diphthong 'ow' sound /aʊ/ as in 'now' or 'how'. Also spelled 'plough' in British English.",
    collocations: ["tractor plow", "plow the field", "heavy plow", "sharp plow blade", "horse-drawn plow", "turn soil with a plow"],
    phrasalVerbs: [
      { phrase: "plow through", meaning: "move forcefully through soil or work", arabic: "يَشُقُّ طَرِيقَهُ", example: "The tractor plowed through the tough dry soil with ease." }
    ],
    sentences: [
      { context: "Soil Preparation", en: "The steel plow turned over the dark rich soil, preparing the ground for spring planting.", ar: "قَلَّبَ المِحْرَاثُ الفُولاذِيُّ التُّرْبَةَ الخَصْبَةَ لِتَجْهِيزِ الأَرْضِ لِزِرَاعَةِ الرَّبِيعِ." },
      { context: "Historical Farming", en: "Centuries ago, farmers used pairs of strong oxen to pull heavy wooden plows.", ar: "قَبْلَ قُرُونٍ، اسْتَخْدَمَ المُزَارِعُونَ الثِّيرَانَ القَوِيَّةَ لِسَحْبِ المَحَارِيثِ الخَشَبِيَّةِ." },
      { context: "Modern Implements", en: "Multi-furrow hydraulic plows allow one tractor to cultivate dozens of acres daily.", ar: "تُتِيحُ المَحَارِيثُ الهَيْدْرُولِيكِيَّةُ الحَدِيثَةُ حِرَاثَةَ عَشَرَاتِ الأَفْدِنَةِ يَوْمِيّاً." }
    ]
  },
  "trailer": {
    arabic: "مَقْطُورَة (عَرَبَةُ نَقْل)",
    partOfSpeech: "noun",
    phonetic: "ˈtreɪ.lər",
    pronunciationTip: "Long 'a' vowel /eɪ/ as in 'train', followed by /lər/.",
    collocations: ["tractor trailer", "load the trailer", "heavy trailer", "hay trailer", "livestock trailer", "flatbed trailer"],
    phrasalVerbs: [
      { phrase: "hitch up", meaning: "connect a trailer to a tractor or truck", arabic: "يَصِلُ المَقْطُورَة", example: "He hitched up the flatbed trailer to haul the lumber." },
      { phrase: "load onto", meaning: "put goods on trailer", arabic: "يُحَمِّلُ عَلَى المَقْطُورَة", example: "They loaded crates of fresh apples onto the farm trailer." }
    ],
    sentences: [
      { context: "Harvest Transport", en: "Workers loaded crates of sweet crisp apples onto the tractor trailer in the orchard.", ar: "حَمَّلَ العُمَّالُ صَنَادِيقَ التُّفَّاحِ الطَّازَجِ عَلَى مَقْطُورَةِ الجَرَّارِ فِي البُسْتَانِ." },
      { context: "Livestock Moving", en: "They used an enclosed aluminum livestock trailer to transport heifers safely to the show.", ar: "اسْتَخْدَمُوا مَقْطُورَةَ مَاشِيَةٍ مُقْفَلَةً لِنَقْلِ العُجُولِ بِأَمَانٍ لِلْمَعْرِضِ." },
      { context: "Hay Hauling", en: "The flatbed trailer carried dozens of rectangular straw bales back to the storage barn.", ar: "نَقَلَتِ المَقْطُورَةُ المُنْبَسِطَةُ عَشَرَاتِ بَالاتِ القَشِّ إِلَى حَظِيرَةِ التَّخْزِينِ." }
    ]
  },
  "wheelbarrow": {
    arabic: "عَرَبَةُ يَد (بَرُوِيطَة)",
    partOfSpeech: "noun",
    phonetic: "ˈwiːlˌbær.oʊ",
    pronunciationTip: "Compound noun: 'WHEEL' (/wiːl/) + 'BARROW' (/ˈbær.oʊ/).",
    collocations: ["push a wheelbarrow", "wheelbarrow of soil", "heavy wheelbarrow", "garden wheelbarrow", "metal wheelbarrow", "load the wheelbarrow"],
    phrasalVerbs: [
      { phrase: "wheel around", meaning: "push and transport items in a barrow", arabic: "يَنْقُلُ بِالعَرَبَة", example: "He wheeled around a load of mulch for the flower beds." },
      { phrase: "tip out", meaning: "dump contents from wheelbarrow", arabic: "يَقْلِبُ / يُفْرِغُ الحُمُولَة", example: "Tip out the gravel near the garden pathway." }
    ],
    sentences: [
      { context: "Gardening Chores", en: "He wheeled a barrow full of dark organic compost to enrich the raised garden beds.", ar: "دَفَعَ عَرَبَةَ يَدٍ مَلِيئَةً بِالسَّمَادِ العُضْوِيِّ لِتَغْذِيَةِ أَحْوَاضِ الزِّرَاعَةِ." },
      { context: "Heavy Lifting", en: "The pneumatic rubber tire makes it easy to push heavy wheelbarrows across uneven ground.", ar: "يُسَهِّلُ الإِطَارُ المَطَّاطِيُّ دَفْعَ عَرَبَةِ اليَدِ الثَّقِيلَةِ عَبْرَ الأَرْضِ غَيْرِ المُسْتَوِيَةِ." },
      { context: "Hauling Produce", en: "She loaded freshly picked orange pumpkins into the wheelbarrow for market transport.", ar: "حَمَّلَتْ ثِمَارَ اليَقْطِينِ البُرْتُقَالِيَّةِ المَقْطُوفَةِ فِي عَرَبَةِ اليَدِ لِنَقْلِهَا لِلسُّوقِ." }
    ]
  },
  "pitchfork": {
    arabic: "مِذْرَاة (مِذْرَاةُ قَشّ)",
    partOfSpeech: "noun",
    phonetic: "ˈpɪtʃ.fɔːrk",
    pronunciationTip: "Compound noun: 'PITCH' (/pɪtʃ/) + 'FORK' (/fɔːrk/).",
    collocations: ["steel pitchfork", "lift hay with a pitchfork", "three-prong pitchfork", "pitchfork handle", "toss with a pitchfork", "barn pitchfork"],
    phrasalVerbs: [
      { phrase: "pitch up", meaning: "toss hay or straw using a pitchfork", arabic: "يَرْفَعُ القَشَّ بِالمِذْرَاة", example: "Pitch up the dry straw into the animal bedding stalls." }
    ],
    sentences: [
      { context: "Hay Handling", en: "He used a long-handled steel pitchfork to toss fresh golden hay into the cattle mangers.", ar: "اسْتَخْدَمَ مِذْرَاةً فُولاذِيَّةً طَوِيلَةَ المِقْبَضِ لِرَفْعِ القَشِّ الذَّهَبِيِّ لِمَعَالِفِ الأَبْقَارِ." },
      { context: "Barn Cleaning", en: "The farmhand gathered loose straw across the barn floor with a four-prong pitchfork.", ar: "جَمَعَ عَامِلُ المَزْرَعَةِ القَشَّ المُتَنَاثِرَ بِاسْتِخْدَامِ مِذْرَاةٍ رُبَاعِيَّةِ الأَسْنَانِ." },
      { context: "Tool Safety", en: "Always stand pitchforks securely upright in tool racks when not in use.", ar: "ثَبِّتِ المَذَارِيَ دَائِماً بِأَمَانٍ فِي حَوَامِلِ الأَدَوَاتِ عِنْدَ الاِنْتِهَاءِ مِنْهَا." }
    ]
  },
  "shovel": {
    arabic: "مِجْرَفَة (كُورِيك)",
    partOfSpeech: "noun",
    phonetic: "ˈʃʌv.əl",
    pronunciationTip: "Short 'u' sound /ʌ/ as in 'shove' or 'love', followed by soft /əl/.",
    collocations: ["dig with a shovel", "snow shovel", "metal shovel", "shovel of dirt", "pointed shovel", "garden shovel"],
    phrasalVerbs: [
      { phrase: "shovel up", meaning: "lift and scoop loose material", arabic: "يَجْرُفُ", example: "Shovel up the loose dirt and transfer it to the wheelbarrow." },
      { phrase: "dig up", meaning: "excavate ground with a shovel", arabic: "يَحْفِرُ بِالمِجْرَفَة", example: "Dig up a deep trench for planting the new fruit trees." }
    ],
    sentences: [
      { context: "Digging", en: "The gardener used a sturdy pointed shovel to dig deep planting holes for apple trees.", ar: "اسْتَخْدَمَ البُسْتَانِيُّ مِجْرَفَةً مَتِينَةً مُدَبَّبَةً لِحَفْرِ جُوَرِ غَرْسِ أَشْجَارِ التُّفَّاحِ." },
      { context: "Winter Chores", en: "After the heavy winter snowfall, he shoveled a clear walking path to the barn.", ar: "بَعْدَ تَسَاقُطِ الثُّلُوجِ الشَّتْوِيَّةِ، جَرَفَ مَمَرّاً آمِناً لِلْمَشْيِ إِلَى الحَظِيرَةِ." },
      { context: "Compost Handling", en: "She scooped dark aged compost with a square shovel to top-dress the garden beds.", ar: "غَرَفَتِ السَّمَادَ النَّاضِجَ بِمِجْرَفَةٍ مُرَبَّعَةٍ لِتَغْذِيَةِ تُرْبَةِ الحَدِيقَةِ." }
    ]
  },
  "hoe": {
    arabic: "مِسْحَاة (فَأْسٌ زِرَاعِيَّة / مِعْزَقَة)",
    partOfSpeech: "noun",
    phonetic: "hoʊ",
    pronunciationTip: "Long 'o' vowel /oʊ/ as in 'toe' or 'go'.",
    collocations: ["garden hoe", "weed with a hoe", "draw hoe", "sharp hoe", "hoe between rows", "metal hoe blade"],
    phrasalVerbs: [
      { phrase: "chop down", meaning: "sever weed roots with a hoe", arabic: "يَعْزِقُ الحَشَائِش", example: "Chop down stubborn weeds between the tomato rows with a sharp hoe." }
    ],
    sentences: [
      { context: "Weeding Crops", en: "She used a sharp garden hoe to clear unwanted weeds between the vegetable rows.", ar: "اسْتَخْدَمَتْ مِعْزَقَةَ حَدِيقَةٍ حَادَّةً لِإِزَالَةِ الحَشَائِشِ الضَّارَّةِ بَيْنَ صُفُوفِ الخُضَارِ." },
      { context: "Soil Loosening", en: "Hoeing the topsoil prevents weed germination and aerates the root zone.", ar: "يَمْنَعُ عَزْقُ التُّرْبَةِ السَّطْحِيَّةِ نُمُوَّ الحَشَائِشِ وَيُهَوِّي جُذُورَ النَّبَاتَاتِ." },
      { context: "Making Furrows", en: "Use the corner of the hoe blade to draw straight furrows for planting carrot seeds.", ar: "اسْتَخْدِمْ طَرَفَ شَفْرَةِ الفَأْسِ لِرَسْمِ خُطُوطٍ مُسْتَقِيمَةٍ لِبَذْرِ الجَزَرِ." }
    ]
  },
  "rake": {
    arabic: "مِشْطُ حَدِيقَة (مِجْرَفَةُ أَوْرَاق)",
    partOfSpeech: "noun",
    phonetic: "reɪk",
    pronunciationTip: "Long 'a' vowel /eɪ/ as in 'make' or 'cake'.",
    collocations: ["leaf rake", "garden rake", "rake leaves", "pile of leaves with a rake", "steel garden rake", "smooth the soil with a rake"],
    phrasalVerbs: [
      { phrase: "rake up", meaning: "gather leaves or debris into piles", arabic: "يَجْمَعُ بِالمِشْط", example: "Rake up the fallen autumn leaves across the lawn into piles." },
      { phrase: "smooth out", meaning: "level soil using a metal rake", arabic: "يُسَوِّي الأَرْض", example: "Smooth out the garden bed before sowing flower seeds." }
    ],
    sentences: [
      { context: "Autumn Cleanup", en: "The children had fun raking up golden autumn leaves into a gigantic pile to jump in.", ar: "اسْتَمْتَعَ الأَطْفَالُ بِجَمْعِ أَوْرَاقِ الخَرِيفِ الذَّهَبِيَّةِ بِالمِشْطِ فِي كَوْمَةٍ كَبِيرَةٍ." },
      { context: "Soil Leveling", en: "He used a heavy steel garden rake to break up soil clods and level the seedbed.", ar: "اسْتَخْدَمَ مِشْطَ حَدِيقَةٍ صُلْباً لِتَفْتِيتِ كُتَلِ التُّرْبَةِ وَتَسْوِيَةِ مَهْدِ البُذُورِ." },
      { context: "Gravel Driveways", en: "Smooth the gravel driveway with a wide rake to eliminate ruts after heavy rain.", ar: "سَوِّ مَمَرَّ الحَصَى بِمِشْطٍ عَرِيضٍ لِإِزَالَةِ الأَخَادِيدِ بَعْدَ هُطُولِ المَطَرِ." }
    ]
  },
  "bucket": {
    arabic: "دَلْو (جَرْدَل)",
    partOfSpeech: "noun",
    phonetic: "ˈbʌk.ɪt",
    pronunciationTip: "Short 'u' sound /ʌ/ as in 'cup', followed by short /ɪt/.",
    collocations: ["bucket of water", "metal bucket", "plastic bucket", "fill the bucket", "carry a bucket", "milking bucket"],
    phrasalVerbs: [
      { phrase: "fill up", meaning: "fill a bucket with water or feed", arabic: "يَمْلَأُ الدَّلْو", example: "Fill up the bucket with clean tap water for the calves." },
      { phrase: "pour out", meaning: "empty liquid from bucket", arabic: "يَسْكُبُ مِنَ الجَرْدَل", example: "Pour out the soapy water after washing the floor." }
    ],
    sentences: [
      { context: "Feeding Animals", en: "She carried two heavy plastic buckets filled with nutritious grain to the horse stalls.", ar: "حَمَلَتْ دَلْوَيْنِ بَلاسْتِيكِيَّيْنِ ثَقِيلَيْنِ مَلِيئَيْنِ بِالحُبُوبِ المُغَذِّيَةِ لِلْخُيُولِ." },
      { context: "Milking", en: "The farmer sat on a low stool and squeezed fresh milk into a stainless steel bucket.", ar: "جَلَسَ المُزَارِعُ عَلَى مَقْعَدٍ قَصِيرٍ وَحَلَبَ الحَلِيبَ الطَّازَجَ فِي دَلْوٍ سْتَانْلِس." },
      { context: "Washing Vehicles", en: "Fill the bucket with warm water and car soap to wash down the farm truck.", ar: "امْلَأِ الدَّلْوَ بِمَاءٍ دَافِئٍ وَصَابُونٍ لِغَسْلِ شَاحِنَةِ المَزْرَعَةِ." }
    ]
  },
  "watering-can": {
    arabic: "رَشَّاشُ مَاء (كَنَكَةُ رَيّ / مِرَشَّة)",
    partOfSpeech: "noun",
    phonetic: "ˈwɔː.tər.ɪŋ ˌkæn",
    pronunciationTip: "Compound noun: 'WATERING' (/ˈwɔː.tər.ɪŋ/) + 'CAN' (/kæn/).",
    collocations: ["fill the watering can", "gentle shower from watering can", "metal watering can", "garden watering can", "water flowers with a can", "long-spout watering can"],
    phrasalVerbs: [
      { phrase: "water down", meaning: "give plants gentle moisture", arabic: "يَرْوِي بِالمِرَشَّة", example: "Water down the newly planted herb seedlings with a gentle rose spout." }
    ],
    sentences: [
      { context: "Plant Care", en: "She used a vintage copper watering can to gently hydrate her potted geraniums.", ar: "اسْتَخْدَمَتْ مِرَشَّةَ مَاءٍ نُحَاسِيَّةً أَنِيقَةً لِرَيِّ زُهُورِ الجِيرَانْيُوم فِي الأَصَائِصِ." },
      { context: "Gentle Watering", en: "The rose attachment on the watering can creates a soft sprinkle that won't harm young sprouts.", ar: "تَصْنَعُ فُوَّهَةُ المِرَشَّةِ رَذَاذاً لَطِيفاً لا يُؤْذِي البَرَاعِمَ الصَّغِيرَةَ." },
      { context: "Indoor Plants", en: "A long-spout watering can reaches easily between dense foliage without spilling.", ar: "تَصِلُ مِرَشَّةُ المَاءِ ذَاتُ الفُوَّهَةِ الطَّوِيلَةِ بَيْنَ أَوْرَاقِ النَّبَاتَاتِ دُونَ انْسِكَابٍ." }
    ]
  },

  // --- FARM: CROPS, PRODUCE & NATURE ---
  "wool": {
    arabic: "صُوف",
    partOfSpeech: "noun",
    phonetic: "wʊl",
    pronunciationTip: "Short 'oo' vowel /ʊ/ as in 'wood' or 'book'.",
    collocations: ["pure wool", "sheep's wool", "spin wool", "warm wool sweater", "wool blanket", "raw fleece wool"],
    phrasalVerbs: [
      { phrase: "spin into", meaning: "twist raw wool fibers into yarn", arabic: "يَغْزِلُ الصُّوف", example: "The artisan spun raw washed wool into durable knitting yarn." }
    ],
    sentences: [
      { context: "Natural Fiber", en: "Natural sheep's wool is water-resistant, breathable, and wonderfully warm in freezing weather.", ar: "يَتَمَيَّزُ صُوفُ الأَغْنَامِ الطَّبِيعِيُّ بِمُقَاوَمَتِهِ لِلْمَاءِ وَدِفْئِهِ الفَائِقِ فِي البَرْدِ." },
      { context: "Crafts & Textiles", en: "She washed and carded the raw fleece wool before spinning it on an old wooden wheel.", ar: "غَسَلَتْ وَمَشَّطَتْ صُوفَ الفَرْوِ الخَامَ قَبْلَ غَزْلِهِ عَلَى مِغْزَلٍ خَشَبِيٍّ." },
      { context: "Clothing", en: "Handmade socks and sweaters knitted from pure merino wool last for decades.", ar: "تَدُومُ الجَوَارِبُ وَالكَنْزَاتُ المَحْبُوكَةُ مِنْ صُوفِ المِيرِينُو النَّقِيِّ لِعُقُودٍ." }
    ]
  },
  "hay": {
    arabic: "قَشّ / دْرِيس (عَلَفٌ مُجَفَّف)",
    partOfSpeech: "noun",
    phonetic: "heɪ",
    pronunciationTip: "Long 'a' vowel /eɪ/ as in 'day' or 'say'.",
    collocations: ["bale of hay", "hay stack", "feed hay", "fresh hay", "sweet alfalfa hay", "hay loft"],
    phrasalVerbs: [
      { phrase: "bale up", meaning: "compress dry grass into tight bales", arabic: "يَحْزِمُ القَشَّ فِي بَالات", example: "The baler baled up the cut grass into hundred-pound rectangular hay bales." },
      { phrase: "hit the hay", meaning: "(idiom) go to bed for sleep", arabic: "يَذْهَبُ لِلنَّوْم", example: "I am exhausted after the harvest, so I'm going to hit the hay." }
    ],
    sentences: [
      { context: "Livestock Feed", en: "The horses happily munched on sweet, fragrant alfalfa hay inside the warm barn.", ar: "تَنَاوَلَتِ الخُيُولُ بِسَعَادَةٍ دْرِيسَ البَرْسِيمِ الحِجَازِيِّ العَطِرَ فِي الحَظِيرَةِ." },
      { context: "Summer Harvesting", en: "Farmers cut, sun-dry, and bale nutritious meadow hay during warm sunny July weeks.", ar: "يَقُومُ المُزَارِعُونَ بِحَصْدِ وَتَجْفِيفِ وَحَزْمِ قَشِّ المُرُوجِ فِي شَهْرِ يُولْيُو المُشْمِسِ." },
      { context: "Storage", en: "Keep hay stacked tightly in dry, ventilated lofts to prevent dampness and mold.", ar: "احْفَظِ القَشَّ مَرْصُوصاً فِي أَمَاكِنَ جَافَّةٍ وَمُهَوَّاةٍ لِمَنْعِ العُفُونَةِ." }
    ]
  },
  "straw": {
    arabic: "تِبْن (قَشُّ زِرَاعَة)",
    partOfSpeech: "noun",
    phonetic: "strɔː",
    pronunciationTip: "Broad 'aw' sound /strɔː/ as in 'draw' or 'law'.",
    collocations: ["straw bedding", "bale of straw", "straw hat", "golden straw", "spread straw", "drinking straw"],
    phrasalVerbs: [
      { phrase: "spread out", meaning: "scatter straw across barn stalls", arabic: "يَفْرِشُ التِّبْنَ كَفِرَاش", example: "Spread out fresh golden straw for comfortable animal bedding." }
    ],
    sentences: [
      { context: "Animal Bedding", en: "The farmer spread clean, dry wheat straw across the barn floor for cozy calf bedding.", ar: "فَرَشَ المُزَارِعُ تِبْنَ القَمْحِ الجَافَّ النَّظِيفَ عَلَى أَرْضِيَّةِ الحَظِيرَةِ لِتَدْفِئَةِ العُجُولِ." },
      { context: "Garden Mulch", en: "Layer golden straw around strawberry plants to retain soil moisture and suppress weeds.", ar: "ضَعْ طَبَقَةً مِنْ قَشِّ الزِّرَاعَةِ حَوْلَ شُجَيْرَاتِ الفَرَاوِلَةِ لِحِفْظِ الرُّطُوبَةِ وَمَنْعِ الحَشَائِشِ." },
      { context: "Sun Protection", en: "He wore a wide-brimmed woven straw hat to shield his neck from the blazing midday sun.", ar: "ارْتَدَى قُبَّعَةَ قَشٍّ عَرِيضَةَ الحَوَافِّ لِحِمَايَةِ عُنُقِهِ مِنْ أَشِعَّةِ الشَّمْسِ الحَارِقَةِ." }
    ]
  },
  "jam": {
    arabic: "مُرَبَّى",
    partOfSpeech: "noun",
    phonetic: "dʒæm",
    pronunciationTip: "Short 'a' vowel /æ/ as in 'ham' or 'slam'.",
    collocations: ["strawberry jam", "spread jam", "jar of jam", "homemade jam", "sweet raspberry jam", "toast with butter and jam"],
    phrasalVerbs: [
      { phrase: "spread on", meaning: "apply jam over bread or scones", arabic: "يَدْهَنُ المُرَبَّى", example: "Spread sweet blackberry jam over fresh warm scones." },
      { phrase: "jam-packed", meaning: "(idiom) completely full", arabic: "مُمْتَلِئٌ عَنْ آخِرِهِ", example: "The farmer's market was jam-packed with shoppers." }
    ],
    sentences: [
      { context: "Breakfast Treat", en: "She spread a generous spoonful of homemade strawberry jam onto her buttered toast.", ar: "دَهَنَتْ مِلْعَقَةً وَفِيرَةً مِنْ مُرَبَّى الفَرَاوِلَةِ المَنْزِلِيِّ عَلَى خُبْزِهَا المَحْمُوصِ بِالزُّبْدَةِ." },
      { context: "Canning & Preserves", en: "Every summer, grandmother simmers fresh ripe berries and cane sugar into glossy jars of jam.", ar: "فِي كُلِّ صَيْفٍ، تَطْبُخُ الجَدَّةُ التُّوتَ النَّاضِجَ مَعَ السُّكَّرِ لِعَمَلِ بَرَاِطِيمَ مُرَبَّى لامِعَةٍ." },
      { context: "Baking", en: "Warm apricot jam is brushed over fruit tarts to give them a professional glossy finish.", ar: "تُدْهَنُ فَطَائِرُ الفَوَاكِهِ بِمُرَبَّى المِشْمِشِ الدَّافِئِ لِإِعْطَائِهَا لَمَعَاناً رَائِعاً." }
    ]
  },
  "farmer": {
    arabic: "مُزَارِع (فَلَّاح)",
    partOfSpeech: "noun",
    phonetic: "ˈfɑːr.mər",
    pronunciationTip: "Broad 'ar' vowel /ɑːr/ in first syllable (/ˈfɑːr.mər/).",
    collocations: ["local farmer", "organic farmer", "dairy farmer", "farmer's market", "hardworking farmer", "farmer in the field"],
    phrasalVerbs: [
      { phrase: "work on", meaning: "cultivate the land continuously", arabic: "يَعْمَلُ فِي الأَرْض", example: "The dedicated farmer worked on the land from dawn to dusk." }
    ],
    sentences: [
      { context: "Daily Dedication", en: "The hardworking farmer rises before sunrise every day to tend his crops and livestock.", ar: "يَسْتَيْقِظُ المُزَارِعُ المُجِدُّ قَبْلَ شُرُوقِ الشَّمْسِ لِرِعَايَةِ مَحَاصِيلِهِ وَحَيَوَانَاتِهِ." },
      { context: "Local Market", en: "Local farmers sell fresh organic vegetables and artisanal cheeses at the weekend market.", ar: "يَبِيعُ المُزَارِعُونَ المَحَلِّيُّونَ خُضْرَاوَاتٍ عُضْوِيَّةً طَازَجَةً فِي سُوقِ عُطْلَةِ الأُسْبُوعِ." },
      { context: "Agricultural Expertise", en: "Generations of knowledge help the farmer read soil health, rainfall, and seasonal weather patterns.", ar: "تُمَكِّنُ الخِبْرَةُ المُتَوَارَثَةُ الفَلَّاحَ مِنْ مَعْرِفَةِ خُصُوبَةِ التُّرْبَةِ وَمَوَاعِيدِ الأَمْطَارِ." }
    ]
  },
  "scarecrow": {
    arabic: "فَزَّاعَةُ طُيُور (خَيَالُ المَآتَة)",
    partOfSpeech: "noun",
    phonetic: "ˈskɛər.kroʊ",
    pronunciationTip: "Compound noun: 'SCARE' (/skɛər/) + 'CROW' (/kroʊ/).",
    collocations: ["straw scarecrow", "stand like a scarecrow", "scarecrow in the field", "old clothes on a scarecrow", "frighten birds with a scarecrow", "cornfield scarecrow"],
    phrasalVerbs: [
      { phrase: "scare away", meaning: "frighten pests or birds away from crops", arabic: "يُخِيفُ الطُّيُورَ وَيَطْرُدُهَا", example: "The scarecrow helps scare away crows from the sweet corn." }
    ],
    sentences: [
      { context: "Crop Protection", en: "A straw-stuffed scarecrow dressed in flannel shirts and an old hat guards the sweet corn patch.", ar: "تَحْرُسُ فَزَّاعَةٌ مَحْشُوَّةٌ بِالقَشِّ تَرْتَدِي قَمِيصاً صُوفِيّاً حَقْلَ الذُّرَةِ الحُلْوَةِ." },
      { context: "Autumn Tradition", en: "Children built a smiling pumpkin-headed scarecrow to celebrate the autumn harvest festival.", ar: "صَنَعَ الأَطْفَالُ خَيَالَ مَآتَةٍ بِرَأْسِ يَقْطِينٍ بَاسِمٍ لِلاِحْتِفَالِ بِمَوْسِمِ الحَصَادِ." },
      { context: "Field Landscape", en: "The lonely scarecrow stood motionless against the colorful orange and violet evening sunset.", ar: "وَقَفَتِ الفَزَّاعَةُ سَاكِنَةً فِي الحَقْلِ أَمَامَ أَلْوَانِ غُرُوبِ الشَّمْسِ البُرْتُقَالِيَّةِ السَّاحِرَةِ." }
    ]
  },
  "pond": {
    arabic: "بِرْكَةُ مَاء (غَدِير)",
    partOfSpeech: "noun",
    phonetic: "pɑːnd",
    pronunciationTip: "Short open 'o' vowel /ɑː/ as in 'pond' or 'bond'.",
    collocations: ["duck pond", "swim in the pond", "calm pond", "lily pads on the pond", "fish pond", "farm pond"],
    phrasalVerbs: [
      { phrase: "swim across", meaning: "paddle through the water", arabic: "يَسْبَحُ عَبْرَ البِرْكَة", example: "The mallard ducks swam across the lily-covered farm pond." }
    ],
    sentences: [
      { context: "Wildlife Oasis", en: "Green bullfrogs croaked peacefully along the muddy banks of the willow-shaded farm pond.", ar: "نَقَّتِ الضَّفَادِعُ الخَضْرَاءُ بِهُدُوءٍ عَلَى ضِفَافِ بِرْكَةِ المَزْرَعَةِ المُظَلَّلَةِ بِالصَّفْصَافِ." },
      { context: "Water Lily", en: "Pink and white water lilies bloomed beautifully across the calm surface of the fish pond.", ar: "تَفَتَّحَتْ زَنَابِقُ المَاءِ الوَرْدِيَّةُ وَالبَيْضَاءُ بِرَوْعَةٍ عَلَى سَطْحِ البِرْكَةِ الهَادِئَةِ." },
      { context: "Livestock Water", en: "Cattle gather near the deep farm pond during hot summer afternoons to drink and cool off.", ar: "تَجْتَمِعُ المَاشِيَةُ قُرْبَ بِرْكَةِ المَاءِ فِي أَيَّامِ الصَّيْفِ لِلشُّرْبِ وَالتَّبَرُّدِ." }
    ]
  },
  "mud": {
    arabic: "طِين (وَحْل)",
    partOfSpeech: "noun",
    phonetic: "mʌd",
    pronunciationTip: "Short 'u' sound /ʌ/ as in 'bud' or 'cup'.",
    collocations: ["thick mud", "stuck in the mud", "mud puddle", "caked with mud", "walk through mud", "boots covered in mud"],
    phrasalVerbs: [
      { phrase: "get stuck in", meaning: "be trapped in deep mud", arabic: "يَعْلَقُ فِي الوَحْل", example: "The tractor tires got stuck in the wet spring mud." }
    ],
    sentences: [
      { context: "Wet Weather", en: "Heavy spring rains turned the farmyard dirt pathways into thick, slippery brown mud.", ar: "حَوَّلَتْ أَمْطَارُ الرَّبِيعِ الغَزِيرَةُ مَسَارَاتِ المَزْرَعَةِ إِلَى طِينٍ بُنِّيٍّ لَزِجٍ وَزَلِقٍ." },
      { context: "Pigs Cooling", en: "Pigs wallow in the cool wet mud to regulate their body temperature during hot summer days.", ar: "تَتَمَرَّغُ الخَنَازِيرُ فِي الوَحْلِ البَارِدِ لِتَعْدِيلِ حَرَارَةِ أَجْسَامِهَا فِي أَيَّامِ الصَّيْفِ." },
      { context: "Boots", en: "Rinse the caked mud off your rubber boots with the garden hose before entering the house.", ar: "اغْسِلِ الطِّينَ الجَافَّ عَنْ حِذَائِكَ المَطَّاطِيِّ بِخُرْطُومِ المِيَاهِ قَبْلَ دُخُولِ المَنْزِلِ." }
    ]
  },
  "sunrise": {
    arabic: "شُرُوقُ الشَّمْس",
    partOfSpeech: "noun",
    phonetic: "ˈsʌn.raɪz",
    pronunciationTip: "Compound noun: 'SUN' (/sʌn/) + 'RISE' (/raɪz/).",
    collocations: ["at sunrise", "watch the sunrise", "golden sunrise", "before sunrise", "beautiful sunrise", "sunrise over the fields"],
    phrasalVerbs: [
      { phrase: "rise up", meaning: "ascend into the sky", arabic: "تَشْرُقُ وَتَرْتَفِع", example: "The golden sun rose up above the eastern mountain ridge." }
    ],
    sentences: [
      { context: "Morning Beauty", en: "The golden sunrise painted the morning sky in vibrant streaks of amber and rose.", ar: "لَوَّنَ شُرُوقُ الشَّمْسِ الذَّهَبِيُّ سَمَاءَ الصَّبَاحِ بِخُطُوطٍ بَدِيعَةٍ مِنَ العَنْبَرِ وَالوَرْدِيِّ." },
      { context: "Farm Schedule", en: "The farmer starts his daily tractor chores at sunrise to beat the intense midday heat.", ar: "يَبْدَأُ المُزَارِعُ أَعْمَالَ الجَرَّارِ عِنْدَ الشُّرُوقِ لِتَفَادِي حَرَارَةِ الظَّهِيرَةِ الشَّدِيدَةِ." },
      { context: "Birdsong", en: "Robins and songbirds began their melodious chorus the moment the first rays of sunrise appeared.", ar: "بَدَأَتِ العَصَافِيرُ تَغْرِيدَهَا العَذْبَ مَعَ ظُهُورِ أَوَّلِ خُيُوطِ شُرُوقِ الشَّمْسِ." }
    ]
  },
  "sunset": {
    arabic: "غُرُوبُ الشَّمْس (مَغْرِب)",
    partOfSpeech: "noun",
    phonetic: "ˈsʌn.sɛt",
    pronunciationTip: "Compound noun: 'SUN' (/sʌn/) + 'SET' (/sɛt/).",
    collocations: ["at sunset", "watch the sunset", "spectacular sunset", "sunset glow", "stunning sunset", "sunset over the horizon"],
    phrasalVerbs: [
      { phrase: "go down", meaning: "descend below the horizon", arabic: "تَغْرُبُ الشَّمْس", example: "The fiery red sun went down behind the western hills." }
    ],
    sentences: [
      { context: "Evening Splendor", en: "They sat on the farmhouse front porch watching the spectacular violet and orange sunset.", ar: "جَلَسُوا عَلَى شُرْفَةِ بَيْتِ المَزْرَعَةِ يُشَاهِدُونَ غُرُوبَ الشَّمْسِ البَنَفْسَجِيَّ السَّاحِرَ." },
      { context: "End of Workday", en: "The farmhands locked the barn doors and headed home as sunset cast long shadows.", ar: "أَقْفَلَ عُمَّالُ المَزْرَعَةِ أَبْوَابَ الحَظِيرَةِ مَعَ حُلُولِ الغُرُوبِ وَامْتِدَادِ الظِّلالِ." },
      { context: "Peaceful Ambiance", en: "The evening breeze cooled the sun-warmed earth immediately following sunset.", ar: "لَطَّفَ نَسِيمُ المَسَاءِ حَرَارَةَ الأَرْضِ بَعْدَ غُرُوبِ الشَّمْسِ مُبَاشَرَةً." }
    ]
  },
  "rain": {
    arabic: "مَطَر (غَيْث)",
    partOfSpeech: "noun",
    phonetic: "reɪn",
    pronunciationTip: "Long 'a' vowel /eɪ/ as in 'train' or 'pain'.",
    collocations: ["heavy rain", "gentle rain", "pouring rain", "sound of rain", "shelter from the rain", "forecast of rain"],
    phrasalVerbs: [
      { phrase: "pour down", meaning: "rain heavily", arabic: "يَهْطُلُ بِغَزَارَة", example: "The rain poured down all night, filling the farm pond." },
      { phrase: "clear up", meaning: "stop raining and become sunny", arabic: "يَصْفُو الجَوّ", example: "The skies cleared up after the brief afternoon rain shower." }
    ],
    sentences: [
      { context: "Crops Nourishment", en: "The gentle overnight rain soaked deeply into the thirsty soil, reviving the young corn sprouts.", ar: "أَنْعَشَ المَطَرُ اللَّيْلِيُّ الهَادِئُ التُّرْبَةَ العَطْشَى وَأَحْيَا بَرَاعِمَ الذُّرَةِ الصَّغِيرَةِ." },
      { context: "Cozy Indoors", en: "Listening to the rhythmic patter of rain against the barn metal roof is deeply calming.", ar: "الاِسْتِمَاعُ إِلَى صَوْتِ قَطَرَاتِ المَطَرِ عَلَى سَقْفِ الحَظِيرَةِ يَبْعَثُ عَلَى الرَّاحَةِ." },
      { context: "Weather Planning", en: "Farmers harvest dry hay in a rush before the predicted weekend rain arrives.", ar: "يُسَارِعُ المُزَارِعُونَ لِجَنْيِ القَشِّ قَبْلَ وُصُولِ مَوْجَةِ الأَمْطَارِ المُتَوَقَّعَةِ." }
    ]
  },
  "harvest": {
    arabic: "حَصَاد (مَوْسِمُ الحَصَاد)",
    partOfSpeech: "noun",
    phonetic: "ˈhɑːr.vɪst",
    pronunciationTip: "Two syllables: 'HAR-vest' (/ˈhɑːr.vɪst/).",
    collocations: ["bountiful harvest", "autumn harvest", "harvest season", "reap the harvest", "harvest celebration", "corn harvest"],
    phrasalVerbs: [
      { phrase: "gather in", meaning: "collect harvested crops for winter storage", arabic: "يَجْمَعُ المَحْصُول", example: "They worked late into the night to gather in the wheat harvest." }
    ],
    sentences: [
      { context: "Bountiful Season", en: "The community celebrated a bountiful autumn harvest with pumpkin pies and fresh apple cider.", ar: "احْتَفَلَ أَهْلُ القَرْيَةِ بِمَوْسِمِ الحَصَادِ الوَفِيرِ بِفَطَائِرِ اليَقْطِينِ وَعَصِيرِ التُّفَّاحِ." },
      { context: "Combine Harvesting", en: "Giant combine harvesters rolled through the golden wheat fields from morning till night.", ar: "تَحَرَّكَتْ حَصَّادَاتُ القَمْحِ العِمْلاقَةُ عَبْرَ الحُقُولِ الذَّهَبِيَّةِ طَوَالَ النَّهَارِ." },
      { context: "Fruit Picking", en: "Orchard workers hand-picked thousands of ripe red apples during the peak apple harvest.", ar: "قَطَفَ عُمَّالُ البَسَاتِينِ آلافَ التُّفَّاحِ الأَحْمَرِ النَّاضِجِ فِي ذِرْوَةِ مَوْسِمِ الحَصَادِ." }
    ]
  }
};
