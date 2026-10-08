import { memo } from "react";

/** Reserve only the device's actual safe area; the OS owns its home indicator. */
export const HomeIndicator = memo(function HomeIndicator() {
  return <div aria-hidden className="h-[env(safe-area-inset-bottom)] shrink-0" />;
});
