/**
 * One shared AudioContext for the whole app.
 *
 * This used to construct `new AudioContext()` on every single sound call and
 * never close any of them. Browsers cap concurrent contexts (Chrome at ~6), so
 * after roughly six answers the constructor threw, the empty catch swallowed
 * it, and audio feedback silently stopped for the rest of the session — in the
 * middle of a gamified feedback loop, with no error surfaced.
 */
let sharedContext: AudioContext | null = null;
let contextUnavailable = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined" || contextUnavailable) return null;

  if (!sharedContext) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) {
      contextUnavailable = true;
      return null;
    }

    try {
      sharedContext = new AudioContextClass();
    } catch {
      contextUnavailable = true;
      return null;
    }
  }

  // Autoplay policy suspends contexts created before a user gesture; every
  // caller here runs from a click or keypress, so resuming is safe.
  if (sharedContext.state === "suspended") {
    void sharedContext.resume().catch(() => {});
  }

  return sharedContext;
}

/** Test seam: drops the shared context so the next call rebuilds it. */
export function resetAudioContextForTests() {
  sharedContext?.close().catch(() => {});
  sharedContext = null;
  contextUnavailable = false;
}

export function playCorrectSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "sine";
    osc2.type = "sine";

    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc2.frequency.setValueAtTime(659.25, now + 0.08); // E5

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.12);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.35);
  } catch {
    // Audio context playback blocked or unsupported
  }
}

export function playIncorrectSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(196.00, now); // G3 low tone
    osc.frequency.exponentialRampToValueAtTime(146.83, now + 0.25); // D3

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  } catch {
    // Audio context playback blocked or unsupported
  }
}

export function playLevelUpSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.15, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.25);
    });
  } catch {
    // Audio context playback blocked or unsupported
  }
}

export function playClickSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(400, now);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch {
    // Audio context playback blocked or unsupported
  }
}

export function useSound() {
  return {
    playCorrect: playCorrectSound,
    playIncorrect: playIncorrectSound,
    playLevelUp: playLevelUpSound,
    playClick: playClickSound,
  };
}
