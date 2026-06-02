import { memo } from "react";
import type { LetterStatus } from "@/types/game";

interface TileProps {
  letter?: string;
  status: LetterStatus;
  index: number;
  revealing?: boolean;
  reduceMotion?: boolean;
  popping?: boolean;
}

const STATUS_BG: Record<LetterStatus, string> = {
  empty: "bg-tile-empty border-border",
  tbd: "bg-tile-filled border-muted-foreground/60 text-foreground",
  correct: "bg-tile-correct border-tile-correct text-tile-text",
  present: "bg-tile-present border-tile-present text-tile-text",
  absent: "bg-tile-absent border-tile-absent text-tile-text",
};

export const Tile = memo(function Tile({
  letter,
  status,
  index,
  revealing,
  reduceMotion,
  popping,
}: TileProps) {
  const isResolved = status === "correct" || status === "present" || status === "absent";
  const animClass = isResolved && revealing && !reduceMotion
    ? "tile-flip"
    : popping && !reduceMotion
    ? "tile-pop"
    : "";
  const style: React.CSSProperties | undefined = isResolved && revealing && !reduceMotion
    ? { animationDelay: `${index * 300}ms`, animationFillMode: "forwards" }
    : undefined;
  return (
    <div
      role="img"
      aria-label={letter ? `${letter}${isResolved ? `, ${status}` : ""}` : "empty"}
      style={style}
      className={`flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center border-2 text-2xl sm:text-3xl font-bold uppercase ${STATUS_BG[status]} ${animClass}`}
    >
      {letter ?? ""}
    </div>
  );
});
