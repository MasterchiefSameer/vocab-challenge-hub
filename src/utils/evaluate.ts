import type { EvaluatedLetter, LetterStatus } from "@/types/game";

/**
 * Official Wordle two-pass evaluation.
 * Pass 1: mark exact matches and consume those letters from a count map.
 * Pass 2: mark remaining letters as 'present' only if a copy is still available.
 */
export function evaluateGuess(guess: string, solution: string): EvaluatedLetter[] {
  if (guess.length !== solution.length) {
    throw new Error("Guess and solution must be equal length");
  }
  const g = guess.toUpperCase();
  const s = solution.toUpperCase();
  const result: LetterStatus[] = Array(g.length).fill("absent");
  const remaining: Record<string, number> = {};

  // Pass 1
  for (let i = 0; i < g.length; i++) {
    if (g[i] === s[i]) {
      result[i] = "correct";
    } else {
      remaining[s[i]] = (remaining[s[i]] ?? 0) + 1;
    }
  }

  // Pass 2
  for (let i = 0; i < g.length; i++) {
    if (result[i] === "correct") continue;
    const c = g[i];
    if ((remaining[c] ?? 0) > 0) {
      result[i] = "present";
      remaining[c]--;
    }
  }

  return g.split("").map((letter, i) => ({ letter, status: result[i] }));
}

/**
 * Hard mode validation. Every previously revealed hint must be reused.
 * - correct letters must be in the same position
 * - present letters must appear somewhere
 */
export function validateHardMode(
  guess: string,
  history: EvaluatedLetter[][],
): { ok: true } | { ok: false; reason: string } {
  const g = guess.toUpperCase();
  for (const row of history) {
    for (let i = 0; i < row.length; i++) {
      const { letter, status } = row[i];
      if (status === "correct" && g[i] !== letter) {
        return { ok: false, reason: `${ordinal(i + 1)} letter must be ${letter}` };
      }
    }
    const need: Record<string, number> = {};
    for (const { letter, status } of row) {
      if (status === "present") need[letter] = (need[letter] ?? 0) + 1;
    }
    const have: Record<string, number> = {};
    for (const c of g) have[c] = (have[c] ?? 0) + 1;
    for (const [letter, count] of Object.entries(need)) {
      if ((have[letter] ?? 0) < count) {
        return { ok: false, reason: `Guess must contain ${letter}` };
      }
    }
  }
  return { ok: true };
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
