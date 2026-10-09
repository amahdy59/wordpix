import { useEffect, useRef } from "react";

/** Keep sticky quiz controls below the rail, including wrapped Arabic labels and zoom. */
export function useCourseNavigationHeight() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const rail = ref.current?.closest<HTMLElement>(".wp-course-sticky");
    const session = rail?.closest<HTMLElement>(".wp-lesson-session");
    if (!rail || !session) return;
    const update = () =>
      session.style.setProperty(
        "--wp-course-nav-height",
        `${rail.getBoundingClientRect().height}px`
      );
    update();
    const observer = new ResizeObserver(update);
    observer.observe(rail);
    return () => {
      observer.disconnect();
      session.style.removeProperty("--wp-course-nav-height");
    };
  }, []);
  return ref;
}
