import { createFileRoute } from "@tanstack/react-router";
import { GamePage } from "@/pages/GamePage";

export const Route = createFileRoute("/unlimited")({
  head: () => ({
    meta: [
      { title: "Wordle Unlimited — Play Forever" },
      { name: "description", content: "Play unlimited Wordle puzzles. New 5-letter word every game." },
      { property: "og:title", content: "Wordle Unlimited" },
      { property: "og:description", content: "Play unlimited Wordle puzzles with a fresh word every game." },
    ],
  }),
  component: () => <GamePage mode="unlimited" />,
});
