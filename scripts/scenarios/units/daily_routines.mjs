// Scenarios for Unit 016: daily-routines
// Voices:
// Tariq: British (George: JBFqnCBsd6RMkjVDRZzb)
// Adam: American (Will: bIHbv24MWmeRgasZH58o)
// Omar: Australian (Charlie: IKne3meq5aSn9XLyUdCD)

export const DAILY_ROUTINES_SCENARIOS = {
  unitId: "daily-routines",
  unitName: "Daily Routines",
  cefr: "Pre-A1",
  lessons: [
    {
      id: "daily-routines-1",
      name: "Daily Routines 1",
      titleEn: "The Morning Commute & Campus Arrival",
      titleAr: "الرحلة الصباحية والوصول إلى العمل والجامعة",
      setting: "Following the energetic morning steps from sunrise alarm to commuting and attending classes.",
      wordIds: [
        "wake-up", "alarm-clock", "get-out-of-bed", "stretch", "brush-teeth",
        "wash-face", "take-a-shower", "get-dressed", "eat-breakfast", "pack-bag",
        "commute", "arrive", "start-work", "attend-class", "take-notes"
      ],
      lines: [
        {
          id: "01_tariq_morning_prompt",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "When the alarm clock rings, Adam, do not linger: wake up promptly, stretch your limbs, and get out of bed."
        },
        {
          id: "02_adam_morning_sequence",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "I wash face with cool water, brush teeth, take a shower, and get dressed in comfortable clothing."
        },
        {
          id: "03_omar_breakfast_prep",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Never skip meals: eat breakfast together, and pack bag with your lecture notes and laptop."
        },
        {
          id: "04_adam_transit_classes",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Now begins my morning commute across the avenues; I will arrive before eight, start work on time, attend class, and take notes carefully."
        },
        {
          id: "05_tariq_routine_praise",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Mastering your morning schedule ensures every subsequent hour is fruitful."
        }
      ]
    },
    {
      id: "daily-routines-2",
      name: "Daily Routines 2",
      titleEn: "Midday Collaboration & Evening Balance",
      titleAr: "التعاون في منتصف النهار وتوازن المساء",
      setting: "Working with colleagues, managing lunch breaks, after-school responsibilities, and family chores.",
      wordIds: [
        "have-a-meeting", "lunch-break", "collaborate", "submit-work", "leave-office",
        "after-school", "homework", "exercise", "practice", "grocery-shop",
        "cook-dinner", "walk-the-dog", "play-outside", "read-a-book", "watch-tv"
      ],
      lines: [
        {
          id: "01_omar_workday_tempo",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Work requires teamwork: we have a meeting with project leads, collaborate on designs, and submit work before deadlines."
        },
        {
          id: "02_adam_afternoon_transition",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "We take a healthy lunch break in the park; then at five, we leave office and head home."
        },
        {
          id: "03_tariq_study_exercise",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "After school, students complete homework, practice language skills, and get active outdoor exercise."
        },
        {
          id: "04_adam_domestic_tasks",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "On the way, I grocery shop for fresh vegetables, walk the dog around the park, and help cook dinner."
        },
        {
          id: "05_omar_evening_culture",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "The neighborhood children play outside, while we read a book together in quiet peace instead of staying inside to watch TV all night."
        }
      ]
    },
    {
      id: "daily-routines-3",
      name: "Daily Routines 3",
      titleEn: "Evening Reset & Weekend Adventures",
      titleAr: "إعادة ضبط المساء وعطلة نهاية الأسبوع",
      setting: "Transitioning from dinner cleanup to deep restorative sleep, followed by weekend recreation.",
      wordIds: [
        "eat-dinner", "wash-dishes", "relax", "take-a-bath", "put-on-pajamas",
        "read", "set-alarm", "go-to-bed", "fall-asleep", "sleep-in",
        "brunch", "go-shopping", "visit-friends", "go-to-the-park", "play-sports"
      ],
      lines: [
        {
          id: "01_tariq_evening_dinner",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "We eat dinner together in warm fellowship, wash dishes in the sink, and relax in the comfortable living room."
        },
        {
          id: "02_adam_bedtime_calm",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "I take a bath to unwind, put on pajamas, read quietly, set alarm for dawn, go to bed, and fall asleep peacefully."
        },
        {
          id: "03_omar_weekend_leisure",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "On Saturday, you can sleep in a little later, savor a delicious brunch, and go shopping at the city market."
        },
        {
          id: "04_adam_weekend_activities",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Then we visit friends, go to the park for fresh sunshine, and play sports on the grass!"
        },
        {
          id: "05_tariq_harmony_wrap",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Balanced routines throughout the week make weekend leisure truly restorative and joyful."
        }
      ]
    },
    {
      id: "daily-routines-4",
      name: "Daily Routines 4",
      titleEn: "The Weekend Home & Social Decisions",
      titleAr: "قرارات نهاية الأسبوع بين البيت والخروج",
      setting: "Deciding between outdoor exploration and maintaining home cleanliness during leisure days.",
      wordIds: ["clean-house", "do-laundry", "go-out", "stay-home"],
      lines: [
        {
          id: "01_omar_weekend_choices",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Sunday morning brings an enjoyable choice, boys: do you prefer to go out into town, or stay home in quiet tranquility?"
        },
        {
          id: "02_adam_shared_chores",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "First let us clean house and do laundry together, vacuuming the halls and washing our linens."
        },
        {
          id: "03_tariq_earned_freedom",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "With a clean home, we can go out to visit the art museum with complete peace of mind!"
        },
        {
          id: "04_omar_duty_first",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Fulfilling household duties first makes every leisure activity twice as enjoyable."
        }
      ]
    }
  ]
};
