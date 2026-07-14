
export type SfxType =
  | 'hover'
  | 'click'
  | 'open'
  | 'close'
  | 'toggle'
  | 'transition'
  | 'success'
  | 'error';

/**
 * Immersive audio engine built on the Web Audio API.
 * - Ambient pad + wind bed (routed through a music bus)
 * - Short synthesized UI sound effects (hover, click, open, close, toggle, transition, success, error)
 * - Master mute + volume control
 * - Fully resilient to autoplay policies (context resumes on first user gesture)
 * - No external libraries, no assets
 */
class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private ambientStop: (() => void) | null = null;
  private muted = false;
  private volume = 0.6;
  private hoverThrottle = 0;

  private ensure(): boolean {
    if (this.ctx) return true;
    const AC: typeof AudioContext =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AC) return false;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : this.volume;
    this.master.connect(this.ctx.destination);
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.5;
    this.musicGain.connect(this.master);
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.7;
    this.sfxGain.connect(this.master);
    return true;
  }

  resume() {
    if (this.ensure() && this.ctx!.state === 'suspended') {
      this.ctx!.resume().catch(() => {});
    }
  }

  applyState(state: { muted: boolean; volume: number }) {
    this.muted = state.muted;
    this.volume = state.volume;
    if (this.master && this.ctx) {
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.setTargetAtTime(state.muted ? 0 : state.volume, t, 0.05);
    }
  }

  setAmbient(on: boolean) {
    this.resume();
    if (!this.ensure() || !this.ctx || !this.musicGain) return;
    if (on) {
      if (this.ambientStop) return;
      const t = this.ctx.currentTime;
      this.musicGain.gain.cancelScheduledValues(t);
      this.musicGain.gain.setTargetAtTime(0.5, t, 0.4);
      this.ambientStop = this.buildAmbient();
    } else {
      if (!this.ambientStop) return;
      const stop = this.ambientStop;
      this.ambientStop = null;
      const t = this.ctx.currentTime;
      this.musicGain.gain.cancelScheduledValues(t);
      this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, t);
      this.musicGain.gain.linearRampToValueAtTime(0.0001, t + 0.8);
      window.setTimeout(() => stop(), 900);
    }
  }

  isAmbientOn(): boolean {
    return !!this.ambientStop;
  }

  playSfx(type: SfxType) {
    if (this.muted || this.volume <= 0.001) return;
    this.resume();
    if (!this.ensure() || !this.ctx || !this.sfxGain) return;
    const now = performance.now();
    if (type === 'hover') {
      if (now - this.hoverThrottle < 55) return;
      this.hoverThrottle = now;
    }
    switch (type) {
      case 'hover':
        this.tone({ freq: 880, dur: 0.06, type: 'sine', gain: 0.05 });
        break;
      case 'click':
        this.tone({ freq: 420, dur: 0.09, type: 'triangle', gain: 0.12, slideTo: 660 });
        break;
      case 'open':
        this.tone({ freq: 280, dur: 0.28, type: 'sawtooth', gain: 0.08, slideTo: 760 });
        this.noiseSweep(0.3, 0.06);
        break;
      case 'close':
        this.tone({ freq: 640, dur: 0.22, type: 'sawtooth', gain: 0.08, slideTo: 220 });
        break;
      case 'toggle':
        this.tone({ freq: 520, dur: 0.05, type: 'square', gain: 0.07 });
        this.tone({ freq: 780, dur: 0.06, type: 'square', gain: 0.07, delay: 0.06 });
        break;
      case 'transition':
        this.noiseSweep(0.5, 0.1);
        break;
      case 'success':
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
          this.tone({ freq: f, dur: 0.18, type: 'sine', gain: 0.1, delay: i * 0.09 })
        );
        break;
      case 'error':
        this.tone({ freq: 160, dur: 0.25, type: 'sawtooth', gain: 0.1, slideTo: 120 });
        break;
    }
  }

  private tone(o: {
    freq: number;
    dur: number;
    type: OscillatorType;
    gain: number;
    slideTo?: number;
    delay?: number;
  }) {
    const ctx = this.ctx!;
    const t0 = ctx.currentTime + (o.delay ?? 0);
    const osc = ctx.createOscillator();
    osc.type = o.type;
    osc.frequency.setValueAtTime(o.freq, t0);
    if (o.slideTo) osc.frequency.exponentialRampToValueAtTime(o.slideTo, t0 + o.dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(o.gain, t0 + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);
    osc.connect(g);
    g.connect(this.sfxGain!);
    osc.start(t0);
    osc.stop(t0 + o.dur + 0.03);
  }

  private noiseSweep(dur: number, gain: number) {
    const ctx = this.ctx!;
    const t0 = ctx.currentTime;
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.Q.value = 0.7;
    f.frequency.setValueAtTime(400, t0);
    f.frequency.exponentialRampToValueAtTime(3200, t0 + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f);
    f.connect(g);
    g.connect(this.sfxGain!);
    src.start(t0);
    src.stop(t0 + dur);
  }

  private buildAmbient(): () => void {
    const ctx = this.ctx!;
    const nodes: { stop: () => void }[] = [];
    const CHORD = [130.81, 164.81, 196.0, 261.63, 329.63];
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1400;
    filter.Q.value = 0.6;
    filter.connect(this.musicGain!);

    CHORD.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.value = 0.1;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.04 + i * 0.017;
      const lfoG = ctx.createGain();
      lfoG.gain.value = 0.05;
      lfo.connect(lfoG);
      lfoG.connect(g.gain);
      osc.connect(g);
      g.connect(filter);
      osc.start();
      lfo.start();
      nodes.push({
        stop: () => {
          try {
            osc.stop();
            lfo.stop();
          } catch {
            /* already stopped */
          }
        },
      });
    });

    const size = 2 * ctx.sampleRate;
    const buf = ctx.createBuffer(1, size, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < size; i++) d[i] = (Math.random() * 2 - 1) * 0.4;
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;
    const nf = ctx.createBiquadFilter();
    nf.type = 'bandpass';
    nf.frequency.value = 700;
    nf.Q.value = 0.8;
    const ng = ctx.createGain();
    ng.gain.value = 0.05;
    noise.connect(nf);
    nf.connect(ng);
    ng.connect(filter);
    noise.start();
    nodes.push({ stop: () => { try { noise.stop(); } catch { /* noop */ } } });

    return () => {
      nodes.forEach((n) => n.stop());
    };
  }
}

export const audio = new AudioEngine();
