import { SOLUTIONS } from "@/constants/solutions";
import { ALLOWED_EXTRA } from "@/constants/allowedExtra";

const ALLOWED_SET = new Set<string>([...SOLUTIONS, ...ALLOWED_EXTRA].map((w) => w.toUpperCase()));

export function isValidWord(word: string): boolean {
  if (!word || word.length !== 5) return false;
  return ALLOWED_SET.has(word.toUpperCase());
}

export function getSolutionsList(): string[] {
  return SOLUTIONS;
}
