let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;
  try {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new Ctor();
    return ctx;
  } catch {
    return null;
  }
}

function beep(freq: number, duration = 0.08, type: OscillatorType = "sine", gain = 0.06) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.value = gain;
  osc.connect(g).connect(c.destination);
  osc.start();
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
  osc.stop(c.currentTime + duration);
}

export const sfx = {
  key: () => beep(440, 0.04, "square", 0.03),
  submit: () => beep(660, 0.1, "triangle", 0.05),
  correct: () => {
    beep(523, 0.1, "sine");
    setTimeout(() => beep(784, 0.15, "sine"), 110);
  },
  victory: () => {
    [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, 0.18, "triangle", 0.07), i * 120));
  },
  invalid: () => beep(180, 0.18, "sawtooth", 0.05),
};
