// Tiny WebAudio synth for UI sounds — no audio assets needed.
// All sounds are short, quiet, and gated behind the user's sound setting.

let ctx = null;
function audio() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function tone(freq, { start = 0, dur = 0.18, gain = 0.08, type = 'sine' } = {}) {
  const ac = audio();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  const t0 = ac.currentTime + start;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

/* Gentle two-note chime for finishing a worksheet; brighter for high scores. */
export function playComplete(score = 0) {
  if (score >= 80) {
    tone(523.25, { dur: 0.22 });               // C5
    tone(659.25, { start: 0.12, dur: 0.22 });  // E5
    tone(783.99, { start: 0.24, dur: 0.34, gain: 0.09 }); // G5
  } else {
    tone(440, { dur: 0.2 });                   // A4
    tone(554.37, { start: 0.14, dur: 0.3 });   // C#5
  }
}

/* Sparkly rising arpeggio for unlocking an achievement. */
export function playUnlock() {
  tone(587.33, { dur: 0.16, type: 'triangle' });                 // D5
  tone(739.99, { start: 0.09, dur: 0.16, type: 'triangle' });    // F#5
  tone(880, { start: 0.18, dur: 0.16, type: 'triangle' });       // A5
  tone(1174.66, { start: 0.27, dur: 0.4, gain: 0.07, type: 'triangle' }); // D6
}
