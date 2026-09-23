import { describe, expect, it, vi } from "vitest";
import { purgeLegacyAudioCredentials } from "../shared/audioSecurity";

describe("audio credential cleanup", () => {
  it("removes legacy provider credentials from browser storage", () => {
    const removeItem = vi.fn();

    purgeLegacyAudioCredentials({ removeItem });

    expect(removeItem).toHaveBeenCalledTimes(2);
    expect(removeItem).toHaveBeenCalledWith("wordpix_elevenlabs_key");
    expect(removeItem).toHaveBeenCalledWith("wordpix_elevenlabs_voice_id");
  });

  it("is safe during server rendering", () => {
    expect(() => purgeLegacyAudioCredentials(undefined)).not.toThrow();
  });
});
