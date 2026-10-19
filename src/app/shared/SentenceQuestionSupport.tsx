import { useEffect, useId, useRef, useState } from "react";
import { ImageOff, Volume2 } from "lucide-react";
import type { VocabularyItem } from "../data/courseCatalog";
import type { LessonUsageData } from "../data/usageTypes";
import { getAuthoredSentence } from "../exercises/content/authoredLessonContent";
import type { PilotSentenceMedia } from "../exercises/content/pilotSentenceMedia";
import { QuestionImage } from "./QuestionImage";
import { PLACEHOLDER_DESCRIPTION } from "../data/placeholderDescription";
import { useI18n } from "../context/I18nContext";
import { useSentenceAudio } from "./useSentenceAudio";
import { useAccessibility } from "./useAccessibilityPreferences";
import { Button } from "./Button";
import { MediaFrame } from "./MediaFrame";
import { useLessonSession } from "./LessonSessionContext";

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
      (candidate.scenario.includes(sentence) ||
        Boolean(
          candidate.learningContext?.scenario &&
          candidate.learningContext.scenario.includes(sentence)
        ))
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
  autoPlay = false,
}: {
  word: VocabularyItem;
  sentence: string;
  prompt: string;
  media?: PilotSentenceMedia;
  answered: boolean;
  autoPlay?: boolean;
}) {
  const { t } = useI18n();
  const { accessibility } = useAccessibility();
  const session = useLessonSession();
  const [activeQuestionKey, setActiveQuestionKey] = useState(`${word.id}:${sentence}`);
  const [failedImages, setFailedImages] = useState<ReadonlySet<string>>(() => new Set());
  if (activeQuestionKey !== `${word.id}:${sentence}`) {
    setActiveQuestionKey(`${word.id}:${sentence}`);
    setFailedImages(new Set());
  }

  const audio = useSentenceAudio(answered ? sentence : prompt);
  const audioHintId = useId();

  const fallbackMedia: PilotSentenceMedia | undefined =
    word.img && !failedImages.has(word.img)
      ? {
          imagePath: word.img,
          imageAlt:
            word.description && word.description !== PLACEHOLDER_DESCRIPTION
              ? word.description
              : word.label,
        }
      : undefined;

  const activeMedia =
    (media && !failedImages.has(media.imagePath) ? media : undefined) ?? fallbackMedia;
  const hasImage = Boolean(activeMedia);

  const hasSpokenRef = useRef<Record<string, boolean>>({});
  const questionKey = `${word.id}:${prompt}`;

  useEffect(() => {
    if (
      !autoPlay ||
      accessibility.autoPlayAudio === false ||
      !accessibility.includeListening ||
      answered
    )
      return undefined;
    if (hasSpokenRef.current[questionKey]) return undefined;
    const timer = setTimeout(() => {
      hasSpokenRef.current[questionKey] = true;
      audio.play();
    }, 250);
    return () => {
      clearTimeout(timer);
      audio.stop();
    };
  }, [
    autoPlay,
    questionKey,
    answered,
    accessibility.includeListening,
    accessibility.autoPlayAudio,
    audio,
  ]);

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
    <div className="flex min-w-0 flex-col gap-3 sm:gap-4 w-full">
      {hasImage && activeMedia ? (
        <MediaFrame fit="contain" aspect="auto" className="wp-question-media">
          <QuestionImage
            key={activeMedia.imagePath}
            media={activeMedia}
            className="size-full object-contain object-center"
            loading="eager"
            {...{ fetchpriority: "high" }}
            onExhausted={() => setFailedImages((prev) => new Set(prev).add(activeMedia.imagePath))}
          />
        </MediaFrame>
      ) : (
        <ScenePlaceholder />
      )}
      <details
        key={word.id}
        open={!hasImage || answered || session?.scaffolding !== "independent"}
        className="border-t border-border pt-1"
      >
        <summary className="min-h-11 cursor-pointer rounded-lg py-2 text-sm font-semibold text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          {t("reviewUpdate.meaningSupport")}
        </summary>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p
            lang="en"
            dir="ltr"
            className="min-w-0 flex-1 basis-36 text-start text-base sm:text-lg leading-relaxed text-foreground"
          >
            <span className="font-bold text-foreground">{clueLabel}: </span>
            <span className="font-semibold text-primary">{clue}</span>
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
            className="shrink-0 min-h-[44px] min-w-[44px] px-4 font-semibold"
          >
            {audio.isPlaying
              ? t("action.stop")
              : audio.isError
                ? t("action.retry")
                : t("action.listen")}
          </Button>
        </div>
      </details>
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
