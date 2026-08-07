import { memo, useState } from "react";
import { UserCircle, BookOpen, Sliders } from "lucide-react";
import type { TabId, Action } from "../types";
import { ThemeToggle } from "./ThemeToggle";
import { SettingsModal } from "../core/SettingsModal";
import { TABS } from "./BottomTabBar";
import { useI18n } from "../context/I18nContext";

interface Props {
  activeTab: TabId;
  dispatch: React.Dispatch<Action>;
}

export const SidebarNav = memo(function SidebarNav({ activeTab, dispatch }: Props) {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const { t } = useI18n();

  return (
    <aside
      className="hidden md:flex flex-col items-center bg-wp-card border-e border-border
                 w-[80px] shrink-0 py-4 justify-between select-none z-30"
      aria-label="Sidebar navigation"
    >
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />

      {/* Top Brand Logo */}
      <div className="flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "home" })}
          title="WordPix Home"
          aria-label="WordPix Home"
          className="size-11 rounded-2xl bg-primary flex items-center justify-center shadow-wp-xs
                     focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary
                     hover:opacity-90 transition-all"
        >
          <BookOpen className="size-5 text-primary-foreground" />
        </button>

        {/* Navigation Items */}
        {/* Shares TABS with BottomTabBar: the two navs previously carried
            different wording for the same destinations ("Lessons & Worlds" vs
            "Lessons", "Daily Review" vs "Review"). */}
        <nav
          className="flex flex-col items-center gap-2 mt-4"
          aria-label={t("nav.label")}
        >
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
                  relative size-12 rounded-xl flex items-center justify-center
                  focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2
                  focus-visible:outline-primary transition-all group
                  ${isActive
                    ? "bg-secondary text-primary border border-primary/20 shadow-wp-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }
                `}
              >
                <Icon className="size-5 shrink-0" aria-hidden />

                {/* Tooltip on hover */}
                <span className="absolute start-full ms-3 px-2.5 py-1 bg-slate-900 text-white font-sans text-xs font-semibold rounded-lg shadow-wp-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                  {label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Settings, Theme Toggle & Profile Shortcut */}
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => setShowSettingsModal(true)}
          title="Settings & Accessibility"
          aria-label="Settings & Accessibility"
          className="size-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          <Sliders className="size-5" />
        </button>
        <ThemeToggle />
        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "profile" })}
          title="Learner Profile"
          aria-label="Learner Profile"
          className="size-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          <UserCircle className="size-6" />
        </button>
      </div>
    </aside>
  );
});
