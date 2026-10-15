/* ------------------------------------------------------------------ *
 * ArcadeSoundEngine — Web Audio API based 8-bit sound synthesizer.
 * Generates retro arcade sound effects with zero external files.
 *
 * Sound palette:
 *   navigate  — short blip (arrow keys, tab switch)
 *   select    — ascending two-tone (Enter / game pick)
 *   start     — triumphant arpeggio (Press Start)
 *   back      — descending tone (Esc / back button)
 *   hover     — ultra-soft tick (mouse enter on game items)
 *   coin      — coin-pickup chime (score increment)
 * ------------------------------------------------------------------ */

type SoundName = "navigate" | "select" | "start" | "back" | "hover" | "coin";

class ArcadeSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private _muted = false;

  get muted() {
    return this._muted;
  }

  setMuted(value: boolean) {
    this._muted = value;
    if (this.masterGain) {
      this.masterGain.gain.value = value ? 0 : 0.15;
    }
  }

  toggleMute() {
    this.setMuted(!this._muted);
    return this._muted;
  }

  /** Lazily create the AudioContext (must be triggered by user gesture). */
  private ensureContext() {
    if (this.ctx) return;
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    this.ctx = new Ctor();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this._muted ? 0 : 0.15;
    this.masterGain.connect(this.ctx.destination);
  }

  /** Resume the context if suspended (autoplay policy). */
  private resume() {
    this.ensureContext();
    if (this.ctx?.state === "suspended") {
      void this.ctx.resume();
    }
  }

  /** Play a single oscillator note. */
  private tone(
    freq: number,
    duration: number,
    type: OscillatorType = "square",
    startAt: number = 0,
    volume: number = 1,
  ) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;

    const now = this.ctx.currentTime + startAt;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + duration + 0.01);
  }

  /** Frequency sweep for gliding effects. */
  private sweep(
    fromFreq: number,
    toFreq: number,
    duration: number,
    type: OscillatorType = "square",
    startAt: number = 0,
    volume: number = 1,
  ) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;

    const now = this.ctx.currentTime + startAt;
    osc.frequency.setValueAtTime(fromFreq, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(toFreq, 1), now + duration);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + duration + 0.01);
  }

  play(sound: SoundName) {
    if (this._muted) return;
    this.resume();
    if (!this.ctx) return;

    switch (sound) {
      case "navigate":
        // Crisp short blip — like moving a cursor in a menu
        this.tone(880, 0.05, "square", 0, 0.7);
        break;

      case "hover":
        // Ultra-soft tick — barely audible
        this.tone(1200, 0.02, "sine", 0, 0.3);
        break;

      case "select":
        // Ascending two-tone — "picked!"
        this.tone(660, 0.06, "square", 0, 0.6);
        this.tone(990, 0.08, "square", 0.06, 0.6);
        break;

      case "start":
        // Triumphant arpeggio — game start jingle
        this.tone(523, 0.08, "square", 0, 0.5);    // C5
        this.tone(659, 0.08, "square", 0.08, 0.5); // E5
        this.tone(784, 0.08, "square", 0.16, 0.5); // G5
        this.tone(1047, 0.16, "square", 0.24, 0.6); // C6
        break;

      case "back":
        // Descending tone — "going back"
        this.sweep(660, 220, 0.15, "square", 0, 0.5);
        break;

      case "coin":
        // Coin pickup — classic two-tone chime
        this.tone(988, 0.07, "square", 0, 0.5);    // B5
        this.tone(1319, 0.1, "square", 0.07, 0.5); // E6
        break;
    }
  }
}

/** Singleton — one engine shared across the arcade experience. */
export const arcadeSound = new ArcadeSoundEngine();
export type { SoundName };
