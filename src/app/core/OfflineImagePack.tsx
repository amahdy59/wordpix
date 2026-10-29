import { useEffect, useRef, useState } from "react";
import { useI18n } from "../context/I18nContext";
import { Button } from "../shared/Button";
import {
  downloadImagePack,
  inspectImagePack,
  removeImagePack,
  ImagePackError,
  ESTIMATED_IMAGE_BYTES,
  type ImagePackManifest,
  type ImagePackReadiness,
} from "../media/offlineImagePacks";

type PackState =
  | { status: "planning" }
  | { status: "unavailable" }
  | {
      status: "idle" | "downloading" | "ready" | "cancelled" | "error" | "removing";
      manifest: ImagePackManifest;
      readiness: ImagePackReadiness;
      error?: "storage" | "download";
    };
export function OfflineImagePack({ unitId }: { unitId: string }) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  return (
    <details
      className="border-t border-border pt-3"
      onToggle={(event) => setExpanded(event.currentTarget.open)}
    >
      <summary className="min-h-11 cursor-pointer rounded-xl px-2 py-3 font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
        {t("imageQuality.packTitle")}
      </summary>
      {expanded && <OfflineImagePackContents key={unitId} unitId={unitId} />}
    </details>
  );
}
function OfflineImagePackContents({ unitId }: { unitId: string }) {
  const { t } = useI18n();
  const [state, setState] = useState<PackState>({ status: "planning" });
  const operation = useRef<AbortController | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    operation.current = controller;
    void import("../media/unitImageManifest")
      .then(async ({ getUnitImageManifest }) => {
        if (!("caches" in window) || !navigator.serviceWorker?.controller)
          throw Error("Unavailable");
        const manifest = await getUnitImageManifest(unitId);
        const readiness = await inspectImagePack(manifest);
        if (!controller.signal.aborted)
          setState({ status: readiness.ready ? "ready" : "idle", manifest, readiness });
      })
      .catch(() => {
        if (!controller.signal.aborted) setState({ status: "unavailable" });
      });
    return () => {
      controller.abort();
      operation.current?.abort();
      operation.current = null;
    };
  }, [unitId, attempt]);
  const start = async () => {
    if (!("manifest" in state)) return;
    const { manifest, readiness } = state;
    const controller = new AbortController();
    operation.current = controller;
    setState({ status: "downloading", manifest, readiness });
    try {
      await downloadImagePack(manifest, {
        signal: controller.signal,
        onProgress: (cached, total) => {
          if (!controller.signal.aborted)
            setState({
              status: "downloading",
              manifest,
              readiness: { cached, total, ready: false, bytes: 0 },
            });
        },
      });
      const result = await inspectImagePack(manifest);
      if (operation.current === controller)
        setState({ status: "ready", manifest, readiness: result });
    } catch (error) {
      if (operation.current !== controller) return;
      const result = await inspectImagePack(manifest).catch(() => readiness);
      if (operation.current === controller)
        setState({
          status: controller.signal.aborted ? "cancelled" : "error",
          manifest,
          readiness: result,
          error:
            error instanceof ImagePackError && error.code === "storage" ? "storage" : "download",
        });
    }
  };
  return (
    <section
      className="space-y-3 pt-2"
      aria-label={t("imageQuality.packTitle")}
      aria-busy={state.status === "downloading" || state.status === "removing"}
    >
      <p className="text-sm leading-relaxed">{t("imageQuality.packDescription")}</p>
      {"manifest" in state && (
        <>
          <p className="text-sm">
            {t("imageQuality.packEstimate", {
              count: state.manifest.urls.length,
              amount: Math.ceil((state.manifest.urls.length * ESTIMATED_IMAGE_BYTES) / 1048576),
            })}
          </p>
          <p className="text-sm">
            {t("imageQuality.packCount", {
              cached: state.readiness.cached,
              total: state.readiness.total,
            })}
          </p>
          {state.status === "ready" && (
            <p className="text-sm">
              {t("imageQuality.packSavedSize", {
                amount: (state.readiness.bytes / 1048576).toFixed(1),
              })}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            {state.status !== "ready" && (
              <Button
                disabled={state.status === "downloading" || state.status === "removing"}
                onClick={() => void start()}
              >
                {t(
                  state.status === "error" || state.status === "cancelled"
                    ? "action.retry"
                    : "imageQuality.downloadImages"
                )}
              </Button>
            )}
            {state.status === "downloading" && (
              <Button variant="outline" onClick={() => operation.current?.abort()}>
                {t("action.cancel")}
              </Button>
            )}
            {state.readiness.cached > 0 && (
              <Button
                variant="outline"
                disabled={state.status === "downloading" || state.status === "removing"}
                onClick={() => {
                  const previous = state;
                  setState({ ...state, status: "removing" });
                  void removeImagePack(unitId)
                    .then(() =>
                      setState({
                        status: "idle",
                        manifest: state.manifest,
                        readiness: {
                          cached: 0,
                          total: state.manifest.urls.length,
                          ready: false,
                          bytes: 0,
                        },
                      })
                    )
                    .catch(() => setState({ ...previous, status: "error", error: "storage" }));
                }}
              >
                {t("imageQuality.removeImages")}
              </Button>
            )}
          </div>
          {state.status === "downloading" && (
            <progress
              max={state.readiness.total}
              value={state.readiness.cached}
              aria-label={t("imageQuality.packTitle")}
              className="w-full accent-primary"
            />
          )}
        </>
      )}
      <p role={state.status === "error" ? "alert" : "status"} className="text-sm">
        {t(
          state.status === "error" && state.error === "storage"
            ? "imageQuality.packStorageError"
            : `imageQuality.pack_${state.status}`
        )}
      </p>
      {state.status === "unavailable" && (
        <Button
          variant="outline"
          onClick={() => {
            setState({ status: "planning" });
            setAttempt((value) => value + 1);
          }}
        >
          {t("action.retry")}
        </Button>
      )}
    </section>
  );
}
