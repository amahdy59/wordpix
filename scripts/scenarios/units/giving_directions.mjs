// Scenarios for Unit 020: giving-directions
// Voices:
// Tariq: British (George: JBFqnCBsd6RMkjVDRZzb)
// Adam: American (Will: bIHbv24MWmeRgasZH58o)
// Omar: Australian (Charlie: IKne3meq5aSn9XLyUdCD)

export const GIVING_DIRECTIONS_SCENARIOS = {
  unitId: "giving-directions",
  unitName: "Giving Directions",
  cefr: "Pre-A1",
  lessons: [
    {
      id: "giving-directions-1",
      name: "Giving Directions 1",
      titleEn: "The City Grid & Compass Bearings",
      titleAr: "شبكة المدينة والاتجاهات الأساسية",
      setting: "Navigating city streets and using cardinal bearings to direct travelers accurately.",
      wordIds: [
        "left", "right", "straight", "forward", "backward",
        "up", "down", "turn", "stop", "go",
        "north", "south", "east", "west", "northeast"
      ],
      lines: [
        {
          id: "01_omar_bearings_intro",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "To give clear directions, speak with confidence, Adam: distinguish your left from your right, and know your bearings."
        },
        {
          id: "02_adam_movement_steps",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Walk straight forward down the boulevard; never step backward. Go two hundred meters, then stop at the crossing and turn right."
        },
        {
          id: "03_tariq_elevation_steps",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Climb up the stone terrace steps, or head down toward the river walkway."
        },
        {
          id: "04_omar_cardinal_points",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Orient yourself: face north, the port lies south, dawn breaks in the east, the sun sets west, and hills rise toward the northeast."
        },
        {
          id: "05_adam_mastery_wrap",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Combining movement verbs with cardinal bearings guides travelers without confusion!"
        }
      ]
    },
    {
      id: "giving-directions-2",
      name: "Giving Directions 2",
      titleEn: "The Magnetic Compass & Spatial Proximity",
      titleAr: "البوصلة المغناطيسية والمسافات المكانية",
      setting: "Navigating rural trails using a magnetic pocket compass and describing relative distances.",
      wordIds: [
        "northwest", "southeast", "southwest", "compass", "direction",
        "near", "far", "close", "nearby", "distant",
        "here", "there", "everywhere", "nowhere", "somewhere"
      ],
      lines: [
        {
          id: "01_tariq_compass_reading",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Hold this brass compass level in your palm, Adam; its needle indicates our true direction."
        },
        {
          id: "02_adam_ordinal_bearings",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "The watchtower stands northwest, the coastline stretches southeast, and the pine forest lies southwest!"
        },
        {
          id: "03_omar_proximity_scales",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Look at our position: we rest right here, while our vehicle is parked over there. The mountain spring is near, close, and nearby, but the village is distant and far."
        },
        {
          id: "04_adam_nature_presence",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Fresh herbs grow everywhere along this path; there is nowhere as serene as this lookout somewhere high on the plateau."
        },
        {
          id: "05_tariq_confidence_wrap",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Accurate spatial awareness keeps every explorer safe and self-reliant."
        }
      ]
    },
    {
      id: "giving-directions-3",
      name: "Giving Directions 3",
      titleEn: "Urban Intersections & City Landmarks",
      titleAr: "تقاطعات المدينة والمعالم الحضرية",
      setting: "Guiding pedestrians past city blocks, crosswalks, traffic signals, and public monuments.",
      wordIds: [
        "intersection", "corner", "block", "crosswalk", "traffic-light",
        "roundabout", "one-way", "dead-end", "highway", "sidewalk",
        "building", "bridge", "monument", "fountain", "statue"
      ],
      lines: [
        {
          id: "01_omar_urban_pedestrian",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "A tourist asked for directions to the civic center, Adam. Guide them through the district."
        },
        {
          id: "02_adam_street_rules",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Walk along the sidewalk for one block, wait at the corner of the busy intersection, watch the traffic light, and cross at the zebra crosswalk."
        },
        {
          id: "03_tariq_traffic_features",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "At the roundabout, take the second exit; do not turn down that one-way street or enter that dead-end lane!"
        },
        {
          id: "04_adam_prominent_sights",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Walk across the arched bridge away from the loud highway; ahead is the government building, a stone monument, a marble fountain, and a historic bronze statue."
        },
        {
          id: "05_omar_landmark_approval",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Identifying prominent architectural landmarks makes any urban path easy to remember."
        }
      ]
    },
    {
      id: "giving-directions-4",
      name: "Giving Directions 4",
      titleEn: "Civic Landmarks of the District",
      titleAr: "معالم الحي المدنية",
      setting: "Surveying key public institutions, parks, and emergency services across the town skyline.",
      wordIds: ["tower", "church", "park", "school", "hospital"],
      lines: [
        {
          id: "01_tariq_skyline_survey",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "From this hill vantage point, we can survey the five prominent civic landmarks of our community."
        },
        {
          id: "02_adam_skyline_features",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "I see the clock tower spire, the historic church roof, and the green canopy of the public park!"
        },
        {
          id: "03_omar_vital_institutions",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Down the avenue stands the secondary school where young minds study, and next to it is the general hospital providing medical care."
        },
        {
          id: "04_tariq_community_anchor",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "These core civic institutions anchor the social harmony and welfare of our town."
        }
      ]
    }
  ]
};
