import { useEffect, useState } from "react";
import { useI18n } from "../context/I18nContext";
import { Button } from "../shared/Button";
import {
  clearImageReports,
  loadImageReports,
  IMAGE_REPORTS_CHANGED,
  type ImageReport,
} from "../media/imageReports";

export function ImageReportHistory() {
  const { t } = useI18n();
  const [rows, setRows] = useState<ImageReport[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    const refresh = () => {
      void loadImageReports()
        .then((reports) => {
          if (active) {
            setRows(reports);
            setStatus("ready");
          }
        })
        .catch(() => {
          if (active) setStatus("error");
        });
    };
    refresh();
    window.addEventListener(IMAGE_REPORTS_CHANGED, refresh);
    return () => {
      active = false;
      window.removeEventListener(IMAGE_REPORTS_CHANGED, refresh);
    };
  }, [attempt]);
  return (
    <section
      className="space-y-3 rounded-2xl border border-border bg-card p-5"
      aria-labelledby="image-reports-title"
    >
      <h2 id="image-reports-title" className="text-lg font-bold">
        {t("imageQuality.savedReports")}
      </h2>
      <p className="text-sm leading-relaxed">{t("imageQuality.localReportHint")}</p>
      <p role="status">
        {status === "loading"
          ? t("app.loading")
          : status === "error"
            ? t("imageQuality.reportError")
            : t("imageQuality.reportCount", { count: rows.length })}
      </p>
      <div className="flex flex-wrap gap-3">
        {status === "error" && (
          <Button
            onClick={() => {
              setStatus("loading");
              setAttempt((value) => value + 1);
            }}
          >
            {t("action.retry")}
          </Button>
        )}
        <Button
          disabled={!rows.length || status !== "ready"}
          onClick={() => {
            const blob = new Blob(
              [
                JSON.stringify(
                  { schemaVersion: 1, exportedAt: new Date().toISOString(), reports: rows },
                  null,
                  2
                ),
              ],
              { type: "application/json" }
            );
            const url = URL.createObjectURL(blob),
              anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = "wordpix-image-reports.json";
            anchor.click();
            window.setTimeout(() => URL.revokeObjectURL(url), 1000);
          }}
        >
          {t("imageQuality.exportReports")}
        </Button>
        <Button
          variant="secondary"
          disabled={!rows.length || status !== "ready"}
          onClick={() => {
            setStatus("loading");
            void clearImageReports().catch(() => setStatus("error"));
          }}
        >
          {t("imageQuality.clearReports")}
        </Button>
      </div>
    </section>
  );
}
