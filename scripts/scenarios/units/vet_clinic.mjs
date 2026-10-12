// Scenarios for Unit 028: vet-clinic (A1)
// Voices:
// Tariq: British (George: JBFqnCBsd6RMkjVDRZzb)
// Adam: American (Will: bIHbv24MWmeRgasZH58o)
// Omar: Australian (Charlie: IKne3meq5aSn9XLyUdCD)

export const VET_CLINIC_SCENARIOS = {
  unitId: "vet-clinic",
  unitName: "The Vet Clinic",
  cefr: "A1",
  lessons: [
    {
      id: "vet-clinic-1",
      name: "The Vet Clinic 1",
      titleEn: "The Veterinary Examination Room",
      titleAr: "غرفة الفحص البيطري",
      setting: "In the consultation room, examining animal patients with clinical instruments.",
      wordIds: [
        "dog", "cat", "rabbit", "hamster", "parrot",
        "turtle", "guinea-pig", "fish", "snake", "ferret",
        "stethoscope", "thermometer", "scale", "otoscope", "x-ray"
      ],
      lines: [
        {
          id: "01_omar_clinic_intro",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "A modern veterinary clinic provides specialized medical care for all types of animals."
        },
        {
          id: "02_adam_common_patients",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Today we are examining a trembling dog, an anxious cat, a quiet rabbit, a tiny hamster, and a bright green parrot!"
        },
        {
          id: "03_tariq_exotic_patients",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "And in the exotic suite: a shell-injured turtle, a squeaking guinea pig, a sluggish aquarium fish, a captive pet snake, and an agile ferret."
        },
        {
          id: "04_omar_exam_tools",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "First, record their body weight on the digital scale, check core temperature using a thermometer, and listen to heartbeat sounds through this stethoscope."
        },
        {
          id: "05_adam_scope_xray",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Then use the illuminated otoscope to inspect ear canals, and review the thoracic x-ray on the light screen!"
        }
      ]
    },
    {
      id: "vet-clinic-2",
      name: "The Vet Clinic 2",
      titleEn: "Diagnostics, Surgery & Patient Recovery",
      titleAr: "التشخيص والجراحة وفترة النقاهة",
      setting: "In the pathology laboratory and surgical theater preparing clinical interventions.",
      wordIds: [
        "ultrasound", "blood-test", "microscope", "syringe", "bandage",
        "vaccination", "surgery", "dental-cleaning", "microchip", "spay",
        "neuter", "medication", "stitches", "cast", "cone-collar"
      ],
      lines: [
        {
          id: "01_tariq_lab_intro",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Clinical diagnosis requires accurate laboratory tests before any invasive intervention."
        },
        {
          id: "02_adam_diagnostics",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "In the diagnostic lab, we analyze blood samples with a microscope and run a comprehensive blood test before performing an abdominal ultrasound."
        },
        {
          id: "03_omar_injections",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "The surgeon prepares a sterile syringe to administer an annual rabies vaccination or oral liquid medication."
        },
        {
          id: "04_tariq_surgery_types",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "In the operating theater, doctors perform ultrasonic dental cleaning, laparoscopic spay or neuter operations, and orthopedic fracture surgery."
        },
        {
          id: "05_adam_postop_care",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "After closing the wound with delicate stitches and wrapping a clean white bandage, the patient rests in a fiberglass leg cast with a protective cone collar and an implanted microchip!"
        }
      ]
    },
    {
      id: "vet-clinic-3",
      name: "The Vet Clinic 3",
      titleEn: "Clinic Facilities & Patient Handling",
      titleAr: "مرافق العيادة والتعامل مع المرضى",
      setting: "Touring the clinic architecture from front reception to the recovery kennels.",
      wordIds: [
        "waiting-room", "exam-table", "operating-room", "kennel", "pharmacy",
        "reception", "lab", "recovery-room", "grooming-area", "outdoor-run",
        "leash", "carrier", "muzzle", "treats", "food-bowl"
      ],
      lines: [
        {
          id: "01_omar_tour_intro",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Follow me through the clinic layout, from public reception to specialized patient wards."
        },
        {
          id: "02_adam_waiting_entry",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Pet owners check in at reception, resting in the quiet waiting room while keeping anxious dogs on a sturdy leather leash or cats inside an enclosed plastic carrier."
        },
        {
          id: "03_tariq_exam_restraint",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "The patient is lifted onto the stainless steel exam table, while aggressive or frightened patients wear a soft safety muzzle."
        },
        {
          id: "04_omar_clinical_wards",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Behind these doors lie the sterile operating room, the pathology lab, the prescription veterinary pharmacy, and the warm postoperative recovery room."
        },
        {
          id: "05_adam_housing_comfort",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Down the hall, recoverees rest in a clean indoor kennel, exercise on the grassy outdoor run, visit the hygienic grooming area, and enjoy wholesome biscuits from a ceramic food bowl filled with rewards and treats!"
        }
      ]
    },
    {
      id: "vet-clinic-4",
      name: "The Vet Clinic 4",
      titleEn: "The Veterinary Medical Team",
      titleAr: "الفريق الطبي البيطري",
      setting: "Meeting the healthcare team during morning rounds and consultations.",
      wordIds: [
        "water-dish", "collar", "tag", "nail-clippers", "brush",
        "veterinarian", "vet-tech", "receptionist", "groomer", "kennel-attendant",
        "surgeon", "specialist", "intern", "volunteer", "pet-owner"
      ],
      lines: [
        {
          id: "01_tariq_team_intro",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "A successful hospital relies on seamless teamwork across every medical role."
        },
        {
          id: "02_adam_front_desk",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "At the front desk, the polite receptionist greets each worried pet owner, checking the dog's collar, engraved ID tag, and refilling the waiting room water dish."
        },
        {
          id: "03_omar_doctors_staff",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "The head veterinarian collaborates with an orthopedic surgeon, a cardiology specialist, a learning intern, and an empathetic community volunteer."
        },
        {
          id: "04_adam_technicians",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Our skilled vet tech assists during blood draws, while the dedicated kennel attendant cleans kennels and monitors recovering patients."
        },
        {
          id: "05_tariq_grooming_hygiene",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Over in hygiene, the professional groomer uses safety nail clippers and a soft bristled grooming brush to keep coats tidy."
        }
      ]
    }
  ]
};
