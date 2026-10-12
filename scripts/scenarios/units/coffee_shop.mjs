// Scenarios for Unit 030: coffee-shop (A1)
// Voices:
// Tariq: British (George: JBFqnCBsd6RMkjVDRZzb)
// Adam: American (Will: bIHbv24MWmeRgasZH58o)
// Omar: Australian (Charlie: IKne3meq5aSn9XLyUdCD)

export const COFFEE_SHOP_SCENARIOS = {
  unitId: "coffee-shop",
  unitName: "The Coffee Shop",
  cefr: "A1",
  lessons: [
    {
      id: "coffee-shop-1",
      name: "The Coffee Shop 1",
      titleEn: "The Handcrafted Coffee Menu",
      titleAr: "قائمة مشروبات القهوة المختصة",
      setting: "At the bustling front counter reading through specialty hot and cold drinks.",
      wordIds: [
        "espresso", "latte", "cappuccino", "americano", "mocha",
        "hot-chocolate", "tea", "chai", "macchiato", "flat-white",
        "iced-coffee", "iced-tea", "smoothie", "frappe", "lemonade"
      ],
      lines: [
        {
          id: "01_tariq_menu_intro",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Welcome to the specialty coffee bar! The menu features handcrafted hot and cold beverages."
        },
        {
          id: "02_omar_classics",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "For classic coffee lovers, we pull a bold double espresso, pour a hot americano, steam a creamy flat white, and foam a velvety cappuccino or caramel macchiato."
        },
        {
          id: "03_adam_sweet_hot",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "I love milk drinks: a silky vanilla latte, a chocolatey mocha, a comforting mug of hot chocolate, or a spiced herbal chai!"
        },
        {
          id: "04_tariq_tea_leaves",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "We also steep traditional organic tea leaves for those who prefer tea."
        },
        {
          id: "05_adam_cold_beverages",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "And for warm afternoons: a chilled glass of iced coffee, refreshing peach iced tea, a blended fruit smoothie, a frosty frappe, and sparkling mint lemonade!"
        }
      ]
    },
    {
      id: "coffee-shop-2",
      name: "The Coffee Shop 2",
      titleEn: "Chilled Drinks & The Pastry Case",
      titleAr: "المشروبات الباردة وخزانة المعجنات",
      setting: "Viewing chilled beverages and bakery treats at the cafe glass display.",
      wordIds: [
        "milkshake", "cold-brew", "juice", "soda", "water",
        "croissant", "muffin", "scone", "cookie", "cake-slice",
        "sandwich", "bagel", "donut", "brownie", "quiche"
      ],
      lines: [
        {
          id: "01_omar_cold_bar",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Alongside barista espresso, our cold bar serves slow-steeped cold brew, fresh orange juice, fizzy fruit soda, crisp mineral water, and a thick vanilla milkshake."
        },
        {
          id: "02_adam_pastry_treats",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Look at the pastry display case! A golden flaky croissant, a warm blueberry muffin, an English raisin scone, a chocolate chip cookie, and a moist cake slice!"
        },
        {
          id: "03_tariq_lunch_savory",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "For savory lunch options, choose a toasted sourdough sandwich, a cream cheese sesame bagel, or a slice of warm spinach quiche."
        },
        {
          id: "04_omar_sweet_afternoon",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "And for an afternoon treat, pick between a ring glazed donut or a rich fudge walnut brownie."
        },
        {
          id: "05_adam_pairing",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "The perfect pairing of nourishing food and hospitality."
        }
      ]
    },
    {
      id: "coffee-shop-3",
      name: "The Coffee Shop 3",
      titleEn: "The Barista's Equipment & Serveware",
      titleAr: "معدات الباريستا وأدوات التقديم",
      setting: "Behind the counter observing barista machinery and take-out supplies.",
      wordIds: [
        "espresso-machine", "grinder", "steam-wand", "portafilter", "tamper",
        "kettle", "blender", "scale", "timer", "thermometer",
        "cup", "mug", "lid", "straw", "sleeve"
      ],
      lines: [
        {
          id: "01_omar_barista_precision",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Precision engineering is the secret behind consistent extraction."
        },
        {
          id: "02_adam_grinding_tamping",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "The burr grinder doses fresh coffee grounds straight into the two-spout portafilter, compacted evenly with a flat steel tamper!"
        },
        {
          id: "03_tariq_machine_extraction",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "The barista locks it into the multi-boiler espresso machine, timing thirty seconds with a digital timer and measuring yield on an accurate scale."
        },
        {
          id: "04_omar_milk_steaming",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "He steams microfoam milk with the stainless steel steam wand, checking heat with a milk thermometer, while a gooseneck kettle brews pour-overs and a high-speed blender crushes ice."
        },
        {
          id: "05_adam_serveware",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "For takeaway, pour into a paper cup with a sip lid, an insulating cardboard sleeve, and a paper straw, or serve indoors in a ceramic mug!"
        }
      ]
    },
    {
      id: "coffee-shop-4",
      name: "The Coffee Shop 4",
      titleEn: "Atmosphere, Condiments & Community Lounge",
      titleAr: "أجواء المقهى ومحطة التحلية والمساحة المجتمعية",
      setting: "Exploring the condiment island and the cozy lounge area.",
      wordIds: [
        "napkin", "sugar", "creamer", "syrup", "stirrer",
        "counter", "menu-board", "barista", "tip-jar", "couch",
        "table", "wifi-sign", "outlet", "bookshelf", "plant"
      ],
      lines: [
        {
          id: "01_tariq_lounge_intro",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "A neighbourhood coffee shop serves as an inviting community lounge."
        },
        {
          id: "02_adam_pickup_counter",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "At the pickup counter, the friendly barista smiles beneath the glowing wooden menu board, beside a glass tip jar."
        },
        {
          id: "03_omar_condiments",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Head to the condiment station: grab an absorbent paper napkin, white sugar sachets, oat milk creamer, caramel syrup, and a wooden stirrer."
        },
        {
          id: "04_tariq_seating_work",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Choose your favorite seating: sink into a plush leather couch, or set up your laptop at a sturdy oak table."
        },
        {
          id: "05_adam_decor_tech",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "There is a wall electrical outlet for laptops, a clear wifi sign for internet, a curated community bookshelf, and a potted green fiddle-leaf plant."
        }
      ]
    }
  ]
};
