import { useState, type ImgHTMLAttributes } from "react";
import { resolveAssetUrl } from "../../utils/assetUrl";

export interface QuestionImageMedia {
  imagePath: string;
  imageAlt: string;
  imageFallbacks?: ReadonlyArray<{ imagePath: string; imageAlt: string }>;
}

/** Fallbacks must represent the same content; each retains its own description. */
export function QuestionImage({
  media,
  onExhausted,
  ...props
}: {
  media: QuestionImageMedia;
  onExhausted: () => void;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "onError">) {
  const [failed, setFailed] = useState<ReadonlySet<string>>(() => new Set());
  const candidates = [media, ...(media.imageFallbacks ?? [])].filter(
    (candidate, index, all) =>
      all.findIndex((item) => item.imagePath === candidate.imagePath) === index
  );
  const current = candidates.find((candidate) => !failed.has(candidate.imagePath));
  if (!current) return null;
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <img
      {...props}
      key={current.imagePath}
      src={resolveAssetUrl(current.imagePath)}
      alt={current.imageAlt}
      onError={() => {
        const next = new Set(failed).add(current.imagePath);
        setFailed(next);
        if (candidates.every((candidate) => next.has(candidate.imagePath))) onExhausted();
      }}
    />
  );
}
