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
      className="hidden lg:flex flex-col items-center xl:items-stretch bg-wp-card border-e border-border
                 w-[80px] xl:w-[240px] shrink-0 py-6 xl:py-8 justify-between select-none z-30 transition-all duration-300"
      aria-label="Sidebar navigation"
    >
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />

      {/* Top Brand Logo */}
      <div className="flex flex-col items-center xl:items-stretch xl:px-6 gap-6">
        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "home" })}
          title="WordPix Home"
          aria-label="WordPix Home"
          className="flex items-center justify-center xl:justify-start gap-3 w-11 xl:w-full rounded-2xl xl:rounded-xl focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary transition-all group"
        >
          <div className="size-11 rounded-2xl bg-primary flex items-center justify-center shadow-wp-xs group-hover:opacity-90 transition-all shrink-0">
            <BookOpen className="size-5 text-primary-foreground" />
          </div>
          <span className="hidden xl:block font-sans font-bold text-foreground tracking-tight text-xl">
            WordPix
          </span>
        </button>

        {/* Navigation Items */}
        <nav
          className="flex flex-col items-center xl:items-stretch gap-2"
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
                  relative size-12 xl:h-12 xl:w-full xl:px-4 rounded-xl flex items-center justify-center xl:justify-start
                  focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2
                  focus-visible:outline-primary transition-all group
                  ${isActive
                    ? "bg-secondary text-primary border border-primary/20 shadow-wp-xs xl:shadow-none xl:border-transparent xl:bg-primary/10"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }
                `}
              >
                <Icon className="size-5 shrink-0" aria-hidden />

                <span className="hidden xl:block font-sans font-semibold text-sm ms-3">
                  {label}
                </span>

                {/* Tooltip on hover (only on md, hidden on xl) */}
                <span className="xl:hidden absolute start-full ms-3 px-2.5 py-1 bg-wp-panel text-wp-text-on-panel font-sans text-xs font-semibold rounded-lg shadow-wp-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                  {label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Settings, Theme Toggle & Profile Shortcut */}
      <div className="flex flex-col items-center xl:items-stretch gap-3 xl:px-4">
        <button
          type="button"
          onClick={() => setShowSettingsModal(true)}
          title="Settings & Accessibility"
          aria-label="Settings & Accessibility"
          className="size-11 xl:h-12 xl:w-full xl:px-4 rounded-full xl:rounded-xl border border-border xl:border-transparent flex items-center justify-center xl:justify-start text-muted-foreground hover:text-foreground hover:bg-muted transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary group"
        >
          <Sliders className="size-5 shrink-0" />
          <span className="hidden xl:block font-sans font-semibold text-sm ms-3 group-hover:text-foreground transition-colors">
            Settings
          </span>
        </button>
        
        <ThemeToggle compact="responsive" />
        
        <button
          type="button"
          onClick={() => dispatch({ type: "GO", to: "profile" })}
          title="Learner Profile"
          aria-label="Learner Profile"
          className="size-11 xl:h-12 xl:w-full xl:px-4 rounded-full xl:rounded-xl border border-border xl:border-transparent flex items-center justify-center xl:justify-start text-muted-foreground hover:text-foreground hover:bg-muted transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary group"
        >
          <UserCircle className="size-6 shrink-0" />
          <span className="hidden xl:block font-sans font-semibold text-sm ms-3 group-hover:text-foreground transition-colors">
            Profile
          </span>
        </button>
      </div>
    </aside>
  );
});
