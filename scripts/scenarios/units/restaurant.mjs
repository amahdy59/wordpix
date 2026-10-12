// Scenarios for Unit 033: restaurant (A1)
// Voices:
// Tariq: British (George: JBFqnCBsd6RMkjVDRZzb)
// Adam: American (Will: bIHbv24MWmeRgasZH58o)
// Omar: Australian (Charlie: IKne3meq5aSn9XLyUdCD)

export const RESTAURANT_SCENARIOS = {
  unitId: "restaurant",
  unitName: "The Restaurant",
  cefr: "A1",
  lessons: [
    {
      id: "restaurant-1",
      name: "The Restaurant 1",
      titleEn: "The Dining Room & Table Setting",
      titleAr: "صالة الطعام وترتيب المائدة",
      setting: "Arriving at the main dining room, admiring the hospitality furniture and place settings.",
      wordIds: [
        "table", "chair", "booth", "menu", "napkin",
        "tablecloth", "candle", "centerpiece", "place-setting", "salt-shaker",
        "pepper-shaker", "high-chair", "bar-stool", "counter", "plate"
      ],
      lines: [
        {
          id: "01_tariq_dining_intro",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Welcome to the grand dining room! Every detail of the hospitality layout is meticulously arranged."
        },
        {
          id: "02_omar_seating_variety",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Guests can choose between a private cushioned booth, a tall leather bar stool by the counter, or an elegant round dining table and chair."
        },
        {
          id: "03_adam_high_chair",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "For families with young toddlers, the team provides a sturdy wooden high chair."
        },
        {
          id: "04_tariq_place_setting",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Notice the formal place setting: a white linen tablecloth, a floral table centerpiece, a scented wax candle, a folded cloth napkin, and a porcelain dinner plate."
        },
        {
          id: "05_adam_shakers_menu",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "And right beside the leather-bound menu sit a silver salt shaker and a matching pepper shaker."
        }
      ]
    },
    {
      id: "restaurant-2",
      name: "The Restaurant 2",
      titleEn: "Tableware & Floor Service",
      titleAr: "أواني المائدة وخدمة الصالة",
      setting: "Observing fine tableware, glassware, and attentive servers.",
      wordIds: [
        "bowl", "glass", "fork", "knife", "spoon",
        "cup", "saucer", "mug", "chopsticks", "straw",
        "serving-tray", "pitcher", "wine-glass", "waiter", "waitress"
      ],
      lines: [
        {
          id: "01_omar_service_etiquette",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Attentive table service requires refined etiquette and polished tableware."
        },
        {
          id: "02_adam_waiters_pitcher",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "A professional waiter carries a balanced serving tray, while our attentive waitress refills water glasses from a chilled glass pitcher."
        },
        {
          id: "03_tariq_cutlery_crockery",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "For each course, place a soup spoon, a salad fork, a steak knife, a deep ceramic bowl, and a sparkling clear water glass."
        },
        {
          id: "04_adam_fusion_stemware",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "For East Asian fusion dishes, we offer wooden chopsticks, while cold sodas come with a paper straw and stemware includes an elegant non-alcoholic wine glass."
        },
        {
          id: "05_omar_coffee_ware",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "And to finish the meal, serve espresso in a porcelain cup and saucer, or herbal tea in a ceramic mug."
        }
      ]
    },
    {
      id: "restaurant-3",
      name: "The Restaurant 3",
      titleEn: "The Kitchen Brigade & Course Sequence",
      titleAr: "فريق العمل وتتابع وجبات الطعام",
      setting: "Observing front and back of house roles and multi-course progression.",
      wordIds: [
        "chef", "cook", "host", "hostess", "busser",
        "bartender", "dishwasher", "manager", "sommelier", "barista",
        "appetizer", "main-course", "dessert", "side-dish", "special"
      ],
      lines: [
        {
          id: "01_tariq_brigade_intro",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "A fine dining restaurant operates like a synchronized orchestra from front to back."
        },
        {
          id: "02_adam_hosts_manager",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "At the foyer, the welcoming host and hostess greet arriving patrons, while the floor manager supervises service."
        },
        {
          id: "03_omar_kitchen_crew",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "In the kitchen, the executive chef directs each line cook, the diligent busser clears tables, and the industrial dishwasher sanitizes pans."
        },
        {
          id: "04_tariq_beverage_team",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "At the drinks lounge, the mixology bartender, the beverage sommelier, and the specialty barista prepare refreshments."
        },
        {
          id: "05_adam_courses",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Now review the four-course meal: a light savory appetizer, the chef's seasonal daily special, a hearty main course with a roasted vegetable side dish, and a decadent dessert!"
        }
      ]
    },
    {
      id: "restaurant-4",
      name: "The Restaurant 4",
      titleEn: "Back-of-House Cookery & Billing",
      titleAr: "طهي المطبخ ودفع الفاتورة",
      setting: "Inside the bustling commercial kitchen line and checking guest bills.",
      wordIds: [
        "bill", "check", "tip", "receipt", "reservation",
        "order-pad", "oven", "stove", "grill", "fryer",
        "pot", "pan", "cutting-board", "ladle", "spatula"
      ],
      lines: [
        {
          id: "01_omar_line_cooking",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Behind the dining partition, the hot kitchen line hums with intense culinary energy."
        },
        {
          id: "02_adam_cooks_action",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "The saute cook stirs soup in a stock pot with a ladle, flips patties on the gas stove using a silicone spatula, and fries potatoes in the deep fryer!"
        },
        {
          id: "03_tariq_grill_oven_board",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Over the open char grill and convection oven, a cast iron pan sizzles, while the prep cook dices herbs on a poly cutting board."
        },
        {
          id: "04_adam_orders_reservation",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "The server jots orders on a leather order pad, verifying each evening table reservation."
        },
        {
          id: "05_omar_billing_tip",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "At the end of the evening, the waiter presents the dinner bill and itemized check; the satisfied diner leaves a generous gratuity tip and takes the printed payment receipt."
        }
      ]
    },
    {
      id: "restaurant-5",
      name: "The Restaurant 5",
      titleEn: "International Kitchen Fare & Equipment",
      titleAr: "الأطباق العالمية ومعدات الطهي",
      setting: "At the service pass viewing global cuisine dishes and major kitchen gear.",
      wordIds: [
        "whisk", "mixer", "refrigerator", "freezer", "sink",
        "soup", "salad", "steak", "pasta", "pizza",
        "sandwich", "burger", "sushi", "rice", "bread"
      ],
      lines: [
        {
          id: "01_omar_diversity",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "The restaurant menu celebrates culinary diversity across global cuisines."
        },
        {
          id: "02_adam_cooling_prep",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Our walk-in refrigerator and deep freezer preserve fresh ingredients, washed in the stainless steel prep sink before the chef whips cream with a whisk or runs the planetary mixer."
        },
        {
          id: "03_tariq_soups_bread",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Look at the dishes passing through the kitchen window: steaming lentil soup, a garden green salad, and warm oven baked bread with fluffy steamed jasmine rice!"
        },
        {
          id: "04_adam_entrees",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Guests are enjoying seared beef steak, creamy Italian pasta, stone-baked pizza, a clubhouse sandwich, a flame-broiled burger, and fresh Japanese sushi rolls!"
        },
        {
          id: "05_omar_craft",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Flavors from every continent united by culinary craftsmanship."
        }
      ]
    },
    {
      id: "restaurant-6",
      name: "The Restaurant 6",
      titleEn: "The Final Culinary Touches",
      titleAr: "اللمسات الأخيرة لفنون الطهي",
      setting: "Observing the chef plate and garnish signature entrees at the pass.",
      wordIds: ["sauce", "dressing", "garnish", "seasoning"],
      lines: [
        {
          id: "01_tariq_art_plating",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "The true mark of a master chef lies in the final finishing touches before plating."
        },
        {
          id: "02_omar_sauce_seasoning",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Balance every nuance of flavor with aromatic herbal seasoning and a velvety pan sauce reduction."
        },
        {
          id: "03_adam_dressing_garnish",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Toss the greens with an emulsified vinaigrette dressing, and crown the entree with an edible flower garnish!"
        },
        {
          id: "04_tariq_palate",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "A feast that delights both the eye and the palate."
        }
      ]
    }
  ]
};
