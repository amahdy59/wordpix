# Curriculum exercise authoring baseline

Status: **Phase 3 working guidance**

The supplied curriculum JSONL, schema guide, and working model are editorial inputs. They do not override WordPix accessibility, bilingual, data-integrity, or R2 safety requirements, and they are not imported into production until their content passes review.

## Learner-facing pattern

Each exercise presents one short instruction, one activity, feedback in the same place, and one primary next action. The interaction must remain understandable without relying on colour, sound, animation, or prior knowledge of the interface.

Use the curriculum model in this sequence:

1. Introduce a meaningful cluster of four or five words.
2. Show one natural, CEFR-appropriate use for each word.
3. Build a short coherent sentence or micro-reading from the cluster.
4. Ask for retrieval or comprehension, not repeated copying.
5. Recycle the language later with spacing and immediate corrective feedback.

Media is optional. Add it only when it improves recognition, pronunciation, listening, pragmatic meaning, or context. Do not add decorative media that competes with the task.

## Text-construction progression

- **Recognition:** choose the word that matches a meaningful scene.
- **Supported construction:** place a short set of word tiles in order.
- **Guided production:** complete one missing word or phrase using a contextual cue.
- **Independent production:** write or say a short response for a clear real-world purpose.
- **Recycling:** retrieve the same language in a later lesson or review session.

Sentence tasks should start short, use natural chunks, and introduce only one new difficulty at a time. Instructions should use familiar verbs such as “choose,” “put,” “type,” and “say.”

## Content admission gates

A generated item is blocked from learner-facing use when any required field is blank, marked unrevised, or fails review. Before admission, verify:

- the English sentence is grammatical, natural, and appropriate to the stated CEFR level;
- the Arabic gloss expresses the intended sense rather than a related form;
- the word function, collocation, grammar note, register, and context agree;
- distractors are plausible but unambiguously incorrect;
- the reading is coherent and not a forced list of target words;
- the answer is deterministic and keyed by stable content ID;
- bilingual display, RTL order, screen-reader output, keyboard use, and 44px targets work;
- media references are read-only and no content-ID-to-R2 mapping is altered.

The working model contains useful structure but also blank, unrevised, and potentially incorrect fields. It therefore remains a source for supervised authoring and QA, not production truth.

## Implemented pilot

The complete four-lesson Numbers & Counting unit is now admitted. Its 50 target words retain the source lesson and word IDs, are arranged in ten five-word clusters, and include short contextual sentences, coherent micro-readings, deterministic retrieval questions, and review points after one, three, and seven lessons. The Arabic number gloss for “three” is corrected from `ثلاثي` to `ثلاثة`; the placeholder description for “divided by” is replaced with `مقسوم على`.

The sentence-building engine consumes all 50 validated sentences immediately. Micro-reading and retrieval records are available through the authored lesson registry and are ready for the reading/context template as that Phase 3 family is connected.

Run the full source audit with:

```powershell
pnpm content:curriculum:audit -- --model "C:\path\to\WordPix_Curriculum_Working_Model.json" --lessons "C:\path\to\WordPix_Curriculum_Lessons.jsonl"
```

The report is written under ignored `output/curriculum/`; it never modifies the supplied sources or any media reference.

The initial full audit found 864 blocked lessons, 11,847 missing revised usage sentences, 2,402 missing cluster readings, and 46 lessons with at least one cluster outside the intended four-to-five-word range. The JSONL and working model contain the same 864 lesson IDs and word sequences.
