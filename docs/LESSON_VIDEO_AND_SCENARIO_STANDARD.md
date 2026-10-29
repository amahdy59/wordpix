# WordPix Lesson Video & Imaginary Scenario Standard

**Document ID**: `WP-STD-VID-001`  
**Status**: Living Standard & Authoring Blueprint  
**Reference Asset (Master with Audio)**: [`assets/samples/lesson-006-bedroom-scenario-master.webm`](../assets/samples/lesson-006-bedroom-scenario-master.webm)  
**Veo Raw Clip**: [`assets/samples/veo/shot_01_alarm_clock.mp4`](../assets/samples/veo/shot_01_alarm_clock.mp4)  
**Target Curriculum**: 200 Units (`src/app/data/curriculumSequence.ts`)

---

## 1. Executive Summary & Purpose

This standard defines the architecture, pedagogical requirements, ElevenLabs audio workflows, video rendering pipeline, and WCAG 2.2 AAA accessibility rules for generating **200 scenario-driven video modules** across WordPix.

### Core Philosophy

1. **Context Over Flashcards**: Vocabulary is learned fastest and retained longest when witnessed within an emotionally engaging, high-stakes, or humorous situated dilemma.
2. **Micro-Duration (30–75 Seconds)**: Video must never encourage passive cognitive slouching. It serves as an active visual anchor followed immediately by retrieval checks.
3. **No "Uncanny Valley"**: Photorealistic AI video avatars suffer from unnatural lip-sync, floating artifacts, and visual noise that distract adult learners. WordPix uses **2.5D stylized motion-graphics, cinematic focal zooms, and kinetic typography**, preserving design token harmony and visual dignity.
4. **WCAG 2.2 AAA by Construction**: Subtitles, audio descriptions, transcript drawers, and non-distracting motion guards are integral to the rendering pipeline, not retrofitted afterthoughts.

---

## 2. Pedagogical Progression Across CEFR Levels

| CEFR Stage                     | Lessons  | Target Duration | Linguistic Constraints                                                                                        | Narrative Trope / Scenario Type                                                                               |
| :----------------------------- | :------- | :-------------- | :------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------ |
| **Stage 1: Pre-A1 Starter**    | 22 units | 35–45s          | Concrete nouns; basic SVO; spatial prepositions (`on`, `in`, `under`); 5–6 target words; ~100 wpm.            | **The Urgent Search / Immediate Need**: Finding a lost item before an appointment; organizing a space.        |
| **Stage 2: A1 Foundations**    | 36 units | 45–55s          | Present simple; daily routines; transactional queries; numbers & costs; 6–8 target words; ~110 wpm.           | **The Social Transaction**: Ordering at a café; checking in; asking for directions in a new neighbourhood.    |
| **Stage 3: A2 Everyday Life**  | 43 units | 50–65s          | Past simple; future intentions; basic contrastive connectors (`because`, `although`); 7–9 words; ~120 wpm.    | **The Common Dilemma**: Delayed transport; resolving a mild misunderstanding; planning an outing.             |
| **Stage 4: B1 Wider World**    | 40 units | 60–75s          | Complex clauses; hypothetical conditionals; emotional register; descriptive adjectives; 8–10 words; ~130 wpm. | **The Unexpected Turn**: Lost luggage recovery; negotiating museum entry; recounting an unusual travel event. |
| **Stage 5: B2 Fluency & Work** | 38 units | 70–85s          | Professional register; idiomatic phrasal verbs; polite hedging; abstract discourse; 8–10 words; ~140 wpm.     | **The Strategic Huddle**: Hallway meeting before a contract signing; troubleshooting a project bottleneck.    |
| **Stage 6: C1 Mastery**        | 21 units | 75–90s          | High-register collocations; irony; nuance; rhetorical questions; domain-specific terminology; natural speed.  | **The Nuanced Debate**: Cross-cultural diplomacy; resolving high-stakes organizational impasse.               |

---

## 3. ElevenLabs Audio & Soundscape Standard

### 3.1 Characters, Gender & Islamic Tradition Standard

> **Mandatory Cultural Rule**: In strict adherence to cultural and Islamic traditions, video generations **do not depict women**. All scenarios feature an **all-male cast** (e.g., brothers, roommates, colleagues, father-and-son). In rare, unavoidable pedagogical exceptions where female presence is essential, characters must strictly adhere to Islamic modesty guidelines (proper hijab, modest attire, and dignified etiquette).

### 3.2 Curated All-Male Voice Registry

To cultivate ear-training diversity and authentic character dynamics across the 200 lessons:

