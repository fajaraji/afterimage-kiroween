import { RETURN_SCENE } from './haunting';
import type { Trace } from './trace';

const recordings = {
  chapel: '/audio/chapel.mp3',
  drawer: '/audio/archive-drawer.mp3',
  read: '/audio/index-read.mp3',
  hinge: '/audio/vault-hinge.mp3',
  voice: '/audio/apparition.mp3'
} as const;
type Clip = keyof typeof recordings;

export class CemeterySound {
  readonly context = new AudioContext();
  private readonly mix = this.context.createGain();
  private readonly bed = this.context.createGain();
  private readonly buffers = new Map<Clip, Promise<AudioBuffer | null>>();
  private ambience: AudioBufferSourceNode | null = null;
  private opening: Promise<boolean> | null = null;
  private effects: GainNode | null = null;
  private readonly active = new Set<AudioBufferSourceNode>();

  constructor() {
    this.mix.gain.value = 0.88;
    this.mix.connect(this.context.destination);
    this.bed.connect(this.mix);
    for (const name of Object.keys(recordings) as Clip[]) void this.load(name);
  }

  get hasAmbience() {
    return this.ambience !== null;
  }

  private load(clip: Clip) {
    const existing = this.buffers.get(clip);
    if (existing) return existing;
    const pending = fetch(recordings[clip])
      .then(async (response) => {
        if (!response.ok) throw Error('Recording unavailable');
        return this.context.decodeAudioData(await response.arrayBuffer());
      })
      .catch(() => {
        this.buffers.delete(clip);
        return null;
      });
    this.buffers.set(clip, pending);
    return pending;
  }

  enter(): Promise<boolean> {
    if (this.opening) return this.opening;
    this.opening = this.load('chapel').then((buffer) => {
      if (this.context.state === 'closed' || !buffer) {
        this.opening = null;
        return false;
      }
      const source = this.context.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(this.bed);
      source.start();
      this.ambience = source;
      return true;
    });
    return this.opening;
  }

  cancelCue() {
    this.effects?.disconnect();
    this.effects = null;
    for (const source of this.active) source.stop();
    this.active.clear();
    const now = this.context.currentTime;
    const gain = this.bed.gain;
    gain.cancelScheduledValues(now);
    gain.setTargetAtTime(1, now, 0.08);
  }

  private async sample(clip: Clip, bus: GainNode, when: number, pan = 0) {
    const buffer = await this.load(clip);
    if (!buffer || bus !== this.effects || this.context.state === 'closed') return;
    const now = this.context.currentTime;
    const offset = Math.max(0, now - when);
    if (offset >= buffer.duration) return;
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    const position = this.context.createStereoPanner();
    position.pan.value = pan;
    source.connect(position).connect(bus);
    this.active.add(source);
    source.onended = () => {
      this.active.delete(source);
      source.disconnect();
      position.disconnect();
    };
    source.start(Math.max(now, when), offset);
  }

  play(trace: Trace) {
    this.cancelCue();
    if (this.context.state !== 'running') return;
    const now = this.context.currentTime;
    const bus = this.context.createGain();
    this.effects = bus;
    bus.connect(this.mix);
    switch (trace.kind) {
      case 'seed':
      case 'erase':
        void this.sample('drawer', bus, now);
        break;
      case 'inspect':
        trace.targets.forEach((id, i) => {
          void this.sample('read', bus, now + i * 0.25, id === 'backup' || id === 'analytics' ? 0.4 : -0.4);
        });
        break;
      case 'restore': {
        if (!trace.source) break;
        const gain = this.bed.gain;
        gain.cancelScheduledValues(now);
        gain.setValueAtTime(gain.value, now);
        gain.linearRampToValueAtTime(0.07, now + 0.24);
        void this.sample('hinge', bus, now, 0.22);
        if (trace.confirmedReturn) void this.sample('voice', bus, now + RETURN_SCENE.voiceAt);
        gain.setTargetAtTime(1, now + (trace.confirmedReturn ? RETURN_SCENE.retreatAt : 1.6), 0.38);
        break;
      }
    }
  }

  close() {
    this.cancelCue();
    this.ambience?.stop();
    this.ambience = null;
    this.mix.disconnect();
    if (this.context.state !== 'closed') void this.context.close().catch(() => {});
  }
}
