# Text-only specialist quiz purpose review

The 370 business and 400 conversation quiz prompts are classified as text-only
assessment tasks in `visual-purpose-decisions.json`. This is a task-modality
policy review, not a semantic approval of any illustration.

The review inspected the actual `BusinessExerciseStage` and `QuizStage` mappings
to `CurriculumQuizEngine`, the quiz type schemas, and the shared engine contract.
These stages pass a text stem, written answer options, the correct value and a
feedback explanation; they do not pass the engine's optional media field.
The tasks assess language-bank meanings, collocations, grammar, pragmatics or
reading comprehension. Their vocabulary/reference stages already supply a
separate place for visual learning support.

An additional scan of all 770 current stems found no image-dependent references
such as an image, picture, photo, diagram, graph, chart, illustration or an item
being shown. This scan is supporting evidence, not a substitute for the renderer
and modality review. Adding pictures automatically would risk supplying the
meaning being assessed rather than testing the written language.

Each purpose record pins its exact current prompt revision and is labelled
`Codex task-modality policy review`. Changed prompts invalidate the decision.
Changes to the stage renderer or assessment modality also require a fresh policy
review. Source-file digests and the review method are retained in the local
`output/image-quality/specialist-quiz-purpose-proposals.json` artifact.

This classification does not apply to specialist vocabulary pictures, course
cards, future image-choice exercises, or the core curriculum's sentence/scene
illustrations. Those still need their own purpose and semantic evidence. No
R2 object or content-to-image URL mapping was changed by this review.
