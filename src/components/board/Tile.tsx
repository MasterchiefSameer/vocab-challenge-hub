import { memo } from "react";
import type { EvaluatedLetter, LetterStatus } from "@/types/game";

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
  const revealed = status === "correct" || status === "present" || status === "absent";
  const animClass = revealed && revealing && !reduceMotion ? "tile-flip" : popping && !reduceMotion ? "tile-pop" : "";
  const finalStatus: LetterStatus = revealed && revealing && !reduceMotion ? "tbd" : status;
  // delay reveal per tile
  const style = revealed && revealing && !reduceMotion ? { animationDelay: `${index * 300}ms` } : undefined;
  const colorStyle = revealed && revealing && !reduceMotion ? { animation: `tile-flip 500ms ease forwards`, animationDelay: `${index * 300}ms` } : undefined;

  // Two-phase reveal via background switch at midpoint:
  // We use a wrapper that flips, and switch class via setTimeout in CSS-only by delaying bg via separate keyframes.
  return (
    <div
      role="img"
      aria-label={letter ? `${letter}${revealed ? `, ${status}` : ""}` : "empty"}
      style={colorStyle ?? style}
      className={`relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center border-2 text-2xl sm:text-3xl font-bold uppercase ${STATUS_BG[finalStatus]} ${animClass}`}
    >
      {letter ?? ""}
    </div>
  );
});
