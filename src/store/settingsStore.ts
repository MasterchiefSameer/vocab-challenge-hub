import { create } from "zustand";
import type { Settings } from "@/types/game";
import { safeGet, safeSet } from "@/utils/storage";

const KEY = "wordle:settings";

const defaults: Settings = {
  theme: "system",
  highContrast: false,
  sound: false,
  reduceMotion: false,
  hardMode: false,
};

interface SettingsStore extends Settings {
  set: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  reset: () => void;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...defaults,
  ...safeGet<Partial<Settings>>(KEY, {}),
  set: (key, value) => {
    set({ [key]: value } as Pick<SettingsStore, typeof key>);
    const { set: _s, reset: _r, ...rest } = get();
    safeSet(KEY, rest);
  },
  reset: () => {
    set(defaults);
    safeSet(KEY, defaults);
  },
}));

export function applyTheme(theme: Settings["theme"]) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = theme === "dark" || (theme === "system" && prefersDark);
  root.classList.toggle("dark", dark);
}

export function applyHighContrast(hc: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("hc", hc);
}

export function applyReduceMotion(rm: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("reduce-motion", rm);
}
