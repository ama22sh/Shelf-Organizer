type Ctor = typeof AudioContext;
const AudioCtor: Ctor | undefined =
  typeof window !== "undefined"
    ? (window.AudioContext ??
        (window as unknown as { webkitAudioContext?: Ctor }).webkitAudioContext)
    : undefined;

/**
 * Cozy library audio engine.
 *
 * - Pure Web Audio synthesis, no external assets.
 * - Music: a slow drone of stacked sine partials + a gentle pentatonic
 *   pluck melody on a slow random schedule. LFO swells the master gain
 *   so it "breathes" like a fireplace room.
 * - SFX: pickup, place (valid), invalid, perfect chime, win arpeggio,
 *   lose tone. Each call resumes the audio context if needed (browsers
 *   auto-suspend until first user gesture).
 */
class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private musicReverb: ConvolverNode | null = null;
  private musicNodes: OscillatorNode[] = [];
  private musicLfo: OscillatorNode | null = null;
  private melodyTimer: number | null = null;
  private enabled = true;

  setEnabled(b: boolean) {
    this.enabled = b;
    if (!b) {
      this.stopMusic();
      if (this.master) this.master.gain.value = 0;
    } else {
      if (this.master) this.master.gain.value = 0.85;
      this.startMusic();
    }
  }

  isEnabled() {
    return this.enabled;
  }

  /** Lazy-init on first user gesture. Always tries to resume. */
  private ensure(): AudioContext | null {
    if (!AudioCtor) return null;
    if (!this.ctx) {
      try {
        this.ctx = new AudioCtor();
        this.master = this.ctx.createGain();
        this.master.gain.value = this.enabled ? 0.85 : 0;
        this.master.connect(this.ctx.destination);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.value = 0.9;
        this.sfxGain.connect(this.master);
      } catch {
        return null;
      }
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private envBlip(opts: {
    type?: OscillatorType;
    freq: number;
    endFreq?: number;
    duration: number;
    peak?: number;
    attack?: number;
    target?: AudioNode;
  }) {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx || !this.sfxGain) return;
    const dest = opts.target ?? this.sfxGain;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = opts.type ?? "sine";
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(opts.freq, now);
    if (opts.endFreq) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(20, opts.endFreq),
        now + opts.duration,
      );
    }
    const peak = opts.peak ?? 0.22;
    const attack = opts.attack ?? 0.005;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(peak, now + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + opts.duration);
    osc.connect(gain).connect(dest);
    osc.start(now);
    osc.stop(now + opts.duration + 0.05);
  }

  /* -------- Sound effects -------- */

  pick() {
    // Soft "page-turn pluck": triangle wave that gently sweeps down.
    this.envBlip({ type: "triangle", freq: 620, endFreq: 380, duration: 0.12, peak: 0.18 });
    this.envBlip({ type: "sine", freq: 1240, duration: 0.07, peak: 0.06 });
  }

  place() {
    // Wooden "thump" — low sine fundamental + click transient
    this.envBlip({ type: "sine", freq: 240, endFreq: 110, duration: 0.22, peak: 0.32 });
    this.envBlip({ type: "sine", freq: 70, duration: 0.25, peak: 0.18 });
    this.envBlip({ type: "triangle", freq: 1800, endFreq: 600, duration: 0.05, peak: 0.06, attack: 0.001 });
  }

  invalid() {
    this.envBlip({ type: "sawtooth", freq: 150, endFreq: 95, duration: 0.22, peak: 0.14 });
    this.envBlip({ type: "square", freq: 90, duration: 0.18, peak: 0.06 });
  }

  perfect() {
    [880, 1175, 1568].forEach((f, i) => {
      setTimeout(
        () => this.envBlip({ type: "sine", freq: f, duration: 0.45, peak: 0.18 }),
        i * 70,
      );
    });
  }

  win() {
    [392, 523, 659, 784, 988].forEach((f, i) => {
      setTimeout(
        () => this.envBlip({ type: "triangle", freq: f, duration: 0.6, peak: 0.22 }),
        i * 110,
      );
    });
  }

  lose() {
    [330, 247, 196, 165].forEach((f, i) => {
      setTimeout(
        () => this.envBlip({ type: "sine", freq: f, duration: 0.5, peak: 0.18 }),
        i * 130,
      );
    });
  }

  /* -------- Background music -------- */

  startMusic() {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx || !this.master || this.musicNodes.length > 0) return;

    // Music bus
    const musicGain = ctx.createGain();
    musicGain.gain.value = 0.0;
    musicGain.connect(this.master);
    musicGain.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 4);
    this.musicGain = musicGain;

    // A simple synthesized reverb tail (impulse buffer)
    const reverb = ctx.createConvolver();
    reverb.buffer = this.makeImpulse(ctx, 1.8, 2.2);
    const reverbGain = ctx.createGain();
    reverbGain.gain.value = 0.35;
    reverb.connect(reverbGain).connect(musicGain);
    this.musicReverb = reverb;

    // Drone: cozy A minor — A2, E3, A3, C4
    const droneFreqs = [110, 165, 220, 261.63];
    const droneGains = [0.12, 0.09, 0.07, 0.05];
    droneFreqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = droneGains[i];
      // gentle detune to thicken
      osc.detune.value = (i - 1.5) * 4;
      osc.connect(g).connect(musicGain);
      osc.start();
      this.musicNodes.push(osc);
    });

    // Slow LFO breathing on the music bus gain
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.12;
    lfo.connect(lfoGain).connect(musicGain.gain);
    lfo.start();
    this.musicLfo = lfo;

    // Pluck melody — gentle pentatonic notes at random intervals
    this.scheduleMelody(ctx, musicGain, reverb);
  }

  private scheduleMelody(
    ctx: AudioContext,
    bus: GainNode,
    reverb: ConvolverNode,
  ) {
    // A minor pentatonic in two octaves: A C D E G
    const scale = [220, 261.63, 293.66, 329.63, 392, 440, 523.25, 587.33];
    const playOne = () => {
      if (this.musicNodes.length === 0 || !this.enabled) return;
      const f = scale[Math.floor(Math.random() * scale.length)];
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = f;
      const g = ctx.createGain();
      const dur = 1.2 + Math.random() * 1.4;
      const peak = 0.07 + Math.random() * 0.05;
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(peak, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      // A bit of warm low-pass via biquad
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 1600;
      osc.connect(g).connect(lp);
      lp.connect(bus);
      lp.connect(reverb);
      osc.start(now);
      osc.stop(now + dur + 0.1);

      const next = 1500 + Math.random() * 3500;
      this.melodyTimer = window.setTimeout(playOne, next);
    };
    // First note shortly after fade-in starts
    this.melodyTimer = window.setTimeout(playOne, 1500);
  }

  private makeImpulse(ctx: AudioContext, seconds: number, decay: number) {
    const rate = ctx.sampleRate;
    const length = Math.max(1, Math.floor(rate * seconds));
    const buffer = ctx.createBuffer(2, length, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    return buffer;
  }

  stopMusic() {
    if (this.melodyTimer != null) {
      clearTimeout(this.melodyTimer);
      this.melodyTimer = null;
    }
    if (!this.ctx || this.musicNodes.length === 0) return;
    const t = this.ctx.currentTime;
    if (this.musicGain) {
      this.musicGain.gain.cancelScheduledValues(t);
      this.musicGain.gain.linearRampToValueAtTime(0, t + 0.6);
    }
    const stopAt = t + 0.7;
    this.musicNodes.forEach((o) => {
      try {
        o.stop(stopAt);
      } catch {
        /* */
      }
    });
    if (this.musicLfo) {
      try {
        this.musicLfo.stop(stopAt);
      } catch {
        /* */
      }
    }
    this.musicNodes = [];
    this.musicLfo = null;
    this.musicGain = null;
    this.musicReverb = null;
  }
}

export const audio = new AudioEngine();
