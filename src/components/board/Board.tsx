import { memo } from "react";
import { Row } from "./Row";
import { MAX_GUESSES, WORD_LENGTH } from "@/store/gameStore";
import type { EvaluatedLetter, GameStatus } from "@/types/game";

interface BoardProps {
  guesses: string[];
  evaluations: EvaluatedLetter[][];
  currentGuess: string;
  invalidShake: boolean;
  revealing: boolean;
  status: GameStatus;
  reduceMotion: boolean;
}

export const Board = memo(function Board({
  guesses,
  evaluations,
  currentGuess,
  invalidShake,
  revealing,
  status,
  reduceMotion,
}: BoardProps) {
  const rows = Array.from({ length: MAX_GUESSES }, (_, i) => {
    const isSubmitted = i < guesses.length;
    const isCurrent = i === guesses.length && status === "playing";
    const justSubmitted = revealing && i === guesses.length - 1;
    const isWinningRow = status === "won" && i === guesses.length - 1 && !revealing;
    return (
      <Row
        key={i}
        length={WORD_LENGTH}
        guess={isSubmitted ? guesses[i] : isCurrent ? currentGuess : ""}
        evaluation={isSubmitted ? evaluations[i] : undefined}
        shake={isCurrent && invalidShake}
        bounce={isWinningRow}
        revealing={justSubmitted}
        reduceMotion={reduceMotion}
        isCurrent={isCurrent}
      />
    );
  });

  return (
    <div
      role="grid"
      aria-label="Wordle board"
      aria-rowcount={MAX_GUESSES}
      className="flex flex-col gap-1.5 mx-auto"
    >
      {rows}
    </div>
  );
});
