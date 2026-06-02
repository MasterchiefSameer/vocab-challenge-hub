import { createFileRoute } from "@tanstack/react-router";
import { GamePage } from "@/pages/GamePage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wordle — Daily Word Puzzle" },
      { name: "description", content: "Guess the daily 5-letter word in 6 tries. A polished Wordle clone with stats, dark mode, and hard mode." },
      { property: "og:title", content: "Wordle — Daily Word Puzzle" },
      { property: "og:description", content: "Guess the daily 5-letter word in 6 tries." },
    ],
  }),
  component: () => <GamePage mode="daily" />,
});
