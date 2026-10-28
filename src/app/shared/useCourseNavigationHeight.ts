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
        `${getComputedStyle(rail).position === "sticky" ? rail.getBoundingClientRect().height : 0}px`
      );
    update();
    const observer = new ResizeObserver(update);
    observer.observe(rail);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
      session.style.removeProperty("--wp-course-nav-height");
    };
  }, []);
  return ref;
}
