import type { Trace } from './trace';

// All audio is synthesized locally. A single output bus feeds the browser's speakers.
export class CemeterySound {
  readonly context = new AudioContext();
  private readonly mix = this.context.createGain();
  private readonly air: AudioBuffer;
  private effects: GainNode | null = null;

  constructor() {
    const ctx = this.context;
    this.mix.gain.value = 0.72;
    this.mix.connect(ctx.destination);
    this.air = ctx.createBuffer(1, Math.round(ctx.sampleRate * 3), ctx.sampleRate);
    const samples = this.air.getChannelData(0);
    for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;

    const wind = ctx.createBufferSource();
    wind.buffer = this.air;
    wind.loop = true;
    const reeds = ctx.createBiquadFilter();
    reeds.type = 'bandpass';
    reeds.frequency.value = 620;
    reeds.Q.value = 0.75;
    const breeze = ctx.createGain();
    breeze.gain.value = 0.22;
    wind.connect(reeds).connect(breeze).connect(this.mix);
    const drift = ctx.createOscillator();
    const driftDepth = ctx.createGain();
    drift.frequency.value = 0.11;
    driftDepth.gain.value = 225;
    drift.connect(driftDepth).connect(reeds.frequency);
    wind.start();
    drift.start();

    // A bowed fifth gives small speakers audible harmonics above the bass.
    for (const [frequency, level] of [
      [146.83, 0.073],
      [220.7, 0.043]
    ]) {
      const string = ctx.createOscillator();
      const gain = ctx.createGain();
      string.type = 'triangle';
      string.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.setTargetAtTime(level, ctx.currentTime + 0.01, 0.28);
      string.connect(gain).connect(this.mix);
      string.start();
    }
  }

  cancelCue() {
    this.effects?.disconnect();
    this.effects = null;
  }

  private cueBus() {
    this.cancelCue();
    this.effects = this.context.createGain();
    this.effects.connect(this.mix);
    return this.effects;
  }

  private tone(
    bus: AudioNode,
    wave: OscillatorType,
    at: number,
    from: number,
    to: number,
    duration: number,
    level: number,
    attack = 0.025
  ) {
    const ctx = this.context;
    const voice = ctx.createOscillator();
    const volume = ctx.createGain();
    voice.type = wave;
    voice.frequency.setValueAtTime(from, at);
    voice.frequency.exponentialRampToValueAtTime(to, at + duration);
    volume.gain.setValueAtTime(0.0001, at);
    volume.gain.exponentialRampToValueAtTime(level, at + attack);
    volume.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    voice.connect(volume).connect(bus);
    voice.onended = () => {
      voice.disconnect();
      volume.disconnect();
    };
    voice.start(at);
    voice.stop(at + duration + 0.02);
  }

  private scrape(bus: AudioNode, at: number, from: number, to: number, duration: number, level: number) {
    const ctx = this.context;
    const noise = ctx.createBufferSource();
    noise.buffer = this.air;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 1.8;
    filter.frequency.setValueAtTime(from, at);
    filter.frequency.exponentialRampToValueAtTime(to, at + duration);
    const volume = ctx.createGain();
    volume.gain.setValueAtTime(0.0001, at);
    volume.gain.linearRampToValueAtTime(level, at + 0.075);
    volume.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    noise.connect(filter).connect(volume).connect(bus);
    noise.onended = () => {
      noise.disconnect();
      filter.disconnect();
      volume.disconnect();
    };
    noise.start(at);
    noise.stop(at + duration);
  }

  private bell(bus: AudioNode, at: number, pitch: number, level: number) {
    this.tone(bus, 'sine', at, pitch, pitch * 0.993, 1.65, level, 0.012);
    this.tone(bus, 'sine', at, pitch * 2.43, pitch * 2.41, 0.95, level * 0.5, 0.009);
    this.tone(bus, 'sine', at + 0.16, pitch * 3.72, pitch * 3.7, 0.72, level * 0.17);
  }

  enter() {
    const bus = this.cueBus(),
      at = this.context.currentTime + 0.015;
    this.scrape(bus, at, 490, 1340, 0.72, 0.55);
    this.bell(bus, at + 0.12, 233.08, 0.32);
  }

  play(trace: Trace) {
    if (this.context.state !== 'running') return;
    const bus = this.cueBus(),
      at = this.context.currentTime + 0.015;
    switch (trace.kind) {
      case 'seed':
        this.bell(bus, at, 233.08, 0.24);
        break;
      case 'erase':
        this.scrape(bus, at, 1380, 245, 0.71, 0.65);
        this.tone(bus, 'triangle', at + 0.33, 170, 72, 0.54, 0.33);
        break;
      case 'inspect':
        trace.targets.forEach((_, i) => {
          const hit = at + i * 0.25,
            pitch = 466.16 + i * 55;
          this.tone(bus, 'sine', hit, pitch, pitch * 1.09, 0.48, 0.24, 0.014);
          this.tone(bus, 'sine', hit + 0.06, pitch * 1.5, pitch * 1.48, 0.38, 0.085);
        });
        break;
      case 'restore':
        if (trace.source) {
          this.scrape(bus, at, 315, 1540, 0.97, 0.74);
          this.tone(bus, 'triangle', at + 0.12, 125, 258, 0.82, 0.22, 0.14);
        }
        if (trace.confirmedReturn) {
          // The grave splits at 1.38s. A failed verification only sounds the gate.
          const rise = at + 1.38;
          this.tone(bus, 'sine', rise, 277, 494, 0.96, 0.29, 0.21);
          this.tone(bus, 'triangle', rise + 0.055, 285, 510, 0.89, 0.16, 0.24);
          this.bell(bus, rise + 0.32, 185, 0.25);
        }
        break;
    }
  }

  close() {
    this.cancelCue();
    this.mix.disconnect();
    if (this.context.state !== 'closed') void this.context.close().catch(() => {});
  }
}
