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
import { useLessonSession } from "./LessonSessionContext";
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

export function ScenePlaceholder({ clue, className = "" }: { clue?: string; className?: string }) {
  const { t } = useI18n();
  return (
    <div
      className={`flex min-h-32 w-full flex-1 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-secondary p-4 text-center ${className}`}
    >
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

export interface SentenceMeaningSupportProps {
  word?: VocabularyItem;
  targetWord?: VocabularyItem;
  sentence: string;
  prompt: string;
  answered: boolean;
  autoPlay?: boolean;
  defaultOpen?: boolean;
  hasImage?: boolean;
  className?: string;
}

export function SentenceMeaningSupport({
  word: wordProp,
  targetWord: targetWordProp,
  sentence,
  prompt,
  answered,
  autoPlay = false,
  defaultOpen,
  hasImage,
  className = "",
}: SentenceMeaningSupportProps) {
  const word = (targetWordProp ?? wordProp)!;
  const { t } = useI18n();
  const { accessibility } = useAccessibility();
  const session = useLessonSession();
  const audio = useSentenceAudio(answered ? sentence : prompt);
  const audioHintId = useId();

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

  const isOpen = defaultOpen ?? (hasImage === false || session?.scaffolding !== "independent");

  return (
    <div className={`w-full ${className}`}>
      <details
        key={word.id}
        open={isOpen}
        className="rounded-xl border border-border/80 bg-wp-card dark:bg-card/40 p-2.5 sm:p-3 transition-colors motion-reduce:transition-none"
      >
        <summary className="min-h-11 cursor-pointer rounded-lg py-1 px-2 text-sm font-semibold text-foreground hover:text-primary focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary flex items-center justify-between">
          <span>{t("reviewUpdate.meaningSupport")}</span>
        </summary>
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-2.5">
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
        <p role="status" className="mt-1 text-sm text-foreground">
          {t("exercise.sentenceAudioError")}
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
  showClue = true,
  onImageExhausted,
  className = "",
}: {
  word: VocabularyItem;
  sentence: string;
  prompt: string;
  media?: PilotSentenceMedia;
  answered: boolean;
  autoPlay?: boolean;
  showClue?: boolean;
  onImageExhausted?: () => void;
  className?: string;
}) {
  const [activeQuestionKey, setActiveQuestionKey] = useState(`${word.id}:${sentence}`);
  const [failedImages, setFailedImages] = useState<ReadonlySet<string>>(() => new Set());
  if (activeQuestionKey !== `${word.id}:${sentence}`) {
    setActiveQuestionKey(`${word.id}:${sentence}`);
    setFailedImages(new Set());
  }

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

  useEffect(() => {
    if (!hasImage) {
      onImageExhausted?.();
    }
  }, [hasImage, onImageExhausted]);

  return (
    <div
      data-target-word={word.label.toLowerCase()}
      className={`flex min-w-0 flex-col gap-3 sm:gap-4 w-full h-full ${className}`}
    >
      {hasImage && activeMedia ? (
        <MediaFrame
          fit="contain"
          aspect="auto"
          className="wp-question-media wp-question-media--fitted h-full"
        >
          <QuestionImage
            key={activeMedia.imagePath}
            media={activeMedia}
            className="w-auto h-auto max-w-full max-h-full object-contain object-center"
            loading="eager"
            {...{ fetchpriority: "high" }}
            onExhausted={() => {
              setFailedImages((prev) => new Set(prev).add(activeMedia.imagePath));
              onImageExhausted?.();
            }}
          />
        </MediaFrame>
      ) : (
        <ScenePlaceholder />
      )}
      {showClue && (
        <SentenceMeaningSupport
          word={word}
          sentence={sentence}
          prompt={prompt}
          answered={answered}
          autoPlay={autoPlay}
          hasImage={hasImage}
        />
      )}
    </div>
  );
}
