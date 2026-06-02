import { Modal } from "./Modal";

const Example = ({ letters }: { letters: { l: string; s: "correct" | "present" | "absent" }[] }) => (
  <div className="flex gap-1 mb-2">
    {letters.map(({ l, s }, i) => (
      <div
        key={i}
        className={`h-9 w-9 flex items-center justify-center font-bold uppercase border-2 ${
          s === "correct"
            ? "bg-tile-correct border-tile-correct text-tile-text"
            : s === "present"
            ? "bg-tile-present border-tile-present text-tile-text"
            : s === "absent"
            ? "bg-tile-absent border-tile-absent text-tile-text"
            : "border-border"
        }`}
      >
        {l}
      </div>
    ))}
  </div>
);

export function HelpModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} title="How to Play">
      <div className="space-y-3 text-sm">
        <p>Guess the Wordle in 6 tries.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Each guess must be a valid 5-letter word.</li>
          <li>The color of the tiles will change to show how close your guess was.</li>
        </ul>
        <hr className="my-3 border-border" />
        <p className="font-semibold uppercase text-xs tracking-wide">Examples</p>
        <Example letters={[{ l: "W", s: "correct" }, { l: "E", s: "absent" }, { l: "A", s: "absent" }, { l: "R", s: "absent" }, { l: "Y", s: "absent" }]} />
        <p><strong>W</strong> is in the word and in the correct spot.</p>
        <Example letters={[{ l: "P", s: "absent" }, { l: "I", s: "present" }, { l: "L", s: "absent" }, { l: "O", s: "absent" }, { l: "T", s: "absent" }]} />
        <p><strong>I</strong> is in the word but in the wrong spot.</p>
        <Example letters={[{ l: "V", s: "absent" }, { l: "A", s: "absent" }, { l: "G", s: "absent" }, { l: "U", s: "absent" }, { l: "E", s: "absent" }]} />
        <p>None of the letters are in the word.</p>
      </div>
    </Modal>
  );
}
