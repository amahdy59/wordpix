// Scenarios for Unit 012: telling-time
// Voices:
// Tariq: British (George: JBFqnCBsd6RMkjVDRZzb)
// Adam: American (Will: bIHbv24MWmeRgasZH58o)
// Omar: Australian (Charlie: IKne3meq5aSn9XLyUdCD)

export const TELLING_TIME_SCENARIOS = {
  unitId: "telling-time",
  unitName: "Telling Time",
  cefr: "Pre-A1",
  lessons: [
    {
      id: "telling-time-1",
      name: "Telling Time 1",
      titleEn: "The Master Clockmaker's Workshop",
      titleAr: "ورشة صانع الساعات الخبير",
      setting: "Inside Uncle Omar's historic horology workshop filled with pendulums, antique sundials, and sand timers.",
      wordIds: [
        "clock", "watch", "hour-hand", "minute-hand", "second-hand",
        "clock-face", "alarm-clock", "digital-clock", "sundial", "hourglass",
        "second", "minute", "hour", "half-hour", "quarter-hour"
      ],
      lines: [
        {
          id: "01_tariq_clockmaker_intro",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "A master clockmaker values every tick, Adam. Notice how time is measured across this fascinating workshop."
        },
        {
          id: "02_adam_dials_hands",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "I see a wooden pendulum clock, a pocket watch, an electronic digital clock, and a ringing alarm clock! The dial has a painted clock face, a short hour hand, a long minute hand, and a sweeping second hand."
        },
        {
          id: "03_omar_ancient_instruments",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Centuries ago, travelers measured sunlight upon a stone sundial, or watched fine quartz sand trickle inside a glass hourglass."
        },
        {
          id: "04_adam_intervals_breakdown",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Each tiny tick is one second. Sixty seconds make a minute, sixty minutes make an hour, thirty minutes make a half hour, and fifteen minutes make a quarter hour!"
        },
        {
          id: "05_tariq_precision_wrap",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Exact measurement of every second and hour teaches us discipline, focus, and punctuality."
        }
      ]
    },
    {
      id: "telling-time-2",
      name: "Telling Time 2",
      titleEn: "The Clock Tower Bell & Daily Intervals",
      titleAr: "جرس برج الساعة وفترات اليوم",
      setting: "Standing before the historic town square clock tower, practicing natural English time intervals and bells.",
      wordIds: [
        "noon", "midnight", "dawn", "dusk", "twilight",
        "o-clock", "half-past", "quarter-past", "quarter-to", "five-past",
        "ten-past", "twenty-past", "five-to", "ten-to", "sharp"
      ],
      lines: [
        {
          id: "01_omar_tower_bell",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Listen to the clock tower chime across the cobblestone square, boys! Let's practice reading exact time intervals."
        },
        {
          id: "02_adam_sun_milestones",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "When both hands point upward in the bright sun, it is noon! When they meet in the dark, it is midnight. The day starts at dawn, and ends through dusk and twilight."
        },
        {
          id: "03_tariq_analog_quarters",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Listen to the bells: at twelve o'clock sharp, it rings loud! At twelve fifteen, we say quarter past twelve. At twelve thirty, it is half past twelve, and at twelve forty-five, it is quarter to one."
        },
        {
          id: "04_adam_five_minute_steps",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Five minutes after is five past, ten minutes after is ten past, and twenty minutes after is twenty past. Before the hour, ten minutes left is ten to, and five minutes left is five to!"
        },
        {
          id: "05_omar_interval_approval",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Outstanding precision, Adam! You can now tell the time clearly in any city around the world."
        }
      ]
    },
    {
      id: "telling-time-3",
      name: "Telling Time 3",
      titleEn: "From Sunrise to Nightfall",
      titleAr: "من الشروق حتى حلول الليل",
      setting: "Planning an efficient, balanced daily schedule while observing celestial diurnal cycles.",
      wordIds: [
        "morning", "afternoon", "evening", "night", "sunrise",
        "sunset", "midday", "late-night", "early-morning", "nightfall",
        "a-m-", "p-m-", "on-time", "early", "late"
      ],
      lines: [
        {
          id: "01_tariq_diurnal_rhythm",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "A well-ordered day follows the sun's rhythm, Adam. We wake in the early morning at sunrise, when the sky fills with golden light."
        },
        {
          id: "02_adam_day_phases",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "During the energetic morning, our minds are fresh. By midday and through the afternoon, we focus on studies. In the cool evening at sunset, we rest, and after nightfall, the peaceful night begins."
        },
        {
          id: "03_omar_am_pm_notation",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Notice standard international clock notation: seven in the morning is 7:00 a.m., while eight in the evening is 8:00 p.m."
        },
        {
          id: "04_adam_punctuality_standard",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Punctuality is essential: when meeting our study group, we should never be late, nor merely on time, but pleasantly early!"
        },
        {
          id: "05_tariq_health_balance",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Exactly. Avoid late night fatigue, and you will always wake refreshed to greet the new day."
        }
      ]
    },
    {
      id: "telling-time-4",
      name: "Telling Time 4",
      titleEn: "Race Against the Clock",
      titleAr: "سباق مع الوقت والإنجاز",
      setting: "Timing a sports sprint and managing project deadlines with precision stopwatch countdowns.",
      wordIds: ["ahead-of-time", "behind-schedule", "overtime", "countdown", "stopwatch"],
      lines: [
        {
          id: "01_omar_precision_sprint",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "In athletics and major projects, timing is everything. Prepare for your campus sprint trial, Adam!"
        },
        {
          id: "02_adam_countdown_sprint",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "I readied the digital stopwatch, listened to the ten-second countdown, and crossed the finish line thirty seconds ahead of time!"
        },
        {
          id: "03_tariq_schedule_management",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Splendid pace! We never fell behind schedule today, which means our team will not need to work exhausting overtime tonight."
        },
        {
          id: "04_omar_schedule_mastery",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Mastering your schedule brings calm, confidence, and peak performance to everything you pursue."
        }
      ]
    }
  ]
};
