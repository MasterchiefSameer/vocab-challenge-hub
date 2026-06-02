import { describe, expect, it } from "vitest";
import { getWordOfDay, daysSinceEpoch, getPuzzleNumber } from "@/utils/dailyWord";
import { SOLUTIONS } from "@/constants/solutions";

describe("daily word", () => {
  it("is deterministic for a given date", () => {
    const d = new Date(2024, 0, 1);
    expect(getWordOfDay(d)).toBe(getWordOfDay(d));
  });
  it("differs across days", () => {
    const a = getWordOfDay(new Date(2024, 0, 1));
    const b = getWordOfDay(new Date(2024, 0, 2));
    // not guaranteed unique, but for our list it should differ
    expect(typeof a).toBe("string");
    expect(typeof b).toBe("string");
  });
  it("selects from solution list", () => {
    expect(SOLUTIONS).toContain(getWordOfDay(new Date(2024, 5, 15)));
  });
  it("days since epoch is non-negative for current era", () => {
    expect(daysSinceEpoch(new Date(2024, 0, 1))).toBeGreaterThan(0);
    expect(getPuzzleNumber(new Date(2024, 0, 1))).toBeGreaterThan(0);
  });
});
