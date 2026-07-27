# WordPix — English Learning App: Full Implementation Plan

## Context

Two Figma flows have been imported covering the complete app: an **Onboarding + Core Navigation** flow (8 screens) and a **Lesson + Exercises** flow (9 screens). Both flows use a coherent mobile-first design (390px wide, iPhone aspect ratio) with a clear visual language. This plan covers every screen, the app state model, component architecture, and the exact build order.

---

## Design System (from Figma — source of truth)

### Colors
| Token | Value | Usage |
|---|---|---|
| Brand rose | `#CC6363` | Primary brand, selected states, active indicators |
| Blue CTA | `#4A90FF` | Primary action buttons only |
| Success green | `#40A673` | Mastered/complete states |
| Amber | `#FFD600` | "Practiced"/in-progress, trophy/celebration |
| Background | `#F7F7F7` | Default screen background |
| Warm pink bg | `#FDECEC` | Celebration/welcome screens, selected chip bg |
| Card | `#FFFFFF` | All card surfaces |
| Text primary | `#171717` | Headings, labels |
| Text secondary | `#525252` | Subtitles, hints |
| Border | `#E5E5E5` | Default card borders |
| Active border | `#CC6363` 2-3px | Selected state for cards |

### Typography
- Font: **Inter** exclusively (Black 900, Bold 700, SemiBold 600, Medium 500, Regular 400)
- Arabic text always uses `dir="auto"` and paired font `Noto Sans Arabic`
- Bilingual pattern: English on top (larger/bolder), Arabic below (rose color `#CC6363`)

### Layout
- 390px mobile width, centered on desktop in a full-height container
- Cards: `rounded-[20px]` to `rounded-[24px]`; buttons: `rounded-[12px]`; pills: `rounded-[99px]`
- Progress bar: 8px tall, rose fill, `rounded-[99px]`, full-width
- Bottom tab bar: 4 tabs (Home, Explore, Practice, Profile), blue active icon vs slate inactive
- All screens have iOS home indicator pill at bottom

### Theme Tokens to Update in `theme.css`
```css
--background: #F7F7F7;
--foreground: #171717;
--card: #FFFFFF;
--card-foreground: #171717;
--primary: #CC6363;       /* brand rose */
--primary-foreground: #FFFFFF;
--secondary: #FDECEC;     /* warm pink for chips/badges */
--secondary-foreground: #CC6363;
--muted: #F7F7F7;
--muted-foreground: #525252;
--accent: #4A90FF;        /* CTA blue */
--accent-foreground: #FFFFFF;
--border: #E5E5E5;
--radius: 1.25rem;        /* 20px */
```

---

## Complete Screen Inventory

### Flow 1: Onboarding + Core Navigation (`FlowOnboardingCoreNavigation-1/index.tsx`)

| Screen name (Figma) | Component | Description |
|---|---|---|
| `onboarding/splash-welcome` | `<SplashWelcome>` | Pink bg, WordPix logo (black Inter 48px), mascot owl, illustration, Arabic "ابدأ الآن" tap-to-start |
| `onboarding/language-select` | `<LanguageSelect>` | "What language do you speak?", Arabic/English flag cards, selected = rose border |
| `onboarding/age-select` | `<AgeSelect>` | "How old are you?", scrollable age cards 6–40+, selected card = rose border + rose text |
| `onboarding/interest-select` | `<InterestSelect>` | "What do you like?", topic image cards (Animals/Food/Sports/Music/Science/Travel), multi-select with rose check circle |
| `onboarding/ready-celebration` | `<ReadyCelebration>` | Pink bg, mascot, "You're all set!", Arabic confirmation, sparkles row |
| `core/home-dashboard` | `<HomeDashboard>` | Greeting + streak/XP badges, Active World card (image + progress %), Review box, bottom tabs |
| `core/explore-worlds` | `<ExploreWorlds>` | "Explore Worlds" header, Level 1 grid: Bedroom (Complete/green), Bathroom (40%/rose), Kitchen+Living (Locked/gray opacity-60) |
| `core/profile-stats` | `<ProfileStats>` | Avatar circle, name, "Level 3 Explorer", StatsGrid placeholder, Achievements block |

