// Scenarios for Unit 029: bakery (A1)
// Voices:
// Tariq: British (George: JBFqnCBsd6RMkjVDRZzb)
// Adam: American (Will: bIHbv24MWmeRgasZH58o)
// Omar: Australian (Charlie: IKne3meq5aSn9XLyUdCD)

export const BAKERY_SCENARIOS = {
  unitId: "bakery",
  unitName: "The Bakery",
  cefr: "A1",
  lessons: [
    {
      id: "bakery-1",
      name: "The Bakery 1",
      titleEn: "Artisan Breads & Morning Pastries",
      titleAr: "المخبوزات التقليدية وفطائر الصباح",
      setting: "Early morning at the bakery counter surrounded by fresh artisan loaves.",
      wordIds: [
        "white-bread", "whole-wheat-bread", "baguette", "sourdough", "rye-bread",
        "pita", "focaccia", "ciabatta", "brioche", "flatbread",
        "croissant", "muffin", "donut", "danish", "cinnamon-roll"
      ],
      lines: [
        {
          id: "01_omar_aroma",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "The warm aroma of morning baking fills the artisan bakery from before sunrise."
        },
        {
          id: "02_adam_bread_loaves",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Look at the bread display: a long crusty baguette, a loaf of airy white bread, hearty whole wheat bread, and tangy sourdough alongside dark rye bread!"
        },
        {
          id: "03_tariq_specialty_breads",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Over here we have Mediterranean specialties: pocket pita, herbed olive focaccia, porous ciabatta, rich golden brioche, and rustic flatbread."
        },
        {
          id: "04_omar_pastries",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "And on the breakfast tray: a buttery French croissant, a blueberry muffin, a glazed donut, a berry danish, and a warm cinnamon roll dripping with sugar icing."
        },
        {
          id: "05_adam_tradition",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Every culture around the world shares a deep heritage of baking grain."
        }
      ]
    },
    {
      id: "bakery-2",
      name: "The Bakery 2",
      titleEn: "Patisserie Delights & Celebration Cakes",
      titleAr: "حلويات الباتيسري وكعكات الاحتفال",
      setting: "Admiring the refrigerated patisserie showcase and celebration cake gallery.",
      wordIds: [
        "clair", "scone", "strudel", "macaron", "profiterole",
        "birthday-cake", "wedding-cake", "cupcake", "cheesecake", "chocolate-cake",
        "carrot-cake", "apple-pie", "cherry-pie", "lemon-tart", "brownie"
      ],
      lines: [
        {
          id: "01_tariq_patisserie_intro",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "The pastry chef's display case resembles an edible jewel gallery."
        },
        {
          id: "02_adam_french_pastries",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "I see a chocolate glazed éclair, a cream tea scone, a warm spiced apple strudel, a pastel French macaron, and a cream-filled profiterole!"
        },
        {
          id: "03_omar_grand_cakes",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Look at the grand celebration showcase: a tiered wedding cake, a vibrant decorated birthday cake, a frosted vanilla cupcake, and a rich New York cheesecake."
        },
        {
          id: "04_tariq_gateaux",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Beside them stand a decadent dark chocolate cake, a spiced walnut carrot cake, and a fudgy chocolate brownie."
        },
        {
          id: "05_omar_pies_tarts",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Don't overlook the fruit bakery: a double-crust apple pie, a tart cherry pie, and a zesty baked lemon tart."
        }
      ]
    },
    {
      id: "bakery-3",
      name: "The Bakery 3",
      titleEn: "Cookie Jars & Foundation Ingredients",
      titleAr: "برطمانات البسكويت والمكونات الأساسية",
      setting: "At the cookie counter examining pantry jars and core baking ingredients.",
      wordIds: [
        "chocolate-chip-cookie", "sugar-cookie", "gingerbread", "shortbread", "oatmeal-cookie",
        "wafer", "biscuit", "pretzel", "cracker", "granola-bar",
        "flour", "sugar", "butter", "eggs", "yeast"
      ],
      lines: [
        {
          id: "01_omar_core_elements",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Every exquisite baked creation begins with five fundamental baking ingredients."
        },
        {
          id: "02_adam_measuring",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "On the worktable, we measure fine milled flour, sweet granulated sugar, creamed butter, fresh farm eggs, and active dry yeast!"
        },
        {
          id: "03_tariq_cookie_craft",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "From that base come delicious biscuits and cookies: a classic chocolate chip cookie, a delicate sugar cookie, spiced gingerbread, and buttery Scottish shortbread."
        },
        {
          id: "04_adam_wafers_bars",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "I also packed an oatmeal cookie, a crispy vanilla wafer, a golden morning biscuit, and a wholesome oat granola bar."
        },
        {
          id: "05_omar_savory_crunch",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "And over on the snack counter: a salty twisted pretzel and a crisp whole-wheat cracker!"
        }
      ]
    },
    {
      id: "bakery-4",
      name: "The Bakery 4",
      titleEn: "Flavors & The Baker's Kitchen Tools",
      titleAr: "النكهات وأدوات الخباز الاحترافية",
      setting: "Inside the preparation bakery inspecting baking utensils and flavour extracts.",
      wordIds: [
        "baking-powder", "chocolate", "vanilla", "cream", "cocoa-powder",
        "cinnamon", "honey", "oven", "mixer", "rolling-pin",
        "baking-tray", "whisk", "spatula", "piping-bag", "muffin-tin"
      ],
      lines: [
        {
          id: "01_tariq_kitchen_entrance",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Step into the production kitchen to see the professional equipment and aromatic flavorings."
        },
        {
          id: "02_adam_aromatic_flavors",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "The pantry holds leavening baking powder, melted dark chocolate, pure vanilla extract, heavy whipping cream, rich cocoa powder, ground cinnamon, and raw golden honey!"
        },
        {
          id: "03_omar_heavy_machinery",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Our baker uses a heavy planetary electric mixer and a smooth wooden rolling pin before preheating the stone deck oven."
        },
        {
          id: "04_tariq_hand_tools",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Equip your workstation with a non-stick baking tray, a wire balloon whisk, a silicone bowl spatula, and a twelve-cup muffin tin."
        },
        {
          id: "05_adam_decorating_bag",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "And to decorate with precision, fill the conical piping bag with sweet royal icing!"
        }
      ]
    },
    {
      id: "bakery-5",
      name: "The Bakery 5",
      titleEn: "Fresh from the Oven",
      titleAr: "طازج من الفرن",
      setting: "Cooling and packaging fresh loaves and cakes straight from baking.",
      wordIds: [
        "cooling-rack", "bread-basket", "apron", "timer", "bread",
        "cake", "cookie", "pie", "egg"
      ],
      lines: [
        {
          id: "01_omar_timer_rings",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Put on your clean canvas apron, Adam. The oven bell timer just rang!"
        },
        {
          id: "02_adam_cooling_station",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "I will transfer the hot sourdough bread and a warm fruit pie straight onto the wire cooling rack."
        },
        {
          id: "03_tariq_packaging",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Arrange the golden crusts inside the woven bread basket, and check on that glazed celebration cake."
        },
        {
          id: "04_omar_craftsmanship",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Each batch takes patience: from a single cracked egg to a freshly baked cookie and a towering loaf."
        },
        {
          id: "05_adam_community",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "A master craft that brings comfort and sustenance to the neighbourhood."
        }
      ]
    }
  ]
};
