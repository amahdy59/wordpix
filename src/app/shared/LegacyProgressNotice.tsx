import { useLearner } from "../context/LearnerContext";
import { useI18n } from "../context/I18nContext";
import { Button } from "./Button";

export function LegacyProgressNotice() {
  const { state } = useLearner();
  const { t } = useI18n();
  const count = Object.keys(state.legacyWordMemory ?? {}).length;
  if (!count) return null;
  const download = () => {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(state, null, 2)], { type: "application/json" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "wordpix-progress-history.json";
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <section className="space-y-3 rounded-2xl border border-border bg-card p-4 text-foreground">
      <p>{t("reliability.legacy", { count })}</p>
      <Button variant="outline" onClick={download}>
        {t("reliability.export")}
      </Button>
    </section>
  );
}
