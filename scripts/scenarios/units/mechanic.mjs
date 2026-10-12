/**
 * Unit 137: The Mechanic (mechanic)
 * 4 Lessons — 100% Target Vocabulary Coverage
 * CEFR Level: B1 Wider World (Intermediate Descriptive & Explanatory English)
 * Featuring 5-character ensemble: Layla, Hana, Tariq, Adam, Omar
 */

export const MECHANIC_SCENARIOS = {
  unitId: "mechanic",
  unitName: "The Mechanic",
  cefr: "B1",
  unitNameEn: "The Mechanic",
  unitNameAr: "الميكانيكي",
  lessons: [
    {
      id: "mechanic-1",
      name: "The Mechanic 1",
      titleEn: "Workshop Hand Tools, Chassis Lifting & Powertrain Basics",
      titleAr: "أدوات الورشة اليدوية ورفع الهيكل وأساسيات مجموعة نقل الحركة",
      setting: "Automotive garage repair bay.",
      wordIds: [
        "wrench", "screwdriver", "socket-set", "pliers", "jack",
        "torque-wrench", "hammer", "pry-bar", "multimeter", "drill",
        "engine", "tire", "brake-pad", "battery", "alternator"
      ],
      lines: [
        {
          id: "01_layla_jack_and_tire",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "The master mechanic rolls a hydraulic floor jack beneath the chassis before removing the punctured tire."
        },
        {
          id: "02_hana_engine_electrical",
          speaker: "Hana",
          voiceId: "cgSgspJ2msm6clMCkdW9",
          text: "Inspect the primary engine bay: test the 12-volt battery and measure charging voltage from the alternator using a digital multimeter."
        },
        {
          id: "03_tariq_hand_tools",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Reach for your heavy toolbox: select a flathead screwdriver, adjustable wrench, heavy claw hammer, and slip-joint pliers."
        },
        {
          id: "04_omar_pry_bar_and_drill",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Loosen stubborn rusted suspension bolts using a rigid steel pry bar and high-speed cordless power drill."
        },
        {
          id: "05_adam_brakes_and_torque_wrench",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Fasten the new ceramic brake pad using a complete chrome socket set, tightening wheel lug nuts with a calibrated torque wrench."
        }
      ]
    },
    {
      id: "mechanic-2",
      name: "The Mechanic 2",
      titleEn: "Vehicle Subsystems, Powertrain Dynamics & Climate Control",
      titleAr: "الأنظمة الفرعية للمركبة وديناميكيات الحركة ونظام التكييف",
      setting: "Diagnostic evaluation bay and undercarriage inspection area.",
      wordIds: [
        "radiator", "muffler", "spark-plug", "air-filter", "oil-filter",
        "transmission", "suspension", "exhaust", "cooling-system", "steering",
        "fuel-system", "electrical", "brakes", "drivetrain", "ac-system"
      ],
      lines: [
        {
          id: "01_layla_wiring_and_fuel",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "Modern diagnostic inspections evaluate the complete electrical wiring network and pressurized fuel system."
        },
        {
          id: "02_hana_cooling_and_air_filter",
          speaker: "Hana",
          voiceId: "cgSgspJ2msm6clMCkdW9",
          text: "The cooling system circulates fluid through the aluminum radiator, while clean airflow enters via the engine air filter."
        },
        {
          id: "03_tariq_plugs_and_filters",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Ignition timing depends on a clean spark plug, and routine lube maintenance requires replacing the spin-on oil filter."
        },
        {
          id: "04_omar_exhaust_and_muffler",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Combustion gases flow quietly through the stainless steel exhaust pipe and sound-dampening muffler."
        },
        {
          id: "05_adam_handling_and_drivetrain",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Check the responsive power steering, coil spring suspension, smooth multi-gear transmission, robust drivetrain, responsive hydraulic brakes, and cooling cabin AC system."
        }
      ]
    },
    {
      id: "mechanic-3",
      name: "The Mechanic 3",
      titleEn: "Garage Machinery, Fluid Maintenance & Heavy Equipment",
      titleAr: "آلات الورشة وصيانة السوائل والمعدات الثقيلة",
      setting: "Heavy service lift bay and tire service department.",
      wordIds: [
        "lift", "diagnostic-scanner", "air-compressor", "creeper", "toolbox",
        "oil-drain", "tire-changer", "balancer", "welder", "grinder",
        "motor-oil", "coolant", "brake-fluid", "transmission-fluid", "grease"
      ],
      lines: [
        {
          id: "01_layla_lift_and_scanner",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "The technician raises an SUV on the two-post vehicle lift, plugging an OBD2 diagnostic scanner into the dashboard."
        },
        {
          id: "02_hana_creeper_and_drain",
          speaker: "Hana",
          voiceId: "cgSgspJ2msm6clMCkdW9",
          text: "Slide underneath on a padded wheeled mechanic creeper, wheeling over the rolling metal toolbox and oil drain pan."
        },
        {
          id: "03_tariq_fluid_exchange",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Drain old black motor oil, top up synthetic transmission fluid, replenish high-temp brake fluid, and flush green radiator coolant."
        },
        {
          id: "04_omar_grease_and_compressor",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Lubricate chassis ball joints with thick grease, powering pneumatic tools from a central industrial air compressor."
        },
        {
          id: "05_adam_tire_service_and_welding",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Mount new rubber on the hydraulic tire changer, spin wheels on the dynamic wheel balancer, and repair bracket welds using an electric MIG welder and angle grinder."
        }
      ]
    },
    {
      id: "mechanic-4",
      name: "The Mechanic 4",
      titleEn: "Preventive Maintenance, Collision Repairs & Customer Estimates",
      titleAr: "الصيانة الوقائية وإصلاحات الحوادث وتقديرات التكلفة",
      setting: "Service advisory desk and auto body finishing shop.",
      wordIds: [
        "gasket", "bolt", "nut", "washer", "hose-clamp",
        "oil-change", "tire-rotation", "brake-repair", "tune-up", "alignment",
        "inspection", "bodywork", "paint-job", "tow-truck", "estimate"
      ],
      lines: [
        {
          id: "01_layla_towing_and_estimate",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "A broken-down sedan arrives on a flatbed tow truck for emergency engine evaluation and a written cost estimate."
        },
        {
          id: "02_hana_routine_maintenance",
          speaker: "Hana",
          voiceId: "cgSgspJ2msm6clMCkdW9",
          text: "Routine maintenance packages include a quick synthetic oil change, comprehensive seasonal tune-up, and four-wheel tire rotation."
        },
        {
          id: "03_tariq_inspections_and_alignment",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Perform an annual safety inspection, precise laser wheel alignment, and complete front disc brake repair."
        },
        {
          id: "04_omar_hardware_and_gaskets",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Seal the cylinder head with a fresh silicone gasket, tightening each steel bolt, hex nut, flat washer, and rubber hose clamp."
        },
        {
          id: "05_adam_bodywork_and_paint",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "The collision center repairs dented fender bodywork before spraying a flawless gloss custom paint job."
        }
      ]
    }
  ]
};
