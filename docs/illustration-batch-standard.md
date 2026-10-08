# WordPix illustration batch standard

## Purpose and status

Target: 1,000 illustrations, delivered in 20 resumable batches of 50.
The candidate manifest is preparation, not generated artwork or approval.
The user is selecting real-question coverage versus controlled performance variations.
Do not substitute performance variants for distinct curriculum illustrations.
Existing Cloudflare R2 assets and content-to-media mappings remain read-only.

## Visual direction

Use adult-oriented vector illustrations with recognisable silhouettes, subtle
depth, and minimal background detail. Extract current WordPix semantic tokens
from src/styles/theme.css rather than assuming its introductory comments are current.
Use violet and teal for neutral accents, consistent surfaces, and restrained
outlines. Preserve natural/assessed colors: a red object must remain red when
the lesson tests red. Never tint every object to the brand palette.

Use 1200 × 675 exports with a 48 px safe area. Review at 360 px display width.
Meaningful object boundaries need at least 3:1 contrast against adjacent colors;
normal explanatory text in the surrounding interface needs 7:1. Prefer thicker
outlines when scaling would make lines faint. Provide light, dark, and high-contrast
presentation checks; preserve colors being assessed in each. Token-pair tests
alone do not establish contrast for a completed scene or WCAG conformance.

## Teaching and assessment

- Coherence: show details needed for the task, remove distracting decoration.
- Signaling: organise groups and spatial relationships clearly. In assessment,
  avoid visual cues that uniquely advertise the correct answer. Instructional
  annotations belong in a separate teaching version.
- Contiguity: keep associated objects close; do not embed long text in artwork.
- Scaffolding: concrete, simple scenes for beginners; increase contextual
  complexity with language level while maintaining recognisable evidence.
- Multiple representation: prepare English/Arabic descriptions and optional
  narration. Replay belongs in the accessible application interface.
- Alternative assessment: an alt description that states a count may reveal an
  answer. Design an equivalent accessible task or use the applicable test-content
  alternative, rather than hiding essential information from screen-reader users.
- Distinctive concepts: distinguish similar objects by real structural features.
  Do not represent abstract concepts with arbitrary decorative icons.

Every brief must state the learning objective, exact objects, count, position,
action, colors, assessable evidence, distractors, and prohibited answer cues.
Questions about sequence, intention, sound, or hidden information may need a
sequence, audio, revised question, or explicit textual context instead of a still.
Generic source scenarios must be rewritten before generation, with content review.

## Workflow and performance measurement

1. Validate source content and choose the batch purpose.
2. Approve a representative style sample spanning counts, colors, spatial
   relations, actions, similar objects, and abstract vocabulary.
3. Use editable object templates and Figma variables; load the Figma library
   skill before creating components. Store exact source scene IDs on frame names.
4. Process 50 assets at a time with external checkpoints and retry protection.
   Use multiple files/pages when measured latency or file size warrants it;
   50 is an initial operating batch size, not a documented Figma limit.
5. Record actual generation and export duration, failures/retries, file bytes,
   Figma open/pan/export response, and asset rendering time at mobile sizes.
   Report median and p95 separately. Measure app behavior in a local trial
   harness; Figma timing cannot establish app performance.
6. Export SVG plus PNG fallback; validate completeness, dimensions, mobile
   legibility, contrast, duplicates, and all quantities/relationships.
7. Human semantic review is required for each real question. Automated shape
   counts cannot prove an illustration represents the correct concept.
8. Keep draft and approved states distinct; blocked briefs remain blocked.

## Sources

- [W3C non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- [W3C enhanced text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html)
- [W3C text alternatives and test-content exception](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)
- [CAST multiple ways to perceive information](https://udlguidelines.cast.org/representation/perception/ways-perceive-information/)
- [Cambridge multimedia learning principles](https://assets.cambridge.org/97811076/10316/excerpt/9781107610316_excerpt.pdf)

These inform design decisions; they do not establish a universally best method
or guarantee learning outcomes without learner evaluation.
