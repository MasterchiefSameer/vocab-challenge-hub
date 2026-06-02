import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, HelpCircle, Settings, RotateCcw } from "lucide-react";
import { useGameStore } from "@/store/gameStore";

interface HeaderProps {
  onHelp: () => void;
  onStats: () => void;
  onSettings: () => void;
}

export function Header({ onHelp, onStats, onSettings }: HeaderProps) {
  const route = useRouterState({ select: (s) => s.location.pathname });
  const isUnlimited = route.startsWith("/unlimited");
  const newGame = useGameStore((s) => s.newGame);

  return (
    <header className="border-b border-border">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onHelp}
            className="p-2 rounded-full hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
            aria-label="How to play"
          >
            <HelpCircle className="h-5 w-5" />
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[0.2em] uppercase">Wordle</h1>

        <div className="flex items-center gap-1">
          <nav className="hidden sm:flex items-center gap-1 mr-2 text-xs font-bold uppercase">
            <Link
              to="/"
              className="px-2 py-1 rounded"
              activeProps={{ className: "px-2 py-1 rounded bg-accent" }}
              activeOptions={{ exact: true }}
            >
              Daily
            </Link>
            <Link
              to="/unlimited"
              className="px-2 py-1 rounded"
              activeProps={{ className: "px-2 py-1 rounded bg-accent" }}
            >
              Unlimited
            </Link>
          </nav>
          {isUnlimited && (
            <button
              onClick={() => newGame()}
              className="p-2 rounded-full hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
              aria-label="New game"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={onStats}
            className="p-2 rounded-full hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
            aria-label="Statistics"
          >
            <BarChart3 className="h-5 w-5" />
          </button>
          <button
            onClick={onSettings}
            className="p-2 rounded-full hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
      <nav className="sm:hidden flex items-center justify-center gap-2 pb-2 text-xs font-bold uppercase">
        <Link to="/" className="px-3 py-1 rounded" activeProps={{ className: "px-3 py-1 rounded bg-accent" }} activeOptions={{ exact: true }}>
          Daily
        </Link>
        <Link to="/unlimited" className="px-3 py-1 rounded" activeProps={{ className: "px-3 py-1 rounded bg-accent" }}>
          Unlimited
        </Link>
      </nav>
    </header>
  );
}
