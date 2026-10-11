// Scenarios for Unit 004: basic-emotions
// Voices:
// Tariq: British (George: JBFqnCBsd6RMkjVDRZzb)
// Adam: American (Will: bIHbv24MWmeRgasZH58o)
// Omar: Australian (Charlie: IKne3meq5aSn9XLyUdCD)

export const BASIC_EMOTIONS_SCENARIOS = {
  unitId: "basic-emotions",
  unitName: "Basic Emotions",
  cefr: "Pre-A1",
  lessons: [
    {
      id: "basic-emotions-1",
      name: "Basic Emotions 1",
      titleEn: "The Science Fair Celebration",
      titleAr: "احتفال معرض العلوم",
      setting: "Tariq and Uncle Omar celebrate with Adam after an eventful day at the community invention fair.",
      wordIds: [
        "happy", "joyful", "excited", "proud", "grateful",
        "content", "amused", "delighted", "cheerful", "hopeful",
        "sad", "angry", "scared", "worried", "frustrated"
      ],
      lines: [
        {
          id: "01_tariq_praise",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "You did it, Adam! We are so proud of you, and deeply grateful for your persistence today."
        },
        {
          id: "02_adam_joy",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Thank you! I feel so happy, joyful, and excited tonight, completely content with our presentation."
        },
        {
          id: "03_omar_humor",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Your cheerful energy made everyone delighted, and your spinning robot kept the whole crowd amused!"
        },
        {
          id: "04_adam_challenges",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "This morning I was hopeful, but also scared and worried when the battery failed. I felt sad and frustrated, almost angry for a second!"
        },
        {
          id: "05_tariq_wrap",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Yet you stayed calm through the trial, and overcame every obstacle with grace."
        }
      ]
    },
    {
      id: "basic-emotions-2",
      name: "Basic Emotions 2",
      titleEn: "The Rainy Station Waiting Room",
      titleAr: "استراحة المحطة الممطرة",
      setting: "Waiting out a sudden rainstorm and train delay inside the comfortable station tea room.",
      wordIds: [
        "disappointed", "upset", "annoyed", "bored", "lonely",
        "calm", "tired", "surprised", "confused", "curious",
        "thoughtful", "relaxed", "indifferent", "sleepy", "alert"
      ],
      lines: [
        {
          id: "01_adam_delay",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "When the train was delayed, some commuters looked disappointed and upset, while others seemed annoyed."
        },
        {
          id: "02_omar_patience",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "I felt bored and lonely at first, but sitting quietly kept my heart calm, even though my legs were tired."
        },
        {
          id: "03_adam_curiosity",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "I was surprised when the lights flickered and a bit confused by the speaker announcement, but curious to read this old book."
        },
        {
          id: "04_tariq_reflection",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Reading made you thoughtful and relaxed, while those rushing past seemed indifferent to the quiet evening."
        },
        {
          id: "05_adam_tea",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "I felt sleepy an hour ago, but this fresh cardamom tea has made me sharp and alert!"
        }
      ]
    },
    {
      id: "basic-emotions-3",
      name: "Basic Emotions 3",
      titleEn: "Returning from the Mountain Trail",
      titleAr: "العودة من الممر الجبلي",
      setting: "Resting in the mountain lodge courtyard after an adventurous hike before sunset dinner.",
      wordIds: [
        "hungry", "thirsty", "full", "cold", "hot",
        "dizzy", "nauseous", "exhausted", "energetic", "comfortable"
      ],
      lines: [
        {
          id: "01_adam_sensations",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "What a journey! Under the midday sun I was sweating and hot, completely thirsty, and now my stomach is hungry."
        },
        {
          id: "02_omar_altitude",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "At the windy mountain summit, I felt cold and dizzy from the steep trail, slightly nauseous for a moment."
        },
        {
          id: "03_tariq_care",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Sit beside the hearth. You were both exhausted, but these wool rugs will make you warm and comfortable."
        },
        {
          id: "04_adam_revival",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "After this warm lentil soup and fresh bread, my belly is delightfully full and I feel energetic once more!"
        }
      ]
    }
  ]
};
