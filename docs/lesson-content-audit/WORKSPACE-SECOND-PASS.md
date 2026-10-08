# Concurrent changes review — 8 October 2026

Reviewed the current Hadith structure and progress migration, the updated Home specialist-course card, and Learn course progress cards. The source files were re-read before narrow edits; existing course structure and navigation improvements were retained. This document describes this snapshot, not changes made later in another task.

## Corrected findings

- The Home card used pronunciation best quiz scores as lesson progress. It now shows the current stage, with a stage label, and retains explicit legacy lesson migrations.
- Completed stages could produce a “Mastered” label while the stored Hadith status was “needs-practice”. Mastery now comes from the stored mastery status. Completion counts use distinct valid stage IDs and the curriculum stage definitions.
- Unknown saved course IDs could produce a Resume action for a missing lesson; unknown pronunciation keys could silently open lesson 1. Only available lessons become resume candidates. Invalid dates are excluded from recency sorting.
- Progress labels contained an English-only screen-reader string. The label now uses English/Arabic translation keys and exposes the status as its value text.
- The new shortcut buttons had scale motion without a reduced-motion guard. Scale feedback is now conditional on motion preference.

Four regression tests cover completion versus mastery, stage position versus quiz score, unavailable saved lesson IDs, and the legacy pronunciation mapping. Hadith content/layout fixes and individual lesson coverage are detailed in [HADITH-REVIEW.md](HADITH-REVIEW.md).

## Changes retained

The four-stage Hadith flow, optional bilingual layout, consolidated language bank, review self-ratings, Home specialist shortcuts, and Learn course progress bars remain. Stored learner data and all R2 media mappings remain untouched by this pass. Concurrent image-publication work is outside this task's write scope.

## Scope limits

The whole-app structural audit and browser route tests do not certify every individual lesson's semantics or image. The broader manual editorial queue remains in [REVIEW.md](REVIEW.md) and `manual-review-progress.json`.
