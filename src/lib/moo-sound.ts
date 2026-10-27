/**
 * Synthesizes a realistic, playful acoustic "Mooo" + Alpine Cowbell chime
 * using the browser's Web Audio API (no external audio assets required).
 */
export function playMooSound(pitchHz = 135, withBell = true): void {
  if (typeof window === 'undefined') return;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtx) return;

  try {
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // 1. Vocal "Moooo" formant synthesis
    const osc = ctx.createOscillator();
    const subOsc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    subOsc.type = 'triangle';

    // Pitch contour: rises slightly then settles down like a real cow moo
    osc.frequency.setValueAtTime(pitchHz * 0.92, now);
    osc.frequency.linearRampToValueAtTime(pitchHz * 1.08, now + 0.25);
    osc.frequency.exponentialRampToValueAtTime(pitchHz * 0.86, now + 0.95);

    subOsc.frequency.setValueAtTime(pitchHz * 0.46, now);
    subOsc.frequency.linearRampToValueAtTime(pitchHz * 0.54, now + 0.25);
    subOsc.frequency.exponentialRampToValueAtTime(pitchHz * 0.43, now + 0.95);

    // Vocal tract low-pass / formant filter ("m-oooo")
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(3.2, now);
    filter.frequency.setValueAtTime(320, now);
    filter.frequency.linearRampToValueAtTime(620, now + 0.22);
    filter.frequency.exponentialRampToValueAtTime(380, now + 0.95);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.12);
    gain.gain.setValueAtTime(0.18, now + 0.55);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    subOsc.start(now);
    osc.stop(now + 1.02);
    subOsc.stop(now + 1.02);

    // 2. Optional Metallic Pasture Cowbell ("Clank-clink!")
    if (withBell) {
      const bell1 = ctx.createOscillator();
      const bell2 = ctx.createOscillator();
      const bellGain = ctx.createGain();

      bell1.type = 'square';
      bell2.type = 'square';
      // Classic 808-style cowbell frequencies (540Hz + 800Hz)
      bell1.frequency.setValueAtTime(587, now + 0.05);
      bell2.frequency.setValueAtTime(845, now + 0.05);

      const bellFilter = ctx.createBiquadFilter();
      bellFilter.type = 'bandpass';
      bellFilter.frequency.setValueAtTime(700, now + 0.05);

      bellGain.gain.setValueAtTime(0.001, now + 0.05);
      bellGain.gain.linearRampToValueAtTime(0.09, now + 0.065);
      bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      bell1.connect(bellFilter);
      bell2.connect(bellFilter);
      bellFilter.connect(bellGain);
      bellGain.connect(ctx.destination);

      bell1.start(now + 0.05);
      bell2.start(now + 0.05);
      bell1.stop(now + 0.38);
      bell2.stop(now + 0.38);
    }
  } catch {
    // Ignore audio context restrictions if autoplay blocked
  }
}
