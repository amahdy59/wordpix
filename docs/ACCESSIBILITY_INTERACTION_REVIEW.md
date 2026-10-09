# Light and dark interaction review — October 9, 2026

## Scope and findings

The shared UI and all course families were reviewed for readable text, meaningful
icons, interaction states, focus, input boundaries and reduced motion. This
extends the earlier lesson layout/content review; it is not a claim of full
WCAG 2.2 AAA conformance. A criterion-by-criterion audit, assistive technology
testing and further review of image-backed text remain necessary for that claim.

| Finding                                                                                                | Correction                                                                                                                                                               |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Audio callers overrode the background while the control changed its icon color                         | A shared audio state selector owns the complete foreground/background pair for idle, hover, press, active/loading and error states. Caller layout classes remain usable. |
| Global and local pressed/hover opacity weakened readable controls                                      | Enabled interactive text stays opaque; visual feedback uses geometry, borders and shadows.                                                                               |
| Translucent brand fills reduced contrast in navigation, badges, selected counts and cards              | Checked solid secondary surfaces replace blended brand fills, with opaque foregrounds.                                                                                   |
| Amber icons were too pale in light mode, and a blue results value was too dark in dark mode            | Separate semantic foreground tokens support readable accents without changing their decorative fill palettes.                                                            |
| Milestones and mastered badges faded their text or blended it into their fill                          | Milestone text stays opaque; completion badges use checked feedback surfaces and foregrounds.                                                                            |
| Light-mode success/error wording failed 7:1 on feedback surfaces, including new language insight cards | The shared light feedback foregrounds were darkened. The new cards and navigation work are preserved.                                                                    |
| Foreground/background color animation crossed a low-contrast midpoint                                  | Controls switch these colors together while continuing to support guarded geometry/shadow animation. Playing audio uses a steady icon.                                   |
| Empty input boundaries and focus on immersive dark panels were difficult to identify                   | Fields use a contrasting control-border token; dark panels use their checked focus palette. The video seek control has a 44px minimum height.                            |
| Software updates disappeared after dismissing the Home card                                            | A permanent bilingual release-history page is reachable from Profile and Home. A validated canonical history also generates the Home notification data.                  |

## Browser evidence

The final computed-color pass checked **72 route/stage presentations in both
themes**, across default, hover, pressed and focus states: **40,308 text/icon
checks, with zero failing pairs**. The pass includes the five main sections,
all four specialist course families, unlocked Business/Conversation stage
presentations, the four Hadith sections, six vocabulary study areas, all 35
registered skill exercises and release history.

Checks used 7:1 for text (including large text, a deliberately stricter check)
and 3:1 for icons. Hidden controls and disabled controls were excluded. Complex
image/gradient text backgrounds require separate visual inspection and were not
represented as guessed flat colors. Browser paint was allowed to settle before
measuring inherited SVG colors. Test progress was seeded only in an isolated
browser profile; learner data and R2 media mappings were not modified.

The release page was also checked in eight English/Arabic, light/dark and
320px/1440px combinations: all 12 history entries rendered, no horizontal
overflow occurred, the back control met 44px minimum dimensions, and keyboard
focus displayed a 3px outline. Desktop and Arabic mobile screenshots were
visually inspected.

Unit regression coverage includes semantic color pairings, audio state/retry
behavior, route round trips, bilingual release rendering and history availability
after notification dismissal. Existing keyboard, dialog, RTL, responsive and
axe browser checks remain part of the combined pre-push release gate.

Release history authoring and preservation are documented in
[`RELEASE_NOTES.md`](RELEASE_NOTES.md). Course navigation decisions from the
concurrent session are preserved in [`LESSON_NAVIGATION_UX.md`](LESSON_NAVIGATION_UX.md).

## CI follow-up: mobile footer overlap

The first combined release passed the local 122-test browser suite, but Linux
CI detected one mobile Hadith review action partially obscured by the sticky
bottom toolbar. The v0.1.7 correction keeps bottom navigation in normal flow;
the compact top course rail remains sticky. The existing Hadith browser test
now verifies that both the top and bottom edges of the sample-answer control
can be hit before activating it, in addition to the axe scan. This records a
real platform-specific layout failure rather than suppressing the accessibility
rule or merely retrying the failed workflow.
