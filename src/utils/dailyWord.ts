import { SOLUTIONS } from "@/constants/solutions";

// Fixed epoch: June 19, 2021 (original Wordle launch).
const EPOCH = new Date(Date.UTC(2021, 5, 19));
const MS_PER_DAY = 86_400_000;

export function daysSinceEpoch(date: Date = new Date()): number {
  const utc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor((utc - EPOCH.getTime()) / MS_PER_DAY);
}

export function getWordOfDay(date: Date = new Date()): string {
  const idx = daysSinceEpoch(date);
  const i = ((idx % SOLUTIONS.length) + SOLUTIONS.length) % SOLUTIONS.length;
  return SOLUTIONS[i];
}

export function getPuzzleNumber(date: Date = new Date()): number {
  return daysSinceEpoch(date);
}

export function getTodayKey(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function msUntilMidnight(now: Date = new Date()): number {
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  return next.getTime() - now.getTime();
}

export function getRandomSolution(): string {
  return SOLUTIONS[Math.floor(Math.random() * SOLUTIONS.length)];
}