| Character | Role / Archetype                      | Voice Persona & Accent            | ElevenLabs Voice ID                                               |
| :-------- | :------------------------------------ | :-------------------------------- | :---------------------------------------------------------------- |
| **Tariq** | The Mentor / Supportive Older Brother | Warm, articulate, calm British RP | `JBFqnCBsd6RMkjVDRZzb` (George)                                   |
| **Adam**  | The Relatable Adult Learner           | Expressive, energetic American    | `bIHbv24MWmeRgasZH58o` (Will) / `N2lVS1w4EtoT3dr4eOWO` (Callum)   |
| **Karim** | The International Professional        | Smooth, confident, clear cadence  | `cjVigY5qzO86Huf0OWal` (Eric)                                     |
| **Omar**  | The Friendly Conversationalist        | Upbeat, resonant, natural flow    | `IKne3meq5aSn9XLyUdCD` (Charlie) / `CwhRBWXzGAHq8TQ4Fs17` (Roger) |

### 3.2 ElevenLabs SFX Integration

- Dialogue must never exist in an acoustic vacuum.
- **Foley Cues**: Every scenario includes 2–4 subtle diegetic sound effects (e.g. alarm clock ring, light switch click, suitcase zipper, café espresso hiss) generated via the ElevenLabs Sound Effects API (`/v1/sound-effects`) or synthesized via Web Audio.
- **Gain Balancing**: SFX peaks must be mixed **-12 dB to -16 dB** below primary speech dialogue to ensure complete speech intelligibility for hearing-impaired learners.

### 3.3 Word-Level Alignment & Timing

- Synthesis requests must specify `return_timestamps: true`.
- The returned timestamp array is used to align kinetic subtitle highlights (`<span>` color-shift) precisely to the millisecond when the target word is spoken.

---

## 4. Video Composition & Motion Standard (Remotion 2.5D)

### 4.1 Technical Specifications

- **Container**: WebM (VP9 / Opus) for modern browsers + MP4 (H.264 / AAC) for legacy fallback.
- **Dimensions**: 1280 × 720 px (16:9 widescreen).
- **Frame Rate**: 30 fps.
- **Target Bitrate**: 600–900 kbps (optimized for fast streaming on mobile data).

### 4.2 Visual Hierarchy (Z-Index Anatomy)

1. **Background Layer (Z: 0)**: High-resolution unit scene illustration (`1280×720px`).
2. **Camera Transform (Z: 0)**: Smooth Ken Burns panning/zooming (`transform: scale(1.0 → 1.5) translate(X, Y)`) holding focal objects for at least 3.5 seconds.
3. **Cinematic Vignette (Z: 10)**: Subtle top and bottom dark gradient overlays to guarantee ≥7:1 text contrast for overlays.
4. **Brand & Stage Indicator (Z: 20, Top-Left)**: Lesson name, unit number, CEFR badge.
5. **Speaker Identity Pill (Z: 20, Below Brand)**: Current speaker avatar + name + live status.
6. **Target Vocabulary Spotlight (Z: 20, Top-Right)**: When a target word is uttered, an emerald callout displays the word, IPA phonetic symbols, Arabic gloss, and short definition.
7. **Diegetic SFX Alert (Z: 25, Center Floating)**: Visual earcon indicating sound effects for deaf/hard-of-hearing learners.
8. **Dual-Language Subtitles (Z: 30, Bottom Center)**:
   - Top line: English (26px, bold, white, target word highlighted in emerald `#34d399`).
   - Bottom line: Arabic translation (20px, medium, gold `#fde047`, RTL).

---

## 5. Accessibility Compliance Checklist (WCAG 2.2 Level AAA)

| WCAG Criterion                        | Level | Application in WordPix Video Engine                                                                    |
| :------------------------------------ | :---- | :----------------------------------------------------------------------------------------------------- |
| **1.2.1 Audio-only / Video-only**     | AAA   | Full bilingual transcript provided in an accessible drawer.                                            |
| **1.2.2 Captions (Prerecorded)**      | A     | Synchronized captions in English and Arabic embedded via WebVTT tracks.                                |
| **1.2.5 Audio Description**           | AA    | Visual actions are mirrored in the spoken dialogue so no critical information is visual-only.          |
| **1.4.2 Audio Control**               | A     | No autoplay under any circumstance. Video only starts upon explicit user interaction.                  |
| **1.4.6 Contrast (Enhanced)**         | AAA   | All subtitle and overlay text achieves ≥7:1 contrast ratio against the background gradient.            |
| **2.2.2 Pause, Stop, Hide**           | A     | Prominent 44×44px Play/Pause controls always visible and accessible via keyboard.                      |
| **2.3.3 Animation from Interactions** | AAA   | Camera zooms respect `@media (prefers-reduced-motion: reduce)` by falling back to gentle static fades. |
| **2.5.5 Target Size (Enhanced)**      | AAA   | All interactive player buttons (Play, Replay, Arabic Toggle, Quiz) have touch targets ≥44×44px.        |

