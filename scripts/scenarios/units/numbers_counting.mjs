// Scenarios for Unit 001: numbers-counting
// Voices:
// Tariq: British (George: JBFqnCBsd6RMkjVDRZzb)
// Adam: American (Will: bIHbv24MWmeRgasZH58o)
// Omar: Australian (Charlie: IKne3meq5aSn9XLyUdCD)

export const NUMBERS_COUNTING_SCENARIOS = {
  unitId: "numbers-counting",
  unitName: "Numbers & Counting",
  cefr: "Pre-A1",
  lessons: [
    {
      id: "numbers-counting-1",
      name: "Numbers & Counting 1",
      titleEn: "The Date Harvest Box",
      titleAr: "صندوق التمر اللذيذ",
      setting: "Tariq and Adam are at the kitchen counter with Uncle Omar, packing fresh dates for their guests.",
      wordIds: [
        "one", "two", "three", "four", "five",
        "six", "seven", "eight", "nine", "ten",
        "eleven", "twelve", "thirteen", "fourteen", "fifteen"
      ],
      lines: [
        {
          id: "01_tariq_intro",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Adam, Uncle Omar brought fresh dates. How many do we have for the guests?"
        },
        {
          id: "02_adam_count_1_5",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Let's count! One, two, three, four, five... wait, look here!"
        },
        {
          id: "03_adam_count_6_10",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Six, seven, eight, nine, ten!"
        },
        {
          id: "04_omar_count_11_15",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Splendid counting, Adam! Now add the ripe ones: eleven, twelve, thirteen, fourteen, fifteen."
        },
        {
          id: "05_tariq_wrap",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Exactly fifteen sweet dates. Beautiful work!"
        }
      ]
    },
    {
      id: "numbers-counting-2",
      name: "Numbers & Counting 2",
      titleEn: "The Heritage Coin Chest",
      titleAr: "صندوق العملات التراثية",
      setting: "Omar shows Tariq and Adam an antique wooden chest with heritage collector coins.",
      wordIds: [
        "sixteen", "seventeen", "eighteen", "nineteen", "twenty",
        "thirty", "forty", "fifty", "sixty", "seventy",
        "eighty", "ninety", "hundred", "thousand", "million"
      ],
      lines: [
        {
          id: "01_omar_intro",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Look at this heritage collection! In this silver tray, we have sixteen, seventeen, eighteen, nineteen, twenty ancient coins."
        },
        {
          id: "02_adam_reaction",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Twenty coins! Are there more in the wooden drawers?"
        },
        {
          id: "03_tariq_tens",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Yes! They are bundled in sets of ten: thirty, forty, fifty, sixty, seventy, eighty, ninety!"
        },
        {
          id: "04_adam_hundred",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "That makes one hundred historic coins!"
        },
        {
          id: "05_omar_large_numbers",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Indeed! And centuries ago, a thousand merchants traded them across a million desert miles."
        }
      ]
    },
    {
      id: "numbers-counting-3",
      name: "Numbers & Counting 3",
      titleEn: "The Mental Math Challenge",
      titleAr: "تحدي الحساب الذهني",
      setting: "Tariq and Omar quiz Adam with a rapid score sheet on the chalkboard.",
      wordIds: [
        "first", "second", "third", "fourth", "fifth",
        "sixth", "seventh", "eighth", "ninth", "tenth",
        "addition", "subtraction", "multiplication", "division", "equals"
      ],
      lines: [
        {
          id: "01_tariq_start",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Ready for round one of our math quiz, Adam? Let's check the leaderboard."
        },
        {
          id: "02_adam_ordinals_1_5",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "I solved the first, second, third, fourth, and fifth questions correctly!"
        },
        {
          id: "03_omar_ordinals_6_10",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Brilliant! Now rank your next answers: sixth, seventh, eighth, ninth, and tenth."
        },
        {
          id: "04_tariq_operations",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Perfect order. Now calculate the total score using addition and subtraction."
        },
        {
          id: "05_adam_equals",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Through quick multiplication and division, the final score equals ten out of ten!"
        }
      ]
    },
    {
      id: "numbers-counting-4",
      name: "Numbers & Counting 4",
      titleEn: "Omar's Market Stall Deal",
      titleAr: "عرض متجر عمر",
      setting: "At Omar's market stall, working out calligraphy bundle discounts.",
      wordIds: ["plus", "minus", "times", "divided-by", "percentage"],
      lines: [
        {
          id: "01_adam_question",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Uncle Omar, how much is this Arabic calligraphy set?"
        },
        {
          id: "02_omar_plus_minus",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "The pen is four dollars plus two dollars for the ink, minus a one-dollar discount."
        },
        {
          id: "03_tariq_times",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "And if Adam buys three sets, that is five dollars times three!"
        },
        {
          id: "04_omar_divided_percentage",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Divided by three friends, with a twenty percentage bonus discount today!"
        }
      ]
    }
  ]
};
