# WordPix 🎨📚

An interactive, visual-first English vocabulary learning application tailored for Arabic speakers. Built with React 18, TypeScript, Vite, Tailwind CSS v4, and Radix UI primitives.

---

## 🌟 Core Features

- 🏞️ **Interactive Scene Discovery**: Tap hotspots on room scenes to explore vocabulary with native SpeechSynthesis audio.
- 🎮 **Gamified Lesson Loop**: A 6-step flow — Scene Discovery, Listen & Repeat, Recall Match, Context Fill, Sentence Builder, Quick Quiz — with SM-2 spaced repetition, streaks, and an itemised XP economy.
- ⏭️ **Continuous, Rosetta-Stone-style pacing**: Answering *is* the submit. Choosing an option commits it, feedback appears inline beside the question rather than in a modal, and the drill moves on by itself — roughly 0.9s after a correct answer, 2.2s after a wrong one so the correct answer can be read. Listen & Repeat walks through the group on its own, with a Pause control.
- 🔁 **Missed words come back**: A wrong answer is not a wall. The correct option is revealed, the drill advances, and the missed word is re-queued to be asked again later in the same drill (once, so a drill always terminates).
- ♿ **WCAG 2.2 AAA Accessibility**, enforced by tests rather than asserted:
  - Minimum 44×44px touch targets — verified per component.
  - 7:1 contrast on every text and accent pairing, in light and dark, computed from the theme tokens.
  - Full keyboard operation, focus-trapped dialogs, and `prefers-reduced-motion` support.
  - Adjustable text scaling (100/125/150%), a high-contrast mode, speech-rate control, Arabic-Indic numerals, and per-modality drill toggles.
  - **Move On Automatically** can be switched off, which replaces the timed advance with a Next button. The advance is a time limit on reading feedback, so WCAG 2.2.1 requires it be defeatable before it is ever met.
  - Answer controls use `aria-disabled` rather than `disabled` once answered, so keyboard focus is never dropped to `<body>` mid-drill.
  - ARIA live region announcements on navigation and SpeechSynthesis.
- 🌐 **Bilingual & RTL**: Interface language switcher (English / العربية) with `dir` mirroring throughout via CSS logical properties. Lesson content is currently English-only.

### Skill Exercise Hub

Reached from the **Review** tab only. It is standalone practice that does not
feed lesson progress, so it sits below the review queue rather than being
promoted above the lesson on both Home and Explore, which is where it used to
appear — twice, in identical cards.

31 drills are listed. Most are defined as data in `src/app/exercises/content/`
and rendered by a shared runner, over six interaction patterns: single choice,
text entry, multi-select, sentence ordering, category sorting, and open
practice. Every question carries an explanation, so a wrong answer teaches
something.

The four `*-results` screens are summary views belonging to a completed drill,
not drills themselves. They keep their ids and routes but are no longer offered
in the list, because "Writing Results" as something you *start* showed a summary
of work nobody had done.

**What is and is not graded.** Choice, entry, ordering, and sorting are marked
exactly. Open work — photo narration, roleplay, free writing, video summary —
is modelled as `practice`: it gives concrete guidance and states plainly that
nothing is marked, because this app cannot grade it.

**Pronunciation.** Echo Practice uses the Web Speech API to check *which word*
you said. It does not score pronunciation quality: the API exposes no
phoneme-level detail, so any percentage would be invented. Recognition is
unavailable in Firefox and when the microphone is blocked; those cases fall
back to self-assessment and say so.

**Timing.** Timed exercises use a pausable, extendable countdown, and time
limits can be switched off entirely in Settings.

---

## 📐 Project Architecture

```
WordPix/
├── docs/
│   ├── ADR.md                 # Architecture Decision Records
│   └── PRE_PROMPT_TEMPLATE.md # Standardized prompt header for AI sessions
├── src/
│   ├── app/
│   │   ├── core/              # Main tabs (Home, Explore, Profile)
│   │   ├── data/              # Data layer & lesson vocabulary definitions
│   │   ├── exercises/         # Mini-game exercise screens
│   │   ├── lesson/            # Interactive scene discovery components
│   │   ├── onboarding/        # User onboarding flow
│   │   ├── review/            # Daily mastery review
│   │   ├── shared/            # Reusable buttons, AppShell, ErrorBoundary, hooks
│   │   ├── App.tsx            # Navigation state machine & route rendering
│   │   ├── types.ts           # Shared TypeScript interfaces
│   │   └── constants.ts       # App constants
│   ├── styles/                # Tailwind CSS v4 theme tokens & typography utilities
│   └── main.tsx
├── .env.example
├── package.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/amahdy59/wordpix.git
cd WordPix

# Install dependencies
npm install

# Start development server
npm run dev

# Run unit tests
npm run test
```

---

## 🎨 Design Tokens & Typography

- **English Typography**: `Inter` (`font-sans`)
- **Arabic Typography**: `Noto Sans Arabic` (`font-arabic`)
- **Tokens**: Managed in `src/styles/theme.css` via custom CSS properties mapped into Tailwind CSS v4 `@theme inline`.