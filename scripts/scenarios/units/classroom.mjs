// Scenarios for Unit 017: classroom
// Voices:
// Tariq: British (George: JBFqnCBsd6RMkjVDRZzb)
// Adam: American (Will: bIHbv24MWmeRgasZH58o)
// Omar: Australian (Charlie: IKne3meq5aSn9XLyUdCD)

export const CLASSROOM_SCENARIOS = {
  unitId: "classroom",
  unitName: "The Classroom",
  cefr: "Pre-A1",
  lessons: [
    {
      id: "classroom-1",
      name: "The Classroom 1",
      titleEn: "Stationery & Study Pack Essentials",
      titleAr: "أدوات القرطاسية وحقيبة الدراسة",
      setting: "Arranging essential writing instruments, binders, and workbooks neatly on the classroom study table.",
      wordIds: [
        "pencil", "pen", "eraser", "ruler", "marker",
        "crayon", "colored-pencil", "highlighter", "pencil-sharpener", "pencil-case",
        "notebook", "textbook", "workbook", "folder", "binder"
      ],
      lines: [
        {
          id: "01_tariq_stationery_prep",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "An organized student approaches study with precision. Unpack your writing kit, Adam."
        },
        {
          id: "02_adam_pencil_case",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Inside my zippered pencil case, I have a sharp pencil, an ink pen, a soft rubber eraser, a clear plastic ruler, a dry-erase marker, a wax crayon, a colored pencil, and a neon highlighter!"
        },
        {
          id: "03_omar_books_binders",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Keep your metal pencil sharpener ready. Now arrange your course materials: this lined notebook, hardbound textbook, grammar workbook, document folder, and three-ring binder."
        },
        {
          id: "04_adam_ready_state",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Everything is cataloged neatly, ready for our morning literature seminar!"
        },
        {
          id: "05_tariq_order_praise",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Orderly materials inspire clear thoughts and deep concentration."
        }
      ]
    },
    {
      id: "classroom-2",
      name: "The Classroom 2",
      titleEn: "The Lecture Hall & Reference Library",
      titleAr: "قاعة المحاضرات ومكتبة المراجع",
      setting: "Navigating the seminar hall, using reference books, and engaging with classroom projection screens.",
      wordIds: [
        "sheet-of-paper", "sticky-note", "index-card", "dictionary", "encyclopedia",
        "desk", "chair", "whiteboard", "projector", "screen",
        "clock", "globe", "shelf", "locker", "bulletin-board"
      ],
      lines: [
        {
          id: "01_omar_hall_observation",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Welcome to the seminar hall, boys. Observe the learning environment and reference resources."
        },
        {
          id: "02_adam_desk_setup",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "I placed a fresh sheet of paper on my wooden desk, pulled up my chair, flagged key definitions with a yellow sticky note, and wrote vocabulary flashcards on an index card."
        },
        {
          id: "03_tariq_reference_shelf",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "On the reference shelf, consult the comprehensive English dictionary and multi-volume encyclopedia. Over on the wall, notice the rotating world globe and the classroom clock."
        },
        {
          id: "04_omar_visual_media",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "The professor writes on the whiteboard, while the overhead projector illuminates the projection screen."
        },
        {
          id: "05_adam_locker_bulletin",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "I will pin our project notice to the bulletin board before placing my heavy jacket into the student locker."
        }
      ]
    },
    {
      id: "classroom-3",
      name: "The Classroom 3",
      titleEn: "Maker Tools, Computing & Drafting Gear",
      titleAr: "أدوات الحرف والحوسبة والتخطيط",
      setting: "Working in the multidisciplinary design lab with geometric tools, computers, and crafting supplies.",
      wordIds: [
        "backpack", "scissors", "glue-stick", "tape", "stapler",
        "paper-clip", "rubber-band", "thumbtack", "calculator", "compass",
        "computer", "laptop", "tablet", "keyboard", "mouse"
      ],
      lines: [
        {
          id: "01_tariq_lab_entry",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Set your heavy backpack on the bench, Adam. We have both digital workstations and physical drafting tools here."
        },
        {
          id: "02_adam_craft_geometry",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "For our geometric model, I have craft scissors, a glue stick, adhesive tape, a stapler, a steel paper clip, an elastic rubber band, a brass thumbtack, a graphing calculator, and a drawing compass!"
        },
        {
          id: "03_omar_computing_station",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Now boot up the devices: turn on the desktop computer, sync your portable laptop, tap the touch-screen tablet, and test the keyboard and wireless mouse."
        },
        {
          id: "04_adam_integration",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "With these drafting supplies and computer workstations, we can calculate and build our project smoothly."
        },
        {
          id: "05_tariq_mastery_synthesis",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Harmonizing physical craftsmanship with computing power produces truly outstanding academic work."
        }
      ]
    },
    {
      id: "classroom-4",
      name: "The Classroom 4",
      titleEn: "Campus Tech & The School Community",
      titleAr: "تقنيات الحرم ومجتمع المدرسة",
      setting: "Collaborating with school staff, printing documents, and utilizing multimedia equipment.",
      wordIds: [
        "printer", "usb-drive", "headphones", "projector-remote", "charger",
        "teacher", "student", "principal", "librarian", "janitor",
        "school-nurse", "substitute-teacher", "teaching-assistant", "counselor", "security-guard"
      ],
      lines: [
        {
          id: "01_omar_tech_utility",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "A thriving academy relies on modern media tools and dedicated staff. Let us prepare today's presentation."
        },
        {
          id: "02_adam_multimedia_gear",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "I plugged my USB drive into the office printer, put on audio headphones, adjusted the projector remote, and plugged in my device charger."
        },
        {
          id: "03_tariq_core_faculty",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Every individual here supports learning: our devoted teacher, each diligent student, the respected principal, our librarian, and our hardworking janitor."
        },
        {
          id: "04_omar_support_staff",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "We also rely on the school nurse, our kind substitute teacher, the teaching assistant, the academic counselor, and the campus security guard."
        },
        {
          id: "05_adam_community_pride",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Their united efforts create a secure, encouraging atmosphere where every student can excel."
        }
      ]
    },
    {
      id: "classroom-5",
      name: "The Classroom 5",
      titleEn: "Academic Rhythms & Assessment",
      titleAr: "الإيقاع الدراسي والتقييم",
      setting: "Preparing for midterm exams, feeling proud of school attire, and enjoying the bell chime for outdoor recess.",
      wordIds: ["homework", "test", "recess", "bell", "grade", "uniform"],
      lines: [
        {
          id: "01_tariq_uniform_pride",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Wearing our neat school uniform instills mutual respect and focused purpose, Adam."
        },
        {
          id: "02_adam_test_homework",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "I completed all my reading homework last night, reviewed the study guide, and earned an excellent grade on our morning test!"
        },
        {
          id: "03_omar_bell_recess",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Listen to that cheerful bell! It signals midday recess, when students can head outside into the sun."
        },
        {
          id: "04_tariq_scholar_balance",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Diligent academic effort balanced with active recreation makes for a well-rounded scholar."
        }
      ]
    }
  ]
};
