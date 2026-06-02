import { Modal } from "./Modal";
import { applyHighContrast, applyReduceMotion, applyTheme, useSettingsStore } from "@/store/settingsStore";
import { useGameStore } from "@/store/gameStore";
import * as Switch from "@radix-ui/react-switch";

function Row({ label, desc, checked, onChange, disabled }: { label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <div className="font-semibold">{label}</div>
        {desc && <div className="text-xs text-muted-foreground">{desc}</div>}
      </div>
      <Switch.Root
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        className="relative h-6 w-11 rounded-full bg-muted data-[state=checked]:bg-tile-correct transition disabled:opacity-50"
      >
        <Switch.Thumb className="block h-5 w-5 rounded-full bg-white shadow translate-x-0.5 data-[state=checked]:translate-x-[22px] transition-transform" />
      </Switch.Root>
    </div>
  );
}

export function SettingsModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const s = useSettingsStore();
  const game = useGameStore();
  const hardModeLocked = game.guesses.length > 0 && game.status === "playing";

  const setTheme = (dark: boolean) => {
    const theme = dark ? "dark" : "light";
    s.set("theme", theme);
    applyTheme(theme);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Settings">
      <div>
        <Row label="Dark Mode" checked={s.theme === "dark" || (s.theme === "system" && (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches))} onChange={setTheme} />
        <Row
          label="Hard Mode"
          desc={hardModeLocked ? "Can only be changed at start of round" : "Any revealed hints must be used in subsequent guesses"}
          checked={s.hardMode}
          disabled={hardModeLocked}
          onChange={(v) => s.set("hardMode", v)}
        />
        <Row label="High Contrast Mode" desc="Use colors that are easier to distinguish" checked={s.highContrast} onChange={(v) => { s.set("highContrast", v); applyHighContrast(v); }} />
        <Row label="Reduce Motion" desc="Disable animations" checked={s.reduceMotion} onChange={(v) => { s.set("reduceMotion", v); applyReduceMotion(v); }} />
        <Row label="Sound Effects" checked={s.sound} onChange={(v) => s.set("sound", v)} />
      </div>
    </Modal>
  );
}
