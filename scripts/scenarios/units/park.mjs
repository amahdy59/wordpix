// Scenarios for Unit 025: park (A1)
// Voices:
// Tariq: British (George: JBFqnCBsd6RMkjVDRZzb)
// Adam: American (Will: bIHbv24MWmeRgasZH58o)
// Omar: Australian (Charlie: IKne3meq5aSn9XLyUdCD)

export const PARK_SCENARIOS = {
  unitId: "park",
  unitName: "The Park",
  cefr: "A1",
  lessons: [
    {
      id: "park-1",
      name: "The Park 1",
      titleEn: "Central Park Landmarks & Amenities",
      titleAr: "معالم الحديقة العامة ومرافقها",
      setting: "Arriving at the city park entrance and surveying its amenities and landscaped scenery.",
      wordIds: [
        "bench", "fountain", "gazebo", "bridge", "statue",
        "trash-can", "lamp-post", "picnic-table", "drinking-fountain", "bike-rack",
        "pond", "stream", "hill", "meadow", "shade-tree"
      ],
      lines: [
        {
          id: "01_tariq_fountain",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "What a serene morning in the city park! Look at the water spraying high from that ornamental fountain."
        },
        {
          id: "02_omar_arrival",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Let's lock our bicycles at the steel bike rack and take a refreshing sip from the drinking fountain."
        },
        {
          id: "03_adam_shade_bridge",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "I see a wooden picnic table under that leafy shade tree, right beside the wooden foot bridge crossing the babbling stream!"
        },
        {
          id: "04_omar_hill_gazebo",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Follow the path up the grassy hill to the octagonal gazebo, overlooking the wildflower meadow and the duck pond."
        },
        {
          id: "05_tariq_statue_clean",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "There is a commemorative marble statue, an antique lamp post, a resting bench, and a tidy trash can to keep the grounds clean."
        }
      ]
    },
    {
      id: "park-2",
      name: "The Park 2",
      titleEn: "Park Wildlife & Nature Spotting",
      titleAr: "حياة الحديقة البرية واكتشاف الطبيعة",
      setting: "Walking around the lake and noticing birds, amphibians, and flora.",
      wordIds: [
        "flower-bed", "grass", "pebble", "pinecone", "acorn",
        "duck", "swan", "squirrel", "pigeon", "robin",
        "frog", "turtle", "rabbit", "goose", "sparrow"
      ],
      lines: [
        {
          id: "01_omar_flora",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "The park is teeming with natural life if you look closely around the green grass and vivid flower bed."
        },
        {
          id: "02_adam_lake_animals",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Look! A graceful white swan glides next to a mother duck, while a green frog and a sunbathing turtle rest on the lake bank."
        },
        {
          id: "03_tariq_oak_gathering",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Under that oak, a fluffy squirrel gathers an acorn, while Adam collects a smooth river pebble and a fallen pinecone."
        },
        {
          id: "04_adam_rabbit_goose",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "A wild brown rabbit darted past that noisy Canadian goose near the reeds!"
        },
        {
          id: "05_omar_songbirds",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "And listen to the birds singing: a chirping sparrow, a red-breasted robin, and a grey pigeon pecking peacefully."
        }
      ]
    },
    {
      id: "park-3",
      name: "The Park 3",
      titleEn: "Community Sports & Outdoor Hobbies",
      titleAr: "الرياضات المجتمعية والهوايات الخارجية",
      setting: "Observing healthy recreational activities and games on the park green.",
      wordIds: [
        "walking", "jogging", "cycling", "picnic", "reading",
        "sitting", "stretching", "dog-walking", "photography", "bird-watching",
        "kite", "frisbee", "soccer-ball", "jump-rope", "skateboard"
      ],
      lines: [
        {
          id: "01_tariq_overview",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Look at all the diverse community activities across the park grounds today!"
        },
        {
          id: "02_adam_movement",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "People are briskly walking, fitness enthusiasts are jogging, and cyclists enjoy cycling along the paved trail."
        },
        {
          id: "03_omar_leisure",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Over on the open lawn, a family enjoys a pleasant picnic, while a scholar is sitting peacefully reading a book."
        },
        {
          id: "04_tariq_hobbies",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Nearby, a runner is stretching after some dog walking, while Omar engages in nature photography and patient bird watching."
        },
        {
          id: "05_adam_toys_games",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Look at the toys in the breeze: someone is flying a kite, tossing a frisbee, kicking a soccer ball, skipping with a jump rope, and riding a wooden skateboard!"
        }
      ]
    },
    {
      id: "park-4",
      name: "The Park 4",
      titleEn: "Park Safety, Signs & Sports Gear",
      titleAr: "سلامة الحديقة والإشارات والمعدات",
      setting: "Checking safety signposts, pedestrian paths, and sport equipment.",
      wordIds: [
        "roller-skates", "badminton", "tennis-ball", "yoga-mat", "bicycle",
        "park-map", "trail-sign", "no-swimming-sign", "keep-off-grass", "dog-allowed",
        "crosswalk", "speed-bump", "emergency-phone", "information-board", "recycling-bin"
      ],
      lines: [
        {
          id: "01_omar_navigation",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Before we explore further, check the public information board and read the large park map."
        },
        {
          id: "02_adam_trail_crosswalk",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "I see a wooden trail sign pointing toward the crosswalk and the pedestrian speed bump."
        },
        {
          id: "03_tariq_signs",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Notice the civic safety signs: a clear no swimming sign by the lake, a keep off grass reminder for the new lawn, and a dog allowed area."
        },
        {
          id: "04_omar_infrastructure",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Good safety infrastructure too, including a solar emergency phone and a blue recycling bin."
        },
        {
          id: "05_adam_gear",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "I have packed my bicycle, roller skates, badminton rackets, a yellow tennis ball, and Tariq's rolled yoga mat!"
        }
      ]
    },
    {
      id: "park-5",
      name: "The Park 5",
      titleEn: "Afternoon Relaxation & Lawn Verbs",
      titleAr: "استرخاء بعد الظهر على المروج الخضراء",
      setting: "Relaxing on the grand lawn under the shade of the ancient oak.",
      wordIds: [
        "path", "oak-tree", "shade", "grass-lawn", "walk",
        "jog", "cycle", "feed-ducks", "fly-kite", "roller-skate",
        "sit-down"
      ],
      lines: [
        {
          id: "01_tariq_path",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Follow this winding stone path across the wide green grass lawn."
        },
        {
          id: "02_omar_shade_sit",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "The towering oak tree provides cool shade from the afternoon sun, the perfect spot to sit down."
        },
        {
          id: "03_adam_active",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "I love to walk slowly, but tomorrow I might jog or cycle with Uncle Omar!"
        },
        {
          id: "04_omar_recreation",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "You can also feed ducks by the pond bank, fly a kite in the gentle breeze, or roller skate along the boardwalk."
        },
        {
          id: "05_tariq_conclusion",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "A healthy park routine brings calm to the mind and vigor to the body."
        }
      ]
    }
  ]
};
