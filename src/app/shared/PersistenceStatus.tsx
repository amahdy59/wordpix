import { useSyncExternalStore } from "react";
import {
  flushLearnerWrites,
  getLearnerSaveStatus,
  getUnsavedLearnerSnapshot,
  subscribeLearnerSave,
} from "../../lib/persistence/learnerWrites";
import { useI18n } from "../context/I18nContext";
import { Button } from "./Button";

export function useLearnerSaveStatus() {
  return useSyncExternalStore(subscribeLearnerSave, getLearnerSaveStatus, getLearnerSaveStatus);
}
export function PersistenceStatus() {
  const status = useLearnerSaveStatus();
  const { t } = useI18n();
  if (status !== "failed") return null;
  const download = () => {
    const state = getUnsavedLearnerSnapshot();
    if (!state) return;
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(state, null, 2)], { type: "application/json" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "wordpix-progress-backup.json";
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div
      role="alert"
      className="mx-4 mb-4 shrink-0 space-y-3 rounded-2xl border border-border bg-card p-4 text-foreground shadow-wp-lg"
    >
      <p>{t("reliability.saveFailed")}</p>
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => void flushLearnerWrites()}>{t("reliability.retry")}</Button>
        <Button variant="outline" onClick={download}>
          {t("reliability.export")}
        </Button>
      </div>
    </div>
  );
}
