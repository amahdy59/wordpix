import { lazy, memo, Suspense, useState } from "react";
import { BookOpen, Sliders } from "lucide-react";
import type { TabId, Action } from "../types";
import { ThemeToggle } from "./ThemeToggle";
import { TABS } from "./BottomTabBar";
import { useI18n } from "../context/I18nContext";

const SettingsModal = lazy(() =>
  import("../core/SettingsModal").then((m) => ({ default: m.SettingsModal }))
);

interface Props {
  activeTab: TabId;
  dispatch: React.Dispatch<Action>;
}

export const SidebarNav = memo(function SidebarNav({ activeTab, dispatch }: Props) {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const { t } = useI18n();

  return (
    <aside
      className="hidden lg:flex flex-col items-stretch bg-wp-card border-e border-border
                 w-[240px] shrink-0 h-dvh sticky top-0 start-0 overflow-y-auto py-8 justify-between select-none z-30"
      aria-label="Sidebar navigation"
    >
      {showSettingsModal && (
        <Suspense fallback={null}>
          <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
        </Suspense>
      )}

      {/* Top Brand Logo */}
      <div className="flex flex-col items-stretch px-6 gap-6">
        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "home" })}
          title="WordPix Home"
          aria-label="WordPix Home"
          className="flex w-full items-center justify-start gap-3 rounded-xl focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary transition-all group"
        >
          <div className="size-11 rounded-2xl bg-primary flex items-center justify-center shadow-wp-xs group-hover:opacity-90 transition-all shrink-0">
            <BookOpen className="size-5 text-primary-foreground" />
          </div>
          <span className="font-sans font-bold text-foreground tracking-tight text-xl">
            {`WordPix`}
          </span>
        </button>

        {/* Navigation Items */}
        <nav className="flex flex-col items-stretch gap-2" aria-label={t("nav.label")}>
          {TABS.map(({ id, labelKey, icon: Icon }) => {
            const isActive = activeTab === id;
            const label = t(labelKey);
            return (
              <button
                key={id}
                type="button"
                onClick={() => dispatch({ type: "GO", to: id })}
                aria-current={isActive ? "page" : undefined}
                aria-label={label}
                title={label}
                className={`
                  relative h-12 w-full px-4 rounded-xl flex items-center justify-start
                  focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2
                  focus-visible:outline-primary transition-all group
                  ${
                    isActive
                      ? "bg-primary/10 text-primary border border-transparent"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }
                `}
              >
                <Icon className="size-5 shrink-0" aria-hidden />

                <span className="font-sans font-semibold text-sm ms-3">{label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Utilities stay separate from the primary navigation. */}
      <div className="flex flex-col items-stretch gap-3 px-4">
        <button
          type="button"
          onClick={() => setShowSettingsModal(true)}
          title="Settings & Accessibility"
          aria-label="Settings & Accessibility"
          className="h-12 w-full px-4 rounded-xl border border-transparent flex items-center justify-start text-muted-foreground hover:text-foreground hover:bg-muted transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary group"
        >
          <Sliders className="size-5 shrink-0" />
          <span className="font-sans font-semibold text-sm ms-3 group-hover:text-foreground transition-colors">
            {t("nav.settings")}
          </span>
        </button>

        <ThemeToggle compact="responsive" />
      </div>
    </aside>
  );
});
