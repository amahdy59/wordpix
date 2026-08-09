import { memo } from "react";
import { Home, Compass, RotateCcw, UserCircle } from "lucide-react";
import type { TabId, Action } from "../types";

import { useI18n } from "../context/I18nContext";

interface Props {
  activeTab: TabId;
  dispatch: React.Dispatch<Action>;
}

/** Labels come from the i18n bundle so the tab bar mirrors the sidebar exactly. */
export const TABS: { id: TabId; labelKey: string; icon: React.ElementType }[] = [
  { id: "home",     labelKey: "nav.home",     icon: Home       },
  { id: "explore",  labelKey: "nav.explore",  icon: Compass    },
  { id: "practice", labelKey: "nav.practice", icon: RotateCcw  },
  { id: "profile",  labelKey: "nav.profile",  icon: UserCircle },
];

export const BottomTabBar = memo(function BottomTabBar({ activeTab, dispatch }: Props) {
  const { t } = useI18n();

  return (
    <nav aria-label={t("nav.label")} className="bg-background/85 backdrop-blur-xl border-t border-border/50 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-start justify-around px-2 pt-2 pb-1">
        {TABS.map(({ id, labelKey, icon: Icon }) => {
          const isActive = id === activeTab;
          const label = t(labelKey);
          return (
            <button
              key={id}
              type="button"
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              onClick={() => dispatch({ type: "GO", to: id })}
              className={`flex flex-col gap-1 items-center justify-center h-14 w-[72px] rounded-xl min-h-[48px] min-w-[48px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-safe:transition-colors ${isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted/50"}`}
            >
              <Icon className="size-[22px]" aria-hidden />
              <span className="font-sans font-bold text-[11px] leading-none">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
});
