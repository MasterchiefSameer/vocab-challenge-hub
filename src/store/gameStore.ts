import { create } from "zustand";
import type { EvaluatedLetter, GameMode, GameState, LetterStatus } from "@/types/game";
import { evaluateGuess, validateHardMode } from "@/utils/evaluate";
import { isValidWord } from "@/features/dictionary/dictionary";
import { getRandomSolution, getTodayKey, getWordOfDay } from "@/utils/dailyWord";
import { safeGet, safeSet } from "@/utils/storage";
import { useStatsStore } from "@/store/statsStore";
import { useSettingsStore } from "@/store/settingsStore";
import { sfx } from "@/utils/sound";

export const MAX_GUESSES = 6;
export const WORD_LENGTH = 5;

const DAILY_KEY = "wordle:daily";
const UNLIMITED_KEY = "wordle:unlimited";

type ToastFn = (msg: string, kind?: "info" | "error" | "success") => void;

interface InternalState extends GameState {
  invalidShake: boolean;
  revealing: boolean;
  lastError?: string;
  _toast?: ToastFn;
}

interface GameStore extends InternalState {
  init: (mode: GameMode) => void;
  setToast: (fn: ToastFn) => void;
  addLetter: (c: string) => void;
  removeLetter: () => void;
  submitGuess: () => void;
  newGame: () => void; // unlimited only
  clearShake: () => void;
  letterStatuses: () => Record<string, LetterStatus>;
}

function keyFor(mode: GameMode) {
  return mode === "daily" ? DAILY_KEY : UNLIMITED_KEY;
}

function loadState(mode: GameMode): GameState | null {
  const saved = safeGet<GameState | null>(keyFor(mode), null);
  if (!saved) return null;
  if (mode === "daily") {
    const today = getTodayKey();
    if (saved.date !== today) return null;
  }
  return saved;
}

function freshState(mode: GameMode): GameState {
  if (mode === "daily") {
    return {
      mode,
      solution: getWordOfDay(),
      guesses: [],
      evaluations: [],
      currentGuess: "",
      status: "playing",
      date: getTodayKey(),
    };
  }
  return {
    mode,
    solution: getRandomSolution(),
    guesses: [],
    evaluations: [],
    currentGuess: "",
    status: "playing",
  };
}

function persist(state: GameState) {
  safeSet(keyFor(state.mode), state);
}

export const useGameStore = create<GameStore>((set, get) => ({
  mode: "daily",
  solution: "",
  guesses: [],
  evaluations: [],
  currentGuess: "",
  status: "playing",
  invalidShake: false,
  revealing: false,

  setToast: (fn) => set({ _toast: fn }),

  init: (mode) => {
    const existing = loadState(mode);
    const state = existing ?? freshState(mode);
    set({ ...state, invalidShake: false, revealing: false, lastError: undefined });
    if (!existing) persist(state);
  },

  newGame: () => {
    const state = freshState("unlimited");
    set({ ...state, invalidShake: false, revealing: false, lastError: undefined });
    persist(state);
  },

  clearShake: () => set({ invalidShake: false, lastError: undefined }),

  addLetter: (c) => {
    const s = get();
    if (s.status !== "playing" || s.revealing) return;
    if (s.currentGuess.length >= WORD_LENGTH) return;
    const letter = c.toUpperCase();
    if (!/^[A-Z]$/.test(letter)) return;
    set({ currentGuess: s.currentGuess + letter });
    if (useSettingsStore.getState().sound) sfx.key();
  },

  removeLetter: () => {
    const s = get();
    if (s.status !== "playing" || s.revealing) return;
    set({ currentGuess: s.currentGuess.slice(0, -1) });
  },

  submitGuess: () => {
    const s = get();
    if (s.status !== "playing" || s.revealing) return;
    const guess = s.currentGuess.toUpperCase();
    const toast = s._toast;
    const settings = useSettingsStore.getState();

    if (guess.length < WORD_LENGTH) {
      set({ invalidShake: true, lastError: "Not enough letters" });
      toast?.("Not enough letters", "error");
      if (settings.sound) sfx.invalid();
      return;
    }
    if (!isValidWord(guess)) {
      set({ invalidShake: true, lastError: "Not in word list" });
      toast?.("Not in word list", "error");
      if (settings.sound) sfx.invalid();
      return;
    }
    if (settings.hardMode) {
      const check = validateHardMode(guess, s.evaluations);
      if (!check.ok) {
        set({ invalidShake: true, lastError: check.reason });
        toast?.(check.reason, "error");
        if (settings.sound) sfx.invalid();
        return;
      }
    }

    const evaluation: EvaluatedLetter[] = evaluateGuess(guess, s.solution);
    const guesses = [...s.guesses, guess];
    const evaluations = [...s.evaluations, evaluation];
    const won = guess === s.solution.toUpperCase();
    const lost = !won && guesses.length >= MAX_GUESSES;
    const status: GameState["status"] = won ? "won" : lost ? "lost" : "playing";

    set({ revealing: true });
    if (settings.sound) sfx.submit();

    // Reveal then commit
    const REVEAL_MS = settings.reduceMotion ? 0 : 5 * 300 + 200;
    const commit = () => {
      const nextState: GameState = {
        ...s,
        guesses,
        evaluations,
        currentGuess: "",
        status,
      };
      set({ ...nextState, revealing: false });
      persist(nextState);

      if (won) {
        if (settings.sound) sfx.victory();
        useStatsStore.getState().recordWin(guesses.length, s.date);
        toast?.(`Splendid! Solved in ${guesses.length}/${MAX_GUESSES}`, "success");
      } else if (lost) {
        useStatsStore.getState().recordLoss();
        toast?.(`The word was ${s.solution}`, "info");
      }
    };
    if (REVEAL_MS === 0) commit();
    else setTimeout(commit, REVEAL_MS);
  },

  letterStatuses: () => {
    const out: Record<string, LetterStatus> = {};
    const order: LetterStatus[] = ["absent", "present", "correct"];
    for (const row of get().evaluations) {
      for (const { letter, status } of row) {
        const prev = out[letter];
        if (!prev || order.indexOf(status) > order.indexOf(prev)) {
          out[letter] = status;
        }
      }
    }
    return out;
  },
}));