### Flow 2: Lesson + Exercises (`FlowLessonExercises/index.tsx`)

| Screen name (Figma) | Component | Description |
|---|---|---|
| `lesson/world-entry` | `<LessonWorldEntry>` | Hero bedroom image, 3 progress items (New Words=rose/4 remaining, Practice=yellow/4 review, Mastered=green/4 done), "Start Lesson" blue CTA |
| `lesson/scene-discovery` | `<LessonSceneDiscovery>` | Full-height interactive bedroom image with 4 hotspots (Bed/Wardrobe/Lamp/Pillow-active), sliding bottom card: word + Arabic phonetic + audio + "Learn Word" |
| `exercise/listen-repeat` | `<ExerciseListenRepeat>` | Illustration in white card, "Pillow / وسادة • wi-sa-dah", green "Say it out loud!", giant rose speaker button, "Got It!" primary + "Listen Again" secondary |
| `exercise/recall-match` | `<ExerciseRecallMatch>` | "What is this?", image of object, 2×2 text option grid (selected = rose border + filled radio), "Check Answer" |
| `exercise/context-fill` | `<ExerciseContextFill>` | "Complete the Sentence", clue image, sentence with underlined rose blank, word chips below (selected=rose bg/border), "Next" |
| `exercise/sentence-builder` | `<ExerciseSentenceBuilder>` | "Build a Sentence", scene image, answer area with placed chips + empty dashed slot, word pool chips to tap, "Submit" |
| `exercise/quick-quiz` | `<ExerciseQuickQuiz>` | "Quick Quiz", "Which one is the 'pillow'?", timer badge (0:45), 2×2 image card grid (selected = rose border), "Check" |
| `lesson/complete-results` | `<LessonCompleteResults>` | Pink bg, yellow trophy circle, "Great Work!" + Arabic, 2/3 stars, stats grid, "Continue to Next" primary + "Practice Again" secondary |
| `review/mastery-review` | `<ReviewMasteryReview>` | "Review Time!" header + flame streak, word cards (thumbnail + name + "X days ago" + 3-bar meter in green/yellow/rose), "Start Review" CTA, Practice tab active |

---

## App State Model

### Navigation State
```ts
type AppView = 
  | { screen: 'onboarding'; step: 'splash' | 'language' | 'age' | 'interests' | 'ready' }
  | { screen: 'home' }
  | { screen: 'explore' }
  | { screen: 'practice' }
  | { screen: 'profile' }
  | { screen: 'lesson-entry'; worldId: string }
  | { screen: 'lesson-session'; worldId: string; step: number }
  | { screen: 'lesson-complete' }
```

### Onboarding State
```ts
type OnboardingState = {
  language: 'arabic' | null;
  age: number | null;
  interests: string[];
}
```

### Session State (for exercises)
The lesson session cycles through steps in order:
1. Scene Discovery
2. Listen & Repeat (per new word, e.g. "Pillow")
3. Recall Match ("What is this?")
4. Context Fill ("Complete the Sentence")
5. Sentence Builder ("Build a Sentence")
6. Quick Quiz (image grid)
7. Complete Results

Each exercise step tracks: `selectedAnswer`, `isCorrect`, `isChecked`.

Lesson progress (per world): `newWords`, `practiced`, `mastered` counts → stored in `localStorage`.

---

## Component Architecture

```
src/app/
  App.tsx                    ← root with useReducer, renders current view
  
  onboarding/
    SplashWelcome.tsx
    LanguageSelect.tsx
    AgeSelect.tsx
    InterestSelect.tsx
    ReadyCelebration.tsx
  
  core/
    HomeDashboard.tsx
    ExploreWorlds.tsx
    ProfileStats.tsx
    BottomTabBar.tsx          ← shared across Home/Explore/Practice/Profile
  
  lesson/
    LessonWorldEntry.tsx
    LessonSceneDiscovery.tsx
    LessonCompleteResults.tsx
  
  exercises/
    ExerciseListenRepeat.tsx
    ExerciseRecallMatch.tsx
    ExerciseContextFill.tsx
    ExerciseSentenceBuilder.tsx
    ExerciseQuickQuiz.tsx
  
  review/
    ReviewMasteryReview.tsx
  
  shared/
    LessonHeader.tsx          ← back + title + X + progress bar (reused in all exercises)
    PrimaryButton.tsx         ← blue #4A90FF 56px tall full-width button
    SecondaryButton.tsx       ← white bordered 50px button
    WordChip.tsx              ← tappable chip (default/selected states)
    MasteryMeter.tsx          ← 3-bar progress indicator
    StatusBar.tsx             ← iOS status bar (9:41 + signal icons)
    HomeIndicator.tsx         ← bottom pill
```

