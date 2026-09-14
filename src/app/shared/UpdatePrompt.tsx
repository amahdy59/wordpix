import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, DownloadCloud, X } from "lucide-react";
import { useI18n } from "../context/I18nContext";
import { PrimaryButton } from "./PrimaryButton";

interface UpdateEventDetail {
  worker: ServiceWorker;
  notes: string[];
}

export function UpdatePrompt() {
  const { t } = useI18n();
  const [updateData, setUpdateData] = useState<UpdateEventDetail | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<UpdateEventDetail>;
      setUpdateData(customEvent.detail);
    };

    window.addEventListener("wp-update-available", handleUpdate);
    return () => window.removeEventListener("wp-update-available", handleUpdate);
  }, []);

  const handleUpdate = () => {
    if (!updateData?.worker) return;
    setIsUpdating(true);

    // Listen for the controller change, meaning the new worker has taken over
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });

    // Post message to the waiting worker to activate immediately
    updateData.worker.postMessage({ type: "SKIP_WAITING" });
  };

  const handleDismiss = () => {
    setUpdateData(null);
  };

  return (
    <AnimatePresence>
      {updateData && (
        <div className="fixed bottom-20 md:bottom-6 end-6 z-50 pointer-events-none flex justify-end">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-wp-card border border-primary/20 p-5 rounded-3xl shadow-2xl w-full max-w-sm pointer-events-auto relative"
          >
            <button
              onClick={handleDismiss}
              className="absolute top-2 end-2 text-muted-foreground hover:text-foreground transition-colors p-3 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={t("updatePrompt.dismiss")}
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-full bg-wp-blue/10 flex items-center justify-center shrink-0">
                <DownloadCloud className="size-5 text-wp-blue" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-foreground text-lg leading-tight">
                  {t("updatePrompt.title")}
                </h3>
                <p className="font-sans text-muted-foreground text-xs mt-0.5">
                  {t("updatePrompt.ready")}
                </p>
              </div>
            </div>

            <div className="bg-secondary rounded-2xl p-4 mb-5 border border-border">
              <div className="flex items-center gap-2 mb-2 text-wp-amber">
                <Sparkles className="size-4" />
                <span className="font-sans font-bold text-xs uppercase tracking-wider">
                  {t("updatePrompt.whatsNew")}
                </span>
              </div>
              <ul className="flex flex-col gap-2">
                {updateData.notes.slice(0, 3).map((note, idx) => (
                  <li
                    key={idx}
                    className="font-sans text-sm text-foreground flex items-start gap-2"
                  >
                    <span className="text-wp-blue shrink-0 mt-0.5">•</span>
                    <span className="leading-tight">{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            <PrimaryButton
              label={isUpdating ? t("updatePrompt.refreshing") : t("updatePrompt.updateRefresh")}
              onClick={handleUpdate}
              disabled={isUpdating}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
