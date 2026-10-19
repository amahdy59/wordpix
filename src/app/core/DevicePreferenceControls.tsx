import { useI18n } from "../context/I18nContext";
import { setDevicePreference, useDevicePreference } from "../shared/devicePreferences";
import { readDiagnostics, clearDiagnostics } from "../analytics/localDiagnostics";

export function DevicePreferenceControls({
  kind,
}: {
  kind: "character-shortcuts" | "diagnostics-consent";
}) {
  const { t } = useI18n();
  const enabled = useDevicePreference(kind);
  const key =
    kind === "character-shortcuts" ? "reviewUpdate.shortcuts" : "reviewUpdate.diagnostics";
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5">
      <div className="max-w-prose">
        <h3 className="text-base font-semibold text-foreground">{t(`${key}Title`)}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {t(`${key}Description`)}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={t(`${key}Title`)}
        onClick={() => setDevicePreference(kind, !enabled)}
        className="min-h-11 min-w-11 rounded-xl border border-border bg-secondary px-4 py-2 font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {t(enabled ? "settings.enabled" : "settings.disabled")}
      </button>
      {kind === "diagnostics-consent" && (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              const url = URL.createObjectURL(
                new Blob([JSON.stringify(readDiagnostics(), null, 2)], { type: "application/json" })
              );
              const link = document.createElement("a");
              link.href = url;
              link.download = "wordpix-diagnostics.json";
              link.click();
              setTimeout(() => URL.revokeObjectURL(url), 1000);
            }}
            className="min-h-11 rounded-xl border border-border px-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("reviewUpdate.exportDiagnostics")}
          </button>
          <button
            type="button"
            onClick={clearDiagnostics}
            className="min-h-11 rounded-xl border border-border px-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("reviewUpdate.clearDiagnostics")}
          </button>
        </div>
      )}
    </div>
  );
}
