import { useState, type ImgHTMLAttributes } from "react";
import { resolveAssetUrl } from "../../utils/assetUrl";
import { ImageReportButton } from "./ImageReportButton";
import type { ImageReportContext } from "../media/imageReports";

export interface QuestionImageMedia {
  imagePath: string;
  imageAlt: string;
  responsiveSources?: ReadonlyArray<{ url: string; width: number }>;
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
  const [responsiveFailed, setResponsiveFailed] = useState(false);
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
        srcSet={
          current === media && !responsiveFailed && media.responsiveSources?.length
            ? media.responsiveSources
                .map((source) => `${resolveAssetUrl(source.url)} ${source.width}w`)
                .join(", ")
            : undefined
        }
        sizes={media.responsiveSources?.length ? "(max-width: 640px) 100vw, 640px" : undefined}
        alt={current.imageAlt}
        onError={() => {
          // A missing offline/responsive variant must retry the retained original
          // before moving to another image or exhausting the question's support.
          if (current === media && media.responsiveSources?.length && !responsiveFailed) {
            setResponsiveFailed(true);
            return;
          }
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
