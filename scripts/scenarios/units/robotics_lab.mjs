/**
 * Unit 172: The Robotics Lab (robotics-lab)
 * 5 Lessons — 100% Target Vocabulary Coverage
 * CEFR Level: B2 Fluency & Work (Professional, Managerial & Robotics Engineering English)
 * Featuring 5-character ensemble: Layla, Hana, Tariq, Adam, Omar
 */

export const ROBOTICS_LAB_SCENARIOS = {
  unitId: "robotics-lab",
  unitName: "The Robotics Lab",
  cefr: "B2",
  unitNameEn: "The Robotics Lab",
  unitNameAr: "مختبر الروبوتات",
  lessons: [
    {
      id: "robotics-lab-1",
      name: "The Robotics Lab 1",
      titleEn: "Electromechanical Hardware, Actuators & Circuit Boards",
      titleAr: "المكونات الكهروميكانيكية والمحركات ولوحات الدوائر",
      setting: "Robotics prototyping bench and mechanical assembly station.",
      wordIds: [
        "motor", "sensor", "circuit-board", "battery-pack", "gear",
        "wheel", "axle", "frame", "arm", "gripper",
        "camera-module", "led", "wire", "resistor", "capacitor"
      ],
      lines: [
        {
          id: "01_layla_arms_and_frames",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "Robotics students assemble an articulating robotic arm and end-effector gripper onto a rigid aluminum frame."
        },
        {
          id: "02_hana_drive_train",
          speaker: "Hana",
          voiceId: "cgSgspJ2msm6clMCkdW9",
          text: "Drive the motorized chassis using a high-torque DC motor, metal reduction gear, steel axle, and rubber wheel."
        },
        {
          id: "03_tariq_vision_and_sensors",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "The robot perceives its surroundings via an optical camera module and ultrasonic distance sensor."
        },
        {
          id: "04_omar_power_distribution",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Power distributes from a rechargeable lithium battery pack through insulated copper wire to the central circuit board."
        },
        {
          id: "05_adam_passives_and_leds",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Surface-mount components include a current-limiting resistor, filtering capacitor, and blinking indicator LED."
        }
      ]
    },
    {
      id: "robotics-lab-2",
      name: "The Robotics Lab 2",
      titleEn: "Semiconductor Logic, Soldering Irons & Tooling",
      titleAr: "الدوائر المنطقية وأدوات اللحام والعدة الدقيقة",
      setting: "Electronics workstation, soldering station, and mechanical hand tools.",
      wordIds: [
        "transistor", "diode", "microchip", "breadboard", "soldering-iron",
        "solder", "multimeter", "screwdriver-set", "pliers", "wire-cutter",
        "wire-stripper", "hot-glue-gun", "allen-key", "wrench", "tweezers"
      ],
      lines: [
        {
          id: "01_layla_breadboarding",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "Prototype circuit logic on a solderless breadboard, placing semiconductor diodes, switching transistors, and a programmable microchip."
        },
        {
          id: "02_hana_soldering_and_stripping",
          speaker: "Hana",
          voiceId: "cgSgspJ2msm6clMCkdW9",
          text: "Strip insulation with a wire stripper, snip jumper leads using a wire cutter, and solder joints with molten solder using a soldering iron."
        },
        {
          id: "03_tariq_fastening_tools",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Grip tiny surface-mount chips with tweezers, tighten motor brackets with a wrench and Allen key, and drive chassis screws with a screwdriver set."
        },
        {
          id: "04_omar_adhesives_and_meters",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Secure structural brackets with a hot glue gun, bend wire leads using pliers, and verify electrical continuity with a digital multimeter."
        },
        {
          id: "05_adam_assembly_integrity",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Meticulous bench assembly ensures reliable electromechanical operation under testing."
        }
      ]
    },
    {
      id: "robotics-lab-3",
      name: "The Robotics Lab 3",
      titleEn: "Code Editors, Teleoperation & Humanoid Platforms",
      titleAr: "محررات البرمجة والتحكم عن بعد والمنصات البشرية",
      setting: "Software engineering terminal, teleoperation desk, and robotics showcase.",
      wordIds: [
        "magnifying-glass", "helping-hands", "computer", "monitor", "keyboard",
        "mouse", "code-editor", "usb-cable", "controller", "joystick",
        "remote-control", "tablet", "humanoid-robot", "drone", "robotic-arm"
      ],
      lines: [
        {
          id: "01_layla_inspection_rigs",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "Inspect miniature solder bridges under a magnifying glass, holding circuit boards steady with clamp helping hands."
        },
        {
          id: "02_hana_workstation_terminals",
          speaker: "Hana",
          voiceId: "cgSgspJ2msm6clMCkdW9",
          text: "Software engineers write firmware inside a code editor on a desktop computer with a wide monitor, mechanical keyboard, and precision mouse."
        },
        {
          id: "03_tariq_usb_and_controllers",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Upload embedded C code through a shielded USB cable to the motor controller."
        },
        {
          id: "04_omar_teleoperation_inputs",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Operators teleoperate a mobile rover via handheld wireless remote control, analog joystick, or touchscreen tablet."
        },
        {
          id: "05_adam_advanced_embodiments",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Advanced laboratory projects feature an autonomous flying drone, multi-axis industrial robotic arm, and bipedal humanoid robot."
        }
      ]
    },
    {
      id: "robotics-lab-4",
      name: "The Robotics Lab 4",
      titleEn: "Robotic Topologies, Laser Cutters & Signal Oscilloscopes",
      titleAr: "تصنيفات الروبوتات وقواطع الليزر وراسمات الذبذبات",
      setting: "Digital fabrication shop and testing arena.",
      wordIds: [
        "wheeled-robot", "walking-robot", "line-follower", "sumo-robot", "underwater-robot",
        "flying-robot", "snake-robot", "workbench", "storage-bin", "pegboard",
        "safety-glasses", "lab-notebook", "3d-printer", "laser-cutter", "oscilloscope"
      ],
      lines: [
        {
          id: "01_layla_robot_types",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "Our testing arena showcases diverse platforms: a wheeled robot, bipedal walking robot, precision line follower, and competitive combat sumo robot."
        },
        {
          id: "02_hana_bio_inspired_robots",
          speaker: "Hana",
          voiceId: "cgSgspJ2msm6clMCkdW9",
          text: "Bio-inspired and extreme designs include a slithering snake robot, aerial flying robot, and waterproof submersible underwater robot."
        },
        {
          id: "03_tariq_digital_fab",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Fabricate custom components rapidly using our laboratory 3D printer and precision CO2 laser cutter."
        },
        {
          id: "04_omar_shop_organization",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Organize hand tools on a perforated wall pegboard, store spare parts in labeled storage bins, and work at a heavy wooden workbench."
        },
        {
          id: "05_adam_diagnostics_and_safety",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Wear impact-resistant safety glasses, record experimental data in a bound lab notebook, and monitor waveform frequencies on a digital oscilloscope."
        }
      ]
    },
    {
      id: "robotics-lab-5",
      name: "The Robotics Lab 5",
      titleEn: "Control Algorithms, Firmware Compilation & Rover Testing",
      titleAr: "خوارزميات التحكم وبناء البرمجيات واختبار المستكشفات",
      setting: "Robot testing mat and code deployment terminal.",
      wordIds: [
        "power-supply", "testing-mat", "battery", "humanoid", "rover",
        "chassis", "track", "code", "algorithm", "loop",
        "function", "debug", "compile", "variable", "input"
      ],
      lines: [
        {
          id: "01_layla_chassis_and_power",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "Power the robot chassis and continuous rubber tank tracks on a dedicated bench power supply before installing onboard battery power."
        },
        {
          id: "02_hana_rovers_and_humanoids",
          speaker: "Hana",
          voiceId: "cgSgspJ2msm6clMCkdW9",
          text: "Autonomous rovers navigate obstacles across a calibrated indoor testing mat, while engineers test dynamic balance on a humanoid biped."
        },
        {
          id: "03_tariq_algorithms_and_loops",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Program the machine's perception algorithm, structuring code logic with a sensor reading loop and modular control function."
        },
        {
          id: "04_omar_variables_and_debugging",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Define each sensor input variable, compile firmware into binary instructions, and debug communication timing errors."
        },
        {
          id: "05_adam_automated_execution",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Rigorous testing transforms raw code into intelligent automated robotic motion."
        }
      ]
    }
  ]
};
