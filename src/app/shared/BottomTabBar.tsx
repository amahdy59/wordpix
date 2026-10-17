import { memo } from "react";
import { Home, Route, Library, Dumbbell, UserCircle } from "lucide-react";
import type { TabId, Action } from "../types";

import { useI18n } from "../context/I18nContext";
import { triggerHaptic } from "../../utils/haptics";

interface Props {
  activeTab: TabId;
  dispatch: React.Dispatch<Action>;
}

/** Labels come from the i18n bundle so the tab bar mirrors the sidebar exactly. */
export const TABS: { id: TabId; labelKey: string; icon: React.ElementType }[] = [
  { id: "home", labelKey: "nav.home", icon: Home },
  { id: "learn", labelKey: "nav.learn", icon: Route },
  { id: "practice", labelKey: "nav.practice", icon: Dumbbell },
  { id: "library", labelKey: "nav.library", icon: Library },
  { id: "profile", labelKey: "nav.profile", icon: UserCircle },
];

export const BottomTabBar = memo(function BottomTabBar({ activeTab, dispatch }: Props) {
  const { t } = useI18n();

  return (
    <nav
      aria-label={t("nav.label")}
      className="bg-background/95 backdrop-blur-xl border-t border-border shadow-wp-xs pb-[env(safe-area-inset-bottom)] lg:hidden select-none"
    >
      <div className="wp-bottom-tabs items-stretch gap-0.5 px-1 py-1">
        {TABS.map(({ id, labelKey, icon: Icon }) => {
          const isActive = id === activeTab;
          const label = t(labelKey);
          return (
            <button
              key={id}
              type="button"
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              onClick={() => {
                triggerHaptic("selection");
                dispatch({ type: "GO", to: id });
              }}
              className={`group flex min-w-0 w-full flex-col items-center justify-center gap-0.5 rounded-xl min-h-[56px] py-1 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer motion-safe:transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div
                className={`relative flex items-center justify-center w-12 max-w-full h-7 rounded-full motion-safe:transition-all ${
                  isActive
                    ? "bg-secondary text-primary shadow-wp-xs"
                    : "text-muted-foreground group-hover:text-foreground group-hover:bg-muted/40"
                }`}
              >
                <Icon className="size-5" aria-hidden />
              </div>
              <span
                className={`font-sans text-xs leading-tight text-center break-words max-w-full px-0.5 ${
                  isActive ? "font-bold text-primary" : "font-semibold text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
});
