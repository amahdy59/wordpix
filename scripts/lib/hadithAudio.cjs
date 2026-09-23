const { audioHash } = require("./assetKey.cjs");

const HADITH_AUDIO_PROFILE_VERSION = 1;

const HADITH_AUDIO_PROFILES = {
  ar: {
    voiceId: process.env.ELEVENLABS_HADITH_AR_VOICE_ID || "xvhpbk8otnNHtT3fjCpr",
    modelId: "eleven_multilingual_v2",
    stability: 0.78,
    similarityBoost: 0.78,
  },
  en: {
    voiceId: process.env.ELEVENLABS_HADITH_EN_VOICE_ID || "XfNU2rGpBa01ckF309OY",
    modelId: "eleven_multilingual_v2",
    stability: 0.72,
    similarityBoost: 0.75,
  },
};

function createHadithAudioCorpus(curriculum) {
  return curriculum.lessons.flatMap((lesson) =>
    [
      { language: "ar", kind: "arabic", text: lesson.source.arabic },
      { language: "en", kind: "translation", text: lesson.source.translation },
    ].map((clip) => {
      const profile = HADITH_AUDIO_PROFILES[clip.language];
      const hash = audioHash(clip.text, profile);
      return {
        lessonId: lesson.id,
        lessonNumber: lesson.number,
        language: clip.language,
        kind: clip.kind,
        text: clip.text,
        chars: [...clip.text].length,
        profile,
        hash,
        objectKey: `audio/${hash.slice(0, 2)}/${hash}.mp3`,
      };
    })
  );
}

function createHadithAudioManifest(curriculum) {
  const corpus = createHadithAudioCorpus(curriculum);
  return {
    schemaVersion: 1,
    profileVersion: HADITH_AUDIO_PROFILE_VERSION,
    lessons: curriculum.lessons.map((lesson) => {
      const clips = corpus.filter((clip) => clip.lessonId === lesson.id);
      const arabic = clips.find((clip) => clip.kind === "arabic");
      const translation = clips.find((clip) => clip.kind === "translation");
      return {
        id: lesson.id,
        arabic: { objectKey: arabic.objectKey, chars: arabic.chars },
        translation: { objectKey: translation.objectKey, chars: translation.chars },
      };
    }),
  };
}

module.exports = {
  HADITH_AUDIO_PROFILE_VERSION,
  HADITH_AUDIO_PROFILES,
  createHadithAudioCorpus,
  createHadithAudioManifest,
};
