# Wordle - A NYC game (Made by Vibe Coding)
##
Vercel Link: https://vocab-challenge-hub.vercel.app/
##
Lovable Link: https://vocab-challenge.lovable.app 
##
A polished, accessible, production-ready Wordle clone built with TanStack Start (React 19 + Vite 7), TypeScript, Tailwind CSS v4, and Zustand.

## Features

- **Daily** mode — deterministic word of the day (changes at midnight, same word for everyone).
- **Unlimited** mode — fresh random word every game.
- Official **two-pass evaluation** for correct duplicate-letter handling.
- **Hard mode**, **high contrast mode**, **dark / light / system theme**, **reduce motion**, **sound effects** (Web Audio, no asset files).
- **Statistics** — games played, win %, streaks, guess distribution bar chart, shareable result grid (`navigator.clipboard`).
- Full **keyboard** support, on-screen keyboard with letter status colors.
- Animations: tile pop, flip reveal, row shake on invalid, winning row bounce, confetti.
- **Persistence** via `localStorage` — board, current row, settings, stats, daily challenge state.
- Lazy-loaded modals, memoized board rows/tiles.
- Mobile-first responsive layout, accessible ARIA roles, screen reader live region for errors.

## Stack

- TanStack Start (React 19, file-based routes under `src/routes/`)
- TypeScript (strict)
- Tailwind CSS v4 (semantic tokens in `src/styles.css`)
- Zustand (game / settings / stats stores)
- Vitest (unit tests)

> Note: the requested spec lists React Router, but this template ships TanStack Router (`@tanstack/react-router`). The routing surface (`/` for daily, `/unlimited` for unlimited) is implemented with TanStack file-based routes — semantically identical.

## Folder structure

```
src/
├── components/
│   ├── board/        Board, Row, Tile
│   ├── keyboard/     Keyboard
│   ├── modal/        Modal, Help, Stats, Settings
│   └── shared/       Header, Toast
├── features/
│   └── dictionary/   isValidWord
├── hooks/            useKeyboard
├── store/            gameStore, settingsStore, statsStore (zustand)
├── utils/            evaluate, dailyWord, storage, share, sound
├── constants/        solutions, allowedExtra
├── types/            game
├── pages/            GamePage
└── routes/           index.tsx (daily), unlimited.tsx, __root.tsx
tests/                evaluate / dailyWord / stats / dictionary
```

## Scripts

```bash
bun install
bun run dev       # start dev server
bun run build     # production build
bunx vitest run   # run tests
```

## Deployment

The template targets edge runtimes (Cloudflare Workers via nitro). After `bun run build`, deploy `.output/` to any compatible host. For a basic SPA host, you can use `bun run build` output and serve `dist/` from any static host that supports SPA fallback.

## Accessibility

- Full keyboard play (Enter/Backspace/A-Z).
- ARIA labels on every interactive element and tile.
- Polite `aria-live` toast region for invalid-word feedback.
- Color-blind / high-contrast palette toggle.
- Reduce-motion toggle disables all animations.

## PWA

A minimal `public/manifest.json` is provided for "Add to Home Screen". A full service worker is intentionally not included to avoid breaking the preview iframe.
