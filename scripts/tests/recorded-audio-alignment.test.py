"""Timing evidence must prove clip ownership before batch audio is split."""
import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location("recorded_audio", Path(__file__).resolve().parents[1] / "synthesize_recorded_audio.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


def word(text, start, duration=.3):
    return {"text": text, "offset": int(start * 10_000_000), "duration": int(duration * 10_000_000)}


class AlignmentTests(unittest.TestCase):
    def test_exact_words_get_isolated_ranges(self):
        ranges = module.aligned_ranges([{"text": "Alpha."}, {"text": "Beta."}], "Alpha.\n\nBeta.", [word("Alpha", .1), word("Beta", 1)])
        self.assertAlmostEqual(ranges[0][0], .065)
        self.assertLess(ranges[0][1], ranges[1][0])

    def test_omitted_source_word_is_rejected(self):
        with self.assertRaises(ValueError):
            module.aligned_ranges([{"text": "Alpha hidden."}, {"text": "Beta."}], "Alpha hidden.\n\nBeta.", [word("Alpha", .1), word("Beta", 1)])

    def test_omitted_final_word_is_rejected(self):
        with self.assertRaises(ValueError):
            module.aligned_ranges([{"text": "Alpha hidden."}], "Alpha hidden.", [word("Alpha", .1)])

    def test_coarticulation_is_held_for_separate_synthesis(self):
        ranges = module.aligned_ranges([{"text": "Alpha."}, {"text": "Beta."}], "Alpha.\n\nBeta.", [word("Alpha", .1), word("Beta", .41)])
        self.assertEqual(ranges, [None, None])

    def test_substituted_numbers_are_rejected(self):
        with self.assertRaises(ValueError):
            module.aligned_ranges([{"text": "There are 3."}], "There are 3.", [word("There", .1), word("are", .5), word("three", 1)])

    def test_boundary_cannot_cross_takes(self):
        with self.assertRaises(ValueError):
            module.aligned_ranges([{"text": "Alpha"}, {"text": "Beta"}], "Alpha\n\nBeta", [word("Alpha\n\nBeta", .1)])


if __name__ == "__main__":
    unittest.main()
