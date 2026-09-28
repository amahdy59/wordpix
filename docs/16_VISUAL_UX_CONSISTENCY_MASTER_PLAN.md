# WordPix Visual and UX Consistency Master Plan

Status: **Active rollout**  
Scope: Learner-facing SPA surfaces only. Cloudflare R2 assets and content-to-media mappings remain read-only.

## North star

WordPix should feel like one calm, premium learning environment at every viewport. A learner moving from Home to Learn, Library, Practice, Profile, or an exercise should recognize the same canvas, spacing rhythm, typography, surfaces, controls, and feedback language. Rich imagery should feel intentional rather than changing the apparent product from one activity to another.

## Baseline decisions

- Use one application canvas: a fluid shell up to 1536px with a 1440px content maximum; immersive visual-choice exercises may expand to 1800px.
- Use three content measures only: `reading` (4xl), `content` (6xl), and `wide` (1440px).
- Keep prose near 65–75 characters per line, while grids and visual exercises may use the wide measure.
- Use a 4/8px spacing rhythm, 24–32px major section gaps, and 12–16px compact control gaps.
- Use shared semantic surfaces and tokens; no raw colours in JSX.
- Preserve 44×44px targets, 3px focus indicators, logical focus order, reduced-motion behavior, and bilingual/RTL layouts.
- Treat images as media anchors: predictable aspect ratios, `object-cover`, bounded height, meaningful alt text where instructional, and empty alt text where decorative.

## Rollout plan

### Phase 1 — Canvas and hierarchy (implemented)

- Centralize shell, page, reading, and immersive measures as semantic CSS tokens with one fluid logical gutter.
- Replace competing page widths with the shared `PageContainer` measures.
- Expand the desktop shell so wide screens are used without producing unbounded cards.
- Align Home, Learn, Practice, Library, and Profile to the same page rhythm.
- Standardize page headers, title scale, descriptions, and action alignment.
- Cap immersive visual exercise stages at 1800px, exercise footers at 1440px, and standard exercises at the content measure.
- Localize Profile metric labels and present its identity area as a consistent surface.

### Phase 2 — Component consolidation (implemented baseline)

- Added shared `MediaFrame`, `EmptyState`, and `FeedbackPanel` primitives with semantic surfaces, live-region behavior, and documented media ratios.
- Consolidated high-frequency learner actions onto `Button`/`IconButton` and content surfaces onto `Surface`, including Profile, practice, route recovery, pronunciation, Hadith, conversation, and business entry points.
- Normalized disabled, loading, focus-visible, hover, pressed, radius, padding, border, and shadow behavior in the shared action primitives.
- Replaced local horizontal page padding and duplicate study measures with the semantic `wp-layout-gutter` across specialist curricula, specialist lessons, and study areas.
- Kept answer choices, tabs, stage navigation, and other domain-specific controls specialized; Phase 3 will consolidate those through the four exercise-family templates.

### Phase 3 — Exercise family templates (in progress)

- Defined a shared four-family template contract: visual choice, listening/speaking, text construction, and reading/context.
- Gave every template the same instruction, media, activity, feedback, and action zones, with feedback and action space reserved before an answer is submitted.
- Migrated Picture Match and Build a Sentence as the first visual-choice and text-construction reference implementations.
- Use consistent media ratios by intent: 4:3 for recognition cards, 16:9 for scenes, square for vocabulary thumbnails.
- Keep feedback in-place so success/error states do not shift the main action or image grid.

### Phase 4 — Responsive content strategy

- Audit at 320, 390, 768, 1024, 1280, 1440, and 1920 CSS pixels in both LTR and RTL.
- At phone widths, stack actions and avoid multi-column answer grids unless each option remains at least 44px tall.
- At tablet widths, prefer two-column cards and avoid desktop sidebars inside the content canvas.
- At wide desktop widths, use additional columns only when cards retain readable text and useful image size.
- Verify zoom at 200% and text spacing overrides without horizontal clipping.

### Phase 5 — Visual QA and governance

- Maintain screenshot baselines for the five tabs and four exercise templates in light, dark, LTR, and RTL modes.
- Add automated overflow, touch-target, axe-core, and reduced-motion checks to the E2E suite.
- Review each new screen against the shared state matrix: default, hover, focus, active, disabled, loading, empty, and error.
- Record intentional layout exceptions in the component documentation rather than introducing local width values.

## Screen acceptance checklist

1. The first heading, primary action, and first content surface align to the shared canvas.
2. Empty space supports hierarchy; it is not created by redundant wrappers or conflicting max widths.
3. Cards in the same family share radius, padding, border, and media ratio.
4. Images never stretch, crop instructional content unexpectedly, or dominate without a learning purpose.
5. Mobile, tablet, desktop, RTL, dark mode, keyboard, and reduced-motion states remain coherent.
6. All user-visible copy is localized in English and Arabic.
7. Typecheck, unit tests, lint, and relevant E2E/accessibility checks pass before release.
