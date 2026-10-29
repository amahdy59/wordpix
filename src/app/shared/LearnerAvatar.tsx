import { memo, useState } from "react";
import { resolveAssetUrl } from "../../utils/assetUrl";

/**
 * The learner's avatar, with a fallback that is not a broken image.
 *
 * Two screens pointed at `/images/core/learner-avatar.webp`, a file that does
 * not exist in `public/` — so the home dashboard and the profile both rendered
 * a broken image icon in their header, on the two screens a learner sees most.
 * The path was also root-absolute, which ignores the configured base and would
 * have 404ed under `/wordpix/` even if the file were added.
 *
 * Rather than invent artwork, this renders the learner's initial on the app's
 * own palette when the image is unavailable, and swaps in the real portrait
 * the moment one is committed at that path.
 */
interface Props {
  /** Shown as an initial in the fallback, and used for the accessible name. */
  name?: string;
  className?: string;
}

const AVATAR_SRC = "/images/core/learner-avatar.webp";

export const LearnerAvatar = memo(function LearnerAvatar({
  name = "Learner",
  className = "absolute inset-0 object-cover size-full",
}: Props) {
  const [failed, setFailed] = useState(false);
  const initial = name.trim().charAt(0).toUpperCase() || "L";

  if (failed) {
    return (
      <div
        role="img"
        aria-label={`${name} profile`}
        className={`${className} flex items-center justify-center bg-secondary text-primary font-sans font-black`}
      >
        <span aria-hidden>{initial}</span>
      </div>
    );
  }

  return (
    // onError is a load-failure signal, not a user interaction: the rule is
    // aimed at click and key handlers on non-interactive elements, and there
    // is no other way for an image to report that its source is unavailable.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <img
      alt={`${name} profile`}
      className={className}
      src={resolveAssetUrl(AVATAR_SRC)}
      loading="eager"
      onError={() => setFailed(true)}
    />
  );
});
