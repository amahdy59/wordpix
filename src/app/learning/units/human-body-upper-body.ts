// Learning materials for "The Human Body (Upper Body)".
//
// Structured module covering vocabulary for chest, back, shoulders, arms, muscles, and torso.

import type { UnitLearningMaterials } from "../types";

export const HUMAN_BODY_UPPER_BODY_LEARNING: UnitLearningMaterials = {
  unitId: "human-body-upper-body",
  subtopics: [
    {
      id: "human-body-upper-body-1",
      title: "Chest, Torso & Shoulders",
      wordIds: [
        "chest",
        "ribcage",
        "abdomen",
        "belly",
        "navel",
        "waist",
        "sternum",
        "breast",
        "collarbone",
        "adam-s-apple",
        "shoulder",
        "armpit",
        "upper-arm",
        "bicep",
        "tricep",
      ],
    },
    {
      id: "human-body-upper-body-2",
      title: "Arms, Back & Spine",
      wordIds: [
        "elbow",
        "forearm",
        "wrist",
        "arm",
        "deltoid",
        "upper-back",
        "mid-back",
        "lower-back",
        "spine",
        "shoulder-blade",
        "rib",
        "vertebra",
        "tailbone",
        "pelvis",
        "hip",
      ],
    },
    {
      id: "human-body-upper-body-3",
      title: "Muscles, Tendons & Skin Features",
      wordIds: [
        "pectoral",
        "abdominal",
        "oblique",
        "trapezius",
        "latissimus",
        "rotator-cuff",
        "core",
        "flexor",
        "extensor",
        "tendon",
        "skin",
        "pore",
        "freckle",
        "mole",
        "birthmark",
      ],
    },
    {
      id: "human-body-upper-body-4",
      title: "Skin Conditions & Physical Reactions",
      wordIds: ["scar", "wrinkle", "goosebumps", "tan", "sunburn"],
    },
  ],
  passage: {
    title: "Understanding the Upper Body and Core",
    level: "B1",
    text: "The upper body provides structural stability, protects vital organs, and facilitates a vast range of manual tasks. Central to this framework is the spine, a flexible column of individual vertebrae extending from the neck down to the tailbone and pelvis.\n\nThe ribcage forms a protective cage around the heart and lungs, anchored in front by the sternum and supported by the collarbone. Across the back, the broad shoulder blades connect the arms to the torso, allowing the shoulders to rotate smoothly.\n\nMuscles in the upper body are divided into functional groups. The pectoral muscles cover the chest, while the biceps and triceps control movement at the elbow and forearm. On the back, large muscles like the trapezius and latissimus support upright posture. Together with the abdominal and oblique muscles, they form the core, which stabilizes every movement we make.\n\nHuman skin covers the entire upper body, containing thousands of pores that release sweat to regulate temperature. Reactions such as goosebumps occur when tiny muscles at the base of hair follicles contract in response to cold or strong emotions.",
    questions: [],
    openQuestions: [
      "Which skeletal structure protects the heart and lungs?",
      "How do the biceps and triceps work at the elbow?",
      "What muscles make up the human core?",
      "What is the function of pores in the skin?",
      "Why do humans get goosebumps?",
    ],
  },
  phrases: [
    {
      id: "upper-body-get-off-chest",
      phrase: "get something off your chest",
      kind: "idiom",
      meaning: "to confess something that has been worrying you",
      example: "I felt so much better after I talked to her and got the problem off my chest.",
    },
    {
      id: "upper-body-cold-shoulder",
      phrase: "give someone the cold shoulder",
      kind: "idiom",
      meaning: "to deliberately ignore or treat someone in an unfriendly way",
      example: "He gave me the cold shoulder after our disagreement in the meeting.",
    },
    {
      id: "upper-body-shoulder-responsibility",
      phrase: "shoulder the responsibility",
      kind: "idiom",
      meaning: "to accept and manage a difficult duty or obligation",
      example: "As the project lead, she shouldered the responsibility for the team's success.",
    },
    {
      id: "upper-body-strong-backbone",
      phrase: "have a strong backbone",
      kind: "idiom",
      meaning: "to have courage, resolve, and strength of character",
      example: "It takes a strong backbone to stand up for your principles in public.",
    },
    {
      id: "upper-body-twist-arm",
      phrase: "twist someone's arm",
      kind: "idiom",
      meaning: "to persuade someone to do something they are hesitant about",
      example: "I wasn't planning to go to the party, but they twisted my arm.",
    },
    {
      id: "upper-body-breathe-down-neck",
      phrase: "breathe down someone's neck",
      kind: "idiom",
      meaning: "to monitor or supervise someone too closely and anxiously",
      example: "I work better when my manager isn't breathing down my neck all day.",
    },
  ],
  dialogue: {
    title: "Post-Workout Consultation",
    scene: "A personal trainer gives posture and recovery feedback to a client",
    lines: [
      {
        speaker: "Trainer",
        text: "How are your shoulders and upper back feeling after today's strength session?",
      },
      {
        speaker: "Client",
        text: "My biceps and pectorals feel energized, but my lower back has a bit of tension.",
      },
      {
        speaker: "Trainer",
        text: "That usually means your core muscles weren't fully engaged during the lifts. Let's check your spinal alignment.",
      },
      {
        speaker: "Client",
        text: "Should I focus more on pulling my shoulder blades down and back?",
      },
      {
        speaker: "Trainer",
        text: "Exactly. Keep your chest open, engage your abdominals, and don't let your collarbone hunch forward.",
      },
      {
        speaker: "Client",
        text: "Understood. Should I stretch my rotator cuff and triceps before heading home?",
      },
      {
        speaker: "Trainer",
        text: "Yes, spend five minutes stretching your arms, forearms, and spine. It will prevent stiffness tomorrow.",
      },
    ],
  },
  mistakes: [
    {
      id: "upper-body-raise-arm",
      wrong: '"Please rise your arm when asking a question."',
      right: '"Please raise your arm when asking a question."',
      note: "'Raise' is transitive and takes an object ('raise your arm'). 'Rise' is intransitive ('the sun rises').",
    },
    {
      id: "upper-body-shoulder-hurt",
      wrong: '"My left shoulder is making pain."',
      right: '"My left shoulder hurts." / "I have pain in my left shoulder."',
      note: "Use the verb 'hurts' or 'have pain in [body part]' in natural English.",
    },
    {
      id: "upper-body-back-side",
      wrong: '"He has a tattoo on his back-side." (meaning his back)',
      right: '"He has a tattoo on his back."',
      note: "'Backside' informally means buttocks/rear end. To refer to your spine and rear torso, say 'back'.",
    },
    {
      id: "upper-body-elbow-preposition",
      wrong: '"He leaned in his elbows on the table."',
      right: '"He leaned on his elbows on the table."',
      note: "The correct collocation is 'lean on your elbows'.",
    },
  ],
  wordFormation: [
    {
      base: "spine",
      noun: "spine",
      verb: null,
      adjective: "spinal",
      adverb: "spinally",
    },
    {
      base: "muscle",
      noun: "musculature",
      verb: "muscle",
      adjective: "muscular",
      adverb: "muscularly",
    },
    {
      base: "flex",
      noun: "flexibility",
      verb: "flex",
      adjective: "flexible",
      adverb: "flexibly",
    },
  ],
  blankExercises: [
    {
      id: "b1",
      sentence: "The sturdy bone of the ____ connects the breastbone to each shoulder.",
      answer: "collarbone",
    },
    {
      id: "b2",
      sentence: "He strained a ____ in his shoulder while lifting heavy boxes.",
      answer: "tendon",
    },
    {
      id: "b3",
      sentence: "Sitting with an upright ____ helps avoid chronic lower back fatigue.",
      answer: "spine",
    },
    {
      id: "b4",
      sentence: "Strong ____ muscles help support the torso and protect the internal organs.",
      answer: "abdominal",
    },
  ],
  culturalNotes: [
    {
      id: "cn1",
      title: "Shoulder Shrugging",
      body: "In English-speaking and European cultures, raising both shoulders with open hands is a universal gesture signifying 'I don't know' or 'It doesn't matter'. In professional environments, speaking clearly is preferred over relying solely on shoulder gestures.",
    },
    {
      id: "cn2",
      title: "Personal Space & Touch",
      body: "Anglo-American and Nordic cultures tend to maintain larger personal space bubbles (arm's length) than Mediterranean or Latin American cultures. Touching someone's shoulder in business is generally reserved for close colleagues.",
    },
  ],
  wordMeta: [
    {
      word: "ribcage",
      partOfSpeech: "noun",
      frequency: 3,
      collocations: ["expand the ribcage", "broken ribcage", "protect the ribcage"],
    },
    {
      word: "collarbone",
      partOfSpeech: "noun",
      frequency: 2,
      collocations: ["fractured collarbone", "prominent collarbone"],
    },
    {
      word: "spine",
      partOfSpeech: "noun",
      frequency: 3,
      collocations: ["spinal column", "straight spine", "curvature of the spine"],
    },
  ],
};
