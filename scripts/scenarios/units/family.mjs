// Scenarios for Unit 005: family
// Voices:
// Tariq: British (George: JBFqnCBsd6RMkjVDRZzb)
// Adam: American (Will: bIHbv24MWmeRgasZH58o)
// Omar: Australian (Charlie: IKne3meq5aSn9XLyUdCD)

export const FAMILY_SCENARIOS = {
  unitId: "family",
  unitName: "The Family",
  cefr: "Pre-A1",
  lessons: [
    {
      id: "family-1",
      name: "The Family 1",
      titleEn: "The Family Tree Gallery",
      titleAr: "معرض شجرة العائلة",
      setting: "Tariq, Adam, and Uncle Omar admire the family tree wall and framed portraits in the sitting room.",
      wordIds: [
        "mother", "father", "sister", "brother", "son",
        "daughter", "parents", "siblings", "baby", "twin",
        "mom", "dad", "big-sister", "little-brother", "oldest-child"
      ],
      lines: [
        {
          id: "01_tariq_parents",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Look at our family gallery, Adam. Our gentle mother and hardworking father built this peaceful home."
        },
        {
          id: "02_adam_siblings",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Mom and Dad are such caring parents! We have our sensible big sister, a younger sister, and you, my older brother."
        },
        {
          id: "03_omar_births",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Tariq is the proud oldest child, and Adam is the energetic little brother! And look here: your aunt holds her sweet baby, alongside her twin boys."
        },
        {
          id: "04_tariq_harmony",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Every son and daughter brings immense light, and all four siblings stand united."
        }
      ]
    },
    {
      id: "family-2",
      name: "The Family 2",
      titleEn: "The Weekend Gathering Plan",
      titleAr: "خطة التجمع العائلي",
      setting: "Planning weekend family activities, meals, and routines over morning tea.",
      wordIds: [
        "youngest-child", "middle-child", "only-child", "stepmother", "stepfather",
        "family-dinner", "game-night", "road-trip", "holiday-gathering", "movie-night",
        "cooking-together", "bedtime-story", "morning-routine", "family-photo", "homework-help"
      ],
      lines: [
        {
          id: "01_tariq_routine",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "During our peaceful morning routine, I provide homework help for Adam before school."
        },
        {
          id: "02_adam_gatherings",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Even as the youngest child, I love cooking together before our weekly family dinner, followed by game night and movie night!"
        },
        {
          id: "03_omar_extended",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "My friend Bilal was an only child, but now his middle child is joining our road trip to the annual holiday gathering."
        },
        {
          id: "04_tariq_memories",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "His kind stepmother and thoughtful stepfather helped hang the golden family photo, right before grandmother read us a bedtime story."
        }
      ]
    },
    {
      id: "family-3",
      name: "The Family 3",
      titleEn: "Generations of Heritage",
      titleAr: "أجيال من التراث والقيم",
      setting: "Reflecting on core family virtues, mutual respect, and heritage.",
      wordIds: [
        "love", "trust", "support", "care", "protection",
        "guidance", "discipline", "affection", "bond", "heritage"
      ],
      lines: [
        {
          id: "01_tariq_foundation",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "A noble family is established upon pure love, steadfast trust, and unwavering mutual support."
        },
        {
          id: "02_adam_nurture",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Our parents provide daily care, secure protection, and wise moral guidance through every age."
        },
        {
          id: "03_omar_discipline_bond",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Gentle discipline molds true integrity, while sincere affection enriches the lifelong family bond."
        },
        {
          id: "04_tariq_legacy",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Living by these virtues honors our ancestors and preserves our cherished family heritage."
        }
      ]
    }
  ]
};
