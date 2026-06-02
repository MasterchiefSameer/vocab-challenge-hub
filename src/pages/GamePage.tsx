import { lazy, Suspense, useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { Board } from "@/components/board/Board";
import { Keyboard } from "@/components/keyboard/Keyboard";
import { Header } from "@/components/shared/Header";
import { pushToast, ToastHost } from "@/components/shared/Toast";
import { dispatchKey, useKeyboard } from "@/hooks/useKeyboard";
import { useGameStore } from "@/store/gameStore";
import { useSettingsStore } from "@/store/settingsStore";
import type { GameMode } from "@/types/game";

const StatsModal = lazy(() => import("@/components/modal/StatsModal").then((m) => ({ default: m.StatsModal })));
const HelpModal = lazy(() => import("@/components/modal/HelpModal").then((m) => ({ default: m.HelpModal })));
const SettingsModal = lazy(() => import("@/components/modal/SettingsModal").then((m) => ({ default: m.SettingsModal })));

export function GamePage({ mode }: { mode: GameMode }) {
  const init = useGameStore((s) => s.init);
  const setToast = useGameStore((s) => s.setToast);
  const game = useGameStore();
  const settings = useSettingsStore();
  const [showHelp, setShowHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const lastStatus = useRef(game.status);

  useEffect(() => {
    setToast((msg, kind) => pushToast(msg, kind));
    init(mode);
    // Show help on first ever load
    if (!localStorage.getItem("wordle:seenHelp")) {
      setShowHelp(true);
      localStorage.setItem("wordle:seenHelp", "1");
    }
  }, [init, setToast, mode]);

  useKeyboard(game.status === "playing" && !game.revealing && !showHelp && !showStats && !showSettings);

  // Auto-open stats and confetti when game finishes
  useEffect(() => {
    if (lastStatus.current === "playing" && game.status !== "playing" && !game.revealing) {
      const t = setTimeout(() => setShowStats(true), 1500);
      if (game.status === "won" && !settings.reduceMotion) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }
      lastStatus.current = game.status;
      return () => clearTimeout(t);
    }
    lastStatus.current = game.status;
  }, [game.status, game.revealing, settings.reduceMotion]);

  const statuses = useGameStore((s) => s.letterStatuses());

  return (
    <ToastHost>
      <div className="min-h-dvh flex flex-col">
        <Header
          onHelp={() => setShowHelp(true)}
          onStats={() => setShowStats(true)}
          onSettings={() => setShowSettings(true)}
        />
        <main className="flex-1 flex flex-col justify-between max-w-3xl w-full mx-auto px-2 py-4 gap-4">
          <div
            className="flex-1 flex items-center justify-center"
            role="application"
            aria-label={mode === "daily" ? "Daily Wordle" : "Unlimited Wordle"}
          >
            <Board
              guesses={game.guesses}
              evaluations={game.evaluations}
              currentGuess={game.currentGuess}
              invalidShake={game.invalidShake}
              revealing={game.revealing}
              status={game.status}
              reduceMotion={settings.reduceMotion}
            />
          </div>
          <div className="sr-only" aria-live="polite">
            {game.lastError ?? ""}
          </div>
          <Keyboard
            statuses={statuses}
            onKey={dispatchKey}
            disabled={game.status !== "playing" || game.revealing}
          />
        </main>

        <Suspense fallback={null}>
          {showHelp && <HelpModal open={showHelp} onOpenChange={setShowHelp} />}
          {showStats && <StatsModal open={showStats} onOpenChange={setShowStats} />}
          {showSettings && <SettingsModal open={showSettings} onOpenChange={setShowSettings} />}
        </Suspense>
      </div>
    </ToastHost>
  );
}
