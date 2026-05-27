let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  return audioCtx;
}

// Short click sound for each dice face change during roll
export function playRollSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const ticks = 7;
  for (let i = 0; i < ticks; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    // Pitch rises slightly toward end for tension
    osc.frequency.value = 180 + i * 30 + Math.random() * 40;
    osc.type = 'triangle';

    const start = ctx.currentTime + i * (0.12 - i * 0.005);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.18, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.09);

    osc.start(start);
    osc.stop(start + 0.1);
  }
}

// Satisfying chord when result reveals
export function playRevealSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.frequency.value = 523; // C5
  osc.type = 'sine';
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.4);
}

// Ascending 3-note success ding
export function playSuccessSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523, 659, 784]; // C5, E5, G5
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.value = freq;
    osc.type = 'sine';

    const start = ctx.currentTime + i * 0.13;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.18, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);

    osc.start(start);
    osc.stop(start + 0.3);
  });
}
