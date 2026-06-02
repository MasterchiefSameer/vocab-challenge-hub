import { create } from "zustand";
import type { Stats } from "@/types/game";
import { safeGet, safeSet } from "@/utils/storage";

const KEY = "wordle:stats";

const empty: Stats = {
  played: 0,
  wins: 0,
  losses: 0,
  currentStreak: 0,
  maxStreak: 0,
  distribution: [0, 0, 0, 0, 0, 0],
};

interface StatsStore extends Stats {
  recordWin: (guessCount: number, dateKey?: string) => void;
  recordLoss: () => void;
  reset: () => void;
}

function persist(s: Stats) {
  const { played, wins, losses, currentStreak, maxStreak, distribution, lastWinDate } = s;
  safeSet(KEY, { played, wins, losses, currentStreak, maxStreak, distribution, lastWinDate });
}

export const useStatsStore = create<StatsStore>((set, get) => ({
  ...empty,
  ...safeGet<Partial<Stats>>(KEY, {}),
  recordWin: (guessCount, dateKey) => {
    const s = get();
    const dist = [...s.distribution];
    const idx = Math.max(0, Math.min(5, guessCount - 1));
    dist[idx] = (dist[idx] ?? 0) + 1;
    const streak = s.currentStreak + 1;
    const next: Stats = {
      played: s.played + 1,
      wins: s.wins + 1,
      losses: s.losses,
      currentStreak: streak,
      maxStreak: Math.max(s.maxStreak, streak),
      distribution: dist,
      lastWinDate: dateKey ?? s.lastWinDate,
    };
    set(next);
    persist(next);
  },
  recordLoss: () => {
    const s = get();
    const next: Stats = {
      played: s.played + 1,
      wins: s.wins,
      losses: s.losses + 1,
      currentStreak: 0,
      maxStreak: s.maxStreak,
      distribution: s.distribution,
      lastWinDate: s.lastWinDate,
    };
    set(next);
    persist(next);
  },
  reset: () => {
    set(empty);
    persist(empty);
  },
}));

export function winPercent(s: Stats): number {
  return s.played === 0 ? 0 : Math.round((s.wins / s.played) * 100);
}
