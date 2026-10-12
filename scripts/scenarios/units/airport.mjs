/**
 * Unit 122: The Airport (airport)
 * 4 Lessons — 100% Target Vocabulary Coverage
 * CEFR Level: B1 Wider World (Intermediate Descriptive & Explanatory English)
 * Featuring 5-character ensemble: Layla, Hana, Tariq, Adam, Omar
 */

export const AIRPORT_SCENARIOS = {
  unitId: "airport",
  unitName: "The Airport",
  cefr: "B1",
  unitNameEn: "The Airport",
  unitNameAr: "المطار",
  lessons: [
    {
      id: "airport-1",
      name: "The Airport 1",
      titleEn: "Terminal Check-in, Security Screening & Airside Gates",
      titleAr: "تسجيل الوصول في المطار والفحص الأمني وبوابات الطيران",
      setting: "International departures terminal, security screening and departure gate.",
      wordIds: [
        "check-in-counter", "boarding-pass", "passport", "visa", "luggage",
        "suitcase", "carry-on", "baggage-claim", "conveyor-belt", "security-check",
        "metal-detector", "scanner", "terminal", "gate", "runway"
      ],
      lines: [
        {
          id: "01_layla_terminal_checkin",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "Arriving at the international airport terminal, travelers present their passport and entry visa at the airline check-in counter."
        },
        {
          id: "02_hana_luggage_and_boarding_pass",
          speaker: "Hana",
          voiceId: "cgSgspJ2msm6clMCkdW9",
          text: "Agents weigh your heavy checked luggage and hard-shell suitcase, tag your smaller carry-on bag, and issue your printed boarding pass."
        },
        {
          id: "03_tariq_security_screening",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Proceed through the mandatory security check, walking through the sensitive metal detector while baggage passes through the X-ray scanner."
        },
        {
          id: "04_omar_gates_and_runway",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Follow signs to your assigned departure gate, where panoramic windows overlook airliners taking off from the active concrete runway."
        },
        {
          id: "05_adam_baggage_claim",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Upon arrival at your destination, passengers head downstairs to the baggage claim area where carousel conveyor belt systems deliver luggage."
        }
      ]
    },
    {
      id: "airport-2",
      name: "The Airport 2",
      titleEn: "Concourse Facilities, Control Tower & Aircraft Structure",
      titleAr: "مرافق صالة السفر وبرج المراقبة وهيكل الطائرة",
      setting: "Airport concourse, air traffic control and aircraft exterior inspection.",
      wordIds: [
        "control-tower", "hangar", "departure-lounge", "arrivals-hall", "duty-free-shop",
        "food-court", "restroom", "elevator", "escalator", "airplane",
        "jet-engine", "wing", "cockpit", "fuselage", "propeller"
      ],
      lines: [
        {
          id: "01_layla_tower_and_hangar",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "The towering air traffic control tower coordinates flights, while maintenance crews park aircraft inside a secure maintenance hangar."
        },
        {
          id: "02_hana_concourse_amenities",
          speaker: "Hana",
          voiceId: "cgSgspJ2msm6clMCkdW9",
          text: "Passengers wait in the comfortable departure lounge, browse luxury perfumes at the duty-free shop, or grab a meal in the food court."
        },
        {
          id: "03_tariq_vertical_transit",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Take the escalator or glass elevator down toward the buzzing arrivals hall, passing a clean public restroom along the way."
        },
        {
          id: "04_omar_aircraft_structure",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Engineers inspect the parked commercial airplane: the aerodynamic curved fuselage, flight cockpit, and long swept-back wing."
        },
        {
          id: "05_adam_engines_and_propellers",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Technicians service twin underwing jet engine turbines on long-haul jets, and check the spinning nose propeller on regional turboprops."
        }
      ]
    },
    {
      id: "airport-3",
      name: "The Airport 3",
      titleEn: "Cabin Interior, Flight Crew & Ground Operations",
      titleAr: "مقصورة الركاب وطاقم الطيران والعمليات الأرضية",
      setting: "Aircraft cabin interior, cockpit and airport operations personnel.",
      wordIds: [
        "tail", "landing-gear", "window", "aisle", "overhead-bin",
        "tray-table", "pilot", "co-pilot", "flight-attendant", "passenger",
        "ground-crew", "air-traffic-controller", "customs-officer", "immigration-officer", "baggage-handler"
      ],
      lines: [
        {
          id: "01_layla_ground_coordination",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "Before departure, a vigilant air traffic controller clears the runway while ground crew and busy baggage handler teams load cargo."
        },
        {
          id: "02_hana_flight_deck_crew",
          speaker: "Hana",
          voiceId: "cgSgspJ2msm6clMCkdW9",
          text: "In the cockpit, the veteran captain pilot and skilled co-pilot complete their pre-flight instruments checklist."
        },
        {
          id: "03_tariq_cabin_boarding",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "A friendly flight attendant welcomes every passenger, helping stow luggage in the overhead bin before walking down the central aisle."
        },
        {
          id: "04_omar_cabin_seat_and_exterior",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Each traveler lowers their folding tray table, looks out the passenger window, and watches the retractable landing gear and high tail fin."
        },
        {
          id: "05_adam_border_control",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "After landing internationally, travelers present documents to the border immigration officer before clearing baggage with the customs officer."
        }
      ]
    },
    {
      id: "airport-4",
      name: "The Airport 4",
      titleEn: "Flight Operations, In-flight Safety & Travel Logistics",
      titleAr: "عمليات الرحلة والسلامة الجوية ولوجستيات السفر",
      setting: "Flight departure, in-flight safety and travel logistics.",
      wordIds: [
        "mechanic", "boarding", "takeoff", "landing", "taxiing",
        "turbulence", "announcement", "fasten-seatbelt", "emergency-exit", "life-vest",
        "oxygen-mask", "delay", "layover"
      ],
      lines: [
        {
          id: "01_layla_mechanic_and_boarding",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "A certified aviation mechanic inspects flight systems before gate agents announce general passenger boarding."
        },
        {
          id: "02_hana_taxiing_and_seatbelt",
          speaker: "Hana",
          voiceId: "cgSgspJ2msm6clMCkdW9",
          text: "During slow taxiing toward the runway, the cabin intercom announcement reminds everyone to fasten seatbelt signs."
        },
        {
          id: "03_tariq_emergency_equipment",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Safety briefings locate each illuminated emergency exit, under-seat life vest, and drop-down overhead oxygen mask."
        },
        {
          id: "04_omar_takeoff_and_turbulence",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Feel powerful thrust during takeoff acceleration, and maintain calm if atmospheric turbulence causes sudden minor bumps at cruising altitude."
        },
        {
          id: "05_adam_landing_and_layover",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Smooth descent leads to a gentle runway landing, avoiding any weather delay during your scheduled international layover."
        }
      ]
    }
  ]
};
