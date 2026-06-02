export type LetterStatus = "empty" | "tbd" | "correct" | "present" | "absent";

export interface EvaluatedLetter {
  letter: string;
  status: LetterStatus;
}

export type GameStatus = "playing" | "won" | "lost";
export type GameMode = "daily" | "unlimited";

export interface GameState {
  mode: GameMode;
  solution: string;
  guesses: string[];
  evaluations: EvaluatedLetter[][];
  currentGuess: string;
  status: GameStatus;
  /** ISO date (yyyy-mm-dd) for daily game persistence */
  date?: string;
}

export interface Stats {
  played: number;
  wins: number;
  losses: number;
  currentStreak: number;
  maxStreak: number;
  distribution: number[]; // length 6
  lastWinDate?: string;
}

export interface Settings {
  theme: "light" | "dark" | "system";
  highContrast: boolean;
  sound: boolean;
  reduceMotion: boolean;
  hardMode: boolean;
}
