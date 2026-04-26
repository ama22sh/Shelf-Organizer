type Ctor = typeof AudioContext;
const AudioCtor: Ctor | undefined =
  typeof window !== "undefined"
    ? (window.AudioContext ??
        (window as unknown as { webkitAudioContext?: Ctor }).webkitAudioContext)
    : undefined;

/**
 * Cozy library audio engine.
 * - Pure Web Audio synthesis, no external assets.
 * - Music: drone of stacked sine partials + a slow random pentatonic
 *   pluck melody, gentle reverb, LFO breathing.
 * - SFX: pickup, place, invalid, click, perfect, win, lose. Win/lose
 *   briefly duck the music bus so the cue is unmissable.
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
        this.sfxGain.gain.value = 0.95;
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
    const peak = opts.peak ?? 0.18;
    const attack = opts.attack ?? 0.005;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(peak, now + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + opts.duration);
    osc.connect(gain).connect(dest);
    osc.start(now);
    osc.stop(now + opts.duration + 0.05);
  }

  /** Briefly duck the music bus so a stinger can be heard clearly. */
  private duckMusic(durationSec = 1.6) {
    if (!this.ctx || !this.musicGain) return;
    const t = this.ctx.currentTime;
    const g = this.musicGain.gain;
    const current = g.value;
    g.cancelScheduledValues(t);
    g.setValueAtTime(current, t);
    g.linearRampToValueAtTime(current * 0.18, t + 0.08);
    g.linearRampToValueAtTime(current, t + durationSec);
  }

  /* -------- Sound effects -------- */

  /** Soft UI click — used for buttons and toggles. */
  click() {
    // Very short, low-volume tick so it doesn't get tiring.
    this.envBlip({
      type: "triangle",
      freq: 1400,
      endFreq: 900,
      duration: 0.045,
      peak: 0.06,
      attack: 0.001,
    });
  }

  pick() {
    // Very gentle "page lift" — one short soft sine, no high transient.
    this.envBlip({
      type: "sine",
      freq: 480,
      endFreq: 360,
      duration: 0.09,
      peak: 0.07,
    });
  }

  place() {
    // Soft wooden touch — low sine fundamental, no click transient.
    this.envBlip({
      type: "sine",
      freq: 200,
      endFreq: 120,
      duration: 0.18,
      peak: 0.14,
    });
    this.envBlip({
      type: "sine",
      freq: 90,
      duration: 0.20,
      peak: 0.08,
    });
  }

  invalid() {
    this.envBlip({
      type: "sawtooth",
      freq: 150,
      endFreq: 95,
      duration: 0.18,
      peak: 0.10,
    });
  }

  perfect() {
    [880, 1175, 1568].forEach((f, i) => {
      setTimeout(
        () =>
          this.envBlip({
            type: "sine",
            freq: f,
            duration: 0.45,
            peak: 0.15,
          }),
        i * 70,
      );
    });
  }

  win() {
    // Triumphant arpeggio + a sustained chord — duck music briefly.
    this.duckMusic(2.4);
    const arp = [392, 523, 659, 784, 988];
    arp.forEach((f, i) => {
      setTimeout(() => {
        this.envBlip({
          type: "triangle",
          freq: f,
          duration: 0.55,
          peak: 0.32,
        });
        this.envBlip({
          type: "sine",
          freq: f * 2,
          duration: 0.55,
          peak: 0.10,
        });
      }, i * 110);
    });
    // Sustained sparkle chord at the end
    setTimeout(() => {
      [523, 659, 988].forEach((f) => {
        this.envBlip({
          type: "sine",
          freq: f,
          duration: 1.2,
          peak: 0.16,
        });
      });
    }, arp.length * 110);
  }

  lose() {
    // Sad, gentle descending figure with a low rumble underneath.
    this.duckMusic(2.0);
    const fall = [392, 330, 277, 220];
    fall.forEach((f, i) => {
      setTimeout(() => {
        this.envBlip({
          type: "triangle",
          freq: f,
          duration: 0.5,
          peak: 0.26,
        });
      }, i * 150);
    });
    // Low rumble underneath
    this.envBlip({
      type: "sine",
      freq: 80,
      endFreq: 55,
      duration: 1.6,
      peak: 0.18,
    });
  }

  /* -------- Background music -------- */

  startMusic() {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx || !this.master || this.musicNodes.length > 0) return;

    const musicGain = ctx.createGain();
    musicGain.gain.value = 0.0;
    musicGain.connect(this.master);
    musicGain.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 4);
    this.musicGain = musicGain;

    const reverb = ctx.createConvolver();
    reverb.buffer = this.makeImpulse(ctx, 1.8, 2.2);
    const reverbGain = ctx.createGain();
    reverbGain.gain.value = 0.35;
    reverb.connect(reverbGain).connect(musicGain);
    this.musicReverb = reverb;

    const droneFreqs = [110, 165, 220, 261.63];
    const droneGains = [0.12, 0.09, 0.07, 0.05];
    droneFreqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = droneGains[i];
      osc.detune.value = (i - 1.5) * 4;
      osc.connect(g).connect(musicGain);
      osc.start();
      this.musicNodes.push(osc);
    });

    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.12;
    lfo.connect(lfoGain).connect(musicGain.gain);
    lfo.start();
    this.musicLfo = lfo;

    this.scheduleMelody(ctx, musicGain, reverb);
  }

  private scheduleMelody(
    ctx: AudioContext,
    bus: GainNode,
    reverb: ConvolverNode,
  ) {
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
