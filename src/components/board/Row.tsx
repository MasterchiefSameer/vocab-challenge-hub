import { memo } from "react";
import { Tile } from "./Tile";
import type { EvaluatedLetter } from "@/types/game";

interface RowProps {
  guess?: string;
  evaluation?: EvaluatedLetter[];
  length: number;
  shake?: boolean;
  bounce?: boolean;
  revealing?: boolean;
  reduceMotion?: boolean;
  isCurrent?: boolean;
}

export const Row = memo(function Row({
  guess = "",
  evaluation,
  length,
  shake,
  bounce,
  revealing,
  reduceMotion,
  isCurrent,
}: RowProps) {
  const tiles = Array.from({ length }, (_, i) => {
    const letter = evaluation?.[i]?.letter ?? guess[i];
    const status = evaluation?.[i]?.status ?? (letter ? "tbd" : "empty");
    const popping = isCurrent && i === guess.length - 1;
    return (
      <Tile
        key={i}
        index={i}
        letter={letter}
        status={status}
        revealing={revealing}
        reduceMotion={reduceMotion}
        popping={popping}
      />
    );
  });

  return (
    <div
      className={`flex gap-1.5 justify-center ${shake ? "row-shake" : ""} ${bounce && !reduceMotion ? "tile-bounce" : ""}`}
      style={bounce && !reduceMotion ? { animationDelay: "100ms" } : undefined}
    >
      {tiles}
    </div>
  );
});
