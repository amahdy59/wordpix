import { memo } from "react";
import { Home, Globe, RotateCcw, UserCircle } from "lucide-react";
import type { TabId, Action } from "../types";
import { HomeIndicator } from "./HomeIndicator";

interface Props {
  activeTab: TabId;
  dispatch: React.Dispatch<Action>;
}

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "home",     label: "Home",     icon: Home       },
  { id: "explore",  label: "Explore",  icon: Globe      },
  { id: "practice", label: "Practice", icon: RotateCcw  },
  { id: "profile",  label: "Profile",  icon: UserCircle },
];

export const BottomTabBar = memo(function BottomTabBar({ activeTab, dispatch }: Props) {
  return (
    <nav aria-label="Main navigation" className="bg-wp-card border-t border-border">
      <div className="flex items-start justify-around px-4 pt-2">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = id === activeTab;
          return (
            <button
              key={id}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              onClick={() => dispatch({ type: "GO", to: id })}
              className={`flex flex-col gap-1 items-center justify-center h-[52px] w-16 rounded-xl min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-safe:transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}
            >
              <Icon className="size-[22px]" aria-hidden />
              <span className="font-sans font-semibold text-[11px] leading-none">{label}</span>
            </button>
          );
        })}
      </div>
      <HomeIndicator />
    </nav>
  );
});
