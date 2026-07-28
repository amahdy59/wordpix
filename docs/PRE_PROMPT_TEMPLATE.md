# WordPix AI Session Pre-Prompt Template

Copy and paste this header into every AI coding session to maintain constraints, design tokens, and accessibility standards.

```markdown
### Project Context & Rules: WordPix

1. **Framework & Stack**: React 18 + TypeScript + Vite + Tailwind CSS v4.
2. **Single Purpose**: Interactive English vocabulary learning app for Arabic speakers.
3. **Typography Rule**: ONLY two font families are used:
   - Base English text: `font-sans` (`Inter`)
   - Arabic text: `font-arabic` (`Noto Sans Arabic`), always with `dir="auto"` and `lang="ar"`
4. **Design Tokens**: Always use semantic Tailwind utility tokens (`bg-background`, `bg-wp-card`, `bg-primary`, `text-primary`, `border-border`). Do NOT hardcode hex colors in JSX.
5. **Accessibility (WCAG 2.2 AAA)**:
   - All interactive controls MUST be semantic `<button>` or `<a>` with explicit `min-h-[44px] min-w-[44px]` touch targets.
   - All interactive controls MUST include focus rings: `focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary`.
   - Never use color as the sole indicator of state (always include text/icons).
   - Alt text on all meaningful images; `aria-hidden` on decorative elements.
6. **Naming Conventions**:
   - PascalCase for React components (`LessonSceneDiscovery.tsx`).
   - camelCase for hooks and utilities (`useAudio.ts`).
   - Feature-based folder imports (`@/app/shared/...`).
```
