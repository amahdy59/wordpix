import { SpeechRecordCompare } from "../../shared/SpeechRecordCompare";
import { useI18n } from "../../../i18n";

export function PrivateRecordCompare({ target }: { target: string }) {
  const { t } = useI18n();
  return (
    <SpeechRecordCompare
      target={target}
      modelText={target}
      title={t("foundation.recordCompare")}
      defaultOpen={false}
    />
  );
}
