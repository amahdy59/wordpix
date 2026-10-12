/**
 * Unit 173: The Solar Farm (solar-farm)
 * 5 Lessons — 100% Target Vocabulary Coverage
 * CEFR Level: B2 Fluency & Work (Professional, Managerial & Clean Energy English)
 * Featuring 5-character ensemble: Layla, Hana, Tariq, Adam, Omar
 */

export const SOLAR_FARM_SCENARIOS = {
  unitId: "solar-farm",
  unitName: "The Solar Farm",
  cefr: "B2",
  unitNameEn: "The Solar Farm",
  unitNameAr: "مزرعة الطاقة الشمسية",
  lessons: [
    {
      id: "solar-farm-1",
      name: "The Solar Farm 1",
      titleEn: "Solar Trackers, Inverter Combiners & Grid Interconnection",
      titleAr: "المتتبعات الشمسية ومجمعات العاكسات والربط بالشبكة",
      setting: "Utility-scale solar array field and central inverter pad.",
      wordIds: [
        "solar-panel", "inverter", "battery-storage", "charge-controller", "mounting-frame",
        "tracker", "junction-box", "combiner-box", "transformer", "grid-connection",
        "drill", "wrench", "wire-cutter", "crimping-tool", "cable-tie"
      ],
      lines: [
        {
          id: "01_layla_panels_and_trackers",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "Technicians secure each photovoltaic solar panel onto a motorized single-axis tracker and galvanized steel mounting frame."
        },
        {
          id: "02_hana_boxes_and_inverters",
          speaker: "Hana",
          voiceId: "cgSgspJ2msm6clMCkdW9",
          text: "DC power flows from the module junction box into a central combiner box before an industrial inverter converts power to AC."
        },
        {
          id: "03_tariq_transformers_and_grid",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Surplus energy stores in utility-scale battery storage, regulated by a charge controller, before a step-up transformer delivers power to the utility grid connection."
        },
        {
          id: "04_omar_electrical_tools",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Electricians assemble wire harnesses with a cordless drill, torque wrench, wire cutter, and ratcheting crimping tool."
        },
        {
          id: "05_adam_cable_ties",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Bundle high-voltage conductors neatly along the frame using UV-resistant cable ties."
        }
      ]
    },
    {
      id: "solar-farm-2",
      name: "The Solar Farm 2",
      titleEn: "Substation Protection, Grounding Rods & Site Facilities",
      titleAr: "حماية المحطات التحويلية وقضبان التأريض ومرافق الموقع",
      setting: "Solar farm substation, perimeter security, and control room.",
      wordIds: [
        "conduit", "ground-rod", "multimeter", "level", "ladder",
        "control-room", "security-fence", "access-road", "gate", "weather-station",
        "camera", "substation", "cable-tray", "lightning-rod", "grounding-system"
      ],
      lines: [
        {
          id: "01_layla_site_security",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "Entering through the facility security gate along the gravel access road, the entire perimeter is secured by a chain-link security fence with surveillance cameras."
        },
        {
          id: "02_hana_conduits_and_substations",
          speaker: "Hana",
          voiceId: "cgSgspJ2msm6clMCkdW9",
          text: "Feed subterranean wiring through protective PVC conduit, elevated overhead cable trays, and connect straight to the main electrical substation."
        },
        {
          id: "03_tariq_lightning_and_grounding",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Protect high-voltage equipment against lightning strikes with an overhead lightning rod, deep copper ground rod, and comprehensive grounding system."
        },
        {
          id: "04_omar_testing_and_ladders",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Technicians climb an aluminum ladder, check frame alignment with a bubble level, and test circuit voltage with a handheld multimeter."
        },
        {
          id: "05_adam_control_and_weather",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "The facility control room monitors meteorological sensors mounted on an onsite weather station."
        }
      ]
    },
    {
      id: "solar-farm-3",
      name: "The Solar Farm 3",
      titleEn: "Solar Irradiance, Electrical Output & Aerial Drone Audits",
      titleAr: "الإشعاع الشمسي والإنتاج الكهربائي وفحص الطائرات المسيرة",
      setting: "Solar array field inspection and electrical metering station.",
      wordIds: [
        "sunlight", "solar-cell", "electricity", "voltage", "current",
        "watt", "kilowatt", "energy-meter", "power-line", "distribution-panel",
        "cleaning-brush", "water-hose", "inspection-drone", "thermal-camera", "safety-vest"
      ],
      lines: [
        {
          id: "01_layla_solar_conversion",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "Abundant golden sunlight hits millions of silicon solar cells, converting solar irradiance into clean green electricity."
        },
        {
          id: "02_hana_power_metrics",
          speaker: "Hana",
          voiceId: "cgSgspJ2msm6clMCkdW9",
          text: "Sensors measure rising direct-current voltage and operating current, calculating instantaneous power in watts and total kilowatts generated."
        },
        {
          id: "03_tariq_distribution_and_metering",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Power routes through the facility distribution panel and overhead transmission power lines, tracked by a certified utility energy meter."
        },
        {
          id: "04_omar_panel_cleaning",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Maintenance crews scrub away dust using an extendable cleaning brush and high-pressure water hose."
        },
        {
          id: "05_adam_drone_thermography",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Inspectors wearing a high-visibility safety vest pilot an inspection drone equipped with an infrared thermal camera to spot overheated micro-cracks."
        }
      ]
    },
    {
      id: "solar-farm-4",
      name: "The Solar Farm 4",
      titleEn: "Field Ecology, Weather Fluctuations & Safety Gear",
      titleAr: "بيئة الحقل وتقلبات الطقس ومعدات السلامة",
      setting: "Open grassland solar field, ecological habitat, and field office.",
      wordIds: [
        "hard-hat", "gloves", "tool-belt", "logbook", "clipboard",
        "open-field", "clear-sky", "shadow", "cloud", "sunrise",
        "sunset", "grassland", "wildflower", "bird", "fence-post"
      ],
      lines: [
        {
          id: "01_layla_diurnal_cycles",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "From early sunrise to late sunset, the vast open field operates quietly beneath an expansive clear sky."
        },
        {
          id: "02_hana_shadows_and_clouds",
          speaker: "Hana",
          voiceId: "cgSgspJ2msm6clMCkdW9",
          text: "Field engineers track shadows cast across panels whenever an isolated cloud drifts overhead."
        },
        {
          id: "03_tariq_grassland_ecology",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Wild pollinators thrive across the surrounding native grassland, blooming with colorful wildflowers and singing birds perched upon each wooden fence post."
        },
        {
          id: "04_omar_ppe_gear",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Technicians wear an impact-resistant hard hat, leather work gloves, and a heavy leather tool belt."
        },
        {
          id: "05_adam_logging_audits",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Record environmental audits on a weather-resistant clipboard and sign the station maintenance logbook."
        }
      ]
    },
    {
      id: "solar-farm-5",
      name: "The Solar Farm 5",
      titleEn: "Renewable Storage, Emission Reduction & Sustainability",
      titleAr: "التخزين المتجدد وخفض الانبعاثات والاستدامة البيئية",
      setting: "Battery energy storage system (BESS) yard and grid interconnect.",
      wordIds: [
        "battery", "cable", "mounting-rack", "meter", "grid",
        "charge", "discharge", "clean-energy", "renewable", "carbon",
        "emission", "sustainability", "efficiency", "conservation", "recycle"
      ],
      lines: [
        {
          id: "01_layla_bess_charging",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "Heavy-gauge copper cable connects modular mounting racks to massive utility battery banks that charge during sunny midday peaks."
        },
        {
          id: "02_hana_discharging_to_grid",
          speaker: "Hana",
          voiceId: "cgSgspJ2msm6clMCkdW9",
          text: "During evening peak demand, batteries discharge stored power directly into the regional electric grid, monitored on the main utility meter."
        },
        {
          id: "03_tariq_carbon_reduction",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Generating 100% clean energy and renewable solar power eliminates harmful carbon emissions."
        },
        {
          id: "04_omar_sustainability_conservation",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Long-term corporate sustainability hinges on natural resource conservation and responsible power management."
        },
        {
          id: "05_adam_efficiency_and_recycling",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Maximize operational efficiency throughout the plant's 30-year lifecycle and recycle decommissioned silicon panels responsibly."
        }
      ]
    }
  ]
};
