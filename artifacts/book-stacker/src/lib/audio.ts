type Ctor = typeof AudioContext;
const AudioCtor: Ctor | undefined =
  typeof window !== "undefined"
    ? (window.AudioContext ?? (window as unknown as { webkitAudioContext?: Ctor }).webkitAudioContext)
    : undefined;

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private musicNodes: OscillatorNode[] = [];
  private musicLfo: OscillatorNode | null = null;
  private enabled = true;
  private musicEnabled = true;

  setEnabled(b: boolean) {
    this.enabled = b;
    if (!b) {
      this.stopMusic();
    } else if (this.musicEnabled) {
      this.startMusic();
    }
  }

  isEnabled() {
    return this.enabled;
  }

  /** Lazy-init on first user gesture. */
  private ensure(): AudioContext | null {
    if (!AudioCtor) return null;
    if (!this.ctx) {
      try {
        this.ctx = new AudioCtor();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.6;
        this.master.connect(this.ctx.destination);
      } catch {
        return null;
      }
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private blip(opts: {
    type?: OscillatorType;
    freq: number;
    endFreq?: number;
    duration: number;
    peak?: number;
    attack?: number;
  }) {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx || !this.master) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = opts.type ?? "sine";
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(opts.freq, now);
    if (opts.endFreq) {
      osc.frequency.exponentialRampToValueAtTime(opts.endFreq, now + opts.duration);
    }
    const peak = opts.peak ?? 0.18;
    const attack = opts.attack ?? 0.005;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(peak, now + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + opts.duration);
    osc.connect(gain).connect(this.master);
    osc.start(now);
    osc.stop(now + opts.duration + 0.05);
  }

  pick() {
    this.blip({ type: "triangle", freq: 520, endFreq: 320, duration: 0.10, peak: 0.10 });
  }

  place() {
    this.blip({ type: "sine", freq: 220, endFreq: 110, duration: 0.18, peak: 0.22 });
    // a soft second-voice "thump"
    this.blip({ type: "sine", freq: 70, duration: 0.18, peak: 0.10 });
  }

  invalid() {
    this.blip({ type: "sawtooth", freq: 130, endFreq: 90, duration: 0.18, peak: 0.10 });
  }

  perfect() {
    // small chime
    [880, 1175, 1568].forEach((f, i) => {
      setTimeout(() => this.blip({ type: "sine", freq: f, duration: 0.4, peak: 0.10 }), i * 70);
    });
  }

  win() {
    [392, 523, 659, 784].forEach((f, i) => {
      setTimeout(() => this.blip({ type: "triangle", freq: f, duration: 0.55, peak: 0.16 }), i * 110);
    });
  }

  lose() {
    this.blip({ type: "sine", freq: 330, endFreq: 110, duration: 0.6, peak: 0.18 });
  }

  startMusic() {
    if (!this.enabled || !this.musicEnabled) return;
    const ctx = this.ensure();
    if (!ctx || !this.master || this.musicNodes.length > 0) return;

    const musicGain = ctx.createGain();
    musicGain.gain.value = 0.0;
    musicGain.connect(this.master);
    musicGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 4);
    this.musicGain = musicGain;

    // A soft drone made of 3 sine partials forming a cozy minor 7th
    const freqs = [110, 165, 196, 247];
    freqs.forEach((f) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.18;
      osc.connect(g).connect(musicGain);
      osc.start();
      this.musicNodes.push(osc);
    });

    // Slow LFO to gently swell volume — like breathing
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.025;
    lfo.connect(lfoGain).connect(musicGain.gain);
    lfo.start();
    this.musicLfo = lfo;
  }

  stopMusic() {
    if (!this.ctx || this.musicNodes.length === 0) return;
    const t = this.ctx.currentTime;
    if (this.musicGain) {
      this.musicGain.gain.cancelScheduledValues(t);
      this.musicGain.gain.linearRampToValueAtTime(0, t + 0.6);
    }
    const stopAt = t + 0.7;
    this.musicNodes.forEach((o) => {
      try { o.stop(stopAt); } catch { /* */ }
    });
    if (this.musicLfo) {
      try { this.musicLfo.stop(stopAt); } catch { /* */ }
    }
    this.musicNodes = [];
    this.musicLfo = null;
    this.musicGain = null;
  }
}

export const audio = new AudioEngine();