### Shared `<LessonHeader>` props
```ts
{ title: string; progress: number; onBack: () => void; onClose: () => void }
```
Progress bar fill = `progress / 7 * 100%` (7 exercise steps).

---

## Key Interactivity Details

### Onboarding wizard
- Steps advance on tap (no explicit "Next" button on splash — tap anywhere / tap Arabic link)
- Language and Interest screens have a sticky bottom CTA that appears when ≥1 selection made
- Age scroll is a vertical list; selected item highlighted in rose

### Scene Discovery hotspots
- 4 absolutely-positioned hotspot SVGs overlaid on scene image
- Tap a hotspot → slide-up bottom card animates in with word info
- Active hotspot: yellow `rgba(255,214,0,0.8)` pill with sparkle icon; others: white circle with rose border + rose dot

### Exercise answer checking
- On "Check" / "Check Answer" / "Submit" → CTA changes color to green (correct) or rose (incorrect)
- Answer chips/cards lock (no further selection)
- Feedback shown inline (no separate modal)
- Sentence builder: tap pool word → moves to answer area placed chips; tap placed chip → returns to pool

### Progress bar (in lesson header)
- Fixed width container, rose fill div advances left-to-right
- Width steps: ~14%, 27%, 40%, 54%, 67%, 80%, 100% per exercise step

### Word mastery meter (in Review screen)
- 3 bars: green=all 3 (Mastered), 2 yellow bars=Practiced, 1 rose bar=Recognized
- "NEEDS REVIEW TODAY" label in rose for urgent words

---

## Token + Font Updates

### `src/styles/fonts.css`
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap');
```

### `src/styles/theme.css`
Update `:root` block only. Preserve `.dark` block and `@theme inline` mapping as-is. Key changes:
- `--background: #f7f7f7`
- `--foreground: #171717`
- `--card: #ffffff`
- `--primary: #cc6363`
- `--primary-foreground: #ffffff`
- `--accent: #4a90ff`
- `--border: rgba(0,0,0,0.08)`
- `--radius: 1.25rem`

---

## Build Order

### Phase 1 — Setup (no screens yet)
1. Update `theme.css` tokens and `fonts.css` Google Fonts import
2. Create `src/app/App.tsx` with `useReducer` navigation state, renders current view based on state
3. Build shared: `StatusBar`, `HomeIndicator`, `PrimaryButton`, `SecondaryButton`, `LessonHeader`, `BottomTabBar`

### Phase 2 — Onboarding Flow
4. `SplashWelcome` — import mascot + illustration images from `FlowOnboardingCoreNavigation-1/`
5. `LanguageSelect` — flag images, card selection state, advance on language select
6. `AgeSelect` — vertical scrollable age grid, selected highlight
7. `InterestSelect` — topic image cards, multi-select, CTA appears when ≥1 selected
8. `ReadyCelebration` — mascot + sparkles, "Let's Begin" routes to HomeDashboard

### Phase 3 — Core Navigation Screens
9. `HomeDashboard` — greeting, streak/XP badges, ActiveWorld card with world preview image + progress, ReviewBox, BottomTabBar
10. `ExploreWorlds` — world grid (Bedroom/Bathroom/Kitchen/Living images), completed/in-progress/locked states
11. `ProfileStats` — avatar, name, level label, Achievements block
12. Wire BottomTabBar across all 3 tabs

