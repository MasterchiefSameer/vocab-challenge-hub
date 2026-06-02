import { describe, expect, it } from "vitest";
import { isValidWord } from "@/features/dictionary/dictionary";

describe("dictionary", () => {
  it("accepts known solutions", () => {
    expect(isValidWord("APPLE")).toBe(true);
    expect(isValidWord("crane")).toBe(true);
  });
  it("rejects garbage", () => {
    expect(isValidWord("ZZZZZ")).toBe(false);
    expect(isValidWord("CAT")).toBe(false);
    expect(isValidWord("")).toBe(false);
  });
});
