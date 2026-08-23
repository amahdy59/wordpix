import { memo } from "react";

interface SkeletonProps {
  className?: string;
}

export const Skeleton = memo(function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`animate-pulse bg-muted rounded-xl ${className}`} aria-hidden="true" />;
});
