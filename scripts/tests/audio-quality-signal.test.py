"""Signal flags are review prompts, never semantic or pronunciation approval."""
import importlib.util
from pathlib import Path
import unittest
import tempfile
import hashlib
import numpy as np

spec = importlib.util.spec_from_file_location("audio_quality", Path(__file__).resolve().parents[1] / "audit_audio_quality_sample.py")
quality = importlib.util.module_from_spec(spec)
spec.loader.exec_module(quality)

class QualityMetrics(unittest.TestCase):
    def test_reused_review_requires_unchanged_actual_file_bytes(self):
        with tempfile.TemporaryDirectory() as directory:
            clip = Path(directory) / "clip.mp3"
            clip.write_bytes(b"original sampled bytes")
            checksum = hashlib.sha256(clip.read_bytes()).hexdigest()
            quality.verify_clip_bytes(clip, checksum)
            clip.write_bytes(b"different bytes")
            with self.assertRaisesRegex(ValueError, "changed"):
                quality.verify_clip_bytes(clip, checksum)
            with self.assertRaisesRegex(ValueError, "invalid"):
                quality.verify_clip_bytes(clip, "")

    def test_speech_like_signal_is_not_mistaken_for_silence(self):
        rate = 16000
        samples = 0.2 * np.sin(np.arange(rate) * 2 * np.pi * 440 / rate)
        self.assertEqual(quality.signal_metrics(samples, rate)["flags"], [])

    def test_empty_and_nonfinite_decodes_are_rejected(self):
        for samples in [np.array([]), np.array([np.nan])]:
            self.assertIn("empty-or-invalid-decoded-signal", quality.signal_metrics(samples, 16000)["flags"])

    def test_silent_and_clipped_signals_are_distinct(self):
        self.assertIn("silent-or-very-quiet", quality.signal_metrics(np.zeros(16000), 16000)["flags"])
        self.assertIn("review-clipping", quality.signal_metrics(np.ones(16000), 16000)["flags"])

    def test_measures_leading_and_trailing_quiet_in_seconds(self):
        tone = 0.2 * np.sin(np.arange(16000) * 2 * np.pi * 440 / 16000)
        result = quality.signal_metrics(np.concatenate([np.zeros(12800), tone, np.zeros(19200)]), 16000)
        self.assertAlmostEqual(result["leadingQuietSeconds"], 0.8, places=2)
        self.assertAlmostEqual(result["trailingQuietSeconds"], 1.2, places=2)
        self.assertIn("review-leading-quiet", result["flags"])
        self.assertIn("review-trailing-quiet", result["flags"])

    def test_normalization_preserves_arabic_letters_and_token_boundaries(self):
        self.assertEqual(quality.normalized("أَهْلًا، بِكَ!"), "اهلا بك")
        self.assertEqual(quality.normalized("Hello, world!"), "hello world")
        self.assertEqual(quality.edit_distance(["one", "word"], ["one", "wrong"]), 1)

if __name__ == "__main__": unittest.main()
