import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Wifi, WifiOff } from "lucide-react";
import { useI18n } from "../context/I18nContext";
import {
  getSyncQueueSummary,
  SYNC_QUEUE_CHANGED_EVENT,
  type SyncQueueSummary,
} from "../../lib/persistence/db";
import { retryFailedSyncOperations } from "../../lib/persistence/sync";

type NetworkState = "online" | "offline" | "restored";

const RESTORED_MESSAGE_MS = 6000;

/**
 * Gives every route a visible and announced connectivity state without
 * covering page content or keyboard focus. Learner changes remain local while
 * offline; the persistence layer performs synchronization after reconnection.
 */
export function NetworkStatusBanner() {
  const { t } = useI18n();
  const [networkState, setNetworkState] = useState<NetworkState>(() =>
    typeof navigator === "undefined" || navigator.onLine ? "online" : "offline"
  );
  const restoredTimer = useRef<ReturnType<typeof setTimeout>>();
  const [queue, setQueue] = useState<SyncQueueSummary>({
    pending: 0,
    failed: 0,
    retryableFailed: 0,
  });
  const [retryState, setRetryState] = useState<"idle" | "pending" | "error">("idle");

  useEffect(() => {
    const clearRestoredTimer = () => {
      if (restoredTimer.current) clearTimeout(restoredTimer.current);
      restoredTimer.current = undefined;
    };
    const handleOffline = () => {
      clearRestoredTimer();
      setNetworkState("offline");
    };
    const handleOnline = () => {
      clearRestoredTimer();
      setNetworkState("restored");
      restoredTimer.current = setTimeout(() => setNetworkState("online"), RESTORED_MESSAGE_MS);
    };
    const refreshQueue = () => {
      void getSyncQueueSummary()
        .then(setQueue)
        .catch(() => undefined);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    window.addEventListener(SYNC_QUEUE_CHANGED_EVENT, refreshQueue);
    refreshQueue();
    return () => {
      clearRestoredTimer();
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener(SYNC_QUEUE_CHANGED_EVENT, refreshQueue);
    };
  }, []);

  if (networkState === "online" && queue.failed === 0) return null;

  const isOffline = networkState === "offline";
  const hasSyncFailure = networkState === "online" && queue.failed > 0;
  const Icon = isOffline ? WifiOff : hasSyncFailure ? AlertTriangle : Wifi;
  const titleKey = isOffline
    ? "network.offlineTitle"
    : hasSyncFailure
      ? "network.syncFailedTitle"
      : "network.onlineTitle";
  const descriptionKey = isOffline
    ? "network.offlineDescription"
    : hasSyncFailure
      ? "network.syncFailedDescription"
      : "network.onlineDescription";
  const handleRetry = async () => {
    setRetryState("pending");
    try {
      const summary = await retryFailedSyncOperations();
      setQueue(summary);
      setRetryState(summary.retryableFailed > 0 ? "error" : "idle");
    } catch {
      setRetryState("error");
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-network-state={hasSyncFailure ? "sync-failed" : networkState}
      className={`mb-4 flex w-full items-start gap-3 rounded-2xl border p-4 shadow-wp-xs ${
        isOffline || hasSyncFailure
          ? "border-wp-amber/50 bg-wp-amber/10 text-foreground"
          : "border-wp-green/50 bg-wp-green/10 text-foreground"
      }`}
    >
      <Icon
        className={`mt-0.5 size-5 shrink-0 ${isOffline || hasSyncFailure ? "text-wp-amber-foreground" : "text-wp-green"}`}
        aria-hidden
      />
      <div className="min-w-0">
        <p className="font-sans text-sm font-black">{t(titleKey)}</p>
        <p className="mt-0.5 font-sans text-sm leading-relaxed text-muted-foreground">
          {t(descriptionKey, { count: queue.failed })}
        </p>
        {hasSyncFailure && queue.retryableFailed > 0 && (
          <button
            type="button"
            onClick={() => void handleRetry()}
            disabled={retryState === "pending"}
            aria-busy={retryState === "pending"}
            className="mt-3 min-h-11 rounded-xl border border-primary bg-wp-card px-4 font-sans text-sm font-bold text-primary shadow-wp-xs transition-colors hover:bg-secondary focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {t(retryState === "pending" ? "network.retrying" : "network.retrySync")}
          </button>
        )}
        {retryState === "error" && (
          <p role="alert" className="mt-2 font-sans text-sm font-semibold text-foreground">
            {t("network.retryFailed")}
          </p>
        )}
      </div>
    </div>
  );
}
