import { useState, type ImgHTMLAttributes } from "react";
import { resolveAssetUrl } from "../../utils/assetUrl";
import { ImageReportButton } from "./ImageReportButton";
import type { ImageReportContext } from "../media/imageReports";

export interface QuestionImageMedia {
  imagePath: string;
  imageAlt: string;
  imageFallbacks?: ReadonlyArray<{ imagePath: string; imageAlt: string }>;
}

/** Fallbacks must represent the same content; each retains its own description. */
export function QuestionImage({
  media,
  onExhausted,
  reportContext,
  ...props
}: {
  media: QuestionImageMedia;
  onExhausted: () => void;
  reportContext?: ImageReportContext;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "onError">) {
  const [failed, setFailed] = useState<ReadonlySet<string>>(() => new Set());
  const candidates = [media, ...(media.imageFallbacks ?? [])].filter(
    (candidate, index, all) =>
      all.findIndex((item) => item.imagePath === candidate.imagePath) === index
  );
  const current = candidates.find((candidate) => !failed.has(candidate.imagePath));
  if (!current) return null;
  return (
    <>
      {/* onError is a media lifecycle event, not a user interaction. */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <img
        decoding="async"
        loading="eager"
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
      <ImageReportButton
        imagePath={current.imagePath}
        context={reportContext ?? { kind: "illustration", text: current.imageAlt }}
      />
    </>
  );
}