### Phase 4 — Lesson Entry + Scene Discovery
13. `LessonWorldEntry` — hero image, 3 progress items with color-coded dots, "Start Lesson" launches session
14. `LessonSceneDiscovery` — scene image with 4 hotspot SVGs, hotspot tap → show bottom card with word + audio + "Learn Word" advances to exercises

### Phase 5 — All 5 Exercise Types
15. `ExerciseListenRepeat` — illustration, phonetics, giant speaker, "Got It!" / "Listen Again"
16. `ExerciseRecallMatch` — image + 4 text options, radio-style selection, check feedback
17. `ExerciseContextFill` — clue image, inline blank sentence, word chips below, selection fills blank
18. `ExerciseSentenceBuilder` — scene image, answer area with placed chips + dashed empty slot, pool chips, tap-to-place
19. `ExerciseQuickQuiz` — countdown timer display, 2×2 image grid, check feedback

### Phase 6 — Completion + Review
20. `LessonCompleteResults` — trophy, stars, stat placeholders, "Continue to Next" → Explore, "Practice Again" → re-run
21. `ReviewMasteryReview` — word cards list with meter bars, "Start Review" CTA, Practice tab active

### Phase 7 — Polish
22. Responsive: on viewport ≥ 768px, center the 390px mobile frame horizontally in the full viewport (like a phone preview)
23. Smooth screen transitions using `motion/react` (slide or fade)
24. Exercise answer feedback: button color transition on correct/incorrect
25. Hotspot pulse animation on scene discovery
26. Update `localStorage` on lesson complete (streak, XP, mastery counts)

---

## Asset Imports (Critical — must use ES module imports)

### From `FlowOnboardingCoreNavigation-1/`
- `ddef533e...png` → splash mascot
- `5a83af8f...png` → splash illustration preview
- `016a21d5...png` → Arabic flag
- `58e9c68f...png` → English flag
- `e934731c...png` → Animals topic
- `a45bee08...png` → Food topic
- `594036e7...png` → Sports topic
- `2bf4d00c...png` → Music topic
- `cfd53626...png` → Science topic
- `be163166...png` → Travel topic
- `1af0b5b8...png` → celebration mascot
- `1d21ec27...png` → home mascot (small)
- `745b97e4...png` → world preview (bedroom)
- `bca64c80...png`, `bed87320...png`, `aeaf5c57...png`, `8b22e462...png` → Bedroom/Bathroom/Kitchen/Living world images
- `f55881555...png` → profile avatar

### From `FlowLessonExercises/`
- `f411eef2...png` → bedroom illustration (hero)
- `5a1564d3...png` → scene interactive background
- `c7cadc27...png` → pillow image
- `dba5c5c3...png` → lamp image
- `c671a908...png` → clue image (context fill)
- `721329bd...png` → lamp on desk (sentence builder)
- `b698b308...png`, `aa90bb37...png`, `a5243843...png`, `a52428433...png` → quiz images (Pillow/Blanket/Curtain/Rug)
- `0a139d97...png`, `f31b545a...png`, `910c9921...png` → review word thumbnails

All imported with: `import imgX from "@/imports/<folder>/<hash>.png"` — never string paths in `src`.

---

## Verification Checklist

- [ ] Onboarding flows front-to-back without errors: Splash → Language → Age → Interests → Ready → Home
- [ ] All 3 core tabs switch correctly (Home / Explore / Practice tab active in Review)  
- [ ] Tapping "The Bedroom" world on Explore → LessonWorldEntry
- [ ] "Start Lesson" → Scene Discovery → all 5 exercises cycle in order → Complete Results
- [ ] Exercise selection state works: selecting an option highlights it, check button validates
- [ ] Sentence builder: tapping pool word moves it to placed chips; empty slot shows dashed border
- [ ] Quick Quiz timer shows 0:45 (static display, no countdown needed in V1)
- [ ] "Continue to Next" from Complete Results returns to Explore
- [ ] Review tab shows ReviewMasteryReview with 3 word cards and correct meter colors
- [ ] On viewport ≥ 768px, app renders as centered 390px mobile frame
- [ ] All images load (no broken img src strings — all use ES module imports)
- [ ] Inter + Noto Sans Arabic load correctly; Arabic text renders right-to-left
