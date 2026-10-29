import { ArrowLeft, History } from "lucide-react";
import type { Action } from "../types";
import { useI18n } from "../context/I18nContext";
import releaseNotes from "../data/releaseNotes.json";

export function ReleaseNotesPage({ dispatch }: { dispatch: React.Dispatch<Action> }) {
  const { t, interfaceLang } = useI18n();
  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="wp-container-content wp-layout-gutter space-y-6 py-5 sm:py-8">
        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "profile" })}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-base font-semibold text-foreground hover:bg-secondary focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <ArrowLeft className="size-5 rtl:rotate-180" aria-hidden />
          {t("releaseNotes.backToProfile")}
        </button>
        <header className="space-y-3">
          <History className="size-8 text-primary" aria-hidden />
          <h1 className="text-3xl font-bold text-foreground">{t("releaseNotes.pageTitle")}</h1>
          <p className="max-w-prose text-base leading-relaxed text-muted-foreground">
            {t("releaseNotes.pageDescription")}
          </p>
        </header>
        <ol className="space-y-5" aria-label={t("releaseNotes.historyLabel")}>
          {releaseNotes.releases.map((release, index) => (
            <li key={release.id}>
              <article
                aria-labelledby={`release-${release.id}`}
                className="rounded-2xl border border-border bg-card p-5 sm:p-7"
              >
                <div className="mb-3 flex flex-wrap items-center gap-3 text-sm font-semibold text-muted-foreground">
                  {"date" in release && release.date ? (
                    <time dateTime={release.date}>
                      {new Intl.DateTimeFormat(interfaceLang, {
                        dateStyle: "long",
                        timeZone: "UTC",
                      }).format(new Date(release.date + "T00:00:00Z"))}
                    </time>
                  ) : (
                    <span>{t("releaseNotes.earlierRelease")}</span>
                  )}
                  {"version" in release && release.version && (
                    <span dir="ltr">
                      {t("releaseNotes.versionLabel", { version: release.version })}
                    </span>
                  )}
                  {index === 0 && (
                    <span className="rounded-full bg-secondary px-3 py-1 text-primary">
                      {t("releaseNotes.latest")}
                    </span>
                  )}
                </div>
                <h2 id={`release-${release.id}`} className="text-xl font-bold text-foreground">
                  {release.title[interfaceLang]}
                </h2>
                <ul className="mt-4 space-y-4">
                  {release.changes.map((change) => (
                    <li
                      key={change.id}
                      className="grid gap-2 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-4"
                    >
                      <span className="text-sm font-bold text-primary">
                        {t(`releaseNotes.categories.${change.category}`)}
                      </span>
                      <p className="max-w-prose text-base leading-relaxed text-foreground">
                        {change[interfaceLang]}
                      </p>
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
