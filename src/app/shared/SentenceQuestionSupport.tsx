import { useId, useState } from "react";
import { ImageOff, Volume2 } from "lucide-react";
import type { VocabularyItem } from "../data/courseCatalog";
import type { LessonUsageData } from "../data/usageTypes";
import { getAuthoredSentence } from "../exercises/content/authoredLessonContent";
import type { PilotSentenceMedia } from "../exercises/content/pilotSentenceMedia";
import { QuestionImage } from "./QuestionImage";
import { PLACEHOLDER_DESCRIPTION } from "../data/placeholderDescription";
import { useI18n } from "../context/I18nContext";
import { useSentenceAudio } from "./useSentenceAudio";
import { Button } from "./Button";
import { MediaFrame } from "./MediaFrame";

/** A word ID alone cannot establish that an image supports a sentence. */
export function resolveSentenceMedia(
  wordId: string,
  sentence: string,
  usage?: LessonUsageData | null
): PilotSentenceMedia | undefined {
  const authored = getAuthoredSentence(wordId);
  if (authored?.full === sentence && authored.media) return authored.media;
  const scene = usage?.usage.scenes.find(
    (candidate) =>
      candidate.imagePath &&
      candidate.imageAlt &&
      candidate.imagePurpose !== "word-reference" &&
      candidate.scenario.includes(sentence)
  );
  return scene?.imagePath && scene.imageAlt
    ? { imagePath: scene.imagePath, imageAlt: scene.imageAlt, imageFallbacks: scene.imageFallbacks }
    : undefined;
}

export function ScenePlaceholder({ clue }: { clue?: string }) {
  const { t } = useI18n();
  return (
    <div className="flex min-h-32 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-secondary p-4 text-center">
      <ImageOff className="size-8 text-foreground" aria-hidden />
      <span className="font-semibold text-foreground">{t("story.imagePending")}</span>
      <span className="text-sm text-foreground">{t("exercise.scenePlaceholderDescription")}</span>
      {clue && (
        <p lang="en" dir="ltr" className="text-base font-semibold leading-relaxed text-foreground">
          {clue}
        </p>
      )}
    </div>
  );
}

export function SentenceQuestionSupport({
  word,
  sentence,
  prompt,
  media,
  answered,
}: {
  word: VocabularyItem;
  sentence: string;
  prompt: string;
  media?: PilotSentenceMedia;
  answered: boolean;
}) {
  const { t } = useI18n();
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const audioHintId = useId();
  const audio = useSentenceAudio(answered ? sentence : prompt);
  const hasImage = media && failedImage !== media.imagePath;
  // A definition remains available to keyboard and screen-reader learners and
  // provides evidence when an essential visual is unavailable. Do not show a
  // second unfinished sentence or silently substitute vocabulary artwork.
  const quantity: Record<string, string> = {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
    ten: "10",
    eleven: "11",
    twelve: "12",
    thirteen: "13",
    fourteen: "14",
    fifteen: "15",
    sixteen: "16",
    seventeen: "17",
    eighteen: "18",
    nineteen: "19",
    twenty: "20",
    thirty: "30",
    forty: "40",
    fifty: "50",
    sixty: "60",
    seventy: "70",
    eighty: "80",
    ninety: "90",
    hundred: "100",
    thousand: "1,000",
    million: "1,000,000",
  };
  const hasDefinition = word.description.trim() && word.description !== PLACEHOLDER_DESCRIPTION;
  const clue = quantity[word.id] ?? (hasDefinition ? word.description : word.label);
  const clueLabel = quantity[word.id]
    ? t("exercise.quantityClue")
    : hasDefinition
      ? t("exercise.meaningClue")
      : t("exercise.wordToPractice");
  return (
    <div className="flex min-w-0 flex-col gap-2 sm:gap-3">
      {hasImage ? (
        <MediaFrame fit="contain" aspect="scene" className="w-full max-h-48 sm:max-h-none">
          <QuestionImage
            media={media}
            className="size-full object-contain"
            loading="eager"
            {...{ fetchpriority: "high" }}
            onExhausted={() => setFailedImage(media.imagePath)}
          />
        </MediaFrame>
      ) : (
        <ScenePlaceholder />
      )}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-wp-card p-2 sm:p-3">
        <p
          lang="en"
          dir="ltr"
          className="min-w-0 flex-1 basis-36 text-start text-base leading-relaxed text-foreground"
        >
          <span className="font-semibold">{clueLabel}: </span>
          {clue}
        </p>
        <Button
          variant="outline"
          size="md"
          disabled={!audio.isSupported}
          aria-pressed={audio.isPlaying}
          aria-busy={audio.isLoading}
          aria-label={
            audio.isPlaying
              ? t("exercise.stopSentenceAudio")
              : audio.isError
                ? t("exercise.retrySentenceAudio")
                : t("exercise.listenSentence")
          }
          aria-describedby={!answered ? audioHintId : undefined}
          iconLeft={<Volume2 className="size-4" aria-hidden />}
          onClick={() => (audio.isPlaying ? audio.stop() : audio.play())}
        >
          {audio.isPlaying
            ? t("action.stop")
            : audio.isError
              ? t("action.retry")
              : t("action.listen")}
        </Button>
      </div>
      {!answered && (
        <span id={audioHintId} className="sr-only">
          {t("exercise.sentenceAudioGapHint")}
        </span>
      )}
      {audio.isError && (
        <p role="status" className="text-sm text-foreground">
          {t("exercise.sentenceAudioError")}
        </p>
      )}
    </div>
  );
}
