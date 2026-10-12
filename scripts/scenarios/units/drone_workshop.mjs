/**
 * Unit 169: The Drone Workshop (drone-workshop)
 * 4 Lessons — 100% Target Vocabulary Coverage
 * CEFR Level: B2 Fluency & Work (Professional, Managerial & Aerospace Tech English)
 * Featuring 5-character ensemble: Layla, Hana, Tariq, Adam, Omar
 */

export const DRONE_WORKSHOP_SCENARIOS = {
  unitId: "drone-workshop",
  unitName: "The Drone Workshop",
  cefr: "B2",
  unitNameEn: "The Drone Workshop",
  unitNameAr: "ورشة الطائرات المسيرة (الدرون)",
  lessons: [
    {
      id: "drone-workshop-1",
      name: "The Drone Workshop 1",
      titleEn: "Airframe Types, Propulsion Systems & Component Assembly",
      titleAr: "أنواع هياكل الطائرات وأنظمة الدفع وتجميع المكونات",
      setting: "Drone engineering hangar and hardware assembly bench.",
      wordIds: [
        "quadcopter", "hexacopter", "fixed-wing", "racing-drone", "fpv-drone",
        "nano-drone", "delivery-drone", "survey-drone", "agricultural-drone", "underwater-drone",
        "propeller", "motor", "frame", "battery", "esc"
      ],
      lines: [
        {
          id: "01_layla_airframe_types",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "Aeronautical engineers construct various airframe designs: agile four-rotor quadcopters, heavy-lift hexacopters, and long-range fixed-wing aircraft."
        },
        {
          id: "02_hana_racing_and_nanos",
          speaker: "Hana",
          voiceId: "cgSgspJ2msm6clMCkdW9",
          text: "Pilots race an acrobatic racing drone wearing FPV drone video goggles, while kids fly a tiny indoor nano drone."
        },
        {
          id: "03_tariq_commercial_drones",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Commercial applications deploy an automated package delivery drone, photogrammetry survey drone, crop-spraying agricultural drone, and submersible underwater drone."
        },
        {
          id: "04_omar_motors_and_escs",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Mount high-speed brushless motors to the carbon fiber frame, each driven by a digital electronic speed controller ESC."
        },
        {
          id: "05_adam_props_and_batteries",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Fasten each balanced propeller and connect a high-discharge LiPo battery pack."
        }
      ]
    },
    {
      id: "drone-workshop-2",
      name: "The Drone Workshop 2",
      titleEn: "Flight Avionics, Radio Transmitters & Control Dynamics",
      titleAr: "إلكترونيات الطيران وأجهزة الإرسال وديناميكيات التحكم",
      setting: "Flight avionics setup, radio telemetry calibration, and flight testing.",
      wordIds: [
        "flight-controller", "gps-module", "antenna", "camera", "gimbal",
        "transmitter", "receiver", "joystick", "throttle", "yaw",
        "pitch", "roll", "trim", "failsafe", "return-to-home"
      ],
      lines: [
        {
          id: "01_layla_flight_controllers_gps",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "The onboard flight controller integrates a precision GPS module to calculate satellite positioning and coordinate return-to-home navigation."
        },
        {
          id: "02_hana_cameras_and_gimbals",
          speaker: "Hana",
          voiceId: "cgSgspJ2msm6clMCkdW9",
          text: "Mount a stabilized 4K camera on a three-axis motorized gimbal for vibration-free cinematic footage."
        },
        {
          id: "03_tariq_transmitters_and_antennas",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "The pilot holds a radio transmitter equipped with an omnidirectional antenna, sending control signals to the onboard receiver."
        },
        {
          id: "04_omar_stick_controls",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Move each joystick to control vertical throttle, adjust rotation yaw, maneuver directional pitch, and bank side-to-side roll."
        },
        {
          id: "05_adam_trims_and_failsafes",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Fine-tune hover stability with radio trim buttons and test automated failsafe procedures before takeoff."
        }
      ]
    },
    {
      id: "drone-workshop-3",
      name: "The Drone Workshop 3",
      titleEn: "Workbench Tooling, Firmware Flashing & Mission Planning",
      titleAr: "أدوات طاولة العمل وبرمجة النظام وتخطيط المهام",
      setting: "Electronics repair bench, workbench tools, and mission planning ground station.",
      wordIds: [
        "soldering-iron", "multimeter", "screwdriver", "hex-wrench", "pliers",
        "heat-shrink", "zip-tie", "loctite", "balance-charger", "prop-balancer",
        "firmware", "ground-station", "flight-log", "waypoint", "geofence"
      ],
      lines: [
        {
          id: "01_layla_soldering_and_electronics",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "Assemble power wiring using a soldering iron, insulate solder joints with protective heat shrink, and test voltage continuity with a digital multimeter."
        },
        {
          id: "02_hana_hand_tools_and_assembly",
          speaker: "Hana",
          voiceId: "cgSgspJ2msm6clMCkdW9",
          text: "Tighten motor mounts with a hex wrench, tighten frame screws using a precision screwdriver, apply threadlocking Loctite, and bundle wires with a zip tie."
        },
        {
          id: "03_tariq_pliers_and_chargers",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Grip small electrical connectors with needle-nose pliers, balance carbon props on a magnetic prop balancer, and charge batteries using a smart balance charger."
        },
        {
          id: "04_omar_firmware_and_ground_stations",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Flash open-source drone firmware, then set up the laptop ground station to plan autonomous GPS waypoints within a virtual safety geofence."
        },
        {
          id: "05_adam_flight_logs",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "After landing, analyze flight logs to diagnose telemetry and motor performance."
        }
      ]
    },
    {
      id: "drone-workshop-4",
      name: "The Drone Workshop 4",
      titleEn: "FAA Regulations, Airspace Safety & Photogrammetry Mapping",
      titleAr: "لوائح الطيران الفيدرالية وسلامة المجال الجوي والمسح التصويري",
      setting: "Airfield flight line, regulatory compliance, and aerial survey operation.",
      wordIds: [
        "telemetry", "pid-tuning", "calibration", "simulator", "mapping",
        "registration", "license", "no-fly-zone", "visual-line-of-sight", "altitude-limit",
        "pre-flight-check", "spotter", "insurance", "airspace", "faa"
      ],
      lines: [
        {
          id: "01_layla_licensing_and_insurance",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "Certified drone pilots earn an official remote pilot license, complete aircraft registration, and carry comprehensive commercial liability insurance."
        },
        {
          id: "02_hana_airspace_and_faa",
          speaker: "Hana",
          voiceId: "cgSgspJ2msm6clMCkdW9",
          text: "Before operating in regulated national airspace, verify compliance with FAA regulations, avoid restricted no-fly zones, and respect the legal 400-foot altitude limit."
        },
        {
          id: "03_tariq_safety_checks_spotters",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Always conduct a systematic pre-flight check and maintain strict visual line of sight with the assistance of a trained visual spotter."
        },
        {
          id: "04_omar_simulators_and_tuning",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "New pilots practice acrobatics on a computer simulator before conducting sensor calibration and PID tuning."
        },
        {
          id: "05_adam_mapping_and_telemetry",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "During autonomous aerial mapping missions, monitor real-time battery and altitude telemetry on your mobile ground tablet."
        }
      ]
    }
  ]
};
