import { Modal } from "./Modal";
import { useStatsStore, winPercent } from "@/store/statsStore";
import { useGameStore } from "@/store/gameStore";
import { useSettingsStore } from "@/store/settingsStore";
import { buildShareText, copyToClipboard } from "@/utils/share";
import { getPuzzleNumber, msUntilMidnight } from "@/utils/dailyWord";
import { useEffect, useState } from "react";
import { Share2 } from "lucide-react";

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex flex-col items-center min-w-12">
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-[10px] uppercase text-muted-foreground text-center leading-tight max-w-14">{label}</div>
    </div>
  );
}

function Countdown() {
  const [ms, setMs] = useState(msUntilMidnight());
  useEffect(() => {
    const t = setInterval(() => setMs(msUntilMidnight()), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(ms / 3_600_000).toString().padStart(2, "0");
  const m = Math.floor((ms % 3_600_000) / 60_000).toString().padStart(2, "0");
  const s = Math.floor((ms % 60_000) / 1000).toString().padStart(2, "0");
  return <div className="font-mono text-2xl font-bold tabular-nums">{h}:{m}:{s}</div>;
}

export function StatsModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const stats = useStatsStore();
  const game = useGameStore();
  const settings = useSettingsStore();
  const [copied, setCopied] = useState(false);
  const max = Math.max(1, ...stats.distribution);
  const lastGuessIdx = game.status === "won" ? game.guesses.length - 1 : -1;

  async function onShare() {
    const text = buildShareText({
      mode: game.mode,
      puzzleNumber: game.mode === "daily" ? getPuzzleNumber() : undefined,
      evaluations: game.evaluations,
      won: game.status === "won",
      maxGuesses: 6,
      highContrast: settings.highContrast,
      hardMode: settings.hardMode,
    });
    const ok = await copyToClipboard(text);
    setCopied(ok);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Statistics">
      <div className="flex justify-between gap-2 mb-6">
        <Stat label="Played" value={stats.played} />
        <Stat label="Win %" value={winPercent(stats)} />
        <Stat label="Current Streak" value={stats.currentStreak} />
        <Stat label="Max Streak" value={stats.maxStreak} />
      </div>
      <h3 className="text-center font-bold uppercase text-sm mb-3">Guess Distribution</h3>
      <div className="space-y-1 mb-4">
        {stats.distribution.map((count, i) => {
          const pct = (count / max) * 100;
          const highlight = i === lastGuessIdx;
          return (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="w-4 font-semibold">{i + 1}</span>
              <div className="flex-1 bg-muted h-6 relative">
                <div
                  className={`h-full ${highlight ? "bg-tile-correct" : "bg-muted-foreground"} flex items-center justify-end pr-2 text-xs font-bold text-tile-text min-w-[1.5rem]`}
                  style={{ width: `${Math.max(pct, 6)}%` }}
                >
                  {count}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {game.status !== "playing" && (
        <div className="border-t border-border pt-4 flex items-center justify-between gap-4">
          {game.mode === "daily" ? (
            <div>
              <div className="text-[10px] uppercase font-semibold text-muted-foreground">Next Wordle</div>
              <Countdown />
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Unlimited mode — start a new game from header.</div>
          )}
          <button
            onClick={onShare}
            className="flex items-center gap-2 bg-tile-correct text-tile-text font-bold uppercase rounded-md px-5 py-3 hover:opacity-90 transition"
          >
            {copied ? "Copied!" : "Share"} <Share2 className="h-4 w-4" />
          </button>
        </div>
      )}
    </Modal>
  );
}
