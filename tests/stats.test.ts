import { describe, expect, it, beforeEach } from "vitest";
import { useStatsStore, winPercent } from "@/store/statsStore";

beforeEach(() => {
  useStatsStore.getState().reset();
});

describe("stats", () => {
  it("records a win", () => {
    useStatsStore.getState().recordWin(3);
    const s = useStatsStore.getState();
    expect(s.played).toBe(1);
    expect(s.wins).toBe(1);
    expect(s.currentStreak).toBe(1);
    expect(s.maxStreak).toBe(1);
    expect(s.distribution[2]).toBe(1);
    expect(winPercent(s)).toBe(100);
  });

  it("resets streak on loss", () => {
    useStatsStore.getState().recordWin(2);
    useStatsStore.getState().recordWin(4);
    useStatsStore.getState().recordLoss();
    const s = useStatsStore.getState();
    expect(s.currentStreak).toBe(0);
    expect(s.maxStreak).toBe(2);
    expect(s.wins).toBe(2);
    expect(s.losses).toBe(1);
    expect(s.played).toBe(3);
  });
});
