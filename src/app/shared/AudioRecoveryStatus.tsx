import { useSyncExternalStore } from "react";
import { useI18n } from "../../i18n";

function subscribe(listener: () => void) {
  window.addEventListener("online", listener);
  window.addEventListener("offline", listener);
  return () => {
    window.removeEventListener("online", listener);
    window.removeEventListener("offline", listener);
  };
}

/** Connectivity is a recovery hint; cached audio can still play offline. */
export function useAudioRecoveryMessage(failed: boolean, supported = true) {
  const { t } = useI18n();
  const online = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true
  );
  return !supported
    ? t("audioRecovery.unsupported")
    : failed
      ? t(online ? "audioRecovery.failed" : "audioRecovery.offline")
      : "";
}

export function AudioRecoveryStatus({
  failed,
  supported = true,
}: {
  failed: boolean;
  supported?: boolean;
}) {
  const message = useAudioRecoveryMessage(failed, supported);
  return (
    <p
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={message ? "text-sm leading-relaxed text-foreground" : "sr-only"}
    >
      {message}
    </p>
  );
}
