---
name: i18n
description: Bilingual English/Arabic content rules - locale files, RTL, and i18next conventions for WordPix
metadata:
  category: frontend
---

# Internationalization (English / Arabic)

Use this skill whenever you add or change user-visible strings, or work in `src/i18n/` and localization-related files.

## Key Facts

- Stack: `i18next` + `react-i18next` with browser language detection.
- Locale files: `src/i18n/locales/en.json` and `src/i18n/locales/ar.json`.
- Arabic is RTL; layout must mirror correctly (use logical CSS properties, not `left`/`right`).
- `eslint-plugin-i18next` flags hardcoded strings — route all user-visible copy through i18next.
- Learner modes: child and adult audiences exist; copy tone rules live in the docs.

## Instructions

1. Add the new key to BOTH `en.json` and `ar.json` in the same change. A missing Arabic key is a bug.
2. Use descriptive namespaced keys (e.g. `lesson.progress.title`), not single-word catch-alls.
3. Never concatenate translated fragments; use interpolation for dynamic values.
4. Check the RTL E2E spec (`e2e/rtl_and_darkmode.spec.ts`) when layout could be affected.
5. Keep learner-facing copy within the reading level and tone defined in the product docs.

## References

- `docs/15_I18N_SPEC.md` — the authoritative i18n spec
- `docs/03_INCLUSIVE_UX_AND_LEARNING_EXPERIENCE.md` — copy tone and learner modes
