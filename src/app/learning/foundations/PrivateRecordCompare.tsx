import { SpeechRecordCompare } from "../../shared/SpeechRecordCompare";
import { useI18n } from "../../../i18n";
import { hasReportedPronunciationAudioIssue } from "./pronunciationAudioQuality";
import { getPronunciationAudioClip } from "./pronunciationAudioManifest";

export function PrivateRecordCompare({
  target,
  defaultOpen = false,
  onEvidence,
}: {
  target: string;
  defaultOpen?: boolean;
  onEvidence?: (value: "reflected" | "assessed") => void;
}) {
  const { t } = useI18n();
  return (
    <SpeechRecordCompare
      target={target}
      modelText={target}
      title={t("pronunciationEnhancements.recordCompareTitle")}
      defaultOpen={defaultOpen}
      modelUnavailable={
        hasReportedPronunciationAudioIssue(target) || !getPronunciationAudioClip(target)
      }
      modelAudioKey={getPronunciationAudioClip(target)?.objectKey}
      pronunciationFeedback
      compact
      onEvidence={onEvidence}
      maxDurationSeconds={20}
    />
  );
}
