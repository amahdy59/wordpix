import type { ReactNode } from "react";

/** Give long translated actions their own row on narrow phones. */
export function CourseActionFooter({ children }: { children: ReactNode }) {
  return (
    <div className="mt-3 flex flex-wrap items-stretch justify-between gap-3 max-[359px]:flex-col [&>button]:min-w-0 [&>button]:max-w-full [&>button]:whitespace-normal [&>button]:leading-relaxed [&>button>span]:min-w-0 [&>button>span]:break-words [&>button>svg]:shrink-0">
      {children}
    </div>
  );
}