---

## 6. Authoring Schema & Reference Pilot (Unit 006)

Every scenario is defined using the following JSON contract:

```json
{
  "unitId": "bedroom",
  "unitNumber": 6,
  "cefr": "Pre-A1",
  "titleEn": "The Missing Watch",
  "titleAr": "الساعة المفقودة",
  "durationSeconds": 28,
  "sceneImage": "/scene-images/bedroom-hero.webp",
  "cast": [
    {
      "id": "tariq",
      "name": "Tariq",
      "role": "Older Brother / Mentor",
      "voice": "JBFqnCBsd6RMkjVDRZzb"
    },
    {
      "id": "adam",
      "name": "Adam",
      "role": "Younger Brother / Learner",
      "voice": "bIHbv24MWmeRgasZH58o"
    }
  ],
  "steps": [
    {
      "step": 1,
      "speaker": "tariq",
      "dialogueEn": "Adam, wake up! Did you check the alarm clock?",
      "dialogueAr": "آدم، استيقظ! هل تحققت من المنبه؟",
      "targetWordId": "alarm-clock",
      "targetWordLabel": "Alarm clock",
      "phonetic": "/əˈlɑːrm klɑːk/",
      "glossAr": "المنبه",
      "definition": "A bedside device that sounds an alarm to wake you up.",
      "camera": { "scale": 1.5, "translateX": "-14%", "translateY": "8%" },
      "sfx": { "type": "alarm", "cue": "⏰ Digital alarm ring" },
      "durationMs": 4200
    }
  ],
  "retrievalQuiz": {
    "questionEn": "Where did Tariq finally spot Adam's watch?",
    "questionAr": "أين وجد طارق ساعة آدم في النهاية؟",
    "options": [
      { "id": "opt1", "text": "Under the blanket", "correct": false },
      { "id": "opt2", "text": "Hanging on the wardrobe door", "correct": true },
      { "id": "opt3", "text": "Next to the nightstand", "correct": false }
    ],
    "explanationEn": "Tariq noticed the watch hanging on the wardrobe door.",
    "explanationAr": "لاحظ طارق أن الساعة معلقة على باب خزانة الملابس."
  }
}
```

---

## 7. Google Flow (Veo) & ElevenLabs Production Blueprint

### 7.1 Visual Generation with Google Flow (Veo)

To achieve cinematic movement without uncanny artifacts:

- **Character Continuity**: Use consistent male character descriptions:
  - _Tariq_: Dignified, mature young adult male, short neat dark hair, well-trimmed short beard, wearing modest linen loungewear/thobe.
  - _Adam_: Energetic young adult male, clean-cut, modest morning casual wear.
- **Cinematic Framing**: 35mm photographic aesthetic, warm natural morning window light, smooth camera tracking shots (dolly forward, gentle tilt, rack focus).
- **Duration per Shot**: 5–8 seconds per prompt beat.

### 7.2 Multi-Speaker Audio Synthesis with ElevenLabs

1. Use `Elevenlabs_API_key_2` (Creator tier) with British and American male voices (`George` for Tariq, `Will` for Adam).
2. Generate dialogue clips via `scripts/generate_scenario_audio_sample.cjs`.
3. Mix dialogue with Foley sound effects (alarm rings, switch clicks, fabric rustles).

---

## 8. Batch Production Playbook (200 Lessons)

When generating new batches:

1. **Pre-authoring Review**:
   - Extract target words from `src/app/data/lessons.ts`.
   - Run scenario authoring script to draft the bilingual scenario JSON (all-male cast).
   - Verify that target words are used naturally without forcing awkward grammar.
2. **Audio Generation (`scripts/generate_scenario_audio_sample.cjs`)**:
   - Synthesize speech clips using ElevenLabs API with character voice parameters.
   - Verify audio cache in `assets/samples/audio/` and `audio_backup/`.
3. **Google Flow Video Generation / Playwright Recording**:
   - Generate Veo video shots in Google Flow according to the storyboard prompts.
   - Assemble video with master ElevenLabs audio and burned-in dual subtitles.
4. **Verification & Audit**:
   - Check file size (target < 3.5 MB per scenario).
   - Validate WebVTT captions against ESLint / a11y standards.
   - Upload new videos to Cloudflare R2 bucket (`/lessons/scenarios/{id}/video.webm`).
   - Confirm **zero mutations to existing vocabulary images and audio assets**.
