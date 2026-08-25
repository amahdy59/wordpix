import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { resolveAssetUrl } from "../../utils/assetUrl";

interface ReleaseNotes {
  version: string;
  notes: string[];
}

export function ReleaseNotesCard() {
  const [releaseData, setReleaseData] = useState<ReleaseNotes | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Root-absolute ignores the configured base, so this 404ed under
    // /wordpix/ and every load logged a JSON parse error on the 404 body.
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
    <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 lg:p-5 shadow-wp-xs relative overflow-hidden mb-6">
      <div className="absolute top-0 end-0 p-2">
        <button
          onClick={handleDismiss}
          className="text-primary hover:bg-primary/20 p-2 rounded-full transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]"
          aria-label="Dismiss release notes"
        >
          <X className="size-5" />
        </button>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
          <Sparkles className="size-4" />
        </div>
        <h3 className="font-sans font-bold text-foreground text-lg">
          What's New in v{releaseData.version}
        </h3>
      </div>
      <ul className="flex flex-col gap-2">
        {releaseData.notes.slice(0, 3).map((note, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-foreground/90 font-medium">
            <div className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
            <p className="leading-relaxed">{note}</p>
          </li>
        ))}
      </ul>
      <button
        onClick={handleDismiss}
        className="mt-4 bg-primary text-primary-foreground font-bold text-sm px-4 py-3 min-h-[44px] rounded-xl hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary w-full sm:w-auto"
      >
        Got it!
      </button>
    </div>
  );
}
