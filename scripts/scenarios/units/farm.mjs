// Scenarios for Unit 023: farm (A1)
// Voices:
// Tariq: British (George: JBFqnCBsd6RMkjVDRZzb)
// Adam: American (Will: bIHbv24MWmeRgasZH58o)
// Omar: Australian (Charlie: IKne3meq5aSn9XLyUdCD)

export const FARM_SCENARIOS = {
  unitId: "farm",
  unitName: "The Farm",
  cefr: "A1",
  lessons: [
    {
      id: "farm-1",
      name: "The Farm 1",
      titleEn: "The Morning Farm Feeding",
      titleAr: "إطعام حيوانات المزرعة في الصباح",
      setting: "Omar, Tariq, and Adam arrive at the animal paddocks at dawn with feeding buckets.",
      wordIds: [
        "cow", "pig", "chicken", "horse", "sheep",
        "goat", "duck", "donkey", "turkey", "rooster",
        "hen", "lamb", "wheat", "corn", "carrot"
      ],
      lines: [
        {
          id: "01_tariq_dawn",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Listen to that rooster crowing across the field! Adam, Uncle Omar has a busy morning feeding the livestock."
        },
        {
          id: "02_omar_prep",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Good morning, boys! Grab those buckets. Let's feed the horse and the gentle donkey first, then check the pasture."
        },
        {
          id: "03_adam_pasture",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "The cow and sheep are already grazing by the wheat field, and look at that playful little lamb beside the mother goat!"
        },
        {
          id: "04_omar_poultry",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Spot on! Now scatter grains of yellow corn for the noisy turkey, the clucking hen, and the hungry chicken flock."
        },
        {
          id: "05_tariq_wrap",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Don't forget the duck splashing by the trough and the spotted pig munching on a crisp orange carrot!"
        }
      ]
    },
    {
      id: "farm-2",
      name: "The Farm 2",
      titleEn: "The Kitchen Garden & Orchard Harvest",
      titleAr: "حصاد حديقة الخضار وبستان الفواكه",
      setting: "Tariq, Adam, and Omar walk through the raised garden beds and orchard collecting fresh produce.",
      wordIds: [
        "potato", "tomato", "lettuce", "onion", "pumpkin",
        "bean", "pea", "cabbage", "beetroot", "apple-tree",
        "pear-tree", "cherry-tree", "orange-tree", "strawberry", "blueberry"
      ],
      lines: [
        {
          id: "01_tariq_intro",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Uncle Omar's garden beds are bursting with fresh produce today. Look at these crisp leaves!"
        },
        {
          id: "02_omar_greens",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Indeed, Tariq! We have green lettuce, round cabbage, and deep purple beetroot ready for market."
        },
        {
          id: "03_adam_roots",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "I can dig up an earthy potato and pull a pungent red onion, while Tariq picks that ripe red tomato!"
        },
        {
          id: "04_tariq_vines",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Don't overlook the climbing bean vines and sweet green pea pods under that giant orange pumpkin."
        },
        {
          id: "05_omar_trees",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Now stroll into the orchard: inspect the sturdy apple tree, the pear tree, the cherry tree, and the fragrant orange tree."
        },
        {
          id: "06_adam_berries",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "And right along the border, sweet red strawberry patches and ripe blueberry bushes are waiting for us!"
        }
      ]
    },
    {
      id: "farm-3",
      name: "The Farm 3",
      titleEn: "The Farm Buildings & Berry Groves",
      titleAr: "مباني المزرعة وبساتين التوت",
      setting: "Omar shows Adam and Tariq the architectural layout of the farm and berry trellises.",
      wordIds: [
        "raspberry", "grape-vine", "peach-tree", "plum-tree", "barn",
        "farmhouse", "silo", "chicken-coop", "stable", "greenhouse",
        "storage-shed", "windmill", "dairy", "well", "tractor"
      ],
      lines: [
        {
          id: "01_omar_overview",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Look at the overall layout of the estate. The red barn stands right behind our family farmhouse."
        },
        {
          id: "02_adam_structures",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "I see the tall grain silo, the secure chicken coop for the hens, and the spacious horse stable next door!"
        },
        {
          id: "03_tariq_equipment",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "The glass greenhouse nurtures rare seedlings, while the storage shed houses Uncle Omar's heavy tractor."
        },
        {
          id: "04_omar_water_dairy",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Up on the ridge, the historic windmill pumps groundwater straight from the deep stone well into the fresh milk dairy."
        },
        {
          id: "05_adam_fruit_vines",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "And just look at those fruit orchards: sweet raspberry canes, climbing grape vine trellises, a flowering peach tree, and a purple plum tree!"
        }
      ]
    },
    {
      id: "farm-4",
      name: "The Farm 4",
      titleEn: "Tools, Troughs & Farm Goods",
      titleAr: "أدوات المزرعة ومنتجات الحظيرة",
      setting: "In the farm courtyard, sorting tools and packing farm fresh goods for distribution.",
      wordIds: [
        "plow", "trailer", "hay-bale", "pitchfork", "bucket",
        "wheelbarrow", "feed-trough", "water-tank", "scarecrow", "milk",
        "egg", "wool", "honey", "cheese", "butter"
      ],
      lines: [
        {
          id: "01_tariq_tools",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Uncle Omar, how do you manage all these tools and goods before loading the farm trailer?"
        },
        {
          id: "02_omar_machinery",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Systematic discipline! We hitch the steel plow to prepare the soil, then stack every golden hay bale."
        },
        {
          id: "03_adam_trough",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "I used the sturdy pitchfork to lift straw into the wheelbarrow, and washed the heavy feed trough with a bucket!"
        },
        {
          id: "04_omar_tank",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Excellent, Adam. Make sure the large water tank is completely full, right beside our straw hat scarecrow."
        },
        {
          id: "05_tariq_produce",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Now let's package our fresh yield: pure cow milk, a warm brown egg, sheared sheep wool, raw apiary honey, artisan goat cheese, and churned butter!"
        }
      ]
    },
    {
      id: "farm-5",
      name: "The Farm 5",
      titleEn: "The Farmstead Pantry & Garden Upkeep",
      titleAr: "مؤونة المزرعة وأعمال الصيانة",
      setting: "Outside the pantry and garden fence, repairing and watering.",
      wordIds: [
        "cream", "flour", "jam", "apple-cider", "rabbit",
        "goose", "hen-house", "shed", "fence", "shovel",
        "hoe", "rake", "watering-can", "sunflower", "hay"
      ],
      lines: [
        {
          id: "01_tariq_pantry",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "The farm pantry smells delightful with freshly ground wheat flour, sweet berry jam, chilled apple cider, and thick dairy cream."
        },
        {
          id: "02_adam_animals",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Look outside the pantry! A gentle white rabbit is hopping near the wooden fence, watching that noisy grey goose!"
        },
        {
          id: "03_omar_gardening",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Keep that goose away from the hen house and the tool shed, Adam! Grab a shovel, a garden hoe, and a leaf rake."
        },
        {
          id: "04_adam_watering",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "I will use this zinc watering can to water that towering yellow sunflower, then feed dry golden hay to the cattle."
        },
        {
          id: "05_tariq_finish",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "A productive farm day thrives on proper care and dependable routines."
        }
      ]
    },
    {
      id: "farm-6",
      name: "The Farm 6",
      titleEn: "A Day in the Life of a Farmer",
      titleAr: "يوم في حياة المزارع",
      setting: "Resting on the farmhouse porch at dusk after a full day in the fields.",
      wordIds: [
        "straw", "farmer", "dog", "cat", "pond",
        "mud", "sunrise", "sunset", "rain", "harvest",
        "saddle"
      ],
      lines: [
        {
          id: "01_omar_reflection",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Being a dedicated farmer means living by nature's rhythm, from the golden sunrise until the quiet sunset."
        },
        {
          id: "02_adam_elements",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Even when unexpected afternoon rain turns the trail into thick mud, our loyal sheep dog stays alert by the duck pond!"
        },
        {
          id: "03_tariq_animals",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "And the barn cat loves sleeping comfortably on that dry bedding of clean golden straw."
        },
        {
          id: "04_omar_saddle_harvest",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Now clean your leather horse saddle, boys. We have completed another bountiful autumn harvest together."
        },
        {
          id: "05_adam_close",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "A full day of hard work, learning, and gratitude on the farm!"
        }
      ]
    }
  ]
};
