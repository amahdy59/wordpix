import { memo, useEffect, useMemo, useState } from "react";
import { shuffleArray } from "../../utils/shuffle";
import { createPortal } from "react-dom";
import { X, Volume2 } from "lucide-react";
import { useModalA11y } from "../shared/useModalA11y";
import { IconButton } from "../shared/IconButton";
import { useI18n } from "../context/I18nContext";
import { useAudio } from "../shared/useAudio";
import { emitLearningEvent } from "../analytics/learningAnalytics";
import {
  PLACEMENT_ITEMS,
  recommendFromEvidence,
  type PlacementRecommendation,
} from "./placementRecommendation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (recommendation: PlacementRecommendation) => void;
}
export const PlacementQuizModal = memo(function PlacementQuizModal({
  isOpen,
  onClose,
  onComplete,
}: Props) {
  const { t } = useI18n();
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [usedTranscript, setUsedTranscript] = useState(false);
  const containerRef = useModalA11y({ isOpen, onDismiss: onClose });
  const audio = useAudio({ allowDeviceFallback: true });
  useEffect(() => {
    if (isOpen) {
      setAnswers([]);
      setUsedTranscript(false);
    }
  }, [isOpen]);
  const item = PLACEMENT_ITEMS[answers.length];
  const options = useMemo(
    () => shuffleArray((item?.options ?? []).map((label, index) => ({ label, index }))),
    [item]
  );
  if (!isOpen || !item) return null;
  const answer = (index: number) => {
    audio.stop();
    const next = [...answers, index === item.answer];
    if (next.length < PLACEMENT_ITEMS.length) setAnswers(next);
    else {
      const recommendation = recommendFromEvidence(next, usedTranscript);
      emitLearningEvent({
        name: "placement_completed",
        properties: { recommendedLevel: recommendation.level, scoreBand: "provisional" },
      });
      onComplete(recommendation);
      onClose();
    }
  };
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="placement-modal-title"
        tabIndex={-1}
        className="relative flex max-h-[92dvh] w-full max-w-xl flex-col gap-4 overflow-y-auto rounded-3xl border border-border bg-card p-5 shadow-2xl sm:p-6"
      >
        <IconButton
          icon={<X aria-hidden className="size-5" />}
          aria-label={t("onboarding.closePlacementAria")}
          onClick={() => {
            audio.stop();
            onClose();
          }}
          className="absolute end-3 top-3"
        />
        <h2 id="placement-modal-title" className="pe-12 text-xl font-bold text-foreground">
          {t("reviewUpdate.placementTitle")}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t("reviewUpdate.placementDescription")}
        </p>
        <p role="status" className="text-sm font-semibold text-foreground">
          {t("reviewUpdate.placementPosition", {
            current: answers.length + 1,
            total: PLACEMENT_ITEMS.length,
          })}
        </p>
        {item.audio ? (
          <div className="space-y-2" key={answers.length}>
            <p>{t("reviewUpdate.listenPrompt")}</p>
            <button
              type="button"
              aria-pressed={audio.isPlaying}
              onClick={() => (audio.isPlaying ? audio.stop() : audio.speak(item.prompt))}
              className="flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Volume2 aria-hidden className="size-5" />
              {t(audio.isPlaying ? "action.stop" : "action.listen")}
            </button>
            <p className="text-sm text-muted-foreground">
              {t("reviewUpdate.placementAudioSource")}
            </p>
            <details
              onToggle={(event) => {
                if (event.currentTarget.open) setUsedTranscript(true);
              }}
            >
              <summary className="min-h-11 cursor-pointer rounded-lg py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                {t("reviewUpdate.useTranscript")}
              </summary>
              <p lang="en" dir="ltr">
                {item.prompt}
              </p>
            </details>
            {audio.isError && <p role="status">{t("reviewUpdate.useTranscript")}</p>}
          </div>
        ) : (
          <p lang="en" dir="ltr" data-question-prompt className="wp-question-prompt">
            {item.prompt}
          </p>
        )}
        <div className="flex flex-col gap-2">
          {options.map(({ label, index }) => (
            <button
              key={label}
              type="button"
              onClick={() => answer(index)}
              className="min-h-11 rounded-xl border border-border bg-card px-4 py-3 text-start text-base text-foreground hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              lang="en"
              dir="ltr"
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => answer(-1)}
          className="min-h-11 rounded-lg py-2 text-start text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {t("reviewUpdate.notSure")}
        </button>
        <details>
          <summary className="min-h-11 cursor-pointer rounded-lg py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            {t("reviewUpdate.productionSelfCheck")}
          </summary>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {t("reviewUpdate.productionSelfCheckDescription")}
          </p>
        </details>
      </div>
    </div>,
    document.body
  );
});
