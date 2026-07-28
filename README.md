# WordPix 🎨📚

An interactive, visual-first English vocabulary learning application tailored for Arabic speakers. Built with React 18, TypeScript, Vite, Tailwind CSS v4, and Radix UI primitives.

---

## 🌟 Core Features

- 🏞️ **Interactive Scene Discovery**: Tap hotspots on high-res room scenes to explore vocabulary with native SpeechSynthesis audio.
- 🎮 **Gamified Mini-Games**: 5 distinct exercise modes including Listen & Repeat, Context Fill, Sentence Builder, Recall Match, and Quick Quiz.
- ♿ **WCAG 2.2 AAA Accessibility**:
  - Minimum 44x44px touch targets.
  - Accessible contrast ratios (7:1+ for text elements).
  - WCAG 2.2.3 timer controls (users can pause or disable exercise countdowns).
  - ARIA live region announcements for SpeechSynthesis.
- 🌐 **Bilingual & RTL Design**: Native Arabic support with `Noto Sans Arabic` font styling and explicit direction controls.

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
│   │   ├── App.tsx            # Navigation state machine & code-split routes
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