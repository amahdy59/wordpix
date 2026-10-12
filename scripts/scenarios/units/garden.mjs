// Scenarios for Unit 024: garden (A1)
// Voices:
// Tariq: British (George: JBFqnCBsd6RMkjVDRZzb)
// Adam: American (Will: bIHbv24MWmeRgasZH58o)
// Omar: Australian (Charlie: IKne3meq5aSn9XLyUdCD)

export const GARDEN_SCENARIOS = {
  unitId: "garden",
  unitName: "The Garden",
  cefr: "A1",
  lessons: [
    {
      id: "garden-1",
      name: "The Garden 1",
      titleEn: "The Botanical Arboretum Walk",
      titleAr: "جولة في الحديقة النباتية والمشتل",
      setting: "Tariq, Adam, and Omar walk through a botanical garden admiring flowers and majestic trees.",
      wordIds: [
        "rose", "tulip", "sunflower", "daisy", "lily",
        "daffodil", "violet", "orchid", "carnation", "lavender",
        "oak-tree", "pine-tree", "apple-tree", "cherry-tree", "palm-tree"
      ],
      lines: [
        {
          id: "01_tariq_welcome",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Welcome to the botanical gardens! Look at the vibrant flower beds alongside the towering trees."
        },
        {
          id: "02_omar_blooms",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Notice the variety: a fragrant red rose, an elegant yellow tulip, a radiant sunflower, and a humble white daisy."
        },
        {
          id: "03_adam_florals",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "I also spot a pure water lily, a spring daffodil, a delicate purple violet, an exotic orchid, and a pink carnation by the soothing lavender border!"
        },
        {
          id: "04_tariq_canopy",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "And overhead, look at the majestic oak tree, the evergreen pine tree, the blossoming apple tree, the pink cherry tree, and that tropical palm tree."
        },
        {
          id: "05_omar_reflect",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "A botanical paradise showcasing nature's incredible design."
        }
      ]
    },
    {
      id: "garden-2",
      name: "The Garden 2",
      titleEn: "Landscaping & Gardening Tools",
      titleAr: "تنسيق الحدائق وأدوات البستنة",
      setting: "In the courtyard, preparing equipment to prune hedges and tend flowerbeds.",
      wordIds: [
        "hedge", "bush", "ivy", "vine", "fern",
        "shovel", "rake", "watering-can", "wheelbarrow", "hose",
        "garden-gloves", "pruner", "trowel", "lawn-mower", "spade"
      ],
      lines: [
        {
          id: "01_tariq_prep",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Adam, Uncle Omar is preparing for some serious garden landscaping this afternoon."
        },
        {
          id: "02_omar_trim",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Right you are! Put on these sturdy garden gloves. We need to trim that overgrown green hedge, prune the dense rose bush, and clear clinging ivy from the grape vine."
        },
        {
          id: "03_adam_fern_tools",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Look at the lush green fern growing near the damp stones! Which tools should I bring out from the shed?"
        },
        {
          id: "04_omar_tool_load",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Load the wheelbarrow with a heavy steel shovel, a leaf rake, a pointed spade, a hand trowel, and sharp bypass pruner shears."
        },
        {
          id: "05_tariq_watering_lawn",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "I will connect the long garden hose to the zinc watering can, and leave the lawn mower ready for the weekend grass."
        }
      ]
    },
    {
      id: "garden-3",
      name: "The Garden 3",
      titleEn: "Plant Anatomy & Friendly Pollinators",
      titleAr: "تشريح النبات وملقحات الحديقة",
      setting: "Observing a flowering plant and watching garden insects pollinate.",
      wordIds: [
        "pitchfork", "sprinkler", "root", "stem", "leaf",
        "petal", "branch", "bark", "bud", "seed",
        "thorn", "berry", "butterfly", "ladybug", "bee"
      ],
      lines: [
        {
          id: "01_omar_botany",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Observe this young rose plant closely, Adam. Botany begins with understanding each living part."
        },
        {
          id: "02_adam_stem_thorn",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Deep under the dark soil lies the anchor root, rising into a green stem with a sharp defensive thorn!"
        },
        {
          id: "03_tariq_branch_leaf",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Along every wooden branch, rough tree bark protects the sap, leading to an emerald leaf and an opening flower bud."
        },
        {
          id: "04_omar_petal_seed",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "As each colourful petal unfurls from the tiny planted seed, ripe wild berry clusters attract wonderful pollinators."
        },
        {
          id: "05_adam_pollinators",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Look! A busy honey bee, a spotted red ladybug, and a fluttery monarch butterfly are hovering above the oscillating lawn sprinkler, while Uncle Omar rests his pitchfork."
        }
      ]
    },
    {
      id: "garden-4",
      name: "The Garden 4",
      titleEn: "Garden Wildlife & Architecture",
      titleAr: "كائنات الحديقة ومعالمها",
      setting: "Exploring the garden perimeter, flower beds, and garden greenhouse.",
      wordIds: [
        "worm", "snail", "ant", "caterpillar", "spider",
        "dragonfly", "grasshopper", "lawn", "flower-bed", "path",
        "fence", "gate", "greenhouse", "bird-feeder", "garden-shed"
      ],
      lines: [
        {
          id: "01_tariq_gate_path",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Step through the wooden gate and walk along the gravel path beside the perimeter fence."
        },
        {
          id: "02_adam_soil_critters",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Under that damp stone, a tiny worm and a slow garden snail are crawling, while a busy black ant carries food!"
        },
        {
          id: "03_omar_insects_lawn",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Keep an eye on the lush green lawn: a striped caterpillar is nibbling a leaf, a nimble spider spins its web, a bright dragonfly darts past, and a grasshopper leaps!"
        },
        {
          id: "04_tariq_structures",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Our blooming flower bed leads directly to the sunny glass greenhouse and the timber garden shed."
        },
        {
          id: "05_omar_feeder",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "And look up at the wooden post: birds are flocking joyfully around our hanging bird feeder."
        }
      ]
    },
    {
      id: "garden-5",
      name: "The Garden 5",
      titleEn: "The Eco-Corner & Bird Sanctuary",
      titleAr: "الركن البيئي وملاذ الطيور",
      setting: "At the peaceful rear corner of the garden near the birdbath and compost.",
      wordIds: [
        "birdbath", "compost-bin", "flower", "tree", "grass",
        "gloves", "bird"
      ],
      lines: [
        {
          id: "01_tariq_sanctuary",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "This quiet corner of the garden is dedicated to wildlife and soil enrichment."
        },
        {
          id: "02_adam_birdbath",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "A wild song bird is splashing happily in the stone birdbath beneath the shady olive tree!"
        },
        {
          id: "03_omar_compost",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Take off your working gloves, Adam. Toss those trimmed grass clippings and wilted flower stems into the compost bin."
        },
        {
          id: "04_tariq_harmony",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Recycling organic matter feeds the earth, completing nature's generous circle."
        }
      ]
    }
  ]
};
