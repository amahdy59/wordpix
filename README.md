# WordPix 🎨📚

An interactive, visual-first English vocabulary learning application tailored for Arabic speakers. Built with React 18, TypeScript, Vite, Tailwind CSS v4, and Radix UI primitives.

---

## 🌟 Core Features

- 🏞️ **Interactive Scene Discovery**: Tap hotspots on room scenes to explore vocabulary with native SpeechSynthesis audio.
- 🎮 **Gamified Lesson Loop**: A 6-step flow — Scene Discovery, Listen & Repeat, Recall Match, Context Fill, Sentence Builder, Quick Quiz — with SM-2 spaced repetition, streaks, and an itemised XP economy.
- ♿ **WCAG 2.2 AAA Accessibility**, enforced by tests rather than asserted:
  - Minimum 44×44px touch targets — verified per component.
  - 7:1 contrast on every text and accent pairing, in light and dark, computed from the theme tokens.
  - Full keyboard operation, focus-trapped dialogs, and `prefers-reduced-motion` support.
  - Adjustable text scaling (100/125/150%), a high-contrast mode, speech-rate control, Arabic-Indic numerals, and per-modality drill toggles.
  - ARIA live region announcements on navigation and SpeechSynthesis.
- 🌐 **Bilingual & RTL**: Interface language switcher (English / العربية) with `dir` mirroring throughout via CSS logical properties. Lesson content is currently English-only.

### Skill Exercise Hub

27 of the 35 hub screens are defined as data in `src/app/exercises/content/`
and rendered by a shared runner, over six interaction patterns: single choice,
text entry, multi-select, sentence ordering, category sorting, and open
practice. Every question carries an explanation, so a wrong answer teaches
something.

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