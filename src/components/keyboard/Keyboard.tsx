import { memo } from "react";
import type { LetterStatus } from "@/types/game";
import { Delete } from "lucide-react";

const ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

const COLOR: Record<LetterStatus, string> = {
  empty: "bg-key-bg text-key-text",
  tbd: "bg-key-bg text-key-text",
  correct: "bg-tile-correct text-tile-text",
  present: "bg-tile-present text-tile-text",
  absent: "bg-tile-absent text-tile-text",
};

interface KeyboardProps {
  statuses: Record<string, LetterStatus>;
  onKey: (key: string) => void;
  disabled?: boolean;
}

export const Keyboard = memo(function Keyboard({ statuses, onKey, disabled }: KeyboardProps) {
  return (
    <div className="w-full max-w-[500px] mx-auto select-none" role="group" aria-label="Keyboard">
      {ROWS.map((row, idx) => (
        <div key={idx} className="flex gap-1 sm:gap-1.5 justify-center mb-1.5">
          {idx === 2 && (
            <button
              type="button"
              aria-label="Enter"
              disabled={disabled}
              onClick={() => onKey("ENTER")}
              className="h-12 sm:h-14 px-2 sm:px-3 rounded-md font-bold text-xs sm:text-sm bg-key-bg text-key-text flex-1 max-w-[65px] active:opacity-80 transition"
            >
              ENTER
            </button>
          )}
          {row.split("").map((c) => {
            const status = statuses[c] ?? "empty";
            return (
              <button
                key={c}
                type="button"
                aria-label={c}
                disabled={disabled}
                onClick={() => onKey(c)}
                className={`h-12 sm:h-14 w-8 sm:w-10 rounded-md font-bold text-sm sm:text-base uppercase ${COLOR[status]} active:opacity-80 transition flex items-center justify-center`}
              >
                {c}
              </button>
            );
          })}
          {idx === 2 && (
            <button
              type="button"
              aria-label="Backspace"
              disabled={disabled}
              onClick={() => onKey("BACKSPACE")}
              className="h-12 sm:h-14 px-2 sm:px-3 rounded-md font-bold bg-key-bg text-key-text flex-1 max-w-[65px] active:opacity-80 transition flex items-center justify-center"
            >
              <Delete className="h-5 w-5" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
});
