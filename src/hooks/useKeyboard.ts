import { useEffect, useRef } from "react";
import { useGameStore } from "@/store/gameStore";

export function useKeyboard(enabled: boolean) {
  const addLetter = useGameStore((s) => s.addLetter);
  const removeLetter = useGameStore((s) => s.removeLetter);
  const submitGuess = useGameStore((s) => s.submitGuess);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!enabledRef.current) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key;
      if (k === "Enter") {
        e.preventDefault();
        submitGuess();
      } else if (k === "Backspace") {
        e.preventDefault();
        removeLetter();
      } else if (/^[a-zA-Z]$/.test(k)) {
        addLetter(k);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [addLetter, removeLetter, submitGuess]);
}

export function dispatchKey(key: string) {
  const { addLetter, removeLetter, submitGuess } = useGameStore.getState();
  if (key === "ENTER") submitGuess();
  else if (key === "BACKSPACE") removeLetter();
  else addLetter(key);
}
