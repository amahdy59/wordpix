import { useState } from "react";
import type { Lesson, VocabularyItem } from "../data/lessons";
import { resolveAssetUrl } from "../../utils/assetUrl";
import { WordImage } from "../shared/WordImage";

export function GroupThumbnail({
  word,
  group,
  unitId,
  eager,
}: {
  word: VocabularyItem;
  group: Lesson;
  unitId: string;
  eager: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const focal = group.thumbnailFocalPoint ?? { x: 50, y: 50 };
  const position = `${Math.max(0, Math.min(100, focal.x))}% ${Math.max(0, Math.min(100, focal.y))}%`;
  if (failed || !word.img.startsWith("/word-images/")) {
    return (
      <WordImage
        word={word}
        sizePreset="thumb"
        altMode="decorative"
        loading={eager ? "eager" : "lazy"}
        width={112}
        height={96}
        className="size-full object-cover"
        objectPosition={position}
      />
    );
  }
  const source = (size: number) =>
    resolveAssetUrl(`/group-thumbnails/${unitId}/${group.id}-${size}.webp`);
  return (
    // Image failure is a media lifecycle event, not a pointer interaction.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <img
      src={source(160)}
      srcSet={`${source(160)} 160w, ${source(320)} 320w`}
      sizes="(min-width: 640px) 112px, (min-width: 380px) 96px, 80px"
      width={112}
      height={96}
      alt=""
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className="size-full object-cover"
      style={{ objectPosition: position }}
      onError={() => setFailed(true)}
    />
  );
}
