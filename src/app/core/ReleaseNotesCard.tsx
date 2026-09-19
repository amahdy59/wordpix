import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { resolveAssetUrl } from "../../utils/assetUrl";
import { useI18n } from "../context/I18nContext";

interface ReleaseNotes {
  version: string;
  notes: string[];
}

export function ReleaseNotesCard() {
  const { t } = useI18n();
  const [releaseData, setReleaseData] = useState<ReleaseNotes | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetch(resolveAssetUrl("/release-notes.json"))
      .then((res) => res.json())
      .then((data: ReleaseNotes) => {
        setReleaseData(data);
        const lastSeen = localStorage.getItem("wordpix_last_seen_version");
        if (data.version && lastSeen !== data.version) {
          setIsVisible(true);
        }
      })
      .catch((err) => console.error("Failed to load release notes", err));
  }, []);

  if (!isVisible || !releaseData) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("wordpix_last_seen_version", releaseData.version);
  };

  return (
    <aside className="relative mb-2 rounded-2xl border border-primary/20 bg-primary/5 p-3 pe-14 shadow-wp-xs">
      <div className="absolute inset-y-0 end-1 flex items-center">
        <button
          type="button"
          onClick={handleDismiss}
          className="text-primary hover:bg-primary/20 p-2 rounded-full transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]"
          aria-label={t("releaseNotes.dismiss")}
        >
          <X className="size-5" />
        </button>
      </div>
      <details className="group">
        <summary className="flex min-h-[44px] cursor-pointer list-none items-center gap-3 rounded-xl focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shrink-0">
            <Sparkles className="size-4" />
          </div>
          <span className="min-w-0 flex-1">
            <span className="block font-sans text-sm font-bold text-foreground">
              {t("releaseNotes.whatsNewInVersion", { version: releaseData.version })}
            </span>
            <span className="block text-xs font-medium text-muted-foreground group-open:hidden">
              {t("releaseNotes.showDetails")}
            </span>
          </span>
        </summary>
        <ul className="mt-2 flex flex-col gap-2 ps-11">
          {releaseData.notes.slice(0, 3).map((note, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-foreground/90 font-medium"
            >
              <div className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <p className="leading-relaxed">{note}</p>
            </li>
          ))}
        </ul>
      </details>
    </aside>
  );
}
