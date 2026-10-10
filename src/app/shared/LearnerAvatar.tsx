import { memo } from "react";
import { useI18n } from "../context/I18nContext";

/**
 * An accessible learner initial. No default portrait asset exists, so render
 * the initial directly instead of requesting a known missing image first.
 */
interface Props {
  /** Shown as an initial in the fallback, and used for the accessible name. */
  name?: string;
  className?: string;
}

export const LearnerAvatar = memo(function LearnerAvatar({
  name,
  className = "absolute inset-0 object-cover size-full",
}: Props) {
  const { t } = useI18n();
  const displayName = name?.trim() || t("app.learnerName");
  const initial = Array.from(displayName)[0].toUpperCase();

  return (
    <div
      role="img"
      aria-label={t("app.profileImage", { name: displayName })}
      className={`${className} flex items-center justify-center bg-secondary text-primary font-sans font-black`}
    >
      <span aria-hidden>{initial}</span>
    </div>
  );
});
