import { describe, expect, it } from "vitest";
import { evaluateGuess, validateHardMode } from "@/utils/evaluate";

function statuses(guess: string, solution: string) {
  return evaluateGuess(guess, solution).map((e) => e.status);
}

describe("evaluateGuess - basic", () => {
  it("all correct", () => {
    expect(statuses("APPLE", "APPLE")).toEqual(["correct", "correct", "correct", "correct", "correct"]);
  });
  it("all absent", () => {
    expect(statuses("BRICK", "PLANT")).toEqual(["absent", "absent", "absent", "absent", "absent"]);
  });
  it("mixed", () => {
    expect(statuses("PLATE", "APPLE")).toEqual(["present", "present", "present", "absent", "correct"]);
  });
});

describe("evaluateGuess - duplicate letters (NYT semantics)", () => {
  it("PAPAL vs APPLE: P[0] absent (only 2 Ps in solution, both consumed elsewhere)", () => {
    // Solution APPLE letters: A(1) P(2) L(1) E(1)
    // Guess PAPAL: P[0]=A? no, P at 0 → not exact. A[1]=P? no. P[2]=P exact correct.
    // A[3]=L? no. L[4]=E? no.
    // Pass1: position 2 correct (P). Remaining A=1, P=1, L=1, E=1.
    // Pass2: P[0]: remaining P>0 -> present. A[1]: remaining A>0 -> present. A[3]: remaining A=0 -> absent. L[4]: remaining L>0 -> present.
    expect(statuses("PAPAL", "APPLE")).toEqual(["present", "present", "correct", "absent", "present"]);
  });

  it("ALLOY vs LLAMA: only first L correct, second L absent", () => {
    // Solution LLAMA: L L A M A. Guess ALLOY: A L L O Y
    // Pass1: position 1 L=L correct. Others not exact. Remaining L=1 A=2 M=1 A=...
    // remaining after pass1 from solution excluding exacts: L(0)=L, L(2)=A (still), A(3)... Wait, recompute:
    // s positions 0:L 1:L 2:A 3:M 4:A; g positions 0:A 1:L 2:L 3:O 4:Y
    // Exacts: i=1 (L==L). Remaining solution letters (non-matched): L,A,M,A.
    // Pass2: A[0]: A in remaining -> present (consume A). L[2]: L in remaining -> present. O[3]: no. Y[4]: no.
    expect(statuses("ALLOY", "LLAMA")).toEqual(["present", "correct", "present", "absent", "absent"]);
  });

  it("SPEED vs ABIDE: only one E becomes present", () => {
    // s ABIDE -> A B I D E. g SPEED -> S P E E D
    // Exacts: none. Remaining: A,B,I,D,E.
    // Pass2: S absent, P absent, E[2]: E available -> present. E[3]: no E left -> absent. D[4]: D available -> present.
    expect(statuses("SPEED", "ABIDE")).toEqual(["absent", "absent", "present", "absent", "present"]);
  });

  it("ERASE vs SPEED: only one E in solution after exacts", () => {
    // s SPEED: S P E E D. g ERASE: E R A S E
    // Exacts: none. Remaining: S P E E D.
    // E[0]: present (E left=1). R: absent. A: absent. S[3]: present. E[4]: present (E left=0 now).
    expect(statuses("ERASE", "SPEED")).toEqual(["present", "absent", "absent", "present", "present"]);
  });
});

describe("validateHardMode", () => {
  const history = [evaluateGuess("CRANE", "APPLE")];
  it("rejects missing present letter", () => {
    const r = validateHardMode("BLINK", history);
    expect(r.ok).toBe(false);
  });
  it("accepts when reused", () => {
    const r = validateHardMode("PLACE", [evaluateGuess("CRANE", "APPLE")]);
    expect(r.ok).toBe(true);
  });
});
