/**
 * Utility for silence auto-trimming and lightweight WAV encoding of recorded user audio.
 * Strips dead air before and after speech so learner playback is crisp and immediate.
 */

function writeString(view: DataView, offset: number, string: string): void {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Encodes a section of an AudioBuffer into an uncompressed 16-bit PCM WAV Blob.
 */
export function encodeAudioBufferToWav(
  buffer: AudioBuffer,
  offsetSamples = 0,
  lengthSamples = buffer.length
): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const numSamples = Math.min(lengthSamples, buffer.length - offsetSamples);
  const bytesPerSample = 2; // 16-bit PCM
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;

  const headerSize = 44;
  const arrayBuffer = new ArrayBuffer(headerSize + dataSize);
  const view = new DataView(arrayBuffer);

  // RIFF chunk descriptor
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");

  // "fmt " sub-chunk
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true); // 16 for PCM format
  view.setUint16(20, 1, true); // Linear PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // bits per sample

  // "data" sub-chunk
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  // Interleave channel samples and convert from float32 to int16
  const channels: Float32Array[] = [];
  for (let ch = 0; ch < numChannels; ch++) {
    channels.push(buffer.getChannelData(ch));
  }

  let writeIndex = 44;
  for (let i = 0; i < numSamples; i++) {
    const srcIndex = offsetSamples + i;
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, channels[ch][srcIndex]));
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(writeIndex, Math.round(intSample), true);
      writeIndex += 2;
    }
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}

/**
 * Trims leading and trailing silence from an audio Blob using the Web Audio API.
 * Keeps a small padding (e.g. 50ms) before the sound starts and after it ends to avoid harsh clipping.
 * Returns the original blob safely if AudioContext is unavailable, unsupported, or if decoding fails.
 */
export async function trimAudioSilence(
  blob: Blob,
  thresholdDb = -42,
  padSeconds = 0.05
): Promise<Blob> {
  const AudioContextClass =
    typeof window !== "undefined"
      ? window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      : undefined;

  if (!AudioContextClass) {
    return blob;
  }

  let audioContext: AudioContext | null = null;
  try {
    audioContext = new AudioContextClass();
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const sampleRate = audioBuffer.sampleRate;
    const numChannels = audioBuffer.numberOfChannels;
    const linearThreshold = Math.pow(10, thresholdDb / 20);

    let startSample = audioBuffer.length;
    let endSample = 0;

    for (let ch = 0; ch < numChannels; ch++) {
      const channelData = audioBuffer.getChannelData(ch);
      for (let i = 0; i < audioBuffer.length; i++) {
        if (Math.abs(channelData[i]) >= linearThreshold) {
          if (i < startSample) startSample = i;
          break;
        }
      }
      for (let i = audioBuffer.length - 1; i >= 0; i--) {
        if (Math.abs(channelData[i]) >= linearThreshold) {
          if (i > endSample) endSample = i;
          break;
        }
      }
    }

    // If completely silent, return original blob
    if (startSample >= endSample) {
      return blob;
    }

    const padSamples = Math.round(padSeconds * sampleRate);
    const trimmedStart = Math.max(0, startSample - padSamples);
    const trimmedEnd = Math.min(audioBuffer.length, endSample + padSamples);
    const trimmedLength = trimmedEnd - trimmedStart;

    // Only apply if trimming actually removes noticeable dead air (at least 100ms)
    const deadAirSamples = audioBuffer.length - trimmedLength;
    if (deadAirSamples < Math.round(0.1 * sampleRate)) {
      return blob;
    }

    return encodeAudioBufferToWav(audioBuffer, trimmedStart, trimmedLength);
  } catch {
    return blob;
  } finally {
    if (audioContext && audioContext.state !== "closed") {
      try {
        await audioContext.close();
      } catch {
        // Safe ignore
      }
    }
  }
}
