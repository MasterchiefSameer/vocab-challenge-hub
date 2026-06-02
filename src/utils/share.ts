import type { EvaluatedLetter, GameMode } from "@/types/game";

const EMOJI = { correct: "🟩", present: "🟨", absent: "⬛", tbd: "⬜", empty: "⬜" } as const;
const EMOJI_HC = { correct: "🟧", present: "🟦", absent: "⬛", tbd: "⬜", empty: "⬜" } as const;

export interface ShareOptions {
  mode: GameMode;
  puzzleNumber?: number;
  evaluations: EvaluatedLetter[][];
  won: boolean;
  maxGuesses: number;
  highContrast?: boolean;
  hardMode?: boolean;
}

export function buildShareText({
  mode,
  puzzleNumber,
  evaluations,
  won,
  maxGuesses,
  highContrast,
  hardMode,
}: ShareOptions): string {
  const map = highContrast ? EMOJI_HC : EMOJI;
  const header =
    mode === "daily"
      ? `Wordle ${puzzleNumber ?? ""} ${won ? evaluations.length : "X"}/${maxGuesses}${hardMode ? "*" : ""}`
      : `Wordle Unlimited ${won ? evaluations.length : "X"}/${maxGuesses}${hardMode ? "*" : ""}`;
  const grid = evaluations
    .map((row) => row.map((cell) => map[cell.status as keyof typeof map]).join(""))
    .join("\n");
  return `${header.trim()}\n\n${grid}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fallthrough */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    return true;
  } catch {
    return false;
  }
}
